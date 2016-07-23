import Promise from 'bluebird'
import wolframUtil from './utils/wolfram'

export const plugin_info = [{
  alias: ['calc', 'wolfram'],
  command: 'wolfram',
  usage: 'wolfram <query> - returns wolfram calculation for query'
}]

export function wolfram(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: wolfram <query> - Computes <query> using Wolfram Alpha.' })

    wolframUtil.query(input).then(resp => resolve({ type: 'channel', message: `*Result*: ${resp}` })).catch(reject)
  })
}
