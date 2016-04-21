import Promise from 'bluebird'
import _ from 'lodash'
import needle from 'needle'
import async from 'async'
import database from '../../../database'
import config from '../../../../config.json'

const word_list = ["fuk", "fuck", "bitch", "shit", "tits", "asshole", "arsehole", "cocksucker", "cunt", "douche", "testicle", "twat", "bastard", "sperm", "shit", "dildo", "wanker", "prick", "penis", "vagina", "whore", "boner"]
const githubAuthentication = { headers: { 'Authorization': 'Basic ' + new Buffer(config.githubToken).toString('base64') } }

var username, userToLook, updating;

// Github API Endpoints
const endpoints = {
  repositories: 'https://api.github.com/users/%u/repos',
  commits: 'https://api.github.com/repos/%u/%r%/commits?author=%u'
}

// Formats Endpoint URLs
const getUrl = ((type, repo) => {
  if (userToLook) {
    let out = endpoints[type].replace(/%u/, userToLook).replace(/%u/, username);
    return out.replace('%r%', repo);
  } else {
    let out = endpoints[type].replace(/%u/g, (userToLook ? userToLook : username));
    return out.replace('%r%', repo);
  }
})

// Retrieves all users repositories
const getRepos = (() => {
  return new Promise((resolve, reject) => needle.get(getUrl('repositories'), githubAuthentication, (err, resp, body) => {
    if (!err && body) {
      if (!body[0] && !body.message) reject('User has no repos')
      else if (body.message === 'Not Found') reject('Cannot find a user by that name')
      else if (body[0].id) resolve(body)
    } else reject("Error fetching repos", err)
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
          cb();
        } else cb(err)
      })
    }, err => {
      return err ? reject(err) : resolve(out)
    })
  })
})

// Goes through all commits and searches for swears
const findSwearsInCommits = (commits => {
  return new Promise((resolve, reject) => {
    let commitsWithSwears = []

    async.each(commits, (commit, cb) => {
      _.some(word_list, word => {
        if (commit.commit.message.toLowerCase().indexOf(word) >= 0) {
          let out = {
            message: commit.commit.message,
            url: commit.html_url.toLowerCase(),
            sha: commit.sha,
            user: username,
            repo: commit.html_url.split('/')[4]
          }
          commitsWithSwears.push(out);
          return true;
        } else return false;
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
    }, err => {
      if (!err) resolve(out);
    })
  })
})

// Saves all commits with swears to the DB, dupe commits won't get added to the DB
const saveToDB = (swears => {
  return new Promise((resolve, reject) => {
    updating = false
    database.save('swearusers', { user: username, lastUpdated: Math.round(new Date().getTime() / 1000) });
    if (swears) {
      database.save('swearcommits', swears, { index: 'sha', ensureUnique: true }).catch(err => console.log("Commit already saved", err));
      return resolve(`Found ${swears.length} swears`)
    } else return reject("Found no swears in recent commits :/")
  })
})

// Start da lulz
const updateSwears = (() => {
  return new Promise((resolve, reject) => {
    updating = true;
    return getRepos()
      .then(formatRepos)
      .then(getCommitsForRepos)
      .then(commits => findSwearsInCommits(_.flatten(commits)))
      .then(saveToDB)
      .then(resolve)
      .catch(err => {
        updating = false
        reject(err)
      })
  })
})

const fetchSwears = (() => {
  return new Promise((resolve, reject) => database.get('swearcommits', { key: 'user', value: username }).then(commits => {
    if (commits[0]) resolve(commits)
    else reject("I don't have commits for this user, you can fetch some with " + config.prefix + "fetchcommits <user>")
  }).catch(() => {
    return reject("I don't have commits for this user, you can fetch some with " + config.prefix + "fetchcommits <user>")
  }))
})

const checkIfWeCanUpdate = (() => {
  return new Promise(resolve => database.get('swearusers', { key: 'user', value: username }).then(user => {
    if (user[0])
      if (user[0].lastUpdated + -1 < Math.round(new Date().getTime() / 1000)) resolve(true)
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

