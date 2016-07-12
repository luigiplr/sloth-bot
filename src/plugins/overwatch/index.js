import Promise from 'bluebird'
import { getUserStats } from './utils/overwatch.js'
import _ from 'lodash'

export const plugin_info = [{
  alias: ['overwatch'],
  command: 'userInfo',
  usage: 'overwatch <battletag> - returns some overwatch game data'
}]

export function userInfo(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: overwatch <battletag> - Returns an Overwatch players profile, Battletag is your Username#ID' })

    getUserStats(input.replace('#', '-'), true).then(data => {
      return resolve({ type: channel, message: generateUserStatsResponse(data) })
    }).catch(reject)
  })
}

const generateUserStatsResponse = data => {
  // Only returns quickplay stats
  data.stats = data.stats.quickplay
  data.heroes = data.heroes.quickplay
  if (data && data.player && data.stats && data.heroes) {
    let out = {
      msg: `Overwatch Player Data for ${data.player.battletag} _(QuickPlay)_`,
      attachments: [{
        "fallback": `Overwatch Data for ${data.player.battletag}, level ${data.player.level}. Overall Stats: Wins: ${data.stats.overall_stats.wins} | Losses ${data.stats.overall_stats.losses} out of ${data.stats.overall_stats.games} games`,
        "mrkdwn_in": ["text", "pretext", "fields"],
        "color": "#ff9c00"
      }]
    }
    out.attachments[0].fields = _.filter([{
      "title": "Region",
      "value": data.player.region.toUpperCase(),
      "short": true
    }, {
      "title": "Level",
      "value": `${data.player.rank || ''}${data.player.level}`,
      "short": true
    }, {
      "title": "Games Played",
      "value": data.stats.overall_stats.games,
      "short": true
    }, {
      "title": "Wins / Losses",
      "value": `${data.stats.overall_stats.wins} / ${data.stats.overall_stats.losses}`,
      "short": true
    }, {
      "title": "Top 10 Heroes",
      "value": data.heroes ? data.heroes.map(hero => `*${_.capitalize(hero.name)}*: ${hero.time}`).slice(0, 10).join('\n') : null,
      "short": true
    }, {
      "title": "Detailed Stats",
      "value": data.stats.featured_stats.map(stat => `*${_.capitalize(stat.name.replace('spent ', ''))}*: ${stat.value} - avg. ${stat.avg}`).join('\n'),
      "short": true
    }], 'value')
    return out
  } else return 'Error parsing player data'
}
