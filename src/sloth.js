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
                reject('Post Message Error: ' + resp.body.error);
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
                                    if (response.message)
                                        userChannel.send(response.message);
                                    else if (response.messages)
                                        postMessage(dm.channel.id, response.messages.join('\n'));
                                else {
                                    if (response.message)
                                        userChannel.send(response.message);
                                    else if (response.messages) 
                                        response.messages.forEach(message => {
                                            userChannel.send(message);
                                        });
                                }
                            }
                        });
                        break;
                    case 'channel':
                        console.log("OUT", channel.name + ':', (response.message ? response.message : response.messages));
                        if (response.message)
                            channel.send(response.message);
                        else if (response.messages) 
                            postMessage(message.channel, response.messages.join('\n'));
                        break;
                    case 'remote-channel':
                        break;
                }
            }).catch(err => {
                if (err) {
                    console.error('parseMsg Error:', err);
                    if (typeof err === 'string')
                        channel.send(err);
                    else 
                        throw(err);
                }
            });
    }
});

const sendErrorToDebugChannel = ((type, error) => {   
    if (error && error.message && error.stack) {
        console.error("Caught Error:", type, error.message, error.stack);

        if (!config.debugChannel)
            return;

        let i = 0;
        let stop = false;
        let message = 'Caught ' + type + ' ```' + error.message + '\n' + error.stack + '```';
        
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
    } else {
        console.error("Caught Error:", type, error);
        if (config.debugChannel)
            postMessage(config.debugChannel, "ABNORMAL ERROR: Caught " + type + ' ```' + error + '```');
    }
});

slackClient.on('error', err => {
    sendErrorToDebugChannel('slackClientError', err);
});

process.on('uncaughtException', err => {
    sendErrorToDebugChannel('uncaughtException', err);
    process.exit(1);
});

process.on('unhandledRejection', err => {
    sendErrorToDebugChannel('unhandledRejection', err);
});

process.on('rejectionHandled', err => {
    sendErrorToDebugChannel('handledRejection', err);
});

slackClient.login();