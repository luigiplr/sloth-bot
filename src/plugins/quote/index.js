import { getQuote, grabQuote } from './utils/quote'

export const plugin_info = [{
  alias: ['grab'],
  command: 'grab',
  usage: 'grab <username> - grabs a users message'
}, {
  alias: ['quote'],
  command: 'quote',
  usage: 'quote <username> <quotenumber (optional)>'
}, {
  alias: ['quotes'],
  command: 'quotes',
  usage: 'quotes <username> - lists a users quotes'
}]

export function grab(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: grab <username> [index] - Grabs a message from a user. Index can be up to 3 messages back where 0 is latest' })
    let grabee = input.split(' ')[0].toLowerCase()
    let index = input.split(' ')[1] ? input.split(' ')[1] : 0
    if (!index || (index < 4 && index >= 0))
      grabQuote(grabee, channel, index, user).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
    else return reject("Can't grab a quote that far back")
  })
}

export function quote(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: quote <username> [index] - Retrives and displays a users most recent or specified quote' })
    let grabee = input.split(' ')[0].toLowerCase()
    let index = input.split(' ')[1] ? input.split(' ')[1] : undefined
    getQuote(grabee, index).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
  })
}

export function quotes(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: quotes <username> - lists all saved quotes for the user' })
    getQuote(input, 'all').then(resp => resolve({ type: 'channel', messages: resp })).catch(reject)
  })
}
