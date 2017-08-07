import _ from 'lodash'
import { FileTypes } from './utils/owlib'

export const plugin_info = [{
  alias: ['owtype'],
  command: 'owtype',
  usage: 'owtype <type>'
}]

export function owtype(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) {
      return reject('Usage: owtype <type>')
    }

    let index
    _.find(['BE', 'LE', 'SWP'], type => {
      let i = _.findIndex(FileTypes[type], a => a === input)
      if (i !== -1) {
        index = i
        return true
      }
    })

    if (!index) {
      return resolve({ type: 'channel', message: 'Couldn\'t find anything for that code'})
    }

    return resolve({ 
      type: 'channel',
      message: `\`\`\`Data for ${input}:\n  BE: ${FileTypes.BE[index]}\n  LE: ${FileTypes.LE[index]}\n SWP: ${FileTypes.SWP[index]}\`\`\``
    })
  })
}