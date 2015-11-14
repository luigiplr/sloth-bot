var Promise = require('bluebird');
var needle = require('needle');
var _ = require('lodash');
var database = require('./database');
var moment = require('moment');

var config = require('./../config.json');
var prefix = config.prefix;

module.exports = {
    invite: function(input, user) {
        var email = input.substr(8).split('|')[0];
        return new Promise(function(resolve) {
            needle.post('https://magics.slack.com/api/users.admin.invite', {
                email: email,
                token: config.slackToken,
                set_active: true
            }, function(err, resp) {
                if (err || resp.body.error)
                    return resolve('(' + user + ') Error: ' + (resp.body.error || err));
                if (resp.body && resp.body.ok === true)
                    resolve('(' + user + '): ' + email + ' invited successfully.');
                else
                    resolve('(' + user + ') Error: ' + resp.body.error);
            });
        });
    },
    quote: function(user, quotenum) {
        quotenum = quotenum ? quotenum : 0;
        return new Promise(function(resolve) {
            database.getQuote(user).then(function(quote) {
                if (quotenum === 'all') {
                    var total = ['<' + user + '> Quotes (' + quote.length + ') :'];
                    quote.forEach(function(quotenums) {
                        total.push(module.exports.urlify(' (' + moment(quotenums.date).format("DD-MM-YYYY") + ') ' + quotenums.quote));
                    });
                    return resolve(total);
                } else if (quote[quotenum]) {
                    var date = moment(quote[quotenum].date).format("DD-MM-YYYY");
                    var returnstuff = '<' + user + '> ' + '(' + date + '): ' + quote[quotenum].quote;
                    return resolve(module.exports.urlify(returnstuff));
                } else {
                    if(quotenum === 0 ) return resolve('No quotes found for ' + user + ', grab a quote via `!grab <username>`');
                    return resolve('I dont have quotes that far back for ' + user);
                }
            });
        });
    },
    grabQuote: function(user, channel) {
        console.log(user, channel);
        return new Promise(function(resolve) {
            Promise.join(module.exports.getHistory(channel), module.exports.finduser(user),
                function(history, users) {
                    var uID = _(history.messages)
                        .filter(function(message) {
                            return message.user === users[0];
                        })
                        .pluck('text')
                        .value()[0];
                    if (uID.charAt(0) === prefix)
                        return resolve("i could grab that command, buuuut... http://images-cdn.9gag.com/photo/aj0OWQ0_460s.jpg?" + module.exports.generatechars());
                    database.saveQuote(user, uID, moment()).then(function() {
                        resolve("Successfully grabed a quote for " + user);
                    });
                });
        });
    },
    getHistory: function(channel) {
        return new Promise(function(resolve, reject) {
            needle.post('https://magics.slack.com/api/channels.history', {
                channel: channel,
                token: config.slackToken
            }, function(err, resp) {
                if (err || resp.body.error)
                    return reject((resp.body.error || err));
                resolve(resp.body);
            });
        });
    },
    kick: function(user, channel, kicker, reason) {
        return new Promise(function(resolve) {
            if (user === ('sloth' || '@sloth')) {
                return resolve('Error: Bitch. No.');
            }
            module.exports.finduser(user).then(function(uID) {
                needle.post('https://magics.slack.com/api/channels.kick', {
                    channel: channel,
                    token: config.slackToken,
                    user: uID[0]
                }, function(err, resp) {
                    if (err || resp.body.error)
                        return resolve('(' + user + ') Error: ' + (resp.body.error || err));
                    resolve('(' + kicker + ') Kicked: ' + user + ' for ' + (reason ? reason : 'no reason.'));
                });
            });
        });
    },
    finduser: function(user) {
        return new Promise(function(resolve, reject) {
            needle.post('https://magics.slack.com/api/users.list', {
                token: config.slackToken
            }, function(err, resp) {
                if (err || resp.body.error)
                    return reject(err || resp.body.error);
                var uID = _(resp.body.members)
                    .filter(function(person) {
                        return person.name === user;
                    })
                    .pluck('id')
                    .value();
                resolve(uID);
            });
        });
    },
    urlify: function(text) {
        var urlRegex = /(<https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function(url) {
            url = url.substr(1);
            return url.substring(0, url.length - 1) + '#' + module.exports.generatechars();
        });
    },
    generatechars: function() {
        var length = 8,
            charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
};
