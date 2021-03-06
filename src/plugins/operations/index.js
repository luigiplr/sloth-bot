import { sendMessage } from '../../slack'
import moment from 'moment'
import config from '../../../config.json'
import { exec as execCmd } from 'child_process'

try {
  var getIP = require('external-ip')
} catch(e) {} // eslint-disable-line

var version = require('../../../package.json').version
var updating

export const plugin_info = [{
  alias: ['shutdown'],
  command: 'shutdown',
  usage: 'shutdown',
  userLevel: ['superadmin']
}, {
  alias: ['restart', 'reboot'],
  command: 'restart',
  usage: 'restart',
  userLevel: ['admin', 'superadmin']
}, {
  alias: ['uptime'],
  command: 'uptime',
  usage: 'uptime - returns uptime of bot'
}, {
  alias: ['update'],
  command: 'update',
  usage: 'update - updates the bot from github',
  userLevel: ['superadmin']
}, {
  alias: ['version'],
  command: 'info',
  usage: 'version - returns bot info'
}, {
  alias: ['ip'],
  command: 'ip',
  userLevel: ['admin', 'superadmin']
}, {
  alias: ['config'],
  command: 'setConfig',
  userLevel: ['superadmin']
}]

export function setConfig(user, channel, input = '') {
  return new Promise((resolve, reject) => {
    if (!config.viewConfigs || !config.viewConfigs.includes(user.id)) return reject("*Access DENIED!!1!111!!eleven!*")
    const params = input.split(' ')
    const key = params[0]
    let value = params.slice(1).join(' ')

    if (!key || !value) return reject("Usage: `config <key> <value>` - Updates config key with value")

    try {
      value = JSON.parse(value)
    } catch(e) {} //eslint-disable-line

    const oldValue = config[key]
    config[key] = value

    return resolve({ type: 'dm', message: `*New Value:* \`${JSON.stringify(value)}\` \`(${typeof value})\`\n*Old Value:* \`${JSON.stringify(oldValue)}\` \`(${typeof oldValue})\`` })
  })
}

export function shutdown() {
  return new Promise(resolve => {
    if (config.debugChannel) sendMessage(config.debugChannel, "Shutting bot down!")
    setTimeout(() => { process.exit(0) }, 3100)
    return resolve({ type: 'channel', message: 'Shutting down in *3.. 2.. 1.*' })
  })
}

export function restart() {
  return new Promise(resolve => {
    if (config.debugChannel) sendMessage(config.debugChannel, "Restarting bot")
    setTimeout(() => { process.exit(1) }, 3100)
    return resolve({ type: 'channel', message: 'Restarting in *3.. 2.. 1.*' })
  })
}

export function uptime() {
  return new Promise(resolve => {
    const time = moment.duration(parseInt(process.uptime(), 10), 'seconds')
    const duration = type => time[type]() !== 0 ? `${time[type]()} ${type.slice(0, -1)}${(time[type]() > 1 ? 's' : '')}` : false
    const getUpTime = (firstHalf, seconds) => firstHalf.replace(/, /, '').length !== 0 ? `${firstHalf} and ${seconds || '0 seconds'}` : seconds

    return resolve({
      type: 'channel',
      message: `I have been flyin' smooth for ${getUpTime(['days', 'hours', 'minutes'].map(duration).filter(Boolean).join(', '), duration('seconds'))}`
    })
  })
}

export function update(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (user.id !== config.owner) return reject("*Access DENIED!!1!111!!eleven!*")
    if (updating) return reject('Update already in process')
    sendMessage(channel.id, 'Updating...')
    updating = true
    execCmd('git pull', { timeout: 30000 }, (error1, stdout1, stderr1) => {
      if (!error1 && stdout1) {
        if (stdout1.indexOf('Already up-to-date') > -1) {
          updating = false
          return reject("Repo is already up-to-date")
        }
        execCmd('npm run build', { timeout: 30000 }, (error, stdout, stderr) => {
          updating = false
          if (!error && stdout) {
            if (config.debugChannel) sendMessage(config.debugChannel, '```' + stdout + '```')
            if (!input) {
              this.restart()
              return resolve({ type: 'channel', message: "Successfully fetched and installed new updates, restarting" })
            } else return resolve({ type: 'channel', message: "Successfully fetched and installed new updates" })
          } else return reject("Error while fetching and installing updates ```" + stdout + stderr + error + '```')
        })
      } else return reject("Error pulling updates ```" + stdout1 + stderr1 + error1 + '```')
    })
  })
}

export function info() {
  return new Promise((resolve, reject) => {
    execCmd('git rev-parse HEAD', { timeout: 1000 }, (error, stdout) => {
      if (!error && stdout) {
        let url = `https://github.com/luigiplr/sloth-bot/commit/${stdout.slice(0, -33)}`
        return resolve({
          type: 'channel',
          message: `sloth-bot version ${version} \n built from commit #<${url}|${stdout.slice(0, -34)}>`,
          options: true
        })
      } else return reject('Error fetching commit')
    })
  })
}

export function ip(user) {
  return new Promise((resolve, reject) => {
    if (!getIP) return reject("Missing `external-ip` NPM Module")
    if (!config.viewConfigs || !config.viewConfigs.includes(user.id)) return reject("*Access DENIED!!1!111!!eleven!*")
    getIP()((err, ip) => {
      return resolve({ type: 'dm', message: err ? 'Unable to find IP :(' : `My IP is ${ip}` })
    })
  })
}
