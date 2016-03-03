import _ from 'lodash';
import Promise from 'bluebird';
import slack from './utils/slack';
import slackTools from '../../slack.js';

module.exports = {
    commands: [{
        alias: ['kick'],
        userLevel: ['admin', 'superadmin'],
        command: 'kick'
    }, {
        alias: ['invite'],
        command: 'invite'
    }, {
        alias: ['channelid', 'cid'],
        command: 'channelid'
    }, {
        alias: ['userid', 'uid'],
        command: 'userid'
    }, {
        alias: ['dellast', 'deletelastmessage'],
        userLevel: ['admin', 'superadmin'],
        command: 'deleteLastMessage'
    }],
    help: [{
        command: ['kick'],
        usage: 'kick <username> <reason (optional)>'
    }, {
        command: ['invite'],
        usage: 'invite <email>'
    }, {
        command: ['channelid'],
        usage: 'channelid - returns ChannelID for current channel'
    }, {
        command: ['userid'],
        usage: 'userid <user> - returns UserID for user'
    }, {
        command: ['dellast', 'deletelastmessage'],
        usage: 'dellast - deletes the last message from the bot'
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
    channelid(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (channel && channel.id)
                return resolve({
                    type: 'channel',
                    message: "This channel's ID is " + channel.id
                });
            else
                reject('Error?');
        });
    },
    userid(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input || input === user.name)
                return resolve({
                        type: 'channel',
                        message: 'Your UserID is ' + user.id
                    });

            slackTools.findUser(input).then(id => {
                resolve({
                    type: 'channel',
                    message: input + "'s UserID is " + id
                });
            }).catch(reject);
        });
    },
    deleteLastMessage(user, channel, input, ts) {
        return new Promise((resolve, reject) => {
            slack.deleteLastMessage(channel.id, ts).then(resp => {
                resolve();
            }).catch(reject);
        });
    }
};