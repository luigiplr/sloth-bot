import Promise from 'bluebird'
import needle from 'needle'
import {get } from 'lodash'

const apiUrl = 'https://owapi-1368.appspot.com/api/u'

const endpoints = {
  info: `${apiUrl}/%u/`, // returns basic user info
  stats: `${apiUrl}/%u/stats/`, // returns basic stats for user
  heroes: `${apiUrl}/%u/heroes/`,
  hero: `${apiUrl}/%u/hero/%h/`
}

const getURL = (type, user, region = 'us', platform = 'pc', hero) => {
  let out = endpoints[type].replace('%u', user)
  return (hero ? out.replace('%h', hero) : out) + `?region=${region}&platform=${platform}`
}

export function getUserInfo(user, region, platform) {
  return new Promise((resolve, reject) => needle.get(getURL('info', user, region, platform), (err, resp, body) => {
    if (!err && body) {
      if (body.ok) return resolve(get(body, 'data.player'))
      else return reject(`Error: ${body.error || ''} ${body.message || ''}`)
    } else return reject(`getUserInfoErr: ${err}`)
  }))
}

export function getUserStats(user, region, platform, getHeroes) {
  return new Promise((resolve, reject) => needle.get(getURL('stats', user, region, platform), (err, resp, body) => {
    if (!err && body) {
      if (!body.ok) return reject(`Error: ${body.error || ''} ${body.message || ''}`)
      if (getHeroes) {
        getHeroesPlaytime(user, region, platform).then(heroes => {
          body.data.heroes = heroes
          return resolve(body.data)
        }).catch(reject)
      } else return resolve(body.data)
    } else return reject(`getUserStatsErr: ${err}`)
  }))
}

export function getHeroesPlaytime(user, region, platform) {
  return new Promise((resolve, reject) => needle.get(getURL('heroes', user, region, platform), (err, resp, body) => {
    if (!err && body) {
      if (!body.ok) return reject(`Error: ${body.error || ''} ${body.message || ''}`)
      return resolve(body.data)
    } else return reject(`getTopHeroesErr: ${err}`)
  }))
}

export function getHero(user, region, platform, hero) {
  return new Promise((resolve, reject) => needle.get(getURL('hero', user, region, platform, hero), (err, resp, body) => {
    if (!err && body) {
      if (!body.ok) return reject(`Error: ${body.error || ''} ${body.message || ''}`)
      return resolve(body.data)
    } else return reject(`getHeroErr: ${err}`)
  }))
}
