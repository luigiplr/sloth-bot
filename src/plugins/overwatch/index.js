import _ from 'lodash'
import { getUserStats, getUserInfo, getHeroesPlaytime, getHero } from './utils/overwatch'
import { generateHeroesResp, generateHeroResp, generateInfoResp, generateStatsResp } from './utils/responseGenerators'
import { tryGetUserAlias } from '../../database'

export const plugin_info = [{
  alias: ['overwatch'],
  command: 'userInfo',
  usage: 'overwatch <battletag> <type> [hero] [version] [-r us] [-p pc]'
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
