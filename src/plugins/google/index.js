import _ from 'lodash';
import Promise from 'bluebird';
import google from 'google';
import giSearch from 'google-images';
import YouTube from 'youtube-node';

const youTube = new YouTube();
youTube.setKey(require('./../../../config.json').googleToken);

module.exports = {
    commands: [{
        alias: ['g', 'google'],
        command: 'googleSearch'
    }, {
        alias: ['gi', 'googleimage'],
        command: 'googleImage'
    }, {
        alias: ['yt', 'youtube'],
        command: 'youtubeSearch'
    }],
    help: [{
        command: ['g', 'google'],
        usage: 'google <query>'
    }, {
        command: ['gi', 'googleimage'],
        usage: 'googleimage <query>'
    }, {
        command: ['yt', 'youtube'],
        usage: 'youtube <query>'
    }],
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
    googleImage(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input) {
                return resolve({
                    type: 'dm',
                    message: 'Usage: googleimage <query> | Returns any of the first 4 results for query'
                });
            }
            try {
                giSearch.search(input, (err, images) => {
                    return resolve({
                        type: 'channel',
                        message: !err ? images[Math.floor(Math.random() * 4)].url + '#'+Math.floor(Math.random() * 1000) : err.toString()
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
                                message: error ? error :
                                    title + ' - length: ' + length + ' - ' + likes + ' like(s),' + dislikes + ' dislike(s) ' + percent + ' - ' + views + ' view(s) ' + channel + ' - ' + url
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