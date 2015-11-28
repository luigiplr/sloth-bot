import Slack from 'slack-client';
import _ from 'lodash';
import {
    createInterface as readline
}
from 'readline';
import {
    parse as parseMsg
}
from './parseMessage';

const rl = readline(process.stdin, process.stdout);
const slackClient = new Slack(require('./../config.json').slackAPIToken, true, true);
const config = require('./../config.json');


slackClient.on('open', () => {
    let unreads = slackClient.getUnreadCount();

    console.log('Welcome to Slack. You are @', slackClient.self.name, 'of', slackClient.team.name);
    return console.log('You have', unreads, 'unread', (unreads === 1) ? 'message' : 'messages');
});


slackClient.on('message', message => {
    let user = slackClient.getUserByID(message.user);
    let channel = slackClient.getChannelGroupOrDMByID(message.channel);
    let text = message.text;

    if (message.type === 'message' && (text !== null) && (channel !== null) && (text.charAt(0) === config.prefix)) {
        parseMsg(user, channel, text)
            .then(response => {
                switch (response.type) {
                    case 'dm':
                        slackClient.openDM(message.user, dm => {
                            if (dm.ok)
                                response.message ? dm.send(response.message) : response.messages.forEach(dm.send);
                        });
                        break;
                    case 'channel':
                        response.message ? channel.send(response.message) : response.messages.forEach(channel.send);
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


rl.on('line', cmd => {
    switch (cmd.split(' ')[0]) {
        case 'say':
            var channel = _.filter(slackClient.channels, item => {
                return item.name === cmd.split(' ')[1];
            });
            slackClient.getChannelGroupOrDMByID(channel[0].id).send(cmd.split(' ').splice(2).join(' '));
            break;
        case 'quit':
        case 'exit':
            console.log('Killing Bot.');
            process.exit();
            break;
        default:
            console.log('You just typed: ' + cmd);
    }
});


process.on('uncaughtException', err => {
    console.log(err);
});