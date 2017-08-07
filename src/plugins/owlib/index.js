import _ from 'lodash'
import { FileTypes, FileInfo } from './utils/owlib'

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

    const SWP = FileTypes.SWP[index]
    const BE = FileTypes.BE[index]
    const LE = FileTypes.LE[index]
    const name = FileInfo[SWP].name
    const desc = FileInfo[SWP].desc

    return resolve({ 
      type: 'channel',
      messages: [
        '```',
        `Info for ${input}:`,
        name ? ` Name: ${name}` : null,
        desc ? ` Desc: ${desc}` : null,
        `   BE: ${BE}`,
        `   LE: ${LE}`,
        `  SWP: ${SWP}`,
        '```'
      ].filter(Boolean)
    })
  })
}