import needle from 'needle'
import config from '../../../config.json'
import _ from 'lodash'

export const plugin_info = [{
  alias: ['calc', 'wolfram'],
  command: 'wolfram',
  usage: 'wolfram <query> - returns wolfram calculation for query'
}]

export function wolfram(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: wolfram <query> - Computes <query> using Wolfram Alpha.' })

    if (!config.wolframAPIKey) return reject("Error: WolframAlpha API Key required to use this function")

    let url = `http://api.wolframalpha.com/v2/query?input=${input}&appid=${config.wolframAPIKey}`

    needle.get(url, (err, resp, body) => {
      if (err || !body) {
        return reject('Error querying wolfram API')
      }

      if (_.get(body, 'attributes.sucess') === 'false' || _.get(body, 'attributes.error') === 'true') {
        return reject('Error returned from Wolfram')
      }

      // require('fs').writeFileSync('./shit.json', JSON.stringify(body, null, 2))

      const interpretationTitle = _.get(body, ['children', 0, 'attributes', 'title'])
      const interpretation = _.find(_.get(body, ['children', 0, 'children', 0, 'children'], []), { name: 'plaintext' })

      if (!interpretation || !interpretationTitle) {
        return reject('Error trying to interpret question from Wolfram')
      }

      const resultTitle = _.get(body, ['children', 1, 'attributes', 'title'])
      const result = _.find(_.get(body, ['children', 1, 'children', 0, 'children'], []), { name: 'plaintext' })

      if (!resultTitle || !result) {
        return reject('Error trying to interpret result from Wolfram')
      }

      return resolve({
        type: 'channel',
        message: [
          `*In:* _${interpretationTitle}_ = ${interpretation.value}`,
          `*Out:* _${resultTitle}_ = ${result.value}`
        ].join('\n')
      })
    })
  })
}
