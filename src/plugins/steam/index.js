import Promise from 'bluebird'
import needle from 'needle'
import _ from 'lodash'
import { getProfileInfo, getAppPlayers, getAppInfo, getSteamIDInfo } from './utils/steam'
import moment from 'moment'

export const plugin_info = [{
  alias: ['sp', 'steamprofile'],
  command: 'steamProfile',
  usage: 'steamprofile <steamid/vanityid> - returns user steam profile'
}, {
  alias: ['players'],
  command: 'players',
  usage: 'players <appid> - returns players for steam app'
}, {
  alias: ['game', 'app'],
  command: 'game',
  usage: 'game <appid or game name> - returns steam game info'
}, {
  alias: ['sid', 'steamid'],
  command: 'steamid',
  usage: 'steamid <steamid> - returns steamid info'
}, {
  alias: ['summersale', 'summasael'],
  command: 'summersale',
  usage: 'summersale - tells u wen da sale is, durh'
}]

var AUDRate;

export function steamProfile(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: steamprofile <SteamID/64 or VanityURL ID> - Returns a users basic Steam Information' })

    getProfileInfo(input).then(resp => resolve({ type: 'channel', message: generateProfileResponse(resp) })).catch(reject)
  })
}

export function players(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: players <appid> - Returns the current amount of players for the game' })

    getAppPlayers(input).then(resp => resolve({ type: 'channel', message: generatePlayersResponse(resp) })).catch(reject)
  })
}

export function game(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: game <appid or game name> [-cc us] - Returns basic game info such as price and name, optinally include the country code via -cc AU' })
    if (input.match(/-cc.../)) {
      var cc = input.match(/-cc.../)[0].split(' ')[1]
      input = input.replace(input.match(/-cc.../)[0], '').trim()
    }
    getAppInfo(input, cc).then(resp => resolve({ type: 'channel', message: generateAppDetailsResponse(resp, cc) })).catch(reject)
  })
}

export function steamid(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: steamid <id> - ID can be any form of SteamID' })

    getSteamIDInfo(input).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
  })
}

export function summersale() {
  return new Promise(resolve => {
    let startDate = 1466701200000
    let endDate = 1467651600000 // We think
    let sale = moment(startDate).isBefore(moment())
    let time = moment.duration(moment(sale ? endDate : startDate).diff(moment()))
    let msg = `${sale ? 'The Steam Summer Sale is here!! It ends' : 'The Steam Summer Sale starts'} ${_getSaleTime(time)}`

    return resolve({ type: 'channel', message: msg })
  })
}

const _getSaleTime = time => {
  const duration = type => time[type]() !== 0 ? `${time[type]()} ${type.slice(0, -1)}${(time[type]() > 1 ? 's' : '')}` : false
  const getTime = (firstHalf, seconds) => firstHalf.replace(/, /, '').length !== 0 ? `${firstHalf} and ${seconds || '0 seconds'}` : seconds
  return `in approximately ${getTime(['months', 'days', 'hours', 'minutes'].map(duration).filter(Boolean).join(', '), duration('seconds'))}`
}

const generateProfileResponse = (profile => {
  if (profile) {
    let realname = profile.realname ? `(${profile.realname})` : ''
    let status = profile.gameextrainfo ? `In-Game ${profile.gameextrainfo} (${profile.gameid})` : getPersonaState(profile.personastate)
    let msg = [
      `*Profile Name:* ${profile.personaname} ${realname}`,
      `*Level:* ${profile.user_level} | *Status:* ${status}`,
      `*Joined Steam:* ${profile.timecreated ? moment(profile.timecreated * 1000).format("dddd, Do MMM YYYY") : 'Unknown'}`,
      `*Total Games:* ${profile.totalgames} | *Most Played:* ${profile.mostplayed.name} w/ ${formatPlaytime(profile.mostplayed.playtime_forever)}`,
      profile.bans ? profile.bans.VACBanned ? `*This user has ${profile.bans.NumberOfVACBans} VAC ban/s on record!*` : null : null,
      profile.communityvisibilitystate == 1 ? '*This is a private profile*' : null
    ]
    let out = {
      attachments: [{
        "mrkdwn_in": ["text"],
        "author_name": profile.personaname,
        "author_icon": profile.avatar,
        "author_link": profile.profileurl,
        "text": msg.filter(Boolean).join('\n')
      }]
    }
    return out
  } else return 'Error fetching profile info'
})

