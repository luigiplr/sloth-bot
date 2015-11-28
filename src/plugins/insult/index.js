import _ from 'lodash';
import urban from 'urban';
import Promise from 'bluebird';
import spinsult from 'shakespeare-insult';
import normalinsult from 'insultgenerator';

module.exports = {
    commands: [{
        alias: ['insult'],
        command: 'insult'
    }, {
        alias: ['sinsult', 'oldinsult', 'shakespeareinsult'],
        command: 'oldinsult'
    }],
    help: [{
        command: ['insult'],
        usage: 'insult <person>'
    }, {
        command: ['sinsult', 'oldinsult', 'shakespeareinsult'],
        usage: 'sinsult <person>'
    }],
    insult(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input) {
                return resolve({
                    type: 'channel',
                    message: 'Who am I insulting?'
                });
            }
            try {
                new normalinsult((meanMessage) => {
                    resolve({
                        type: 'channel',
                        message: _.unescape(input + ': ' + meanMessage)
                    });
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    oldinsult(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input) {
                return resolve({
                    type: 'channel',
                    message: 'Who am I insulting?'
                });
            }
            try {
                resolve({
                    type: 'channel',
                    message: _.unescape('_' + input + " you're a " + spinsult.random() + '_')
                });
            } catch (e) {
                reject(e);
            }
        });
    }
};