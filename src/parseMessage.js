import _ from 'lodash';
import path from 'path';
import Promise from 'bluebird';
import {
    init as database
}
from './database';
import {
    find as findPlugins
}
from './utils/plugins';

database();

var plugins = [];

findPlugins().forEach(plugin => {
    plugins.push(require('./plugins/' + plugin))
});

module.exports = {
    parse(user, channel, text) {
        let command = text.substr(1).split(' ')[0];
        var context;
        // APPARENTLY NO FUCKING TEXT HAS A TEXT LENGTH OF THREE, HOW COULD I BE SO STUPID TO ASSUME OTHERWISE
        if (text.length > 3) {
            console.log('TEXT LENGTH IS GREATER THAN 1');
            context = text.substr(1).split(' ').splice(1).join(' ');
        } else {
            console.log('TEXT LENGTH IS NOT GREATER THAN 1');
            context = undefined;
        }
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