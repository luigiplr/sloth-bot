export const plugin_info = [{
  alias: ['rip', 'gravestone'],
  command: 'rip',
  usage: 'rip "username" startdate-enddate "message"'
}]

const url = 'http://www.futuregravestone.com/image.php'

export function rip(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) {
      return resolve({
        type: 'dm',
        message: 'rip "username" startdate-enddate "message" -  Username and message must be surrounded by `" "` and date must be seperpated by `-` can be year or text'
      })
    }

    let texts = input.match(/["'”“][\w+ ']+["'”“]/g)
    let time = input.match(/\w+-\w+/)

    if (texts && time && texts.length === 2) {
      texts = texts.map(t => t.slice(1, -1).replace(/ /g, '+'))
      time = time[0].split('-')
      let imageUrl = `${url}?id=${randomNumber()}.JPG&name=${texts[0]}&byear=${time[0]}&dyear=${time[1]}&insc=${texts[1]}`
      return resolve(imageUrl)
    } else {
      return reject('Invalid markup, must resemble `"Bob Jones" whoknows-2016 "Rest in pizza"`')
    }
  })
}

const randomNumber = () => Math.floor(Math.random() * 9) + 1
