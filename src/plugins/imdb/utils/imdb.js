import needle from 'needle'
import cheerio from 'cheerio'
import _ from 'lodash'
import moment from 'moment'

function getEpisodeNumber(x) {
  return x <= 9 ? `0${x}` : x
}

function getSeasonAndEpisodeNumber(seasonNum, episodeNum) {
  return (_.isFinite(seasonNum) && _.isFinite(episodeNum))
    ? `S${getEpisodeNumber(seasonNum)}E${getEpisodeNumber(episodeNum)}`
    : null
}

// https://stackoverflow.com/a/2901298
function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

const imdbTypes = {
  'tv series': 'TVS',
  'feature': 'MOV',
  'tv movie': 'TVM'
}

export const getDataViaImdb = async imdbId => {
  try {
    const pageData = await needle('GET', `https://www.imdb.com/title/${imdbId}/`)

    if (pageData.statusCode !== 200 || pageData.body === null) {
      throw 'Error fetching data from IMDB'
    }

    const $ = cheerio.load(pageData.body)

    try {
      const schemaData = $('script[type="application/ld+json"]').text().trim()
      const data = JSON.parse(schemaData)

      const isEpisode = data['@type'] === 'TVEpisode'

      // Episode specific variables
      let seasonNum
      let episodeNum
      let parentShowTitle
      let parentShowUrl

      if (isEpisode) {
        const parentShow = $('.titleParent a')
        parentShowTitle = parentShow.text().trim()
        parentShowUrl = (parentShow.attr('href') || '').split('?')[0]

        const seasonAndEpisodeText = $('#title-overview-widget div.bp_item:not(.np_next):not(.np_prev) .bp_heading').text().trim()
        const seMatch = seasonAndEpisodeText.match(/^Season (\d+) \| Episode (\d+)$/i)

        if (seMatch) {
          seasonNum = +seMatch[1]
          episodeNum = +seMatch[2]
        }
      }

      const seasonAndEpisode = getSeasonAndEpisodeNumber(seasonNum, episodeNum)
      const date = new Date(data.datePublished)
      const year = date.getFullYear()
      const title = `${seasonAndEpisode ? `${seasonAndEpisode} - ` : ''}${data.name}${!_.isNaN(year) && !isEpisode ? ` (${year})` : ''}`

      return {
        type: 'channel',
        message: {
          attachments: [{
            color: '#f5c518',
            title: title,
            title_link: `https://www.imdb.com/title/${imdbId}/`,
            text: schemaData.description && schemaData.description.length > 0 ? schemaData.description : null,
            image_url: data.image && data.image.replace('_V1_', '_V1_SX132'),
            footer: 'IMDb',
            footer_icon: 'https://m.media-amazon.com/images/G/01/IMDb/BG_rectangle._CB1509060989_SY230_SX307_AL_.png',
            fields: [{
              title: 'IMDb ID',
              value: `<https://www.imdb.com/title/${imdbId}|${imdbId}>`,
              short: true
            }, {
              title: 'Released',
              value: !_.isNaN(date) && moment(date).format('MMMM Do, YYYY'),
              short: true
            }, {
              title: 'Parent Show',
              value: (isEpisode && parentShowTitle && parentShowUrl) && `<https://www.imdb.com${parentShowUrl}|${parentShowTitle}>`,
              short: true
            }, {
              title: 'Season/Episode',
              value: seasonAndEpisode,
              short: true
            }, {
              title: 'Rating',
              value: data.aggregateRating && `${data.aggregateRating.ratingValue}/10`,
              short: true
            }, {
              title: 'Votes',
              value: data.aggregateRating && numberWithCommas(data.aggregateRating.ratingCount),
              short: true
            }, {
              title: 'Classification',
              value: data.contentRating && data.contentRating,
              short: true
            }, {
              title: 'Genres',
              value: data.genre && (Array.isArray(data.genre) ? data.genre.join(', ') : data.genre),
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

export const getImdbDataViaSearch = async (rawQuery, showDetails, year) => {
  try {
    const query = rawQuery.toLowerCase().replace(/ /g, '_').trim()
    const firstLetter = query.slice(0, 1).toLowerCase()
    const rawData = await needle(`https://v2.sg.media-imdb.com/suggests/${firstLetter}/${query}.json`)

    if (rawData.statusCode !== 200) {
      throw 'Error getting data from IMDB Search'
    }

    const data = JSON.parse(rawData.body.toString().split('(').slice(1).join('').slice(0, -1))
    const items = _.get(data, 'd', []).filter(item => item.q && item.q.match(/(tv movie|tv series|feature)/i) && (!year || year && year === item.y))

    if (items.length === 0) {
      return { type: 'channel', message: 'Got no results from IMDB' }
    }

    if (showDetails || items.length === 1) {
      return await getDataViaImdb(items[0].id)
    }

    return {
      type: 'channel',
      message: {
        attachments: [{
          pretext: [
            '```',
            items.map(item => `<https://www.imdb.com/title/${item.id}|${item.id}> - ${imdbTypes[item.q.toLowerCase()]} - ${item.y || 'UNKN'} - ${item.l}`).join('\n'),
            '```'
          ].join('\n')
        }]
      }
    }
  } catch (e) {
    console.error(e)
    throw 'Error parsing IMDB search data'
  }
}
