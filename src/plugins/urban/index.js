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
    if (!input) {
      return reject('Specify a word pls')
    }

    let indexMatch = input.match(/( \d\d?)$/)
    let index = 0
    if (indexMatch) {
      index = +indexMatch[1].trim() < 0 ? 0 : +indexMatch[1].trim() - 1
      input = input.replace(/( \d\d?)$/, '')
    }
    
    new Urban(input).results((results = []) => {
      if (!results || results.length === 0) return reject("No results found")

      index = index > results.length - 1 ? results.length - 1 : +index

      const { word, permalink, definition, thumbs_up = 'N/A', thumbs_down = 'N/A' } = results[index]
      return resolve({
        type: 'channel',
        message: {
          attachments: [{
            title: word,
            title_link: permalink,
            color: '#1d2439',
            text: `[${thumbs_up} :thumbsup: | ${thumbs_down} :thumbsdown:] ${unescape(definition)}`,
            footer: `${index + 1}/${results.length} results`
          }]
        }
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
