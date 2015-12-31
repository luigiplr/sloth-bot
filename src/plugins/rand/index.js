import Promise from 'bluebird';


var findMatch = in => {
    var out = {};
    
    var numbers = in.replace(',','.').match(/[0-9\.]/g);
    var letters = in.toLowerCase().match(/[a-z]/g);

    if (numbers) {
        out.type = 'num';
        out.match = [parseFloat(numbers[0]), parseFloat(numbers[1])];
    } else if (letters) {
        out.type = 'char';
        out.match = [letters[0], letters[1]];
    }
    
    return out;
};

var getDecimals = n => {
    try {
        return n.toString().split('.')[1].length;
    } catch (e) {
        return 0;
    }
};

var randFloat = (a,b) => {
    if (!b) b = 0;
    var _a = a < b ? a : b;
    var _b = a < b ? b : a;
    var __a = getDecimals(_a);
    var __b = getDecimals(_b);
    var c = __a > __b ? __a : __b;

    return (Math.random() * (_b - _a) + _a).toFixed(c);
}

var randChar = (a,b) => {
    if (!b) b = 'a';
    var _a = a < b ? a : b;
    var _b = a < b ? b : a;

    var str = 'abcdefghijklmnopqrstuvwxyz';

    return str.charAt(randFloat(str.indexOf(_a), str.indexOf(_b)));
};

var messages = [
    'That would be: ',
    'Mmmmmh, how about: ',
    'Processing request... request completed. The answer is: ',
    'There you go: ',
    'I propose: '
];

module.exports = {
    commands: [{
        alias: ['rand', 'randomize'],
        command: 'rand'
    }],
    help: [{
        command: ['rand'],
        usage: 'rand <A-B>, where A and B can be chars, integers or floats separated by any character'
    }],
    rand(user, channel, input) {
        return new Promise((resolve, reject) => {
            var random, match;

            if (!input) {
                match = {
                    type: 'num',
                    match: [0,9]
                };
            } else {
                match = findMatch(input);
            }

            switch(match.type) {
                case 'num':
                    random = randFloat(match.match[0], match.match[1]);
                    break;
                case 'char':
                    random = randChar(match.match[0], match.match[1]);
                default:
                    return resolve({
                        type: 'dm',
                        message: 'Nothing found to base the rand on. Usage: rand <A-B>, where A and B can be chars, integers or floats separated by any character'
                    });
            }

            // add some magic
            if (randFloat(1, 100) === 100) {
                random = 'Forty-two';
            } else if (random === 42) {
                random = 'The Answer to the Ultimate Question of Life, the Universe, and Everything';
            }

            return resolve({
                type: 'channel',
                message: messages[randFloat(0, messages.length - 1)] + random 
            });
        });
    }
};