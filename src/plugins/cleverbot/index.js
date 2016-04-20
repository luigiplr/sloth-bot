import Promise from 'bluebird'
import CleverBot, {
  prepare
}
from 'cleverbot-node'

const cleverb = new CleverBot

export const plugin_info = [{
  alias: ['cb', 'cleverbot'],
  command: 'cleverbot',
  usage: 'cleverbot <message>'
}]

export function cleverbot(user, channel, input = 'hello') {
  return new Promise(resolve => {
    prepare(() => cleverb.write(input, reply => resolve({ type: 'channel', message: `Cleverbot: ${reply.message}` })))
  })
}

