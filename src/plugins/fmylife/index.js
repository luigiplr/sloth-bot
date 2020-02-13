import needle from 'needle'
import cheerio from 'cheerio'

export const plugin_info = [{
  alias: ['fml', 'fmylife'],
  command: 'fmylife',
  usage: 'fml'
}]

export async function fmylife() {
  const response = await needle('get', 'https://www.fmylife.com/random')
  if (response.statusCode !== 200) {
    throw 'Error loading data.'
  }

  const $ = cheerio.load(response.body)
  const text = $('#content article.article-panel > .panel > .article-contents > a.article-link').first().text()

  if (!text) {
    throw 'Error finding content.'
  }

  return {
    type: 'channel',
    message: `>${text.trim()}`
  }
}
