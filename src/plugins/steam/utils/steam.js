import _ from 'lodash'
import Promise from 'bluebird'
import needle from 'needle'
import SteamID from 'steamid'

const filters = ['basic', 'price_overview', 'release_date', 'metacritic', 'developers', 'genres', 'demos'].join(',')
const token = require('./../../../../config.json').steamAPIKey
const endpoints = {
  profile: `http://steamcommunity.com/id/%q%/?xml=1`, // Unused
  profileSummary: `http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${token}&steamids=%q%`,
  miniProfile: `http://steamcommunity.com/miniprofile/%q%`, // Unused
  gameSummary: `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${token}&steamid=%q%&include_played_free_games=1`,
  appDetailsBasic: `http://store.steampowered.com/api/appdetails?appids=%q%&filters=basic`,
  appDetails: `http://store.steampowered.com/api/appdetails?appids=%q%&filters=${filters}&cc=%cc%`,
  packageDetails: `http://store.steampowered.com/api/packagedetails/?packageids=%q%&cc=us`, // Unused
  searchApps: `http://steamcommunity.com/actions/SearchApps/%q%`,
  numPlayers: `http://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=%q%`,
  userBans: `http://api.steampowered.com/ISteamUser/GetPlayerBans/v0001/?key=${token}&steamids=%q%`,
  appList: `http://api.steampowered.com/ISteamApps/GetAppList/v0002/`, // Unused
  userLevel: `https://api.steampowered.com/IPlayerService/GetSteamLevel/v1/?key=${token}&steamid=%q%`,
  resolveVanity: `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${token}&vanityurl=%q%`
}

const getUrl = (type, param, cc) => {
  let out = endpoints[type].replace('%q%', param).replace('%cc%', cc)
  return (cc ? out.replace('%cc%', cc) : out)
}

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

const getAppDetails = (appid, cc, basic) => {
  return new Promise((resolve, reject) => needle.get(getUrl(basic ? 'appDetailsBasic' : 'appDetails', appid, cc), (err, resp, body) => {
    if (!err && body)
      if (body[appid].success) return resolve(body[appid].data)
      else return reject(`Couldn't fetch app details for that AppID, invalid? ${appid}`)
    else return reject('Error retrieving game details')
  }))
}

const searchForApp = query => {
  return new Promise((resolve, reject) => needle.get(getUrl('searchApps', query), (err, resp, apps) => {
    if (!err && apps.length) return resolve(apps[0].appid)
    else return reject("Couldn't find an app with that name")
  }))
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
        getAppDetails(sortedGames[0].appid, false, true).then(game => {
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
      searchForApp(appid).then(id => getAppDetails(id, false, true)).then(app => {
        getPlayersForApp(app.steam_appid).then(players => {
          players.name = app.name
          return resolve(players)
        }).catch(reject)
      }).catch(reject)
    } else {
      Promise.join(getAppDetails(appid, false, true), getPlayersForApp(appid), (app, players) => {
        players.name = app.name
        return resolve(players)
      }).catch(reject)
    }
  })
}

export function getAppInfo(appid, cc = 'US') {
  return new Promise((resolve, reject) => {
    if (!appid.match(/^\d+$/)) { // Not an appid
      searchForApp(appid).then(id => getAppDetails(id, cc)).then(app => {
        getPlayersForApp(app.steam_appid).then(players => {
          app.player_count = players.player_count
          return resolve(app)
        }).catch(err => { // If we can't fetch player counts just return anyway
          console.error(err)
          return resolve(app)
        })
      }).catch(reject)
    } else { //appid
      getAppDetails(appid, cc).then(app => getPlayersForApp(appid).then(players => {
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
