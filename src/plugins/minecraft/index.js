const mcping = require('mc-ping-updated')

export const plugin_info = [{
  alias: ['mc', 'minecraft'],
  command: 'mc',
  usage: 'mc <ip> [port] - returns info about a MC server'
}]

export function mc(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: mc <ip> [port] - returns info about a MC server' })
    var split = input.split(' ')
    split[0] = split[0].startsWith('<http:') ? split[0].split('|')[1].slice(0, -1) : split[0]
    mcping(split[0], parseInt(split[1]) || 25565, (err, resp) => {
      if (err || !resp) return reject("Error fetching server info")
      if (!resp.players || !resp.players.online) return resolve({ type: 'channel', message: 'No players are currently on the server' })
      var players = (resp.players || { sample: [] }).sample.map(player => player.name.length ? player.name : undefined).filter(a => a)
      return resolve({
        type: 'channel',
        messages: [
          `*Current players on the server (${resp.players.online}/${resp.players.max}):*`,
          players.length ? ` - ${players.join("\n - ")}` : "Unable to view players"
        ]
      })
    })
  })
}
