import Promise from 'bluebird';
import permissions from '../../permissions';
import permsUtil from './utils/permUtil';

const getUserLevel = user => {
    if ((permissions.superadmins.indexOf(user) > -1))
        return 'superadmin';
    else if ((permissions.admins.indexOf(user) > -1))
        return 'admin';
    else
        return 'user';
};

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
        userLevel: ['superadmin'],
        command: 'mute'
    }, {
        alias: ['unmute'],
        userLevel: ['superadmin'],
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
    }, {
        alias: ['permaignore'],
        command: 'permaIgnore'
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
    }, {
        command: ['permaignore'],
        usage: 'permaignore <username> - have the bot permanently ignore all commands from user'
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
            let msg = permissions.allIgnored[0] ? (`Currently ignored: ${permissions.ignored[0] ? permissions.ignored.join(', ') + ',' : ''}${permissions.permaIgnored[0] ? ' *' + permissions.permaIgnored.join(', ') + '*' : ''}`) : null;
            resolve({
                type: 'channel',
                message: msg || 'No ignored users'
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
    unignore(user, channel, input, ts, plugin, adminLevel) {
        return new Promise((resolve, reject) => {
            permsUtil.doTheThing(input, 'unignore', adminLevel).then(resp => {
                resolve({
                    type: 'channel',
                    message: resp
                });
            }).catch(reject);
        });
    },
    ignore(user, channel, input, ts, plugin, adminLevel) {
        return new Promise((resolve, reject) => {
            permsUtil.doTheThing(input, 'ignore', adminLevel).then(resp => {
                resolve({
                    type: 'channel',
                    message: resp
                });
            }).catch(reject);
        });
    },
    unmute(user, channel, input, ts, plugin, adminLevel) {
        return new Promise((resolve, reject) => {
            permsUtil.doTheThing(input, 'unmute', adminLevel).then(resp => {
                resolve({
                    type: 'channel',
                    message: resp
                });
            }).catch(reject);
        });
    },
    mute(user, channel, input, ts, plugin, adminLevel) {
        return new Promise((resolve, reject) => {
            permsUtil.doTheThing(input, 'mute', adminLevel).then(resp => {
                resolve({
                    type: 'channel',
                    message: resp
                });
            }).catch(reject);
        });
    },
    permaIgnore(user, channel, input, ts, plugin, adminLevel) {
        return new Promise((resolve, reject) => {
            permsUtil.doTheThing(input, 'permaignore', adminLevel).then(resp => {
                resolve({
                    type: 'channel',
                    message: resp
                });
            }).catch(reject);
        });
    },
    set(admin, channel, input, ts, plugin, adminLevel) {
        return new Promise((resolve, reject) => {
            if (!input)
                return reject("Please specify a user");

            let user = input.split(' ')[0].toString().toLowerCase();
            let userLevel = getUserLevel(user);
            let level = input.split(' ')[1] ? input.split(' ')[1].toString().toLowerCase().replace(/[s]$/, '') : 'user';
            let levels = ((adminLevel === 'superadmin' && userLevel === 'superadmin')) ? -1 : 
                (adminLevel === 'admin' && userLevel === 'admin') ? -1 :
                (adminLevel === 'admin') ? ['user', 'admin'] : ['user', 'admin', 'superadmin'];

            if (user) {
                if (levels == -1)
                    return reject("You cannot change the level of yourself or other admins");
                else if (levels.indexOf(level) > -1) {
                    permissions.add(user, level);
                    return resolve({
                        type: 'channel',
                        message: 'Set ' + user + ' to ' + level
                    });
                } else
                    return reject("Invalid User Level");
            }
        });
    }
};