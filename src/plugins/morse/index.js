import Promise from 'bluebird'
import nodeMorse from 'morse-node'

export const plugin_info = [{
  alias: ['morse'],
  command: 'morse',
  usage: 'morse <text>'
}]

const morseConvert = nodeMorse.create('ITU')

export function morse(user, channel, input) {
  return new Promise(resolve => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: Morse <morse code> - Translates morse code into English. Words should be seperated by a /' })

    resolve({ 'type': 'channel', 'message': "Translation: " + morseConvert.decode(input) })
  })
}
