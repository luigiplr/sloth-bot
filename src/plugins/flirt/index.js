import Promise from 'bluebird'
import { findUser } from '../../slack'
import flirts from './utils/flirts'

export const plugin_info = [{
  alias: ['flirt'],
  command: 'flirt',
  usage: 'flirt <user> - :)'
}]

export function flirt(user, channel, input) {
  return new Promise(resolve => {
    input = input ? (input.slice(0, 2) == "<@" ? findUser(input).name : input) : user.name
    return resolve({
      type: 'channel',
      message: flirts[Math.floor(Math.random() * flirts.length)].replace('%s', input)
    })
  })
}
