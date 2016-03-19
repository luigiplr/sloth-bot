import Slack from 'slack-client';
import Promise from 'bluebird';
import slackTools from './slack';
import config from '../config.json';
import {
    parse as parseMsg
}
from './parseMessage';

if (!config.prefix || !config.slackToken || !config.slackAPIToken) {
    console.error("Invalid config, please fill in the first 3 required config fields");
    process.exit();
}

const slackClient = new Slack(config.slackAPIToken, true, true);

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

slackClient.on('open', () => {
    let unreads = slackClient.getUnreadCount();

    config.teamName = slackClient.team.domain;
    config.botname = slackClient.self.name;
    config.botid = slackClient.self.id;

    console.log('Welcome to Slack. You are @' + slackClient.self.name, 'of', slackClient.team.name);
    console.log('You have', unreads, 'unread', (unreads === 1) ? 'message' : 'messages');
});

slackClient.on('message', message => {
    let user = slackClient.getUserByID(message.user);
    let channel = slackClient.getChannelGroupOrDMByID(message.channel);
    let text = message.text;
    let ts = message.ts;

    if (message.type === 'message' && text && channel) {
        parseMsg(user, channel, text, ts)
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
        let message = 'Caught ' + type + ' ```' + error.message + '\n' + error.stack + '```';
        
        if (i < 4) {
            i++;
            slackTools.sendMessage(config.debugChannel, message);
            setTimeout(function() {
                if (i > 0)
                    i--;
            }, 3000);
        } else {
            slackTools.sendMessage(config.debugChannel, "Warning! Error spam, stopping bot");
            process.exit();
        }
    } else {
        console.error("Caught Error:", type, error);
        if (config.debugChannel)
            slackTools.sendMessage(config.debugChannel, "ABNORMAL ERROR: Caught " + type + ' ```' + error + '```');
    }
});

slackClient.on('close', err => {
    sendErrorToDebugChannel('slackClientError', "Websocket Connection Terminated, Restarting - " + err);
    setTimeout(function() {
        process.exit(1);
    }, 500);
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