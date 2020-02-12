import Giphy from 'giphy'
import config from '../../../config'
import _ from 'lodash'

const giphy = new Giphy('dc6zaTOxFJmzC')

export const plugin_info = [{
  alias: ['gif'],
  command: 'gif',
  usage: 'gif <query>'
}]

export function gif(user, channel, input = false) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: gif <query> - Returns top 4 results for query' })

    giphy.search({
      q: input,
      limit: 20,
      rating: config.giphyRating || 'r',
      fmt: 'json'
    }, (err, res) => {
      if (err || _.get(res, 'pagination.count', 0) === 0) {
        return reject('No Gifs Found :(')
      }

      return resolve({
        type: 'channel',
        message: res.data[Math.floor(Math.random() * res.pagination.count)].images.fixed_height.url + `#${Math.floor(Math.random() * 1000)}`
      })
    })
  })
}
