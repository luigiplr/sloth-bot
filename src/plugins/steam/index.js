import Promise from 'bluebird'
import needle from 'needle'
import { filter, capitalize, truncate } from 'lodash'
import { getProfileInfo, getAppInfo, getSteamIDInfo } from './utils/steam'
import getNextSale from './utils/sales'
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
  alias: ['steamsale'],
  command: 'steamSale',
  usage: 'steamsale - tells u wen da sale is, durh'
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

    getAppInfo(input, null, true).then(resp => resolve({ type: 'channel', message: generatePlayersResponse(resp) })).catch(reject)
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

export function steamSale() {
  return new Promise((resolve, reject) => {
    getNextSale().then(sale => {
      let currentTime = moment()
      let saleDate = moment(sale.date)
      let isActive = saleDate.isBefore(currentTime)
      let time = _getSaleTime(moment.duration((isActive ? moment(sale.enddate) : saleDate).diff(currentTime)))
      let msg = `The Steam ${sale.name} ${isActive ? 'is here! It ends' : 'starts'} ${time}${sale.confirmed ? '' : ', I think.'}`
      return resolve({ type: 'channel', message: msg })
    }).catch(reject)
  })
}

const _getSaleTime = time => {
  const duration = type => time[type]() !== 0 ? `${time[type]()} ${type.slice(0, -1)}${(time[type]() > 1 ? 's' : '')}` : false
  const getTime = (firstHalf, seconds) => firstHalf.replace(/, /, '').length !== 0 ? `${firstHalf} and ${seconds || '0 seconds'}` : seconds
  return `in approximately ${getTime(['months', 'days', 'hours', 'minutes'].map(duration).filter(Boolean).join(', '), duration('seconds'))}`
}

const formatTimeCreated = time => {
  if (!time) return 'Unknown'
  const timeCreated = moment(time * 1000)
  const diff = moment().diff(timeCreated, 'years')
  return `${timeCreated.format("dddd, Do MMMM YYYY")} _(${diff == 0 ? 'Less than a year' : (diff + ' years')})_`
}

const generateProfileResponse = (profile => {
  if (!profile) return 'Error fetching profile info'
  const realname = profile.realname ? `(${profile.realname})` : ''
  const status = profile.gameextrainfo ? `In-Game ${profile.gameextrainfo} (${profile.gameid})` : getPersonaState(profile.personastate)
  let msg = [
    `*Profile Name:* ${profile.personaname} ${realname}`,
    `*Level:* ${profile.user_level} | *Status:* ${status}`,
    `*Joined Steam:* ${formatTimeCreated(profile.timecreated)}`,
    `*Total Games:* ${profile.totalgames || "Unknown"} | *Most Played:* ${profile.mostplayed.name || "Unknown"} w/ ${formatPlaytime(profile.mostplayed.playtime_forever)}`,
    profile.bans ? profile.bans.VACBanned ? `*This user has ${profile.bans.NumberOfVACBans} VAC ban/s on record!*` : null : null,
    profile.communityvisibilitystate == 1 ? '*This is a private profile*' : null
  ]

  const out = {
    attachments: [{
      "mrkdwn_in": ["text"],
      "author_name": profile.personaname,
      "author_icon": profile.avatar,
      "author_link": profile.profileurl,
      "color": "#14578b",
      "text": msg.filter(Boolean).join('\n'),
      "fallback": msg.filter(Boolean).join(' | ').replace(/[\*\_]/g, '')
    }]
  }
  return out
})

const generateAppDetailsResponse = ((app, cc = 'US') => {
  if (!app) return `Error: App: *${app.name}* _(${app.steam_appid})_ isn't a valid game`
  let price = getPriceForApp(app)
  let date = getDateForApp(app)

  let out = {
    attachments: [{
      "fallback": `${app.name} (${app.steam_appid}) | Cost: ${price} | Current Players: ${app.player_count ? formatNumber(app.player_count) : null}`,
      "image_url": app.header_image,
      "mrkdwn_in": ["text", "pretext", "fields"],
      "color": "#14578b",
      "pretext": `*<http://store.steampowered.com/app/${app.steam_appid}|${app.name}>* _(${app.steam_appid})_ _(${cc.toUpperCase()})_`
    }]
  }

  out.attachments[0].fields = filter([{
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
    "value": capitalize(app.type),
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
    "value": app.developers ? (truncate(app.developers.join(', '), { length: 40 })) : null,
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
})

const generatePlayersResponse = app => `There are currently *${formatNumber(app.player_count)}* people playing _${app.name}_ right now`

const formatNumber = number => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
const formatCurrency = (n, currency) => n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,") + ' ' + currency
const formatPlaytime = time => !time ? "Unknown" : time < 120 ? `${time} minutes` : `${Math.floor(time / 60)} hours`

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
    case 1: //Online
    case 2: //Busy
    case 3: //Away
    case 4: //Snooze
    case 5: //Looking to trade
    case 6: //Looking to play
      return 'Online'
    default: // 0
      return 'Offline'
  }
})

const getAUDRate = () => needle.get('http://api.fixer.io/latest?base=USD', (err, resp, body) => {
  if (!err && body && body.rates) AUDRate = body.rates.AUD
  else console.error("Error fetching AUD Rate")
})

// Fetch AUD rate on startup and update every 24 hours
setTimeout(() => {
  console.log("Fetching AUD Rate")
  setInterval(() => {
    console.log("Updating AUD Rate")
    getAUDRate()
  }, 86403600)
  getAUDRate()
}, 2000)
