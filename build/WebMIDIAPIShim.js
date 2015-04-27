(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.map');
module.exports = require('../modules/$').core.Map;
},{"../modules/$":17,"../modules/es6.map":25,"../modules/es6.object.to-string":26,"../modules/es6.string.iterator":28,"../modules/web.dom.iterable":30}],2:[function(require,module,exports){
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.set');
module.exports = require('../modules/$').core.Set;
},{"../modules/$":17,"../modules/es6.object.to-string":26,"../modules/es6.set":27,"../modules/es6.string.iterator":28,"../modules/web.dom.iterable":30}],3:[function(require,module,exports){
require('../modules/es6.symbol');
module.exports = require('../modules/$').core.Symbol;
},{"../modules/$":17,"../modules/es6.symbol":29}],4:[function(require,module,exports){
var $ = require('./$');
function assert(condition, msg1, msg2){
  if(!condition)throw TypeError(msg2 ? msg1 + msg2 : msg1);
}
assert.def = $.assertDefined;
assert.fn = function(it){
  if(!$.isFunction(it))throw TypeError(it + ' is not a function!');
  return it;
};
assert.obj = function(it){
  if(!$.isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
assert.inst = function(it, Constructor, name){
  if(!(it instanceof Constructor))throw TypeError(name + ": use the 'new' operator!");
  return it;
};
module.exports = assert;
},{"./$":17}],5:[function(require,module,exports){
var $        = require('./$')
  , TAG      = require('./$.wks')('toStringTag')
  , toString = {}.toString;
function cof(it){
  return toString.call(it).slice(8, -1);
}
cof.classof = function(it){
  var O, T;
  return it == undefined ? it === undefined ? 'Undefined' : 'Null'
    : typeof (T = (O = Object(it))[TAG]) == 'string' ? T : cof(O);
};
cof.set = function(it, tag, stat){
  if(it && !$.has(it = stat ? it : it.prototype, TAG))$.hide(it, TAG, tag);
};
module.exports = cof;
},{"./$":17,"./$.wks":23}],6:[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , safe     = require('./$.uid').safe
  , assert   = require('./$.assert')
  , forOf    = require('./$.for-of')
  , step     = require('./$.iter').step
  , has      = $.has
  , set      = $.set
  , isObject = $.isObject
  , hide     = $.hide
  , isFrozen = Object.isFrozen || $.core.Object.isFrozen
  , ID       = safe('id')
  , O1       = safe('O1')
  , LAST     = safe('last')
  , FIRST    = safe('first')
  , ITER     = safe('iter')
  , SIZE     = $.DESC ? safe('size') : 'size'
  , id       = 0;

function fastKey(it, create){
  // return primitive with prefix
  if(!isObject(it))return (typeof it == 'string' ? 'S' : 'P') + it;
  // can't set id to frozen object
  if(isFrozen(it))return 'F';
  if(!has(it, ID)){
    // not necessary to add id
    if(!create)return 'E';
    // add missing object id
    hide(it, ID, ++id);
  // return object id with prefix
  } return 'O' + it[ID];
}

function getEntry(that, key){
  // fast case
  var index = fastKey(key), entry;
  if(index != 'F')return that[O1][index];
  // frozen object case
  for(entry = that[FIRST]; entry; entry = entry.n){
    if(entry.k == key)return entry;
  }
}

module.exports = {
  getConstructor: function(NAME, IS_MAP, ADDER){
    function C(){
      var that     = assert.inst(this, C, NAME)
        , iterable = arguments[0];
      set(that, O1, $.create(null));
      set(that, SIZE, 0);
      set(that, LAST, undefined);
      set(that, FIRST, undefined);
      if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
    }
    $.mix(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear(){
        for(var that = this, data = that[O1], entry = that[FIRST]; entry; entry = entry.n){
          entry.r = true;
          if(entry.p)entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that[FIRST] = that[LAST] = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function(key){
        var that  = this
          , entry = getEntry(that, key);
        if(entry){
          var next = entry.n
            , prev = entry.p;
          delete that[O1][entry.i];
          entry.r = true;
          if(prev)prev.n = next;
          if(next)next.p = prev;
          if(that[FIRST] == entry)that[FIRST] = next;
          if(that[LAST] == entry)that[LAST] = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /*, that = undefined */){
        var f = ctx(callbackfn, arguments[1], 3)
          , entry;
        while(entry = entry ? entry.n : this[FIRST]){
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while(entry && entry.r)entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key){
        return !!getEntry(this, key);
      }
    });
    if($.DESC)$.setDesc(C.prototype, 'size', {
      get: function(){
        return assert.def(this[SIZE]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    var entry = getEntry(that, key)
      , prev, index;
    // change existing entry
    if(entry){
      entry.v = value;
    // create new entry
    } else {
      that[LAST] = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that[LAST],          // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if(!that[FIRST])that[FIRST] = entry;
      if(prev)prev.n = entry;
      that[SIZE]++;
      // add to index
      if(index != 'F')that[O1][index] = entry;
    } return that;
  },
  getEntry: getEntry,
  // add .keys, .values, .entries, [@@iterator]
  // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
  setIter: function(C, NAME, IS_MAP){
    require('./$.iter-define')(C, NAME, function(iterated, kind){
      set(this, ITER, {o: iterated, k: kind});
    }, function(){
      var iter  = this[ITER]
        , kind  = iter.k
        , entry = iter.l;
      // revert to the last existing entry
      while(entry && entry.r)entry = entry.p;
      // get next entry
      if(!iter.o || !(iter.l = entry = entry ? entry.n : iter.o[FIRST])){
        // or finish the iteration
        iter.o = undefined;
        return step(1);
      }
      // return step by kind
      if(kind == 'keys'  )return step(0, entry.k);
      if(kind == 'values')return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values' , !IS_MAP, true);
  }
};
},{"./$":17,"./$.assert":4,"./$.ctx":8,"./$.for-of":11,"./$.iter":16,"./$.iter-define":14,"./$.uid":21}],7:[function(require,module,exports){
'use strict';
var $     = require('./$')
  , $def  = require('./$.def')
  , BUGGY = require('./$.iter').BUGGY
  , forOf = require('./$.for-of')
  , species = require('./$.species')
  , assertInstance = require('./$.assert').inst;

module.exports = function(NAME, methods, common, IS_MAP, IS_WEAK){
  var Base  = $.g[NAME]
    , C     = Base
    , ADDER = IS_MAP ? 'set' : 'add'
    , proto = C && C.prototype
    , O     = {};
  function fixMethod(KEY, CHAIN){
    var method = proto[KEY];
    if($.FW)proto[KEY] = function(a, b){
      var result = method.call(this, a === 0 ? 0 : a, b);
      return CHAIN ? this : result;
    };
  }
  if(!$.isFunction(C) || !(IS_WEAK || !BUGGY && proto.forEach && proto.entries)){
    // create collection constructor
    C = common.getConstructor(NAME, IS_MAP, ADDER);
    $.mix(C.prototype, methods);
  } else {
    var inst  = new C
      , chain = inst[ADDER](IS_WEAK ? {} : -0, 1)
      , buggyZero;
    // wrap for init collections from iterable
    if(!require('./$.iter-detect')(function(iter){ new C(iter); })){ // eslint-disable-line no-new
      C = function(){
        assertInstance(this, C, NAME);
        var that     = new Base
          , iterable = arguments[0];
        if(iterable != undefined)forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      };
      C.prototype = proto;
      if($.FW)proto.constructor = C;
    }
    IS_WEAK || inst.forEach(function(val, key){
      buggyZero = 1 / key === -Infinity;
    });
    // fix converting -0 key to +0
    if(buggyZero){
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    // + fix .add & .set for chaining
    if(buggyZero || chain !== inst)fixMethod(ADDER, true);
  }

  require('./$.cof').set(C, NAME);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F * (C != Base), O);
  species(C);
  species($.core[NAME]); // for wrapper

  if(!IS_WEAK)common.setIter(C, NAME, IS_MAP);

  return C;
};
},{"./$":17,"./$.assert":4,"./$.cof":5,"./$.def":9,"./$.for-of":11,"./$.iter":16,"./$.iter-detect":15,"./$.species":19}],8:[function(require,module,exports){
// Optional / simple context binding
var assertFunction = require('./$.assert').fn;
module.exports = function(fn, that, length){
  assertFunction(fn);
  if(~length && that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  } return function(/* ...args */){
      return fn.apply(that, arguments);
    };
};
},{"./$.assert":4}],9:[function(require,module,exports){
var $          = require('./$')
  , global     = $.g
  , core       = $.core
  , isFunction = $.isFunction;
function ctx(fn, that){
  return function(){
    return fn.apply(that, arguments);
  };
}
global.core = core;
// type bitmap
$def.F = 1;  // forced
$def.G = 2;  // global
$def.S = 4;  // static
$def.P = 8;  // proto
$def.B = 16; // bind
$def.W = 32; // wrap
function $def(type, name, source){
  var key, own, out, exp
    , isGlobal = type & $def.G
    , target   = isGlobal ? global : type & $def.S
        ? global[name] : (global[name] || {}).prototype
    , exports  = isGlobal ? core : core[name] || (core[name] = {});
  if(isGlobal)source = name;
  for(key in source){
    // contains in native
    own = !(type & $def.F) && target && key in target;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    if(type & $def.B && own)exp = ctx(out, global);
    else exp = type & $def.P && isFunction(out) ? ctx(Function.call, out) : out;
    // extend global
    if(target && !own){
      if(isGlobal)target[key] = out;
      else delete target[key] && $.hide(target, key, out);
    }
    // export
    if(exports[key] != out)$.hide(exports, key, exp);
  }
}
module.exports = $def;
},{"./$":17}],10:[function(require,module,exports){
var $ = require('./$');
module.exports = function(it){
  var keys       = $.getKeys(it)
    , getDesc    = $.getDesc
    , getSymbols = $.getSymbols;
  if(getSymbols)$.each.call(getSymbols(it), function(key){
    if(getDesc(it, key).enumerable)keys.push(key);
  });
  return keys;
};
},{"./$":17}],11:[function(require,module,exports){
var ctx  = require('./$.ctx')
  , get  = require('./$.iter').get
  , call = require('./$.iter-call');
module.exports = function(iterable, entries, fn, that){
  var iterator = get(iterable)
    , f        = ctx(fn, that, entries ? 2 : 1)
    , step;
  while(!(step = iterator.next()).done){
    if(call(iterator, f, step.value, entries) === false){
      return call.close(iterator);
    }
  }
};
},{"./$.ctx":8,"./$.iter":16,"./$.iter-call":13}],12:[function(require,module,exports){
module.exports = function($){
  $.FW   = true;
  $.path = $.g;
  return $;
};
},{}],13:[function(require,module,exports){
var assertObject = require('./$.assert').obj;
function close(iterator){
  var ret = iterator['return'];
  if(ret !== undefined)assertObject(ret.call(iterator));
}
function call(iterator, fn, value, entries){
  try {
    return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
  } catch(e){
    close(iterator);
    throw e;
  }
}
call.close = close;
module.exports = call;
},{"./$.assert":4}],14:[function(require,module,exports){
var $def            = require('./$.def')
  , $               = require('./$')
  , cof             = require('./$.cof')
  , $iter           = require('./$.iter')
  , SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , FF_ITERATOR     = '@@iterator'
  , VALUES          = 'values'
  , Iterators       = $iter.Iterators;
module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
  $iter.create(Constructor, NAME, next);
  function createMethod(kind){
    return function(){
      return new Constructor(this, kind);
    };
  }
  var TAG      = NAME + ' Iterator'
    , proto    = Base.prototype
    , _native  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , _default = _native || createMethod(DEFAULT)
    , methods, key;
  // Fix native
  if(_native){
    var IteratorPrototype = $.getProto(_default.call(new Base));
    // Set @@toStringTag to native iterators
    cof.set(IteratorPrototype, TAG, true);
    // FF fix
    if($.FW && $.has(proto, FF_ITERATOR))$iter.set(IteratorPrototype, $.that);
  }
  // Define iterator
  if($.FW)$iter.set(proto, _default);
  // Plug for library
  Iterators[NAME] = _default;
  Iterators[TAG]  = $.that;
  if(DEFAULT){
    methods = {
      keys:    IS_SET            ? _default : createMethod('keys'),
      values:  DEFAULT == VALUES ? _default : createMethod(VALUES),
      entries: DEFAULT != VALUES ? _default : createMethod('entries')
    };
    if(FORCE)for(key in methods){
      if(!(key in proto))$.hide(proto, key, methods[key]);
    } else $def($def.P + $def.F * $iter.BUGGY, NAME, methods);
  }
};
},{"./$":17,"./$.cof":5,"./$.def":9,"./$.iter":16,"./$.wks":23}],15:[function(require,module,exports){
var SYMBOL_ITERATOR = require('./$.wks')('iterator')
  , SAFE_CLOSING    = false;
try {
  var riter = [7][SYMBOL_ITERATOR]();
  riter['return'] = function(){ SAFE_CLOSING = true; };
  Array.from(riter, function(){ throw 2; });
} catch(e){ /* empty */ }
module.exports = function(exec){
  if(!SAFE_CLOSING)return false;
  var safe = false;
  try {
    var arr  = [7]
      , iter = arr[SYMBOL_ITERATOR]();
    iter.next = function(){ safe = true; };
    arr[SYMBOL_ITERATOR] = function(){ return iter; };
    exec(arr);
  } catch(e){ /* empty */ }
  return safe;
};
},{"./$.wks":23}],16:[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , cof               = require('./$.cof')
  , assertObject      = require('./$.assert').obj
  , SYMBOL_ITERATOR   = require('./$.wks')('iterator')
  , FF_ITERATOR       = '@@iterator'
  , Iterators         = {}
  , IteratorPrototype = {};
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
setIterator(IteratorPrototype, $.that);
function setIterator(O, value){
  $.hide(O, SYMBOL_ITERATOR, value);
  // Add iterator for FF iterator protocol
  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
}

module.exports = {
  // Safari has buggy iterators w/o `next`
  BUGGY: 'keys' in [] && !('next' in [].keys()),
  Iterators: Iterators,
  step: function(done, value){
    return {value: value, done: !!done};
  },
  is: function(it){
    var O      = Object(it)
      , Symbol = $.g.Symbol
      , SYM    = Symbol && Symbol.iterator || FF_ITERATOR;
    return SYM in O || SYMBOL_ITERATOR in O || $.has(Iterators, cof.classof(O));
  },
  get: function(it){
    var Symbol  = $.g.Symbol
      , ext     = it[Symbol && Symbol.iterator || FF_ITERATOR]
      , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[cof.classof(it)];
    return assertObject(getIter.call(it));
  },
  set: setIterator,
  create: function(Constructor, NAME, next, proto){
    Constructor.prototype = $.create(proto || IteratorPrototype, {next: $.desc(1, next)});
    cof.set(Constructor, NAME + ' Iterator');
  }
};
},{"./$":17,"./$.assert":4,"./$.cof":5,"./$.wks":23}],17:[function(require,module,exports){
'use strict';
var global = typeof self != 'undefined' ? self : Function('return this')()
  , core   = {}
  , defineProperty = Object.defineProperty
  , hasOwnProperty = {}.hasOwnProperty
  , ceil  = Math.ceil
  , floor = Math.floor
  , max   = Math.max
  , min   = Math.min;
// The engine works fine with descriptors? Thank's IE8 for his funny defineProperty.
var DESC = !!function(){
  try {
    return defineProperty({}, 'a', {get: function(){ return 2; }}).a == 2;
  } catch(e){ /* empty */ }
}();
var hide = createDefiner(1);
// 7.1.4 ToInteger
function toInteger(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
}
function desc(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
}
function simpleSet(object, key, value){
  object[key] = value;
  return object;
}
function createDefiner(bitmap){
  return DESC ? function(object, key, value){
    return $.setDesc(object, key, desc(bitmap, value));
  } : simpleSet;
}

function isObject(it){
  return it !== null && (typeof it == 'object' || typeof it == 'function');
}
function isFunction(it){
  return typeof it == 'function';
}
function assertDefined(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
}

var $ = module.exports = require('./$.fw')({
  g: global,
  core: core,
  html: global.document && document.documentElement,
  // http://jsperf.com/core-js-isobject
  isObject:   isObject,
  isFunction: isFunction,
  it: function(it){
    return it;
  },
  that: function(){
    return this;
  },
  // 7.1.4 ToInteger
  toInteger: toInteger,
  // 7.1.15 ToLength
  toLength: function(it){
    return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
  },
  toIndex: function(index, length){
    index = toInteger(index);
    return index < 0 ? max(index + length, 0) : min(index, length);
  },
  has: function(it, key){
    return hasOwnProperty.call(it, key);
  },
  create:     Object.create,
  getProto:   Object.getPrototypeOf,
  DESC:       DESC,
  desc:       desc,
  getDesc:    Object.getOwnPropertyDescriptor,
  setDesc:    defineProperty,
  setDescs:   Object.defineProperties,
  getKeys:    Object.keys,
  getNames:   Object.getOwnPropertyNames,
  getSymbols: Object.getOwnPropertySymbols,
  assertDefined: assertDefined,
  // Dummy, fix for not array-like ES3 string in es5 module
  ES5Object: Object,
  toObject: function(it){
    return $.ES5Object(assertDefined(it));
  },
  hide: hide,
  def: createDefiner(0),
  set: global.Symbol ? simpleSet : hide,
  mix: function(target, src){
    for(var key in src)hide(target, key, src[key]);
    return target;
  },
  each: [].forEach
});
/* eslint-disable no-undef */
if(typeof __e != 'undefined')__e = core;
if(typeof __g != 'undefined')__g = global;
},{"./$.fw":12}],18:[function(require,module,exports){
var $ = require('./$');
module.exports = function(object, el){
  var O      = $.toObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":17}],19:[function(require,module,exports){
var $       = require('./$')
  , SPECIES = require('./$.wks')('species');
module.exports = function(C){
  if($.DESC && !(SPECIES in C))$.setDesc(C, SPECIES, {
    configurable: true,
    get: $.that
  });
};
},{"./$":17,"./$.wks":23}],20:[function(require,module,exports){
'use strict';
// true  -> String#at
// false -> String#codePointAt
var $ = require('./$');
module.exports = function(TO_STRING){
  return function(pos){
    var s = String($.assertDefined(this))
      , i = $.toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l
      || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
        ? TO_STRING ? s.charAt(i) : a
        : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./$":17}],21:[function(require,module,exports){
var sid = 0;
function uid(key){
  return 'Symbol(' + key + ')_' + (++sid + Math.random()).toString(36);
}
uid.safe = require('./$').g.Symbol || uid;
module.exports = uid;
},{"./$":17}],22:[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var $           = require('./$')
  , UNSCOPABLES = require('./$.wks')('unscopables');
if($.FW && !(UNSCOPABLES in []))$.hide(Array.prototype, UNSCOPABLES, {});
module.exports = function(key){
  if($.FW)[][UNSCOPABLES][key] = true;
};
},{"./$":17,"./$.wks":23}],23:[function(require,module,exports){
var global = require('./$').g
  , store  = {};
module.exports = function(name){
  return store[name] || (store[name] =
    global.Symbol && global.Symbol[name] || require('./$.uid').safe('Symbol.' + name));
};
},{"./$":17,"./$.uid":21}],24:[function(require,module,exports){
var $          = require('./$')
  , setUnscope = require('./$.unscope')
  , ITER       = require('./$.uid').safe('iter')
  , $iter      = require('./$.iter')
  , step       = $iter.step
  , Iterators  = $iter.Iterators;

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
require('./$.iter-define')(Array, 'Array', function(iterated, kind){
  $.set(this, ITER, {o: $.toObject(iterated), i: 0, k: kind});
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , kind  = iter.k
    , index = iter.i++;
  if(!O || index >= O.length){
    iter.o = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$":17,"./$.iter":16,"./$.iter-define":14,"./$.uid":21,"./$.unscope":22}],25:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', {
  // 23.1.3.6 Map.prototype.get(key)
  get: function get(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function set(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":7,"./$.collection-strong":6}],26:[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var $   = require('./$')
  , cof = require('./$.cof')
  , tmp = {};
tmp[require('./$.wks')('toStringTag')] = 'z';
if($.FW && cof(tmp) != 'z')$.hide(Object.prototype, 'toString', function toString(){
  return '[object ' + cof.classof(this) + ']';
});
},{"./$":17,"./$.cof":5,"./$.wks":23}],27:[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":7,"./$.collection-strong":6}],28:[function(require,module,exports){
var set   = require('./$').set
  , at    = require('./$.string-at')(true)
  , ITER  = require('./$.uid').safe('iter')
  , $iter = require('./$.iter')
  , step  = $iter.step;

// 21.1.3.27 String.prototype[@@iterator]()
require('./$.iter-define')(String, 'String', function(iterated){
  set(this, ITER, {o: String(iterated), i: 0});
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var iter  = this[ITER]
    , O     = iter.o
    , index = iter.i
    , point;
  if(index >= O.length)return step(1);
  point = at.call(O, index);
  iter.i += point.length;
  return step(0, point);
});
},{"./$":17,"./$.iter":16,"./$.iter-define":14,"./$.string-at":20,"./$.uid":21}],29:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $        = require('./$')
  , setTag   = require('./$.cof').set
  , uid      = require('./$.uid')
  , $def     = require('./$.def')
  , keyOf    = require('./$.keyof')
  , enumKeys = require('./$.enum-keys')
  , assertObject = require('./$.assert').obj
  , has      = $.has
  , $create  = $.create
  , getDesc  = $.getDesc
  , setDesc  = $.setDesc
  , desc     = $.desc
  , getNames = $.getNames
  , toObject = $.toObject
  , Symbol   = $.g.Symbol
  , setter   = false
  , TAG      = uid('tag')
  , HIDDEN   = uid('hidden')
  , SymbolRegistry = {}
  , AllSymbols = {}
  , useNative = $.isFunction(Symbol);

function wrap(tag){
  var sym = AllSymbols[tag] = $.set($create(Symbol.prototype), TAG, tag);
  $.DESC && setter && setDesc(Object.prototype, tag, {
    configurable: true,
    set: function(value){
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setDesc(this, tag, desc(1, value));
    }
  });
  return sym;
}

function defineProperty(it, key, D){
  if(D && has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))setDesc(it, HIDDEN, desc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D.enumerable = false;
    }
  } return setDesc(it, key, D);
}
function defineProperties(it, P){
  assertObject(it);
  var keys = enumKeys(P = toObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)defineProperty(it, key = keys[i++], P[key]);
  return it;
}
function create(it, P){
  return P === undefined ? $create(it) : defineProperties($create(it), P);
}
function getOwnPropertyDescriptor(it, key){
  var D = getDesc(it = toObject(it), key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
}
function getOwnPropertyNames(it){
  var names  = getNames(toObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(!has(AllSymbols, key = names[i++]) && key != HIDDEN)result.push(key);
  return result;
}
function getOwnPropertySymbols(it){
  var names  = getNames(toObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i)if(has(AllSymbols, key = names[i++]))result.push(AllSymbols[key]);
  return result;
}

// 19.4.1.1 Symbol([description])
if(!useNative){
  Symbol = function Symbol(description){
    if(this instanceof Symbol)throw TypeError('Symbol is not a constructor');
    return wrap(uid(description));
  };
  $.hide(Symbol.prototype, 'toString', function(){
    return this[TAG];
  });

  $.create     = create;
  $.setDesc    = defineProperty;
  $.getDesc    = getOwnPropertyDescriptor;
  $.setDescs   = defineProperties;
  $.getNames   = getOwnPropertyNames;
  $.getSymbols = getOwnPropertySymbols;
}

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    return keyOf(SymbolRegistry, key);
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
};
// 19.4.2.2 Symbol.hasInstance
// 19.4.2.3 Symbol.isConcatSpreadable
// 19.4.2.4 Symbol.iterator
// 19.4.2.6 Symbol.match
// 19.4.2.8 Symbol.replace
// 19.4.2.9 Symbol.search
// 19.4.2.10 Symbol.species
// 19.4.2.11 Symbol.split
// 19.4.2.12 Symbol.toPrimitive
// 19.4.2.13 Symbol.toStringTag
// 19.4.2.14 Symbol.unscopables
$.each.call((
    'hasInstance,isConcatSpreadable,iterator,match,replace,search,' +
    'species,split,toPrimitive,toStringTag,unscopables'
  ).split(','), function(it){
    var sym = require('./$.wks')(it);
    symbolStatics[it] = useNative ? sym : wrap(sym);
  }
);

setter = true;

$def($def.G + $def.W, {Symbol: Symbol});

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * !useNative, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: getOwnPropertySymbols
});

// 19.4.3.5 Symbol.prototype[@@toStringTag]
setTag(Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag($.g.JSON, 'JSON', true);
},{"./$":17,"./$.assert":4,"./$.cof":5,"./$.def":9,"./$.enum-keys":10,"./$.keyof":18,"./$.uid":21,"./$.wks":23}],30:[function(require,module,exports){
require('./es6.array.iterator');
var $           = require('./$')
  , Iterators   = require('./$.iter').Iterators
  , ITERATOR    = require('./$.wks')('iterator')
  , ArrayValues = Iterators.Array
  , NodeList    = $.g.NodeList;
if($.FW && NodeList && !(ITERATOR in NodeList.prototype)){
  $.hide(NodeList.prototype, ITERATOR, ArrayValues);
}
Iterators.NodeList = ArrayValues;
},{"./$":17,"./$.iter":16,"./$.wks":23,"./es6.array.iterator":24}],31:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};
var queue = [];
var draining = false;

function drainQueue() {
    if (draining) {
        return;
    }
    draining = true;
    var currentQueue;
    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        var i = -1;
        while (++i < len) {
            currentQueue[i]();
        }
        len = queue.length;
    }
    draining = false;
}
process.nextTick = function (fun) {
    queue.push(fun);
    if (!draining) {
        setTimeout(drainQueue, 0);
    }
};

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],32:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createJazzInstance = createJazzInstance;
exports.getJazzInstance = getJazzInstance;

var _getDevice = require('./util');

'use strict';

// required for Internet Explorer only
// the require statement has to be put here; if you put it at the entry point (shim.js) it doesn't work (weird quirck in IE?)
require('babelify/node_modules/babel-core/node_modules/core-js/es6/map');
require('babelify/node_modules/babel-core/node_modules/core-js/es6/set');
require('babelify/node_modules/babel-core/node_modules/core-js/es6/symbol');

var jazzPluginInitTime = 100; // milliseconds

var jazzInstanceNumber = 0;
var jazzInstances = new Map();

function createJazzInstance(callback) {

  var id = 'jazz_' + jazzInstanceNumber++ + '' + Date.now();
  var instance = undefined;
  var objRef = undefined,
      activeX = undefined;

  if (_getDevice.getDevice().nodejs === true) {
    objRef = new window.jazzMidi.MIDI();
  } else {
    var o1 = document.createElement('object');
    o1.id = id + 'ie';
    o1.classid = 'CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90';
    activeX = o1;

    var o2 = document.createElement('object');
    o2.id = id;
    o2.type = 'audio/x-jazz';
    o1.appendChild(o2);
    objRef = o2;

    var e = document.createElement('p');
    e.appendChild(document.createTextNode('This page requires the '));

    var a = document.createElement('a');
    a.appendChild(document.createTextNode('Jazz plugin'));
    a.href = 'http://jazz-soft.net/';

    e.appendChild(a);
    e.appendChild(document.createTextNode('.'));
    o2.appendChild(e);

    var insertionPoint = document.getElementById('MIDIPlugin');
    if (!insertionPoint) {
      // Create hidden element
      insertionPoint = document.createElement('div');
      insertionPoint.id = 'MIDIPlugin';
      insertionPoint.style.position = 'absolute';
      insertionPoint.style.visibility = 'hidden';
      insertionPoint.style.left = '-9999px';
      insertionPoint.style.top = '-9999px';
      document.body.appendChild(insertionPoint);
    }
    insertionPoint.appendChild(o1);
  }

  setTimeout(function () {
    if (objRef.isJazz === true) {
      instance = objRef;
    } else if (activeX.isJazz === true) {
      instance = activeX;
    }
    if (instance !== undefined) {
      instance._perfTimeZero = window.performance.now();
      jazzInstances.set(id, instance);
    }
    callback(instance);
  }, jazzPluginInitTime);
}

function getJazzInstance(type, callback) {
  var instance = null;
  var key = type === 'input' ? 'inputInUse' : 'outputInUse';

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = jazzInstances.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var inst = _step.value;

      if (inst[key] !== true) {
        instance = inst;
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  if (instance === null) {
    createJazzInstance(callback);
  } else {
    callback(instance);
  }
}

},{"./util":39,"babelify/node_modules/babel-core/node_modules/core-js/es6/map":1,"babelify/node_modules/babel-core/node_modules/core-js/es6/set":2,"babelify/node_modules/babel-core/node_modules/core-js/es6/symbol":3}],33:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createMIDIAccess = createMIDIAccess;
exports.dispatchEvent = dispatchEvent;
exports.closeAllMIDIInputs = closeAllMIDIInputs;
exports.getMIDIDeviceId = getMIDIDeviceId;

var _createJazzInstance$getJazzInstance = require('./jazz_instance');

var _MIDIInput = require('./midi_input');

var _MIDIOutput = require('./midi_output');

var _MIDIConnectionEvent = require('./midiconnection_event');

var _getDevice$generateUUID = require('./util');

'use strict';

var midiAccess = undefined;
var jazzInstance = undefined;
var midiInputs = new Map();
var midiOutputs = new Map();
var midiInputIds = new Map();
var midiOutputIds = new Map();
var listeners = new Set();

var MIDIAccess = (function () {
  function MIDIAccess(midiInputs, midiOutputs) {
    _classCallCheck(this, MIDIAccess);

    this.sysexEnabled = true;
    this.inputs = midiInputs;
    this.outputs = midiOutputs;
  }

  _createClass(MIDIAccess, [{
    key: 'addEventListener',
    value: function addEventListener(type, listener, useCapture) {
      if (type !== 'statechange') {
        return;
      }
      if (listeners.has(listener) === false) {
        listeners.add(listener);
      }
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, listener, useCapture) {
      if (type !== 'statechange') {
        return;
      }
      if (listeners.has(listener) === true) {
        listeners['delete'](listener);
      }
    }
  }]);

  return MIDIAccess;
})();

function createMIDIAccess() {

  return new Promise(function executor(resolve, reject) {

    if (midiAccess !== undefined) {
      resolve(midiAccess);
      return;
    }

    // if(getDevice().browser === 'ie 9'){
    //   reject({message: 'Only Internet Explorer 10 and above are supported.'})
    //   return;
    // }

    _createJazzInstance$getJazzInstance.createJazzInstance(function (instance) {
      if (instance === undefined) {
        reject({ message: 'No access to MIDI devices: browser does not support the WebMIDI API and the Jazz plugin is not installed.' });
        return;
      }

      jazzInstance = instance;

      createMIDIPorts(function () {
        setupListeners();
        midiAccess = new MIDIAccess(midiInputs, midiOutputs);
        resolve(midiAccess);
      });
    });
  });
}

function createMIDIPorts(callback) {
  var inputs = jazzInstance.MidiInList();
  var outputs = jazzInstance.MidiOutList();
  var numInputs = inputs.length;
  var numOutputs = outputs.length;

  loopCreateMIDIPort(0, numInputs, 'input', inputs, function () {
    loopCreateMIDIPort(0, numOutputs, 'output', outputs, callback);
  });
}

function loopCreateMIDIPort(index, max, type, list, callback) {
  if (index < max) {
    var _name = list[index++];
    createMIDIPort(type, _name, function () {
      loopCreateMIDIPort(index, max, type, list, callback);
    });
  } else {
    callback();
  }
}

function createMIDIPort(type, name, callback) {
  _createJazzInstance$getJazzInstance.getJazzInstance(type, function (instance) {
    var port = undefined;
    var info = [name, '', ''];
    if (type === 'input') {
      if (instance.Support('MidiInInfo')) {
        info = instance.MidiInInfo(name);
      }
      port = new _MIDIInput.MIDIInput(info, instance);
      midiInputs.set(port.id, port);
    } else if (type === 'output') {
      if (instance.Support('MidiOutInfo')) {
        info = instance.MidiOutInfo(name);
      }
      port = new _MIDIOutput.MIDIOutput(info, instance);
      midiOutputs.set(port.id, port);
    }
    callback(port);
  });
}

function getPortByName(ports, name) {
  var port = undefined;
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = ports.values()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      port = _step.value;

      if (port.name === name) {
        break;
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator['return']) {
        _iterator['return']();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return port;
}

function setupListeners() {
  jazzInstance.OnDisconnectMidiIn(function (name) {
    var port = getPortByName(midiInputs, name);
    if (port !== undefined) {
      port.state = 'disconnected';
      port.close();
      port._jazzInstance.inputInUse = false;
      midiInputs['delete'](port.id);
      dispatchEvent(port);
    }
  });

  jazzInstance.OnDisconnectMidiOut(function (name) {
    var port = getPortByName(midiOutputs, name);
    if (port !== undefined) {
      port.state = 'disconnected';
      port.close();
      port._jazzInstance.outputInUse = false;
      midiOutputs['delete'](port.id);
      dispatchEvent(port);
    }
  });

  jazzInstance.OnConnectMidiIn(function (name) {
    createMIDIPort('input', name, function (port) {
      dispatchEvent(port);
    });
  });

  jazzInstance.OnConnectMidiOut(function (name) {
    createMIDIPort('output', name, function (port) {
      dispatchEvent(port);
    });
  });
}

function dispatchEvent(port) {

  port.dispatchEvent(new _MIDIConnectionEvent.MIDIConnectionEvent(port, port));

  var evt = new _MIDIConnectionEvent.MIDIConnectionEvent(midiAccess, port);

  if (typeof midiAccess.onstatechange === 'function') {
    midiAccess.onstatechange(evt);
  }
  var _iteratorNormalCompletion2 = true;
  var _didIteratorError2 = false;
  var _iteratorError2 = undefined;

  try {
    for (var _iterator2 = listeners[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
      var listener = _step2.value;

      listener(evt);
    }
  } catch (err) {
    _didIteratorError2 = true;
    _iteratorError2 = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion2 && _iterator2['return']) {
        _iterator2['return']();
      }
    } finally {
      if (_didIteratorError2) {
        throw _iteratorError2;
      }
    }
  }
}

function closeAllMIDIInputs() {
  midiInputs.forEach(function (input) {
    //input.close();
    input._jazzInstance.MidiInClose();
  });
}

function getMIDIDeviceId(name, type) {
  var id = undefined;
  if (type === 'input') {
    id = midiInputIds.get(name);
    if (id === undefined) {
      id = _getDevice$generateUUID.generateUUID();
      midiInputIds.set(name, id);
    }
  } else if (type === 'output') {
    id = midiOutputIds.get(name);
    if (id === undefined) {
      id = _getDevice$generateUUID.generateUUID();
      midiOutputIds.set(name, id);
    }
  }
  return id;
}

},{"./jazz_instance":32,"./midi_input":34,"./midi_output":35,"./midiconnection_event":36,"./util":39}],34:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getDevice = require('./util');

var _MIDIMessageEvent = require('./midimessage_event');

var _MIDIConnectionEvent = require('./midiconnection_event');

var _dispatchEvent$getMIDIDeviceId = require('./midi_access');

'use strict';

var midiProc = undefined;
var nodejs = _getDevice.getDevice().nodejs;

var MIDIInput = (function () {
  function MIDIInput(info, instance) {
    _classCallCheck(this, MIDIInput);

    this.id = _dispatchEvent$getMIDIDeviceId.getMIDIDeviceId(info[0], 'input');
    this.name = info[0];
    this.manufacturer = info[1];
    this.version = info[2];
    this.type = 'input';
    this.state = 'connected';
    this.connection = 'pending';

    this.onstatechange = null;
    this._onmidimessage = null;
    Object.defineProperty(this, 'onmidimessage', {
      set: function set(value) {
        this._onmidimessage = value;
        if (typeof value === 'function') {
          this.open();
        }
      }
    });

    this._listeners = new Map().set('midimessage', new Set()).set('statechange', new Set());
    this._inLongSysexMessage = false;
    this._sysexBuffer = new Uint8Array();

    this._jazzInstance = instance;
    this._jazzInstance.inputInUse = true;
    if (_getDevice.getDevice().platform === 'linux') {
      this._jazzInstance.MidiInOpen(this.name, midiProc.bind(this));
    }
  }

  _createClass(MIDIInput, [{
    key: 'addEventListener',
    value: function addEventListener(type, listener, useCapture) {
      var listeners = this._listeners.get(type);
      if (listeners === undefined) {
        return;
      }

      if (listeners.has(listener) === false) {
        listeners.add(listener);
      }
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, listener, useCapture) {
      var listeners = this._listeners.get(type);
      if (listeners === undefined) {
        return;
      }

      if (listeners.has(listener) === false) {
        listeners['delete'](listener);
      }
    }
  }, {
    key: 'preventDefault',
    value: function preventDefault() {
      this._pvtDef = true;
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(evt) {
      this._pvtDef = false;
      var listeners = this._listeners.get(evt.type);
      listeners.forEach(function (listener) {
        listener(evt);
      });

      if (evt.type === 'midimessage') {
        if (this._onmidimessage !== null) {
          this._onmidimessage(evt);
        }
      } else if (evt.type === 'statechange') {
        if (this.onstatechange !== null) {
          this.onstatechange(evt);
        }
      }

      return this._pvtDef;
    }
  }, {
    key: 'open',
    value: function open() {
      if (this.connection === 'open') {
        return;
      }
      if (_getDevice.getDevice().platform !== 'linux') {
        this._jazzInstance.MidiInOpen(this.name, midiProc.bind(this));
      }
      this.connection = 'open';
      _dispatchEvent$getMIDIDeviceId.dispatchEvent(this); // dispatch event via MIDIAccess
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.connection === 'closed') {
        return;
      }
      if (_getDevice.getDevice().platform !== 'linux') {
        this._jazzInstance.MidiInClose();
      }
      this.connection = 'closed';
      _dispatchEvent$getMIDIDeviceId.dispatchEvent(this); // dispatch event via MIDIAccess
      this._onmidimessage = null;
      this.onstatechange = null;
      this._listeners.get('midimessage').clear();
      this._listeners.get('statechange').clear();
    }
  }, {
    key: '_appendToSysexBuffer',
    value: function _appendToSysexBuffer(data) {
      var oldLength = this._sysexBuffer.length;
      var tmpBuffer = new Uint8Array(oldLength + data.length);
      tmpBuffer.set(this._sysexBuffer);
      tmpBuffer.set(data, oldLength);
      this._sysexBuffer = tmpBuffer;
    }
  }, {
    key: '_bufferLongSysex',
    value: function _bufferLongSysex(data, initialOffset) {
      var j = initialOffset;
      while (j < data.length) {
        if (data[j] == 247) {
          // end of sysex!
          j++;
          this._appendToSysexBuffer(data.slice(initialOffset, j));
          return j;
        }
        j++;
      }
      // didn't reach the end; just tack it on.
      this._appendToSysexBuffer(data.slice(initialOffset, j));
      this._inLongSysexMessage = true;
      return j;
    }
  }]);

  return MIDIInput;
})();

exports.MIDIInput = MIDIInput;

midiProc = function (timestamp, data) {
  var length = 0;
  var i = undefined;
  var isSysexMessage = false;

  // Jazz sometimes passes us multiple messages at once, so we need to parse them out
  // and pass them one at a time.

  for (i = 0; i < data.length; i += length) {
    var isValidMessage = true;
    if (this._inLongSysexMessage) {
      i = this._bufferLongSysex(data, i);
      if (data[i - 1] != 247) {
        // ran off the end without hitting the end of the sysex message
        return;
      }
      isSysexMessage = true;
    } else {
      isSysexMessage = false;
      switch (data[i] & 240) {
        case 0:
          // Chew up spurious 0x00 bytes.  Fixes a Windows problem.
          length = 1;
          isValidMessage = false;
          break;

        case 128: // note off
        case 144: // note on
        case 160: // polyphonic aftertouch
        case 176: // control change
        case 224:
          // channel mode
          length = 3;
          break;

        case 192: // program change
        case 208:
          // channel aftertouch
          length = 2;
          break;

        case 240:
          switch (data[i]) {
            case 240:
              // letiable-length sysex.
              i = this._bufferLongSysex(data, i);
              if (data[i - 1] != 247) {
                // ran off the end without hitting the end of the sysex message
                return;
              }
              isSysexMessage = true;
              break;

            case 241: // MTC quarter frame
            case 243:
              // song select
              length = 2;
              break;

            case 242:
              // song position pointer
              length = 3;
              break;

            default:
              length = 1;
              break;
          }
          break;
      }
    }
    if (!isValidMessage) {
      continue;
    }

    var evt = {};
    evt.receivedTime = parseFloat(timestamp.toString()) + this._jazzInstance._perfTimeZero;

    if (isSysexMessage || this._inLongSysexMessage) {
      evt.data = new Uint8Array(this._sysexBuffer);
      this._sysexBuffer = new Uint8Array(0);
      this._inLongSysexMessage = false;
    } else {
      evt.data = new Uint8Array(data.slice(i, length + i));
    }

    if (nodejs) {
      if (this._onmidimessage) {
        this._onmidimessage(evt);
      }
    } else {
      var e = new _MIDIMessageEvent.MIDIMessageEvent(this, evt.data, evt.receivedTime);
      this.dispatchEvent(e);
    }
  }
};

},{"./midi_access":33,"./midiconnection_event":36,"./midimessage_event":37,"./util":39}],35:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getDevice = require('./util');

var _dispatchEvent$getMIDIDeviceId = require('./midi_access');

'use strict';

var MIDIOutput = (function () {
  function MIDIOutput(info, instance) {
    _classCallCheck(this, MIDIOutput);

    this.id = _dispatchEvent$getMIDIDeviceId.getMIDIDeviceId(info[0], 'output');
    this.name = info[0];
    this.manufacturer = info[1];
    this.version = info[2];
    this.type = 'output';
    this.state = 'connected';
    this.connection = 'pending';
    this.onmidimessage = null;
    this.onstatechange = null;

    this._listeners = new Set();
    this._inLongSysexMessage = false;
    this._sysexBuffer = new Uint8Array();

    this._jazzInstance = instance;
    this._jazzInstance.outputInUse = true;
    if (_getDevice.getDevice().platform === 'linux') {
      this._jazzInstance.MidiOutOpen(this.name);
    }
  }

  _createClass(MIDIOutput, [{
    key: 'open',
    value: function open() {
      if (this.connection === 'open') {
        return;
      }
      if (_getDevice.getDevice().platform !== 'linux') {
        this._jazzInstance.MidiOutOpen(this.name);
      }
      this.connection = 'open';
      _dispatchEvent$getMIDIDeviceId.dispatchEvent(this); // dispatch event via MIDIAccess
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.connection === 'closed') {
        return;
      }
      if (_getDevice.getDevice().platform !== 'linux') {
        this._jazzInstance.MidiOutClose();
      }
      this.connection = 'closed';
      _dispatchEvent$getMIDIDeviceId.dispatchEvent(this); // dispatch event via MIDIAccess
      this.onstatechange = null;
      this._listeners.clear();
    }
  }, {
    key: 'send',
    value: function send(data, timestamp) {
      var _this = this;

      var delayBeforeSend = 0;

      if (data.length === 0) {
        return false;
      }

      if (timestamp) {
        delayBeforeSend = Math.floor(timestamp - window.performance.now());
      }

      if (timestamp && delayBeforeSend > 1) {
        window.setTimeout(function () {
          _this._jazzInstance.MidiOutLong(data);
        }, delayBeforeSend);
      } else {
        this._jazzInstance.MidiOutLong(data);
      }
      return true;
    }
  }, {
    key: 'addEventListener',
    value: function addEventListener(type, listener, useCapture) {
      if (type !== 'statechange') {
        return;
      }

      if (this._listeners.has(listener) === false) {
        this._listeners.add(listener);
      }
    }
  }, {
    key: 'removeEventListener',
    value: function removeEventListener(type, listener, useCapture) {
      if (type !== 'statechange') {
        return;
      }

      if (this._listeners.has(listener) === false) {
        this._listeners['delete'](listener);
      }
    }
  }, {
    key: 'dispatchEvent',
    value: function dispatchEvent(evt) {
      this._listeners.forEach(function (listener) {
        listener(evt);
      });

      if (this.onstatechange !== null) {
        this.onstatechange(evt);
      }
    }
  }]);

  return MIDIOutput;
})();

exports.MIDIOutput = MIDIOutput;

},{"./midi_access":33,"./util":39}],36:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});
'use strict';

