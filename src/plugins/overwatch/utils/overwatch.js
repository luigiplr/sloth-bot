import Promise from 'bluebird'
import needle from 'needle'

const apiUrl = 'https://owapi.net/api/v1/u'

const endpoints = {
  stats: `${apiUrl}/%u/stats`, // returns basic stats for user
  heroes: `${apiUrl}/%u/heroes`, // returns top 5 played heroes
  hero: `${apiUrl}/%u/hero/%h`
}

const getURL = (type, user, hero) => {
  let out = endpoints[type].replace('%u', user)
  return (hero ? out.replace('%h', hero) : out)
}

export function getUserStats(user, heroes) {
  return new Promise((resolve, reject) => needle.get(getURL('stats', user), (err, resp, body) => {
    if (!err && body && !body.error) {
      if (heroes) {
        getTopHeroes(user).then(heroes => {
          body.heroes = heroes
          return resolve(body)
        }).catch(() => { resolve(body) })
      } else return resolve(body)
    } else {
      return reject((body && body.error === 404) ? 'Profile not found' : `getUserStatsErr: ${err || body.error}`)
    }
  }))
}

export function getTopHeroes(user) {
  return new Promise((resolve, reject) => needle.get(getURL('heroes', user), (err, resp, body) => {
    if (!err && body && !body.error) {
      return resolve(body.heroes)
    } else {
      return reject((body && body.error === 404) ? 'Profile not found' : `getTopHeroesErr: ${err || body.error}`)
    }
  }))
}
