import needle from 'needle';

const config = require('../config.json');

module.exports = {
	sendMessage(channel, input) {
		needle.post('https://magics.slack.com/api/chat.postMessage', {
            text: input,
            channel: channel,
            as_user: 'true',
            token: config.slackAPIToken
        });
	}
};