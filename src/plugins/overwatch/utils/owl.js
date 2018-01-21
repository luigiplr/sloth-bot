const _ = require('lodash')
const moment = require('moment')
const needle = require('needle')
require('./definitions')

const MATCH_STATE = {
  'PENDING': 'PENDING',
  'CONCLUDED': 'CONCLUDED',
  'CONCLUDED_FORFEIT': 'CONCLUDED_FORFEIT',
  'CONCLUDED_DISQUALIFIED': 'CONCLUDED_DISQUALIFIED',
  'CONCLUDED_DRAW': 'CONCLUDED_DRAW',
  'CONCLUDED_NO_CONTEST': 'CONCLUDED_NO_CONTEST',
  'CONCLUDED_BYE': 'CONCLUDED_BYE'
}

const baseUrl = 'https://api.overwatchleague.com'
const urls = {
  'standings': `${baseUrl}/standings`
}

/**
 * Generates list of weeks in each stage
 * @param {Stage} stage 
 */
const generateWeeksForStage = stage => {
  let week = 0
  return stage.matches
    .sort((a, b) => {
      return a.startDateTS - b.startDateTS
    })
    .reduce((res, match) => {
      if (match.startDate) {
        var startDate = moment(match.startDate).startOf("week").valueOf()
        if (!res.find(e => e.startDate === startDate)) {
          var endDate = moment(startDate).add(1, "week").valueOf()
          res.push({
            id: week,
            startDate,
            endDate,
            name: `Week ${week + 1}`
          })
          week++
        }
      }
      return res
    }, [])
}

/**
 * Returns current stage
 * @param {[Stage]} stages 
 */
const getCurrentStage = stages => {
  for (var time = Date.now(), stage = stages[0], i = 0; i < stages.length; i++) {
    if (stages[i].enabled) {
      const firstMatch = stages[i].matches.find(s => s.startDate)
      const lastMatch = _.cloneDeep(stages[i].matches).reverse().find(s => s.startDate)

      if (!firstMatch || !lastMatch) break

      stage = stages[i]

      const startDate = +moment(firstMatch.startDate)
      const endDate = +moment(lastMatch.startDate).endOf('day')
      if (startDate > time || startDate < time && endDate > time) break
    }
  }

  return stage
}

/**
 * Returns current week for a stage
 * @param {[StageWeek]} weeks 
 */
const getCurrentWeek = weeks => {
  for (var time = Date.now(), week = weeks[0], i = 0; i < weeks.length; i++) {
    week = weeks[i]
    const startDate = +moment(week.startDate)
    const endDate = +moment(week.endDate)

    if (startDate > time || startDate < time && endDate > time) {
      break
    }
  }

  return week
}

export async function getStandings() {
  return _getStandings().then(data => {
    const rankData = data.ranks.map(rank => {
      const team = rank.competitor
      const record = rank.records[0]
      return {
        name: team.name,
        color: team.primaryColor,
        wins: record.matchWin,
        losses: record.matchLoss,
        ties: record.matchDraw
      }
    })

    return {
      data: rankData,
      updated: cacheTs['standings']
    }
  }, Promise.reject)
}

/**
 * @returns {Promise<Standings>}
 */
async function _getStandings() {
  return _request('standings')
}

const cache = {}
const cacheTs = {}
async function _request(what, noCache = false) {
  if (!noCache && cache[what] && +moment(cacheTs[what]).add(5, 'minutes') > Date.now()) {
    return cache[what]
  }

  return needle('GET', urls[what], { json: true }).then(response => {
    if (response.statusCode === 200) {
      cache[what] = response.body
      cacheTs[what] = Date.now()
      return response.body
    }

    console.error('[OWL] Error getting data', what)
    return Promise.reject()
  }, err => {
    console.error('[OWL] Error getting data', err)
    return Promise.reject()
  })
}
