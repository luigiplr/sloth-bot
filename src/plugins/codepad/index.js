import Promise from 'bluebird'
import _ from 'lodash'
import codepad from 'codepad'
import jsEval from 'sandbox'

const langs = ['C', 'C++', 'D', 'Haskell', 'Javascript', 'Lua', 'OCaml', 'PHP', 'Perl', 'Python', 'Ruby', 'Scheme', 'Tcl']

export const plugin_info = [{
  alias: ['eval'],
  command: 'codep',
  usage: 'eval <language> <code>'
}]

export function codep(user, channel, input) {
  return new Promise((resolve, reject) => {
    if (!input || !input.split('```')[1])
      return resolve({
        type: 'dm',
        message: 'Usage: eval <langage> <code> | Evals the code in the specified language, valid languages are: ' + langs.join(' ')
      });

    let type = input.split(' ')[0]
    let code = _.unescape(input.split('```')[1])
    console.log(type);
    if (type != 'Javascript')
      codepad.eval(type, code, (err, out) => {
        resolve({ type: 'channel', message: !err ? 'Output: ```' + out.output + '```' : err })
      }, true);
    else _evalJS(code).then(resolve).catch(reject)
  })
}

const _evalJS = (code => {
  return new Promise((resolve, reject) => {
  let sandbox = new jsEval();

  sandbox.run(code, resp => {
    console.log(resp.console);
    if (resp.console.length == 0 && resp.result === 'null') return reject("No data or logs returned");

    let msg = `*Output:* \n${resp.console.length > 0 ? ('Console: ```' + resp.console + '```') : ''} ${resp.result !== 'null' ? 'Result: ```' + resp.result + '```' : ''}`;
    return resolve({ type: 'channel', message: msg })
    })
  })
})