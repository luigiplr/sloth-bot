import _ from 'lodash';
import Promise from 'bluebird';
import Steam from './utils/steam';

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
            Steam.getProfileInfo(input).then(resp => {
                resolve({
                    type: 'channel',
                    messages: generateProfileResponse(resp)
                });
            }).catch(reject);
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

            Steam.getAppPlayers(input).then(resp => {
                resolve({
                    type: 'channel',
                    message: generatePlayersResponse(resp)
                });
            }).catch(reject);
        });
    },
    app(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return resolve({
                    type: 'dm',
                    message: 'Usage: game <appid or game name> - Returns basic app info such as price and name'
                });
            Steam.getAppInfo(input).then(resp => {
                resolve({
                    type: 'channel',
                    messages: generateAppDetailsResponse(resp)
                });
            }).catch(reject);
        });
    }
};

var generateProfileResponse = (profile => {
    if (profile && profile.communityvisibilitystate !== 1) {
        let out = [];
        out.push(
            '*Profile Name:* ' + profile.personaname + (profile.realname ? ' ('+ profile.realname + ')' : ''),
            '*Level:* ' + profile.user_level,
            profile.gameextrainfo ? ('*Status:* In Game ' + profile.gameextrainfo + ' _(' + profile.gameid + ')_') : '*Status:* ' + getPersonaState(profile.personastate),
            '*Date Created:* ' + new Date(profile.timecreated * 1000).toGMTString(),
            '*Total Games:* ' + profile.totalgames + ' | *Most Played:* ' + profile.mostplayed.name + ' w/ ' + formatPlaytime(profile.mostplayed.playtime_forever),
            profile.bans ? profile.bans.VACBanned ? '*This user has ' + profile.bans.NumberOfVACBans + ' VAC ban/s on record!*' : '' : '' 
        );
        if (profile.ban) {}
        return(out.filter(Boolean));
    } else if (profile && profile.communityvisibilitystate == 1) {
        return [profile.personaname + ' appears to be a private profile'];
    } else {
        return ['Error fetching profile info'];
    }
});

var generateAppDetailsResponse = (app => {
    if (app && app.type == 'game') {
        let out = [
            '*' + app.name + '* _(' + app.steam_appid + ')_'];
        if (app.is_free)
            out.push(
                '*Cost:* This game is Free 2 Play, yay :)');
        else if (app.price_overview && app.price_overview.discount_percent > 0)
            out.push(
                '*Cost:* ~$' + formatCurrency(app.price_overview.initial/100, app.price_overview.currency) +  '~ *$' + formatCurrency(app.price_overview.final/100, app.price_overview.currency) + '* ' + app.price_overview.discount_percent + '% OFF!!! :eyes::scream:');
        else if (app.price_overview)
            out.push(
                '*Cost:* $' + formatCurrency(app.price_overview.initial/100, app.price_overview.currency));
        out.push(
            app.release_date.coming_soon ? '*Release Date:* ' + app.release_date.date : '*Released:* ' + app.release_date.date,
            app.metacritic ? '*Metacritic Score:* ' + app.metacritic.score : '',
            app.player_count ? '*Current Players:* ' + app.player_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '',
            '<http://store.steampowered.com/app/' + app.steam_appid + '/>');
        return(out.filter(Boolean));
    } else {
        return ["Error: App: _" + app.name + "_ isn't a valid game"];
    }
});

var generatePlayersResponse = (app => {
    return 'There are currently *' + app.player_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '* people playing _' + app.name + '_ right now';
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