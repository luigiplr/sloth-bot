import Promise from 'bluebird'
import _ from 'lodash'
import moment from 'moment'
import { Quotes } from '../../../database'
import { getHistory, findUser } from '../../../slack.js'
import config from '../../../../config.json'

export function getQuote(user, quotenum = 0) {
  return new Promise((resolve, reject) => {
    Quotes.findByQuotedUser(user).then(quotes => {
      if (quotenum === 'all') {
        let total = [`<${user}> Quotes (${quotes.length}):`]
        quotes.forEach((quotenums, i) => total.push(urlify(`[${i}] (${moment(quotenums.date).format("DD-MM-YYYY")}) ${quotenums.message}`)))
        return resolve(total)
      } else {
        let quoteindex = quotenum < 0 ? quotes.length + parseInt(quotenum) : parseInt(quotenum)
        if (quotes[quoteindex]) return resolve(urlify(`<${user}> ${quotes[quoteindex].message}`))
        else {
          if (quotes.length > 0) return reject("I don't have quotes that far back for " + user);
          else return reject(`No quotes found for ${user}, grab a quote via \`${config.prefix}grab <username>\``)
        }
      }
    }).catch(reject)
  })
}

export function grabQuote(grabee, channel, index = 0, grabber) {
  return new Promise((resolve, reject) => Promise.join(getHistory(channel.id), findUser(grabee), (messages, user) => {
    let i = 0
    if (grabber.id == user) { index++ }

    let uID = _(messages)
      .filter(message => {
        if (parseInt(index) == i) return message.user === user
        else if (message.user === user) i++
      })
      .map('text')
      .value()[0]

    if (!uID) return reject("Something went wrong")

    var dbQuote = new Quotes()
    dbQuote.quotedUser = grabee.toString().toLowerCase()
    dbQuote.message = uID.toString()
    dbQuote.grabUser = grabber.name
    dbQuote.date = moment().utc().format()
    dbQuote.Persist().then(() => resolve("Successfully grabbed a quote for " + grabee))
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
