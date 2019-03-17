import needle from 'needle'
import moment from 'moment'

const BASE_API_URL = 'https://api.overwatchleague.com'
const ENDPOINTS = {
  maps: '/maps',
  standings: '/v2/standings?locale=en_US&season=%p%',
  teams: '/teams?locale=en_US',
  players: '/players?locale=en_US'
}

export const cache = {}
export const cacheTs = {}

const getUrl = (endpoint, params = []) => {
  let url = `${BASE_API_URL}${ENDPOINTS[endpoint]}`
  for (let param of params) {
    url = url.replace('%p%', param)
  }

  return url
}

/**
 * Gets data from the OWL API. Returns cached data if available
 * @param {string} endpoint endpoint to use
 * @param {[string]} params array of params to send to the endpoint
 * @param {Object} cacheOptions
 * @param {Boolean} cacheOptions.noCache bypasses cache
 * @param {number} cacheOptions.timeout time in minutes before cached data is stale
 * @returns {Promise<any>}
 */
async function requestWithCache(endpoint, params, cacheOptions = {}) {
  if (!cacheOptions.noCache && cache[endpoint] && +moment(cacheTs[endpoint]).add(cacheOptions.timeout || 5, 'minutes') > Date.now()) {
    return cache[endpoint]
  }

  console.log('GET', getUrl(endpoint, params))
  return needle('GET', getUrl(endpoint, params)).then(response => {
    if (response.statusCode === 200) {
      cache[endpoint] = response.body
      cacheTs[endpoint] = Date.now()
      return response.body
    }

    console.error('[OWL] Error getting data', endpoint)
    throw new Error()
  }, err => {
    console.error('[OWL] Error getting data', err)
    throw new Error()
  })
}

/**
 * Gets OWL standings
 * @param {number} year optional year to get standings for
 * @returns {Promise<[Standings]>}
 */
export async function getStandings(year) {
  return (await requestWithCache('standings', [year || ''])).data
}

/**
 * Gets OWL players
 * @returns {Promise<[Player]>}
 */
export async function getPlayers() {
  return (await requestWithCache('players', [], { timeout: 60 })).content
}
