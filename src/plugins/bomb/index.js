import Promise from 'bluebird'
import { fill, delay } from 'lodash'
import { findUser } from '../../slack.js'

var disabled = false

export const plugin_info = [{
  alias: ['pb', 'poopbomb'],
  command: 'poopbomb',
  usage: 'poopbomb <username> <amount || 1>'
}]

export function poopbomb(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: poopbomb <username> <amount || 1> - Poop bombs the user :))' })

    let amount = parseInt(input.split(' ')[1]) || 1
    if (disabled) return reject("I can't poop again that quickly")
    if (amount > 3) return reject('Too much poop :|')

    findUser(input.split(' ')[0]).then(poopee => {
      let p = fill(Array(amount), ':hankey: p :hankey:')
      let o = fill(Array(amount), ':hankey: o :hankey:')
      let oo = fill(Array(2), ':hankey: o :hankey:')
      let pp = fill(Array(amount), ':hankey: p :hankey:')
      let poop = [':hankey: poop :hankey:']
      disabled = true;
      delay(() => { disabled = false }, 20000)
      return resolve({ type: 'dm', user: poopee, multiLine: true, messages: p.concat(o, oo, pp, poop) })
    }).catch(reject)
  })
}
