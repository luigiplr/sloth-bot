import Promise from 'bluebird';
import needle from 'needle';
import config from '../../../../config.json';

module.exports = {
    query(input) {
        return new Promise((resolve, reject) => {
            if (!config.wolframAppKey)
                return reject("Application key not set in config")

            let url = `http://api.wolframalpha.com/v2/query?input=${input}&primary=true&appid=${config.wolframAppKey}`

            needle.get(url, (err, resp, body) => {
                if (!err && body) {
                    if (body.queryresult['$'].success === 'true' && body.queryresult['$'].error === 'false') {
                        return resolve(body.queryresult.pod[1].subpod.plaintext);
                    } else {
                        if (body.queryresult['$'].error === 'false')
                            return reject("Error: No data found");
                        else
                            return reject(`WolframError: ${body.queryresult.error.msg}`)
                    }
                } else {
                    return resolve(err);
                }
            });
        })
    }
}