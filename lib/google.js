var Promise = require('bluebird');
var google = require('google');
var giSearch = require('google-images');
var YouTube = require('youtube-node');
var youTube = new YouTube();

google.resultsPerPage = 1;

youTube.setKey(require('./../config.json').googleToken);
module.exports = {
    search: function(input, user) {
        return new Promise(function(resolve) {
            google(input, function(err, next, link) {
                if (err) return resolve(err);
                resolve('(' + user + ') ' + link[0].link + ' - ' + link[0].title + ' - ' + link[0].description);
            });
        });
    },
    image: function(input, user) {
        return new Promise(function(resolve) {
            giSearch.search(input, function(err, images) {
                if (err) return resolve(err.toString());
                resolve('(' + user + ') ' + images[Math.floor(Math.random() * 4)].url );
            });
        });
    },
    youtubeSearch: function(input, user) {
        return new Promise(function(resolve) {
            youTube.search(input, 1, function(error, result) {
                if (error) {
                    resolve('(' + user + ') ' + 'No results found');
                } else {
                    if (!result.items[0].snippet)
                        return resolve('(' + user + ') ' + 'No results found');
                    var url = 'http://youtu.be/' + result.items[0].id.videoId;
                    var discription = result.items[0].snippet.description;
                    var title = result.items[0].snippet.title;
                    youTube.getById(result.items[0].id.videoId, function(error, singleresult) {
                        if (error) {
                            resolve(error);
                        } else {
                            var views = singleresult.items[0].statistics.viewCount;
                            var likes = singleresult.items[0].statistics.likeCount;
                            var dislikes = singleresult.items[0].statistics.dislikeCount;
                            var quality = singleresult.items[0].contentDetails.definition;
                            var percent = 0;
                            var channel = singleresult.items[0].snippet.channelTitle;
                            var length = singleresult.items[0].contentDetails.duration;
                            resolve('(' + user + ') ' + title + ' - length: ' + length + ' - ' + likes + ' like(s),' + dislikes + ' dislike(s) ' + percent + ' - ' + views + ' view(s) ' + channel + ' - ' + url);
                        }
                    });
                }
            });
        });
    },
    generatechars: function() {
        var length = 8,
            charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    }
};
