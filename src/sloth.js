import needle from 'needle'
import { RtmClient, MemoryDataStore, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'
import { sendMessage, updateUsersCache } from './slack'
import config from '../config.json'
import { parse as parseMsg } from './parseMessage'

var errors = 0
var firstStart = true;

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
        if (typeof err === 'string') this.sendMessage(err, channel.id)
        else throw(err)
      })
    }
  }

  _sendMessage(text, channelID, attachments = [], options = {}) {
    if (!attachments.length && !Object.keys(options).length && options !== true) return this.sendMessage(text, channelID)
    console.log("Sending custom message")
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
