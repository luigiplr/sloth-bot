import Promise from 'bluebird';
import _ from 'lodash';
import urban from 'urban';

export const plugin_info = [{
  alias: ['urban'],
  command: 'urbandictionary',
  usage: 'urban <word> - returns urban definition for word'
}, {
  alias: ['ru', 'randomurban'],
  command: 'randomurban',
  usage: 'randomurban - returns random definition from urban dictionary'
}]

module.exports = {
  urbandictionary(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'channel',
          message: 'Specify a word pls'
        });
      try {
        new urban(input).first((definition) => {
          resolve({
            type: 'channel',
            message: _.unescape(`[${definition.thumbs_up || 'N/A'} :thumbsup: | ${definition.thumbs_down || 'N/A'} :thumbsdown: ] ${definition.permalink}`)
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  randomurban() {
    return new Promise((resolve, reject) => {
      try {
        new urban.random().first((definition) => {
          resolve({
            type: 'channel',
            message: _.unescape(`[${definition.thumbs_up || 'N/A'} :thumbsup: | ${definition.thumbs_down || 'N/A'} :thumbsdown: ] ${definition.permalink}`)
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }
};

