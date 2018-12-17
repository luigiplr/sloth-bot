import _ from 'lodash'
import moment from 'moment'
import CliTable from 'cli-table2'
import CRUD, { Quotes } from '../../../database'
import { getHistory, findUser } from '../../../slack.js'
import sqlify from 'sqlstring'
import config from '../../../../config.json'

const QUOTES_PER_PAGE = 12

export async function getQuote(user, index = 0) {
  const u = findUser(user)
  if (!u) {
    throw "Couldn't find a user by that name"
  }

  let data
  try {
    const username = sqlify.escape(u.name)
    data = await CRUD.executeQuery(`SELECT * FROM Quote WHERE user = ${username} ORDER BY DATETIME(grabbed_at) DESC`)
  } catch (e) {
    return `Error fetching quote. ${e.message}`
  }

  const quotes = _.get(data, ['rs', 'rows', '_array'], [])
  const qIndex = index < 0 ? quotes.length + index : index

  if (quotes[qIndex]) {
    return urlify(`<${u.name}>\n${quotes[qIndex].message}`)
  } else {
    throw quotes.length > 0
      ? `I don't have quotes that far back for ${u.name}`
      : `No quotes found for ${u.name}, grab a quote via \`${config.prefix}grab <username>\``
  }
}

export async function getQuotes(user, page = 1) {
  user = findUser(user)
  if (!user) throw "Couldn't find a user by that name"

  page = _.isNumber(+page) && !_.isNaN(+page) ? page <= 0 ? 1 : +page : 1
  const offset = QUOTES_PER_PAGE * page - QUOTES_PER_PAGE

  const username = sqlify.escape(user.name)
  const [ quotesData, quoteCount ] = await Promise.all([
    CRUD.executeQuery(`SELECT * FROM Quote WHERE user = ${username} ORDER BY DATETIME(grabbed_at) DESC LIMIT ${QUOTES_PER_PAGE} OFFSET ${offset}`),
    CRUD.executeQuery(`SELECT count(*) AS count FROM Quote WHERE user = ${username}`)
  ])

  const rows = _.get(quotesData, ['rs', 'rows', '_array'], [])

  if (rows.length === 0) {
    throw page === 1 ? 'User has no quotes' : 'User has no more quotes'
  }

  const totalQuotes = _.get(quoteCount, ['rs', 'rows', '_array', 0, 'count'])
  const totalPages = Math.ceil(+totalQuotes / QUOTES_PER_PAGE)
  const quotes = [
    `Quotes for *${user.name}* _(Page ${page}/${totalPages})_:`,
    '```',
    ...rows.map((quote, i) => `[${(i + offset) - +totalQuotes}] (${moment(quote.grabbed_at).format('DD-MM-YYYY')}) ${quote.message}`),
    '```'
  ]

  return quotes
}

export function getRandomQuote(user) {
  return new Promise((resolve, reject) => {
    if (user) {
      user = findUser(user)
      if (!user) return reject("Couldn't find a user by that name")
    }

    const username = user && sqlify.escape(user.name)
    const query = 'SELECT * FROM Quote WHERE id IN (SELECT id FROM Quote' + (user ? ` WHERE user = ${username}` : '') + ' ORDER BY RANDOM() LIMIT 1)'
    CRUD.executeQuery(query).then(result => {
      const rows = _.get(result, ['rs', 'rows', '_array'], [])
      if (rows.length > 0) {
        const quote = rows[0]
        return resolve(urlify(`<${quote.user}>\n${quote.message}`))
      } else {
        return reject("Couldn't find any quotes :(")
      }
    })
  })
}

