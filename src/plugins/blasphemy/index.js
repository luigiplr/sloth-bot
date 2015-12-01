import blasphemer from 'blasphemy';
import Promise from 'bluebird';

module.exports = {
    commands: [{
        alias: ['blasphemy'],
        command: 'blasphemy'
    }],
    help: [{
        command: ['blasphemy'],
        usage: 'blasphemy'
    }],
    blasphemy(user, channel, input) {
        return new Promise((resolve, reject) => {
            return resolve({
                type: 'channel',
                message: blasphemer.blaspheme()
            });
        }) ;
    }
};