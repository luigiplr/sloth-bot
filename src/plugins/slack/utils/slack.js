import _ from 'lodash'
import { findUser, sendPMThroughSlackbot, getHistory, deleteMessage, kickUser, setInactive, setRegular, updateUsersCache, usersCache } from '../../../slack.js'
import config from '../../../../config.json'
import request from 'request'
import moment from 'moment'
import { InviteUsers } from '../../../database'

export function getInviteForUser(user) {
  return new Promise(resolve => {
    InviteUsers.findOneByInvitedUser(user.name).then(u => {
      if (u) return resolve(u)
      InviteUsers.findOneByEmail(user.profile.email).then(data => {
        if (!data) return resolve(false)
        data.invitedUser = user.name
        data.Persist()
        return resolve(data)
      })
    })
  })
}

export function kick(user, channel, input) {
  return new Promise((resolve, reject) => {
    let user = findUser(input.split(' ')[0].toLowerCase())
    let reason = _.slice(input.split(' '), 1).join(' ')

    if (!user) return reject("Found no user by that name")

    if (user.name === config.botname || user.id === config.botid) return reject('Error: Bitch. No.')

    kickUser(channel.id, user.id).then(() => {
      sendPMThroughSlackbot(user.name, `You were kicked from #${channel.name} ${reason || 'for no reason'}`)
      return resolve(`*Kicked: ${user.name}* ${reason || 'for no reason.'}`)
    }).catch(reject)
  })
}

export function deleteLastMessage(channel, messagets) {
  return new Promise((resolve, reject) => {
    deleteMessage(channel, messagets)
    getHistory(channel, 16).then(messages => {
      let ts = messages.filter(message => message.user === config.botid)
        .map(a => a.ts)[0]

      if (!ts) return resolve(false)

      deleteMessage(channel, ts)
      return resolve()
    }).catch(reject)
  })
}

const tokenRegex = /api_token: '([a-z-0-9]+)'/
let specialToken = null
let nextUpdate = null

const _getSpecialToken = () => {
  return new Promise((resolve, reject) => {
    if (specialToken && nextUpdate && moment().isBefore(nextUpdate)) return resolve(specialToken)
    let url = `https://${config.teamName}.slack.com`
    let cookieJar = request.jar()
    let cookie1 = request.cookie(config.cookies[0])
    let cookie2 = request.cookie(config.cookies[1])
    let cookie3 = request.cookie(config.cookies[2])
    cookieJar.setCookie(cookie1, url)
    cookieJar.setCookie(cookie2, url)
    cookieJar.setCookie(cookie3, 'https://slack.com')
    request({ url: `${url}/admin`, jar: cookieJar }, (err, resp, body) => {
      if (!err && body) {
        let token = tokenRegex.exec(body)
        if (token && token.length === 2) {
          specialToken = token[1]
          nextUpdate = moment().add(1, 'd').format()
          return resolve(specialToken)
        } else return reject("Unable to find token")
      } else return reject("Error contacting slack")
    })
  })
}

export function enableOrDisableUser(enable, user) {
  return new Promise((resolve, reject) => {
    if (config.cookies && config.teamName && config.cookies.length === 3) {
      _getSpecialToken().then(token => {
        if (enable) {
          setRegular(user, token).then(resp => {
            if (typeof user.real_name === 'undefined') updateUsersCache().then(console.log, console.error)
            else usersCache[user.id].deleted = false
            return resolve(resp)
          }, reject)
        } else {
          setInactive(user, token).then(resp => {
            usersCache[user.id].deleted = true
            return resolve(resp)
          }, reject)
        }
      }).catch(reject)
    } else return reject("Where be da cookies")
  })
}
