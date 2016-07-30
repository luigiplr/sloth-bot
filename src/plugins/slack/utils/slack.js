import Promise from 'bluebird'
import _ from 'lodash'
import { findUser, sendPMThroughSlackbot, getHistory, deleteMessage, kickUser } from '../../../slack.js';
import config from '../../../../config.json'

export function kick(user, channel, input) {
  return new Promise((resolve, reject) => {
    let user = findUser(input.split(' ')[0].toLowerCase())
    let reason = _.slice(input.split(' '), 1).join(' ')

    if (!user) return reject("Found no user by that name")

    if (user.name == config.botname || user.id === config.botid) return reject('Error: Bitch. No.')

    kickUser(channel.id, user.id).then(() => {
      sendPMThroughSlackbot(user.name, `You were kicked from #${channel.name} ${reason || 'for no reason'}`)
      return resolve(`*Kicked: ${user.name}* ${reason || 'for no reason.'}`)
    }).catch(reject).catch(reject)
  })
}

export function deleteLastMessage(channel, messagets) {
  return new Promise((resolve, reject) => {
    deleteMessage(channel, messagets)
    getHistory(channel, 16).then(messages => {
      let ts = _(messages)
        .filter(message => message.user === config.botid)
        .map('ts')
        .value()[0]

      if (!ts) return resolve(false);

      deleteMessage(channel, ts)
      return resolve()
    }).catch(reject);
  })
}
