import needle from 'needle'
import config from '../../../config.json'
import _ from 'lodash'

const apiUrl = `https://api.stackexchange.com/2.2`

export const plugin_info = [{
  alias: ['so', 'stackoverflow'],
  command: 'stackoverflow',
  usage: 'stackoverflow <query>'
}]

export async function stackoverflow(user, channel, input) {
  if (!input) return { type: 'dm', message: 'Usage: stackoverflow <query> - Searches Stack Overflow' }

  const data = await needle('get', `${apiUrl}/search/advanced?order=desc&sort=relevance&site=stackoverflow&pagesize=12&key=${config.stackExchangeAPIKey}&q=${input}`)

  if (data.statusCode !== 200) {
    throw 'Error getting data from Stack Overflow'
  }

  if (_.get(data, ['body', 'items'], []).length === 0) {
    throw 'Got no results'
  }

  return {
    type: 'channel',
    options: { unfurl_links: false },
    messages: [
      `*Most relevant results:*`,
      ...data.body.items.map(item => {
        const icon = item.is_answered ? ':heavy_check_mark:' : ':x:'
        const tags = item.tags && item.tags.length > 0 ? `- [${item.tags.slice(0, 2).join(', ')}]` : ''

        return (`${icon} <${item.link}|${item.title}> ${tags}`).trim()
      })
    ]
  }
}
