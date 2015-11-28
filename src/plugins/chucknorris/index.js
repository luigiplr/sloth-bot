import _ from 'lodash';
import Promise from 'bluebird';
import chuck from './utils/chuck';

module.exports = {
    alias: ['chucknorris', 'cn'],
    help: {
        chucknorris: 'chucknorris someone!'
    },
    default(user, input = 'Chuck Norris') {
        let jokes = new chuck(input);
        return new Promise((resolve) => {
            jokes.random((err, joke) => {
                resolve('(' + user + ') ' + _.unescape(joke));
            });
        });
    }
};