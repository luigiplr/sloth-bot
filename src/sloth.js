import Slack from 'slack-client';
import Promise from 'bluebird';
import needle from 'needle';
import {
    parse as parseMsg
}
from './parseMessage';

process.on('uncaughtException', err => {
    console.log(err);
});

const slackClient = new Slack(require('./../config.json').slackAPIToken, true, true);
const config = require('./../config.json');

const multiLine = (channel, input) => {
    return new Promise((resolve, reject) => {
        needle.post('https://magics.slack.com/api/chat.postMessage', {
            text: input,
            channel: channel,
            as_user: 'true',
            token: config.slackAPIToken
        }, (err, resp) => {
            if (err || resp.body.error)
                return reject('Error: ' + (resp.body.error || err));

            if (!resp.body && resp.body.ok !== true)
                reject('Error: ' + resp.body.error);
        });
    });
};

slackClient.on('open', () => {
    let unreads = slackClient.getUnreadCount();

    console.log('Welcome to Slack. You are @', slackClient.self.name, 'of', slackClient.team.name);
    return console.log('You have', unreads, 'unread', (unreads === 1) ? 'message' : 'messages');
});

slackClient.on('message', message => {
    let user = slackClient.getUserByID(message.user);
    let channel = slackClient.getChannelGroupOrDMByID(message.channel);
    let text = message.text;

    if (message.type === 'message' && text && channel) {
        if (text.charAt(0) !== config.prefix) return false;
        console.log(user.name + ':', text);
        parseMsg(user, channel, text, slackClient)
            .then(response => {
                if (!response)
                    return false;
                switch (response.type) {
                    case 'dm':
                        slackClient.openDM(response.user ? response.user.id : message.user, dm => {
                            if (dm.ok) {
                                console.log("DM:", (response.message ? response.message : response.messages));
                                let userChannel = slackClient.getChannelGroupOrDMByID(dm.channel.id);
                                if (!response.multiLine)
                                    response.message ? userChannel.send(response.message) : multiLine(dm.channel.id, response.messages.join('\n'));
                                else {
                                    response.message ? userChannel.send(response.message) : response.messages.forEach(message => {
                                        userChannel.send(message);
                                    });
                                }
                            }
                        });
                        break;
                    case 'channel':
                        console.log(channel.name + ':', (response.message ? response.message : response.messages));
                        response.message ? channel.send(response.message) : multiLine(message.channel, response.messages.join('\n'))
                        break;
                    case 'remote-channel':
                        break;
                }
            }).catch(err => {
                if (err) {
                    console.error('Error:', err);
                    channel.send(err);
                }
            });
    }
});

slackClient.on('error', error => {
    if (error)
        console.error("Error: " + error);
});

slackClient.login();