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
    },
    deleteMessage(channel, ts) {
    	needle.post('https://magics.slack.com/api/chat.delete', {
            channel: channel,
            token: config.slackToken,
            ts: ts
        });
        console.info("Deleted message in", channel, "with TS of", ts);
    },
    getHistory(channel, limit = 100) {
        return new Promise((resolve, reject) => {
            needle.post('https://magics.slack.com/api/channels.history', {
                channel: channel,
                token: config.slackToken,
                count: limit
            }, (err, resp) => {
                if (err || resp.body.error)
                    return reject((resp.body.error || err));
                resolve(resp.body);
            });
        });
    },
};