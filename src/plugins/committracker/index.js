import Promise from 'bluebird';
import Swears from './utils/swearTracker';

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
    if (!input)
      return resolve({
        type: 'dm',
        message: 'Usage: commits <user> | Fetches a random naughty github commit made by user'
      });
    Swears.retrieveSwearCommits(input, false).then(resp => {
      resolve({
        type: 'channel',
        message: generateCommitResponse(resp)
      });
    }).catch(reject);
  });
}
export function fetchCommits(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input)
      return resolve({
        type: 'dm',
        message: 'Usage: fetchcommits <user> <optional user to search> | Updates naughty commits for a user, if a second user is specified, it will search for commits for the user in the other users repos'
      });
    Swears.updateSwearCommits(user, channel, input).then().catch(reject);
  });
}
export function listCommits(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input)
      return resolve({
        type: 'dm',
        message: 'Usage: listcommits <user> | Lists all saved naughty commits for a user'
      });
    Swears.retrieveSwearCommits(input, true).then(resp => {
      resolve({
        type: 'channel',
        messages: resp
      });
    }).catch(reject);
  });
}

var generateCommitResponse = (commit => {
  return ('(_' + commit.repo + ')_: *' + commit.message + '* - (' + commit.url.slice(8, -33) + ')');
});

