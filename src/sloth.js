import needle from 'needle'
import { RtmClient, MemoryDataStore, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'
import { sendMessage, updateUsersCache } from './slack'
import config from '../config.json'
import { parse as parseMsg } from './parseMessage'

var errors = 0
var firstStart = true;

const DEVMODE = process.env.NODE_ENV == 'development'

if (!config.prefix || !config.slackBotToken) {
  console.error("Invalid config, please fill in the first 2 required config fields")
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
    this.once(CLIENT_EVENTS.RTM.AUTHENTICATED, ({ self, team }) => {
      config.teamName = team.domain
      config.botname = self.name
      config.botid = self.id
      config.imageURL = this.dataStore.users[self.id].profile.image_72

      console.log('Welcome to Slack. You are @' + self.name, 'of', team.name)

      this._sendErrorToDebugChannel(null, `Successfully connected to Slack ${DEVMODE ? '- DEV' : ''}`, true)
    })

    this.on(CLIENT_EVENTS.RTM.AUTHENTICATED, () => {
      if (firstStart) {
        firstStart = false;
        return;
      }
      this._sendErrorToDebugChannel(null, 'Successfully reconnected to Slack', true)
    })

    this.on(RTM_EVENTS.MESSAGE, ::this._handleMessage)

    this.on(RTM_EVENTS.TEAM_JOIN, () => updateUsersCache())

    this.on(CLIENT_EVENTS.RTM.DISCONNECT, (err, code) => this._handleDisconnect("DISCONNECT", err, code))

    this.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, err => this._handleDisconnect("UNABLE_TO_RTM_START", err))

    this.on(CLIENT_EVENTS.ATTEMPTING_RECONNECT, () => this._sendErrorToDebugChannel(null, "Connection lost, attempting reconnect", true))
  }

  _handleMessage(message) {
    const user = this.dataStore.getUserById(message.user)
    let channel = this.dataStore.getChannelGroupOrDMById(message.channel)
    const { text, ts, subtype, type, thread_ts } = message
    if (type === 'message' && text && channel && !subtype) {
      if (config.logMessages) console.log(`#${channel.name || user.name || 'Unknown'}: ${text}`)
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

        let msg = response.messages ? response.messages.join('\n') : response.message
        console.log("OUT", channel.name ? channel.name : this.dataStore.users[channel.user].name + ':', msg)

        if (response.message && response.message.attachments) {
          this._sendMessage(response.message.msg, channel.id, thread_ts, response.message.attachments, response.options)
        } else {
          this._sendMessage(msg, channel.id, thread_ts, undefined, response.options)
        }
      }).catch(err => {
        if (!err) return
        console.error(`parseMsg Error: ${err}`)
        if (typeof err === 'string') this._sendMessage(err, channel.id, thread_ts)
        else throw(err)
      })
    }
  }

  // Custom sendMessage function to send through RTM or API
  _sendMessage(text, channel, thread_ts, attachments = [], options = {}) {
    // If we don't have any attachments or options and there is no thread_ts, send the message through RTM
    if (!attachments.length && !Object.keys(options).length && options !== true && !thread_ts) {
      this.sendMessage(text, channel)
      return
    }
    needle.post("https://slack.com/api/chat.postMessage", Object.assign({}, {
      channel, thread_ts, text,
      token: config.slackBotToken,
      as_user: true,
      attachments: typeof attachments == 'string' ? attachments : JSON.stringify(attachments)
    }, options), (err, resp, body) => {
      if (err || !body.ok) console.error("_sendMessageError", err, body)
    })
  }

  _handleDisconnect(type, err, code = 'N/A') {
    console.error("_handleDisconnect")
    this._sendErrorToDebugChannel("slackClientError", `Disconnected from Slack, attempting reconnect \nType: ${type} | Error: ${err} | Code: ${code}`)
    setTimeout(() => {
      this.start()
    }, 1500)
  }

  _sendErrorToDebugChannel(type, error, connectionStatus) {
    console.error("_sendErrorToDebugChannel")

    if (connectionStatus) {
      console.log(`ConnectionStatus: ${error}`)
      if (config.debugChannel) sendMessage(config.debugChannel, `:electric_plug: *Connection Status:* \`${error}\``)
      return
    }

    if (errors < 3) {
      errors++
      setTimeout(() => {
        if (errors > 0) errors--;
      }, 20000)
    } else {
      console.error("Warning! Error spam, stopping bot")
      if (config.debugChannel) sendMessage(config.debugChannel, "Warning! Error spam, stopping bot")
      setTimeout(() => {
        process.exit()
      }, 1500)
      return
    }

    if (error && error.message && error.stack) {
      console.error("Caught Error:", type, error.message, error.stack)
      if (!config.debugChannel) return

      const message = 'Caught ' + type + ' ```' + error.message + '\n' + error.stack + '```'
      sendMessage(config.debugChannel, message)
    } else {
      console.error("Caught Error:", type, error)
      if (config.debugChannel) sendMessage(config.debugChannel, "Caught " + type + ' ```' + error + '```')
    }
  }
}

const slackInstance = new Slack()

process.on('uncaughtException', err => {
  slackInstance._sendErrorToDebugChannel('uncaughtException', err)
  setTimeout(() => { process.exit(1) }, 1500)
})

process.on('unhandledRejection', err => slackInstance._sendErrorToDebugChannel('unhandledRejection', err))

process.on('rejectionHandled', err => slackInstance._sendErrorToDebugChannel('handledRejection', err))
