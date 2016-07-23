import Promise from 'bluebird'
import chuck from 'chuck-norris-api'

export const plugin_info = [{
  alias: ['cn', 'chucknorris'],
  command: 'chucknorris',
  usage: 'CHUCK THE NORRIS'
}]

export function chucknorris(user, channel, input) {
  return new Promise(resolve => {
    console.log(input)
    if (input) {
      let split = input.split(' ')
      chuck.getRandom({ firstName: split[0], lastName: split[1] || ' ' }).then(joke => {
        return resolve({ type: 'channel', message: joke.value.joke.replace(/ +(?= )/g, '') })
      })
    } else {
      chuck.getRandom().then(joke => {
        return resolve({ type: 'channel', message: joke.value.joke })
      })
    }
  })
}
