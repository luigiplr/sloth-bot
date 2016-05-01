/*import Promise from 'bluebird'
import { User } from '../../database.js'
import config from '../../../config.json'
import passHash from 'password-hash'
import { v4 as uuid } from 'node-uuid'
import web from './utils/web.js'

export const plugin_info = [{
  alias: ['setwebpassword'],
  command: 'setWebPassword',
  usage: 'setwebpassword <password> - sets the webui password for your account'
}, {
  alias: ['updatewebpassword'],
  command: 'updateWebPassword',
  usage: 'updatewebpassword <password> - sets the webui password for your account'
}]

export function setWebPassword(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: webuipassword <password> - Sets WebUI Password for your account' })
    return reject(passHash.generate(input))
      /*User.findOneBySlackID(user.id).then(webUser => {
      if (webUser) return reject(`You already have an account, you can change your password with ${config.prefix}updatewebpassword <password>`)

      let u = new User()
      u.name = user.name
      u.slackID = user.id
      u.password = passHash.generate(input)
      u.id = uuid()
      u.Persist()
  })
  })
}

export function updateWebPassword(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: updatewebpassword <password> - Updates the WebUI Password for your account' })

    User.findOneBySlackID(user.id).then(webUser => {
      if (!webUser) return reject(`You don't have an account, you can make one with ${config.prefix}webuipassword <password>`)

      webUser.password = passHash.generate(input)
      webUser.Persist()
    })
  })
}*/
