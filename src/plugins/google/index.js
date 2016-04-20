import Promise from 'bluebird';
import google from 'google';
import YouTube from 'youtube-node';
import needle from 'needle';
import config from '../../../config.json'

const youTube = new YouTube();
youTube.setKey(config.googleToken);

export const plugin_info = [{
  alias: ['g', 'google'],
  command: 'googleSearch',
  usage: 'google <query>'
}, {
  alias: ['yt', 'youtube'],
  command: 'youtubeSearch',
  usage: 'youtube <query>'
}, {
  alias: ['gi', 'googleimage'],
  command: 'googleImage',
  usage: 'googleimage <query>'
}]

export function googleImage(user, channel, input) {
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
}
export function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}
export function googleSearch(user, channel, input) {
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
}
export function youtubeSearch(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input)
      return resolve({
        type: 'dm',
        message: 'Usage: youtube <query> | Returns the first video found for query'
      });

    if (!config.googleToken)
      return reject("Error: Google APIKey required to use this function");

    youTube.search(input, 1, (error, result) => {
      if (error || !result.items[0].snippet)
        return resolve({
          type: 'channel',
          message: 'No results found'
        });

      var url = 'http://youtu.be/' + result.items[0].id.videoId,
        //description = result.items[0].snippet.description,
        title = result.items[0].snippet.title;

      youTube.getById(result.items[0].id.videoId, (error, singleresult) => {
        if (error) {
          resolve(error);
        } else {
          var views = singleresult.items[0].statistics.viewCount,
            likes = singleresult.items[0].statistics.likeCount,
            dislikes = singleresult.items[0].statistics.dislikeCount,
            //quality = singleresult.items[0].contentDetails.definition,
            percent = 0,
            channel = singleresult.items[0].snippet.channelTitle,
            length = singleresult.items[0].contentDetails.duration;
          return resolve({
            type: 'channel',
            message: error ? error : title + ' - length: ' + length + ' - ' + likes + ' like(s),' + dislikes + ' dislike(s) ' + percent + ' - ' + views + ' view(s) ' + channel + ' - ' + url
          });
        }
      }).catch(reject);
    }).catch(reject);
  });
}

