import Promise from 'bluebird'
import _ from 'lodash'
import codepad from 'codepad'
import sandbox from 'sandbox'
import vm from 'vm'

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
    if (type.toLowerCase() != 'javascript')
      codepad.eval(type, code, (err, out) => {
        resolve({ type: 'channel', message: !err ? 'Output: ```' + out.output + '```' : err })
      }, true);
    else _evalJS(code).then(resolve).catch(reject)
  })
}

const _evalJS = (code => {
  return new Promise((resolve, reject) => {
    let box = new sandbox()
  })
})
