import _ from 'lodash'
import CliTable from 'cli-table2'
import moment from 'moment'
import { getUserStats, getUserInfo, getHeroesPlaytime, getHero } from './utils/overwatch'
import { generateHeroesResp, generateHeroResp, generateInfoResp, generateStatsResp } from './utils/responseGenerators'
import { getOverallStandaings, getStandingsForStage, getLiveMatch } from './utils/owl'
import { tryGetUserAlias } from '../../database'
import { valuePadding as vp, diffFormater as df } from './utils/helpers'
import { parseInputAsArgs } from '../../utils'

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

const OWL_ARGS = {
  '--help': Boolean,
  '--stage': Number,
  '--year': Number,
  '--full': Boolean,
  '--compact': Boolean
}

export async function owl(user, channel, input) {
  const help = 'Usage: owl <command> [--full] [--compact] [--year] [--stage]'
  if (!input) return { type: 'dm', message: help }

  const {
    _: rawInput,
    '--stage': rawStage,
    '--year': rawYear,
    '--full': fullMode,
    '--compact': compactMode
  } = parseInputAsArgs(input, OWL_ARGS)

  const command = rawInput.join('\n')
  const year = rawYear && _.isNumber(rawYear) && rawYear.match(/\d{4}/) ? rawYear : undefined
  const stage = rawStage && _.isNumber(rawStage) ? rawStage : undefined

  if (stage > 4) {
    throw 'Stage cannot be greater than 4. Sorry.'
  }

  const opts = { year, stage, fullMode, compactMode }

  switch (command) {
    case 'standings':
    case 'scores':
    case 'score':
      return await _getStandings(opts)
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

function _getStandings(opts) {
  const fn = opts.stage ? _getStageStandings : _getOverallStandings
  return fn(opts)
}

async function _getStageStandings({ year, stage, compactMode, fullMode }) {
  const data = await getStandingsForStage(year, stage)

  if (!data) {
    return { type: 'channel', message: 'Error fetching data' }
  }

  const { data: rawStandings, stage_name, updated } = data
  const standingsTable = new CliTable({ head: [], style: { head: [], border: [] } })

  const standings = fullMode ? rawStandings : rawStandings.slice(0, 8)

  standingsTable.push([ 'Team', 'Wins', 'Losses', 'Win %', 'Map Wins' ])
  standingsTable.push(...standings.map(team => [
    { content: compactMode || fullMode ? team.shortName : team.name, hAlign: 'center' },
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
      !fullMode && 'Top 8 Teams',
      standingsTable.toString(),
      'Stage specific data lacks detailed statistics.',
      `Updated ${moment(updated).from(Date.now())}`,
      '```'
    ].filter(Boolean)
  }
}

async function _getOverallStandings({ year, fullMode, compactMode }) {
  const data = await getOverallStandaings(year)
  if (!data) {
    return { type: 'channel', message: 'Error fetching data' }
  }

  const { data: rawStandings, updated } = data
  const standingsTable = new CliTable({
    head: [],
    style: {
      head: [],
      border: []
    }
  })

  const standings = fullMode ? rawStandings : rawStandings.slice(0, 8)

  standingsTable.push([
    { content: '' },
    { content: 'Matches', colSpan: 2, hAlign: 'center' },
    { content: '' },
    { content: 'Maps', colSpan: 2, hAlign: 'center' },
    { content: '', hAlign: 'center' }
  ])
  standingsTable.push(['Team', 'Win - Loss', 'Win %', ' ', 'Win-Loss-Tie', 'Win %', 'Map +-'])
  standingsTable.push(...standings.map(team => [
    compactMode || fullMode ? team.shortName : team.name,
    { content: `${team.match_wins} - ${team.match_losses}`, hAlign: 'center' },
    `${team.match_win_percent}%`,
    ' ',
    { content: `${team.map_wins}-${team.map_losses}-${team.map_ties}`, hAlign: 'center' },
    `${team.map_win_percent}%`,
    { content: df(team.map_differential), hAlign: 'center' }
  ]))

  return {
    type: 'channel',
    messages: [
      '```',
      !fullMode && 'Top 8 Teams',
      standingsTable.toString(),
      'overwatchitemtracker.com/owl-standings/',
      `Updated ${moment(updated).from(Date.now())}`,
      '```'
    ].filter(Boolean)
  }
}
