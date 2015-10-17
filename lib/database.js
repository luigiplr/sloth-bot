var Promise = require('bluebird');
var loki = require('lokijs');
var path = require('path');

module.exports = {
    init: function() {
        var dbpath = path.normalize(path.join(__dirname, '../', 'database.json'));
        this.db = new loki(dbpath, {
            autoload: true,
            autosave: true
        });

        if (this.db.getCollection('quotes') === null) {
            this.db.addCollection('quotes');
        }
        if (this.db.getCollection('myreactionwhen') === null) {
            this.db.addCollection('myreactionwhen');
        }
    },
    saveQuote: function(user, input, time) {
        var quotes = this.db.getCollection('quotes');
        var that = this;
        return new Promise(function(resolve) {
            quotes.insert({
                user: user.toLowerCase().toString(),
                quote: input.toString(),
                date: time
            });
            that.db.saveDatabase();
            resolve()
        });
    },
    getQuote: function(user) {
        var quotes = this.db.getCollection('quotes');
        var that = this;
        return new Promise(function(resolve) {
            var result = quotes.where(function(obj) {
                return user.toLowerCase().toString() === obj.user.toLowerCase().toString()
            });
            resolve(result);
        });
    },
    saveMRW: function(myreactionwhen, reaction) {
    	console.log(myreactionwhen, reaction)
        var mrwdb = this.db.getCollection('myreactionwhen');
        var that = this;
        return new Promise(function(resolve) {
            mrwdb.insert({
                mrw: myreactionwhen.toLowerCase().toString(),
                reaction: reaction.toString()
            });
            that.db.saveDatabase();
            resolve()
        });
    },
    getMRW: function(mrw) {
        var mrwdb = this.db.getCollection('myreactionwhen');
        var that = this;
        return new Promise(function(resolve) {
            var result = mrwdb.where(function(obj) {
                return mrw.toLowerCase().toString() === obj.mrw.toLowerCase().toString()
            });
            resolve(result);
        });
    }
};
