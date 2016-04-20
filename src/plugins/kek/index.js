import Promise from 'bluebird';
import needle from 'needle';

const apiKey = require('./../../../config.json').googleToken;
const subscriberUrl = `https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=TheFineBros&fields=items/statistics/subscriberCount&key=${apiKey}`;
const originalSubCount = 14080108;
var lastCheck;

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
      if (!apiKey)
        return reject("Error: Google APIKey required to use this function");

      needle.get(subscriberUrl, (err, resp, body) => {
        if (!err && body) {
          let subCount = body.items[0].statistics.subscriberCount;
          let newCount = originalSubCount - subCount;
          resolve({
            type: 'channel',
            message: 'TheFineFags have lost about *' + addStupidCommas(newCount) + '* subscribers in total since their fuckup' + (newCount > lastCheck ? (' and have lost *' + addStupidCommas((newCount - lastCheck)) + '* more subscribers since I last checked') : newCount < lastCheck ? (' but have gained *' + addStupidCommas((lastCheck - newCount)) + '* since I last checked') : '')
          });
          lastCheck = newCount;
        } else {
          reject(err);
        }
      });
    });
  }
};

// Better source this shit before i get sued http://stackoverflow.com/a/2901298
function addStupidCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

