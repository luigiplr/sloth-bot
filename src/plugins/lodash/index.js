import Promise from 'bluebird'
import lodashFunctions from './utils/lodash'

export const plugin_info = [{
  alias: ['lodash'],
  command: 'lodash',
  usage: 'lodash <command> - returns info for command'
}]

export function lodash(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: lodash <command> | Searches for lodash function' })

    let method = input == '_' ? input : input.replace('_.', '').replace('_', '')
    if (lodashFunctions[method.toLowerCase()]) {
      let cmd = lodashFunctions[method.toLowerCase()]
      if (cmd.dontShow) return resolve({ type: channel, messages: [`<https://lodash.com/docs#${cmd.name}|lodash.com/docs#${cmd.name}>`] })
      let msg = [`*Method:* _.${cmd.name}`,
        `*Command:* \`${cmd.command}\``,
        `*Since:* ${cmd.since}`,
        `*Description:* ${cmd.description}`,
        `<https://lodash.com/docs#${cmd.name}|lodash.com/docs#${cmd.name}>`
      ];
      return resolve({ type: 'channel', messages: msg })
    } else reject("No function with that name")

  })
}
