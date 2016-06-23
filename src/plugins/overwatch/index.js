import Promise from 'bluebird'
import { getUserStats } from './utils/overwatch.js'
import _ from 'lodash'
import moment from 'moment'

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
  console.log(data.heroes)
  let out = {
    msg: `Overwatch Player Data for ${data.battletag}`,
    attachments: [{
      "fallback": `Overwatch Data for ${data.battletag}, level ${data.overall_stats.level}. Overall Stats: Wins: ${data.overall_stats.wins} | Losses ${data.overall_stats.losses} out of ${data.overall_stats.games} games`,
      "mrkdwn_in": ["text", "pretext", "fields"],
      "color": "#ff9c00"
    }]
  }
  out.attachments[0].fields = _.filter([{
    "title": "Region",
    "value": data.region.toUpperCase(),
    "short": true
  }, {
    "title": "Level",
    "value": `${data.overall_stats.rank || ''}${data.overall_stats.level}`,
    "short": true
  }, {
    "title": "Games Played",
    "value": data.overall_stats.games,
    "short": true
  }, {
    "title": "Wins / Losses",
    "value": `${data.overall_stats.wins} / ${data.overall_stats.losses}`,
    "short": true
  }, {
    "title": "Detailed Stats",
    "value": data.game_stats.map(stat => `*${_.capitalize(stat.name)}*: ${Math.round(stat.value * 100) / 100} ${stat.avg ? '- avg. ' + Math.round(stat.avg * 100) / 100 : ''}`).join('\n'),
    "short": true
  }, {
    "title": "Top 5 Heroes",
    "value": data.heroes ? data.heroes.map(hero => `*${_.capitalize(hero.name)}*: ${hero.hours < 1 ? Math.floor(moment.duration(hero.hours, 'hours').asMinutes()) + ' minutes' : Math.floor(hero.hours) + ' hours'}`).join('\n') : null,
    "short": true
  }], 'value')
  return out
}
