import _ from 'lodash'
import CliTable from 'cli-table2'
import moment from 'moment'
import { getUserStats, getUserInfo, getHeroesPlaytime, getHero } from './utils/overwatch'
import { generateHeroesResp, generateHeroResp, generateInfoResp, generateStatsResp } from './utils/responseGenerators'
import { getOverallStandaings, getStandingsForStage, getLiveMatch } from './utils/owl'
import { tryGetUserAlias } from '../../database'
import { valuePadding as vp, diffFormater as df } from './utils/helpers'

export const plugin_info = [{
  alias: ['overwatch'],
  command: 'userInfo',
  usage: 'overwatch <battletag> <type> [hero] [version] [-r us] [-p pc]'
}, {
  alias: ['owl'],
  command: 'owl',
  usage: 'overwatch <what> - returns overwatch league stuff'
}]

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

export async function owl(user, channel, input) {
  const help = 'Usage: owl <command> [year] [stage] - valid options include `scores`, `live`'
  if (!input) return { type: 'dm', message: help }

  const [ type, rawYear, rawStage ] = input.split(' ')

  const year = rawYear && rawYear.match(/\d{4}/) ? rawYear : undefined
  const stage = rawStage && _.isNumber(rawStage) ? rawStage : rawYear && !year && _.isNumber(rawYear) ? rawYear : undefined

  switch (type) {
    case 'standings':
    case 'scores':
    case 'score':
      return await _getStandings(year, stage)
    case 'live':
    case 'live-match':
    case 'current-match':
      return await _getLiveMatch(channel)
    default:
      return { type: 'channel', message: help }
  }
}

const loadCache = {}
async function _getLiveMatch(channel) {
  if (loadCache[channel.id]) {
    return { type: 'channel', message: 'Already loading data!' }
  }

  loadCache[channel.id] = true
  try {
    await getLiveMatch(channel.id)
    loadCache[channel.id] = false
  } catch (e) {
    console.error(e)
    loadCache[channel.id] = false
    return { type: 'channel', message: 'Error fetching live stats! Are we live?' }
  }
}

function _getStandings(year, stage) {
  const fn = stage ? _getStageStandings : _getOverallStandings
  return fn(year, stage)
}

async function _getStageStandings(year, stage) {
  const data = await getStandingsForStage(year, stage)

  if (!data) {
    return { type: 'channel', message: 'Error fetching data' }
  }

  const { data: standings, stage_name, updated } = data
  const standingsTable = new CliTable({ head: [], style: { head: [], border: [] } })

  standingsTable.push([ 'Team', 'Wins', 'Losses', 'Win %', 'Map Wins' ])
  standingsTable.push(...standings.map(team => [
    { content: team.name, hAlign: 'center' },
    { content: team.match_wins, hAlign: 'center' },
    { content: team.match_losses, hAlign: 'center' },
    { content: `${(team.match_win_percent * 100).toFixed(2)}%`, hAlign: 'center' },
    { content: team.map_wins, hAlign: 'center' }
  ]))

  return {
    type: 'channel',
    messages: [
      `*Standings for ${stage_name}*`,
      '```',
      standingsTable.toString(),
      'Stage specific data lacks detailed statistics.',
      `Updated ${moment(updated).from(Date.now())}`,
      '```'
    ]
  }
}

async function _getOverallStandings(year) {
  const data = await getOverallStandaings(year)
  if (!data) {
    return { type: 'channel', message: 'Error fetching data' }
  }

  const { data: standings, updated } = data
  const standingsTable = new CliTable({
    head: [],
    style: {
      head: [],
      border: []
    }
  })

  standingsTable.push([
    { content: '' },
    { content: 'Matches', colSpan: 2, hAlign: 'center' },
    { content: '' },
    { content: 'Maps', colSpan: 2, hAlign: 'center' },
    { content: '', hAlign: 'center' }
  ])
  standingsTable.push(['Team', 'Win - Loss', 'Win %', ' ', 'Win-Loss-Tie', 'Win %', 'Map +-'])
  standingsTable.push(...standings.map(team => [
    team.name,
    { content: `${vp(team.match_wins, 2)} - ${vp(team.match_losses, 2)}`, hAlign: 'center' },
    `${vp((team.match_win_percent * 100).toFixed(1), 4) + '%'}`,
    ' ',
    { content: `${vp(team.map_wins, 2)}-${vp(team.map_losses, 2)}-${team.map_ties}`, hAlign: 'center' },
    `${vp((team.map_win_percent * 100).toFixed(2), 5) + '%'}`,
    { content: df(team.map_differential), hAlign: 'center' }
  ]))

  return {
    type: 'channel',
    messages: [
      '```',
      standingsTable.toString(),
      'overwatchitemtracker.com/owl-standings/',
      `Updated ${moment(updated).from(Date.now())}`,
      '```'
    ]
  }
}
