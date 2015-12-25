import MetaInspector from 'node-metainspector';
import Promise from 'bluebird';
import moment from 'moment';

module.exports = {
    commands: [{
        alias: ['hellolady'],
        command: 'bonjourmadame'
    }],
    help: [{
        command: ['hellolady'],
        usage: 'hellolady [void, \'today\', <MM.DD.YYYY>]'
    }],
    bonjourmadame(user, channel, input) {
        return new Promise((resolve, reject) => {
            var url;

            if (input) {
                if (input === 'today') {
                    url = 'http://ditesbonjouralamadame.tumblr.com/';
                } else if (input.match(/[0-9\.-]/g)) {
                    var diff = moment(new Date(input.match(/[0-9\.-]/g).join(''))).diff(moment(), 'days');
                    if (diff === 0) {
                        url = 'http://ditesbonjouralamadame.tumblr.com/';
                    } else if (diff < 0) {
                        url = 'http://ditesbonjouralamadame.tumblr.com/page/' + (diff * - 1 + 1);
                    } else {
                        return resolve({
                            type: 'dm',
                            message: 'Given date must be in the past. Usage: bonjourmadame [void, \'today\', <MM.DD.YYYY>]'
                        });
                    }                
                } else {
                    return resolve({
                        type: 'dm',
                        message: 'Usage: hellolady [void, \'today\', <MM.DD.YYYY>]'
                    });
                }
            } else {
                url = 'http://ditesbonjouralamadame.tumblr.com/random';
            }

            var client = new MetaInspector(url, { timeout: 5000 });

            client.on('fetch', function() {
                if (client.images && !client.images[0].match(/logo|avatar/i)) {
                    return resolve({
                        type: 'channel',
                        message: client.images[0]
                    });
                } else {
                    return reject('No picture found');
                }
            });
            
            client.on('error', function(err){
                return reject('Error loading page');
            });

            client.fetch();
        });
    }
};