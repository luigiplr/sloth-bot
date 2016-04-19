import MetaInspector from 'node-metainspector';
import Promise from 'bluebird';

module.exports = {
    commands: [{
        alias: ['maybensfw', 'ita'],
        command: 'maybensfw'
    }],
    help: [{
        command: ['maybensfw', 'ita'],
        usage: 'maybensfw - no arguments accepted'
    }],
    maybensfw(user, channel, input) {
        return new Promise((resolve, reject) => {
            let url = 'http://www.imposetonanonymat.com/random';
            let client = new MetaInspector(url, { timeout: 5000 });

            client.on('fetch', () => {
                if (client.images && !client.images[1].match(/logo|avatar/i))
                    return resolve({
                        type: 'channel',
                        message: client.images[1]
                    });
                else
                    return reject('No picture found');
            });
            
            client.on('error', () => {
                return reject('Error loading page');
            });

            client.fetch();
        });
    }
};