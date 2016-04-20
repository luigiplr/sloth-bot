import Promise from 'bluebird';
import needle from 'needle';
import config from '../../../../config.json';

module.exports = {
  query(input) {
    return new Promise((resolve, reject) => {
      if (!config.wolframAppKey)
        return reject("Error: WolframAlpha API Key required to use this function")

      let url = `http://api.wolframalpha.com/v2/query?input=${input}&primary=true&appid=${config.wolframAppKey}`

      needle.get(url, (err, resp, body) => {
        if (!err && body)
          if (body.queryresult['$'].success === 'true' && body.queryresult['$'].error === 'false')
            if (body.queryresult.pod[1].subpod.plaintext)
              return resolve(body.queryresult.pod[1].subpod.plaintext)
            else
              return reject("No data found");
        else
        if (body.queryresult['$'].error === 'false')
          return reject("No data found");
        else
          return reject(`WolframError: ${body.queryresult.error.msg}`)
        else
          return resolve(err);
      });
    })
  }
}

