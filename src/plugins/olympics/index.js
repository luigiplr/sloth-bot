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

const _getMedals = () => {
  return new Promise((resolve, reject) => {
    if (medalsCache && nextUpdate && nextUpdate.diff(moment(), 'minutes') != 0) return resolve(medalsCache)
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
      topMedals: []
    }
    out.topMedals = _.reverse(_.sortBy(data, 'total')).slice(0, 10)
    out.padding = out.topMedals.slice(0).sort((a, b) => {
      return b.name.length - a.name.length;
    })[0].name.length + 1

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
  console.log(data)
  return new Promise((resolve, reject) => {
    if (!data) return reject('Error fetching detailed stats')
    let out = { bronze: [], silver: [], gold: [], total: 0 }
    _.forEach(_.concat([], data.bronzeList, data.goldList, data.silverList), ({ medal_code, document_code: sport }) => {
      out.total++;
      let type = medal_code.substring(3).toLowerCase()
      out[type].push(olympics.sports[sport.slice(0, 2)])
      console.log(out)
    })
    return resolve(out)
  })
}

export function medals(user, channel, input = 'all') {
  return new Promise((resolve, reject) => {
    if (input == 'all') {
      _getMedals().then(data => {
        let minsTillUpdate = nextUpdate.diff(moment(), 'minutes')
        let out = ['*Countries with the top medals:* ```']
        data.topMedals.forEach(({ name, total, gold, silver, bronze }) => {
          if (!total) return
          out.push(`${name}: ${new Array(data.padding - name.length).join(' ')}Total: ${total} | Bronze: ${bronze} | Silver: ${silver} | Gold: ${gold}`)
        })
        out.push('```')
        out.push(minsTillUpdate > 1 ? `Data updates in ${minsTillUpdate} minutes` : 'Data will update in less than a minute')
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
            "fields": [{
              "title": "Total",
              "value": `:totalmedals: *${total}*`
            }, {
              "title": "Bronze",
              "value": `:bronzemedal: *${bronze.length}* \n ${bronze.map(m => '- _' + m + '_').join('\n')}`
            }, {
              "title": "Silver",
              "value": `:silvermedal: *${silver.length}* \n ${silver.map(m => '- _' + m + '_').join('\n')}`
            }, {
              "title": "Gold",
              "value": `:goldmedal: *${gold.length}* \n ${gold.map(m => '- _' + m + '_').join('\n')}`,
              "short": true
            }]
          }]
        }
        return resolve({ type: 'channel', message: attachment })
      })
    }
  })
}
