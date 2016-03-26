import _ from 'lodash';
import needle from 'needle';
import Promise from 'bluebird';
import slackTools from '../../../slack.js';

var config = require('../../../../config.json');

module.exports = {
    invite(input) {
        var email = input.substr(8).split('|')[0];
        return new Promise((resolve, reject) => {
            needle.post('https://slack.com/api/users.admin.invite', {
                email: email,
                token: config.slackToken,
                set_active: true
            }, (err, resp) => {

                if (err || resp.body.error)
                    return reject('Error: ' + (resp.body.error || err));

                if (resp.body && resp.body.ok === true)
                    resolve(email + ' invited successfully.');
                else
                    reject('Error: ' + resp.body.error);
            });
        });
    },
    kick(user, channel, input) {
        return new Promise((resolve, reject) => {
            user = input.split(' ')[0];
            let reason = _.slice(input.split(' '), 1).join(' ');
            channel = channel.id;
            
            if (user === config.botname || user.slice(2, -1) === config.botid) {
                return reject('Error: Bitch. No.');
            }

            // Dirty cheat cause i cbf fixing
            if (user.slice(0,2) == "<@") {
                needle.post('https://slack.com/api/channels.kick', {
                    channel: channel,
                    token: config.slackToken,
                    user: user.slice(2, -1)
                }, (err, resp) => {
                    if (err || resp.body.error)
                        return reject('Error: ' + (resp.body.error || err));
                    resolve('*Kicked: ' + user + '* for ' + (reason ? reason : 'no reason.'));
                });
            } else {
                slackTools.findUser(user).then(uID => {
                    needle.post('https://slack.com/api/channels.kick', {
                        channel: channel,
                        token: config.slackToken,
                        user: uID
                    }, (err, resp) => {
                        if (err || resp.body.error)
                            return reject('Error: ' + (resp.body.error || err));
                        resolve('*Kicked: ' + user + '* for ' + (reason ? reason : 'no reason.'));
                    });
                });
            }
        });
    },
    deleteLastMessage(channel, messagets) {
        return new Promise((resolve, reject) => {
            if (!config.botid)
                return reject("Error! Cannot find botID");
            slackTools.deleteMessage(channel, messagets);     
            slackTools.getHistory(channel, 17).then(history => {
                let ts = _(history.messages)
                    .filter(message => {
                        return message.user === config.botid;
                    })
                    .pluck('ts')
                    .value()[0];

                if (!ts)
                    return resolve(false);

                slackTools.deleteMessage(channel, ts);
                resolve(ts);
            }).catch(reject);
        });
    }
};