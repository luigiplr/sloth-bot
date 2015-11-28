import _ from 'lodash';
import Promise from 'bluebird';
import google from 'google';
import giSearch from 'google-images';
import YouTube from 'youtube-node';

var youTube = new YouTube();

module.exports = {
    commands: [{
        alias: ['g', 'google'], command: 'googleSearch'
    }, {
        alias: ['gi', 'googleimage'], command: 'googleImage'
    }, {
        alias: ['yt', 'youtube'], command: 'youtubeSearch'
    }],
    help: [{
        command: ['g', 'google'], usage: 'google <query>'
    }, {
        command: ['gi', 'googleimage'], usage: 'googleimage <query>'
    }, {
        command: ['yt', 'youtube'], usage: 'youtube <query>'
    }],
    googleSearch(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input) {
                return resolve({
                    type: 'channel',
                    message: 'What am i goooogling?'
                });
            }
            try {
                
            } catch (e) {
                reject(e);
            }
        });
    },
    googleImage(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input) {
                return resolve({
                    type: 'channel',
                    message: 'What am i goooogling?'
                });
            }
            try {
               
            } catch (e) {
                reject(e);
            }
        });
    },
    youtubeSearch(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input) {
                return resolve({
                    type: 'channel',
                    message: 'What am i YouTubing?'
                });
            }
            try {

            } catch (e) {
                reject(e);
            }
        });
    }
};