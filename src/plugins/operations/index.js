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
  userLevel: ['superadmin']
}, {
  alias: ['restart'],
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
  usage: 'update <optional restart 1/0> - updates the bot from github',
  userLevel: ['superadmin']
}]

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
            this.restart();
            return resolve({ type: 'channel', message: "Sucessfully fetched and installed new updates, restarting" })
          } else return resolve({ type: 'channel', message: "Sucessfully fetched and installed new updates" })
        } else return reject("Possible error while fetching and installing new updates?");
      } else return reject("Error while fetching and installing updates ```" + stdout + stderr + error + '```')
    })
  })
}
