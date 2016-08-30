import Promise from 'bluebird'
import Slack from 'slack-client'
import { sendMessage, updateUsersCache } from './slack'
import config from '../config.json'
import { parse as parseMsg } from './parseMessage'

var errors = 0
var conns = 0

const DEVMODE = process.argv[2] == '--dev' ? true : false

if (!config.prefix || !config.slackAPIToken || !config.slackBotToken) {
  console.error("Invalid config, please fill in the first 3 required config fields")
  process.exit()
}

class slackClient extends Slack {
  constructor() {
    super(config.slackBotToken, true, true)

    this._registerEvents()
    this.login()
  }

  _registerEvents() {
    this.on('loggedIn', (self, team) => {
      conns++;
      config.teamName = team.domain
      config.botname = self.name
      config.botid = self.id
      config.imageURL = this.users[self.id].profile.image_72

      console.log('Welcome to Slack. You are @' + self.name, 'of', team.name)

      if (config.debugChannel) sendMessage(config.debugChannel, `Successfully ${conns > 1 ? 'reconnected' : 'connected'} to Slack ${DEVMODE ? '- DEV' : ''}`)
    })

    this.on('message', ::this._onNewMessage)

    this.on('close', err => {
      this._sendErrorToDebugChannel('slackClientError', `Websocket Connection Terminated, Reconnecting - ${err}`)
      setTimeout(() => this.login(), 1500)
    })

    this.on('error', err => {
      this._sendErrorToDebugChannel('slackClientError', err)
      console.log("Error", err)
      if (err == 'API response: 429') setTimeout(() => process.exit(1), 5000)
      else setTimeout(() => process.exit(1), 1500)
    })
  }

  _onNewMessage(message) {
    const user = this.getUserByID(message.user)
    let channel = this.getChannelGroupOrDMByID(message.channel)
    const { text, ts, subtype, type } = message
    if (subtype === 'channel_join') return updateUsersCache() // Kind of a cheat
    if (type === 'message' && text && channel && !subtype) {
      parseMsg(user, channel, text, ts)
        .then(response => {
          if (!response) return false

          if (typeof response == 'string' || (!response.type == 'dm' || !response.type == 'channel')) {
            response = { type: 'channel', message: response }
            console.warn("No response type, assuming channel response")
          }

          this._checkIfDM(response.type, response.user ? response.user : user.id)
            .then(DM => {
              if (DM) channel = DM
              console.log("OUT", channel.name + ':', (response.message ? response.message : response.messages))
              if (response.message && response.message.attachments) {
                channel.postMessage(this._getParams(response.message.msg, response.message.attachments, response.options))
              } else if (!response.multiLine) {
                if (response.message && !Array.isArray(response.message)) channel.postMessage(this._getParams(response.message, null, response.options))
                else if (response.messages && Array.isArray(response.messages)) channel.postMessage(this._getParams(response.messages.join('\n'), null, response.options))
                else return this._sendErrorToDebugChannel('sendMsg', "Invalid messages format, your array must contain more than 1 message and use the 'messages' response type")
              } else {
                if (response.messages && Array.isArray(response.messages)) response.messages.forEach(message => channel.send(message))
                else return this._sendErrorToDebugChannel('sendMsg', "Invalid Multiline format, your array must contain more than 1 message and use the 'messages' response type")
              }
            }).catch(() => channel.send('Error finding user'))
        })
        .catch(err => {
          if (!err) return
          console.error(`parseMsg Error: ${err}`)
          if (typeof err === 'string') channel.send(err)
          else throw (err)
        })
    }
  }

  _sendErrorToDebugChannel(type, error) {
    if (errors < 4) {
      errors++
      setTimeout(() => {
        if (errors > 0) errors--
      }, 4000)
    } else {
      sendMessage(config.debugChannel, "Warning! Error spam, stopping bot")
      process.exit()
      return
    }

    if (error && error.message && error.stack) {
      console.error("Caught Error:", type, error.message, error.stack)
      if (!config.debugChannel) return

      const message = 'Caught ' + type + ' ```' + error.message + '\n' + error.stack + '```'
      sendMessage(config.debugChannel, message)

    } else {
      console.error("Caught Error:", type, error)
      if (config.debugChannel) sendMessage(config.debugChannel, "ABNORMAL ERROR: Caught " + type + ' ```' + error + '```')
    }
  }

  _getParams = (text = '', attachments = null, opts = {}) => (Object.assign({}, opts, { text, attachments, as_user: true, token: config.slackBotToken }))

  _checkIfDM = (type, user) => new Promise((resolve, reject) => (type == 'dm') ? this.openDM(user.id ? user.id : user, ({ channel }) => channel ? resolve(this.getChannelGroupOrDMByID(channel.id)) : reject()) : resolve(0))
}

process.on('uncaughtException', err => {
  slackInstance._sendErrorToDebugChannel('uncaughtException', err)
  setTimeout(() => process.exit(1), 500)
})

process.on('unhandledRejection', err => slackInstance._sendErrorToDebugChannel('unhandledRejection', err))

process.on('rejectionHandled', err => slackInstance._sendErrorToDebugChannel('handledRejection', err))

const slackInstance = new slackClient()
