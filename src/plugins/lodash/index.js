import Promise from 'bluebird';
import lodashFunctions from './utils/lodash'

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

      let method = input.replace('_.', '').replace('_', '')
      if (lodashFunctions[method.toLowerCase()]) {
        let cmd = lodashFunctions[method.toLowerCase()]
        if (cmd.dontShow) return resolve({ type: channel, messages: [`<https://lodash.com/docs#${cmd.name}|lodash.com/docs#${cmd.name}>`] })
        let msg = [`*Method:* _.${cmd.name}`,
          `*Command:* \`${cmd.command}\``,
          `*Since:* ${cmd.since}`,
          `*Description:* ${cmd.description}`,
          `<https://lodash.com/docs#${cmd.name}|lodash.com/docs#${cmd.name}>`
        ];
        return resolve({
          type: 'channel',
          messages: msg
        })
      } else reject("No function with that name")

    });
  }
};
