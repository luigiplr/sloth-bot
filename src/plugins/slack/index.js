import { kick, deleteLastMessage, enableOrDisableUser, getInviteForUser } from './utils/slack'
import { renameChannel, invite, getHistory, deleteMessage, findUser, findUserByParam, addLoadingMsg, deleteLoadingMsg, updateUsersCache, getChannelsList, kickUser as kickUserRaw, inviteUser as inviteUserRAW } from '../../slack.js'
import moment from 'moment'
import _ from 'lodash'
import perms from '../../permissions'
import config from '../../../config.json'
import { InviteUsers } from '../../database'

export const plugin_info = [{
  alias: ['kick'],
  command: 'kickUser',
  usage: 'kick <username> [reason] - kicks user from channel'
}, {
  alias: ['inviteall'],
  command: 'inviteAllUser',
  usage: 'inviteall <username> - invites user to all channels'
}, {
  alias: ['kickall'],
  command: 'kickAllUser',
  usage: 'kickall <username> - kicks user from all their channel'
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
  alias: ['avatar'],
  command: 'avatar',
  usage: 'userid <user> - returns avatar for a user'
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
}, {
  alias: ['purge'],
  command: 'purge',
  usage: 'purge <count> - purges messages',
  userLevel: ['superadmin']
}, {
  alias: ['renamechannel'],
  command: 'renamechannel',
  usage: 'renamechannel <name> - renames a channel',
  userLevel: ['admin', 'superadmin']
}, {
  alias: ['disablechannel'],
  command: 'disableChannel',
  usage: 'disablechannel',
  userLevel: ['superadmin']
}]

const canPerformAdminCommands = config.slackAPIToken && config.slackAPIToken.length > 0
const adminErr = '`missing admin api key, cannot perform admin commands`'
const cantDisable = u => u.id === config.botid || perms.superadmins.includes(u.name) || (config.noDisable && config.noDisable.includes(u.id))

const awaitingPurgeConfirmation = {}

export async function disableChannel(user, channel, input) {
  if (!('disabledChannels' in config)) {
    config.disabledChannels = []
  }

  if (config.disabledChannels.includes(channel.id)) {
    const idx = config.disabledChannels.indexOf(channel.id)
    config.disabledChannels.splice(idx, 1)
  } else {
    config.disabledChannels.push(channel.id)
  }
}

export async function purge(user, channel, input) {
  if (!input) return 'Usage: purge <count> - purges the amount of messages'

  const amount = +input

  if (_.isNaN(amount) || amount <= 0) {
    return 'Invalid number'
  }

  if (amount > 40) {
    return 'Maximum purge amount is 40'
  }

  const uniqueId = `${user.id}@${channel.id}`
  const timeOfCommand = awaitingPurgeConfirmation[uniqueId]

  if (!(uniqueId in awaitingPurgeConfirmation) || timeOfCommand + 20000 < Date.now()) {
    awaitingPurgeConfirmation[uniqueId] = Date.now()
    return `Are you sure you want to purge ${amount} messages from the chat? Re-enter the command to continue, you have 20 seconds.`
  }

  delete awaitingPurgeConfirmation[uniqueId]

  try {
    const messages = await getHistory(channel.id, amount + 3)

    messages.forEach(msg => deleteMessage(channel.id, msg.ts))
  } catch (e) {
    return 'Error fetching message history'
  }
}

export function kickAllUser(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (user.id !== config.owner) return reject("*Access DENIED!!1!111!!eleven!*")
    if (!canPerformAdminCommands) return reject(adminErr)
    if (!input) return resolve({ type: 'dm', message: 'Usage: kickall <username> - Kicks a user from all their channel' })

    const u = findUser(input)
    if (!u) return reject('Found no user matching input')
    if (cantDisable(u)) return reject('Error: Bitch. No.')

    getChannelsList()
      .then(channels => {
        let channelsWasKicked = 0

        for (let channel of channels) {
          if (channel.is_general) continue
          if (channel.members.includes(u.id)) {
            kickUserRaw(channel.id, u.id)
            channelsWasKicked++
          }
        }

        resolve({ type: 'channel', message: `Kicked: ${u.name} from ${channelsWasKicked - 1} channels` })
      })
  })
}

