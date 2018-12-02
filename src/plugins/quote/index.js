import { getQuote, getQuotes, grabQuote, getRandomQuote, getQuoteInfo, getQuoteStats, searchForQuoteByText, getQuoteById } from './utils/quote'
import { findUser } from '../../slack'
import _ from 'lodash'

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
  usage: 'qinfo <username|id> [index] - returns quote info'
}, {
  alias: ['qstats', 'quotestats'],
  command: 'quoteStats',
  usage: 'qstats [user] - returns overall or users quote stats'
}, {
  alias: ['qs', 'qsearch'],
  command: 'quoteSearch',
  usage: 'qsearch [@user] <text> - searches for a quote, optionally by user'
}, {
  alias: ['qid', 'quoteid'],
  command: 'quoteById',
  usage: 'qid <id> - gets quote by it\'s id'
}]

export function grab(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: grab <username> [index] - Grabs a message from a user. Index can be up to 5 messages back where 0 is latest' })
    let grabee = input.split(' ')[0].toLowerCase()
    let index = input.split(' ')[1] ? input.split(' ')[1] : 0
    if (!index || (index < 6 && index >= 0)) {
      grabQuote(grabee, channel, index, user).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
      return
    }

    reject("Can't grab a quote that far back")
  })
}

export async function quote(user, channel, input) {
  if (!input) return { type: 'dm', message: 'Usage: quote <username> [index] - Retrives and displays a users most recent or specified quote' }

  const grabee = input.split(' ')[0].toLowerCase()
  const index = input.split(' ')[1] ? +input.split(' ')[1] : undefined

  if (_.isNaN(index)) throw 'Invalid index.'

  return { type: 'channel', message: await getQuote(grabee, index) }
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
  if (!input) {
    return { type: 'dm', message: 'Usage: qinfo <username|info> [index] - Shows quote info for a quote by ID or a quote by user and it\'s index.' }
  }

  const [ userOrId, index ] = input.split(' ')
  const quote = await getQuoteInfo(userOrId, index)

  return { type: 'channel', message: quote }
}

export function quoteStats(user, channel, input) {
  return new Promise((resolve, reject) => {
    getQuoteStats(input).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
  })
}

export async function quoteSearch(user, channel, input) {
  if (!input) {
    return { type: 'dm', message: 'Usage: qsearch [@user] <text> - Searches for a quote by text, you can optionally supply a user to search. Must be an @user mention.' }
  }

  const inputSplit = input.split(' ')
  const [ maybeUser, ...textWithoutUserSplit ] = inputSplit
  const hasUser = maybeUser.slice(0, 2) === "<@"
  const fromUser = hasUser && findUser(maybeUser)

  if (hasUser && !fromUser) {
    throw 'Invalid user??'
  }

  let query = fromUser ? textWithoutUserSplit : inputSplit
  let page = +_.last(query)

  if (_.isFinite(page)) {
    query = query.slice(0, query.length - 1)
  } else {
    page = 0
  }

  query = query.join(' ')

  if (!query || query === '') {
    throw 'Invalid query'
  }

  return searchForQuoteByText(fromUser.name, query, page)
}

export async function quoteById(user, channel, input) {
  if (!input) {
    return { type: 'dm', message: 'Usage: qid <id> - Returns a quote via it\'s unique id' }
  }

  const quote = await getQuoteById(input)

  return { type: 'channel', message: quote }
}
