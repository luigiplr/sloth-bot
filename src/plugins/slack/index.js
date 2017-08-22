import { kick, deleteLastMessage, enableOrDisableUser, getInviteForUser } from './utils/slack'
import { invite, findUser, findUserByParam, addLoadingMsg, deleteLoadingMsg, updateUsersCache } from '../../slack.js'
import moment from 'moment'
import { filter } from 'lodash'
import perms from '../../permissions'
import config from '../../../config.json'
import { InviteUsers } from '../../database'

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
  alias: ['modifyinvite'],
  command: 'modifyInvite',
  userLevel: ['superadmin']
}, {
  alias: ['updateusercache'],
  command: 'updateUserCache',
  userLevel: ['admin', 'superadmin']
}, {
  alias: ['whois'],
  command: 'whois',
  usage: 'whois <user> - tells you who they are'
}, {
  alias: ['disable'],
  command: 'disableUser',
  usage: 'disableuser <user> - disables the users slack account',
  userLevel: ['superadmin']
}, {
  alias: ['enable'],
  command: 'enableUser',
  usage: 'enableuser <user> - enables the users slack account',
  userLevel: ['superadmin']
}, {
  alias: ['reconnect'],
  command: 'reconnect',
  usage: 'reconnect <user> - disables and enables the users account causing them to reconnect',
  userLevel: ['admin', 'superadmin']
}]

const canPerformAdminCommands = config.slackAPIToken && config.slackAPIToken.length > 0
const adminErr = '`missing admin api key, cannot perform admin commands`'

export function kickUser(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!canPerformAdminCommands) return reject(adminErr)
    if (!input) return resolve({ type: 'dm', message: 'Usage: kick <username> [reason]> - Kicks a user from the channel' })

    kick(user, channel, input).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
  })
}

export function inviteUser(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!canPerformAdminCommands) return reject(adminErr)
    if (!input) return resolve({ type: 'dm', message: 'Usage: invite <email> - invites a person to the slack channel' })
    let email = input.substr(8).split('|')[0]

    invite(email).then(resp => {
      resolve({ type: 'channel', message: resp })
      InviteUsers.findOneByEmail(email).then(res => {
        let newInv = res ? res : new InviteUsers()
        newInv.inviter = user.name
        newInv.email = email.toLowerCase()
        newInv.date = moment().utc().format()
        newInv.Persist()
      })
    }).catch(reject)
  })
}

export function whoInvited(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: "Usage: whoinvited <user> - Returns information for who invited user if it's available" })
    user = findUser(input)
    if (!user) return reject("Found no user by that name")
    getInviteForUser(user).then(resp => {
      if (!resp) return reject("I don't have invite data for this user :(")
      return resolve({ type: 'channel', message: `_${resp.invitedUser}_ was invited by *${resp.inviter}* ${moment(resp.date).isValid() ? 'on ' + moment(resp.date).format("dddd, Do MMM YYYY") : ''}` })
    }).catch(reject)
  })
}

export function invitedWho(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: "Usage: invitedwho <user> - Returns list of users that have been invited by user" })
    InviteUsers.findByInviter(input.toLowerCase()).then(resp => {
      if (!resp[0]) return reject("Couldn't find any users invited by this user")
      let out = [`${input.toLowerCase()} has invited ${resp.length} members to this team:`]
      let pending = 0
      resp.forEach(invitee => {
        invitee.invitedUser ? (out.push(` - *${invitee.invitedUser}* on ${moment(invitee.date).isValid() ? moment(invitee.date).format("dddd, Do MMM YYYY") : 'Unknown'}`)) : pending++
      })
      pending ? out.push(` - _${pending} pending invitation${pending > 1 ? 's' : ''}_`) : void 0
      return resolve({ type: 'channel', messages: out })
    })
  })
}

export function modifyInvite(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: addinvite <add|remove|edit> <email> <inviter> <date> - Email, date and inviter are required, email and inviter cannot contain spaces' })
    let split = input.split(' ')
    let type = split[0]
    let email = split[1]
    let inviter = split[2]
    let date = split.slice(3).join(' ')
    if (type !== 'add' && type !== 'edit') return reject("Invalid type, only `add` and `edit` are currently supported")
    if (!email.includes('<mailto:')) return reject(`Invalid email recieved: ${email}`)
    if (moment(new Date(inviter)).isValid()) return reject("Invalid inviter")
    if (!moment(new Date(date)).isValid()) {
      if (date == 'today') date = moment()
      else return reject("Invalid date")
    }

    email = email.substr(8).split('|')[0].toLowerCase()
    date = moment(new Date(date))

    InviteUsers.findOneByEmail(email).then(resp => {
      if (resp && type == 'add') return reject("Error: Email already in DB, if you wish to edit it you can use the `edit` type")
      let newInv = type == 'add' ? new InviteUsers() : resp
      newInv.inviter = inviter.toLowerCase()
      newInv.email = email
      newInv.date = date.utc().format()
      newInv.Persist()
      return resolve({ type: 'channel', message: `Successfully ${type == 'add' ? 'added' : 'edited'} invite for: ${email}, invited by ${inviter} on ${date.format("dddd, Do MMM YYYY")}` })
    })
  })
}

