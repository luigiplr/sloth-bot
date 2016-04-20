import Promise from 'bluebird'
import _ from 'lodash'
import slackTools from '../../slack.js'

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

    slackTools.findUser(input.split(' ')[0]).then(poopee => {
      let p = _.fill(Array(amount), ':hankey: p :hankey:'),
        o = _.fill(Array(amount), ':hankey: o :hankey:'),
        oo = _.fill(Array(2), ':hankey: o :hankey:'),
        pp = _.fill(Array(amount), ':hankey: p :hankey:'),
        poop = [':hankey: poop :hankey:'];
      disabled = true;
      _.delay(() => { disabled = false }, 20000)
      return resolve({ type: 'dm', user: poopee, multiLine: true, messages: p.concat(o, oo, pp, poop) })
    }).catch(reject)
  })
}

