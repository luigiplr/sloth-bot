import _ from 'lodash'
import Promise from 'bluebird'
import needle from 'needle'
import async from 'async'
import SteamID from 'steamid'
import lunr from 'lunr'

const filters = ['basic', 'price_overview', 'release_date', 'metacritic', 'developers', 'genres'].join(',')
const token = require('./../../../../config.json').steamAPIKey
const endpoints = {
  profile: `http://steamcommunity.com/id/%q%/?xml=1`, // Unused
  profileSummary: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${token}&steamids=%q%`,
  miniProfile: `http://steamcommunity.com/miniprofile/%q%`, // Unused
  gameSummary: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${token}&steamid=%q%&include_played_free_games=1`,
  appDetailsBasic: `http://store.steampowered.com/api/appdetails?appids=%q%&filters=basic`,
  appDetails: `http://store.steampowered.com/api/appdetails?appids=%q%&filters=${filters}&cc=us`,
  packageDetails: `http://store.steampowered.com/api/packagedetails/?packageids=%q%&cc=us`, // Unused
  searchApps: `http://steamcommunity.com/actions/SearchApps/%q%`, // Unused
  numPlayers: `http://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=%q%`,
  userBans: `http://api.steampowered.com/ISteamUser/GetPlayerBans/v0001/?key=${token}&steamids=%q%`,
  appList: `http://api.steampowered.com/ISteamApps/GetAppList/v0002/`,
  userLevel: `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${token}&steamid=%q%`,
  resolveVanity: `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${token}&vanityurl=%q%`
}

var appList, lastUpdated, fullTextAppList, query, regexType

const getUrl = (type, param) => endpoints[type].replace('%q%', param)

const getIDFromProfile = id => {
  return new Promise((resolve, reject) => needle.get(getUrl('resolveVanity', id), (err, resp, { response }) => {
    if (!err && response)
      if (response.success == 1) return resolve(response.steamid)
      else return reject("Invalid Vanity ID")
    else return reject('Error retrieving profile ID')
  }))
}

const formatProfileID = id => {
  return new Promise((resolve, reject) => {
    if (id.match(/^[0-9]+$/) || id.match(/^STEAM_([0-5]):([0-1]):([0-9]+)$/) || id.match(/^\[([a-zA-Z]):([0-5]):([0-9]+)(:[0-9]+)?\]$/)) {
      let sID = new SteamID(id)
      if (sID.isValid()) return resolve(sID.getSteamID64())
      else return reject('Invalid ID')
    } else getIDFromProfile(id).then(resolve).catch(reject)
  })
}

const getUserLevel = id => {
  return new Promise(resolve => needle.get(getUrl('userLevel', id), (err, resp, { response }) => {
    if (!err && response) return resolve(response.player_level)
    else return resolve(0)
  }))
}

const getUserBans = id => {
  return new Promise(resolve => needle.get(getUrl('userBans', id), (err, resp, { players }) => {
    if (!err && players[0]) return resolve(players[0])
    else return resolve(0)
  }))
}

const getUserGames = id => {
  return new Promise((resolve, reject) => needle.get(getUrl('gameSummary', id), (err, resp, body) => {
    if (!err && body && body.response) return resolve(body.response)
    else return reject('Error retrieving user games')
  }))
}

const getAppDetails = (appid, basic) => {
  return new Promise((resolve, reject) => needle.get(getUrl(basic ? 'appDetailsBasic' : 'appDetails', appid), (err, resp, body) => {
    if (!err && body)
      if (body[appid].success) return resolve(body[appid].data)
      else return reject(`Couldn't fetch app details for that AppID, invalid? ${appid}`)
    else return reject('Error retrieving game details')
  }))
}

const updateAppList = hasApplist => {
  return new Promise((resolve, reject) => {
    // Update the list every 4 hours
    if (!lastUpdated || lastUpdated + (4 * 3600) < Math.round(new Date().getTime() / 1000)) {
      needle.get(getUrl('appList'), (err, resp, body) => {
        if (!err && body) {
          appList = body.applist
          lastUpdated = Math.round(new Date().getTime() / 1000)

          fullTextAppList = new lunr.Index()
          fullTextAppList.ref('appid')
          fullTextAppList.field('name', { boost: 10 })
          appList.apps.forEach((app) => { fullTextAppList.add(app) })
          return resolve()
        } else {
          if (hasApplist) return resolve()
          else return reject("Error fetching appList")
        }
      })
    } else return resolve()
  })
}

const getAppsByFullText = appName => {
  return new Promise((resolve, reject) => {
    // Regex Stuff
    query = appName
    regexType = 0
    if (appName.charAt(0) == '^') regexType++;
    if (appName.charAt(appName.length - 1) == '$') regexType = regexType + 2;

    let input = regexType == 0 ? appName : (regexType == 1 ? appName.slice(1) : (regexType == 2 ? appName.slice(0, -1) : appName.slice(1, -1)))

    let hasApplist = (!!appList && !!appList.apps && !!fullTextAppList)
    updateAppList(hasApplist).then(() => {
      let matchedAppIds = fullTextAppList.search(input).slice(0, 4).map((app) => app.ref)
      let apps = appList.apps.filter(game => _.includes(matchedAppIds, game.appid))
      if (apps.length) return resolve(apps)
      else return reject("Couldn't find a game with that name")
    }).catch(reject)
  })
}

