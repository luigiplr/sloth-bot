import _ from 'lodash';
import Promise from 'bluebird';
import chuck from './utils/chuck';


module.exports = {
    commands: [{
        alias: ['cn', 'chucknorris'],
        command: 'chucknorris'
    }],
    help: [{
        command: ['cn', 'chucknorris'],
        usage: 'CHUCK THE NORRIS'
    }],
    chucknorris(user, channel, input = 'Chuck Norris') {
        return new Promise((resolve, reject) => {
            try {
                new chuck(input).random((err, joke) => {
                    resolve({
                        type: 'channel',
                        message: _.unescape(joke)
                    });
                });
            } catch (e) {
                reject(e);
            }
        });
    }
};