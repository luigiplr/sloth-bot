import Promise from 'bluebird';
import google from 'google';
import ytSearch from 'youtube-search';
import needle from 'needle';
import config from '../../../config.json'

const ytOpts = {
  maxResults: 1,
  key: config.googleToken,
  type: 'video',
  videoEmbeddable: true,
  safeSearch: 'none'
}

module.exports = {
  commands: [{
    alias: ['g', 'google'],
    command: 'googleSearch'
  }, {
    alias: ['yt', 'youtube'],
    command: 'youtubeSearch'
  }, {
    alias: ['gi', 'googleimage'],
    command: 'googleImage'
  }],
  help: [{
    command: ['g', 'google'],
    usage: 'google <query>'
  }, {
    command: ['yt', 'youtube'],
    usage: 'youtube <query>'
  }, {
    command: ['gi', 'googleimage'],
    usage: 'googleimage <query>'
  }],
  googleImage(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: googleimage <query> - Returns any of the first 5 images returned for query'
        })

      if (!config.googleToken || !config.cseToken)
        return reject("Error: Google API Key and CSE Key are required to use this function")

      let url = `https://www.googleapis.com/customsearch/v1?q=${input}&num=5&searchType=image&start=1&key=${config.googleToken}&cx=${config.cseToken}`

      needle.get(url, (err, resp, body) => {
        if (!err && body && !body.error) {
          if (body.items) {
            let chosen = body.items[Math.floor(Math.random() * body.queries.request[0].count)].link + `#${this.makeid()}`
            return resolve({
              type: 'channel',
              message: chosen
            });
          } else
            reject("No results found")
        } else {
          console.error(`googleImgError: ${err || body.error.message}`)
          reject(`googleImgError: ${err || body.error.message}`)
        }
      })
    });
  },
  makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  },
  googleSearch(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: google <query> | Returns the first result for query'
        });

      try {
        google(input, (err, next, links) => {
          if (links && !err)
            return resolve({
              type: 'channel',
              message: links[0].href + ' - ' + links[0].title + ' - ' + links[0].description
            });
          else
            return reject("Didn't find anything?? " + err);
        });
      } catch (e) {
        reject(e);
      }
    });
  },
  youtubeSearch(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: youtube <query> | Returns the first video found for query'
        });

      if (!config.googleToken)
        return reject("Error: Google APIKey required to use this function");

      ytSearch(input, ytOpts, (err, resp) => {
        if (err) return reject(err)
        if (resp.length) {
          return resolve({
            type: 'channel',
            message: `https://youtu.be/${resp[0].id}`
          })
        } else return reject("No results found")
      })
    });
  }
};