const findValidAppInApps = (apps, gamesOnly) => {
  return new Promise((resolve, reject) => {
    const CheckQueue = async.queue((appID, next) => {
      getAppDetails(appID.appid).then(app => {
        if (!gamesOnly || (gamesOnly && app.type == 'game')) {
          CheckQueue.kill()
          return resolve(app);
        }

        if (next) next()
        else CheckQueue.kill()
      }).catch(() => next ? next() : CheckQueue.kill())
    })

    CheckQueue.drain = () => reject("Couldn't find a valid game with that name, try refining your search")

    checkRegex(apps).then(nApps => _.forEach(nApps, app => CheckQueue.push(app)))
  })
}

const checkRegex = apps => {
  return new Promise(resolve => {
    if (!regexType) return resolve(apps)
    let match = new RegExp(query, 'gi')
    let matched = _.find(apps, app => app.name.match(match))
    matched ? resolve(promote(apps, matched.appid, 'appid')) : resolve(apps)
  })
}

// Function for moving an element in an array to front
const promote = function(array, param, param2) {
  for (let i = 0; i < array.length; i++) {
    if (array[i][param2] === param) {
      let a = array.splice(i, 1);
      array.unshift(a[0])
      return array
    }
  }
  return array;
}

const getPlayersForApp = appid => {
  return new Promise((resolve, reject) => needle.get(getUrl('numPlayers', appid), (err, resp, { response }) => {
    if (!err && response)
      if (typeof response.player_count != 'undefined') return resolve(response)
      else return reject('Unable to view player counts for this app')
    else return reject('Error retrieving player counts')
  }))
}

export function getProfileInfo(id) {
  return new Promise((resolve, reject) => formatProfileID(id).then(newID => needle.get(getUrl('profileSummary', newID), (err, resp, body) => {
    if (!err && body) {
      let profile = body.response.players[0];
      Promise.join(getUserLevel(newID), getUserBans(newID), getUserGames(newID), (level, bans, games) => {
        profile.user_level = level
        profile.bans = bans
        let sortedGames = games.games.sort((a, b) => b.playtime_forever - a.playtime_forever)
        profile.totalgames = games.game_count
        profile.mostplayed = sortedGames[0]
        getAppDetails(sortedGames[0].appid, true).then(game => {
          if (game) {
            profile.mostplayed.name = game.name;
            return resolve(profile)
          }
        }).catch(reject)
      }).catch(reject)
    } else return reject('Error retrieving profile info')
  })).catch(reject))
}

export function getAppPlayers(appid) {
  return new Promise((resolve, reject) => {
    if (!appid.match(/^\d+$/)) {
      getAppsByFullText(appid).then(apps => findValidAppInApps(apps).then(app => {
        getPlayersForApp(app.steam_appid).then(players => {
          players.name = app.name
          return resolve(players)
        }).catch(reject)
      }).catch(reject)).catch(reject)
    } else {
      Promise.join(getAppDetails(appid, true), getPlayersForApp(appid), (app, players) => {
        players.name = app.name
        return resolve(players)
      }).catch(reject)
    }
  })
}

export function getAppInfo(appid, gamesOnly) {
  return new Promise((resolve, reject) => {
    if (!appid.match(/^\d+$/)) { // Not an appid
      getAppsByFullText(appid).then(apps => findValidAppInApps(apps, gamesOnly).then(app => {
        getPlayersForApp(app.steam_appid).then(players => {
          app.player_count = players.player_count
          return resolve(app)
        }).catch(err => { // If we can't fetch player counts just return anyway
          console.error(err)
          return resolve(app)
        })
      }).catch(reject)).catch(reject)
    } else { //appid
      getAppDetails(appid).then(app => getPlayersForApp(appid).then(players => {
        app.player_count = players.player_count
        return resolve(app)
      }).catch(err => { // If we can't fetch player counts just return anyway
        console.error(err)
        return resolve(app)
      })).catch(reject)
    }
  })
}

// Credit to DoctorMcKays original code this is based off
// https://github.com/DoctorMcKay/steam-irc-bot/blob/master/irc-commands/steamid.js
export function getSteamIDInfo(id) {
  return new Promise((resolve, reject) => formatProfileID(id).then(newID => {
    let sid = new SteamID(newID)
    let i, details = []
    for (i in SteamID.Universe) {
      if (sid.universe == SteamID.Universe[i]) {
        details.push(`*Universe:* ${_.capitalize(i.toLowerCase())} (${sid.universe})`)
        break
      }
    }
    for (i in SteamID.Type) {
      if (sid.type == SteamID.Type[i]) {
        details.push(`*Type:* ${i.split('_').map(j => _.capitalize(j.toLowerCase())).join(' ')} (${sid.type})`)
        break
      }
    }
    for (i in SteamID.Instance) {
      if (sid.instance == SteamID.Instance[i]) {
        details.push(`*Instance:* ${_.capitalize(i.toLowerCase())} (${sid.instance})`)
        break
      }
    }
    let msg = `${sid.getSteam3RenderedID()} ${sid.type == SteamID.Type.INDIVIDUAL ? '/' + sid.getSteam2RenderedID() : ''} / ${sid.getSteamID64()} \n *Valid:* ${sid.isValid() ? 'True' : 'False'}, ${details.join(', ')}, *AccountID:* ${sid.accountid}`;
    return resolve(msg)
  }).catch(reject))
}
