import _ from 'lodash';
import Promise from 'bluebird';
import chuck from './utils/chuck';


module.exports = {
    commands: [{
        alias: ['cn', 'chucknorris'],
        command: 'chucknorris'
    }],
    help: {
        chucknorris: 'chucknorris someone!'
    },
    chucknorris(user, input = 'Chuck Norris') {
        let jokes = new chuck(input);
        return new Promise((resolve, reject) => {
            try {
                jokes.random((err, joke) => {
                    resolve('(' + user + ') ' + _.unescape(joke));
                });
            } catch (e) {
                reject(e);
            }
        });
    }
};