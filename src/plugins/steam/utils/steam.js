import _ from 'lodash';
import Promise from 'bluebird';
import needle from 'needle';
import cheerio from 'cheerio';
import async from 'async';
import SteamID from 'steamid';

const token = require('./../../../../config.json').steamAPIToken;
const endpoints = {
	profile: 'http://steamcommunity.com/id/%id%/?xml=1',
	profileSummary: 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + token + '&steamids=%id%',
	miniProfile: 'http://steamcommunity.com/miniprofile/%id%',
	gameSummary: 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + token + '&steamid=%id%&include_played_free_games=1',
	appDetailsBasic: 'http://store.steampowered.com/api/appdetails?appids=%id%&filters=basic',
	appDetails: 'http://store.steampowered.com/api/appdetails?appids=%id%&filters=basic,price_overview,release_date,metacritic',
	numPlayers: 'http://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=%id%',
	userBans: 'http://api.steampowered.com/ISteamUser/GetPlayerBans/v0001/?key=' + token + '&steamids=%id%',
	appList: 'http://api.steampowered.com/ISteamApps/GetAppList/v0002/'
};

var appList;

const getUrl = ((type, id) => {
    return endpoints[type].replace('%id%', id);
});

const getIDFromProfile = (id => {
	return new Promise((resolve, reject) => {
		needle.get(getUrl('profile', id), (err, resp, body) => {
			if (!err && body) {
				if (body.profile) {//body.profile will be returned if valid profile
					resolve(body.profile.steamID64);
				} else { //if invalid pofile body.response will contain a .error
					resolve(body.response);
				}
			} else {
				reject('Error retrieving profile ID');
			}
		});
	});
});

const formatProfileID = (id => {
	return new Promise((resolve, reject) => {
		if (id.match(/^[0-9]+$/) || id.match(/^STEAM_([0-5]):([0-1]):([0-9]+)$/) || id.match(/^\[([a-zA-Z]):([0-5]):([0-9]+)(:[0-9]+)?\]$/)) {
			let sID = new SteamID(id);
			if (sID.isValid())
				resolve(sID.getSteamID64());
			else
				reject('Invalid ID');
		} else {
			getIDFromProfile(id).then(newID => {
				if (newID.error)
					reject(newID.error);
				else
					resolve(newID);
			}).catch(reject);
		}
	});
});

const getUserLevel = (id => {
	return new Promise(resolve => {
		// Hacky way to get the AccountID from ID64
		let accountID = id.substr(3) - 61197960265728;
		needle.get(getUrl('miniProfile', accountID), (err, resp, body) => {
			if (!err) {
				let $ = cheerio.load(body);
				let level = $('.friendPlayerLevelNum').text();
				resolve(level);
			} else {
				resolve(0);
			}
		});
	});
});

const getUserBans = (id => {
	return new Promise(resolve => {
		needle.get(getUrl('userBans', id), (err, resp, body) => {
			if (!err && body.players[0]) {
				resolve(body.players[0]);
			} else {
				resolve(0);
			}
		});
	});
});

const getUserGames = (id => {
	return new Promise((resolve, reject) => {
		needle.get(getUrl('gameSummary', id), (err, resp, body) => {
			if (!err && body && body.response) {
				resolve(body.response);
			} else
				reject('Error retrieving user games');
		});
	});
});

const getAppDetails = ((appid, basic) => {
	return new Promise((resolve, reject) => {
		needle.get(getUrl(basic ? 'appDetailsBasic' : 'appDetails', appid), (err, resp, body) => {
			if (!err && body) {
				if (body[appid].success)
					resolve(body[appid].data);
				else
					reject("Couldn't fetch app details for that AppID, invalid? " + appid);
			} else
				reject('Error retrieving game details');
		});
	});
});

