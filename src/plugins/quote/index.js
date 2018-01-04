import { getQuote, getQuotes, grabQuote, getRandomQuote, getQuoteInfo } from './utils/quote'

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
}, {
  alias: ['qrandom', 'qrand'],
  command: 'randomQuote',
  usage: 'qrand [user] - returns random quote'
}, {
  alias: ['qinfo'],
  command: 'quoteInfo',
  usage: 'qinfo <username> [index]'
}]

export function grab(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: grab <username> [index] - Grabs a message from a user. Index can be up to 3 messages back where 0 is latest' })
    let grabee = input.split(' ')[0].toLowerCase()
    let index = input.split(' ')[1] ? input.split(' ')[1] : 0
    if (!index || (index < 4 && index >= 0)) {
      grabQuote(grabee, channel, index, user).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
      return
    }

    reject("Can't grab a quote that far back")
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
    if (!input) return resolve({ type: 'dm', message: 'Usage: quotes <username> [index] - lists all saved quotes for the user' })

    const [user, page] = input.split(' ')
    getQuotes(user, page).then(resp =>
      resolve({
        type: 'channel',
        messages: resp,
        options: {
          unfurl_links: false,
          unfurl_media: false,
          link_names: false
        }
      })
    ).catch(reject)
  })
}

export function randomQuote(user, channel, input) {
  return new Promise((resolve, reject) => {
    getRandomQuote(input).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
  })
}

export async function quoteInfo(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: qinfo <username> [index] - Retrives and displays a users most recent or specified quote info' })

    const [ user, index ] = input.split(' ')
    getQuoteInfo(user, index).then(quote => {
      return resolve({ type: 'channel', message: quote })
    }).catch(reject)
  })
}
