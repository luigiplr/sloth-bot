import Promise from 'bluebird';
import Steam from './utils/steam';
import moment from 'moment';

module.exports = {
  commands: [{
    alias: ['sp', 'profile', 'steamprofile'],
    command: 'steamProfile'
  }, {
    alias: ['players'],
    command: 'players'
  }, {
    alias: ['app', 'game', 'fullapp'],
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
          message: generateAppDetailsResponse(resp)
        });
      }).catch(reject);
    });
  }
};

var generateProfileResponse = (profile => {
      if (profile && profile.communityvisibilitystate !== 1) {
        let msg = [
            `*Profile Name:* ${profile.personaname} ${profile.realname ? `(${profile.realname})` : ''}`,
            `*Level:* ${profile.user_level} | *Status:* ${profile.gameextrainfo ? `In-Game ${profile.gameextrainfo} (${profile.gameid})` : getPersonaState(profile.personastate)}`,
            `*Joined Steam:* ${moment(profile.timecreated * 1000).format("dddd, Do MMM YYYY")}`,
            `*Total Games:* ${profile.totalgames} | *Most Played:* ${profile.mostplayed.name} w/ ${formatPlaytime(profile.mostplayed.playtime_forever)}`,
            profile.bans ? profile.bans.VACBanned ? `*This user has ${profile.bans.NumberOfVACBans} VAC ban/s on record!*` : `` : ``
        ];
        return(msg.filter(Boolean));
    } else if (profile && profile.communityvisibilitystate == 1) {
        return [`${profile.personaname} appears to be a private profile`];
    } else {
        return ['Error fetching profile info'];
    }
});

var generateAppDetailsResponse = (app => {
    if (app && app.type == 'game') {
        let price = getPriceForApp(app);

        let out = {
            msg: `<http://store.steampowered.com/app/${app.steam_appid}|${app.name}> (${app.steam_appid})`,
            attachments: [{
                "fallback": app.name + '(' + app.steam_appid + ')',
                "image_url": app.header_image,
                "mrkdwn_in": ["text", "pretext", "fields"],
                "color": "#14578b",
                "fields": [{
                    "title": "Cost",
                    "value": price,
                    "short": true
                }, {
                    "title": app.release_date.coming_soon ? "Release Date" : "Released",
                    "value": app.release_date.date,
                    "short": true
                }, {
                    "title": "Metacritic",
                    "value": (app.metacritic && app.metacritic.score) ? app.metacritic.score : '_Unknown_',
                    "short": true
                }, {
                    "title": "Current Players",
                    "value": app.player_count ? app.player_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : '_Unknown_',
                    "short": true
                }]
            }]
        };
        return out;
    } else {
        return `Error: App: _${app.name}_ isn't a valid game`;
    }
});

var generatePlayersResponse = (app => {
    return 'There are currently *' + app.player_count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '* people playing _' + app.name + '_ right now';
});

var getPriceForApp = (app => {
    if (app.is_free)
        return 'This game is Free 2 Play, yay :)';
    else if (app.price_overview && app.price_overview.discount_percent > 0)
        return (`~$${formatCurrency(app.price_overview.initial/100, app.price_overview.currency)}~ - *$${formatCurrency(app.price_overview.final/100, app.price_overview.currency)}* ${app.price_overview.discount_percent}% OFF!!! :eyes::scream:`);
    else if (app.price_overview)
        return (`$${formatCurrency(app.price_overview.initial/100, app.price_overview.currency)}`);
    else
        return '_Unknown_';
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