var MIDIConnectionEvent = function MIDIConnectionEvent(midiAccess, port) {
  _classCallCheck(this, MIDIConnectionEvent);

  this.bubbles = false;
  this.cancelBubble = false;
  this.cancelable = false;
  this.currentTarget = midiAccess;
  this.defaultPrevented = false;
  this.eventPhase = 0;
  this.path = [];
  this.port = port;
  this.returnValue = true;
  this.srcElement = midiAccess;
  this.target = midiAccess;
  this.timeStamp = Date.now();
  this.type = 'statechange';
};

exports.MIDIConnectionEvent = MIDIConnectionEvent;

},{}],37:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});
'use strict';

var MIDIMessageEvent = function MIDIMessageEvent(port, data, receivedTime) {
  _classCallCheck(this, MIDIMessageEvent);

  this.bubbles = false;
  this.cancelBubble = false;
  this.cancelable = false;
  this.currentTarget = port;
  this.data = data;
  this.defaultPrevented = false;
  this.eventPhase = 0;
  this.path = [];
  this.receivedTime = receivedTime;
  this.returnValue = true;
  this.srcElement = port;
  this.target = port;
  this.timeStamp = Date.now();
  this.type = 'midimessage';
};

exports.MIDIMessageEvent = MIDIMessageEvent;

},{}],38:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createMIDIAccess$closeAllMIDIInputs = require('./midi_access');

