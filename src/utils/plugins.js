import path from 'path';
import fs from 'fs';

module.exports = {
  find(dir = './src/plugins') {
    return fs.readdirSync(dir).filter(file => {
      return fs.statSync(path.join(dir, file)).isDirectory();
    });
  }
};

