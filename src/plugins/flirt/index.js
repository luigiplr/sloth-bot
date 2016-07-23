import Promise from 'bluebird'
import { findUser } from '../../slack'
import flirts from './flirts'

export const plugin_info = [{
  alias: ['flirt'],
  command: 'flirt',
  usage: 'flirt <user> - :)'
}]

export function flirt(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return reject("Its no fun if you dont tell me who i'm flirting with :(")
    findUser(input, 'name').then(user => {
      return resolve({
        type: 'channel',
        message: flirts[Math.floor(Math.random() * flirts.length)].replace('%s', user)
      })
    }).catch(reject)
  })
}
