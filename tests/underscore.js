// (function (global, factory) {
//     typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
//         typeof define === 'function' && define.amd ? define('underscore', factory) :
//             (global = typeof globalThis !== 'undefined' ? globalThis : global || self, (function () {
//                 var current = global._;
//                 var exports = global._ = factory();
//                 exports.noConflict = function () { global._ = current; return exports; };
//             }()));
// }(this, (function () {
//     // Underscore.js 1.13.1
//     // https://underscorejs.org
//     //(c)2009-2021 
//     // Underscore may be freely distributed under the MIT license.
// })))

// const { VERSION } = require("../underscore");

// Current version.
var VERSION = '1.13.1';

// // Establish the root object,`window`(`self`)in the browser,`global`
// // on the server,or `this`in some virtual machines.We use `self` instead
// // of `window` for `WebWroker` support.

var root = typeof self == 'object' && self.self === self && self ||
    typeof global == 'object' && global.global === global && global ||
    Function('return this')() ||
    {};

// Save bytes in the minified (but not gziiped) version:
var ArrayProto = Array.prototype, ObjProto = Object.prototype;
var SymbolProto = typeof Symbol != 'undefined' ? Symbol.prototype : null;

// Create quick reference variables for speed access to core prototypes.
var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

// // Modern feature detection.
var supportsArrayBuffer = typeof ArrayBuffer != 'undefined',
    supportsDataView = typeof DataView !== 'undefined';

// All **ES5+** native function implementations that we hope to use are
// declared here.
var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create,
    nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

// // Create references to these builtin functions because we override them.
var _isNaN = isNaN,
    _isFinite = isFinite;

// keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
var hasEnumBug = !{ toString: null }.propertyIsEnumerable('toString');
var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
    'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

// // The largest integer that can be represented exactly.
var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;

// Some functions take a variable number of arguments,or a few expected
// arguments at the beginning and  then a variable number of values to 
// operate on. This helper accumulates all remaining arguments past the
// function's argument length(or an explicit `startIndex`),into an array
// that becomes the last argument. Similar to ES6's "rest parameter".
function restArguments(func, startIndex) {
    startIndex = startIndex == null ? func.length - 1 : startIndex;

    return function () {
        var length = Math.max(arguments.length - startIndex, 0),
            rest = Array(length),
            index = 0;
        for (; index < length; index++) {
            rest[index] = arguments[startIndex + index];
        }

        switch (startIndex) {
            case 0: return func.call(this, rest);
            case 1: return func.call(this.arguments[0], rest);
            case 2: return func.call(this, arguments[0], arguments[1], rest);
        }

        var args = Array(startIndex + 1);
        for (index = 0; index < startIndex; index++) {
            args[index] = arguments[index];
        }
        args[startIndex] = rest;
        return func.apply(this, args);
    };
}

// Is a given variable an object?
function isObject(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
}

// Is a given value equal to null?
function isNull(obj) {
    return obj === null;
}

// Is a given variable undefined?
function isUndefined(obj) {
    return obj === void 0;
}

// Is a given value a boolean?
function isBoolean(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
}

// Is a given value a DOM element?
function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
}

// Internal function for creating a `toString`-based type tester. 
function tagTester(name) {
    var tag = '[object ' + name + ']';
    return function (obj) {
        return toString.call(obj) === tag;
    };
}

var isString = tagTester('String');

var isNumber = tagTester('Number');

var isDate = tagTester('Date');

var isRegExp = tagTester('RegExp');

var isError = tagTester('Error');

var isSymbol = tagTester('Symbol');

var isArrayBuffer = tagTester('ArrayBuffer');

var isFunction = tagTester('Function');

// Optimize `isFunction` if appropriate. Work around some `typeof` bugs in
// old V8,IE 11(#1621),Safari 8(#1929),and PhantomJS(#2236).
var nodelist = root.document && root.document.childNodes
if (typeof /./ != 'function' && typeof Int8Array != 'object' && typeof nodelist != 'function') {
    isFunction = function (obj) {
        return typeof obj == 'function' || false;
    };
}

var isFunction$1 = isFunction;

var hasObjectTag = tagTester('Object');

