import Promise from 'bluebird';
import permissions from '../../permissions';
import config from '../../../config.json';

module.exports = {
    commands: [{
        alias: ['set'],
        userLevel: ['admin', 'superadmin'],
        command: 'set'
    }, {
        alias: ['ignore'],
        userLevel: ['admin', 'superadmin'],
        command: 'ignore'
    }, {
        alias: ['unignore'],
        userLevel: ['admin', 'superadmin'],
        command: 'unignore'
    }, {
        alias: ['mute'],
        userLevel: ['admin', 'superadmin'],
        command: 'mute'
    }, {
        alias: ['unmute'],
        userLevel: ['admin', 'superadmin'],
        command: 'unmute'
    }, {
        alias: ['admins'],
        command: 'admins'
    }, {
        alias: ['owners'],
        command: 'owners'
    }, {
        alias: ['ignored'],
        command: 'ignored'
    }, {
        alias: ['muted'],
        command: 'muted'
    }],
    help: [{
        command: ['set'],
        usage: 'set <username> <level> - set users permissions level'
    }, {
        command: ['ignore'],
        usage: 'ignore <username> - have bot ignore all commands from a user'
    }, {
        command: ['unignore'],
        usage: 'unignore <username> - unignores a user'
    }, {
        command: ['ignore'],
        usage: 'ignore <username> - have bot ignore all commands from a user'
    }, {
        command: ['unignore'],
        usage: 'unignore <username> - unignores a user'
    }, {
        command: ['admins'],
        usage: 'admins - lists admins'
    }, {
        command: ['owners'],
        usage: 'owners - lists owners (super admins)'
    }, {
        command: ['ignored'],
        usage: 'ignored - lists ignored users'
    }, {
        command: ['muted'],
        usage: 'muted - lists muted users'
    }],
    admins() {
        return new Promise(resolve => {
            resolve({
                type: 'channel',
                message: 'Admins: ' + permissions.admins.concat(permissions.superadmins).join(', ')
            });
        });
    },
    owners() {
        return new Promise(resolve => {
            resolve({
                type: 'channel',
                message: 'Owners: ' + permissions.superadmins.join(', ')
            });
        });
    },
    ignored() {
        return new Promise(resolve => {
            resolve({
                type: 'channel',
                message: permissions.ignored[0] ? 'Currently ignored: ' + permissions.ignored.join(', ') : 'No ignored users'
            });
        });
    },
    muted() {
        return new Promise(resolve => {
            resolve({
                type: 'channel',
                message: permissions.muted[0] ? 'Currently muted: ' + permissions.muted.join(', ') : 'No muted users'
            });
        });
    },
    unignore(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return reject("Please specify a user");
            let username = input.split(' ')[0].toString().toLowerCase();
            if (username) {
                permissions.add(username, 'unignore');
                resolve({
                    type: 'channel',
                    message: 'Unignoreing ' + username
                });
            } else
                resolve({
                    type: 'channel',
                    message: 'Invalid User Name'
                });
        });
    },
    ignore(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return reject("Please specify a user");
            let username = input.split(' ')[0].toString().toLowerCase();
            if (username && username != config.botname) {
                permissions.add(username, 'ignore');
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
    unmute(user, channel, input) {
        return new Promise((resolve, reject) => {
            let username = input.split(' ')[0].toString().toLowerCase();
            if (!input)
                return reject("Please specify a user");
            if (username) {
                permissions.add(username, 'unmute');
                resolve({
                    type: 'channel',
                    message: 'Unmuting ' + username
                });
            } else
                resolve({
                    type: 'channel',
                    message: 'Invalid User Name'
                });
        });
    },
    mute(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return reject("Please specify a user");
            let username = input.split(' ')[0].toString().toLowerCase();
            if (username && username != config.botname) {
                permissions.add(username, 'mute');
                resolve({
                    type: 'channel',
                    message: 'Muting ' + username
                });
            } else
                resolve({
                    type: 'channel',
                    message: 'Invalid User Name'
                });
        });
    },
    set(user, channel, input, ts, plugin, userLevel) {
        return new Promise((resolve, reject) => {
            if (!input)
                return reject("Please specify a user");
            let username = input.split(' ')[0].toString().toLowerCase();
            let level = input.split(' ')[1].toString().toLowerCase().replace(/[s]$/, '');
            let levels = (userLevel === 'admin') ? ['user', 'admin'] : ['user', 'admin', 'superadmin'];

            if (username && levels.indexOf(level) > -1) {
                permissions.add(username, level);
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