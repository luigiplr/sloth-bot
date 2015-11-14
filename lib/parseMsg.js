var Promise = require('bluebird');
var google = require('./google');
var predict = require('eightball');
var slack = require('./slack');
var insult = require('./insult');
var cleverbot = require('./cleverbot');
var blasphemer = require('blasphemy');
var database = require('./database');
var mrw = require('./mrw');
var urban = require('./urban');
var chucknorris = require('./chucknorris');
var developerexcuses = require('developerexcuses');
var prefix = require('./../config.json').prefix;

database.init();

module.exports = {
    parse: function(input, user, channel) {
        return new Promise(function(resolve) {
            var parsedimput = input.substr(1).split(' ');
            var queary = parsedimput.splice(1).join(' ');
            switch (parsedimput[0].toLowerCase()) {
                case 'g':
                case 'google':
                case 'googlesearch':
                    google.search(queary, user)
                        .then(resolve);
                    break;
                case 'gi':
                case 'googleimage':
                    google.image(queary, user)
                        .then(resolve);
                    break;
                case '8ball':
                    resolve('(' + user + ') ' + predict());
                    break;
                case 'blasphemy':
                    resolve(blasphemer.blaspheme());
                    break;
                case 'shakespeareinsult':
                case 'sinsult':
                case 'oldinsult':
                    insult.oldInsult(queary)
                        .then(resolve);
                    break;
                case 'insult':
                    insult.insult(queary)
                        .then(resolve);
                    break;
                case 'yt':
                case 'youtube':
                    google.youtubeSearch(queary, user)
                        .then(resolve);
                    break;
                case 'invite':
                    slack.invite(queary, user)
                        .then(resolve);
                    break;
                case 'k':
                case 'kick':
                    slack.kick(queary.split(' ')[0], channel, user, queary.split(' ').splice(1).join(' '))
                        .then(resolve);
                    break;
                case 'quotes':
                    slack.quote(queary.split(' ')[0], 'all')
                        .then(resolve);
                    break;
                case 'quote':
                    slack.quote(queary.split(' ')[0], queary.split(' ').splice(1)[0])
                        .then(resolve);
                    break;
                case 'setmrw':
                    var reaction = (queary.indexOf(',') > -1) ? queary.split(',')[0] : queary.split(' ')[0];
                    var setting = (queary.indexOf(',') > -1) ? queary.split(',').splice(1).join(' ') : queary.split(' ').splice(1).join(' ')
                    mrw.set(reaction, setting)
                        .then(resolve);
                    break;
                case 'mrw':
                    mrw.when(queary, user)
                        .then(resolve);
                    break;
                case 'grab':
                    slack.grabQuote(queary.split(' ')[0], channel)
                        .then(resolve);
                    break;
                case 'cb':
                case 'cleverbot':
                    cleverbot.send(queary)
                        .then(resolve);
                    break;
                case 'h':
                case 'help':
                    module.exports.showHelp()
                        .then(resolve);
                    break;
                case 'ru':
                case 'randomurban':
                    urban.random(user)
                        .then(resolve);
                    break;
                case 'urbandictionary':
                case 'urban':
                    urban.define(queary, user)
                        .then(resolve);
                    break;
                case 'cn':
                case 'chuck':
                case 'chucknorris':
                    if (queary)
                        chucknorris.user(queary, user)
                        .then(resolve);
                    else
                        chucknorris.random(user)
                        .then(resolve);
                    break;
                case 'developerexcuse':
                case 'devexcuse':
                    developerexcuses(function(err, excuses) {
                        if (err) {
                            return resolve('(' + user + ') ' + err);
                        } else {
                            return resolve('(' + user + ') ' + excuses);
                        }
                    });
                    break;
                case 'lod':
                case 'lookofdisapproval':
                    if (queary)
                        resolve('ಠ_ಠ ' + queary);
                    else
                        resolve('ಠ_ಠ');
                    break;
                default:
                    resolve('ಠ_ಠ ' + user + ' try again with a valid command. Type `' + prefix + 'help` for list of commands.');
            }
        });
    },
    handleCustom: function(input, user) {
        return new Promise(function(resolve) {
            switch (input) {
                case "ain't that right sloth?":
                    var pic = 'http://38.media.tumblr.com/74413542962b51daa05c8d55fbd66f24/tumblr_np1al8Y9xN1unfitfo1_250.gif?';
                    resolve(pic + module.exports.generatechars());
                    break;
                default:
                    resolve(false);
            }
        });
    },
    showHelp: function() {
        return new Promise(function(resolve) {
            var help = [
                'google | g | googlesearch <text>',
                'gi | googleimage <text>',
                '8ball <text>',
                'blasphemy',
                'shakespeareinsult | sinsult | oldinsult <name>',
                'insult <name>',
                'yt | youtube <text>',
                'quote <username> <quotenumber (defualt last)>',
                'grab <username>',
                'quotes <username>',
                'mrw <reaction>',
                'setmrw <mrw> <reaction>',
                'invite <email>',
                'k | kick <name>',
                'cn | chuck | chucknorris <name>',
                'randomurban | ru',
                'urban | urbandictionary <term>',
                'developerexcuse | devexcuse',
                'cb | cleverbot <text>',
                'lod | lookofdisapproval <user>'
            ];
            resolve(help);
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