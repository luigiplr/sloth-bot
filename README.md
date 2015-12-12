# sloth-bot
Slack bot full of fun commands

## Installation
#### Install the required package dependancies
```npm install```
#### Build the bot
```grunt install```

## Usage
```node build/index``` or ```grunt run```

## Config File
config.json should resemble:
```
{
	"botname":			"sloth", 	// name of the bot in slack
	"prefix":			"!", 		// prefix to use bot commands
	"slackToken":		"xxxxx", 	// your account token (for evelated commands) or the bots own token
	"slackAPIToken":	"xxxxx",	// the bots token for connecting to slack
	"googleToken":		"xxxxx" 	// youtube token 
}

```

## License
```
/*
 * ----------------------------------------------------------------------------
 * "THE BEER-WARE LICENSE" (Revision 42):
 * Luigi POOLE wrote this. You can do whatever you want with this stuff.
 * If we meet some day, and you think this stuff is worth it,
 * you can buy me a beer in return.
 * ----------------------------------------------------------------------------
 */
 ```
