import _ from 'lodash'
import { getOverallStats } from './overwatch.js'

const pageURL = 'https://playoverwatch.com/en-us/career'
export const generateInfoResp = player => {
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

export const generateHeroesResp = (heroes, battletag) => {
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

export const generateStatsResp = (data, version = 'quickplay') => {
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

export const generateHeroResp = (hero, version = 'quickplay', battletag) => {
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
