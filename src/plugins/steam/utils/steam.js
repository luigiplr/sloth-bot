import Promise from 'bluebird';
import needle from 'needle';
import cheerio from 'cheerio';

const token = require('./../../../../config.json').steamAPIToken;
const endpoints = {
	profile: 'http://steamcommunity.com/id/%id%/?xml=1',
	profileSummary: 'http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=' + token + '&steamids=%id%',
	miniProfile: 'http://steamcommunity.com/miniprofile/%id%',
	gameSummary: 'http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=' + token + '&steamid=%id%&include_played_free_games=1',
	appDetails: 'http://store.steampowered.com/api/appdetails?appids=%id%&filters=basic,price_overview',
	numPlayers: 'http://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=%id%'
};

var Steam, appList;

var getUrl = function(type, id) {
    return endpoints[type].replace('%id%', id);
};

module.exports = Steam = (() => {
	let SteamID = null;
	function Steam(id) {
		if (id)
			SteamID = id;
	}

	Steam.prototype.getIDFromProfile = function() {
		return new Promise((resolve, reject) => {
			needle.get(getUrl('profile', SteamID), (err, resp, body) => {
				if (!err && body) {
					if (body.profile) {//body.profile will be returned if valid profile
						SteamID = body.profile.steamID64;
						resolve(body.profile.steamID64);
					} else { //if invalid pofile body.response will contain a .error
						resolve(body.response);
					}
				} else {
					reject('Error retrieving profile ID');
				}
			});
		});
	};

	Steam.prototype.getProfileInfo = function() {
		return new Promise((resolve, reject) => {
			needle.get(getUrl('profileSummary', SteamID), (err, resp, body) => {
				if (!err && body) {
					let profile = body.response.players[0];
					this.getUserLevel().then(level => {
						profile.user_level = level;
					});
					return this.getProfileGameInfo().then(games => {
						let sortedGames = games.games.sort((a, b) => {
							return b.playtime_forever - a.playtime_forever;
						});
						profile.totalgames = games.game_count;
						profile.mostplayed = sortedGames[0];
						return this.getAppDetails(sortedGames[0].appid).then(game => {
							if (game) {
								profile.mostplayed.name = game.name;
								resolve(profile);
							}
						}).catch(reject);
					}).catch(reject);
				} else {
					return reject('Error retrieving profile info');
				}
			});
		});
	};

	Steam.prototype.getUserLevel = function() {
		return new Promise((resolve, reject) => {
			// Hacky way to get the AccountID from ID64
			let accountID = SteamID.substr(3) - 61197960265728;
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
	};

	Steam.prototype.getProfileGameInfo = function() {
		return new Promise((resolve, reject) => {
			needle.get(getUrl('gameSummary', SteamID), (err, resp, body) => {
				if (!err && body)
					resolve(body.response);
				else
					reject('Error retrieving profile game info');
			});
		});
	};

	Steam.prototype.getAppDetails = function(id) {
		return new Promise((resolve, reject) => {
			needle.get(getUrl('appDetails', id ? id : SteamID), (err, resp, body) => {
				if (!err && body) {
					id = id ? id : SteamID;
					if (body[id].success)
						resolve(body[id].data);
					else
						reject("Couldn't fetch app details for that AppID, invalid? " + id);
				} else
					reject('Error retrieving game details');
			});
		});
	};

	Steam.prototype.getNumberOfCurrentPlayers = function(id) {
		return new Promise((resolve, reject) => {
			try {
				needle.get(getUrl('numPlayers', id ? id : SteamID), (err, resp, body) => {
					if (!err && body)
						if (typeof body.response.player_count != 'undefined')
							resolve(body.response);
						else if (id)
							resolve(0);
						else
							resolve('Unable to view player counts for this app');
					else
						reject('Error retrieving player counts');
				});
			} catch (e) {
				reject(e);
			}
		});
	};

	Steam.prototype.getAppIDByGameName = function() {
		return new Promise((resolve, reject) => {
			appList = require('./../../../../steamGames.json').applist.apps;
			let apps = appList.filter(function(game) {
				if (game.name.toUpperCase().replace('-',' ').replace('™', '').replace('©', '').replace('®', '').indexOf(SteamID.toUpperCase().replace('-',' ').replace('™', '').replace('©', '').replace('®', '')) >= 0)
					return game;
			});
			if (apps[0] && apps.length > 0) {
				SteamID = apps[0].appid;
				resolve(apps);
			} else {
				reject("Couldn't find a game with that name");
			}
		});
	};

	Steam.prototype.getAppInfo = function(id) {
		return new Promise((resolve, reject) => {
			Promise.join(this.getAppDetails(id ? id : SteamID), this.getNumberOfCurrentPlayers(id ? id : SteamID), (info, players) => {
				if (info && players) {
					info.player_count = players.player_count;
					resolve(info);
				}
			}).catch(reject);
		});
	};

	return Steam;
})();