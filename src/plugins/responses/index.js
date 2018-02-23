import ateball from 'eightball'
import nodeMorse from 'morse-node'
import spinsult from 'shakespeare-insult'
import needle from 'needle'
import { STATUS_CODES } from 'http'
import { sendMessage, findUser } from '../../slack'
import config from '../../../config'
import data from './utils/data'
import _ from 'lodash'
import querystring from 'querystring'

const statusCodes = Object.assign({}, STATUS_CODES, data.statusCodes)

export const plugin_info = [{
  alias: ['ddos'],
  command: 'ddos',
  usage: 'ddos <user> - :)'
}, {
  alias: ['8ball'],
  command: 'eightball',
  usage: '8ball <question>'
}, {
  alias: ['lod'],
  command: 'lod',
  usage: 'lod <person>'
}, {
  alias: ['pf', 'pitchfork'],
  command: 'pitchfork',
  usage: 'pitchfork <person>'
}, {
  alias: ['morse'],
  command: 'morse',
  usage: 'morse <text>'
}, {
  alias: ['csi'],
  command: 'csi',
  usage: 'csi'
}, {
  alias: ['applause', 'applaud', 'clap'],
  command: 'clap',
  usage: 'applaud <optional sarcastic|slow> <optional user>'
}, {
  alias: ['flirt'],
  command: 'flirt',
  usage: 'flirt <user> - :)'
}, {
  alias: ['insult'],
  command: 'insult',
  usage: 'insult <person>'
}, {
  alias: ['sinsult', 'shakespeareinsult'],
  command: 'oldinsult',
  usage: 'sinsult <person>'
}, {
  alias: ['statuscode', 'status'],
  command: 'status',
  usage: 'status <code> - Returns what the status code is'
}, {
  alias: ['pug', 'hellopug'],
  command: 'pug',
  usage: 'hellopug - Returns a pug'
}, {
  alias: ['roast'],
  command: 'roast',
  usage: 'roast <user> - roasts a user'
}, {
  alias: ['dogfact'],
  command: 'dogfact',
  usage: 'dogfact - Returns a dog fact'
}, {
  alias: ['catfact'],
  command: 'catfact',
  usage: 'catfact - Returns a cat fact'
}, {
  alias: ['cn', 'chucknorris'],
  command: 'chucknorris',
  usage: 'chucknorris [user] - returns a chuck norris joke'
}, {
  alias: ['yomamma'],
  command: 'yomamma',
  usage: 'yomamma - returns a yo mamma joke'
}, {
  alias: ['advice'],
  command: 'advice',
  usage: 'advice - returns some advice'
}]

const _cleanInput = input => {
  if (input.includes('<mailto:')) return input.substr(8).split('|')[0]
  if (input.slice(0, 2) === "<@") return findUser(input).name || input
  if (input.includes('<http:')) return input.split('|')[1].slice(0, -1)
  return input
}

export function status(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return reject('Usage: statuscode <code> - Returns info for status code')
    const code = statusCodes[input]

    return resolve({ type: 'channel', message: code ? `[${input}]: ${code}` : "Couldn't find any details for that code" })
  })
}

export function ddos(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return reject('Its no fun if you dont tell me what to DDoS :(')
    let newInput = _cleanInput(input.split(' ')[0])
    resolve({ type: 'channel', message: `Resolving hostname for ${newInput}` })
    setTimeout(() => sendMessage(channel.id, `Hostname resolved, Beginning DDoS on ${newInput}`), 3000)
  })
}

export function eightball(user, channel, input) {
  return new Promise(resolve => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: 8ball <question> | Ask the magic 8ball for a prediction~~~' })
    return resolve({ type: 'channel', message: ateball() })
  })
}

export function lod(user, channel, input = '') {
  return new Promise(resolve => resolve({ type: 'channel', message: 'ಠ_ಠ ' + input }))
}

export function pitchfork(user, channel, input = 'OP') {
  return new Promise(resolve => resolve({
    type: 'channel',
    messages: [
      'ANGRY AT ' + input.toUpperCase() + '? WANT TO JOIN THE MOB? I\'VE GOT YOU COVERED! COME ON DOWN TO',
      '/r/pitchforkemporium WE GOT \'EM ALL! http://i.imgur.com/LGLPjWP.png#' + Math.floor(Math.random() * 1000)
    ]
  }))
}

const morseConvert = nodeMorse.create('ITU')
export function morse(user, channel, input) {
  return new Promise(resolve => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: Morse <morse code> - Translates morse code into English. Words should be seperated by a /' })
    if (input.match(/[A-Z0-9]/ig)) {
      return resolve({ 'type': 'channel', 'message': 'Invalid Morse Code, this function can only convert morse code to text.' })
    }
    const message = morseConvert.decode(input).trim()
    resolve({ 'type': 'channel', 'message': message.length ? `Translation: ${message}` : `Unable to decode. Words need to be seperated with a \`/\`` })
  })
}

