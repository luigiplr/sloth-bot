import Promise from 'bluebird'
import needle from 'needle'
import { unescape } from 'lodash'

export const plugin_info = [{
  alias: ['cn', 'chucknorris'],
  command: 'chucknorris',
  usage: 'CHUCK THE NORRIS'
}]

export function chucknorris(user, channel, input = 'Chuck Norris') {
  return new Promise((resolve, reject) => {
    let split = input.split(' ')
    needle.get(`http://api.icndb.com/jokes/random?firstName=${split[0]}&lastName${split[1] ? '=' + split[1] : ''}`, (err, resp, body) => {
      if (!err && body && body.value) return resolve(unescape(body.value.joke.replace(/ +(?= )/g, '')))
      else return reject("Error fetching ChuckNorris Joke")
    })
  })
}
