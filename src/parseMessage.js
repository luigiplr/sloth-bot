import { find, get } from 'lodash'
import permissions from './permissions'
import config from '../config.json'
import { deleteMessage, getHistory, findUser } from './slack'
import { getPlugins as plugins } from './plugins'
import { Remembers } from './database'

const getUserlevel = user => {
  if ((permissions.superadmins.indexOf(user) > -1)) return 'superadmin'
  else if ((permissions.admins.indexOf(user) > -1)) return 'admin'
  else return 'user'
}

export function parse(user, channel, text, ts) {
  return new Promise((resolve, reject) => {
    let username = user.name.toString().toLowerCase()
    let userLevel = getUserlevel(username)

    // If user is muted and is not an admin
    if (permissions.muted.indexOf(username) > -1 && userLevel !== 'superadmin') {
      deleteMessage(channel.id, ts)
      return resolve(false)
    }

    if (!config.allowGuests && (user.is_restricted || user.is_ultra_restricted)) {
      return resolve({ type: 'channel', message: 'Sorry, guests cannot use this bot.' })
    }

    // Sedbot
    if (!config.sed.disabled && text.startsWith('s/')) {
      console.log("IN", user.name + ':', text)

      if (((permissions.allIgnored.indexOf(username) > -1) && userLevel !== 'superadmin')) {
        return resolve(false)
      }

      var split = text.split('/')
      if (split.length >= 3) {
        var [, word, replacement, who] = split
        who = who ? findUser(who) : undefined
        getHistory(channel.id, 35).then(messages => {
          // Finds latest message that isn't the current message, isn't a bot message and includes the text
          // also if a user is specified, make sure the message is from said user
          const matchedMessage = find(messages, m => (
            (!who || (who && who.id === m.user)) &&
            !m.bot_id && m.user !== config.botid && m.ts !== ts && m.text && m.text.includes(word)
          ))

          if (!matchedMessage) return reject('Found no matching word in recent messages')

          let rx
          try {
            rx = new RegExp(word, 'g')
          } catch (e) {
            return reject("Invalid regular expression")
          }

          const whoSaid = findUser(matchedMessage.user)
          const newMessage = matchedMessage.text.replace(rx, replacement)

          if (whoSaid && (whoSaid.real_name || whoSaid.name)) {
            return resolve({
              type: 'channel',
              message: newMessage,
              options: {
                as_user: false,
                username: config.sed.realnames ? whoSaid.real_name || whoSaid.name : whoSaid.name,
                icon_url: get(whoSaid, 'profile.image_72', '')
              }
            })
          } else return resolve({ type: 'channel', message: newMessage })
        })
      }
      return
    }

    if (!config.disableRemember && text.startsWith('?')) {
      const word = text.slice(1).trim()
      Remembers.findOneByWord(word).then(resp => {
        if (resp) {
          resolve({
            type: 'channel',
            message: resp.text,
            options: {
              unfurl_links: true,
              unfurl_media: true
            }
          })
        }
      })

      return
    }

    if (text.charAt(0) !== config.prefix) return resolve(false)

    console.log("IN", user.name + ':', text)
    // If user is ignored and is not an admin (or if the user is the bot itself)
    if (((permissions.allIgnored.indexOf(username) > -1) && userLevel !== 'superadmin') || user.name.toString().toLowerCase() === config.botname) {
      return resolve(false)
    }

    let command = text.split(' ')[0].substr(1).toLowerCase()
    let context = text.split(' ').slice(1).join(' ').trim()
    context = context !== '' ? context : undefined

    let cmdLevel = false
    let call = false
    let plugin = find(plugins, plugin => {
      return find(plugin.plugin_info, cmd => {
        if (cmd.alias.indexOf(command) > -1) {
          if (cmd.userLevel) cmdLevel = cmd.userLevel
          call = cmd
          return true
        } else return false
      })
    })

    if ((plugin && call.disabled) || !plugin) return reject()

    // If userLevel required and you don't match the required level or if you're an admin trying to pull shit on a superadmin
    if (cmdLevel && (cmdLevel.indexOf(userLevel) === -1 || (userLevel === 'admin' && (context && getUserlevel(context.split(' ')[0]) === 'superadmin')))) {
      return resolve({ type: 'channel', message: 'Insufficient Permissions' })
    }

    plugin[call.command](user, channel, context, ts, plugins, userLevel)
      .then(resolve)
      .catch(reject)
  })
}
