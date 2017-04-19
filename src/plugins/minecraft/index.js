const mineping = require('mineping')

export const plugin_info = [{
  alias: ['mc', 'minecraft'],
  command: 'mc',
  usage: 'mc <ip> [port] - returns info about a MC server'
}]

export function mc(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: mc <ip> [port] - returns info about a MC server' })
    const split = input.split(' ')
    
    mineping(3, split[0], split[1] || '25565', (err, resp) => {
      if (err || !resp) return reject("Error fetching server info")
      const players = (resp.players || []).map(player => player.name || "UNKNOWN")
      if (!players.length) return resolve({ type: 'channel', message: 'No players are currently on the server' })
      return resolve({ type: 'channel', message: `Current Players on server:\n- ${players.join('\n- ')}` })
    })
  })
}