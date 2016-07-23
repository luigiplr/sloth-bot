import Promise from 'bluebird'
import { sendMessage, findUser } from '../../slack'

export const plugin_info = [{
  alias: ['ddos'],
  command: 'ddos',
  usage: 'ddos <user> - :)'
}]

export function ddos(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return reject('Its no fun if you dont tell me who to DDoS :(')
    findUser(input, 'name').then(user => {
      resolve(`Resolving hostname for ${user}`)
      setTimeout(() => sendMessage(channel.id, `Hostname resolved, Beginning DDoS on ${user}`), 3000)
    }).catch(reject)
  })
}
