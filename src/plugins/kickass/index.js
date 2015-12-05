import Promise from 'bluebird';
import kickass from './utils/kickass';

module.exports = {
    commands: [{
        alias: ['kickass'],
        command: 'kickass'
    }],
    help: [{
        command: ['kickass'],
        usage: 'kickass <search>'
    }],
    kickass(user, channel, input = '') {
        return new Promise((resolve, reject) => {


            kickass.search('test', true).then((data) => {
                let result = data.results[0];
                resolve({
                    type: 'channel',
                    message: result.link + ' - ' + result.torrentLink + ' - ' + result.title
                });
            }).catch(reject);

        });
    }
};