export async function getQuoteInfo(userOrId, index) {
  let quote
  let quoteOffset

  if (_.isFinite(+userOrId)) {
    quote = await Quotes.findOneById(+userOrId)
  } else {
    const user = findUser(userOrId)
    if (!user) throw "Couldn't find a user by that name"

    index = _.isNumber(+index) && !_.isNaN(+index) ? +index : 0
    let offset = index

    const username = sqlify.escape(user.name)
    const totalQuotesData = await CRUD.executeQuery(`SELECT count(*) as c FROM Quote WHERE user = ${username}`)
    const total = _.get(totalQuotesData, ['rs', 'rows', '_array', 0, 'c'])
    if (!total) throw 'Error getting total quotes'

    if (index < 0) {
      offset = total + offset
      if (offset < 0) {
        throw 'Offset is greater than total quotes'
      }
    }

    const quoteData = await CRUD.executeQuery(`SELECT * FROM Quote WHERE user = ${username} ORDER BY DATETIME(grabbed_at) DESC LIMIT 1 OFFSET ${offset}`)
    quote = _.get(quoteData, ['rs', 'rows', '_array', 0])
    quoteOffset = offset - total
  }

  if (!quote) {
    throw 'Offset is greater than total quotes'
  }

  return [
    '```',
    quoteOffset && `    Offset: ${quoteOffset}`,
    `  Quote ID: ${quote.id}`,
    `Grabbed By: ${quote.grabbed_by}`,
    `Grabbed At: ${quote.grabbed_at}`,
    `Quote User: ${quote.user}`,
    `     Quote: ${quote.message}`,
    '```'
  ].filter(Boolean).join('\n')
}

export function grabQuote(grabee, channel, index = 0, grabber) {
  return new Promise((resolve, reject) => getHistory(channel.id).then(messages => {
    const user = findUser(grabee)
    if (!user) return reject("Couldn't find a user by that name")

    let i = 0
    if (grabber.id === user.id) index++

    const message = messages.filter(message => {
      if (parseInt(index) === i) return message.user === user.id
      else if (message.user === user.id) i++
    })[0]

    if (!message) return reject("Couldn't find any quotes from user")
    if (!message.text) return reject('Message has no text??')

    var dbQuote = new Quotes()
    dbQuote.user = user.name
    dbQuote.message = message.text.toString()
    dbQuote.grabbed_by = grabber.name
    dbQuote.grabbed_at = moment().utc().format()
    dbQuote.message_id = message.ts

    dbQuote.Persist().then(resp => {
      if (resp.error || resp.code) {
        if (resp.code === 'SQLITE_CONSTRAINT') {
          return reject('Error: Quote has already been grabbed')
        }
        return reject(`Error grabbing quote: ${resp.code || resp}`)
      }

      resolve(`Successfully grabbed a quote for ${user.name}`)
    })
  }).catch(reject))
}

export async function searchForQuoteByText(user, text, page) {
  const textQuery = text.match(/(^%|%$)/) ? text : `%${text}%`
  let query = `FROM Quote WHERE message LIKE ${sqlify.escape(textQuery)}`
  let userQuery = ''

  if (user) {
    userQuery = `AND user = ${sqlify.escape(user)}`
  }

  page = page <= 0 ? 1 : page
  const offset = QUOTES_PER_PAGE * page - QUOTES_PER_PAGE

  const [ res, totalCount ] = await Promise.all([
    CRUD.executeQuery(`SELECT * ${query} ${userQuery} ORDER BY DATETIME(grabbed_at) DESC LIMIT ${QUOTES_PER_PAGE} OFFSET ${offset}`),
    CRUD.executeQuery(`SELECT count(*) AS count ${query} ${userQuery}`)
  ])

  const totalQuotes = _.get(totalCount, ['rs', 'rows', '_array', 0, 'count'])
  const totalPages = Math.ceil(+totalQuotes / QUOTES_PER_PAGE)
  const results = _.get(res, ['rs', 'rows', '_array'], [])

  if (results.length === 0) {
    throw page === 1 ? 'No results found' : 'No more results'
  }

  return {
    type: 'channel',
    messages: [
      `*${totalQuotes} Result${results.length > 1 ? 's' : ''} found for "${text}"${user ? ` from ${user}` : ''} | Page ${page}/${totalPages}*`,
      '```',
      ...results.map(quote => `[${quote.id}]${user ? '' : ` [${quote.user}]`} ${quote.message.replace(/```/g, '``')}`),
      '```'
    ]
  }
}

export async function getQuoteById(id) {
  if (!_.isFinite(+id)) {
    throw 'Invalid number'
  }

  const quote = await Quotes.findOneById(+id)

  return urlify(`<${quote.user}>\n${quote.message}`)
}