export function inviteAllUser(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (user.id !== config.owner) return reject("*Access DENIED!!1!111!!eleven!*")
    if (!canPerformAdminCommands) return reject(adminErr)
    if (!input) {
      return resolve({ type: 'dm', message: 'Usage: inviteall <username>' })
    }

    const u = findUser(input)
    if (!u) return reject('Found no user matching input')
    if (cantDisable(u)) return reject('Error: Bitch. No.')

    getChannelsList()
      .then(channels => {
        for (let channel of channels) {
          if (channel.is_general) continue
          if (!channel.members.includes(u.id)) {
            inviteUserRAW(channel.id, u.id)
          }
        }

        resolve({ type: 'channel', message: `Invited: ${u.name} to ${channels.length - 1} channels` })
      })
  })
}

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
        let newInv = res || new InviteUsers()
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
      if (date === 'today') date = moment()
      else return reject("Invalid date")
    }

    email = email.substr(8).split('|')[0].toLowerCase()
    date = moment(new Date(date))

    InviteUsers.findOneByEmail(email).then(resp => {
      if (resp && type === 'add') return reject("Error: Email already in DB, if you wish to edit it you can use the `edit` type")
      let newInv = type === 'add' ? new InviteUsers() : resp
      newInv.inviter = inviter.toLowerCase()
      newInv.email = email
      newInv.date = date.utc().format()
      newInv.Persist()
      return resolve({ type: 'channel', message: `Successfully ${type === 'add' ? 'added' : 'edited'} invite for: ${email}, invited by ${inviter} on ${date.format("dddd, Do MMM YYYY")}` })
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
    if (!input) {
      return resolve({ type: 'dm', message: 'Usage: removeloadingmessage <id> - Remove a loading message from the team - ID is required and can only be viewed within the Slack Admin Page' })
    }

    deleteLoadingMsg(input).then(() => resolve({ type: 'channel', message: `Successfully removed message with id ${input}` })).catch(reject)
  })
}

export function updateUserCache() {
  return new Promise((resolve, reject) => updateUsersCache().then(resp => resolve({ type: 'channel', message: resp })).catch(reject))
}

export async function whois(user, channel, input) {
  if (!input) {
    throw 'Who am I looking for??'
  }

  let type = 'name'
  let query = input
  if (input.includes('<mailto:')) {
    type = ['profile', 'email']
    query = input.substr(8).split('|')[0]
  }

  let p = perms.getAll
  let u = findUserByParam(type, query) || findUserByParam('id', query)
  if (!u) {
    throw 'Couldn\'t find a user matching input'
  }

  let inviteData
  try {
    inviteData = await getInviteForUser(u)
  } catch (e) {
    // ignored
  }

  const isAdminOrOwner = u.is_admin || u.is_owner
  const isRestricted = u.is_restricted || u.is_ultra_restricted

  const messages = [
    `*${u.name}* ${u.real_name ? 'or otherwise known as ' + u.real_name : ''}`,
    u.deleted ? '- This users account has been deactivated' : null,
    u.is_bot ? `- This user is a bot` : null,
    isAdminOrOwner ? `- They are an Admin${u.is_owner ? (' and ' + (u.is_primary_owner ? 'Primary Owner' : 'Owner')) : ''} of this team` : null,
    (!isAdminOrOwner && !isRestricted && !u.is_bot) ? '- They are a regular user of this team' : null,
    isRestricted ? `- They are a ${u.is_ultra_restricted ? 'single ' : 'multi-'}channel guest` : null,
    inviteData ? `- They were invited by ${inviteData.inviter} ${moment(inviteData.date).isValid() ? 'on ' + moment(inviteData.date).format("dddd, Do MMM YYYY") : ''}` : null,
    (u.tz && u.tz.split('/')[1]) ? `- I think they are located in ${u.tz.split('/')[0]} near ${u.tz.split('/')[1].replace('_', ' ')} based on their timezone` : null,
    p.allIgnored.includes(u.name) ? `- They are also currently ${p.permaIgnored.includes(u.name) ? 'perma-' : ''}ignored by the bot` : null,
    p.owners.includes(u.name) ? '- They are also an Owner of this bot' : p.admins.includes(u.name) ? '- They are also an Admin of this bot' : null
  ].filter(Boolean)

  return { type: 'channel', messages }
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
      }, 5000)
    }).catch(reject)
  })
}

export async function avatar(user, channel, input) {
  if (!input) return { type: 'dm', message: 'Usage: avatar <user> - returns a users avatar' }

  const u = findUser(input)
  if (!u) throw "Couldn't find user matching input"

  if (!u.profile.image_original) throw `${u.name} has no avatar`

  return { type: 'channel', message: `${u.name}'s avatar is: ${u.profile.image_original}` }
}

const channelNameRx = /^[a-z0-9-_]+$/
export async function renamechannel(user, channel, input) {
  if (!input) {
    return { type: 'dm', message: 'Usage: renamechannel <name> - renames a channel' }
  }

  if (input.length <= 1 || input.length > 21) {
    throw 'Channel name is too long, must be 21 characters or less'
  }

  if (!channelNameRx.test(input)) {
    throw 'Channel names can only contain lowercase letters, numbers, hyphens, and underscores'
  }

  return await renameChannel(channel.id, input)
}