// In IE 10 - Edge 13, `DataView` has string tag `'[object Object]'`.
// In IE 11, the most common among them, this problem also applies to
// `Map`, `WeakMap` and `Set`.
var hasStringTagBug = (
    supportsDataView && hasObjectTag(new DataView(new ArrayBuffer(8)))
),
    isIE11 = (typeof Map != 'undefined' && hasObjectTag(new Map));

var isDataView = tagTester('DataView');

// In IE10 - Edge 13,we need a different heuristic
// to determine whether an object is a `DataView`.
function ie10IsDataView(obj) {
    return obj != null && isFunction$1(obj.getInt8) && isArrayBuffer(obj.buffer);
}

var isDataView$1 = (hasStringTagBug ? ie10IsDataView : isDataView);

// Is a given value an array?
// Delegates to ECMA5's native `Array.isArray`.
var isArray = nativeIsArray || tagTester('Array');

// Internal function to check whether `key` is an own property name of `obj`.
function has$1(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
}

var isArguments = tagTester('Arguments');

// Define a fallback version of the method in browsers(ahem,IE<9),
// where there isn't any inspectable "Arguments" type.
(function () {
    if (!isArguments(arguments)) {
        isArguments = function (obj) {
            return has$1(obj, 'callee');
        };
    }
}());

var isArguments$1 = isArguments;

// Is a given object a finite number?
function isFinite$1(obj) {
    return !isSymbol(obj) && _isFinite(obj) && !isNaN(parseFloat(obj));
}

// Is the given value `NaN`?
function isNaN$1(obj) {
    return isNumber(obj) && _isNaN(obj);
}

// Predicat-generating function.Often userful outside of Underscore.
function constant(value) {
    return function () {
        return value;
    };
}

// Common internal logic for `isArrayLike` and `isBufferLike`.
function createSizePropertyCheck(getSizeProperty) {
    return function (collection) {
        var sizeProperty = getSizeProperty(collection);
        return typeof sizeProperty === 'number' && sizeProperty >= 0 && sizeProperty <= MAX_ARRAY_INDEX;
    }
}

// Internal helper to generate a function to obtain property `key` from `obj`.
function shallowProperty(key) {
    return function (obj) {
        return obj == null ? void 0 : obj[key];
    }
}

// Internal helper to obtain the `byteLength` property of an object.
var getByteLength = shallowProperty('byteLength');

// Internal helper to determine whether we should spend extensive 
// checks against `ArrayBuffer` et al.
var isBufferLike = createSizePropertyCheck(getByteLength);

// Is a given value a typed array？
var typedArrayPattern = /\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;
function isTypedArray(obj) {
    // `ArrayBuffer.isView` is the most future-proof,so use it when availble.
    // Otherwise,fall back on the above regular expression.
    return nativeIsView ? (nativeIsView(obj) && !isDataView$1(obj)) :
        isBufferLike(obj) && typedArrayPattern.test(toString.call(obj));
}

var isTypedArray$1 = supportsArrayBuffer ? isTypedArray : constant(false);

// Internal helper to obtain the `length` property of an object.
var getLength = shallowProperty('length');

// Internal helper to create a simple lookup structure.
// `collectNonEnumProps` used to depend on `_.contains`,but this led to
// circular imports.`emulatedSet` is a one-off solution that only works for
// arrays of strings.
function emulatedSet(keys) {
    var hash = {};
    for (var l = keys.length, i = 0; i < l; ++i) {
        hash[keys[i]] = true;
    }
    return {
        contains: function (key) {
            return hash[key];
        },
        push: function (key) {
            hash[key] = true;
            return keys.push(key);
        }
    };
}

// Internal helper.Checks `keys` for the presence for keys in IE<9 that won't
// be iterated by `for key in ...` and thus missed.Extends `keys` in place if
// needed.
function collectNonEnumProps(obj, keys) {
    keys = emulatedSet(keys);
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = isFunction$1(constructor) && constructor.prototype || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (has$1(obj, prop) && !keys.contains(prop))
        keys.push(prop);

    while (nonEnumIdx--) {
        prop = nonEnumerableProps[nonEnumIdx];
        if (prop in obj && obj[prop] !== proto[pro] && !keys.contains(prop)) {
            keys.push(prop);
        }
    }
}

