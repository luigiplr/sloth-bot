import Promise from 'bluebird';
import _ from 'lodash'
const config = require('../../../config.json');

module.exports = {
  commands: [{
    alias: ['help', 'h'],
    command: 'default'
  }],
  help: [{
    command: ['help', 'h'],
    usage: 'shows help for commands'
  }],
  default (user, channel, context, ts, plugins) {
    return new Promise(resolve => {
      let helpList = ["```"];
      let commands = [];
      let aliases = [];

      plugins.forEach(plugin => {
        if (plugin.help && Array.isArray(plugin.help)) {
          plugin.help.forEach(help => {
            if (!help.command || !help.usage) return;

            let cmdalias = '';
            help.command.forEach(cmd => cmdalias += config.prefix + cmd + ' ');
            aliases.push(cmdalias);
            commands.push(`${cmdalias}%pad%| ${help.usage}`);
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

      return resolve({
        type: 'dm',
        messages: _.flatten(helpList)
      });
    });
  }
};
