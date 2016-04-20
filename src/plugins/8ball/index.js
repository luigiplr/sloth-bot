import Promise from 'bluebird';
import ateball from 'eightball'

export const plugin_info = [{
  alias: ['8ball'],
  command: 'eightball',
  usage: '8ball <question>'
}]

export function eightball(user, channel, input) {
  return new Promise(resolve => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: 8ball <question> | Ask the magic 8ball for a prediction~~~' });
    return resolve({ type: 'channel', message: ateball() });
  });
}

