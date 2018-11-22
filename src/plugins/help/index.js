import { flatten } from 'lodash'
import config from '../../../config.json'
import { sendMessage } from '../../slack'

export const plugin_info = [{
  alias: ['help', 'h'],
  command: 'help',
  usage: 'shows help for commands'
}]

export function help(user, channel, context = 0, ts, plugins, userLevel) {
  return new Promise(resolve => {
    let noAdmin = parseInt(context)
    let helpList = [[], []]
    let commands = [[], []]
    let aliases = [[], []]

    plugins.forEach(plugin => {
      if (plugin.plugin_info && Array.isArray(plugin.plugin_info)) {
        plugin.plugin_info.forEach(help => {
          if (!help.alias || !help.usage || (help.userLevel && help.userLevel.indexOf(userLevel) === -1) || (help.userLevel && noAdmin)) return

          let cmdalias = ''
          help.alias.forEach(cmd => (cmdalias += config.prefix + cmd + ' '))
          if (aliases[0].length < 45) {
            aliases[0].push(cmdalias)
            commands[0].push(`${cmdalias}%pad%| ${help.usage}`)
          } else { // dirty cheat
            aliases[1].push(cmdalias)
            commands[1].push(`${cmdalias}%pad%| ${help.usage}`)
          }
        })
      }
    })

    commands.forEach((thing, i) => {
      let padding = aliases[i].sort((a, b) => {
        return b.length - a.length
      })[0].length + 1

      helpList[i].push('```')
      helpList[i].push(commands[i].map(cmd => {
        let initialSize = cmd.split('|')[0].length - 5 // the %pad%
        return cmd.replace("%pad%", new Array(padding - initialSize).join(' '))
      }).sort())
      helpList[i].push("```")
    })

    helpList.forEach(helps => {
      sendMessage('@' + user.name, flatten(helps).join('\n'))
    })

    return resolve()
  })
}
