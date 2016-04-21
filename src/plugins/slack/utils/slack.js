import Promise from 'bluebird';
import _ from 'lodash';
import needle from 'needle';
import { findUser, sendPMThroughSlackbot, getHistory, deleteMessage } from '../../../slack.js';

var config = require('../../../../config.json');

export function kick(user, channel, input) {
  return new Promise((resolve, reject) => {
    let user = input.split(' ')[0]
    let reason = _.slice(input.split(' '), 1).join(' ')

    if (user === config.botname || user.slice(2, -1) === config.botid) return reject('Error: Bitch. No.')

    findUser(user).then(kickee => {
      needle.post('https://slack.com/api/channels.kick', {
        channel: channel.id,
        token: config.slackToken,
        user: kickee.id
      }, (err, resp, body) => {
        if (err || body.error) {
          console.log(`kickUserErr ${err || body.error}`)
          return reject(`kickUserErr ${err || body.error}`)
        }

        sendPMThroughSlackbot(kickee.name, `You were kicked from #${channel.name} for ${reason || 'no reason'}`)
        return resolve(`*Kicked: ${kickee.name}* for ${reason || 'no reason.'}`)
      })
    }).catch(reject);
  })
}
export function deleteLastMessage(channel, messagets) {
  return new Promise((resolve, reject) => {
    deleteMessage(channel, messagets)
    getHistory(channel, 16).then(messages => {
      let ts = _(messages)
        .filter(message => {
          return message.user === config.botid;
        })
        .pluck('ts')
        .value()[0]

      if (!ts) return resolve(false);

      deleteMessage(channel, ts)
      return resolve(ts)
    }).catch(reject);
  })
}

