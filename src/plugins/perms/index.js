import permissions from '../../permissions'
import permsUtil from './utils/permUtil'
import config from '../../../config'

const getUserLevel = user => {
  if ((permissions.superadmins.indexOf(user) > -1)) return 'superadmin'
  else if ((permissions.admins.indexOf(user) > -1)) return 'admin'
  else return 'user'
}

const canPerformAdminCommands = config.slackAPIToken && config.slackAPIToken.length > 0
const setPermission = (user, channel, input, ts, plugin, adminLevel, action) => {
  return new Promise((resolve, reject) => permsUtil.doTheThing(input, action, adminLevel)
    .then(resp => resolve({ type: 'channel', message: resp }))
    .catch(reject))
}

export const plugin_info = [{
  alias: ['set'],
  command: 'set',
  usage: 'set <username> <level> - set users permissions level',
  userLevel: ['admin', 'superadmin']
}, {
  alias: ['permaignore'],
  command: 'permaIgnore',
  usage: 'permaignore <username> - have the bot permanently ignore all commands from user',
  userLevel: ['superadmin']
}, {
  alias: ['ignore'],
  command: 'ignore',
  usage: 'ignore <username> - have bot ignore all commands from a user',
  userLevel: ['admin', 'superadmin']
}, {
  alias: ['unignore'],
  command: 'unignore',
  usage: 'unignore <username> - unignores a user',
  userLevel: ['admin', 'superadmin']
}, {
  alias: ['mute'],
  command: 'mute',
  usage: 'mute - attempts to prevent the user from posting any messages',
  userLevel: ['admin', 'superadmin']
}, {
  alias: ['unmute'],
  command: 'unmute',
  usage: 'unmute - unmutes a user',
  userLevel: ['admin', 'superadmin']
}, {
  alias: ['admins'],
  command: 'admins',
  usage: 'admins - lists admins'
}, {
  alias: ['owners'],
  command: 'owners',
  usage: 'owners - lists owners (super admins)'
}, {
  alias: ['ignored'],
  command: 'ignored',
  usage: 'ignored - lists ignored users'
}, {
  alias: ['muted'],
  command: 'muted',
  usage: 'muted - lists muted users'
}]

export function admins() {
  return new Promise(resolve => resolve({ type: 'channel', message: 'Admins: ' + permissions.admins.concat(permissions.superadmins).join(', ') }))
}

export function owners() {
  return new Promise(resolve => resolve({ type: 'channel', message: 'Owners: ' + permissions.superadmins.join(', ') }))
}

export function ignored() {
  return new Promise(resolve => {
    let msg = permissions.allIgnored[0] ? (`Currently ignored: ${permissions.ignored[0] ? permissions.ignored.join(', ') + ',' : ''}${permissions.permaIgnored[0] ? ' *' + permissions.permaIgnored.join(', ') + '*' : ''}`) : null
    return resolve({ type: 'channel', message: msg || 'No ignored users' })
  })
}

export function muted() {
  return new Promise(resolve => resolve({ type: 'channel', message: permissions.muted[0] ? 'Currently muted: ' + permissions.muted.join(', ') : 'No muted users' }))
}

export function unignore(user, channel, input, ts, plugin, adminLevel) {
  return setPermission(...arguments, 'unignore')
}

export function ignore(user, channel, input, ts, plugin, adminLevel) {
  return setPermission(...arguments, 'ignore')
}

export function unmute(user, channel, input, ts, plugin, adminLevel) {
  return setPermission(...arguments, 'unmute')
}

export function mute(user, channel, input, ts, plugin, adminLevel) {
  if (!canPerformAdminCommands) return Promise.reject('`missing admin api key, cannot perform admin commands`')
  return setPermission(...arguments, 'mute')
}

export function permaIgnore(user, channel, input, ts, plugin, adminLevel) {
  return setPermission(...arguments, 'permaignore')
}

export function set(admin, channel, input, ts, plugin, adminLevel) {
  return new Promise((resolve, reject) => {
    if (!input) return reject("Please specify a user");

    let user = input.split(' ')[0].toLowerCase()
    let userLevel = getUserLevel(user)
    let level = input.split(' ')[1] ? input.split(' ')[1].toLowerCase().replace(/[s]$/, '') : 'user'
    let levels = ((adminLevel === 'superadmin' && userLevel === 'superadmin')) ? -1 :
      (adminLevel === 'admin' && userLevel === 'admin') ? -1 :
      (adminLevel === 'admin') ? ['user', 'admin'] : ['user', 'admin', 'superadmin']

    if (user) {
      if (levels == -1) return reject("You cannot change the level of yourself or other admins")
      else if (levels.indexOf(level) > -1) {
        permissions.add(user, level)
        return resolve({ type: 'channel', message: `Set ${user} to ${level}` })
      } else return reject("Invalid User Level");
    }
  })
}
