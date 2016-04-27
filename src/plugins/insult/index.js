import Promise from 'bluebird'
import spinsult from 'shakespeare-insult'
import normalinsult from 'insultgenerator'

export const plugin_info = [{
  alias: ['insult'],
  command: 'insult',
  usage: 'insult <person>'
}, {
  alias: ['sinsult', 'shakespeareinsult'],
  command: 'oldinsult',
  usage: 'sinsult <person>'
}]

export function insult(user, channel, input) {
  return new Promise(resolve => {
    if (!input) return resolve({ type: 'channel', message: 'Who am I insulting?' })

    new normalinsult((meanMessage) => resolve({ type: 'channel', message: `${input}: ${meanMessage}` }))
  })
}
export function oldinsult(user, channel, input) {
  return new Promise(resolve => {
    if (!input) return resolve({ type: 'channel', message: 'Who am I insulting?' })

    return resolve({ type: 'channel', message: `_ ${input} you're a ${spinsult.random()}_` })
  })
}
