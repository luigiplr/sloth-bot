import { getUserStats, getUserInfo, getHeroesPlaytime, getHero } from './utils/overwatch.js'
import _ from 'lodash'
import { tryGetUserAlias } from '../../database'
import { getStandings, getLiveMatch } from './utils/owl'
const CliTable = require("cli-table")
import moment from 'moment'

export const plugin_info = [{
  alias: ['overwatch'],
  command: 'userInfo',
  usage: 'overwatch <battletag> <type> [hero] [version] [-r us] [-p pc]'
}, {
  alias: ['owl'],
  command: 'owl',
  usage: 'overwatch <what> - returns overwatch league stuff'
}]

const pageURL = 'https://playoverwatch.com/en-us/career'
const validHeroes = ["ana", "bastion", "dva", "doomfist", "genji", "hanzo", "junkrat", "lucio", "mccree", "mei", "mercy", "moira", "orisa", "pharah", "reaper", "reinhardt", "roadhog", "soldier76", "sombra", "symmetra", "torbjorn", "tracer", "widowmaker", "winston", "zarya", "zenyatta"]
const validTypes = ["info", "stats", "hero", "heroes"]
const validRegs = ["us", "eu", "kr"]
const validPlats = ["pc", "xbl", "psn"]

const usage = [
  "Usage: overwatch <battletag> <type> [hero|version] [version] [-r us] [-p pc]\nReturns various different types of Overwatch player data ```",
  "battletag - Users BattleTag e.g. Apples#1234 (case-sensitive) (required)",
  "type      - Type of stats, valid types are: 'info', 'stats', 'hero', 'heroes' (required)",
  "hero      - If hero type chosen, name of hero (required if hero type chosen)",
  "version   - Version of stats your after, 'quickplay' or 'competitive' (optional)",
  "-r region - Region of the user, defaults to 'us', valid regions are 'us', 'eu', 'kr' (optional)",
  "-p platfm - Platform of th user, defaults to 'pc', valid platforms are 'pc', 'xbl', 'psn' (optional)```"
]

export async function userInfo(user, channel, input) {
  if (!input) return ({ type: 'dm', messages: usage })

  const split = _.compact(input.split(' '))
  if (split.length < 1) return ({ type: 'dm', messages: usage })

  const userAlias = await tryGetUserAlias(split[0], 'overwatch')
  const battletag = (userAlias || split[0]).replace('#', '-')

  const type = split[1] || 'info'
  if (!validTypes.includes(type.toLowerCase())) {
    return ({ type: 'channel', message: `Invalid type, valid types are: ${validTypes.join(', ')}` })
  }

  const hero = split[2]
  if (type === 'hero' && (!hero || (hero && !validHeroes.includes(hero)))) {
    return ({ type: 'channel', message: `Invalid hero, valid heroes are: ${validHeroes.join(', ')}` })
  }

  const version = input.includes('quickplay') ? 'quickplay' : (input.includes('competitive') || input.includes('competetive')) ? 'competitive' : undefined

  const regionRegex = /-r (..)/g
  const platformRegex = /-p (...?)/g
  const region = (regionRegex.exec(input) || [])[1]
  const platform = (platformRegex.exec(input) || [])[1]

  if (region && !validRegs.includes(region.toLowerCase())) {
    return ({ type: 'channel', message: `Invalid region, valid regions are: ${validRegs.join(', ')}` })
  }

  if (platform && !validPlats.includes(platform.toLowerCase())) {
    return ({ type: 'channel', message: `Invalid platform, valid platforms are: ${validPlats.join(', ')}` })
  }

  let data
  switch (type) {
    case 'info':
      data = await getUserInfo(battletag, region, platform)
      if (!data) throw 'Error: No info returned?'
      return { type: 'channel', message: generateInfoResp(data) }
    case 'stats':
      data = await getUserStats(battletag, region, platform)
      if (!data) throw 'Error: No stats returned?'
      return { type: 'channel', 'message': generateStatsResp(data, version) }
    case 'hero':
      data = await getHero(battletag, region, platform, hero)
      if (!data) throw 'Error: No hero stats returned?'
      return { type: 'channel', message: generateHeroResp(data, version, battletag) }
    case 'heroes':
      data = await getHeroesPlaytime(battletag, region, platform)
      if (!data) throw 'Error: No heroes returned?'
      return { type: 'channel', message: generateHeroesResp(data, battletag) }
  }
}

