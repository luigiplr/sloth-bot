var Promise = require('bluebird');
var codepad = require('codepad');
var _ = require('lodash');


module.exports = {
    eval: function(user, type, code) {
        code = code ? _.unescape(code) : ''
        console.log('lang:', type, 'code:', code)
        return new Promise(function(resolve) {
            try {
                codepad.eval(type, code, function(err, out) {
                    if (err) {
                        console.log("Error: ", err);
                    } else {
                        console.log(out)
                        resolve('(' + user + ')  Output: ```' + out.output + '```');
                    }
                }, true);
            } catch (e) {
                resolve('(' + user + ') Error:' + e);
            }
        });
    }
};