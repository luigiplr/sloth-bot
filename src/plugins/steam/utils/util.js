import moment from 'moment'
import needle from 'needle'
import { filter, capitalize, truncate } from 'lodash'
var AUDRate;

export function _getSaleTime(time) {
  const duration = type => time[type]() !== 0 ? `${time[type]()} ${type.slice(0, -1)}${(time[type]() > 1 ? 's' : '')}` : false
  const getTime = (firstHalf, seconds) => firstHalf.replace(/, /, '').length !== 0 ? `${firstHalf} and ${seconds || '0 seconds'}` : seconds
  return `in approximately ${getTime(['months', 'days', 'hours', 'minutes'].map(duration).filter(Boolean).join(', '), duration('seconds'))}`
}

const formatTimeCreated = time => {
  if (!time) return null
  const timeCreated = moment(time * 1000)
  const diff = moment().diff(timeCreated, 'years')
  return `${timeCreated.format("dddd, Do MMMM YYYY")} _(${diff == 0 ? 'Less than a year' : (diff + ' year' + (diff == 1 ? '' : 's'))})_`
}

const formatLastOnline = time => {
  if (!time) return 'Unknown'
  const lastOnline = moment(time * 1000)
  const diff = moment().diff(lastOnline, 'm')
  return `${lastOnline.format('Do MMM Y, h:MMa')} _(${moment.duration(-diff, 'm').humanize(true)})_`
}

const getGameTime = game => {
  const duration = moment.duration(game.playtime_2weeks, 'm')
  const hours = Math.round(duration.asHours())
  if (hours) {
    return `${hours} hour` + (hours == 1 ? '' : 's')
  } else {
    return `${game.playtime_2weeks} minute` + (game.playtime_2weeks == 1 ? '' : 's')
  }
}

export function generateProfileResponse(profile) {
  if (!profile) return 'Error fetching profile info'
  const realname = profile.realname ? `(${profile.realname})` : ''
  const status = profile.gameextrainfo ? `In-Game ${profile.gameextrainfo} (${profile.gameid})` : getPersonaState(profile.personastate)
  const joined = formatTimeCreated(profile.timecreated)
  const msg = [
    `*Profile Name:* ${profile.personaname} ${realname}`,
    `*Level:* ${profile.user_level} | *Status:* ${status}`,
    status == 'Offline' ? `*Last Online:* ${formatLastOnline(profile.lastlogoff)}` : null,
    joined ? `*Joined Steam:* ${joined}` : null,
    profile.totalgames ? `*Total Games:* ${profile.totalgames || "Unknown"} | *Most Played:* ${profile.mostplayed.name || "Unknown"} w/ ${formatPlaytime(profile.mostplayed.playtime_forever)}` : null,
    profile.bans ? profile.bans.VACBanned ? `*This user has ${profile.bans.NumberOfVACBans} VAC ban/s on record!*` : null : null,
    profile.communityvisibilitystate == 1 ? '*This is a private profile*' : null
  ]

  const out = {
    attachments: [{
      "mrkdwn_in": ["text", "fields"],
      "author_name": profile.personaname,
      "author_icon": profile.avatar,
      "author_link": profile.profileurl,
      "color": "#14578b",
      //"text": msg.filter(Boolean).join('\n'),
      "fallback": msg.filter(Boolean).join(' | ').replace(/[\*\_]/g, '')
    }]
  }

  out.attachments[0].fields = filter([{
    "title": "",
    "value": msg.filter(Boolean).join('\n')
  }, {
    "title": `${profile.recentlyPlayed ? profile.recentlyPlayed.slice(0, 3).length : ''} Most Recently Played Games (Last 2 weeks)`,
    "value": profile.recentlyPlayed ? profile.recentlyPlayed.map(g => ` - ${g.name} - ${getGameTime(g)}`).slice(0, 3).join('\n') : null
  }], 'value')
  return out
}

export function generateAppDetailsResponse(app, cc = 'US') {
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
}

export function generatePlayersResponse(app)  {
  return `There are currently *${formatNumber(app.player_count)}* people playing _${app.name}_ right now`
}

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
