//import _ from 'lodash';
import Promise from 'bluebird';
import google from 'google';
import YouTube from 'youtube-node';
import needle from 'needle';
import config from '../../../config.json'
//import MetaInspector from 'node-metainspector';

/*const stringStartsWith = ((string, prefix) => {
    return string.slice(0, prefix.length) == prefix;
});*/

const youTube = new YouTube();
youTube.setKey(config.googleToken);

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
            if (!input) {
                return resolve({
                    type: 'dm',
                    message: 'Usage: googleimage <query> - Returns any of the first 5 images returned for query'
                })
            }

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
                }
            })

            /*let client = new MetaInspector('https://www.google.com/search?q=' + input.split(' ').join('+') + '&tbm=isch', {
                timeout: 5000
            });
            let urls = [];
            client.on("fetch", () => {
                client.links.relative.forEach(el => {
                    if (stringStartsWith(el, '/imgres?imgurl=')) {
                        let url = el.replace('/imgres?imgurl=', '');
                        url = url.substr(0, url.indexOf('&'));
                        if (url.match(/\.(jpeg|jpg|gif|png)(\/)?$/)) {
                            urls.push(url);
                        }
                    }
                });

                let url;
                if (urls.length >= 4)
                    url = _.unescape(urls[Math.floor(Math.random() * 4)] + '#' + this.makeid());
                else if (urls.length !== 0)
                    url = _.unescape(urls[0] + '#' + this.makeid());
                console.log(url);

                resolve({
                    type: 'channel',
                    message: url
                });
            });

            client.on("error", reject);
            client.fetch();*/
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
            if (!input) {
                return resolve({
                    type: 'dm',
                    message: 'Usage: google <query> | Returns the first result for query'
                });
            }
            try {
                google(input, (err, next, links) => {
                    if (links && !err) {
                        return resolve({
                            type: 'channel',
                            message: links[0].href + ' - ' + links[0].title + ' - ' + links[0].description
                        });
                    } else {
                        return reject("Didn't find anything?? " + err);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    },
    youtubeSearch(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input) {
                return resolve({
                    type: 'dm',
                    message: 'Usage: youtube <query> | Returns the first video found for query'
                });
            }
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
};