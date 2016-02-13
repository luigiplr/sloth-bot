import Slack from 'slack-client';
import Promise from 'bluebird';
import needle from 'needle';
import {
    sendMessage as postMessage
} from './slack';
import {
    parse as parseMsg
}
from './parseMessage';

const slackClient = new Slack(require('./../config.json').slackAPIToken, true, true);
const config = require('./../config.json');

slackClient.on('open', () => {
    let unreads = slackClient.getUnreadCount();

    console.log('Welcome to Slack. You are @', slackClient.self.name, 'of', slackClient.team.name);
    return console.log('You have', unreads, 'unread', (unreads === 1) ? 'message' : 'messages');
});

const getParams = ((text, attach = null) => {
    return {
        text: text,
        as_user: true,
        token: config.slackAPIToken,
        attachments: attach
    };
});

const checkIfDM = ((type, user) => {
    return new Promise(resolve => {
        if (type == 'dm') {
            slackClient.openDM(user, dm => {
                let channel = slackClient.getChannelGroupOrDMByID(dm.channel.id);
                resolve(channel);
            });
        } else {
            resolve(0);
        }
    });
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

                if (!response.type == 'dm' || !response.type == 'channel')
                    return console.error("Invalid message response type, must be channel or dm");
                
                checkIfDM(response.type, response.user ? response.user.id : message.user).then(DM => {
                    if (DM)
                        channel = DM;
                    console.log("OUT", channel.name + ':', (response.message ? response.message : response.messages));
                    if (response.message && response.message.attachments) {
                        channel.postMessage(getParams(response.message.msg, response.message.attachments));
                    } else if (!response.multiLine) {
                        if (response.message)
                            channel.send(response.message);
                        else if (response.messages)
                            channel.postMessage(getParams(response.messages.join('\n')));
                    } else {
                        if (response.messages && response.messages[1])
                            response.messages.forEach(message => {
                                channel.send(message);
                            });
                        else
                            return console.error("Invalid Multiline format, your array must contain more than 1 message and use the 'messages' response type");
                    }
                });
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
    setTimeout(function() {
        process.exit(1);
    }, 500);
});

process.on('uncaughtException', err => {
    sendErrorToDebugChannel('uncaughtException', err);
    setTimeout(function() {
        process.exit(1);
    }, 500);
});

process.on('unhandledRejection', err => {
    sendErrorToDebugChannel('unhandledRejection', err);
});

process.on('rejectionHandled', err => {
    sendErrorToDebugChannel('handledRejection', err);
});

slackClient.login();