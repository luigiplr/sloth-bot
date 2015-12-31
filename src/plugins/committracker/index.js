import Promise from 'bluebird';
import Swears from './utils/swearTracker';

module.exports = {
    commands: [{
        alias: ['commits', 'naughtycommits'],
        command: 'swearCommit'
    }, {
        alias: ['fetchcommits'],
        command: 'fetchCommits'
    }],
    help: [{
        command: ['commits', 'naughtycommits'],
        usage: 'commits <user>'
    }, {
        command: ['fetchcommits'],
        usage: 'fetchcommits <user>'
    }],
    swearCommit(user, channel, input) {
        return new Promise((resolve, reject) => {
            if (!input)
                return resolve({
                    type: 'dm',
                    message: 'Usage: commits <user> | Fetches a random naughty github commit made by user'
                });
            Swears.retrieveSwearCommits(input).then(resp => {
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
                    message: 'Usage: fetchcommits <user> | Updates naughty commits for a user'
                });
            Swears.updateSwearCommits(user, channel, input).then().catch(reject);
        });
    }
};

var generateCommitResponse = (commit => {
    return ('(_' + commit.repo +  ')_: *' + commit.message + '* - (' + commit.url.slice(8, - 33) + ')');
});