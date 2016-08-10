import Promise from 'bluebird'
import _ from 'lodash'
import needle from 'needle'
import moment from 'moment'
import olympics from './utils/olympics'

export const plugin_info = [{
  alias: ['medals', 'olympics'],
  command: 'medals',
  usage: 'medals [country] - returns olympic medal stats'
}, {
  alias: ['listcountries'],
  command: 'listcountries'
}]

var medalsCache = undefined
var nextUpdate = undefined
var MC = undefined
var OMC = undefined

// Fetches medals from unofficial API that updates are set intervals,
// return cached data until next update occurs
const _getMedals = () => {
  return new Promise((resolve, reject) => {
    if (medalsCache && nextUpdate && moment().isBefore(nextUpdate)) return resolve(medalsCache)
    needle.get(olympics.api.medals, (err, resp, body) => {
      if (!err && body) {
        nextUpdate = moment(body.nextUpdate)
        _formatMedalsData(body.medals).then(resolve)
      } else return reject("Error fetching stats")
    })
  })
}

const _formatMedalsData = data => {
  return new Promise(resolve => {
    let out = {
      padding: 0,
      topMedals: _.orderBy(data.slice(0, 15), ['gold', 'silver'], ['desc', 'desc'])
    }

    // Determine longest country name to properly space the table out so it looks nice :))
    out.padding = out.topMedals.slice(0).sort((a, b) => {
      return b.name.length - a.name.length;
    })[0].name.length + 1

    // Update medal counts on each update to see what changed
    OMC = MC
    MC = {}
    _.forEach(data, cnt => MC[cnt.name] = cnt)

    medalsCache = out
    return resolve(out)
  })
}

// Fetches detailed medal statistics including medals per sport
const _getDetailedMedals = cid => {
  return new Promise((resolve, reject) => {
    needle.get(olympics.api.countryMedals + cid, (err, resp, body) => {
      if (!err && body) {
        _formatDetailedMedals(_.get(body, 'body.countriesMedals', undefined)).then(resolve, reject)
      } else return reject("Error fetching detailed stats")
    })
  })
}

// Returns usable data
const _formatDetailedMedals = data => {
  return new Promise((resolve, reject) => {
    if (!data) return reject('Error fetching detailed stats')
    let out = { bronze: {}, silver: {}, gold: {}, total: 0 }
    _.forEach(_.concat([], data.bronzeList, data.goldList, data.silverList), ({ medal_code, document_code: sportCode }) => {
      out.total++;
      let type = medal_code.substring(3).toLowerCase() // remove ME_
      let sportID = sportCode.slice(0, 2)
      let sport = olympics.sports[sportID.slice(0, 2)]

      if (out[type][sportID]) out[type][sportID].count++;
      else out[type][sportID] = { name: sport, count: 1 }
    })
    return resolve(out)
  })
}

export function medals(user, channel, input = 'all') {
  return new Promise((resolve, reject) => {
    if (input == 'all') {
      _getMedals().then(data => {
        let minsTillUpdate = nextUpdate.diff(moment(), 'minutes')
        let out = ['*Top 15 countries sorted by Gold Medals* ```']
        let newTotal = 0

        _.forEach(data.topMedals, ({ name, total, gold, silver, bronze }) => {
          if (!total) return
          let msg = `${name}: ${_.fill(Array(data.padding - name.length)).join(' ')}Total: ${total} | Bronze: ${bronze} | Silver: ${silver} | Gold: ${gold}`

          // Close your eyes
          if (_.get(OMC, `${name}.total`, Infinity) < total) {
            let newCount = total - OMC[name].total
            let newGold = gold - OMC[name].gold
            let newSilver = silver - OMC[name].silver
            let newBronze = bronze - OMC[name].bronze
            newTotal = newTotal + newCount

            let newMsg = (newGold ? `+${newGold}G` : '') + (newSilver ? ` +${newSilver}S` : '') + (newBronze ? ` +${newBronze}B` : '')
            out.push(`${msg} (${newMsg})`)
          } else out.push(msg)
        })
        out.push('```')
        if (newTotal) out.push(`_${newTotal} new medal${newTotal.length > 1 ? 's have' : ' has'} been recorded since my last update_`)
        out.push(minsTillUpdate > 1 ? `_Data updates in ${minsTillUpdate} minutes_` : `_Data will update in less than a minute_`)
        return resolve({ type: 'channel', messages: out })
      }).catch(reject)
    } else {
      let countryCode = undefined
      if (input.length == '3' && input.toUpperCase() in olympics.countryCodes) countryCode = input.toUpperCase()
      else if (input.toLowerCase() in olympics.countryNames) countryCode = olympics.countryNames[input.toLowerCase()]
      else countryCode = _.find(olympics.countryNames, (value, key) => {
        return key.includes(input.toLowerCase())
      })

      if (!countryCode) return reject("Couldn't find a valid country resembling input")

      _getDetailedMedals(countryCode).then(({ bronze, silver, gold, total }) => {
        let country = olympics.countryCodes[countryCode]
        if (!country) return reject(`Error fetching country details for ${countryCode}`)
        if (!total) return reject(`I have no medals recorded for ${country.name}`)
        let attachment = {
          msg: `*Olympic Medal Statistics for ${country.name}*`,
          attachments: [{
            "fallback": `Medal Stats for ${country.name} - Total: ${total} | Bronze: ${bronze.length} | Silver: ${silver.length} | Gold: ${gold.length}`,
            "mrkdwn_in": ["text", "fields"],
            "thumb_url": country.flag,
            "color": "#43a047",
            "fields": _.filter([{
              "title": "Total",
              "value": `:totalmedals: *${total}*`
            }, {
              "title": "Bronze",
              "value": !_.isEmpty(bronze) ? `:bronzemedal: *${Object.keys(bronze).length}* \n ${_.map(bronze, m => {
                return m.name + (m.count > 1 ? ' x' + m.count : '')
              }).sort().join('\n')}` : null,
              "short": true
            }, {
              "title": "Silver",
              "value": !_.isEmpty(silver) ? `:silvermedal: *${Object.keys(silver).length}* \n ${_.map(silver, m => {
                return m.name + (m.count > 1 ? ' x' + m.count : '')
              }).sort().join('\n')}` : null,
              "short": true
            }, {
              "title": "Gold",
              "value": !_.isEmpty(gold) ? `:goldmedal: *${Object.keys(gold).length}* \n ${_.map(gold, m => {
                return m.name + (m.count > 1 ? ' x' + m.count : '')
              }).sort().join('\n')}` : null
            }], 'value')
          }]
        }
        return resolve({ type: 'channel', message: attachment })
      }).catch(reject)
    }
  })
}
