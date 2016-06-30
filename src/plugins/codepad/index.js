import Promise from 'bluebird'
import _ from 'lodash'
import codepad from 'codepad'

const langs = ['C', 'C++', 'D', 'Haskell', 'Lua', 'OCaml', 'PHP', 'Perl', 'Python', 'Ruby', 'Scheme', 'Tcl']

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
      })
    let type = input.split(' ')[0].split('\n')[0]
    let code = _.unescape(input.split('```')[1])
    let rejected = false
    let timeout = setTimeout(function() {
      rejected = true
      return reject("Error: Took too long, request killed")
    }, 10000)
    codepad.eval(type, code, (err, out) => {
      if (!rejected) {
        clearTimeout(timeout)
        if (out.output.length < 7000 && out.output.split('\n').length < 86) return resolve({ type: 'channel', message: !err ? 'Output: ```' + out.output + '```' : `Error: ${err}` })
        else return reject("Error, output is too large to post")
      }
    }, true)
  })
}
