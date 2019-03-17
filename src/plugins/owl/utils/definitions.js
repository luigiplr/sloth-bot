/**
 * Schedule
 * @typedef Schedule
 * @property {string} stardDate
 * @property {string} endDate
 * @property {[Stage]} stages
 */

/**
 * Stage
 * @typedef Stage
 * @property {string} name
 * @property {bool} enabled
 * @property {Number} id
 * @property {[Tournament]} tournaments
 * @property {[Match]} matches
 * @property {[StageWeek]} weeks
 */

/**
 * StageWeek
 * @typedef StageWeek
 * @property {number} id
 * @property {number} startDate
 * @property {number} endDate
 * @property {string} name
 */

/**
 * WeekDays
 * @typedef WeekDays
 * @property {string} date
 * @property {number} timestamp
 * @property {DayDisplayDate} displayDate
 * @property {[Match]} matches
 */

/**
 * DayDisplayDate
 * @typedef DayDisplayDate
 * @property {string} dayOfWeek
 * @property {string} monthAndDay
 */

/**
 * Match
 * @typedef Match
 * @property {Number} id
 * @property {string} startDate
 * @property {string} endDate|
 * @property {number} startDateTS
 * @property {number} endDateTS
 * @property {[Score]} scores
 * @property {string} state
 * @property {[Game]} games
 * @property {[Competitor]} competitors
 * @property {Competitor} winner
 * @property {Array} wins
 * @property {Array} ties
 * @property {Array} losses
 * @property {Tournament} tournament
 */

/**
 * Competitor
 * @typedef Competitor
 * @property {Number} id
 * @property {string} type
 * @property {string} handle
 * @property {string} name
 * @property {string} game
 * @property {string} homeLocation
 * @property {string} logo
 * @property {string} icon
 * @property {string} abbreviatedName
 * @property {string} addressCountry
 * @property {string} primaryColor
 * @property {string} secondaryColor
 * @property {string} secondaryPhoto
 * @property {CompetitorAttributes} attributes
 */

/**
 * CompetitorAttributes
 * @typedef CompetitorAttributes
 * @property {string} city
 * @property {string} hero_image
 * @property {string} manager
 * @property {string} team_guid
 */

/**
 * Player
 * @typedef Player
 * @property {Number} id
 * @property {string} type
 * @property {string} handle
 * @property {string} name
 * @property {string} familyName
 * @property {string} givenName
 * @property {string} game
 * @property {string} homeLocation
 * @property {string} nationality
 * @property {PlayerAttributes} attributes
 * @property {PlayerAttributes} attributes
 */

/**
 * PlayerAttributes
 * @typedef PlayerAttributes
 * @property {string} hero_image
 * @property {[string]} heroes
 * @property {string} hometown
 * @property {Number} player_number
 * @property {string} preferred_slot
 * @property {string} role
 */

/**
 * PlayerTeam
 * @typedef PlayerTeam
 * @property {[]} flags
 * @property {Object} player
 * @property {number} player.id
 * @property {string} player.type
 * @property {Competitor} team
 */

/**
 * Team
 * @typedef PlayerTeam
 * @property {any} flags
 * @property {any} player
 * @property {Team} team
 */

/**
 * Tournament
 * @typedef Tournament
 * @property {Number} id
 * @property {string} type
 */

/**
 * Score
 * @typedef Score
 * @property {Number} value
 */

/**
 * Game
 * @typedef Game
 * @property {Number} id
 * @property {Number} number
 * @property {Array} points
 * @property {string} state
 * @property {Attributes} attributes
 * @property {string} attributesVersion
 */

/**
 * Attributes
 * @typedef Attributes
 * @property {string} instanceID
 * @property {string} map
 * @property {MapScore} mapScore
 */

/**
 * MapScore
 * @typedef MapScore
 * @property {Number} team1
 * @property {Number} team2
 */

/**
 * Standings
 * @typedef Standings
 * @property {Number} id
 * @property {Number} divisionId
 * @property {string} name
 * @property {string} abbreviatedName
 * @property {StandingsRankRecords} league
 * @property {StandingsRankRecords} preseason
 * @property {StandingsRankRecords} divLeader
 * @property {StandingsRankRecords} wildcard
 * @property {StandingsRankRecordsStageContainer} stages
 */

/**
 * @typedef StandingsRankRecordsStageContainer
 * @property {StandingsRankRecords} stage1
 * @property {StandingsRankRecords} stage2
 * @property {StandingsRankRecords} stage3
 * @property {StandingsRankRecords} stage4
 */

/**
 * StandingsRank
 * @typedef StandingsRank
 * @property {Number} placement
 * @property {Number} advantage
 * @property {Competitor} competitor
 * @property {[StandingsRankRecords]} records
 */

/**
 * StandingsRankRecords
 * @typedef StandingsRankRecords
 * @property {Number} matchWin
 * @property {Number} matchLoss
 * @property {Number} matchDraw
 * @property {Number} matchBye
 * @property {Number} gameWin
 * @property {Number} gameLoss
 * @property {Number} gameTie
 * @property {Number} gamePointsFor
 * @property {Number} gamePointsAgainst
 * @property {[StandingsRankRecordsComparisons]} comparisons
 */

/**
 * StandingsRankRecordsComparisons
 * @typedef StandingsRankRecordsComparisons
 * @property {string} key
 * @property {Number} value
 */

/**
 * MappedStandings
 * @typedef MappedStandings
 * @property {[MappedStandingsScores]} data
 * @property {Number} updated
 */

/**
 * MappedStandingsScores
 * @typedef MappedStandingsScores
 * @property {string} name
 * @property {Number} match_wins
 * @property {Number} match_losses
 * @property {Number} match_win_percent
 * @property {Number} map_wins
 * @property {Number} map_losses
 * @property {Number} map_ties
 * @property {Number} map_win_percent
 */
