import path from 'path'
import Promise from 'bluebird';
import loki from 'lokijs';


module.exports = {
    init() {
        this.db = new loki(path.normalize(path.join(process.env.APPDATA, 'Sloth-Bot', 'database.json')), {
            autoload: true,
            autosave: true
        });
    },

    save(Collection, data) {

        if (this.db.getCollection(Collection) === null)
            this.db.addCollection(Collection);

        Collection = this.db.getCollection(Collection);
        return new Promise((resolve, reject) => {
            Collection.insert(data);
            this.db.saveDatabase();
            resolve(true);
        });
    },

    get(Collection, data) {
        Collection = this.db.getCollection(Collection);
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