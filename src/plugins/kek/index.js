import Promise from 'bluebird'
import needle from 'needle'
import config from '../../../config.json'

const subscriberUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=TheFineBros&fields=items/statistics/subscriberCount&key=${config.googleAPIKey}`
const originalSubCount = 14080108
var lastCheck

export const plugin_info = [{
  alias: ['finebros'],
  command: 'topkek',
  usage: 'finebros - shows how many subs the finebros have lost'
}]

export function topkek() {
  return new Promise((resolve, reject) => {
    if (!config.googleAPIKey) return reject("Error: Google APIKey required to use this function")

    needle.get(subscriberUrl, (err, resp, body) => {
      if (!err && body) {
        let subCount = body.items[0].statistics.subscriberCount
        let newCount = originalSubCount - subCount
        resolve({
          type: 'channel', // Sue me
          message: 'TheFineFags have lost about *' + addStupidCommas(newCount) + '* subscribers in total since their fuckup' + (newCount > lastCheck ? (' and have lost *' + addStupidCommas((newCount - lastCheck)) + '* more subscribers since I last checked') : newCount < lastCheck ? (' but have gained *' + addStupidCommas((lastCheck - newCount)) + '* since I last checked') : '')
        });
        lastCheck = newCount
      } else return reject(err)
    })
  })
}

// Better source this shit before i get sued http://stackoverflow.com/a/2901298
const addStupidCommas = x => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
