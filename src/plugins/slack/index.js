import Promise from 'bluebird'
import { kick, deleteLastMessage } from './utils/slack'
import { invite, findUser, addLoadingMsg, deleteLoadingMsg, updateUsersCache } from '../../slack.js'
import { InviteUsers } from '../../database'
import moment from 'moment'

export const plugin_info = [{
  alias: ['kick'],
  command: 'kickUser',
  usage: 'kick <username> [reason] - kicks user from channel',
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
  alias: ['dellast', 'dellastmessage'],
  command: 'delLast',
  usage: 'dellast - deletes the last message from the bot'
}, {
  alias: ['alm', 'addloadingmessage'],
  command: 'addLoadMessage',
  usage: 'alm <message> - adds a slack loading message to the team'
}, {
  alias: ['rlm', 'removeloadingmessage'],
  command: 'delLoadMessage',
  usage: 'rlm <id> - remove a slack loading message from the team'
}, {
  alias: ['whoinvited'],
  command: 'whoInvited',
  usage: 'whoinvited <user> - finds out who invited user to team'
}, {
  alias: ['invitedwho'],
  command: 'invitedWho',
  usage: 'whoinvited <user> - shows who user has invited to the team'
}, {
  alias: ['updateusercache'],
  command: 'updateUserCache',
  userLevel: ['admin', 'superadmin']
}]

export function kickUser(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: kick <username> [reason]> - Kicks a user from the channel' })

    kick(user, channel, input).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
  })
}

export function inviteUser(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: invite <email> - invites a person to the slack channel' })
    let email = input.substr(8).split('|')[0]

    invite(email).then(resp => {
      resolve({ type: 'channel', message: resp })
      InviteUsers.findOneByEmail(email).then(res => {
        let newInv = res ? res : new InviteUsers()
        newInv.inviter = user.name
        newInv.email = email
        newInv.date = moment().utc().format()
      })
    }).catch(reject)
  })
}

export function whoInvited(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: "Usage: whoinvited <user> - Returns information for who invited user if it's available" })
    InviteUsers.findOneByInvitedUser(input).then(resp => {
      if (resp) return resolve({ type: 'channel', message: `_${resp.invitedUser}_ was invited by *${resp.inviter}* on ${moment(resp.date).isValid() ? 'on ' + moment(resp.date).format("dddd, Do MMM YYYY") : ''}` })

      findUser(input, 'email').then(({ name, email }) => {
        InviteUsers.findOneByEmail(email).then(resp => {
          if (!resp) return reject("I don't have invite data for this user :(")
          resp.invitedUser = name
          resp.Persist()
          return resolve({ type: 'channel', message: `_${resp.invitedUser}_ was invited by *${resp.inviter}* ${moment(resp.date).isValid() ? 'on ' + moment(resp.date).format("dddd, Do MMM YYYY") : ''}` })
        })
      }).catch(reject)
    })
  })
}

export function invitedWho(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: "Usage: invitedwho <user> - Returns list of users that have been invited by user" })
    InviteUsers.findByInviter(input.toLowerCase()).then(resp => {
      if (!resp[0]) return reject("Couldn't find any users invited by this user")
      let out = [`${input.toLowerCase()} has invited ${resp.length} members to this team:`]
      resp.forEach(invitee => {
        out.push(` - *${invitee.invitedUser}* on ${moment(invitee.date).isValid() ? moment(invitee.date).format("dddd, Do MMM YYYY") : 'Unknown'}`)
      })
      return resolve({ type: 'channel', messages: out })
    })
  })
}

export function channelid(user, channel) {
  return new Promise(resolve => resolve({ type: 'channel', message: "This channel's ID is " + channel.id }))
}

export function userid(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input || input === user.name) return resolve({ type: 'channel', message: 'Your UserID is ' + user.id })

    findUser(input).then(id => resolve({ type: 'channel', message: `${input}'s UserID is ${id}` })).catch(reject)
  })
}

export function delLast(user, channel, input, ts) {
  return new Promise((resolve, reject) => deleteLastMessage(channel.id, ts).then(resolve).catch(reject))
}

export function addLoadMessage(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: addloadingmessage <message> - Adds a loading message to the slack team' })

    addLoadingMsg(input).then(resp => resolve({ type: 'channel', message: `Successfully added message with id ${resp.id}` })).catch(reject)
  })
}

export function delLoadMessage(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input)
      return resolve({ type: 'dm', message: 'Usage: removeloadingmessage <id> - Remove a loading message from the team - ID is required and can only be viewed within the Slack Admin Page' });

    deleteLoadingMsg(input).then(() => resolve({ type: 'channel', message: `Successfully removed message with id ${input}` })).catch(reject)
  })
}

export function updateUserCache() {
  return new Promise((resolve, reject) => updateUsersCache().then(resp => resolve({ type: 'channel', message: resp })).catch(reject))
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
}*/
