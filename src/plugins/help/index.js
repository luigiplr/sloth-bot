import _ from 'lodash';
import Promise from 'bluebird';


module.exports = {
    commands: [{
        alias: ['help', 'h'],
        command: 'default'
    }],
    help: [{
        command: 'help',
        usage: 'shows help for commands'
    }],
    default (user, channel, context, plugins) {
        return new Promise(resolve => {
            let commands = [];


            plugins.forEach(plugin => {
                console.log(plugin.help)
                plugin['help'].forEach(command => {
                    commands.push(command.usage)

                })
            });

            resolve({
                type: 'channel',
                message: commands
            });
            console.log(plugins)
        });
    }
};