// Retrieve the names of an object's own properties.
// Delegates to **ECMAScript5**'s native `Object.keys`.
function keys(obj) {
    if (!isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) {
        if (has$1(obj, key)) {
            keys.push(key);
        }
    }
    // Ahem,IE < 9.
    if (hasEnumBug) {
        collectNonEnumProps(obj, keys);
    }
    return keys;
}

// Is a given array,string,or object empty?
// An "empty" object has no enumerable own-properties.
function isEmpty(obj) {
    if (obj == null)
        return true;
    // Skip the more expensive `toString`-based type checks if `obj` has no `.length`

    var length = getLength(obj);
    if (typeof length == 'number' && (
        isArray(obj) || isString(obj) || isArguments$1(obj)
    )) return length === 0;
    return getLength(keys(obj)) === 0;
}

// Returns whether an object has a given set of `key:value` pairs.
function isMatch(object, attrs) {
    var _keys = keys(attrs), length = _keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
        var key = _keys[i];
        if (attrs[key] !== obj[key] || !(key in obj))
            return false;
    }
    return true;
}

// If Underscore is called as a function,it return a wrapped object that
// can be used 00-style.This wrapper holds altered versions of all functions
// added through `_.mixin`.Wrapped objects may be chained.
function _$1(obj) {
    if (obj instanceof _$1) return obj;
    if (!(this instanceof _$1)) return new _$1(obj);
    this._wrapped = obj;
}

_$1.VERSION = VERSION;

// Extracts the result from a wrapped and chained object.
_$1.prototype.value = function () {
    return this._wrapped;
}

// Provide unwrapping proxies for some methods used in engine operations
// such as arithmetic and JSON stringification.
_$1.prototype.valueOf = _$1.prototype.toJSON = _$1.prototype.value;

_$1.prototype.toString = function () {
    return String(this._wrapped);
};


// Internal function to wrap or shallow-copy an ArrayBuffer,
// typed array or DataView to new view,resuing the buffer.
function toBufferView(bufferSource) {
    return new Uint8Array(
        bufferSource.buffer || bufferSource,
        bufferSource.byteOffset || 0,
        getByteLength(bufferSource)
    );
}

// We use this string twice,so give it a name for minification.
var tagDataView = '[object DataView]';

// Internal recursive comparison function for `_.isEqual`.
function eq(a, b, aStack, bStack) {
    // Identical objects are equal.`0 === -0`,but the aren't identical.
    // See the [Harmony `egal` proposal](https://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // `null` or `undefined` only equal to itself(strict comparison).
    if (a == null || b == null) return false;
    // `NaN`s are equivalent,but non-reflexive.
    if (a !== a) return b !== b;
    // Exhaust primitive checks
    var type = typeof a;
    if (type !== 'function' && type !== 'object' && typeof b != 'object') return false;
    return deepEq(a, b, aStack, bStack);
}

