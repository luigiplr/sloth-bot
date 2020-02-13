import figlet from 'figlet'
import { promisify } from 'util'

const figletAsync = promisify(figlet)

export const plugin_info = [{
  alias: ['ascii'],
  command: 'ascii',
  usage: 'ascii <word>'
}]

export async function ascii(user, channel, input) {
  if (!input) {
    throw 'Usage: ascii <word>'
  }

  if (input.length > 20) {
    throw 'Cannot be larger than 20 letters'
  }

  const word = await figletAsync(input)
  return {
    type: 'channel',
    message: [
      '```',
      word,
      '```'
    ].join('\n')
  }
}
