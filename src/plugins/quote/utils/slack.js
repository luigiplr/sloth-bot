import _ from 'lodash';
import needle from 'needle'
import Promise from 'bluebird';
import moment from 'moment';
import uuid from 'node-uuid';
import database from '../../../database';

var config = require('../../../../config.json');
var prefix = config.prefix;

module.exports = {
    quote(user, quotenum = 0) {
        return new Promise((resolve, reject) => {
            database.get('quotes', {
                key: 'user',
                value: user
            }).then(quotes => {
                if (quotenum === 'all') {
                    var total = ['<' + user + '> Quotes (' + quotes.length + ') :'];
                    quotes.forEach((quotenums, i) => {
                        total.push(this.urlify('[' + i + '] (' + moment(quotenums.date).format("DD-MM-YYYY") + ') ' + quotenums.quote));
                    });
                    return resolve(total);
                } else {
                    let quoteindex = quotenum < 0 ? quotes.length + parseInt(quotenum) : parseInt(quotenum);
                    if (quotes[quoteindex]) {
                        let returnstuff = '<' + user + '> ' + quotes[quoteindex].quote;
                        return resolve(this.urlify(returnstuff));
                    } else {
                        if (quotes.length > 0)
                            reject("I don't have quotes that far back for " + user);
                        else
                            reject('No quotes found for ' + user + ', grab a quote via `' + prefix + 'grab <username>`');
                    }
                }
            });
        });
    },
    grabQuote(grabee, channel, index = 0, grabber) {
        return new Promise((resolve, reject) => {
            Promise.join(this.getHistory(channel.id), this.finduser(grabee), (history, users) => {
                let i = 0;
                var uID = _(history.messages)
                    .filter(message => {
                        if ((parseInt(index) == 0 || parseInt(index) == i) && ((grabber.id === users[0] && i > 0) || grabber.id !== users[0]))
                            return message.user === users[0];
                        else
                            i++;
                    })
                    .pluck('text')
                    .value()[0];

                console.log(uID);

                database.save('quotes', {
                    user: grabee.toString().toLowerCase(),
                    quote: uID.toString().toString(),
                    date: moment(),
                    id: uuid.v1()
                }).then(() => {
                    resolve("Successfully grabed a quote for " + grabee);
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