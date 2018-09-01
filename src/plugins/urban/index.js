import needle from 'needle'
import _ from 'lodash'

export const plugin_info = [{
  alias: ['urban'],
  command: 'urbandictionary',
  usage: 'urban <word> - returns urban definition for word'
}, {
  alias: ['ru', 'randomurban'],
  command: 'randomurban',
  usage: 'randomurban - returns random urban'
}]

export async function urbandictionary(user, channel, input) {
  if (!input) {
    throw 'Specify a word pls'
  }

  let indexMatch = input.match(/( \d\d?)$/)
  let index = 0
  if (indexMatch) {
    index = +indexMatch[1].trim() < 0 ? 0 : +indexMatch[1].trim() - 1
    input = input.replace(/( \d\d?)$/, '')
  }

  try {
    const data = await needle('GET', 'http://api.urbandictionary.com/v0/define', { term: input }, {})
    const items = _.get(data, 'body.list', [])

    if (items.length === 0) {
      throw 'No results found'
    }

    index = index > items.length - 1 ? items.length - 1 : +index

    const item = items[index]
    const definition = cleanString(item.definition)
    const example = cleanString(item.example, true)

    if (!definition) {
      throw 'Got data but no definition??'
    }

    return {
      type: 'channel',
      message: {
        attachments: [{
          author_name: 'Urban Dictionary',
          author_icon: 'https://www.urbandictionary.com/favicon.ico',
          title: item.word,
          title_link: item.permalink,
          color: '#1d2439',
          footer: `${index + 1}/${items.length} results`,
          text: [
            `[:thumbsup: ${item.thumbs_up || 'N/A'} | :thumbsdown: ${item.thumbs_down || 'N/A'}]`,
            definition,
            example && `\n${example}`
          ].filter(Boolean).join('\n')
        }]
      }
    }
  } catch (err) {
    console.error('Error fetching data from urban', err)
    throw 'Error fetching data from Urban Dictionary'
  }
}

export async function randomurban() {
  try {
    const data = await needle('GET', 'https://api.urbandictionary.com/v0/random')

    const item = _.get(data, ['body', 'list', 0], {})
    const definition = cleanString(item.definition)
    const example = cleanString(item.example, true)

    if (!definition) {
      throw 'Error fetching data from Urban Dictionary'
    }

    return {
      type: 'channel',
      message: {
        attachments: [{
          author_name: 'Urban Dictionary',
          author_icon: 'https://www.urbandictionary.com/favicon.ico',
          title: item.word,
          title_link: item.permalink,
          color: '#1d2439',
          text: [
            `[:thumbsup: ${item.thumbs_up || 'N/A'} | :thumbsdown: ${item.thumbs_down || 'N/A'}]`,
            definition,
            example && `\n${example}`
          ].filter(Boolean).join('\n')
        }]
      }
    }
  } catch (err) {
    console.error('Error fetching random from urban', err)
    throw 'Error fetching data from Urban Dictionary'
  }
}

const bracketRx = /\[(.*?)\]/g

// Clean up Urbans fucked up strings
function cleanString(str, example) {
  if (!str || str.trim().length === 0) {
    return
  }

  let match
  let newStr = str
  while ((match = bracketRx.exec(str)) !== null) {
    newStr = newStr.replace(match[0], match[1])
  }

  return unescape(newStr)
    .split('\n')
    .filter(e => e && e.trim() !== '' && !e.trim().match(/^-+$/))
    .map(e => example ? `_${e.trim()}_` : e.trim())
    .join('\n')
}
