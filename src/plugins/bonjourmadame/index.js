import _ from 'lodash'
import MetaInspector from 'node-metainspector'
import moment from 'moment'
import needle from 'needle'
import config from '../../../config.json'

export const plugin_info = [{
  alias: ['hellolady', 'bonjourmadame'],
  command: 'bonjourmadame',
  usage: 'hellolady [void, \'today\', <MM.DD.YYYY>]'
}, {
  alias: ['hellosir', 'bonjourmonsieur'],
  command: 'bonjourmonsieur',
  usage: 'hellosir [void, \'today\']'
}, {
  alias: ['500px'],
  command: 'f00px',
  usage: '500px [feature|index] [index]'
}]

export function bonjourmadame(user, channel, input) {
  return new Promise((resolve, reject) => {
    let url
    let diff
    let attempts = 0

    if (input) {
      if (input === 'today') {
        url = 'http://dites.bonjourmadame.fr/'
      } else if (input.match(/[0-9.-]/g)) {
        diff = moment(new Date(input.match(/[0-9.-]/g).join(''))).diff(moment(), 'days')
        if (diff === 0) {
          url = 'http://dites.bonjourmadame.fr/'
        } else if (diff < 0) {
          url = 'http://dites.bonjourmadame.fr/page/' + (diff * -1 + 1)
        } else return resolve({ type: 'dm', message: 'Date must be in the past. Usage: hellolady [void, \'today\', <MM.DD.YYYY>]' })
      } else return resolve({ type: 'dm', message: 'Usage: hellolady [void, \'today\', <MM.DD.YYYY>]' })
    } else {
      url = 'http://dites.bonjourmadame.fr/random'
    }

    let client = new MetaInspector(url, { timeout: 5000 })

    client.on('fetch', () => (client.images && !client.images[3].match(/logo|avatar/i))
      ? resolve({ type: 'channel', message: client.images[3] })
      : reject('No picture found'))

    client.on('error', () => {
      if (attempts < 3) {
        attempts++
        client.fetch()
      } else return reject('Error loading page')
    })

    client.fetch()
  })
}

export function bonjourmonsieur(user, channel, input) {
  return new Promise((resolve, reject) => {
    const url = 'https://sexymenonline.tumblr.com/random'

    let client = new MetaInspector(url, { timeout: 5000 })

    client.on('fetch', () => {
      if (client.images && client.images.length > 1) {
        return resolve({ type: 'channel', message: client.images[1] })
      }

      return reject('No picture found')
    })

    client.on('error', () => reject('Error loading page'))

    client.fetch()
  })
}

const validFeatures = ['popular', 'highest_rated', 'upcoming', 'editors', 'fresh_today', 'fresh_yesterday', 'fresh_week']
const baseUrl = `https://api.500px.com/v1/photos?rpp=60&only=nude&image_size=2048&consumer_key=${config.f00pxAPIKey}`

export async function f00px(user, channel, input = 'popular') {
  let [ indexOrFeature, index ] = input.split(' ')
  let feature = validFeatures.includes(indexOrFeature) ? indexOrFeature : undefined
  index = parseInt(index)

  if (!feature) {
    if (_.isNaN(+indexOrFeature)) throw `Invalid feature, valid features are:\n\`${validFeatures.join(', ')}\``
    index = +indexOrFeature
    feature = 'popular'
  }

  const data = await needle('get', `${baseUrl}&feature=${feature}`)
  if (data.statusCode !== 200 || !data.body || !data.body.photos || !_.isArray(data.body.photos)) {
    throw 'Error fetching data'
  }

  const photos = data.body.photos
  index = (_.isNaN(index) || (index > photos.length - 1)) ? Math.floor(Math.random() * photos.length) : index
  const image = _.isArray(photos[index].image_url) ? photos[index].image_url[0] : photos[index].image_url

  if (!image || !_.isString(image)) {
    throw 'Error finding image!'
  }

  return { type: 'channel', message: `${image}#${Math.floor(Math.random() * 1000)}` }
}
