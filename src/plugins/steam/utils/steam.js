import _ from 'lodash';
import Promise from 'bluebird';
import needle from 'needle';
import async from 'async';
import SteamID from 'steamid';
import lunr from 'lunr';

const token = require('./../../../../config.json').steamAPIToken;
const endpoints = {
  profile: `http://steamcommunity.com/id/%q%/?xml=1`, // Unused
  profileSummary: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${token}&steamids=%q%`,
  miniProfile: `http://steamcommunity.com/miniprofile/%q%`, // Unused
  gameSummary: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${token}&steamid=%q%&include_played_free_games=1`,
  appDetailsBasic: `http://store.steampowered.com/api/appdetails?appids=%q%&filters=basic`,
  appDetails: `http://store.steampowered.com/api/appdetails?appids=%q%&filters=basic,price_overview,release_date,metacritic&cc=us`,
  searchApps: `http://steamcommunity.com/actions/SearchApps/%q%`, // Unused
  numPlayers: `http://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=%q%`,
  userBans: `http://api.steampowered.com/ISteamUser/GetPlayerBans/v0001/?key=${token}&steamids=%q%`,
  appList: `http://api.steampowered.com/ISteamApps/GetAppList/v0002/`,
  userLevel: `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${token}&steamid=%q%`,
  resolveVanity: `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${token}&vanityurl=%q%`
};

var appList, lastUpdated, fullTextAppList, query, type;

const getUrl = ((type, param) => {
  return endpoints[type].replace('%q%', param);
});

const getIDFromProfile = (id => {
  return new Promise((resolve, reject) => {
    needle.get(getUrl('resolveVanity', id), (err, resp, body) => {
      if (!err && body)
        if (body.response.success == 1)
          resolve(body.response.steamid);
        else
          reject("Invalid Vanity ID");
      else
        reject('Error retrieving profile ID');
    });
  });
});

const formatProfileID = (id => {
  return new Promise((resolve, reject) => {
    if (id.match(/^[0-9]+$/) || id.match(/^STEAM_([0-5]):([0-1]):([0-9]+)$/) || id.match(/^\[([a-zA-Z]):([0-5]):([0-9]+)(:[0-9]+)?\]$/)) {
      let sID = new SteamID(id);
      if (sID.isValid())
        resolve(sID.getSteamID64());
      else
        reject('Invalid ID');
    } else
      getIDFromProfile(id).then(resolve).catch(reject);
  });
});

const getUserLevel = (id => {
  return new Promise(resolve => {
    needle.get(getUrl('userLevel', id), (err, resp, body) => {
      if (!err && body)
        resolve(body.response.player_level);
      else
        resolve(0);
    });
  });
});

const getUserBans = (id => {
  return new Promise(resolve => {
    needle.get(getUrl('userBans', id), (err, resp, body) => {
      if (!err && body.players[0])
        resolve(body.players[0]);
      else
        resolve(0);
    });
  });
});

const getUserGames = (id => {
  return new Promise((resolve, reject) => {
    needle.get(getUrl('gameSummary', id), (err, resp, body) => {
      if (!err && body && body.response)
        resolve(body.response);
      else
        reject('Error retrieving user games');
    });
  });
});

const getAppDetails = ((appid, basic) => {
  return new Promise((resolve, reject) => {
    needle.get(getUrl(basic ? 'appDetailsBasic' : 'appDetails', appid), (err, resp, body) => {
      if (!err && body)
        if (body[appid].success)
          resolve(body[appid].data);
        else
          reject(`Couldn't fetch app details for that AppID, invalid? ${appid}`);
      else
        reject('Error retrieving game details');
    });
  });
});

const updateAppList = (hasApplist => {
  return new Promise((resolve, reject) => {
    // Update the list every 4 hours
    if (!lastUpdated || lastUpdated + (4 * 3600) < Math.round(new Date().getTime() / 1000)) {
      needle.get(getUrl('appList'), (err, resp, body) => {
        if (!err && body) {
          appList = body.applist;
          fullTextAppList = new lunr.Index();
          fullTextAppList.ref('appid');
          fullTextAppList.field('name', { boost: 10 });
          appList.apps.forEach((app) => { fullTextAppList.add(app) });
          lastUpdated = Math.round(new Date().getTime() / 1000);
          resolve();
        } else {
          if (hasApplist)
            resolve()
          else
            reject("Error fetching appList");
        }
      });
    } else
      resolve();
  });
});

