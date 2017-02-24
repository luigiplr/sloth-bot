import { getUserStats, getUserInfo, getHeroesPlaytime, getHero } from './utils/overwatch.js'
import { filter, capitalize, isEmpty, uniq, compact } from 'lodash'

export const plugin_info = [{
  alias: ['overwatch'],
  command: 'userInfo',
  usage: 'overwatch <battletag> <type> [hero] [version] [-r us] [-p pc]'
}]

const pageURL = 'https://playoverwatch.com/en-us/career'
const validHeroes = ["ana", "bastion", "dva", "genji", "hanzo", "junkrat", "lucio", "mccree", "mei", "mercy", "pharah", "reaper", "reinhardt", "roadhog", "soldier76", "sombra", "symmetra", "torbjorn", "tracer", "widowmaker", "winston", "zarya", "zenyatta"]
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

export function userInfo(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', messages: usage })

    const split = input.split(' ')
    if (split.length < 1) return resolve({ type: 'dm', messages: usage })

    const battletag = split[0].replace('#', '-')
    const type = split[1] || 'info'
    if (!validTypes.includes(type.toLowerCase())) return reject("Invalid type, valid types are " + validTypes.join(', '))

    const hero = split[2]
    if (type == 'hero' && (!hero || (hero && !validHeroes.includes(hero)))) return reject("Invalid hero, valid heroes are: " + validHeroes.join(', '))

    const version = input.includes('quickplay') ? 'quickplay' : (input.includes('competitive') || input.includes('competetive')) ? 'competitive' : undefined

    const regionRegex = /-r (..)/g
    const platformRegex = /-p (...?)/g
    const region = (regionRegex.exec(input) || [])[1]
    const platform = (platformRegex.exec(input) || [])[1]
    if (region && !validRegs.includes(region.toLowerCase())) return reject("Invalid region, valid regions are " + validRegs.join(', '))
    if (platform && !validPlats.includes(platform.toLowerCase())) return reject("Invalid platform, valid platforms are " + validPlats.join(', '))

    switch (type) {
      case 'info':
        getUserInfo(battletag, region, platform).then(info => {
          if (!info) return reject("Error: No info returned?")
          return resolve({ type: 'channel', message: generateInfoResp(info) })
        }).catch(reject)
        break;
      case 'stats':
        getUserStats(battletag, region, platform).then(stats => {
          if (!stats) return reject("Error: No stats returned?")
          return resolve({ type: 'channel', 'message': generateStatsResp(stats, version) })
        }).catch(reject)
        break;
      case 'hero':
        getHero(battletag, region, platform, hero).then(stats => {
          if (!stats) return reject("Error: No hero stats returned?")
          return resolve({ type: 'channel', message: generateHeroResp(stats, version, battletag) })
        }).catch(reject)
        break;
      case 'heroes':
        getHeroesPlaytime(battletag, region, platform).then(heroes => {
          if (!heroes) return reject("Error: No heroes returned?")
          return resolve({ type: 'channel', message: generateHeroesResp(heroes, battletag) })
        }).catch(reject)
        break;
    }
  })
}

const generateInfoResp = player => {
  player.region = player.platform == 'pc' ? player.region : 'n/a'
  var level = player.rank ? `${player.rank}${player.level < 10 ? '0' : ''}${player.level}` : player.level
  let out = {
    attachments: [{
      "title": player.battletag,
      "fallback": `Overwatch Info for ${player.battletag}, Region: ${player.region.toUpperCase()}, Platform: ${player.platform.toUpperCase()}, Level: ${player.rank || ''}${player.level}, Competitive Rank: ${player.comprank || 'None'}`,
      "color": "#ff9c00",
      "title_link": `${pageURL}/${player.platform}${player.platform == 'pc' ? '/' + player.region : ''}/${player.battletag}`,
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
      "fields": filter([{
        "title": "Quickplay",
        "value": uniq(compact(heroes.quickplay.map(hero => hero.name.includes('.guid') ? null : `*${capitalize(hero.name)}*: ${hero.time == '0' ? '--' : hero.time}`))).join('\n'),
        short: true
      }, {
        "title": "Competitive",
        "value": heroes.competitive ? uniq(compact(heroes.competitive.map(hero => hero.name.includes('.guid') ? null : `*${capitalize(hero.name)}*: ${hero.time == '0' ? '--' : hero.time}`))).join('\n') : null,
        "short": true
      }], 'value')
    }]
  }
}

