import { getProfileInfo, getAppInfo, getSteamIDInfo } from './utils/steam'
import { generatePlayersResponse, generateProfileResponse, generateAppDetailsResponse } from './utils/util.js'
import { getNextSale, getSaleTime } from './utils/sales'
import moment from 'moment'

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
      const saleDate = moment(sale.date)
      const isActive = saleDate.isBefore(currentTime)
      const time = getSaleTime(moment.duration((isActive ? moment(sale.enddate) : saleDate).diff(currentTime)))
      const msg = `The Steam ${sale.name} ${isActive ? 'is here! It ends' : 'starts'} ${time}${sale.confirmed ? '' : ', I think.'}`
      return resolve({ type: 'channel', message: msg })
    }).catch(reject)
  })
}

