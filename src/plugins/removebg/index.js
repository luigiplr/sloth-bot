import needle from 'needle'
import request from 'request'
import _ from 'lodash'
import config from '../../../config'

export const plugin_info = [{
  alias: ['removebg', 'rbg'],
  command: 'removeBg',
  usage: 'rbg <url>'
}]

const API_URL = 'https://api.remove.bg/v1.0/removebg'
const URL_RX = /^<https?:\/\/[^ ]+>$/i

export async function removeBg(user, channel, input) {
  if (!config.removeBgAPIKey) {
    throw 'Missing remove.bg API Key! You must add it before you can use this command.'
  }

  if (!input) {
    return { type: 'dm', message: 'Usage: removebg <url> - Returns an image with the background removed' }
  }

  if (!URL_RX.test(input.trim())) {
    throw 'Invalid URL'
  }

  const data = await needle('POST', API_URL, {
    image_url: input.slice(1, -1),
    size: 'regular'
  }, {
    headers: {
      Accept: 'image/png',
      'X-API-Key': config.removeBgAPIKey
    }
  })

  if (data.statusCode !== 200) {
    throw `Error from API - ${_.get(data.body, ['errors', 0, 'title'])}`
  }

  await uploadImageToSlack(data.raw, channel.id)
}

function uploadImageToSlack(image, channelId) {
  return new Promise(resolve => {
    request.post('https://slack.com/api/files.upload', {
      url: 'https://slack.com/api/files.upload',
      qs: {
        token: config.slackBotToken,
        channels: channelId
      },
      formData: {
        file: {
          value: image,
          options: {
            filename: 'The image without a BG',
            contentType: 'image/png'
          }
        }
      }
    }, function (err, response) {
      if (!err) {
        return resolve()
      }
      throw new Error(err)
    })
  })
}
