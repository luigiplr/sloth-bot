import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';
import database from './database';
import {
    find as findPlugins
}
from './utils/plugins';



var plugins = [];

findPlugins().forEach(plugin => {
    plugins.push(require('./plugins/' + plugin))
});

module.exports = {
    parse(user, channel, text) {
        let command = text.substr(1).split(' ')[0];
        let context = (text.indexOf(' ') >= 0) ? text.substr(1).split(' ').splice(1).join(' ') : undefined;
        return new Promise((resolve, reject) => {
            let call = false;
            let plugin = _.find(plugins, plugin => {
                return _.find(plugin.commands, cmd => {
                    if (cmd.alias.indexOf(command) > -1) {
                        call = cmd.command;
                        return true;
                    } else
                        return false;
                });
            });

            if (!plugin)
                return reject('Command not found')

            plugin[call](user, channel, context, plugins)
                .then(resolve)
                .catch(reject);
        });
    }
};