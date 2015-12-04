import Promise from 'bluebird';
import fs from 'fs';
import path from 'path';
import uuid from 'node-uuid';

const dbDir = path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.Sloth-Bot');
const permsFile = path.join(dbDir, 'permissions.json');


const fileExists = filePath => {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}


if (!fs.existsSync(dbDir))
    fs.mkdirSync(dbDir);

if (!fileExists(permsFile))
    fs.writeFileSync(permsFile, JSON.stringify({
        users: [],
        admins: []
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
        this.userList = [];
        this.ignoreList = [];

        this.refresh();
    }

    get admins() {
        return this.adminList;
    }

    get users() {
        return this.userList;
    }

    get ignored() {
        return this.ignoreList;
    }

    add(username, mode) {
        switch (mode) {
            case 'admin':
                this.userList.splice(this.userList.indexOf(username), 1);
                this.adminList.push(username);
                break;
            case 'user':
                var index = this.adminList.indexOf(username);
                if (index > -1) {
                    this.adminList.splice(index, 1);
                }
                this.userList.push(username);
                break;
            default:
                return false;
        }
        console.log('Adding', username, 'as', mode);

        saveJson(permsFile, {
            users: this.userList,
            admins: this.adminList
        });

    }

    refresh() {
        readJson(permsFile)
            .then(json => {
                this.userList = json.users;
                this.adminList = json.admins;
            })
    }


}





module.exports = new Perms();