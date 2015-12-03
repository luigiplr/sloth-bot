import _ from 'lodash';
import Promise from 'bluebird';
import slack from './utils/slack';

module.exports = {
    commands: [{
        alias: ['grab'],
        command: 'grab'
    }],
    help: [{
        command: ['grab'],
        usage: ''
    }],
    grab(user, channel, input = false) {
        return new Promise((resolve, reject) => {
            slack.grabQuote(user, channel).then(res => {
                console.log(res)
            })
        });
    }
};