export function csi() {
  return new Promise(resolve => {
    const generateMsg = () => {
      // Credit to http://mcpubba.net/techgen.html & https://github.com/DoctorMcKay/steam-irc-bot for this amazing code
      const _getFunny = what => data.csi[what][Math.floor(Math.random() * data.csi[what].length)]
      return _getFunny('start') + _getFunny('verb') + _getFunny('noun') + _getFunny('preposition') + _getFunny('noun') + '.'
    }

    resolve({ type: 'channel', message: generateMsg() })
  })
}

export function clap(user, channel, input) {
  return new Promise(resolve => {
    let type, clapee
    if (input) {
      type = input.split(' ')[0] || undefined
      clapee = input.split(' ')[1] || undefined
    }

    switch (type) {
      case 'slow':
      case 'sarcastic':
      case 'insincere':
      case 'bravo':
        return resolve({
          type: 'channel',
          message: (clapee ? `(${clapee})` : '') + data.clap.insincere[Math.floor(Math.random() * data.clap.insincere.length)]
        })
      default:
        clapee = type
        return resolve({
          type: 'channel',
          message: (clapee ? `(${clapee})` : '') + data.clap.sincere[Math.floor(Math.random() * data.clap.sincere.length)]
        })
    }
  })
}

export function flirt(user, channel, input) {
  return new Promise(resolve => {
    input = input ? (input.slice(0, 2) === "<@" ? findUser(input).name : input) : user.name
    return resolve({
      type: 'channel',
      message: data.flirts[Math.floor(Math.random() * data.flirts.length)].replace('%s', input)
    })
  })
}

export function insult(user, channel, input) {
  return new Promise(resolve => {
    if (!input) return resolve({ type: 'channel', message: 'Who am I insulting?' })

    return resolve({ type: 'channel', message: `you suk` })
  })
}

export function oldinsult(user, channel, input) {
  return new Promise(resolve => {
    if (!input) return resolve({ type: 'channel', message: 'Who am I insulting?' })

    return resolve({ type: 'channel', message: `_ ${input} you're a ${spinsult.random()}_` })
  })
}

export async function chucknorris(user, channel, input) {
  let params = {
    escape: 'javascript'
  }

  const u = findUser(input)
  if (input && !u) throw 'Invalid user'

  if (u) {
    params.firstName = u.profile.first_name || u.profile.real_name || u.profile.name
    params.lastName = u.profile.last_name || ''
  }

  const qs = querystring.stringify(params)
  const data = await needle('get', `http://api.icndb.com/jokes/random?${qs}`)

  if (data.statusCode !== 200 || !_.get(data.body, 'value.joke')) throw 'Error fetching chuck norris data'

  return { type: 'channel', message: data.body.value.joke.replace(/ {2}/g, ' ') }
}

// Idea and pug images from Gravebot
// https://github.com/Gravebot/Gravebot/blob/master/src/data/pugs.json
export function pug() {
  return new Promise(resolve => {
    return resolve({
      type: 'channel',
      message: data.pugs[Math.floor(Math.random() * data.pugs.length)] + `#${Math.floor(Math.random() * 1000)}`
    })
  })
}

// Idea and roasts from toasy discord bot
// https://github.com/cZollo/toasty/blob/master/src/data/roasts.json
export async function roast(user, channel, input) {
  if (!input) throw 'You need to tell me who to roast m8'

  const u = findUser(input)

  if (!u) throw 'Invalid user, m8'
  if (u.id === config.botid) throw "I'm not going to roast myself, dumbass."

  return { type: 'channel', 'message': `:fire: ${u.real_name || u.name}, ${data.roasts[Math.floor(Math.random() * data.roasts.length)]}` }
}

// All commands below here taken from WildBeast discord bot
// https://github.com/TheSharks/WildBeast/blob/master/runtime/commands/fun.js

export async function dogfact() {
  const data = await needle('get', 'https://dog-api.kinduff.com/api/facts')

  if (data.statusCode !== 200 || !_.get(data.body, ['facts', 0])) throw 'Error fetching dog fact'

  return { type: 'channel', message: `Dog Fact: ${data.body.facts[0]}` }
}

export async function catfact() {
  const data = await needle('get', 'https://catfact.ninja/fact')

  if (data.statusCode !== 200 || !data.body.fact) throw 'Error fetching cat fact'

  return { type: 'channel', message: `Cat Fact: ${data.body.fact}` }
}

export async function yomamma() {
  const data = await needle('get', 'http://api.yomomma.info/')

  if (data.statusCode !== 200) throw 'Error fetching joke'

  try {
    const { joke } = JSON.parse(data.body)
    return { type: 'channel', message: joke }
  } catch (e) {
    throw 'Error parsing data'
  }
}

export async function advice() {
  const data = await needle('get', 'http://api.adviceslip.com/advice')

  if (data.statusCode !== 200) throw 'Error fetching advice'

  try {
    const { slip: { advice } } = JSON.parse(data.body)
    return { type: 'channel', message: advice }
  } catch (e) {
    throw 'Error parsing data'
  }
}
