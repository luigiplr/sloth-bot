const _ = require('lodash')
const moment = require('moment')
const needle = require('needle')
const request = require('request')
const puppeteer = require('puppeteer')
const config = require('../../../../config.json')
require('./definitions')

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
        var startDate = moment(match.startDate).startOf("isoWeek").valueOf()
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
 * @returns {Stage}
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
 * @returns {StageWeek}
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

/**
 * Returns matches for a stage in a week
 * @param {[Match]} matches 
 * @param {StageWeek} week
 * @returns {[Match]}
 */
const getMatchesForStageWeek = (matches, week) => {
  return matches.filter(match => (
    moment(match.startDate).valueOf() >= week.startDate &&
    moment(match.startDate).valueOf() < week.endDate
  ))
}

/**
 * 
 * @param {[Match]} weekMatches
 * @returns {[WeekDays]}
 */
const getDaysForWeek = weekMatches => {
  return weekMatches.reduce((res, match) => {
    const matchStartDate = moment(match.startDate)
    const existingDay = res.find(day => {
      return day.date === matchStartDate.format("MM/DD/YYYY")
    })

    if (existingDay) {
      existingDay.matches.push(match)
    } else {
      res.push({
        date: matchStartDate.format("MM/DD/YYYY"),
        timestamp: matchStartDate.startOf('day').valueOf(),
        displayDate: {
          dayOfWeek: moment(matchStartDate).format('dddd'),
          monthAndDay: moment(matchStartDate).format('MMMM Do')
        },
        matches: [match]
      })
    }

    return res
  }, [])
}

/* eslint-disable */
/**
 * @param {[Stage]} stages 
 */
const mapData = stages => {
  const mappedStages = stages.map(stage => Object.assign({}, stage, { weeks: generateWeeksForStage(stage) }))
  const currentStage = getCurrentStage(mappedStages)
  const currentWeek = getCurrentWeek(currentStage.weeks)
  const weekMatches = getMatchesForStageWeek(currentStage.matches, currentWeek)
  const weekDays = getDaysForWeek(weekMatches)
}

// mapData(data.data.stages)
/* eslint-enable */

export async function getLiveMatch(channelId) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true
  })
  const page = await browser.newPage()
  await makePuppeteerUndetectable(page)
  page.setViewport({ width: 400, height: 700 })
  await page.goto('https://overwatchleague.com/en-us/', { waitUntil: 'domcontentloaded' })
  await page.waitForSelector('.LiveStream-info', { timeout: 3000 })
  await page.waitForFunction(`document.querySelector('.LiveStream-info').offsetHeight > 200`, { timeout: 1500 })

  const liveInfoElm = await page.evaluate(selector => {
    const element = document.querySelector(selector) // eslint-disable-line no-undef
    const { x, y, width, height } = element.getBoundingClientRect()
    return { left: x, top: y, width, height }
  }, '.LiveStream-info')

  const screenshot = await page.screenshot({
    clip: {
      x: liveInfoElm.left,
      y: liveInfoElm.top,
      width: liveInfoElm.width,
      height: liveInfoElm.height
    }
  })

  await browser.close()

  try {
    await (new Promise(resolve => {
      request.post('https://slack.com/api/files.upload', {
        url: 'https://slack.com/api/files.upload',
        qs: {
          token: config.slackBotToken,
          channels: channelId
        },
        formData: {
          file: {
            value: new Buffer(screenshot),
            options: {
              filename: 'live-stats',
              contentType: 'image/png'
            }
          }
        }
      }, function (err, response) {
        if (!err) {
          return resolve()
        }
        throw new Error(err)
      })
    }))
  } catch (e) {
    console.error(e)
    throw e
  }

  return
}

export async function getStandings() {
  return _getStandings().then(data => {
    const rankData = data.ranks.map(rank => {
      const team = rank.competitor
      const record = rank.records[0]
      return {
        name: team.name,
        match_wins: record.matchWin,
        match_losses: record.matchLoss,
        match_win_percent: record.matchWin / (record.matchLoss + record.matchWin),
        map_wins: record.gameWin,
        map_losses: record.gameLoss,
        map_win_percent: record.gameWin / (record.gameLoss + record.gameWin)
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
  if (!noCache && cache[what] && +moment(cacheTs[what]).add(6, 'minutes') > Date.now()) {
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

const makePuppeteerUndetectable = async (page) => {
  const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36'
  await page.setUserAgent(userAgent)

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'webdriver', { // eslint-disable-line no-undef
      get: () => false
    })
  })

  await page.evaluateOnNewDocument(() => {
    window.navigator.chrome = { // eslint-disable-line no-undef
      runtime: {}
    }
  })

  await page.evaluateOnNewDocument(() => {
    const originalQuery = window.navigator.permissions.query // eslint-disable-line no-undef
    return window.navigator.permissions.query = parameters => (  // eslint-disable-line
      parameters.name === 'notifications'
        ? Promise.resolve({ state: Notification.permission }) // eslint-disable-line no-undef
        : originalQuery(parameters)
    )
  })

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'plugins', { // eslint-disable-line no-undef
      get: () => [1, 2, 3, 4, 5]
    })
  })

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, 'languages', { // eslint-disable-line no-undef
      get: () => ['en-US', 'en']
    })
  })
}
