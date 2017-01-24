import Giphy from 'giphy'

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
      q: input.replace(' ', '+'),
      limit: 4,
      rating: 'r',
      fmt: 'json'
    }, (err, res) => {
      if (res.pagination.count > 0)
        return resolve({
          type: 'channel',
          message: res.data[Math.floor(Math.random() * res.pagination.count)].images.fixed_height.url
        });
      else return reject('No Gifs Found :(')
    })
  })
}
