import ytSearch from 'youtube-search'
import needle from 'needle'
import config from '../../../config.json'
import { last } from 'lodash'

export const plugin_info = [{
  alias: ['g', 'google'],
  command: 'googleSearch',
  usage: 'google <query> [-i] - returns first or specified google result for query'
}, {
  alias: ['yt', 'youtube'],
  command: 'youtubeSearch',
  usage: 'youtube <query> - returns first youtube result for query'
}, {
  alias: ['gi', 'googleimage'],
  command: 'googleImage',
  usage: 'googleimage <query> - returns random image for query'
}]

const ytOpts = {
  maxResults: 1,
  key: config.googleAPIKey,
  type: 'video',
  videoEmbeddable: true,
  safeSearch: config.youtubeSafeSearch || 'none'
}

const baseURL = `https://www.googleapis.com/customsearch/v1?num=5&start=1&hl=en&safe=${config.googleSafeSearch || 'off'}&key=${config.googleAPIKey}`

export function googleSearch(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: google <query> [-i] - Returns the first or specified result from Google' })
    if (!config.googleAPIKey || !config.cseSearchID) return reject("Error: Google API Key and CSE Key are required to use this function")

    const lastWord = last(input.split(' '))
    const index = lastWord.startsWith('-') ? parseInt(lastWord.slice(1)) || 0  : 0

    const url = `${baseURL}&q=${input}&cx=${config.cseSearchID}`

    needle.get(url, (err, resp, body) => {
      if (!err && body && !body.error) {
        if (body.items) {
          const chosen = (body.items[index] || body.items[0])
          return resolve({ type: 'channel', message: chosen.link })
        } else return reject("No results found")
      } else {
        console.error(`googleImgError: ${err || body.error.message}`)
        reject(`googleImgError: ${err || body.error.message}`)
      }
    })
  })
}

export function googleImage(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: googleimage <query> - Returns any of the first 5 images returned for query' })
    if (!config.googleAPIKey || !config.cseImageID) return reject("Error: Google API Key and CSE Key are required to use this function")

    const url = `${baseURL}&q=${input}&cx=${config.cseImageID}&searchType=image`

    needle.get(url, (err, resp, body) => {
      if (!err && body && !body.error) {
        if (body.items) {
          const chosen = body.items[Math.floor(Math.random() * body.queries.request[0].count)].link + `#${Math.floor(Math.random() * 1000)}`
          return resolve({ type: 'channel', message: chosen })
        } else return reject("No results found")
      } else {
        console.error(`googleImgError: ${err || body.error.message}`)
        reject(`googleImgError: ${err || body.error.message}`)
      }
    })
  })
}

export function youtubeSearch(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: youtube <query> | Returns the Youtube result for query' });

    if (!config.googleAPIKey) return reject("Error: Google APIKey required to use this function");

    ytSearch(input, ytOpts, (err, resp) => {
      if (err) return reject(`ytSearchErr: ${err}`)
      if (resp.length) return resolve({ type: 'channel', message: `https://youtu.be/${resp[0].id}` })
      else return reject("No results found")
    })
  })
}
