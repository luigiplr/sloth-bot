import path from 'path';
import fs from 'fs-extra';
import Promise from 'bluebird';
import loki from 'lokijs';

const fileExists = filePath => {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
};

const dbDir = path.join(process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'], '.Sloth-Bot');
const dbFile = path.join(dbDir, 'database.json');


if (!fs.existsSync(dbDir))
    fs.mkdirSync(dbDir);

if (!fileExists(path.join(dbDir, 'database.json')))
    fs.writeFileSync(path.join(dbDir, 'database.json'), '');

const getFormattedDate = () => {
    var date = new Date();
    var str = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + "-" +  date.getHours() + "-" + date.getMinutes() + '-' + date.getSeconds();

    return str;
};

class Database {
    constructor() {
        this.db = new loki(dbFile, {
            autoload: true,
            autosave: true
        });
    }

    save(Collection, data, opts) {
        if (this.db.getCollection(Collection) === null) {
            let newCol = opts ? this.db.addCollection(Collection, {indices: [opts.index]}) : this.db.addCollection(Collection);
            if (opts && opts.ensureUnique)
                newCol.ensureUniqueIndex(opts.index);
        }

        try {
            fs.copySync(dbFile, path.join(dbDir, 'db-backup-' + getFormattedDate() + '.json'));
        } catch (err) {
            console.log(err);
        }

        Collection = this.db.getCollection(Collection);
        return new Promise((resolve, reject) => {
            try {
                Collection.insert(data);
                this.db.saveDatabase();
                resolve(true);
            } catch (e) {
                reject(e);
            }

        });
    }

    get(Collection, data) {
        Collection = this.db.getCollection(Collection);
        return new Promise((resolve, reject) => {
            if (Collection === null)
                return reject('NOCOLLECTION');

            let result = Collection.where(obj => {
                return data.value === obj[data.key];
            });

            resolve(result);
        });
    }
}

module.exports = new Database();