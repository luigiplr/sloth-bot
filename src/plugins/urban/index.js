import Promise from 'bluebird'
import { unescape } from 'lodash'
import Urban from 'urban'

export const plugin_info = [{
  alias: ['urban'],
  command: 'urbandictionary',
  usage: 'urban <word> - returns urban definition for word'
}, {
  alias: ['ru', 'randomurban'],
  command: 'randomurban',
  usage: 'randomurban - returns random urban'
}]

export function urbandictionary(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return reject('Specify a word pls')

    new Urban(input).first((definition) => {
      if (!definition) return reject("No results found")
      return resolve({
        type: 'channel',
        message: unescape(`[${definition.thumbs_up || 'N/A'} :thumbsup: | ${definition.thumbs_down || 'N/A'} :thumbsdown: ] ${definition.permalink}`)
      })
    })
  })
}

export function randomurban() {
  return new Promise((resolve, reject) => new Urban.random().first((definition) => {
    if (!definition) return reject("Error fetching urban")
    return resolve({
      type: 'channel',
      message: unescape(`[${definition.thumbs_up || 'N/A'} :thumbsup: | ${definition.thumbs_down || 'N/A'} :thumbsdown: ] ${definition.permalink}`)
    })
  }))
}
