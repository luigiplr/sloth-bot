import { getDataViaImdb, getImdbDataViaSearch } from './util/imdb'

export const plugin_info = [{
  alias: ['imdb'],
  command: 'imdb',
  usage: 'imdb <id> - returns info for imdb id'
}]

const IMDB_RX = /^tt\d{7}$/

export async function imdb(user, channel, input) {
  if (!input) {
    return { type: 'dm', message: 'Usage: imdb <imdb id> - Returns information from IMDB for an IMDB id.' }
  }

  if (IMDB_RX.test(input)) {
    return await getDataViaImdb(input)
  }

  return await getImdbDataViaSearch(input)
}
