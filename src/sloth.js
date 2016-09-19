import needle from 'needle'
import { RtmClient, MemoryDataStore, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'
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

class Slack extends RtmClient {
  constructor() {
    super(config.slackBotToken, {
      logLevel: 'error',
      dataStore: new MemoryDataStore(),
      autoReconnect: true
    })

    this._initEvents()
    this.start()
  }

  _initEvents() {
    this.on(CLIENT_EVENTS.RTM.AUTHENTICATED, ({ self, team }) => {
      config.teamName = team.domain
      config.botname = self.name
      config.botid = self.id
      config.imageURL = this.dataStore.users[self.id].profile.image_72

      console.log('Welcome to Slack. You are @' + self.name, 'of', team.name)

      if (config.debugChannel) sendMessage(config.debugChannel, `Successfully ${conns > 1 ? 'reconnected' : 'connected'} to Slack ${DEVMODE ? '- DEV' : ''}`)
    })

    this.on(RTM_EVENTS.MESSAGE, ::this._handleMessage)

    this.on(RTM_EVENTS.TEAM_JOIN, () => updateUsersCache())

    this.on(CLIENT_EVENTS.RTM.DISCONNECT, (err, code) => this._handleDisconnect("DISCONNECT", err, code))

    this.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, err => this._handleDisconnect("UNABLE_TO_RTM_START", err))
  }

  _handleMessage(message) {
    const user = this.dataStore.getUserById(message.user)
    let channel = this.dataStore.getChannelGroupOrDMById(message.channel)
    const { text, ts, subtype, type } = message
    if (type === 'message' && text && channel && !subtype) {
      parseMsg(user, channel, text, ts).then(response => {
        if (!response) return

        if (typeof response == 'string' || (!response.type == 'dm' || !response.type == 'channel')) {
          response = { type: 'channel', message: response }
          console.warn("No response type, assuming channel response")
        }

        if (response.type == 'dm') {
          if (response.user) channel = this.dataStore.getDMByName(response.user.name ? response.user.name : response.user)
          else channel = channel.id.startsWith('D') ? channel : this.dataStore.getDMByName(user.name)
        }

        console.log("OUT", channel.name ? channel.name : this.dataStore.users[channel.user].name + ':', (response.message ? response.message : response.messages))

        if (response.message && response.message.attachments) {
          this._sendMessage(response.message.msg, channel.id, response.message.attachments, response.options)
        } else {
          if (response.messages && response.multiLine) response.messages.forEach(message => this.sendMessage(message, channel.id))
          else if (response.messages) this._sendMessage(response.messages.join('\n'), channel.id, undefined, response.options)
          else this._sendMessage(response.message, channel.id, undefined, response.options)
        }
      }).catch(err => {
        if (!err) return
        console.error(`parseMsg Error: ${err}`)
        if (typeof err === 'string') this.sendMessage(channel.id, err)
        else throw (err)
      })
    }
  }

  _sendMessage(text, channelID, attachments = [], options = {}, api = false) {
    if (!attachments.length && !Object.keys(options).length && !api) return this.sendMessage(text, channelID)
    needle.post("https://slack.com/api/chat.postMessage", Object.assign({}, {
      channel: channelID,
      token: config.slackBotToken,
      as_user: true,
      attachments: typeof attachments == 'string' ? attachments : JSON.stringify(attachments),
      text
    }, options), (err, resp, body) => {
      if (err || !body.ok) console.error("_sendMessageError", err, body)
    })
  }

  _handleDisconnect(type, err, code = 'N/A') {
    this._sendErrorToDebugChannel("slackClientError", `Disconnected from Slack, attempting reconnect \n ${type} - ${err} - ${code}`)
    setTimeout(() => this.start(), 1500)
  }

  _sendErrorToDebugChannel(type, error) {
    if (errors < 4) {
      errors++
      setTimeout(() => {
        if (errors > 0) errors--
      }, 5000)
    } else {
      console.error("Warning! Error spam, stopping bot")
      if (config.debugChannel) this._sendMessage("Warning! Error spam, stopping bot", config.debugChannel, undefined, undefined, true)
      process.exit()
      return
    }

    if (error && error.message && error.stack) {
      console.error("Caught Error:", type, error.message, error.stack)
      if (!config.debugChannel) return

      const message = 'Caught ' + type + ' ```' + error.message + '\n' + error.stack + '```'
      this._sendMessage(message, config.debugChannel, undefined, undefined, true)
    } else {
      console.error("Caught Error:", type, error)
      if (config.debugChannel) this._sendMessage("Caught " + type + ' ```' + error + '```', config.debugChannel, undefined, undefined, true)
    }
  }
}

process.on('uncaughtException', err => {
  if (err && err.message && err.message == 'Unexpected end of JSON input') return
  slackInstance._sendErrorToDebugChannel('uncaughtException', err)
  setTimeout(() => process.exit(1), 500)
})

process.on('unhandledRejection', err => slackInstance._sendErrorToDebugChannel('unhandledRejection', err))

process.on('rejectionHandled', err => slackInstance._sendErrorToDebugChannel('handledRejection', err))

const slackInstance = new Slack()
