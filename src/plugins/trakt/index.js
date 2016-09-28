import Promise from 'bluebird'
import { filter, truncate, capitalize, floor } from 'lodash'
import Trakt from 'trakt.tv'
import config from '../../../config.json'
import moment from 'moment'

if (!config.traktAPIKey) console.error("Error: Trakt Plugin requires traktAPIKey")

const trakt = new Trakt({ client_id: config.traktAPIKey })

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
    if (!input) return resolve({ type: 'dm', message: 'Usage: movie <query> - Returns movie information for query' })

    return reject("Not implemented")
  })
}

export function searchShows(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!config.traktAPIKey) console.error("Error: Trakt Plugin requires traktAPIKey")
    if (!input) return resolve({ type: 'dm', message: 'Usage: show [-s] <query> - Returns show information for query, optionally specify -s to use a shows slug as the ID' })

    getShowWithSlugOrSearch(input).then(id => {
      Promise.join(trakt.shows.summary({ id, extended: 'full,images' }), trakt.seasons.summary({ id }))
        .then(([show, seasons]) => {
          if (!show || !seasons) return reject("Error fetching Show/Seasons info")
          if (seasons[0].number == 0) seasons.shift()
          return resolve({ type: 'channel', message: generateShowResponse(show, seasons) })
        }).catch(reject)
    }).catch(reject)
  })
}

export function redirect() {
  return new Promise(resolve => resolve({ type: 'dm', message: `You can use the ${config.prefix}movie or ${config.prefix}tvshow commands to fetch movie/show information` }))
}

const getShowWithSlugOrSearch = input => new Promise((resolve, reject) => {
  let query = input.split(' ')
  if (query[0] == '-s') trakt.shows.summary({ id: query[1] }).then(show => {
    return resolve(show.ids.trakt)
  }).catch(() => reject('No results found'))
  else trakt.search.text({ type: 'show', query: query[0] }).then(shows => {
    if (!shows.length) return reject('No results found')
    return resolve(shows[0].show.ids.trakt)
  })
})

const imgResize = 'https://images.weserv.nl/?w=175&url='

//const generateMovieResponse = (movieDetails => {})

const generateShowResponse = ((showDetails, seasons) => {
  let out = {
      attachments: [{
        "title": `${showDetails.title} (${showDetails.year || 'Unknown'})`,
        "title_link": `https://trakt.tv/shows/${showDetails.ids.slug}`,
        "fallback": `${showDetails.title} (${showDetails.year})`,
        "image_url": showDetails.images.poster.thumb ? imgResize + showDetails.images.poster.thumb.replace('https://', '') : null,
        "mrkdwn_in": ["text", "pretext", "fields"],
        "color": "#c61017"
      }]
    }
    // Filter the shit to remove nulls
  out.attachments[0].fields = filter([{
    "title": "Overview",
    "value": truncate(showDetails.overview, { length: 400 }) || null,
    "short": false
  }, {
    "title": "First Aired",
    "value": showDetails.first_aired ? moment(showDetails.first_aired).format('MMMM Do YYYY') : null,
    "short": true
  }, {
    "title": "Status",
    "value": showDetails.status ? (showDetails.status.split(' ').map(s => capitalize(s)).join(' ')) : null,
    "short": true
  }, {
    "title": "Aired Episodes",
    "value": `${showDetails.aired_episodes} Episodes | ${seasons.length} ${seasons.length == 1 ? 'Season' : 'Seasons'}`,
    "short": true
  }, {
    "title": "Genres",
    "value": showDetails.genres ? (showDetails.genres.slice(0, 3).map(g => capitalize(g)).join(', ')) : null,
    "short": true
  }, {
    "title": "Rating",
    "value": floor(showDetails.rating, 1) || null,
    "short": true
  }, {
    "title": "Network",
    "value": showDetails.network || null,
    "short": true
  }, {
    "title": "Homepage",
    "value": showDetails.homepage ? showDetails.homepage.replace(/^(https?):\/\//, '') : null,
    "short": true
  }, {
    "title": "Trailer",
    "value": showDetails.trailer ? showDetails.trailer.replace(/^(https?):\/\//, '') : null,
    "short": true
  }], 'value')
  return out
})
