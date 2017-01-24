import needle from 'needle'

export const plugin_info = [{
  alias: ['npm'],
  command: 'npm',
  usage: 'npm <package>'
}]

export function npm(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: npm <package> - Returns information on package' })
    let split = input.split(' ')[0].split('|')
    let p = split.length == 2 ? split[1].slice(0, -1) : split[0]
    needle.get(`https://registry.npmjs.com/${p}`, (err, resp, body) => {
      if (!err && body) {
        if (resp.statusCode == 404) return reject("Couldn't find a package with that name")

        let msg = [`*Package:* ${body.name}`,
          `*Latest Version:* ${body['dist-tags'].latest}`,
          `*Description:* ${body.description ? body.description : 'No description'}`,
          `https://npmjs.com/package/${p}`
        ]
        return resolve({ type: 'channel', messages: msg, options: { unfurl_links: false }})
      } else return reject("Error contacting npmjs")
    })
  })
}
