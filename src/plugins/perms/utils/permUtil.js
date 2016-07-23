import Promise from 'bluebird'
import { includes } from 'lodash'
import permissions from '../../../permissions'
import { findUser } from '../../../slack'
import config from '../../../../config.json'

const getUserLevel = user => {
  if ((permissions.superadmins.indexOf(user) > -1))
    return 'superadmin'
  else if ((permissions.admins.indexOf(user) > -1))
    return 'admin'
  else
    return 'user'
}

const canDoTheThing = (user, adminLevel) => {
  let userLevel = getUserLevel(user);
  let iCan = ((adminLevel === 'superadmin' && userLevel === 'superadmin')) ? false :
    (adminLevel === 'admin' && userLevel === 'admin') ? false : true
  if (iCan) return true
  else return false
}

const responses = {
  ignore: 'Ignoring',
  unignore: 'Unignoring',
  mute: 'Muting',
  unmute: 'Unmuting',
  permaignore: 'Permanently ignoring'
}

module.exports = {
  doTheThing(input, type, adminLevel) {
    return new Promise((resolve, reject) => {
      if (!input) return reject("Please specify a user")
      let username = input.split(' ')[0].toString().toLowerCase()

      // If you're trying to pull shit on the bot
      if (username == config.botname || username.slice(2, -1) == config.botid.toLowerCase())
        return reject("Error: Bitch. No.")

      // If you're trying to pull shit on ur m8s
      if (!canDoTheThing(username, adminLevel)) return reject("Error: lolno")

      if (type == 'ignore' && includes(permissions.allIgnored, username))
        return reject("This user is already ignored")
      if (type == 'mute' && includes(permissions.muted, username))
        return reject("This user is already muted")
      if (type == 'unignore' && !includes(permissions.allIgnored, username))
        return reject("This user is not ignored")
      if (type == 'unmute' && !includes(permissions.muted, username))
        return reject("This user is not muted")
      if (type == 'permaignore' && includes(permissions.permaIgnored, username))
        return reject("This user is already permanently ignored")

      if (type == 'unignore' || type == 'unmute') {
        permissions.add(username, type)
        return resolve(`${responses[type]} ${username}`)
      } else {
        findUser(username, 'name').then(user => {
          permissions.add(user, type)
          return resolve(`${responses[type]} ${user}`)
        }).catch(reject)
      }
    })
  }
}
