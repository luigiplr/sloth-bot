import _ from 'lodash';
import needle from 'needle'
import Promise from 'bluebird';
import moment from 'moment';
import uuid from 'node-uuid';
import database from '../../../database';


var config = require('../../../../config.json');
var prefix = config.prefix;



module.exports = {
    invite(input, user) {
        var email = input.substr(8).split('|')[0];
        return new Promise((resolve) => {
            needle.post('https://magics.slack.com/api/users.admin.invite', {
                email: email,
                token: config.slackToken,
                set_active: true
            }, (err, resp) => {

                if (err || resp.body.error)
                    return resolve('(' + user + ') Error: ' + (resp.body.error || err));

                if (resp.body && resp.body.ok === true)
                    resolve('(' + user + '): ' + email + ' invited successfully.');
                else
                    resolve('(' + user + ') Error: ' + resp.body.error);

            });
        });
    },
    kick(user, channel, kicker, reason) {
        return new Promise((resolve) => {
            if (user === (config.botname)) {
                return resolve('Error: Bitch. No.');
            }
            this.finduser(user).then(uID => {
                needle.post('https://magics.slack.com/api/channels.kick', {
                    channel: channel,
                    token: config.slackToken,
                    user: uID[0]
                }, (err, resp) => {
                    if (err || resp.body.error)
                        return resolve('(' + user + ') Error: ' + (resp.body.error || err));
                    resolve('(' + kicker + ') Kicked: ' + user + ' for ' + (reason ? reason : 'no reason.'));
                });
            });
        });
    },
    finduser(user) {
        return new Promise((resolve, reject) => {
            needle.post('https://magics.slack.com/api/users.list', {
                token: config.slackToken
            }, (err, resp) => {
                if (err || resp.body.error)
                    return reject(err || resp.body.error);
                var uID = _(resp.body.members)
                    .filter(person => {
                        return person.name === user;
                    })
                    .pluck('id')
                    .value();
                resolve(uID);
            });
        });
    }
};