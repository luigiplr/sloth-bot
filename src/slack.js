import { forEach, delay, find, get } from 'lodash'
import needle from 'needle'
import config from '../config.json'
import { queue, retry } from 'async'

let userNamesCache = {}
export var usersCache = {}

export function updateUsersCache() {
  return new Promise((resolve, reject) => getUsers(true).then(members => {
    if (!members) return reject(_logErr('updateUsersCache', 'No users?'))
    userNamesCache = {}
    usersCache = {}
    forEach(members, member => {
      usersCache[member.id] = member
      userNamesCache[member.name] = member.id
    })
    return resolve(`Successfully updated UsersCache`)
  }))
}

setTimeout(() => {
  updateUsersCache().then(console.log, console.error) // Update da cache on startup
}, 1000)

/**
 * Send a message to a slack channel
 * @param id of the channel
 * @param text to be sent
 * @param optional array of attachments
 * @return true or an error
 */
export function sendMessage(channel, input, attachments) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/chat.postMessage', {
    text: input,
    channel: channel,
    as_user: 'true',
    token: config.slackBotToken,
    icon_url: config.imageURL,
    attachments: typeof attachments === 'string' ? attachments : JSON.stringify(attachments)
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('sendMsgErr', err || error))
    resolve()
  }))
}

/**
 * Send a message to a slack channel
 * @param username to send PM to
 * @param text to be sent
 * @return true or an error
 */
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

/**
 * Renames a channel
 * @param {string} channel - id of the channel to rename
 * @param {string} newName - new name of the channel
 */
export function renameChannel(channel, newName) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/channels.rename', {
    name: newName,
    channel: channel,
    token: config.slackAPIToken
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('renameChannelErr', err || error))
    resolve()
  }))
}

/**
 * Returns message history for a channel
 * @param id of the channel
 * @param optional limit - default 100
 * @return array of messages
 */
export function getHistory(channel, limit = 100) {
  return new Promise((resolve, reject) => needle.post(`https://slack.com/api/${channel[0] === 'C' ? 'channels.history' : channel[0] === 'G' ? 'groups.history' : 'im.history'}`, {
    channel: channel,
    token: config.slackBotToken,
    count: limit
  }, (err, resp, { error, messages }) => {
    if (err || error) return reject(_logErr('getHistoryErr', err || error))
    resolve(messages)
  }))
}

/**
 * Kicks a user from a channel
 * @param id of the channel
 * @param id of the user
 * @return true or an error
 */
export function kickUser(channel, user) {
  return new Promise((resolve, reject) => needle.post(`https://slack.com/api/${channel[0] === 'C' ? 'channels.kick' : 'groups.kick'}`, {
    channel: channel,
    token: config.slackAPIToken || config.slackBotToken,
    user: user
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('kickUserErr', err || error))
    resolve()
  }))
}

/**
 * Kicks a user from a channel
 * @param id of the channel
 * @param id of the user
 * @return true or an error
 */
export function inviteUser(channel, user) {
  return new Promise((resolve, reject) => needle.post(`https://slack.com/api/${channel[0] === 'C' ? 'channels.invite' : 'groups.invite'}`, {
    channel: channel,
    token: config.slackAPIToken || config.slackBotToken,
    user: user
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('kickUserErr', err || error))
    resolve()
  }))
}

/**
 * Returns a user object for user name or slack id
 * @param user name or slack id
 * @return user object
 */
export function findUser(user) {
  if (!user) return undefined
  let userID = user.slice(0, 2) === '<@' ? user.slice(2, -1).toUpperCase() : false
  let member = usersCache[userID || userNamesCache[user.toLowerCase()]]
  return member || usersCache[user]
}

/**
 * Searches for a user by specified paramters e.g
 * findUserByParam(['profile', 'email'], 'topkek@gmail.com')
 * @param paramater to check
 * @param value to check for
 * @return user object
 */
