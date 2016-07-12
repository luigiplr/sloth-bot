import Promise from 'bluebird'
import _ from 'lodash'

export const plugin_info = [{
  alias: ['rip', 'gravestone'],
  command: 'rip',
  usage: 'rip "username" startdate-enddate "message"'
}]

const url = 'http://www.futuregravestone.com/image.php'

export function rip(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({
      type: 'dm',
      message: 'rip "username" startdate-enddate "message" -  Username and message must be surrounded by `" "` and date must be seperpated by `-` can be year or text'
    })

    let match = input.match(/("[\w+ ]+") (\w+-\w+) ("[\w+ ]+")/g)
    if (match) {
      let split = _.flatten(_.compact(match[0].split('"')).map(m => _.trim(m).replace(/ /g, '+')).map(m => m.split('-')))
      if (split.length == '4') {
        let imageUrl = `${url}?id=${randomNumber()}.JPG&name=${split[0]}&byear=${split[1]}&dyear=${split[2]}&insc=${split[3]}`
        return resolve(imageUrl)
      } else return reject("Something went wrong :(")
    } else return reject('Invalid markup, must resemble `"Bob Jones" whoknows-2016 "Rest in pizza"`')

  })
}

const randomNumber = () => Math.floor(Math.random() * 9) + 1
