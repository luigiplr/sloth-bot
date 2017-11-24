import { getProfileInfo, getAppInfo, getSteamIDInfo, getUserWishlist, getGamesForUser } from './utils/steam'
import { generatePlayersResponse, generateProfileResponse, generateAppDetailsResponse } from './utils/util.js'
import { getNextSale, getSaleTime } from './utils/sales'
import { getUserAliases } from '../../database'
import moment from 'moment'
import _ from 'lodash'
import pad from 'pad-left' // lmao

export const plugin_info = [{
  alias: ['sp', 'steamprofile'],
  command: 'steamProfile',
  usage: 'steamprofile <steamid/vanityid> - returns user steam profile'
}, {
  alias: ['players'],
  command: 'players',
  usage: 'players <appid> - returns players for steam app'
}, {
  alias: ['game', 'app'],
  command: 'game',
  usage: 'game <appid or game name> - returns steam game info'
}, {
  alias: ['sid', 'steamid'],
  command: 'steamid',
  usage: 'steamid <steamid> - returns steamid info'
}, {
  alias: ['steamsale'],
  command: 'steamSale',
  usage: 'steamsale - tells u wen da sale is, durh'
}, {
  alias: ['wishlist'],
  command: 'wishlist',
  usage: 'wishlist <steamid/vanityid> - returns a users wishlist'
}, {
  alias: ['doiown', 'dio'],
  command: 'doIOwn',
  usage: 'doiown <game|appid> - checks if you own a steam game'
}]

export function steamProfile(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: steamprofile <SteamID/64 or VanityURL ID> - Returns a users basic Steam Information' })

    getProfileInfo(input).then(resp => resolve({ type: 'channel', message: generateProfileResponse(resp) })).catch(reject)
  })
}

export function players(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: players <appid> - Returns the current amount of players for the game' })

    getAppInfo(input, null, true).then(resp => resolve({ type: 'channel', message: generatePlayersResponse(resp) })).catch(reject)
  })
}

export function game(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: game <appid or game name> [-cc us] - Returns basic game info such as price and name, optinally include the country code via -cc AU' })
    if (input.match(/-cc.../)) {
      var cc = input.match(/-cc.../)[0].split(' ')[1]
      input = input.replace(input.match(/-cc.../)[0], '').trim()
    }
    getAppInfo(input, cc).then(resp => resolve({ type: 'channel', message: generateAppDetailsResponse(resp, cc) })).catch(reject)
  })
}

export function steamid(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: steamid <id> - ID can be any form of SteamID' })

    getSteamIDInfo(input).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
  })
}

export function steamSale() {
  return new Promise((resolve, reject) => {
    getNextSale().then(sale => {
      const currentTime = moment()
      const saleDate = moment.utc(sale.StartDate)
      const isActive = saleDate.isBefore(currentTime)
      const time = getSaleTime(moment.duration((isActive ? moment.utc(sale.EndDate) : saleDate).diff(currentTime)))
      const msg = `The Steam ${sale.Name} ${isActive ? 'is here! It ends' : 'starts'} ${time}${sale.IsConfirmed ? '' : ', I think.'}`
      return resolve({ type: 'channel', message: msg })
    }).catch(reject)
  })
}

export function wishlist(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: wishlist <steamid/vanityid> - Returns top 10 games in users wishlist, id can be any form of SteamID' })

    getUserWishlist(input).then((resp = []) => {
      const games = resp.slice(0, 10)
      const msg = [
        `*Top ${games.length} games in wishlist for ${input}*`,
        '```',
        ...games.map(({ name, id, index }) => ` ${index < 10 ? ' ' : ''}${index}. ${pad('[' + id + ']', 8, ' ')} ${name}`),
        '```',
        resp.length > 10 ? `_Plus ${resp.length - 10} more games not shown_` : void 0
      ].filter(Boolean).join('\n')

      return resolve({ type: 'channel', message: msg })
    }).catch(reject)
  })
}

export async function doIOwn(user, channel, input) {
  if (!input) return 'Specify a game or appid pls'

  let userAlias
  try {
    userAlias = await getUserAliases(user.id, 'steam', true)
  } catch (e) {
    throw 'You must set an alias for steam before you can use this command. Use the `alias` command to set an alias.'
  }

  try {
    const [ games, appinfo ] = await Promise.all([getGamesForUser(userAlias), getAppInfo(input)])

    if (!appinfo) throw `Where's the app??!`
    if (!games || !games.games || games.games.length === 0) throw 'You have no games??!'

    const match = _.find(games.games, { appid: appinfo.steam_appid })
    if (match) {
      return { type: 'channel', message: `Success! Looks like you do own *${appinfo.name}* _(${appinfo.steam_appid})_ in your Steam library!` }
    } else {
      return { type: 'channel', message: `Hmm, doesn't look like you own *${appinfo.name}* _(${appinfo.steam_appid})_` }
    }
  } catch (e) {
    console.error(e)
    return { type: 'channel', message: typeof e === 'string' ? e : 'Something went wrong' }
  }
}
