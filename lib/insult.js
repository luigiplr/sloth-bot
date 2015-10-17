var Promise = require('bluebird');
var shakespeareinsult = require('shakespeare-insult');
var insultgenerator = require('insultgenerator');


module.exports = {
    oldInsult: function(input) {
        return new Promise(function(resolve) {
            if (input !== '')
                resolve("_" + input + " you're a " + shakespeareinsult.random() + "_");
            else
                resolve("You didn't tell me who to insult :(");
        });
    },
    insult: function(input) {
        return new Promise(function(resolve) {
            if (input !== '')
                insultgenerator(function(insult) {
                    resolve(input + ': ' + insult)
                })
            else
                resolve("You didn't tell me who to insult :(");
        });

    }
};
