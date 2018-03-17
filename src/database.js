import path from 'path'
import fs from 'fs'
import CRUD from 'createreadupdatedelete.js'
import config from '../config'

const dirName = config.saveName || '.Sloth-Bot'
const dbDir = path.join(process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'], dirName)
const dbFile = path.join(dbDir, 'database.sqlite')

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir)
}

export default CRUD

export function Quotes() {
  CRUD.Entity.call(this)
}

CRUD.define(Quotes, {
  table: 'Quote',
  primary: 'quoteId',
  fields: [
    'id',
    'user',
    'message',
    'grabbed_by',
    'grabbed_at',
    'message_id'
  ],
  orderProperty: 'date',
  orderDirection: 'DESC',
  createStatement: 'CREATE TABLE Quote (id INTEGER PRIMARY KEY NOT NULL, user VARCHAR(128) NOT NULL, message VARCHAR(4000) NOT NULL, grabbed_by VARCHAR(128), grabbed_at DATETIME, message_id NUMERIC UNIQUE)',
  migrations: {
    3: [
      'ALTER TABLE Quote RENAME TO Quote_bak',
      'CREATE TABLE Quote (id INTEGER PRIMARY KEY NOT NULL, user VARCHAR(128) NOT NULL, message VARCHAR(4000) NOT NULL, grabbed_by VARCHAR(128), grabbed_at DATETIME, message_id NUMERIC UNIQUE)',
      'INSERT OR IGNORE INTO Quote (id, user, message, grabbed_by, grabbed_at) SELECT quoteId, quotedUser, message, grabUser, date FROM Quote_bak',
      'DROP TABLE Quote_bak'
    ]
  }
})

export function InviteUsers() {
  CRUD.Entity.call(this)
}

CRUD.define(InviteUsers, {
  table: 'InviteUsers',
  primary: 'inviteUserId',
  fields: ['inviteUserId', 'inviter', 'email', 'invitedUser', 'date'],
  orderProperty: 'date',
  orderDirection: 'DESC',
  createStatement: 'CREATE TABLE InviteUsers (inviteUserId INTEGER PRIMARY KEY NOT NULL, inviter VARCHAR(128) DEFAULT (NULL), email VARCHAR(128) DEFAULT (NULL), invitedUser VARCHAR(128) DEFAULT (NULL), date DATETIME)'
})

export function Aliases() {
  CRUD.Entity.call(this)
}

export function _getUserAliases(user, service) {
  return CRUD.Find('Aliases', Object.assign({}, { user }, service ? { service } : {}))
}

export function getUserAliases(user, service, isID) {
  return new Promise((resolve, reject) => {
    if (user.startsWith('@')) {
      user = user.slice(1)
    } else if (user.startsWith('<@')) {
      user = user.slice(2, -1)
    } else if (!isID) {
      return resolve(user)
    }

    return _getUserAliases(user, service).then(data => {
      if (!data[0]) return reject("User has no alias set, set one with the alias command")
      return resolve(data[0].alias)
    }, reject)
  })
}

export async function tryGetUserAlias(user, service, isID) {
  try {
    return getUserAliases(user, service, isID)
  } catch (e) {
    return null
  }
}

CRUD.define(Aliases, {
  table: 'Aliases',
  primary: 'aliasID',
  fields: ['aliasID', 'user', 'alias', 'service'],
  createStatement: 'CREATE TABLE Aliases (aliasID INTEGER PRIMARY KEY NOT NULL, user VARCHAR(128) DEFAULT (NULL), alias VARCHAR(128) DEFAULT (NULL), service VARCHAR(128) DEFAULT (NULL))'
})

export function Remembers() {
  CRUD.Entity.call(this)
}

CRUD.define(Remembers, {
  table: 'Remembers',
  primary: 'id',
  fields: ['id', 'user', 'text', 'date', 'word', 'protected'],
  orderProperty: 'date',
  orderDirection: 'DESC',
  createStatement: 'CREATE TABLE Remembers (id INTEGER PRIMARY KEY NOT NULL, user VARCHAR(128) DEFAULT (NULL), text VARCHAR(4000) DEFAULT (NULL), date DATETIME DEFAULT CURRENT_TIMESTAMP, word VARCHAR(128) DEFAULT (NULL), protected INTEGER DEFAULT 0)',
  migrations: {
    2: [
      'ALTER TABLE Remembers RENAME TO Remembers_bak',
      'CREATE TABLE Remembers (id INTEGER PRIMARY KEY NOT NULL, user VARCHAR(128) DEFAULT (NULL), text VARCHAR(4000) DEFAULT (NULL), date DATETIME DEFAULT CURRENT_TIMESTAMP, word VARCHAR(128) DEFAULT (NULL), protected INTEGER DEFAULT 0)',
      'INSERT OR IGNORE INTO Remembers (id, user, text, date, word) SELECT id, user, text, date, word FROM Remembers_bak',
      'DROP TABLE Remembers_bak'
    ]
  }
})

CRUD.setAdapter(new CRUD.SQLiteAdapter(dbFile, {
  estimatedSize: 25 * 1024 * 1024
}))
