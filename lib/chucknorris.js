var Promise = require('bluebird');
var chuck = require('./util/chuck');
var _ = require('lodash');

module.exports = {
    random: function(user) {
        jokes = new chuck();
        return new Promise(function(resolve) {
            jokes.random(function(err, joke) {
                return resolve('(' + user + ') ' + _.unescape(joke));
            });
        });
    },
    user: function(input, user) {
        jokes = new chuck(input);
        return new Promise(function(resolve) {
            jokes.random(function(err, joke) {
                return resolve('(' + user + ') ' + _.unescape(joke));
            });
        });
    }
};
