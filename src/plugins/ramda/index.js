import ramdaFunctions from './utils/ramda'
import Matcher from 'did-you-mean'

export const plugin_info = [{
  alias: ['ramda'],
  command: 'ramda',
  usage: 'ramda <command> - returns info for command'
}]

const matcher = new Matcher(Object.keys(ramdaFunctions).join(' '))
matcher.ignoreCase()
matcher.setThreshold(2)

export function ramda(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: ramda <command> | Searches for ramda function' })

    let method = input == '__' ? input : input.replace('R.', '')
    if (ramdaFunctions[method.toLowerCase()]) {
      let cmd = ramdaFunctions[method.toLowerCase()];
      let msg = [
        `*Method:* R.${cmd.name}`,
        `*Command:* \`${cmd.command}\``,
        `*Category:* ${cmd.category}`,
        `*Since:* ${cmd.since}`,
        `*Description:* ${cmd.description}`,
        `http://ramdajs.com/docs/#${cmd.name}`
      ];
      return resolve({ type: 'channel', messages: msg, options: { unfurl_links: false }})
    } else {
      var match = matcher.get(method)
      if (match) return resolve({ type: 'message', message: `No function by that name, did you mean \`${match}\`?`})
      else return reject('No function by that name')
    }
  })
}
