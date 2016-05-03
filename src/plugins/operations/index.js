import Promise from 'bluebird'
import { sendMessage } from '../../slack'
import moment from 'moment'
import config from '../../../config.json'
import { exec as execCmd } from 'child_process'

var updating

export const plugin_info = [{
  alias: ['shutdown'],
  command: 'shutdown',
  usage: 'shutdown',
  userLevel: ['superadmin'],
  api: 'opts.shutdown'
}, {
  alias: ['restart'],
  command: 'restart',
  usage: 'restart',
  userLevel: ['admin', 'superadmin'],
  api: 'opts.restart'
}, {
  alias: ['uptime'],
  command: 'uptime',
  usage: 'uptime - returns uptime of bot',
  api: 'opts.uptime'
}, {
  alias: ['update'],
  command: 'update',
  usage: 'update <optional restart 1/0> - updates the bot from github',
  userLevel: ['superadmin'],
  api: 'opts.update'
}]

export const pages = [{
  url: '/operations',
  access: ['admin', 'superadmin'],
  index: true,
  func: (req, res) => res.render('operations')
}]

export function shutdown() {
  return new Promise(resolve => {
    if (config.debugChannel) sendMessage(config.debugChannel, "Shutting bot down!")
    resolve({ type: 'channel', message: 'Shutting down in *2.. 1.*' })
    setTimeout(() => { process.exit(0) }, 2000)
  })
}
export function restart() {
  return new Promise(resolve => {
    if (config.debugChannel) sendMessage(config.debugChannel, "Restarting bot")
    resolve({ type: 'channel', message: 'Restarting in *2.. 1.*' })
    setTimeout(() => { process.exit(1) }, 2000)
  })
}
export function uptime() {
  return new Promise(resolve => {
    const time = moment.duration(parseInt(process.uptime(), 10), 'seconds')
    const duration = type => time[type]() !== 0 ? `${time[type]()} ${type.slice(0, -1)}${(time[type]() > 1 ? 's' : '')}` : false
    const getUpTime = (firstHalf, seconds) => firstHalf.replace(/, /, '').length !== 0 ? `${firstHalf} and ${seconds || '0 seconds'}` : seconds

    resolve({
      type: 'channel',
      message: `I have been flyin' smooth for ${getUpTime(['days', 'hours', 'minutes'].map(duration).filter(Boolean).join(', '), duration('seconds'))}`
    })
  })
}
export function update(user, channel, input) {
  return new Promise((resolve, reject) => {
    let updatecmd = 'git pull && gulp build'

    if (updating) return reject('Update already in process')

    sendMessage(channel.id, 'Updating...')

    updating = true;
    execCmd(updatecmd, { timeout: 60000 }, (error, stdout, stderr) => {
      updating = false
      if (!error && stdout) {
        if (config.debugChannel) sendMessage(config.debugChannel, '```' + stdout + '```')
        if (stdout.indexOf('Already up-to-date') > -1) return reject("Repo is already up-to-date")
        if (stdout.indexOf('Updating') === 0 && stdout.indexOf("Finished 'build'") > -1) {
          if (input == 1) {
            resolve({ type: 'channel', message: "Sucessfully fetched and installed new updates, restarting" })
            this.restart();
          } else resolve({ type: 'channel', message: "Sucessfully fetched and installed new updates" })
        } else reject("Possible error while fetching and installing new updates?");
      } else reject("Error while fetching and installing updates ```" + stdout + stderr + error + '```')
    })
  })
}
