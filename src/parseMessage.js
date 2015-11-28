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


        let plugin = _.find(plugins, plugin => {
            return _.find(plugin.commands, cmd => {
                return cmd.alias.indexOf(command) > -1;
            });
        });


        console.log(plugin);

        return new Promise((resolve, reject) => {
            if (!plugin)
                return reject('Command not found')


        });
    }
};