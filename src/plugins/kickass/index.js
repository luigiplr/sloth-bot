import Promise from 'bluebird';
import kickass from './utils/kickass';

export const plugin_info = [{
  alias: ['kickass'],
  command: 'kickass',
  usage: 'kickass <search>'
}]

module.exports = {
  kickass(user, channel, input = '') {
    return new Promise((resolve, reject) => {
      kickass.search(input, true).then((data) => {
        let result = data.results[0];
        resolve({
          type: 'channel',
          message: result.title + ' - ' + result.link
        });
      }).catch(reject);
    });
  }
};

