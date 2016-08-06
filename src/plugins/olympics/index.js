import Promise from 'bluebird'
import _ from 'lodash'
import needle from 'needle'
import moment from 'moment'

export const plugin_info = [{
  alias: ['medals', 'olympics'],
  command: 'medals',
  usage: 'medals [country] - returns olympic medal stats'
}, {
  alias: ['listcountries'],
  command: 'listcountries'
}]

var nextupdate = undefined
var lastupdated = undefined
var cachedData = undefined

const _getData = () => {
  return new Promise((resolve, reject) => {
    if (cachedData && nextupdate && nextupdate.diff(moment(), 'minutes') != 0) return resolve(cachedData)

    needle.get('http://olympics.atelerix.co/medals', (err, resp, body) => {
      if (!err && body) {
        nextupdate = moment(body.nextUpdate)
        lastupdated = moment(body.lastUpdated)
        _formatData(body).then(resolve)
      } else return reject("Error fetching data")
    })
  })
}

const _formatData = data => {
  return new Promise(resolve => {
    let out = {
      padding: 0,
      countries: {},
      topMedals: []
    }
    _.forEach(data.medals, country => out.countries[country.name.toLowerCase()] = country)
    out.topMedals = _.reverse(_.sortBy(out.countries, 'total')).slice(0, 10)
    out.padding = out.topMedals.slice(0).sort((a, b) => {
      return b.name.length - a.name.length;
    })[0].name.length + 1

    cachedData = out
    return resolve(out)
  })
}

const _getUpdateMessage = noItalic => {
  let minsTillUpdate = nextupdate.diff(moment(), 'minutes')
  let msg = minsTillUpdate > 1 ? `Data updates in ${minsTillUpdate} minutes` : `Data will update in less than a minute`
  return noItalic ? msg : `_${msg}_`
}

export function medals(user, channel, input = 'all') {
  return new Promise((resolve, reject) => {
    _getData().then(data => {
      if (input == 'all') {
        let out = ['*Countries with the top medals:* ```']
        data.topMedals.forEach(({ name, total, gold, silver, bronze }) => {
          if (!total) return
          out.push(`${name}: ${new Array(data.padding - name.length).join(' ')}Total: ${total} | Bronze: ${bronze} | Silver: ${silver} | Gold: ${gold}`)
        })
        out.push(`\`\`\` ${_getUpdateMessage()}`)
        return resolve({ type: 'channel', messages: out })
      } else {
        let country = input == 'top' ? data.topMedals[0] : data.countries[input.toLowerCase()]
        if (!country) return reject("Couldn't find data for that country name, use the `listcountries` command to view valid countries")
        if (!country.total) return reject(`I have no medals recorded for this country. \n ${_getUpdateMessage()}`)
        let { total, gold, silver, bronze, name, flag } = country
        let out = {
          msg: `*Olympic Medal Statistics for ${name}*`,
          attachments: [{
            "fallback": `Medal Stats for ${name} - Total: ${total} | Bronze: ${bronze} | Silver: ${silver} | Gold: ${gold}`,
            "mrkdwn_in": ["text", "fields"],
            "color": "#43a047",
            "thumb_url": flag,
            "footer": _getUpdateMessage(true),
            "ts": lastupdated.unix(),
            "fields": [{
              "title": "Total",
              "value": `:totalmedals: *${total}*`,
              "short": true
            }, {
              "title": "Bronze",
              "value": `:bronzemedal: *${bronze}*`,
              "short": true
            }, {
              "title": "Silver",
              "value": `:silvermedal: *${silver}*`,
              "short": true
            }, {
              "title": "Gold",
              "value": `:goldmedal: *${gold}*`,
              "short": true
            }]
          }]
        }
        return resolve({ type: 'channel', message: out })
      }
    }).catch(reject)
  })
}

export function listcountries() {
  return new Promise((resolve, reject) => {
    _getData().then(data => {
      return resolve({ type: 'channel', message: Object.keys(data.countries).map(c => `\`${c}\``).join(', ') })
    }).catch(reject)
  })
}
