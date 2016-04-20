import Promise from 'bluebird';

export const plugin_info = [{
  alias: ['pf', 'pitchfork'],
  command: 'pitchfork',
  usage: 'pitchfork <person>'
}]

export function pitchfork(user, channel, input = 'OP') {
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

