var Promise = require('bluebird');
var _ = require('lodash');
var database = require('./database');


module.exports = {
    when: function(mrw, user) {
        return new Promise(function(resolve) {
            database.getMRW(mrw).then(function(Reaction) {
                if (Reaction[0]) {
                    return resolve('(' + user + ') ' + module.exports.urlify(Reaction[0].reaction));
                } else {
                    return resolve('Reaction not set, set using `!setmrw <mrw> <Reaction>`')
                }
            });
        });
    },
    set: function(mrw, setting) {
        return new Promise(function(resolve) {
            database.saveMRW(mrw, setting).then(function() {
                resolve("Successfully saved reaction")
            });
        });
    },
    urlify: function(text) {
        var urlRegex = /(<https?:\/\/[^\s]+)/g;
        return text.replace(urlRegex, function(url) {
            url = url.substr(1);
            return url.substring(0, url.length - 1) + '#' + module.exports.generatechars();
        })
    },
    generatechars: function() {
        var length = 8,
            charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
};
