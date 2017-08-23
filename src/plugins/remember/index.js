import CRUD, { Remembers } from '../../database'
import { sendMessage } from '../../slack'
import moment from 'moment'
import _ from 'lodash'

export const plugin_info = [{
  alias: ['remember'],
  command: 'remember',
  usage: 'remember <word> <what> - Remembers a phrase and returns its saved meaning'
}, {
  alias: ['remembers'],
  command: 'rememberList',
  usage: 'remembers [word] - returns a list of words and messages for word'
}]

export function rememberList(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) {
      CRUD.executeQuery(`SELECT DISTINCT word from Remembers ORDER BY word`).then(res => {
        const words = _.get(res, ['rs', 'rows', '_array'], []).map((w = {}) => w.word)
        if (words.length) {
          return resolve({ type: 'channel', message: `Remembered words: \`\`\`${words.join(' | ')}\`\`\``})
        } else {
          return reject('No words have been saved')
        }
      })
      return
    }

    if (!input.match(/^[A-z0-9]*$/)) {
      return reject('Only letters and numbers are allowed')
    }

    Remembers.findByWord(input).then((resp = []) => {
      if (resp.length === 0) {
        return reject('Nothing has been rememebred with that word')
      }

      console.log(resp)

      return resolve({
        type: 'channel',
        messages: [
          `Rememebers saved for \`${input}\`:`,
          '```',
          ...resp.map(r => {
            let date = moment(r.date)
            date = date.isValid ? (date.format('YY-MM-DD HH:mm') + ' UTC') : 'Unknown'
            return `[${r.user || 'Unknown'} at ${date}]: ${r.text}`
          }),
          '```'
        ]
      })
    })
  })
}

export function remember(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) {
      return reject('Usage: remember <word> <what> - Remembers a message for a word and saves it. Use ?word to retrieve message in chat')
    }

    const split = input.split(' ')
    const word = split[0].trim()
    const what = split.slice(1).join(' ').trim()

    if (!word.match(/^[A-z0-9]*$/)) {
      return reject('Only letters and numbers are allowed')
    }

    Remembers.findOneByWord(word).then(existing => {
      const newRemember = new Remembers()
      newRemember.user = user.name
      newRemember.word = word
      newRemember.text = what
      newRemember.Persist().then(() => {
        resolve({ type: 'channel', message: `Successfully remembered \`${word}\`. Value: \`\`\`${what}\`\`\`` })
        
        if (existing) {
          let oldDate = moment(existing.date)
          oldDate = oldDate.isValid ? (oldDate.format('YYYY-MM-DD HH:mm') + ' UTC') : 'Unknown'
          sendMessage(user.id, `Old value for \`${word}\`: \n_remembered by ${existing.user || 'Unknown'} on ${oldDate}_ \`\`\`${existing.text}\`\`\``)
        }
      })
    })
  })
}