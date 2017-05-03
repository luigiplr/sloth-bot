import needle from 'needle'
import moment from 'moment'
import cheerio from 'cheerio'

var gCurrentSale = undefined
var nextUpdate = undefined

function getSaleData() {
  console.log("Fetching sale data")
  return new Promise((resolve, reject) => {
    needle.get('http://www.whenisthenextsteamsale.com/', (err, resp, body) => {
      if (err || !body) return reject("Error fetching data")
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

function formatDate(date) {
  let hasTime = date.split(' ')[1]
  let [day, month, year] = date.split('-')
  let newDate = hasTime ? new Date(`${month}-${day}-${year}`) : new Date(`${month}-${day}-${year} 17:00:00`) // fuck ISO 8601
  let UTCDate = new Date(Date.UTC(newDate.getFullYear(), newDate.getMonth(), newDate.getDate(), newDate.getHours()))
  return UTCDate
}

function formatData({ date, enddate, confirmed, name }) {
  date = formatDate(date)
  enddate = formatDate(enddate)
  confirmed = (confirmed === 'true' ? true : false)
  return { name, enddate, date, confirmed }
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
      gCurrentSale = formatData(nextSale)
      return resolve(gCurrentSale)
    }).catch(reject)
  })
}
