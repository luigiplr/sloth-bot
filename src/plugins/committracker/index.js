import Promise from 'bluebird';
import Swears from './utils/swearTracker';

module.exports = {
    commands: [{
        alias: ['nc', 'commits', 'naughtycommits'],
        command: 'swearCommit'
    }, {
        alias: ['fetchcommits'],
        command: 'fetchCommits'
    }, {
        alias: ['listcommits'],
        command: 'listCommits'
    }],
    help: [{
        command: ['nc', 'commits', 'naughtycommits'],
        usage: 'commits <user>'
    }, {
        command: ['fetchcommits'],
        usage: 'fetchcommits <user> <optional other user repos to search>'
    }, {
        command: ['listcommits'],
        usage: 'listcommits <user>'
    }],
    swearCommit(user, channel, input) {
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
    },
    fetchCommits(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return resolve({
                    type: 'dm',
                    message: 'Usage: fetchcommits <user> <optional user to search> | Updates naughty commits for a user, if a second user is specified, it will search for commits for the user in the other users repos'
                });
            Swears.updateSwearCommits(user, channel, input).then().catch(reject);
        });
    },
    listCommits(user, channel, input) {
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
};

var generateCommitResponse = (commit => {
    return ('(_' + commit.repo +  ')_: *' + commit.message + '* - (' + commit.url.slice(8, - 33) + ')');
});