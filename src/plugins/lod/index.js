import Promise from 'bluebird';

module.exports = {
  commands: [{
    alias: ['lod'],
    command: 'lod'
  }],
  help: [{
    command: ['lod'],
    usage: 'lod <person>'
  }],
  lod(user, channel, input = '') {
    return new Promise(resolve => {
      return resolve({
        type: 'channel',
        message: 'ಠ_ಠ ' + input
      });
    });
  }
};

