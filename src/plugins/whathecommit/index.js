import needle from 'needle'
import cheerio from 'cheerio'

export const plugin_info = [{
  alias: ['randomcommit'],
  command: 'randomcommit',
  usage: 'randomcommit - returns a random commit'
}]

export function randomcommit() {
  return new Promise((resolve, reject) => {
    needle.get(`http://whatthecommit.com/`, (err, resp, body) => {
      if (err || !body) {
        return reject('Error loading data')
      }

      try {
        const $ = cheerio.load(body)
        const msg = $('#content p:first-of-type').text()
        
        return resolve({ type: 'channel', message: msg ? msg : 'Error parsing data' })
      } catch (e) {
        return reject('Error parsing data')
      }
    })
  })
}
