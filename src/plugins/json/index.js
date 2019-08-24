import { deleteMessage } from '../../slack.js'

export const plugin_info = [{
  alias: ['json'],
  command: 'parseJson',
  usage: 'json <input>'
}]

export async function parseJson(user, channel, input, ts) {
  if (!input) {
    return { type: 'dm', message: 'Usage: json <input> - returns prettified json' }
  }

  let rawJson = input
  if (input.match(/^```([\s\S]+)```$/)) {
    rawJson = input.slice(3, -3).trim()
  }

  if (!rawJson.match(/^[{[](.+)?[}\]]$/)) {
    throw 'Invalid json'
  }

  try {
    const json = JSON.parse(rawJson)

    // Delete original message
    deleteMessage(channel.id, ts)

    return {
      type: 'channel',
      message: `JSON Output: \`\`\`${JSON.stringify(json, null, 2)}\`\`\``
    }
  } catch (err) {
    throw `Error: ${err.message}`
  }
}
