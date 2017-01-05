import Promise from 'bluebird'
import { map } from 'lodash'
var canIUse = require('caniuse-api')

export const plugin_info = [{
  alias: ['ciu', 'caniuse'],
  command: 'caniuse',
  usage: 'ciu <feature>'
}, {
  alias: ['css'],
  command: 'css',
  usage: 'css [query] - returns matchs for query'
}]

const browserIDs = {
  and_chr: 'Chrome for Android',
  chrome: 'Google Chrome',
  edge: 'Edge',
  firefox: 'Firefox',
  ie: 'Internet Explorer',
  ie_mob: 'IE Mobile',
  opera: 'Opera',
  ios_saf: 'iOS Safari',
  safari: 'Safari',
  android: 'Android'
}

export function css(user, channel, input) {
  return new Promise(resolve => {
    var matches = canIUse.find(input)
    return resolve({ type: 'channel', message: matches.length ? `*Found ${matches.length} matches:* \n ${matches.map(a => `\`${a}\``).join(' ')}` : 'Found no matches'})
  })
}

export function caniuse(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: caniuse <query> - returns browser support for css query' })
    try {
      var data = canIUse.getSupport(input)
      if (!data) reject('Error: Got no data returned')
      delete data.op_mini
      delete data.samsung
      delete data.and_uc
      var message = {
        attachments: [{
          "fallback": `Dis don't work in IRC`,
          "mrkdwn_in": ["fields", "pretext"],
          "pretext": `*Browser support for \`${input}\`*`
        }]
      }
      message.attachments[0].fields = map(data, (support, name) => {
        var title = browserIDs[name] || name
        var out = [
          `Since: ${support.y || 'Unknown'}`,
          `Unavailable: ${support.n || 'Unknown'}`,
          `Partial: ${support.a || 'Unknown'}`
        ]
        return { title, value: out.join('\n'), short: true }
      })
      resolve({ type: 'channel', message })
    } catch (e) {
      reject(`Error: CSS term either too vague or I couldn't find match by that name, use the \`css\` command to search for exact names`)
    }
  })
}