const getAppsByFullText = (appName => {
  return new Promise((resolve, reject) => {
    // Regex Stuff
    query = appName;
    type = 0;
    if (appName.charAt(0) == '^') type++;
    if (appName.charAt(appName.length - 1) == '$') type = type + 2;
    let input = type == 0 ? appName : (type == 1 ? appName.slice(1) : (type == 2 ? appName.slice(0, -1) : appName.slice(1, -1)))

    let hasApplist = (!!appList && !!appList.apps && !!fullTextAppList);
    updateAppList(hasApplist).then(() => {
      let matchedAppIds = fullTextAppList.search(input).slice(0, 4).map((app) => app.ref);
      let apps = appList.apps.filter(function(game) {
        return _.contains(matchedAppIds, game.appid);
      });
      if (apps.length)
        resolve(apps.length > 1 ? apps : [apps[0]]);
      else
        reject("Couldn't find a game with that name");
    }).catch(reject);
  });
});

const findValidAppInApps = ((apps, gamesOnly) => {
  return new Promise((resolve, reject) => {
    let valid = false;
    const CheckQueue = async.queue((appID, next) => {
      getAppDetails(appID.appid)
        .then(app => {
          //console.log(app.type, app.name);
          if (!gamesOnly || (gamesOnly && app.type == 'game')) {
            valid = true;
            resolve(app);
          }

          if (!valid && next)
            process.nextTick(next);
          else
            CheckQueue.kill();
        }).catch(() => {
          if (!valid && next)
            process.nextTick(next);
          else
            CheckQueue.kill();
        });
    });

    CheckQueue.drain = () => {
      reject("Couldn't find a valid game with that name, try refining your search");
    };

    checkRegex(apps).then(nApps => _.forEach(nApps, app => CheckQueue.push(app)))
  });
});

const checkRegex = apps => {
  return new Promise(resolve => {
    if (!type) return resolve(apps)
    let match = new RegExp(query, 'gi')
    let matched = _.find(apps, app => {
      return app.name.match(match) ? true : false
    })
    matched ? resolve(promote(apps, matched.appid, 'appid')) : resolve(apps)
  })
}

// Function for moving an element in an array to front
const promote = function(array, param, param2) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][param2] === param) {
      let a = array.splice(i, 1);
      array.unshift(a[0]);
      return array;
    }
  }
  return array;
}

const getPlayersForApp = (appid => {
  return new Promise((resolve, reject) => {
    needle.get(getUrl('numPlayers', appid), (err, resp, body) => {
      if (!err && body)
        if (typeof body.response.player_count != 'undefined')
          resolve(body.response);
        else
          reject('Unable to view player counts for this app');
      else
        reject('Error retrieving player counts');
    });
  });
});

module.exports = {
  getProfileInfo(id) {
    return new Promise((resolve, reject) => {
      formatProfileID(id).then(newID => {
        needle.get(getUrl('profileSummary', newID), (err, resp, body) => {
          if (!err && body) {
            let profile = body.response.players[0];
            Promise.join(getUserLevel(newID), getUserBans(newID), getUserGames(newID), (level, bans, games) => {
              profile.user_level = level;
              profile.bans = bans;
              let sortedGames = games.games.sort((a, b) => {
                return b.playtime_forever - a.playtime_forever;
              });
              profile.totalgames = games.game_count;
              profile.mostplayed = sortedGames[0];
              getAppDetails(sortedGames[0].appid, true).then(game => {
                if (game) {
                  profile.mostplayed.name = game.name;
                  resolve(profile);
                }
              }).catch(reject);
            }).catch(reject);
          } else {
            reject('Error retrieving profile info');
          }
        });
      }).catch(reject);
    });
  },
  getAppPlayers(appid) {
    return new Promise((resolve, reject) => {
      if (!appid.match(/^\d+$/)) {
        getAppsByFullText(appid).then(apps => {
          findValidAppInApps(apps).then(app => {
            getPlayersForApp(app.steam_appid).then(players => {
              players.name = app.name;
              resolve(players);
            }).catch(reject);
          }).catch(reject);
        }).catch(reject);
      } else {
        Promise.join(getAppDetails(appid, true), getPlayersForApp(appid), (app, players) => {
          players.name = app.name;
          resolve(players);
        }).catch(reject);
      }
    });
  },
  getAppInfo(appid, gamesOnly) {
    return new Promise((resolve, reject) => {
      if (!appid.match(/^\d+$/)) { // Not an appid
        getAppsByFullText(appid).then(apps => {
          findValidAppInApps(apps, gamesOnly).then(app => {
            getPlayersForApp(app.steam_appid).then(players => {
              app.player_count = players.player_count;
              resolve(app);
            }).catch(err => {
              // If we can't fetch player counts just return anyway
              console.error(err);
              resolve(app);
            });
          }).catch(reject);
        }).catch(reject);
      } else { //appid
        getAppDetails(appid).then(app => {
          getPlayersForApp(appid).then(players => {
            app.player_count = players.player_count;
            resolve(app);
          }).catch(err => {
            // If we can't fetch player counts just return anyway
            console.error(err);
            resolve(app);
          });
        }).catch(reject);
      }
    });
  }
};
