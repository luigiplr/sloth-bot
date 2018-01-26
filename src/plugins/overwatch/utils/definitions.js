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
 * @property {[StandingsRank]} ranks
 * @property {{}} season
 * @property {{}} stages
 * @property {{}} owl_divisions
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
 */

