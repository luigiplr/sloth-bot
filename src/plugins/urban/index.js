import _ from 'lodash';
import Urban from 'urban';
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
    usage: 'urban <word> - returns urban definition for word'
  }, {
    command: ['ru', 'randomurban'],
    usage: 'randomurban - returns random urban'
  }],
  urbandictionary(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'channel',
          message: 'Specify a word pls'
        });
      new Urban(input).first((definition) => {
        if (!definition)
          return reject("No results")
        resolve({
          type: 'channel',
          message: _.unescape(`[${definition.thumbs_up || 'N/A'} :thumbsup: | ${definition.thumbs_down || 'N/A'} :thumbsdown: ] ${definition.permalink}`)
        });
      });
    });
  },
  randomurban() {
    return new Promise(resolve => {
      new Urban.random().first((definition) => {
        resolve({
          type: 'channel',
          message: _.unescape(`[${definition.thumbs_up || 'N/A'} :thumbsup: | ${definition.thumbs_down || 'N/A'} :thumbsdown: ] ${definition.permalink}`)
        });
      });
    });
  }
};
