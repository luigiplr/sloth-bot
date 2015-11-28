var ChuckNorris, http;

http = require('http');

module.exports = ChuckNorris = (function() {
  function ChuckNorris(name) {
    if (name) {
      var str = name.split(" ");
      this.fname = str[0];
      this.lname = str[1] ? str[1] : '';
    } else {
      this.fname = 'Chuck';
      this.lname = 'Norris';
    }
  }

  ChuckNorris.prototype.id = function(id, cb) {
    return this._joke('jokes/' + id, cb);
  };

  ChuckNorris.prototype.random = function(c, cb) {
    if (!cb) {
      return this._joke('jokes/random', c);
    } else {
      return this._jokes('jokes/random/' + c, cb);
    }
  };

  ChuckNorris.prototype.count = function(cb) {
    return this._value('jokes/count', cb);
  };

  ChuckNorris.prototype.categories = function(cb) {
    return this._value('categories', cb);
  };

  ChuckNorris.prototype._joke = function(f, cb) {
    return this._value(f, function(err, data) {
      if (err) {
        return cb(err);
      } else {
        return cb(null, data.joke);
      }
    });
  };

  ChuckNorris.prototype._jokes = function(f, cb) {
    return this._value(f, function(err, data) {
      if (err) {
        return cb(err);
      } else {
        return cb(null, data.map(function(val) {
          return val.joke;
        }));
      }
    });
  };

  ChuckNorris.prototype._value = function(f, cb) {
    return this._req(f, function(err, data) {
      if (err) {
        return cb(err);
      } else {
        return cb(null, data.value);
      }
    });
  };

  ChuckNorris.prototype._req = function(f, cb) {
    var opts;
    opts = {
      path: '/' + f + '?firstName=' + this.fname + '&lastName=' + this.lname,
      host: 'api.icndb.com',
      port: 80
    };
    return http.get(opts, function(res) {
      var data;
      data = '';
      res.on('data', (function(_this) {
        return function(chunk) {
          return data += chunk;
        };
      })(this));
      return res.on('end', (function(_this) {
        return function() {
          var err;
          try {
            return cb(null, JSON.parse(data));
          } catch (_error) {
            err = _error;
            return cb(err);
          }
        };
      })(this));
    });
  };

  return ChuckNorris;

})();
