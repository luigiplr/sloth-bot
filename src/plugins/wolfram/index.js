import Promise from 'bluebird';
import wolfram from './utils/wolfram';

export const plugin_info = [{
  alias: ['calc', 'wolfram'],
  command: 'wolfram',
  usage: 'wolfram <query> - returns wolfram calculation for query'
}]

module.exports = {
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

