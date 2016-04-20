import Promise from 'bluebird'
import _ from 'lodash'
import chuck from './utils/chuck'

export const plugin_info = [{
  alias: ['cn', 'chucknorris'],
  command: 'chucknorris',
  usage: 'CHUCK THE NORRIS'
}]

export function chucknorris(user, channel, input = 'Chuck Norris') {
  return new Promise(resolve => {
    new chuck(input).random((err, joke) => resolve({ type: 'channel', message: !err ? _.unescape(joke.replace(/ +(?= )/g, '')) : err }))
  })
}