export function findUserByParam(what, equals) {
  // Switch to ID if the username is a SlackID <@UDJHF739J>
  if (what === 'name' && equals.slice(0, 2) === '<@') {
    what = 'id'
    equals = equals.slice(2, -1)
  }
  return find(usersCache, user => {
    return get(user, what, 0) === equals
  })
}

/**
 * Returns list of all users on team
 * @param optionally make API request to fetch new users list
 * @return users list object
 */
export function getUsers(noCache) {
  return new Promise((resolve, reject) => {
    if (!noCache) return resolve(usersCache)
    needle.post('https://slack.com/api/users.list', {
      token: config.slackBotToken
    }, (err, resp, body) => {
      if (!body) return reject(_logErr('getUsersErr', 'No body?'))
      if (err || body.error) return reject(_logErr('getUsersErr', err || body.error))
      return resolve(body.members)
    })
  })
}

/**
 * Adds a loading message to the team
 * @param message to be added
 * @return id of the added message
 */
export function addLoadingMsg(message) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/team.loading.addMsg', {
    token: config.slackAPIToken || config.slackBotToken,
    message: message
  }, (err, resp, { error, id }) => {
    if (err || error) return reject(_logErr('addLoadingMsgErr', err || error))
    resolve(id)
  }))
}

/**
 * Adds a loading message to the team
 * @param id of the message to be deleted
 * @return true or an error
 */
export function deleteLoadingMsg(id) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/team.loading.deleteMsg', {
    token: config.slackAPIToken || config.slackBotToken,
    id: id
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('delLoadingMsgErr', err || error))
    resolve()
  }))
}

/**
 * Invites a user to the team
 * @param email of the user to be invited
 * @return sucess message or error message (already invited)
 */
export function invite(email) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/users.admin.invite', {
    email: email,
    token: config.slackAPIToken || config.slackBotToken,
    set_active: true
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('inviteErr', err || error))
    resolve(`${email} invited successfully`)
  }))
}

/**
 * Disables a users account on the team
 * @param id of the user
 * @param special token
 * @return success or error
 */
export function setInactive(user, token) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/users.admin.setInactive', {
    token: token,
    user: user.id
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('setInactiveErr', err || error))
    resolve(`Successfully disabled ${user.name}`)
  }))
}

/**
 * Enables a users account on the team
 * @param id of the user
 * @param special token
 * @return success or error
 */
export function setRegular(user, token) {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/users.admin.setRegular', {
    token: token,
    user: user.id
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('setRegularErr', err || error))
    resolve(`Successfully enabled ${user.name}`)
  }))
}

/**
 * Returns a list of all channels
 */
export function getChannelsList() {
  return new Promise((resolve, reject) => needle.post('https://slack.com/api/channels.list', {
    token: config.slackAPIToken || config.slackBotToken,
    exclude_archived: true
  }, (err, resp, { error }) => {
    if (err || error) return reject(_logErr('getChannelsListErr', err || error))
    resolve(resp.body.channels)
  }))
}

/**
 * Deletes a message in a channel
 * @param id of the channel
 * @param ts (timestamp) of the message
 */
export function deleteMessage(channel, ts) {
  deleteQueue.push({ channel, ts })
}

const deleteQueue = queue((task, cb) => {
  const deleteMessageFn = callback => {
    needle.post('https://slack.com/api/chat.delete', {
      channel: task.channel,
      token: config.slackAPIToken || config.slackBotToken,
      ts: task.ts
    }, (err, resp, { error }) => {
      if (err || error) {
        console.error(`Error deleting message ${err || error}`)
        return callback(err || error)
      }

      delay(() => { callback() }, 550)
    })
  }

  retry({
    times: 4,
    interval: retryCount => {
      return 50 * Math.pow(2, retryCount)
    }
  }, deleteMessageFn, (err, res) => {
    if (err) {
      console.error('Error deleteing message??', err)
    }

    cb()
  })
}, 3)

const _logErr = (type, err) => {
  console.error(type, ':', err)
  return `${type}: ${err}`
}
