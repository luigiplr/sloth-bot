import needle from 'needle'
import cheerio from 'cheerio'
import _ from 'lodash'

export const plugin_info = [{
  alias: ['imdb'],
  command: 'imdb',
  usage: 'imdb <id> - returns info for imdb id'
}]

const IMDB_RX = /^tt\d{7}$/

export async function imdb(user, channel, input) {
  if (!input) {
    return { type: 'dm', message: 'Usage: imdb <imdb id> - Returns information from IMDB for an IMDB id.' }
  }

  if (!IMDB_RX.test(input)) {
    throw 'Invalid IMDB ID.'
  }

  if (!input.startsWith('tt')) {
    throw 'Only movie/show IMDB IDs are supported'
  }

  try {
    const pageData = await needle('GET', `https://www.imdb.com/title/${input}/`).then(resp => resp.body)

    if (!pageData) {
      throw 'Error fetching data from IMDB'
    }

    const $ = cheerio.load(pageData)

    try {
      const schemaData = $('script[type="application/ld+json"]').text().trim()
      const data = JSON.parse(schemaData)

      const isEpisode = data['@type'] === 'TVEpisode'
      const description = $('.plot_summary .summary_text').text().trim()

      let seasonNum
      let episodeNum
      if (isEpisode) {
        const seasonAndEpisodeText = $('#title-overview-widget div.bp_item:not(.np_next):not(.np_prev) .bp_heading').text().trim()
        const seMatch = seasonAndEpisodeText.match(/^Season (\d+) \| Episode (\d+)$/i)
        console.log(seasonAndEpisodeText, seMatch)

        if (seMatch) {
          seasonNum = +seMatch[1]
          episodeNum = +seMatch[2]
        }
      }

      const date = new Date(data.datePublished)
      const year = date.getFullYear()
      const title = `${data.name}${!_.isNaN(year) && !isEpisode ? ` (${year})` : ''}`

      return {
        type: 'channel',
        message: {
          attachments: [{
            color: '#f5c518',
            title: title,
            title_link: `https://www.imdb.com/title/${input}/`,
            text: description && description.length > 0 ? description : null,
            image_url: data.image && data.image.replace('_V1_', '_V1_SX132'),
            footer: 'IMDb',
            footer_icon: 'https://m.media-amazon.com/images/G/01/IMDb/BG_rectangle._CB1509060989_SY230_SX307_AL_.png',
            fields: [{
              title: 'IMDb ID',
              value: `<https://www.imdb.com/title/${input}|${input}>`,
              short: true
            }, {
              title: 'Released',
              value: !_.isNaN(date) && data.datePublished,
              short: true
            }, {
              title: 'Rating',
              value: data.aggregateRating && data.aggregateRating.ratingValue,
              short: true
            }, {
              title: 'Votes',
              value: data.aggregateRating && numberWithCommas(data.aggregateRating.ratingCount),
              short: true
            }, {
              title: 'Season/Episode',
              value: (_.isFinite(seasonNum) && _.isFinite(episodeNum)) && `S${seasonNum < 10 ? '0' : ''}${seasonNum}E${episodeNum < 10 ? '0' : ''}${episodeNum}`,
              short: true
            }, {
              title: 'Director',
              value: data.director && `<https://www.imdb.com${data.director.url}|${data.director.name}>`,
              short: true
            }, {
              title: 'Genres',
              value: data.genre && data.genre.join(', '),
              short: true
            }, {
              title: 'Classification',
              value: data.contentRating && data.contentRating,
              short: true
            }, {
              title: 'Type',
              value: data['@type'] && data['@type'],
              short: true
            }].filter(field => field.value)
          }]
        }
      }
    } catch (e) {
      console.error('Error parsing schema data', e)
      throw 'Error parsing schema'
    }
  } catch (e) {
    console.error('Error fetching data from IMDB')
    throw 'Error fetching data from IMDB'
  }
}

// https://stackoverflow.com/a/2901298
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
