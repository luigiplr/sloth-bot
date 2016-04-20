import Promise from 'bluebird';
import fs from 'fs';
import path from 'path';

const dbDir = path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.Sloth-Bot');
const permsFile = path.join(dbDir, 'permissions.json');

const fileExists = filePath => {
  try {
    return fs.statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
};

if (!fs.existsSync(dbDir))
  fs.mkdirSync(dbDir);

if (!fileExists(permsFile))
  fs.writeFileSync(permsFile, JSON.stringify({
    admins: [],
    superadmins: [],
    ignored: []
  }));

const readJson = (jsonPath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(jsonPath, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
};

const saveJson = (jsonPath, json) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(jsonPath, JSON.stringify(json), (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};

class Perms {
  constructor() {
    this.adminList = [];
    this.superadminList = [];
    this.ignoreList = [];
    this.muteList = [];
    this.permaIgnoreList = [];

    this.refresh();
  }

  get superadmins() {
    return this.superadminList;
  }

  get admins() {
    return this.adminList;
  }

  get ignored() {
    return this.ignoreList;
  }

  get muted() {
    return this.muteList;
  }

  get permaIgnored() {
    return this.permaIgnoreList;
  }

  get allIgnored() {
    return this.ignoreList.concat(this.permaIgnored);
  }

  add(username, mode) {
    switch (mode) {
      case 'superadmin':
        if (this.adminList.indexOf(username) > -1) {
          this.adminList.splice(this.adminList.indexOf(username), 1);
        }
        if (this.superadminList.indexOf(username) === -1) {
          this.superadminList.push(username);
        }
        break;
      case 'admin':
        if (this.superadminList.indexOf(username) > -1) {
          this.superadminList.splice(this.superadminList.indexOf(username), 1);
        }
        if (this.adminList.indexOf(username) === -1) {
          this.adminList.push(username);
        }
        break;
      case 'user':
        if (this.adminList.indexOf(username) > -1) {
          this.adminList.splice(this.adminList.indexOf(username), 1);
        }
        if (this.superadminList.indexOf(username) > -1) {
          this.superadminList.splice(this.superadminList.indexOf(username), 1);
        }
        break;
      case 'permaignore':
        if (this.permaIgnoreList.indexOf(username) === -1) {
          this.permaIgnoreList.push(username);
        }
        break;
      case 'ignore':
        if (this.ignoreList.indexOf(username) === -1) {
          this.ignoreList.push(username);
        }
        break;
      case 'unignore':
        if (this.ignoreList.indexOf(username) > -1) {
          this.ignoreList.splice(this.ignoreList.indexOf(username), 1);
        }
        if (this.permaIgnoreList.indexOf(username) > -1) {
          this.permaIgnoreList.splice(this.permaIgnoreList.indexOf(username), 1);
        }
        break;
      case 'mute':
        if (this.muteList.indexOf(username) === -1) {
          this.muteList.push(username);
        }
        break;
      case 'unmute':
        if (this.muteList.indexOf(username) > -1) {
          this.muteList.splice(this.muteList.indexOf(username), 1);
        }
        break;
      default:
        return false;
    }
    console.log('Adding', username, 'as', mode);

    saveJson(permsFile, {
      admins: this.adminList,
      superadmins: this.superadminList,
      ignored: this.permaIgnoreList
    });
  }

  refresh() {
    readJson(permsFile)
      .then(json => {
        this.adminList = json.admins;
        this.superadminList = json.superadmins;
        this.permaIgnoreList = json.ignored;
      });
  }
}

module.exports = new Perms();

