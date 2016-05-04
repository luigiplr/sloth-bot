import Promise from 'bluebird'
import ytSearch from 'youtube-search'
import needle from 'needle'
import config from '../../../config.json'

const ytOpts = {
  maxResults: 1,
  key: config.googleAPIKey,
  type: 'video',
  videoEmbeddable: true,
  safeSearch: 'none'
}

export const plugin_info = [{
  alias: ['g', 'google'],
  command: 'bingSearch',
  usage: 'google <query> - returns first google result for query'
}, {
  alias: ['yt', 'youtube'],
  command: 'youtubeSearch',
  usage: 'youtube <query> - returns first youtube result for query'
}, {
  alias: ['gi', 'googleimage'],
  command: 'googleImage',
  usage: 'googleimage <query> - returns random image for query'
}]

export function googleImage(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: googleimage <query> - Returns any of the first 5 images returned for query' })

    if (!config.googleAPIKey || !config.cseID) return reject("Error: Google API Key and CSE Key are required to use this function")

    let url = `https://www.googleapis.com/customsearch/v1?q=${input}&num=5&searchType=image&start=1&key=${config.googleAPIKey}&cx=${config.cseID}`

    needle.get(url, (err, resp, body) => {
      if (!err && body && !body.error) {
        if (body.items) {
          let chosen = body.items[Math.floor(Math.random() * body.queries.request[0].count)].link + `#${Math.floor(Math.random() * 1000)}`
          return resolve({ type: 'channel', message: chosen });
        } else return reject("No results found")
      } else {
        console.error(`googleImgError: ${err || body.error.message}`)
        reject(`googleImgError: ${err || body.error.message}`)
      }
    })
  })
}

export function bingSearch(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: google <query> - Returns the first Google result for query' })
    if (!config.bingAPIKey) return reject('Bing API Key required to use this function')

    let url = `https://bingapis.azure-api.net/api/v5/search/?q=${input}&count=1&safesearch=Off`
    let headers = { headers: { 'Ocp-Apim-Subscription-Key': config.bingAPIKey } }

    needle.get(url, headers, (err, resp, body) => {
      if (!err && !body.error && body.webPages) {
        let result = body.webPages.value[0]
        return resolve({ type: 'channel', message: `${result.name} - ${result.snippet} - ${unescape(result.url.split('&r=')[1].split('&p=')[0])}` })
      } else return reject(err || body.error)
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
