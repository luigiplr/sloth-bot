import CRUD, { Remembers } from '../../database'
import { sendMessage } from '../../slack'
import { table, getBorderCharacters } from 'table'
import moment from 'moment'
import _ from 'lodash'

export const plugin_info = [{
  alias: ['remember'],
  command: 'remember',
  usage: 'remember <word> <what> - Remembers a phrase and returns its saved meaning'
}, {
  alias: ['remembers', 'remembered'],
  command: 'rememberList',
  usage: 'remembers [word] - returns a list of words and messages for word'
}, {
  alias: ['forget'],
  command: 'removeRemember',
  usage: 'removeRemember <word> - removes a remembered word',
  userLevel: ['admin', 'superadmin']
}, {
  alias: ['protectremember'],
  userLevel: ['superadmin'],
  command: 'protectRemember'
}]

export function rememberList(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) {
      CRUD.executeQuery(`SELECT DISTINCT word from Remembers`).then(res => {
        const words = _.sortBy(_.get(res, ['rs', 'rows', '_array'], []).map((w = {}) => w.word), a => a.toLowerCase())
        console.log(words)
        if (words.length) {
          const data = table(_.chunk(words, 7).map(a => {
            if (a.length < 7) {
              return [ ...a, ..._.times(7 - a.length, _.constant(' ')) ]
            }
            return a
          }), {
            border: getBorderCharacters('norc')
          })

          return resolve({ type: 'channel', message: `Remembered words: \`\`\`${data}\`\`\`` })
        } else {
          return reject('No words have been saved')
        }
      })
      return
    }

    if (!input.match(/^[A-z0-9]*$/)) {
      return reject('Only letters and numbers are allowed for remembered words')
    }

    Remembers.findByWord(input).then((resp = []) => {
      if (resp.length === 0) {
        return reject('Nothing has been rememebred with that word')
      }

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

export function removeRemember(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) {
      return reject('Usage: delremember <word> - Removes a saved word from the remembered list')
    }

    Remembers.findOneByWord(input.trim()).then(word => {
      if (!word) {
        return reject('Word does not exist')
      }

      if (word.protected) {
        return reject('Error: This remember is protected from editing or deletion')
      }

      word.Delete().then(() => {
        resolve({ type: 'channel', message: 'Successfully deleted' })
      }, err => {
        reject(`Error deleting! ${err}`)
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
      if (existing && existing.protected) {
        return reject('Error: Remember is protected from editing or deletion')
      }

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

export async function protectRemember(user, channel, input) {
  if (!input) throw 'Usage: protectremember <word> - protects a remember from being edited or deleted'

  const word = await Remembers.findOneByWord(input)

  if (!word) throw 'Word does not exist'

  word.protected = 1
  await word.Persist()

  return { type: 'channel', message: 'Protected!' }
}
