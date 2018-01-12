import { filter, truncate, capitalize, floor } from 'lodash'
import moment from 'moment'
import config from '../../../config.json'
import { getSerieDetails, getMovieDetails } from './utils/trakt'

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

    getMovieDetails(input).then(movie => {
      resolve({ type: 'channel', message: generateMovieResponse(movie) })
    }).catch(reject)
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

const generateMovieResponse = movie => {
  if (!movie) return 'Error: Missing movie data while generating response'
  if (movie.runtime) {
    var time = moment.duration(movie.runtime, 'minutes')
    var duration = type => time[type]() !== 0 ? `${time[type]()} ${type.slice(0, -1)}${(time[type]() > 1 ? 's' : '')}` : false
    var runtime = ['hours', 'minutes'].map(duration).filter(Boolean).join(' and ')
  }

  let out = {
    attachments: [{
      "title": `${movie.title} (${movie.year || 'Unknown'})`,
      "title_link": `https://trakt.tv/movies/${movie.ids.slug}`,
      "fallback": `${movie.title} (${movie.year}) - https://trakt.tv/shows/${movie.ids.slug}`,
      "image_url": movie.image,
      "text": movie.tagline,
      "mrkdwn_in": ["text", "pretext", "fields"],
      "color": "#c61017"
    }]
  }

  out.attachments[0].fields = filter([{
    "title": "Overview",
    "value": truncate(movie.overview, { length: 450 }) || null,
    "short": false
  }, {
    "title": "Released",
    "value": movie.released ? moment(movie.released).format('MMMM Do YYYY') : null,
    "short": true
  }, {
    "title": "Runtime",
    "value": movie.runtime ? runtime : null,
    "short": true
  }, {
    "title": "Certification",
    "value": movie.certification || null,
    "short": true
  }, {
    "title": "Genres",
    "value": movie.genres ? (movie.genres.slice(0, 3).map(g => capitalize(g)).join(', ')) : null,
    "short": true
  }, {
    "title": "Rating",
    "value": floor(movie.rating, 1) || null,
    "short": true
  }, {
    "title": "Trailer",
    "value": movie.trailer && movie.trailer.includes('youtube') ? movie.trailer.replace(/^(https?):\/\//, '') : null,
    "short": true
  }, {
    "title": "Homepage",
    "value": movie.homepage ? movie.homepage.replace(/^(https?):\/\//, '') : null,
    "short": true
  }])
  return out
}

const generateShowResponse = serie => {
  if (!serie) return 'Error: Missing serie data while generating response'
  if (serie.seasons[0].number === 0) serie.seasons.shift() // Don't count specials season
  if (serie.seasons[serie.seasons.length - 1].aired_episodes === 0) serie.seasons.pop() // Ignore last season if no aired episodes
  let out = {
    attachments: [{
      "title": `${serie.title} (${serie.year || 'Unknown'})`,
      "title_link": `https://trakt.tv/shows/${serie.ids.slug}`,
      "fallback": `${serie.title} (${serie.year})`,
      "image_url": serie.image,
      "mrkdwn_in": ["text", "pretext", "fields"],
      "color": "#c61017"
    }]
  }
  // Filter the shit to remove nulls
  out.attachments[0].fields = filter([{
    "title": "Overview",
    "value": truncate(serie.overview, { length: 450 }) || null,
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
    "value": `${serie.aired_episodes} Episode${serie.aired_episodes == 1 ? '' : 's'} | ${serie.seasons.length} Season${serie.seasons.length === 1 ? '' : 's'}`,
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
    "title": "Trailer",
    "value": serie.trailer && serie.trailer.includes('youtube') ? serie.trailer.replace(/^(https?):\/\//, '') : null,
    "short": true
  }, {
    "title": "Homepage",
    "value": serie.homepage ? serie.homepage.replace(/^(https?):\/\//, '') : null,
    "short": true
  }], 'value')
  return out
}
