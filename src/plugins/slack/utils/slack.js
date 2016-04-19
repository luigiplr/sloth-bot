import _ from 'lodash';
import needle from 'needle';
import Promise from 'bluebird';
import slackTools from '../../../slack.js';

var config = require('../../../../config.json');

const getUserInfo = user => (user.slice(0, 2) == "<@") ? slackTools.findUserByID(user.slice(0, 2), 'both') : slackTools.findUser(user, 'both');

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
            let user = input.split(' ')[0];
            let reason = _.slice(input.split(' '), 1).join(' ');
            
            if (user === config.botname || user.slice(2, -1) === config.botid) {
                return reject('Error: Bitch. No.');
            }
            console.log(input);

            getUserInfo(user).then(kickee => {
                needle.post('https://slack.com/api/channels.kick', {
                    channel: channel.id,
                    token: config.slackToken,
                    user: kickee.id
                }, (err, resp, body) => {
                    if (err || body.error) {
                        console.log(`kickUserErr ${err || body.error}`);
                        return reject(`kickUserErr ${err || body.error}`);
                    }
                    resolve(`*Kicked: ${kickee.name}* for ${reason || 'no reason.'}`);
                    slackTools.sendPrivateMessageAsSlackbot(kickee.name, `You were kicked from #${channel.name} for ${reason || 'no reason'}`)
                });
            }).catch(reject);
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