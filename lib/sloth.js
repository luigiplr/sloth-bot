var Slack, autoMark, autoReconnect, slack, token;

Slack = require('slack-client');
var parseMsg = require('./parseMsg');
token = 'xoxb-12623078562-h8TYPdToQk7BAqVvtxrDFgGk';

autoReconnect = true;

autoMark = true;

slack = new Slack(token, autoReconnect, autoMark);

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
        console.log(type, text)
        console.log(userName, channelName, text)
        if (text.charAt(0) === '!') {
            parseMsg.parse(text, userName, channel.id).then(function(responsefromparse) {
               if(Array.isArray(responsefromparse)){
                     responsefromparse.forEach(function(responseline) {
                        console.log(responseline)
                        channel.send(responseline);
                    });
                }else{
                     channel.send(responsefromparse);
                }
            });
        } else if (text.toLowerCase().indexOf('sloth') >= 0) {
            parseMsg.handleCustom(text, userName).then(function(responsefromparse) {
                if(Array.isArray(responsefromparse)){
                     responsefromparse.forEach(function(responseline) {
                        console.log(responseline)
                        channel.send(responseline);
                    });
                }else{
                     channel.send(responsefromparse);
                }
                
            });
        }
    }
});

slack.on('error', function(error) {
    return console.error("Error: " + error);
});

slack.login();


process.on('uncaughtException', function(err) {
    console.log(err);
})
