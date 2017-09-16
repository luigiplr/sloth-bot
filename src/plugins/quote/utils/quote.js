import _ from 'lodash'
import moment from 'moment'
import CRUD, { Quotes } from '../../../database'
import { getHistory, findUser } from '../../../slack.js'
import config from '../../../../config.json'

export function getQuote(user, quotenum = 0) {
  return new Promise((resolve, reject) => {
    user = findUser(user)
    if (!user) {
      return reject("Couldn't find a user by that name")
    }

    Quotes.findByQuotedUser(user.name).then(quotes => {
      const quoteindex = quotenum < 0 ? quotes.length + parseInt(quotenum) : parseInt(quotenum)
      if (quotes[quoteindex]) return resolve(urlify(`<${user.name}> ${quotes[quoteindex].message}`))
      else {
        if (quotes.length > 0) return reject("I don't have quotes that far back for " + user.name);
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

    const query = `SELECT * from Quote where quotedUser = '${user.name}' ORDER BY DATE(date) DESC LIMIT 15 OFFSET ${offset}`
    CRUD.executeQuery(query).then(results => {
      const rows = _.get(results, ['rs', 'rows', '_array'], [])
      if (rows.length > 0) {
        const quotes = [`<${user.name}> Quotes (Page ${page}):`]

        rows.forEach((quote, i) => {
          quotes.push(urlify(`[${i + offset}] (${moment(quote.date).format("DD-MM-YYYY")}) ${quote.message}`))
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

    const query = 'SELECT * FROM Quote WHERE quoteId IN (SELECT quoteId FROM Quote' + (user ? ` WHERE quotedUser = '${user.name}'` : '') + ' ORDER BY RANDOM() LIMIT 1)'
    CRUD.executeQuery(query).then(result => {
      const rows = _.get(result, ['rs', 'rows', '_array'], [])
      if (rows.length > 0) {
        const quote = rows[0]
        return resolve(urlify(`<${quote.quotedUser}>\n${quote.message}`))
      } else {
        return reject("Couldn't find any quotes :(")
      }
    })
  })
}

export function grabQuote(grabee, channel, index = 0, grabber) {
  return new Promise((resolve, reject) => getHistory(channel.id).then(messages => {
    let user = findUser(grabee)
    if (!user) return reject("Couldn't find a user by that name")
    let i = 0
    if (grabber.id == user.id) { index++ }

    let uID = _(messages)
      .filter(message => {
        if (parseInt(index) == i) return message.user === user.id
        else if (message.user === user.id) i++
      })
      .map('text')
      .value()[0]

    if (!uID) return reject("Couldn't find any quotes from user")

    var dbQuote = new Quotes()
    dbQuote.quotedUser = user.name
    dbQuote.message = uID.toString()
    dbQuote.grabUser = grabber.name
    dbQuote.date = moment().utc().format()
    dbQuote.Persist().then(() => resolve("Successfully grabbed a quote for " + user.name))
  }).catch(reject))
}

const urlify = text => {
  let urlRegex = /(<https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, url => {
    url = url.substr(1)
    return url.substring(0, url.length - 1) + '#' + generatechars()
  })
}

const generatechars = () => {
  let length = 8,
    charset = "abcdefghijklnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = ""
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
}
