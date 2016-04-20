import Promise from 'bluebird';
import slack from './utils/slack';

module.exports = {
  commands: [{
    alias: ['grab'],
    command: 'grab'
  }, {
    alias: ['quote'],
    command: 'quote'
  }, {
    alias: ['quotes'],
    command: 'quotes'
  }],
  help: [{
    command: ['quote'],
    usage: 'quote <username> <quotenumber (optional)>'
  }, {
    command: ['quotes'],
    usage: 'quotes <username>'
  }, {
    command: ['grab'],
    usage: 'grab <username>'
  }],
  grab(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: grab <username> <optional index> - grabs and saves a quote from the user, index can be up to 3 quotes where the last message a user name is 0'
        });
      let grabee = input.split(' ')[0];
      let index = input.split(' ')[1] ? input.split(' ')[1] : 0;
      if (!index || (index < 4 && index >= 0))
        slack.grabQuote(grabee, channel, index, user)
        .then(res => {
          resolve({
            type: 'channel',
            message: res
          });
        }).catch(reject);
      else
        reject("Can't grab a quote that far back");
    });
  },
  quote(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: quote <username> <quotenumber (optional)> - retrives and displays a users most recent or specified quote'
        });
      let grabee = input.split(' ')[0];
      let index = input.split(' ')[1] ? input.split(' ')[1] : undefined;
      slack.quote(grabee, index)
        .then(res => {
          resolve({
            type: 'channel',
            message: res
          });
        })
        .catch(reject);
    });
  },
  quotes(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: quotes <username> - lists all saved quotes for the user'
        });
      slack.quote(input, 'all')
        .then(res => {
          resolve({
            type: 'channel',
            messages: res
          });
        })
        .catch(reject);
    });
  }
};

