// Last Updated 17/07/2019 v4.17.14
module.exports = {
  "chunk": {
    "name": "chunk",
    "command": "_.chunk(array, [size=1])",
    "description": "Creates an array of elements split into groups the length of `size`. If `array` can't be split evenly, the final chunk will be the remaining elements.",
    "since": "3.0.0"
  },
  "compact": {
    "name": "compact",
    "command": "_.compact(array)",
    "description": "Creates an array with all falsey values removed. The values `false`, `null`, `0`, `\"\"`, `undefined`, and `NaN` are falsey.",
    "since": "0.1.0"
  },
  "concat": {
    "name": "concat",
    "command": "_.concat(array, [values])",
    "description": "Creates a new array concatenating `array` with any additional arrays and/or values.",
    "since": "4.0.0"
  },
  "difference": {
    "name": "difference",
    "command": "_.difference(array, [values])",
    "description": "Creates an array of `array` values not included in the other given arrays using `SameValueZero` for equality comparisons. The order and references of result values are determined by the first array. Note: Unlike `_.pullAll`, this method returns a new array.",
    "since": "0.1.0"
  },
  "differenceby": {
    "name": "differenceBy",
    "command": "_.differenceBy(array, [values], [iteratee=_.identity])",
    "description": "This method is like `_.difference` except that it accepts `iteratee` which is invoked for each element of `array` and `values` to generate the criterion by which they're compared. The order and references of result values are determined by the first array. The iteratee is invoked with one argument: (value). Note: Unlike `_.pullAllBy`, this method returns a new array.",
    "since": "4.0.0"
  },
  "differencewith": {
    "name": "differenceWith",
    "command": "_.differenceWith(array, [values], [comparator])",
    "description": "This method is like `_.difference` except that it accepts `comparator` which is invoked to compare elements of `array` to `values`. The order and references of result values are determined by the first array. The comparator is invoked with two arguments: (arrVal, othVal). Note: Unlike `_.pullAllWith`, this method returns a new array.",
    "since": "4.0.0"
  },
  "drop": {
    "name": "drop",
    "command": "_.drop(array, [n=1])",
    "description": "Creates a slice of `array` with `n` elements dropped from the beginning.",
    "since": "0.5.0"
  },
  "dropright": {
    "name": "dropRight",
    "command": "_.dropRight(array, [n=1])",
    "description": "Creates a slice of `array` with `n` elements dropped from the end.",
    "since": "3.0.0"
  },
  "droprightwhile": {
    "name": "dropRightWhile",
    "command": "_.dropRightWhile(array, [predicate=_.identity])",
    "description": "Creates a slice of `array` excluding elements dropped from the end. Elements are dropped until `predicate` returns falsey. The predicate is invoked with three arguments: (value, index, array).",
    "since": "3.0.0"
  },
  "dropwhile": {
    "name": "dropWhile",
    "command": "_.dropWhile(array, [predicate=_.identity])",
    "description": "Creates a slice of `array` excluding elements dropped from the beginning. Elements are dropped until `predicate` returns falsey. The predicate is invoked with three arguments: (value, index, array).",
    "since": "3.0.0"
  },
  "fill": {
    "name": "fill",
    "command": "_.fill(array, value, [start=0], [end=array.length])",
    "description": "Fills elements of `array` with `value` from `start` up to, but not including, `end`. Note: This method mutates `array`.",
    "since": "3.2.0"
  },
  "findindex": {
    "name": "findIndex",
    "command": "_.findIndex(array, [predicate=_.identity], [fromIndex=0])",
    "description": "This method is like `_.find` except that it returns the index of the first element `predicate` returns truthy for instead of the element itself.",
    "since": "1.1.0"
  },
  "findlastindex": {
    "name": "findLastIndex",
    "command": "_.findLastIndex(array, [predicate=_.identity], [fromIndex=array.length-1])",
    "description": "This method is like `_.findIndex` except that it iterates over elements of `collection` from right to left.",
    "since": "2.0.0"
  },
  "flatten": {
    "name": "flatten",
    "command": "_.flatten(array)",
    "description": "Flattens `array` a single level deep.",
    "since": "0.1.0"
  },
  "flattendeep": {
    "name": "flattenDeep",
    "command": "_.flattenDeep(array)",
    "description": "Recursively flattens `array`.",
    "since": "3.0.0"
  },
  "flattendepth": {
    "name": "flattenDepth",
    "command": "_.flattenDepth(array, [depth=1])",
    "description": "Recursively flatten `array` up to `depth` times.",
    "since": "4.4.0"
  },
  "frompairs": {
    "name": "fromPairs",
    "command": "_.fromPairs(pairs)",
    "description": "The inverse of `_.toPairs`; this method returns an object composed from key-value `pairs`.",
    "since": "4.0.0"
  },
  "head": {
    "name": "head",
    "command": "_.head(array)",
    "description": "Gets the first element of `array`.",
    "since": "0.1.0"
  },
  "indexof": {
    "name": "indexOf",
    "command": "_.indexOf(array, value, [fromIndex=0])",
    "description": "Gets the index at which the first occurrence of `value` is found in `array` using `SameValueZero` for equality comparisons. If `fromIndex` is negative, it's used as the offset from the end of `array`.",
    "since": "0.1.0"
  },
  "initial": {
    "name": "initial",
    "command": "_.initial(array)",
    "description": "Gets all but the last element of `array`.",
    "since": "0.1.0"
  },
  "intersection": {
    "name": "intersection",
    "command": "_.intersection([arrays])",
    "description": "Creates an array of unique values that are included in all given arrays using `SameValueZero` for equality comparisons. The order and references of result values are determined by the first array.",
    "since": "0.1.0"
  },
  "intersectionby": {
    "name": "intersectionBy",
    "command": "_.intersectionBy([arrays], [iteratee=_.identity])",
    "description": "This method is like `_.intersection` except that it accepts `iteratee` which is invoked for each element of each `arrays` to generate the criterion by which they're compared. The order and references of result values are determined by the first array. The iteratee is invoked with one argument: (value).",
    "since": "4.0.0"
  },
  "intersectionwith": {
    "name": "intersectionWith",
    "command": "_.intersectionWith([arrays], [comparator])",
    "description": "This method is like `_.intersection` except that it accepts `comparator` which is invoked to compare elements of `arrays`. The order and references of result values are determined by the first array. The comparator is invoked with two arguments: (arrVal, othVal).",
    "since": "4.0.0"
  },
  "join": {
    "name": "join",
    "command": "_.join(array, [separator=','])",
    "description": "Converts all elements in `array` into a string separated by `separator`.",
    "since": "4.0.0"
  },
  "last": {
    "name": "last",
    "command": "_.last(array)",
    "description": "Gets the last element of `array`.",
    "since": "0.1.0"
  },
  "lastindexof": {
    "name": "lastIndexOf",
    "command": "_.lastIndexOf(array, value, [fromIndex=array.length-1])",
    "description": "This method is like `_.indexOf` except that it iterates over elements of `array` from right to left.",
    "since": "0.1.0"
  },
  "nth": {
    "name": "nth",
    "command": "_.nth(array, [n=0])",
    "description": "Gets the element at index `n` of `array`. If `n` is negative, the nth element from the end is returned.",
    "since": "4.11.0"
  },
  "pull": {
    "name": "pull",
    "command": "_.pull(array, [values])",
    "description": "Removes all given values from `array` using `SameValueZero` for equality comparisons. Note: Unlike `_.without`, this method mutates `array`. Use `_.remove` to remove elements from an array by predicate.",
    "since": "2.0.0"
  },
  "pullall": {
    "name": "pullAll",
    "command": "_.pullAll(array, values)",
    "description": "This method is like `_.pull` except that it accepts an array of values to remove. Note: Unlike `_.difference`, this method mutates `array`.",
    "since": "4.0.0"
  },
  "pullallby": {
    "name": "pullAllBy",
    "command": "_.pullAllBy(array, values, [iteratee=_.identity])",
    "description": "This method is like `_.pullAll` except that it accepts `iteratee` which is invoked for each element of `array` and `values` to generate the criterion by which they're compared. The iteratee is invoked with one argument: (value). Note: Unlike `_.differenceBy`, this method mutates `array`.",
    "since": "4.0.0"
  },
  "pullallwith": {
    "name": "pullAllWith",
    "command": "_.pullAllWith(array, values, [comparator])",
    "description": "This method is like `_.pullAll` except that it accepts `comparator` which is invoked to compare elements of `array` to `values`. The comparator is invoked with two arguments: (arrVal, othVal). Note: Unlike `_.differenceWith`, this method mutates `array`.",
    "since": "4.6.0"
  },
  "pullat": {
    "name": "pullAt",
    "command": "_.pullAt(array, [indexes])",
    "description": "Removes elements from `array` corresponding to `indexes` and returns an array of removed elements. Note: Unlike `_.at`, this method mutates `array`.",
    "since": "3.0.0"
  },
  "remove": {
    "name": "remove",
    "command": "_.remove(array, [predicate=_.identity])",
    "description": "Removes all elements from `array` that `predicate` returns truthy for and returns an array of the removed elements. The predicate is invoked with three arguments: (value, index, array). Note: Unlike `_.filter`, this method mutates `array`. Use `_.pull` to pull elements from an array by value.",
    "since": "2.0.0"
  },
  "reverse": {
    "name": "reverse",
    "command": "_.reverse(array)",
    "description": "Reverses `array` so that the first element becomes the last, the second element becomes the second to last, and so on. Note: This method mutates `array` and is based on `Array#reverse`.",
    "since": "4.0.0"
  },
  "slice": {
    "name": "slice",
    "command": "_.slice(array, [start=0], [end=array.length])",
    "description": "Creates a slice of `array` from `start` up to, but not including, `end`. Note: This method is used instead of `Array#slice` to ensure dense arrays are returned.",
    "since": "3.0.0"
  },
  "sortedindex": {
    "name": "sortedIndex",
    "command": "_.sortedIndex(array, value)",
    "description": "Uses a binary search to determine the lowest index at which `value` should be inserted into `array` in order to maintain its sort order.",
    "since": "0.1.0"
  },
  "sortedindexby": {
    "name": "sortedIndexBy",
    "command": "_.sortedIndexBy(array, value, [iteratee=_.identity])",
    "description": "This method is like `_.sortedIndex` except that it accepts `iteratee` which is invoked for `value` and each element of `array` to compute their sort ranking. The iteratee is invoked with one argument: (value).",
    "since": "4.0.0"
  },
  "sortedindexof": {
    "name": "sortedIndexOf",
    "command": "_.sortedIndexOf(array, value)",
    "description": "This method is like `_.indexOf` except that it performs a binary search on a sorted `array`.",
    "since": "4.0.0"
  },
  "sortedlastindex": {
    "name": "sortedLastIndex",
    "command": "_.sortedLastIndex(array, value)",
    "description": "This method is like `_.sortedIndex` except that it returns the highest index at which `value` should be inserted into `array` in order to maintain its sort order.",
    "since": "3.0.0"
  },
  "sortedlastindexby": {
    "name": "sortedLastIndexBy",
    "command": "_.sortedLastIndexBy(array, value, [iteratee=_.identity])",
    "description": "This method is like `_.sortedLastIndex` except that it accepts `iteratee` which is invoked for `value` and each element of `array` to compute their sort ranking. The iteratee is invoked with one argument: (value).",
    "since": "4.0.0"
  },
  "sortedlastindexof": {
    "name": "sortedLastIndexOf",
    "command": "_.sortedLastIndexOf(array, value)",
    "description": "This method is like `_.lastIndexOf` except that it performs a binary search on a sorted `array`.",
    "since": "4.0.0"
  },
  "sorteduniq": {
    "name": "sortedUniq",
    "command": "_.sortedUniq(array)",
    "description": "This method is like `_.uniq` except that it's designed and optimized for sorted arrays.",
    "since": "4.0.0"
  },
  "sorteduniqby": {
    "name": "sortedUniqBy",
    "command": "_.sortedUniqBy(array, [iteratee])",
    "description": "This method is like `_.uniqBy` except that it's designed and optimized for sorted arrays.",
    "since": "4.0.0"
  },
  "tail": {
    "name": "tail",
    "command": "_.tail(array)",
    "description": "Gets all but the first element of `array`.",
    "since": "4.0.0"
  },
  "take": {
    "name": "take",
    "command": "_.take(array, [n=1])",
    "description": "Creates a slice of `array` with `n` elements taken from the beginning.",
    "since": "0.1.0"
  },
  "takeright": {
    "name": "takeRight",
    "command": "_.takeRight(array, [n=1])",
    "description": "Creates a slice of `array` with `n` elements taken from the end.",
    "since": "3.0.0"
  },
  "takerightwhile": {
    "name": "takeRightWhile",
    "command": "_.takeRightWhile(array, [predicate=_.identity])",
    "description": "Creates a slice of `array` with elements taken from the end. Elements are taken until `predicate` returns falsey. The predicate is invoked with three arguments: (value, index, array).",
    "since": "3.0.0"
  },
  "takewhile": {
    "name": "takeWhile",
    "command": "_.takeWhile(array, [predicate=_.identity])",
    "description": "Creates a slice of `array` with elements taken from the beginning. Elements are taken until `predicate` returns falsey. The predicate is invoked with three arguments: (value, index, array).",
    "since": "3.0.0"
  },
  "union": {
    "name": "union",
    "command": "_.union([arrays])",
    "description": "Creates an array of unique values, in order, from all given arrays using `SameValueZero` for equality comparisons.",
    "since": "0.1.0"
  },
  "unionby": {
    "name": "unionBy",
    "command": "_.unionBy([arrays], [iteratee=_.identity])",
    "description": "This method is like `_.union` except that it accepts `iteratee` which is invoked for each element of each `arrays` to generate the criterion by which uniqueness is computed. Result values are chosen from the first array in which the value occurs. The iteratee is invoked with one argument: (value).",
    "since": "4.0.0"
  },
  "unionwith": {
    "name": "unionWith",
    "command": "_.unionWith([arrays], [comparator])",
    "description": "This method is like `_.union` except that it accepts `comparator` which is invoked to compare elements of `arrays`. Result values are chosen from the first array in which the value occurs. The comparator is invoked with two arguments: (arrVal, othVal).",
    "since": "4.0.0"
  },
  "uniq": {
    "name": "uniq",
    "command": "_.uniq(array)",
    "description": "Creates a duplicate-free version of an array, using `SameValueZero` for equality comparisons, in which only the first occurrence of each element is kept. The order of result values is determined by the order they occur in the array.",
    "since": "0.1.0"
  },
  "uniqby": {
    "name": "uniqBy",
    "command": "_.uniqBy(array, [iteratee=_.identity])",
    "description": "This method is like `_.uniq` except that it accepts `iteratee` which is invoked for each element in `array` to generate the criterion by which uniqueness is computed. The order of result values is determined by the order they occur in the array. The iteratee is invoked with one argument: (value).",
    "since": "4.0.0"
  },
  "uniqwith": {
    "name": "uniqWith",
    "command": "_.uniqWith(array, [comparator])",
    "description": "This method is like `_.uniq` except that it accepts `comparator` which is invoked to compare elements of `array`. The order of result values is determined by the order they occur in the array.The comparator is invoked with two arguments: (arrVal, othVal).",
    "since": "4.0.0"
  },
  "unzip": {
    "name": "unzip",
    "command": "_.unzip(array)",
    "description": "This method is like `_.zip` except that it accepts an array of grouped elements and creates an array regrouping the elements to their pre-zip configuration.",
    "since": "1.2.0"
  },
  "unzipwith": {
    "name": "unzipWith",
    "command": "_.unzipWith(array, [iteratee=_.identity])",
    "description": "This method is like `_.unzip` except that it accepts `iteratee` to specify how regrouped values should be combined. The iteratee is invoked with the elements of each group: (...group).",
    "since": "3.8.0"
  },
  "without": {
    "name": "without",
    "command": "_.without(array, [values])",
    "description": "Creates an array excluding all given values using `SameValueZero` for equality comparisons. Note: Unlike `_.pull`, this method returns a new array.",
    "since": "0.1.0"
  },
  "xor": {
    "name": "xor",
    "command": "_.xor([arrays])",
    "description": "Creates an array of unique values that is the symmetric difference of the given arrays. The order of result values is determined by the order they occur in the arrays.",
    "since": "2.4.0"
  },
  "xorby": {
    "name": "xorBy",
    "command": "_.xorBy([arrays], [iteratee=_.identity])",
    "description": "This method is like `_.xor` except that it accepts `iteratee` which is invoked for each element of each `arrays` to generate the criterion by which by which they're compared. The order of result values is determined by the order they occur in the arrays. The iteratee is invoked with one argument: (value).",
    "since": "4.0.0"
  },
  "xorwith": {
    "name": "xorWith",
    "command": "_.xorWith([arrays], [comparator])",
    "description": "This method is like `_.xor` except that it accepts `comparator` which is invoked to compare elements of `arrays`. The order of result values is determined by the order they occur in the arrays. The comparator is invoked with two arguments: (arrVal, othVal).",
    "since": "4.0.0"
  },
  "zip": {
    "name": "zip",
    "command": "_.zip([arrays])",
    "description": "Creates an array of grouped elements, the first of which contains the first elements of the given arrays, the second of which contains the second elements of the given arrays, and so on.",
    "since": "0.1.0"
  },
  "zipobject": {
    "name": "zipObject",
    "command": "_.zipObject([props=[]], [values=[]])",
    "description": "This method is like `_.fromPairs` except that it accepts two arrays, one of property identifiers and one of corresponding values.",
    "since": "0.4.0"
  },
  "zipobjectdeep": {
    "name": "zipObjectDeep",
    "command": "_.zipObjectDeep([props=[]], [values=[]])",
    "description": "This method is like `_.zipObject` except that it supports property paths.",
    "since": "4.1.0"
  },
  "zipwith": {
    "name": "zipWith",
    "command": "_.zipWith([arrays], [iteratee=_.identity])",
    "description": "This method is like `_.zip` except that it accepts `iteratee` to specify how grouped values should be combined. The iteratee is invoked with the elements of each group: (...group).",
    "since": "3.8.0"
  },
  "countby": {
    "name": "countBy",
    "command": "_.countBy(collection, [iteratee=_.identity])",
    "description": "Creates an object composed of keys generated from the results of running each element of `collection` thru `iteratee`. The corresponding value of each key is the number of times the key was returned by `iteratee`. The iteratee is invoked with one argument: (value).",
    "since": "0.5.0"
  },
  "every": {
    "name": "every",
    "command": "_.every(collection, [predicate=_.identity])",
    "description": "Checks if `predicate` returns truthy for all elements of `collection`. Iteration is stopped once `predicate` returns falsey. The predicate is invoked with three arguments: (value, index|key, collection). Note: This method returns `true` for empty collections because everything is true of elements of empty collections.",
    "since": "0.1.0"
  },
  "filter": {
    "name": "filter",
    "command": "_.filter(collection, [predicate=_.identity])",
    "description": "Iterates over elements of `collection`, returning an array of all elements `predicate` returns truthy for. The predicate is invoked with three arguments: (value, index|key, collection). Note: Unlike `_.remove`, this method returns a new array.",
    "since": "0.1.0"
  },
  "find": {
    "name": "find",
    "command": "_.find(collection, [predicate=_.identity], [fromIndex=0])",
    "description": "Iterates over elements of `collection`, returning the first element `predicate` returns truthy for. The predicate is invoked with three arguments: (value, index|key, collection).",
    "since": "0.1.0"
  },
  "findlast": {
    "name": "findLast",
    "command": "_.findLast(collection, [predicate=_.identity], [fromIndex=collection.length-1])",
    "description": "This method is like `_.find` except that it iterates over elements of `collection` from right to left.",
    "since": "2.0.0"
  },
  "flatmap": {
    "name": "flatMap",
    "command": "_.flatMap(collection, [iteratee=_.identity])",
    "description": "Creates a flattened array of values by running each element in `collection` thru `iteratee` and flattening the mapped results. The iteratee is invoked with three arguments: (value, index|key, collection).",
    "since": "4.0.0"
  },
  "flatmapdeep": {
    "name": "flatMapDeep",
    "command": "_.flatMapDeep(collection, [iteratee=_.identity])",
    "description": "This method is like `_.flatMap` except that it recursively flattens the mapped results.",
    "since": "4.7.0"
  },
  "flatmapdepth": {
    "name": "flatMapDepth",
    "command": "_.flatMapDepth(collection, [iteratee=_.identity], [depth=1])",
    "description": "This method is like `_.flatMap` except that it recursively flattens the mapped results up to `depth` times.",
    "since": "4.7.0"
  },
  "foreach": {
    "name": "forEach",
    "command": "_.forEach(collection, [iteratee=_.identity])",
    "description": "Iterates over elements of `collection` and invokes `iteratee` for each element. The iteratee is invoked with three arguments: (value, index|key, collection). Iteratee functions may exit iteration early by explicitly returning `false`. Note: As with other \"Collections\" methods, objects with a \"length\" property are iterated like arrays. To avoid this behavior use `_.forIn` or `_.forOwn` for object iteration.",
    "since": "0.1.0"
  },
  "foreachright": {
    "name": "forEachRight",
    "command": "_.forEachRight(collection, [iteratee=_.identity])",
    "description": "This method is like `_.forEach` except that it iterates over elements of `collection` from right to left.",
    "since": "2.0.0"
  },
  "groupby": {
    "name": "groupBy",
    "command": "_.groupBy(collection, [iteratee=_.identity])",
    "description": "Creates an object composed of keys generated from the results of running each element of `collection` thru `iteratee`. The order of grouped values is determined by the order they occur in `collection`. The corresponding value of each key is an array of elements responsible for generating the key. The iteratee is invoked with one argument: (value).",
    "since": "0.1.0"
  },
  "includes": {
    "name": "includes",
    "command": "_.includes(collection, value, [fromIndex=0])",
    "description": "Checks if `value` is in `collection`. If `collection` is a string, it's checked for a substring of `value`, otherwise `SameValueZero` is used for equality comparisons. If `fromIndex` is negative, it's used as the offset from the end of `collection`.",
    "since": "0.1.0"
  },
  "invokemap": {
    "name": "invokeMap",
    "command": "_.invokeMap(collection, path, [args])",
    "description": "Invokes the method at `path` of each element in `collection`, returning an array of the results of each invoked method. Any additional arguments are provided to each invoked method. If `path` is a function, it's invoked for, and `this` bound to, each element in `collection`.",
    "since": "4.0.0"
  },
  "keyby": {
    "name": "keyBy",
    "command": "_.keyBy(collection, [iteratee=_.identity])",
    "description": "Creates an object composed of keys generated from the results of running each element of `collection` thru `iteratee`. The corresponding value of each key is the last element responsible for generating the key. The iteratee is invoked with one argument: (value).",
    "since": "4.0.0"
  },
  "map": {
    "name": "map",
    "command": "_.map(collection, [iteratee=_.identity])",
    "description": "Creates an array of values by running each element in `collection` thru `iteratee`. The iteratee is invoked with three arguments: (value, index|key, collection). Many lodash methods are guarded to work as iteratees for methods like `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`. The guarded methods are: `ary`, `chunk`, `curry`, `curryRight`, `drop`, `dropRight`, `every`, `fill`, `invert`, `parseInt`, `random`, `range`, `rangeRight`, `repeat`, `sampleSize`, `slice`, `some`, `sortBy`, `split`, `take`, `takeRight`, `template`, `trim`, `trimEnd`, `trimStart`, and `words`",
    "since": "0.1.0"
  },
  "orderby": {
    "name": "orderBy",
    "command": "_.orderBy(collection, [iteratees=[_.identity]], [orders])",
    "description": "This method is like `_.sortBy` except that it allows specifying the sort orders of the iteratees to sort by. If `orders` is unspecified, all values are sorted in ascending order. Otherwise, specify an order of \"desc\" for descending or \"asc\" for ascending sort order of corresponding values.",
    "since": "4.0.0"
  },
  "partition": {
    "name": "partition",
    "command": "_.partition(collection, [predicate=_.identity])",
    "description": "Creates an array of elements split into two groups, the first of which contains elements `predicate` returns truthy for, the second of which contains elements `predicate` returns falsey for. The predicate is invoked with one argument: (value).",
    "since": "3.0.0"
  },
  "reduce": {
    "name": "reduce",
    "command": "_.reduce(collection, [iteratee=_.identity], [accumulator])",
    "description": "Reduces `collection` to a value which is the accumulated result of running each element in `collection` thru `iteratee`, where each successive invocation is supplied the return value of the previous. If `accumulator` is not given, the first element of `collection` is used as the initial value. The iteratee is invoked with four arguments: (accumulator, value, index|key, collection). Many lodash methods are guarded to work as iteratees for methods like `_.reduce`, `_.reduceRight`, and `_.transform`. The guarded methods are: `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`, and `sortBy`",
    "since": "0.1.0"
  },
  "reduceright": {
    "name": "reduceRight",
    "command": "_.reduceRight(collection, [iteratee=_.identity], [accumulator])",
    "description": "This method is like `_.reduce` except that it iterates over elements of `collection` from right to left.",
    "since": "0.1.0"
  },
  "reject": {
    "name": "reject",
    "command": "_.reject(collection, [predicate=_.identity])",
    "description": "The opposite of `_.filter`; this method returns the elements of `collection` that `predicate` does not return truthy for.",
    "since": "0.1.0"
  },
  "sample": {
    "name": "sample",
    "command": "_.sample(collection)",
    "description": "Gets a random element from `collection`.",
    "since": "2.0.0"
  },
  "samplesize": {
    "name": "sampleSize",
    "command": "_.sampleSize(collection, [n=1])",
    "description": "Gets `n` random elements at unique keys from `collection` up to the size of `collection`.",
    "since": "4.0.0"
  },
  "shuffle": {
    "name": "shuffle",
    "command": "_.shuffle(collection)",
    "description": "Creates an array of shuffled values, using a version of the Fisher-Yates shuffle.",
    "since": "0.1.0"
  },
  "size": {
    "name": "size",
    "command": "_.size(collection)",
    "description": "Gets the size of `collection` by returning its length for array-like values or the number of own enumerable string keyed properties for objects.",
    "since": "0.1.0"
  },
  "some": {
    "name": "some",
    "command": "_.some(collection, [predicate=_.identity])",
    "description": "Checks if `predicate` returns truthy for any element of `collection`. Iteration is stopped once `predicate` returns truthy. The predicate is invoked with three arguments: (value, index|key, collection).",
    "since": "0.1.0"
  },
  "sortby": {
    "name": "sortBy",
    "command": "_.sortBy(collection, [iteratees=[_.identity]])",
    "description": "Creates an array of elements, sorted in ascending order by the results of running each element in a collection thru each iteratee. This method performs a stable sort, that is, it preserves the original sort order of equal elements. The iteratees are invoked with one argument: (value).",
    "since": "0.1.0"
  },
  "now": {
    "name": "now",
    "command": "_.now()",
    "description": "Gets the timestamp of the number of milliseconds that have elapsed since the Unix epoch (1 January `1970 00`:00:00 UTC).",
    "since": "2.4.0"
  },
  "after": {
    "name": "after",
    "command": "_.after(n, func)",
    "description": "The opposite of `_.before`; this method creates a function that invokes `func` once it's called `n` or more times.",
    "since": "0.1.0"
  },
  "ary": {
    "name": "ary",
    "command": "_.ary(func, [n=func.length])",
    "description": "Creates a function that invokes `func`, with up to `n` arguments, ignoring any additional arguments.",
    "since": "3.0.0"
  },
  "before": {
    "name": "before",
    "command": "_.before(n, func)",
    "description": "Creates a function that invokes `func`, with the `this` binding and arguments of the created function, while it's called less than `n` times. Subsequent calls to the created function return the result of the last `func` invocation.",
    "since": "3.0.0"
  },
  "bind": {
    "name": "bind",
    "command": "_.bind(func, thisArg, [partials])",
    "description": "Creates a function that invokes `func` with the `this` binding of `thisArg` and `partials` prepended to the arguments it receives. The `_.bind.placeholder` value, which defaults to `_` in monolithic builds, may be used as a placeholder for partially applied arguments. Note: Unlike native `Function#bind`, this method doesn't set the \"length\" property of bound functions.",
    "since": "0.1.0"
  },
  "bindkey": {
    "name": "bindKey",
    "command": "_.bindKey(object, key, [partials])",
    "description": "Creates a function that invokes the method at `object[key]` with `partials` prepended to the arguments it receives. This method differs from `_.bind` by allowing bound functions to reference methods that may be redefined or don't yet exist. See Peter Michaux's article for more details. The `_.bindKey.placeholder` value, which defaults to `_` in monolithic builds, may be used as a placeholder for partially applied arguments.",
    "since": "0.10.0"
  },
  "curry": {
    "name": "curry",
    "command": "_.curry(func, [arity=func.length])",
    "description": "Creates a function that accepts arguments of `func` and either invokes `func` returning its result, if at least `arity` number of arguments have been provided, or returns a function that accepts the remaining `func` arguments, and so on. The arity of `func` may be specified if `func.length` is not sufficient. The `_.curry.placeholder` value, which defaults to `_` in monolithic builds, may be used as a placeholder for provided arguments. Note: This method doesn't set the \"length\" property of curried functions.",
    "since": "2.0.0"
  },
  "curryright": {
    "name": "curryRight",
    "command": "_.curryRight(func, [arity=func.length])",
    "description": "This method is like `_.curry` except that arguments are applied to `func` in the manner of `_.partialRight` instead of `_.partial`. The `_.curryRight.placeholder` value, which defaults to `_` in monolithic builds, may be used as a placeholder for provided arguments. Note: This method doesn't set the \"length\" property of curried functions.",
    "since": "3.0.0"
  },
  "debounce": {
    "name": "debounce",
    "command": "_.debounce(func, [wait=0], [options={}])",
    "description": "Creates a debounced function that delays invoking `func` until after `wait` milliseconds have elapsed since the last time the debounced function was invoked. The debounced function comes with a `cancel` method to cancel delayed `func` invocations and a `flush` method to immediately invoke them. Provide `options` to indicate whether `func` should be invoked on the leading and/or trailing edge of the `wait` timeout. The `func` is invoked with the last arguments provided to the debounced function. Subsequent calls to the debounced function return the result of the last `func` invocation. Note: If `leading` and `trailing` options are `true`, `func` is invoked on the trailing edge of the timeout only if the debounced function is invoked more than once during the `wait` timeout. If `wait` is `0` and `leading` is `false`, `func` invocation is deferred until to the next tick, similar to `setTimeout` with a timeout of `0`. See David Corbacho's article for details over the differences between `_.debounce` and `_.throttle`.",
    "since": "0.1.0"
  },
  "defer": {
    "name": "defer",
    "command": "_.defer(func, [args])",
    "description": "Defers invoking the `func` until the current call stack has cleared. Any additional arguments are provided to `func` when it's invoked.",
    "since": "0.1.0"
  },
  "delay": {
    "name": "delay",
    "command": "_.delay(func, wait, [args])",
    "description": "Invokes `func` after `wait` milliseconds. Any additional arguments are provided to `func` when it's invoked.",
    "since": "0.1.0"
  },
  "flip": {
    "name": "flip",
    "command": "_.flip(func)",
    "description": "Creates a function that invokes `func` with arguments reversed.",
    "since": "4.0.0"
  },
  "memoize": {
    "name": "memoize",
    "command": "_.memoize(func, [resolver])",
    "description": "Creates a function that memoizes the result of `func`. If `resolver` is provided, it determines the cache key for storing the result based on the arguments provided to the memoized function. By default, the first argument provided to the memoized function is used as the map cache key. The `func` is invoked with the `this` binding of the memoized function. Note: The cache is exposed as the `cache` property on the memoized function. Its creation may be customized by replacing the `_.memoize.Cache` constructor with one whose instances implement the `Map` method interface of `clear`, `delete`, `get`, `has`, and `set`.",
    "since": "0.1.0"
  },
  "negate": {
    "name": "negate",
    "command": "_.negate(predicate)",
    "description": "Creates a function that negates the result of the predicate `func`. The `func` predicate is invoked with the `this` binding and arguments of the created function.",
    "since": "3.0.0"
  },
  "once": {
    "name": "once",
    "command": "_.once(func)",
    "description": "Creates a function that is restricted to invoking `func` once. Repeat calls to the function return the value of the first invocation. The `func` is invoked with the `this` binding and arguments of the created function.",
    "since": "0.1.0"
  },
  "overargs": {
    "name": "overArgs",
    "command": "_.overArgs(func, [transforms=[_.identity]])",
    "description": "Creates a function that invokes `func` with its arguments transformed.",
    "since": "4.0.0"
  },
  "partial": {
    "name": "partial",
    "command": "_.partial(func, [partials])",
    "description": "Creates a function that invokes `func` with `partials` prepended to the arguments it receives. This method is like `_.bind` except it does not alter the `this` binding. The `_.partial.placeholder` value, which defaults to `_` in monolithic builds, may be used as a placeholder for partially applied arguments. Note: This method doesn't set the \"length\" property of partially applied functions.",
    "since": "0.2.0"
  },
  "partialright": {
    "name": "partialRight",
    "command": "_.partialRight(func, [partials])",
    "description": "This method is like `_.partial` except that partially applied arguments are appended to the arguments it receives. The `_.partialRight.placeholder` value, which defaults to `_` in monolithic builds, may be used as a placeholder for partially applied arguments. Note: This method doesn't set the \"length\" property of partially applied functions.",
    "since": "1.0.0"
  },
  "rearg": {
    "name": "rearg",
    "command": "_.rearg(func, indexes)",
    "description": "Creates a function that invokes `func` with arguments arranged according to the specified `indexes` where the argument value at the first index is provided as the first argument, the argument value at the second index is provided as the second argument, and so on.",
    "since": "3.0.0"
  },
  "rest": {
    "name": "rest",
    "command": "_.rest(func, [start=func.length-1])",
    "description": "Creates a function that invokes `func` with the `this` binding of the created function and arguments from `start` and beyond provided as an array. Note: This method is based on the rest parameter.",
    "since": "4.0.0"
  },
  "spread": {
    "name": "spread",
    "command": "_.spread(func, [start=0])",
    "description": "Creates a function that invokes `func` with the `this` binding of the create function and an array of arguments much like `Function#apply`. Note: This method is based on the spread operator.",
    "since": "3.2.0"
  },
  "throttle": {
    "name": "throttle",
    "command": "_.throttle(func, [wait=0], [options={}])",
    "description": "Creates a throttled function that only invokes `func` at most once per every `wait` milliseconds. The throttled function comes with a `cancel` method to cancel delayed `func` invocations and a `flush` method to immediately invoke them. Provide `options` to indicate whether `func` should be invoked on the leading and/or trailing edge of the `wait` timeout. The `func` is invoked with the last arguments provided to the throttled function. Subsequent calls to the throttled function return the result of the last `func` invocation. Note: If `leading` and `trailing` options are `true`, `func` is invoked on the trailing edge of the timeout only if the throttled function is invoked more than once during the `wait` timeout. If `wait` is `0` and `leading` is `false`, `func` invocation is deferred until to the next tick, similar to `setTimeout` with a timeout of `0`. See David Corbacho's article for details over the differences between `_.throttle` and `_.debounce`.",
    "since": "0.1.0"
  },
  "unary": {
    "name": "unary",
    "command": "_.unary(func)",
    "description": "Creates a function that accepts up to one argument, ignoring any additional arguments.",
    "since": "4.0.0"
  },
  "wrap": {
    "name": "wrap",
    "command": "_.wrap(value, [wrapper=identity])",
    "description": "Creates a function that provides `value` to `wrapper` as its first argument. Any additional arguments provided to the function are appended to those provided to the `wrapper`. The wrapper is invoked with the `this` binding of the created function.",
    "since": "0.1.0"
  },
  "castarray": {
    "name": "castArray",
    "command": "_.castArray(value)",
    "description": "Casts `value` as an array if it's not one.",
    "since": "4.4.0"
  },
  "clone": {
    "name": "clone",
    "command": "_.clone(value)",
    "description": "Creates a shallow clone of `value`. Note: This method is loosely based on the structured clone algorithm and supports cloning arrays, array buffers, booleans, date objects, maps, numbers, `Object` objects, regexes, sets, strings, symbols, and typed arrays. The own enumerable properties of `arguments` objects are cloned as plain objects. An empty object is returned for uncloneable values such as error objects, functions, DOM nodes, and WeakMaps.",
    "since": "0.1.0"
  },
  "clonedeep": {
    "name": "cloneDeep",
    "command": "_.cloneDeep(value)",
    "description": "This method is like `_.clone` except that it recursively clones `value`.",
    "since": "1.0.0"
  },
  "clonedeepwith": {
    "name": "cloneDeepWith",
    "command": "_.cloneDeepWith(value, [customizer])",
    "description": "This method is like `_.cloneWith` except that it recursively clones `value`.",
    "since": "4.0.0"
  },
  "clonewith": {
    "name": "cloneWith",
    "command": "_.cloneWith(value, [customizer])",
    "description": "This method is like `_.clone` except that it accepts `customizer` which is invoked to produce the cloned value. If `customizer` returns `undefined`, cloning is handled by the method instead. The `customizer` is invoked with up to four arguments; (value [, index|key, object, stack]).",
    "since": "4.0.0"
  },
  "conformsto": {
    "name": "conformsTo",
    "command": "_.conformsTo(object, source)",
    "description": "Checks if `object` conforms to `source` by invoking the predicate properties of `source` with the corresponding property values of `object`. Note: This method is equivalent to `_.conforms` when `source` is partially applied.",
    "since": "4.14.0"
  },
  "eq": {
    "name": "eq",
    "command": "_.eq(value, other)",
    "description": "Performs a `SameValueZero` comparison between two values to determine if they are equivalent.",
    "since": "4.0.0"
  },
  "gt": {
    "name": "gt",
    "command": "_.gt(value, other)",
    "description": "Checks if `value` is greater than `other`.",
    "since": "3.9.0"
  },
  "gte": {
    "name": "gte",
    "command": "_.gte(value, other)",
    "description": "Checks if `value` is greater than or equal to `other`.",
    "since": "3.9.0"
  },
  "isarguments": {
    "name": "isArguments",
    "command": "_.isArguments(value)",
    "description": "Checks if `value` is likely an `arguments` object.",
    "since": "0.1.0"
  },
  "isarray": {
    "name": "isArray",
    "command": "_.isArray(value)",
    "description": "Checks if `value` is classified as an `Array` object.",
    "since": "0.1.0"
  },
  "isarraybuffer": {
    "name": "isArrayBuffer",
    "command": "_.isArrayBuffer(value)",
    "description": "Checks if `value` is classified as an `ArrayBuffer` object.",
    "since": "4.3.0"
  },
  "isarraylike": {
    "name": "isArrayLike",
    "command": "_.isArrayLike(value)",
    "description": "Checks if `value` is array-like. A value is considered array-like if it's not a function and has a `value.length` that's an integer greater than or equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.",
    "since": "4.0.0"
  },
  "isarraylikeobject": {
    "name": "isArrayLikeObject",
    "command": "_.isArrayLikeObject(value)",
    "description": "This method is like `_.isArrayLike` except that it also checks if `value` is an object.",
    "since": "4.0.0"
  },
  "isboolean": {
    "name": "isBoolean",
    "command": "_.isBoolean(value)",
    "description": "Checks if `value` is classified as a boolean primitive or object.",
    "since": "0.1.0"
  },
  "isbuffer": {
    "name": "isBuffer",
    "command": "_.isBuffer(value)",
    "description": "Checks if `value` is a buffer.",
    "since": "4.3.0"
  },
  "isdate": {
    "name": "isDate",
    "command": "_.isDate(value)",
    "description": "Checks if `value` is classified as a `Date` object.",
    "since": "0.1.0"
  },
  "iselement": {
    "name": "isElement",
    "command": "_.isElement(value)",
    "description": "Checks if `value` is likely a DOM element.",
    "since": "0.1.0"
  },
  "isempty": {
    "name": "isEmpty",
    "command": "_.isEmpty(value)",
    "description": "Checks if `value` is an empty object, collection, map, or set. Objects are considered empty if they have no own enumerable string keyed properties. Array-like values such as `arguments` objects, arrays, buffers, strings, or jQuery-like collections are considered empty if they have a `length` of `0`. Similarly, maps and sets are considered empty if they have a `size` of `0`.",
    "since": "0.1.0"
  },
  "isequal": {
    "name": "isEqual",
    "command": "_.isEqual(value, other)",
    "description": "Performs a deep comparison between two values to determine if they are equivalent. Note: This method supports comparing arrays, array buffers, booleans, date objects, error objects, maps, numbers, `Object` objects, regexes, sets, strings, symbols, and typed arrays. `Object` objects are compared by their own, not inherited, enumerable properties. Functions and DOM nodes are compared by strict equality, i.e. `===`.",
    "since": "0.1.0"
  },
  "isequalwith": {
    "name": "isEqualWith",
    "command": "_.isEqualWith(value, other, [customizer])",
    "description": "This method is like `_.isEqual` except that it accepts `customizer` which is invoked to compare values. If `customizer` returns `undefined`, comparisons are handled by the method instead. The `customizer` is invoked with up to six arguments: (objValue, othValue [, index|key, object, other, stack]).",
    "since": "4.0.0"
  },
  "iserror": {
    "name": "isError",
    "command": "_.isError(value)",
    "description": "Checks if `value` is an `Error`, `EvalError`, `RangeError`, `ReferenceError`, `SyntaxError`, `TypeError`, or `URIError` object.",
    "since": "3.0.0"
  },
  "isfinite": {
    "name": "isFinite",
    "command": "_.isFinite(value)",
    "description": "Checks if `value` is a finite primitive number. Note: This method is based on `Number.isFinite`.",
    "since": "0.1.0"
  },
  "isfunction": {
    "name": "isFunction",
    "command": "_.isFunction(value)",
    "description": "Checks if `value` is classified as a `Function` object.",
    "since": "0.1.0"
  },
  "isinteger": {
    "name": "isInteger",
    "command": "_.isInteger(value)",
    "description": "Checks if `value` is an integer. Note: This method is based on `Number.isInteger`.",
    "since": "4.0.0"
  },
  "islength": {
    "name": "isLength",
    "command": "_.isLength(value)",
    "description": "Checks if `value` is a valid array-like length. Note: This method is loosely based on `ToLength`.",
    "since": "4.0.0"
  },
  "ismap": {
    "name": "isMap",
    "command": "_.isMap(value)",
    "description": "Checks if `value` is classified as a `Map` object.",
    "since": "4.3.0"
  },
  "ismatch": {
    "name": "isMatch",
    "command": "_.isMatch(object, source)",
    "description": "Performs a partial deep comparison between `object` and `source` to determine if `object` contains equivalent property values. Note: This method is equivalent to `_.matches` when `source` is partially applied. Partial comparisons will match empty array and empty object `source` values against any array or object value, respectively. See `_.isEqual` for a list of supported value comparisons.",
    "since": "3.0.0"
  },
  "ismatchwith": {
    "name": "isMatchWith",
    "command": "_.isMatchWith(object, source, [customizer])",
    "description": "This method is like `_.isMatch` except that it accepts `customizer` which is invoked to compare values. If `customizer` returns `undefined`, comparisons are handled by the method instead. The `customizer` is invoked with five arguments: (objValue, srcValue, index|key, object, source).",
    "since": "4.0.0"
  },
  "isnan": {
    "name": "isNaN",
    "command": "_.isNaN(value)",
    "description": "Checks if `value` is `NaN`. Note: This method is based on `Number.isNaN` and is not the same as global `isNaN` which returns `true` for `undefined` and other non-number values.",
    "since": "0.1.0"
  },
  "isnative": {
    "name": "isNative",
    "command": "_.isNative(value)",
    "description": "Checks if `value` is a pristine native function. Note: This method can't reliably detect native functions in the presence of the core-js package because core-js circumvents this kind of detection. Despite multiple requests, the core-js maintainer has made it clear: any attempt to fix the detection will be obstructed. As a result, we're left with little choice but to throw an error. Unfortunately, this also affects packages, like babel-polyfill, which rely on core-js.",
    "since": "3.0.0"
  },
  "isnil": {
    "name": "isNil",
    "command": "_.isNil(value)",
    "description": "Checks if `value` is `null` or `undefined`.",
    "since": "4.0.0"
  },
  "isnull": {
    "name": "isNull",
    "command": "_.isNull(value)",
    "description": "Checks if `value` is `null`.",
    "since": "0.1.0"
  },
  "isnumber": {
    "name": "isNumber",
    "command": "_.isNumber(value)",
    "description": "Checks if `value` is classified as a `Number` primitive or object. Note: To exclude `Infinity`, `-Infinity`, and `NaN`, which are classified as numbers, use the `_.isFinite` method.",
    "since": "0.1.0"
  },
  "isobject": {
    "name": "isObject",
    "command": "_.isObject(value)",
    "description": "Checks if `value` is the language type of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)",
    "since": "0.1.0"
  },
  "isobjectlike": {
    "name": "isObjectLike",
    "command": "_.isObjectLike(value)",
    "description": "Checks if `value` is object-like. A value is object-like if it's not `null` and has a `typeof` result of \"object\".",
    "since": "4.0.0"
  },
  "isplainobject": {
    "name": "isPlainObject",
    "command": "_.isPlainObject(value)",
    "description": "Checks if `value` is a plain object, that is, an object created by the `Object` constructor or one with a `[[Prototype]]` of `null`.",
    "since": "0.8.0"
  },
  "isregexp": {
    "name": "isRegExp",
    "command": "_.isRegExp(value)",
    "description": "Checks if `value` is classified as a `RegExp` object.",
    "since": "0.1.0"
  },
  "issafeinteger": {
    "name": "isSafeInteger",
    "command": "_.isSafeInteger(value)",
    "description": "Checks if `value` is a safe integer. An integer is safe if it's an IEEE-754 double precision number which isn't the result of a rounded unsafe integer. Note: This method is based on `Number.isSafeInteger`.",
    "since": "4.0.0"
  },
  "isset": {
    "name": "isSet",
    "command": "_.isSet(value)",
    "description": "Checks if `value` is classified as a `Set` object.",
    "since": "4.3.0"
  },
  "isstring": {
    "name": "isString",
    "command": "_.isString(value)",
    "description": "Checks if `value` is classified as a `String` primitive or object.",
    "since": "0.1.0"
  },
  "issymbol": {
    "name": "isSymbol",
    "command": "_.isSymbol(value)",
    "description": "Checks if `value` is classified as a `Symbol` primitive or object.",
    "since": "4.0.0"
  },
  "istypedarray": {
    "name": "isTypedArray",
    "command": "_.isTypedArray(value)",
    "description": "Checks if `value` is classified as a typed array.",
    "since": "3.0.0"
  },
  "isundefined": {
    "name": "isUndefined",
    "command": "_.isUndefined(value)",
    "description": "Checks if `value` is `undefined`.",
    "since": "0.1.0"
  },
  "isweakmap": {
    "name": "isWeakMap",
    "command": "_.isWeakMap(value)",
    "description": "Checks if `value` is classified as a `WeakMap` object.",
    "since": "4.3.0"
  },
  "isweakset": {
    "name": "isWeakSet",
    "command": "_.isWeakSet(value)",
    "description": "Checks if `value` is classified as a `WeakSet` object.",
    "since": "4.3.0"
  },
  "lt": {
    "name": "lt",
    "command": "_.lt(value, other)",
    "description": "Checks if `value` is less than `other`.",
    "since": "3.9.0"
  },
  "lte": {
    "name": "lte",
    "command": "_.lte(value, other)",
    "description": "Checks if `value` is less than or equal to `other`.",
    "since": "3.9.0"
  },
  "toarray": {
    "name": "toArray",
    "command": "_.toArray(value)",
    "description": "Converts `value` to an array.",
    "since": "0.1.0"
  },
  "tofinite": {
    "name": "toFinite",
    "command": "_.toFinite(value)",
    "description": "Converts `value` to a finite number.",
    "since": "4.12.0"
  },
  "tointeger": {
    "name": "toInteger",
    "command": "_.toInteger(value)",
    "description": "Converts `value` to an integer. Note: This method is loosely based on `ToInteger`.",
    "since": "4.0.0"
  },
  "tolength": {
    "name": "toLength",
    "command": "_.toLength(value)",
    "description": "Converts `value` to an integer suitable for use as the length of an array-like object. Note: This method is based on `ToLength`.",
    "since": "4.0.0"
  },
  "tonumber": {
    "name": "toNumber",
    "command": "_.toNumber(value)",
    "description": "Converts `value` to a number.",
    "since": "4.0.0"
  },
  "toplainobject": {
    "name": "toPlainObject",
    "command": "_.toPlainObject(value)",
    "description": "Converts `value` to a plain object flattening inherited enumerable string keyed properties of `value` to own properties of the plain object.",
    "since": "3.0.0"
  },
  "tosafeinteger": {
    "name": "toSafeInteger",
    "command": "_.toSafeInteger(value)",
    "description": "Converts `value` to a safe integer. A safe integer can be compared and represented correctly.",
    "since": "4.0.0"
  },
  "tostring": {
    "name": "toString",
    "command": "_.toString(value)",
    "description": "Converts `value` to a string. An empty string is returned for `null` and `undefined` values. The sign of `-0` is preserved.",
    "since": "4.0.0"
  },
  "add": {
    "name": "add",
    "command": "_.add(augend, addend)",
    "description": "Adds two numbers.",
    "since": "3.4.0"
  },
  "ceil": {
    "name": "ceil",
    "command": "_.ceil(number, [precision=0])",
    "description": "Computes `number` rounded up to `precision`.",
    "since": "3.10.0"
  },
  "divide": {
    "name": "divide",
    "command": "_.divide(dividend, divisor)",
    "description": "Divide two numbers.",
    "since": "4.7.0"
  },
  "floor": {
    "name": "floor",
    "command": "_.floor(number, [precision=0])",
    "description": "Computes `number` rounded down to `precision`.",
    "since": "3.10.0"
  },
  "max": {
    "name": "max",
    "command": "_.max(array)",
    "description": "Computes the maximum value of `array`. If `array` is empty or falsey, `undefined` is returned.",
    "since": "0.1.0"
  },
  "maxby": {
    "name": "maxBy",
    "command": "_.maxBy(array, [iteratee=_.identity])",
    "description": "This method is like `_.max` except that it accepts `iteratee` which is invoked for each element in `array` to generate the criterion by which the value is ranked. The iteratee is invoked with one argument: (value).",
    "since": "4.0.0"
  },
  "mean": {
    "name": "mean",
    "command": "_.mean(array)",
    "description": "Computes the mean of the values in `array`.",
    "since": "4.0.0"
  },
  "meanby": {
    "name": "meanBy",
    "command": "_.meanBy(array, [iteratee=_.identity])",
    "description": "This method is like `_.mean` except that it accepts `iteratee` which is invoked for each element in `array` to generate the value to be averaged. The iteratee is invoked with one argument: (value).",
    "since": "4.7.0"
  },
  "min": {
    "name": "min",
    "command": "_.min(array)",
    "description": "Computes the minimum value of `array`. If `array` is empty or falsey, `undefined` is returned.",
    "since": "0.1.0"
  },
  "minby": {
    "name": "minBy",
    "command": "_.minBy(array, [iteratee=_.identity])",
    "description": "This method is like `_.min` except that it accepts `iteratee` which is invoked for each element in `array` to generate the criterion by which the value is ranked. The iteratee is invoked with one argument: (value).",
    "since": "4.0.0"
  },
  "multiply": {
    "name": "multiply",
    "command": "_.multiply(multiplier, multiplicand)",
    "description": "Multiply two numbers.",
    "since": "4.7.0"
  },
  "round": {
    "name": "round",
    "command": "_.round(number, [precision=0])",
    "description": "Computes `number` rounded to `precision`.",
    "since": "3.10.0"
  },
  "subtract": {
    "name": "subtract",
    "command": "_.subtract(minuend, subtrahend)",
    "description": "Subtract two numbers.",
    "since": "4.0.0"
  },
  "sum": {
    "name": "sum",
    "command": "_.sum(array)",
    "description": "Computes the sum of the values in `array`.",
    "since": "3.4.0"
  },
  "sumby": {
    "name": "sumBy",
    "command": "_.sumBy(array, [iteratee=_.identity])",
    "description": "This method is like `_.sum` except that it accepts `iteratee` which is invoked for each element in `array` to generate the value to be summed. The iteratee is invoked with one argument: (value).",
    "since": "4.0.0"
  },
  "clamp": {
    "name": "clamp",
    "command": "_.clamp(number, [lower], upper)",
    "description": "Clamps `number` within the inclusive `lower` and `upper` bounds.",
    "since": "4.0.0"
  },
  "inrange": {
    "name": "inRange",
    "command": "_.inRange(number, [start=0], end)",
    "description": "Checks if `n` is between `start` and up to, but not including, `end`. If `end` is not specified, it's set to `start` with `start` then set to `0`. If `start` is greater than `end` the params are swapped to support negative ranges.",
    "since": "3.3.0"
  },
  "random": {
    "name": "random",
    "command": "_.random([lower=0], [upper=1], [floating])",
    "description": "Produces a random number between the inclusive `lower` and `upper` bounds. If only one argument is provided a number between `0` and the given number is returned. If `floating` is `true`, or either `lower` or `upper` are floats, a floating-point number is returned instead of an integer. Note: JavaScript follows the IEEE-754 standard for resolving floating-point values which can produce unexpected results.",
    "since": "0.7.0"
  },
  "assign": {
    "name": "assign",
    "command": "_.assign(object, [sources])",
    "description": "Assigns own enumerable string keyed properties of source objects to the destination object. Source objects are applied from left to right. Subsequent sources overwrite property assignments of previous sources. Note: This method mutates `object` and is loosely based on `Object.assign`.",
    "since": "0.10.0"
  },
  "assignin": {
    "name": "assignIn",
    "command": "_.assignIn(object, [sources])",
    "description": "This method is like `_.assign` except that it iterates over own and inherited source properties. Note: This method mutates `object`.",
    "since": "4.0.0"
  },
  "assigninwith": {
    "name": "assignInWith",
    "command": "_.assignInWith(object, sources, [customizer])",
    "description": "This method is like `_.assignIn` except that it accepts `customizer` which is invoked to produce the assigned values. If `customizer` returns `undefined`, assignment is handled by the method instead. The `customizer` is invoked with five arguments: (objValue, srcValue, key, object, source). Note: This method mutates `object`.",
    "since": "4.0.0"
  },
  "assignwith": {
    "name": "assignWith",
    "command": "_.assignWith(object, sources, [customizer])",
    "description": "This method is like `_.assign` except that it accepts `customizer` which is invoked to produce the assigned values. If `customizer` returns `undefined`, assignment is handled by the method instead. The `customizer` is invoked with five arguments: (objValue, srcValue, key, object, source). Note: This method mutates `object`.",
    "since": "4.0.0"
  },
  "at": {
    "name": "at",
    "command": "_.at(object, [paths])",
    "description": "Creates an array of values corresponding to `paths` of `object`.",
    "since": "1.0.0"
  },
  "create": {
    "name": "create",
    "command": "_.create(prototype, [properties])",
    "description": "Creates an object that inherits from the `prototype` object. If a `properties` object is given, its own enumerable string keyed properties are assigned to the created object.",
    "since": "2.3.0"
  },
  "defaults": {
    "name": "defaults",
    "command": "_.defaults(object, [sources])",
    "description": "Assigns own and inherited enumerable string keyed properties of source objects to the destination object for all destination properties that resolve to `undefined`. Source objects are applied from left to right. Once a property is set, additional values of the same property are ignored. Note: This method mutates `object`.",
    "since": "0.1.0"
  },
  "defaultsdeep": {
    "name": "defaultsDeep",
    "command": "_.defaultsDeep(object, [sources])",
    "description": "This method is like `_.defaults` except that it recursively assigns default properties. Note: This method mutates `object`.",
    "since": "3.10.0"
  },
  "findkey": {
    "name": "findKey",
    "command": "_.findKey(object, [predicate=_.identity])",
    "description": "This method is like `_.find` except that it returns the key of the first element `predicate` returns truthy for instead of the element itself.",
    "since": "1.1.0"
  },
  "findlastkey": {
    "name": "findLastKey",
    "command": "_.findLastKey(object, [predicate=_.identity])",
    "description": "This method is like `_.findKey` except that it iterates over elements of a collection in the opposite order.",
    "since": "2.0.0"
  },
  "forin": {
    "name": "forIn",
    "command": "_.forIn(object, [iteratee=_.identity])",
    "description": "Iterates over own and inherited enumerable string keyed properties of an object and invokes `iteratee` for each property. The iteratee is invoked with three arguments: (value, key, object). Iteratee functions may exit iteration early by explicitly returning `false`.",
    "since": "0.3.0"
  },
  "forinright": {
    "name": "forInRight",
    "command": "_.forInRight(object, [iteratee=_.identity])",
    "description": "This method is like `_.forIn` except that it iterates over properties of `object` in the opposite order.",
    "since": "2.0.0"
  },
  "forown": {
    "name": "forOwn",
    "command": "_.forOwn(object, [iteratee=_.identity])",
    "description": "Iterates over own enumerable string keyed properties of an object and invokes `iteratee` for each property. The iteratee is invoked with three arguments: (value, key, object). Iteratee functions may exit iteration early by explicitly returning `false`.",
    "since": "0.3.0"
  },
  "forownright": {
    "name": "forOwnRight",
    "command": "_.forOwnRight(object, [iteratee=_.identity])",
    "description": "This method is like `_.forOwn` except that it iterates over properties of `object` in the opposite order.",
    "since": "2.0.0"
  },
  "functions": {
    "name": "functions",
    "command": "_.functions(object)",
    "description": "Creates an array of function property names from own enumerable properties of `object`.",
    "since": "0.1.0"
  },
  "functionsin": {
    "name": "functionsIn",
    "command": "_.functionsIn(object)",
    "description": "Creates an array of function property names from own and inherited enumerable properties of `object`.",
    "since": "4.0.0"
  },
  "get": {
    "name": "get",
    "command": "_.get(object, path, [defaultValue])",
    "description": "Gets the value at `path` of `object`. If the resolved value is `undefined`, the `defaultValue` is returned in its place.",
    "since": "3.7.0"
  },
  "has": {
    "name": "has",
    "command": "_.has(object, path)",
    "description": "Checks if `path` is a direct property of `object`.",
    "since": "0.1.0"
  },
  "hasin": {
    "name": "hasIn",
    "command": "_.hasIn(object, path)",
    "description": "Checks if `path` is a direct or inherited property of `object`.",
    "since": "4.0.0"
  },
  "invert": {
    "name": "invert",
    "command": "_.invert(object)",
    "description": "Creates an object composed of the inverted keys and values of `object`. If `object` contains duplicate values, subsequent values overwrite property assignments of previous values.",
    "since": "0.7.0"
  },
  "invertby": {
    "name": "invertBy",
    "command": "_.invertBy(object, [iteratee=_.identity])",
    "description": "This method is like `_.invert` except that the inverted object is generated from the results of running each element of `object` thru `iteratee`. The corresponding inverted value of each inverted key is an array of keys responsible for generating the inverted value. The iteratee is invoked with one argument: (value).",
    "since": "4.1.0"
  },
  "invoke": {
    "name": "invoke",
    "command": "_.invoke(object, path, [args])",
    "description": "Invokes the method at `path` of `object`.",
    "since": "4.0.0"
  },
  "keys": {
    "name": "keys",
    "command": "_.keys(object)",
    "description": "Creates an array of the own enumerable property names of `object`. Note: Non-object values are coerced to objects. See the ES spec for more details.",
    "since": "0.1.0"
  },
  "keysin": {
    "name": "keysIn",
    "command": "_.keysIn(object)",
    "description": "Creates an array of the own and inherited enumerable property names of `object`. Note: Non-object values are coerced to objects.",
    "since": "3.0.0"
  },
  "mapkeys": {
    "name": "mapKeys",
    "command": "_.mapKeys(object, [iteratee=_.identity])",
    "description": "The opposite of `_.mapValues`; this method creates an object with the same values as `object` and keys generated by running each own enumerable string keyed property of `object` thru `iteratee`. The iteratee is invoked with three arguments: (value, key, object).",
    "since": "3.8.0"
  },
  "mapvalues": {
    "name": "mapValues",
    "command": "_.mapValues(object, [iteratee=_.identity])",
    "description": "Creates an object with the same keys as `object` and values generated by running each own enumerable string keyed property of `object` thru `iteratee`. The iteratee is invoked with three arguments: (value, key, object).",
    "since": "2.4.0"
  },
  "merge": {
    "name": "merge",
    "command": "_.merge(object, [sources])",
    "description": "This method is like `_.assign` except that it recursively merges own and inherited enumerable string keyed properties of source objects into the destination object. Source properties that resolve to `undefined` are skipped if a destination value exists. Array and plain object properties are merged recursively. Other objects and value types are overridden by assignment. Source objects are applied from left to right. Subsequent sources overwrite property assignments of previous sources. Note: This method mutates `object`.",
    "since": "0.5.0"
  },
  "mergewith": {
    "name": "mergeWith",
    "command": "_.mergeWith(object, sources, customizer)",
    "description": "This method is like `_.merge` except that it accepts `customizer` which is invoked to produce the merged values of the destination and source properties. If `customizer` returns `undefined`, merging is handled by the method instead. The `customizer` is invoked with six arguments: (objValue, srcValue, key, object, source, stack). Note: This method mutates `object`.",
    "since": "4.0.0"
  },
  "omit": {
    "name": "omit",
    "command": "_.omit(object, [paths])",
    "description": "The opposite of `_.pick`; this method creates an object composed of the own and inherited enumerable property paths of `object` that are not omitted. Note: This method is considerably slower than `_.pick`.",
    "since": "0.1.0"
  },
  "omitby": {
    "name": "omitBy",
    "command": "_.omitBy(object, [predicate=_.identity])",
    "description": "The opposite of `_.pickBy`; this method creates an object composed of the own and inherited enumerable string keyed properties of `object` that `predicate` doesn't return truthy for. The predicate is invoked with two arguments: (value, key).",
    "since": "4.0.0"
  },
  "pick": {
    "name": "pick",
    "command": "_.pick(object, [paths])",
    "description": "Creates an object composed of the picked `object` properties.",
    "since": "0.1.0"
  },
  "pickby": {
    "name": "pickBy",
    "command": "_.pickBy(object, [predicate=_.identity])",
    "description": "Creates an object composed of the `object` properties `predicate` returns truthy for. The predicate is invoked with two arguments: (value, key).",
    "since": "4.0.0"
  },
  "result": {
    "name": "result",
    "command": "_.result(object, path, [defaultValue])",
    "description": "This method is like `_.get` except that if the resolved value is a function it's invoked with the `this` binding of its parent object and its result is returned.",
    "since": "0.1.0"
  },
  "set": {
    "name": "set",
    "command": "_.set(object, path, value)",
    "description": "Sets the value at `path` of `object`. If a portion of `path` doesn't exist, it's created. Arrays are created for missing index properties while objects are created for all other missing properties. Use `_.setWith` to customize `path` creation. Note: This method mutates `object`.",
    "since": "3.7.0"
  },
  "setwith": {
    "name": "setWith",
    "command": "_.setWith(object, path, value, [customizer])",
    "description": "This method is like `_.set` except that it accepts `customizer` which is invoked to produce the objects of `path`. If `customizer` returns `undefined` path creation is handled by the method instead. The `customizer` is invoked with three arguments: (nsValue, key, nsObject). Note: This method mutates `object`.",
    "since": "4.0.0"
  },
  "topairs": {
    "name": "toPairs",
    "command": "_.toPairs(object)",
    "description": "Creates an array of own enumerable string keyed-value pairs for `object` which can be consumed by `_.fromPairs`. If `object` is a map or set, its entries are returned.",
    "since": "4.0.0"
  },
  "topairsin": {
    "name": "toPairsIn",
    "command": "_.toPairsIn(object)",
    "description": "Creates an array of own and inherited enumerable string keyed-value pairs for `object` which can be consumed by `_.fromPairs`. If `object` is a map or set, its entries are returned.",
    "since": "4.0.0"
  },
  "transform": {
    "name": "transform",
    "command": "_.transform(object, [iteratee=_.identity], [accumulator])",
    "description": "An alternative to `_.reduce`; this method transforms `object` to a new `accumulator` object which is the result of running each of its own enumerable string keyed properties thru `iteratee`, with each invocation potentially mutating the `accumulator` object. If `accumulator` is not provided, a new object with the same `[[Prototype]]` will be used. The iteratee is invoked with four arguments: (accumulator, value, key, object). Iteratee functions may exit iteration early by explicitly returning `false`.",
    "since": "1.3.0"
  },
  "unset": {
    "name": "unset",
    "command": "_.unset(object, path)",
    "description": "Removes the property at `path` of `object`. Note: This method mutates `object`.",
    "since": "4.0.0"
  },
  "update": {
    "name": "update",
    "command": "_.update(object, path, updater)",
    "description": "This method is like `_.set` except that accepts `updater` to produce the value to set. Use `_.updateWith` to customize `path` creation. The `updater` is invoked with one argument: (value). Note: This method mutates `object`.",
    "since": "4.6.0"
  },
  "updatewith": {
    "name": "updateWith",
    "command": "_.updateWith(object, path, updater, [customizer])",
    "description": "This method is like `_.update` except that it accepts `customizer` which is invoked to produce the objects of `path`. If `customizer` returns `undefined` path creation is handled by the method instead. The `customizer` is invoked with three arguments: (nsValue, key, nsObject). Note: This method mutates `object`.",
    "since": "4.6.0"
  },
  "values": {
    "name": "values",
    "command": "_.values(object)",
    "description": "Creates an array of the own enumerable string keyed property values of `object`. Note: Non-object values are coerced to objects.",
    "since": "0.1.0"
  },
  "valuesin": {
    "name": "valuesIn",
    "command": "_.valuesIn(object)",
    "description": "Creates an array of the own and inherited enumerable string keyed property values of `object`. Note: Non-object values are coerced to objects.",
    "since": "3.0.0"
  },
  "_": {
    "name": "_",
    "dontShow": true
  },
  "chain": {
    "name": "chain",
    "command": "_.chain(value)",
    "description": "Creates a `lodash` wrapper instance that wraps `value` with explicit method chain sequences enabled. The result of such sequences must be unwrapped with `_#value`.",
    "since": "1.3.0"
  },
  "tap": {
    "name": "tap",
    "command": "_.tap(value, interceptor)",
    "description": "This method invokes `interceptor` and returns `value`. The interceptor is invoked with one argument; (value). The purpose of this method is to \"tap into\" a method chain sequence in order to modify intermediate results.",
    "since": "0.1.0"
  },
  "thru": {
    "name": "thru",
    "command": "_.thru(value, interceptor)",
    "description": "This method is like `_.tap` except that it returns the result of `interceptor`. The purpose of this method is to \"pass thru\" values replacing intermediate results in a method chain sequence.",
    "since": "3.0.0"
  },
  "prototype-symbol-iterator": {
    "name": "prototype-Symbol-iterator",
    "command": "_.prototype[Symbol.iterator]()",
    "description": "Enables the wrapper to be iterable.",
    "since": "4.0.0"
  },
  "prototype-at": {
    "name": "prototype-at",
    "command": "_.prototype.at([paths])",
    "description": "This method is the wrapper version of `_.at`.",
    "since": "1.0.0"
  },
  "prototype-chain": {
    "name": "prototype-chain",
    "command": "_.prototype.chain()",
    "description": "Creates a `lodash` wrapper instance with explicit method chain sequences enabled.",
    "since": "0.1.0"
  },
  "prototype-commit": {
    "name": "prototype-commit",
    "command": "_.prototype.commit()",
    "description": "Executes the chain sequence and returns the wrapped result.",
    "since": "3.2.0"
  },
  "prototype-next": {
    "name": "prototype-next",
    "command": "_.prototype.next()",
    "description": "Gets the next value on a wrapped object following the iterator protocol.",
    "since": "4.0.0"
  },
  "prototype-plant": {
    "name": "prototype-plant",
    "command": "_.prototype.plant(value)",
    "description": "Creates a clone of the chain sequence planting `value` as the wrapped value.",
    "since": "3.2.0"
  },
  "prototype-reverse": {
    "name": "prototype-reverse",
    "command": "_.prototype.reverse()",
    "description": "This method is the wrapper version of `_.reverse`. Note: This method mutates the wrapped array.",
    "since": "0.1.0"
  },
  "prototype-value": {
    "name": "prototype-value",
    "command": "_.prototype.value()",
    "description": "Executes the chain sequence to resolve the unwrapped value.",
    "since": "0.1.0"
  },
  "camelcase": {
    "name": "camelCase",
    "command": "_.camelCase([string=''])",
    "description": "Converts `string` to camel case.",
    "since": "3.0.0"
  },
  "capitalize": {
    "name": "capitalize",
    "command": "_.capitalize([string=''])",
    "description": "Converts the first character of `string` to upper case and the remaining to lower case.",
    "since": "3.0.0"
  },
  "deburr": {
    "name": "deburr",
    "command": "_.deburr([string=''])",
    "description": "Deburrs `string` by converting Latin-1 Supplement and Latin Extended-A letters to basic Latin letters and removing combining diacritical marks.",
    "since": "3.0.0"
  },
  "endswith": {
    "name": "endsWith",
    "command": "_.endsWith([string=''], [target], [position=string.length])",
    "description": "Checks if `string` ends with the given target string.",
    "since": "3.0.0"
  },
  "escape": {
    "name": "escape",
    "command": "_.escape([string=''])",
    "description": "Converts the characters \"&\", \"<\", \">\", '\"', and \"'\" in `string` to their corresponding HTML entities. Note: No other characters are escaped. To escape additional characters use a third-party library like he. Though the \">\" character is escaped for symmetry, characters like \">\" and \"/\" don't need escaping in HTML and have no special meaning unless they're part of a tag or unquoted attribute value. See Mathias Bynens's article (under \"semi-related fun fact\") for more details. When working with HTML you should always quote attribute values to reduce XSS vectors.",
    "since": "0.1.0"
  },
  "escaperegexp": {
    "name": "escapeRegExp",
    "command": "_.escapeRegExp([string=''])",
    "description": "Escapes the `RegExp` special characters \"^\", \"$\", \"\", \".\", \"*\", \"+\", \"?\", \"(\", \")\", \"[\", \"]\", \"{\", \"}\", and \"|\" in `string`.",
    "since": "3.0.0"
  },
  "kebabcase": {
    "name": "kebabCase",
    "command": "_.kebabCase([string=''])",
    "description": "Converts `string` to kebab case.",
    "since": "3.0.0"
  },
  "lowercase": {
    "name": "lowerCase",
    "command": "_.lowerCase([string=''])",
    "description": "Converts `string`, as space separated words, to lower case.",
    "since": "4.0.0"
  },
  "lowerfirst": {
    "name": "lowerFirst",
    "command": "_.lowerFirst([string=''])",
    "description": "Converts the first character of `string` to lower case.",
    "since": "4.0.0"
  },
  "pad": {
    "name": "pad",
    "command": "_.pad([string=''], [length=0], [chars=' '])",
    "description": "Pads `string` on the left and right sides if it's shorter than `length`. Padding characters are truncated if they can't be evenly divided by `length`.",
    "since": "3.0.0"
  },
  "padend": {
    "name": "padEnd",
    "command": "_.padEnd([string=''], [length=0], [chars=' '])",
    "description": "Pads `string` on the right side if it's shorter than `length`. Padding characters are truncated if they exceed `length`.",
    "since": "4.0.0"
  },
  "padstart": {
    "name": "padStart",
    "command": "_.padStart([string=''], [length=0], [chars=' '])",
    "description": "Pads `string` on the left side if it's shorter than `length`. Padding characters are truncated if they exceed `length`.",
    "since": "4.0.0"
  },
  "parseint": {
    "name": "parseInt",
    "command": "_.parseInt(string, [radix=10])",
    "description": "Converts `string` to an integer of the specified radix. If `radix` is `undefined` or `0`, a `radix` of `10` is used unless `value` is a hexadecimal, in which case a `radix` of `16` is used. Note: This method aligns with the ES5 implementation of `parseInt`.",
    "since": "1.1.0"
  },
  "repeat": {
    "name": "repeat",
    "command": "_.repeat([string=''], [n=1])",
    "description": "Repeats the given string `n` times.",
    "since": "3.0.0"
  },
  "replace": {
    "name": "replace",
    "command": "_.replace([string=''], pattern, replacement)",
    "description": "Replaces matches for `pattern` in `string` with `replacement`. Note: This method is based on `String#replace`.",
    "since": "4.0.0"
  },
  "snakecase": {
    "name": "snakeCase",
    "command": "_.snakeCase([string=''])",
    "description": "Converts `string` to snake case.",
    "since": "3.0.0"
  },
  "split": {
    "name": "split",
    "command": "_.split([string=''], separator, [limit])",
    "description": "Splits `string` by `separator`. Note: This method is based on `String#split`.",
    "since": "4.0.0"
  },
  "startcase": {
    "name": "startCase",
    "command": "_.startCase([string=''])",
    "description": "Converts `string` to start case.",
    "since": "3.1.0"
  },
  "startswith": {
    "name": "startsWith",
    "command": "_.startsWith([string=''], [target], [position=0])",
    "description": "Checks if `string` starts with the given target string.",
    "since": "3.0.0"
  },
  "template": {
    "name": "template",
    "command": "_.template([string=''], [options={}])",
    "description": "Creates a compiled template function that can interpolate data properties in \"interpolate\" delimiters, HTML-escape interpolated data properties in \"escape\" delimiters, and execute JavaScript in \"evaluate\" delimiters. Data properties may be accessed as free variables in the template. If a setting object is given, it takes precedence over `_.templateSettings` values. Note: In the development build `_.template` utilizes sourceURLs for easier debugging. For more information on precompiling templates see lodash's custom builds documentation. For more information on Chrome extension sandboxes see Chrome's extensions documentation.",
    "since": "0.1.0"
  },
  "tolower": {
    "name": "toLower",
    "command": "_.toLower([string=''])",
    "description": "Converts `string`, as a whole, to lower case just like String#toLowerCase.",
    "since": "4.0.0"
  },
  "toupper": {
    "name": "toUpper",
    "command": "_.toUpper([string=''])",
    "description": "Converts `string`, as a whole, to upper case just like String#toUpperCase.",
    "since": "4.0.0"
  },
  "trim": {
    "name": "trim",
    "command": "_.trim([string=''], [chars=whitespace])",
    "description": "Removes leading and trailing whitespace or specified characters from `string`.",
    "since": "3.0.0"
  },
  "trimend": {
    "name": "trimEnd",
    "command": "_.trimEnd([string=''], [chars=whitespace])",
    "description": "Removes trailing whitespace or specified characters from `string`.",
    "since": "4.0.0"
  },
  "trimstart": {
    "name": "trimStart",
    "command": "_.trimStart([string=''], [chars=whitespace])",
    "description": "Removes leading whitespace or specified characters from `string`.",
    "since": "4.0.0"
  },
  "truncate": {
    "name": "truncate",
    "command": "_.truncate([string=''], [options={}])",
    "description": "Truncates `string` if it's longer than the given maximum string length. The last characters of the truncated string are replaced with the omission string which defaults to \"...\".",
    "since": "4.0.0"
  },
  "unescape": {
    "name": "unescape",
    "command": "_.unescape([string=''])",
    "description": "The inverse of `_.escape`; this method converts the HTML entities `&amp;`, `&lt;`, `&gt;`, `&quot;`, and `&#39;` in `string` to their corresponding characters. Note: No other HTML entities are unescaped. To unescape additional HTML entities use a third-party library like he.",
    "since": "0.6.0"
  },
  "uppercase": {
    "name": "upperCase",
    "command": "_.upperCase([string=''])",
    "description": "Converts `string`, as space separated words, to upper case.",
    "since": "4.0.0"
  },
  "upperfirst": {
    "name": "upperFirst",
    "command": "_.upperFirst([string=''])",
    "description": "Converts the first character of `string` to upper case.",
    "since": "4.0.0"
  },
  "words": {
    "name": "words",
    "command": "_.words([string=''], [pattern])",
    "description": "Splits `string` into an array of its words.",
    "since": "3.0.0"
  },
  "attempt": {
    "name": "attempt",
    "command": "_.attempt(func, [args])",
    "description": "Attempts to invoke `func`, returning either the result or the caught error object. Any additional arguments are provided to `func` when it's invoked.",
    "since": "3.0.0"
  },
  "bindall": {
    "name": "bindAll",
    "command": "_.bindAll(object, methodNames)",
    "description": "Binds methods of an object to the object itself, overwriting the existing method. Note: This method doesn't set the \"length\" property of bound functions.",
    "since": "0.1.0"
  },
  "cond": {
    "name": "cond",
    "command": "_.cond(pairs)",
    "description": "Creates a function that iterates over `pairs` and invokes the corresponding function of the first predicate to return truthy. The predicate-function pairs are invoked with the `this` binding and arguments of the created function.",
    "since": "4.0.0"
  },
  "conforms": {
    "name": "conforms",
    "command": "_.conforms(source)",
    "description": "Creates a function that invokes the predicate properties of `source` with the corresponding property values of a given object, returning `true` if all predicates return truthy, else `false`. Note: The created function is equivalent to `_.conformsTo` with `source` partially applied.",
    "since": "4.0.0"
  },
  "constant": {
    "name": "constant",
    "command": "_.constant(value)",
    "description": "Creates a function that returns `value`.",
    "since": "2.4.0"
  },
  "defaultto": {
    "name": "defaultTo",
    "command": "_.defaultTo(value, defaultValue)",
    "description": "Checks `value` to determine whether a default value should be returned in its place. The `defaultValue` is returned if `value` is `NaN`, `null`, or `undefined`.",
    "since": "4.14.0"
  },
  "flow": {
    "name": "flow",
    "command": "_.flow([funcs])",
    "description": "Creates a function that returns the result of invoking the given functions with the `this` binding of the created function, where each successive invocation is supplied the return value of the previous.",
    "since": "3.0.0"
  },
  "flowright": {
    "name": "flowRight",
    "command": "_.flowRight([funcs])",
    "description": "This method is like `_.flow` except that it creates a function that invokes the given functions from right to left.",
    "since": "3.0.0"
  },
  "identity": {
    "name": "identity",
    "command": "_.identity(value)",
    "description": "This method returns the first argument it receives.",
    "since": "0.1.0"
  },
  "iteratee": {
    "name": "iteratee",
    "command": "_.iteratee([func=_.identity])",
    "description": "Creates a function that invokes `func` with the arguments of the created function. If `func` is a property name, the created function returns the property value for a given element. If `func` is an array or object, the created function returns `true` for elements that contain the equivalent source properties, otherwise it returns `false`.",
    "since": "4.0.0"
  },
  "matches": {
    "name": "matches",
    "command": "_.matches(source)",
    "description": "Creates a function that performs a partial deep comparison between a given object and `source`, returning `true` if the given object has equivalent property values, else `false`. Note: The created function is equivalent to `_.isMatch` with `source` partially applied. Partial comparisons will match empty array and empty object `source` values against any array or object value, respectively. See `_.isEqual` for a list of supported value comparisons.",
    "since": "3.0.0"
  },
  "matchesproperty": {
    "name": "matchesProperty",
    "command": "_.matchesProperty(path, srcValue)",
    "description": "Creates a function that performs a partial deep comparison between the value at `path` of a given object to `srcValue`, returning `true` if the object value is equivalent, else `false`. Note: Partial comparisons will match empty array and empty object `srcValue` values against any array or object value, respectively. See `_.isEqual` for a list of supported value comparisons.",
    "since": "3.2.0"
  },
  "method": {
    "name": "method",
    "command": "_.method(path, [args])",
    "description": "Creates a function that invokes the method at `path` of a given object. Any additional arguments are provided to the invoked method.",
    "since": "3.7.0"
  },
  "methodof": {
    "name": "methodOf",
    "command": "_.methodOf(object, [args])",
    "description": "The opposite of `_.method`; this method creates a function that invokes the method at a given path of `object`. Any additional arguments are provided to the invoked method.",
    "since": "3.7.0"
  },
  "mixin": {
    "name": "mixin",
    "command": "_.mixin([object=lodash], source, [options={}])",
    "description": "Adds all own enumerable string keyed function properties of a source object to the destination object. If `object` is a function, then methods are added to its prototype as well. Note: Use `_.runInContext` to create a pristine `lodash` function to avoid conflicts caused by modifying the original.",
    "since": "0.1.0"
  },
  "noconflict": {
    "name": "noConflict",
    "command": "_.noConflict()",
    "description": "Reverts the `_` variable to its previous value and returns a reference to the `lodash` function.",
    "since": "0.1.0"
  },
  "noop": {
    "name": "noop",
    "command": "_.noop()",
    "description": "This method returns `undefined`.",
    "since": "2.3.0"
  },
  "ntharg": {
    "name": "nthArg",
    "command": "_.nthArg([n=0])",
    "description": "Creates a function that gets the argument at index `n`. If `n` is negative, the nth argument from the end is returned.",
    "since": "4.0.0"
  },
  "over": {
    "name": "over",
    "command": "_.over([iteratees=[_.identity]])",
    "description": "Creates a function that invokes `iteratees` with the arguments it receives and returns their results.",
    "since": "4.0.0"
  },
  "overevery": {
    "name": "overEvery",
    "command": "_.overEvery([predicates=[_.identity]])",
    "description": "Creates a function that checks if all of the `predicates` return truthy when invoked with the arguments it receives.",
    "since": "4.0.0"
  },
  "oversome": {
    "name": "overSome",
    "command": "_.overSome([predicates=[_.identity]])",
    "description": "Creates a function that checks if any of the `predicates` return truthy when invoked with the arguments it receives.",
    "since": "4.0.0"
  },
  "property": {
    "name": "property",
    "command": "_.property(path)",
    "description": "Creates a function that returns the value at `path` of a given object.",
    "since": "2.4.0"
  },
  "propertyof": {
    "name": "propertyOf",
    "command": "_.propertyOf(object)",
    "description": "The opposite of `_.property`; this method creates a function that returns the value at a given path of `object`.",
    "since": "3.0.0"
  },
  "range": {
    "name": "range",
    "command": "_.range([start=0], end, [step=1])",
    "description": "Creates an array of numbers (positive and/or negative) progressing from `start` up to, but not including, `end`. A step of `-1` is used if a negative `start` is specified without an `end` or `step`. If `end` is not specified, it's set to `start` with `start` then set to `0`. Note: JavaScript follows the IEEE-754 standard for resolving floating-point values which can produce unexpected results.",
    "since": "0.1.0"
  },
  "rangeright": {
    "name": "rangeRight",
    "command": "_.rangeRight([start=0], end, [step=1])",
    "description": "This method is like `_.range` except that it populates values in descending order.",
    "since": "4.0.0"
  },
  "runincontext": {
    "name": "runInContext",
    "command": "_.runInContext([context=root])",
    "description": "Create a new pristine `lodash` function using the `context` object.",
    "since": "1.1.0"
  },
  "stubarray": {
    "name": "stubArray",
    "command": "_.stubArray()",
    "description": "This method returns a new empty array.",
    "since": "4.13.0"
  },
  "stubfalse": {
    "name": "stubFalse",
    "command": "_.stubFalse()",
    "description": "This method returns `false`.",
    "since": "4.13.0"
  },
  "stubobject": {
    "name": "stubObject",
    "command": "_.stubObject()",
    "description": "This method returns a new empty object.",
    "since": "4.13.0"
  },
  "stubstring": {
    "name": "stubString",
    "command": "_.stubString()",
    "description": "This method returns an empty string.",
    "since": "4.13.0"
  },
  "stubtrue": {
    "name": "stubTrue",
    "command": "_.stubTrue()",
    "description": "This method returns `true`.",
    "since": "4.13.0"
  },
  "times": {
    "name": "times",
    "command": "_.times(n, [iteratee=_.identity])",
    "description": "Invokes the iteratee `n` times, returning an array of the results of each invocation. The iteratee is invoked with one argument; (index).",
    "since": "0.1.0"
  },
  "topath": {
    "name": "toPath",
    "command": "_.toPath(value)",
    "description": "Converts `value` to a property path array.",
    "since": "4.0.0"
  },
  "uniqueid": {
    "name": "uniqueId",
    "command": "_.uniqueId([prefix=''])",
    "description": "Generates a unique ID. If `prefix` is given, the ID is appended to it.",
    "since": "0.1.0"
  },
  "version": {
    "name": "VERSION",
    "command": "_.VERSION",
    "description": "(string): The semantic version number.",
    "since": "Unknown"
  },
  "templatesettings": {
    "name": "templateSettings",
    "command": "_.templateSettings",
    "description": "(Object): By default, the template delimiters used by lodash are like those in embedded Ruby (ERB) as well as ES2015 template strings. Change the following template settings to use alternative delimiters.",
    "since": "Unknown"
  },
  "templatesettings-escape": {
    "name": "templateSettings-escape",
    "command": "_.templateSettings.escape",
    "description": "(RegExp): Used to detect `data` property values to be HTML-escaped.",
    "since": "Unknown"
  },
  "templatesettings-evaluate": {
    "name": "templateSettings-evaluate",
    "command": "_.templateSettings.evaluate",
    "description": "(RegExp): Used to detect code to be evaluated.",
    "since": "Unknown"
  },
  "templatesettings-imports": {
    "name": "templateSettings-imports",
    "command": "_.templateSettings.imports",
    "description": "(Object): Used to import variables into the compiled template.",
    "since": "Unknown"
  },
  "templatesettings-interpolate": {
    "name": "templateSettings-interpolate",
    "command": "_.templateSettings.interpolate",
    "description": "(RegExp): Used to detect `data` property values to inject.",
    "since": "Unknown"
  },
  "templatesettings-variable": {
    "name": "templateSettings-variable",
    "command": "_.templateSettings.variable",
    "description": "(string): Used to reference the data object in the template text.",
    "since": "Unknown"
  },
  "templatesettings-imports-_": {
    "name": "templateSettings-imports-_",
    "command": "_.templateSettings.imports._",
    "description": "A reference to the `lodash` function.",
    "since": "Unknown"
  }
}
