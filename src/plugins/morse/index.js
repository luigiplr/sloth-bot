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
    return new Promise(resolve => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: Morse <morse code> - Translates morse code into English. Words should be seperated by a /'
        });

      let decoded = morse.decode(input);
      resolve({
        'type': 'channel',
        'message': "Translation: " + decoded
      });
    });
  }
};

