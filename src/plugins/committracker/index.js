import Promise from 'bluebird'
import { retrieveSwearCommits, updateSwearCommits } from './utils/swearTracker'

export const plugin_info = [{
  alias: ['nc', 'commits', 'naughtycommits'],
  command: 'swearCommit',
  usage: 'commits <user>'
}, {
  alias: ['fetchcommits'],
  command: 'fetchCommits',
  usage: 'fetchcommits <user> <optional other user repos to search>'
}, {
  alias: ['listcommits'],
  command: 'listCommits',
  usage: 'listcommits <user>'
}]

export function swearCommit(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: commits <user> | Fetches a random naughty github commit made by user' })
    retrieveSwearCommits(input, false).then(resp => resolve({ type: 'channel', message: _genCommitResp(resp) })).catch(reject)
  })
}
export function fetchCommits(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input)
      return resolve({
        type: 'dm',
        message: 'Usage: fetchcommits <user> <optional user to search> | Fetches naughty commits for user, if a second user is specified, it will search for commits by user in the other users repos'
      })
    updateSwearCommits(user, channel, input).then(resp => resolve({ type: 'channel', message: resp })).catch(reject)
  })
}
export function listCommits(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input) return resolve({ type: 'dm', message: 'Usage: listcommits <user> | Lists all saved naughty commits for a user' })
    retrieveSwearCommits(input, true).then(resp => resolve({ type: 'channel', messages: resp })).catch(reject)
  })
}

const _genCommitResp = commit => {
  return `(_${commit.repo}_): *${commit.message}* (${commit.url.slice(8, -33)})`
}

