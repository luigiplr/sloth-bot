import Promise from 'bluebird'
import { sendMessage, findUser } from '../../slack'

export const plugin_info = [{
  alias: ['ddos'],
  command: 'ddos',
  usage: 'ddos <user> - :)'
}]

const _cleanInput = input => {
  if (input.includes('<mailto:')) return input.substr(8).split('|')[0]
  if (input.slice(0, 2) == "<@") return findUser(input).name || input
  if (input.includes('<http:')) return input.split('|')[1].slice(0, -1)
  return input
}

export function ddos(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return reject('Its no fun if you dont tell me what to DDoS :(')
    let newInput = _cleanInput(input.split(' ')[0])
    resolve({ type: 'channel', message: `Resolving hostname for ${newInput}` })
    setTimeout(() => sendMessage(channel.id, `Hostname resolved, Beginning DDoS on ${newInput}`), 3000)
  })
}
