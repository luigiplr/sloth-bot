import Promise from 'bluebird'
import { forEach, delay } from 'lodash'
import needle from 'needle'
import config from '../config.json'
import { queue } from 'async'

let userNamesCache = {}
let usersCache = {}

export function updateUsersCache() {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/users.list', {
    token: config.slackBotToken
  }, (err, resp, body) => {
    if (!body) return reject(_logErr('updateUserCacheErr', 'No body?!'))
    if (err || body.error) return reject(_logErr('updateUserCacheErr', err || body.error))
    userNamesCache = {}
    usersCache = {}
    forEach(body.members, member => {
      usersCache[member.id] = member
      userNamesCache[member.name] = member.id
    })
    return resolve(`Successfully updated UsersCache`)
  }))
}

setTimeout(() => {
  updateUsersCache().then(console.log, console.error) // Update da cache on startup
}, 1000)

export function sendMessage(channel, input, attachments) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/chat.postMessage', {
    text: input,
    channel: channel,
    as_user: 'true',
    token: config.slackBotToken,
    icon_url: config.imageURL,
    attachments: attachments
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('sendMsgErr', err || error))
    resolve()
  }))
}

export function sendPMThroughSlackbot(channel, input) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/chat.postMessage', {
    text: input,
    channel: `@${channel}`,
    token: config.slackBotToken,
    username: config.botname,
    icon_url: config.imageURL
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('sendPMSbErr', err || error))
    resolve()
  }))
}

export function getHistory(channel, limit = 100) {
  return new Promise((resolve, reject) => needle.post(`https://slack.com/api/${channel[0] == 'C' ? 'channels.history' : 'groups.history'}`, {
    channel: channel,
    token: config.slackBotToken,
    count: limit
  }, (err, resp, { error, messages }) => {
    if (err || error) return reject(_logErr('getHistoryErr', err || error))
    resolve(messages)
  }))
}

export function kickUser(channel, user) {
  return new Promise((resolve, reject) => needle.post(`https://slack.com/api/${channel[0] == 'C' ? 'channels.kick' : 'groups.kick'}`, {
    channel: channel,
    token: config.slackAPIToken,
    user: user
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('kickUserErr', err || error))
    resolve()
  }))
}

export function findUser(user, type) {
  return new Promise((resolve, reject) => {

    let userID = user.slice(0, 2) == "<@" ? user.slice(2, -1) : false
    let member = usersCache[userID ? userID : userNamesCache[user.toLowerCase()]]

    if (!member) return reject("Couldn't find a user by that name")

    if (type == 'email') return resolve({ name: member.name, email: member.profile.email }) // Dirty Cheat
    if (type == 'full') return resolve(member) // Dirty Cheat
    resolve(type == 'both' ? { name: member.name, id: member.id } : (type == 'name' ? member.name : member.id))
  })
}

export function getUsers() {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/users.list', {
    token: config.slackBotToken
  }, (err, resp, { error, members }) => {
    if (err || error) return reject(_logErr('getUsersErr', err || error))
    return resolve(members)
  }))
}

export function setInactive(user) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/users.admin.setInactive', {
    token: config.slackAPIToken,
    user: user,
    set_active: true,
    _attempts: 1
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('setInactiveErr', err || error))
    resolve()
  }))
}

export function setRegular(user) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/users.admin.setRegular', {
    token: config.slackAPIToken,
    user: user,
    set_active: true,
    _attempts: 1
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('setRegularErr', err || error))
    resolve()
  }))
}

export function addLoadingMsg(message) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/team.loading.addMsg', {
    token: config.slackAPIToken,
    message: message
  }, (err, resp, { error, id }) => {
    if (err || error) return reject(_logErr('addLoadingMsgErr', err || error))
    resolve(id)
  }))
}

export function deleteLoadingMsg(id) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/team.loading.deleteMsg', {
    token: config.slackAPIToken,
    id: id
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('delLoadingMsgErr', err || error))
    resolve()
  }))
}

export function invite(email) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/users.admin.invite', {
    email: email,
    token: config.slackAPIToken,
    set_active: true
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('inviteErr', err || error))
    resolve(`${email} invited successfully`)
  }))
}

export function deleteMessage(channel, ts) {
  deleteQueue.push({ channel, ts })
}

const deleteQueue = queue((task, cb) => {
  needle.post('https://slack.com/api/chat.delete', {
    channel: task.channel,
    token: config.slackAPIToken,
    ts: task.ts
  }, (err, resp, { error }) => {
    if (err || error) console.error(`Error deleting message ${err || error}`)
    delay(() => { cb() }, 1000)
  })
}, 4)

const _logErr = (type, err) => {
  console.error(type, ':', err)
  return `${type}: ${err}`
}
