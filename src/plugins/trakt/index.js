import Promise from 'bluebird'
import { filter, truncate, capitalize, floor } from 'lodash'
import moment from 'moment'
import config from '../../../config.json'
import { getSerieDetails } from './utils/trakt'

if (!config.traktAPIKey) console.error("Error: Trakt Plugin requires traktAPIKey")

export const plugin_info = [{
  alias: ['movie'],
  command: 'searchMovies',
  usage: 'movie <name> - fetches info for a movie'
}, {
  alias: ['show', 'tvshow'],
  command: 'searchShows',
  usage: 'show [-s] <query> - returns info for a show'
}, {
  alias: ['imdb', 'trakt'],
  command: 'redirect'
}]

export function searchMovies(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!config.traktAPIKey) return console.error("Error: Trakt Plugin requires traktAPIKey")
    if (!input) return resolve({ type: 'dm', message: 'Usage: movie <query> - Returns movie information for query' })

    return reject("Not implemented")
  })
}

export function searchShows(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!config.traktAPIKey) return console.error("Error: Trakt Plugin requires traktAPIKey")
    if (!input) return resolve({ type: 'dm', message: 'Usage: show [-s] <query> - Returns show information for query, optionally specify -s to use a shows slug as the ID' })

    getSerieDetails(input).then(serie => {
      resolve({ type: 'channel', message: generateShowResponse(serie) })
    }).catch(reject)
  })
}

export function redirect() {
  return new Promise(resolve => resolve({ type: 'dm', message: `You can use the ${config.prefix}movie or ${config.prefix}tvshow commands to fetch movie/show information` }))
}

const getImgUrl = id => {
  if (!id || !config.traktImageProxy) return undefined
  return config.traktImageProxy.replace('%s', id)
}

//const generateMovieResponse = (movieDetails => {})

const generateShowResponse = serie => {
  if (!serie) return 'Error: Missing serie data while generating response'
  var seasons = serie.seasons[0].number == 0 ? serie.seasons.length - 1 : serie.seasons.length
  let out = {
      attachments: [{
        "title": `${serie.title} (${serie.year || 'Unknown'})`,
        "title_link": `https://trakt.tv/shows/${serie.ids.slug}`,
        "fallback": `${serie.title} (${serie.year})`,
        "image_url": getImgUrl(serie.ids.imdb),
        "mrkdwn_in": ["text", "pretext", "fields"],
        "color": "#c61017"
      }]
    }
    // Filter the shit to remove nulls
  out.attachments[0].fields = filter([{
    "title": "Overview",
    "value": truncate(serie.overview, { length: 400 }) || null,
    "short": false
  }, {
    "title": "First Aired",
    "value": serie.first_aired ? moment(serie.first_aired).format('MMMM Do YYYY') : null,
    "short": true
  }, {
    "title": "Status",
    "value": serie.status ? (serie.status.split(' ').map(s => capitalize(s)).join(' ')) : null,
    "short": true
  }, {
    "title": "Aired Episodes",
    "value": `${serie.aired_episodes} Episode${serie.aired_episodes == 1 ? '' : 's'} | ${seasons} Season${seasons == 1 ? '' : 's'}`,
    "short": true
  }, {
    "title": "Genres",
    "value": serie.genres ? (serie.genres.slice(0, 3).map(g => capitalize(g)).join(', ')) : null,
    "short": true
  }, {
    "title": "Rating",
    "value": floor(serie.rating, 1) || null,
    "short": true
  }, {
    "title": "Network",
    "value": serie.network || null,
    "short": true
  }, {
    "title": "Homepage",
    "value": serie.homepage ? serie.homepage.replace(/^(https?):\/\//, '') : null,
    "short": true
  }, {
    "title": "Trailer",
    "value": serie.trailer ? serie.trailer.replace(/^(https?):\/\//, '') : null,
    "short": true
  }], 'value')
  return out
}
