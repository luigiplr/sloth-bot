import path from 'path'
import fs from 'fs';
import Promise from 'bluebird';
import loki from 'lokijs';

var db;

module.exports = {
    init(dir = path.join(process.env.APPDATA, 'Sloth-Bot')) {
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);
        db = new loki(path.join(dir, 'database.json'), {
            autoload: true,
            autosave: true
        });
    },

    save(Collection, data) {

        if (db.getCollection(Collection) === null)
            db.addCollection(Collection);

        Collection = db.getCollection(Collection);
        return new Promise((resolve, reject) => {
            try {
                Collection.insert(data);
                db.saveDatabase();
                resolve(true);
            } catch (e) {
                reject(e);
            }

        });
    },

    get(Collection, data) {
        Collection = db.getCollection(Collection);
        return new Promise(function(resolve, reject) {
            if (Collection === null)
                return reject('NOCOLLECTION');

            let result = Collection.where(function(obj) {
                return data.value === obj[data.key];
            });

            resolve(result);
        });
    }
};