import Promise from 'bluebird';
import _ from 'lodash';
import needle from 'needle';
import async from 'async';
import database from '../../../database';
import slack from '../../../slack';

const config = require('../../../../config.json');
const word_list = ["fuck", "bitch", "shit", "tits", "asshole", "arsehole", "cocksucker", "cunt", "hell", "douche", "testicle", "twat", "bastard", "sperm", "shit", "dildo", "wanker", "prick", "penis", "vagina", "whore", "boner"];

var username, userToLook, updating;

// Attempt to use a Github Authorization token
var githubAuthentication = {headers: {}};
if (config.githubToken && config.githubToken.length > 10) {
    let buffer = new Buffer(config.githubToken);
    githubAuthentication.headers = {
        'Authorization': 'Basic ' + buffer.toString('base64')
    };
}

// Github API Endpoints
const endpoints = {
    repositories: 'https://api.github.com/users/%u/repos',
    commits: 'https://api.github.com/repos/%u/%r%/commits?author=%u'
};

// Formats Endpoint URLs
const getUrl = ((type, repo) => {
    if (userToLook) {
        let out = endpoints[type].replace(/%u/, userToLook).replace(/%u/, username);
        console.log(out.replace('%r%', repo));
        return out.replace('%r%', repo);
    } else {
        let out = endpoints[type].replace(/%u/g, (userToLook ? userToLook : username));
        console.log(out.replace('%r%', repo));
        return out.replace('%r%', repo);
    }
});

// Retrieves all users repositories
const getRepos = (() => {
    return new Promise((resolve, reject) => {
        needle.get(getUrl('repositories'), githubAuthentication, (err, resp, body) => {
            if (!err && body) {
                if (!body[0] && !body.message) 
                    reject('User has no repos');
                else if (body.message === 'Not Found')
                    reject('Cannot find a user by that name');
                else if (body[0].id)
                    resolve(body);
            } else {
                reject("Error fetching repos", err);
            }
        });
    });
});

// Retrieves most recent commits for a repo
const getCommitsForRepos = (repos => {
    return new Promise((resolve, reject) => {
        //console.log("Getting commits for repos");
        let out = [];
        async.each(repos, (repo, cb) => {
            //console.log("Getting commits for repo:", repo);
            needle.get(getUrl('commits', repo), githubAuthentication, (err, resp, body) => {
                if (!err && body && body[0] && body[0].commit) {
                    out.push(body);
                    cb(); 
                } else {
                    cb(err);
                }
            });
        }, err => {
            if (err) {
                return reject(err);
            } else {
                resolve(out);
            }
        });
    });
});

// Goes through all commits and searches for swears
const findSwearsInCommits = (commits => {
    return new Promise((resolve, reject) => {
        //console.log("Finding swears in", commits.length, "commits");
        let commitsWithSwears = [];

        async.each(commits, (commit, cb) => {
            _.some(word_list, word => {
                if (commit.commit.message.indexOf(word) >= 0) {
                    let out = {
                        message: commit.commit.message,
                        url: commit.html_url,
                        sha: commit.sha,
                        user: username,
                        repo: commit.html_url.split('/')[4]
                    };
                    commitsWithSwears.push(out);
                    return true;
                }
            });
            cb();
        }, err => {
            if (err) {
                return reject(err);
            } else {
                if (commitsWithSwears[0]) {
                    //console.log("Found", commitsWithSwears.length, "swears");
                    resolve(commitsWithSwears);
                } else {
                    console.log("User has no swears");
                    saveToDB(null);
                    reject('Found no swears in recent commits :/');
                }
            }
        });
    });
});

// Formats all the repos and just returns the names
const formatRepos = (repos => {
    return new Promise(resolve => {
        //console.log("Fomatting Repos");
        let out = [];
        async.each(repos, (repo, cb) => {
            if (repo.fork && !config.includeForks)
                return cb();

            out.push(repo.name);
            cb();
        }, err => {
            if (!err)
                resolve(out);
        });
    });
});

// Saves all commits with swears to the DB, dupe commits won't get added to the DB
const saveToDB = (swears => {
    console.log("Save", (swears ? swears.length : 'unknown'), "swears to DB for user", username);
    if (swears)
        database.save('swearcommits', swears, {index: 'sha', ensureUnique: true}).catch(err => console.log("Commit already saved", err));
    //database.save('swearusers', {
    //    user: username,
     //   lastUpdated: Math.round(new Date().getTime() / 1000)
    //});
    updating = false;
});

// Start da lulz
const updateSwears = (() => {
    return new Promise((resolve, reject) => {
        //console.log("Starting Update Swears chain");
        updating = true;
        return getRepos()
            .then(formatRepos)
            .then(getCommitsForRepos)
            .then(commits => findSwearsInCommits(_.flatten(commits)))
            .then(saveToDB)
            .catch(err => {
                console.log("Caught an error! -", err);
                updating = false;
                reject(err);
            });
    });
});

const fetchSwears = (() => {
    return new Promise((resolve, reject) => {
        database.get('swearcommits', {
            key: 'user',
            value: username
        }).then(commits => {
            //console.log("Fetched", commits.length, "swear commits for", username);
            if (commits[0]) {
                resolve(commits);
            } else {
                //console.log("Found no swears");
                reject("I don't have commits for this user, you can fetch some with " + config.prefix + "fetchcommits <user>");
            }
        }).catch(err => {
            //console.log("Found no swears, no collection");
            reject("I don't have commits for this user, you can fetch some with " + config.prefix + "fetchcommits <user>");
        });
    });
});

const checkIfWeCanUpdate = (() => {
    return new Promise(resolve => {
        //console.log(username);
        database.get('swearusers', {
            key: 'user',
            value: username
        }).then(user => {
            if (user[0]) {
                //console.log("User in DB");
                if (user[0].lastUpdated + (24 * 3600) < Math.round(new Date().getTime() / 1000)) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            } else {
                //console.log("User not in DB");
                resolve(true);
            }
        }).catch(err => {
            if (err === 'NOCOLLECTION') {
                //console.log("NO COLLECTION");
                resolve(true);
            }
        });
    });
});

module.exports = {
    retrieveSwearCommits(input, all) {
        return new Promise((resolve, reject) => {
            username = input.toLowerCase();
            fetchSwears().then(commits => {
                if (!all)
                    return resolve(commits[Math.floor(Math.random() * commits.length)]);
                else {
                    let total = ['<' + username + '> Commits (' + commits.length + ') :'];
                    commits.forEach(commit => {
                        total.push('(_' + commit.repo +  ')_: *' + commit.message + '*- (' + commit.url.slice(8, - 33) + ')');
                    });
                    return resolve(total);
                }
            }).catch(reject);
        });
    },
    updateSwearCommits(user, channel, input) {
        return new Promise((resolve, reject) => {
            //console.log("Starting update process for:", input);

            username = input.split(' ')[0].toLowerCase();
            userToLook = input.split(' ')[1] ? input.split(' ')[1].toLowerCase() : undefined;

            checkIfWeCanUpdate().then(resp => {
                if (resp) {
                    //console.log("We can update commits");
                    if (!updating) {
                        //console.log("Not updating");
                        slack.sendMessage(channel.id, "Attempting to fetch commits now, this may take some time :)");
                        updateSwears().catch(reject);
                    } else {
                        //console.log("DB update already in process");
                        reject('DB update already in progress, try again laterz');
                    }
                } else {
                    //console.log("User already updated in last 24 hours");
                    reject(username + "'s commits have already been updated in the last 24 hours, try again later :)");
                }
            });
        });
    }
};