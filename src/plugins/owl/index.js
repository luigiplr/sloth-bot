import _ from 'lodash'
import CliTable from 'cli-table2'
import moment from 'moment'
import { getStandings, getPlayer, getLiveMatch } from './utils/owl'
import { diffFormater as df } from './utils/helpers'
import { parseInputAsArgs } from '../../utils'

export const plugin_info = [{
  alias: ['owl'],
  command: 'owl',
  usage: 'owl <mode> - returns overwatch league stuff'
}]

const OWL_ARGS = {
  '--help': Boolean,
  '--stage': Number,
  '--year': Number,
  '--full': Boolean,
  '--compact': Boolean
}

export async function owl(user, channel, input) {
  const halp = 'Usage: owl <command> [...args] [--full] [--compact] [--year] [--stage]'
  if (!input) return { type: 'dm', message: halp }

  const {
    _: rawInput,
    '--stage': rawStage,
    '--year': rawYear,
    '--full': fullMode,
    '--compact': compactMode
  } = parseInputAsArgs(input, OWL_ARGS)

  const command = rawInput[0]
  const year = rawYear && _.isNumber(rawYear) && rawYear.toString().match(/^\d{4}$/) ? rawYear : undefined
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
    case 'player':
      return await _getPlayer(rawInput.slice(1).join(' '))
    default:
      return { type: 'channel', message: halp }
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

async function _getStandings({ year, stage, fullMode, compactMode }) {
  const data = await getStandings(year, stage)
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

async function _getPlayer(input) {
  const data = await getPlayer(input)

  console.log(input, data)

  if (!data || data.length === 0) {
    return { type: 'channel', message: "Couldn't find any players matching input" }
  }

  if (data.length > 1) {
    return {
      type: 'channel',
      message: [
        'Found multiple players matching input',
        '```',
        data.slice(0, 8).map(player => (
          ` * ${player.name} - ${player.teams.map(x => x.team.name).join(', ')}`
        )).join('\n'),
        '```'
      ].join('\n')
    }
  }

  const player = data[0]
  return {
    type: 'channel',
    message: {
      attachments: [{
        title: `Player Info for (${player.attributes.player_number}) ${player.name}`,
        title_link: `https://overwatchleague.com/en-us/players/${player.id}`,
        color: _.get(player, ['teams', 0, 'team', 'primaryColor']),
        fields: [{
          title: 'Full Name',
          value: `${player.givenName} ${player.familyName}`,
          short: true
        }, {
          title: player.teams.length === 1 ? 'Team' : 'Teams',
          value: player.teams.map(x => x.team.name).join(', '),
          short: true
        }, {
          title: 'Role',
          value: player.attributes.role ? _.capitalize(player.attributes.role) : 'Unknown',
          short: true
        }, {
          title: 'Heroes',
          value: player.attributes.heroes.length > 0 ? player.attributes.heroes.map(x => _.capitalize(x)).join(', ') : 'Unknown',
          short: true
        }, {
          title: 'Hometown',
          value: `:flag-${player.nationality.toLowerCase()}: ${player.nationality} | ${player.homeLocation}`,
          short: true
        }],
        footer: `ID: ${player.id} | Handle: ${player.handle}`
      }]
    }
  }
}
