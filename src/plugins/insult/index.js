import Promise from 'bluebird';
import spinsult from 'shakespeare-insult';
import normalinsult from 'insultgenerator';

export const plugin_info = [{
  alias: ['insult'],
  command: 'insult',
  usage: 'insult <person>'
}, {
  alias: ['sinsult', 'shakespeareinsult'],
  command: 'oldinsult',
  usage: 'sinsult <person>'
}]


export function insult(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input)
      return resolve({
        type: 'channel',
        message: 'Who am I insulting?'
      });

    try {
      new normalinsult((meanMessage) => {
        resolve({
          type: 'channel',
          message: input + ': ' + meanMessage
        });
      });
    } catch (e) {
      reject(e);
    }
  });
}
export function oldinsult(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input)
      return resolve({
        type: 'channel',
        message: 'Who am I insulting?'
      });

    try {
      resolve({
        type: 'channel',
        message: '_' + input + " you're a " + spinsult.random() + '_'
      });
    } catch (e) {
      reject(e);
    }
  });
}

