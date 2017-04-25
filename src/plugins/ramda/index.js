import ramdaFunctions from './utils/ramda'

export const plugin_info = [{
  alias: ['ramda'],
  command: 'ramda',
  usage: 'ramda <command> - returns info for command'
}]

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
    } else reject("No function with that name")

  })
}
