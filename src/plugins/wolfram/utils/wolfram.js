import Promise from 'bluebird'
import needle from 'needle'
import config from '../../../../config.json'
import { result } from 'lodash'

export function query(input) {
  return new Promise((resolve, reject) => {
    if (!config.wolframAPIKey) return reject("Error: WolframAlpha API Key required to use this function")

    let url = `http://api.wolframalpha.com/v2/query?input=${input}&primary=true&appid=${config.wolframAPIKey}`

    needle.get(url, (err, resp, body) => {
      if (!err && body) {
        if (result(body, 'queryresult.$.error', 'true') == 'false' && result(body, 'queryresult.$.success', 'false') == 'true') {
          let response = result(body, 'queryresult.pod[1].subpod.plaintext', undefined)
          if (response) return resolve(response)
          else return reject("Error parsing data")
        } else return reject(result(body, 'queryresult.$.success', false) ? "No data found" : "Invalid data returned")
      } else return reject("Error connecting to wolfram api")
    })
  })
}
