import Promise from 'bluebird'
import scrapeMDN from 'scrape-mdn'

export const plugin_info = [{
  alias: ['mdn'],
  command: 'mdn',
  usage: 'mdn <query> - returns MDN info for query'
}]

export function mdn(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: mdn <query> - Returns info about query from the Mozilla Developer Network' })
    let query = (input.includes('<') && input.includes('>')) ? input.split('|')[1].replace(/<|>/, '') : input

    scrapeMDN.search(query).then(results => {
      if (!results || !results[0]) return reject("Nothing found for that query")
      const { url, title, description } = results[0]
      let attachment = {
        attachments: [{
          author_name: 'Mozilla Developer Network',
          author_link: 'https://developer.mozilla.org',
          author_icon: 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png',
          thumb_url: 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png',
          fallback: `${title}: ${description || 'No description'} ${url}`,
          title,
          title_link: url,
          text: description || 'No description'
        }]
      }
      return resolve({ type: 'channel', message: attachment })
    })
  })
}
