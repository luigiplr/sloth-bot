import path from 'path'
import fs from 'fs'
import CRUD from 'createreadupdatedelete.js'

const dbDir = path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.Sloth-Bot')
const dbFile = path.join(dbDir, 'database.sqlite')

if (!fs.existsSync(dbDir))
  fs.mkdirSync(dbDir)

export function SwearUsers() {
  CRUD.Entity.call(this)
}

CRUD.define(SwearUsers, {
  table: 'SwearUser',
  primary: 'swearUserId',
  fields: ['swearUserId', 'user', 'lastUpdated'],
  createStatement: 'CREATE TABLE SwearUser (swearUserId INTEGER PRIMARY KEY NOT NULL, user VARCHAR(128) NOT NULL, lastUpdated DATETIME)'
})

export function SwearCommits() {
  CRUD.Entity.call(this)
}

CRUD.define(SwearCommits, {
  table: 'SwearCommit',
  primary: 'swearCommitId',
  fields: [
    'swearCommitId',
    'message',
    'url',
    'sha',
    'user',
    'repo'
  ],
  createStatement: 'CREATE TABLE SwearCommit (swearCommitId INTEGER PRIMARY KEY NOT NULL, message VARCHAR(1024) NOT NULL, url VARCHAR(512) NOT NULL, sha VARCHAR(128), user VARCHAR(256) NOT NULL, repo VARCHAR(256) NOT NULL)'
})

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

export function RSSFeeds() {
  CRUD.Entity.call(this)
}

CRUD.define(RSSFeeds, {
  table: 'RSSFeeds',
  primary: 'feedId',
  fields: ['feedId', 'guid'],
  createStatement: 'CREATE TABLE RSSFeeds (feedId INTEGER PRIMARY KEY NOT NULL, guid VARCHAR(256) DEFAULT (NULL))'
})

CRUD.setAdapter(new CRUD.SQLiteAdapter(dbFile, {
  estimatedSize: 25 * 1024 * 1024
}))
