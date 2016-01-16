import Slack from 'slack-client';
import Promise from 'bluebird';
import needle from 'needle';
import {
    parse as parseMsg
}
from './parseMessage';

const slackClient = new Slack(require('./../config.json').slackAPIToken, true, true);
const config = require('./../config.json');

const postMessage = (channel, input) => {
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
        console.log("IN", user.name + ':', text);
        parseMsg(user, channel, text, slackClient)
            .then(response => {
                if (!response)
                    return false;
                switch (response.type) {
                    case 'dm':
                        slackClient.openDM(response.user ? response.user.id : message.user, dm => {
                            if (dm.ok) {
                                console.log("OUT DM:", (response.message ? response.message : response.messages));
                                let userChannel = slackClient.getChannelGroupOrDMByID(dm.channel.id);
                                if (!response.multiLine)
                                    response.message ? userChannel.send(response.message) : postMessage(dm.channel.id, response.messages.join('\n'));
                                else {
                                    response.message ? userChannel.send(response.message) : response.messages.forEach(message => {
                                        userChannel.send(message);
                                    });
                                }
                            }
                        });
                        break;
                    case 'channel':
                        console.log("OUT", channel.name + ':', (response.message ? response.message : response.messages));
                        response.message ? channel.send(response.message) : postMessage(message.channel, response.messages.join('\n'))
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

const sendErrorToDebugChannel = (error => {
    console.error("Error:", error.message, error.stack);

    let i = 0;
    let stop = false;
    if (error && config.debugChannel) {
        let msg = error.message ? error.message : error;
        let stack = error.stack ? error.stack : 'No stack :(';
        let message = 'Error! ```' + msg + '\n' + stack + '```';
        
        if (i < 5 & !stop) {
            i++;
            postMessage(config.debugChannel, message);
            setTimeout(function() {
                if (i > 0)
                    i--;
            }, 2000);
        } else {
            postMessage(config.debugChannel, "Warning! Error spam, stopping bot");
            stop = true;
            process.exit();
        }
    }
});

slackClient.on('error', err => {
    sendErrorToDebugChannel(err);
});

process.on('uncaughtException', err => {
    sendErrorToDebugChannel(err);
    process.exit(1);
});

process.on('unhandledRejection', err => {
    sendErrorToDebugChannel(err);
});

process.on('rejectionHandled', err => {
    sendErrorToDebugChannel(err);
});

slackClient.login();