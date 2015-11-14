var Promise = require('bluebird');
var urban = require('urban');

module.exports = {
    random: function(user) {
        return new Promise(function(resolve) {
            urban.random().first(function(json) {
                resolve('(' + user + ') [' + json.thumbs_up + ' :thumbsup: | ' + json.thumbs_down + ' :thumbsdown: ] ' + json.permalink);
            });
        });
    },
    define: function(input, user) {
        var question = urban(input);
        return new Promise(function(resolve) {
            question.first(function(json) {
                resolve('(' + user + ') [' + json.thumbs_up + ' :thumbsup: | ' + json.thumbs_down + ' :thumbsdown: ] ' + json.permalink);
            });
        });
    }
};