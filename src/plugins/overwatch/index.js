import Promise from 'bluebird'
import { getUserStats, getHero } from './utils/overwatch.js'
import { filter, capitalize, isEmpty } from 'lodash'

export const plugin_info = [{
  alias: ['overwatch'],
  command: 'userInfo',
  usage: 'overwatch <battletag> [hero] - Returns user overall or hero statistics'
}]

const validHeroes = ["ana", "bastion", "dva", "genji", "hanzo", "junkrat", "lucio", "mccree", "mei", "mercy", "pharah", "reaper", "reinhardt", "roadhog", "soldier76", "symmetra", "torbjorn", "tracer", "widowmaker", "winston", "zarya", "zenyatta"]

export function userInfo(user, channel, input) {
  return new Promise((resolve, reject) => {
    let battletag = input.split(' ')[0]
    if (!battletag) return resolve({ type: 'dm', message: 'Usage: overwatch <battletag> [hero] - Returns an Overwatch players profile or hero details, Battletag is your Username#ID' })
    if (input.split(' ')[1]) {
      let name = input.split(' ')[1]
      if (validHeroes.includes(name)) {
        getHero(battletag, name, true).then(data => {
          return resolve({ type: channel, message: generateHeroResponse(data) })
        }).catch(reject)
      } else return reject(`Invalid hero name, valid heroes are \`${validHeroes.join(', ')}\``)
    } else {
      getUserStats(battletag.replace('#', '-'), true).then(data => {
        return resolve({ type: channel, message: generateUserStatsResponse(data) })
      }).catch(reject)
    }
  })
}

const generateUserStatsResponse = data => {
  // Only returns quickplay stats
  data.stats = data.stats.quickplay
  data.heroes = data.heroes.quickplay
  if (data && data.player && data.stats && data.heroes) {
    let { player, stats, heroes } = data
    let out = {
      msg: `Overwatch Player Data for ${player.battletag.replace('-', '#')} _(QuickPlay)_`,
      attachments: [{
        "fallback": `Overwatch Data for ${player.battletag.replace('-', '#')}, level ${player.rank || ''}${player.level}. Overall Stats: Wins: ${stats.overall_stats.wins || 'N/A'} | Losses ${stats.overall_stats.losses || 'N/A'} out of ${stats.overall_stats.games || 'N/A'} games`,
        "mrkdwn_in": ["text", "pretext", "fields"],
        "color": "#ff9c00",
        "author_name": `${player.battletag.replace('-', '#')} (${player.region.toUpperCase()})`,
        "author_icon": player.avatar,
        "author_link": `https://playoverwatch.com/en-us/career/pc/${player.region}/${player.battletag}`
      }]
    }
    out.attachments[0].fields = filter([{
      "title": "Region",
      "value": player.region.toUpperCase(),
      "short": true
    }, {
      "title": "Level",
      "value": `${player.rank || ''}${player.level}`,
      "short": true
    }, {
      "title": "Games Played",
      "value": stats.overall_stats.games ? stats.overall_stats.games : null,
      "short": true
    }, {
      "title": "Wins / Losses",
      "value": stats.overall_stats.wins && stats.overall_stats.losses ? `${stats.overall_stats.wins} / ${stats.overall_stats.losses} ${stats.overall_stats.win_rate ? '(' + stats.overall_stats.win_rate + '%)' : ''}` : null,
      "short": true
    }, {
      "title": `Top ${heroes.slice(0, 10).length} Heroes`,
      "value": heroes ? heroes.map(hero => `*${capitalize(hero.name)}*: ${hero.time}`).slice(0, 10).join('\n') : null,
      "short": true
    }, {
      "title": "Detailed Stats",
      "value": stats.featured_stats.length ? stats.featured_stats.map(stat => `*${capitalize(stat.name.replace('spent ', ''))}*: ${stat.value} - avg. ${stat.avg}`).join('\n') : null,
      "short": true
    }], 'value')
    return out
  } else return 'Error parsing player data'
}

const generateHeroResponse = data => {
  // Only returns quickplay stats
  let player = data.player
  let stats = data.quickplay
  if (player && stats && data.name) {
    let out = {
      msg: `Overwatch Hero Data for ${data.name} - ${player.battletag.replace('-', '#')} _(QuickPlay)_`,
      attachments: [{
        "fallback": `Overwatch Data for ${data.name}`,
        "mrkdwn_in": ["text", "pretext", "fields"],
        "color": "#ff9c00",
        "author_name": `${player.battletag.replace('-', '#')} (${player.region.toUpperCase()})`,
        "author_icon": player.avatar,
        "author_link": `https://playoverwatch.com/en-us/career/pc/${player.region}/${player.battletag}`
      }]
    }
    out.attachments[0].fields = filter([{
      "title": "Time Played",
      "value": stats.general_stats.time_played ? stats.general_stats.time_played : null,
      "short": true
    }, {
      "title": "Wins / Losses",
      "value": stats.overall_stats.wins && stats.overall_stats.losses ? `${stats.overall_stats.wins} / ${stats.overall_stats.losses} ${stats.overall_stats.win_rate ? '(' + stats.overall_stats.win_rate + '%)' : ''} ${stats.overall_stats.games ? 'out of ' + stats.overall_stats.games + ' games': ''}` : null,
      "short": true
    }, {
      "title": "Detailed Stats",
      "value": stats.featured_stats.length ? stats.featured_stats.map(stat => `*${capitalize(stat.name)}*: ${stat.value} - avg. ${stat.avg}`).join('\n') : null,
      "short": true
    }, {
      "title": "Hero Specific Stats",
      "value": isEmpty(stats.hero_stats) ? null : Object.keys(stats.hero_stats).map(stat => `*${capitalize(stat).replace(/_/g, ' ')}*: ${stats.hero_stats[stat]}`).join('\n'),
      "short": true
    }], 'value')
    return out
  } else return 'Error parsing player data'
}
