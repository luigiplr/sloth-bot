module.exports = {
    findMatch(word) {
        var out = {};
        
        let numbers = word.replace(',','.').match(/[0-9\.]/g),
            letters = word.toLowerCase().match(/[a-z]/g);

        if (numbers) {
            out.type = 'num';
            out.match = [parseFloat(numbers[0]), parseFloat(numbers[1])];
        } else if (letters) {
            out.type = 'char';
            out.match = [letters[0], letters[1]];
        }
        
        return out;
    },
    getDecimals(num) {
        try {
            return num.toString().split('.')[1].length;
        } catch (e) {
            return 0;
        }
    },
   randFloat(a,b) {
        if (!b) b = 0;
        let _a = a < b ? a : b,
            _b = a < b ? b : a,
            __a = this.getDecimals(_a),
            __b = this.getDecimals(_b),
            c = __a > __b ? __a : __b;

        return (Math.random() * (_b - _a) + _a).toFixed(c);
    },
    randChar(a,b) {
        if (!b) b = 'a';
        let _a = a < b ? a : b,
            _b = a < b ? b : a,
            str = 'abcdefghijklmnopqrstuvwxyz';

        return str.charAt(this.randFloat(str.indexOf(_a), str.indexOf(_b)));
    }
};