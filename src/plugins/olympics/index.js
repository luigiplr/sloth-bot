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
var medalsCount = {}
var oldMedalsCount = {}

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
      topMedals: data.slice(0, 15)
    }

    out.padding = out.topMedals.slice(0).sort((a, b) => {
      return b.name.length - a.name.length;
    })[0].name.length + 1

    oldMedalsCount = medalsCount
    _.forEach(data, cnt => medalsCount[cnt.name] = cnt.total)

    medalsCache = out
    return resolve(out)
  })
}

const _getDetailedMedals = cid => {
  return new Promise((resolve, reject) => {
    needle.get(olympics.api.countryMedals + cid, (err, resp, body) => {
      if (!err && body) {
        _formatDetailedMedals(_.get(body, 'body.countriesMedals', undefined)).then(resolve, reject)
      } else return reject("Error fetching detailed stats")
    })
  })
}

const _formatDetailedMedals = data => {
  return new Promise((resolve, reject) => {
    if (!data) return reject('Error fetching detailed stats')
    let out = { bronze: [], silver: [], gold: [], total: 0 }
    _.forEach(_.concat([], data.bronzeList, data.goldList, data.silverList), ({ medal_code, document_code: sport }) => {
      out.total++;
      let type = medal_code.substring(3).toLowerCase()
      out[type].push(olympics.sports[sport.slice(0, 2)])
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
        data.topMedals.forEach(({ name, total, gold, silver, bronze }) => {
          if (!total) return
          let msg = `${name}: ${new Array(data.padding - name.length).join(' ')}Total: ${total} | Bronze: ${bronze} | Silver: ${silver} | Gold: ${gold}`
          if (oldMedalsCount && oldMedalsCount[name] != total) {
            let newCount = total - oldMedalsCount[name]
            newTotal = newTotal + newCount
            out.push(`${msg} (+${newCount})`)
          } else out.push(msg)
        })
        out.push('```')
        if (newTotal) out.push(`_${newTotal} new medal${newTotal.length > 1 ? 's have' : ' has'} been recorded since my last update_`)
        out.push(minsTillUpdate > 1 ? `_Data updates in ${minsTillUpdate} minutes_` : `_Data will update in less than a minute_`)
        return resolve({ type: 'channel', messages: out })
      }).catch(reject)
    } else {
      let country = undefined
      if (input.length == '3' && input.toUpperCase() in olympics.countryCodes) country = input.toUpperCase()
      else if (input.toLowerCase() in olympics.countryNames) country = olympics.countryNames[input.toLowerCase()]
      else return reject("Couldn't find a valid country matching input")

      _getDetailedMedals(country).then(({ bronze, silver, gold, total }) => {
        console.log(bronze, silver, gold, total)
        if (!total) return reject('I have no medals recorded for this country')
        let attachment = {
          msg: `*Olympic Medal Statistics for ${olympics.countryCodes[country]}*`,
          attachments: [{
            "fallback": `Medal Stats for ${olympics.countryCodes[country]} - Total: ${total} | Bronze: ${bronze.length} | Silver: ${silver.length} | Gold: ${gold.length}`,
            "mrkdwn_in": ["text", "fields"],
            "color": "#43a047",
            "fields": _.filter([{
              "title": "Total",
              "value": `:totalmedals: *${total}*`
            }, {
              "title": "Bronze",
              "value": bronze.length ? `:bronzemedal: *${bronze.length}* \n ${bronze.map(m => '- _' + m + '_').join('\n')}` : null
            }, {
              "title": "Silver",
              "value": silver.length ? `:silvermedal: *${silver.length}* \n ${silver.map(m => '- _' + m + '_').join('\n')}` : null
            }, {
              "title": "Gold",
              "value": gold.length ? `:goldmedal: *${gold.length}* \n ${gold.map(m => '- _' + m + '_').join('\n')}` : null
            }], 'value')
          }]
        }
        return resolve({ type: 'channel', message: attachment })
      })
    }
  })
}
