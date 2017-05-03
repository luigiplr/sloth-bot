import path from 'path'
import fs from 'fs'
import CRUD from 'createreadupdatedelete.js'
import config from '../config'

const dirName = config.saveName || '.Sloth-Bot'
const dbDir = path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], dirName)
const dbFile = path.join(dbDir, 'database.sqlite')

if (!fs.existsSync(dbDir))  {
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
    'quoteId',
    'quotedUser',
    'message',
    'grabUser',
    'date'
  ],
  orderProperty: 'date',
  orderDirection: 'DESC',
  createStatement: 'CREATE TABLE Quote (quoteId INTEGER PRIMARY KEY NOT NULL, quotedUser VARCHAR(128) NOT NULL, message VARCHAR(4000) NOT NULL, grabUser VARCHAR(128), date DATETIME)'
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

export function getUserAliases(user, service) {
  return new Promise((resolve, reject) => {
    if (user.startsWith('@')) {
      user = user.slice(1)
    } else if (user.startsWith('<@')) {
      user = user.slice(2, -1)
    } else return resolve(user)
    return _getUserAliases(user, service).then(data => {
      if (!data[0]) return reject("User has no alias set, set one with the alias command") 
      return resolve(data[0].alias)
    }, reject)
  })
}

CRUD.define(Aliases, {
  table: 'Aliases',
  primary: 'aliasID',
  fields: ['aliasID', 'user', 'alias', 'service'],
  createStatement: 'CREATE TABLE Aliases (aliasID INTEGER PRIMARY KEY NOT NULL, user VARCHAR(128) DEFAULT (NULL), alias VARCHAR(128) DEFAULT (NULL), service VARCHAR(128) DEFAULT (NULL))'
})

CRUD.setAdapter(new CRUD.SQLiteAdapter(dbFile, {
  estimatedSize: 25 * 1024 * 1024
}))
