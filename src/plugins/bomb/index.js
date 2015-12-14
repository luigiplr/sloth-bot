import Promise from 'bluebird';

module.exports = {
    commands: [{
        alias: ['pb', 'poopbomb'],
        command: 'poopbomb'
    }],
    help: [{
        command: ['poopbomb'],
        usage: 'poopbomb <username> <amount || 4>'
    }],
    poopbomb(user, channel, input, slackClient) {
        return new Promise((resolve, reject) => {
            if (!input)
                return resolve({
                    type: 'dm',
                    message: 'Usage: poopbomb <username> <amount || 4> - Poop bombs the user :))))'
                });
        
            let poopee = slackClient.getUserByName(input.split(' ')[0]);
            let amount = parseInt(input.split(' ')[1]) || 4;
            if (poopee) {
                if (amount > 10)
                    reject('Too much poop :|');
                let p = new Array(amount).fill(':hankey: p :hankey:');
                let o = new Array(amount).fill(':hankey: o :hankey:');
                let oo = new Array(amount).fill(':hankey: o :hankey:');
                let pp = new Array(amount).fill(':hankey: p :hankey:');
                let poop = [':hankey: poop :hankey:'];
                resolve({
                    type: 'dm',
                    user: poopee,
                    multiLine: true,
                    messages: p.concat(o, oo, pp, poop)
                });
            } else {
                reject('Enter a valid username');
            }
        });
    }
};