const generateInfoResp = player => {
  player.region = player.platform === 'pc' ? player.region : 'n/a'
  var level = player.rank ? `${player.rank}${player.level < 10 ? '0' : ''}${player.level}` : player.level
  let out = {
    attachments: [{
      "title": player.battletag,
      "fallback": `Overwatch Info for ${player.battletag}, Region: ${player.region.toUpperCase()}, Platform: ${player.platform.toUpperCase()}, Level: ${player.rank || ''}${player.level}, Competitive Rank: ${player.comprank || 'None'}`,
      "color": "#ff9c00",
      "title_link": `${pageURL}/${player.platform}${player.platform === 'pc' ? '/' + player.region : ''}/${player.battletag}`,
      "thumb_url": player.avatar,
      "mrkdwn_in": ["text"],
      text: [
        `*Region*: ${player.region.toUpperCase()}`,
        `*Platform*: ${player.platform.toUpperCase()}`,
        `*Level*: ${level}`,
        `*Competitive Rank*: ${player.comprank || 'None'} (${player.compteir || 'N/A'})`
      ].join('\n')
    }]
  }
  return out
}

const generateHeroesResp = (heroes, battletag) => {
  if (!heroes.quickplay.length && !heroes.competitive.length) return `${battletag} has no hero stats`
  return {
    attachments: [{
      "color": "#ff9c00",
      "mrkdwn_in": ["fields"],
      "fields": _.filter([{
        "title": "Quickplay",
        "value": _.uniq(_.compact(heroes.quickplay.map(hero => hero.name.includes('.guid') ? null : `*${_.capitalize(hero.name)}*: ${hero.time === '0' ? '--' : hero.time}`))).join('\n'),
        short: true
      }, {
        "title": "Competitive",
        "value": heroes.competitive ? _.uniq(_.compact(heroes.competitive.map(hero => hero.name.includes('.guid') ? null : `*${_.capitalize(hero.name)}*: ${hero.time === '0' ? '--' : hero.time}`))).join('\n') : null,
        "short": true
      }], 'value')
    }]
  }
}

const getOverallStats = ({ losses, ties, wins, win_rate, games }, isHero) => {
  if (wins !== null && losses !== null) {
    return `${wins}/${losses}/${ties}` + (win_rate !== null ? ` (${win_rate * 100}%)` : '') + (isHero ? ` out of ${games} games` : '')
  }
  return wins !== null ? wins : "Unknown"
}

const generateStatsResp = (data, version = 'quickplay') => {
  data.stats = data.stats[version]
  if (data.stats.is_empty) return `I have no ${version} stats for this user`
  if (data && data.player && data.stats) {
    const { player, stats: { featured_stats, overall_stats, playtimes } } = data
    player.region = player.platform === 'pc' ? player.region.toUpperCase() : 'N/A'
    const level = player.rank ? `${player.rank}${player.level < 10 ? '0' : ''}${player.level}` : player.level
    const topHeroes = playtimes._.filter(h => h.time !== '0')
    const out = {
      attachments: [{
        "fallback": `Overwatch Stats for ${player.battletag}, Level: ${level}. Overall Stats: Wins: ${overall_stats.wins || 'N/A'} | Losses ${overall_stats.losses || 'N/A'} out of ${overall_stats.games || 'N/A'} games`,
        "mrkdwn_in": ["fields"],
        "color": "#ff9c00",
        "author_name": `${player.battletag} (${player.region}) (${_.capitalize(version)})`,
        "author_icon": player.avatar,
        "author_link": `${pageURL}/${player.platform}${player.platform === 'pc' ? '/' + player.region : ''}/${player.battletag}`
      }]
    }
    out.attachments[0].fields = [{
      "title": "Region / Platform",
      "value": `Region: ${player.region}\nPlatform: ${player.platform.toUpperCase()}`,
      "short": true
    }, {
      "title": "Level",
      "value": level,
      "short": true
    }, {
      "title": "Games Played",
      "value": overall_stats.games ? overall_stats.games : "Unknown",
      "short": true
    }, {
      "title": "Wins/Losses/Ties",
      "value": getOverallStats(overall_stats),
      "short": true
    }, {
      "title": `Top ${topHeroes.slice(0, 10).length} Heroes`,
      "value": topHeroes.map(hero => `*${_.capitalize(hero.name)}*: ${hero.time}`).slice(0, 10).join('\n'),
      "short": true
    }, {
      "title": "Detailed Stats",
      "value": featured_stats.length ? featured_stats.map(stat => `*${_.capitalize(stat.name.replace('spent ', ''))}*: ${stat.value} - avg. ${stat.avg}`).join('\n') : "Unknown",
      "short": true
    }]
    return out
  } else return 'Error parsing player data'
}