const generateStatsResp = (data, version = 'quickplay') => {
  data.stats = data.stats[version]
  if (version == 'competitive' && data.stats.is_empty) return `I have no competitive stats for this user`
  if (data && data.player && data.stats) {
    const { player, stats } = data
    player.region = player.platform == 'pc' ? player.region : 'n/a'
    const level = player.rank ? `${player.rank}${player.level < 10 ? '0' : ''}${player.level}` : player.level
    const topHeroes = stats.playtimes.filter(h => h.time != '0')
    const out = {
      attachments: [{
        "fallback": `Overwatch Stats for ${player.battletag}, Level: ${level}. Overall Stats: Wins: ${stats.overall_stats.wins || 'N/A'} | Losses ${stats.overall_stats.losses || 'N/A'} out of ${stats.overall_stats.games || 'N/A'} games`,
        "mrkdwn_in": ["fields"],
        "color": "#ff9c00",
        "author_name": `${player.battletag} (${player.region.toUpperCase()}) (${capitalize(version)})`,
        "author_icon": player.avatar,
        "author_link": `${pageURL}/${player.platform}${player.platform == 'pc' ? '/' + player.region : ''}/${player.battletag}`
      }]
    }
    out.attachments[0].fields = [{
      "title": "Region / Platform",
      "value": `Region: ${player.region.toUpperCase()}\nPlatform: ${player.platform.toUpperCase()}`,
      "short": true
    }, {
      "title": "Level",
      "value": level,
      "short": true
    }, {
      "title": "Games Played",
      "value": stats.overall_stats.games ? stats.overall_stats.games : "Unknown",
      "short": true
    }, {
      "title": "Wins / Losses",
      "value": stats.overall_stats.wins && stats.overall_stats.losses ? `${stats.overall_stats.wins} / ${stats.overall_stats.losses} ${stats.overall_stats.win_rate ? '(' + stats.overall_stats.win_rate * 100 + '%)' : ''}` : stats.overall_stats.wins || "Unknown",
      "short": true
    }, {
      "title": `Top ${topHeroes.slice(0, 10).length} Heroes`,
      "value": topHeroes.map(hero => `*${capitalize(hero.name)}*: ${hero.time}`).slice(0, 10).join('\n'),
      "short": true
    }, {
      "title": "Detailed Stats",
      "value": stats.featured_stats.length ? stats.featured_stats.map(stat => `*${capitalize(stat.name.replace('spent ', ''))}*: ${stat.value} - avg. ${stat.avg}`).join('\n') : "Unknown",
      "short": true
    }]
    return out
  } else return 'Error parsing player data'
}

const generateHeroResp = (hero, version = 'quickplay', battletag) => {
  hero.stats = hero.stats[version]
  if (version == 'competitive' && hero.stats.is_empty) return `I have no competitive stats for this hero`
  if (hero.stats && hero.name) {
    const { stats } = hero
    const out = {
      attachments: [{
        "fallback": `Overwatch Data for ${hero.name}`,
        "mrkdwn_in": ["text", "fields"],
        "color": "#ff9c00",
        "text": `Overwatch Hero Data for ${hero.name} - ${battletag} _(${capitalize(version)})_`,
      }]
    }
    out.attachments[0].fields = [{
      "title": "Time Played",
      "value": stats.general_stats.time_played ? stats.general_stats.time_played : "Unknown",
      "short": true
    }, {
      "title": "Wins / Losses",
      "value": stats.overall_stats.wins && stats.overall_stats.losses ? `${stats.overall_stats.wins} / ${stats.overall_stats.losses} ${stats.overall_stats.win_rate ? '(' + stats.overall_stats.win_rate * 100 + '%)' : ''} ${stats.overall_stats.games ? 'out of ' + stats.overall_stats.games + ' games': ''}` : stats.overall_stats.wins || "Unknown",
      "short": true
    }, {
      "title": "Detailed Stats",
      "value": stats.featured_stats.length ? stats.featured_stats.map(stat => `*${capitalize(stat.name)}*: ${stat.value} - avg. ${stat.avg}`).join('\n') : "Unknown",
      "short": true
    }, {
      "title": "Hero Specific Stats",
      "value": isEmpty(stats.hero_stats) ? "Unknown" : Object.keys(stats.hero_stats).map(stat => `*${capitalize(stat).replace(/_/g, ' ')}*: ${stats.hero_stats[stat]}`).join('\n'),
      "short": true
    }]
    return out
  } else return 'Error parsing player data'
}
