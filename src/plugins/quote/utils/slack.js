import _ from 'lodash';
import needle from 'needle'
import Promise from 'bluebird';
import moment from 'moment';
import database from '../../../database'

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
    quote(user, quotenum) {
        quotenum = quotenum ? quotenum : 0;
        return new Promise((resolve) => {

            database.get('quotes', {
                key: 'user',
                value: user
            }).then(quote => {

                if (quotenum === 'all') {
                    var total = ['<' + user + '> Quotes (' + quote.length + ') :'];
                    quote.forEach(quotenums => {
                        total.push(module.exports.urlify(' (' + moment(quotenums.date).format("DD-MM-YYYY") + ') ' + quotenums.quote));
                    });
                    return resolve(total);

                } else if (quote[quotenum]) {
                    var date = moment(quote[quotenum].date).format("DD-MM-YYYY");
                    var returnstuff = '<' + user + '> ' + '(' + date + '): ' + quote[quotenum].quote;
                    return resolve(module.exports.urlify(returnstuff));

                } else {
                    if (quotenum === 0) return resolve('No quotes found for ' + user + ', grab a quote via `' + prefix + 'grab <username>`');
                    return resolve('I dont have quotes that far back for ' + user);
                }

            });
        });
    },
    grabQuote(user, channel) {
        console.log(user, channel);
        return new Promise(resolve => {
            Promise.join(module.exports.getHistory(channel), module.exports.finduser(user), (history, users) => {
                var uID = _(history.messages)
                    .filter(message => {
                        return message.user === users[0];
                    })
                    .pluck('text')
                    .value()[0];
                if (uID.charAt(0) === prefix)
                    return resolve("i could grab that command, buuuut... http://images-cdn.9gag.com/photo/aj0OWQ0_460s.jpg?" + module.exports.generatechars());
                database.saveQuote(user, uID, moment()).then(() => {
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
            module.exports.finduser(user).then(uID => {
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
    urlify(text)  {
        var urlRegex = /(<https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, url => {
            url = url.substr(1);
            return url.substring(0, url.length - 1) + '#' + module.exports.generatechars();
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