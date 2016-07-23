import Promise from 'bluebird'
import { includes } from 'lodash'
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
    let url, diff, attempts = 0

    if (input) {
      if (input == 'today') {
        url = 'http://dites.bonjourmadame.fr/'
      } else if (input.match(/[0-9\.-]/g)) {
        diff = moment(new Date(input.match(/[0-9\.-]/g).join(''))).diff(moment(), 'days')
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

    client.on('fetch', () => (client.images && !client.images[3].match(/logo|avatar/i)) ?
      resolve({ type: 'channel', message: client.images[3] }) : reject('No picture found'))

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
    let url = (input == 'today') ? 'http://www.bonjourmonsieur.fr/' : 'http://www.bonjourmonsieur.fr/monsieur/random.html'

    let client = new MetaInspector(url, { timeout: 5000 })

    client.on('fetch', () => (client.images && client.images[2].match(/uploads/i)) ?
      resolve({ type: 'channel', message: client.images[2] }) : reject('No picture found'))

    client.on('error', () => reject('Error loading page'))

    client.fetch()
  })
}

export function f00px(user, channel, input = 'popular') {
  return new Promise((resolve, reject) => {
    let inpt = input.split(' ')
    let validFeatures = ['popular', 'highest_rated', 'upcoming', 'editors', 'fresh_today', 'fresh_yesterday', 'fresh_week']
    let feature = includes(validFeatures, inpt[0]) ? inpt[0] : undefined
    if (!feature && isNaN(parseInt(inpt[0]))) return reject(`Invalid feature, valid features are: \n \`${validFeatures.join(', ')}\``)

    let url = `https://api.500px.com/v1/photos?rpp=60&only=nude&image_size=2048&consumer_key=${config.f00pxAPIKey}&feature=${feature}`

    needle.get(url, (err, resp, body) => {
      if (!err && body && body.photos) {
        let index = !feature ? parseInt(inpt[0]) : (!isNaN(parseInt(inpt[1])) ? parseInt(inpt[1]) : Math.floor(Math.random() * body.photos.length))
        index = index > body.photos.length - 1 ? Math.floor(Math.random() * body.photos.length) : index
        return resolve({ type: 'channel', message: body.photos[index].image_url })
      } else return reject(err || 'An unknown error occured')
    })
  })
}
