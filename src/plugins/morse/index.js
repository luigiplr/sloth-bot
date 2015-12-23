import Promise from 'bluebird';
import nodeMorse from 'morse-node';

var morse = nodeMorse.create('ITU');

module.exports = {
    commands: [{
        alias: ['morse'],
        command: 'morse'
    }],
    help: [{
        command: ['morse'],
        usage: 'morse <text>'
    }],
    morse(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return resolve({
                    type: 'channel',
                    message: 'Usage: Morse <morse code> - Translates text from morse to English. Words should be seperated by a /'
                });

            let decoded = morse.decode(input);
            resolve({
                'type': 'channel',
                'message': decoded
            });
        });
    }
};