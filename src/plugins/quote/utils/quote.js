import _ from 'lodash'
import moment from 'moment'
import CliTable from 'cli-table2'
import CRUD, { Quotes } from '../../../database'
import { getHistory, findUser } from '../../../slack.js'
import config from '../../../../config.json'

export function getQuote(user, quotenum = 0) {
  return new Promise((resolve, reject) => {
    user = findUser(user)
    if (!user) {
      return reject("Couldn't find a user by that name")
    }

    CRUD.executeQuery(`SELECT * FROM Quote WHERE user = '${user.name}' ORDER BY grabbed_at DESC`).then(rows => {
      const quotes = _.get(rows, ['rs', 'rows', '_array'], [])
      const quoteindex = quotenum < 0 ? quotes.length + parseInt(quotenum) : parseInt(quotenum)
      if (quotes[quoteindex]) return resolve(urlify(`<${user.name}> ${quotes[quoteindex].message}`))
      else {
        if (quotes.length > 0) return reject("I don't have quotes that far back for " + user.name)
        else return reject(`No quotes found for ${user.name}, grab a quote via \`${config.prefix}grab <username>\``)
      }
    }).catch(reject)
  })
}

export function getQuotes(user, page = 1) {
  return new Promise((resolve, reject) => {
    user = findUser(user)
    if (!user) {
      return reject("Couldn't find a user by that name")
    }

    page = _.isNumber(+page) && !_.isNaN(+page) ? page <= 0 ? 1 : +page : 1
    const offset = 15 * page - 15

    const query = `SELECT * FROM Quote WHERE user = '${user.name}' ORDER BY DATE(grabbed_at) DESC LIMIT 15 OFFSET ${offset}`
    CRUD.executeQuery(query).then(results => {
      const rows = _.get(results, ['rs', 'rows', '_array'], [])
      if (rows.length > 0) {
        const quotes = [`<${user.name}> Quotes (Page ${page}):`]

        rows.forEach((quote, i) => {
          quotes.push(urlify(`[${i + offset}] (${moment(quote.grabbed_at).format('DD-MM-YYYY')}) ${quote.message}`))
        })

        return resolve(quotes)
      } else {
        return reject(page === 1 ? 'User has no quotes' : 'User has no more quotes')
      }
    })
  })
}

export function getRandomQuote(user) {
  return new Promise((resolve, reject) => {
    if (user) {
      user = findUser(user)
      if (!user) return reject("Couldn't find a user by that name")
    }

    const query = 'SELECT * FROM Quote WHERE id IN (SELECT id FROM Quote' + (user ? ` WHERE user = '${user.name}'` : '') + ' ORDER BY RANDOM() LIMIT 1)'
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

export async function getQuoteInfo(user, index) {
  user = findUser(user)
  if (!user) throw "Couldn't find a user by that name"

  index = _.isNumber(+index) && !_.isNaN(+index) ? +index : 0
  let offset = index
  const total = _.get(await CRUD.executeQuery(`SELECT count(*) as c FROM Quote WHERE user = '${user.name}'`), ['rs', 'rows', '_array', 0, 'c'])
  if (!total) throw 'Error getting total quotes'

  if (index < 0) {
    offset = total + offset
    if (offset < 0) {
      throw 'Offset is greater than total quotes'
    }
  }

  const query = `SELECT * FROM Quote WHERE user = '${user.name}' ORDER BY grabbed_at DESC LIMIT 1 OFFSET ${offset}`
  const data = await CRUD.executeQuery(query)
  const quote = _.get(data, ['rs', 'rows', '_array', 0])

  if (!quote) {
    throw 'Offset is greater than total quotes'
  }

  return [
    '```',
    `    Offset: ${offset - total}`,
    `  Quote ID: ${quote.id}`,
    `Grabbed By: ${quote.grabbed_by}`,
    `Grabbed At: ${quote.grabbed_at}`,
    `Quote User: ${quote.user}`,
    `     Quote: ${quote.message}`,
    '```'
  ].join('\n')
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

const selectOverallQuoteStats = `
SELECT count(*) AS total_quotes,
  (SELECT grabbed_by FROM Quote GROUP BY grabbed_by ORDER BY count(*) DESC) AS grabbed_most,
  (SELECT count(*) FROM Quote GROUP BY grabbed_by ORDER BY count(*) DESC) AS grabbed_most_count,
  (SELECT user FROM Quote GROUP BY user ORDER BY count(*) DESC) AS most_grabbed,
  (SELECT count(*) FROM Quote GROUP BY user ORDER BY count(*) DESC) AS most_grabbed_count,
  (SELECT user FROM Quote ORDER BY grabbed_at DESC) AS recently_grabbed,
  (SELECT grabbed_at FROM Quote ORDER BY grabbed_at DESC) AS recently_grabbed_at
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
    const table = new CliTable({ head: [], style: { head: [], border: [] } })
    table.push(
      { 'Overall': qs.total_quotes ? `${qs.total_quotes} quotes in total` : 'Unknown' },
      { 'Most Quoted': qs.most_grabbed ? `${qs.most_grabbed} with ${qs.most_grabbed_count} quotes` : 'Unknown' },
      { 'Grabs Most': qs.grabbed_most ? `${qs.grabbed_most} with ${qs.grabbed_most_count} grabs` : 'Unknown' },
      { 'Latest Quote': qs.recently_grabbed ? `${qs.recently_grabbed} ${moment(new Date(qs.recently_grabbed_at)).from(Date.now())}` : 'Unknown' }
    )

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
