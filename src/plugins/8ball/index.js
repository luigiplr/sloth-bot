import ateball from 'eightball';
import Promise from 'bluebird';

module.exports = {
    commands: [{
        alias: ['8ball'],
        command: 'eightball'
    }],
    help: [{
        command: ['8ball'],
        usage: '8ball <question>'
    }],
    eightball(user, channel, input) {
        return new Promise((resolve, reject) => {
        	if (!input)
        		return resolve({
	                type: 'dm',
	                message: 'Usage: 8ball <question> | Ask the magic 8ball for a prediction~~~'
	            });
            return resolve({
                type: 'channel',
                message: ateball()
            });
        }) ;
    }
};