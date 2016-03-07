import needle from 'needle';
import Promise from 'bluebird';
import _ from 'lodash';
import config from '../config.json';

module.exports = {
    sendMessage(channel, input) {
        return new Promise((resolve, reject) => {
            needle.post(`https://${config.teamName}.slack.com/api/chat.postMessage`, {
                text: input,
                channel: channel,
                as_user: 'true',
                token: config.slackAPIToken
            }, (err, resp, body) => {
                if (err || body.error) {
                    console.log(`sendMsgErr ${err || body.error}`);
                    return reject(`sendMsgErr ${err || body.error}`);
                }
                resolve();
            });
        });
    },
    deleteMessage(channel, ts) {
        return new Promise((resolve, reject) => {
            needle.post(`https://${config.teamName}.slack.com/api/chat.delete`, {
                channel: channel,
                token: config.slackToken,
                ts: ts
            }, (err, resp, body) => {
                if (err || body.error) {
                    console.log(`DelMsgErr ${err || body.error}`);
                    return reject(`DelMsgErr ${err || body.error}`);
                }
                console.info("Deleted message in", channel, "with TS of", ts);
                resolve();             
            });
            
        });
    },
    getHistory(channel, limit = 100) {
        return new Promise((resolve, reject) => {
            needle.post(`https://${config.teamName}.slack.com/api/channels.history`, {
                channel: channel,
                token: config.slackToken,
                count: limit
            }, (err, resp, body) => {
                if (err || body.error) {
                    console.log(`getHistoryErr ${err || body.error}`);
                    return reject(`getHistoryErr ${err || body.error}`);
                }
                resolve(body);
            });
        });
    },
    findUser(user) {
        return new Promise((resolve, reject) => {
            needle.post(`https://${config.teamName}.slack.com/api/users.list`, {
                token: config.slackToken
            }, (err, resp, body) => {
                if (err || body.error) {
                    console.log(`findUserErr ${err || body.error}`);
                    return reject(`findUserErr ${err || body.error}`);
                }
                let uID = _(body.members)
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