const generateHeroResp = (hero, version = 'quickplay', battletag) => {
  hero.stats = hero.stats[version]
  if (hero.stats.is_empty) return `I have no ${version} stats for this hero`
  if (hero.stats && hero.name) {
    const { stats: { general_stats, featured_stats, hero_stats, overall_stats } } = hero
    const out = {
      attachments: [{
        "fallback": `Overwatch Data for ${hero.name}`,
        "mrkdwn_in": ["text", "fields"],
        "color": "#ff9c00",
        "text": `Overwatch Hero Data for ${hero.name} - ${battletag} _(${_.capitalize(version)})_`
      }]
    }
    out.attachments[0].fields = [{
      "title": "Time Played",
      "value": general_stats.time_played ? general_stats.time_played : "Unknown",
      "short": true
    }, {
      "title": "Wins/Losses/Ties",
      "value": getOverallStats(overall_stats, true),
      "short": true
    }, {
      "title": "Detailed Stats",
      "value": featured_stats.length ? featured_stats.map(stat => `*${_.capitalize(stat.name)}*: ${stat.value} - avg. ${stat.avg}`).join('\n') : "Unknown",
      "short": true
    }, {
      "title": "Hero Specific Stats",
      "value": _.isEmpty(hero_stats) ? "Unknown" : Object.keys(hero_stats).map(stat => `*${_.capitalize(stat).replace(/_/g, ' ')}*: ${hero_stats[stat]}`).join('\n'),
      "short": true
    }]
    return out
  } else return 'Error parsing player data'
}

export async function owl(user, channel, input) {
  if (!input) return { type: 'dm', message: 'Usage: owl <what> - valid options include `standings`' }

  const [ type ] = input.split(' ')

  switch (type) {
    case 'standings':
    case 'scores':
    case 'score':
      return await generateStandingsResponse()
    case 'live':
    case 'live-match':
    case 'current-match':
      return await _getLiveMatch(channel)
    default:
      return { type: 'channel', message: 'Invalid option specified. Valid options include `standings`' }
  }
}

async function _getLiveMatch(channel) {
  try {
    await getLiveMatch(channel.id)
  } catch (e) {
    return { type: 'channel', message: 'Error fetching live stats' }
  }
}

async function generateStandingsResponse() {
  let data
  try {
    data = await getStandings()
  } catch (e) {
    return { type: 'channel', message: 'Error fetching data' }
  }

  const { data: standings, updated } = data
  const standingsTable = new CliTable({
    head: [ 'Team', 'Wins', 'Losses', 'Map Wins', 'Map Losses' ],
    colAligns: [ 'left', 'middle', 'middle', 'middle', 'middle' ],
    style: {
      head: [],
      border: []
    }
  })

  const tableData = standings.map(team => [
    team.name, team.match_wins, team.match_losses, team.map_wins, team.map_losses
  ])
  standingsTable.push(...tableData)

  return {
    type: 'channel',
    messages: [
      '```',
      standingsTable.toString(),
      `Updated ${moment(updated).from(Date.now())}`,
      '```'
    ]
  }
}
