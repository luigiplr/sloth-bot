import Promise from 'bluebird';
import _ from 'lodash';
import slackTools from '../../slack.js';

module.exports = {
    commands: [{
        alias: ['pb', 'poopbomb'],
        command: 'poopbomb'
    }],
    help: [{
        command: ['poopbomb'],
        usage: 'poopbomb <username> <amount || 1>'
    }],
    poopbomb(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return resolve({
                    type: 'dm',
                    message: 'Usage: poopbomb <username> <amount || 1> - Poop bombs the user :)))'
                });

            let amount = parseInt(input.split(' ')[1]) || 1;
            if (amount > 3)
                return reject('Too much poop :|');
        
            slackTools.findUser(input.split(' ')[0]).then(poopee => {
                let p = _.fill(Array(amount), ':hankey: p :hankey:');
                let o = _.fill(Array(amount), ':hankey: o :hankey:');
                let oo = _.fill(Array(2), ':hankey: o :hankey:');
                let pp = _.fill(Array(amount), ':hankey: p :hankey:');
                let poop = [':hankey: poop :hankey:'];
                resolve({
                    type: 'dm',
                    user: poopee,
                    multiLine: true,
                    messages: p.concat(o, oo, pp, poop)
                });
            }).catch(reject);
        });
    }
};