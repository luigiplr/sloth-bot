import needle from 'needle';
import Promise from 'bluebird';
import _ from 'lodash';
import config from '../config.json';

module.exports = {
    sendMessage(channel, input) {
        return new Promise((resolve, reject) => {
            needle.post('https://slack.com/api/chat.postMessage', {
                text: input,
                channel: channel,
                as_user: 'true',
                token: config.slackAPIToken,
                icon_url: config.imageURL
            }, (err, resp, body) => {
                if (err || body.error) {
                    console.log(`sendMsgErr ${err || body.error}`);
                    return reject(`sendMsgErr ${err || body.error}`);
                }
                resolve();
            });
        });
    },
    sendPrivateMessageAsSlackbot(channel, input) {
        return new Promise((resolve, reject) => {
            needle.post('https://slack.com/api/chat.postMessage', {
                text: input,
                channel: `@${channel}`,
                token: config.slackAPIToken,
                username: config.botname,
                icon_url: config.imageURL
            }, (err, resp, body) => {
                if (err || body.error) {
                    console.log(`sendPMSbErr ${err || body.error}`);
                    return reject(`sendPMSbErr ${err || body.error}`);
                }
                resolve();
            });
        });
    },
    deleteMessage(channel, ts) {
        return new Promise((resolve, reject) => {
            needle.post('https://slack.com/api/chat.delete', {
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
            needle.post('https://slack.com/api/channels.history', {
                channel: channel,
                token: config.slackAPIToken,
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
    findUser(user, type) {
        return new Promise((resolve, reject) => {
            needle.post('https://slack.com/api/users.list', {
                token: config.slackAPIToken
            }, (err, resp, body) => {
                if (err || body.error) {
                    console.log(`findUserErr ${err || body.error}`);
                    return reject(`findUserErr ${err || body.error}`);
                }
                
                let member = _.find(body.members, person => {
                    return person.name === user;
                })

                if (!member)
                    return reject("Couldn't find a user by that name");

                type == 'both' ? resolve({name: member.name, id: member.id}) : (type == 'name' ? resolve(member.name) : resolve(member.id));
            });
        });
    },
    findUserByID(userid, type) {
        return new Promise((resolve, reject) => {
            needle.post('https://slack.com/api/users.list', {
                token: config.slackAPIToken
            }, (err, resp, body) => {
                if (err || body.error) {
                    console.log(`findUserIDErr ${err || body.error}`);
                    return reject(`findUserIDErr ${err || body.error}`);
                }
                
                let member = _.find(body.members, person => {
                    return person.id === userid;
                })

                if (!member)
                    return reject("Couldn't find a user with that ID");

                type == 'both' ? resolve({name: member.name, id: member.id}) : (type == 'name' ? resolve(member.name) : resolve(member.id));
            });
        });
    },
    setInactive(user) {
        return new Promise((resolve, reject) => {
            needle.post(`https://slack.com/api/users.admin.setInactive?t=${Math.round(Date.now() / 1e3)}`, {
                token: config.slackToken,
                user: user,
                set_active: true,
                _attempts: 1
            }, (err, resp, body) => {
                if (err || body.error) {
                    console.log(`setInactive ${err || body.error}`);
                    return reject(`setInactive ${err || body.error}`);
                }
                body.ok ? resolve(true) : reject("Unknown error");
            });
        })
    },
    setRegular(user) {
        return new Promise((resolve, reject) => {
            needle.post(`https://slack.com/api/users.admin.setRegular?t=${Math.round(Date.now() / 1e3)}`, {
                token: config.slackToken,
                user: user,
                set_active: true,
                _attempts: 1
            }, (err, resp, body) => {
                if (err || body.error) {
                    console.log(`setRegular ${err || body.error}`);
                    return reject(`setRegular ${err || body.error}`);
                }
                body.ok ? resolve(true) : reject("Unknown error");
            });
        })
    },
    addLoadingMsg(message) {
        return new Promise((resolve, reject) => {
            needle.post('https://slack.com/api/team.loading.addMsg', {
                token: config.slackToken,
                message: message
            }, (err, resp, body) => {
                if (err || body.error) {
                    console.log(`addLoadingMsg ${err || body.error}`);
                    return reject(`addLoadingMsg ${err || body.error}`);
                }
                body.ok ? resolve(body) : reject("Unknown error");
            })
        })
    },
    deleteLoadingMsg(id) {
        return new Promise((resolve, reject) => {
            needle.post('https://slack.com/api/team.loading.deleteMsg', {
                token: config.slackToken,
                id: id
            }, (err, resp, body) => {
                if (err || body.error) {
                    console.log(`delLoadingMsg ${err || body.error}`);
                    return reject(`delLoadingMsg ${err || body.error}`);
                }
                body.ok ? resolve(true) : reject("Unknown error");
            })
        })
    }
};