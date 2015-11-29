import _ from 'lodash';
import Promise from 'bluebird';
import Steam from './utils/steam';
import SteamID from 'steamid';

module.exports = {
    commands: [{
        alias: ['sp', 'profile', 'steamprofile'],
        command: 'steamProfile'
    }, {
        alias: ['players'],
        command: 'players'
    }],
    help: [{
        command: ['sp', 'profile', 'steamprofile'],
        usage: 'steamprofile <steamid/vanityid>'
    }, {
        command: ['players'],
        usage: 'players <appid>'
    }],
    steamProfile(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input) {
                return resolve({
                    type: 'channel',
                    message: 'Please specifiy a SteamID/64 or VanityURL ID'
                });
            }
            try {
                // 76561198035864385 or STEAM_0:1:37799328 or [U:1:75598657]
                if (input.match(/^[0-9]+$/) || input.match(/^STEAM_([0-5]):([0-1]):([0-9]+)$/) || input.match(/^\[([a-zA-Z]):([0-5]):([0-9]+)(:[0-9]+)?\]$/)) {
                    let sid = new SteamID(input);
                    if (sid.isValid()) {
                        new Steam(sid.getSteamID64()).getProfileInfo().then(info => {
                            if (info) {
                                return resolve({
                                    type: 'channel',
                                    messages: generateProfileResponse(info)
                                });
                            } else {
                                return resolve({
                                    type: 'channel',
                                    messages: 'Error retrieving profile info'
                                });
                            }
                        });
                    } else {
                        return resolve({
                            type: 'channel',
                            message: 'Invalid ID'
                        });
                    }
                // VanityURL ID
                } else {
                    try {
                        let steam = new Steam(input);
                        steam.getIDFromProfile().then(newID => {
                            if (newID.error) {
                                return resolve({
                                    type: 'channel',
                                    message: _.unescape(newID.error)
                                });
                            }
                            else {
                                steam.getProfileInfo(newID).then(info => {
                                    if (info) {
                                        return resolve({
                                            type: 'channel',
                                            messages: generateProfileResponse(info)
                                        });
                                    } else {
                                        return resolve({
                                            type: 'channel',
                                            message: 'Error retrieving profile info'
                                        });
                                    }
                                });
                            }
                        });
                    } catch (e) {
                        console.log('Error got returned');
                    }
                }
            } catch (e) {
                reject(e);
            }
        });
    },
    players(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input) {
                return resolve({
                    type: 'channel',
                    message: 'Please enter a valid AppID'
                });
            }
            try {
                let steam = new Steam();
                steam.getAppDetails(input).then(app => {
                    if (app) {
                       steam.getNumberOfCurrentPlayers(input).then(players => {
                            if (players) {
                                return resolve({
                                    type: 'channel',
                                    message: 'There are currently *' + players.player_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '* people playing _' + app.name + '_ right now'
                                });
                            } else {
                                return resolve({
                                    type: 'channel',
                                    message: 'Error fetching player stats for ' + app.name
                                });
                            }
                        });
                    } else {
                        return resolve({
                            type: 'channel',
                            message: 'Invalid AppID'
                        });
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }
};

var generateProfileResponse = function(profile) {
    if (profile && profile.communityvisibilitystate !== 1) {
        return [
            profile.realname ? ('*Profile Name:* ' + profile.personaname + ' ('+ profile.realname + ')') : ('Profile Name: ' + profile.personaname),
            profile.gameextrainfo ? ('*Status:* In Game ' + profile.gameextrainfo + ' _(' + profile.gameid + ')_') : '',
            '*Date Created:* ' + new Date(profile.timecreated * 1000).toGMTString(),
            '*Total Games:* ' + profile.totalgames + ' | *Most Played:* ' + profile.mostplayed.name + ' w/ ' + formatPlaytime(profile.mostplayed.playtime_forever)
        ];
    } else if (profile && profile.communityvisibilitystate == 1) {
        return profile.personaname + ' appears to be a private profile';
    } else {
        return 'Error fetching profile info';
    }
};

var formatCurrency = (n, currency) => {
    return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + ' ' + currency;
};

var formatPlaytime = (time => {
    if (time < 120)
        return time + ' minutes';
    else
        return Math.floor(time / 60) + ' hours';
});