const withinTime = `WHERE grabbed_at >= date('now', '-1 months')`
const selectOverallQuoteStats = `
SELECT count(*) AS total_quotes_all,
  (SELECT count(*) FROM Quote ${withinTime}) AS total_quotes,
  (SELECT grabbed_by FROM Quote ${withinTime} GROUP BY grabbed_by ORDER BY count(*) DESC) AS grabbed_most,
  (SELECT count(*) FROM Quote ${withinTime} GROUP BY grabbed_by ORDER BY count(*) DESC) AS grabbed_most_count,
  (SELECT user FROM Quote ${withinTime} GROUP BY user ORDER BY count(*) DESC) AS most_grabbed,
  (SELECT count(*) FROM Quote ${withinTime} GROUP BY user ORDER BY count(*) DESC) AS most_grabbed_count,
  (SELECT count(*) * 1.0 / count(distinct(date(grabbed_at))) FROM Quote ${withinTime}) as average_grabs,
  (SELECT grabbed_by FROM Quote GROUP BY grabbed_by ORDER BY count(*) DESC) AS grabbed_most_all,
  (SELECT count(*) FROM Quote GROUP BY grabbed_by ORDER BY count(*) DESC) AS grabbed_most_count_all,
  (SELECT user FROM Quote GROUP BY user ORDER BY count(*) DESC) AS most_grabbed_all,
  (SELECT count(*) FROM Quote GROUP BY user ORDER BY count(*) DESC) AS most_grabbed_count_all,
  (SELECT user FROM Quote ORDER BY datetime(grabbed_at) DESC) AS recently_grabbed,
  (SELECT grabbed_at FROM Quote ORDER BY datetime(grabbed_at) DESC) AS recently_grabbed_at,
  (SELECT count(*) * 1.0 / count(distinct(date(grabbed_at))) FROM Quote) as average_grabs_all
FROM Quote
`

export async function getQuoteStats(input) {
  let user

  if (input) {
    user = findUser(input.split(' ')[0])
    if (!user) throw "Couldn't find a user by that name"
  }

  if (user) return 'NOT IMPLEMENTED'

  const query = user ? '' : selectOverallQuoteStats
  const data = await CRUD.executeQuery(query)
  const qs = _.get(data, ['rs', 'rows', '_array', 0])

  if (!qs) throw 'Error getting quote stats'

  if (user) {
    return 'NOT IMPLEMENTED'
  } else {
    const table = new CliTable({
      head: [ '', 'Past Month', 'All Time' ],
      style: { head: [], border: [] }
    })

    table.push({
      'Most Quoted': [
        qs.most_grabbed ? `${qs.most_grabbed} with ${qs.most_grabbed_count} quotes` : 'Unknown',
        qs.most_grabbed_all ? `${qs.most_grabbed_all} with ${qs.most_grabbed_count_all} quotes` : 'Unknown'
      ]
    }, {
      'Grabs Most': [
        qs.grabbed_most ? `${qs.grabbed_most} with ${qs.grabbed_most_count} grabs` : 'Unknown',
        qs.grabbed_most_all ? `${qs.grabbed_most_all} with ${qs.grabbed_most_count_all} grabs` : 'Unknown'
      ]
    }, {
      'Avg Grabs / Day': [
        qs.average_grabs ? `${qs.average_grabs.toFixed(2)} grabs per day ` : 'Unknown',
        qs.average_grabs_all ? `${qs.average_grabs_all.toFixed(2)} grabs per day ` : 'Unknown'
      ]
    }, {
      'Overall': [
        qs.total_quotes ? `${qs.total_quotes} quotes` : 'Unknown',
        qs.total_quotes_all ? `${qs.total_quotes_all} quotes` : 'Unknown'
      ]
    }, {
      'Latest Quote': [
        qs.recently_grabbed ? `${qs.recently_grabbed} ${moment(new Date(qs.recently_grabbed_at)).from(Date.now())}` : 'Unknown',
        'N/A'
      ]
    })

    return [
      '*Quote Statistics:*',
      '```',
      table.toString(),
      '```'
    ].join('\n')
  }
}

const urlify = text => {
  let urlRegex = /(<https?:\/\/[^\s]+)/g
  return text.replace(urlRegex, url => {
    url = url.substr(1)
    return url.substring(0, url.length - 1) + '#' + generatechars()
  })
}

const generatechars = () => {
  const length = 8
  const charset = 'abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let retVal = ''
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
}
