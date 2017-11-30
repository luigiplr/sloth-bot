import needle from 'needle'

const { traktAPIKey, tmdbAPIKey } = require('./../../../../config.json')
const APIUrl = "https://api.trakt.tv/"

const options = { headers: { "trakt-api-key": traktAPIKey } }

const endpoints = {
  serie: 'shows/%s?extended=full',
  search: 'search/%t?extended=full&query=%s',
  season: 'shows/%s/seasons?extended=full',
  movie: 'movies/%s?extended=full'
}

const types = {
  serie: 'show',
  movie: 'movie'
}

const getURL = (what, input, type) => {
  return APIUrl + endpoints[what].replace('%s', input).replace('%t', types[type])
}

const getShowORMovieWithSlughOrSearch = (input, type) => {
  return new Promise((resolve, reject) => {
    let isID = input.includes('-s')
    let name = isID ? input.replace('-s', '').trim() : input
    needle.get(getURL(isID ? type : 'search', name, type), options, (err, resp, body) => {
      if (resp.statusCode === 404) return reject("No results found")
      if (err || !body) return reject("Error fetching data from Trakt.tv")
      if (isID) return resolve(body)
      if (!body.length) return reject("No results found")
      resolve(body[0][type === 'movie' ? 'movie' : 'show'])
    })
  })
}

const getSeasonInfo = serie => new Promise((resolve, reject) => {
  needle.get(getURL('season', serie.ids.slug), options, (err, resp, body) => {
    if (err || !body) return reject("Error fetching season details")
    resolve({ seasons: body, ...serie })
  })
})

export function getMovieDetails(input) {
  return getShowORMovieWithSlughOrSearch(input, 'movie')
    .then(d => getImageFromTmdb(d, 'movie'))
}

export function getSerieDetails(input) {
  return getShowORMovieWithSlughOrSearch(input, 'serie')
    .then(getSeasonInfo)
    .then(d => getImageFromTmdb(d, 'show'))
}

const imgBaseUrl = 'https://image.tmdb.org/t/p/w154'
function getImageFromTmdb(data, type) {
  return new Promise(resolve => {
    const id = data.ids.tmdb
    const t = type === 'movie' ? 'movies' : 'tv'

    if (!id || !tmdbAPIKey) {
      return resolve(data)
    }

    needle.get(`https://api.themoviedb.org/3/${t}/${id}?api_key=${tmdbAPIKey}`, (err, resp, body) => {
      if (err || !body) {
        return resolve(data)
      }

      return resolve({ ...data, image: body.poster_path ? `${imgBaseUrl}/${body.poster_path}` : void 0 })
    })
  })
}
