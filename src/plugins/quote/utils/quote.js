import _ from 'lodash'
import moment from 'moment'
import CRUD, { Quotes } from '../../../database'
import { getHistory, findUser } from '../../../slack.js'
import config from '../../../../config.json'

export function getQuote(user, quotenum = 0) {
  return new Promise((resolve, reject) => {
    user = findUser(user)
    if (!user) return reject("Couldn't find a user by that name")
    Quotes.findByQuotedUser(user.name).then(quotes => {
      if (quotenum === 'all') {
        let total = [`<${user.name}> Quotes (${quotes.length}):`]
        quotes.forEach((quotenums, i) => total.push(urlify(`[${i}] (${moment(quotenums.date).format("DD-MM-YYYY")}) ${quotenums.message}`)))
        return resolve(total)
      } else {
        let quoteindex = quotenum < 0 ? quotes.length + parseInt(quotenum) : parseInt(quotenum)
        if (quotes[quoteindex]) return resolve(urlify(`<${user.name}> ${quotes[quoteindex].message}`))
        else {
          if (quotes.length > 0) return reject("I don't have quotes that far back for " + user.name);
          else return reject(`No quotes found for ${user.name}, grab a quote via \`${config.prefix}grab <username>\``)
        }
      }
    }).catch(reject)
  })
}

export function getRandomQuote(user) {
  return new Promise((resolve, reject) => {
    if (user) {
      user = findUser(user)
      if (!user) return reject("Couldn't find a user by that name")
    }

    CRUD.executeQuery(user ? `SELECT * FROM Quote WHERE quotedUser = '${user.name}'` : 'SELECT * FROM Quote').then(result => {
      const rows = _.get(result, ['rs', 'rows', '_array'], [])
      if (rows.length > 0) {
        const quote = rows[Math.floor(Math.random() * rows.length)]
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

    if (!uID) return reject("Something went wrong")

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
