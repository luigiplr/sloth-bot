import blasphemer from 'blasphemy';
import Promise from 'bluebird';

module.exports = {
  commands: [{
    alias: ['blasphemy'],
    command: 'blasphemy'
  }],
  help: [{
    command: ['blasphemy'],
    usage: 'blasphemy'
  }],
  blasphemy() {
    return new Promise(resolve => {
      return resolve({
        type: 'channel',
        message: blasphemer.blaspheme()
      });
    });
  }
};

