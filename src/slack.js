import needle from 'needle';
import Promise from 'bluebird';
import _ from 'lodash';
const config = require('../config.json');

module.exports = {
    sendMessage(channel, input) {
        needle.post(`https://${config.teamName}.slack.com/api/chat.postMessage`, {
            text: input,
            channel: channel,
            as_user: 'true',
            token: config.slackAPIToken
        });
    },
    deleteMessage(channel, ts) {
    	needle.post(`https://${config.teamName}.slack.com/api/chat.delete`, {
            channel: channel,
            token: config.slackToken,
            ts: ts
        });
        console.info("Deleted message in", channel, "with TS of", ts);
    },
    getHistory(channel, limit = 100) {
        return new Promise((resolve, reject) => {
            needle.post(`https://${config.teamName}.slack.com/api/channels.history`, {
                channel: channel,
                token: config.slackToken,
                count: limit
            }, (err, resp) => {
                if (err || resp.body.error)
                    return reject((resp.body.error || err));
                resolve(resp.body);
            });
        });
    },
    findUser(user) {
        return new Promise((resolve, reject) => {
            needle.post(`https://${config.teamName}.slack.com/api/users.list`, {
                token: config.slackToken
            }, (err, resp) => {
                if (err || resp.body.error)
                    return reject(err || resp.body.error);
                let uID = _(resp.body.members)
                    .filter(person => {
                        return person.name === user;
                    })
                    .pluck('id')
                    .value()[0];

                if (!uID) {
                    return reject("Couldn't find a user by that name");
                }
                resolve(uID);
            });
        });
    }
};