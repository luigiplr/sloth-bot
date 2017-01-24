import MetaInspector from 'node-metainspector'

export const plugin_info = [{
  alias: ['maybensfw', 'ita'],
  command: 'maybensfw',
  usage: 'maybensfw'
}]

export function maybensfw() {
  return new Promise((resolve, reject) => {
    let url = 'http://www.imposetonanonymat.com/random'
    let client = new MetaInspector(url, { timeout: 5000 })

    client.on('fetch', () => {
      if (client.images && !client.images[1].match(/logo|avatar/i)) return resolve({ type: 'channel', message: client.images[1] })
      else return reject('No picture found')
    })

    client.on('error', () => reject('Error loading page'))
    client.fetch();
  })
}
