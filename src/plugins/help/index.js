const config = require('../../../config.json')

export const plugin_info = [{
  alias: ['help', 'h'],
  command: 'help',
  usage: 'shows help for commands'
}]

export function help(user, channel, context, ts, plugins, userLevel) {
  return new Promise(resolve => {
    let commands = ['```']

    plugins.forEach(plugin => {
      if (plugin.plugin_info && Array.isArray(plugin.plugin_info)) {
        plugin.plugin_info.forEach(help => {
          if (!help.command || !help.usage || (help.userLevel && help.userLevel.indexOf(userLevel) === -1)) return

          let cmdalias = ''
          help.alias.forEach(cmd => {
            cmdalias += config.prefix + cmd + ' ';
          })
          return commands.push(cmdalias + ' | ' + help.usage)
        })
      }
    })
    commands.push('```');
    return resolve({ type: 'dm', messages: commands })
  })
}

