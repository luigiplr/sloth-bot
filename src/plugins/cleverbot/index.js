import _ from 'lodash';
import CleverBot, {
    prepare
}
from 'cleverbot-node';
import Promise from 'bluebird';

var cleverb = new CleverBot;

module.exports = {
    commands: [{
        alias: ['cb', 'cleverbot'],
        command: 'cleverbot'
    }],
    help: [{
        command: ['cb', 'cleverbot'],
        usage: 'cleverbot <message>'
    }],
    cleverbot(user, channel, input = 'hello') {
        return new Promise((resolve, reject) => {
            try {
                prepare(() => {
                    cleverb.write(input, reply => {
                        resolve({
                            type: 'channel',
                            message: 'Cleverbot: ' + _.unescape(reply.message)
                        });
                    });
                });
            } catch (e) {
                reject(e);
            }
        });
    }
};