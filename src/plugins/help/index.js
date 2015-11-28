import Promise from 'bluebird';
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
    default (user, channel, context, plugins) {
        return new Promise(resolve => {
            let commands = [];
            plugins.forEach(plugin => {
                plugin.help.forEach(help => {
                    let cmdalias = '';
                    help.command.forEach(cmd => {
                        cmdalias += config.prefix + cmd + ' ';
                    });

                    commands.push(cmdalias + '| ' + help.usage);
                })
            });
            resolve({
                type: 'channel',
                messages: commands
            });
        });
    }
};