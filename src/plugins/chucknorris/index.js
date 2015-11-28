import _ from 'lodash';
import Promise from 'bluebird';
import chuck from './util/chuck';

module.exports = {
    alias: {
        chucknorris: this.chucknorris,
        cn: this.chucknorris
    }
    help: {
        chucknorris: 'chucknorris someone!'
    },
    chucknorris(user, input = 'Chuck Norris') {
        let jokes = new chuck(input);
        return new Promise((resolve) => {
            jokes.random((err, joke) => {
                resolve('(' + user + ') ' + _.unescape(joke));
            });
        });
    }
};