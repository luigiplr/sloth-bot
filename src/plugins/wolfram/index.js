import Promise from 'bluebird';
import wolfram from './utils/wolfram';

module.exports = {
  commands: [{
    alias: ['calc', 'wolfram'],
    command: 'wolfram'
  }],
  help: [{
    command: ['calc', 'wolfram'],
    usage: 'wolfram <query>'
  }],
  wolfram(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: wolfram <query> - Computes <query> using Wolfram Alpha.'
        });

      wolfram.query(input).then(resp => {
        return resolve({
          type: 'channel',
          message: `*Result*: ${resp}`
        });
      }).catch(reject);
    });
  }
};

