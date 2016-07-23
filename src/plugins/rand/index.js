import Promise from 'bluebird'
import Random from './utils/random'

export const plugin_info = [{
  alias: ['rand', 'random'],
  command: 'rand',
  usage: 'rand <A-B> - A-B can be chars, ints or floats separated by any character'
}]

const messages = [
  'That would be: ',
  'Mmmmmh, how about: ',
  'Processing request... request completed. The answer is: ',
  'There you go: ',
  'I propose: '
]

export function rand(user, channel, input) {
  return new Promise(resolve => {
    var random, match

    if (!input) match = { type: 'num', match: [0, 9] }
    else match = Random.findMatch(input);

    switch (match.type) {
      case 'num':
        random = Random.randFloat(match.match[0], match.match[1])
        break;
      case 'char':
        random = Random.randChar(match.match[0], match.match[1])
        break
      default:
        return resolve({ type: 'dm', message: 'Usage: rand <A-B>, A-B can be chars, ints or floats separated by any character' })
    }

    // add some magic
    if (Random.randFloat(1, 100) == 100) random = 'Forty-two'
    else if (random == 42) random = 'The Answer to the Ultimate Question of Life, the Universe, and Everything'

    return resolve({ type: 'channel', message: messages[Random.randFloat(0, messages.length - 1)] + random })
  })
}
