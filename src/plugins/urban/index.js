import _ from 'lodash';
import urban from 'urban';
import Promise from 'bluebird';

module.exports = {
  commands: [{
    alias: ['urban'],
    command: 'urbandictionary'
  }, {
    alias: ['ru', 'randomurban'],
    command: 'randomurban'
  }],
  help: [{
    command: ['urban'],
    usage: 'urban <word>'
  }, {
    command: ['ru', 'randomurban'],
    usage: 'randomurban'
  }],
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

