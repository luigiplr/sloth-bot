import Promise from 'bluebird';
import codepad from 'codepad';

const langs = ['C','C++','D','Haskell','Lua','OCaml','PHP','Perl','Python','Ruby','Scheme','Tcl'];

module.exports = {
    commands: [{
        alias: ['eval'],
        command: 'eval'
    }],
    help: [{
        command: ['eval'],
        usage: 'eval <language> <code>'
    }],
    eval(user, channel, input) {
        return new Promise((resolve, reject) => {
            try {
                if (!input || !input.split('```')[1])
                    return resolve({
                        type: 'dm',
                        message: 'Usage: eval <langage> <code> | Evals the code in the specified language, valid languages are: ' + langs.join(' ')
                    });

                let type = input.split(' ')[0];
                let code = _.unescape(input.split('```')[1]);

                codepad.eval(type, code, (err, out) => {
                    resolve({
                        type: 'channel',
                        message: !err ? 'Output: ```' + out.output + '```' : err
                    });
                }, true);
            } catch (e) {
                reject(e);
            }
        });
    }
};