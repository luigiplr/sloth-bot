import Promise from 'bluebird'
import _ from 'lodash'
import needle from 'needle'
import config from '../config.json'

export function sendMessage(channel, input) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/chat.postMessage', {
    text: input,
    channel: channel,
    as_user: 'true',
    token: config.slackAPIToken,
    icon_url: config.imageURL
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr(`sendMsgErr ${err || error}`))
    resolve()
  }))
}

export function sendPMThroughSlackbot(channel, input) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/chat.postMessage', {
    text: input,
    channel: `@${channel}`,
    token: config.slackAPIToken,
    username: config.botname,
    icon_url: config.imageURL
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr(`sendPMSbErr ${err || error}`))
    resolve()
  }))
}

export function deleteMessage(channel, ts) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/chat.delete', {
    channel: channel,
    token: config.slackToken,
    ts: ts
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr(`DelMsgErr ${err || error}`))
    resolve();
  }))
}

export function getHistory(channel, limit = 100) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/channels.history', {
    channel: channel,
    token: config.slackAPIToken,
    count: limit
  }, (err, resp, { error, messages }) => {
    if (err || error) return reject(_logErr(`getHistoryErr ${err || error}`))
    resolve(messages);
  }))
}

export function findUser(user, type) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/users.list', {
    token: config.slackAPIToken
  }, (err, resp, { error, members }) => {
    if (err || error) return reject(_logErr(`findUserErr ${err || error}`))

    let isID = user.slice(0, 2) == "<@"
    let member = _.find(members, ({ name, id }) => {
      return isID ? id === user.slice(2, user.length - 1) : name === user
    })

    if (!member) return reject("Couldn't find a user by that name")

    resolve(type == 'both' ? { name: member.name, id: member.id } : (type == 'name' ? member.name : member.id))
  }))
}

export function setInactive(user) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/users.admin.setInactive', {
    token: config.slackToken,
    user: user,
    set_active: true,
    _attempts: 1
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr(`setInactiveErr ${err || error}`))
    resolve()
  }))
}

export function setRegular(user) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/users.admin.setRegular', {
    token: config.slackToken,
    user: user,
    set_active: true,
    _attempts: 1
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr(`setRegularErr ${err || error}`))
    resolve()
  }))
}

export function addLoadingMsg(message) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/team.loading.addMsg', {
    token: config.slackToken,
    message: message
  }, (err, resp, { error, id }) => {
    if (err || error) return reject(_logErr(`addLoadingMsgErr ${err || error}`))
    resolve(id)
  }))
}

export function deleteLoadingMsg(id) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/team.loading.deleteMsg', {
    token: config.slackToken,
    id: id
  }, (err, resp, body) => {
    if (err || body.error) return reject(_logErr(`delLoadingMsgErr ${err || body.error}`))
    resolve()
  }))
}

export function invite(email) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/users.admin.invite', {
    email: email,
    token: config.slackToken,
    set_active: true
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr(`inviteErr ${err || error}`))
    resolve(`${email} invited successfully`)
  }))
}

const _logErr = (type, err) => {
  console.error(type, err)
  return `${type} ${err}`
}

