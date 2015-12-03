import path from 'path'
import fs from 'fs';
import Promise from 'bluebird';
import loki from 'lokijs';


const fileExists = filePath => {
    try {
        return fs.statSync(filePath).isFile();
    } catch (err) {
        return false;
    }
}

const dbDir = path.join(process.env.APPDATA, 'Sloth-Bot');

if (!fs.existsSync(dbDir))
    fs.mkdirSync(dbDir);

if (!fileExists(path.join(dbDir, 'database.json')))
    fs.writeFileSync(path.join(dbDir, 'database.json'), '');


class Database {
    constructor() {
        this.db = new loki(path.normalize(path.join(dbDir, 'database.json')), {
            autoload: true,
            autosave: true
        });
    }

    save(Collection, data) {

        if (this.db.getCollection(Collection) === null)
            this.db.addCollection(Collection);

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