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

export async function ramda(user, channel, input) {
  if (!input) return { type: 'dm', message: 'Usage: ramda <command> | Searches for ramda function' }

  let method = input === '__' ? input : input.replace('R.', '')

  if (!ramdaFunctions[method.toLowerCase()]) {
    const match = matcher.get(method)
    return { type: 'message', message: match ? `No function by that name, did you mean \`${match}\`?` : 'No function by that name' }
  }

  let cmd = ramdaFunctions[method.toLowerCase()]
  let msg = [
    `*Method:* R.${cmd.name}`,
    `*Command:* \`${cmd.command}\``,
    `*Category:* ${cmd.category}`,
    `*Since:* ${cmd.since}`,
    `*Description:* ${cmd.description}`,
    `http://ramdajs.com/docs/#${cmd.name}`
  ]

  return { type: 'channel', messages: msg, options: { unfurl_links: false } }
}
