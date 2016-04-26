import path from 'path';
import fs from 'fs-extra';
import Promise from 'bluebird';
import CRUD from 'createreadupdatedelete.js';

const dbname = 'database.sqlite'
const fileExists = filePath => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};

const dbDir = path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.Sloth-Bot');
const dbFile = path.join(dbDir, 'database.sqlite');

if (!fs.existsSync(dbDir))
  fs.mkdirSync(dbDir);

function SwearUsers() {
  CRUD.Entity.call(this);
}

CRUD.define(SwearUsers, {
  table: 'SwearUser',
  primary: 'swearUserId',
  fields: ['swearUserId', 'user', 'lastUpdated'],
  createStatement: 'CREATE TABLE SwearUser (swearUserId INTEGER PRIMARY KEY NOT NULL, user VARCHAR(128) NOT NULL, lastUpdated DATETIME)'
});

function SwearCommits() {
    CRUD.Entity.call(this);
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
  createStatement: 'CREATE TABLE SwearCommit (swearCommitId INTEGER PRIMARY KEY NOT NULL, message VARCHAR(1024) NOT NULL, url VARCHAR(512) NOT NULL, sha VARCHAR(128), user VARCHAR(256) NOT NULL, repo VARCHAR(256) NOT NULL)',
});

function Quotes() {
  CRUD.Entity.call(this);
}

CRUD.define(Quotes, {
  table: 'Quote', // Database table this entity is bound to
  primary: 'quoteId', // Primary key. Make sure to use uniquely named keys, don't use 'id' on every table and refer to 'id_something'
  fields: [ // List all individual properties including primary key. Accessors will be auto-created (but can be overwritten)
    'quoteId',
    'quotedUser',
    'message',
    'grabUser',
    'date'
  ],
  createStatement: 'CREATE TABLE Quote (quoteId INTEGER PRIMARY KEY NOT NULL, quotedUser VARCHAR(128) NOT NULL, message VARCHAR(4000) NOT NULL, grabUser VARCHAR(128), date DATETIME)',
});

CRUD.setAdapter(new CRUD.SQLiteAdapter(dbFile, {
  estimatedSize: 25 * 1024 * 1024
}));

module.exports = { Quotes, SwearCommits, SwearUsers };
