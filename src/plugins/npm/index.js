import Promise from 'bluebird';
import needle from 'needle';

module.exports = {
  commands: [{
    alias: ['npm'],
    command: 'npm'
  }],
  help: [{
    command: ['npm'],
    usage: 'npm <package> - returns info for package'
  }],
  npm(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: npm <package> - Returns information on package'
        });
      let p = input.split(' ')[0];
      needle.get(`https://registry.npmjs.com/${p}`, (err, resp, body) => {
        if (!err && body) {
          if (resp.statusCode == 404)
            return reject("Couldn't find a package with that name");

          let msg = [`*Package:* ${body.name}`,
            `*Latest Version:* ${body['dist-tags'].latest}`,
            `*Description:* ${body.description ? body.description : 'No description'}`,
            `<https://npmjs.com/package/${p}|npmjs.com/package/${p}>`
          ];
          return resolve({
            type: 'channel',
            messages: msg
          });
        } else return reject("Error contacting npmjs");
      });
    });
  }
};