const getAppsByName = (appName => {
	return new Promise((resolve, reject) => {
		appList = require('./../../../../steamGames.json').applist.apps;
		let apps = appList.filter(function(game) {
			if (game.name.toUpperCase().replace('-',' ').replace('™', '').replace('©', '').replace('®', '').indexOf(appName.toUpperCase().replace('-',' ').replace('™', '').replace('©', '').replace('®', '')) >= 0)
				return game;
		});
		if (apps[0] && apps.length >= 3)
			resolve(apps.slice(0, 3));
		else if (apps[0])
			resolve([apps[0]]);
		else
			reject("Couldn't find a game with that name");
	});
});

const findValidAppInApps = (apps => {
	return new Promise((resolve, reject) => {
		let valid = false;
		const CheckQueue = async.queue((appID, next) => {
		    getAppDetails(appID.appid)
		        .then(app => {
		        	console.log(app.type, app.name);
		            if (app.type === 'game') {
		                valid = true;
		            	resolve(app);
		            }
		            
		            if (!valid && next)
		                process.nextTick(next);
		            else
		                CheckQueue.kill();
		        });
		});

		CheckQueue.drain = () => {
			reject("Couldn't find a valid game with that name");
		};

		_.forEach(apps, app => {
		    CheckQueue.push(app);
		});
	});
});

const getPlayersForApp = (appid => {
	return new Promise((resolve, reject) => {
		needle.get(getUrl('numPlayers', appid), (err, resp, body) => {
			if (!err && body)
				if (typeof body.response.player_count != 'undefined')
					resolve(body.response);
				else
					reject('Unable to view player counts for this app');
			else
				reject('Error retrieving player counts');
		});
	});
});

module.exports = {
	getProfileInfo (id) {
		return new Promise((resolve, reject) => {
			formatProfileID(id).then(newID => {
				needle.get(getUrl('profileSummary', newID), (err, resp, body) => {
					if (!err && body) {
						let profile = body.response.players[0];
						getUserLevel(newID).then(level => {
							profile.user_level = level;
						});
						getUserBans(newID).then(bans => {
							profile.bans = bans;
						});
						getUserGames(newID).then(games => {
							let sortedGames = games.games.sort((a, b) => {
								return b.playtime_forever - a.playtime_forever;
							});
							profile.totalgames = games.game_count;
							profile.mostplayed = sortedGames[0];
							getAppDetails(sortedGames[0].appid).then(game => {
								if (game) {
									profile.mostplayed.name = game.name;
									resolve(profile);
								}
							}).catch(reject);
						}).catch(reject);
					} else {
						reject('Error retrieving profile info');
					}
				});
			}).catch(reject);
		});
	},
	getAppPlayers (appid) {
		return new Promise((resolve, reject) => {
			if (!appid.match(/^\d+$/)) {
				getAppsByName(appid).then(apps => {
					findValidAppInApps(apps).then(app => {
						getPlayersForApp(app.steam_appid).then(players => {
							players.name = app.name;
							resolve(players);
						}).catch(reject);
					}).catch(reject);
				}).catch(reject);
			} else {
				Promise.join(getAppDetails(appid, true), getPlayersForApp(appid), (app, players) => {
					players.name = app.name;
					resolve(players);
				}).catch(reject);
			}
		});
	},
	getAppInfo (appid) {
		return new Promise((resolve, reject) => {
			if (!appid.match(/^\d+$/)) {
				getAppsByName(appid).then(apps => {
					findValidAppInApps(apps).then(app => {
						getPlayersForApp(app.steam_appid).then(players => {
							app.player_count = players.player_count;
							resolve(app);
						}).catch(err => {
							// If we can't fetch player counts just return anyway
							console.log(err);
							resolve(app);
						});
					}).catch(reject);
				}).catch(reject);
			} else {
				getAppDetails(appid).then(app => {
					getPlayersForApp(app.appid).then(players => {
						app.player_count = players.player_count;
						resolve(app);
					}).catch(err => {
						// If we can't fetch player counts just return anyway
						console.log(err);
						resolve(app);
					});
				}).catch(reject);
			}
		});
	}
};