export function channelid(user, channel) {
  return new Promise(resolve => resolve({ type: 'channel', message: "This channel's ID is " + channel.id }))
}

export function userid(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input || input === user.name) return resolve({ type: 'channel', message: 'Your UserID is ' + user.id })

    user = findUser(input)
    if (!user) return reject("Found no user by that name")
    return resolve({ type: 'channel', message: `${user.name}'s UserID is ${user.id}` })
  })
}

export function delLast(user, channel, input, ts) {
  return new Promise((resolve, reject) => deleteLastMessage(channel.id, ts).then(resolve).catch(reject))
}

export function addLoadMessage(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!canPerformAdminCommands) return reject(adminErr)
    if (!input) return resolve({ type: 'dm', message: 'Usage: addloadingmessage <message> - Adds a loading message to the slack team' })

    addLoadingMsg(input).then(id => resolve({ type: 'channel', message: `Successfully added message with id ${id}` })).catch(reject)
  })
}

export function delLoadMessage(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!canPerformAdminCommands) return reject(adminErr)
    if (!input)
      return resolve({ type: 'dm', message: 'Usage: removeloadingmessage <id> - Remove a loading message from the team - ID is required and can only be viewed within the Slack Admin Page' });

    deleteLoadingMsg(input).then(() => resolve({ type: 'channel', message: `Successfully removed message with id ${input}` })).catch(reject)
  })
}

export function updateUserCache() {
  return new Promise((resolve, reject) => updateUsersCache().then(resp => resolve({ type: 'channel', message: resp })).catch(reject))
}

export function whois(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return reject("Who am I looking for??")
    let type = 'name'
    let query = input
    if (input.includes('<mailto:')) {
      type = ['profile', 'email']
      query = input.substr(8).split('|')[0]
    }
    let u = findUserByParam(type, query) || findUserByParam('id', query)
    if (!u) return reject("Couldn't find a user matching input")

    let p = perms.getAll
    getInviteForUser(u).then(resp => {
      let invited = resp ? `- They were invited by ${resp.inviter} ${moment(resp.date).isValid() ? 'on ' + moment(resp.date).format("dddd, Do MMM YYYY") : ''}` : "- I don't know when they were invited to the team"

      let name = `*${u.name}* ${u.real_name ? 'or otherwise known as ' + u.real_name : ''}`
      let deleted = u.deleted ? '- This users account has been deactivated' : null
      let bot = u.is_bot ? `- This user is a bot` : null
      let admin = (u.is_admin || u.is_owner) ? `- They are an Admin${u.is_owner ? (' and ' + (u.is_primary_owner ? 'Primary Owner' : 'Owner')) : ''} of this team` : bot || deleted ? null : '- They are a regular user of this team'
      let region = (u.tz && u.tz.split('/')[1]) ? `- I think they are located in ${u.tz.split('/')[0]} near ${u.tz.split('/')[1].replace('_', ' ')} based on their timezone` : null
      let ignored = p.allIgnored.includes(u.name) ? `- They are also currently ${p.permaIgnored.includes(u.name) ? 'perma-' : ''}ignored by the bot` : null
      let botAdmin = p.owners.includes(u.name) ? '- They are also an Owner of this bot' : p.admins.includes(u.name) ? '- They are also an Admin of this bot' : null

      return resolve({ type: 'channel', message: filter([name, bot, deleted, admin, invited, region, ignored, botAdmin], null).join('\n') })
    })
  })
}

export function enableUser(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!canPerformAdminCommands) return reject(adminErr)
    if (!input) return reject("Please specify a user")

    let u = findUser(input)
    if (!u) return reject("Found no user by that name")
    if (!u.deleted) return reject(`${u.name} is already enabled`)

    enableOrDisableUser(1, u).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
  })
}

const cantDisable = u => u.id == config.botid || perms.superadmins.includes(u.name) || (config.noDisable && config.noDisable.includes(u.id))

export function disableUser(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!canPerformAdminCommands) return reject(adminErr)
    if (!input) return reject("Please specify a user")

    let u = findUser(input)
    if (!u) return reject("Found no user by that name")
    if (u.deleted) return reject(`${u.name} is already disabled`)
    if (cantDisable(u)) return reject("Error: Bitch. No.")
    enableOrDisableUser(0, u).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
  })
}

export function reconnect(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!canPerformAdminCommands) return reject(adminErr)
    if (!input) return reject("Please specify a user")

    let u = findUser(input)
    if (!u) return reject("Found no user by that name")
    if (u.deleted) return reject(`${u.name} is a disabled account`)
    if (cantDisable(u)) return reject("Error: Bitch. No.")

    enableOrDisableUser(0, u).then(() => {
      setTimeout(() => {
        enableOrDisableUser(1, u).then(() => {
          return resolve("Dun")
        }).catch(reject)
      }, 5000);
    }).catch(reject)
  })
}
