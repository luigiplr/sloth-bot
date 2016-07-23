import Promise from 'bluebird'
import { some, assign, flatten } from 'lodash'
import needle from 'needle'
import async from 'async'
import { SwearCommits, SwearUsers } from '../../../database'
import config from '../../../../config.json'

const word_list = ["fuk", "fuck", "bitch", "shit", "tits", "asshole", "arsehole", "cocksucker", "cunt", "douche", "testicle", "twat", "bastard", "sperm", "shit", "dildo", "wanker", "prick", "penis", "vagina", "whore", "boner"]
const githubAuthentication = { headers: { 'Authorization': 'Basic ' + new Buffer(config.githubToken).toString('base64') } }

var username, userToLook, updating;

// Github API Endpoints
const endpoints = {
  repositories: 'https://api.github.com/users/%u/repos',
  commits: 'https://api.github.com/repos/%u/%r%/commits?author=%u&per_page=40'
}

// Formats Endpoint URLs
const getUrl = ((type, repo) => {
  if (userToLook) {
    let out = endpoints[type].replace(/%u/, userToLook).replace(/%u/, username)
    return out.replace('%r%', repo);
  } else {
    let out = endpoints[type].replace(/%u/g, (userToLook ? userToLook : username))
    return out.replace('%r%', repo)
  }
})

// Retrieves all users repositories
const getRepos = (() => {
  return new Promise((resolve, reject) => needle.get(getUrl('repositories'), githubAuthentication, (err, resp, body) => {
    if (!err && body) {
      if (!body[0] && !body.message) return reject('User has no repos')
      else if (body.message === 'Not Found') return reject('Cannot find a user by that name')
      else if (body[0].id) return resolve(body)
    } else return reject("Error fetching repos", err)
  }))
})

// Retrieves most recent commits for a repo
const getCommitsForRepos = (repos => {
  return new Promise((resolve, reject) => {
    let out = []
    async.each(repos, (repo, cb) => {
      needle.get(getUrl('commits', repo), githubAuthentication, (err, resp, body) => {
        if (!err && body && body[0] && body[0].commit) {
          out.push(body)
          cb()
        } else cb(err)
      })
    }, err => err ? reject(err) : resolve(out))
  })
})

// Goes through all commits and searches for swears
const findSwearsInCommits = (commits => {
  return new Promise((resolve, reject) => {
    let commitsWithSwears = []

    async.each(commits, (commit, cb) => {
      some(word_list, word => {
        if (commit.commit.message.toLowerCase().indexOf(word) >= 0) {
          let out = {
            message: commit.commit.message,
            url: commit.html_url.toLowerCase(),
            sha: commit.sha,
            user: username,
            repo: commit.html_url.split('/')[4]
          }
          commitsWithSwears.push(out)
          return true
        } else return false
      })
      cb()
    }, err => {
      if (err) return reject(err)
      else commitsWithSwears[0] ? resolve(commitsWithSwears) : resolve(null)
    })
  })
})

// Formats all the repos and just returns the names
const formatRepos = (repos => {
  return new Promise(resolve => {
    let out = []
    async.each(repos, (repo, cb) => {
      if (repo.fork && !config.includeForks) return cb()
      out.push(repo.name)
      cb()
    }, err => !err ? resolve(out) : console.error("Error formatting repo"))
  })
})

// Saves all commits with swears to the DB, dupe commits won't get added to the DB
const saveToDB = swears => {
  return new Promise((resolve, reject) => {
    SwearUsers.findByUser(username).then(resp => {
      let user = resp[0] ? resp[0] : new SwearUsers()
      user.user = username
      user.lastUpdated = Math.round(new Date().getTime() / 1000)
      user.Persist()
    })
    let promises = []
    let newSwears = swears ? swears.length : 0
    if (swears) {
      promises.push.apply(promises, swears.map(swear => SwearCommits.findBySha(swear.sha).then(resp => {
        if (resp[0]) {
          newSwears--
          return;
        }
        let commit = new SwearCommits()
        assign(commit, swear)
        return commit.Persist()
      })))
    }

    return Promise.all(promises).then(() => {
      updating = false
      if (swears)
        return resolve(newSwears ? `Found ${newSwears} swears` : 'Found no new swear commits');
      else
        return reject("Found no swears in recent commits :/");
    })
  })
}

// Start da lulz
const updateSwears = (() => {
  return new Promise((resolve, reject) => {
    updating = true
    return getRepos()
      .then(formatRepos)
      .then(getCommitsForRepos)
      .then(commits => findSwearsInCommits(flatten(commits)))
      .then(saveToDB)
      .then(resolve)
      .catch(err => {
        updating = false
        reject(err)
      })
  })
})

const fetchSwears = (() => {
  return new Promise((resolve, reject) => SwearCommits.findByUser(username).then(commits => {
    if (commits[0]) resolve(commits)
    else reject(`I don't have commits for this user, you can fetch some with ${config.prefix} fetchcommits <user>`)
  }).catch(() => reject(`I don't have commits for this user, you can fetch some with ${config.prefix} fetchcommits <user>`)))
})

const checkIfWeCanUpdate = (() => {
  return new Promise(resolve => SwearUsers.findByUser(username).then(user => {
    if (user[0])
      if (user[0].lastUpdated + 3600 < Math.round(new Date().getTime() / 1000)) resolve(true)
      else resolve(false)
    else resolve(true)
  }).catch(err => {
    if (err === 'NOCOLLECTION') resolve(true)
  }))
})

export function retrieveSwearCommits(input, all) {
  return new Promise((resolve, reject) => {
    username = input.toLowerCase()
    fetchSwears().then(commits => {
      if (!all) return resolve(commits[Math.floor(Math.random() * commits.length)]);
      else {
        let total = [`<${username}> Commits (${commits.length}):`]
        commits.forEach(commit => total.push(`(_${commit.repo}_): *${commit.message}* (${commit.url.slice(8, -33)})`))
        return resolve(total)
      }
    }).catch(reject)
  })
}

export function updateSwearCommits(user, channel, input) {
  return new Promise((resolve, reject) => {
    username = input.split(' ')[0].toLowerCase()
    userToLook = input.split(' ')[1] ? input.split(' ')[1].toLowerCase() : undefined

    checkIfWeCanUpdate().then(resp => {
      if (resp)
        if (!updating) updateSwears().then(resolve).catch(reject)
        else reject('DB update already in progress, try again laterz')
      else
        reject(username + "'s commits have already been updated in the last hour, try again later :)")
    })
  })
}
