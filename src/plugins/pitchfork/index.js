import Promise from 'bluebird';

module.exports = {
  commands: [{
    alias: ['pf', 'pitchfork'],
    command: 'pitchfork'
  }],
  help: [{
    command: ['pf', 'pitchfork'],
    usage: 'pitchfork <person>'
  }],
  pitchfork(user, channel, input = 'OP') {
    return new Promise(resolve => {
      return resolve({
        type: 'channel',
        messages: [
          'ANGRY AT ' + input.toUpperCase() + '? WANT TO JOIN THE MOB? I\'VE GOT YOU COVERED! COME ON DOWN TO',
          '/r/pitchforkemporium WE GOT \'EM ALL! http://i.imgur.com/LGLPjWP.png#' + Math.floor(Math.random() * 1000)
        ]
      });
    });
  }
};