var _polyfill$getDevice = require('./util');

'use strict';

var midiAccess = undefined;

(function () {
  if (!window.navigator.requestMIDIAccess) {
    _polyfill$getDevice.polyfill();
    window.navigator.requestMIDIAccess = function () {
      if (midiAccess === undefined) {
        midiAccess = _createMIDIAccess$closeAllMIDIInputs.createMIDIAccess();
      }
      return midiAccess;
    };
    if (_polyfill$getDevice.getDevice().nodejs === true) {
      window.navigator.close = function () {
        // Need to close MIDI input ports, otherwise Node.js will wait for MIDI input forever.
        _createMIDIAccess$closeAllMIDIInputs.closeAllMIDIInputs();
      };
    }
  }
})();

},{"./midi_access":33,"./util":39}],39:[function(require,module,exports){
(function (process,__dirname){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getDevice = getDevice;
exports.polyfillPerformance = polyfillPerformance;
exports.generateUUID = generateUUID;
exports.polyfillPromise = polyfillPromise;

// credits: https://gist.github.com/1057924
exports.polyfillTypedArrays = polyfillTypedArrays;
exports.polyfill = polyfill;
'use strict';

var device = undefined;

function getDevice() {

  if (device !== undefined) {
    return device;
  }

  var platform = 'undetected',
      browser = 'undetected',
      nodejs = false;

  if (navigator === undefined) {
    nodejs = typeof __dirname !== 'undefined' && window.jazzMidi;
    if (nodejs === true) {
      platform = process.platform;
    }
    device = {
      platform: platform,
      browser: false,
      nodejs: nodejs,
      mobile: platform === 'ios' || platform === 'android'
    };
    return device;
  }

  var ua = navigator.userAgent;

  if (ua.match(/(iPad|iPhone|iPod)/g)) {
    platform = 'ios';
  } else if (ua.indexOf('Android') !== -1) {
    platform = 'android';
  } else if (ua.indexOf('Linux') !== -1) {
    platform = 'linux';
  } else if (ua.indexOf('Macintosh') !== -1) {
    platform = 'osx';
  } else if (ua.indexOf('Windows') !== -1) {
    platform = 'windows';
  }

  if (ua.indexOf('Chrome') !== -1) {
    // chrome, chromium and canary
    browser = 'chrome';

    if (ua.indexOf('OPR') !== -1) {
      browser = 'opera';
    } else if (ua.indexOf('Chromium') !== -1) {
      browser = 'chromium';
    }
  } else if (ua.indexOf('Safari') !== -1) {
    browser = 'safari';
  } else if (ua.indexOf('Firefox') !== -1) {
    browser = 'firefox';
  } else if (ua.indexOf('Trident') !== -1) {
    browser = 'ie';
    if (ua.indexOf('MSIE 9') !== -1) {
      browser = 'ie 9';
    }
  }

  if (platform === 'ios') {
    if (ua.indexOf('CriOS') !== -1) {
      browser = 'chrome';
    }
  }

  device = {
    platform: platform,
    browser: browser,
    mobile: platform === 'ios' || platform === 'android',
    nodejs: false
  };
  return device;
}

function polyfillPerformance() {

  if (window.performance === undefined) {
    window.performance = {};
  }

  Date.now = Date.now || function () {
    return new Date().getTime();
  };

  if (window.performance.now === undefined) {
    (function () {

      var nowOffset = Date.now();

      if (performance.timing !== undefined && performance.timing.navigationStart !== undefined) {
        nowOffset = performance.timing.navigationStart;
      }

      window.performance.now = function now() {
        return Date.now() - nowOffset;
      };
    })();
  }
}

function generateUUID() {
  var d = new Date().getTime();
  var uuid = new Array(64).join('x');; //'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  uuid = uuid.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : r & 3 | 8).toString(16).toUpperCase();
  });
  return uuid;
}

function polyfillPromise() {
  if (typeof window.Promise !== 'function') {

    window.Promise = function (executor) {
      this.executor = executor;
    };

    Promise.prototype.then = function (accept, reject) {
      if (typeof accept !== 'function') {
        accept = function () {};
      }
      if (typeof reject !== 'function') {
        reject = function () {};
      }
      this.executor(accept, reject);
    };
  }
}

function polyfillTypedArrays() {
  try {
    var a = new Uint8Array(1);
    return; //no need
  } catch (e) {}

  function subarray(start, end) {
    return this.slice(start, end);
  }

  function set_(array, offset) {
    if (arguments.length < 2) offset = 0;
    for (var i = 0, n = array.length; i < n; ++i, ++offset) {
      this[offset] = array[i] & 255;
    }
  }

  // we need typed arrays
  function TypedArray(arg1) {
    var result;
    if (typeof arg1 === 'number') {
      result = new Array(arg1);
      for (var i = 0; i < arg1; ++i) {
        result[i] = 0;
      }
    } else if (typeof arg1 === 'array') {
      result = arg1.slice(0);
    } else {
      result = new Array();
    }
    result.subarray = subarray;
    result.buffer = result;
    result.byteLength = result.length;
    result.set = set_;
    if (typeof arg1 === 'object' && arg1.buffer) {
      result.buffer = arg1.buffer;
    }

    return result;
  }

  window.Uint8Array = TypedArray;
  window.Uint32Array = TypedArray;
  window.Int32Array = TypedArray;
}

function polyfill() {
  var device = getDevice();
  if (device.browser.indexOf('ie') !== -1) {
    polyfillPromise();
    polyfillTypedArrays();
  }
  polyfillPerformance();
}

}).call(this,require('_process'),"/src")

},{"_process":31}]},{},[38])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvZXM2L21hcC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9lczYvc2V0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL2VzNi9zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmFzc2VydC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5jb2xsZWN0aW9uLXN0cm9uZy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY3R4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5kZWYuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmVudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuZm9yLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5mdy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuaXRlci1jYWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5pdGVyLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuaXRlci1kZXRlY3QuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLml0ZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5rZXlvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc3BlY2llcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC51aWQuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnVuc2NvcGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLndrcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5tYXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvamF6el9pbnN0YW5jZS5qcyIsIi9Vc2Vycy9hYnVkYWFuL3dvcmtzcGFjZS9XZWJNSURJQVBJU2hpbV9lczYvc3JjL21pZGlfYWNjZXNzLmpzIiwiL1VzZXJzL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaV9pbnB1dC5qcyIsIi9Vc2Vycy9hYnVkYWFuL3dvcmtzcGFjZS9XZWJNSURJQVBJU2hpbV9lczYvc3JjL21pZGlfb3V0cHV0LmpzIiwiL1VzZXJzL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaWNvbm5lY3Rpb25fZXZlbnQuanMiLCIvVXNlcnMvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9taWRpbWVzc2FnZV9ldmVudC5qcyIsIi9Vc2Vycy9hYnVkYWFuL3dvcmtzcGFjZS9XZWJNSURJQVBJU2hpbV9lczYvc3JjL3NoaW0uanMiLCIvVXNlcnMvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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RSxDQUFDO0FBQ3pCLE1BQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUM7QUFDckMsbUJBQWUsRUFBRSxDQUFDO0FBQ2xCLHVCQUFtQixFQUFFLENBQUM7R0FDdkI7QUFDRCxxQkFBbUIsRUFBRSxDQUFDO0NBQ3ZCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInJlcXVpcmUoJy4uL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcnKTtcclxucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XHJcbnJlcXVpcmUoJy4uL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xyXG5yZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5tYXAnKTtcclxubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzLyQnKS5jb3JlLk1hcDsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XHJcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xyXG5yZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcclxucmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc2V0Jyk7XHJcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy8kJykuY29yZS5TZXQ7IiwicmVxdWlyZSgnLi4vbW9kdWxlcy9lczYuc3ltYm9sJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vbW9kdWxlcy8kJykuY29yZS5TeW1ib2w7IiwidmFyICQgPSByZXF1aXJlKCcuLyQnKTtcclxuZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbXNnMSwgbXNnMil7XHJcbiAgaWYoIWNvbmRpdGlvbil0aHJvdyBUeXBlRXJyb3IobXNnMiA/IG1zZzEgKyBtc2cyIDogbXNnMSk7XHJcbn1cclxuYXNzZXJ0LmRlZiA9ICQuYXNzZXJ0RGVmaW5lZDtcclxuYXNzZXJ0LmZuID0gZnVuY3Rpb24oaXQpe1xyXG4gIGlmKCEkLmlzRnVuY3Rpb24oaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XHJcbiAgcmV0dXJuIGl0O1xyXG59O1xyXG5hc3NlcnQub2JqID0gZnVuY3Rpb24oaXQpe1xyXG4gIGlmKCEkLmlzT2JqZWN0KGl0KSl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhbiBvYmplY3QhJyk7XHJcbiAgcmV0dXJuIGl0O1xyXG59O1xyXG5hc3NlcnQuaW5zdCA9IGZ1bmN0aW9uKGl0LCBDb25zdHJ1Y3RvciwgbmFtZSl7XHJcbiAgaWYoIShpdCBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSl0aHJvdyBUeXBlRXJyb3IobmFtZSArIFwiOiB1c2UgdGhlICduZXcnIG9wZXJhdG9yIVwiKTtcclxuICByZXR1cm4gaXQ7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gYXNzZXJ0OyIsInZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBUQUcgICAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKVxyXG4gICwgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcclxuZnVuY3Rpb24gY29mKGl0KXtcclxuICByZXR1cm4gdG9TdHJpbmcuY2FsbChpdCkuc2xpY2UoOCwgLTEpO1xyXG59XHJcbmNvZi5jbGFzc29mID0gZnVuY3Rpb24oaXQpe1xyXG4gIHZhciBPLCBUO1xyXG4gIHJldHVybiBpdCA9PSB1bmRlZmluZWQgPyBpdCA9PT0gdW5kZWZpbmVkID8gJ1VuZGVmaW5lZCcgOiAnTnVsbCdcclxuICAgIDogdHlwZW9mIChUID0gKE8gPSBPYmplY3QoaXQpKVtUQUddKSA9PSAnc3RyaW5nJyA/IFQgOiBjb2YoTyk7XHJcbn07XHJcbmNvZi5zZXQgPSBmdW5jdGlvbihpdCwgdGFnLCBzdGF0KXtcclxuICBpZihpdCAmJiAhJC5oYXMoaXQgPSBzdGF0ID8gaXQgOiBpdC5wcm90b3R5cGUsIFRBRykpJC5oaWRlKGl0LCBUQUcsIHRhZyk7XHJcbn07XHJcbm1vZHVsZS5leHBvcnRzID0gY29mOyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGN0eCAgICAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXHJcbiAgLCBzYWZlICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlXHJcbiAgLCBhc3NlcnQgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxyXG4gICwgZm9yT2YgICAgPSByZXF1aXJlKCcuLyQuZm9yLW9mJylcclxuICAsIHN0ZXAgICAgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5zdGVwXHJcbiAgLCBoYXMgICAgICA9ICQuaGFzXHJcbiAgLCBzZXQgICAgICA9ICQuc2V0XHJcbiAgLCBpc09iamVjdCA9ICQuaXNPYmplY3RcclxuICAsIGhpZGUgICAgID0gJC5oaWRlXHJcbiAgLCBpc0Zyb3plbiA9IE9iamVjdC5pc0Zyb3plbiB8fCAkLmNvcmUuT2JqZWN0LmlzRnJvemVuXHJcbiAgLCBJRCAgICAgICA9IHNhZmUoJ2lkJylcclxuICAsIE8xICAgICAgID0gc2FmZSgnTzEnKVxyXG4gICwgTEFTVCAgICAgPSBzYWZlKCdsYXN0JylcclxuICAsIEZJUlNUICAgID0gc2FmZSgnZmlyc3QnKVxyXG4gICwgSVRFUiAgICAgPSBzYWZlKCdpdGVyJylcclxuICAsIFNJWkUgICAgID0gJC5ERVNDID8gc2FmZSgnc2l6ZScpIDogJ3NpemUnXHJcbiAgLCBpZCAgICAgICA9IDA7XHJcblxyXG5mdW5jdGlvbiBmYXN0S2V5KGl0LCBjcmVhdGUpe1xyXG4gIC8vIHJldHVybiBwcmltaXRpdmUgd2l0aCBwcmVmaXhcclxuICBpZighaXNPYmplY3QoaXQpKXJldHVybiAodHlwZW9mIGl0ID09ICdzdHJpbmcnID8gJ1MnIDogJ1AnKSArIGl0O1xyXG4gIC8vIGNhbid0IHNldCBpZCB0byBmcm96ZW4gb2JqZWN0XHJcbiAgaWYoaXNGcm96ZW4oaXQpKXJldHVybiAnRic7XHJcbiAgaWYoIWhhcyhpdCwgSUQpKXtcclxuICAgIC8vIG5vdCBuZWNlc3NhcnkgdG8gYWRkIGlkXHJcbiAgICBpZighY3JlYXRlKXJldHVybiAnRSc7XHJcbiAgICAvLyBhZGQgbWlzc2luZyBvYmplY3QgaWRcclxuICAgIGhpZGUoaXQsIElELCArK2lkKTtcclxuICAvLyByZXR1cm4gb2JqZWN0IGlkIHdpdGggcHJlZml4XHJcbiAgfSByZXR1cm4gJ08nICsgaXRbSURdO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFbnRyeSh0aGF0LCBrZXkpe1xyXG4gIC8vIGZhc3QgY2FzZVxyXG4gIHZhciBpbmRleCA9IGZhc3RLZXkoa2V5KSwgZW50cnk7XHJcbiAgaWYoaW5kZXggIT0gJ0YnKXJldHVybiB0aGF0W08xXVtpbmRleF07XHJcbiAgLy8gZnJvemVuIG9iamVjdCBjYXNlXHJcbiAgZm9yKGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xyXG4gICAgaWYoZW50cnkuayA9PSBrZXkpcmV0dXJuIGVudHJ5O1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKE5BTUUsIElTX01BUCwgQURERVIpe1xyXG4gICAgZnVuY3Rpb24gQygpe1xyXG4gICAgICB2YXIgdGhhdCAgICAgPSBhc3NlcnQuaW5zdCh0aGlzLCBDLCBOQU1FKVxyXG4gICAgICAgICwgaXRlcmFibGUgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgIHNldCh0aGF0LCBPMSwgJC5jcmVhdGUobnVsbCkpO1xyXG4gICAgICBzZXQodGhhdCwgU0laRSwgMCk7XHJcbiAgICAgIHNldCh0aGF0LCBMQVNULCB1bmRlZmluZWQpO1xyXG4gICAgICBzZXQodGhhdCwgRklSU1QsIHVuZGVmaW5lZCk7XHJcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGF0W0FEREVSXSwgdGhhdCk7XHJcbiAgICB9XHJcbiAgICAkLm1peChDLnByb3RvdHlwZSwge1xyXG4gICAgICAvLyAyMy4xLjMuMSBNYXAucHJvdG90eXBlLmNsZWFyKClcclxuICAgICAgLy8gMjMuMi4zLjIgU2V0LnByb3RvdHlwZS5jbGVhcigpXHJcbiAgICAgIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpe1xyXG4gICAgICAgIGZvcih2YXIgdGhhdCA9IHRoaXMsIGRhdGEgPSB0aGF0W08xXSwgZW50cnkgPSB0aGF0W0ZJUlNUXTsgZW50cnk7IGVudHJ5ID0gZW50cnkubil7XHJcbiAgICAgICAgICBlbnRyeS5yID0gdHJ1ZTtcclxuICAgICAgICAgIGlmKGVudHJ5LnApZW50cnkucCA9IGVudHJ5LnAubiA9IHVuZGVmaW5lZDtcclxuICAgICAgICAgIGRlbGV0ZSBkYXRhW2VudHJ5LmldO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGF0W0ZJUlNUXSA9IHRoYXRbTEFTVF0gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgdGhhdFtTSVpFXSA9IDA7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDIzLjEuMy4zIE1hcC5wcm90b3R5cGUuZGVsZXRlKGtleSlcclxuICAgICAgLy8gMjMuMi4zLjQgU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXHJcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgIHZhciB0aGF0ICA9IHRoaXNcclxuICAgICAgICAgICwgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpO1xyXG4gICAgICAgIGlmKGVudHJ5KXtcclxuICAgICAgICAgIHZhciBuZXh0ID0gZW50cnkublxyXG4gICAgICAgICAgICAsIHByZXYgPSBlbnRyeS5wO1xyXG4gICAgICAgICAgZGVsZXRlIHRoYXRbTzFdW2VudHJ5LmldO1xyXG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XHJcbiAgICAgICAgICBpZihwcmV2KXByZXYubiA9IG5leHQ7XHJcbiAgICAgICAgICBpZihuZXh0KW5leHQucCA9IHByZXY7XHJcbiAgICAgICAgICBpZih0aGF0W0ZJUlNUXSA9PSBlbnRyeSl0aGF0W0ZJUlNUXSA9IG5leHQ7XHJcbiAgICAgICAgICBpZih0aGF0W0xBU1RdID09IGVudHJ5KXRoYXRbTEFTVF0gPSBwcmV2O1xyXG4gICAgICAgICAgdGhhdFtTSVpFXS0tO1xyXG4gICAgICAgIH0gcmV0dXJuICEhZW50cnk7XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDIzLjIuMy42IFNldC5wcm90b3R5cGUuZm9yRWFjaChjYWxsYmFja2ZuLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gICAgICAvLyAyMy4xLjMuNSBNYXAucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgICAgZm9yRWFjaDogZnVuY3Rpb24gZm9yRWFjaChjYWxsYmFja2ZuIC8qLCB0aGF0ID0gdW5kZWZpbmVkICovKXtcclxuICAgICAgICB2YXIgZiA9IGN0eChjYWxsYmFja2ZuLCBhcmd1bWVudHNbMV0sIDMpXHJcbiAgICAgICAgICAsIGVudHJ5O1xyXG4gICAgICAgIHdoaWxlKGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogdGhpc1tGSVJTVF0pe1xyXG4gICAgICAgICAgZihlbnRyeS52LCBlbnRyeS5rLCB0aGlzKTtcclxuICAgICAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxyXG4gICAgICAgICAgd2hpbGUoZW50cnkgJiYgZW50cnkucillbnRyeSA9IGVudHJ5LnA7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICAvLyAyMy4xLjMuNyBNYXAucHJvdG90eXBlLmhhcyhrZXkpXHJcbiAgICAgIC8vIDIzLjIuMy43IFNldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxyXG4gICAgICBoYXM6IGZ1bmN0aW9uIGhhcyhrZXkpe1xyXG4gICAgICAgIHJldHVybiAhIWdldEVudHJ5KHRoaXMsIGtleSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgaWYoJC5ERVNDKSQuc2V0RGVzYyhDLnByb3RvdHlwZSwgJ3NpemUnLCB7XHJcbiAgICAgIGdldDogZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gYXNzZXJ0LmRlZih0aGlzW1NJWkVdKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gQztcclxuICB9LFxyXG4gIGRlZjogZnVuY3Rpb24odGhhdCwga2V5LCB2YWx1ZSl7XHJcbiAgICB2YXIgZW50cnkgPSBnZXRFbnRyeSh0aGF0LCBrZXkpXHJcbiAgICAgICwgcHJldiwgaW5kZXg7XHJcbiAgICAvLyBjaGFuZ2UgZXhpc3RpbmcgZW50cnlcclxuICAgIGlmKGVudHJ5KXtcclxuICAgICAgZW50cnkudiA9IHZhbHVlO1xyXG4gICAgLy8gY3JlYXRlIG5ldyBlbnRyeVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhhdFtMQVNUXSA9IGVudHJ5ID0ge1xyXG4gICAgICAgIGk6IGluZGV4ID0gZmFzdEtleShrZXksIHRydWUpLCAvLyA8LSBpbmRleFxyXG4gICAgICAgIGs6IGtleSwgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBrZXlcclxuICAgICAgICB2OiB2YWx1ZSwgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gdmFsdWVcclxuICAgICAgICBwOiBwcmV2ID0gdGhhdFtMQVNUXSwgICAgICAgICAgLy8gPC0gcHJldmlvdXMgZW50cnlcclxuICAgICAgICBuOiB1bmRlZmluZWQsICAgICAgICAgICAgICAgICAgLy8gPC0gbmV4dCBlbnRyeVxyXG4gICAgICAgIHI6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSByZW1vdmVkXHJcbiAgICAgIH07XHJcbiAgICAgIGlmKCF0aGF0W0ZJUlNUXSl0aGF0W0ZJUlNUXSA9IGVudHJ5O1xyXG4gICAgICBpZihwcmV2KXByZXYubiA9IGVudHJ5O1xyXG4gICAgICB0aGF0W1NJWkVdKys7XHJcbiAgICAgIC8vIGFkZCB0byBpbmRleFxyXG4gICAgICBpZihpbmRleCAhPSAnRicpdGhhdFtPMV1baW5kZXhdID0gZW50cnk7XHJcbiAgICB9IHJldHVybiB0aGF0O1xyXG4gIH0sXHJcbiAgZ2V0RW50cnk6IGdldEVudHJ5LFxyXG4gIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxyXG4gIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcclxuICBzZXRJdGVyOiBmdW5jdGlvbihDLCBOQU1FLCBJU19NQVApe1xyXG4gICAgcmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoQywgTkFNRSwgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xyXG4gICAgICBzZXQodGhpcywgSVRFUiwge286IGl0ZXJhdGVkLCBrOiBraW5kfSk7XHJcbiAgICB9LCBmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXHJcbiAgICAgICAgLCBraW5kICA9IGl0ZXIua1xyXG4gICAgICAgICwgZW50cnkgPSBpdGVyLmw7XHJcbiAgICAgIC8vIHJldmVydCB0byB0aGUgbGFzdCBleGlzdGluZyBlbnRyeVxyXG4gICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcclxuICAgICAgLy8gZ2V0IG5leHQgZW50cnlcclxuICAgICAgaWYoIWl0ZXIubyB8fCAhKGl0ZXIubCA9IGVudHJ5ID0gZW50cnkgPyBlbnRyeS5uIDogaXRlci5vW0ZJUlNUXSkpe1xyXG4gICAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXHJcbiAgICAgICAgaXRlci5vID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHJldHVybiBzdGVwKDEpO1xyXG4gICAgICB9XHJcbiAgICAgIC8vIHJldHVybiBzdGVwIGJ5IGtpbmRcclxuICAgICAgaWYoa2luZCA9PSAna2V5cycgIClyZXR1cm4gc3RlcCgwLCBlbnRyeS5rKTtcclxuICAgICAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBlbnRyeS52KTtcclxuICAgICAgcmV0dXJuIHN0ZXAoMCwgW2VudHJ5LmssIGVudHJ5LnZdKTtcclxuICAgIH0sIElTX01BUCA/ICdlbnRyaWVzJyA6ICd2YWx1ZXMnICwgIUlTX01BUCwgdHJ1ZSk7XHJcbiAgfVxyXG59OyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBCVUdHWSA9IHJlcXVpcmUoJy4vJC5pdGVyJykuQlVHR1lcclxuICAsIGZvck9mID0gcmVxdWlyZSgnLi8kLmZvci1vZicpXHJcbiAgLCBzcGVjaWVzID0gcmVxdWlyZSgnLi8kLnNwZWNpZXMnKVxyXG4gICwgYXNzZXJ0SW5zdGFuY2UgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JykuaW5zdDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIElTX1dFQUspe1xyXG4gIHZhciBCYXNlICA9ICQuZ1tOQU1FXVxyXG4gICAgLCBDICAgICA9IEJhc2VcclxuICAgICwgQURERVIgPSBJU19NQVAgPyAnc2V0JyA6ICdhZGQnXHJcbiAgICAsIHByb3RvID0gQyAmJiBDLnByb3RvdHlwZVxyXG4gICAgLCBPICAgICA9IHt9O1xyXG4gIGZ1bmN0aW9uIGZpeE1ldGhvZChLRVksIENIQUlOKXtcclxuICAgIHZhciBtZXRob2QgPSBwcm90b1tLRVldO1xyXG4gICAgaWYoJC5GVylwcm90b1tLRVldID0gZnVuY3Rpb24oYSwgYil7XHJcbiAgICAgIHZhciByZXN1bHQgPSBtZXRob2QuY2FsbCh0aGlzLCBhID09PSAwID8gMCA6IGEsIGIpO1xyXG4gICAgICByZXR1cm4gQ0hBSU4gPyB0aGlzIDogcmVzdWx0O1xyXG4gICAgfTtcclxuICB9XHJcbiAgaWYoISQuaXNGdW5jdGlvbihDKSB8fCAhKElTX1dFQUsgfHwgIUJVR0dZICYmIHByb3RvLmZvckVhY2ggJiYgcHJvdG8uZW50cmllcykpe1xyXG4gICAgLy8gY3JlYXRlIGNvbGxlY3Rpb24gY29uc3RydWN0b3JcclxuICAgIEMgPSBjb21tb24uZ2V0Q29uc3RydWN0b3IoTkFNRSwgSVNfTUFQLCBBRERFUik7XHJcbiAgICAkLm1peChDLnByb3RvdHlwZSwgbWV0aG9kcyk7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciBpbnN0ICA9IG5ldyBDXHJcbiAgICAgICwgY2hhaW4gPSBpbnN0W0FEREVSXShJU19XRUFLID8ge30gOiAtMCwgMSlcclxuICAgICAgLCBidWdneVplcm87XHJcbiAgICAvLyB3cmFwIGZvciBpbml0IGNvbGxlY3Rpb25zIGZyb20gaXRlcmFibGVcclxuICAgIGlmKCFyZXF1aXJlKCcuLyQuaXRlci1kZXRlY3QnKShmdW5jdGlvbihpdGVyKXsgbmV3IEMoaXRlcik7IH0pKXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1uZXdcclxuICAgICAgQyA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgYXNzZXJ0SW5zdGFuY2UodGhpcywgQywgTkFNRSk7XHJcbiAgICAgICAgdmFyIHRoYXQgICAgID0gbmV3IEJhc2VcclxuICAgICAgICAgICwgaXRlcmFibGUgPSBhcmd1bWVudHNbMF07XHJcbiAgICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKWZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcclxuICAgICAgICByZXR1cm4gdGhhdDtcclxuICAgICAgfTtcclxuICAgICAgQy5wcm90b3R5cGUgPSBwcm90bztcclxuICAgICAgaWYoJC5GVylwcm90by5jb25zdHJ1Y3RvciA9IEM7XHJcbiAgICB9XHJcbiAgICBJU19XRUFLIHx8IGluc3QuZm9yRWFjaChmdW5jdGlvbih2YWwsIGtleSl7XHJcbiAgICAgIGJ1Z2d5WmVybyA9IDEgLyBrZXkgPT09IC1JbmZpbml0eTtcclxuICAgIH0pO1xyXG4gICAgLy8gZml4IGNvbnZlcnRpbmcgLTAga2V5IHRvICswXHJcbiAgICBpZihidWdneVplcm8pe1xyXG4gICAgICBmaXhNZXRob2QoJ2RlbGV0ZScpO1xyXG4gICAgICBmaXhNZXRob2QoJ2hhcycpO1xyXG4gICAgICBJU19NQVAgJiYgZml4TWV0aG9kKCdnZXQnKTtcclxuICAgIH1cclxuICAgIC8vICsgZml4IC5hZGQgJiAuc2V0IGZvciBjaGFpbmluZ1xyXG4gICAgaWYoYnVnZ3laZXJvIHx8IGNoYWluICE9PSBpbnN0KWZpeE1ldGhvZChBRERFUiwgdHJ1ZSk7XHJcbiAgfVxyXG5cclxuICByZXF1aXJlKCcuLyQuY29mJykuc2V0KEMsIE5BTUUpO1xyXG5cclxuICBPW05BTUVdID0gQztcclxuICAkZGVmKCRkZWYuRyArICRkZWYuVyArICRkZWYuRiAqIChDICE9IEJhc2UpLCBPKTtcclxuICBzcGVjaWVzKEMpO1xyXG4gIHNwZWNpZXMoJC5jb3JlW05BTUVdKTsgLy8gZm9yIHdyYXBwZXJcclxuXHJcbiAgaWYoIUlTX1dFQUspY29tbW9uLnNldEl0ZXIoQywgTkFNRSwgSVNfTUFQKTtcclxuXHJcbiAgcmV0dXJuIEM7XHJcbn07IiwiLy8gT3B0aW9uYWwgLyBzaW1wbGUgY29udGV4dCBiaW5kaW5nXHJcbnZhciBhc3NlcnRGdW5jdGlvbiA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5mbjtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgdGhhdCwgbGVuZ3RoKXtcclxuICBhc3NlcnRGdW5jdGlvbihmbik7XHJcbiAgaWYofmxlbmd0aCAmJiB0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xyXG4gIHN3aXRjaChsZW5ndGgpe1xyXG4gICAgY2FzZSAxOiByZXR1cm4gZnVuY3Rpb24oYSl7XHJcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xyXG4gICAgfTtcclxuICAgIGNhc2UgMjogcmV0dXJuIGZ1bmN0aW9uKGEsIGIpe1xyXG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcclxuICAgIH07XHJcbiAgICBjYXNlIDM6IHJldHVybiBmdW5jdGlvbihhLCBiLCBjKXtcclxuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XHJcbiAgICB9O1xyXG4gIH0gcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcclxuICAgIH07XHJcbn07IiwidmFyICQgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgZ2xvYmFsICAgICA9ICQuZ1xyXG4gICwgY29yZSAgICAgICA9ICQuY29yZVxyXG4gICwgaXNGdW5jdGlvbiA9ICQuaXNGdW5jdGlvbjtcclxuZnVuY3Rpb24gY3R4KGZuLCB0aGF0KXtcclxuICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiBmbi5hcHBseSh0aGF0LCBhcmd1bWVudHMpO1xyXG4gIH07XHJcbn1cclxuZ2xvYmFsLmNvcmUgPSBjb3JlO1xyXG4vLyB0eXBlIGJpdG1hcFxyXG4kZGVmLkYgPSAxOyAgLy8gZm9yY2VkXHJcbiRkZWYuRyA9IDI7ICAvLyBnbG9iYWxcclxuJGRlZi5TID0gNDsgIC8vIHN0YXRpY1xyXG4kZGVmLlAgPSA4OyAgLy8gcHJvdG9cclxuJGRlZi5CID0gMTY7IC8vIGJpbmRcclxuJGRlZi5XID0gMzI7IC8vIHdyYXBcclxuZnVuY3Rpb24gJGRlZih0eXBlLCBuYW1lLCBzb3VyY2Upe1xyXG4gIHZhciBrZXksIG93biwgb3V0LCBleHBcclxuICAgICwgaXNHbG9iYWwgPSB0eXBlICYgJGRlZi5HXHJcbiAgICAsIHRhcmdldCAgID0gaXNHbG9iYWwgPyBnbG9iYWwgOiB0eXBlICYgJGRlZi5TXHJcbiAgICAgICAgPyBnbG9iYWxbbmFtZV0gOiAoZ2xvYmFsW25hbWVdIHx8IHt9KS5wcm90b3R5cGVcclxuICAgICwgZXhwb3J0cyAgPSBpc0dsb2JhbCA/IGNvcmUgOiBjb3JlW25hbWVdIHx8IChjb3JlW25hbWVdID0ge30pO1xyXG4gIGlmKGlzR2xvYmFsKXNvdXJjZSA9IG5hbWU7XHJcbiAgZm9yKGtleSBpbiBzb3VyY2Upe1xyXG4gICAgLy8gY29udGFpbnMgaW4gbmF0aXZlXHJcbiAgICBvd24gPSAhKHR5cGUgJiAkZGVmLkYpICYmIHRhcmdldCAmJiBrZXkgaW4gdGFyZ2V0O1xyXG4gICAgLy8gZXhwb3J0IG5hdGl2ZSBvciBwYXNzZWRcclxuICAgIG91dCA9IChvd24gPyB0YXJnZXQgOiBzb3VyY2UpW2tleV07XHJcbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxyXG4gICAgaWYodHlwZSAmICRkZWYuQiAmJiBvd24pZXhwID0gY3R4KG91dCwgZ2xvYmFsKTtcclxuICAgIGVsc2UgZXhwID0gdHlwZSAmICRkZWYuUCAmJiBpc0Z1bmN0aW9uKG91dCkgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcclxuICAgIC8vIGV4dGVuZCBnbG9iYWxcclxuICAgIGlmKHRhcmdldCAmJiAhb3duKXtcclxuICAgICAgaWYoaXNHbG9iYWwpdGFyZ2V0W2tleV0gPSBvdXQ7XHJcbiAgICAgIGVsc2UgZGVsZXRlIHRhcmdldFtrZXldICYmICQuaGlkZSh0YXJnZXQsIGtleSwgb3V0KTtcclxuICAgIH1cclxuICAgIC8vIGV4cG9ydFxyXG4gICAgaWYoZXhwb3J0c1trZXldICE9IG91dCkkLmhpZGUoZXhwb3J0cywga2V5LCBleHApO1xyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9ICRkZWY7IiwidmFyICQgPSByZXF1aXJlKCcuLyQnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XHJcbiAgdmFyIGtleXMgICAgICAgPSAkLmdldEtleXMoaXQpXHJcbiAgICAsIGdldERlc2MgICAgPSAkLmdldERlc2NcclxuICAgICwgZ2V0U3ltYm9scyA9ICQuZ2V0U3ltYm9scztcclxuICBpZihnZXRTeW1ib2xzKSQuZWFjaC5jYWxsKGdldFN5bWJvbHMoaXQpLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgaWYoZ2V0RGVzYyhpdCwga2V5KS5lbnVtZXJhYmxlKWtleXMucHVzaChrZXkpO1xyXG4gIH0pO1xyXG4gIHJldHVybiBrZXlzO1xyXG59OyIsInZhciBjdHggID0gcmVxdWlyZSgnLi8kLmN0eCcpXHJcbiAgLCBnZXQgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5nZXRcclxuICAsIGNhbGwgPSByZXF1aXJlKCcuLyQuaXRlci1jYWxsJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXRlcmFibGUsIGVudHJpZXMsIGZuLCB0aGF0KXtcclxuICB2YXIgaXRlcmF0b3IgPSBnZXQoaXRlcmFibGUpXHJcbiAgICAsIGYgICAgICAgID0gY3R4KGZuLCB0aGF0LCBlbnRyaWVzID8gMiA6IDEpXHJcbiAgICAsIHN0ZXA7XHJcbiAgd2hpbGUoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKXtcclxuICAgIGlmKGNhbGwoaXRlcmF0b3IsIGYsIHN0ZXAudmFsdWUsIGVudHJpZXMpID09PSBmYWxzZSl7XHJcbiAgICAgIHJldHVybiBjYWxsLmNsb3NlKGl0ZXJhdG9yKTtcclxuICAgIH1cclxuICB9XHJcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkKXtcclxuICAkLkZXICAgPSB0cnVlO1xyXG4gICQucGF0aCA9ICQuZztcclxuICByZXR1cm4gJDtcclxufTsiLCJ2YXIgYXNzZXJ0T2JqZWN0ID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLm9iajtcclxuZnVuY3Rpb24gY2xvc2UoaXRlcmF0b3Ipe1xyXG4gIHZhciByZXQgPSBpdGVyYXRvclsncmV0dXJuJ107XHJcbiAgaWYocmV0ICE9PSB1bmRlZmluZWQpYXNzZXJ0T2JqZWN0KHJldC5jYWxsKGl0ZXJhdG9yKSk7XHJcbn1cclxuZnVuY3Rpb24gY2FsbChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhc3NlcnRPYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XHJcbiAgfSBjYXRjaChlKXtcclxuICAgIGNsb3NlKGl0ZXJhdG9yKTtcclxuICAgIHRocm93IGU7XHJcbiAgfVxyXG59XHJcbmNhbGwuY2xvc2UgPSBjbG9zZTtcclxubW9kdWxlLmV4cG9ydHMgPSBjYWxsOyIsInZhciAkZGVmICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsICQgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjb2YgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRpdGVyICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcclxuICAsIFNZTUJPTF9JVEVSQVRPUiA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxyXG4gICwgRkZfSVRFUkFUT1IgICAgID0gJ0BAaXRlcmF0b3InXHJcbiAgLCBWQUxVRVMgICAgICAgICAgPSAndmFsdWVzJ1xyXG4gICwgSXRlcmF0b3JzICAgICAgID0gJGl0ZXIuSXRlcmF0b3JzO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFKXtcclxuICAkaXRlci5jcmVhdGUoQ29uc3RydWN0b3IsIE5BTUUsIG5leHQpO1xyXG4gIGZ1bmN0aW9uIGNyZWF0ZU1ldGhvZChraW5kKXtcclxuICAgIHJldHVybiBmdW5jdGlvbigpe1xyXG4gICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpO1xyXG4gICAgfTtcclxuICB9XHJcbiAgdmFyIFRBRyAgICAgID0gTkFNRSArICcgSXRlcmF0b3InXHJcbiAgICAsIHByb3RvICAgID0gQmFzZS5wcm90b3R5cGVcclxuICAgICwgX25hdGl2ZSAgPSBwcm90b1tTWU1CT0xfSVRFUkFUT1JdIHx8IHByb3RvW0ZGX0lURVJBVE9SXSB8fCBERUZBVUxUICYmIHByb3RvW0RFRkFVTFRdXHJcbiAgICAsIF9kZWZhdWx0ID0gX25hdGl2ZSB8fCBjcmVhdGVNZXRob2QoREVGQVVMVClcclxuICAgICwgbWV0aG9kcywga2V5O1xyXG4gIC8vIEZpeCBuYXRpdmVcclxuICBpZihfbmF0aXZlKXtcclxuICAgIHZhciBJdGVyYXRvclByb3RvdHlwZSA9ICQuZ2V0UHJvdG8oX2RlZmF1bHQuY2FsbChuZXcgQmFzZSkpO1xyXG4gICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xyXG4gICAgY29mLnNldChJdGVyYXRvclByb3RvdHlwZSwgVEFHLCB0cnVlKTtcclxuICAgIC8vIEZGIGZpeFxyXG4gICAgaWYoJC5GVyAmJiAkLmhhcyhwcm90bywgRkZfSVRFUkFUT1IpKSRpdGVyLnNldChJdGVyYXRvclByb3RvdHlwZSwgJC50aGF0KTtcclxuICB9XHJcbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXHJcbiAgaWYoJC5GVykkaXRlci5zZXQocHJvdG8sIF9kZWZhdWx0KTtcclxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XHJcbiAgSXRlcmF0b3JzW05BTUVdID0gX2RlZmF1bHQ7XHJcbiAgSXRlcmF0b3JzW1RBR10gID0gJC50aGF0O1xyXG4gIGlmKERFRkFVTFQpe1xyXG4gICAgbWV0aG9kcyA9IHtcclxuICAgICAga2V5czogICAgSVNfU0VUICAgICAgICAgICAgPyBfZGVmYXVsdCA6IGNyZWF0ZU1ldGhvZCgna2V5cycpLFxyXG4gICAgICB2YWx1ZXM6ICBERUZBVUxUID09IFZBTFVFUyA/IF9kZWZhdWx0IDogY3JlYXRlTWV0aG9kKFZBTFVFUyksXHJcbiAgICAgIGVudHJpZXM6IERFRkFVTFQgIT0gVkFMVUVTID8gX2RlZmF1bHQgOiBjcmVhdGVNZXRob2QoJ2VudHJpZXMnKVxyXG4gICAgfTtcclxuICAgIGlmKEZPUkNFKWZvcihrZXkgaW4gbWV0aG9kcyl7XHJcbiAgICAgIGlmKCEoa2V5IGluIHByb3RvKSkkLmhpZGUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcclxuICAgIH0gZWxzZSAkZGVmKCRkZWYuUCArICRkZWYuRiAqICRpdGVyLkJVR0dZLCBOQU1FLCBtZXRob2RzKTtcclxuICB9XHJcbn07IiwidmFyIFNZTUJPTF9JVEVSQVRPUiA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxyXG4gICwgU0FGRV9DTE9TSU5HICAgID0gZmFsc2U7XHJcbnRyeSB7XHJcbiAgdmFyIHJpdGVyID0gWzddW1NZTUJPTF9JVEVSQVRPUl0oKTtcclxuICByaXRlclsncmV0dXJuJ10gPSBmdW5jdGlvbigpeyBTQUZFX0NMT1NJTkcgPSB0cnVlOyB9O1xyXG4gIEFycmF5LmZyb20ocml0ZXIsIGZ1bmN0aW9uKCl7IHRocm93IDI7IH0pO1xyXG59IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZXhlYyl7XHJcbiAgaWYoIVNBRkVfQ0xPU0lORylyZXR1cm4gZmFsc2U7XHJcbiAgdmFyIHNhZmUgPSBmYWxzZTtcclxuICB0cnkge1xyXG4gICAgdmFyIGFyciAgPSBbN11cclxuICAgICAgLCBpdGVyID0gYXJyW1NZTUJPTF9JVEVSQVRPUl0oKTtcclxuICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uKCl7IHNhZmUgPSB0cnVlOyB9O1xyXG4gICAgYXJyW1NZTUJPTF9JVEVSQVRPUl0gPSBmdW5jdGlvbigpeyByZXR1cm4gaXRlcjsgfTtcclxuICAgIGV4ZWMoYXJyKTtcclxuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbiAgcmV0dXJuIHNhZmU7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY29mICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsIGFzc2VydE9iamVjdCAgICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpLm9ialxyXG4gICwgU1lNQk9MX0lURVJBVE9SICAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcclxuICAsIEZGX0lURVJBVE9SICAgICAgID0gJ0BAaXRlcmF0b3InXHJcbiAgLCBJdGVyYXRvcnMgICAgICAgICA9IHt9XHJcbiAgLCBJdGVyYXRvclByb3RvdHlwZSA9IHt9O1xyXG4vLyAyNS4xLjIuMS4xICVJdGVyYXRvclByb3RvdHlwZSVbQEBpdGVyYXRvcl0oKVxyXG5zZXRJdGVyYXRvcihJdGVyYXRvclByb3RvdHlwZSwgJC50aGF0KTtcclxuZnVuY3Rpb24gc2V0SXRlcmF0b3IoTywgdmFsdWUpe1xyXG4gICQuaGlkZShPLCBTWU1CT0xfSVRFUkFUT1IsIHZhbHVlKTtcclxuICAvLyBBZGQgaXRlcmF0b3IgZm9yIEZGIGl0ZXJhdG9yIHByb3RvY29sXHJcbiAgaWYoRkZfSVRFUkFUT1IgaW4gW10pJC5oaWRlKE8sIEZGX0lURVJBVE9SLCB2YWx1ZSk7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIC8vIFNhZmFyaSBoYXMgYnVnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcclxuICBCVUdHWTogJ2tleXMnIGluIFtdICYmICEoJ25leHQnIGluIFtdLmtleXMoKSksXHJcbiAgSXRlcmF0b3JzOiBJdGVyYXRvcnMsXHJcbiAgc3RlcDogZnVuY3Rpb24oZG9uZSwgdmFsdWUpe1xyXG4gICAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XHJcbiAgfSxcclxuICBpczogZnVuY3Rpb24oaXQpe1xyXG4gICAgdmFyIE8gICAgICA9IE9iamVjdChpdClcclxuICAgICAgLCBTeW1ib2wgPSAkLmcuU3ltYm9sXHJcbiAgICAgICwgU1lNICAgID0gU3ltYm9sICYmIFN5bWJvbC5pdGVyYXRvciB8fCBGRl9JVEVSQVRPUjtcclxuICAgIHJldHVybiBTWU0gaW4gTyB8fCBTWU1CT0xfSVRFUkFUT1IgaW4gTyB8fCAkLmhhcyhJdGVyYXRvcnMsIGNvZi5jbGFzc29mKE8pKTtcclxuICB9LFxyXG4gIGdldDogZnVuY3Rpb24oaXQpe1xyXG4gICAgdmFyIFN5bWJvbCAgPSAkLmcuU3ltYm9sXHJcbiAgICAgICwgZXh0ICAgICA9IGl0W1N5bWJvbCAmJiBTeW1ib2wuaXRlcmF0b3IgfHwgRkZfSVRFUkFUT1JdXHJcbiAgICAgICwgZ2V0SXRlciA9IGV4dCB8fCBpdFtTWU1CT0xfSVRFUkFUT1JdIHx8IEl0ZXJhdG9yc1tjb2YuY2xhc3NvZihpdCldO1xyXG4gICAgcmV0dXJuIGFzc2VydE9iamVjdChnZXRJdGVyLmNhbGwoaXQpKTtcclxuICB9LFxyXG4gIHNldDogc2V0SXRlcmF0b3IsXHJcbiAgY3JlYXRlOiBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCwgcHJvdG8pe1xyXG4gICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gJC5jcmVhdGUocHJvdG8gfHwgSXRlcmF0b3JQcm90b3R5cGUsIHtuZXh0OiAkLmRlc2MoMSwgbmV4dCl9KTtcclxuICAgIGNvZi5zZXQoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XHJcbiAgfVxyXG59OyIsIid1c2Ugc3RyaWN0JztcclxudmFyIGdsb2JhbCA9IHR5cGVvZiBzZWxmICE9ICd1bmRlZmluZWQnID8gc2VsZiA6IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKClcclxuICAsIGNvcmUgICA9IHt9XHJcbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eVxyXG4gICwgaGFzT3duUHJvcGVydHkgPSB7fS5oYXNPd25Qcm9wZXJ0eVxyXG4gICwgY2VpbCAgPSBNYXRoLmNlaWxcclxuICAsIGZsb29yID0gTWF0aC5mbG9vclxyXG4gICwgbWF4ICAgPSBNYXRoLm1heFxyXG4gICwgbWluICAgPSBNYXRoLm1pbjtcclxuLy8gVGhlIGVuZ2luZSB3b3JrcyBmaW5lIHdpdGggZGVzY3JpcHRvcnM/IFRoYW5rJ3MgSUU4IGZvciBoaXMgZnVubnkgZGVmaW5lUHJvcGVydHkuXHJcbnZhciBERVNDID0gISFmdW5jdGlvbigpe1xyXG4gIHRyeSB7XHJcbiAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDI7IH19KS5hID09IDI7XHJcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxyXG59KCk7XHJcbnZhciBoaWRlID0gY3JlYXRlRGVmaW5lcigxKTtcclxuLy8gNy4xLjQgVG9JbnRlZ2VyXHJcbmZ1bmN0aW9uIHRvSW50ZWdlcihpdCl7XHJcbiAgcmV0dXJuIGlzTmFOKGl0ID0gK2l0KSA/IDAgOiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XHJcbn1cclxuZnVuY3Rpb24gZGVzYyhiaXRtYXAsIHZhbHVlKXtcclxuICByZXR1cm4ge1xyXG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxyXG4gICAgY29uZmlndXJhYmxlOiAhKGJpdG1hcCAmIDIpLFxyXG4gICAgd3JpdGFibGUgICAgOiAhKGJpdG1hcCAmIDQpLFxyXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxyXG4gIH07XHJcbn1cclxuZnVuY3Rpb24gc2ltcGxlU2V0KG9iamVjdCwga2V5LCB2YWx1ZSl7XHJcbiAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcclxuICByZXR1cm4gb2JqZWN0O1xyXG59XHJcbmZ1bmN0aW9uIGNyZWF0ZURlZmluZXIoYml0bWFwKXtcclxuICByZXR1cm4gREVTQyA/IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XHJcbiAgICByZXR1cm4gJC5zZXREZXNjKG9iamVjdCwga2V5LCBkZXNjKGJpdG1hcCwgdmFsdWUpKTtcclxuICB9IDogc2ltcGxlU2V0O1xyXG59XHJcblxyXG5mdW5jdGlvbiBpc09iamVjdChpdCl7XHJcbiAgcmV0dXJuIGl0ICE9PSBudWxsICYmICh0eXBlb2YgaXQgPT0gJ29iamVjdCcgfHwgdHlwZW9mIGl0ID09ICdmdW5jdGlvbicpO1xyXG59XHJcbmZ1bmN0aW9uIGlzRnVuY3Rpb24oaXQpe1xyXG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ2Z1bmN0aW9uJztcclxufVxyXG5mdW5jdGlvbiBhc3NlcnREZWZpbmVkKGl0KXtcclxuICBpZihpdCA9PSB1bmRlZmluZWQpdGhyb3cgVHlwZUVycm9yKFwiQ2FuJ3QgY2FsbCBtZXRob2Qgb24gIFwiICsgaXQpO1xyXG4gIHJldHVybiBpdDtcclxufVxyXG5cclxudmFyICQgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vJC5mdycpKHtcclxuICBnOiBnbG9iYWwsXHJcbiAgY29yZTogY29yZSxcclxuICBodG1sOiBnbG9iYWwuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LFxyXG4gIC8vIGh0dHA6Ly9qc3BlcmYuY29tL2NvcmUtanMtaXNvYmplY3RcclxuICBpc09iamVjdDogICBpc09iamVjdCxcclxuICBpc0Z1bmN0aW9uOiBpc0Z1bmN0aW9uLFxyXG4gIGl0OiBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gaXQ7XHJcbiAgfSxcclxuICB0aGF0OiBmdW5jdGlvbigpe1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICAvLyA3LjEuNCBUb0ludGVnZXJcclxuICB0b0ludGVnZXI6IHRvSW50ZWdlcixcclxuICAvLyA3LjEuMTUgVG9MZW5ndGhcclxuICB0b0xlbmd0aDogZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIGl0ID4gMCA/IG1pbih0b0ludGVnZXIoaXQpLCAweDFmZmZmZmZmZmZmZmZmKSA6IDA7IC8vIHBvdygyLCA1MykgLSAxID09IDkwMDcxOTkyNTQ3NDA5OTFcclxuICB9LFxyXG4gIHRvSW5kZXg6IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xyXG4gICAgaW5kZXggPSB0b0ludGVnZXIoaW5kZXgpO1xyXG4gICAgcmV0dXJuIGluZGV4IDwgMCA/IG1heChpbmRleCArIGxlbmd0aCwgMCkgOiBtaW4oaW5kZXgsIGxlbmd0aCk7XHJcbiAgfSxcclxuICBoYXM6IGZ1bmN0aW9uKGl0LCBrZXkpe1xyXG4gICAgcmV0dXJuIGhhc093blByb3BlcnR5LmNhbGwoaXQsIGtleSk7XHJcbiAgfSxcclxuICBjcmVhdGU6ICAgICBPYmplY3QuY3JlYXRlLFxyXG4gIGdldFByb3RvOiAgIE9iamVjdC5nZXRQcm90b3R5cGVPZixcclxuICBERVNDOiAgICAgICBERVNDLFxyXG4gIGRlc2M6ICAgICAgIGRlc2MsXHJcbiAgZ2V0RGVzYzogICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcixcclxuICBzZXREZXNjOiAgICBkZWZpbmVQcm9wZXJ0eSxcclxuICBzZXREZXNjczogICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyxcclxuICBnZXRLZXlzOiAgICBPYmplY3Qua2V5cyxcclxuICBnZXROYW1lczogICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyxcclxuICBnZXRTeW1ib2xzOiBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzLFxyXG4gIGFzc2VydERlZmluZWQ6IGFzc2VydERlZmluZWQsXHJcbiAgLy8gRHVtbXksIGZpeCBmb3Igbm90IGFycmF5LWxpa2UgRVMzIHN0cmluZyBpbiBlczUgbW9kdWxlXHJcbiAgRVM1T2JqZWN0OiBPYmplY3QsXHJcbiAgdG9PYmplY3Q6IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiAkLkVTNU9iamVjdChhc3NlcnREZWZpbmVkKGl0KSk7XHJcbiAgfSxcclxuICBoaWRlOiBoaWRlLFxyXG4gIGRlZjogY3JlYXRlRGVmaW5lcigwKSxcclxuICBzZXQ6IGdsb2JhbC5TeW1ib2wgPyBzaW1wbGVTZXQgOiBoaWRlLFxyXG4gIG1peDogZnVuY3Rpb24odGFyZ2V0LCBzcmMpe1xyXG4gICAgZm9yKHZhciBrZXkgaW4gc3JjKWhpZGUodGFyZ2V0LCBrZXksIHNyY1trZXldKTtcclxuICAgIHJldHVybiB0YXJnZXQ7XHJcbiAgfSxcclxuICBlYWNoOiBbXS5mb3JFYWNoXHJcbn0pO1xyXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bmRlZiAqL1xyXG5pZih0eXBlb2YgX19lICE9ICd1bmRlZmluZWQnKV9fZSA9IGNvcmU7XHJcbmlmKHR5cGVvZiBfX2cgIT0gJ3VuZGVmaW5lZCcpX19nID0gZ2xvYmFsOyIsInZhciAkID0gcmVxdWlyZSgnLi8kJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ob2JqZWN0LCBlbCl7XHJcbiAgdmFyIE8gICAgICA9ICQudG9PYmplY3Qob2JqZWN0KVxyXG4gICAgLCBrZXlzICAgPSAkLmdldEtleXMoTylcclxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcclxuICAgICwgaW5kZXggID0gMFxyXG4gICAgLCBrZXk7XHJcbiAgd2hpbGUobGVuZ3RoID4gaW5kZXgpaWYoT1trZXkgPSBrZXlzW2luZGV4KytdXSA9PT0gZWwpcmV0dXJuIGtleTtcclxufTsiLCJ2YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBTUEVDSUVTID0gcmVxdWlyZSgnLi8kLndrcycpKCdzcGVjaWVzJyk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oQyl7XHJcbiAgaWYoJC5ERVNDICYmICEoU1BFQ0lFUyBpbiBDKSkkLnNldERlc2MoQywgU1BFQ0lFUywge1xyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgZ2V0OiAkLnRoYXRcclxuICB9KTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxyXG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcclxudmFyICQgPSByZXF1aXJlKCcuLyQnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUT19TVFJJTkcpe1xyXG4gIHJldHVybiBmdW5jdGlvbihwb3Mpe1xyXG4gICAgdmFyIHMgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIGkgPSAkLnRvSW50ZWdlcihwb3MpXHJcbiAgICAgICwgbCA9IHMubGVuZ3RoXHJcbiAgICAgICwgYSwgYjtcclxuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XHJcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbFxyXG4gICAgICB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcclxuICAgICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxyXG4gICAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xyXG4gIH07XHJcbn07IiwidmFyIHNpZCA9IDA7XHJcbmZ1bmN0aW9uIHVpZChrZXkpe1xyXG4gIHJldHVybiAnU3ltYm9sKCcgKyBrZXkgKyAnKV8nICsgKCsrc2lkICsgTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMzYpO1xyXG59XHJcbnVpZC5zYWZlID0gcmVxdWlyZSgnLi8kJykuZy5TeW1ib2wgfHwgdWlkO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHVpZDsiLCIvLyAyMi4xLjMuMzEgQXJyYXkucHJvdG90eXBlW0BAdW5zY29wYWJsZXNdXHJcbnZhciAkICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBVTlNDT1BBQkxFUyA9IHJlcXVpcmUoJy4vJC53a3MnKSgndW5zY29wYWJsZXMnKTtcclxuaWYoJC5GVyAmJiAhKFVOU0NPUEFCTEVTIGluIFtdKSkkLmhpZGUoQXJyYXkucHJvdG90eXBlLCBVTlNDT1BBQkxFUywge30pO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XHJcbiAgaWYoJC5GVylbXVtVTlNDT1BBQkxFU11ba2V5XSA9IHRydWU7XHJcbn07IiwidmFyIGdsb2JhbCA9IHJlcXVpcmUoJy4vJCcpLmdcclxuICAsIHN0b3JlICA9IHt9O1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xyXG4gIHJldHVybiBzdG9yZVtuYW1lXSB8fCAoc3RvcmVbbmFtZV0gPVxyXG4gICAgZ2xvYmFsLlN5bWJvbCAmJiBnbG9iYWwuU3ltYm9sW25hbWVdIHx8IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdTeW1ib2wuJyArIG5hbWUpKTtcclxufTsiLCJ2YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBzZXRVbnNjb3BlID0gcmVxdWlyZSgnLi8kLnVuc2NvcGUnKVxyXG4gICwgSVRFUiAgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdpdGVyJylcclxuICAsICRpdGVyICAgICAgPSByZXF1aXJlKCcuLyQuaXRlcicpXHJcbiAgLCBzdGVwICAgICAgID0gJGl0ZXIuc3RlcFxyXG4gICwgSXRlcmF0b3JzICA9ICRpdGVyLkl0ZXJhdG9ycztcclxuXHJcbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcclxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcclxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxyXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcclxucmVxdWlyZSgnLi8kLml0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcclxuICAkLnNldCh0aGlzLCBJVEVSLCB7bzogJC50b09iamVjdChpdGVyYXRlZCksIGk6IDAsIGs6IGtpbmR9KTtcclxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXHJcbn0sIGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxyXG4gICAgLCBPICAgICA9IGl0ZXIub1xyXG4gICAgLCBraW5kICA9IGl0ZXIua1xyXG4gICAgLCBpbmRleCA9IGl0ZXIuaSsrO1xyXG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcclxuICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcclxuICAgIHJldHVybiBzdGVwKDEpO1xyXG4gIH1cclxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcclxuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcclxuICByZXR1cm4gc3RlcCgwLCBbaW5kZXgsIE9baW5kZXhdXSk7XHJcbn0sICd2YWx1ZXMnKTtcclxuXHJcbi8vIGFyZ3VtZW50c0xpc3RbQEBpdGVyYXRvcl0gaXMgJUFycmF5UHJvdG9fdmFsdWVzJSAoOS40LjQuNiwgOS40LjQuNylcclxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcclxuXHJcbnNldFVuc2NvcGUoJ2tleXMnKTtcclxuc2V0VW5zY29wZSgndmFsdWVzJyk7XHJcbnNldFVuc2NvcGUoJ2VudHJpZXMnKTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciBzdHJvbmcgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi1zdHJvbmcnKTtcclxuXHJcbi8vIDIzLjEgTWFwIE9iamVjdHNcclxucmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnTWFwJywge1xyXG4gIC8vIDIzLjEuMy42IE1hcC5wcm90b3R5cGUuZ2V0KGtleSlcclxuICBnZXQ6IGZ1bmN0aW9uIGdldChrZXkpe1xyXG4gICAgdmFyIGVudHJ5ID0gc3Ryb25nLmdldEVudHJ5KHRoaXMsIGtleSk7XHJcbiAgICByZXR1cm4gZW50cnkgJiYgZW50cnkudjtcclxuICB9LFxyXG4gIC8vIDIzLjEuMy45IE1hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXHJcbiAgc2V0OiBmdW5jdGlvbiBzZXQoa2V5LCB2YWx1ZSl7XHJcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XHJcbiAgfVxyXG59LCBzdHJvbmcsIHRydWUpOyIsIid1c2Ugc3RyaWN0JztcclxuLy8gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXHJcbnZhciAkICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY29mID0gcmVxdWlyZSgnLi8kLmNvZicpXHJcbiAgLCB0bXAgPSB7fTtcclxudG1wW3JlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKV0gPSAneic7XHJcbmlmKCQuRlcgJiYgY29mKHRtcCkgIT0gJ3onKSQuaGlkZShPYmplY3QucHJvdG90eXBlLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpe1xyXG4gIHJldHVybiAnW29iamVjdCAnICsgY29mLmNsYXNzb2YodGhpcykgKyAnXSc7XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXN0cm9uZycpO1xyXG5cclxuLy8gMjMuMiBTZXQgT2JqZWN0c1xyXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdTZXQnLCB7XHJcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXHJcbiAgYWRkOiBmdW5jdGlvbiBhZGQodmFsdWUpe1xyXG4gICAgcmV0dXJuIHN0cm9uZy5kZWYodGhpcywgdmFsdWUgPSB2YWx1ZSA9PT0gMCA/IDAgOiB2YWx1ZSwgdmFsdWUpO1xyXG4gIH1cclxufSwgc3Ryb25nKTsiLCJ2YXIgc2V0ICAgPSByZXF1aXJlKCcuLyQnKS5zZXRcclxuICAsIGF0ICAgID0gcmVxdWlyZSgnLi8kLnN0cmluZy1hdCcpKHRydWUpXHJcbiAgLCBJVEVSICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdpdGVyJylcclxuICAsICRpdGVyID0gcmVxdWlyZSgnLi8kLml0ZXInKVxyXG4gICwgc3RlcCAgPSAkaXRlci5zdGVwO1xyXG5cclxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxyXG5yZXF1aXJlKCcuLyQuaXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XHJcbiAgc2V0KHRoaXMsIElURVIsIHtvOiBTdHJpbmcoaXRlcmF0ZWQpLCBpOiAwfSk7XHJcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcclxufSwgZnVuY3Rpb24oKXtcclxuICB2YXIgaXRlciAgPSB0aGlzW0lURVJdXHJcbiAgICAsIE8gICAgID0gaXRlci5vXHJcbiAgICAsIGluZGV4ID0gaXRlci5pXHJcbiAgICAsIHBvaW50O1xyXG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiBzdGVwKDEpO1xyXG4gIHBvaW50ID0gYXQuY2FsbChPLCBpbmRleCk7XHJcbiAgaXRlci5pICs9IHBvaW50Lmxlbmd0aDtcclxuICByZXR1cm4gc3RlcCgwLCBwb2ludCk7XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxyXG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgc2V0VGFnICAgPSByZXF1aXJlKCcuLyQuY29mJykuc2V0XHJcbiAgLCB1aWQgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxyXG4gICwgJGRlZiAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGtleU9mICAgID0gcmVxdWlyZSgnLi8kLmtleW9mJylcclxuICAsIGVudW1LZXlzID0gcmVxdWlyZSgnLi8kLmVudW0ta2V5cycpXHJcbiAgLCBhc3NlcnRPYmplY3QgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jykub2JqXHJcbiAgLCBoYXMgICAgICA9ICQuaGFzXHJcbiAgLCAkY3JlYXRlICA9ICQuY3JlYXRlXHJcbiAgLCBnZXREZXNjICA9ICQuZ2V0RGVzY1xyXG4gICwgc2V0RGVzYyAgPSAkLnNldERlc2NcclxuICAsIGRlc2MgICAgID0gJC5kZXNjXHJcbiAgLCBnZXROYW1lcyA9ICQuZ2V0TmFtZXNcclxuICAsIHRvT2JqZWN0ID0gJC50b09iamVjdFxyXG4gICwgU3ltYm9sICAgPSAkLmcuU3ltYm9sXHJcbiAgLCBzZXR0ZXIgICA9IGZhbHNlXHJcbiAgLCBUQUcgICAgICA9IHVpZCgndGFnJylcclxuICAsIEhJRERFTiAgID0gdWlkKCdoaWRkZW4nKVxyXG4gICwgU3ltYm9sUmVnaXN0cnkgPSB7fVxyXG4gICwgQWxsU3ltYm9scyA9IHt9XHJcbiAgLCB1c2VOYXRpdmUgPSAkLmlzRnVuY3Rpb24oU3ltYm9sKTtcclxuXHJcbmZ1bmN0aW9uIHdyYXAodGFnKXtcclxuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gJC5zZXQoJGNyZWF0ZShTeW1ib2wucHJvdG90eXBlKSwgVEFHLCB0YWcpO1xyXG4gICQuREVTQyAmJiBzZXR0ZXIgJiYgc2V0RGVzYyhPYmplY3QucHJvdG90eXBlLCB0YWcsIHtcclxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcclxuICAgIHNldDogZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgICBpZihoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKXRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XHJcbiAgICAgIHNldERlc2ModGhpcywgdGFnLCBkZXNjKDEsIHZhbHVlKSk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbiAgcmV0dXJuIHN5bTtcclxufVxyXG5cclxuZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgRCl7XHJcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSl7XHJcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcclxuICAgICAgaWYoIWhhcyhpdCwgSElEREVOKSlzZXREZXNjKGl0LCBISURERU4sIGRlc2MoMSwge30pKTtcclxuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0paXRbSElEREVOXVtrZXldID0gZmFsc2U7XHJcbiAgICAgIEQuZW51bWVyYWJsZSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0gcmV0dXJuIHNldERlc2MoaXQsIGtleSwgRCk7XHJcbn1cclxuZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCl7XHJcbiAgYXNzZXJ0T2JqZWN0KGl0KTtcclxuICB2YXIga2V5cyA9IGVudW1LZXlzKFAgPSB0b09iamVjdChQKSlcclxuICAgICwgaSAgICA9IDBcclxuICAgICwgbCA9IGtleXMubGVuZ3RoXHJcbiAgICAsIGtleTtcclxuICB3aGlsZShsID4gaSlkZWZpbmVQcm9wZXJ0eShpdCwga2V5ID0ga2V5c1tpKytdLCBQW2tleV0pO1xyXG4gIHJldHVybiBpdDtcclxufVxyXG5mdW5jdGlvbiBjcmVhdGUoaXQsIFApe1xyXG4gIHJldHVybiBQID09PSB1bmRlZmluZWQgPyAkY3JlYXRlKGl0KSA6IGRlZmluZVByb3BlcnRpZXMoJGNyZWF0ZShpdCksIFApO1xyXG59XHJcbmZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcclxuICB2YXIgRCA9IGdldERlc2MoaXQgPSB0b09iamVjdChpdCksIGtleSk7XHJcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKUQuZW51bWVyYWJsZSA9IHRydWU7XHJcbiAgcmV0dXJuIEQ7XHJcbn1cclxuZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XHJcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvT2JqZWN0KGl0KSlcclxuICAgICwgcmVzdWx0ID0gW11cclxuICAgICwgaSAgICAgID0gMFxyXG4gICAgLCBrZXk7XHJcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZighaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIGtleSAhPSBISURERU4pcmVzdWx0LnB1c2goa2V5KTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcbmZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCl7XHJcbiAgdmFyIG5hbWVzICA9IGdldE5hbWVzKHRvT2JqZWN0KGl0KSlcclxuICAgICwgcmVzdWx0ID0gW11cclxuICAgICwgaSAgICAgID0gMFxyXG4gICAgLCBrZXk7XHJcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSlpZihoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkpcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcclxuaWYoIXVzZU5hdGl2ZSl7XHJcbiAgU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKGRlc2NyaXB0aW9uKXtcclxuICAgIGlmKHRoaXMgaW5zdGFuY2VvZiBTeW1ib2wpdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3InKTtcclxuICAgIHJldHVybiB3cmFwKHVpZChkZXNjcmlwdGlvbikpO1xyXG4gIH07XHJcbiAgJC5oaWRlKFN5bWJvbC5wcm90b3R5cGUsICd0b1N0cmluZycsIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gdGhpc1tUQUddO1xyXG4gIH0pO1xyXG5cclxuICAkLmNyZWF0ZSAgICAgPSBjcmVhdGU7XHJcbiAgJC5zZXREZXNjICAgID0gZGVmaW5lUHJvcGVydHk7XHJcbiAgJC5nZXREZXNjICAgID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xyXG4gICQuc2V0RGVzY3MgICA9IGRlZmluZVByb3BlcnRpZXM7XHJcbiAgJC5nZXROYW1lcyAgID0gZ2V0T3duUHJvcGVydHlOYW1lcztcclxuICAkLmdldFN5bWJvbHMgPSBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM7XHJcbn1cclxuXHJcbnZhciBzeW1ib2xTdGF0aWNzID0ge1xyXG4gIC8vIDE5LjQuMi4xIFN5bWJvbC5mb3Ioa2V5KVxyXG4gICdmb3InOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxyXG4gICAgICA/IFN5bWJvbFJlZ2lzdHJ5W2tleV1cclxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gU3ltYm9sKGtleSk7XHJcbiAgfSxcclxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcclxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihrZXkpe1xyXG4gICAgcmV0dXJuIGtleU9mKFN5bWJvbFJlZ2lzdHJ5LCBrZXkpO1xyXG4gIH0sXHJcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSB0cnVlOyB9LFxyXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24oKXsgc2V0dGVyID0gZmFsc2U7IH1cclxufTtcclxuLy8gMTkuNC4yLjIgU3ltYm9sLmhhc0luc3RhbmNlXHJcbi8vIDE5LjQuMi4zIFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGVcclxuLy8gMTkuNC4yLjQgU3ltYm9sLml0ZXJhdG9yXHJcbi8vIDE5LjQuMi42IFN5bWJvbC5tYXRjaFxyXG4vLyAxOS40LjIuOCBTeW1ib2wucmVwbGFjZVxyXG4vLyAxOS40LjIuOSBTeW1ib2wuc2VhcmNoXHJcbi8vIDE5LjQuMi4xMCBTeW1ib2wuc3BlY2llc1xyXG4vLyAxOS40LjIuMTEgU3ltYm9sLnNwbGl0XHJcbi8vIDE5LjQuMi4xMiBTeW1ib2wudG9QcmltaXRpdmVcclxuLy8gMTkuNC4yLjEzIFN5bWJvbC50b1N0cmluZ1RhZ1xyXG4vLyAxOS40LjIuMTQgU3ltYm9sLnVuc2NvcGFibGVzXHJcbiQuZWFjaC5jYWxsKChcclxuICAgICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsJyArXHJcbiAgICAnc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcclxuICApLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGl0KXtcclxuICAgIHZhciBzeW0gPSByZXF1aXJlKCcuLyQud2tzJykoaXQpO1xyXG4gICAgc3ltYm9sU3RhdGljc1tpdF0gPSB1c2VOYXRpdmUgPyBzeW0gOiB3cmFwKHN5bSk7XHJcbiAgfVxyXG4pO1xyXG5cclxuc2V0dGVyID0gdHJ1ZTtcclxuXHJcbiRkZWYoJGRlZi5HICsgJGRlZi5XLCB7U3ltYm9sOiBTeW1ib2x9KTtcclxuXHJcbiRkZWYoJGRlZi5TLCAnU3ltYm9sJywgc3ltYm9sU3RhdGljcyk7XHJcblxyXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICF1c2VOYXRpdmUsICdPYmplY3QnLCB7XHJcbiAgLy8gMTkuMS4yLjIgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxyXG4gIGNyZWF0ZTogY3JlYXRlLFxyXG4gIC8vIDE5LjEuMi40IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxyXG4gIGRlZmluZVByb3BlcnR5OiBkZWZpbmVQcm9wZXJ0eSxcclxuICAvLyAxOS4xLjIuMyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxyXG4gIGRlZmluZVByb3BlcnRpZXM6IGRlZmluZVByb3BlcnRpZXMsXHJcbiAgLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxyXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxyXG4gIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXHJcbiAgZ2V0T3duUHJvcGVydHlOYW1lczogZ2V0T3duUHJvcGVydHlOYW1lcyxcclxuICAvLyAxOS4xLjIuOCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKE8pXHJcbiAgZ2V0T3duUHJvcGVydHlTeW1ib2xzOiBnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcclxufSk7XHJcblxyXG4vLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddXHJcbnNldFRhZyhTeW1ib2wsICdTeW1ib2wnKTtcclxuLy8gMjAuMi4xLjkgTWF0aFtAQHRvU3RyaW5nVGFnXVxyXG5zZXRUYWcoTWF0aCwgJ01hdGgnLCB0cnVlKTtcclxuLy8gMjQuMy4zIEpTT05bQEB0b1N0cmluZ1RhZ11cclxuc2V0VGFnKCQuZy5KU09OLCAnSlNPTicsIHRydWUpOyIsInJlcXVpcmUoJy4vZXM2LmFycmF5Lml0ZXJhdG9yJyk7XHJcbnZhciAkICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBJdGVyYXRvcnMgICA9IHJlcXVpcmUoJy4vJC5pdGVyJykuSXRlcmF0b3JzXHJcbiAgLCBJVEVSQVRPUiAgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxyXG4gICwgQXJyYXlWYWx1ZXMgPSBJdGVyYXRvcnMuQXJyYXlcclxuICAsIE5vZGVMaXN0ICAgID0gJC5nLk5vZGVMaXN0O1xyXG5pZigkLkZXICYmIE5vZGVMaXN0ICYmICEoSVRFUkFUT1IgaW4gTm9kZUxpc3QucHJvdG90eXBlKSl7XHJcbiAgJC5oaWRlKE5vZGVMaXN0LnByb3RvdHlwZSwgSVRFUkFUT1IsIEFycmF5VmFsdWVzKTtcclxufVxyXG5JdGVyYXRvcnMuTm9kZUxpc3QgPSBBcnJheVZhbHVlczsiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyByZXF1aXJlZCBmb3IgSW50ZXJuZXQgRXhwbG9yZXIgb25seVxuLy8gdGhlIHJlcXVpcmUgc3RhdGVtZW50IGhhcyB0byBiZSBwdXQgaGVyZTsgaWYgeW91IHB1dCBpdCBhdCB0aGUgZW50cnkgcG9pbnQgKHNoaW0uanMpIGl0IGRvZXNuJ3Qgd29yayAod2VpcmQgcXVpcmNrIGluIElFPylcbnJlcXVpcmUoJ2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL2VzNi9tYXAnKTtcbnJlcXVpcmUoJ2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL2VzNi9zZXQnKTtcbnJlcXVpcmUoJ2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL2VzNi9zeW1ib2wnKTtcblxuaW1wb3J0IHtnZXREZXZpY2V9IGZyb20gJy4vdXRpbCc7XG5cbmNvbnN0IGphenpQbHVnaW5Jbml0VGltZSA9IDEwMDsgLy8gbWlsbGlzZWNvbmRzXG5cbmxldCBqYXp6SW5zdGFuY2VOdW1iZXIgPSAwO1xubGV0IGphenpJbnN0YW5jZXMgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVKYXp6SW5zdGFuY2UoY2FsbGJhY2spe1xuXG4gIGxldCBpZCA9ICdqYXp6XycgKyBqYXp6SW5zdGFuY2VOdW1iZXIrKyArICcnICsgRGF0ZS5ub3coKTtcbiAgbGV0IGluc3RhbmNlO1xuICBsZXQgb2JqUmVmLCBhY3RpdmVYO1xuXG4gIGlmKGdldERldmljZSgpLm5vZGVqcyA9PT0gdHJ1ZSl7XG4gICAgb2JqUmVmID0gbmV3IHdpbmRvdy5qYXp6TWlkaS5NSURJKCk7XG4gIH1lbHNle1xuICAgIGxldCBvMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29iamVjdCcpO1xuICAgIG8xLmlkID0gaWQgKyAnaWUnO1xuICAgIG8xLmNsYXNzaWQgPSAnQ0xTSUQ6MUFDRTE2MTgtMUM3RC00NTYxLUFFRTEtMzQ4NDJBQTg1RTkwJztcbiAgICBhY3RpdmVYID0gbzE7XG5cbiAgICBsZXQgbzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKTtcbiAgICBvMi5pZCA9IGlkO1xuICAgIG8yLnR5cGUgPSAnYXVkaW8veC1qYXp6JztcbiAgICBvMS5hcHBlbmRDaGlsZChvMik7XG4gICAgb2JqUmVmID0gbzI7XG5cbiAgICBsZXQgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdUaGlzIHBhZ2UgcmVxdWlyZXMgdGhlICcpKTtcblxuICAgIGxldCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0phenogcGx1Z2luJykpO1xuICAgIGEuaHJlZiA9ICdodHRwOi8vamF6ei1zb2Z0Lm5ldC8nO1xuXG4gICAgZS5hcHBlbmRDaGlsZChhKTtcbiAgICBlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcuJykpO1xuICAgIG8yLmFwcGVuZENoaWxkKGUpO1xuXG4gICAgbGV0IGluc2VydGlvblBvaW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ01JRElQbHVnaW4nKTtcbiAgICBpZighaW5zZXJ0aW9uUG9pbnQpIHtcbiAgICAgIC8vIENyZWF0ZSBoaWRkZW4gZWxlbWVudFxuICAgICAgaW5zZXJ0aW9uUG9pbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGluc2VydGlvblBvaW50LmlkID0gJ01JRElQbHVnaW4nO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUubGVmdCA9ICctOTk5OXB4JztcbiAgICAgIGluc2VydGlvblBvaW50LnN0eWxlLnRvcCA9ICctOTk5OXB4JztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zZXJ0aW9uUG9pbnQpO1xuICAgIH1cbiAgICBpbnNlcnRpb25Qb2ludC5hcHBlbmRDaGlsZChvMSk7XG4gIH1cblxuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICBpZihvYmpSZWYuaXNKYXp6ID09PSB0cnVlKXtcbiAgICAgIGluc3RhbmNlID0gb2JqUmVmO1xuICAgIH1lbHNlIGlmKGFjdGl2ZVguaXNKYXp6ID09PSB0cnVlKXtcbiAgICAgIGluc3RhbmNlID0gYWN0aXZlWDtcbiAgICB9XG4gICAgaWYoaW5zdGFuY2UgIT09IHVuZGVmaW5lZCl7XG4gICAgICBpbnN0YW5jZS5fcGVyZlRpbWVaZXJvID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgamF6ekluc3RhbmNlcy5zZXQoaWQsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgY2FsbGJhY2soaW5zdGFuY2UpO1xuICB9LCBqYXp6UGx1Z2luSW5pdFRpbWUpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRKYXp6SW5zdGFuY2UodHlwZSwgY2FsbGJhY2spe1xuICBsZXQgaW5zdGFuY2UgPSBudWxsO1xuICBsZXQga2V5ID0gdHlwZSA9PT0gJ2lucHV0JyA/ICdpbnB1dEluVXNlJyA6ICdvdXRwdXRJblVzZSc7XG5cbiAgZm9yKGxldCBpbnN0IG9mIGphenpJbnN0YW5jZXMudmFsdWVzKCkpe1xuICAgIGlmKGluc3Rba2V5XSAhPT0gdHJ1ZSl7XG4gICAgICAgIGluc3RhbmNlID0gaW5zdDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYoaW5zdGFuY2UgPT09IG51bGwpe1xuICAgIGNyZWF0ZUphenpJbnN0YW5jZShjYWxsYmFjayk7XG4gIH1lbHNle1xuICAgIGNhbGxiYWNrKGluc3RhbmNlKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2NyZWF0ZUphenpJbnN0YW5jZSwgZ2V0SmF6ekluc3RhbmNlfSBmcm9tICcuL2phenpfaW5zdGFuY2UnO1xuaW1wb3J0IHtNSURJSW5wdXR9IGZyb20gJy4vbWlkaV9pbnB1dCc7XG5pbXBvcnQge01JRElPdXRwdXR9IGZyb20gJy4vbWlkaV9vdXRwdXQnO1xuaW1wb3J0IHtNSURJQ29ubmVjdGlvbkV2ZW50fSBmcm9tICcuL21pZGljb25uZWN0aW9uX2V2ZW50JztcbmltcG9ydCB7Z2V0RGV2aWNlLCBnZW5lcmF0ZVVVSUR9IGZyb20gJy4vdXRpbCc7XG5cblxubGV0IG1pZGlBY2Nlc3M7XG5sZXQgamF6ekluc3RhbmNlO1xubGV0IG1pZGlJbnB1dHMgPSBuZXcgTWFwKCk7XG5sZXQgbWlkaU91dHB1dHMgPSBuZXcgTWFwKCk7XG5sZXQgbWlkaUlucHV0SWRzID0gbmV3IE1hcCgpO1xubGV0IG1pZGlPdXRwdXRJZHMgPSBuZXcgTWFwKCk7XG5sZXQgbGlzdGVuZXJzID0gbmV3IFNldCgpO1xuXG5cbmNsYXNzIE1JRElBY2Nlc3N7XG4gIGNvbnN0cnVjdG9yKG1pZGlJbnB1dHMsIG1pZGlPdXRwdXRzKXtcbiAgICB0aGlzLnN5c2V4RW5hYmxlZCA9IHRydWU7XG4gICAgdGhpcy5pbnB1dHMgPSBtaWRpSW5wdXRzO1xuICAgIHRoaXMub3V0cHV0cyA9IG1pZGlPdXRwdXRzO1xuICB9XG5cbiAgYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSl7XG4gICAgaWYodHlwZSAhPT0gJ3N0YXRlY2hhbmdlJyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGxpc3RlbmVycy5oYXMobGlzdGVuZXIpID09PSBmYWxzZSl7XG4gICAgICBsaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKXtcbiAgICBpZih0eXBlICE9PSAnc3RhdGVjaGFuZ2UnKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYobGlzdGVuZXJzLmhhcyhsaXN0ZW5lcikgPT09IHRydWUpe1xuICAgICAgbGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNSURJQWNjZXNzKCl7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGV4ZWN1dG9yKHJlc29sdmUsIHJlamVjdCl7XG5cbiAgICBpZihtaWRpQWNjZXNzICE9PSB1bmRlZmluZWQpe1xuICAgICAgcmVzb2x2ZShtaWRpQWNjZXNzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBpZihnZXREZXZpY2UoKS5icm93c2VyID09PSAnaWUgOScpe1xuICAgIC8vICAgcmVqZWN0KHttZXNzYWdlOiAnT25seSBJbnRlcm5ldCBFeHBsb3JlciAxMCBhbmQgYWJvdmUgYXJlIHN1cHBvcnRlZC4nfSlcbiAgICAvLyAgIHJldHVybjtcbiAgICAvLyB9XG5cbiAgICBjcmVhdGVKYXp6SW5zdGFuY2UoZnVuY3Rpb24oaW5zdGFuY2Upe1xuICAgICAgaWYoaW5zdGFuY2UgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHJlamVjdCh7bWVzc2FnZTogJ05vIGFjY2VzcyB0byBNSURJIGRldmljZXM6IGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB0aGUgV2ViTUlESSBBUEkgYW5kIHRoZSBKYXp6IHBsdWdpbiBpcyBub3QgaW5zdGFsbGVkLid9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBqYXp6SW5zdGFuY2UgPSBpbnN0YW5jZTtcblxuICAgICAgY3JlYXRlTUlESVBvcnRzKGZ1bmN0aW9uKCl7XG4gICAgICAgIHNldHVwTGlzdGVuZXJzKCk7XG4gICAgICAgIG1pZGlBY2Nlc3MgPSBuZXcgTUlESUFjY2VzcyhtaWRpSW5wdXRzLCBtaWRpT3V0cHV0cyk7XG4gICAgICAgIHJlc29sdmUobWlkaUFjY2Vzcyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTUlESVBvcnRzKGNhbGxiYWNrKXtcbiAgbGV0IGlucHV0cyA9IGphenpJbnN0YW5jZS5NaWRpSW5MaXN0KCk7XG4gIGxldCBvdXRwdXRzID0gamF6ekluc3RhbmNlLk1pZGlPdXRMaXN0KCk7XG4gIGxldCBudW1JbnB1dHMgPSBpbnB1dHMubGVuZ3RoO1xuICBsZXQgbnVtT3V0cHV0cyA9IG91dHB1dHMubGVuZ3RoO1xuXG4gIGxvb3BDcmVhdGVNSURJUG9ydCgwLCBudW1JbnB1dHMsICdpbnB1dCcsIGlucHV0cywgZnVuY3Rpb24oKXtcbiAgICBsb29wQ3JlYXRlTUlESVBvcnQoMCwgbnVtT3V0cHV0cywgJ291dHB1dCcsIG91dHB1dHMsIGNhbGxiYWNrKTtcbiAgfSk7XG59XG5cblxuZnVuY3Rpb24gbG9vcENyZWF0ZU1JRElQb3J0KGluZGV4LCBtYXgsIHR5cGUsIGxpc3QsIGNhbGxiYWNrKXtcbiAgaWYoaW5kZXggPCBtYXgpe1xuICAgIGxldCBuYW1lID0gbGlzdFtpbmRleCsrXTtcbiAgICBjcmVhdGVNSURJUG9ydCh0eXBlLCBuYW1lLCBmdW5jdGlvbigpe1xuICAgICAgbG9vcENyZWF0ZU1JRElQb3J0KGluZGV4LCBtYXgsIHR5cGUsIGxpc3QsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfWVsc2V7XG4gICAgY2FsbGJhY2soKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZU1JRElQb3J0KHR5cGUsIG5hbWUsIGNhbGxiYWNrKXtcbiAgZ2V0SmF6ekluc3RhbmNlKHR5cGUsIGZ1bmN0aW9uKGluc3RhbmNlKXtcbiAgICBsZXQgcG9ydDtcbiAgICBsZXQgaW5mbyA9IFtuYW1lLCAnJywgJyddO1xuICAgIGlmKHR5cGUgPT09ICdpbnB1dCcpe1xuICAgICAgaWYoaW5zdGFuY2UuU3VwcG9ydCgnTWlkaUluSW5mbycpKXtcbiAgICAgICAgaW5mbyA9IGluc3RhbmNlLk1pZGlJbkluZm8obmFtZSk7XG4gICAgICB9XG4gICAgICBwb3J0ID0gbmV3IE1JRElJbnB1dChpbmZvLCBpbnN0YW5jZSk7XG4gICAgICBtaWRpSW5wdXRzLnNldChwb3J0LmlkLCBwb3J0KTtcbiAgICB9ZWxzZSBpZih0eXBlID09PSAnb3V0cHV0Jyl7XG4gICAgICBpZihpbnN0YW5jZS5TdXBwb3J0KCdNaWRpT3V0SW5mbycpKXtcbiAgICAgICAgaW5mbyA9IGluc3RhbmNlLk1pZGlPdXRJbmZvKG5hbWUpO1xuICAgICAgfVxuICAgICAgcG9ydCA9IG5ldyBNSURJT3V0cHV0KGluZm8sIGluc3RhbmNlKTtcbiAgICAgIG1pZGlPdXRwdXRzLnNldChwb3J0LmlkLCBwb3J0KTtcbiAgICB9XG4gICAgY2FsbGJhY2socG9ydCk7XG4gIH0pO1xufVxuXG5cbmZ1bmN0aW9uIGdldFBvcnRCeU5hbWUocG9ydHMsIG5hbWUpe1xuICBsZXQgcG9ydDtcbiAgZm9yKHBvcnQgb2YgcG9ydHMudmFsdWVzKCkpe1xuICAgIGlmKHBvcnQubmFtZSA9PT0gbmFtZSl7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBvcnQ7XG59XG5cblxuZnVuY3Rpb24gc2V0dXBMaXN0ZW5lcnMoKXtcbiAgamF6ekluc3RhbmNlLk9uRGlzY29ubmVjdE1pZGlJbihmdW5jdGlvbihuYW1lKXtcbiAgICBsZXQgcG9ydCA9IGdldFBvcnRCeU5hbWUobWlkaUlucHV0cywgbmFtZSk7XG4gICAgaWYocG9ydCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHBvcnQuc3RhdGUgPSAnZGlzY29ubmVjdGVkJztcbiAgICAgIHBvcnQuY2xvc2UoKTtcbiAgICAgIHBvcnQuX2phenpJbnN0YW5jZS5pbnB1dEluVXNlID0gZmFsc2U7XG4gICAgICBtaWRpSW5wdXRzLmRlbGV0ZShwb3J0LmlkKTtcbiAgICAgIGRpc3BhdGNoRXZlbnQocG9ydCk7XG4gICAgfVxuICB9KTtcblxuICBqYXp6SW5zdGFuY2UuT25EaXNjb25uZWN0TWlkaU91dChmdW5jdGlvbihuYW1lKXtcbiAgICBsZXQgcG9ydCA9IGdldFBvcnRCeU5hbWUobWlkaU91dHB1dHMsIG5hbWUpO1xuICAgIGlmKHBvcnQgIT09IHVuZGVmaW5lZCl7XG4gICAgICBwb3J0LnN0YXRlID0gJ2Rpc2Nvbm5lY3RlZCc7XG4gICAgICBwb3J0LmNsb3NlKCk7XG4gICAgICBwb3J0Ll9qYXp6SW5zdGFuY2Uub3V0cHV0SW5Vc2UgPSBmYWxzZTtcbiAgICAgIG1pZGlPdXRwdXRzLmRlbGV0ZShwb3J0LmlkKTtcbiAgICAgIGRpc3BhdGNoRXZlbnQocG9ydCk7XG4gICAgfVxuICB9KTtcblxuICBqYXp6SW5zdGFuY2UuT25Db25uZWN0TWlkaUluKGZ1bmN0aW9uKG5hbWUpe1xuICAgIGNyZWF0ZU1JRElQb3J0KCdpbnB1dCcsIG5hbWUsIGZ1bmN0aW9uKHBvcnQpe1xuICAgICAgZGlzcGF0Y2hFdmVudChwb3J0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgamF6ekluc3RhbmNlLk9uQ29ubmVjdE1pZGlPdXQoZnVuY3Rpb24obmFtZSl7XG4gICAgY3JlYXRlTUlESVBvcnQoJ291dHB1dCcsIG5hbWUsIGZ1bmN0aW9uKHBvcnQpe1xuICAgICAgZGlzcGF0Y2hFdmVudChwb3J0KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQocG9ydCl7XG5cbiAgcG9ydC5kaXNwYXRjaEV2ZW50KG5ldyBNSURJQ29ubmVjdGlvbkV2ZW50KHBvcnQsIHBvcnQpKTtcblxuICBsZXQgZXZ0ID0gbmV3IE1JRElDb25uZWN0aW9uRXZlbnQobWlkaUFjY2VzcywgcG9ydCk7XG5cbiAgaWYodHlwZW9mIG1pZGlBY2Nlc3Mub25zdGF0ZWNoYW5nZSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgbWlkaUFjY2Vzcy5vbnN0YXRlY2hhbmdlKGV2dCk7XG4gIH1cbiAgZm9yKGxldCBsaXN0ZW5lciBvZiBsaXN0ZW5lcnMpe1xuICAgIGxpc3RlbmVyKGV2dCk7XG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VBbGxNSURJSW5wdXRzKCl7XG4gIG1pZGlJbnB1dHMuZm9yRWFjaChmdW5jdGlvbihpbnB1dCl7XG4gICAgLy9pbnB1dC5jbG9zZSgpO1xuICAgIGlucHV0Ll9qYXp6SW5zdGFuY2UuTWlkaUluQ2xvc2UoKTtcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1JRElEZXZpY2VJZChuYW1lLCB0eXBlKXtcbiAgbGV0IGlkO1xuICBpZih0eXBlID09PSAnaW5wdXQnKXtcbiAgICBpZCA9IG1pZGlJbnB1dElkcy5nZXQobmFtZSk7XG4gICAgaWYoaWQgPT09IHVuZGVmaW5lZCl7XG4gICAgICBpZCA9IGdlbmVyYXRlVVVJRCgpO1xuICAgICAgbWlkaUlucHV0SWRzLnNldChuYW1lLCBpZCk7XG4gICAgfVxuICB9ZWxzZSBpZih0eXBlID09PSAnb3V0cHV0Jyl7XG4gICAgaWQgPSBtaWRpT3V0cHV0SWRzLmdldChuYW1lKTtcbiAgICBpZihpZCA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIGlkID0gZ2VuZXJhdGVVVUlEKCk7XG4gICAgICBtaWRpT3V0cHV0SWRzLnNldChuYW1lLCBpZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBpZDtcbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldERldmljZX0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7TUlESU1lc3NhZ2VFdmVudH0gZnJvbSAnLi9taWRpbWVzc2FnZV9ldmVudCc7XG5pbXBvcnQge01JRElDb25uZWN0aW9uRXZlbnR9IGZyb20gJy4vbWlkaWNvbm5lY3Rpb25fZXZlbnQnO1xuaW1wb3J0IHtkaXNwYXRjaEV2ZW50LCBnZXRNSURJRGV2aWNlSWR9IGZyb20gJy4vbWlkaV9hY2Nlc3MnO1xuXG5sZXQgbWlkaVByb2M7XG5sZXQgbm9kZWpzID0gZ2V0RGV2aWNlKCkubm9kZWpzO1xuXG5leHBvcnQgY2xhc3MgTUlESUlucHV0e1xuICBjb25zdHJ1Y3RvcihpbmZvLCBpbnN0YW5jZSl7XG4gICAgdGhpcy5pZCA9IGdldE1JRElEZXZpY2VJZChpbmZvWzBdLCAnaW5wdXQnKTtcbiAgICB0aGlzLm5hbWUgPSBpbmZvWzBdO1xuICAgIHRoaXMubWFudWZhY3R1cmVyID0gaW5mb1sxXTtcbiAgICB0aGlzLnZlcnNpb24gPSBpbmZvWzJdO1xuICAgIHRoaXMudHlwZSA9ICdpbnB1dCc7XG4gICAgdGhpcy5zdGF0ZSA9ICdjb25uZWN0ZWQnO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdwZW5kaW5nJztcblxuICAgIHRoaXMub25zdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgdGhpcy5fb25taWRpbWVzc2FnZSA9IG51bGw7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdvbm1pZGltZXNzYWdlJywge1xuICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgIHRoaXMuX29ubWlkaW1lc3NhZ2UgPSB2YWx1ZTtcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gbmV3IE1hcCgpLnNldCgnbWlkaW1lc3NhZ2UnLCBuZXcgU2V0KCkpLnNldCgnc3RhdGVjaGFuZ2UnLCBuZXcgU2V0KCkpO1xuICAgIHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSA9IGZhbHNlO1xuICAgIHRoaXMuX3N5c2V4QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoKTtcblxuICAgIHRoaXMuX2phenpJbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgIHRoaXMuX2phenpJbnN0YW5jZS5pbnB1dEluVXNlID0gdHJ1ZTtcbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaUluT3Blbih0aGlzLm5hbWUsIG1pZGlQcm9jLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIGFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpe1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KHR5cGUpO1xuICAgIGlmKGxpc3RlbmVycyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZihsaXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gZmFsc2Upe1xuICAgICAgbGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSl7XG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQodHlwZSk7XG4gICAgaWYobGlzdGVuZXJzID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKGxpc3RlbmVycy5oYXMobGlzdGVuZXIpID09PSBmYWxzZSl7XG4gICAgICBsaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICBwcmV2ZW50RGVmYXVsdCgpe1xuICAgIHRoaXMuX3B2dERlZiA9IHRydWU7XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KGV2dCl7XG4gICAgdGhpcy5fcHZ0RGVmID0gZmFsc2U7XG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoZXZ0LnR5cGUpO1xuICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKXtcbiAgICAgIGxpc3RlbmVyKGV2dCk7XG4gICAgfSk7XG5cbiAgICBpZihldnQudHlwZSA9PT0gJ21pZGltZXNzYWdlJyl7XG4gICAgICBpZih0aGlzLl9vbm1pZGltZXNzYWdlICE9PSBudWxsKXtcbiAgICAgICAgdGhpcy5fb25taWRpbWVzc2FnZShldnQpO1xuICAgICAgfVxuICAgIH1lbHNlIGlmKGV2dC50eXBlID09PSAnc3RhdGVjaGFuZ2UnKXtcbiAgICAgIGlmKHRoaXMub25zdGF0ZWNoYW5nZSAhPT0gbnVsbCl7XG4gICAgICAgIHRoaXMub25zdGF0ZWNoYW5nZShldnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wdnREZWY7XG4gIH1cblxuICBvcGVuKCl7XG4gICAgaWYodGhpcy5jb25uZWN0aW9uID09PSAnb3Blbicpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSAhPT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaUluT3Blbih0aGlzLm5hbWUsIG1pZGlQcm9jLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSAnb3Blbic7XG4gICAgZGlzcGF0Y2hFdmVudCh0aGlzKTsgLy8gZGlzcGF0Y2ggZXZlbnQgdmlhIE1JRElBY2Nlc3NcbiAgfVxuXG4gIGNsb3NlKCl7XG4gICAgaWYodGhpcy5jb25uZWN0aW9uID09PSAnY2xvc2VkJyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGdldERldmljZSgpLnBsYXRmb3JtICE9PSAnbGludXgnKXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpSW5DbG9zZSgpO1xuICAgIH1cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSAnY2xvc2VkJztcbiAgICBkaXNwYXRjaEV2ZW50KHRoaXMpOyAvLyBkaXNwYXRjaCBldmVudCB2aWEgTUlESUFjY2Vzc1xuICAgIHRoaXMuX29ubWlkaW1lc3NhZ2UgPSBudWxsO1xuICAgIHRoaXMub25zdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmdldCgnbWlkaW1lc3NhZ2UnKS5jbGVhcigpO1xuICAgIHRoaXMuX2xpc3RlbmVycy5nZXQoJ3N0YXRlY2hhbmdlJykuY2xlYXIoKTtcbiAgfVxuXG4gIF9hcHBlbmRUb1N5c2V4QnVmZmVyKGRhdGEpe1xuICAgIGxldCBvbGRMZW5ndGggPSB0aGlzLl9zeXNleEJ1ZmZlci5sZW5ndGg7XG4gICAgbGV0IHRtcEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KG9sZExlbmd0aCArIGRhdGEubGVuZ3RoKTtcbiAgICB0bXBCdWZmZXIuc2V0KHRoaXMuX3N5c2V4QnVmZmVyKTtcbiAgICB0bXBCdWZmZXIuc2V0KGRhdGEsIG9sZExlbmd0aCk7XG4gICAgdGhpcy5fc3lzZXhCdWZmZXIgPSB0bXBCdWZmZXI7XG4gIH1cblxuICBfYnVmZmVyTG9uZ1N5c2V4KGRhdGEsIGluaXRpYWxPZmZzZXQpe1xuICAgIGxldCBqID0gaW5pdGlhbE9mZnNldDtcbiAgICB3aGlsZShqIDwgZGF0YS5sZW5ndGgpe1xuICAgICAgaWYoZGF0YVtqXSA9PSAweEY3KXtcbiAgICAgICAgLy8gZW5kIG9mIHN5c2V4IVxuICAgICAgICBqKys7XG4gICAgICAgIHRoaXMuX2FwcGVuZFRvU3lzZXhCdWZmZXIoZGF0YS5zbGljZShpbml0aWFsT2Zmc2V0LCBqKSk7XG4gICAgICAgIHJldHVybiBqO1xuICAgICAgfVxuICAgICAgaisrO1xuICAgIH1cbiAgICAvLyBkaWRuJ3QgcmVhY2ggdGhlIGVuZDsganVzdCB0YWNrIGl0IG9uLlxuICAgIHRoaXMuX2FwcGVuZFRvU3lzZXhCdWZmZXIoZGF0YS5zbGljZShpbml0aWFsT2Zmc2V0LCBqKSk7XG4gICAgdGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlID0gdHJ1ZTtcbiAgICByZXR1cm4gajtcbiAgfVxufVxuXG5cbm1pZGlQcm9jID0gZnVuY3Rpb24odGltZXN0YW1wLCBkYXRhKXtcbiAgbGV0IGxlbmd0aCA9IDA7XG4gIGxldCBpO1xuICBsZXQgaXNTeXNleE1lc3NhZ2UgPSBmYWxzZTtcblxuICAvLyBKYXp6IHNvbWV0aW1lcyBwYXNzZXMgdXMgbXVsdGlwbGUgbWVzc2FnZXMgYXQgb25jZSwgc28gd2UgbmVlZCB0byBwYXJzZSB0aGVtIG91dFxuICAvLyBhbmQgcGFzcyB0aGVtIG9uZSBhdCBhIHRpbWUuXG5cbiAgZm9yKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkgKz0gbGVuZ3RoKXtcbiAgICBsZXQgaXNWYWxpZE1lc3NhZ2UgPSB0cnVlO1xuICAgIGlmKHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSl7XG4gICAgICBpID0gdGhpcy5fYnVmZmVyTG9uZ1N5c2V4KGRhdGEsIGkpO1xuICAgICAgaWYoZGF0YVtpIC0gMV0gIT0gMHhmNyl7XG4gICAgICAgIC8vIHJhbiBvZmYgdGhlIGVuZCB3aXRob3V0IGhpdHRpbmcgdGhlIGVuZCBvZiB0aGUgc3lzZXggbWVzc2FnZVxuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpc1N5c2V4TWVzc2FnZSA9IHRydWU7XG4gICAgfWVsc2V7XG4gICAgICBpc1N5c2V4TWVzc2FnZSA9IGZhbHNlO1xuICAgICAgc3dpdGNoKGRhdGFbaV0gJiAweEYwKXtcbiAgICAgICAgY2FzZSAweDAwOiAgLy8gQ2hldyB1cCBzcHVyaW91cyAweDAwIGJ5dGVzLiAgRml4ZXMgYSBXaW5kb3dzIHByb2JsZW0uXG4gICAgICAgICAgbGVuZ3RoID0gMTtcbiAgICAgICAgICBpc1ZhbGlkTWVzc2FnZSA9IGZhbHNlO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMHg4MDogIC8vIG5vdGUgb2ZmXG4gICAgICAgIGNhc2UgMHg5MDogIC8vIG5vdGUgb25cbiAgICAgICAgY2FzZSAweEEwOiAgLy8gcG9seXBob25pYyBhZnRlcnRvdWNoXG4gICAgICAgIGNhc2UgMHhCMDogIC8vIGNvbnRyb2wgY2hhbmdlXG4gICAgICAgIGNhc2UgMHhFMDogIC8vIGNoYW5uZWwgbW9kZVxuICAgICAgICAgIGxlbmd0aCA9IDM7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAweEMwOiAgLy8gcHJvZ3JhbSBjaGFuZ2VcbiAgICAgICAgY2FzZSAweEQwOiAgLy8gY2hhbm5lbCBhZnRlcnRvdWNoXG4gICAgICAgICAgbGVuZ3RoID0gMjtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDB4RjA6XG4gICAgICAgICAgc3dpdGNoKGRhdGFbaV0pe1xuICAgICAgICAgICAgY2FzZSAweGYwOiAgLy8gbGV0aWFibGUtbGVuZ3RoIHN5c2V4LlxuICAgICAgICAgICAgICBpID0gdGhpcy5fYnVmZmVyTG9uZ1N5c2V4KGRhdGEsIGkpO1xuICAgICAgICAgICAgICBpZihkYXRhW2kgLSAxXSAhPSAweGY3KXtcbiAgICAgICAgICAgICAgICAvLyByYW4gb2ZmIHRoZSBlbmQgd2l0aG91dCBoaXR0aW5nIHRoZSBlbmQgb2YgdGhlIHN5c2V4IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaXNTeXNleE1lc3NhZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAweEYxOiAgLy8gTVRDIHF1YXJ0ZXIgZnJhbWVcbiAgICAgICAgICAgIGNhc2UgMHhGMzogIC8vIHNvbmcgc2VsZWN0XG4gICAgICAgICAgICAgIGxlbmd0aCA9IDI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDB4RjI6ICAvLyBzb25nIHBvc2l0aW9uIHBvaW50ZXJcbiAgICAgICAgICAgICAgbGVuZ3RoID0gMztcbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGxlbmd0aCA9IDE7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYoIWlzVmFsaWRNZXNzYWdlKXtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIGxldCBldnQgPSB7fTtcbiAgICBldnQucmVjZWl2ZWRUaW1lID0gcGFyc2VGbG9hdCh0aW1lc3RhbXAudG9TdHJpbmcoKSkgKyB0aGlzLl9qYXp6SW5zdGFuY2UuX3BlcmZUaW1lWmVybztcblxuICAgIGlmKGlzU3lzZXhNZXNzYWdlIHx8IHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSl7XG4gICAgICBldnQuZGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMuX3N5c2V4QnVmZmVyKTtcbiAgICAgIHRoaXMuX3N5c2V4QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoMCk7XG4gICAgICB0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2UgPSBmYWxzZTtcbiAgICB9ZWxzZXtcbiAgICAgIGV2dC5kYXRhID0gbmV3IFVpbnQ4QXJyYXkoZGF0YS5zbGljZShpLCBsZW5ndGggKyBpKSk7XG4gICAgfVxuXG4gICAgaWYobm9kZWpzKXtcbiAgICAgIGlmKHRoaXMuX29ubWlkaW1lc3NhZ2Upe1xuICAgICAgICB0aGlzLl9vbm1pZGltZXNzYWdlKGV2dCk7XG4gICAgICB9XG4gICAgfWVsc2V7XG4gICAgICBsZXQgZSA9IG5ldyBNSURJTWVzc2FnZUV2ZW50KHRoaXMsIGV2dC5kYXRhLCBldnQucmVjZWl2ZWRUaW1lKTtcbiAgICAgIHRoaXMuZGlzcGF0Y2hFdmVudChlKTtcbiAgICB9XG4gIH1cbn07IiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldERldmljZX0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7ZGlzcGF0Y2hFdmVudCwgZ2V0TUlESURldmljZUlkfSBmcm9tICcuL21pZGlfYWNjZXNzJztcblxuZXhwb3J0IGNsYXNzIE1JRElPdXRwdXR7XG4gIGNvbnN0cnVjdG9yKGluZm8sIGluc3RhbmNlKXtcbiAgICB0aGlzLmlkID0gZ2V0TUlESURldmljZUlkKGluZm9bMF0sICdvdXRwdXQnKTtcbiAgICB0aGlzLm5hbWUgPSBpbmZvWzBdO1xuICAgIHRoaXMubWFudWZhY3R1cmVyID0gaW5mb1sxXTtcbiAgICB0aGlzLnZlcnNpb24gPSBpbmZvWzJdO1xuICAgIHRoaXMudHlwZSA9ICdvdXRwdXQnO1xuICAgIHRoaXMuc3RhdGUgPSAnY29ubmVjdGVkJztcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSAncGVuZGluZyc7XG4gICAgdGhpcy5vbm1pZGltZXNzYWdlID0gbnVsbDtcbiAgICB0aGlzLm9uc3RhdGVjaGFuZ2UgPSBudWxsO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gbmV3IFNldCgpO1xuICAgIHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSA9IGZhbHNlO1xuICAgIHRoaXMuX3N5c2V4QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoKTtcblxuICAgIHRoaXMuX2phenpJbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgIHRoaXMuX2phenpJbnN0YW5jZS5vdXRwdXRJblVzZSA9IHRydWU7XG4gICAgaWYoZ2V0RGV2aWNlKCkucGxhdGZvcm0gPT09ICdsaW51eCcpe1xuICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlPdXRPcGVuKHRoaXMubmFtZSk7XG4gICAgfVxuICB9XG5cbiAgb3Blbigpe1xuICAgIGlmKHRoaXMuY29ubmVjdGlvbiA9PT0gJ29wZW4nKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoZ2V0RGV2aWNlKCkucGxhdGZvcm0gIT09ICdsaW51eCcpe1xuICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlPdXRPcGVuKHRoaXMubmFtZSk7XG4gICAgfVxuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdvcGVuJztcbiAgICBkaXNwYXRjaEV2ZW50KHRoaXMpOyAvLyBkaXNwYXRjaCBldmVudCB2aWEgTUlESUFjY2Vzc1xuICB9XG5cbiAgY2xvc2UoKXtcbiAgICBpZih0aGlzLmNvbm5lY3Rpb24gPT09ICdjbG9zZWQnKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoZ2V0RGV2aWNlKCkucGxhdGZvcm0gIT09ICdsaW51eCcpe1xuICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlPdXRDbG9zZSgpO1xuICAgIH1cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSAnY2xvc2VkJztcbiAgICBkaXNwYXRjaEV2ZW50KHRoaXMpOyAvLyBkaXNwYXRjaCBldmVudCB2aWEgTUlESUFjY2Vzc1xuICAgIHRoaXMub25zdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmNsZWFyKCk7XG4gIH1cblxuICBzZW5kKGRhdGEsIHRpbWVzdGFtcCl7XG4gICAgbGV0IGRlbGF5QmVmb3JlU2VuZCA9IDA7XG5cbiAgICBpZihkYXRhLmxlbmd0aCA9PT0gMCl7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYodGltZXN0YW1wKXtcbiAgICAgIGRlbGF5QmVmb3JlU2VuZCA9IE1hdGguZmxvb3IodGltZXN0YW1wIC0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpKTtcbiAgICB9XG5cbiAgICBpZih0aW1lc3RhbXAgJiYgKGRlbGF5QmVmb3JlU2VuZCA+IDEpKXtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlPdXRMb25nKGRhdGEpO1xuICAgICAgfSwgZGVsYXlCZWZvcmVTZW5kKTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpT3V0TG9uZyhkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKXtcbiAgICBpZih0eXBlICE9PSAnc3RhdGVjaGFuZ2UnKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZih0aGlzLl9saXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gZmFsc2Upe1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSl7XG4gICAgaWYodHlwZSAhPT0gJ3N0YXRlY2hhbmdlJyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYodGhpcy5fbGlzdGVuZXJzLmhhcyhsaXN0ZW5lcikgPT09IGZhbHNlKXtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnQoZXZ0KXtcbiAgICB0aGlzLl9saXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcil7XG4gICAgICBsaXN0ZW5lcihldnQpO1xuICAgIH0pO1xuXG4gICAgaWYodGhpcy5vbnN0YXRlY2hhbmdlICE9PSBudWxsKXtcbiAgICAgIHRoaXMub25zdGF0ZWNoYW5nZShldnQpO1xuICAgIH1cbiAgfVxufSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNsYXNzIE1JRElDb25uZWN0aW9uRXZlbnR7XG4gIGNvbnN0cnVjdG9yKG1pZGlBY2Nlc3MsIHBvcnQpe1xuICAgIHRoaXMuYnViYmxlcyA9IGZhbHNlO1xuICAgIHRoaXMuY2FuY2VsQnViYmxlID0gZmFsc2U7XG4gICAgdGhpcy5jYW5jZWxhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbWlkaUFjY2VzcztcbiAgICB0aGlzLmRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmV2ZW50UGhhc2UgPSAwO1xuICAgIHRoaXMucGF0aCA9IFtdO1xuICAgIHRoaXMucG9ydCA9IHBvcnQ7XG4gICAgdGhpcy5yZXR1cm5WYWx1ZSA9IHRydWU7XG4gICAgdGhpcy5zcmNFbGVtZW50ID0gbWlkaUFjY2VzcztcbiAgICB0aGlzLnRhcmdldCA9IG1pZGlBY2Nlc3M7XG4gICAgdGhpcy50aW1lU3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMudHlwZSA9ICdzdGF0ZWNoYW5nZSc7XG4gIH1cbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgY2xhc3MgTUlESU1lc3NhZ2VFdmVudHtcbiAgY29uc3RydWN0b3IocG9ydCwgZGF0YSwgcmVjZWl2ZWRUaW1lKXtcbiAgICB0aGlzLmJ1YmJsZXMgPSBmYWxzZTtcbiAgICB0aGlzLmNhbmNlbEJ1YmJsZSA9IGZhbHNlO1xuICAgIHRoaXMuY2FuY2VsYWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IHBvcnQ7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmV2ZW50UGhhc2UgPSAwO1xuICAgIHRoaXMucGF0aCA9IFtdO1xuICAgIHRoaXMucmVjZWl2ZWRUaW1lID0gcmVjZWl2ZWRUaW1lO1xuICAgIHRoaXMucmV0dXJuVmFsdWUgPSB0cnVlO1xuICAgIHRoaXMuc3JjRWxlbWVudCA9IHBvcnQ7XG4gICAgdGhpcy50YXJnZXQgPSBwb3J0O1xuICAgIHRoaXMudGltZVN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLnR5cGUgPSAnbWlkaW1lc3NhZ2UnO1xuICB9XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtjcmVhdGVNSURJQWNjZXNzLCBjbG9zZUFsbE1JRElJbnB1dHN9IGZyb20gJy4vbWlkaV9hY2Nlc3MnO1xuaW1wb3J0IHtwb2x5ZmlsbCwgZ2V0RGV2aWNlfSBmcm9tICcuL3V0aWwnO1xuXG5sZXQgbWlkaUFjY2VzcztcblxuKGZ1bmN0aW9uKCl7XG4gIGlmKCF3aW5kb3cubmF2aWdhdG9yLnJlcXVlc3RNSURJQWNjZXNzKXtcbiAgICBwb2x5ZmlsbCgpO1xuICAgIHdpbmRvdy5uYXZpZ2F0b3IucmVxdWVzdE1JRElBY2Nlc3MgPSBmdW5jdGlvbigpe1xuICAgICAgaWYobWlkaUFjY2VzcyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICBtaWRpQWNjZXNzID0gY3JlYXRlTUlESUFjY2VzcygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1pZGlBY2Nlc3M7XG4gICAgfTtcbiAgICBpZihnZXREZXZpY2UoKS5ub2RlanMgPT09IHRydWUpe1xuICAgICAgd2luZG93Lm5hdmlnYXRvci5jbG9zZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIE5lZWQgdG8gY2xvc2UgTUlESSBpbnB1dCBwb3J0cywgb3RoZXJ3aXNlIE5vZGUuanMgd2lsbCB3YWl0IGZvciBNSURJIGlucHV0IGZvcmV2ZXIuXG4gICAgICAgIGNsb3NlQWxsTUlESUlucHV0cygpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbn0oKSk7XG5cbmV4cG9ydCB7fTsiLCIndXNlIHN0cmljdCc7XG5cbmxldCBkZXZpY2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZXZpY2UoKXtcblxuICBpZihkZXZpY2UgIT09IHVuZGVmaW5lZCl7XG4gICAgcmV0dXJuIGRldmljZTtcbiAgfVxuXG4gIGxldFxuICAgIHBsYXRmb3JtID0gJ3VuZGV0ZWN0ZWQnLFxuICAgIGJyb3dzZXIgPSAndW5kZXRlY3RlZCcsXG4gICAgbm9kZWpzID0gZmFsc2U7XG5cbiAgaWYobmF2aWdhdG9yID09PSB1bmRlZmluZWQpe1xuICAgIG5vZGVqcyA9ICh0eXBlb2YgX19kaXJuYW1lICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuamF6ek1pZGkpO1xuICAgIGlmKG5vZGVqcyA9PT0gdHJ1ZSl7XG4gICAgICBwbGF0Zm9ybSA9IHByb2Nlc3MucGxhdGZvcm07XG4gICAgfVxuICAgIGRldmljZSA9IHtcbiAgICAgIHBsYXRmb3JtOiBwbGF0Zm9ybSxcbiAgICAgIGJyb3dzZXI6IGZhbHNlLFxuICAgICAgbm9kZWpzOiBub2RlanMsXG4gICAgICBtb2JpbGU6IHBsYXRmb3JtID09PSAnaW9zJyB8fCBwbGF0Zm9ybSA9PT0gJ2FuZHJvaWQnXG4gICAgfTtcbiAgICByZXR1cm4gZGV2aWNlO1xuICB9XG5cblxuICBsZXQgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuXG4gIGlmKHVhLm1hdGNoKC8oaVBhZHxpUGhvbmV8aVBvZCkvZykpe1xuICAgIHBsYXRmb3JtID0gJ2lvcyc7XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ0FuZHJvaWQnKSAhPT0gLTEpe1xuICAgIHBsYXRmb3JtID0gJ2FuZHJvaWQnO1xuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdMaW51eCcpICE9PSAtMSl7XG4gICAgcGxhdGZvcm0gPSAnbGludXgnO1xuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdNYWNpbnRvc2gnKSAhPT0gLTEpe1xuICAgIHBsYXRmb3JtID0gJ29zeCc7XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ1dpbmRvd3MnKSAhPT0gLTEpe1xuICAgIHBsYXRmb3JtID0gJ3dpbmRvd3MnO1xuICB9XG5cbiAgaWYodWEuaW5kZXhPZignQ2hyb21lJykgIT09IC0xKXtcbiAgICAvLyBjaHJvbWUsIGNocm9taXVtIGFuZCBjYW5hcnlcbiAgICBicm93c2VyID0gJ2Nocm9tZSc7XG5cbiAgICBpZih1YS5pbmRleE9mKCdPUFInKSAhPT0gLTEpe1xuICAgICAgYnJvd3NlciA9ICdvcGVyYSc7XG4gICAgfWVsc2UgaWYodWEuaW5kZXhPZignQ2hyb21pdW0nKSAhPT0gLTEpe1xuICAgICAgYnJvd3NlciA9ICdjaHJvbWl1bSc7XG4gICAgfVxuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdTYWZhcmknKSAhPT0gLTEpe1xuICAgIGJyb3dzZXIgPSAnc2FmYXJpJztcbiAgfWVsc2UgaWYodWEuaW5kZXhPZignRmlyZWZveCcpICE9PSAtMSl7XG4gICAgYnJvd3NlciA9ICdmaXJlZm94JztcbiAgfWVsc2UgaWYodWEuaW5kZXhPZignVHJpZGVudCcpICE9PSAtMSl7XG4gICAgYnJvd3NlciA9ICdpZSc7XG4gICAgaWYodWEuaW5kZXhPZignTVNJRSA5JykgIT09IC0xKXtcbiAgICAgIGJyb3dzZXIgPSAnaWUgOSc7XG4gICAgfVxuICB9XG5cbiAgaWYocGxhdGZvcm0gPT09ICdpb3MnKXtcbiAgICBpZih1YS5pbmRleE9mKCdDcmlPUycpICE9PSAtMSl7XG4gICAgICBicm93c2VyID0gJ2Nocm9tZSc7XG4gICAgfVxuICB9XG5cbiAgZGV2aWNlID0ge1xuICAgIHBsYXRmb3JtOiBwbGF0Zm9ybSxcbiAgICBicm93c2VyOiBicm93c2VyLFxuICAgIG1vYmlsZTogcGxhdGZvcm0gPT09ICdpb3MnIHx8IHBsYXRmb3JtID09PSAnYW5kcm9pZCcsXG4gICAgbm9kZWpzOiBmYWxzZVxuICB9O1xuICByZXR1cm4gZGV2aWNlO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBwb2x5ZmlsbFBlcmZvcm1hbmNlKCl7XG5cbiAgaWYod2luZG93LnBlcmZvcm1hbmNlID09PSB1bmRlZmluZWQpe1xuICAgIHdpbmRvdy5wZXJmb3JtYW5jZSA9IHt9O1xuICB9XG5cbiAgRGF0ZS5ub3cgPSAoRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH0pO1xuXG4gIGlmKHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgPT09IHVuZGVmaW5lZCl7XG5cbiAgICBsZXQgbm93T2Zmc2V0ID0gRGF0ZS5ub3coKTtcblxuICAgIGlmKHBlcmZvcm1hbmNlLnRpbWluZyAhPT0gdW5kZWZpbmVkICYmIHBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQgIT09IHVuZGVmaW5lZCl7XG4gICAgICBub3dPZmZzZXQgPSBwZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0O1xuICAgIH1cblxuICAgIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgPSBmdW5jdGlvbiBub3coKXtcbiAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gbm93T2Zmc2V0O1xuICAgIH1cbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVVVSUQoKXtcbiAgbGV0IGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgbGV0IHV1aWQgPSBuZXcgQXJyYXkoNjQpLmpvaW4oJ3gnKTs7Ly8neHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4JztcbiAgdXVpZCA9IHV1aWQucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkqMTYpJTE2IHwgMDtcbiAgICBkID0gTWF0aC5mbG9vcihkLzE2KTtcbiAgICByZXR1cm4gKGM9PSd4JyA/IHIgOiAociYweDN8MHg4KSkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xuICByZXR1cm4gdXVpZDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGxQcm9taXNlKCl7XG4gIGlmKHR5cGVvZiB3aW5kb3cuUHJvbWlzZSAhPT0gJ2Z1bmN0aW9uJyl7XG5cbiAgICB3aW5kb3cuUHJvbWlzZSA9IGZ1bmN0aW9uKGV4ZWN1dG9yKSB7XG4gICAgICB0aGlzLmV4ZWN1dG9yID0gZXhlY3V0b3I7XG4gICAgfTtcblxuICAgIFByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihhY2NlcHQsIHJlamVjdCkge1xuICAgICAgaWYodHlwZW9mIGFjY2VwdCAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgIGFjY2VwdCA9IGZ1bmN0aW9uKCl7fTtcbiAgICAgIH1cbiAgICAgIGlmKHR5cGVvZiByZWplY3QgIT09ICdmdW5jdGlvbicpe1xuICAgICAgICByZWplY3QgPSBmdW5jdGlvbigpe307XG4gICAgICB9XG4gICAgICB0aGlzLmV4ZWN1dG9yKGFjY2VwdCwgcmVqZWN0KTtcbiAgICB9OyAgICBcbiAgfVxufVxuXG5cbi8vIGNyZWRpdHM6IGh0dHBzOi8vZ2lzdC5naXRodWIuY29tLzEwNTc5MjRcbmV4cG9ydCBmdW5jdGlvbiBwb2x5ZmlsbFR5cGVkQXJyYXlzKCl7XG4gIHRyeSB7XG4gICAgdmFyIGEgPSBuZXcgVWludDhBcnJheSgxKTtcbiAgICByZXR1cm47IC8vbm8gbmVlZFxuICB9IGNhdGNoKGUpIHsgfVxuXG4gIGZ1bmN0aW9uIHN1YmFycmF5KHN0YXJ0LCBlbmQpIHtcbiAgICByZXR1cm4gdGhpcy5zbGljZShzdGFydCwgZW5kKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNldF8oYXJyYXksIG9mZnNldCkge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoIDwgMikgb2Zmc2V0ID0gMDtcbiAgICBmb3IgKHZhciBpID0gMCwgbiA9IGFycmF5Lmxlbmd0aDsgaSA8IG47ICsraSwgKytvZmZzZXQpe1xuICAgICAgdGhpc1tvZmZzZXRdID0gYXJyYXlbaV0gJiAweEZGO1xuICAgIH1cbiAgfVxuXG4gIC8vIHdlIG5lZWQgdHlwZWQgYXJyYXlzXG4gIGZ1bmN0aW9uIFR5cGVkQXJyYXkoYXJnMSkge1xuICAgIHZhciByZXN1bHQ7XG4gICAgaWYodHlwZW9mIGFyZzEgPT09IFwibnVtYmVyXCIpIHtcbiAgICAgIHJlc3VsdCA9IG5ldyBBcnJheShhcmcxKTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJnMTsgKytpKXtcbiAgICAgICAgcmVzdWx0W2ldID0gMDtcbiAgICAgIH1cbiAgICB9ZWxzZSBpZih0eXBlb2YgYXJnMSA9PT0gJ2FycmF5Jyl7XG4gICAgICByZXN1bHQgPSBhcmcxLnNsaWNlKDApO1xuICAgIH1lbHNle1xuICAgICAgcmVzdWx0ID0gbmV3IEFycmF5KCk7XG4gICAgfVxuICAgIHJlc3VsdC5zdWJhcnJheSA9IHN1YmFycmF5O1xuICAgIHJlc3VsdC5idWZmZXIgPSByZXN1bHQ7XG4gICAgcmVzdWx0LmJ5dGVMZW5ndGggPSByZXN1bHQubGVuZ3RoO1xuICAgIHJlc3VsdC5zZXQgPSBzZXRfO1xuICAgIGlmKHR5cGVvZiBhcmcxID09PSBcIm9iamVjdFwiICYmIGFyZzEuYnVmZmVyKXtcbiAgICAgIHJlc3VsdC5idWZmZXIgPSBhcmcxLmJ1ZmZlcjtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgd2luZG93LlVpbnQ4QXJyYXkgPSBUeXBlZEFycmF5O1xuICB3aW5kb3cuVWludDMyQXJyYXkgPSBUeXBlZEFycmF5O1xuICB3aW5kb3cuSW50MzJBcnJheSA9IFR5cGVkQXJyYXk7ICBcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlmaWxsKCl7XG4gIGxldCBkZXZpY2UgPSBnZXREZXZpY2UoKTtcbiAgaWYoZGV2aWNlLmJyb3dzZXIuaW5kZXhPZignaWUnKSAhPT0gLTEpe1xuICAgIHBvbHlmaWxsUHJvbWlzZSgpO1xuICAgIHBvbHlmaWxsVHlwZWRBcnJheXMoKTsgIFxuICB9XG4gIHBvbHlmaWxsUGVyZm9ybWFuY2UoKTtcbn0iXX0=
