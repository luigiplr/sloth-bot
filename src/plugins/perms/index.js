import Promise from 'bluebird';
import permissions from '../../permissions';
const config = require('../../../config.json');

module.exports = {
    commands: [{
        alias: ['set'],
        command: 'set'
    }, {
        alias: ['ignore'],
        command: 'ignore'
    }, {
        alias: ['unignore'],
        command: 'unignore'
    }],
    help: [],
    unignore(user, channel, input, plugin, userlevel) {
        return new Promise(resolve => {
            if (userlevel === 'user')
                return resolve({
                    type: 'channel',
                    message: 'Insufficient Permissions'
                });

            let username = input.split(' ')[0].toString().toLowerCase();

            if (username) {
                permissions.add(username, 'unignore')
                resolve({
                    type: 'channel',
                    message: 'Unignore ' + username
                });
            } else
                resolve({
                    type: 'channel',
                    message: 'Invalid User Name'
                });
        });
    },
    ignore(user, channel, input, plugin, userlevel) {
        return new Promise(resolve => {
            if (userlevel === 'user')
                return resolve({
                    type: 'channel',
                    message: 'Insufficient Permissions'
                });

            let username = input.split(' ')[0].toString().toLowerCase();

            if (username) {
                permissions.add(username, 'ignore')
                resolve({
                    type: 'channel',
                    message: 'Ignoring ' + username
                });
            } else
                resolve({
                    type: 'channel',
                    message: 'Invalid User Name'
                });
        });
    },
    set(user, channel, input, plugin, userlevel) {
        return new Promise(resolve => {
            if (userlevel === 'user')
                return resolve({
                    type: 'channel',
                    message: 'Insufficient Permissions'
                });

            let username = input.split(' ')[0].toString().toLowerCase();
            let level = input.split(' ')[1].toString().toLowerCase();
            let levels = (userlevel === 'admin') ? ['user', 'admin'] : ['user', 'admin', 'superadmin'];

            if (username && (levels.indexOf(level) > -1)) {
                permissions.add(username, level)
                resolve({
                    type: 'channel',
                    message: 'Set ' + username + ' to ' + level
                });
            } else
                resolve({
                    type: 'channel',
                    message: 'Invalid User Level'
                });
        });
    }
};