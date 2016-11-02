import Promise from 'bluebird'
import needle from 'needle'

const token = require('./../../../../config.json').traktAPIKey
const APIUrl = "https://api.trakt.tv/"

const options = { headers: { "trakt-api-key": token } }

const endpoints = {
  serie: 'shows/%s?extended=full',
  search: 'search/show?extended=full&query=%s',
  season: 'shows/%s/seasons'
}

const getURL = (type, input) => {
  return APIUrl + endpoints[type].replace('%s', input)
}

const getShowWithSlugOrSearch = input => {
  return new Promise((resolve, reject) => {
    let isID = input.includes('-s')
    let name = isID ? input.replace('-s', '').trim() : input
    needle.get(getURL(isID ? 'serie' : 'search', name), options, (err, resp, body) => {
      if (resp.statusCode == 404) return reject("No results found")
      if (err || !body) return reject("Error fetching data from Trakt.tv")
      if (isID) return resolve(body)
      if (!body.length) return reject("No results found")
      resolve(body[0].show)
    })
  })
}

const getSeasonInfo = serie => new Promise((resolve, reject) => {
  needle.get(getURL('season', serie.ids.slug), options, (err, resp, body) => {
    if (err || !body) return reject("Error fetching season details")
    resolve({ seasons: body, ...serie })
  })
})

export function getSerieDetails(input) {
  return new Promise((resolve, reject) => {
    getShowWithSlugOrSearch(input)
      .then(getSeasonInfo)
      .then(resolve)
      .catch(reject)
  })
}
