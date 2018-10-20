import _ from 'lodash'
import { FileTypes, FileInfo } from './utils/owlib'

export const plugin_info = [{
  alias: ['owtype'],
  command: 'owtype',
  usage: 'owtype <type>'
}]

export async function owtype(user, channel, input) {
  if (!input) {
    return 'Usage: owtype <type>'
  }

  let index
  _.find(['BE', 'LE', 'SWP'], type => {
    let i = _.findIndex(FileTypes[type], a => a === input)
    if (i !== -1) {
      index = i
      return true
    }
  })

  let fileInfo = FileInfo[input]

  if (!index && !fileInfo) {
    return 'Couldn\'t find anything for that code'
  }

  const SWP = FileTypes.SWP[index]
  const BE = FileTypes.BE[index]
  const LE = FileTypes.LE[index]

  const { name, desc, state, removed, fileType } = FileInfo[SWP || input]

  return {
    type: 'channel',
    messages: [
      '```',
      `Info for ${input}${removed ? ' (Removed)' : ''}:`,
      ` Name: ${name || 'Unknown'}`,
      desc ? ` Desc: ${desc}` : null,
      ` Type: ${fileType || 'Unknown'}`,
      state ? `State: ${state}` : null,
      `   BE: ${BE || 'Unknown'}`,
      `   LE: ${LE || 'Unknown'}`,
      `  SWP: ${SWP || input}`,
      '```'
    ].filter(Boolean)
  }
}
