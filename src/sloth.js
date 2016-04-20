import Promise from 'bluebird'
import Slack from 'slack-client'
import slackTools from './slack'
import config from '../config.json'
import { parse as parseMsg } from './parseMessage'

if (!config.prefix || !config.slackToken || !config.slackAPIToken) {
  console.error("Invalid config, please fill in the first 3 required config fields")
  process.exit()
}

class slackClient extends Slack {
  constructor() {
    super(config.slackAPIToken, true, true)

    this._registerEvents()
    this.login()
  }

  _registerEvents() {
    this.once('open', () => {
      let unreads = this.getUnreadCount()

      config.teamName = this.team.domain
      config.botname = this.self.name
      config.botid = this.self.id
      config.imageURL = this.users[config.botid].profile.image_72

      console.log('Welcome to Slack. You are @' + this.self.name, 'of', this.team.name);
      console.log('You have', unreads, 'unread', (unreads === 1) ? 'message' : 'messages');
    })

    this.on('message', ::this._onNewMessage)

    this.on('close', err => {
      this._sendErrorToDebugChannel('slackClientError', `Websocket Connection Terminated, Restarting - ${err}`)
      setTimeout(() => process.exit(1), 500)
    })

    this.on('error', err => {
      this._sendErrorToDebugChannel('slackClientError', err);
      setTimeout(() => process.exit(1), 500)
    })
  }

  _onNewMessage(message) {
    const user = this.getUserByID(message.user)
    let channel = this.getChannelGroupOrDMByID(message.channel)
    const { text, ts } = message

    if (message.type === 'message' && text && channel && !message.subtype) {
      parseMsg(user, channel, text, ts)
        .then(response => {
          if (!response) return false;

          if (!response.type == 'dm' || !response.type == 'channel') return console.error("Invalid message response type, must be channel or dm");

          this._checkIfDM(response.type, response.user ? response.user : user.id)
            .then(DM => {
              if (DM) channel = DM;
              console.log("OUT", channel.name + ':', (response.message ? response.message : response.messages))
              if (response.message && response.message.attachments) {
                channel.postMessage(this._getParams(response.message.msg, response.message.attachments))
              } else if (!response.multiLine) {
                if (response.message) channel.send(response.message)
                else if (response.messages) channel.postMessage(this._getParams(response.messages.join('\n')))
              } else {
                if (response.messages && response.messages[1]) response.messages.forEach(message => channel.send(message))
                else return console.error("Invalid Multiline format, your array must contain more than 1 message and use the 'messages' response type");
              }
            })
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
    if (!config.debugChannel) return

    if (error && error.message && error.stack) {
      console.error("Caught Error:", type, error.message, error.stack);


      let i = 0;
      const message = 'Caught ' + type + ' ```' + error.message + '\n' + error.stack + '```';

      if (i < 4) {
        i++
        slackTools.sendMessage(config.debugChannel, message)
        setTimeout(() => {
          if (i > 0) i--
        }, 3000)
      } else {
        slackTools.sendMessage(config.debugChannel, "Warning! Error spam, stopping bot")
        process.exit()
      }
    } else {
      console.error("Caught Error:", type, error);
      if (config.debugChannel) slackTools.sendMessage(config.debugChannel, "ABNORMAL ERROR: Caught " + type + ' ```' + error + '```');
    }
  }

  _getParams = (text = '', attachments = null) => ({ text, attachments, as_user: true, token: config.slackAPIToken })

  _checkIfDM = (type, user) => new Promise(resolve => (type == 'dm') ? this.openDM(user, ({ channel }) => resolve(this.getChannelGroupOrDMByID(channel.id))) : resolve(0))
}

process.on('uncaughtException', err => {
  slackInstance._sendErrorToDebugChannel('uncaughtException', err)
  setTimeout(() => process.exit(1), 500)
})

process.on('unhandledRejection', err => slackInstance._sendErrorToDebugChannel('unhandledRejection', err))

process.on('rejectionHandled', err => slackInstance._sendErrorToDebugChannel('handledRejection', err))

const slackInstance = new slackClient()

