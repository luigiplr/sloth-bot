import Promise from 'bluebird';
import slack from './utils/slack';
import slackTools from '../../slack.js';

export const plugin_info = [{
  alias: ['kick'],
  command: 'kick',
  usage: 'kick <username> <reason (optional)>',
  userLevel: ['admin', 'superadmin']
}, {
  alias: ['invite'],
  command: 'invite',
  usage: 'invite <email> - invites a user to group'
}, {
  alias: ['channelid'],
  command: 'channelid',
  usage: 'channelid - returns ChannelID for current channel'
}, {
  alias: ['userid'],
  command: 'userid',
  usage: 'userid <user> - returns UserID for user'
}, {
  alias: ['dellast', 'deletelastmessage'],
  command: 'deleteLastMessage',
  usage: 'dellast - deletes the last message from the bot'
}, {
  alias: ['alm', 'addloadingmessage'],
  command: 'addLoadingMessage',
  usage: 'alm <message> - Adds a slack loading message to the team'
}, {
  alias: ['rlm', 'removeloadingmessage'],
  command: 'removeLoadingMessage',
  usage: 'rlm <id> - Remove a slack loading message from the team'
}]

module.exports = {
  kick(user, channel, input = false) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: kick <username> <reason (optional)> - removes user from channel'
        });

      slack.kick(user, channel, input)
        .then(res => {
          resolve({
            type: 'channel',
            message: res
          });
        })
        .catch(reject);
    });
  },
  invite(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: invite <email> - invites a person to the slack channel'
        });
      slack.invite(input)
        .then(res => {
          resolve({
            type: 'channel',
            message: res
          });
        })
        .catch(reject);
    });
  },
  channelid(user, channel) {
    return new Promise((resolve, reject) => {
      if (channel && channel.id)
        return resolve({
          type: 'channel',
          message: "This channel's ID is " + channel.id
        });
      else
        reject('Error?');
    });
  },
  userid(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input || input === user.name)
        return resolve({
          type: 'channel',
          message: 'Your UserID is ' + user.id
        });

      slackTools.findUser(input).then(id => {
        resolve({
          type: 'channel',
          message: input + "'s UserID is " + id
        });
      }).catch(reject);
    });
  },
  deleteLastMessage(user, channel, input, ts) {
    return new Promise((resolve, reject) => {
      slack.deleteLastMessage(channel.id, ts).then(() => {
        resolve();
      }).catch(reject);
    });
  },
  /*disableUser(user, channel, input) {
      return new Promise((resolve, reject) => {
          if (!input) {
              return reject("Please specify a user")
          }

          slackTools.findUser(input).then(id => {
              slackTools.setInactive(id).then(() => {
                  resolve({
                      type: 'channel',
                      message: `Sucessfully disabled ${input}'s account`
                  });
              }).catch(reject);
          }).catch(reject);  
      })
  },
  enableUser(user, channel, input) {
      return new Promise((resolve, reject) => {
          if (!input)
              return reject("Please specify a user")

          slackTools.findUser(input).then(id => {
              slackTools.setRegular(id).then(resp => {
                  resolve({
                      type: 'channel',
                      message: `Sucessfully enabled ${input}'s account`
                  });
              }).catch(reject);
          }).catch(reject);  
      })
  },*/
  addLoadingMessage(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: addloadingmessage <message> - Adds a loading message to the slack team'
        });

      slackTools.addLoadingMsg(input).then(resp => {
        resolve({
          type: 'channel',
          message: `Successfully added message with id ${resp.id}`
        });
      }).catch(reject)
    })
  },
  removeLoadingMessage(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: removeloadingmessage <id> - Remove a loading message from the team - ID is required and can only be viewed within the Slack Admin Page'
        });

      slackTools.deleteLoadingMsg(input).then(() => {
        resolve({
          type: 'channel',
          message: `Successfully removed message with id ${input}`
        });
      }).catch(reject)
    })
  }
};

