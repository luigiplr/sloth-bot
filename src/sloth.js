import Slack from 'slack-client';
import needle from 'needle'
import _ from 'lodash';
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
            username: 'sloth',
            token: config.slackToken,
            parse: 'full'
        }, (err, resp) => {

            if (err || resp.body.error)
                return reject('Error: ' + (resp.body.error || err));

            if (resp.body && resp.body.ok === true)
                console.log(resp.body);
            else
                reject('Error: ' + resp.body.error);
        });
    });

}


slackClient.on('open', () => {
    let unreads = slackClient.getUnreadCount();

    console.log('Welcome to Slack. You are @', slackClient.self.name, 'of', slackClient.team.name);
    return console.log('You have', unreads, 'unread', (unreads === 1) ? 'message' : 'messages');
});


slackClient.on('message', message => {
    let user = slackClient.getUserByID(message.user);
    let channel = slackClient.getChannelGroupOrDMByID(message.channel);
    let text = message.text;

    if (message.type === 'message' && text != null && channel != null) {
        if (text.charAt(0) !== config.prefix) return false;
        parseMsg(user, channel, text, slackClient)
            .then(response => {
                if (!response)
                    return false;
                switch (response.type) {
                    case 'dm':
                        slackClient.openDM(response.user ? response.user.id : message.user, dm => {
                            if (dm.ok) {
                                response.message ? multiLine(dm.channel.id, response.message) : multiLine(dm.channel.id, response.messages.join('\n'))
                            }
                        });
                        break;
                    case 'channel':
                        response.message ? channel.send(response.message) : multiLine(message.channel, response.messages.join('\n'))
                        break;
                    case 'remote-channel':
                        break;
                }
            })
            .catch(err => {
                channel.send('(' + user.name + ') ' + err);
            });
    }
});

slackClient.on('error', error => {
    if (error)
        console.error("Error: " + error);
});

slackClient.login();