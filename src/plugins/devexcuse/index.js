import devexcuses from 'developerexcuses';
import Promise from 'bluebird';

module.exports = {
    commands: [{
        alias: ['devexcuse', 'developerexcuse'],
        command: 'devexcuse'
    }],
    help: [{
        command: ['devexcuse'],
        usage: 'devexcuse'
    }],
    devexcuse(user, channel, input) {
        return new Promise((resolve, reject) => {
            devexcuses((err, excuse) => {
                return resolve({
                    type: 'channel',
                    message: !err ? excuse : err
                });
            });
            
        }) ;
    }
};