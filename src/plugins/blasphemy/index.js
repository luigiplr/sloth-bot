import Promise from 'bluebird'
import blasphemer from 'blasphemy'

export const plugin_info = [{
  alias: ['blasphemy'],
  command: 'blasphemy',
  usage: 'blasphemy'
}]

export function blasphemy() {
  return new Promise(resolve => {
    return resolve({ type: 'channel', message: blasphemer.blaspheme() });
  })
}

