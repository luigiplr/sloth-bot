import Promise from 'bluebird'
import needle from 'needle'

export const plugin_info = [{
  alias: ['devexcuse'],
  command: 'devexcuse',
  usage: 'devexcuse - returns a dev excuse'
}]

export function devexcuse() {
  return new Promise((resolve, reject) => {
    needle.get('http://developerexcuses.com/', (err, resp, body) => {
      if (err || !body) return reject("Error fetching dev excuse, <insert witty dev excuse here>")
      let rx = /<a.*?>(.*?)<\/a>/
      let match = rx.exec(body)
      return resolve({ type: 'channel', message: match ? match[1] : 'No more excuses' })
    })
  })
}
