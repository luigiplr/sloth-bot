import Promise from 'bluebird';
import { kick, deleteLastMessage } from './utils/slack';
import { invite, findUser, addLoadingMsg, deleteLoadingMsg } from '../../slack.js';

export const plugin_info = [{
  alias: ['kick'],
  command: 'kickUser',
  usage: 'kick <username> <reason (optional)>',
  userLevel: ['admin', 'superadmin']
}, {
  alias: ['invite'],
  command: 'inviteUser',
  usage: 'invite <email> - invites a user to group'
}, {
  alias: ['channelid', 'cid'],
  command: 'channelid',
  usage: 'channelid - returns ChannelID for current channel'
}, {
  alias: ['userid', 'uid'],
  command: 'userid',
  usage: 'userid <user> - returns UserID for user'
}, {
  alias: ['dellast', 'deletelastmessage'],
  command: 'delLast',
  usage: 'dellast - deletes the last message from the bot'
}, {
  alias: ['alm', 'addloadingmessage'],
  command: 'addLoadMessage',
  usage: 'alm <message> - Adds a slack loading message to the team'
}, {
  alias: ['rlm', 'removeloadingmessage'],
  command: 'delLoadMessage',
  usage: 'rlm <id> - Remove a slack loading message from the team'
}]

export function kickUser(user, channel, input = false) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: kick <username> <reason (optional)> - removes user from channel' });

    kick(user, channel, input)
      .then(res => {
        resolve({
          type: 'channel',
          message: res
        });
      })
      .catch(reject);
  });
}
export function inviteUser(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: invite <email> - invites a person to the slack channel' })
    let email = input.substr(8).split('|')[0]
    return invite(email).then(resolve).catch(reject)
  })
}
export function channelid(user, channel) {
  return new Promise((resolve, reject) => {
    if (channel && channel.id) return resolve({ type: 'channel', message: "This channel's ID is " + channel.id })
    else return reject('Error?');
  })
}
export function userid(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input || input === user.name) return resolve({ type: 'channel', message: 'Your UserID is ' + user.id })
    findUser(input).then(id => {
      resolve({ type: 'channel', message: input + "'s UserID is " + id })
    }).catch(reject)
  })
}
export function delLast(user, channel, input, ts) {
  return new Promise((resolve, reject) => {
    deleteLastMessage(channel.id, ts).then(() => {
      resolve();
    }).catch(reject);
  });
}
/*export function disableUser(user, channel, input) {
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
}
export function enableUser(user, channel, input) {
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
export function addLoadMessage(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input)
      return resolve({
        type: 'dm',
        message: 'Usage: addloadingmessage <message> - Adds a loading message to the slack team'
      });

    addLoadingMsg(input).then(resp => {
      resolve({
        type: 'channel',
        message: `Successfully added message with id ${resp.id}`
      });
    }).catch(reject)
  })
}
export function delLoadMessage(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input)
      return resolve({
        type: 'dm',
        message: 'Usage: removeloadingmessage <id> - Remove a loading message from the team - ID is required and can only be viewed within the Slack Admin Page'
      });

    deleteLoadingMsg(input).then(() => {
      resolve({
        type: 'channel',
        message: `Successfully removed message with id ${input}`
      });
    }).catch(reject)
  })
}

