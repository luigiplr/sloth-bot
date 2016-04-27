import Promise from 'bluebird'
import devexcuses from 'developerexcuses'

export const plugin_info = [{
  alias: ['devexcuse'],
  command: 'devexcuse',
  usage: 'devexcuse - returns a dev excuse'
}]

export function devexcuse() {
  return new Promise(resolve => devexcuses((err, excuse) => resolve({ type: 'channel', message: !err ? excuse : err })))
}
