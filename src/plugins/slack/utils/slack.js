import Promise from 'bluebird'
import _ from 'lodash'
import { findUser, sendPMThroughSlackbot, getHistory, deleteMessage, kickUser } from '../../../slack.js';
import config from '../../../../config.json'

export function kick(user, channel, input) {
  return new Promise((resolve, reject) => {
    let user = input.split(' ')[0]
    let reason = _.slice(input.split(' '), 1).join(' ')

    if (user === config.botname || user.slice(2, -1) === config.botid) return reject('Error: Bitch. No.')

    findUser(user, 'both').then(kickee => kickUser(channel.id, kickee.id).then(() => {
      sendPMThroughSlackbot(kickee.name, `You were kicked from #${channel.name} ${reason || 'for no reason'}`)
      return resolve(`*Kicked: ${kickee.name}* ${reason || 'for no reason.'}`)
    }).catch(reject)).catch(reject)
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
