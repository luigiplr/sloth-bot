import Promise from 'bluebird'
import { retrieveSwearCommits, updateSwearCommits } from './utils/swearTracker'

export const plugin_info = [{
  alias: ['nc', 'naughtycommit'],
  command: 'swearCommit',
  usage: 'naughtycommit <user> - returns random commit in DB'
}, {
  alias: ['fetchcommits'],
  command: 'fetchCommits',
  usage: 'fetchcommits <user> [user to search] - updates commits for user'
}, {
  alias: ['listcommits'],
  command: 'listCommits',
  usage: 'listcommits <user> - lists all naughty commits for user'
}]

export function swearCommit(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: commits <user> [index] | Fetches a random or index naughty github commit made by user' })
    let u = input.split(' ')[0].toLowerCase()
    let index = input.split(' ')[1] ? input.split(' ')[1] : false
    retrieveSwearCommits(u, index).then(resp => resolve({ type: 'channel', message: _genCommitResp(resp) })).catch(reject)
  })
}
export function fetchCommits(user, channel, input, ts, plugin, adminLevel) {
  return new Promise((resolve, reject) => {
    if (!input)
      return resolve({
        type: 'dm',
        message: 'Usage: fetchcommits <user> <optional user to search> | Fetches naughty commits for user, if a second user is specified, it will search for commits by user in the other users repos'
      })
    updateSwearCommits(input, adminLevel).then(newSwears => {
      if (newSwears.length) {
        let out = [`*New commits found for ${input.split(' ')[0].toLowerCase()}:*`]
        newSwears.forEach(commit => out.push(_genCommitResp(commit)))
        return resolve({ type: 'channel', messages: out })
      } else return reject('Found no new swears')
    }).catch(reject)
  })
}
export function listCommits(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: listcommits <user> | Lists all saved naughty commits for a user' })
    retrieveSwearCommits(input, false).then(resp => resolve({ type: 'channel', messages: resp })).catch(reject)
  })
}

const _genCommitResp = commit => {
  return `(_${commit.repo}_): *${commit.message}* (${commit.url.slice(8, -33)})`
}
