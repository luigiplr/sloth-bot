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
  let userLevel = getUserLevel(user)
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
      let user = findUser(input.split(' ')[0].toLowerCase())
      if (!user) return reject("Couldn't find a user by that name")

      // If you're trying to pull shit on the bot
      if (user.name === config.botname || user.id === config.botid)
        return reject("Error: Bitch. No.")

      // If you're trying to pull shit on ur m8s
      if (!canDoTheThing(user.name, adminLevel)) return reject("Error: lolno")

      if (type === 'ignore' && includes(permissions.allIgnored, user.name))
        return reject("This user is already ignored")
      if (type === 'mute' && includes(permissions.muted, user.name))
        return reject("This user is already muted")
      if (type === 'unignore' && !includes(permissions.allIgnored, user.name))
        return reject("This user is not ignored")
      if (type === 'unmute' && !includes(permissions.muted, user.name))
        return reject("This user is not muted")
      if (type === 'permaignore' && includes(permissions.permaIgnored, user.name))
        return reject("This user is already permanently ignored")

      if (type === 'unignore' || type === 'unmute') {
        permissions.add(user.name, type)
        return resolve(`${responses[type]} ${user.name}`)
      } else {
        permissions.add(user.name, type)
        return resolve(`${responses[type]} ${user.name}`)
      }
    })
  }
}
