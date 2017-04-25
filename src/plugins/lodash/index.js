import lodashFunctions from './utils/lodash'
import Matcher from 'did-you-mean'

export const plugin_info = [{
  alias: ['lodash'],
  command: 'lodash',
  usage: 'lodash <command> - returns info for command'
}]

const matcher = new Matcher(Object.keys(lodashFunctions).join(' '))
matcher.ignoreCase()
matcher.setThreshold(2)

export function lodash(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: lodash <command> | Searches for lodash function' })

    let method = input == '_' ? input : input.replace('_.', '').replace('_', '')
    if (lodashFunctions[method.toLowerCase()]) {
      let cmd = lodashFunctions[method.toLowerCase()];
      let msg = cmd.dontShow ? [`<https://lodash.com/docs#${cmd.name}|lodash.com/docs#${cmd.name}>`] : [
        `*Method:* _.${cmd.name}`,
        `*Command:* \`${cmd.command}\``,
        `*Since:* ${cmd.since}`,
        `*Description:* ${cmd.description}`,
        `https://lodash.com/docs#${cmd.name}`
      ];
      return resolve({ type: 'channel', messages: msg, options: { unfurl_links: false }})
    } else {
      var match = matcher.get(method)
      if (match) return resolve({ type: 'message', message: `No function by that name, did you mean \`${match}\`?`})
      else return reject('No function by that name')
    }
  })
}
