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
    }, {
        alias: ['app', 'game', 'steamgame'],
        command: 'app'
    }],
    help: [{
        command: ['sp', 'profile', 'steamprofile'],
        usage: 'steamprofile <steamid/vanityid>'
    }, {
        command: ['players'],
        usage: 'players <appid>'
    }, {
        command: ['app', 'game', 'steamgame'],
        usage: 'game <appid or game name>'
    }],
    steamProfile(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input) {
                return resolve({
                    type: 'dm',
                    message: 'Usage: steamprofile <SteamID/64 or VanityURL ID> - Returns a users basic Steam Information'
                });
            }
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
                        }
                    }).catch(reject);
                } else {
                    return resolve({
                        type: 'channel',
                        message: 'Invalid ID'
                    });
                }
            // VanityURL ID
            } else {
                let steam = new Steam(input);
                steam.getIDFromProfile().then(newID => {
                    if (newID.error) {
                        return resolve({
                            type: 'channel',
                            message: _.unescape(newID.error)
                        });
                    } else {
                        steam.getProfileInfo().then(info => {
                            if (info) {
                                return resolve({
                                    type: 'channel',
                                    messages: generateProfileResponse(info)
                                });
                            }
                        }).catch(reject);
                    }
                });
            }
        });
    },
    players(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input) {
                return resolve({
                    type: 'dm',
                    message: 'Usage: players <appid> - Returns the current amount of players for the game'
                });
            }
            
            if (input.match(/^\d+$/)) {
                let steam = new Steam(input);
                steam.getAppDetails().then(game => {
                    steam.getNumberOfCurrentPlayers().then(players => {
                        if (players) {
                            return resolve({
                                type: 'channel',
                                message: generatePlayersResponse(game, players)
                            });
                        }
                    }).catch(reject);
                }).catch(reject);
            } else {
                let steam = new Steam(input);
                steam.getAppIDByGameName().then(apps => {
                    if (apps) {
                        steam.getAppDetails().then(game => {
                            if ((game.type != 'game' || game.type != 'dlc') && apps.length >= 2) {
                                steam.getNumberOfCurrentPlayers(apps[1].appid).then(players => {
                                    if (players) {
                                        return resolve({
                                            type: 'channel',
                                            message: generatePlayersResponse(apps[1], players)
                                        });
                                    }
                                }).catch(reject);
                            } else {
                                steam.getNumberOfCurrentPlayers(game.appid).then(players => {
                                    if (players) {
                                        return resolve({
                                            type: 'channel',
                                            message: generatePlayersResponse(game, players)
                                        });
                                    }
                                }).catch(reject);
                            }
                        }).catch(reject);
                    }
                }).catch(reject);
            }
        });
    },
    app(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return resolve({
                    type: 'dm',
                    message: 'Usage: game <appid or game name> - Returns basic app info such as price and name'
                });
            if (input.match(/^\d+$/)) {
                new Steam(input).getAppInfo().then(game => {
                    resolve({
                        type: 'channel',
                        messages: generateAppDetailsResponse(game)
                    });
                }).catch(reject);
            } else {
                let steam = new Steam(input);
                steam.getAppIDByGameName().then(apps => {
                    if (apps) {
                        steam.getAppInfo().then(game => {
                            if (game.type != 'game' && apps.length >= 2) {
                                steam.getAppInfo(apps[1].appid).then(secondgame => {
                                    resolve({
                                        type: 'channel',
                                        messages: generateAppDetailsResponse(secondgame)
                                    });
                                }).catch(reject);
                            } else {
                                resolve({
                                    type: 'channel',
                                    messages: generateAppDetailsResponse(game)
                                });
                            }
                        }).catch(reject);
                    }
                }).catch(reject);
            }
        });
    }
};

var generateProfileResponse = (profile => {
    if (profile && profile.communityvisibilitystate !== 1) {
        return [
            '*Profile Name:* ' + profile.personaname + (profile.realname ? ' ('+ profile.realname + ')' : ''),
            '*Level:* ' + profile.user_level,
            profile.gameextrainfo ? ('*Status:* In Game ' + profile.gameextrainfo + ' _(' + profile.gameid + ')_') : '*Status:* ' + getPersonaState(profile.personastate),
            '*Date Created:* ' + new Date(profile.timecreated * 1000).toGMTString(),
            '*Total Games:* ' + profile.totalgames + ' | *Most Played:* ' + profile.mostplayed.name + ' w/ ' + formatPlaytime(profile.mostplayed.playtime_forever)
        ];
    } else if (profile && profile.communityvisibilitystate == 1) {
        return [profile.personaname + ' appears to be a private profile'];
    } else {
        return ['Error fetching profile info'];
    }
});

var generateAppDetailsResponse = (app => {
    if (app && (app.type == 'game' || app.type == 'dlc')) {
        let out = [
            '*' + app.name + '* _(' + app.steam_appid + ')_'];
        if (app.is_free)
            out.push(
                '*Cost:* This game is Free 2 Play, yay :)');
        else if (app.price_overview.discount_percent > 0)
            out.push(
                '*Cost:* ~$' + formatCurrency(app.price_overview.initial/100, app.price_overview.currency) +  '~ *$' + formatCurrency(app.price_overview.final/100, app.price_overview.currency) + '* ' + app.price_overview.discount_percent + '% OFF!!! :eyes::scream:');
        else
            out.push(
                '*Cost:* $' + formatCurrency(app.price_overview.initial/100, app.price_overview.currency));
        out.push(
            app.player_count ? '*Current Players:* ' + app.player_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '');
        out.push(
            '<http://store.steampowered.com/app/' + app.steam_appid + '/>');
        return(out);
    } else {
        return ["Error: App: _" + app.name + "_ isn't a valid game or dlc"];
    }
});

var generatePlayersResponse = ((app, players) => {
    return 'There are currently *' + players.player_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '* people playing _' + app.name + '_ right now';
});

var getPersonaState = (state => {
    switch (state) {
        case 0:
            return 'Offline';
        case 1: //Online
        case 2: //Busy
        case 3: //Away
        case 4: //Snooze
        case 5: //Looking to trade
        case 6: //Looking to play
            return 'Online';
    }
});

var formatCurrency = (n, currency) => {
    return n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + ' ' + currency;
};

var formatPlaytime = (time => {
    if (time < 120)
        return time + ' minutes';
    else
        return Math.floor(time / 60) + ' hours';
});