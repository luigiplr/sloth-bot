import _ from 'lodash'
import moment from 'moment'
import needle from 'needle'
import request from 'request'
const config = require('../../../../config.json')
require('./definitions')

const baseUrl = 'https://api.overwatchleague.com'
const urls = {
  'standings': `${baseUrl}/standings`
}

export const makePuppeteerUndetectable = async (page) => {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36'
  await page.setUserAgent(userAgent)

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { // eslint-disable-line no-undef
      get: () => false
    })
  })

  await page.evaluateOnNewDocument(() => {
    window.navigator.chrome = { // eslint-disable-line no-undef
      runtime: {}
    }
  })

  await page.evaluateOnNewDocument(() => {
    const originalQuery = window.navigator.permissions.query // eslint-disable-line no-undef
    return window.navigator.permissions.query = parameters => (  // eslint-disable-line
      parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission }) // eslint-disable-line no-undef
        : originalQuery(parameters)
    )
  })

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'plugins', { // eslint-disable-line no-undef
      get: () => [1, 2, 3, 4, 5]
    })
  })

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'languages', { // eslint-disable-line no-undef
      get: () => ['en-US', 'en']
    })
  })
}

export async function uploadImageToSlack(image, filename, channelId) {
  return new Promise(resolve => {
    request.post('https://slack.com/api/files.upload', {
      url: 'https://slack.com/api/files.upload',
      qs: {
        token: config.slackBotToken,
        channels: channelId
      },
      formData: {
        file: {
          value: new Buffer(image),
          options: {
            filename: filename,
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

/**
 * @returns {Promise<Standings>}
 */
export async function _getStandings() {
  try {
    return _request('standings')
  } catch (e) {
    return null
  }
}

export const cache = {}
export const cacheTs = {}
async function _request(what, noCache = false) {
  if (!noCache && cache[what] && +moment(cacheTs[what]).add(6, 'minutes') > Date.now()) {
    return cache[what]
  }

  return needle('GET', urls[what], { json: true }).then(response => {
    if (response.statusCode === 200) {
      cache[what] = response.body
      cacheTs[what] = Date.now()
      return response.body
    }

    console.error('[OWL] Error getting data', what)
    return Promise.reject()
  }, err => {
    console.error('[OWL] Error getting data', err)
    return Promise.reject()
  })
}

export const valuePadding = (val, min) => {
  val = _.isNumber(val) ? val.toString() : val
  return val.length < min ? ` ${val}` : val
}
