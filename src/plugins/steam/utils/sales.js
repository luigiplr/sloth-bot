import Promise from 'bluebird'
import needle from 'needle'
import _ from 'lodash'
import moment from 'moment'

try {
  var { salesAPI: [url, auth, key] } = require('../../../../config.json')
} catch(e) {
  var noWorkie = true
}

const options = {
  headers: {
    Authorization: auth,
    ApiKey: key
  }
}

var sales = undefined
var nextUpdate = undefined

function getSaleData() {
  return new Promise((resolve, reject) => {
    if (noWorkie) return reject("Unable to use this function")
    needle.get(url, options, (err, resp, body) => {
      if (!err && body) {
        nextUpdate = moment().add(2, 'd')
        return resolve(typeof body == 'string' ? JSON.parse(body) : body)
      }
      return reject("Error fetching data")
    })
  })
}

function formatDate(date) {
  let hasTime = date.split(' ')[1]
  let [day, month, year] = date.split('-')
  let newDate = hasTime ? new Date(`${month}-${day}-${year}`) : new Date(`${month}-${day}-${year} 17:00:00`) // fuck ISO 8601
  let UTCDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newDate.getHours()))
  return UTCDate
}

function formatDates(data) {
  return _.map(data, ({ name, date, enddate, confirmed }) => {
    date = formatDate(date)
    enddate = formatDate(enddate)
    return { name, date, enddate, confirmed: (confirmed === 'true' ? true : false) }
  })
}

function findNextSale(sales) {
  let currentTime = new Date().getTime()
  let nextSale = undefined
  sales.forEach(sale => {
    let diff = sale.enddate.getTime() - currentTime
    if (diff > 0 && (!nextSale || nextSale.date.getTime() - currentTime > diff)) nextSale = sale
  })
  return nextSale
}

export default function getNextSale() {
  return new Promise((resolve, reject) => {
    if (sales && nextUpdate && moment().isBefore(nextUpdate)) return resolve(findNextSale(sales))
    getSaleData().then(data => {
      sales = formatDates(data)
      return resolve(findNextSale(sales))
    }).catch(reject)
  })
}
