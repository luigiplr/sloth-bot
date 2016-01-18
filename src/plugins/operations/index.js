import _ from 'lodash';
import Promise from 'bluebird';
import slack from '../../slack';
import {
    exec as execCmd
} from 'child_process';

const config = require('../../../../config.json');

module.exports = {
    commands: [{
        alias: ['shutdown'],
        userLevel: ['superadmin'],
        command: 'shutdown'
    }, {
        alias: ['restart'],
        userLevel: ['admin', 'superadmin'],
        command: 'restart'
    }, {
        alias: ['uptime'],
        command: 'uptime'
    }, {
        alias: ['update'],
        userLevel: ['admin', 'superadmin'],
        command: 'update'
    }],
    help: [{
        command: ['shutdown'],
        usage: 'shutdown'
    }, {
        command: ['restart'],
        usage: 'restart'
    }, {
        command: ['uptime'],
        usage: 'uptime - returns uptime of bot'
    }, {
        command: ['update'],
        usage: 'update <optional restart 1/0> - updates the bot from github'
    }],
    shutdown() {
        return new Promise(resolve => {
            resolve({
                type: 'channel',
                message: 'Shutting down in *3.. 2.. 1.*'
            });
            _.delay(process.exit, 3000);
        });
    },
    restart() {
        return new Promise(resolve => {
            resolve({
                type: 'channel',
                message: 'Restarting in *3.. 2.. 1.*'
            });
            setTimeout(function() {
                process.exit(1);
            }, 3000);
        });
    },
    uptime() {
        return new Promise(resolve => {
            let sec_num = parseInt(process.uptime(), 10),
            hours   = Math.floor(sec_num / 3600),
            minutes = Math.floor((sec_num - (hours * 3600)) / 60),
            seconds = sec_num - (hours * 3600) - (minutes * 60);

            hours != 0 ? hours = hours + (hours == 1 ? ' hour, ' : ' hours, ') : hours = '';
            minutes != 0 ? minutes = minutes + (minutes == 1 ? ' minute' : ' minutes') + ' and ' : '';
            seconds = seconds + (seconds == 1 ? ' second' : ' seconds');

            let time = hours + minutes + seconds;
            resolve({
                type: 'channel',
                message: "I have been flyin' smooth for " + time
            });
        });
    },
    update(user, channel, input) {
        return new Promise((resolve, reject) => {
            let updatecmd = 'git pull && grunt install';

            execCmd(updatecmd, {timeout:60000}, (error, stdout, stderr) => {
                if (!error && stdout) {
                    if (config.debugChannel)
                        slack.sendMessage(config.debugChannel, 'test2 ```' + stdout + '```');

                    if (stdout.indexOf('Already up-to-date') > -1) {
                        return reject("Repo is already up-to-date");
                    }

                    if (stdout.indexOf('Updating') === 0 && stdout.indexOf("Done, without errors.") > -1) {
                        if (input === 1) {
                            resolve({
                                type: 'channel',
                                message: "Sucessfully fetched and installed new updates, restarting"
                            });
                            this.restart();
                        } else {
                           resolve({
                                type: 'channel',
                                message: "Sucessfully fetched and installed new updates"
                            }); 
                        }
                    } else {
                        reject("Possible error while fetching and installing new updates?");
                    }
                } else {
                    reject("Error while fetching and installing updates ```" + stdout + stderr + error + '```');
                }
            });
        });
    }
};