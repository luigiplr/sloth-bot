import Promise from 'bluebird';
import needle from 'needle';

const apiKey = require('./../../../config.json').googleToken;
const subscriberUrl = 'https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=TheFineBros&fields=items/statistics/subscriberCount&key=' + apiKey;
const originalSubCount = 14080108;

module.exports = {
    commands: [{
        alias: ['howmanysubshavethefinebroslost'],
        command: 'topkek'
    }],
    help: [{
        command: ['howmanysubshavethefinebroslost'],
        usage: 'howmanysubshavethefinebroslost'
    }],
    topkek() {
        return new Promise((resolve, reject) => {        
            needle.get(subscriberUrl, (err, resp, body) => {
                if (!err && body) {
                    let subCount = body.items[0].statistics.subscriberCount;
                    let newCount = originalSubCount - subCount;
                    resolve({
                        type: 'channel',
                        message: '*TheFineFags have lost about ' + newCount.toLocaleString('en-US') + ' subscribers since their fuckup*'
                    });
                } else {
                    reject(err);
                }
            });
        });
    }
};