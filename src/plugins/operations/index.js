import _ from 'lodash';
import Promise from 'bluebird';
import moment from 'moment'

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
    }
};