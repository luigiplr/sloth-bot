import Promise from 'bluebird'

export const plugin_info = [{
  alias: ['lod'],
  command: 'lod',
  usage: 'lod <person>'
}]

export function lod(user, channel, input = '') {
  return new Promise(resolve => resolve({ type: 'channel', message: 'ಠ_ಠ ' + input }))
}
