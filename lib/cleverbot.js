var Promise = require('bluebird');
var Cleverbot = require('cleverbot-node');
cleverbot = new Cleverbot;

module.exports = {
    send: function(input) {
        return new Promise(function(resolve) {
            Cleverbot.prepare(function() {
                cleverbot.write(input, function(response) {
                    resolve('Cleverbot: ' + response.message);
                });
            });
        });
    }
};
