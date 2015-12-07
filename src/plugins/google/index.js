import _ from 'lodash';
import Promise from 'bluebird';
import google from 'google';
import YouTube from 'youtube-node';
import MetaInspector from 'node-metainspector';

const youTube = new YouTube();
youTube.setKey(require('./../../../config.json').googleToken);

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
                    type: 'channel',
                    message: 'Usage: googleimage <query> - Returns any of the first 4 images returned for query'
                });
            }

            let client = new MetaInspector('https://www.google.ro/search?q=' + input.split(' ').join('+') + '&tbm=isch', {
                timeout: 5000
            });
            let urls = [];
            client.on("fetch", () => {
                client.links.relative.forEach(el => {
                    if (el.startsWith('/imgres?imgurl=')) {
                        let url = el.replace('/imgres?imgurl=', '');
                        url = url.substr(0, url.indexOf('&'));
                        urls.push(url);
                    }
                });

                if (urls.length >= 4) {
                    var url = _.unescape(urls[0] + '#' + this.makeid()).split('%');

                } else if (urls.length !== 0) {
                    var url = _.unescape(urls[0] + '#' + this.makeid()).split('%');
                }
                if (url.length > 1)
                    url.pop();

                resolve({
                    type: 'channel',
                    message: url.join('')
                });
            });

            client.on("error", reject);
            client.fetch();
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
                google(input, (err, next, link) => {
                    return resolve({
                        type: 'channel',
                        message: !err ? link[0].href + ' - ' + link[0].title + ' - ' + link[0].description : err
                    });
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
            try {
                youTube.search(input, 1, (error, result) => {
                    if (error || !result.items[0].snippet)
                        return resolve({
                            type: 'channel',
                            message: 'No results found'
                        });

                    var url = 'http://youtu.be/' + result.items[0].id.videoId,
                        description = result.items[0].snippet.description,
                        title = result.items[0].snippet.title;

                    youTube.getById(result.items[0].id.videoId, (error, singleresult) => {
                        if (error) {
                            resolve(error);
                        } else {
                            var views = singleresult.items[0].statistics.viewCount,
                                likes = singleresult.items[0].statistics.likeCount,
                                dislikes = singleresult.items[0].statistics.dislikeCount,
                                quality = singleresult.items[0].contentDetails.definition,
                                percent = 0,
                                channel = singleresult.items[0].snippet.channelTitle,
                                length = singleresult.items[0].contentDetails.duration;
                            return resolve({
                                type: 'channel',
                                message: error ? error : title + ' - length: ' + length + ' - ' + likes + ' like(s),' + dislikes + ' dislike(s) ' + percent + ' - ' + views + ' view(s) ' + channel + ' - ' + url
                            });
                        }
                    });
                });
            } catch (e) {
                reject(e);
            }
        });
    }
};