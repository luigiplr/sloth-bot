import ramdaFunctions from './utils/ramda'
import Matcher from 'did-you-mean'

export const plugin_info = [{
  alias: ['ramda'],
  command: 'ramda',
  usage: 'ramda <command> [--example] - returns info for command, optionally returns example'
}]

const matcher = new Matcher(Object.keys(ramdaFunctions).join(' '))
matcher.ignoreCase()
matcher.setThreshold(2)

const exampleRx = / ?(--example|--ex)/

export async function ramda(user, channel, input) {
  if (!input) return { type: 'dm', message: 'Usage: ramda <command> [--example] - Searches for ramda function, include `--example` to return an example as well' }

  let method = input === '__' ? input : input.replace('R.', '')

  const showExample = exampleRx.test(method)
  method = method.replace(exampleRx, '').trim()

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
    cmd.see.length > 0 && `*Similar:* ${cmd.see.map(s => `\`${s}\``).join(', ')}`,
    `*Description:* ${cmd.description}`,
    `http://ramdajs.com/docs/#${cmd.name}`,
    showExample && `*Example:* \`\`\`${cmd.example}\`\`\``
  ].filter(Boolean)

  return { type: 'channel', messages: msg, options: { unfurl_links: false } }
}
