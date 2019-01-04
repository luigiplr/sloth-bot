// Last Updated January 4th, 2019 v0.26.1
module.exports = {
  "__": {
    "name": "__",
    "command": "__",
    "category": "Function",
    "since": "v0.6.0",
    "description": "A special placeholder value used to specify \"gaps\" within curried functions, allowing partial application of any combination of arguments, regardless of their positions. If `g` is a curried ternary function and `_` is `R.__`, the following are equivalent: `g(1, 2, 3)` `g(_, 2, 3)(1)` `g(_, _, 3)(1)(2)` `g(_, _, 3)(1, 2)` `g(_, 2, _)(1, 3)` `g(_, 2)(1)(3)` `g(_, 2)(1, 3)` `g(_, 2)(_, 3)(1)`",
    "see": [],
    "example": "const greet = R.replace('{name}', R.__, 'Hello, {name}!');\ngreet('Alice'); //=> 'Hello, Alice!'"
  },
  "add": {
    "name": "add",
    "command": "Number → Number → Number",
    "category": "Math",
    "since": "v0.1.0",
    "description": "Adds two values.",
    "see": [
      "subtract"
    ],
    "example": "R.add(2, 3);       //=>  5\nR.add(7)(10);      //=> 17"
  },
  "addindex": {
    "name": "addIndex",
    "command": "((a … → b) … → [a] → *) → ((a …, Int, [a] → b) … → [a] → *)",
    "category": "Function",
    "since": "v0.15.0",
    "description": "Creates a new list iteration function from an existing one by adding two new parameters to its callback function: the current index, and the entire list. This would turn, for instance, `R.map` function into one that more closely resembles `Array.prototype.map`. Note that this will only work for functions in which the iteration callback function is the first parameter, and where the list is the last parameter. (This latter might be unimportant if the list parameter is not used.)",
    "see": [],
    "example": "const mapIndexed = R.addIndex(R.map);\nmapIndexed((val, idx) => idx + '-' + val, ['f', 'o', 'o', 'b', 'a', 'r']);\n//=> ['0-f', '1-o', '2-o', '3-b', '4-a', '5-r']"
  },
  "adjust": {
    "name": "adjust",
    "command": "Number → (a → a) → [a] → [a]",
    "category": "List",
    "since": "v0.14.0",
    "description": "Applies a function to the value at the given index of an array, returning a new copy of the array with the element at the given index replaced with the result of the function application.",
    "see": [
      "update"
    ],
    "example": "R.adjust(1, R.toUpper, ['a', 'b', 'c', 'd']);      //=> ['a', 'B', 'c', 'd']\nR.adjust(-1, R.toUpper, ['a', 'b', 'c', 'd']);     //=> ['a', 'b', 'c', 'D']"
  },
  "all": {
    "name": "all",
    "command": "(a → Boolean) → [a] → Boolean",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns `true` if all elements of the list match the predicate, `false` if there are any that don't. Dispatches to the `all` method of the second argument, if present. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "any",
      "none",
      "transduce"
    ],
    "example": "const equals3 = R.equals(3);\nR.all(equals3)([3, 3, 3, 3]); //=> true\nR.all(equals3)([3, 3, 1, 3]); //=> false"
  },
  "allpass": {
    "name": "allPass",
    "command": "[(*… → Boolean)] → (*… → Boolean)",
    "category": "Logic",
    "since": "v0.9.0",
    "description": "Takes a list of predicates and returns a predicate that returns true for a given list of arguments if every one of the provided predicates is satisfied by those arguments. The function returned is a curried function whose arity matches that of the highest-arity predicate.",
    "see": [
      "anyPass"
    ],
    "example": "const isQueen = R.propEq('rank', 'Q');\nconst isSpade = R.propEq('suit', '♠︎');\nconst isQueenOfSpades = R.allPass([isQueen, isSpade]);\n\nisQueenOfSpades({rank: 'Q', suit: '♣︎'}); //=> false\nisQueenOfSpades({rank: 'Q', suit: '♠︎'}); //=> true"
  },
  "always": {
    "name": "always",
    "command": "a → (* → a)",
    "category": "Function",
    "since": "v0.1.0",
    "description": "Returns a function that always returns the given value. Note that for non-primitives the value returned is a reference to the original value. This function is known as `const`, `constant`, or `K` (for K combinator) in other languages and libraries.",
    "see": [],
    "example": "const t = R.always('Tee');\nt(); //=> 'Tee'"
  },
  "and": {
    "name": "and",
    "command": "a → b → a | b",
    "category": "Logic",
    "since": "v0.1.0",
    "description": "Returns `true` if both arguments are `true`; `false` otherwise.",
    "see": [
      "both"
    ],
    "example": "R.and(true, true); //=> true\nR.and(true, false); //=> false\nR.and(false, true); //=> false\nR.and(false, false); //=> false"
  },
  "any": {
    "name": "any",
    "command": "(a → Boolean) → [a] → Boolean",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns `true` if at least one of the elements of the list match the predicate, `false` otherwise. Dispatches to the `any` method of the second argument, if present. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "all",
      "none",
      "transduce"
    ],
    "example": "const lessThan0 = R.flip(R.lt)(0);\nconst lessThan2 = R.flip(R.lt)(2);\nR.any(lessThan0)([1, 2]); //=> false\nR.any(lessThan2)([1, 2]); //=> true"
  },
  "anypass": {
    "name": "anyPass",
    "command": "[(*… → Boolean)] → (*… → Boolean)",
    "category": "Logic",
    "since": "v0.9.0",
    "description": "Takes a list of predicates and returns a predicate that returns true for a given list of arguments if at least one of the provided predicates is satisfied by those arguments. The function returned is a curried function whose arity matches that of the highest-arity predicate.",
    "see": [
      "allPass"
    ],
    "example": "const isClub = R.propEq('suit', '♣');\nconst isSpade = R.propEq('suit', '♠');\nconst isBlackCard = R.anyPass([isClub, isSpade]);\n\nisBlackCard({rank: '10', suit: '♣'}); //=> true\nisBlackCard({rank: 'Q', suit: '♠'}); //=> true\nisBlackCard({rank: 'Q', suit: '♦'}); //=> false"
  },
  "ap": {
    "name": "ap",
    "command": "[a → b] → [a] → [b]",
    "category": "Function",
    "since": "v0.3.0",
    "description": "ap applies a list of functions to a list of values. Dispatches to the `ap` method of the second argument, if present. Also treats curried functions as applicatives.",
    "see": [],
    "example": "R.ap([R.multiply(2), R.add(3)], [1,2,3]); //=> [2, 4, 6, 4, 5, 6]\nR.ap([R.concat('tasty '), R.toUpper], ['pizza', 'salad']); //=> [\"tasty pizza\", \"tasty salad\", \"PIZZA\", \"SALAD\"]\n\n// R.ap can also be used as S combinator\n// when only two functions are passed\nR.ap(R.concat, R.toUpper)('Ramda') //=> 'RamdaRAMDA'"
  },
  "aperture": {
    "name": "aperture",
    "command": "Number → [a] → [[a]]",
    "category": "List",
    "since": "v0.12.0",
    "description": "Returns a new list, composed of n-tuples of consecutive elements. If `n` is greater than the length of the list, an empty list is returned. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "transduce"
    ],
    "example": "R.aperture(2, [1, 2, 3, 4, 5]); //=> [[1, 2], [2, 3], [3, 4], [4, 5]]\nR.aperture(3, [1, 2, 3, 4, 5]); //=> [[1, 2, 3], [2, 3, 4], [3, 4, 5]]\nR.aperture(7, [1, 2, 3, 4, 5]); //=> []"
  },
  "append": {
    "name": "append",
    "command": "a → [a] → [a]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns a new list containing the contents of the given list, followed by the given element.",
    "see": [
      "prepend"
    ],
    "example": "R.append('tests', ['write', 'more']); //=> ['write', 'more', 'tests']\nR.append('tests', []); //=> ['tests']\nR.append(['tests'], ['write', 'more']); //=> ['write', 'more', ['tests']]"
  },
  "apply": {
    "name": "apply",
    "command": "(*… → a) → [*] → a",
    "category": "Function",
    "since": "v0.7.0",
    "description": "Applies function `fn` to the argument list `args`. This is useful for creating a fixed-arity function from a variadic function. `fn` should be a bound function if context is significant.",
    "see": [
      "call",
      "unapply"
    ],
    "example": "const nums = [1, 2, 3, -99, 42, 6, 7];\nR.apply(Math.max, nums); //=> 42"
  },
  "applyspec": {
    "name": "applySpec",
    "command": "{k: ((a, b, …, m) → v)} → ((a, b, …, m) → {k: v})",
    "category": "Function",
    "since": "v0.20.0",
    "description": "Given a spec object recursively mapping properties to functions, creates a function producing an object of the same structure, by mapping each property to the result of calling its associated function with the supplied arguments.",
    "see": [
      "converge",
      "juxt"
    ],
    "example": "const getMetrics = R.applySpec({\n  sum: R.add,\n  nested: { mul: R.multiply }\n});\ngetMetrics(2, 4); // => { sum: 6, nested: { mul: 8 } }"
  },
  "applyto": {
    "name": "applyTo",
    "command": "a → (a → b) → b",
    "category": "Function",
    "since": "v0.25.0",
    "description": "Takes a value and applies a function to it. This function is also known as the `thrush` combinator.",
    "see": [],
    "example": "const t42 = R.applyTo(42);\nt42(R.identity); //=> 42\nt42(R.add(1)); //=> 43"
  },
  "ascend": {
    "name": "ascend",
    "command": "Ord b => (a → b) → a → a → Number",
    "category": "Function",
    "since": "v0.23.0",
    "description": "Makes an ascending comparator function out of a function that returns a value that can be compared with `<` and `>`.",
    "see": [
      "descend"
    ],
    "example": "const byAge = R.ascend(R.prop('age'));\nconst people = [\n  { name: 'Emma', age: 70 },\n  { name: 'Peter', age: 78 },\n  { name: 'Mikhail', age: 62 },\n];\nconst peopleByYoungestFirst = R.sort(byAge, people);\n  //=> [{ name: 'Mikhail', age: 62 },{ name: 'Emma', age: 70 }, { name: 'Peter', age: 78 }]"
  },
  "assoc": {
    "name": "assoc",
    "command": "String → a → {k: v} → {k: v}",
    "category": "Object",
    "since": "v0.8.0",
    "description": "Makes a shallow clone of an object, setting or overriding the specified property with the given value. Note that this copies and flattens prototype properties onto the new object as well. All non-primitive properties are copied by reference.",
    "see": [
      "dissoc",
      "pick"
    ],
    "example": "R.assoc('c', 3, {a: 1, b: 2}); //=> {a: 1, b: 2, c: 3}"
  },
  "assocpath": {
    "name": "assocPath",
    "command": "[Idx] → a → {a} → {a}",
    "category": "Object",
    "since": "v0.8.0",
    "description": "Makes a shallow clone of an object, setting or overriding the nodes required to create the given path, and placing the specific value at the tail end of that path. Note that this copies and flattens prototype properties onto the new object as well. All non-primitive properties are copied by reference.",
    "see": [
      "dissocPath"
    ],
    "example": "R.assocPath(['a', 'b', 'c'], 42, {a: {b: {c: 0}}}); //=> {a: {b: {c: 42}}}\n\n// Any missing or non-object keys in path will be overridden\nR.assocPath(['a', 'b', 'c'], 42, {a: 5}); //=> {a: {b: {c: 42}}}"
  },
  "binary": {
    "name": "binary",
    "command": "(* → c) → (a, b → c)",
    "category": "Function",
    "since": "v0.2.0",
    "description": "Wraps a function of any arity (including nullary) in a function that accepts exactly 2 parameters. Any extraneous parameters will not be passed to the supplied function.",
    "see": [
      "nAry",
      "unary"
    ],
    "example": "const takesThreeArgs = function(a, b, c) {\n  return [a, b, c];\n};\ntakesThreeArgs.length; //=> 3\ntakesThreeArgs(1, 2, 3); //=> [1, 2, 3]\n\nconst takesTwoArgs = R.binary(takesThreeArgs);\ntakesTwoArgs.length; //=> 2\n// Only 2 arguments are passed to the wrapped function\ntakesTwoArgs(1, 2, 3); //=> [1, 2, undefined]"
  },
  "bind": {
    "name": "bind",
    "command": "(* → *) → {*} → (* → *)",
    "category": "Function",
    "since": "v0.6.0",
    "description": "Creates a function that is bound to a context. Note: `R.bind` does not provide the additional argument-binding capabilities of Function.prototype.bind.",
    "see": [
      "partial"
    ],
    "example": "const log = R.bind(console.log, console);\nR.pipe(R.assoc('a', 2), R.tap(log), R.assoc('a', 3))({a: 1}); //=> {a: 3}\n// logs {a: 2}"
  },
  "both": {
    "name": "both",
    "command": "(*… → Boolean) → (*… → Boolean) → (*… → Boolean)",
    "category": "Logic",
    "since": "v0.12.0",
    "description": "A function which calls the two provided functions and returns the `&&` of the results. It returns the result of the first function if it is false-y and the result of the second function otherwise. Note that this is short-circuited, meaning that the second function will not be invoked if the first returns a false-y value. In addition to functions, `R.both` also accepts any fantasy-land compatible applicative functor.",
    "see": [
      "and"
    ],
    "example": "const gt10 = R.gt(R.__, 10)\nconst lt20 = R.lt(R.__, 20)\nconst f = R.both(gt10, lt20);\nf(15); //=> true\nf(30); //=> false\n\nR.both(Maybe.Just(false), Maybe.Just(55)); // => Maybe.Just(false)\nR.both([false, false, 'a'], [11]); //=> [false, false, 11]"
  },
  "call": {
    "name": "call",
    "command": "(*… → a),*… → a",
    "category": "Function",
    "since": "v0.9.0",
    "description": "Returns the result of calling its first argument with the remaining arguments. This is occasionally useful as a converging function for `R.converge`: the first branch can produce a function while the remaining branches produce values to be passed to that function as its arguments.",
    "see": [
      "apply"
    ],
    "example": "R.call(R.add, 1, 2); //=> 3\n\nconst indentN = R.pipe(R.repeat(' '),\n                     R.join(''),\n                     R.replace(/^(?!$)/gm));\n\nconst format = R.converge(R.call, [\n                            R.pipe(R.prop('indent'), indentN),\n                            R.prop('value')\n                        ]);\n\nformat({indent: 2, value: 'foo\\nbar\\nbaz\\n'}); //=> '  foo\\n  bar\\n  baz\\n'"
  },
  "chain": {
    "name": "chain",
    "command": "Chain m => (a → m b) → m a → m b",
    "category": "List",
    "since": "v0.3.0",
    "description": "`chain` maps a function over a list and concatenates the results. `chain` is also known as `flatMap` in some libraries. Dispatches to the `chain` method of the second argument, if present, according to the FantasyLand Chain spec. If second argument is a function, `chain(f, g)(x)` is equivalent to `f(g(x), x)`. Acts as a transducer if a transformer is given in list position.",
    "see": [],
    "example": "const duplicate = n => [n, n];\nR.chain(duplicate, [1, 2, 3]); //=> [1, 1, 2, 2, 3, 3]\n\nR.chain(R.append, R.head)([1, 2, 3]); //=> [1, 2, 3, 1]"
  },
  "clamp": {
    "name": "clamp",
    "command": "Ord a => a → a → a → a",
    "category": "Relation",
    "since": "v0.20.0",
    "description": "Restricts a number to be within a range. Also works for other ordered types such as Strings and Dates.",
    "see": [],
    "example": "R.clamp(1, 10, -5) // => 1\nR.clamp(1, 10, 15) // => 10\nR.clamp(1, 10, 4)  // => 4"
  },
  "clone": {
    "name": "clone",
    "command": "{*} → {*}",
    "category": "Object",
    "since": "v0.1.0",
    "description": "Creates a deep copy of the value which may contain (nested) `Array`s and `Object`s, `Number`s, `String`s, `Boolean`s and `Date`s. `Function`s are assigned by reference rather than copied Dispatches to a `clone` method if present.",
    "see": [],
    "example": "const objects = [{}, {}, {}];\nconst objectsClone = R.clone(objects);\nobjects === objectsClone; //=> false\nobjects[0] === objectsClone[0]; //=> false"
  },
  "comparator": {
    "name": "comparator",
    "command": "((a, b) → Boolean) → ((a, b) → Number)",
    "category": "Function",
    "since": "v0.1.0",
    "description": "Makes a comparator function out of a function that reports whether the first element is less than the second.",
    "see": [],
    "example": "const byAge = R.comparator((a, b) => a.age < b.age);\nconst people = [\n  { name: 'Emma', age: 70 },\n  { name: 'Peter', age: 78 },\n  { name: 'Mikhail', age: 62 },\n];\nconst peopleByIncreasingAge = R.sort(byAge, people);\n  //=> [{ name: 'Mikhail', age: 62 },{ name: 'Emma', age: 70 }, { name: 'Peter', age: 78 }]"
  },
  "complement": {
    "name": "complement",
    "command": "(*… → *) → (*… → Boolean)",
    "category": "Logic",
    "since": "v0.12.0",
    "description": "Takes a function `f` and returns a function `g` such that if called with the same arguments when `f` returns a \"truthy\" value, `g` returns `false` and when `f` returns a \"falsy\" value `g` returns `true`. `R.complement` may be applied to any functor",
    "see": [
      "not"
    ],
    "example": "const isNotNil = R.complement(R.isNil);\nisNil(null); //=> true\nisNotNil(null); //=> false\nisNil(7); //=> false\nisNotNil(7); //=> true"
  },
  "compose": {
    "name": "compose",
    "command": "((y → z), (x → y), …, (o → p), ((a, b, …, n) → o)) → ((a, b, …, n) → z)",
    "category": "Function",
    "since": "v0.1.0",
    "description": "Performs right-to-left function composition. The rightmost function may have any arity; the remaining functions must be unary. Note: The result of compose is not automatically curried.",
    "see": [
      "pipe"
    ],
    "example": "const classyGreeting = (firstName, lastName) => \"The name's \" + lastName + \", \" + firstName + \" \" + lastName\nconst yellGreeting = R.compose(R.toUpper, classyGreeting);\nyellGreeting('James', 'Bond'); //=> \"THE NAME'S BOND, JAMES BOND\"\n\nR.compose(Math.abs, R.add(1), R.multiply(2))(-4) //=> 7"
  },
  "composek": {
    "name": "composeK",
    "command": "composeK",
    "category": "Function",
    "since": "v0.16.0",
    "description": "Returns the right-to-left Kleisli composition of the provided functions, each of which must return a value of a type supported by `chain`. `R.composeK(h, g, f)` is equivalent to `R.compose(R.chain(h), R.chain(g), f)`.",
    "see": [
      "pipeK"
    ],
    "example": "//  get :: String -> Object -> Maybe *\n const get = R.curry((propName, obj) => Maybe(obj[propName]))\n\n //  getStateCode :: Maybe String -> Maybe String\n const getStateCode = R.composeK(\n   R.compose(Maybe.of, R.toUpper),\n   get('state'),\n   get('address'),\n   get('user'),\n );\n getStateCode({\"user\":{\"address\":{\"state\":\"ny\"}}}); //=> Maybe.Just(\"NY\")\n getStateCode({}); //=> Maybe.Nothing()"
  },
  "composep": {
    "name": "composeP",
    "command": "composeP",
    "category": "Function",
    "since": "v0.10.0",
    "description": "Performs right-to-left composition of one or more Promise-returning functions. The rightmost function may have any arity; the remaining functions must be unary.",
    "see": [
      "pipeP"
    ],
    "example": "const db = {\n  users: {\n    JOE: {\n      name: 'Joe',\n      followers: ['STEVE', 'SUZY']\n    }\n  }\n}\n\n// We'll pretend to do a db lookup which returns a promise\nconst lookupUser = (userId) => Promise.resolve(db.users[userId])\nconst lookupFollowers = (user) => Promise.resolve(user.followers)\nlookupUser('JOE').then(lookupFollowers)\n\n//  followersForUser :: String -> Promise [UserId]\nconst followersForUser = R.composeP(lookupFollowers, lookupUser);\nfollowersForUser('JOE').then(followers => console.log('Followers:', followers))\n// Followers: [\"STEVE\",\"SUZY\"]"
  },
  "composewith": {
    "name": "composeWith",
    "command": "((* → *), [(y → z), (x → y), …, (o → p), ((a, b, …, n) → o)]) → ((a, b, …, n) → z)",
    "category": "Function",
    "since": "Unknown",
    "description": "Performs right-to-left function composition using transforming function. The rightmost function may have any arity; the remaining functions must be unary. Note: The result of compose is not automatically curried.",
    "see": [
      "compose",
      "pipeWith"
    ],
    "example": "const composeWhileNotNil = R.composeWith((f, res) => R.isNil(res) ? res : f(res));\n\ncomposeWhileNotNil([R.inc, R.prop('age')])({age: 1}) //=> 2\ncomposeWhileNotNil([R.inc, R.prop('age')])({}) //=> undefined"
  },
  "concat": {
    "name": "concat",
    "command": "[a] → [a] → [a]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns the result of concatenating the given lists or strings. Note: `R.concat` expects both arguments to be of the same type, unlike the native `Array.prototype.concat` method. It will throw an error if you `concat` an Array with a non-Array value. Dispatches to the `concat` method of the first argument, if present. Can also concatenate two members of a fantasy-land compatible semigroup.",
    "see": [],
    "example": "R.concat('ABC', 'DEF'); // 'ABCDEF'\nR.concat([4, 5, 6], [1, 2, 3]); //=> [4, 5, 6, 1, 2, 3]\nR.concat([], []); //=> []"
  },
  "cond": {
    "name": "cond",
    "command": "[[(*… → Boolean),(*… → *)]] → (*… → *)",
    "category": "Logic",
    "since": "v0.6.0",
    "description": "Returns a function, `fn`, which encapsulates `if/else, if/else, ...` logic. `R.cond` takes a list of [predicate, transformer] pairs. All of the arguments to `fn` are applied to each of the predicates in turn until one returns a \"truthy\" value, at which point `fn` returns the result of applying its arguments to the corresponding transformer. If none of the predicates matches, `fn` returns undefined.",
    "see": [
      "ifElse",
      "unless",
      "when"
    ],
    "example": "const fn = R.cond([\n  [R.equals(0),   R.always('water freezes at 0°C')],\n  [R.equals(100), R.always('water boils at 100°C')],\n  [R.T,           temp => 'nothing special happens at ' + temp + '°C']\n]);\nfn(0); //=> 'water freezes at 0°C'\nfn(50); //=> 'nothing special happens at 50°C'\nfn(100); //=> 'water boils at 100°C'"
  },
  "construct": {
    "name": "construct",
    "command": "(* → {*}) → (* → {*})",
    "category": "Function",
    "since": "v0.1.0",
    "description": "Wraps a constructor function inside a curried function that can be called with the same arguments and returns the same type.",
    "see": [
      "invoker"
    ],
    "example": "// Constructor function\nfunction Animal(kind) {\n  this.kind = kind;\n};\nAnimal.prototype.sighting = function() {\n  return \"It's a \" + this.kind + \"!\";\n}\n\nconst AnimalConstructor = R.construct(Animal)\n\n// Notice we no longer need the 'new' keyword:\nAnimalConstructor('Pig'); //=> {\"kind\": \"Pig\", \"sighting\": function (){...}};\n\nconst animalTypes = [\"Lion\", \"Tiger\", \"Bear\"];\nconst animalSighting = R.invoker(0, 'sighting');\nconst sightNewAnimal = R.compose(animalSighting, AnimalConstructor);\nR.map(sightNewAnimal, animalTypes); //=> [\"It's a Lion!\", \"It's a Tiger!\", \"It's a Bear!\"]"
  },
  "constructn": {
    "name": "constructN",
    "command": "Number → (* → {*}) → (* → {*})",
    "category": "Function",
    "since": "v0.4.0",
    "description": "Wraps a constructor function inside a curried function that can be called with the same arguments and returns the same type. The arity of the function returned is specified to allow using variadic constructor functions.",
    "see": [],
    "example": "// Variadic Constructor function\nfunction Salad() {\n  this.ingredients = arguments;\n}\n\nSalad.prototype.recipe = function() {\n  const instructions = R.map(ingredient => 'Add a dollop of ' + ingredient, this.ingredients);\n  return R.join('\\n', instructions);\n};\n\nconst ThreeLayerSalad = R.constructN(3, Salad);\n\n// Notice we no longer need the 'new' keyword, and the constructor is curried for 3 arguments.\nconst salad = ThreeLayerSalad('Mayonnaise')('Potato Chips')('Ketchup');\n\nconsole.log(salad.recipe());\n// Add a dollop of Mayonnaise\n// Add a dollop of Potato Chips\n// Add a dollop of Ketchup"
  },
  "contains": {
    "name": "contains",
    "command": "contains",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns `true` if the specified value is equal, in `R.equals` terms, to at least one element of the given list; `false` otherwise. Works also with strings.",
    "see": [
      "includes"
    ],
    "example": "R.contains(3, [1, 2, 3]); //=> true\nR.contains(4, [1, 2, 3]); //=> false\nR.contains({ name: 'Fred' }, [{ name: 'Fred' }]); //=> true\nR.contains([42], [[42]]); //=> true\nR.contains('ba', 'banana'); //=>true"
  },
  "converge": {
    "name": "converge",
    "command": "((x1, x2, …) → z) → [((a, b, …) → x1), ((a, b, …) → x2), …] → (a → b → … → z)",
    "category": "Function",
    "since": "v0.4.2",
    "description": "Accepts a converging function and a list of branching functions and returns a new function. The arity of the new function is the same as the arity of the longest branching function. When invoked, this new function is applied to some arguments, and each branching function is applied to those same arguments. The results of each branching function are passed as arguments to the converging function to produce the return value.",
    "see": [
      "useWith"
    ],
    "example": "const average = R.converge(R.divide, [R.sum, R.length])\naverage([1, 2, 3, 4, 5, 6, 7]) //=> 4\n\nconst strangeConcat = R.converge(R.concat, [R.toUpper, R.toLower])\nstrangeConcat(\"Yodel\") //=> \"YODELyodel\""
  },
  "countby": {
    "name": "countBy",
    "command": "(a → String) → [a] → {*}",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Counts the elements of a list according to how many match each value of a key generated by the supplied function. Returns an object mapping the keys produced by `fn` to the number of occurrences in the list. Note that all keys are coerced to strings because of how JavaScript objects work. Acts as a transducer if a transformer is given in list position.",
    "see": [],
    "example": "const numbers = [1.0, 1.1, 1.2, 2.0, 3.0, 2.2];\nR.countBy(Math.floor)(numbers);    //=> {'1': 3, '2': 2, '3': 1}\n\nconst letters = ['a', 'b', 'A', 'a', 'B', 'c'];\nR.countBy(R.toLower)(letters);   //=> {'a': 3, 'b': 2, 'c': 1}"
  },
  "curry": {
    "name": "curry",
    "command": "(* → a) → (* → a)",
    "category": "Function",
    "since": "v0.1.0",
    "description": "Returns a curried equivalent of the provided function. The curried function has two unusual capabilities. First, its arguments needn't be provided one at a time. If `f` is a ternary function and `g` is `R.curry(f)`, the following are equivalent: `g(1)(2)(3)` `g(1)(2, 3)` `g(1, 2)(3)` `g(1, 2, 3)` Secondly, the special placeholder value `R.__` may be used to specify \"gaps\", allowing partial application of any combination of arguments, regardless of their positions. If `g` is as above and `_` is `R.__`, the following are equivalent: `g(1, 2, 3)` `g(_, 2, 3)(1)` `g(_, _, 3)(1)(2)` `g(_, _, 3)(1, 2)` `g(_, 2)(1)(3)` `g(_, 2)(1, 3)` `g(_, 2)(_, 3)(1)`",
    "see": [
      "curryN",
      "partial"
    ],
    "example": "const addFourNumbers = (a, b, c, d) => a + b + c + d;\n\nconst curriedAddFourNumbers = R.curry(addFourNumbers);\nconst f = curriedAddFourNumbers(1, 2);\nconst g = f(3);\ng(4); //=> 10"
  },
  "curryn": {
    "name": "curryN",
    "command": "Number → (* → a) → (* → a)",
    "category": "Function",
    "since": "v0.5.0",
    "description": "Returns a curried equivalent of the provided function, with the specified arity. The curried function has two unusual capabilities. First, its arguments needn't be provided one at a time. If `g` is `R.curryN(3, f)`, the following are equivalent: `g(1)(2)(3)` `g(1)(2, 3)` `g(1, 2)(3)` `g(1, 2, 3)` Secondly, the special placeholder value `R.__` may be used to specify \"gaps\", allowing partial application of any combination of arguments, regardless of their positions. If `g` is as above and `_` is `R.__`, the following are equivalent: `g(1, 2, 3)` `g(_, 2, 3)(1)` `g(_, _, 3)(1)(2)` `g(_, _, 3)(1, 2)` `g(_, 2)(1)(3)` `g(_, 2)(1, 3)` `g(_, 2)(_, 3)(1)`",
    "see": [
      "curry"
    ],
    "example": "const sumArgs = (...args) => R.sum(args);\n\nconst curriedAddFourNumbers = R.curryN(4, sumArgs);\nconst f = curriedAddFourNumbers(1, 2);\nconst g = f(3);\ng(4); //=> 10"
  },
  "dec": {
    "name": "dec",
    "command": "Number → Number",
    "category": "Math",
    "since": "v0.9.0",
    "description": "Decrements its argument.",
    "see": [
      "inc"
    ],
    "example": "R.dec(42); //=> 41"
  },
  "defaultto": {
    "name": "defaultTo",
    "command": "a → b → a | b",
    "category": "Logic",
    "since": "v0.10.0",
    "description": "Returns the second argument if it is not `null`, `undefined` or `NaN`; otherwise the first argument is returned.",
    "see": [],
    "example": "const defaultTo42 = R.defaultTo(42);\n\ndefaultTo42(null);  //=> 42\ndefaultTo42(undefined);  //=> 42\ndefaultTo42(false);  //=> false\ndefaultTo42('Ramda');  //=> 'Ramda'\n// parseInt('string') results in NaN\ndefaultTo42(parseInt('string')); //=> 42"
  },
  "descend": {
    "name": "descend",
    "command": "Ord b => (a → b) → a → a → Number",
    "category": "Function",
    "since": "v0.23.0",
    "description": "Makes a descending comparator function out of a function that returns a value that can be compared with `<` and `>`.",
    "see": [
      "ascend"
    ],
    "example": "const byAge = R.descend(R.prop('age'));\nconst people = [\n  { name: 'Emma', age: 70 },\n  { name: 'Peter', age: 78 },\n  { name: 'Mikhail', age: 62 },\n];\nconst peopleByOldestFirst = R.sort(byAge, people);\n  //=> [{ name: 'Peter', age: 78 }, { name: 'Emma', age: 70 }, { name: 'Mikhail', age: 62 }]"
  },
  "difference": {
    "name": "difference",
    "command": "[*] → [*] → [*]",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Finds the set (i.e. no duplicates) of all elements in the first list not contained in the second list. Objects and Arrays are compared in terms of value equality, not reference equality.",
    "see": [
      "differenceWith",
      "symmetricDifference",
      "symmetricDifferenceWith",
      "without"
    ],
    "example": "R.difference([1,2,3,4], [7,6,5,4,3]); //=> [1,2]\nR.difference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5]\nR.difference([{a: 1}, {b: 2}], [{a: 1}, {c: 3}]) //=> [{b: 2}]"
  },
  "differencewith": {
    "name": "differenceWith",
    "command": "((a, a) → Boolean) → [a] → [a] → [a]",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Finds the set (i.e. no duplicates) of all elements in the first list not contained in the second list. Duplication is determined according to the value returned by applying the supplied predicate to two list elements.",
    "see": [
      "difference",
      "symmetricDifference",
      "symmetricDifferenceWith"
    ],
    "example": "const cmp = (x, y) => x.a === y.a;\nconst l1 = [{a: 1}, {a: 2}, {a: 3}];\nconst l2 = [{a: 3}, {a: 4}];\nR.differenceWith(cmp, l1, l2); //=> [{a: 1}, {a: 2}]"
  },
  "dissoc": {
    "name": "dissoc",
    "command": "String → {k: v} → {k: v}",
    "category": "Object",
    "since": "v0.10.0",
    "description": "Returns a new object that does not contain a `prop` property.",
    "see": [
      "assoc",
      "omit"
    ],
    "example": "R.dissoc('b', {a: 1, b: 2, c: 3}); //=> {a: 1, c: 3}"
  },
  "dissocpath": {
    "name": "dissocPath",
    "command": "[Idx] → {k: v} → {k: v}",
    "category": "Object",
    "since": "v0.11.0",
    "description": "Makes a shallow clone of an object, omitting the property at the given path. Note that this copies and flattens prototype properties onto the new object as well. All non-primitive properties are copied by reference.",
    "see": [
      "assocPath"
    ],
    "example": "R.dissocPath(['a', 'b', 'c'], {a: {b: {c: 42}}}); //=> {a: {b: {}}}"
  },
  "divide": {
    "name": "divide",
    "command": "Number → Number → Number",
    "category": "Math",
    "since": "v0.1.0",
    "description": "Divides two numbers. Equivalent to `a / b`.",
    "see": [
      "multiply"
    ],
    "example": "R.divide(71, 100); //=> 0.71\n\nconst half = R.divide(R.__, 2);\nhalf(42); //=> 21\n\nconst reciprocal = R.divide(1);\nreciprocal(4);   //=> 0.25"
  },
  "drop": {
    "name": "drop",
    "command": "Number → [a] → [a]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns all but the first `n` elements of the given list, string, or transducer/transformer (or object with a `drop` method). Dispatches to the `drop` method of the second argument, if present.",
    "see": [
      "take",
      "transduce",
      "dropLast",
      "dropWhile"
    ],
    "example": "R.drop(1, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']\nR.drop(2, ['foo', 'bar', 'baz']); //=> ['baz']\nR.drop(3, ['foo', 'bar', 'baz']); //=> []\nR.drop(4, ['foo', 'bar', 'baz']); //=> []\nR.drop(3, 'ramda');               //=> 'da'"
  },
  "droplast": {
    "name": "dropLast",
    "command": "Number → [a] → [a]",
    "category": "List",
    "since": "v0.16.0",
    "description": "Returns a list containing all but the last `n` elements of the given `list`. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "takeLast",
      "drop",
      "dropWhile",
      "dropLastWhile"
    ],
    "example": "R.dropLast(1, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']\nR.dropLast(2, ['foo', 'bar', 'baz']); //=> ['foo']\nR.dropLast(3, ['foo', 'bar', 'baz']); //=> []\nR.dropLast(4, ['foo', 'bar', 'baz']); //=> []\nR.dropLast(3, 'ramda');               //=> 'ra'"
  },
  "droplastwhile": {
    "name": "dropLastWhile",
    "command": "(a → Boolean) → [a] → [a]",
    "category": "List",
    "since": "v0.16.0",
    "description": "Returns a new list excluding all the tailing elements of a given list which satisfy the supplied predicate function. It passes each value from the right to the supplied predicate function, skipping elements until the predicate function returns a `falsy` value. The predicate function is applied to one argument: (value). Acts as a transducer if a transformer is given in list position.",
    "see": [
      "takeLastWhile",
      "addIndex",
      "drop",
      "dropWhile"
    ],
    "example": "const lteThree = x => x <= 3;\n\nR.dropLastWhile(lteThree, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3, 4]\n\nR.dropLastWhile(x => x !== 'd' , 'Ramda'); //=> 'Ramd'"
  },
  "droprepeats": {
    "name": "dropRepeats",
    "command": "[a] → [a]",
    "category": "List",
    "since": "v0.14.0",
    "description": "Returns a new list without any consecutively repeating elements. `R.equals` is used to determine equality. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "transduce"
    ],
    "example": "R.dropRepeats([1, 1, 1, 2, 3, 4, 4, 2, 2]); //=> [1, 2, 3, 4, 2]"
  },
  "droprepeatswith": {
    "name": "dropRepeatsWith",
    "command": "((a, a) → Boolean) → [a] → [a]",
    "category": "List",
    "since": "v0.14.0",
    "description": "Returns a new list without any consecutively repeating elements. Equality is determined by applying the supplied predicate to each pair of consecutive elements. The first element in a series of equal elements will be preserved. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "transduce"
    ],
    "example": "const l = [1, -1, 1, 3, 4, -4, -4, -5, 5, 3, 3];\nR.dropRepeatsWith(R.eqBy(Math.abs), l); //=> [1, 3, 4, -5, 3]"
  },
  "dropwhile": {
    "name": "dropWhile",
    "command": "(a → Boolean) → [a] → [a]",
    "category": "List",
    "since": "v0.9.0",
    "description": "Returns a new list excluding the leading elements of a given list which satisfy the supplied predicate function. It passes each value to the supplied predicate function, skipping elements while the predicate function returns `true`. The predicate function is applied to one argument: (value). Dispatches to the `dropWhile` method of the second argument, if present. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "takeWhile",
      "transduce",
      "addIndex"
    ],
    "example": "const lteTwo = x => x <= 2;\n\nR.dropWhile(lteTwo, [1, 2, 3, 4, 3, 2, 1]); //=> [3, 4, 3, 2, 1]\n\nR.dropWhile(x => x !== 'd' , 'Ramda'); //=> 'da'"
  },
  "either": {
    "name": "either",
    "command": "(*… → Boolean) → (*… → Boolean) → (*… → Boolean)",
    "category": "Logic",
    "since": "v0.12.0",
    "description": "A function wrapping calls to the two functions in an `||` operation, returning the result of the first function if it is truth-y and the result of the second function otherwise. Note that this is short-circuited, meaning that the second function will not be invoked if the first returns a truth-y value. In addition to functions, `R.either` also accepts any fantasy-land compatible applicative functor.",
    "see": [
      "or"
    ],
    "example": "const gt10 = x => x > 10;\nconst even = x => x % 2 === 0;\nconst f = R.either(gt10, even);\nf(101); //=> true\nf(8); //=> true\n\nR.either(Maybe.Just(false), Maybe.Just(55)); // => Maybe.Just(55)\nR.either([false, false, 'a'], [11]) // => [11, 11, \"a\"]"
  },
  "empty": {
    "name": "empty",
    "command": "a → a",
    "category": "Function",
    "since": "v0.3.0",
    "description": "Returns the empty value of its argument's type. Ramda defines the empty value of Array (`[]`), Object (`{}`), String (`''`), and Arguments. Other types are supported if they define `<Type>.empty`, `<Type>.prototype.empty` or implement the FantasyLand Monoid spec. Dispatches to the `empty` method of the first argument, if present.",
    "see": [],
    "example": "R.empty(Just(42));      //=> Nothing()\nR.empty([1, 2, 3]);     //=> []\nR.empty('unicorns');    //=> ''\nR.empty({x: 1, y: 2});  //=> {}"
  },
  "endswith": {
    "name": "endsWith",
    "command": "[a] → [a] → Boolean",
    "category": "List",
    "since": "v0.24.0",
    "description": "Checks if a list ends with the provided sublist. Similarly, checks if a string ends with the provided substring.",
    "see": [
      "startsWith"
    ],
    "example": "R.endsWith('c', 'abc')                //=> true\nR.endsWith('b', 'abc')                //=> false\nR.endsWith(['c'], ['a', 'b', 'c'])    //=> true\nR.endsWith(['b'], ['a', 'b', 'c'])    //=> false"
  },
  "eqby": {
    "name": "eqBy",
    "command": "(a → b) → a → a → Boolean",
    "category": "Relation",
    "since": "v0.18.0",
    "description": "Takes a function and two values in its domain and returns `true` if the values map to the same value in the codomain; `false` otherwise.",
    "see": [],
    "example": "R.eqBy(Math.abs, 5, -5); //=> true"
  },
  "eqprops": {
    "name": "eqProps",
    "command": "k → {k: v} → {k: v} → Boolean",
    "category": "Object",
    "since": "v0.1.0",
    "description": "Reports whether two objects have the same value, in `R.equals` terms, for the specified property. Useful as a curried predicate.",
    "see": [],
    "example": "const o1 = { a: 1, b: 2, c: 3, d: 4 };\nconst o2 = { a: 10, b: 20, c: 3, d: 40 };\nR.eqProps('a', o1, o2); //=> false\nR.eqProps('c', o1, o2); //=> true"
  },
  "equals": {
    "name": "equals",
    "command": "a → b → Boolean",
    "category": "Relation",
    "since": "v0.15.0",
    "description": "Returns `true` if its arguments are equivalent, `false` otherwise. Handles cyclical data structures. Dispatches symmetrically to the `equals` methods of both arguments, if present.",
    "see": [],
    "example": "R.equals(1, 1); //=> true\nR.equals(1, '1'); //=> false\nR.equals([1, 2, 3], [1, 2, 3]); //=> true\n\nconst a = {}; a.v = a;\nconst b = {}; b.v = b;\nR.equals(a, b); //=> true"
  },
  "evolve": {
    "name": "evolve",
    "command": "{k: (v → v)} → {k: v} → {k: v}",
    "category": "Object",
    "since": "v0.9.0",
    "description": "Creates a new object by recursively evolving a shallow copy of `object`, according to the `transformation` functions. All non-primitive properties are copied by reference. A `transformation` function will not be invoked if its corresponding key does not exist in the evolved object.",
    "see": [],
    "example": "const tomato = {firstName: '  Tomato ', data: {elapsed: 100, remaining: 1400}, id:123};\nconst transformations = {\n  firstName: R.trim,\n  lastName: R.trim, // Will not get invoked.\n  data: {elapsed: R.add(1), remaining: R.add(-1)}\n};\nR.evolve(transformations, tomato); //=> {firstName: 'Tomato', data: {elapsed: 101, remaining: 1399}, id:123}"
  },
  "f": {
    "name": "F",
    "command": "* → Boolean",
    "category": "Function",
    "since": "v0.9.0",
    "description": "A function that always returns `false`. Any passed in parameters are ignored.",
    "see": [
      "T"
    ],
    "example": "R.F(); //=> false"
  },
  "filter": {
    "name": "filter",
    "command": "Filterable f => (a → Boolean) → f a → f a",
    "category": "List",
    "since": "v0.1.0",
    "description": "Takes a predicate and a `Filterable`, and returns a new filterable of the same type containing the members of the given filterable which satisfy the given predicate. Filterable objects include plain objects or any object that has a filter method such as `Array`. Dispatches to the `filter` method of the second argument, if present. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "reject",
      "transduce",
      "addIndex"
    ],
    "example": "const isEven = n => n % 2 === 0;\n\nR.filter(isEven, [1, 2, 3, 4]); //=> [2, 4]\n\nR.filter(isEven, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}"
  },
  "find": {
    "name": "find",
    "command": "(a → Boolean) → [a] → a | undefined",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns the first element of the list which matches the predicate, or `undefined` if no element matches. Dispatches to the `find` method of the second argument, if present. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "transduce"
    ],
    "example": "const xs = [{a: 1}, {a: 2}, {a: 3}];\nR.find(R.propEq('a', 2))(xs); //=> {a: 2}\nR.find(R.propEq('a', 4))(xs); //=> undefined"
  },
  "findindex": {
    "name": "findIndex",
    "command": "(a → Boolean) → [a] → Number",
    "category": "List",
    "since": "v0.1.1",
    "description": "Returns the index of the first element of the list which matches the predicate, or `-1` if no element matches. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "transduce"
    ],
    "example": "const xs = [{a: 1}, {a: 2}, {a: 3}];\nR.findIndex(R.propEq('a', 2))(xs); //=> 1\nR.findIndex(R.propEq('a', 4))(xs); //=> -1"
  },
  "findlast": {
    "name": "findLast",
    "command": "(a → Boolean) → [a] → a | undefined",
    "category": "List",
    "since": "v0.1.1",
    "description": "Returns the last element of the list which matches the predicate, or `undefined` if no element matches. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "transduce"
    ],
    "example": "const xs = [{a: 1, b: 0}, {a:1, b: 1}];\nR.findLast(R.propEq('a', 1))(xs); //=> {a: 1, b: 1}\nR.findLast(R.propEq('a', 4))(xs); //=> undefined"
  },
  "findlastindex": {
    "name": "findLastIndex",
    "command": "(a → Boolean) → [a] → Number",
    "category": "List",
    "since": "v0.1.1",
    "description": "Returns the index of the last element of the list which matches the predicate, or `-1` if no element matches. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "transduce"
    ],
    "example": "const xs = [{a: 1, b: 0}, {a:1, b: 1}];\nR.findLastIndex(R.propEq('a', 1))(xs); //=> 1\nR.findLastIndex(R.propEq('a', 4))(xs); //=> -1"
  },
  "flatten": {
    "name": "flatten",
    "command": "[a] → [b]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns a new list by pulling every item out of it (and all its sub-arrays) and putting them in a new array, depth-first.",
    "see": [
      "unnest"
    ],
    "example": "R.flatten([1, 2, [3, 4], 5, [6, [7, 8, [9, [10, 11], 12]]]]);\n//=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
  },
  "flip": {
    "name": "flip",
    "command": "((a, b, c, …) → z) → (b → a → c → … → z)",
    "category": "Function",
    "since": "v0.1.0",
    "description": "Returns a new function much like the supplied one, except that the first two arguments' order is reversed.",
    "see": [],
    "example": "const mergeThree = (a, b, c) => [].concat(a, b, c);\n\nmergeThree(1, 2, 3); //=> [1, 2, 3]\n\nR.flip(mergeThree)(1, 2, 3); //=> [2, 1, 3]"
  },
  "foreach": {
    "name": "forEach",
    "command": "(a → *) → [a] → [a]",
    "category": "List",
    "since": "v0.1.1",
    "description": "Iterate over an input `list`, calling a provided function `fn` for each element in the list. `fn` receives one argument: (value). Note: `R.forEach` does not skip deleted or unassigned indices (sparse arrays), unlike the native `Array.prototype.forEach` method. For more details on this behavior, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach#Description Also note that, unlike `Array.prototype.forEach`, Ramda's `forEach` returns the original array. In some libraries this function is named `each`. Dispatches to the `forEach` method of the second argument, if present.",
    "see": [
      "addIndex"
    ],
    "example": "const printXPlusFive = x => console.log(x + 5);\nR.forEach(printXPlusFive, [1, 2, 3]); //=> [1, 2, 3]\n// logs 6\n// logs 7\n// logs 8"
  },
  "foreachobjindexed": {
    "name": "forEachObjIndexed",
    "command": "((a, String, StrMap a) → Any) → StrMap a → StrMap a",
    "category": "Object",
    "since": "v0.23.0",
    "description": "Iterate over an input `object`, calling a provided function `fn` for each key and value in the object. `fn` receives three argument: (value, key, obj).",
    "see": [],
    "example": "const printKeyConcatValue = (value, key) => console.log(key + ':' + value);\nR.forEachObjIndexed(printKeyConcatValue, {x: 1, y: 2}); //=> {x: 1, y: 2}\n// logs x:1\n// logs y:2"
  },
  "frompairs": {
    "name": "fromPairs",
    "command": "[[k,v]] → {k: v}",
    "category": "List",
    "since": "v0.3.0",
    "description": "Creates a new object from a list key-value pairs. If a key appears in multiple pairs, the rightmost pair is included in the object.",
    "see": [
      "toPairs",
      "pair"
    ],
    "example": "R.fromPairs([['a', 1], ['b', 2], ['c', 3]]); //=> {a: 1, b: 2, c: 3}"
  },
  "groupby": {
    "name": "groupBy",
    "command": "(a → String) → [a] → {String: [a]}",
    "category": "List",
    "since": "v0.1.0",
    "description": "Splits a list into sub-lists stored in an object, based on the result of calling a String-returning function on each element, and grouping the results according to values returned. Dispatches to the `groupBy` method of the second argument, if present. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "reduceBy",
      "transduce"
    ],
    "example": "const byGrade = R.groupBy(function(student) {\n  const score = student.score;\n  return score < 65 ? 'F' :\n         score < 70 ? 'D' :\n         score < 80 ? 'C' :\n         score < 90 ? 'B' : 'A';\n});\nconst students = [{name: 'Abby', score: 84},\n                {name: 'Eddy', score: 58},\n                // ...\n                {name: 'Jack', score: 69}];\nbyGrade(students);\n// {\n//   'A': [{name: 'Dianne', score: 99}],\n//   'B': [{name: 'Abby', score: 84}]\n//   // ...,\n//   'F': [{name: 'Eddy', score: 58}]\n// }"
  },
  "groupwith": {
    "name": "groupWith",
    "command": "((a, a) → Boolean) → [a] → [[a]]",
    "category": "List",
    "since": "v0.21.0",
    "description": "Takes a list and returns a list of lists where each sublist's elements are all satisfied pairwise comparison according to the provided function. Only adjacent elements are passed to the comparison function.",
    "see": [],
    "example": "R.groupWith(R.equals, [0, 1, 1, 2, 3, 5, 8, 13, 21])\n//=> [[0], [1, 1], [2], [3], [5], [8], [13], [21]]\n\nR.groupWith((a, b) => a + 1 === b, [0, 1, 1, 2, 3, 5, 8, 13, 21])\n//=> [[0, 1], [1, 2, 3], [5], [8], [13], [21]]\n\nR.groupWith((a, b) => a % 2 === b % 2, [0, 1, 1, 2, 3, 5, 8, 13, 21])\n//=> [[0], [1, 1], [2], [3, 5], [8], [13, 21]]\n\nR.groupWith(R.eqBy(isVowel), 'aestiou')\n//=> ['ae', 'st', 'iou']"
  },
  "gt": {
    "name": "gt",
    "command": "Ord a => a → a → Boolean",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Returns `true` if the first argument is greater than the second; `false` otherwise.",
    "see": [
      "lt"
    ],
    "example": "R.gt(2, 1); //=> true\nR.gt(2, 2); //=> false\nR.gt(2, 3); //=> false\nR.gt('a', 'z'); //=> false\nR.gt('z', 'a'); //=> true"
  },
  "gte": {
    "name": "gte",
    "command": "Ord a => a → a → Boolean",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Returns `true` if the first argument is greater than or equal to the second; `false` otherwise.",
    "see": [
      "lte"
    ],
    "example": "R.gte(2, 1); //=> true\nR.gte(2, 2); //=> true\nR.gte(2, 3); //=> false\nR.gte('a', 'z'); //=> false\nR.gte('z', 'a'); //=> true"
  },
  "has": {
    "name": "has",
    "command": "s → {s: x} → Boolean",
    "category": "Object",
    "since": "v0.7.0",
    "description": "Returns whether or not an object has an own property with the specified name",
    "see": [],
    "example": "const hasName = R.has('name');\nhasName({name: 'alice'});   //=> true\nhasName({name: 'bob'});     //=> true\nhasName({});                //=> false\n\nconst point = {x: 0, y: 0};\nconst pointHas = R.has(R.__, point);\npointHas('x');  //=> true\npointHas('y');  //=> true\npointHas('z');  //=> false"
  },
  "hasin": {
    "name": "hasIn",
    "command": "s → {s: x} → Boolean",
    "category": "Object",
    "since": "v0.7.0",
    "description": "Returns whether or not an object or its prototype chain has a property with the specified name",
    "see": [],
    "example": "function Rectangle(width, height) {\n  this.width = width;\n  this.height = height;\n}\nRectangle.prototype.area = function() {\n  return this.width * this.height;\n};\n\nconst square = new Rectangle(2, 2);\nR.hasIn('width', square);  //=> true\nR.hasIn('area', square);  //=> true"
  },
  "haspath": {
    "name": "hasPath",
    "command": "[Idx] → {a} → Boolean",
    "category": "Object",
    "since": "v0.26.0",
    "description": "Returns whether or not a path exists in an object. Only the object's own properties are checked.",
    "see": [
      "has"
    ],
    "example": "R.hasPath(['a', 'b'], {a: {b: 2}});         // => true\nR.hasPath(['a', 'b'], {a: {b: undefined}}); // => true\nR.hasPath(['a', 'b'], {a: {c: 2}});         // => false\nR.hasPath(['a', 'b'], {});                  // => false"
  },
  "head": {
    "name": "head",
    "command": "[a] → a | Undefined",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns the first element of the given list or string. In some libraries this function is named `first`.",
    "see": [
      "tail",
      "init",
      "last"
    ],
    "example": "R.head(['fi', 'fo', 'fum']); //=> 'fi'\nR.head([]); //=> undefined\n\nR.head('abc'); //=> 'a'\nR.head(''); //=> ''"
  },
  "identical": {
    "name": "identical",
    "command": "a → a → Boolean",
    "category": "Relation",
    "since": "v0.15.0",
    "description": "Returns true if its arguments are identical, false otherwise. Values are identical if they reference the same memory. `NaN` is identical to `NaN`; `0` and `-0` are not identical. Note this is merely a curried version of ES6 `Object.is`.",
    "see": [],
    "example": "const o = {};\nR.identical(o, o); //=> true\nR.identical(1, 1); //=> true\nR.identical(1, '1'); //=> false\nR.identical([], []); //=> false\nR.identical(0, -0); //=> false\nR.identical(NaN, NaN); //=> true"
  },
  "identity": {
    "name": "identity",
    "command": "a → a",
    "category": "Function",
    "since": "v0.1.0",
    "description": "A function that does nothing but return the parameter supplied to it. Good as a default or placeholder function.",
    "see": [],
    "example": "R.identity(1); //=> 1\n\nconst obj = {};\nR.identity(obj) === obj; //=> true"
  },
  "ifelse": {
    "name": "ifElse",
    "command": "(*… → Boolean) → (*… → *) → (*… → *) → (*… → *)",
    "category": "Logic",
    "since": "v0.8.0",
    "description": "Creates a function that will process either the `onTrue` or the `onFalse` function depending upon the result of the `condition` predicate.",
    "see": [
      "unless",
      "when",
      "cond"
    ],
    "example": "const incCount = R.ifElse(\n  R.has('count'),\n  R.over(R.lensProp('count'), R.inc),\n  R.assoc('count', 1)\n);\nincCount({});           //=> { count: 1 }\nincCount({ count: 1 }); //=> { count: 2 }"
  },
  "inc": {
    "name": "inc",
    "command": "Number → Number",
    "category": "Math",
    "since": "v0.9.0",
    "description": "Increments its argument.",
    "see": [
      "dec"
    ],
    "example": "R.inc(42); //=> 43"
  },
  "includes": {
    "name": "includes",
    "command": "a → [a] → Boolean",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns `true` if the specified value is equal, in `R.equals` terms, to at least one element of the given list; `false` otherwise. Works also with strings.",
    "see": [
      "any"
    ],
    "example": "R.includes(3, [1, 2, 3]); //=> true\nR.includes(4, [1, 2, 3]); //=> false\nR.includes({ name: 'Fred' }, [{ name: 'Fred' }]); //=> true\nR.includes([42], [[42]]); //=> true\nR.includes('ba', 'banana'); //=>true"
  },
  "indexby": {
    "name": "indexBy",
    "command": "(a → String) → [{k: v}] → {k: {k: v}}",
    "category": "List",
    "since": "v0.19.0",
    "description": "Given a function that generates a key, turns a list of objects into an object indexing the objects by the given key. Note that if multiple objects generate the same value for the indexing key only the last value will be included in the generated object. Acts as a transducer if a transformer is given in list position.",
    "see": [],
    "example": "const list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];\nR.indexBy(R.prop('id'), list);\n//=> {abc: {id: 'abc', title: 'B'}, xyz: {id: 'xyz', title: 'A'}}"
  },
  "indexof": {
    "name": "indexOf",
    "command": "a → [a] → Number",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns the position of the first occurrence of an item in an array, or -1 if the item is not included in the array. `R.equals` is used to determine equality.",
    "see": [
      "lastIndexOf"
    ],
    "example": "R.indexOf(3, [1,2,3,4]); //=> 2\nR.indexOf(10, [1,2,3,4]); //=> -1"
  },
  "init": {
    "name": "init",
    "command": "[a] → [a]",
    "category": "List",
    "since": "v0.9.0",
    "description": "Returns all but the last element of the given list or string.",
    "see": [
      "last",
      "head",
      "tail"
    ],
    "example": "R.init([1, 2, 3]);  //=> [1, 2]\nR.init([1, 2]);     //=> [1]\nR.init([1]);        //=> []\nR.init([]);         //=> []\n\nR.init('abc');  //=> 'ab'\nR.init('ab');   //=> 'a'\nR.init('a');    //=> ''\nR.init('');     //=> ''"
  },
  "innerjoin": {
    "name": "innerJoin",
    "command": "((a, b) → Boolean) → [a] → [b] → [a]",
    "category": "Relation",
    "since": "v0.24.0",
    "description": "Takes a predicate `pred`, a list `xs`, and a list `ys`, and returns a list `xs'` comprising each of the elements of `xs` which is equal to one or more elements of `ys` according to `pred`. `pred` must be a binary function expecting an element from each list. `xs`, `ys`, and `xs'` are treated as sets, semantically, so ordering should not be significant, but since `xs'` is ordered the implementation guarantees that its values are in the same order as they appear in `xs`. Duplicates are not removed, so `xs'` may contain duplicates if `xs` contains duplicates.",
    "see": [
      "intersection"
    ],
    "example": "R.innerJoin(\n  (record, id) => record.id === id,\n  [{id: 824, name: 'Richie Furay'},\n   {id: 956, name: 'Dewey Martin'},\n   {id: 313, name: 'Bruce Palmer'},\n   {id: 456, name: 'Stephen Stills'},\n   {id: 177, name: 'Neil Young'}],\n  [177, 456, 999]\n);\n//=> [{id: 456, name: 'Stephen Stills'}, {id: 177, name: 'Neil Young'}]"
  },
  "insert": {
    "name": "insert",
    "command": "Number → a → [a] → [a]",
    "category": "List",
    "since": "v0.2.2",
    "description": "Inserts the supplied element into the list, at the specified `index`. Note that this is not destructive: it returns a copy of the list with the changes. No lists have been harmed in the application of this function.",
    "see": [],
    "example": "R.insert(2, 'x', [1,2,3,4]); //=> [1,2,'x',3,4]"
  },
  "insertall": {
    "name": "insertAll",
    "command": "Number → [a] → [a] → [a]",
    "category": "List",
    "since": "v0.9.0",
    "description": "Inserts the sub-list into the list, at the specified `index`. Note that this is not destructive: it returns a copy of the list with the changes. No lists have been harmed in the application of this function.",
    "see": [],
    "example": "R.insertAll(2, ['x','y','z'], [1,2,3,4]); //=> [1,2,'x','y','z',3,4]"
  },
  "intersection": {
    "name": "intersection",
    "command": "[*] → [*] → [*]",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Combines two lists into a set (i.e. no duplicates) composed of those elements common to both lists.",
    "see": [
      "innerJoin"
    ],
    "example": "R.intersection([1,2,3,4], [7,6,5,4,3]); //=> [4, 3]"
  },
  "intersperse": {
    "name": "intersperse",
    "command": "a → [a] → [a]",
    "category": "List",
    "since": "v0.14.0",
    "description": "Creates a new list with the separator interposed between elements. Dispatches to the `intersperse` method of the second argument, if present.",
    "see": [],
    "example": "R.intersperse('a', ['b', 'n', 'n', 's']); //=> ['b', 'a', 'n', 'a', 'n', 'a', 's']"
  },
  "into": {
    "name": "into",
    "command": "a → (b → b) → [c] → a",
    "category": "List",
    "since": "v0.12.0",
    "description": "Transforms the items of the list with the transducer and appends the transformed items to the accumulator using an appropriate iterator function based on the accumulator type. The accumulator can be an array, string, object or a transformer. Iterated items will be appended to arrays and concatenated to strings. Objects will be merged directly or 2-item arrays will be merged as key, value pairs. The accumulator can also be a transformer object that provides a 2-arity reducing iterator function, step, 0-arity initial value function, init, and 1-arity result extraction function result. The step function is used as the iterator function in reduce. The result function is used to convert the final accumulator into the return type and in most cases is R.identity. The init function is used to provide the initial accumulator. The iteration is performed with `R.reduce` after initializing the transducer.",
    "see": [
      "transduce"
    ],
    "example": "const numbers = [1, 2, 3, 4];\nconst transducer = R.compose(R.map(R.add(1)), R.take(2));\n\nR.into([], transducer, numbers); //=> [2, 3]\n\nconst intoArray = R.into([]);\nintoArray(transducer, numbers); //=> [2, 3]"
  },
  "invert": {
    "name": "invert",
    "command": "{s: x} → {x: [ s, … ]}",
    "category": "Object",
    "since": "v0.9.0",
    "description": "Same as `R.invertObj`, however this accounts for objects with duplicate values by putting the values into an array.",
    "see": [
      "invertObj"
    ],
    "example": "const raceResultsByFirstName = {\n  first: 'alice',\n  second: 'jake',\n  third: 'alice',\n};\nR.invert(raceResultsByFirstName);\n//=> { 'alice': ['first', 'third'], 'jake':['second'] }"
  },
  "invertobj": {
    "name": "invertObj",
    "command": "{s: x} → {x: s}",
    "category": "Object",
    "since": "v0.9.0",
    "description": "Returns a new object with the keys of the given object as values, and the values of the given object, which are coerced to strings, as keys. Note that the last key found is preferred when handling the same value.",
    "see": [
      "invert"
    ],
    "example": "const raceResults = {\n  first: 'alice',\n  second: 'jake'\n};\nR.invertObj(raceResults);\n//=> { 'alice': 'first', 'jake':'second' }\n\n// Alternatively:\nconst raceResults = ['alice', 'jake'];\nR.invertObj(raceResults);\n//=> { 'alice': '0', 'jake':'1' }"
  },
  "invoker": {
    "name": "invoker",
    "command": "Number → String → (a → b → … → n → Object → *)",
    "category": "Function",
    "since": "v0.1.0",
    "description": "Turns a named method with a specified arity into a function that can be called directly supplied with arguments and a target object. The returned function is curried and accepts `arity + 1` parameters where the final parameter is the target object.",
    "see": [
      "construct"
    ],
    "example": "const sliceFrom = R.invoker(1, 'slice');\nsliceFrom(6, 'abcdefghijklm'); //=> 'ghijklm'\nconst sliceFrom6 = R.invoker(2, 'slice')(6);\nsliceFrom6(8, 'abcdefghijklm'); //=> 'gh'"
  },
  "is": {
    "name": "is",
    "command": "(* → {*}) → a → Boolean",
    "category": "Type",
    "since": "v0.3.0",
    "description": "See if an object (`val`) is an instance of the supplied constructor. This function will check up the inheritance chain, if any.",
    "see": [],
    "example": "R.is(Object, {}); //=> true\nR.is(Number, 1); //=> true\nR.is(Object, 1); //=> false\nR.is(String, 's'); //=> true\nR.is(String, new String('')); //=> true\nR.is(Object, new String('')); //=> true\nR.is(Object, 's'); //=> false\nR.is(Number, {}); //=> false"
  },
  "isempty": {
    "name": "isEmpty",
    "command": "a → Boolean",
    "category": "Logic",
    "since": "v0.1.0",
    "description": "Returns `true` if the given value is its type's empty value; `false` otherwise.",
    "see": [
      "empty"
    ],
    "example": "R.isEmpty([1, 2, 3]);   //=> false\nR.isEmpty([]);          //=> true\nR.isEmpty('');          //=> true\nR.isEmpty(null);        //=> false\nR.isEmpty({});          //=> true\nR.isEmpty({length: 0}); //=> false"
  },
  "isnil": {
    "name": "isNil",
    "command": "* → Boolean",
    "category": "Type",
    "since": "v0.9.0",
    "description": "Checks if the input value is `null` or `undefined`.",
    "see": [],
    "example": "R.isNil(null); //=> true\nR.isNil(undefined); //=> true\nR.isNil(0); //=> false\nR.isNil([]); //=> false"
  },
  "join": {
    "name": "join",
    "command": "String → [a] → String",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns a string made by inserting the `separator` between each element and concatenating all the elements into a single string.",
    "see": [
      "split"
    ],
    "example": "const spacer = R.join(' ');\nspacer(['a', 2, 3.4]);   //=> 'a 2 3.4'\nR.join('|', [1, 2, 3]);    //=> '1|2|3'"
  },
  "juxt": {
    "name": "juxt",
    "command": "[(a, b, …, m) → n] → ((a, b, …, m) → [n])",
    "category": "Function",
    "since": "v0.19.0",
    "description": "juxt applies a list of functions to a list of values.",
    "see": [
      "applySpec"
    ],
    "example": "const getRange = R.juxt([Math.min, Math.max]);\ngetRange(3, 4, 9, -3); //=> [-3, 9]"
  },
  "keys": {
    "name": "keys",
    "command": "{k: v} → [k]",
    "category": "Object",
    "since": "v0.1.0",
    "description": "Returns a list containing the names of all the enumerable own properties of the supplied object. Note that the order of the output array is not guaranteed to be consistent across different JS platforms.",
    "see": [
      "keysIn",
      "values"
    ],
    "example": "R.keys({a: 1, b: 2, c: 3}); //=> ['a', 'b', 'c']"
  },
  "keysin": {
    "name": "keysIn",
    "command": "{k: v} → [k]",
    "category": "Object",
    "since": "v0.2.0",
    "description": "Returns a list containing the names of all the properties of the supplied object, including prototype properties. Note that the order of the output array is not guaranteed to be consistent across different JS platforms.",
    "see": [
      "keys",
      "valuesIn"
    ],
    "example": "const F = function() { this.x = 'X'; };\nF.prototype.y = 'Y';\nconst f = new F();\nR.keysIn(f); //=> ['x', 'y']"
  },
  "last": {
    "name": "last",
    "command": "[a] → a | Undefined",
    "category": "List",
    "since": "v0.1.4",
    "description": "Returns the last element of the given list or string.",
    "see": [
      "init",
      "head",
      "tail"
    ],
    "example": "R.last(['fi', 'fo', 'fum']); //=> 'fum'\nR.last([]); //=> undefined\n\nR.last('abc'); //=> 'c'\nR.last(''); //=> ''"
  },
  "lastindexof": {
    "name": "lastIndexOf",
    "command": "a → [a] → Number",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns the position of the last occurrence of an item in an array, or -1 if the item is not included in the array. `R.equals` is used to determine equality.",
    "see": [
      "indexOf"
    ],
    "example": "R.lastIndexOf(3, [-1,3,3,0,1,2,3,4]); //=> 6\nR.lastIndexOf(10, [1,2,3,4]); //=> -1"
  },
  "length": {
    "name": "length",
    "command": "[a] → Number",
    "category": "List",
    "since": "v0.3.0",
    "description": "Returns the number of elements in the array by returning `list.length`.",
    "see": [],
    "example": "R.length([]); //=> 0\nR.length([1, 2, 3]); //=> 3"
  },
  "lens": {
    "name": "lens",
    "command": "(s → a) → ((a, s) → s) → Lens s a",
    "category": "Object",
    "since": "v0.8.0",
    "description": "Returns a lens for the given getter and setter functions. The getter \"gets\" the value of the focus; the setter \"sets\" the value of the focus. The setter should not mutate the data structure.",
    "see": [
      "view",
      "set",
      "over",
      "lensIndex",
      "lensProp"
    ],
    "example": "const xLens = R.lens(R.prop('x'), R.assoc('x'));\n\nR.view(xLens, {x: 1, y: 2});            //=> 1\nR.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}\nR.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}"
  },
  "lensindex": {
    "name": "lensIndex",
    "command": "Number → Lens s a",
    "category": "Object",
    "since": "v0.14.0",
    "description": "Returns a lens whose focus is the specified index.",
    "see": [
      "view",
      "set",
      "over"
    ],
    "example": "const headLens = R.lensIndex(0);\n\nR.view(headLens, ['a', 'b', 'c']);            //=> 'a'\nR.set(headLens, 'x', ['a', 'b', 'c']);        //=> ['x', 'b', 'c']\nR.over(headLens, R.toUpper, ['a', 'b', 'c']); //=> ['A', 'b', 'c']"
  },
  "lenspath": {
    "name": "lensPath",
    "command": "[Idx] → Lens s a",
    "category": "Object",
    "since": "v0.19.0",
    "description": "Returns a lens whose focus is the specified path.",
    "see": [
      "view",
      "set",
      "over"
    ],
    "example": "const xHeadYLens = R.lensPath(['x', 0, 'y']);\n\nR.view(xHeadYLens, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});\n//=> 2\nR.set(xHeadYLens, 1, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});\n//=> {x: [{y: 1, z: 3}, {y: 4, z: 5}]}\nR.over(xHeadYLens, R.negate, {x: [{y: 2, z: 3}, {y: 4, z: 5}]});\n//=> {x: [{y: -2, z: 3}, {y: 4, z: 5}]}"
  },
  "lensprop": {
    "name": "lensProp",
    "command": "String → Lens s a",
    "category": "Object",
    "since": "v0.14.0",
    "description": "Returns a lens whose focus is the specified property.",
    "see": [
      "view",
      "set",
      "over"
    ],
    "example": "const xLens = R.lensProp('x');\n\nR.view(xLens, {x: 1, y: 2});            //=> 1\nR.set(xLens, 4, {x: 1, y: 2});          //=> {x: 4, y: 2}\nR.over(xLens, R.negate, {x: 1, y: 2});  //=> {x: -1, y: 2}"
  },
  "lift": {
    "name": "lift",
    "command": "(*… → *) → ([*]… → [*])",
    "category": "Function",
    "since": "v0.7.0",
    "description": "\"lifts\" a function of arity > 1 so that it may \"map over\" a list, Function or other object that satisfies the FantasyLand Apply spec.",
    "see": [
      "liftN"
    ],
    "example": "const madd3 = R.lift((a, b, c) => a + b + c);\n\nmadd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]\n\nconst madd5 = R.lift((a, b, c, d, e) => a + b + c + d + e);\n\nmadd5([1,2], [3], [4, 5], [6], [7, 8]); //=> [21, 22, 22, 23, 22, 23, 23, 24]"
  },
  "liftn": {
    "name": "liftN",
    "command": "Number → (*… → *) → ([*]… → [*])",
    "category": "Function",
    "since": "v0.7.0",
    "description": "\"lifts\" a function to be the specified arity, so that it may \"map over\" that many lists, Functions or other objects that satisfy the FantasyLand Apply spec.",
    "see": [
      "lift",
      "ap"
    ],
    "example": "const madd3 = R.liftN(3, (...args) => R.sum(args));\nmadd3([1,2,3], [1,2,3], [1]); //=> [3, 4, 5, 4, 5, 6, 5, 6, 7]"
  },
  "lt": {
    "name": "lt",
    "command": "Ord a => a → a → Boolean",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Returns `true` if the first argument is less than the second; `false` otherwise.",
    "see": [
      "gt"
    ],
    "example": "R.lt(2, 1); //=> false\nR.lt(2, 2); //=> false\nR.lt(2, 3); //=> true\nR.lt('a', 'z'); //=> true\nR.lt('z', 'a'); //=> false"
  },
  "lte": {
    "name": "lte",
    "command": "Ord a => a → a → Boolean",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Returns `true` if the first argument is less than or equal to the second; `false` otherwise.",
    "see": [
      "gte"
    ],
    "example": "R.lte(2, 1); //=> false\nR.lte(2, 2); //=> true\nR.lte(2, 3); //=> true\nR.lte('a', 'z'); //=> true\nR.lte('z', 'a'); //=> false"
  },
  "map": {
    "name": "map",
    "command": "Functor f => (a → b) → f a → f b",
    "category": "List",
    "since": "v0.1.0",
    "description": "Takes a function and a functor, applies the function to each of the functor's values, and returns a functor of the same shape. Ramda provides suitable `map` implementations for `Array` and `Object`, so this function may be applied to `[1, 2, 3]` or `{x: 1, y: 2, z: 3}`. Dispatches to the `map` method of the second argument, if present. Acts as a transducer if a transformer is given in list position. Also treats functions as functors and will compose them together.",
    "see": [
      "transduce",
      "addIndex"
    ],
    "example": "const double = x => x * 2;\n\nR.map(double, [1, 2, 3]); //=> [2, 4, 6]\n\nR.map(double, {x: 1, y: 2, z: 3}); //=> {x: 2, y: 4, z: 6}"
  },
  "mapaccum": {
    "name": "mapAccum",
    "command": "((acc, x) → (acc, y)) → acc → [x] → (acc, [y])",
    "category": "List",
    "since": "v0.10.0",
    "description": "The `mapAccum` function behaves like a combination of map and reduce; it applies a function to each element of a list, passing an accumulating parameter from left to right, and returning a final value of this accumulator together with the new list. The iterator function receives two arguments, acc and value, and should return a tuple [acc, value].",
    "see": [
      "scan",
      "addIndex",
      "mapAccumRight"
    ],
    "example": "const digits = ['1', '2', '3', '4'];\nconst appender = (a, b) => [a + b, a + b];\n\nR.mapAccum(appender, 0, digits); //=> ['01234', ['01', '012', '0123', '01234']]"
  },
  "mapaccumright": {
    "name": "mapAccumRight",
    "command": "((acc, x) → (acc, y)) → acc → [x] → (acc, [y])",
    "category": "List",
    "since": "v0.10.0",
    "description": "The `mapAccumRight` function behaves like a combination of map and reduce; it applies a function to each element of a list, passing an accumulating parameter from right to left, and returning a final value of this accumulator together with the new list. Similar to `mapAccum`, except moves through the input list from the right to the left. The iterator function receives two arguments, acc and value, and should return a tuple [acc, value].",
    "see": [
      "addIndex",
      "mapAccum"
    ],
    "example": "const digits = ['1', '2', '3', '4'];\nconst appender = (a, b) => [b + a, b + a];\n\nR.mapAccumRight(appender, 5, digits); //=> ['12345', ['12345', '2345', '345', '45']]"
  },
  "mapobjindexed": {
    "name": "mapObjIndexed",
    "command": "((*, String, Object) → *) → Object → Object",
    "category": "Object",
    "since": "v0.9.0",
    "description": "An Object-specific version of `map`. The function is applied to three arguments: (value, key, obj). If only the value is significant, use `map` instead.",
    "see": [
      "map"
    ],
    "example": "const xyz = { x: 1, y: 2, z: 3 };\nconst prependKeyAndDouble = (num, key, obj) => key + (num * 2);\n\nR.mapObjIndexed(prependKeyAndDouble, xyz); //=> { x: 'x2', y: 'y4', z: 'z6' }"
  },
  "match": {
    "name": "match",
    "command": "RegExp → String → [String | Undefined]",
    "category": "String",
    "since": "v0.1.0",
    "description": "Tests a regular expression against a String. Note that this function will return an empty array when there are no matches. This differs from `String.prototype.match` which returns `null` when there are no matches.",
    "see": [
      "test"
    ],
    "example": "R.match(/([a-z]a)/g, 'bananas'); //=> ['ba', 'na', 'na']\nR.match(/a/, 'b'); //=> []\nR.match(/a/, null); //=> TypeError: null does not have a method named \"match\""
  },
  "mathmod": {
    "name": "mathMod",
    "command": "Number → Number → Number",
    "category": "Math",
    "since": "v0.3.0",
    "description": "`mathMod` behaves like the modulo operator should mathematically, unlike the `%` operator (and by extension, `R.modulo`). So while `-17 % 5` is `-2`, `mathMod(-17, 5)` is `3`. `mathMod` requires Integer arguments, and returns NaN when the modulus is zero or negative.",
    "see": [
      "modulo"
    ],
    "example": "R.mathMod(-17, 5);  //=> 3\nR.mathMod(17, 5);   //=> 2\nR.mathMod(17, -5);  //=> NaN\nR.mathMod(17, 0);   //=> NaN\nR.mathMod(17.2, 5); //=> NaN\nR.mathMod(17, 5.3); //=> NaN\n\nconst clock = R.mathMod(R.__, 12);\nclock(15); //=> 3\nclock(24); //=> 0\n\nconst seventeenMod = R.mathMod(17);\nseventeenMod(3);  //=> 2\nseventeenMod(4);  //=> 1\nseventeenMod(10); //=> 7"
  },
  "max": {
    "name": "max",
    "command": "Ord a => a → a → a",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Returns the larger of its two arguments.",
    "see": [
      "maxBy",
      "min"
    ],
    "example": "R.max(789, 123); //=> 789\nR.max('a', 'b'); //=> 'b'"
  },
  "maxby": {
    "name": "maxBy",
    "command": "Ord b => (a → b) → a → a → a",
    "category": "Relation",
    "since": "v0.8.0",
    "description": "Takes a function and two values, and returns whichever value produces the larger result when passed to the provided function.",
    "see": [
      "max",
      "minBy"
    ],
    "example": "//  square :: Number -> Number\nconst square = n => n * n;\n\nR.maxBy(square, -3, 2); //=> -3\n\nR.reduce(R.maxBy(square), 0, [3, -5, 4, 1, -2]); //=> -5\nR.reduce(R.maxBy(square), 0, []); //=> 0"
  },
  "mean": {
    "name": "mean",
    "command": "[Number] → Number",
    "category": "Math",
    "since": "v0.14.0",
    "description": "Returns the mean of the given list of numbers.",
    "see": [
      "median"
    ],
    "example": "R.mean([2, 7, 9]); //=> 6\nR.mean([]); //=> NaN"
  },
  "median": {
    "name": "median",
    "command": "[Number] → Number",
    "category": "Math",
    "since": "v0.14.0",
    "description": "Returns the median of the given list of numbers.",
    "see": [
      "mean"
    ],
    "example": "R.median([2, 9, 7]); //=> 7\nR.median([7, 2, 10, 9]); //=> 8\nR.median([]); //=> NaN"
  },
  "memoizewith": {
    "name": "memoizeWith",
    "command": "(*… → String) → (*… → a) → (*… → a)",
    "category": "Function",
    "since": "v0.24.0",
    "description": "Creates a new function that, when invoked, caches the result of calling `fn` for a given argument set and returns the result. Subsequent calls to the memoized `fn` with the same argument set will not result in an additional call to `fn`; instead, the cached result for that set of arguments will be returned.",
    "see": [],
    "example": "let count = 0;\nconst factorial = R.memoizeWith(R.identity, n => {\n  count += 1;\n  return R.product(R.range(1, n + 1));\n});\nfactorial(5); //=> 120\nfactorial(5); //=> 120\nfactorial(5); //=> 120\ncount; //=> 1"
  },
  "merge": {
    "name": "merge",
    "command": "merge",
    "category": "Object",
    "since": "v0.1.0",
    "description": "Create a new object with the own properties of the first object merged with the own properties of the second object. If a key exists in both objects, the value from the second object will be used.",
    "see": [
      "mergeRight",
      "mergeDeepRight",
      "mergeWith",
      "mergeWithKey"
    ],
    "example": "R.merge({ 'name': 'fred', 'age': 10 }, { 'age': 40 });\n//=> { 'name': 'fred', 'age': 40 }\n\nconst withDefaults = R.merge({x: 0, y: 0});\nwithDefaults({y: 2}); //=> {x: 0, y: 2}"
  },
  "mergeall": {
    "name": "mergeAll",
    "command": "[{k: v}] → {k: v}",
    "category": "List",
    "since": "v0.10.0",
    "description": "Merges a list of objects together into one object.",
    "see": [
      "reduce"
    ],
    "example": "R.mergeAll([{foo:1},{bar:2},{baz:3}]); //=> {foo:1,bar:2,baz:3}\nR.mergeAll([{foo:1},{foo:2},{bar:2}]); //=> {foo:2,bar:2}"
  },
  "mergedeepleft": {
    "name": "mergeDeepLeft",
    "command": "{a} → {a} → {a}",
    "category": "Object",
    "since": "v0.24.0",
    "description": "Creates a new object with the own properties of the first object merged with the own properties of the second object. If a key exists in both objects: and both values are objects, the two values will be recursively merged otherwise the value from the first object will be used.",
    "see": [
      "merge",
      "mergeDeepRight",
      "mergeDeepWith",
      "mergeDeepWithKey"
    ],
    "example": "R.mergeDeepLeft({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},\n                { age: 40, contact: { email: 'baa@example.com' }});\n//=> { name: 'fred', age: 10, contact: { email: 'moo@example.com' }}"
  },
  "mergedeepright": {
    "name": "mergeDeepRight",
    "command": "{a} → {a} → {a}",
    "category": "Object",
    "since": "v0.24.0",
    "description": "Creates a new object with the own properties of the first object merged with the own properties of the second object. If a key exists in both objects: and both values are objects, the two values will be recursively merged otherwise the value from the second object will be used.",
    "see": [
      "merge",
      "mergeDeepLeft",
      "mergeDeepWith",
      "mergeDeepWithKey"
    ],
    "example": "R.mergeDeepRight({ name: 'fred', age: 10, contact: { email: 'moo@example.com' }},\n                 { age: 40, contact: { email: 'baa@example.com' }});\n//=> { name: 'fred', age: 40, contact: { email: 'baa@example.com' }}"
  },
  "mergedeepwith": {
    "name": "mergeDeepWith",
    "command": "((a, a) → a) → {a} → {a} → {a}",
    "category": "Object",
    "since": "v0.24.0",
    "description": "Creates a new object with the own properties of the two provided objects. If a key exists in both objects: and both associated values are also objects then the values will be recursively merged. otherwise the provided function is applied to associated values using the resulting value as the new value associated with the key. If a key only exists in one object, the value will be associated with the key of the resulting object.",
    "see": [
      "mergeWith",
      "mergeDeepWithKey"
    ],
    "example": "R.mergeDeepWith(R.concat,\n                { a: true, c: { values: [10, 20] }},\n                { b: true, c: { values: [15, 35] }});\n//=> { a: true, b: true, c: { values: [10, 20, 15, 35] }}"
  },
  "mergedeepwithkey": {
    "name": "mergeDeepWithKey",
    "command": "((String, a, a) → a) → {a} → {a} → {a}",
    "category": "Object",
    "since": "v0.24.0",
    "description": "Creates a new object with the own properties of the two provided objects. If a key exists in both objects: and both associated values are also objects then the values will be recursively merged. otherwise the provided function is applied to the key and associated values using the resulting value as the new value associated with the key. If a key only exists in one object, the value will be associated with the key of the resulting object.",
    "see": [
      "mergeWithKey",
      "mergeDeepWith"
    ],
    "example": "let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r\nR.mergeDeepWithKey(concatValues,\n                   { a: true, c: { thing: 'foo', values: [10, 20] }},\n                   { b: true, c: { thing: 'bar', values: [15, 35] }});\n//=> { a: true, b: true, c: { thing: 'bar', values: [10, 20, 15, 35] }}"
  },
  "mergeleft": {
    "name": "mergeLeft",
    "command": "{k: v} → {k: v} → {k: v}",
    "category": "Object",
    "since": "Unknown",
    "description": "Create a new object with the own properties of the first object merged with the own properties of the second object. If a key exists in both objects, the value from the first object will be used.",
    "see": [
      "mergeRight",
      "mergeDeepLeft",
      "mergeWith",
      "mergeWithKey"
    ],
    "example": "R.mergeLeft({ 'age': 40 }, { 'name': 'fred', 'age': 10 });\n//=> { 'name': 'fred', 'age': 40 }\n\nconst resetToDefault = R.mergeLeft({x: 0});\nresetToDefault({x: 5, y: 2}); //=> {x: 0, y: 2}"
  },
  "mergeright": {
    "name": "mergeRight",
    "command": "{k: v} → {k: v} → {k: v}",
    "category": "Object",
    "since": "Unknown",
    "description": "Create a new object with the own properties of the first object merged with the own properties of the second object. If a key exists in both objects, the value from the second object will be used.",
    "see": [
      "mergeLeft",
      "mergeDeepRight",
      "mergeWith",
      "mergeWithKey"
    ],
    "example": "R.mergeRight({ 'name': 'fred', 'age': 10 }, { 'age': 40 });\n//=> { 'name': 'fred', 'age': 40 }\n\nconst withDefaults = R.mergeRight({x: 0, y: 0});\nwithDefaults({y: 2}); //=> {x: 0, y: 2}"
  },
  "mergewith": {
    "name": "mergeWith",
    "command": "((a, a) → a) → {a} → {a} → {a}",
    "category": "Object",
    "since": "v0.19.0",
    "description": "Creates a new object with the own properties of the two provided objects. If a key exists in both objects, the provided function is applied to the values associated with the key in each object, with the result being used as the value associated with the key in the returned object.",
    "see": [
      "mergeDeepWith",
      "merge",
      "mergeWithKey"
    ],
    "example": "R.mergeWith(R.concat,\n            { a: true, values: [10, 20] },\n            { b: true, values: [15, 35] });\n//=> { a: true, b: true, values: [10, 20, 15, 35] }"
  },
  "mergewithkey": {
    "name": "mergeWithKey",
    "command": "((String, a, a) → a) → {a} → {a} → {a}",
    "category": "Object",
    "since": "v0.19.0",
    "description": "Creates a new object with the own properties of the two provided objects. If a key exists in both objects, the provided function is applied to the key and the values associated with the key in each object, with the result being used as the value associated with the key in the returned object.",
    "see": [
      "mergeDeepWithKey",
      "merge",
      "mergeWith"
    ],
    "example": "let concatValues = (k, l, r) => k == 'values' ? R.concat(l, r) : r\nR.mergeWithKey(concatValues,\n               { a: true, thing: 'foo', values: [10, 20] },\n               { b: true, thing: 'bar', values: [15, 35] });\n//=> { a: true, b: true, thing: 'bar', values: [10, 20, 15, 35] }"
  },
  "min": {
    "name": "min",
    "command": "Ord a => a → a → a",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Returns the smaller of its two arguments.",
    "see": [
      "minBy",
      "max"
    ],
    "example": "R.min(789, 123); //=> 123\nR.min('a', 'b'); //=> 'a'"
  },
  "minby": {
    "name": "minBy",
    "command": "Ord b => (a → b) → a → a → a",
    "category": "Relation",
    "since": "v0.8.0",
    "description": "Takes a function and two values, and returns whichever value produces the smaller result when passed to the provided function.",
    "see": [
      "min",
      "maxBy"
    ],
    "example": "//  square :: Number -> Number\nconst square = n => n * n;\n\nR.minBy(square, -3, 2); //=> 2\n\nR.reduce(R.minBy(square), Infinity, [3, -5, 4, 1, -2]); //=> 1\nR.reduce(R.minBy(square), Infinity, []); //=> Infinity"
  },
  "modulo": {
    "name": "modulo",
    "command": "Number → Number → Number",
    "category": "Math",
    "since": "v0.1.1",
    "description": "Divides the first parameter by the second and returns the remainder. Note that this function preserves the JavaScript-style behavior for modulo. For mathematical modulo see `mathMod`.",
    "see": [
      "mathMod"
    ],
    "example": "R.modulo(17, 3); //=> 2\n// JS behavior:\nR.modulo(-17, 3); //=> -2\nR.modulo(17, -3); //=> 2\n\nconst isOdd = R.modulo(R.__, 2);\nisOdd(42); //=> 0\nisOdd(21); //=> 1"
  },
  "move": {
    "name": "move",
    "command": "Number → Number → [a] → [a]",
    "category": "List",
    "since": "Unknown",
    "description": "Move an item, at index `from`, to index `to`, in a list of elements. A new list will be created containing the new elements order.",
    "see": [],
    "example": "R.move(0, 2, ['a', 'b', 'c', 'd', 'e', 'f']); //=> ['b', 'c', 'a', 'd', 'e', 'f']\nR.move(-1, 0, ['a', 'b', 'c', 'd', 'e', 'f']); //=> ['f', 'a', 'b', 'c', 'd', 'e'] list rotation"
  },
  "multiply": {
    "name": "multiply",
    "command": "Number → Number → Number",
    "category": "Math",
    "since": "v0.1.0",
    "description": "Multiplies two numbers. Equivalent to `a * b` but curried.",
    "see": [
      "divide"
    ],
    "example": "const double = R.multiply(2);\nconst triple = R.multiply(3);\ndouble(3);       //=>  6\ntriple(4);       //=> 12\nR.multiply(2, 5);  //=> 10"
  },
  "nary": {
    "name": "nAry",
    "command": "Number → (* → a) → (* → a)",
    "category": "Function",
    "since": "v0.1.0",
    "description": "Wraps a function of any arity (including nullary) in a function that accepts exactly `n` parameters. Any extraneous parameters will not be passed to the supplied function.",
    "see": [
      "binary",
      "unary"
    ],
    "example": "const takesTwoArgs = (a, b) => [a, b];\n\ntakesTwoArgs.length; //=> 2\ntakesTwoArgs(1, 2); //=> [1, 2]\n\nconst takesOneArg = R.nAry(1, takesTwoArgs);\ntakesOneArg.length; //=> 1\n// Only `n` arguments are passed to the wrapped function\ntakesOneArg(1, 2); //=> [1, undefined]"
  },
  "negate": {
    "name": "negate",
    "command": "Number → Number",
    "category": "Math",
    "since": "v0.9.0",
    "description": "Negates its argument.",
    "see": [],
    "example": "R.negate(42); //=> -42"
  },
  "none": {
    "name": "none",
    "command": "(a → Boolean) → [a] → Boolean",
    "category": "List",
    "since": "v0.12.0",
    "description": "Returns `true` if no elements of the list match the predicate, `false` otherwise. Dispatches to the `all` method of the second argument, if present. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "all",
      "any"
    ],
    "example": "const isEven = n => n % 2 === 0;\nconst isOdd = n => n % 2 === 1;\n\nR.none(isEven, [1, 3, 5, 7, 9, 11]); //=> true\nR.none(isOdd, [1, 3, 5, 7, 8, 11]); //=> false"
  },
  "not": {
    "name": "not",
    "command": "* → Boolean",
    "category": "Logic",
    "since": "v0.1.0",
    "description": "A function that returns the `!` of its argument. It will return `true` when passed false-y value, and `false` when passed a truth-y one.",
    "see": [
      "complement"
    ],
    "example": "R.not(true); //=> false\nR.not(false); //=> true\nR.not(0); //=> true\nR.not(1); //=> false"
  },
  "nth": {
    "name": "nth",
    "command": "Number → [a] → a | Undefined",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns the nth element of the given list or string. If n is negative the element at index length + n is returned.",
    "see": [],
    "example": "const list = ['foo', 'bar', 'baz', 'quux'];\nR.nth(1, list); //=> 'bar'\nR.nth(-1, list); //=> 'quux'\nR.nth(-99, list); //=> undefined\n\nR.nth(2, 'abc'); //=> 'c'\nR.nth(3, 'abc'); //=> ''"
  },
  "ntharg": {
    "name": "nthArg",
    "command": "Number → *… → *",
    "category": "Function",
    "since": "v0.9.0",
    "description": "Returns a function which returns its nth argument.",
    "see": [],
    "example": "R.nthArg(1)('a', 'b', 'c'); //=> 'b'\nR.nthArg(-1)('a', 'b', 'c'); //=> 'c'"
  },
  "o": {
    "name": "o",
    "command": "(b → c) → (a → b) → a → c",
    "category": "Function",
    "since": "v0.24.0",
    "description": "`o` is a curried composition function that returns a unary function. Like `compose`, `o` performs right-to-left function composition. Unlike `compose`, the rightmost function passed to `o` will be invoked with only one argument. Also, unlike `compose`, `o` is limited to accepting only 2 unary functions. The name o was chosen because of its similarity to the mathematical composition operator ∘.",
    "see": [
      "compose",
      "pipe"
    ],
    "example": "const classyGreeting = name => \"The name's \" + name.last + \", \" + name.first + \" \" + name.last\nconst yellGreeting = R.o(R.toUpper, classyGreeting);\nyellGreeting({first: 'James', last: 'Bond'}); //=> \"THE NAME'S BOND, JAMES BOND\"\n\nR.o(R.multiply(10), R.add(10))(-4) //=> 60"
  },
  "objof": {
    "name": "objOf",
    "command": "String → a → {String:a}",
    "category": "Object",
    "since": "v0.18.0",
    "description": "Creates an object containing a single key:value pair.",
    "see": [
      "pair"
    ],
    "example": "const matchPhrases = R.compose(\n  R.objOf('must'),\n  R.map(R.objOf('match_phrase'))\n);\nmatchPhrases(['foo', 'bar', 'baz']); //=> {must: [{match_phrase: 'foo'}, {match_phrase: 'bar'}, {match_phrase: 'baz'}]}"
  },
  "of": {
    "name": "of",
    "command": "a → [a]",
    "category": "Function",
    "since": "v0.3.0",
    "description": "Returns a singleton array containing the value provided. Note this `of` is different from the ES6 `of`; See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/of",
    "see": [],
    "example": "R.of(null); //=> [null]\nR.of([42]); //=> [[42]]"
  },
  "omit": {
    "name": "omit",
    "command": "[String] → {String: *} → {String: *}",
    "category": "Object",
    "since": "v0.1.0",
    "description": "Returns a partial copy of an object omitting the keys specified.",
    "see": [
      "pick"
    ],
    "example": "R.omit(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, c: 3}"
  },
  "once": {
    "name": "once",
    "command": "(a… → b) → (a… → b)",
    "category": "Function",
    "since": "v0.1.0",
    "description": "Accepts a function `fn` and returns a function that guards invocation of `fn` such that `fn` can only ever be called once, no matter how many times the returned function is invoked. The first value calculated is returned in subsequent invocations.",
    "see": [],
    "example": "const addOneOnce = R.once(x => x + 1);\naddOneOnce(10); //=> 11\naddOneOnce(addOneOnce(50)); //=> 11"
  },
  "or": {
    "name": "or",
    "command": "a → b → a | b",
    "category": "Logic",
    "since": "v0.1.0",
    "description": "Returns `true` if one or both of its arguments are `true`. Returns `false` if both arguments are `false`.",
    "see": [
      "either"
    ],
    "example": "R.or(true, true); //=> true\nR.or(true, false); //=> true\nR.or(false, true); //=> true\nR.or(false, false); //=> false"
  },
  "otherwise": {
    "name": "otherwise",
    "command": "(e → b) → (Promise e a) → (Promise e b)",
    "category": "Function",
    "since": "Unknown",
    "description": "Returns the result of applying the onFailure function to the value inside a failed promise. This is useful for handling rejected promises inside function compositions.",
    "see": [
      "then"
    ],
    "example": "var failedFetch = (id) => Promise.reject('bad ID');\nvar useDefault = () => ({ firstName: 'Bob', lastName: 'Loblaw' })\n\n//recoverFromFailure :: String -> Promise ({firstName, lastName})\nvar recoverFromFailure = R.pipe(\n  failedFetch,\n  R.otherwise(useDefault),\n  R.then(R.pick(['firstName', 'lastName'])),\n);\nrecoverFromFailure(12345).then(console.log)"
  },
  "over": {
    "name": "over",
    "command": "Lens s a → (a → a) → s → s",
    "category": "Object",
    "since": "v0.16.0",
    "description": "Returns the result of \"setting\" the portion of the given data structure focused by the given lens to the result of applying the given function to the focused value.",
    "see": [
      "prop",
      "lensIndex",
      "lensProp"
    ],
    "example": "const headLens = R.lensIndex(0);\n\nR.over(headLens, R.toUpper, ['foo', 'bar', 'baz']); //=> ['FOO', 'bar', 'baz']"
  },
  "pair": {
    "name": "pair",
    "command": "a → b → (a,b)",
    "category": "List",
    "since": "v0.18.0",
    "description": "Takes two arguments, `fst` and `snd`, and returns `[fst, snd]`.",
    "see": [
      "objOf",
      "of"
    ],
    "example": "R.pair('foo', 'bar'); //=> ['foo', 'bar']"
  },
  "partial": {
    "name": "partial",
    "command": "((a, b, c, …, n) → x) → [a, b, c, …] → ((d, e, f, …, n) → x)",
    "category": "Function",
    "since": "v0.10.0",
    "description": "Takes a function `f` and a list of arguments, and returns a function `g`. When applied, `g` returns the result of applying `f` to the arguments provided initially followed by the arguments provided to `g`.",
    "see": [
      "partialRight",
      "curry"
    ],
    "example": "const multiply2 = (a, b) => a * b;\nconst double = R.partial(multiply2, [2]);\ndouble(2); //=> 4\n\nconst greet = (salutation, title, firstName, lastName) =>\n  salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';\n\nconst sayHello = R.partial(greet, ['Hello']);\nconst sayHelloToMs = R.partial(sayHello, ['Ms.']);\nsayHelloToMs('Jane', 'Jones'); //=> 'Hello, Ms. Jane Jones!'"
  },
  "partialright": {
    "name": "partialRight",
    "command": "((a, b, c, …, n) → x) → [d, e, f, …, n] → ((a, b, c, …) → x)",
    "category": "Function",
    "since": "v0.10.0",
    "description": "Takes a function `f` and a list of arguments, and returns a function `g`. When applied, `g` returns the result of applying `f` to the arguments provided to `g` followed by the arguments provided initially.",
    "see": [
      "partial"
    ],
    "example": "const greet = (salutation, title, firstName, lastName) =>\n  salutation + ', ' + title + ' ' + firstName + ' ' + lastName + '!';\n\nconst greetMsJaneJones = R.partialRight(greet, ['Ms.', 'Jane', 'Jones']);\n\ngreetMsJaneJones('Hello'); //=> 'Hello, Ms. Jane Jones!'"
  },
  "partition": {
    "name": "partition",
    "command": "Filterable f => (a → Boolean) → f a → [f a, f a]",
    "category": "List",
    "since": "v0.1.4",
    "description": "Takes a predicate and a list or other `Filterable` object and returns the pair of filterable objects of the same type of elements which do and do not satisfy, the predicate, respectively. Filterable objects include plain objects or any object that has a filter method such as `Array`.",
    "see": [
      "filter",
      "reject"
    ],
    "example": "R.partition(R.includes('s'), ['sss', 'ttt', 'foo', 'bars']);\n// => [ [ 'sss', 'bars' ],  [ 'ttt', 'foo' ] ]\n\nR.partition(R.includes('s'), { a: 'sss', b: 'ttt', foo: 'bars' });\n// => [ { a: 'sss', foo: 'bars' }, { b: 'ttt' }  ]"
  },
  "path": {
    "name": "path",
    "command": "[Idx] → {a} → a | Undefined",
    "category": "Object",
    "since": "v0.2.0",
    "description": "Retrieve the value at a given path.",
    "see": [
      "prop"
    ],
    "example": "R.path(['a', 'b'], {a: {b: 2}}); //=> 2\nR.path(['a', 'b'], {c: {b: 2}}); //=> undefined"
  },
  "patheq": {
    "name": "pathEq",
    "command": "[Idx] → a → {a} → Boolean",
    "category": "Relation",
    "since": "v0.7.0",
    "description": "Determines whether a nested path on an object has a specific value, in `R.equals` terms. Most likely used to filter a list.",
    "see": [],
    "example": "const user1 = { address: { zipCode: 90210 } };\nconst user2 = { address: { zipCode: 55555 } };\nconst user3 = { name: 'Bob' };\nconst users = [ user1, user2, user3 ];\nconst isFamous = R.pathEq(['address', 'zipCode'], 90210);\nR.filter(isFamous, users); //=> [ user1 ]"
  },
  "pathor": {
    "name": "pathOr",
    "command": "a → [Idx] → {a} → a",
    "category": "Object",
    "since": "v0.18.0",
    "description": "If the given, non-null object has a value at the given path, returns the value at that path. Otherwise returns the provided default value.",
    "see": [],
    "example": "R.pathOr('N/A', ['a', 'b'], {a: {b: 2}}); //=> 2\nR.pathOr('N/A', ['a', 'b'], {c: {b: 2}}); //=> \"N/A\""
  },
  "pathsatisfies": {
    "name": "pathSatisfies",
    "command": "(a → Boolean) → [Idx] → {a} → Boolean",
    "category": "Logic",
    "since": "v0.19.0",
    "description": "Returns `true` if the specified object property at given path satisfies the given predicate; `false` otherwise.",
    "see": [
      "propSatisfies",
      "path"
    ],
    "example": "R.pathSatisfies(y => y > 0, ['x', 'y'], {x: {y: 2}}); //=> true"
  },
  "pick": {
    "name": "pick",
    "command": "[k] → {k: v} → {k: v}",
    "category": "Object",
    "since": "v0.1.0",
    "description": "Returns a partial copy of an object containing only the keys specified. If the key does not exist, the property is ignored.",
    "see": [
      "omit",
      "props"
    ],
    "example": "R.pick(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}\nR.pick(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1}"
  },
  "pickall": {
    "name": "pickAll",
    "command": "[k] → {k: v} → {k: v}",
    "category": "Object",
    "since": "v0.1.0",
    "description": "Similar to `pick` except that this one includes a `key: undefined` pair for properties that don't exist.",
    "see": [
      "pick"
    ],
    "example": "R.pickAll(['a', 'd'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, d: 4}\nR.pickAll(['a', 'e', 'f'], {a: 1, b: 2, c: 3, d: 4}); //=> {a: 1, e: undefined, f: undefined}"
  },
  "pickby": {
    "name": "pickBy",
    "command": "((v, k) → Boolean) → {k: v} → {k: v}",
    "category": "Object",
    "since": "v0.8.0",
    "description": "Returns a partial copy of an object containing only the keys that satisfy the supplied predicate.",
    "see": [
      "pick",
      "filter"
    ],
    "example": "const isUpperCase = (val, key) => key.toUpperCase() === key;\nR.pickBy(isUpperCase, {a: 1, b: 2, A: 3, B: 4}); //=> {A: 3, B: 4}"
  },
  "pipe": {
    "name": "pipe",
    "command": "(((a, b, …, n) → o), (o → p), …, (x → y), (y → z)) → ((a, b, …, n) → z)",
    "category": "Function",
    "since": "v0.1.0",
    "description": "Performs left-to-right function composition. The leftmost function may have any arity; the remaining functions must be unary. In some libraries this function is named `sequence`. Note: The result of pipe is not automatically curried.",
    "see": [
      "compose"
    ],
    "example": "const f = R.pipe(Math.pow, R.negate, R.inc);\n\nf(3, 4); // -(3^4) + 1"
  },
  "pipek": {
    "name": "pipeK",
    "command": "pipeK",
    "category": "Function",
    "since": "v0.16.0",
    "description": "Returns the left-to-right Kleisli composition of the provided functions, each of which must return a value of a type supported by `chain`. `R.pipeK(f, g, h)` is equivalent to `R.pipe(f, R.chain(g), R.chain(h))`.",
    "see": [
      "composeK"
    ],
    "example": "//  parseJson :: String -> Maybe *\n//  get :: String -> Object -> Maybe *\n\n//  getStateCode :: Maybe String -> Maybe String\nconst getStateCode = R.pipeK(\n  parseJson,\n  get('user'),\n  get('address'),\n  get('state'),\n  R.compose(Maybe.of, R.toUpper)\n);\n\ngetStateCode('{\"user\":{\"address\":{\"state\":\"ny\"}}}');\n//=> Just('NY')\ngetStateCode('[Invalid JSON]');\n//=> Nothing()"
  },
  "pipep": {
    "name": "pipeP",
    "command": "pipeP",
    "category": "Function",
    "since": "v0.10.0",
    "description": "Performs left-to-right composition of one or more Promise-returning functions. The leftmost function may have any arity; the remaining functions must be unary.",
    "see": [
      "composeP"
    ],
    "example": "//  followersForUser :: String -> Promise [User]\nconst followersForUser = R.pipeP(db.getUserById, db.getFollowers);"
  },
  "pipewith": {
    "name": "pipeWith",
    "command": "((* → *), [((a, b, …, n) → o), (o → p), …, (x → y), (y → z)]) → ((a, b, …, n) → z)",
    "category": "Function",
    "since": "Unknown",
    "description": "Performs left-to-right function composition using transforming function. The leftmost function may have any arity; the remaining functions must be unary. Note: The result of pipeWith is not automatically curried.",
    "see": [
      "composeWith",
      "pipe"
    ],
    "example": "const pipeWhileNotNil = R.pipeWith((f, res) => R.isNil(res) ? res : f(res));\nconst f = pipeWhileNotNil([Math.pow, R.negate, R.inc])\n\nf(3, 4); // -(3^4) + 1"
  },
  "pluck": {
    "name": "pluck",
    "command": "Functor f => k → f {k: v} → f v",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns a new list by plucking the same named property off all objects in the list supplied. `pluck` will work on any functor in addition to arrays, as it is equivalent to `R.map(R.prop(k), f)`.",
    "see": [
      "props"
    ],
    "example": "var getAges = R.pluck('age');\ngetAges([{name: 'fred', age: 29}, {name: 'wilma', age: 27}]); //=> [29, 27]\n\nR.pluck(0, [[1, 2], [3, 4]]);               //=> [1, 3]\nR.pluck('val', {a: {val: 3}, b: {val: 5}}); //=> {a: 3, b: 5}"
  },
  "prepend": {
    "name": "prepend",
    "command": "a → [a] → [a]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns a new list with the given element at the front, followed by the contents of the list.",
    "see": [
      "append"
    ],
    "example": "R.prepend('fee', ['fi', 'fo', 'fum']); //=> ['fee', 'fi', 'fo', 'fum']"
  },
  "product": {
    "name": "product",
    "command": "[Number] → Number",
    "category": "Math",
    "since": "v0.1.0",
    "description": "Multiplies together all the elements of a list.",
    "see": [
      "reduce"
    ],
    "example": "R.product([2,4,6,8,100,1]); //=> 38400"
  },
  "project": {
    "name": "project",
    "command": "[k] → [{k: v}] → [{k: v}]",
    "category": "Object",
    "since": "v0.1.0",
    "description": "Reasonable analog to SQL `select` statement.",
    "see": [],
    "example": "const abby = {name: 'Abby', age: 7, hair: 'blond', grade: 2};\nconst fred = {name: 'Fred', age: 12, hair: 'brown', grade: 7};\nconst kids = [abby, fred];\nR.project(['name', 'grade'], kids); //=> [{name: 'Abby', grade: 2}, {name: 'Fred', grade: 7}]"
  },
  "prop": {
    "name": "prop",
    "command": "s → {s: a} → a | Undefined",
    "category": "Object",
    "since": "v0.1.0",
    "description": "Returns a function that when supplied an object returns the indicated property of that object, if it exists.",
    "see": [
      "path"
    ],
    "example": "R.prop('x', {x: 100}); //=> 100\nR.prop('x', {}); //=> undefined\nR.compose(R.inc, R.prop('x'))({ x: 3 }) //=> 4"
  },
  "propeq": {
    "name": "propEq",
    "command": "String → a → Object → Boolean",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Returns `true` if the specified object property is equal, in `R.equals` terms, to the given value; `false` otherwise. You can test multiple properties with `R.whereEq`.",
    "see": [
      "whereEq",
      "propSatisfies",
      "equals"
    ],
    "example": "const abby = {name: 'Abby', age: 7, hair: 'blond'};\nconst fred = {name: 'Fred', age: 12, hair: 'brown'};\nconst rusty = {name: 'Rusty', age: 10, hair: 'brown'};\nconst alois = {name: 'Alois', age: 15, disposition: 'surly'};\nconst kids = [abby, fred, rusty, alois];\nconst hasBrownHair = R.propEq('hair', 'brown');\nR.filter(hasBrownHair, kids); //=> [fred, rusty]"
  },
  "propis": {
    "name": "propIs",
    "command": "Type → String → Object → Boolean",
    "category": "Type",
    "since": "v0.16.0",
    "description": "Returns `true` if the specified object property is of the given type; `false` otherwise.",
    "see": [
      "is",
      "propSatisfies"
    ],
    "example": "R.propIs(Number, 'x', {x: 1, y: 2});  //=> true\nR.propIs(Number, 'x', {x: 'foo'});    //=> false\nR.propIs(Number, 'x', {});            //=> false"
  },
  "propor": {
    "name": "propOr",
    "command": "a → String → Object → a",
    "category": "Object",
    "since": "v0.6.0",
    "description": "If the given, non-null object has an own property with the specified name, returns the value of that property. Otherwise returns the provided default value.",
    "see": [],
    "example": "const alice = {\n  name: 'ALICE',\n  age: 101\n};\nconst favorite = R.prop('favoriteLibrary');\nconst favoriteWithDefault = R.propOr('Ramda', 'favoriteLibrary');\n\nfavorite(alice);  //=> undefined\nfavoriteWithDefault(alice);  //=> 'Ramda'"
  },
  "props": {
    "name": "props",
    "command": "[k] → {k: v} → [v]",
    "category": "Object",
    "since": "v0.1.0",
    "description": "Acts as multiple `prop`: array of keys in, array of values out. Preserves order.",
    "see": [],
    "example": "R.props(['x', 'y'], {x: 1, y: 2}); //=> [1, 2]\nR.props(['c', 'a', 'b'], {b: 2, a: 1}); //=> [undefined, 1, 2]\n\nconst fullName = R.compose(R.join(' '), R.props(['first', 'last']));\nfullName({last: 'Bullet-Tooth', age: 33, first: 'Tony'}); //=> 'Tony Bullet-Tooth'"
  },
  "propsatisfies": {
    "name": "propSatisfies",
    "command": "(a → Boolean) → String → {String: a} → Boolean",
    "category": "Logic",
    "since": "v0.16.0",
    "description": "Returns `true` if the specified object property satisfies the given predicate; `false` otherwise. You can test multiple properties with `R.where`.",
    "see": [
      "where",
      "propEq",
      "propIs"
    ],
    "example": "R.propSatisfies(x => x > 0, 'x', {x: 1, y: 2}); //=> true"
  },
  "range": {
    "name": "range",
    "command": "Number → Number → [Number]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns a list of numbers from `from` (inclusive) to `to` (exclusive).",
    "see": [],
    "example": "R.range(1, 5);    //=> [1, 2, 3, 4]\nR.range(50, 53);  //=> [50, 51, 52]"
  },
  "reduce": {
    "name": "reduce",
    "command": "((a, b) → a) → a → [b] → a",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns a single item by iterating through the list, successively calling the iterator function and passing it an accumulator value and the current value from the array, and then passing the result to the next call. The iterator function receives two values: (acc, value). It may use `R.reduced` to shortcut the iteration. The arguments' order of `reduceRight`'s iterator function is (value, acc). Note: `R.reduce` does not skip deleted or unassigned indices (sparse arrays), unlike the native `Array.prototype.reduce` method. For more details on this behavior, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Description Dispatches to the `reduce` method of the third argument, if present. When doing so, it is up to the user to handle the `R.reduced` shortcuting, as this is not implemented by `reduce`.",
    "see": [
      "reduced",
      "addIndex",
      "reduceRight"
    ],
    "example": "R.reduce(R.subtract, 0, [1, 2, 3, 4]) // => ((((0 - 1) - 2) - 3) - 4) = -10\n//          -               -10\n//         / \\              / \\\n//        -   4           -6   4\n//       / \\              / \\\n//      -   3   ==>     -3   3\n//     / \\              / \\\n//    -   2           -1   2\n//   / \\              / \\\n//  0   1            0   1"
  },
  "reduceby": {
    "name": "reduceBy",
    "command": "((a, b) → a) → a → (b → String) → [b] → {String: a}",
    "category": "List",
    "since": "v0.20.0",
    "description": "Groups the elements of the list according to the result of calling the String-returning function `keyFn` on each element and reduces the elements of each group to a single value via the reducer function `valueFn`. This function is basically a more general `groupBy` function. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "groupBy",
      "reduce"
    ],
    "example": "const groupNames = (acc, {name}) => acc.concat(name)\nconst toGrade = ({score}) =>\n  score < 65 ? 'F' :\n  score < 70 ? 'D' :\n  score < 80 ? 'C' :\n  score < 90 ? 'B' : 'A'\n\nvar students = [\n  {name: 'Abby', score: 83},\n  {name: 'Bart', score: 62},\n  {name: 'Curt', score: 88},\n  {name: 'Dora', score: 92},\n]\n\nreduceBy(groupNames, [], toGrade, students)\n//=> {\"A\": [\"Dora\"], \"B\": [\"Abby\", \"Curt\"], \"F\": [\"Bart\"]}"
  },
  "reduced": {
    "name": "reduced",
    "command": "a → *",
    "category": "List",
    "since": "v0.15.0",
    "description": "Returns a value wrapped to indicate that it is the final value of the reduce and transduce functions. The returned value should be considered a black box: the internal structure is not guaranteed to be stable. Note: this optimization is only available to the below functions: `reduce` `reduceWhile` `transduce`",
    "see": [
      "reduce",
      "reduceWhile",
      "transduce"
    ],
    "example": "R.reduce(\n (acc, item) => item > 3 ? R.reduced(acc) : acc.concat(item),\n [],\n [1, 2, 3, 4, 5]) // [1, 2, 3]"
  },
  "reduceright": {
    "name": "reduceRight",
    "command": "((a, b) → b) → b → [a] → b",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns a single item by iterating through the list, successively calling the iterator function and passing it an accumulator value and the current value from the array, and then passing the result to the next call. Similar to `reduce`, except moves through the input list from the right to the left. The iterator function receives two values: (value, acc), while the arguments' order of `reduce`'s iterator function is (acc, value). Note: `R.reduceRight` does not skip deleted or unassigned indices (sparse arrays), unlike the native `Array.prototype.reduceRight` method. For more details on this behavior, see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduceRight#Description",
    "see": [
      "reduce",
      "addIndex"
    ],
    "example": "R.reduceRight(R.subtract, 0, [1, 2, 3, 4]) // => (1 - (2 - (3 - (4 - 0)))) = -2\n//    -               -2\n//   / \\              / \\\n//  1   -            1   3\n//     / \\              / \\\n//    2   -     ==>    2  -1\n//       / \\              / \\\n//      3   -            3   4\n//         / \\              / \\\n//        4   0            4   0"
  },
  "reducewhile": {
    "name": "reduceWhile",
    "command": "((a, b) → Boolean) → ((a, b) → a) → a → [b] → a",
    "category": "List",
    "since": "v0.22.0",
    "description": "Like `reduce`, `reduceWhile` returns a single item by iterating through the list, successively calling the iterator function. `reduceWhile` also takes a predicate that is evaluated before each step. If the predicate returns `false`, it \"short-circuits\" the iteration and returns the current value of the accumulator.",
    "see": [
      "reduce",
      "reduced"
    ],
    "example": "const isOdd = (acc, x) => x % 2 === 1;\nconst xs = [1, 3, 5, 60, 777, 800];\nR.reduceWhile(isOdd, R.add, 0, xs); //=> 9\n\nconst ys = [2, 4, 6]\nR.reduceWhile(isOdd, R.add, 111, ys); //=> 111"
  },
  "reject": {
    "name": "reject",
    "command": "Filterable f => (a → Boolean) → f a → f a",
    "category": "List",
    "since": "v0.1.0",
    "description": "The complement of `filter`. Acts as a transducer if a transformer is given in list position. Filterable objects include plain objects or any object that has a filter method such as `Array`.",
    "see": [
      "filter",
      "transduce",
      "addIndex"
    ],
    "example": "const isOdd = (n) => n % 2 === 1;\n\nR.reject(isOdd, [1, 2, 3, 4]); //=> [2, 4]\n\nR.reject(isOdd, {a: 1, b: 2, c: 3, d: 4}); //=> {b: 2, d: 4}"
  },
  "remove": {
    "name": "remove",
    "command": "Number → Number → [a] → [a]",
    "category": "List",
    "since": "v0.2.2",
    "description": "Removes the sub-list of `list` starting at index `start` and containing `count` elements. Note that this is not destructive: it returns a copy of the list with the changes. No lists have been harmed in the application of this function.",
    "see": [
      "without"
    ],
    "example": "R.remove(2, 3, [1,2,3,4,5,6,7,8]); //=> [1,2,6,7,8]"
  },
  "repeat": {
    "name": "repeat",
    "command": "a → n → [a]",
    "category": "List",
    "since": "v0.1.1",
    "description": "Returns a fixed list of size `n` containing a specified identical value.",
    "see": [
      "times"
    ],
    "example": "R.repeat('hi', 5); //=> ['hi', 'hi', 'hi', 'hi', 'hi']\n\nconst obj = {};\nconst repeatedObjs = R.repeat(obj, 5); //=> [{}, {}, {}, {}, {}]\nrepeatedObjs[0] === repeatedObjs[1]; //=> true"
  },
  "replace": {
    "name": "replace",
    "command": "RegExp|String → String → String → String",
    "category": "String",
    "since": "v0.7.0",
    "description": "Replace a substring or regex match in a string with a replacement. The first two parameters correspond to the parameters of the `String.prototype.replace()` function, so the second parameter can also be a function.",
    "see": [],
    "example": "R.replace('foo', 'bar', 'foo foo foo'); //=> 'bar foo foo'\nR.replace(/foo/, 'bar', 'foo foo foo'); //=> 'bar foo foo'\n\n// Use the \"g\" (global) flag to replace all occurrences:\nR.replace(/foo/g, 'bar', 'foo foo foo'); //=> 'bar bar bar'"
  },
  "reverse": {
    "name": "reverse",
    "command": "[a] → [a]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns a new list or string with the elements or characters in reverse order.",
    "see": [],
    "example": "R.reverse([1, 2, 3]);  //=> [3, 2, 1]\nR.reverse([1, 2]);     //=> [2, 1]\nR.reverse([1]);        //=> [1]\nR.reverse([]);         //=> []\n\nR.reverse('abc');      //=> 'cba'\nR.reverse('ab');       //=> 'ba'\nR.reverse('a');        //=> 'a'\nR.reverse('');         //=> ''"
  },
  "scan": {
    "name": "scan",
    "command": "((a, b) → a) → a → [b] → [a]",
    "category": "List",
    "since": "v0.10.0",
    "description": "Scan is similar to `reduce`, but returns a list of successively reduced values from the left",
    "see": [
      "reduce",
      "mapAccum"
    ],
    "example": "const numbers = [1, 2, 3, 4];\nconst factorials = R.scan(R.multiply, 1, numbers); //=> [1, 1, 2, 6, 24]"
  },
  "sequence": {
    "name": "sequence",
    "command": "(Applicative f, Traversable t) => (a → f a) → t (f a) → f (t a)",
    "category": "List",
    "since": "v0.19.0",
    "description": "Transforms a Traversable of Applicative into an Applicative of Traversable. Dispatches to the `sequence` method of the second argument, if present.",
    "see": [
      "traverse"
    ],
    "example": "R.sequence(Maybe.of, [Just(1), Just(2), Just(3)]);   //=> Just([1, 2, 3])\nR.sequence(Maybe.of, [Just(1), Just(2), Nothing()]); //=> Nothing()\n\nR.sequence(R.of, Just([1, 2, 3])); //=> [Just(1), Just(2), Just(3)]\nR.sequence(R.of, Nothing());       //=> [Nothing()]"
  },
  "set": {
    "name": "set",
    "command": "Lens s a → a → s → s",
    "category": "Object",
    "since": "v0.16.0",
    "description": "Returns the result of \"setting\" the portion of the given data structure focused by the given lens to the given value.",
    "see": [
      "prop",
      "lensIndex",
      "lensProp"
    ],
    "example": "const xLens = R.lensProp('x');\n\nR.set(xLens, 4, {x: 1, y: 2});  //=> {x: 4, y: 2}\nR.set(xLens, 8, {x: 1, y: 2});  //=> {x: 8, y: 2}"
  },
  "slice": {
    "name": "slice",
    "command": "Number → Number → [a] → [a]",
    "category": "List",
    "since": "v0.1.4",
    "description": "Returns the elements of the given list or string (or object with a `slice` method) from `fromIndex` (inclusive) to `toIndex` (exclusive). Dispatches to the `slice` method of the third argument, if present.",
    "see": [],
    "example": "R.slice(1, 3, ['a', 'b', 'c', 'd']);        //=> ['b', 'c']\nR.slice(1, Infinity, ['a', 'b', 'c', 'd']); //=> ['b', 'c', 'd']\nR.slice(0, -1, ['a', 'b', 'c', 'd']);       //=> ['a', 'b', 'c']\nR.slice(-3, -1, ['a', 'b', 'c', 'd']);      //=> ['b', 'c']\nR.slice(0, 3, 'ramda');                     //=> 'ram'"
  },
  "sort": {
    "name": "sort",
    "command": "((a, a) → Number) → [a] → [a]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns a copy of the list, sorted according to the comparator function, which should accept two values at a time and return a negative number if the first value is smaller, a positive number if it's larger, and zero if they are equal. Please note that this is a copy of the list. It does not modify the original.",
    "see": [],
    "example": "const diff = function(a, b) { return a - b; };\nR.sort(diff, [4,2,7,5]); //=> [2, 4, 5, 7]"
  },
  "sortby": {
    "name": "sortBy",
    "command": "Ord b => (a → b) → [a] → [a]",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Sorts the list according to the supplied function.",
    "see": [],
    "example": "const sortByFirstItem = R.sortBy(R.prop(0));\nconst pairs = [[-1, 1], [-2, 2], [-3, 3]];\nsortByFirstItem(pairs); //=> [[-3, 3], [-2, 2], [-1, 1]]\n\nconst sortByNameCaseInsensitive = R.sortBy(R.compose(R.toLower, R.prop('name')));\nconst alice = {\n  name: 'ALICE',\n  age: 101\n};\nconst bob = {\n  name: 'Bob',\n  age: -10\n};\nconst clara = {\n  name: 'clara',\n  age: 314.159\n};\nconst people = [clara, bob, alice];\nsortByNameCaseInsensitive(people); //=> [alice, bob, clara]"
  },
  "sortwith": {
    "name": "sortWith",
    "command": "[(a, a) → Number] → [a] → [a]",
    "category": "Relation",
    "since": "v0.23.0",
    "description": "Sorts a list according to a list of comparators.",
    "see": [],
    "example": "const alice = {\n  name: 'alice',\n  age: 40\n};\nconst bob = {\n  name: 'bob',\n  age: 30\n};\nconst clara = {\n  name: 'clara',\n  age: 40\n};\nconst people = [clara, bob, alice];\nconst ageNameSort = R.sortWith([\n  R.descend(R.prop('age')),\n  R.ascend(R.prop('name'))\n]);\nageNameSort(people); //=> [alice, clara, bob]"
  },
  "split": {
    "name": "split",
    "command": "(String | RegExp) → String → [String]",
    "category": "String",
    "since": "v0.1.0",
    "description": "Splits a string into an array of strings based on the given separator.",
    "see": [
      "join"
    ],
    "example": "const pathComponents = R.split('/');\nR.tail(pathComponents('/usr/local/bin/node')); //=> ['usr', 'local', 'bin', 'node']\n\nR.split('.', 'a.b.c.xyz.d'); //=> ['a', 'b', 'c', 'xyz', 'd']"
  },
  "splitat": {
    "name": "splitAt",
    "command": "Number → [a] → [[a], [a]]",
    "category": "List",
    "since": "v0.19.0",
    "description": "Splits a given list or string at a given index.",
    "see": [],
    "example": "R.splitAt(1, [1, 2, 3]);          //=> [[1], [2, 3]]\nR.splitAt(5, 'hello world');      //=> ['hello', ' world']\nR.splitAt(-1, 'foobar');          //=> ['fooba', 'r']"
  },
  "splitevery": {
    "name": "splitEvery",
    "command": "Number → [a] → [[a]]",
    "category": "List",
    "since": "v0.16.0",
    "description": "Splits a collection into slices of the specified length.",
    "see": [],
    "example": "R.splitEvery(3, [1, 2, 3, 4, 5, 6, 7]); //=> [[1, 2, 3], [4, 5, 6], [7]]\nR.splitEvery(3, 'foobarbaz'); //=> ['foo', 'bar', 'baz']"
  },
  "splitwhen": {
    "name": "splitWhen",
    "command": "(a → Boolean) → [a] → [[a], [a]]",
    "category": "List",
    "since": "v0.19.0",
    "description": "Takes a list and a predicate and returns a pair of lists with the following properties: the result of concatenating the two output lists is equivalent to the input list; none of the elements of the first output list satisfies the predicate; and if the second output list is non-empty, its first element satisfies the predicate.",
    "see": [],
    "example": "R.splitWhen(R.equals(2), [1, 2, 3, 1, 2, 3]);   //=> [[1], [2, 3, 1, 2, 3]]"
  },
  "startswith": {
    "name": "startsWith",
    "command": "[a] → [a] → Boolean",
    "category": "List",
    "since": "v0.24.0",
    "description": "Checks if a list starts with the provided sublist. Similarly, checks if a string starts with the provided substring.",
    "see": [
      "endsWith"
    ],
    "example": "R.startsWith('a', 'abc')                //=> true\nR.startsWith('b', 'abc')                //=> false\nR.startsWith(['a'], ['a', 'b', 'c'])    //=> true\nR.startsWith(['b'], ['a', 'b', 'c'])    //=> false"
  },
  "subtract": {
    "name": "subtract",
    "command": "Number → Number → Number",
    "category": "Math",
    "since": "v0.1.0",
    "description": "Subtracts its second argument from its first argument.",
    "see": [
      "add"
    ],
    "example": "R.subtract(10, 8); //=> 2\n\nconst minus5 = R.subtract(R.__, 5);\nminus5(17); //=> 12\n\nconst complementaryAngle = R.subtract(90);\ncomplementaryAngle(30); //=> 60\ncomplementaryAngle(72); //=> 18"
  },
  "sum": {
    "name": "sum",
    "command": "[Number] → Number",
    "category": "Math",
    "since": "v0.1.0",
    "description": "Adds together all the elements of a list.",
    "see": [
      "reduce"
    ],
    "example": "R.sum([2,4,6,8,100,1]); //=> 121"
  },
  "symmetricdifference": {
    "name": "symmetricDifference",
    "command": "[*] → [*] → [*]",
    "category": "Relation",
    "since": "v0.19.0",
    "description": "Finds the set (i.e. no duplicates) of all elements contained in the first or second list, but not both.",
    "see": [
      "symmetricDifferenceWith",
      "difference",
      "differenceWith"
    ],
    "example": "R.symmetricDifference([1,2,3,4], [7,6,5,4,3]); //=> [1,2,7,6,5]\nR.symmetricDifference([7,6,5,4,3], [1,2,3,4]); //=> [7,6,5,1,2]"
  },
  "symmetricdifferencewith": {
    "name": "symmetricDifferenceWith",
    "command": "((a, a) → Boolean) → [a] → [a] → [a]",
    "category": "Relation",
    "since": "v0.19.0",
    "description": "Finds the set (i.e. no duplicates) of all elements contained in the first or second list, but not both. Duplication is determined according to the value returned by applying the supplied predicate to two list elements.",
    "see": [
      "symmetricDifference",
      "difference",
      "differenceWith"
    ],
    "example": "const eqA = R.eqBy(R.prop('a'));\nconst l1 = [{a: 1}, {a: 2}, {a: 3}, {a: 4}];\nconst l2 = [{a: 3}, {a: 4}, {a: 5}, {a: 6}];\nR.symmetricDifferenceWith(eqA, l1, l2); //=> [{a: 1}, {a: 2}, {a: 5}, {a: 6}]"
  },
  "t": {
    "name": "T",
    "command": "* → Boolean",
    "category": "Function",
    "since": "v0.9.0",
    "description": "A function that always returns `true`. Any passed in parameters are ignored.",
    "see": [
      "F"
    ],
    "example": "R.T(); //=> true"
  },
  "tail": {
    "name": "tail",
    "command": "[a] → [a]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns all but the first element of the given list or string (or object with a `tail` method). Dispatches to the `slice` method of the first argument, if present.",
    "see": [
      "head",
      "init",
      "last"
    ],
    "example": "R.tail([1, 2, 3]);  //=> [2, 3]\nR.tail([1, 2]);     //=> [2]\nR.tail([1]);        //=> []\nR.tail([]);         //=> []\n\nR.tail('abc');  //=> 'bc'\nR.tail('ab');   //=> 'b'\nR.tail('a');    //=> ''\nR.tail('');     //=> ''"
  },
  "take": {
    "name": "take",
    "command": "Number → [a] → [a]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns the first `n` elements of the given list, string, or transducer/transformer (or object with a `take` method). Dispatches to the `take` method of the second argument, if present.",
    "see": [
      "drop"
    ],
    "example": "R.take(1, ['foo', 'bar', 'baz']); //=> ['foo']\nR.take(2, ['foo', 'bar', 'baz']); //=> ['foo', 'bar']\nR.take(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']\nR.take(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']\nR.take(3, 'ramda');               //=> 'ram'\n\nconst personnel = [\n  'Dave Brubeck',\n  'Paul Desmond',\n  'Eugene Wright',\n  'Joe Morello',\n  'Gerry Mulligan',\n  'Bob Bates',\n  'Joe Dodge',\n  'Ron Crotty'\n];\n\nconst takeFive = R.take(5);\ntakeFive(personnel);\n//=> ['Dave Brubeck', 'Paul Desmond', 'Eugene Wright', 'Joe Morello', 'Gerry Mulligan']"
  },
  "takelast": {
    "name": "takeLast",
    "command": "Number → [a] → [a]",
    "category": "List",
    "since": "v0.16.0",
    "description": "Returns a new list containing the last `n` elements of the given list. If `n > list.length`, returns a list of `list.length` elements.",
    "see": [
      "dropLast"
    ],
    "example": "R.takeLast(1, ['foo', 'bar', 'baz']); //=> ['baz']\nR.takeLast(2, ['foo', 'bar', 'baz']); //=> ['bar', 'baz']\nR.takeLast(3, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']\nR.takeLast(4, ['foo', 'bar', 'baz']); //=> ['foo', 'bar', 'baz']\nR.takeLast(3, 'ramda');               //=> 'mda'"
  },
  "takelastwhile": {
    "name": "takeLastWhile",
    "command": "(a → Boolean) → [a] → [a]",
    "category": "List",
    "since": "v0.16.0",
    "description": "Returns a new list containing the last `n` elements of a given list, passing each value to the supplied predicate function, and terminating when the predicate function returns `false`. Excludes the element that caused the predicate function to fail. The predicate function is passed one argument: (value).",
    "see": [
      "dropLastWhile",
      "addIndex"
    ],
    "example": "const isNotOne = x => x !== 1;\n\nR.takeLastWhile(isNotOne, [1, 2, 3, 4]); //=> [2, 3, 4]\n\nR.takeLastWhile(x => x !== 'R' , 'Ramda'); //=> 'amda'"
  },
  "takewhile": {
    "name": "takeWhile",
    "command": "(a → Boolean) → [a] → [a]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns a new list containing the first `n` elements of a given list, passing each value to the supplied predicate function, and terminating when the predicate function returns `false`. Excludes the element that caused the predicate function to fail. The predicate function is passed one argument: (value). Dispatches to the `takeWhile` method of the second argument, if present. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "dropWhile",
      "transduce",
      "addIndex"
    ],
    "example": "const isNotFour = x => x !== 4;\n\nR.takeWhile(isNotFour, [1, 2, 3, 4, 3, 2, 1]); //=> [1, 2, 3]\n\nR.takeWhile(x => x !== 'd' , 'Ramda'); //=> 'Ram'"
  },
  "tap": {
    "name": "tap",
    "command": "(a → *) → a → a",
    "category": "Function",
    "since": "v0.1.0",
    "description": "Runs the given function with the supplied object, then returns the object. Acts as a transducer if a transformer is given as second parameter.",
    "see": [],
    "example": "const sayX = x => console.log('x is ' + x);\nR.tap(sayX, 100); //=> 100\n// logs 'x is 100'"
  },
  "test": {
    "name": "test",
    "command": "RegExp → String → Boolean",
    "category": "String",
    "since": "v0.12.0",
    "description": "Determines whether a given string matches a given regular expression.",
    "see": [
      "match"
    ],
    "example": "R.test(/^x/, 'xyz'); //=> true\nR.test(/^y/, 'xyz'); //=> false"
  },
  "then": {
    "name": "then",
    "command": "(a → b) → (Promise e a) → (Promise e b)",
    "category": "Function",
    "since": "Unknown",
    "description": "Returns the result of applying the onSuccess function to the value inside a successfully resolved promise. This is useful for working with promises inside function compositions.",
    "see": [
      "otherwise"
    ],
    "example": "var makeQuery = (email) => ({ query: { email }});\n\n//getMemberName :: String -> Promise ({firstName, lastName})\nvar getMemberName = R.pipe(\n  makeQuery,\n  fetchMember,\n  R.then(R.pick(['firstName', 'lastName']))\n);"
  },
  "thunkify": {
    "name": "thunkify",
    "command": "((a, b, …, j) → k) → (a, b, …, j) → (() → k)",
    "category": "Function",
    "since": "Unknown",
    "description": "Creates a thunk out of a function. A thunk delays a calculation until its result is needed, providing lazy evaluation of arguments.",
    "see": [
      "partial",
      "partialRight"
    ],
    "example": "R.thunkify(R.identity)(42)(); //=> 42\nR.thunkify((a, b) => a + b)(25, 17)(); //=> 42"
  },
  "times": {
    "name": "times",
    "command": "(Number → a) → Number → [a]",
    "category": "List",
    "since": "v0.2.3",
    "description": "Calls an input function `n` times, returning an array containing the results of those function calls. `fn` is passed one argument: The current value of `n`, which begins at `0` and is gradually incremented to `n - 1`.",
    "see": [
      "repeat"
    ],
    "example": "R.times(R.identity, 5); //=> [0, 1, 2, 3, 4]"
  },
  "tolower": {
    "name": "toLower",
    "command": "String → String",
    "category": "String",
    "since": "v0.9.0",
    "description": "The lower case version of a string.",
    "see": [
      "toUpper"
    ],
    "example": "R.toLower('XYZ'); //=> 'xyz'"
  },
  "topairs": {
    "name": "toPairs",
    "command": "{String: *} → [[String,*]]",
    "category": "Object",
    "since": "v0.4.0",
    "description": "Converts an object into an array of key, value arrays. Only the object's own properties are used. Note that the order of the output array is not guaranteed to be consistent across different JS platforms.",
    "see": [
      "fromPairs"
    ],
    "example": "R.toPairs({a: 1, b: 2, c: 3}); //=> [['a', 1], ['b', 2], ['c', 3]]"
  },
  "topairsin": {
    "name": "toPairsIn",
    "command": "{String: *} → [[String,*]]",
    "category": "Object",
    "since": "v0.4.0",
    "description": "Converts an object into an array of key, value arrays. The object's own properties and prototype properties are used. Note that the order of the output array is not guaranteed to be consistent across different JS platforms.",
    "see": [],
    "example": "const F = function() { this.x = 'X'; };\nF.prototype.y = 'Y';\nconst f = new F();\nR.toPairsIn(f); //=> [['x','X'], ['y','Y']]"
  },
  "tostring": {
    "name": "toString",
    "command": "* → String",
    "category": "String",
    "since": "v0.14.0",
    "description": "Returns the string representation of the given value. `eval`'ing the output should result in a value equivalent to the input value. Many of the built-in `toString` methods do not satisfy this requirement. If the given value is an `[object Object]` with a `toString` method other than `Object.prototype.toString`, this method is invoked with no arguments to produce the return value. This means user-defined constructor functions can provide a suitable `toString` method. For example: `function Point(x, y) {   this.x = x;   this.y = y; } Point.prototype.toString = function() {   return 'new Point(' + this.x + ', ' + this.y + ')'; }; R.toString(new Point(1, 2)); //=> 'new Point(1, 2)' `",
    "see": [],
    "example": "R.toString(42); //=> '42'\nR.toString('abc'); //=> '\"abc\"'\nR.toString([1, 2, 3]); //=> '[1, 2, 3]'\nR.toString({foo: 1, bar: 2, baz: 3}); //=> '{\"bar\": 2, \"baz\": 3, \"foo\": 1}'\nR.toString(new Date('2001-02-03T04:05:06Z')); //=> 'new Date(\"2001-02-03T04:05:06.000Z\")'"
  },
  "toupper": {
    "name": "toUpper",
    "command": "String → String",
    "category": "String",
    "since": "v0.9.0",
    "description": "The upper case version of a string.",
    "see": [
      "toLower"
    ],
    "example": "R.toUpper('abc'); //=> 'ABC'"
  },
  "transduce": {
    "name": "transduce",
    "command": "(c → c) → ((a, b) → a) → a → [b] → a",
    "category": "List",
    "since": "v0.12.0",
    "description": "Initializes a transducer using supplied iterator function. Returns a single item by iterating through the list, successively calling the transformed iterator function and passing it an accumulator value and the current value from the array, and then passing the result to the next call. The iterator function receives two values: (acc, value). It will be wrapped as a transformer to initialize the transducer. A transformer can be passed directly in place of an iterator function. In both cases, iteration may be stopped early with the `R.reduced` function. A transducer is a function that accepts a transformer and returns a transformer and can be composed directly. A transformer is an an object that provides a 2-arity reducing iterator function, step, 0-arity initial value function, init, and 1-arity result extraction function, result. The step function is used as the iterator function in reduce. The result function is used to convert the final accumulator into the return type and in most cases is `R.identity`. The init function can be used to provide an initial accumulator, but is ignored by transduce. The iteration is performed with `R.reduce` after initializing the transducer.",
    "see": [
      "reduce",
      "reduced",
      "into"
    ],
    "example": "const numbers = [1, 2, 3, 4];\nconst transducer = R.compose(R.map(R.add(1)), R.take(2));\nR.transduce(transducer, R.flip(R.append), [], numbers); //=> [2, 3]\n\nconst isOdd = (x) => x % 2 === 1;\nconst firstOddTransducer = R.compose(R.filter(isOdd), R.take(1));\nR.transduce(firstOddTransducer, R.flip(R.append), [], R.range(0, 100)); //=> [1]"
  },
  "transpose": {
    "name": "transpose",
    "command": "[[a]] → [[a]]",
    "category": "List",
    "since": "v0.19.0",
    "description": "Transposes the rows and columns of a 2D list. When passed a list of `n` lists of length `x`, returns a list of `x` lists of length `n`.",
    "see": [],
    "example": "R.transpose([[1, 'a'], [2, 'b'], [3, 'c']]) //=> [[1, 2, 3], ['a', 'b', 'c']]\nR.transpose([[1, 2, 3], ['a', 'b', 'c']]) //=> [[1, 'a'], [2, 'b'], [3, 'c']]\n\n// If some of the rows are shorter than the following rows, their elements are skipped:\nR.transpose([[10, 11], [20], [], [30, 31, 32]]) //=> [[10, 20, 30], [11, 31], [32]]"
  },
  "traverse": {
    "name": "traverse",
    "command": "(Applicative f, Traversable t) => (a → f a) → (a → f b) → t a → f (t b)",
    "category": "List",
    "since": "v0.19.0",
    "description": "Maps an Applicative-returning function over a Traversable, then uses `sequence` to transform the resulting Traversable of Applicative into an Applicative of Traversable. Dispatches to the `traverse` method of the third argument, if present.",
    "see": [
      "sequence"
    ],
    "example": "// Returns `Maybe.Nothing` if the given divisor is `0`\nconst safeDiv = n => d => d === 0 ? Maybe.Nothing() : Maybe.Just(n / d)\n\nR.traverse(Maybe.of, safeDiv(10), [2, 4, 5]); //=> Maybe.Just([5, 2.5, 2])\nR.traverse(Maybe.of, safeDiv(10), [2, 0, 5]); //=> Maybe.Nothing"
  },
  "trim": {
    "name": "trim",
    "command": "String → String",
    "category": "String",
    "since": "v0.6.0",
    "description": "Removes (strips) whitespace from both ends of the string.",
    "see": [],
    "example": "R.trim('   xyz  '); //=> 'xyz'\nR.map(R.trim, R.split(',', 'x, y, z')); //=> ['x', 'y', 'z']"
  },
  "trycatch": {
    "name": "tryCatch",
    "command": "(…x → a) → ((e, …x) → a) → (…x → a)",
    "category": "Function",
    "since": "v0.20.0",
    "description": "`tryCatch` takes two functions, a `tryer` and a `catcher`. The returned function evaluates the `tryer`; if it does not throw, it simply returns the result. If the `tryer` does throw, the returned function evaluates the `catcher` function and returns its result. Note that for effective composition with this function, both the `tryer` and `catcher` functions must return the same type of results.",
    "see": [],
    "example": "R.tryCatch(R.prop('x'), R.F)({x: true}); //=> true\nR.tryCatch(() => { throw 'foo'}, R.always('catched'))('bar') // => 'catched'\nR.tryCatch(R.times(R.identity), R.always([]))('s') // => []\n ``"
  },
  "type": {
    "name": "type",
    "command": "(* → {*}) → String",
    "category": "Type",
    "since": "v0.8.0",
    "description": "Gives a single-word string description of the (native) type of a value, returning such answers as 'Object', 'Number', 'Array', or 'Null'. Does not attempt to distinguish user Object types any further, reporting them all as 'Object'.",
    "see": [],
    "example": "R.type({}); //=> \"Object\"\nR.type(1); //=> \"Number\"\nR.type(false); //=> \"Boolean\"\nR.type('s'); //=> \"String\"\nR.type(null); //=> \"Null\"\nR.type([]); //=> \"Array\"\nR.type(/[A-z]/); //=> \"RegExp\"\nR.type(() => {}); //=> \"Function\"\nR.type(undefined); //=> \"Undefined\""
  },
  "unapply": {
    "name": "unapply",
    "command": "([*…] → a) → (*… → a)",
    "category": "Function",
    "since": "v0.8.0",
    "description": "Takes a function `fn`, which takes a single array argument, and returns a function which: takes any number of positional arguments; passes these arguments to `fn` as an array; and returns the result. In other words, `R.unapply` derives a variadic function from a function which takes an array. `R.unapply` is the inverse of `R.apply`.",
    "see": [
      "apply"
    ],
    "example": "R.unapply(JSON.stringify)(1, 2, 3); //=> '[1,2,3]'"
  },
  "unary": {
    "name": "unary",
    "command": "(* → b) → (a → b)",
    "category": "Function",
    "since": "v0.2.0",
    "description": "Wraps a function of any arity (including nullary) in a function that accepts exactly 1 parameter. Any extraneous parameters will not be passed to the supplied function.",
    "see": [
      "binary",
      "nAry"
    ],
    "example": "const takesTwoArgs = function(a, b) {\n  return [a, b];\n};\ntakesTwoArgs.length; //=> 2\ntakesTwoArgs(1, 2); //=> [1, 2]\n\nconst takesOneArg = R.unary(takesTwoArgs);\ntakesOneArg.length; //=> 1\n// Only 1 argument is passed to the wrapped function\ntakesOneArg(1, 2); //=> [1, undefined]"
  },
  "uncurryn": {
    "name": "uncurryN",
    "command": "Number → (a → b) → (a → c)",
    "category": "Function",
    "since": "v0.14.0",
    "description": "Returns a function of arity `n` from a (manually) curried function.",
    "see": [
      "curry"
    ],
    "example": "const addFour = a => b => c => d => a + b + c + d;\n\nconst uncurriedAddFour = R.uncurryN(4, addFour);\nuncurriedAddFour(1, 2, 3, 4); //=> 10"
  },
  "unfold": {
    "name": "unfold",
    "command": "(a → [b]) → * → [b]",
    "category": "List",
    "since": "v0.10.0",
    "description": "Builds a list from a seed value. Accepts an iterator function, which returns either false to stop iteration or an array of length 2 containing the value to add to the resulting list and the seed to be used in the next call to the iterator function. The iterator function receives one argument: (seed).",
    "see": [],
    "example": "const f = n => n > 50 ? false : [-n, n + 10];\nR.unfold(f, 10); //=> [-10, -20, -30, -40, -50]"
  },
  "union": {
    "name": "union",
    "command": "[*] → [*] → [*]",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Combines two lists into a set (i.e. no duplicates) composed of the elements of each list.",
    "see": [],
    "example": "R.union([1, 2, 3], [2, 3, 4]); //=> [1, 2, 3, 4]"
  },
  "unionwith": {
    "name": "unionWith",
    "command": "((a, a) → Boolean) → [*] → [*] → [*]",
    "category": "Relation",
    "since": "v0.1.0",
    "description": "Combines two lists into a set (i.e. no duplicates) composed of the elements of each list. Duplication is determined according to the value returned by applying the supplied predicate to two list elements.",
    "see": [
      "union"
    ],
    "example": "const l1 = [{a: 1}, {a: 2}];\nconst l2 = [{a: 1}, {a: 4}];\nR.unionWith(R.eqBy(R.prop('a')), l1, l2); //=> [{a: 1}, {a: 2}, {a: 4}]"
  },
  "uniq": {
    "name": "uniq",
    "command": "[a] → [a]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Returns a new list containing only one copy of each element in the original list. `R.equals` is used to determine equality.",
    "see": [],
    "example": "R.uniq([1, 1, 2, 1]); //=> [1, 2]\nR.uniq([1, '1']);     //=> [1, '1']\nR.uniq([[42], [42]]); //=> [[42]]"
  },
  "uniqby": {
    "name": "uniqBy",
    "command": "(a → b) → [a] → [a]",
    "category": "List",
    "since": "v0.16.0",
    "description": "Returns a new list containing only one copy of each element in the original list, based upon the value returned by applying the supplied function to each list element. Prefers the first item if the supplied function produces the same value on two items. `R.equals` is used for comparison.",
    "see": [],
    "example": "R.uniqBy(Math.abs, [-1, -5, 2, 10, 1, 2]); //=> [-1, -5, 2, 10]"
  },
  "uniqwith": {
    "name": "uniqWith",
    "command": "((a, a) → Boolean) → [a] → [a]",
    "category": "List",
    "since": "v0.2.0",
    "description": "Returns a new list containing only one copy of each element in the original list, based upon the value returned by applying the supplied predicate to two list elements. Prefers the first item if two items compare equal based on the predicate.",
    "see": [],
    "example": "const strEq = R.eqBy(String);\nR.uniqWith(strEq)([1, '1', 2, 1]); //=> [1, 2]\nR.uniqWith(strEq)([{}, {}]);       //=> [{}]\nR.uniqWith(strEq)([1, '1', 1]);    //=> [1]\nR.uniqWith(strEq)(['1', 1, 1]);    //=> ['1']"
  },
  "unless": {
    "name": "unless",
    "command": "(a → Boolean) → (a → a) → a → a",
    "category": "Logic",
    "since": "v0.18.0",
    "description": "Tests the final argument by passing it to the given predicate function. If the predicate is not satisfied, the function will return the result of calling the `whenFalseFn` function with the same argument. If the predicate is satisfied, the argument is returned as is.",
    "see": [
      "ifElse",
      "when",
      "cond"
    ],
    "example": "let safeInc = R.unless(R.isNil, R.inc);\nsafeInc(null); //=> null\nsafeInc(1); //=> 2"
  },
  "unnest": {
    "name": "unnest",
    "command": "Chain c => c (c a) → c a",
    "category": "List",
    "since": "v0.3.0",
    "description": "Shorthand for `R.chain(R.identity)`, which removes one level of nesting from any Chain.",
    "see": [
      "flatten",
      "chain"
    ],
    "example": "R.unnest([1, [2], [[3]]]); //=> [1, 2, [3]]\nR.unnest([[1, 2], [3, 4], [5, 6]]); //=> [1, 2, 3, 4, 5, 6]"
  },
  "until": {
    "name": "until",
    "command": "(a → Boolean) → (a → a) → a → a",
    "category": "Logic",
    "since": "v0.20.0",
    "description": "Takes a predicate, a transformation function, and an initial value, and returns a value of the same type as the initial value. It does so by applying the transformation until the predicate is satisfied, at which point it returns the satisfactory value.",
    "see": [],
    "example": "R.until(R.gt(R.__, 100), R.multiply(2))(1) // => 128"
  },
  "update": {
    "name": "update",
    "command": "Number → a → [a] → [a]",
    "category": "List",
    "since": "v0.14.0",
    "description": "Returns a new copy of the array with the element at the provided index replaced with the given value.",
    "see": [
      "adjust"
    ],
    "example": "R.update(1, '_', ['a', 'b', 'c']);      //=> ['a', '_', 'c']\nR.update(-1, '_', ['a', 'b', 'c']);     //=> ['a', 'b', '_']"
  },
  "usewith": {
    "name": "useWith",
    "command": "((x1, x2, …) → z) → [(a → x1), (b → x2), …] → (a → b → … → z)",
    "category": "Function",
    "since": "v0.1.0",
    "description": "Accepts a function `fn` and a list of transformer functions and returns a new curried function. When the new function is invoked, it calls the function `fn` with parameters consisting of the result of calling each supplied handler on successive arguments to the new function. If more arguments are passed to the returned function than transformer functions, those arguments are passed directly to `fn` as additional parameters. If you expect additional arguments that don't need to be transformed, although you can ignore them, it's best to pass an identity function so that the new function reports the correct arity.",
    "see": [
      "converge"
    ],
    "example": "R.useWith(Math.pow, [R.identity, R.identity])(3, 4); //=> 81\nR.useWith(Math.pow, [R.identity, R.identity])(3)(4); //=> 81\nR.useWith(Math.pow, [R.dec, R.inc])(3, 4); //=> 32\nR.useWith(Math.pow, [R.dec, R.inc])(3)(4); //=> 32"
  },
  "values": {
    "name": "values",
    "command": "{k: v} → [v]",
    "category": "Object",
    "since": "v0.1.0",
    "description": "Returns a list of all the enumerable own properties of the supplied object. Note that the order of the output array is not guaranteed across different JS platforms.",
    "see": [
      "valuesIn",
      "keys"
    ],
    "example": "R.values({a: 1, b: 2, c: 3}); //=> [1, 2, 3]"
  },
  "valuesin": {
    "name": "valuesIn",
    "command": "{k: v} → [v]",
    "category": "Object",
    "since": "v0.2.0",
    "description": "Returns a list of all the properties, including prototype properties, of the supplied object. Note that the order of the output array is not guaranteed to be consistent across different JS platforms.",
    "see": [
      "values",
      "keysIn"
    ],
    "example": "const F = function() { this.x = 'X'; };\nF.prototype.y = 'Y';\nconst f = new F();\nR.valuesIn(f); //=> ['X', 'Y']"
  },
  "view": {
    "name": "view",
    "command": "Lens s a → s → a",
    "category": "Object",
    "since": "v0.16.0",
    "description": "Returns a \"view\" of the given data structure, determined by the given lens. The lens's focus determines which portion of the data structure is visible.",
    "see": [
      "prop",
      "lensIndex",
      "lensProp"
    ],
    "example": "const xLens = R.lensProp('x');\n\nR.view(xLens, {x: 1, y: 2});  //=> 1\nR.view(xLens, {x: 4, y: 2});  //=> 4"
  },
  "when": {
    "name": "when",
    "command": "(a → Boolean) → (a → a) → a → a",
    "category": "Logic",
    "since": "v0.18.0",
    "description": "Tests the final argument by passing it to the given predicate function. If the predicate is satisfied, the function will return the result of calling the `whenTrueFn` function with the same argument. If the predicate is not satisfied, the argument is returned as is.",
    "see": [
      "ifElse",
      "unless",
      "cond"
    ],
    "example": "// truncate :: String -> String\nconst truncate = R.when(\n  R.propSatisfies(R.gt(R.__, 10), 'length'),\n  R.pipe(R.take(10), R.append('…'), R.join(''))\n);\ntruncate('12345');         //=> '12345'\ntruncate('0123456789ABC'); //=> '0123456789…'"
  },
  "where": {
    "name": "where",
    "command": "{String: (* → Boolean)} → {String: *} → Boolean",
    "category": "Object",
    "since": "v0.1.1",
    "description": "Takes a spec object and a test object; returns true if the test satisfies the spec. Each of the spec's own properties must be a predicate function. Each predicate is applied to the value of the corresponding property of the test object. `where` returns true if all the predicates return true, false otherwise. `where` is well suited to declaratively expressing constraints for other functions such as `filter` and `find`.",
    "see": [
      "propSatisfies",
      "whereEq"
    ],
    "example": "// pred :: Object -> Boolean\nconst pred = R.where({\n  a: R.equals('foo'),\n  b: R.complement(R.equals('bar')),\n  x: R.gt(R.__, 10),\n  y: R.lt(R.__, 20)\n});\n\npred({a: 'foo', b: 'xxx', x: 11, y: 19}); //=> true\npred({a: 'xxx', b: 'xxx', x: 11, y: 19}); //=> false\npred({a: 'foo', b: 'bar', x: 11, y: 19}); //=> false\npred({a: 'foo', b: 'xxx', x: 10, y: 19}); //=> false\npred({a: 'foo', b: 'xxx', x: 11, y: 20}); //=> false"
  },
  "whereeq": {
    "name": "whereEq",
    "command": "{String: *} → {String: *} → Boolean",
    "category": "Object",
    "since": "v0.14.0",
    "description": "Takes a spec object and a test object; returns true if the test satisfies the spec, false otherwise. An object satisfies the spec if, for each of the spec's own properties, accessing that property of the object gives the same value (in `R.equals` terms) as accessing that property of the spec. `whereEq` is a specialization of `where`.",
    "see": [
      "propEq",
      "where"
    ],
    "example": "// pred :: Object -> Boolean\nconst pred = R.whereEq({a: 1, b: 2});\n\npred({a: 1});              //=> false\npred({a: 1, b: 2});        //=> true\npred({a: 1, b: 2, c: 3});  //=> true\npred({a: 1, b: 1});        //=> false"
  },
  "without": {
    "name": "without",
    "command": "[a] → [a] → [a]",
    "category": "List",
    "since": "v0.19.0",
    "description": "Returns a new list without values in the first argument. `R.equals` is used to determine equality. Acts as a transducer if a transformer is given in list position.",
    "see": [
      "transduce",
      "difference",
      "remove"
    ],
    "example": "R.without([1, 2], [1, 2, 1, 3, 4]); //=> [3, 4]"
  },
  "xprod": {
    "name": "xprod",
    "command": "[a] → [b] → [[a,b]]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Creates a new list out of the two supplied by creating each possible pair from the lists.",
    "see": [],
    "example": "R.xprod([1, 2], ['a', 'b']); //=> [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]"
  },
  "zip": {
    "name": "zip",
    "command": "[a] → [b] → [[a,b]]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Creates a new list out of the two supplied by pairing up equally-positioned items from both lists. The returned list is truncated to the length of the shorter of the two input lists. Note: `zip` is equivalent to `zipWith(function(a, b) { return [a, b] })`.",
    "see": [],
    "example": "R.zip([1, 2, 3], ['a', 'b', 'c']); //=> [[1, 'a'], [2, 'b'], [3, 'c']]"
  },
  "zipobj": {
    "name": "zipObj",
    "command": "[String] → [*] → {String: *}",
    "category": "List",
    "since": "v0.3.0",
    "description": "Creates a new object out of a list of keys and a list of values. Key/value pairing is truncated to the length of the shorter of the two lists. Note: `zipObj` is equivalent to `pipe(zip, fromPairs)`.",
    "see": [],
    "example": "R.zipObj(['a', 'b', 'c'], [1, 2, 3]); //=> {a: 1, b: 2, c: 3}"
  },
  "zipwith": {
    "name": "zipWith",
    "command": "((a, b) → c) → [a] → [b] → [c]",
    "category": "List",
    "since": "v0.1.0",
    "description": "Creates a new list out of the two supplied by applying the function to each equally-positioned pair in the lists. The returned list is truncated to the length of the shorter of the two input lists.",
    "see": [],
    "example": "const f = (x, y) => {\n  // ...\n};\nR.zipWith(f, [1, 2, 3], ['a', 'b', 'c']);\n//=> [f(1, 'a'), f(2, 'b'), f(3, 'c')]"
  }
}
