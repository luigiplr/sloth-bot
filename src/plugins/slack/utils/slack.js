import _ from 'lodash';
import needle from 'needle';
import Promise from 'bluebird';

var config = require('../../../../config.json');

module.exports = {
    invite(input) {
        var email = input.substr(8).split('|')[0];
        return new Promise((resolve, reject) => {
            needle.post('https://magics.slack.com/api/users.admin.invite', {
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
        user = input.split(' ')[0];
        let reason = input.split(' ')[1];
        channel = channel.id;

        return new Promise((resolve, reject) => {
            if (user === (config.botname)) {
                return reject('Error: Bitch. No.');
            }
            this.finduser(user).then(uID => {
                needle.post('https://magics.slack.com/api/channels.kick', {
                    channel: channel,
                    token: config.slackToken,
                    user: uID[0]
                }, (err, resp) => {
                    if (err || resp.body.error)
                        return reject('Error: ' + (resp.body.error || err));
                    resolve('Kicked: ' + user + ' for ' + (reason ? reason : 'no reason.'));
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