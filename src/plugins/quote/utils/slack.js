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
    quote(user, quotenum = 0) {
        return new Promise((resolve, reject) => {
            database.get('quotes', {
                key: 'user',
                value: user
            }).then(quotes => {
                if (quotenum === 'all') {
                    if (quotes.length === 0)
                        return reject('No quotes found for ' + user);
                    var total = ['<' + user + '> Quotes (' + quotes.length + ') :'];
                    quotes.forEach(quotenums => {
                        total.push(this.urlify(' (' + moment(quotenums.date).format("DD-MM-YYYY") + ') ' + quotenums.quote));
                    });
                    return resolve(total);
                } else if (quotes[quotenum]) {
                    var date = moment(quotes[quotenum].date).format("DD-MM-YYYY");
                    var returnstuff = '<' + user + '> ' + quotes[quotenum].quote;
                    return resolve(this.urlify(returnstuff));
                } else {
                    if (quotenum === 0) return resolve('No quotes found for ' + user + ', grab a quote via `' + prefix + 'grab <username>`');
                    return resolve('I dont have quotes that far back for ' + user);
                }
            });
        });
    },
    grabQuote(user, channel) {
        return new Promise((resolve, reject) => {
            Promise.join(this.getHistory(channel.id), this.finduser(user), (history, users) => {
                var uID = _(history.messages)
                    .filter(message => {
                        return message.user === users[0];
                    })
                    .pluck('text')
                    .value()[0];
                if (uID.charAt(0) === prefix)
                    return resolve("i could grab that command, buuuut... http://images-cdn.9gag.com/photo/aj0OWQ0_460s.jpg?" + this.generatechars());

                database.save('quotes', {
                    user: user.toString().toLowerCase(),
                    quote: uID.toString().toString(),
                    date: moment(),
                    id: uuid.v1()
                }).then(() => {
                    resolve("Successfully grabed a quote for " + user);
                });
            });
        });
    },
    getHistory(channel) {
        return new Promise((resolve, reject) => {
            needle.post('https://magics.slack.com/api/channels.history', {
                channel: channel,
                token: config.slackToken
            }, (err, resp) => {
                if (err || resp.body.error)
                    return reject((resp.body.error || err));
                resolve(resp.body);
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
    },
    urlify(text) {
        var urlRegex = /(<https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, url => {
            url = url.substr(1);
            return url.substring(0, url.length - 1) + '#' + this.generatechars();
        });
    },
    generatechars() {
        var length = 8,
            charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
};