import { deleteMessage } from '../../slack.js'
import request from 'request'
import config from '../../../config'

export const plugin_info = [{
  alias: ['json'],
  command: 'parseJson',
  usage: 'json <input>'
}]

export async function parseJson(user, channel, input, ts) {
  console.log(user)
  if (!input) {
    return { type: 'dm', message: 'Usage: json <input> - returns prettified json' }
  }

  let rawJson = input
  if (input.match(/^```([\s\S]+)```$/)) {
    rawJson = input.slice(3, -3).trim()
  }

  if (!rawJson.match(/^[{[]([\s\S]+)?[}\]]$/)) {
    throw 'Invalid json'
  }

  try {
    const json = JSON.parse(rawJson)
    const prettyJson = JSON.stringify(json, null, 2)

    if (prettyJson.split('\n').length >= 45) {
      await uploadSnippet(user, prettyJson, channel.id)
      deleteMessage(channel.id, ts)

      return
    } else {
      deleteMessage(channel.id, ts)

      return {
        type: 'channel',
        message: `JSON Output: \`\`\`${prettyJson}\`\`\``
      }
    }
  } catch (err) {
    throw `Error: ${err ? err.message : 'Unknown'}`
  }
}

async function uploadSnippet(user, text, channelId) {
  return new Promise((resolve, reject) => {
    request.post('https://slack.com/api/files.upload', {
      qs: {
        token: config.slackBotToken,
        channels: channelId,
        filename: `JSON Snippet from ${user.real_name || user.name}`,
        filetype: 'javascript',
        content: text
      },
      json: true
    }, (err, resp, body) => {
      if (err || !body.ok) {
        return reject()
      }

      return resolve()
    })
  })
}
