import needle from 'needle'
import _ from 'lodash'

export const plugin_info = [{
  alias: ['hackerterm', 'hterm'],
  command: 'hackerterm',
  usage: 'hackerterm <term>'
}]

const url = 'https://www.hackterms.com'
const options = {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
}

const COLORS = {
  tool: '#55d4ff',
  concept: '#d43eff',
  language: '#37e037',
  process: '#ff7f3a',
  other: '#cacaca'
}

async function getDefinitions(term) {
  const res = await needle('post', `${url}/get-definitions`, { term }, options)

  return _.get(res, 'body.body', [])
}

async function searchForWord(term) {
  const res = await needle('post', `${url}/search`, { term }, options)

  return _.get(res.body, ['body', 0, 'name'])
}

export async function hackerterm(user, channel, input) {
  if (!input) throw 'Usage: hackerterm <word> - searches for word'

  let actualWord
  let definitions = await getDefinitions(input)

  if (definitions.length === 0) {
    actualWord = await searchForWord(input)

    if (!actualWord) throw "Couldn't find any meanings for that word"

    definitions = await getDefinitions(actualWord)
  }

  if (definitions.length === 0) throw 'Got no definitions??'

  const def = definitions[0]

  return {
    type: 'channel',
    message: {
      attachments: [{
        color: COLORS[def.category] || COLORS.other,
        title: def.term,
        title_link: `https://www.hackterms.com/${actualWord || input}`,
        fields: [{
          title: 'Category',
          value: def.category || 'Unknown',
          short: true
        }, {
          title: 'Related',
          value: _.isArray(def.related) && def.related.length > 0 ? def.related.join(', ') : 'Unknown',
          short: true
        }, {
          title: 'Definition',
          value: def.body
        }],
        footer: `Definition 1/${definitions.length}`
      }]
    }
  }
}
