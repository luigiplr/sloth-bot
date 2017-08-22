import { Remembers } from '../../database'
import { sendMessage } from '../../slack'
import moment from 'moment'

export const plugin_info = [{
  alias: ['remember'],
  command: 'remember',
  usage: 'remember <word> <what> - Remembers a phrase and returns its saved meaning'
}]

export function remember(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) {
      return reject('Usage: remember <word> <what> - Remembers a message for a word and saves it. Use ?word to retrieve message in chat')
    }

    const split = input.split(' ')
    const word = split[0].trim()
    const what = split.slice(1).join(' ').trim()

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