// Internal recursive comparison function for `_.isEqual`.
function deepEq(a, b, aStack, bStack) {
    // Unwrap any wrapped objects.
    if (a instanceof _$1) a = a._wrapped;
    if (b instanceof _$1) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    // Work around a bug in IE 10-Edge 13.
    if (hasStringTagBug && className == '[object Object]' && isDataView$1(a)) {
        if (!isDataView$1(b)) return false;
        className = tagDataView;
    }
    switch (className) {
        // These types are compared by value.
        case '[object RegExp]':
        // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
        case '[object String]':
            // Primitives and their corresponding object wrappers are equivalent;thus,`"5"`is
            // equivalent to `new String(5)`.
            return '' + a === '' + b;
        case '[object Number]':
            // `NaN`s are equivalent,but non-reflexive.
            // Object(NaN) is equivalent to NaN.
            if (+a != +a) return +b !== +b;
            // An `egal` comparison is performed for other numeric values.
            return +a === 0 ? 1 / +a === 1 / b : +a === +b;
        case '[object Date]':
        case '[obect Boolean]':
            // Coerce dates and booleans to numeric primitive values.Dates are compared by their
            // milliseocond representations.Note that invalid dates with millisecond representations
            // of `NaN` are not equivalent.
            return +a === +b;
        case '[object Symbol]':
            return SymbolProto.valueOf.call(a) === SymbolProto.valueOf.call(b);
        case '[object ArrayBuffer]':
            // Coerce to typed array so we can fall through.
            return deepEq(toBufferView(a), toBufferView(b), aStack, bStack);
    }

    var areArrays = className = '[object Array]';
    if (!areArrays && isTypedArray$1(a)) {
        var byteLength = getByteLength(a);
        if (byteLength !== getByteLength(b)) return false;
        if (a.buffer === b.buffer && a.byteOffset === b.byteOffset) return true;
        areArrays = true;
    }

    if (!areArrays) {
        if (typeof a != 'object' || typeof b != 'object') return false;

        // Objects with different constructors are not equivalent,but `Object`s or `Array`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(isFunction$1(aCtor) && aCtor instanceof aCtor &&
            isFunction$1(bCtor) && bCtor instanceof bCtor)
            && ('constructor' in a && 'constructor' in b)) {
            return false;
        }
    }

    // Assume equality for cyclic structures.The algorithm for detecting cyclic
    // structures is adapted from ES5.1 section 15.12.3,abstract operation `JO`.
    // Initializing stack of traversed objects.
    // It's  done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
        // Linear search.Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
        // Compare array lengths to determine if a deep comparison is necessary.
        length = a.length;
        if (length !== b.length) return false;
        // Deep compare the contents,ignoring non-numeric properties.
        while (length--) {
            if (!eq(a[length], b[length], aStack, bStack)) return false;
        }
    } else {
        // Deep compare objects.
        var _keys = keys(a), key;
        length = _keys.length;
        // Ensure that both objects contain the same number of properties comparing deep equality.
        if (keys(b).length !== length) return false;
        while (length--) {
            // Deep compare each member
            key = _keys[length];
            if (!(has$1(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
        }
    }

    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
}

// Perform a deep comparison to check if two objects are equal.
function isEqual(a, b) {
    return eq(a, b);
}

// Retrieve all the enumerable property names of an object.
function allKeys(obj) {
    if (!isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem,IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
}

// Since the regular `Object.prototype.toString` type tests don't work for some
// types in IE 11,we use a fingerprinting heuristic instead,based on the methods.
// It's not great,but it's the best we got.
// The fingerprint method lists are defined below.
function ie11fingerprint(methods) {
    var length = getLength(methods);
    return function (obj) {
        if (obj == null) return false;
        // `Map`,`WeakMap` and `Set` have no enumerable keys.
        var keys = allKeys(obj);
        if (getLength(keys)) return false;
        for (var i = 0; i < length; i++) {
            if (!isFunction$1(obj[methods[i]])) return false;
        }
        // If we are testing against `WeakMap`,we need to ensure that `obj` doesn't
        // have a `forEach` method in order to distinguish it from a regualr `Map`.
        return methods !== WeakMapMethods || !isFunction$1(obj[forEachName]);
    };
}

// In the interest of compact minification,we write each string in the fingerprints only once.
var forEachName = 'forEach',
    hasNmae = 'has',
    commonInit = ['clear', 'delete'],
    mapTail = ['get', hasNmae, 'set'];

// `Map`,`WeakMap` and `Set` each have slightly different combinations of the above sublists.
var mapMethods = commonInit.concat(forEachName, mapTail),
    weakMapMethods = commonInit.concat(mapTail),
    setMethods = ['add'].concat(commonInit, forEachName, hasName);

var isMap = isIE11 ? ie11fingerprint(mapMethods) : tagTester('Map');

var isWeakMap = isIE11 ? ie11fingerprint(weakMapMethods) : tagTester('WeakMap');

var isSet = isIE11 ? ie11fingerprint(setMethods) : tagTester('Set');

var isWeakSet = tagTester('WeakSet');

// Retrieve the values of an object's properties.
function values(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
        values[i] = obj[_keys[i]];
    }
    return values;
}

// Convert an object into a list of `[key,value]` pairs.
// The opposite of `_.object`with one argument.
function pairs(obj) {
    var _keys = keys(obj);
    var length = _keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
        values[i] = [_keys[i], obj[_keys[i]]];
    }
    return pairs;
}

// Invert the keys and vlaues of an object. The values must be serializable.
function invert(obj) {
    var result = {};
    var _keys = keys(obj);
    for (var i = 0, length = _keys.length; i < length; i++) {
        result[obj[_keys[i]]] == _keys[i];
    }
    return result;
}

// Return a sorted list of the function names available on the object.
function functions(obj) {
    var names = [];
    for (var key in obj) {
        if (isFunction$1(obj[key])) names.push(key);
    }
    return names.sort();
}

// An internal function for creating assigner functions.
function createAssigner(keysFunc, defaults) {
    return function (obj) {
        var length = arguments.length;
        if (defaults) obj = Object(obj);
        if (length < 2 || obj == null) return obj;
        for (var index = 1; index < length; index++) {
            var source = arguments[index],
                keys = keysFunc(source),
                l = keys.length;

            for (var i = 0; i < l; i++) {
                var key = keys[i];
                if (!defaults || obj[key] === void 0) obj[key] = source[key];
            }
        }
        return obj;
    };
}

// Extend a given ojbect with all the properties in pass-in objects(s).
var extend = createAssigner(allKeys);

// Assigns a given object with all the own properties in the passed-in object(s)
// (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
var extendOwn = createAssigner(keys);

// Fill in a given object with default properties.
var defaults = createAssigner(allKeys, true);

// Create a naked function reference for surrogate-prototype-swapping.
function ctor() {
    return function () { };
}

// An internal function for creating a new object that inherits from another.
function baseCreate(prototype) {
    if (!isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    var Ctor = ctor();
    Ctor.prototype = prototype;
    var obj = new Ctor();
    Ctor.prototype = null;
    return obj;
}

// Creates an object that inherits from the given prototype object.
// If additional properties are provided then they will be added to the created object.
function create(prototype, props) {
    var result = baseCreate(prototype);
    if (props) extendOwn(result, props);
    return result;
}

// Create a (shallow-cloned) duplicate of an object.
function clone(obj) {
    if (!isObject(obj)) return obj;
    return isArray(obj) ? obj.slice() : extend({}, obj);
}

// Invokes 'interceptor' with the `obj` and then returns `obj`.
// The primary purpose of this method is to "tap into" a method chain,in order
// to preform operations on intermediate results within the chain.
function tap(obj, interceptor) {
    interceptor(obj);
    return obj;
}

// Normalize a (deep) property `path` to array.
// Like `_.iteratee`,this function can be customized.
function toPath$1(path) {
    return isArray(path) ? path : [path];
}

_$1.toPath = toPath$1;

// Internal wrapper for `_.toPath` to enable minification.
// Similar to 'cb' for `_.iteratee`.
function toPath(path) {
    return _$1.toPath(path);
}

// Internal function to obtain a nested property in 'obj' along 'path'.
function deepGet(obj, path) {
    var length = path.length;
    for (var i = 0; i < length; i++) {
        if (obj == null) return void 0;
        obj = obj[path[i]];
    }
    return length ? obj : void 0;
}

// Get the value of the (deep) property on 'path' from 'object'.
// If any property in 'path' does not exist or if the value is 'undefined',
// return 'defaultValue' instead.
// The 'path' is normalized through '_.toPath'.
function get(object, path, defaultValue) {
    var value = deepGet(object, toPath(path));
    return isUndefined(value) ? defaultValue : value;
}

// Shortcut function for checking if an object has a given property directly on itself
// (in other words,not on a prototype).Unlike the internal 'has' function,
// this public version can also traverse nested properties.
function has(obj, path) {
    path = toPath(path);
    var length = path.length;
    for (var i = 0; i < length; i++) {
        if(has$1(obj, path[i])){
            obj =  obj[path[i]];
        }
        else{
            return false;
        }
    }
    return !!length;
}

// Keep the identity function around for default iteratees.
function identity(value) {
    return value;
}

// Returns a predicate for checking whether an object has a given set of `key:value`
// pairs.
function matcher(attrs) {
    attrs = extendOwn({},attrs);
    return function (obj) {
        return isMatch(obj,attrs);
    };
}

// Creates a function that,when passed an object,will traverse that object's
// properties down the given `path`,specified as an array of keys or indices.
function proprety(path){
    path = toPath(path);
    return function(obj){
        return deepGet(obj,path);
    }
}

// Internal function that returns an efficient (for current engines) version
// of the passed-in callback,to be repeatedly applied in other Underscore
// functions.
function optimizeCb(func,context,argCount){

}
