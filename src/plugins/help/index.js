import Promise from 'bluebird'
import _ from 'lodash'
import config from '../../../config.json'

export const plugin_info = [{
  alias: ['help', 'h'],
  command: 'help',
  usage: 'shows help for commands'
}]

export function help(user, channel, context, ts, plugins, userLevel) {
  return new Promise(resolve => {
    let helpList = ["```"],
      commands = [],
      aliases = []

    plugins.forEach(plugin => {
      if (plugin.plugin_info && Array.isArray(plugin.plugin_info)) {
        plugin.plugin_info.forEach(help => {
          if (!help.alias || !help.usage || (help.userLevel && help.userLevel.indexOf(userLevel) === -1)) return

          let cmdalias = '';
          help.alias.forEach(cmd => cmdalias += config.prefix + cmd + ' ')
          aliases.push(cmdalias)
          commands.push(`${cmdalias}%pad%| ${help.usage}`)
        });
      }
    });
    let padding = aliases.sort((a, b) => {
      return b.length - a.length
    })[0].length + 1

    helpList.push(commands.map(cmd => {
      let initialSize = cmd.split('|')[0].length - 5 // the %pad%
      return cmd.replace("%pad%", new Array(padding - initialSize).join(' '))
    }).sort())
    helpList.push("```");

    return resolve({ type: 'dm', messages: _.flatten(helpList) })
  })
}
