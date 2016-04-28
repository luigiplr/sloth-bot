import Promise from 'bluebird'
import MetaInspector from 'node-metainspector'
import moment from 'moment'

export const plugin_info = [{
  alias: ['hellolady', 'bonjourmadame'],
  command: 'bonjourmadame',
  usage: 'hellolady [void, \'today\', <MM.DD.YYYY>]'
}, {
  alias: ['hellosir', 'bonjourmonsieur'],
  command: 'bonjourmonsieur',
  usage: 'hellosir [void, \'today\']'
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
