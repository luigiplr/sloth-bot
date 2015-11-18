var Slack = require('slack-client');
var readline = require('readline');
var _ = require('lodash');

var parseMsg = require('./parseMsg');

var config = require('./../config.json');

var rl = readline.createInterface(process.stdin, process.stdout);

var slack = new Slack(require('./../config.json').slackAPIToken, true, true);

slack.on('open', function() {
    var channel, channels, group, groups, id, messages, unreads;
    channels = [];
    groups = [];
    unreads = slack.getUnreadCount();
    channels = (function() {
        var ref, results;
        ref = slack.channels;
        results = [];
        for (id in ref) {
            channel = ref[id];
            if (channel.is_member) {
                results.push("#" + channel.name);
            }
        }
        return results;
    })();
    groups = (function() {
        var ref, results;
        ref = slack.groups;
        results = [];
        for (id in ref) {
            group = ref[id];
            if (group.is_open && !group.is_archived) {
                results.push(group.name);
            }
        }
        return results;
    })();
    console.log("Welcome to Slack. You are @" + slack.self.name + " of " + slack.team.name);
    console.log('You are in: ' + channels.join(', '));
    console.log('As well as: ' + groups.join(', '));
    messages = unreads === 1 ? 'message' : 'messages';
    return console.log("You have " + unreads + " unread " + messages);
});

slack.on('message', function(message) {
    var channel, channelError, channelName, errors, response, text, textError, ts, type, typeError, user, userName;
    channel = slack.getChannelGroupOrDMByID(message.channel);
    user = slack.getUserByID(message.user);
    response = '';
    type = message.type, ts = message.ts, text = message.text;
    channelName = (channel != null ? channel.is_channel : void 0) ? '#' : '';
    channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');
    userName = (user != null ? user.name : void 0) != null ? "@" + user.name : "UNKNOWN_USER";
    if (type === 'message' && (text != null) && (channel != null)) {
        if (text.charAt(0) === config.prefix) {
            parseMsg.parse(text, userName, channel.id).then(function(responsefromparse) {
                if (typeof responsefromparse === 'object' && !Array.isArray(responsefromparse)) {
                    slack.openDM(message.user, function(openDmData) {
                        if (openDmData.ok) {
                            var dmChannel = slack.getChannelGroupOrDMByID(openDmData.channel.id);
                            if (Array.isArray(responsefromparse.msg)) {
                                responsefromparse.msg.forEach(function(responseline) {
                                    console.log('REPLY: ', responseline);
                                    dmChannel.send(responseline);
                                });
                            } else {
                                console.log('REPLY: ', responsefromparse.msg);
                                dmChannel.send(responsefromparse.msg);
                            }
                        }
                    });
                } else {
                    if (Array.isArray(responsefromparse)) {
                        responsefromparse.forEach(function(responseline) {
                            console.log('REPLY: ', responseline);
                            channel.send(responseline);
                        });
                    } else {
                        console.log('REPLY: ', responsefromparse);
                        channel.send(responsefromparse);
                    }
                }
            });
        } else if (text.toLowerCase().indexOf(config.botname) >= 0) {
            parseMsg.handleCustom(text, userName).then(function(responsefromparse) {
                if (responsefromparse) {
                    if (Array.isArray(responsefromparse)) {
                        responsefromparse.forEach(function(responseline) {
                            console.log(responseline);
                            channel.send(responseline);
                        });
                    } else {
                        channel.send(responsefromparse);
                    }
                }
            });
        }
    }
});

rl.on('line', function(cmd) {
    switch (cmd.split(' ')[0]) {
        case 'say':
            var channel = _.filter(slack.channels, function(item) {
                return item.name === cmd.split(' ')[1];
            });
            channel = slack.getChannelGroupOrDMByID(channel[0].id);
            channel.send(cmd.split(' ').splice(2).join(' '));
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



slack.on('error', function(error) {
    return console.error("Error: " + error);
});

slack.login();


process.on('uncaughtException', function(err) {
    console.log(err);
});