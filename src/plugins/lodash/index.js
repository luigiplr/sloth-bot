import Promise from 'bluebird';
import _ from 'lodash';
import needle from 'needle';
import cheerio from 'cheerio';

let fetched, fetching, lodashFunctions = {};

module.exports = {
  commands: [{
    alias: ['lodash'],
    command: 'lodash'
  }],
  help: [{
    command: ['lodash'],
    usage: 'lodash <command>'
  }],
  lodash(user, channel, input) {
    return new Promise((resolve, reject) => {
      if (!input)
        return resolve({
          type: 'dm',
          message: 'Usage: lodash <command> | Searches for lodash function'
        });
      _getLodashFunctions().then(() => {
        let method = input.replace('_.', '').replace('_', '')
        if (lodashFunctions[method.toLowerCase()]) {
          let cmd = lodashFunctions[method.toLowerCase()]
          let msg = [`*Method:* _.${cmd.name}`,
            `*Command:* \`${cmd.command}\``,
            `*Since:* ${cmd.since}`,
            `*Description:* ${_.trunc(cmd.description.split('\n\n\n').slice(0, 1).toString().replace(/(\n)+/g, ' '), 300)}`,
            `<https://lodash.com/docs#${cmd.name}|lodash.com/docs#${cmd.name}>`
          ];
          return resolve({
            type: 'channel',
            messages: msg
          })
        } else reject("No function with that name")
      }).catch(reject)
    });
  }
};

const _getLodashFunctions = () => {
  return new Promise((resolve, reject) => {
    if (fetched) return resolve()
    if (fetching) return reject("Error: Fetching in progress, try again later pls")
    fetching = true

    needle.get('https://lodash.com/docs', (err, resp, body) => {
      if (err || !body) return reject("Error")
      let $ = cheerio.load(body);
      $('.doc-container div div').each((index, elem) => {
        let name = $('h3 a', elem).attr('id');
        let command = $('h3 code', elem).text();
        let description = $('p:nth-of-type(2)', elem).text();
        let since = $('h4:nth-of-type(1)', elem).next().text();

        lodashFunctions[name.toLowerCase()] = { name, command, description, since }
      })
      fetched = true;
      return resolve()
    })
  })
}

_getLodashFunctions();