const generateAppDetailsResponse = ((app, cc = 'US') => {
  if (app) {
    let out = {
      msg: `*<http://store.steampowered.com/app/${app.steam_appid}|${app.name}>* _(${app.steam_appid})_ _(${cc.toUpperCase()})_`,
      attachments: [{
        "fallback": app.name + '(' + app.steam_appid + ')',
        "image_url": app.header_image,
        "mrkdwn_in": ["text", "pretext", "fields"],
        "color": "#14578b"
      }]
    }

    let price = getPriceForApp(app)
    let date = getDateForApp(app)

    out.attachments[0].fields = _.filter([{
      "title": "Cost",
      "value": price || null,
      "short": true
    }, {
      "title": "Real Cost",
      "value": (AUDRate && cc.toUpperCase() == 'AU') ? '~$' + formatCurrency((app.price_overview.final / 100) * AUDRate, 'AUD') : null,
      "short": true
    }, {
      "title": app.release_date ? (app.release_date.coming_soon ? "Release Date" : "Released") : null,
      "value": date || null,
      "short": true
    }, {
      "title": "Type",
      "value": _.capitalize(app.type),
      "short": true
    }, {
      "title": "Genres",
      "value": app.genres ? (app.genres.slice(0, 3).map(g => g.description).sort().join(', ')) : null,
      "short": true
    }, {
      "title": "Current Players",
      "value": app.player_count ? formatNumber(app.player_count) : null,
      "short": true
    }, {
      "title": 'Developers',
      "value": app.developers ? (_.truncate(app.developers.join(', '), { length: 40 })) : null,
      "short": true
    }, {
      "title": "Metacritic",
      "value": (app.metacritic && app.metacritic.score) ? app.metacritic.score : null,
      "short": true
    }, {
      "title": "Demo",
      "value": app.demos ? 'Demos available' : null,
      "short": true
    }], 'value')
    return out
  } else return `Error: App: *${app.name}* _(${app.steam_appid})_ isn't a valid game`
})

const generatePlayersResponse = app => `There are currently *${formatNumber(app.player_count)}* people playing _${app.name}_ right now`

const formatNumber = number => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const formatCurrency = (n, currency) => n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + ' ' + currency
const formatPlaytime = time => time < 120 ? `${time} minutes` : `${Math.floor(time / 60)} hours`

const getPriceForApp = app => {
  if (app.is_free)
    return 'This game is Free 2 Play, yay :)'
  else if (app.price_overview && app.price_overview.discount_percent > 0)
    return (`~$${formatCurrency(app.price_overview.initial/100, app.price_overview.currency)}~ - *$${formatCurrency(app.price_overview.final/100, app.price_overview.currency)}* \n ${app.price_overview.discount_percent}% OFF!!! :eyes::scream:`)
  else if (app.price_overview)
    return (`$${formatCurrency(app.price_overview.initial/100, app.price_overview.currency)}`)
  else
    return '_Unknown_'
}

const getDateForApp = app => {
  let date = new Date(app.release_date.date)
  if (app.release_date.coming_soon && moment(date).isValid()) return `${app.release_date.date} (${moment().to(date)})`
  else return app.release_date.date
}

const getPersonaState = (state => {
  switch (state) {
    case 0:
      return 'Offline'
    case 1: //Online
    case 2: //Busy
    case 3: //Away
    case 4: //Snooze
    case 5: //Looking to trade
    case 6: //Looking to play
      return 'Online'
  }
})

const getAUDRate = () => needle.get('http://api.fixer.io/latest?base=USD', (err, resp, { rates }) => {
  if (!err && resp.body && rates) AUDRate = rates.AUD
  else console.error("Error fetching AUD Rate")
})

// Fetch AUD rate on startup and update every 12 hours
_.delay(() => {
  setInterval(() => {
    console.log("Updating AUD Rate")
    getAUDRate()
  }, 3600 * 12);
  getAUDRate()
}, 1000)
