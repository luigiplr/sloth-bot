import _ from 'lodash';
import Promise from 'bluebird';
import slack from './utils/slack';

module.exports = {
    commands: [{
        alias: ['grab'],
        command: 'grab'
    }, {
        alias: ['quote'],
        command: 'quote'
    }, {
        alias: ['quotes'],
        command: 'quotes'
    }],
    help: [{
        command: ['quote'],
        usage: 'quote a user <username> <quotenumber (optional)>'
    }, {
        command: ['quotes'],
        usage: 'quotes <username>'
    }, {
        command: ['grab'],
        usage: 'grab <username>'
    }],
    grab(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return resolve({
                    type: 'dm',
                    message: 'Usage: grab <username> - grabs and saves a quote from the user'
                });
            slack.grabQuote(input, channel)
                .then(res => {
                    resolve({
                        type: 'channel',
                        message: res
                    });
                })
                .catch(reject);
        });
    },
    quote(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return resolve({
                    type: 'dm',
                    message: 'Usage: quote <username> <quotenumber (optional)> - retrives and displays a users most recent or specified quote'
                });
            slack.quote(input, input.split(' ')[1])
                .then(res => {
                    resolve({
                        type: 'channel',
                        message: res
                    });
                })
                .catch(reject);
        });
    },
    quotes(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return resolve({
                    type: 'dm',
                    message: 'Usage: quotes <username> - lists all saved quotes for the user'
                });
            slack.quote(input, 'all')
                .then(res => {
                    resolve({
                        type: 'channel',
                        messages: res
                    });
                })
                .catch(reject);
        });
    }
};