import _ from 'lodash';
import Promise from 'bluebird';
import slack from './utils/slack';

module.exports = {
    commands: [{
        alias: ['kick'],
        command: 'kick'
    }, {
        alias: ['invite'],
        command: 'invite'
    }],
    help: [{
        command: ['kick'],
        usage: 'kick <username> <reason (optional)>'
    }, {
        command: ['invite'],
        usage: 'invite <email>'
    }],
    kick(user, channel, input = false) {
        return new Promise((resolve, reject) => {
            if (!input)
                return resolve({
                    type: 'dm',
                    message: 'Usage: kick <username> <reason (optional)> - removes user from channel'
                });
            slack.kick(user, channel, input)
                .then(res => {
                    resolve({
                        type: 'channel',
                        message: res
                    });
                })
                .catch(reject);
        });
    },
    invite(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return resolve({
                    type: 'dm',
                  message: 'Usage: invite <email> - invites a person to the slack channel'
                });
            slack.invite(input)
                .then(res => {
                    resolve({
                        type: 'channel',
                        message: res
                    });
                })
                .catch(reject);
        });
    },

};