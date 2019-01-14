import { getDataViaImdb, getImdbDataViaSearch } from './utils/imdb'
const arg = require('arg')

export const plugin_info = [{
  alias: ['imdb'],
  command: 'imdb',
  usage: 'imdb [-d] <id|query> - returns info for imdb id or query'
}]

const IMDB_RX = /^tt\d{7}$/

export async function imdb(user, channel, input) {
  if (!input) {
    return { type: 'dm', message: 'Usage: imdb [-d] <imdb id|query> - Returns information from IMDB for an IMDB id or title.' }
  }

  let queryArray, showDetail

  try {
    ({ _: queryArray, '-d': showDetail } = arg({ '-d': Boolean }, { argv: input.split(' ') }))
  } catch (err) {
    throw err.message
  }

  const query = queryArray.join(' ')

  if (IMDB_RX.test(query)) {
    return await getDataViaImdb(query)
  }

  return await getImdbDataViaSearch(query, showDetail)
}
