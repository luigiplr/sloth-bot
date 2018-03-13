import moment from 'moment'
import cheerio from 'cheerio'
import request from 'request'

var gCurrentSale
var nextUpdate

function getSaleData() {
  console.log("Fetching sale data")
  return new Promise((resolve, reject) => {
    request({ method: 'GET', url: 'http://www.whenisthenextsteamsale.com/' }, function (error, response, body) {
      if (error || !body) return reject("Error fetching data")

      try {
        const $ = cheerio.load(body)
        const value = $('#hdnNextSale').attr().value
        return resolve(JSON.parse(value))
      } catch (e) {
        return reject("Error parsing data")
      }
    })
  })
}

export function getSaleTime(time) {
  const duration = type => time[type]() !== 0 ? `${time[type]()} ${type.slice(0, -1)}${(time[type]() > 1 ? 's' : '')}` : false
  const getTime = (firstHalf, seconds) => firstHalf.replace(/, /, '').length !== 0 ? `${firstHalf} and ${seconds || '0 seconds'}` : seconds
  return `in approximately ${getTime(['months', 'days', 'hours', 'minutes'].map(duration).filter(Boolean).join(', '), duration('seconds'))}`
}

export function getNextSale() {
  return new Promise((resolve, reject) => {
    if (gCurrentSale && nextUpdate && moment().isBefore(nextUpdate)) return resolve(gCurrentSale)
    getSaleData().then(nextSale => {
      nextUpdate = moment().add(2, 'd')
      gCurrentSale = nextSale
      return resolve(gCurrentSale)
    }).catch(reject)
  })
}
