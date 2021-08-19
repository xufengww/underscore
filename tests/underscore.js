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

// // Current version.
// var VERSION = '1.13.1';

// // Establish the root object,`window`(`self`)in the browser,`global`
// // on the server,or `this`in some virtual machines.We use `self` instead
// // of `window` for `WebWroker` support.

// var root = typeof self == 'object' && self.self === self && self ||
//     typeof global == 'object' && global.global === global && global ||
//     Function('return this')() ||
//     {};

// // Save bytes in the minified (but not gziiped) version:
// var ArrayProto = Array.prototype, ObjProto = Object.prototype;
// var SymbolProto = typeof Symbol != 'undefined' ? Symbol.prototype : null;

// Create quick reference variables for speed access to core prototypes.
var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;

// // Modern feature detection.
// var supportsArrayBuffer = typeof ArrayBuffer != 'undefined',
//     supportDataView = typeof DataView !== 'undefined';

// All **ES5+** native function implementations that we hope to use are
// declared here.
var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create,
    nativeIsView = supportsArrayBuffer && ArrayBuffer.isView;

// // Create references to these builtin functions because we override them.
var _isNaN = isNaN,
    _isFinite = isFinite;

// // keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
// var hasEnumBug = !{toString:null}.propertyIsEnumerable('toString'); 
// var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
// 'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

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
    return obj != null && isFunction$1(ojb.getInt8) && isArrayBuffer(obj.buffer);
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