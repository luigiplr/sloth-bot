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
        usage: 'list all quotes for a user <username>'
    }, {
        command: ['grab'],
        usage: 'grab a quote for a username <username>'
    }],
    grab(user, channel, input = false) {
        return new Promise((resolve, reject) => {
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