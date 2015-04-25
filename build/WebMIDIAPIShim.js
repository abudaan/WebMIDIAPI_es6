(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/lib/babel/polyfill.js":[function(require,module,exports){
(function (global){
"use strict";

if (global._babelPolyfill) {
  throw new Error("only one instance of babel/polyfill is allowed");
}
global._babelPolyfill = true;

require("core-js/shim");

require("regenerator-babel/runtime");
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"core-js/shim":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/shim.js","regenerator-babel/runtime":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/regenerator-babel/runtime.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.array-includes.js":[function(require,module,exports){
'use strict';
// false -> Array#indexOf
// true  -> Array#includes
var $ = require('./$');
module.exports = function(IS_INCLUDES){
  return function(el /*, fromIndex = 0 */){
    var O      = $.toObject(this)
      , length = $.toLength(O.length)
      , index  = $.toIndex(arguments[1], length)
      , value;
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index;
    } return !IS_INCLUDES && -1;
  };
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.array-methods.js":[function(require,module,exports){
'use strict';
// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var $   = require('./$')
  , ctx = require('./$.ctx');
module.exports = function(TYPE){
  var IS_MAP        = TYPE == 1
    , IS_FILTER     = TYPE == 2
    , IS_SOME       = TYPE == 3
    , IS_EVERY      = TYPE == 4
    , IS_FIND_INDEX = TYPE == 6
    , NO_HOLES      = TYPE == 5 || IS_FIND_INDEX;
  return function(callbackfn/*, that = undefined */){
    var O      = Object($.assertDefined(this))
      , self   = $.ES5Object(O)
      , f      = ctx(callbackfn, arguments[1], 3)
      , length = $.toLength(self.length)
      , index  = 0
      , result = IS_MAP ? Array(length) : IS_FILTER ? [] : undefined
      , val, res;
    for(;length > index; index++)if(NO_HOLES || index in self){
      val = self[index];
      res = f(val, index, O);
      if(TYPE){
        if(IS_MAP)result[index] = res;            // map
        else if(res)switch(TYPE){
          case 3: return true;                    // some
          case 5: return val;                     // find
          case 6: return index;                   // findIndex
          case 2: result.push(val);               // filter
        } else if(IS_EVERY)return false;          // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.ctx":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.ctx.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assert.js":[function(require,module,exports){
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
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assign.js":[function(require,module,exports){
var $ = require('./$');
// 19.1.2.1 Object.assign(target, source, ...)
module.exports = Object.assign || function(target, source){ // eslint-disable-line no-unused-vars
  var T = Object($.assertDefined(target))
    , l = arguments.length
    , i = 1;
  while(l > i){
    var S      = $.ES5Object(arguments[i++])
      , keys   = $.getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)T[key = keys[j++]] = S[key];
  }
  return T;
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.cof.js":[function(require,module,exports){
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
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.wks":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.wks.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.collection-strong.js":[function(require,module,exports){
'use strict';
var $        = require('./$')
  , ctx      = require('./$.ctx')
  , safe     = require('./$.uid').safe
  , assert   = require('./$.assert')
  , $iter    = require('./$.iter')
  , has      = $.has
  , set      = $.set
  , isObject = $.isObject
  , hide     = $.hide
  , step     = $iter.step
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
    function C(iterable){
      var that = assert.inst(this, C, NAME);
      set(that, O1, $.create(null));
      set(that, SIZE, 0);
      set(that, LAST, undefined);
      set(that, FIRST, undefined);
      if(iterable != undefined)$iter.forOf(iterable, IS_MAP, that[ADDER], that);
    }
    $.mix(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function(){
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
      forEach: function(callbackfn /*, that = undefined */){
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
      has: function(key){
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
  getIterConstructor: function(){
    return function(iterated, kind){
      set(this, ITER, {o: iterated, k: kind});
    };
  },
  next: function(){
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
    if(kind == 'key'  )return step(0, entry.k);
    if(kind == 'value')return step(0, entry.v);
    return step(0, [entry.k, entry.v]);
  }
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.assert":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assert.js","./$.ctx":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.ctx.js","./$.iter":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.iter.js","./$.uid":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.uid.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.collection-weak.js":[function(require,module,exports){
'use strict';
var $         = require('./$')
  , safe      = require('./$.uid').safe
  , assert    = require('./$.assert')
  , forOf     = require('./$.iter').forOf
  , has       = $.has
  , isObject  = $.isObject
  , hide      = $.hide
  , isFrozen  = Object.isFrozen || $.core.Object.isFrozen
  , id        = 0
  , ID        = safe('id')
  , WEAK      = safe('weak')
  , LEAK      = safe('leak')
  , method    = require('./$.array-methods')
  , find      = method(5)
  , findIndex = method(6);
function findFrozen(store, key){
  return find.call(store.array, function(it){
    return it[0] === key;
  });
}
// fallback for frozen keys
function leakStore(that){
  return that[LEAK] || hide(that, LEAK, {
    array: [],
    get: function(key){
      var entry = findFrozen(this, key);
      if(entry)return entry[1];
    },
    has: function(key){
      return !!findFrozen(this, key);
    },
    set: function(key, value){
      var entry = findFrozen(this, key);
      if(entry)entry[1] = value;
      else this.array.push([key, value]);
    },
    'delete': function(key){
      var index = findIndex.call(this.array, function(it){
        return it[0] === key;
      });
      if(~index)this.array.splice(index, 1);
      return !!~index;
    }
  })[LEAK];
}

module.exports = {
  getConstructor: function(NAME, IS_MAP, ADDER){
    function C(iterable){
      $.set(assert.inst(this, C, NAME), ID, id++);
      if(iterable != undefined)forOf(iterable, IS_MAP, this[ADDER], this);
    }
    $.mix(C.prototype, {
      // 23.3.3.2 WeakMap.prototype.delete(key)
      // 23.4.3.3 WeakSet.prototype.delete(value)
      'delete': function(key){
        if(!isObject(key))return false;
        if(isFrozen(key))return leakStore(this)['delete'](key);
        return has(key, WEAK) && has(key[WEAK], this[ID]) && delete key[WEAK][this[ID]];
      },
      // 23.3.3.4 WeakMap.prototype.has(key)
      // 23.4.3.4 WeakSet.prototype.has(value)
      has: function(key){
        if(!isObject(key))return false;
        if(isFrozen(key))return leakStore(this).has(key);
        return has(key, WEAK) && has(key[WEAK], this[ID]);
      }
    });
    return C;
  },
  def: function(that, key, value){
    if(isFrozen(assert.obj(key))){
      leakStore(that).set(key, value);
    } else {
      has(key, WEAK) || hide(key, WEAK, {});
      key[WEAK][that[ID]] = value;
    } return that;
  },
  leakStore: leakStore,
  WEAK: WEAK,
  ID: ID
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.array-methods":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.array-methods.js","./$.assert":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assert.js","./$.iter":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.iter.js","./$.uid":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.uid.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.collection.js":[function(require,module,exports){
'use strict';
var $     = require('./$')
  , $def  = require('./$.def')
  , $iter = require('./$.iter')
  , assertInstance = require('./$.assert').inst;

module.exports = function(NAME, methods, common, IS_MAP, isWeak){
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
  if(!$.isFunction(C) || !(isWeak || !$iter.BUGGY && proto.forEach && proto.entries)){
    // create collection constructor
    C = common.getConstructor(NAME, IS_MAP, ADDER);
    $.mix(C.prototype, methods);
  } else {
    var inst  = new C
      , chain = inst[ADDER](isWeak ? {} : -0, 1)
      , buggyZero;
    // wrap for init collections from iterable
    if($iter.fail(function(iter){
      new C(iter); // eslint-disable-line no-new
    }) || $iter.DANGER_CLOSING){
      C = function(iterable){
        assertInstance(this, C, NAME);
        var that = new Base;
        if(iterable != undefined)$iter.forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      };
      C.prototype = proto;
      if($.FW)proto.constructor = C;
    }
    isWeak || inst.forEach(function(val, key){
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
  require('./$.species')(C);

  O[NAME] = C;
  $def($def.G + $def.W + $def.F * (C != Base), O);

  // add .keys, .values, .entries, [@@iterator]
  // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
  if(!isWeak)$iter.std(
    C, NAME,
    common.getIterConstructor(), common.next,
    IS_MAP ? 'key+value' : 'value' , !IS_MAP, true
  );

  return C;
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.assert":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assert.js","./$.cof":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.cof.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.iter":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.iter.js","./$.species":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.species.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.ctx.js":[function(require,module,exports){
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
},{"./$.assert":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assert.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js":[function(require,module,exports){
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
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.fw.js":[function(require,module,exports){
module.exports = function($){
  $.FW   = true;
  $.path = $.g;
  return $;
};
},{}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.invoke.js":[function(require,module,exports){
// Fast apply
// http://jsperf.lnkit.com/fast-apply/5
module.exports = function(fn, args, that){
  var un = that === undefined;
  switch(args.length){
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
    case 5: return un ? fn(args[0], args[1], args[2], args[3], args[4])
                      : fn.call(that, args[0], args[1], args[2], args[3], args[4]);
  } return              fn.apply(that, args);
};
},{}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.iter.js":[function(require,module,exports){
'use strict';
var $                 = require('./$')
  , ctx               = require('./$.ctx')
  , cof               = require('./$.cof')
  , $def              = require('./$.def')
  , assertObject      = require('./$.assert').obj
  , SYMBOL_ITERATOR   = require('./$.wks')('iterator')
  , FF_ITERATOR       = '@@iterator'
  , Iterators         = {}
  , IteratorPrototype = {};
// Safari has byggy iterators w/o `next`
var BUGGY = 'keys' in [] && !('next' in [].keys());
// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
setIterator(IteratorPrototype, $.that);
function setIterator(O, value){
  $.hide(O, SYMBOL_ITERATOR, value);
  // Add iterator for FF iterator protocol
  if(FF_ITERATOR in [])$.hide(O, FF_ITERATOR, value);
}
function defineIterator(Constructor, NAME, value, DEFAULT){
  var proto = Constructor.prototype
    , iter  = proto[SYMBOL_ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT] || value;
  // Define iterator
  if($.FW)setIterator(proto, iter);
  if(iter !== value){
    var iterProto = $.getProto(iter.call(new Constructor));
    // Set @@toStringTag to native iterators
    cof.set(iterProto, NAME + ' Iterator', true);
    // FF fix
    if($.FW)$.has(proto, FF_ITERATOR) && setIterator(iterProto, $.that);
  }
  // Plug for library
  Iterators[NAME] = iter;
  // FF & v8 fix
  Iterators[NAME + ' Iterator'] = $.that;
  return iter;
}
function getIterator(it){
  var Symbol  = $.g.Symbol
    , ext     = it[Symbol && Symbol.iterator || FF_ITERATOR]
    , getIter = ext || it[SYMBOL_ITERATOR] || Iterators[cof.classof(it)];
  return assertObject(getIter.call(it));
}
function closeIterator(iterator){
  var ret = iterator['return'];
  if(ret !== undefined)assertObject(ret.call(iterator));
}
function stepCall(iterator, fn, value, entries){
  try {
    return entries ? fn(assertObject(value)[0], value[1]) : fn(value);
  } catch(e){
    closeIterator(iterator);
    throw e;
  }
}
var DANGER_CLOSING = true;
!function(){
  try {
    var iter = [1].keys();
    iter['return'] = function(){ DANGER_CLOSING = false; };
    Array.from(iter, function(){ throw 2; });
  } catch(e){ /* empty */ }
}();
var $iter = module.exports = {
  BUGGY: BUGGY,
  DANGER_CLOSING: DANGER_CLOSING,
  fail: function(exec){
    var fail = true;
    try {
      var arr  = [[{}, 1]]
        , iter = arr[SYMBOL_ITERATOR]()
        , next = iter.next;
      iter.next = function(){
        fail = false;
        return next.call(this);
      };
      arr[SYMBOL_ITERATOR] = function(){
        return iter;
      };
      exec(arr);
    } catch(e){ /* empty */ }
    return fail;
  },
  Iterators: Iterators,
  prototype: IteratorPrototype,
  step: function(done, value){
    return {value: value, done: !!done};
  },
  stepCall: stepCall,
  close: closeIterator,
  is: function(it){
    var O      = Object(it)
      , Symbol = $.g.Symbol
      , SYM    = Symbol && Symbol.iterator || FF_ITERATOR;
    return SYM in O || SYMBOL_ITERATOR in O || $.has(Iterators, cof.classof(O));
  },
  get: getIterator,
  set: setIterator,
  create: function(Constructor, NAME, next, proto){
    Constructor.prototype = $.create(proto || $iter.prototype, {next: $.desc(1, next)});
    cof.set(Constructor, NAME + ' Iterator');
  },
  define: defineIterator,
  std: function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCE){
    function createIter(kind){
      return function(){
        return new Constructor(this, kind);
      };
    }
    $iter.create(Constructor, NAME, next);
    var entries = createIter('key+value')
      , values  = createIter('value')
      , proto   = Base.prototype
      , methods, key;
    if(DEFAULT == 'value')values = defineIterator(Base, NAME, values, 'values');
    else entries = defineIterator(Base, NAME, entries, 'entries');
    if(DEFAULT){
      methods = {
        entries: entries,
        keys:    IS_SET ? values : createIter('key'),
        values:  values
      };
      $def($def.P + $def.F * BUGGY, NAME, methods);
      if(FORCE)for(key in methods){
        if(!(key in proto))$.hide(proto, key, methods[key]);
      }
    }
  },
  forOf: function(iterable, entries, fn, that){
    var iterator = getIterator(iterable)
      , f = ctx(fn, that, entries ? 2 : 1)
      , step;
    while(!(step = iterator.next()).done){
      if(stepCall(iterator, f, step.value, entries) === false){
        return closeIterator(iterator);
      }
    }
  }
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.assert":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assert.js","./$.cof":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.cof.js","./$.ctx":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.ctx.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.wks":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.wks.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js":[function(require,module,exports){
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
    return $.setDesc(object, key, desc(bitmap, value)); // eslint-disable-line no-use-before-define
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
  getKeys:    Object.keys,
  getNames:   Object.getOwnPropertyNames,
  getSymbols: Object.getOwnPropertySymbols,
  // Dummy, fix for not array-like ES3 string in es5 module
  assertDefined: assertDefined,
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
if(typeof __e != 'undefined')__e = core;
if(typeof __g != 'undefined')__g = global;
},{"./$.fw":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.fw.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.keyof.js":[function(require,module,exports){
var $ = require('./$');
module.exports = function(object, el){
  var O      = $.toObject(object)
    , keys   = $.getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.own-keys.js":[function(require,module,exports){
var $            = require('./$')
  , assertObject = require('./$.assert').obj;
module.exports = function(it){
  assertObject(it);
  return $.getSymbols ? $.getNames(it).concat($.getSymbols(it)) : $.getNames(it);
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.assert":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assert.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.partial.js":[function(require,module,exports){
'use strict';
var $      = require('./$')
  , invoke = require('./$.invoke')
  , assertFunction = require('./$.assert').fn;
module.exports = function(/* ...pargs */){
  var fn     = assertFunction(this)
    , length = arguments.length
    , pargs  = Array(length)
    , i      = 0
    , _      = $.path._
    , holder = false;
  while(length > i)if((pargs[i] = arguments[i++]) === _)holder = true;
  return function(/* ...args */){
    var that    = this
      , _length = arguments.length
      , j = 0, k = 0, args;
    if(!holder && !_length)return invoke(fn, pargs, that);
    args = pargs.slice();
    if(holder)for(;length > j; j++)if(args[j] === _)args[j] = arguments[k++];
    while(_length > k)args.push(arguments[k++]);
    return invoke(fn, args, that);
  };
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.assert":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assert.js","./$.invoke":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.invoke.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.replacer.js":[function(require,module,exports){
'use strict';
module.exports = function(regExp, replace, isStatic){
  var replacer = replace === Object(replace) ? function(part){
    return replace[part];
  } : replace;
  return function(it){
    return String(isStatic ? it : this).replace(regExp, replacer);
  };
};
},{}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.set-proto.js":[function(require,module,exports){
// Works with __proto__ only. Old v8 can't works with null proto objects.
/*eslint-disable no-proto */
var $      = require('./$')
  , assert = require('./$.assert');
module.exports = Object.setPrototypeOf || ('__proto__' in {} // eslint-disable-line
  ? function(buggy, set){
      try {
        set = require('./$.ctx')(Function.call, $.getDesc(Object.prototype, '__proto__').set, 2);
        set({}, []);
      } catch(e){ buggy = true; }
      return function(O, proto){
        assert.obj(O);
        assert(proto === null || $.isObject(proto), proto, ": can't set as prototype!");
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }()
  : undefined);
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.assert":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assert.js","./$.ctx":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.ctx.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.species.js":[function(require,module,exports){
var $ = require('./$');
module.exports = function(C){
  if($.DESC && $.FW)$.setDesc(C, require('./$.wks')('species'), {
    configurable: true,
    get: $.that
  });
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.wks":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.wks.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.string-at.js":[function(require,module,exports){
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
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.task.js":[function(require,module,exports){
'use strict';
var $      = require('./$')
  , ctx    = require('./$.ctx')
  , cof    = require('./$.cof')
  , invoke = require('./$.invoke')
  , global             = $.g
  , isFunction         = $.isFunction
  , setTask            = global.setImmediate
  , clearTask          = global.clearImmediate
  , postMessage        = global.postMessage
  , addEventListener   = global.addEventListener
  , MessageChannel     = global.MessageChannel
  , counter            = 0
  , queue              = {}
  , ONREADYSTATECHANGE = 'onreadystatechange'
  , defer, channel, port;
function run(){
  var id = +this;
  if($.has(queue, id)){
    var fn = queue[id];
    delete queue[id];
    fn();
  }
}
function listner(event){
  run.call(event.data);
}
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if(!isFunction(setTask) || !isFunction(clearTask)){
  setTask = function(fn){
    var args = [], i = 1;
    while(arguments.length > i)args.push(arguments[i++]);
    queue[++counter] = function(){
      invoke(isFunction(fn) ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function(id){
    delete queue[id];
  };
  // Node.js 0.8-
  if(cof(global.process) == 'process'){
    defer = function(id){
      global.process.nextTick(ctx(run, id, 1));
    };
  // Modern browsers, skip implementation for WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is object
  } else if(addEventListener && isFunction(postMessage) && !$.g.importScripts){
    defer = function(id){
      postMessage(id, '*');
    };
    addEventListener('message', listner, false);
  // WebWorkers
  } else if(isFunction(MessageChannel)){
    channel = new MessageChannel;
    port    = channel.port2;
    channel.port1.onmessage = listner;
    defer = ctx(port.postMessage, port, 1);
  // IE8-
  } else if($.g.document && ONREADYSTATECHANGE in document.createElement('script')){
    defer = function(id){
      $.html.appendChild(document.createElement('script'))[ONREADYSTATECHANGE] = function(){
        $.html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function(id){
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set:   setTask,
  clear: clearTask
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.cof":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.cof.js","./$.ctx":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.ctx.js","./$.invoke":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.invoke.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.uid.js":[function(require,module,exports){
var sid = 0;
function uid(key){
  return 'Symbol(' + key + ')_' + (++sid + Math.random()).toString(36);
}
uid.safe = require('./$').g.Symbol || uid;
module.exports = uid;
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.unscope.js":[function(require,module,exports){
// 22.1.3.31 Array.prototype[@@unscopables]
var $           = require('./$')
  , UNSCOPABLES = require('./$.wks')('unscopables');
if($.FW && !(UNSCOPABLES in []))$.hide(Array.prototype, UNSCOPABLES, {});
module.exports = function(key){
  if($.FW)[][UNSCOPABLES][key] = true;
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.wks":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.wks.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.wks.js":[function(require,module,exports){
var global = require('./$').g
  , store  = {};
module.exports = function(name){
  return store[name] || (store[name] =
    global.Symbol && global.Symbol[name] || require('./$.uid').safe('Symbol.' + name));
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.uid":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.uid.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es5.js":[function(require,module,exports){
var $                = require('./$')
  , cof              = require('./$.cof')
  , $def             = require('./$.def')
  , invoke           = require('./$.invoke')
  , arrayMethod      = require('./$.array-methods')
  , IE_PROTO         = require('./$.uid').safe('__proto__')
  , assert           = require('./$.assert')
  , assertObject     = assert.obj
  , ObjectProto      = Object.prototype
  , A                = []
  , slice            = A.slice
  , indexOf          = A.indexOf
  , classof          = cof.classof
  , defineProperties = Object.defineProperties
  , has              = $.has
  , defineProperty   = $.setDesc
  , getOwnDescriptor = $.getDesc
  , isFunction       = $.isFunction
  , toObject         = $.toObject
  , toLength         = $.toLength
  , IE8_DOM_DEFINE   = false;

if(!$.DESC){
  try {
    IE8_DOM_DEFINE = defineProperty(document.createElement('div'), 'x',
      {get: function(){ return 8; }}
    ).x == 8;
  } catch(e){ /* empty */ }
  $.setDesc = function(O, P, Attributes){
    if(IE8_DOM_DEFINE)try {
      return defineProperty(O, P, Attributes);
    } catch(e){ /* empty */ }
    if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
    if('value' in Attributes)assertObject(O)[P] = Attributes.value;
    return O;
  };
  $.getDesc = function(O, P){
    if(IE8_DOM_DEFINE)try {
      return getOwnDescriptor(O, P);
    } catch(e){ /* empty */ }
    if(has(O, P))return $.desc(!ObjectProto.propertyIsEnumerable.call(O, P), O[P]);
  };
  defineProperties = function(O, Properties){
    assertObject(O);
    var keys   = $.getKeys(Properties)
      , length = keys.length
      , i = 0
      , P;
    while(length > i)$.setDesc(O, P = keys[i++], Properties[P]);
    return O;
  };
}
$def($def.S + $def.F * !$.DESC, 'Object', {
  // 19.1.2.6 / 15.2.3.3 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $.getDesc,
  // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
  defineProperty: $.setDesc,
  // 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
  defineProperties: defineProperties
});

  // IE 8- don't enum bug keys
var keys1 = ('constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,' +
            'toLocaleString,toString,valueOf').split(',')
  // Additional keys for getOwnPropertyNames
  , keys2 = keys1.concat('length', 'prototype')
  , keysLen1 = keys1.length;

// Create object with `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = document.createElement('iframe')
    , i      = keysLen1
    , iframeDocument;
  iframe.style.display = 'none';
  $.html.appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write('<script>document.F=Object</script>');
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict.prototype[keys1[i]];
  return createDict();
};
function createGetKeys(names, length){
  return function(object){
    var O      = toObject(object)
      , i      = 0
      , result = []
      , key;
    for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
    // Don't enum bug & hidden keys
    while(length > i)if(has(O, key = names[i++])){
      ~indexOf.call(result, key) || result.push(key);
    }
    return result;
  };
}
function isPrimitive(it){ return !$.isObject(it); }
function Empty(){}
$def($def.S, 'Object', {
  // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
  getPrototypeOf: $.getProto = $.getProto || function(O){
    O = Object(assert.def(O));
    if(has(O, IE_PROTO))return O[IE_PROTO];
    if(isFunction(O.constructor) && O instanceof O.constructor){
      return O.constructor.prototype;
    } return O instanceof Object ? ObjectProto : null;
  },
  // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $.getNames = $.getNames || createGetKeys(keys2, keys2.length, true),
  // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
  create: $.create = $.create || function(O, /*?*/Properties){
    var result;
    if(O !== null){
      Empty.prototype = assertObject(O);
      result = new Empty();
      Empty.prototype = null;
      // add "__proto__" for Object.getPrototypeOf shim
      result[IE_PROTO] = O;
    } else result = createDict();
    return Properties === undefined ? result : defineProperties(result, Properties);
  },
  // 19.1.2.14 / 15.2.3.14 Object.keys(O)
  keys: $.getKeys = $.getKeys || createGetKeys(keys1, keysLen1, false),
  // 19.1.2.17 / 15.2.3.8 Object.seal(O)
  seal: $.it, // <- cap
  // 19.1.2.5 / 15.2.3.9 Object.freeze(O)
  freeze: $.it, // <- cap
  // 19.1.2.15 / 15.2.3.10 Object.preventExtensions(O)
  preventExtensions: $.it, // <- cap
  // 19.1.2.13 / 15.2.3.11 Object.isSealed(O)
  isSealed: isPrimitive, // <- cap
  // 19.1.2.12 / 15.2.3.12 Object.isFrozen(O)
  isFrozen: isPrimitive, // <- cap
  // 19.1.2.11 / 15.2.3.13 Object.isExtensible(O)
  isExtensible: $.isObject // <- cap
});

// 19.2.3.2 / 15.3.4.5 Function.prototype.bind(thisArg, args...)
$def($def.P, 'Function', {
  bind: function(that /*, args... */){
    var fn       = assert.fn(this)
      , partArgs = slice.call(arguments, 1);
    function bound(/* args... */){
      var args = partArgs.concat(slice.call(arguments));
      return invoke(fn, args, this instanceof bound ? $.create(fn.prototype) : that);
    }
    if(fn.prototype)bound.prototype = fn.prototype;
    return bound;
  }
});

// Fix for not array-like ES3 string
function arrayMethodFix(fn){
  return function(){
    return fn.apply($.ES5Object(this), arguments);
  };
}
if(!(0 in Object('z') && 'z'[0] == 'z')){
  $.ES5Object = function(it){
    return cof(it) == 'String' ? it.split('') : Object(it);
  };
}
$def($def.P + $def.F * ($.ES5Object != Object), 'Array', {
  slice: arrayMethodFix(slice),
  join: arrayMethodFix(A.join)
});

// 22.1.2.2 / 15.4.3.2 Array.isArray(arg)
$def($def.S, 'Array', {
  isArray: function(arg){
    return cof(arg) == 'Array';
  }
});
function createArrayReduce(isRight){
  return function(callbackfn, memo){
    assert.fn(callbackfn);
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = isRight ? length - 1 : 0
      , i      = isRight ? -1 : 1;
    if(arguments.length < 2)for(;;){
      if(index in O){
        memo = O[index];
        index += i;
        break;
      }
      index += i;
      assert(isRight ? index >= 0 : length > index, 'Reduce of empty array with no initial value');
    }
    for(;isRight ? index >= 0 : length > index; index += i)if(index in O){
      memo = callbackfn(memo, O[index], index, this);
    }
    return memo;
  };
}
$def($def.P, 'Array', {
  // 22.1.3.10 / 15.4.4.18 Array.prototype.forEach(callbackfn [, thisArg])
  forEach: $.each = $.each || arrayMethod(0),
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: arrayMethod(1),
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: arrayMethod(2),
  // 22.1.3.23 / 15.4.4.17 Array.prototype.some(callbackfn [, thisArg])
  some: arrayMethod(3),
  // 22.1.3.5 / 15.4.4.16 Array.prototype.every(callbackfn [, thisArg])
  every: arrayMethod(4),
  // 22.1.3.18 / 15.4.4.21 Array.prototype.reduce(callbackfn [, initialValue])
  reduce: createArrayReduce(false),
  // 22.1.3.19 / 15.4.4.22 Array.prototype.reduceRight(callbackfn [, initialValue])
  reduceRight: createArrayReduce(true),
  // 22.1.3.11 / 15.4.4.14 Array.prototype.indexOf(searchElement [, fromIndex])
  indexOf: indexOf = indexOf || require('./$.array-includes')(false),
  // 22.1.3.14 / 15.4.4.15 Array.prototype.lastIndexOf(searchElement [, fromIndex])
  lastIndexOf: function(el, fromIndex /* = @[*-1] */){
    var O      = toObject(this)
      , length = toLength(O.length)
      , index  = length - 1;
    if(arguments.length > 1)index = Math.min(index, $.toInteger(fromIndex));
    if(index < 0)index = toLength(length + index);
    for(;index >= 0; index--)if(index in O)if(O[index] === el)return index;
    return -1;
  }
});

// 21.1.3.25 / 15.5.4.20 String.prototype.trim()
$def($def.P, 'String', {trim: require('./$.replacer')(/^\s*([\s\S]*\S)?\s*$/, '$1')});

// 20.3.3.1 / 15.9.4.4 Date.now()
$def($def.S, 'Date', {now: function(){
  return +new Date;
}});

function lz(num){
  return num > 9 ? num : '0' + num;
}
// 20.3.4.36 / 15.9.5.43 Date.prototype.toISOString()
$def($def.P, 'Date', {toISOString: function(){
  if(!isFinite(this))throw RangeError('Invalid time value');
  var d = this
    , y = d.getUTCFullYear()
    , m = d.getUTCMilliseconds()
    , s = y < 0 ? '-' : y > 9999 ? '+' : '';
  return s + ('00000' + Math.abs(y)).slice(s ? -6 : -4) +
    '-' + lz(d.getUTCMonth() + 1) + '-' + lz(d.getUTCDate()) +
    'T' + lz(d.getUTCHours()) + ':' + lz(d.getUTCMinutes()) +
    ':' + lz(d.getUTCSeconds()) + '.' + (m > 99 ? m : '0' + lz(m)) + 'Z';
}});

if(classof(function(){ return arguments; }()) == 'Object')cof.classof = function(it){
  var tag = classof(it);
  return tag == 'Object' && isFunction(it.callee) ? 'Arguments' : tag;
};
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.array-includes":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.array-includes.js","./$.array-methods":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.array-methods.js","./$.assert":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assert.js","./$.cof":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.cof.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.invoke":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.invoke.js","./$.replacer":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.replacer.js","./$.uid":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.uid.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.copy-within.js":[function(require,module,exports){
'use strict';
var $       = require('./$')
  , $def    = require('./$.def')
  , toIndex = $.toIndex;
$def($def.P, 'Array', {
  // 22.1.3.3 Array.prototype.copyWithin(target, start, end = this.length)
  copyWithin: function(target/* = 0 */, start /* = 0, end = @length */){
    var O     = Object($.assertDefined(this))
      , len   = $.toLength(O.length)
      , to    = toIndex(target, len)
      , from  = toIndex(start, len)
      , end   = arguments[2]
      , fin   = end === undefined ? len : toIndex(end, len)
      , count = Math.min(fin - from, len - to)
      , inc   = 1;
    if(from < to && to < from + count){
      inc  = -1;
      from = from + count - 1;
      to   = to   + count - 1;
    }
    while(count-- > 0){
      if(from in O)O[to] = O[from];
      else delete O[to];
      to   += inc;
      from += inc;
    } return O;
  }
});
require('./$.unscope')('copyWithin');
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.unscope":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.unscope.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.fill.js":[function(require,module,exports){
'use strict';
var $       = require('./$')
  , $def    = require('./$.def')
  , toIndex = $.toIndex;
$def($def.P, 'Array', {
  // 22.1.3.6 Array.prototype.fill(value, start = 0, end = this.length)
  fill: function(value /*, start = 0, end = @length */){
    var O      = Object($.assertDefined(this))
      , length = $.toLength(O.length)
      , index  = toIndex(arguments[1], length)
      , end    = arguments[2]
      , endPos = end === undefined ? length : toIndex(end, length);
    while(endPos > index)O[index++] = value;
    return O;
  }
});
require('./$.unscope')('fill');
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.unscope":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.unscope.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.find-index.js":[function(require,module,exports){
var $def = require('./$.def');
$def($def.P, 'Array', {
  // 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
  findIndex: require('./$.array-methods')(6)
});
require('./$.unscope')('findIndex');
},{"./$.array-methods":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.array-methods.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.unscope":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.unscope.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.find.js":[function(require,module,exports){
var $def = require('./$.def');
$def($def.P, 'Array', {
  // 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
  find: require('./$.array-methods')(5)
});
require('./$.unscope')('find');
},{"./$.array-methods":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.array-methods.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.unscope":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.unscope.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.from.js":[function(require,module,exports){
var $     = require('./$')
  , ctx   = require('./$.ctx')
  , $def  = require('./$.def')
  , $iter = require('./$.iter')
  , stepCall = $iter.stepCall;
$def($def.S + $def.F * $iter.DANGER_CLOSING, 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
    var O       = Object($.assertDefined(arrayLike))
      , mapfn   = arguments[1]
      , mapping = mapfn !== undefined
      , f       = mapping ? ctx(mapfn, arguments[2], 2) : undefined
      , index   = 0
      , length, result, step, iterator;
    if($iter.is(O)){
      iterator = $iter.get(O);
      // strange IE quirks mode bug -> use typeof instead of isFunction
      result   = new (typeof this == 'function' ? this : Array);
      for(; !(step = iterator.next()).done; index++){
        result[index] = mapping ? stepCall(iterator, f, [step.value, index], true) : step.value;
      }
    } else {
      // strange IE quirks mode bug -> use typeof instead of isFunction
      result = new (typeof this == 'function' ? this : Array)(length = $.toLength(O.length));
      for(; length > index; index++){
        result[index] = mapping ? f(O[index], index) : O[index];
      }
    }
    result.length = index;
    return result;
  }
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.ctx":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.ctx.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.iter":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.iter.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.iterator.js":[function(require,module,exports){
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
$iter.std(Array, 'Array', function(iterated, kind){
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
  if(kind == 'key'  )return step(0, index);
  if(kind == 'value')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'value');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

setUnscope('keys');
setUnscope('values');
setUnscope('entries');
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.iter":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.iter.js","./$.uid":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.uid.js","./$.unscope":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.unscope.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.of.js":[function(require,module,exports){
var $def = require('./$.def');
$def($def.S, 'Array', {
  // 22.1.2.3 Array.of( ...items)
  of: function(/* ...args */){
    var index  = 0
      , length = arguments.length
      // strange IE quirks mode bug -> use typeof instead of isFunction
      , result = new (typeof this == 'function' ? this : Array)(length);
    while(length > index)result[index] = arguments[index++];
    result.length = length;
    return result;
  }
});
},{"./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.species.js":[function(require,module,exports){
require('./$.species')(Array);
},{"./$.species":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.species.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.function.name.js":[function(require,module,exports){
'use strict';
var $    = require('./$')
  , NAME = 'name'
  , setDesc = $.setDesc
  , FunctionProto = Function.prototype;
// 19.2.4.2 name
NAME in FunctionProto || $.FW && $.DESC && setDesc(FunctionProto, NAME, {
  configurable: true,
  get: function(){
    var match = String(this).match(/^\s*function ([^ (]*)/)
      , name  = match ? match[1] : '';
    $.has(this, NAME) || setDesc(this, NAME, $.desc(5, name));
    return name;
  },
  set: function(value){
    $.has(this, NAME) || setDesc(this, NAME, $.desc(0, value));
  }
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.map.js":[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.1 Map Objects
require('./$.collection')('Map', {
  // 23.1.3.6 Map.prototype.get(key)
  get: function(key){
    var entry = strong.getEntry(this, key);
    return entry && entry.v;
  },
  // 23.1.3.9 Map.prototype.set(key, value)
  set: function(key, value){
    return strong.def(this, key === 0 ? 0 : key, value);
  }
}, strong, true);
},{"./$.collection":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.collection.js","./$.collection-strong":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.collection-strong.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.math.js":[function(require,module,exports){
var Infinity = 1 / 0
  , $def  = require('./$.def')
  , E     = Math.E
  , pow   = Math.pow
  , abs   = Math.abs
  , exp   = Math.exp
  , log   = Math.log
  , sqrt  = Math.sqrt
  , ceil  = Math.ceil
  , floor = Math.floor
  , sign  = Math.sign || function(x){
      return (x = +x) == 0 || x != x ? x : x < 0 ? -1 : 1;
    };

// 20.2.2.5 Math.asinh(x)
function asinh(x){
  return !isFinite(x = +x) || x == 0 ? x : x < 0 ? -asinh(-x) : log(x + sqrt(x * x + 1));
}
// 20.2.2.14 Math.expm1(x)
function expm1(x){
  return (x = +x) == 0 ? x : x > -1e-6 && x < 1e-6 ? x + x * x / 2 : exp(x) - 1;
}

$def($def.S, 'Math', {
  // 20.2.2.3 Math.acosh(x)
  acosh: function(x){
    return (x = +x) < 1 ? NaN : isFinite(x) ? log(x / E + sqrt(x + 1) * sqrt(x - 1) / E) + 1 : x;
  },
  // 20.2.2.5 Math.asinh(x)
  asinh: asinh,
  // 20.2.2.7 Math.atanh(x)
  atanh: function(x){
    return (x = +x) == 0 ? x : log((1 + x) / (1 - x)) / 2;
  },
  // 20.2.2.9 Math.cbrt(x)
  cbrt: function(x){
    return sign(x = +x) * pow(abs(x), 1 / 3);
  },
  // 20.2.2.11 Math.clz32(x)
  clz32: function(x){
    return (x >>>= 0) ? 32 - x.toString(2).length : 32;
  },
  // 20.2.2.12 Math.cosh(x)
  cosh: function(x){
    return (exp(x = +x) + exp(-x)) / 2;
  },
  // 20.2.2.14 Math.expm1(x)
  expm1: expm1,
  // 20.2.2.16 Math.fround(x)
  // TODO: fallback for IE9-
  fround: function(x){
    return new Float32Array([x])[0];
  },
  // 20.2.2.17 Math.hypot([value1[, value2[, … ]]])
  hypot: function(value1, value2){ // eslint-disable-line no-unused-vars
    var sum  = 0
      , len1 = arguments.length
      , len2 = len1
      , args = Array(len1)
      , larg = -Infinity
      , arg;
    while(len1--){
      arg = args[len1] = +arguments[len1];
      if(arg == Infinity || arg == -Infinity)return Infinity;
      if(arg > larg)larg = arg;
    }
    larg = arg || 1;
    while(len2--)sum += pow(args[len2] / larg, 2);
    return larg * sqrt(sum);
  },
  // 20.2.2.18 Math.imul(x, y)
  imul: function(x, y){
    var UInt16 = 0xffff
      , xn = +x
      , yn = +y
      , xl = UInt16 & xn
      , yl = UInt16 & yn;
    return 0 | xl * yl + ((UInt16 & xn >>> 16) * yl + xl * (UInt16 & yn >>> 16) << 16 >>> 0);
  },
  // 20.2.2.20 Math.log1p(x)
  log1p: function(x){
    return (x = +x) > -1e-8 && x < 1e-8 ? x - x * x / 2 : log(1 + x);
  },
  // 20.2.2.21 Math.log10(x)
  log10: function(x){
    return log(x) / Math.LN10;
  },
  // 20.2.2.22 Math.log2(x)
  log2: function(x){
    return log(x) / Math.LN2;
  },
  // 20.2.2.28 Math.sign(x)
  sign: sign,
  // 20.2.2.30 Math.sinh(x)
  sinh: function(x){
    return abs(x = +x) < 1 ? (expm1(x) - expm1(-x)) / 2 : (exp(x - 1) - exp(-x - 1)) * (E / 2);
  },
  // 20.2.2.33 Math.tanh(x)
  tanh: function(x){
    var a = expm1(x = +x)
      , b = expm1(-x);
    return a == Infinity ? 1 : b == Infinity ? -1 : (a - b) / (exp(x) + exp(-x));
  },
  // 20.2.2.34 Math.trunc(x)
  trunc: function(it){
    return (it > 0 ? floor : ceil)(it);
  }
});
},{"./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.number.constructor.js":[function(require,module,exports){
'use strict';
var $          = require('./$')
  , isObject   = $.isObject
  , isFunction = $.isFunction
  , NUMBER     = 'Number'
  , Number     = $.g[NUMBER]
  , Base       = Number
  , proto      = Number.prototype;
function toPrimitive(it){
  var fn, val;
  if(isFunction(fn = it.valueOf) && !isObject(val = fn.call(it)))return val;
  if(isFunction(fn = it.toString) && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to number");
}
function toNumber(it){
  if(isObject(it))it = toPrimitive(it);
  if(typeof it == 'string' && it.length > 2 && it.charCodeAt(0) == 48){
    var binary = false;
    switch(it.charCodeAt(1)){
      case 66 : case 98  : binary = true;
      case 79 : case 111 : return parseInt(it.slice(2), binary ? 2 : 8);
    }
  } return +it;
}
if($.FW && !(Number('0o1') && Number('0b1'))){
  Number = function Number(it){
    return this instanceof Number ? new Base(toNumber(it)) : toNumber(it);
  };
  $.each.call($.DESC ? $.getNames(Base) : (
      // ES3:
      'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
      // ES6 (in case, if modules with ES6 Number statics required before):
      'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
      'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
    ).split(','), function(key){
      if($.has(Base, key) && !$.has(Number, key)){
        $.setDesc(Number, key, $.getDesc(Base, key));
      }
    }
  );
  Number.prototype = proto;
  proto.constructor = Number;
  $.hide($.g, NUMBER, Number);
}
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.number.statics.js":[function(require,module,exports){
var $     = require('./$')
  , $def  = require('./$.def')
  , abs   = Math.abs
  , floor = Math.floor
  , MAX_SAFE_INTEGER = 0x1fffffffffffff; // pow(2, 53) - 1 == 9007199254740991;
function isInteger(it){
  return !$.isObject(it) && isFinite(it) && floor(it) === it;
}
$def($def.S, 'Number', {
  // 20.1.2.1 Number.EPSILON
  EPSILON: Math.pow(2, -52),
  // 20.1.2.2 Number.isFinite(number)
  isFinite: function(it){
    return typeof it == 'number' && isFinite(it);
  },
  // 20.1.2.3 Number.isInteger(number)
  isInteger: isInteger,
  // 20.1.2.4 Number.isNaN(number)
  isNaN: function(number){
    return number != number;
  },
  // 20.1.2.5 Number.isSafeInteger(number)
  isSafeInteger: function(number){
    return isInteger(number) && abs(number) <= MAX_SAFE_INTEGER;
  },
  // 20.1.2.6 Number.MAX_SAFE_INTEGER
  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
  // 20.1.2.10 Number.MIN_SAFE_INTEGER
  MIN_SAFE_INTEGER: -MAX_SAFE_INTEGER,
  // 20.1.2.12 Number.parseFloat(string)
  parseFloat: parseFloat,
  // 20.1.2.13 Number.parseInt(string, radix)
  parseInt: parseInt
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.object.assign.js":[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $def = require('./$.def');
$def($def.S, 'Object', {assign: require('./$.assign')});
},{"./$.assign":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assign.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.object.is.js":[function(require,module,exports){
// 19.1.3.10 Object.is(value1, value2)
var $def = require('./$.def');
$def($def.S, 'Object', {
  is: function(x, y){
    return x === y ? x !== 0 || 1 / x === 1 / y : x != x && y != y;
  }
});
},{"./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.object.set-prototype-of.js":[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $def = require('./$.def');
$def($def.S, 'Object', {setPrototypeOf: require('./$.set-proto')});
},{"./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.set-proto":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.set-proto.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.object.statics-accept-primitives.js":[function(require,module,exports){
var $        = require('./$')
  , $def     = require('./$.def')
  , isObject = $.isObject
  , toObject = $.toObject;
function wrapObjectMethod(METHOD, MODE){
  var fn  = ($.core.Object || {})[METHOD] || Object[METHOD]
    , f   = 0
    , o   = {};
  o[METHOD] = MODE == 1 ? function(it){
    return isObject(it) ? fn(it) : it;
  } : MODE == 2 ? function(it){
    return isObject(it) ? fn(it) : true;
  } : MODE == 3 ? function(it){
    return isObject(it) ? fn(it) : false;
  } : MODE == 4 ? function(it, key){
    return fn(toObject(it), key);
  } : MODE == 5 ? function(it){
    return fn(Object($.assertDefined(it)));
  } : function(it){
    return fn(toObject(it));
  };
  try {
    fn('z');
  } catch(e){
    f = 1;
  }
  $def($def.S + $def.F * f, 'Object', o);
}
wrapObjectMethod('freeze', 1);
wrapObjectMethod('seal', 1);
wrapObjectMethod('preventExtensions', 1);
wrapObjectMethod('isFrozen', 2);
wrapObjectMethod('isSealed', 2);
wrapObjectMethod('isExtensible', 3);
wrapObjectMethod('getOwnPropertyDescriptor', 4);
wrapObjectMethod('getPrototypeOf', 5);
wrapObjectMethod('keys');
wrapObjectMethod('getOwnPropertyNames');
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.object.to-string.js":[function(require,module,exports){
'use strict';
// 19.1.3.6 Object.prototype.toString()
var $   = require('./$')
  , cof = require('./$.cof')
  , tmp = {};
tmp[require('./$.wks')('toStringTag')] = 'z';
if($.FW && cof(tmp) != 'z')$.hide(Object.prototype, 'toString', function(){
  return '[object ' + cof.classof(this) + ']';
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.cof":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.cof.js","./$.wks":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.wks.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.promise.js":[function(require,module,exports){
'use strict';
var $       = require('./$')
  , ctx     = require('./$.ctx')
  , cof     = require('./$.cof')
  , $def    = require('./$.def')
  , assert  = require('./$.assert')
  , $iter   = require('./$.iter')
  , SPECIES = require('./$.wks')('species')
  , RECORD  = require('./$.uid').safe('record')
  , forOf   = $iter.forOf
  , PROMISE = 'Promise'
  , global  = $.g
  , process = global.process
  , asap    = process && process.nextTick || require('./$.task').set
  , Promise = global[PROMISE]
  , Base    = Promise
  , isFunction     = $.isFunction
  , isObject       = $.isObject
  , assertFunction = assert.fn
  , assertObject   = assert.obj
  , test;
function getConstructor(C){
  var S = assertObject(C)[SPECIES];
  return S != undefined ? S : C;
}
isFunction(Promise) && isFunction(Promise.resolve)
&& Promise.resolve(test = new Promise(function(){})) == test
|| function(){
  function isThenable(it){
    var then;
    if(isObject(it))then = it.then;
    return isFunction(then) ? then : false;
  }
  function handledRejectionOrHasOnRejected(promise){
    var record = promise[RECORD]
      , chain  = record.c
      , i      = 0
      , react;
    if(record.h)return true;
    while(chain.length > i){
      react = chain[i++];
      if(react.fail || handledRejectionOrHasOnRejected(react.P))return true;
    }
  }
  function notify(record, isReject){
    var chain = record.c;
    if(isReject || chain.length)asap(function(){
      var promise = record.p
        , value   = record.v
        , ok      = record.s == 1
        , i       = 0;
      if(isReject && !handledRejectionOrHasOnRejected(promise)){
        setTimeout(function(){
          if(!handledRejectionOrHasOnRejected(promise)){
            if(cof(process) == 'process'){
              process.emit('unhandledRejection', value, promise);
            } else if(global.console && isFunction(console.error)){
              console.error('Unhandled promise rejection', value);
            }
          }
        }, 1e3);
      } else while(chain.length > i)!function(react){
        var cb = ok ? react.ok : react.fail
          , ret, then;
        try {
          if(cb){
            if(!ok)record.h = true;
            ret = cb === true ? value : cb(value);
            if(ret === react.P){
              react.rej(TypeError(PROMISE + '-chain cycle'));
            } else if(then = isThenable(ret)){
              then.call(ret, react.res, react.rej);
            } else react.res(ret);
          } else react.rej(value);
        } catch(err){
          react.rej(err);
        }
      }(chain[i++]);
      chain.length = 0;
    });
  }
  function reject(value){
    var record = this;
    if(record.d)return;
    record.d = true;
    record = record.r || record; // unwrap
    record.v = value;
    record.s = 2;
    notify(record, true);
  }
  function resolve(value){
    var record = this
      , then, wrapper;
    if(record.d)return;
    record.d = true;
    record = record.r || record; // unwrap
    try {
      if(then = isThenable(value)){
        wrapper = {r: record, d: false}; // wrap
        then.call(value, ctx(resolve, wrapper, 1), ctx(reject, wrapper, 1));
      } else {
        record.v = value;
        record.s = 1;
        notify(record);
      }
    } catch(err){
      reject.call(wrapper || {r: record, d: false}, err); // wrap
    }
  }
  // 25.4.3.1 Promise(executor)
  Promise = function(executor){
    assertFunction(executor);
    var record = {
      p: assert.inst(this, Promise, PROMISE), // <- promise
      c: [],                                  // <- chain
      s: 0,                                   // <- state
      d: false,                               // <- done
      v: undefined,                           // <- value
      h: false                                // <- handled rejection
    };
    $.hide(this, RECORD, record);
    try {
      executor(ctx(resolve, record, 1), ctx(reject, record, 1));
    } catch(err){
      reject.call(record, err);
    }
  };
  $.mix(Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function(onFulfilled, onRejected){
      var S = assertObject(assertObject(this).constructor)[SPECIES];
      var react = {
        ok:   isFunction(onFulfilled) ? onFulfilled : true,
        fail: isFunction(onRejected)  ? onRejected  : false
      };
      var P = react.P = new (S != undefined ? S : Promise)(function(res, rej){
        react.res = assertFunction(res);
        react.rej = assertFunction(rej);
      });
      var record = this[RECORD];
      record.c.push(react);
      record.s && notify(record);
      return P;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function(onRejected){
      return this.then(undefined, onRejected);
    }
  });
}();
$def($def.G + $def.W + $def.F * (Promise != Base), {Promise: Promise});
$def($def.S, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function(r){
    return new (getConstructor(this))(function(res, rej){
      rej(r);
    });
  },
  // 25.4.4.6 Promise.resolve(x)
  resolve: function(x){
    return isObject(x) && RECORD in x && $.getProto(x) === this.prototype
      ? x : new (getConstructor(this))(function(res){
        res(x);
      });
  }
});
$def($def.S + $def.F * ($iter.fail(function(iter){
  Promise.all(iter)['catch'](function(){});
}) || $iter.DANGER_CLOSING), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function(iterable){
    var C      = getConstructor(this)
      , values = [];
    return new C(function(resolve, reject){
      forOf(iterable, false, values.push, values);
      var remaining = values.length
        , results   = Array(remaining);
      if(remaining)$.each.call(values, function(promise, index){
        C.resolve(promise).then(function(value){
          results[index] = value;
          --remaining || resolve(results);
        }, reject);
      });
      else resolve(results);
    });
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function(iterable){
    var C = getConstructor(this);
    return new C(function(resolve, reject){
      forOf(iterable, false, function(promise){
        C.resolve(promise).then(resolve, reject);
      });
    });
  }
});
cof.set(Promise, PROMISE);
require('./$.species')(Promise);
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.assert":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assert.js","./$.cof":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.cof.js","./$.ctx":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.ctx.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.iter":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.iter.js","./$.species":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.species.js","./$.task":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.task.js","./$.uid":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.uid.js","./$.wks":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.wks.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.reflect.js":[function(require,module,exports){
var $         = require('./$')
  , $def      = require('./$.def')
  , setProto  = require('./$.set-proto')
  , $iter     = require('./$.iter')
  , ITER      = require('./$.uid').safe('iter')
  , step      = $iter.step
  , assert    = require('./$.assert')
  , isObject  = $.isObject
  , getDesc   = $.getDesc
  , setDesc   = $.setDesc
  , getProto  = $.getProto
  , apply     = Function.apply
  , assertObject = assert.obj
  , isExtensible = Object.isExtensible || $.it;
function Enumerate(iterated){
  var keys = [], key;
  for(key in iterated)keys.push(key);
  $.set(this, ITER, {o: iterated, a: keys, i: 0});
}
$iter.create(Enumerate, 'Object', function(){
  var iter = this[ITER]
    , keys = iter.a
    , key;
  do {
    if(iter.i >= keys.length)return step(1);
  } while(!((key = keys[iter.i++]) in iter.o));
  return step(0, key);
});

function wrap(fn){
  return function(it){
    assertObject(it);
    try {
      fn.apply(undefined, arguments);
      return true;
    } catch(e){
      return false;
    }
  };
}

function reflectGet(target, propertyKey/*, receiver*/){
  var receiver = arguments.length < 3 ? target : arguments[2]
    , desc = getDesc(assertObject(target), propertyKey), proto;
  if(desc)return $.has(desc, 'value')
    ? desc.value
    : desc.get === undefined
      ? undefined
      : desc.get.call(receiver);
  return isObject(proto = getProto(target))
    ? reflectGet(proto, propertyKey, receiver)
    : undefined;
}
function reflectSet(target, propertyKey, V/*, receiver*/){
  var receiver = arguments.length < 4 ? target : arguments[3]
    , ownDesc  = getDesc(assertObject(target), propertyKey)
    , existingDescriptor, proto;
  if(!ownDesc){
    if(isObject(proto = getProto(target))){
      return reflectSet(proto, propertyKey, V, receiver);
    }
    ownDesc = $.desc(0);
  }
  if($.has(ownDesc, 'value')){
    if(ownDesc.writable === false || !isObject(receiver))return false;
    existingDescriptor = getDesc(receiver, propertyKey) || $.desc(0);
    existingDescriptor.value = V;
    setDesc(receiver, propertyKey, existingDescriptor);
    return true;
  }
  return ownDesc.set === undefined ? false : (ownDesc.set.call(receiver, V), true);
}

var reflect = {
  // 26.1.1 Reflect.apply(target, thisArgument, argumentsList)
  apply: require('./$.ctx')(Function.call, apply, 3),
  // 26.1.2 Reflect.construct(target, argumentsList [, newTarget])
  construct: function(target, argumentsList /*, newTarget*/){
    var proto    = assert.fn(arguments.length < 3 ? target : arguments[2]).prototype
      , instance = $.create(isObject(proto) ? proto : Object.prototype)
      , result   = apply.call(target, instance, argumentsList);
    return isObject(result) ? result : instance;
  },
  // 26.1.3 Reflect.defineProperty(target, propertyKey, attributes)
  defineProperty: wrap(setDesc),
  // 26.1.4 Reflect.deleteProperty(target, propertyKey)
  deleteProperty: function(target, propertyKey){
    var desc = getDesc(assertObject(target), propertyKey);
    return desc && !desc.configurable ? false : delete target[propertyKey];
  },
  // 26.1.5 Reflect.enumerate(target)
  enumerate: function(target){
    return new Enumerate(assertObject(target));
  },
  // 26.1.6 Reflect.get(target, propertyKey [, receiver])
  get: reflectGet,
  // 26.1.7 Reflect.getOwnPropertyDescriptor(target, propertyKey)
  getOwnPropertyDescriptor: function(target, propertyKey){
    return getDesc(assertObject(target), propertyKey);
  },
  // 26.1.8 Reflect.getPrototypeOf(target)
  getPrototypeOf: function(target){
    return getProto(assertObject(target));
  },
  // 26.1.9 Reflect.has(target, propertyKey)
  has: function(target, propertyKey){
    return propertyKey in target;
  },
  // 26.1.10 Reflect.isExtensible(target)
  isExtensible: function(target){
    return !!isExtensible(assertObject(target));
  },
  // 26.1.11 Reflect.ownKeys(target)
  ownKeys: require('./$.own-keys'),
  // 26.1.12 Reflect.preventExtensions(target)
  preventExtensions: wrap(Object.preventExtensions || $.it),
  // 26.1.13 Reflect.set(target, propertyKey, V [, receiver])
  set: reflectSet
};
// 26.1.14 Reflect.setPrototypeOf(target, proto)
if(setProto)reflect.setPrototypeOf = function(target, proto){
  setProto(assertObject(target), proto);
  return true;
};

$def($def.G, {Reflect: {}});
$def($def.S, 'Reflect', reflect);
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.assert":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.assert.js","./$.ctx":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.ctx.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.iter":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.iter.js","./$.own-keys":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.own-keys.js","./$.set-proto":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.set-proto.js","./$.uid":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.uid.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.regexp.js":[function(require,module,exports){
var $      = require('./$')
  , cof    = require('./$.cof')
  , RegExp = $.g.RegExp
  , Base   = RegExp
  , proto  = RegExp.prototype;
if($.FW && $.DESC){
  // RegExp allows a regex with flags as the pattern
  if(!function(){try{ return RegExp(/a/g, 'i') == '/a/i'; }catch(e){ /* empty */ }}()){
    RegExp = function RegExp(pattern, flags){
      return new Base(cof(pattern) == 'RegExp' && flags !== undefined
        ? pattern.source : pattern, flags);
    };
    $.each.call($.getNames(Base), function(key){
      key in RegExp || $.setDesc(RegExp, key, {
        configurable: true,
        get: function(){ return Base[key]; },
        set: function(it){ Base[key] = it; }
      });
    });
    proto.constructor = RegExp;
    RegExp.prototype = proto;
    $.hide($.g, 'RegExp', RegExp);
  }
  // 21.2.5.3 get RegExp.prototype.flags()
  if(/./g.flags != 'g')$.setDesc(proto, 'flags', {
    configurable: true,
    get: require('./$.replacer')(/^.*\/(\w*)$/, '$1')
  });
}
require('./$.species')(RegExp);
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.cof":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.cof.js","./$.replacer":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.replacer.js","./$.species":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.species.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.set.js":[function(require,module,exports){
'use strict';
var strong = require('./$.collection-strong');

// 23.2 Set Objects
require('./$.collection')('Set', {
  // 23.2.3.1 Set.prototype.add(value)
  add: function(value){
    return strong.def(this, value = value === 0 ? 0 : value, value);
  }
}, strong);
},{"./$.collection":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.collection.js","./$.collection-strong":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.collection-strong.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.code-point-at.js":[function(require,module,exports){
var $def = require('./$.def');
$def($def.P, 'String', {
  // 21.1.3.3 String.prototype.codePointAt(pos)
  codePointAt: require('./$.string-at')(false)
});
},{"./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.string-at":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.string-at.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.ends-with.js":[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def')
  , toLength = $.toLength;

$def($def.P, 'String', {
  // 21.1.3.6 String.prototype.endsWith(searchString [, endPosition])
  endsWith: function(searchString /*, endPosition = @length */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    var that = String($.assertDefined(this))
      , endPosition = arguments[1]
      , len = toLength(that.length)
      , end = endPosition === undefined ? len : Math.min(toLength(endPosition), len);
    searchString += '';
    return that.slice(end - searchString.length, end) === searchString;
  }
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.cof":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.cof.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.from-code-point.js":[function(require,module,exports){
var $def    = require('./$.def')
  , toIndex = require('./$').toIndex
  , fromCharCode = String.fromCharCode;

$def($def.S, 'String', {
  // 21.1.2.2 String.fromCodePoint(...codePoints)
  fromCodePoint: function(x){ // eslint-disable-line no-unused-vars
    var res = []
      , len = arguments.length
      , i   = 0
      , code;
    while(len > i){
      code = +arguments[i++];
      if(toIndex(code, 0x10ffff) !== code)throw RangeError(code + ' is not a valid code point');
      res.push(code < 0x10000
        ? fromCharCode(code)
        : fromCharCode(((code -= 0x10000) >> 10) + 0xd800, code % 0x400 + 0xdc00)
      );
    } return res.join('');
  }
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.includes.js":[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.7 String.prototype.includes(searchString, position = 0)
  includes: function(searchString /*, position = 0 */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    return !!~String($.assertDefined(this)).indexOf(searchString, arguments[1]);
  }
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.cof":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.cof.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.iterator.js":[function(require,module,exports){
var set   = require('./$').set
  , at    = require('./$.string-at')(true)
  , ITER  = require('./$.uid').safe('iter')
  , $iter = require('./$.iter')
  , step  = $iter.step;

// 21.1.3.27 String.prototype[@@iterator]()
$iter.std(String, 'String', function(iterated){
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
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.iter":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.iter.js","./$.string-at":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.string-at.js","./$.uid":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.uid.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.raw.js":[function(require,module,exports){
var $    = require('./$')
  , $def = require('./$.def');

$def($def.S, 'String', {
  // 21.1.2.4 String.raw(callSite, ...substitutions)
  raw: function(callSite){
    var raw = $.toObject(callSite.raw)
      , len = $.toLength(raw.length)
      , sln = arguments.length
      , res = []
      , i   = 0;
    while(len > i){
      res.push(String(raw[i++]));
      if(i < sln)res.push(String(arguments[i]));
    } return res.join('');
  }
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.repeat.js":[function(require,module,exports){
'use strict';
var $    = require('./$')
  , $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.13 String.prototype.repeat(count)
  repeat: function(count){
    var str = String($.assertDefined(this))
      , res = ''
      , n   = $.toInteger(count);
    if(n < 0 || n == Infinity)throw RangeError("Count can't be negative");
    for(;n > 0; (n >>>= 1) && (str += str))if(n & 1)res += str;
    return res;
  }
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.starts-with.js":[function(require,module,exports){
'use strict';
var $    = require('./$')
  , cof  = require('./$.cof')
  , $def = require('./$.def');

$def($def.P, 'String', {
  // 21.1.3.18 String.prototype.startsWith(searchString [, position ])
  startsWith: function(searchString /*, position = 0 */){
    if(cof(searchString) == 'RegExp')throw TypeError();
    var that  = String($.assertDefined(this))
      , index = $.toLength(Math.min(arguments[1], that.length));
    searchString += '';
    return that.slice(index, index + searchString.length) === searchString;
  }
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.cof":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.cof.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.symbol.js":[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var $        = require('./$')
  , setTag   = require('./$.cof').set
  , uid      = require('./$.uid')
  , $def     = require('./$.def')
  , keyOf    = require('./$.keyof')
  , has      = $.has
  , hide     = $.hide
  , getNames = $.getNames
  , toObject = $.toObject
  , Symbol   = $.g.Symbol
  , Base     = Symbol
  , setter   = false
  , TAG      = uid.safe('tag')
  , SymbolRegistry = {}
  , AllSymbols     = {};

function wrap(tag){
  var sym = AllSymbols[tag] = $.set($.create(Symbol.prototype), TAG, tag);
  $.DESC && setter && $.setDesc(Object.prototype, tag, {
    configurable: true,
    set: function(value){
      hide(this, tag, value);
    }
  });
  return sym;
}

// 19.4.1.1 Symbol([description])
if(!$.isFunction(Symbol)){
  Symbol = function(description){
    if(this instanceof Symbol)throw TypeError('Symbol is not a constructor');
    return wrap(uid(description));
  };
  hide(Symbol.prototype, 'toString', function(){
    return this[TAG];
  });
}
$def($def.G + $def.W, {Symbol: Symbol});

var symbolStatics = {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function(key){
    return keyOf(SymbolRegistry, key);
  },
  pure: uid.safe,
  set: $.set,
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
    symbolStatics[it] = Symbol === Base ? sym : wrap(sym);
  }
);

setter = true;

$def($def.S, 'Symbol', symbolStatics);

$def($def.S + $def.F * (Symbol != Base), 'Object', {
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: function(it){
    var names = getNames(toObject(it)), result = [], key, i = 0;
    while(names.length > i)has(AllSymbols, key = names[i++]) || result.push(key);
    return result;
  },
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: function(it){
    var names = getNames(toObject(it)), result = [], key, i = 0;
    while(names.length > i)has(AllSymbols, key = names[i++]) && result.push(AllSymbols[key]);
    return result;
  }
});

setTag(Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setTag($.g.JSON, 'JSON', true);
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.cof":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.cof.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.keyof":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.keyof.js","./$.uid":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.uid.js","./$.wks":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.wks.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.weak-map.js":[function(require,module,exports){
'use strict';
var $         = require('./$')
  , weak      = require('./$.collection-weak')
  , leakStore = weak.leakStore
  , ID        = weak.ID
  , WEAK      = weak.WEAK
  , has       = $.has
  , isObject  = $.isObject
  , isFrozen  = Object.isFrozen || $.core.Object.isFrozen
  , tmp       = {};

// 23.3 WeakMap Objects
var WeakMap = require('./$.collection')('WeakMap', {
  // 23.3.3.3 WeakMap.prototype.get(key)
  get: function(key){
    if(isObject(key)){
      if(isFrozen(key))return leakStore(this).get(key);
      if(has(key, WEAK))return key[WEAK][this[ID]];
    }
  },
  // 23.3.3.5 WeakMap.prototype.set(key, value)
  set: function(key, value){
    return weak.def(this, key, value);
  }
}, weak, true, true);

// IE11 WeakMap frozen keys fix
if($.FW && new WeakMap().set((Object.freeze || Object)(tmp), 7).get(tmp) != 7){
  $.each.call(['delete', 'has', 'get', 'set'], function(key){
    var method = WeakMap.prototype[key];
    WeakMap.prototype[key] = function(a, b){
      // store frozen objects on leaky map
      if(isObject(a) && isFrozen(a)){
        var result = leakStore(this)[key](a, b);
        return key == 'set' ? this : result;
      // store all the rest on native weakmap
      } return method.call(this, a, b);
    };
  });
}
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.collection":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.collection.js","./$.collection-weak":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.collection-weak.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.weak-set.js":[function(require,module,exports){
'use strict';
var weak = require('./$.collection-weak');

// 23.4 WeakSet Objects
require('./$.collection')('WeakSet', {
  // 23.4.3.1 WeakSet.prototype.add(value)
  add: function(value){
    return weak.def(this, value, true);
  }
}, weak, false, true);
},{"./$.collection":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.collection.js","./$.collection-weak":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.collection-weak.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es7.array.includes.js":[function(require,module,exports){
// https://github.com/domenic/Array.prototype.includes
var $def = require('./$.def');
$def($def.P, 'Array', {
  includes: require('./$.array-includes')(true)
});
require('./$.unscope')('includes');
},{"./$.array-includes":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.array-includes.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.unscope":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.unscope.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es7.object.get-own-property-descriptors.js":[function(require,module,exports){
// https://gist.github.com/WebReflection/9353781
var $       = require('./$')
  , $def    = require('./$.def')
  , ownKeys = require('./$.own-keys');

$def($def.S, 'Object', {
  getOwnPropertyDescriptors: function(object){
    var O      = $.toObject(object)
      , result = {};
    $.each.call(ownKeys(O), function(key){
      $.setDesc(result, key, $.desc(0, $.getDesc(O, key)));
    });
    return result;
  }
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.own-keys":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.own-keys.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es7.object.to-array.js":[function(require,module,exports){
// http://goo.gl/XkBrjD
var $    = require('./$')
  , $def = require('./$.def');
function createObjectToArray(isEntries){
  return function(object){
    var O      = $.toObject(object)
      , keys   = $.getKeys(object)
      , length = keys.length
      , i      = 0
      , result = Array(length)
      , key;
    if(isEntries)while(length > i)result[i] = [key = keys[i++], O[key]];
    else while(length > i)result[i] = O[keys[i++]];
    return result;
  };
}
$def($def.S, 'Object', {
  values:  createObjectToArray(false),
  entries: createObjectToArray(true)
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es7.regexp.escape.js":[function(require,module,exports){
// https://gist.github.com/kangax/9698100
var $def = require('./$.def');
$def($def.S, 'RegExp', {
  escape: require('./$.replacer')(/([\\\-[\]{}()*+?.,^$|])/g, '\\$1', true)
});
},{"./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.replacer":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.replacer.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es7.string.at.js":[function(require,module,exports){
// https://github.com/mathiasbynens/String.prototype.at
var $def = require('./$.def');
$def($def.P, 'String', {
  at: require('./$.string-at')(true)
});
},{"./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.string-at":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.string-at.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/js.array.statics.js":[function(require,module,exports){
// JavaScript 1.6 / Strawman array statics shim
var $       = require('./$')
  , $def    = require('./$.def')
  , core    = $.core
  , statics = {};
function setStatics(keys, length){
  $.each.call(keys.split(','), function(key){
    if(length == undefined && key in core.Array)statics[key] = core.Array[key];
    else if(key in [])statics[key] = require('./$.ctx')(Function.call, [][key], length);
  });
}
setStatics('pop,reverse,shift,keys,values,entries', 1);
setStatics('indexOf,every,some,forEach,map,filter,find,findIndex,includes', 3);
setStatics('join,slice,concat,push,splice,unshift,sort,lastIndexOf,' +
           'reduce,reduceRight,copyWithin,fill,turn');
$def($def.S, 'Array', statics);
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.ctx":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.ctx.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/web.dom.iterable.js":[function(require,module,exports){
require('./es6.array.iterator');
var $         = require('./$')
  , Iterators = require('./$.iter').Iterators
  , ITERATOR  = require('./$.wks')('iterator')
  , NodeList  = $.g.NodeList;
if($.FW && NodeList && !(ITERATOR in NodeList.prototype)){
  $.hide(NodeList.prototype, ITERATOR, Iterators.Array);
}
Iterators.NodeList = Iterators.Array;
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.iter":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.iter.js","./$.wks":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.wks.js","./es6.array.iterator":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.iterator.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/web.immediate.js":[function(require,module,exports){
var $def  = require('./$.def')
  , $task = require('./$.task');
$def($def.G + $def.B, {
  setImmediate:   $task.set,
  clearImmediate: $task.clear
});
},{"./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.task":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.task.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/web.timers.js":[function(require,module,exports){
// ie9- setTimeout & setInterval additional parameters fix
var $       = require('./$')
  , $def    = require('./$.def')
  , invoke  = require('./$.invoke')
  , partial = require('./$.partial')
  , MSIE    = !!$.g.navigator && /MSIE .\./.test(navigator.userAgent); // <- dirty ie9- check
function wrap(set){
  return MSIE ? function(fn, time /*, ...args */){
    return set(invoke(
      partial,
      [].slice.call(arguments, 2),
      $.isFunction(fn) ? fn : Function(fn)
    ), time);
  } : set;
}
$def($def.G + $def.B + $def.F * MSIE, {
  setTimeout:  wrap($.g.setTimeout),
  setInterval: wrap($.g.setInterval)
});
},{"./$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./$.def":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.def.js","./$.invoke":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.invoke.js","./$.partial":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.partial.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/shim.js":[function(require,module,exports){
require('./modules/es5');
require('./modules/es6.symbol');
require('./modules/es6.object.assign');
require('./modules/es6.object.is');
require('./modules/es6.object.set-prototype-of');
require('./modules/es6.object.to-string');
require('./modules/es6.object.statics-accept-primitives');
require('./modules/es6.function.name');
require('./modules/es6.number.constructor');
require('./modules/es6.number.statics');
require('./modules/es6.math');
require('./modules/es6.string.from-code-point');
require('./modules/es6.string.raw');
require('./modules/es6.string.iterator');
require('./modules/es6.string.code-point-at');
require('./modules/es6.string.ends-with');
require('./modules/es6.string.includes');
require('./modules/es6.string.repeat');
require('./modules/es6.string.starts-with');
require('./modules/es6.array.from');
require('./modules/es6.array.of');
require('./modules/es6.array.iterator');
require('./modules/es6.array.species');
require('./modules/es6.array.copy-within');
require('./modules/es6.array.fill');
require('./modules/es6.array.find');
require('./modules/es6.array.find-index');
require('./modules/es6.regexp');
require('./modules/es6.promise');
require('./modules/es6.map');
require('./modules/es6.set');
require('./modules/es6.weak-map');
require('./modules/es6.weak-set');
require('./modules/es6.reflect');
require('./modules/es7.array.includes');
require('./modules/es7.string.at');
require('./modules/es7.regexp.escape');
require('./modules/es7.object.get-own-property-descriptors');
require('./modules/es7.object.to-array');
require('./modules/js.array.statics');
require('./modules/web.timers');
require('./modules/web.immediate');
require('./modules/web.dom.iterable');
module.exports = require('./modules/$').core;
},{"./modules/$":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/$.js","./modules/es5":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es5.js","./modules/es6.array.copy-within":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.copy-within.js","./modules/es6.array.fill":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.fill.js","./modules/es6.array.find":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.find.js","./modules/es6.array.find-index":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.find-index.js","./modules/es6.array.from":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.from.js","./modules/es6.array.iterator":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.iterator.js","./modules/es6.array.of":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.of.js","./modules/es6.array.species":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.array.species.js","./modules/es6.function.name":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.function.name.js","./modules/es6.map":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.map.js","./modules/es6.math":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.math.js","./modules/es6.number.constructor":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.number.constructor.js","./modules/es6.number.statics":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.number.statics.js","./modules/es6.object.assign":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.object.assign.js","./modules/es6.object.is":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.object.is.js","./modules/es6.object.set-prototype-of":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.object.set-prototype-of.js","./modules/es6.object.statics-accept-primitives":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.object.statics-accept-primitives.js","./modules/es6.object.to-string":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.object.to-string.js","./modules/es6.promise":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.promise.js","./modules/es6.reflect":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.reflect.js","./modules/es6.regexp":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.regexp.js","./modules/es6.set":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.set.js","./modules/es6.string.code-point-at":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.code-point-at.js","./modules/es6.string.ends-with":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.ends-with.js","./modules/es6.string.from-code-point":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.from-code-point.js","./modules/es6.string.includes":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.includes.js","./modules/es6.string.iterator":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.iterator.js","./modules/es6.string.raw":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.raw.js","./modules/es6.string.repeat":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.repeat.js","./modules/es6.string.starts-with":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.string.starts-with.js","./modules/es6.symbol":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.symbol.js","./modules/es6.weak-map":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.weak-map.js","./modules/es6.weak-set":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es6.weak-set.js","./modules/es7.array.includes":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es7.array.includes.js","./modules/es7.object.get-own-property-descriptors":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es7.object.get-own-property-descriptors.js","./modules/es7.object.to-array":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es7.object.to-array.js","./modules/es7.regexp.escape":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es7.regexp.escape.js","./modules/es7.string.at":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/es7.string.at.js","./modules/js.array.statics":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/js.array.statics.js","./modules/web.dom.iterable":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/web.dom.iterable.js","./modules/web.immediate":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/web.immediate.js","./modules/web.timers":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/core-js/modules/web.timers.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/node_modules/regenerator-babel/runtime.js":[function(require,module,exports){
(function (global){
/**
 * Copyright (c) 2014, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * https://raw.github.com/facebook/regenerator/master/LICENSE file. An
 * additional grant of patent rights can be found in the PATENTS file in
 * the same directory.
 */

!(function(global) {
  "use strict";

  var hasOwn = Object.prototype.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var iteratorSymbol =
    typeof Symbol === "function" && Symbol.iterator || "@@iterator";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    return new Generator(innerFn, outerFn, self || null, tryLocsList || []);
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  var Gp = GeneratorFunctionPrototype.prototype = Generator.prototype;
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunction.displayName = "GeneratorFunction";

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    genFun.__proto__ = GeneratorFunctionPrototype;
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    return new Promise(function(resolve, reject) {
      var generator = wrap(innerFn, outerFn, self, tryLocsList);
      var callNext = step.bind(generator.next);
      var callThrow = step.bind(generator["throw"]);

      function step(arg) {
        var record = tryCatch(this, null, arg);
        if (record.type === "throw") {
          reject(record.arg);
          return;
        }

        var info = record.arg;
        if (info.done) {
          resolve(info.value);
        } else {
          Promise.resolve(info.value).then(callNext, callThrow);
        }
      }

      callNext();
    });
  };

  function Generator(innerFn, outerFn, self, tryLocsList) {
    var generator = outerFn ? Object.create(outerFn.prototype) : this;
    var context = new Context(tryLocsList);
    var state = GenStateSuspendedStart;

    function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var record = tryCatch(
            delegate.iterator[method],
            delegate.iterator,
            arg
          );

          if (record.type === "throw") {
            context.delegate = null;

            // Like returning generator.throw(uncaught), but without the
            // overhead of an extra function call.
            method = "throw";
            arg = record.arg;

            continue;
          }

          // Delegate generator ran and handled its own exceptions so
          // regardless of what the method was, we continue as if it is
          // "next" with an undefined arg.
          method = "next";
          arg = undefined;

          var info = record.arg;
          if (info.done) {
            context[delegate.resultName] = info.value;
            context.next = delegate.nextLoc;
          } else {
            state = GenStateSuspendedYield;
            return info;
          }

          context.delegate = null;
        }

        if (method === "next") {
          if (state === GenStateSuspendedStart &&
              typeof arg !== "undefined") {
            // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
            throw new TypeError(
              "attempt to send " + JSON.stringify(arg) + " to newborn generator"
            );
          }

          if (state === GenStateSuspendedYield) {
            context.sent = arg;
          } else {
            delete context.sent;
          }

        } else if (method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw arg;
          }

          if (context.dispatchException(arg)) {
            // If the dispatched exception was caught by a catch block,
            // then let that catch block handle the exception normally.
            method = "next";
            arg = undefined;
          }

        } else if (method === "return") {
          context.abrupt("return", arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          var info = {
            value: record.arg,
            done: context.done
          };

          if (record.arg === ContinueSentinel) {
            if (context.delegate && method === "next") {
              // Deliberately forget the last sent value so that we don't
              // accidentally pass it on to the delegate.
              arg = undefined;
            }
          } else {
            return info;
          }

        } else if (record.type === "throw") {
          state = GenStateCompleted;

          if (method === "next") {
            context.dispatchException(record.arg);
          } else {
            arg = record.arg;
          }
        }
      }
    }

    generator.next = invoke.bind(generator, "next");
    generator["throw"] = invoke.bind(generator, "throw");
    generator["return"] = invoke.bind(generator, "return");

    return generator;
  }

  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset();
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function() {
      this.prev = 0;
      this.next = 0;
      this.sent = undefined;
      this.done = false;
      this.delegate = null;

      this.tryEntries.forEach(resetTryEntry);

      // Pre-initialize at least 20 temporary variables to enable hidden
      // class optimizations for simple generators.
      for (var tempIndex = 0, tempName;
           hasOwn.call(this, tempName = "t" + tempIndex) || tempIndex < 20;
           ++tempIndex) {
        this[tempName] = null;
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        return !!caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg < finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.next = finallyEntry.finallyLoc;
      } else {
        this.complete(record);
      }

      return ContinueSentinel;
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = record.arg;
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          return this.complete(entry.completion, entry.afterLoc);
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      return ContinueSentinel;
    }
  };
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window : this
);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/polyfill.js":[function(require,module,exports){
module.exports = require("./lib/babel/polyfill");

},{"./lib/babel/polyfill":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/lib/babel/polyfill.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/polyfill.js":[function(require,module,exports){
module.exports = require("babel-core/polyfill");

},{"babel-core/polyfill":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/node_modules/babel-core/polyfill.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/jazz.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createJazzInstance = createJazzInstance;
exports.getJazzInstance = getJazzInstance;

var _inNodeJs = require('./util');

'use strict';

var jazzPluginInitTime = 100; // milliseconds

var jazzInstanceNumber = 0;
var jazzInstances = new Map();

function createJazzInstance(callback) {

  var instance = {
    inputInUse: false,
    outputInUse: false,
    jazz: undefined,
    id: jazzInstanceNumber++ + '' + Date.now()
  };

  var objRef = undefined,
      activeX = undefined;

  if (_inNodeJs.inNodeJs === true) {
    objRef = new window.jazzMidi.MIDI();
  } else {
    var o1 = document.createElement('object');
    o1.id = '_Jazz' + instance.id + 'ie';
    o1.classid = 'CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90';
    activeX = o1;

    var o2 = document.createElement('object');
    o2.id = '_Jazz' + instance.id;
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
      instance.jazz = objRef;
    } else if (activeX.isJazz === true) {
      instance.jazz = activeX;
    }
    if (instance.jazz !== undefined) {
      jazzInstances.set(instance.id, instance);
      instance.jazz._perfTimeZero = window.performance.now();
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
      instance = _step.value;

      if (instance[key] === false) {
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

},{"./util":"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/util.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/midi_access.js":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createMIDIAccess = createMIDIAccess;
exports.closeAllMIDIInputs = closeAllMIDIInputs;

var _createJazzInstance$getJazzInstance = require('./jazz');

var _MIDIInput = require('./midi_input');

var _MIDIOutput = require('./midi_output');

'use strict';

var jazzInstance = undefined;
var inputsMap = new Map();
var outputsMap = new Map();
var midiAccess = {
  sysexEnabled: true
};

function createMIDIAccess() {

  return new Promise(function executor(resolve, reject) {

    _createJazzInstance$getJazzInstance.createJazzInstance(function (instance) {
      if (instance === undefined) {
        reject({ code: 1 });
        return;
      }

      jazzInstance = instance.jazz;

      createMIDIPorts(function () {
        setupListeners();
        midiAccess.inputs = inputsMap;
        midiAccess.outputs = outputsMap;
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
      if (jazzInstance.Support('MidiInInfo')) {
        info = jazzInstance.MidiInInfo(name);
      }
      port = new _MIDIInput.MIDIInput(info, instance);
      inputsMap.set(name, port);
    } else if (type === 'output') {
      if (jazzInstance.Support('MidiOutInfo')) {
        info = jazzInstance.MidiOutInfo(name);
      }
      port = new _MIDIOutput.MIDIOutput(info, instance);
      outputsMap.set(name, port);
    }
    callback();
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
    var port = getPortByName(inputsMap, name);
    if (port !== undefined) {
      port.close();
      port._jazzInstance.inputInUse = false;
      inputsMap['delete'](name);
      if (midiAccess.onstatechange) {
        midiAccess.onstatechange();
      }
    }
  });

  jazzInstance.OnDisconnectMidiOut(function (name) {
    var port = getPortByName(outputsMap, name);
    if (port !== undefined) {
      port.close();
      port._jazzInstance.outputInUse = false;
      outputsMap['delete'](name);
      if (midiAccess.onstatechange) {
        midiAccess.onstatechange();
      }
    }
  });

  jazzInstance.OnConnectMidiIn(function (name) {
    createMIDIPort('input', name, function () {
      if (midiAccess.onstatechange) {
        midiAccess.onstatechange();
      }
    });
  });

  jazzInstance.OnConnectMidiOut(function (name) {
    createMIDIPort('output', name, function () {
      if (midiAccess.onstatechange) {
        midiAccess.onstatechange();
      }
    });
  });
}

function closeAllMIDIInputs() {
  inputsMap.forEach(function (input) {
    //input.close();
    input._jazzInstance.MidiInClose();
  });
}

},{"./jazz":"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/jazz.js","./midi_input":"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/midi_input.js","./midi_output":"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/midi_output.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/midi_input.js":[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _inNodeJs = require('./util');

'use strict';

var midiProc = undefined;

var MIDIInput = (function () {
  function MIDIInput(info, instance) {
    _classCallCheck(this, MIDIInput);

    this.id = info[0];
    this.name = info[0];
    this.manufacturer = info[1];
    this.version = info[2];
    this.type = 'input';
    this.state = 'closed';
    this.connection = 'connected';

    this._onmidimessage = null;
    this._onstatechange = null;

    Object.defineProperty(this, 'onmidimessage', {
      set: function set(value) {
        this._onmidimessage = value;
        this.open();
      }
    });

    Object.defineProperty(this, 'onstatechange', { set: function set(value) {
        this._onstatechange = value;
      } });

    this._listeners = new Map().set('midimessage', new Set()).set('statechange', new Set());
    this._inLongSysexMessage = false;
    this._sysexBuffer = new Uint8Array();

    this._jazzInstance = instance.jazz;
    this._jazzInstanceId = instance.jazz.id;
    this._jazzInstance.inputInUse = true;
    this._jazzInstance.MidiInOpen(this.name, midiProc.bind(this));
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

      if (this._onmidimessage !== null) {
        this._onmidimessage(evt);
      }

      return this._pvtDef;
    }
  }, {
    key: 'appendToSysexBuffer',
    value: function appendToSysexBuffer(data) {
      var oldLength = this._sysexBuffer.length;
      var tmpBuffer = new Uint8Array(oldLength + data.length);
      tmpBuffer.set(this._sysexBuffer);
      tmpBuffer.set(data, oldLength);
      this._sysexBuffer = tmpBuffer;
    }
  }, {
    key: 'bufferLongSysex',
    value: function bufferLongSysex(data, initialOffset) {
      var j = initialOffset;
      while (j < data.length) {
        if (data[j] == 247) {
          // end of sysex!
          j++;
          this.appendToSysexBuffer(data.slice(initialOffset, j));
          return j;
        }
        j++;
      }
      // didn't reach the end; just tack it on.
      this.appendToSysexBuffer(data.slice(initialOffset, j));
      this._inLongSysexMessage = true;
      return j;
    }
  }, {
    key: 'open',
    value: function open() {}
  }, {
    key: 'close',
    value: function close() {
      //this._jazzInstance.MidiInClose(this.name);
      this.onmidimessage = null;
      this.onstatechange = null;
      this._listeners.get('midimessage').clear();
      this._listeners.get('statechange').clear();
    }
  }]);

  return MIDIInput;
})();

exports.MIDIInput = MIDIInput;

midiProc = function (timestamp, data) {
  // Have to use createEvent/initEvent because IE10 fails on new CustomEvent
  var length = 0;
  var i = undefined;
  var isSysexMessage = false;

  // Jazz sometimes passes us multiple messages at once, so we need to parse them out
  // and pass them one at a time.

  for (i = 0; i < data.length; i += length) {
    var isValidMessage = true;
    if (this._inLongSysexMessage) {
      i = this.bufferLongSysex(data, i);
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
              i = this.bufferLongSysex(data, i);
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
    if (!_inNodeJs.inNodeJs) {
      evt = document.createEvent('Event');
      evt.initEvent('midimessage', false, false);
    }
    evt.receivedTime = parseFloat(timestamp.toString()) + this._jazzInstance._perfTimeZero;
    if (isSysexMessage || this._inLongSysexMessage) {
      evt.data = new Uint8Array(this._sysexBuffer);
      this._sysexBuffer = new Uint8Array(0);
      this._inLongSysexMessage = false;
    } else {
      evt.data = new Uint8Array(data.slice(i, length + i));
    }

    if (_inNodeJs.inNodeJs) {
      if (this.onmidimessage) {
        this.onmidimessage(evt);
      }
    } else {
      this.dispatchEvent(evt);
    }
  }
};

//this._jazzInstance.MidiInOpen(this.name, midiProc.bind(this));

},{"./util":"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/util.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/midi_output.js":[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});
'use strict';

var MIDIOutput = (function () {
  function MIDIOutput(info, instance) {
    _classCallCheck(this, MIDIOutput);

    this.id = info[0];
    this.name = info[0];
    this.manufacturer = info[1];
    this.version = info[2];
    this.type = 'input';
    this.state = 'closed';
    this.connection = 'connected';
    this.onmidimessage = null;
    this.onstatechange = null;

    this._listeners = new Map();
    this._inLongSysexMessage = false;
    this._sysexBuffer = new Uint8Array();

    this._jazzInstance = instance.jazz;
    this._jazzInstanceId = instance.jazz.id;
    this._jazzInstance.outputInUse = true;
    this._jazzInstance.MidiOutOpen(this.name);
  }

  _createClass(MIDIOutput, [{
    key: 'open',
    value: function open() {
      //this._jazzInstance.MidiOutOpen(this.name);
      this.state = 'open';
    }
  }, {
    key: 'close',
    value: function close() {
      //this._jazzInstance.MidiOutClose(this.name);
      this.state = 'closed';
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
  }]);

  return MIDIOutput;
})();

exports.MIDIOutput = MIDIOutput;

},{}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/shim.js":[function(require,module,exports){
'use strict';

var _createMIDIAccess$closeAllMIDIInputs = require('./midi_access');

var _polyfillPerformance$inNodeJs = require('./util');

// required by babelify for transpiling es6
require('babelify/polyfill');

var midiAccess = undefined;

(function () {
  if (!window.navigator.requestMIDIAccess) {
    _polyfillPerformance$inNodeJs.polyfillPerformance();
    window.navigator.requestMIDIAccess = function () {
      if (midiAccess === undefined) {
        midiAccess = _createMIDIAccess$closeAllMIDIInputs.createMIDIAccess();
      }
      return midiAccess;
    };
    if (_polyfillPerformance$inNodeJs.inNodeJs) {
      window.navigator.close = function () {
        // Need to close MIDI input ports, otherwise Node.js will wait for MIDI input forever.
        _createMIDIAccess$closeAllMIDIInputs.closeAllMIDIInputs();
      };
    }
  }
})();

},{"./midi_access":"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/midi_access.js","./util":"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/util.js","babelify/polyfill":"/home/abudaan/workspace/WebMIDIAPIShim_es6/node_modules/babelify/polyfill.js"}],"/home/abudaan/workspace/WebMIDIAPIShim_es6/src/util.js":[function(require,module,exports){
(function (__dirname){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.polyfillPerformance = polyfillPerformance;
'use strict';

// check if the shim is running in nodejs
var inNodeJs = typeof __dirname !== 'undefined' && window.jazzMidi;

exports.inNodeJs = inNodeJs;

function polyfillPerformance() {
  if ('performance' in window === false) {
    (function () {
      var nowOffset = Date.now();
      window.performance = {
        now: function now() {
          return Date.now() - nowOffset;
        }
      };
    })();
  }
}

/*

// Polyfill window.performance.now() if necessary.
export function polyfillPerformance(exports) {

  var perf = {}, props;

  function findAlt(){
    let prefix = ['moz', 'webkit', 'o', 'ms'],
    i = prefix.length,
    //worst case, we use Date.now()
    props = {
      value: (function (start) {
        return function () {
          return Date.now() - start;
        };
      }(Date.now()))
    };

    //seach for vendor prefixed version
    for (; i >= 0; i--) {
      let methodName = prefix[i] + 'Now';
      if(exports.performance[methodName] !== undefined){
        props.value = (function(method){
          return function(){
            exports.performance[method]();
          };
        }(methodName));
        return props;
      }
    }

    //otherwise, try to use connectionStart
    if(exports.performance.timing !== undefined && exports.performance.timing.connectStart !== undefined){
      //this pretty much approximates performance.now() to the millisecond
      props.value = (function (start) {
        return function() {
          Date.now() - start;
        };
      }(exports.performance.timing.connectStart));
    }
    return props;
  }

  //if already defined, bail
  if(exports.performance !== undefined && exports.performance.now !== undefined){
    return;
  }

  if(exports.performance === undefined){
    Object.defineProperty(exports, 'performance', {
      get: function () {
        return perf;
      }
    });
  }

  //otherwise, performance is there, but not 'now()'
  props = findAlt();
  Object.defineProperty(exports.performance, 'now', props);
}
*/

}).call(this,"/src")

},{}]},{},["/home/abudaan/workspace/WebMIDIAPIShim_es6/src/shim.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbGliL2JhYmVsL3BvbHlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXJyYXktbWV0aG9kcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuYXNzZXJ0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi1zdHJvbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmNvbGxlY3Rpb24td2Vhay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY29sbGVjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQuY3R4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5kZWYuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmZ3LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5pbnZva2UuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLml0ZXIuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5rZXlvZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQub3duLWtleXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnBhcnRpYWwuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnJlcGxhY2VyLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC5zZXQtcHJvdG8uanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnNwZWNpZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy8kLnN0cmluZy1hdC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQudGFzay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzLyQudWlkLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC51bnNjb3BlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvJC53a3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczUuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuY29weS13aXRoaW4uanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZmlsbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5maW5kLWluZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmFycmF5LmZpbmQuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuYXJyYXkuZnJvbS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5hcnJheS5zcGVjaWVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LmZ1bmN0aW9uLm5hbWUuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubWFwLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm1hdGguanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYubnVtYmVyLmNvbnN0cnVjdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm51bWJlci5zdGF0aWNzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYub2JqZWN0LmlzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC5zdGF0aWNzLWFjY2VwdC1wcmltaXRpdmVzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYucHJvbWlzZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5yZWZsZWN0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnJlZ2V4cC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmNvZGUtcG9pbnQtYXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLmVuZHMtd2l0aC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuZnJvbS1jb2RlLXBvaW50LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYuc3RyaW5nLnJhdy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zdHJpbmcucmVwZWF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM2LnN0cmluZy5zdGFydHMtd2l0aC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL2VzNi5zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYud2Vhay1tYXAuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczYud2Vhay1zZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuYXJyYXkuaW5jbHVkZXMuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcub2JqZWN0LnRvLWFycmF5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvZXM3LnJlZ2V4cC5lc2NhcGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy9lczcuc3RyaW5nLmF0LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvanMuYXJyYXkuc3RhdGljcy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJub2RlX21vZHVsZXMvYmFiZWxpZnkvbm9kZV9tb2R1bGVzL2JhYmVsLWNvcmUvbm9kZV9tb2R1bGVzL2NvcmUtanMvbW9kdWxlcy93ZWIuaW1tZWRpYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9jb3JlLWpzL21vZHVsZXMvd2ViLnRpbWVycy5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbGlmeS9ub2RlX21vZHVsZXMvYmFiZWwtY29yZS9ub2RlX21vZHVsZXMvY29yZS1qcy9zaGltLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL25vZGVfbW9kdWxlcy9yZWdlbmVyYXRvci1iYWJlbC9ydW50aW1lLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L25vZGVfbW9kdWxlcy9iYWJlbC1jb3JlL3BvbHlmaWxsLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsaWZ5L3BvbHlmaWxsLmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9qYXp6LmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9taWRpX2FjY2Vzcy5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaV9pbnB1dC5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaV9vdXRwdXQuanMiLCIvaG9tZS9hYnVkYWFuL3dvcmtzcGFjZS9XZWJNSURJQVBJU2hpbV9lczYvc3JjL3NoaW0uanMiLCIvaG9tZS9hYnVkYWFuL3dvcmtzcGFjZS9XZWJNSURJQVBJU2hpbV9lczYvc3JjL3V0aWwuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5SEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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aWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmlmIChnbG9iYWwuX2JhYmVsUG9seWZpbGwpIHtcbiAgdGhyb3cgbmV3IEVycm9yKFwib25seSBvbmUgaW5zdGFuY2Ugb2YgYmFiZWwvcG9seWZpbGwgaXMgYWxsb3dlZFwiKTtcbn1cbmdsb2JhbC5fYmFiZWxQb2x5ZmlsbCA9IHRydWU7XG5cbnJlcXVpcmUoXCJjb3JlLWpzL3NoaW1cIik7XG5cbnJlcXVpcmUoXCJyZWdlbmVyYXRvci1iYWJlbC9ydW50aW1lXCIpOyIsIid1c2Ugc3RyaWN0JztcclxuLy8gZmFsc2UgLT4gQXJyYXkjaW5kZXhPZlxyXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xyXG52YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKElTX0lOQ0xVREVTKXtcclxuICByZXR1cm4gZnVuY3Rpb24oZWwgLyosIGZyb21JbmRleCA9IDAgKi8pe1xyXG4gICAgdmFyIE8gICAgICA9ICQudG9PYmplY3QodGhpcylcclxuICAgICAgLCBsZW5ndGggPSAkLnRvTGVuZ3RoKE8ubGVuZ3RoKVxyXG4gICAgICAsIGluZGV4ICA9ICQudG9JbmRleChhcmd1bWVudHNbMV0sIGxlbmd0aClcclxuICAgICAgLCB2YWx1ZTtcclxuICAgIGlmKElTX0lOQ0xVREVTICYmIGVsICE9IGVsKXdoaWxlKGxlbmd0aCA+IGluZGV4KXtcclxuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xyXG4gICAgICBpZih2YWx1ZSAhPSB2YWx1ZSlyZXR1cm4gdHJ1ZTtcclxuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pe1xyXG4gICAgICBpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4O1xyXG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xyXG4gIH07XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG4vLyAwIC0+IEFycmF5I2ZvckVhY2hcclxuLy8gMSAtPiBBcnJheSNtYXBcclxuLy8gMiAtPiBBcnJheSNmaWx0ZXJcclxuLy8gMyAtPiBBcnJheSNzb21lXHJcbi8vIDQgLT4gQXJyYXkjZXZlcnlcclxuLy8gNSAtPiBBcnJheSNmaW5kXHJcbi8vIDYgLT4gQXJyYXkjZmluZEluZGV4XHJcbnZhciAkICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY3R4ID0gcmVxdWlyZSgnLi8kLmN0eCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRZUEUpe1xyXG4gIHZhciBJU19NQVAgICAgICAgID0gVFlQRSA9PSAxXHJcbiAgICAsIElTX0ZJTFRFUiAgICAgPSBUWVBFID09IDJcclxuICAgICwgSVNfU09NRSAgICAgICA9IFRZUEUgPT0gM1xyXG4gICAgLCBJU19FVkVSWSAgICAgID0gVFlQRSA9PSA0XHJcbiAgICAsIElTX0ZJTkRfSU5ERVggPSBUWVBFID09IDZcclxuICAgICwgTk9fSE9MRVMgICAgICA9IFRZUEUgPT0gNSB8fCBJU19GSU5EX0lOREVYO1xyXG4gIHJldHVybiBmdW5jdGlvbihjYWxsYmFja2ZuLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xyXG4gICAgdmFyIE8gICAgICA9IE9iamVjdCgkLmFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICwgc2VsZiAgID0gJC5FUzVPYmplY3QoTylcclxuICAgICAgLCBmICAgICAgPSBjdHgoY2FsbGJhY2tmbiwgYXJndW1lbnRzWzFdLCAzKVxyXG4gICAgICAsIGxlbmd0aCA9ICQudG9MZW5ndGgoc2VsZi5sZW5ndGgpXHJcbiAgICAgICwgaW5kZXggID0gMFxyXG4gICAgICAsIHJlc3VsdCA9IElTX01BUCA/IEFycmF5KGxlbmd0aCkgOiBJU19GSUxURVIgPyBbXSA6IHVuZGVmaW5lZFxyXG4gICAgICAsIHZhbCwgcmVzO1xyXG4gICAgZm9yKDtsZW5ndGggPiBpbmRleDsgaW5kZXgrKylpZihOT19IT0xFUyB8fCBpbmRleCBpbiBzZWxmKXtcclxuICAgICAgdmFsID0gc2VsZltpbmRleF07XHJcbiAgICAgIHJlcyA9IGYodmFsLCBpbmRleCwgTyk7XHJcbiAgICAgIGlmKFRZUEUpe1xyXG4gICAgICAgIGlmKElTX01BUClyZXN1bHRbaW5kZXhdID0gcmVzOyAgICAgICAgICAgIC8vIG1hcFxyXG4gICAgICAgIGVsc2UgaWYocmVzKXN3aXRjaChUWVBFKXtcclxuICAgICAgICAgIGNhc2UgMzogcmV0dXJuIHRydWU7ICAgICAgICAgICAgICAgICAgICAvLyBzb21lXHJcbiAgICAgICAgICBjYXNlIDU6IHJldHVybiB2YWw7ICAgICAgICAgICAgICAgICAgICAgLy8gZmluZFxyXG4gICAgICAgICAgY2FzZSA2OiByZXR1cm4gaW5kZXg7ICAgICAgICAgICAgICAgICAgIC8vIGZpbmRJbmRleFxyXG4gICAgICAgICAgY2FzZSAyOiByZXN1bHQucHVzaCh2YWwpOyAgICAgICAgICAgICAgIC8vIGZpbHRlclxyXG4gICAgICAgIH0gZWxzZSBpZihJU19FVkVSWSlyZXR1cm4gZmFsc2U7ICAgICAgICAgIC8vIGV2ZXJ5XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBJU19GSU5EX0lOREVYID8gLTEgOiBJU19TT01FIHx8IElTX0VWRVJZID8gSVNfRVZFUlkgOiByZXN1bHQ7XHJcbiAgfTtcclxufTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xyXG5mdW5jdGlvbiBhc3NlcnQoY29uZGl0aW9uLCBtc2cxLCBtc2cyKXtcclxuICBpZighY29uZGl0aW9uKXRocm93IFR5cGVFcnJvcihtc2cyID8gbXNnMSArIG1zZzIgOiBtc2cxKTtcclxufVxyXG5hc3NlcnQuZGVmID0gJC5hc3NlcnREZWZpbmVkO1xyXG5hc3NlcnQuZm4gPSBmdW5jdGlvbihpdCl7XHJcbiAgaWYoISQuaXNGdW5jdGlvbihpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYSBmdW5jdGlvbiEnKTtcclxuICByZXR1cm4gaXQ7XHJcbn07XHJcbmFzc2VydC5vYmogPSBmdW5jdGlvbihpdCl7XHJcbiAgaWYoISQuaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcclxuICByZXR1cm4gaXQ7XHJcbn07XHJcbmFzc2VydC5pbnN0ID0gZnVuY3Rpb24oaXQsIENvbnN0cnVjdG9yLCBuYW1lKXtcclxuICBpZighKGl0IGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKXRocm93IFR5cGVFcnJvcihuYW1lICsgXCI6IHVzZSB0aGUgJ25ldycgb3BlcmF0b3IhXCIpO1xyXG4gIHJldHVybiBpdDtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBhc3NlcnQ7IiwidmFyICQgPSByZXF1aXJlKCcuLyQnKTtcclxuLy8gMTkuMS4yLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSwgLi4uKVxyXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24odGFyZ2V0LCBzb3VyY2UpeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbiAgdmFyIFQgPSBPYmplY3QoJC5hc3NlcnREZWZpbmVkKHRhcmdldCkpXHJcbiAgICAsIGwgPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAsIGkgPSAxO1xyXG4gIHdoaWxlKGwgPiBpKXtcclxuICAgIHZhciBTICAgICAgPSAkLkVTNU9iamVjdChhcmd1bWVudHNbaSsrXSlcclxuICAgICAgLCBrZXlzICAgPSAkLmdldEtleXMoUylcclxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgICAsIGogICAgICA9IDBcclxuICAgICAgLCBrZXk7XHJcbiAgICB3aGlsZShsZW5ndGggPiBqKVRba2V5ID0ga2V5c1tqKytdXSA9IFNba2V5XTtcclxuICB9XHJcbiAgcmV0dXJuIFQ7XHJcbn07IiwidmFyICQgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIFRBRyAgICAgID0gcmVxdWlyZSgnLi8kLndrcycpKCd0b1N0cmluZ1RhZycpXHJcbiAgLCB0b1N0cmluZyA9IHt9LnRvU3RyaW5nO1xyXG5mdW5jdGlvbiBjb2YoaXQpe1xyXG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XHJcbn1cclxuY29mLmNsYXNzb2YgPSBmdW5jdGlvbihpdCl7XHJcbiAgdmFyIE8sIFQ7XHJcbiAgcmV0dXJuIGl0ID09IHVuZGVmaW5lZCA/IGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6ICdOdWxsJ1xyXG4gICAgOiB0eXBlb2YgKFQgPSAoTyA9IE9iamVjdChpdCkpW1RBR10pID09ICdzdHJpbmcnID8gVCA6IGNvZihPKTtcclxufTtcclxuY29mLnNldCA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xyXG4gIGlmKGl0ICYmICEkLmhhcyhpdCA9IHN0YXQgPyBpdCA6IGl0LnByb3RvdHlwZSwgVEFHKSkkLmhpZGUoaXQsIFRBRywgdGFnKTtcclxufTtcclxubW9kdWxlLmV4cG9ydHMgPSBjb2Y7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY3R4ICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcclxuICAsIHNhZmUgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmVcclxuICAsIGFzc2VydCAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXHJcbiAgLCAkaXRlciAgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcclxuICAsIGhhcyAgICAgID0gJC5oYXNcclxuICAsIHNldCAgICAgID0gJC5zZXRcclxuICAsIGlzT2JqZWN0ID0gJC5pc09iamVjdFxyXG4gICwgaGlkZSAgICAgPSAkLmhpZGVcclxuICAsIHN0ZXAgICAgID0gJGl0ZXIuc3RlcFxyXG4gICwgaXNGcm96ZW4gPSBPYmplY3QuaXNGcm96ZW4gfHwgJC5jb3JlLk9iamVjdC5pc0Zyb3plblxyXG4gICwgSUQgICAgICAgPSBzYWZlKCdpZCcpXHJcbiAgLCBPMSAgICAgICA9IHNhZmUoJ08xJylcclxuICAsIExBU1QgICAgID0gc2FmZSgnbGFzdCcpXHJcbiAgLCBGSVJTVCAgICA9IHNhZmUoJ2ZpcnN0JylcclxuICAsIElURVIgICAgID0gc2FmZSgnaXRlcicpXHJcbiAgLCBTSVpFICAgICA9ICQuREVTQyA/IHNhZmUoJ3NpemUnKSA6ICdzaXplJ1xyXG4gICwgaWQgICAgICAgPSAwO1xyXG5cclxuZnVuY3Rpb24gZmFzdEtleShpdCwgY3JlYXRlKXtcclxuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XHJcbiAgaWYoIWlzT2JqZWN0KGl0KSlyZXR1cm4gKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcclxuICAvLyBjYW4ndCBzZXQgaWQgdG8gZnJvemVuIG9iamVjdFxyXG4gIGlmKGlzRnJvemVuKGl0KSlyZXR1cm4gJ0YnO1xyXG4gIGlmKCFoYXMoaXQsIElEKSl7XHJcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBpZFxyXG4gICAgaWYoIWNyZWF0ZSlyZXR1cm4gJ0UnO1xyXG4gICAgLy8gYWRkIG1pc3Npbmcgb2JqZWN0IGlkXHJcbiAgICBoaWRlKGl0LCBJRCwgKytpZCk7XHJcbiAgLy8gcmV0dXJuIG9iamVjdCBpZCB3aXRoIHByZWZpeFxyXG4gIH0gcmV0dXJuICdPJyArIGl0W0lEXTtcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RW50cnkodGhhdCwga2V5KXtcclxuICAvLyBmYXN0IGNhc2VcclxuICB2YXIgaW5kZXggPSBmYXN0S2V5KGtleSksIGVudHJ5O1xyXG4gIGlmKGluZGV4ICE9ICdGJylyZXR1cm4gdGhhdFtPMV1baW5kZXhdO1xyXG4gIC8vIGZyb3plbiBvYmplY3QgY2FzZVxyXG4gIGZvcihlbnRyeSA9IHRoYXRbRklSU1RdOyBlbnRyeTsgZW50cnkgPSBlbnRyeS5uKXtcclxuICAgIGlmKGVudHJ5LmsgPT0ga2V5KXJldHVybiBlbnRyeTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIGdldENvbnN0cnVjdG9yOiBmdW5jdGlvbihOQU1FLCBJU19NQVAsIEFEREVSKXtcclxuICAgIGZ1bmN0aW9uIEMoaXRlcmFibGUpe1xyXG4gICAgICB2YXIgdGhhdCA9IGFzc2VydC5pbnN0KHRoaXMsIEMsIE5BTUUpO1xyXG4gICAgICBzZXQodGhhdCwgTzEsICQuY3JlYXRlKG51bGwpKTtcclxuICAgICAgc2V0KHRoYXQsIFNJWkUsIDApO1xyXG4gICAgICBzZXQodGhhdCwgTEFTVCwgdW5kZWZpbmVkKTtcclxuICAgICAgc2V0KHRoYXQsIEZJUlNULCB1bmRlZmluZWQpO1xyXG4gICAgICBpZihpdGVyYWJsZSAhPSB1bmRlZmluZWQpJGl0ZXIuZm9yT2YoaXRlcmFibGUsIElTX01BUCwgdGhhdFtBRERFUl0sIHRoYXQpO1xyXG4gICAgfVxyXG4gICAgJC5taXgoQy5wcm90b3R5cGUsIHtcclxuICAgICAgLy8gMjMuMS4zLjEgTWFwLnByb3RvdHlwZS5jbGVhcigpXHJcbiAgICAgIC8vIDIzLjIuMy4yIFNldC5wcm90b3R5cGUuY2xlYXIoKVxyXG4gICAgICBjbGVhcjogZnVuY3Rpb24oKXtcclxuICAgICAgICBmb3IodmFyIHRoYXQgPSB0aGlzLCBkYXRhID0gdGhhdFtPMV0sIGVudHJ5ID0gdGhhdFtGSVJTVF07IGVudHJ5OyBlbnRyeSA9IGVudHJ5Lm4pe1xyXG4gICAgICAgICAgZW50cnkuciA9IHRydWU7XHJcbiAgICAgICAgICBpZihlbnRyeS5wKWVudHJ5LnAgPSBlbnRyeS5wLm4gPSB1bmRlZmluZWQ7XHJcbiAgICAgICAgICBkZWxldGUgZGF0YVtlbnRyeS5pXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhhdFtGSVJTVF0gPSB0aGF0W0xBU1RdID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIHRoYXRbU0laRV0gPSAwO1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyMy4xLjMuMyBNYXAucHJvdG90eXBlLmRlbGV0ZShrZXkpXHJcbiAgICAgIC8vIDIzLjIuMy40IFNldC5wcm90b3R5cGUuZGVsZXRlKHZhbHVlKVxyXG4gICAgICAnZGVsZXRlJzogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgICB2YXIgdGhhdCAgPSB0aGlzXHJcbiAgICAgICAgICAsIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KTtcclxuICAgICAgICBpZihlbnRyeSl7XHJcbiAgICAgICAgICB2YXIgbmV4dCA9IGVudHJ5Lm5cclxuICAgICAgICAgICAgLCBwcmV2ID0gZW50cnkucDtcclxuICAgICAgICAgIGRlbGV0ZSB0aGF0W08xXVtlbnRyeS5pXTtcclxuICAgICAgICAgIGVudHJ5LnIgPSB0cnVlO1xyXG4gICAgICAgICAgaWYocHJldilwcmV2Lm4gPSBuZXh0O1xyXG4gICAgICAgICAgaWYobmV4dCluZXh0LnAgPSBwcmV2O1xyXG4gICAgICAgICAgaWYodGhhdFtGSVJTVF0gPT0gZW50cnkpdGhhdFtGSVJTVF0gPSBuZXh0O1xyXG4gICAgICAgICAgaWYodGhhdFtMQVNUXSA9PSBlbnRyeSl0aGF0W0xBU1RdID0gcHJldjtcclxuICAgICAgICAgIHRoYXRbU0laRV0tLTtcclxuICAgICAgICB9IHJldHVybiAhIWVudHJ5O1xyXG4gICAgICB9LFxyXG4gICAgICAvLyAyMy4yLjMuNiBTZXQucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICAgICAgLy8gMjMuMS4zLjUgTWFwLnByb3RvdHlwZS5mb3JFYWNoKGNhbGxiYWNrZm4sIHRoaXNBcmcgPSB1bmRlZmluZWQpXHJcbiAgICAgIGZvckVhY2g6IGZ1bmN0aW9uKGNhbGxiYWNrZm4gLyosIHRoYXQgPSB1bmRlZmluZWQgKi8pe1xyXG4gICAgICAgIHZhciBmID0gY3R4KGNhbGxiYWNrZm4sIGFyZ3VtZW50c1sxXSwgMylcclxuICAgICAgICAgICwgZW50cnk7XHJcbiAgICAgICAgd2hpbGUoZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiB0aGlzW0ZJUlNUXSl7XHJcbiAgICAgICAgICBmKGVudHJ5LnYsIGVudHJ5LmssIHRoaXMpO1xyXG4gICAgICAgICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XHJcbiAgICAgICAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIC8vIDIzLjEuMy43IE1hcC5wcm90b3R5cGUuaGFzKGtleSlcclxuICAgICAgLy8gMjMuMi4zLjcgU2V0LnByb3RvdHlwZS5oYXModmFsdWUpXHJcbiAgICAgIGhhczogZnVuY3Rpb24oa2V5KXtcclxuICAgICAgICByZXR1cm4gISFnZXRFbnRyeSh0aGlzLCBrZXkpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIGlmKCQuREVTQykkLnNldERlc2MoQy5wcm90b3R5cGUsICdzaXplJywge1xyXG4gICAgICBnZXQ6IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgcmV0dXJuIGFzc2VydC5kZWYodGhpc1tTSVpFXSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIEM7XHJcbiAgfSxcclxuICBkZWY6IGZ1bmN0aW9uKHRoYXQsIGtleSwgdmFsdWUpe1xyXG4gICAgdmFyIGVudHJ5ID0gZ2V0RW50cnkodGhhdCwga2V5KVxyXG4gICAgICAsIHByZXYsIGluZGV4O1xyXG4gICAgLy8gY2hhbmdlIGV4aXN0aW5nIGVudHJ5XHJcbiAgICBpZihlbnRyeSl7XHJcbiAgICAgIGVudHJ5LnYgPSB2YWx1ZTtcclxuICAgIC8vIGNyZWF0ZSBuZXcgZW50cnlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoYXRbTEFTVF0gPSBlbnRyeSA9IHtcclxuICAgICAgICBpOiBpbmRleCA9IGZhc3RLZXkoa2V5LCB0cnVlKSwgLy8gPC0gaW5kZXhcclxuICAgICAgICBrOiBrZXksICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0ga2V5XHJcbiAgICAgICAgdjogdmFsdWUsICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXHJcbiAgICAgICAgcDogcHJldiA9IHRoYXRbTEFTVF0sICAgICAgICAgIC8vIDwtIHByZXZpb3VzIGVudHJ5XHJcbiAgICAgICAgbjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgIC8vIDwtIG5leHQgZW50cnlcclxuICAgICAgICByOiBmYWxzZSAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gcmVtb3ZlZFxyXG4gICAgICB9O1xyXG4gICAgICBpZighdGhhdFtGSVJTVF0pdGhhdFtGSVJTVF0gPSBlbnRyeTtcclxuICAgICAgaWYocHJldilwcmV2Lm4gPSBlbnRyeTtcclxuICAgICAgdGhhdFtTSVpFXSsrO1xyXG4gICAgICAvLyBhZGQgdG8gaW5kZXhcclxuICAgICAgaWYoaW5kZXggIT0gJ0YnKXRoYXRbTzFdW2luZGV4XSA9IGVudHJ5O1xyXG4gICAgfSByZXR1cm4gdGhhdDtcclxuICB9LFxyXG4gIGdldEVudHJ5OiBnZXRFbnRyeSxcclxuICBnZXRJdGVyQ29uc3RydWN0b3I6IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xyXG4gICAgICBzZXQodGhpcywgSVRFUiwge286IGl0ZXJhdGVkLCBrOiBraW5kfSk7XHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgbmV4dDogZnVuY3Rpb24oKXtcclxuICAgIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cclxuICAgICAgLCBraW5kICA9IGl0ZXIua1xyXG4gICAgICAsIGVudHJ5ID0gaXRlci5sO1xyXG4gICAgLy8gcmV2ZXJ0IHRvIHRoZSBsYXN0IGV4aXN0aW5nIGVudHJ5XHJcbiAgICB3aGlsZShlbnRyeSAmJiBlbnRyeS5yKWVudHJ5ID0gZW50cnkucDtcclxuICAgIC8vIGdldCBuZXh0IGVudHJ5XHJcbiAgICBpZighaXRlci5vIHx8ICEoaXRlci5sID0gZW50cnkgPSBlbnRyeSA/IGVudHJ5Lm4gOiBpdGVyLm9bRklSU1RdKSl7XHJcbiAgICAgIC8vIG9yIGZpbmlzaCB0aGUgaXRlcmF0aW9uXHJcbiAgICAgIGl0ZXIubyA9IHVuZGVmaW5lZDtcclxuICAgICAgcmV0dXJuIHN0ZXAoMSk7XHJcbiAgICB9XHJcbiAgICAvLyByZXR1cm4gc3RlcCBieSBraW5kXHJcbiAgICBpZihraW5kID09ICdrZXknICApcmV0dXJuIHN0ZXAoMCwgZW50cnkuayk7XHJcbiAgICBpZihraW5kID09ICd2YWx1ZScpcmV0dXJuIHN0ZXAoMCwgZW50cnkudik7XHJcbiAgICByZXR1cm4gc3RlcCgwLCBbZW50cnkuaywgZW50cnkudl0pO1xyXG4gIH1cclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgc2FmZSAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmVcclxuICAsIGFzc2VydCAgICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxyXG4gICwgZm9yT2YgICAgID0gcmVxdWlyZSgnLi8kLml0ZXInKS5mb3JPZlxyXG4gICwgaGFzICAgICAgID0gJC5oYXNcclxuICAsIGlzT2JqZWN0ICA9ICQuaXNPYmplY3RcclxuICAsIGhpZGUgICAgICA9ICQuaGlkZVxyXG4gICwgaXNGcm96ZW4gID0gT2JqZWN0LmlzRnJvemVuIHx8ICQuY29yZS5PYmplY3QuaXNGcm96ZW5cclxuICAsIGlkICAgICAgICA9IDBcclxuICAsIElEICAgICAgICA9IHNhZmUoJ2lkJylcclxuICAsIFdFQUsgICAgICA9IHNhZmUoJ3dlYWsnKVxyXG4gICwgTEVBSyAgICAgID0gc2FmZSgnbGVhaycpXHJcbiAgLCBtZXRob2QgICAgPSByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpXHJcbiAgLCBmaW5kICAgICAgPSBtZXRob2QoNSlcclxuICAsIGZpbmRJbmRleCA9IG1ldGhvZCg2KTtcclxuZnVuY3Rpb24gZmluZEZyb3plbihzdG9yZSwga2V5KXtcclxuICByZXR1cm4gZmluZC5jYWxsKHN0b3JlLmFycmF5LCBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gaXRbMF0gPT09IGtleTtcclxuICB9KTtcclxufVxyXG4vLyBmYWxsYmFjayBmb3IgZnJvemVuIGtleXNcclxuZnVuY3Rpb24gbGVha1N0b3JlKHRoYXQpe1xyXG4gIHJldHVybiB0aGF0W0xFQUtdIHx8IGhpZGUodGhhdCwgTEVBSywge1xyXG4gICAgYXJyYXk6IFtdLFxyXG4gICAgZ2V0OiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICB2YXIgZW50cnkgPSBmaW5kRnJvemVuKHRoaXMsIGtleSk7XHJcbiAgICAgIGlmKGVudHJ5KXJldHVybiBlbnRyeVsxXTtcclxuICAgIH0sXHJcbiAgICBoYXM6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHJldHVybiAhIWZpbmRGcm96ZW4odGhpcywga2V5KTtcclxuICAgIH0sXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xyXG4gICAgICB2YXIgZW50cnkgPSBmaW5kRnJvemVuKHRoaXMsIGtleSk7XHJcbiAgICAgIGlmKGVudHJ5KWVudHJ5WzFdID0gdmFsdWU7XHJcbiAgICAgIGVsc2UgdGhpcy5hcnJheS5wdXNoKFtrZXksIHZhbHVlXSk7XHJcbiAgICB9LFxyXG4gICAgJ2RlbGV0ZSc6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgIHZhciBpbmRleCA9IGZpbmRJbmRleC5jYWxsKHRoaXMuYXJyYXksIGZ1bmN0aW9uKGl0KXtcclxuICAgICAgICByZXR1cm4gaXRbMF0gPT09IGtleTtcclxuICAgICAgfSk7XHJcbiAgICAgIGlmKH5pbmRleCl0aGlzLmFycmF5LnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgIHJldHVybiAhIX5pbmRleDtcclxuICAgIH1cclxuICB9KVtMRUFLXTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgZ2V0Q29uc3RydWN0b3I6IGZ1bmN0aW9uKE5BTUUsIElTX01BUCwgQURERVIpe1xyXG4gICAgZnVuY3Rpb24gQyhpdGVyYWJsZSl7XHJcbiAgICAgICQuc2V0KGFzc2VydC5pbnN0KHRoaXMsIEMsIE5BTUUpLCBJRCwgaWQrKyk7XHJcbiAgICAgIGlmKGl0ZXJhYmxlICE9IHVuZGVmaW5lZClmb3JPZihpdGVyYWJsZSwgSVNfTUFQLCB0aGlzW0FEREVSXSwgdGhpcyk7XHJcbiAgICB9XHJcbiAgICAkLm1peChDLnByb3RvdHlwZSwge1xyXG4gICAgICAvLyAyMy4zLjMuMiBXZWFrTWFwLnByb3RvdHlwZS5kZWxldGUoa2V5KVxyXG4gICAgICAvLyAyMy40LjMuMyBXZWFrU2V0LnByb3RvdHlwZS5kZWxldGUodmFsdWUpXHJcbiAgICAgICdkZWxldGUnOiBmdW5jdGlvbihrZXkpe1xyXG4gICAgICAgIGlmKCFpc09iamVjdChrZXkpKXJldHVybiBmYWxzZTtcclxuICAgICAgICBpZihpc0Zyb3plbihrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcylbJ2RlbGV0ZSddKGtleSk7XHJcbiAgICAgICAgcmV0dXJuIGhhcyhrZXksIFdFQUspICYmIGhhcyhrZXlbV0VBS10sIHRoaXNbSURdKSAmJiBkZWxldGUga2V5W1dFQUtdW3RoaXNbSURdXTtcclxuICAgICAgfSxcclxuICAgICAgLy8gMjMuMy4zLjQgV2Vha01hcC5wcm90b3R5cGUuaGFzKGtleSlcclxuICAgICAgLy8gMjMuNC4zLjQgV2Vha1NldC5wcm90b3R5cGUuaGFzKHZhbHVlKVxyXG4gICAgICBoYXM6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgICAgaWYoIWlzT2JqZWN0KGtleSkpcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGlmKGlzRnJvemVuKGtleSkpcmV0dXJuIGxlYWtTdG9yZSh0aGlzKS5oYXMoa2V5KTtcclxuICAgICAgICByZXR1cm4gaGFzKGtleSwgV0VBSykgJiYgaGFzKGtleVtXRUFLXSwgdGhpc1tJRF0pO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBDO1xyXG4gIH0sXHJcbiAgZGVmOiBmdW5jdGlvbih0aGF0LCBrZXksIHZhbHVlKXtcclxuICAgIGlmKGlzRnJvemVuKGFzc2VydC5vYmooa2V5KSkpe1xyXG4gICAgICBsZWFrU3RvcmUodGhhdCkuc2V0KGtleSwgdmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaGFzKGtleSwgV0VBSykgfHwgaGlkZShrZXksIFdFQUssIHt9KTtcclxuICAgICAga2V5W1dFQUtdW3RoYXRbSURdXSA9IHZhbHVlO1xyXG4gICAgfSByZXR1cm4gdGhhdDtcclxuICB9LFxyXG4gIGxlYWtTdG9yZTogbGVha1N0b3JlLFxyXG4gIFdFQUs6IFdFQUssXHJcbiAgSUQ6IElEXHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsICRpdGVyID0gcmVxdWlyZSgnLi8kLml0ZXInKVxyXG4gICwgYXNzZXJ0SW5zdGFuY2UgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JykuaW5zdDtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oTkFNRSwgbWV0aG9kcywgY29tbW9uLCBJU19NQVAsIGlzV2Vhayl7XHJcbiAgdmFyIEJhc2UgID0gJC5nW05BTUVdXHJcbiAgICAsIEMgICAgID0gQmFzZVxyXG4gICAgLCBBRERFUiA9IElTX01BUCA/ICdzZXQnIDogJ2FkZCdcclxuICAgICwgcHJvdG8gPSBDICYmIEMucHJvdG90eXBlXHJcbiAgICAsIE8gICAgID0ge307XHJcbiAgZnVuY3Rpb24gZml4TWV0aG9kKEtFWSwgQ0hBSU4pe1xyXG4gICAgdmFyIG1ldGhvZCA9IHByb3RvW0tFWV07XHJcbiAgICBpZigkLkZXKXByb3RvW0tFWV0gPSBmdW5jdGlvbihhLCBiKXtcclxuICAgICAgdmFyIHJlc3VsdCA9IG1ldGhvZC5jYWxsKHRoaXMsIGEgPT09IDAgPyAwIDogYSwgYik7XHJcbiAgICAgIHJldHVybiBDSEFJTiA/IHRoaXMgOiByZXN1bHQ7XHJcbiAgICB9O1xyXG4gIH1cclxuICBpZighJC5pc0Z1bmN0aW9uKEMpIHx8ICEoaXNXZWFrIHx8ICEkaXRlci5CVUdHWSAmJiBwcm90by5mb3JFYWNoICYmIHByb3RvLmVudHJpZXMpKXtcclxuICAgIC8vIGNyZWF0ZSBjb2xsZWN0aW9uIGNvbnN0cnVjdG9yXHJcbiAgICBDID0gY29tbW9uLmdldENvbnN0cnVjdG9yKE5BTUUsIElTX01BUCwgQURERVIpO1xyXG4gICAgJC5taXgoQy5wcm90b3R5cGUsIG1ldGhvZHMpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICB2YXIgaW5zdCAgPSBuZXcgQ1xyXG4gICAgICAsIGNoYWluID0gaW5zdFtBRERFUl0oaXNXZWFrID8ge30gOiAtMCwgMSlcclxuICAgICAgLCBidWdneVplcm87XHJcbiAgICAvLyB3cmFwIGZvciBpbml0IGNvbGxlY3Rpb25zIGZyb20gaXRlcmFibGVcclxuICAgIGlmKCRpdGVyLmZhaWwoZnVuY3Rpb24oaXRlcil7XHJcbiAgICAgIG5ldyBDKGl0ZXIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLW5ld1xyXG4gICAgfSkgfHwgJGl0ZXIuREFOR0VSX0NMT1NJTkcpe1xyXG4gICAgICBDID0gZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgICAgIGFzc2VydEluc3RhbmNlKHRoaXMsIEMsIE5BTUUpO1xyXG4gICAgICAgIHZhciB0aGF0ID0gbmV3IEJhc2U7XHJcbiAgICAgICAgaWYoaXRlcmFibGUgIT0gdW5kZWZpbmVkKSRpdGVyLmZvck9mKGl0ZXJhYmxlLCBJU19NQVAsIHRoYXRbQURERVJdLCB0aGF0KTtcclxuICAgICAgICByZXR1cm4gdGhhdDtcclxuICAgICAgfTtcclxuICAgICAgQy5wcm90b3R5cGUgPSBwcm90bztcclxuICAgICAgaWYoJC5GVylwcm90by5jb25zdHJ1Y3RvciA9IEM7XHJcbiAgICB9XHJcbiAgICBpc1dlYWsgfHwgaW5zdC5mb3JFYWNoKGZ1bmN0aW9uKHZhbCwga2V5KXtcclxuICAgICAgYnVnZ3laZXJvID0gMSAvIGtleSA9PT0gLUluZmluaXR5O1xyXG4gICAgfSk7XHJcbiAgICAvLyBmaXggY29udmVydGluZyAtMCBrZXkgdG8gKzBcclxuICAgIGlmKGJ1Z2d5WmVybyl7XHJcbiAgICAgIGZpeE1ldGhvZCgnZGVsZXRlJyk7XHJcbiAgICAgIGZpeE1ldGhvZCgnaGFzJyk7XHJcbiAgICAgIElTX01BUCAmJiBmaXhNZXRob2QoJ2dldCcpO1xyXG4gICAgfVxyXG4gICAgLy8gKyBmaXggLmFkZCAmIC5zZXQgZm9yIGNoYWluaW5nXHJcbiAgICBpZihidWdneVplcm8gfHwgY2hhaW4gIT09IGluc3QpZml4TWV0aG9kKEFEREVSLCB0cnVlKTtcclxuICB9XHJcblxyXG4gIHJlcXVpcmUoJy4vJC5jb2YnKS5zZXQoQywgTkFNRSk7XHJcbiAgcmVxdWlyZSgnLi8kLnNwZWNpZXMnKShDKTtcclxuXHJcbiAgT1tOQU1FXSA9IEM7XHJcbiAgJGRlZigkZGVmLkcgKyAkZGVmLlcgKyAkZGVmLkYgKiAoQyAhPSBCYXNlKSwgTyk7XHJcblxyXG4gIC8vIGFkZCAua2V5cywgLnZhbHVlcywgLmVudHJpZXMsIFtAQGl0ZXJhdG9yXVxyXG4gIC8vIDIzLjEuMy40LCAyMy4xLjMuOCwgMjMuMS4zLjExLCAyMy4xLjMuMTIsIDIzLjIuMy41LCAyMy4yLjMuOCwgMjMuMi4zLjEwLCAyMy4yLjMuMTFcclxuICBpZighaXNXZWFrKSRpdGVyLnN0ZChcclxuICAgIEMsIE5BTUUsXHJcbiAgICBjb21tb24uZ2V0SXRlckNvbnN0cnVjdG9yKCksIGNvbW1vbi5uZXh0LFxyXG4gICAgSVNfTUFQID8gJ2tleSt2YWx1ZScgOiAndmFsdWUnICwgIUlTX01BUCwgdHJ1ZVxyXG4gICk7XHJcblxyXG4gIHJldHVybiBDO1xyXG59OyIsIi8vIE9wdGlvbmFsIC8gc2ltcGxlIGNvbnRleHQgYmluZGluZ1xyXG52YXIgYXNzZXJ0RnVuY3Rpb24gPSByZXF1aXJlKCcuLyQuYXNzZXJ0JykuZm47XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZm4sIHRoYXQsIGxlbmd0aCl7XHJcbiAgYXNzZXJ0RnVuY3Rpb24oZm4pO1xyXG4gIGlmKH5sZW5ndGggJiYgdGhhdCA9PT0gdW5kZWZpbmVkKXJldHVybiBmbjtcclxuICBzd2l0Y2gobGVuZ3RoKXtcclxuICAgIGNhc2UgMTogcmV0dXJuIGZ1bmN0aW9uKGEpe1xyXG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhKTtcclxuICAgIH07XHJcbiAgICBjYXNlIDI6IHJldHVybiBmdW5jdGlvbihhLCBiKXtcclxuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYik7XHJcbiAgICB9O1xyXG4gICAgY2FzZSAzOiByZXR1cm4gZnVuY3Rpb24oYSwgYiwgYyl7XHJcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEsIGIsIGMpO1xyXG4gICAgfTtcclxuICB9IHJldHVybiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcclxuICAgICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XHJcbiAgICB9O1xyXG59OyIsInZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGdsb2JhbCAgICAgPSAkLmdcclxuICAsIGNvcmUgICAgICAgPSAkLmNvcmVcclxuICAsIGlzRnVuY3Rpb24gPSAkLmlzRnVuY3Rpb247XHJcbmZ1bmN0aW9uIGN0eChmbiwgdGhhdCl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gZm4uYXBwbHkodGhhdCwgYXJndW1lbnRzKTtcclxuICB9O1xyXG59XHJcbmdsb2JhbC5jb3JlID0gY29yZTtcclxuLy8gdHlwZSBiaXRtYXBcclxuJGRlZi5GID0gMTsgIC8vIGZvcmNlZFxyXG4kZGVmLkcgPSAyOyAgLy8gZ2xvYmFsXHJcbiRkZWYuUyA9IDQ7ICAvLyBzdGF0aWNcclxuJGRlZi5QID0gODsgIC8vIHByb3RvXHJcbiRkZWYuQiA9IDE2OyAvLyBiaW5kXHJcbiRkZWYuVyA9IDMyOyAvLyB3cmFwXHJcbmZ1bmN0aW9uICRkZWYodHlwZSwgbmFtZSwgc291cmNlKXtcclxuICB2YXIga2V5LCBvd24sIG91dCwgZXhwXHJcbiAgICAsIGlzR2xvYmFsID0gdHlwZSAmICRkZWYuR1xyXG4gICAgLCB0YXJnZXQgICA9IGlzR2xvYmFsID8gZ2xvYmFsIDogdHlwZSAmICRkZWYuU1xyXG4gICAgICAgID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSkucHJvdG90eXBlXHJcbiAgICAsIGV4cG9ydHMgID0gaXNHbG9iYWwgPyBjb3JlIDogY29yZVtuYW1lXSB8fCAoY29yZVtuYW1lXSA9IHt9KTtcclxuICBpZihpc0dsb2JhbClzb3VyY2UgPSBuYW1lO1xyXG4gIGZvcihrZXkgaW4gc291cmNlKXtcclxuICAgIC8vIGNvbnRhaW5zIGluIG5hdGl2ZVxyXG4gICAgb3duID0gISh0eXBlICYgJGRlZi5GKSAmJiB0YXJnZXQgJiYga2V5IGluIHRhcmdldDtcclxuICAgIC8vIGV4cG9ydCBuYXRpdmUgb3IgcGFzc2VkXHJcbiAgICBvdXQgPSAob3duID8gdGFyZ2V0IDogc291cmNlKVtrZXldO1xyXG4gICAgLy8gYmluZCB0aW1lcnMgdG8gZ2xvYmFsIGZvciBjYWxsIGZyb20gZXhwb3J0IGNvbnRleHRcclxuICAgIGlmKHR5cGUgJiAkZGVmLkIgJiYgb3duKWV4cCA9IGN0eChvdXQsIGdsb2JhbCk7XHJcbiAgICBlbHNlIGV4cCA9IHR5cGUgJiAkZGVmLlAgJiYgaXNGdW5jdGlvbihvdXQpID8gY3R4KEZ1bmN0aW9uLmNhbGwsIG91dCkgOiBvdXQ7XHJcbiAgICAvLyBleHRlbmQgZ2xvYmFsXHJcbiAgICBpZih0YXJnZXQgJiYgIW93bil7XHJcbiAgICAgIGlmKGlzR2xvYmFsKXRhcmdldFtrZXldID0gb3V0O1xyXG4gICAgICBlbHNlIGRlbGV0ZSB0YXJnZXRba2V5XSAmJiAkLmhpZGUodGFyZ2V0LCBrZXksIG91dCk7XHJcbiAgICB9XHJcbiAgICAvLyBleHBvcnRcclxuICAgIGlmKGV4cG9ydHNba2V5XSAhPSBvdXQpJC5oaWRlKGV4cG9ydHMsIGtleSwgZXhwKTtcclxuICB9XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSAkZGVmOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJCl7XHJcbiAgJC5GVyAgID0gdHJ1ZTtcclxuICAkLnBhdGggPSAkLmc7XHJcbiAgcmV0dXJuICQ7XHJcbn07IiwiLy8gRmFzdCBhcHBseVxyXG4vLyBodHRwOi8vanNwZXJmLmxua2l0LmNvbS9mYXN0LWFwcGx5LzVcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmbiwgYXJncywgdGhhdCl7XHJcbiAgdmFyIHVuID0gdGhhdCA9PT0gdW5kZWZpbmVkO1xyXG4gIHN3aXRjaChhcmdzLmxlbmd0aCl7XHJcbiAgICBjYXNlIDA6IHJldHVybiB1biA/IGZuKClcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0KTtcclxuICAgIGNhc2UgMTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdKTtcclxuICAgIGNhc2UgMjogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdKTtcclxuICAgIGNhc2UgMzogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdKTtcclxuICAgIGNhc2UgNDogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdKTtcclxuICAgIGNhc2UgNTogcmV0dXJuIHVuID8gZm4oYXJnc1swXSwgYXJnc1sxXSwgYXJnc1syXSwgYXJnc1szXSwgYXJnc1s0XSlcclxuICAgICAgICAgICAgICAgICAgICAgIDogZm4uY2FsbCh0aGF0LCBhcmdzWzBdLCBhcmdzWzFdLCBhcmdzWzJdLCBhcmdzWzNdLCBhcmdzWzRdKTtcclxuICB9IHJldHVybiAgICAgICAgICAgICAgZm4uYXBwbHkodGhhdCwgYXJncyk7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY3R4ICAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY3R4JylcclxuICAsIGNvZiAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXHJcbiAgLCAkZGVmICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgYXNzZXJ0T2JqZWN0ICAgICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jykub2JqXHJcbiAgLCBTWU1CT0xfSVRFUkFUT1IgICA9IHJlcXVpcmUoJy4vJC53a3MnKSgnaXRlcmF0b3InKVxyXG4gICwgRkZfSVRFUkFUT1IgICAgICAgPSAnQEBpdGVyYXRvcidcclxuICAsIEl0ZXJhdG9ycyAgICAgICAgID0ge31cclxuICAsIEl0ZXJhdG9yUHJvdG90eXBlID0ge307XHJcbi8vIFNhZmFyaSBoYXMgYnlnZ3kgaXRlcmF0b3JzIHcvbyBgbmV4dGBcclxudmFyIEJVR0dZID0gJ2tleXMnIGluIFtdICYmICEoJ25leHQnIGluIFtdLmtleXMoKSk7XHJcbi8vIDI1LjEuMi4xLjEgJUl0ZXJhdG9yUHJvdG90eXBlJVtAQGl0ZXJhdG9yXSgpXHJcbnNldEl0ZXJhdG9yKEl0ZXJhdG9yUHJvdG90eXBlLCAkLnRoYXQpO1xyXG5mdW5jdGlvbiBzZXRJdGVyYXRvcihPLCB2YWx1ZSl7XHJcbiAgJC5oaWRlKE8sIFNZTUJPTF9JVEVSQVRPUiwgdmFsdWUpO1xyXG4gIC8vIEFkZCBpdGVyYXRvciBmb3IgRkYgaXRlcmF0b3IgcHJvdG9jb2xcclxuICBpZihGRl9JVEVSQVRPUiBpbiBbXSkkLmhpZGUoTywgRkZfSVRFUkFUT1IsIHZhbHVlKTtcclxufVxyXG5mdW5jdGlvbiBkZWZpbmVJdGVyYXRvcihDb25zdHJ1Y3RvciwgTkFNRSwgdmFsdWUsIERFRkFVTFQpe1xyXG4gIHZhciBwcm90byA9IENvbnN0cnVjdG9yLnByb3RvdHlwZVxyXG4gICAgLCBpdGVyICA9IHByb3RvW1NZTUJPTF9JVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF0gfHwgdmFsdWU7XHJcbiAgLy8gRGVmaW5lIGl0ZXJhdG9yXHJcbiAgaWYoJC5GVylzZXRJdGVyYXRvcihwcm90bywgaXRlcik7XHJcbiAgaWYoaXRlciAhPT0gdmFsdWUpe1xyXG4gICAgdmFyIGl0ZXJQcm90byA9ICQuZ2V0UHJvdG8oaXRlci5jYWxsKG5ldyBDb25zdHJ1Y3RvcikpO1xyXG4gICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xyXG4gICAgY29mLnNldChpdGVyUHJvdG8sIE5BTUUgKyAnIEl0ZXJhdG9yJywgdHJ1ZSk7XHJcbiAgICAvLyBGRiBmaXhcclxuICAgIGlmKCQuRlcpJC5oYXMocHJvdG8sIEZGX0lURVJBVE9SKSAmJiBzZXRJdGVyYXRvcihpdGVyUHJvdG8sICQudGhhdCk7XHJcbiAgfVxyXG4gIC8vIFBsdWcgZm9yIGxpYnJhcnlcclxuICBJdGVyYXRvcnNbTkFNRV0gPSBpdGVyO1xyXG4gIC8vIEZGICYgdjggZml4XHJcbiAgSXRlcmF0b3JzW05BTUUgKyAnIEl0ZXJhdG9yJ10gPSAkLnRoYXQ7XHJcbiAgcmV0dXJuIGl0ZXI7XHJcbn1cclxuZnVuY3Rpb24gZ2V0SXRlcmF0b3IoaXQpe1xyXG4gIHZhciBTeW1ib2wgID0gJC5nLlN5bWJvbFxyXG4gICAgLCBleHQgICAgID0gaXRbU3ltYm9sICYmIFN5bWJvbC5pdGVyYXRvciB8fCBGRl9JVEVSQVRPUl1cclxuICAgICwgZ2V0SXRlciA9IGV4dCB8fCBpdFtTWU1CT0xfSVRFUkFUT1JdIHx8IEl0ZXJhdG9yc1tjb2YuY2xhc3NvZihpdCldO1xyXG4gIHJldHVybiBhc3NlcnRPYmplY3QoZ2V0SXRlci5jYWxsKGl0KSk7XHJcbn1cclxuZnVuY3Rpb24gY2xvc2VJdGVyYXRvcihpdGVyYXRvcil7XHJcbiAgdmFyIHJldCA9IGl0ZXJhdG9yWydyZXR1cm4nXTtcclxuICBpZihyZXQgIT09IHVuZGVmaW5lZClhc3NlcnRPYmplY3QocmV0LmNhbGwoaXRlcmF0b3IpKTtcclxufVxyXG5mdW5jdGlvbiBzdGVwQ2FsbChpdGVyYXRvciwgZm4sIHZhbHVlLCBlbnRyaWVzKXtcclxuICB0cnkge1xyXG4gICAgcmV0dXJuIGVudHJpZXMgPyBmbihhc3NlcnRPYmplY3QodmFsdWUpWzBdLCB2YWx1ZVsxXSkgOiBmbih2YWx1ZSk7XHJcbiAgfSBjYXRjaChlKXtcclxuICAgIGNsb3NlSXRlcmF0b3IoaXRlcmF0b3IpO1xyXG4gICAgdGhyb3cgZTtcclxuICB9XHJcbn1cclxudmFyIERBTkdFUl9DTE9TSU5HID0gdHJ1ZTtcclxuIWZ1bmN0aW9uKCl7XHJcbiAgdHJ5IHtcclxuICAgIHZhciBpdGVyID0gWzFdLmtleXMoKTtcclxuICAgIGl0ZXJbJ3JldHVybiddID0gZnVuY3Rpb24oKXsgREFOR0VSX0NMT1NJTkcgPSBmYWxzZTsgfTtcclxuICAgIEFycmF5LmZyb20oaXRlciwgZnVuY3Rpb24oKXsgdGhyb3cgMjsgfSk7XHJcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxyXG59KCk7XHJcbnZhciAkaXRlciA9IG1vZHVsZS5leHBvcnRzID0ge1xyXG4gIEJVR0dZOiBCVUdHWSxcclxuICBEQU5HRVJfQ0xPU0lORzogREFOR0VSX0NMT1NJTkcsXHJcbiAgZmFpbDogZnVuY3Rpb24oZXhlYyl7XHJcbiAgICB2YXIgZmFpbCA9IHRydWU7XHJcbiAgICB0cnkge1xyXG4gICAgICB2YXIgYXJyICA9IFtbe30sIDFdXVxyXG4gICAgICAgICwgaXRlciA9IGFycltTWU1CT0xfSVRFUkFUT1JdKClcclxuICAgICAgICAsIG5leHQgPSBpdGVyLm5leHQ7XHJcbiAgICAgIGl0ZXIubmV4dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgZmFpbCA9IGZhbHNlO1xyXG4gICAgICAgIHJldHVybiBuZXh0LmNhbGwodGhpcyk7XHJcbiAgICAgIH07XHJcbiAgICAgIGFycltTWU1CT0xfSVRFUkFUT1JdID0gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gaXRlcjtcclxuICAgICAgfTtcclxuICAgICAgZXhlYyhhcnIpO1xyXG4gICAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxyXG4gICAgcmV0dXJuIGZhaWw7XHJcbiAgfSxcclxuICBJdGVyYXRvcnM6IEl0ZXJhdG9ycyxcclxuICBwcm90b3R5cGU6IEl0ZXJhdG9yUHJvdG90eXBlLFxyXG4gIHN0ZXA6IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcclxuICAgIHJldHVybiB7dmFsdWU6IHZhbHVlLCBkb25lOiAhIWRvbmV9O1xyXG4gIH0sXHJcbiAgc3RlcENhbGw6IHN0ZXBDYWxsLFxyXG4gIGNsb3NlOiBjbG9zZUl0ZXJhdG9yLFxyXG4gIGlzOiBmdW5jdGlvbihpdCl7XHJcbiAgICB2YXIgTyAgICAgID0gT2JqZWN0KGl0KVxyXG4gICAgICAsIFN5bWJvbCA9ICQuZy5TeW1ib2xcclxuICAgICAgLCBTWU0gICAgPSBTeW1ib2wgJiYgU3ltYm9sLml0ZXJhdG9yIHx8IEZGX0lURVJBVE9SO1xyXG4gICAgcmV0dXJuIFNZTSBpbiBPIHx8IFNZTUJPTF9JVEVSQVRPUiBpbiBPIHx8ICQuaGFzKEl0ZXJhdG9ycywgY29mLmNsYXNzb2YoTykpO1xyXG4gIH0sXHJcbiAgZ2V0OiBnZXRJdGVyYXRvcixcclxuICBzZXQ6IHNldEl0ZXJhdG9yLFxyXG4gIGNyZWF0ZTogZnVuY3Rpb24oQ29uc3RydWN0b3IsIE5BTUUsIG5leHQsIHByb3RvKXtcclxuICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9ICQuY3JlYXRlKHByb3RvIHx8ICRpdGVyLnByb3RvdHlwZSwge25leHQ6ICQuZGVzYygxLCBuZXh0KX0pO1xyXG4gICAgY29mLnNldChDb25zdHJ1Y3RvciwgTkFNRSArICcgSXRlcmF0b3InKTtcclxuICB9LFxyXG4gIGRlZmluZTogZGVmaW5lSXRlcmF0b3IsXHJcbiAgc3RkOiBmdW5jdGlvbihCYXNlLCBOQU1FLCBDb25zdHJ1Y3RvciwgbmV4dCwgREVGQVVMVCwgSVNfU0VULCBGT1JDRSl7XHJcbiAgICBmdW5jdGlvbiBjcmVhdGVJdGVyKGtpbmQpe1xyXG4gICAgICByZXR1cm4gZnVuY3Rpb24oKXtcclxuICAgICAgICByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgJGl0ZXIuY3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcclxuICAgIHZhciBlbnRyaWVzID0gY3JlYXRlSXRlcigna2V5K3ZhbHVlJylcclxuICAgICAgLCB2YWx1ZXMgID0gY3JlYXRlSXRlcigndmFsdWUnKVxyXG4gICAgICAsIHByb3RvICAgPSBCYXNlLnByb3RvdHlwZVxyXG4gICAgICAsIG1ldGhvZHMsIGtleTtcclxuICAgIGlmKERFRkFVTFQgPT0gJ3ZhbHVlJyl2YWx1ZXMgPSBkZWZpbmVJdGVyYXRvcihCYXNlLCBOQU1FLCB2YWx1ZXMsICd2YWx1ZXMnKTtcclxuICAgIGVsc2UgZW50cmllcyA9IGRlZmluZUl0ZXJhdG9yKEJhc2UsIE5BTUUsIGVudHJpZXMsICdlbnRyaWVzJyk7XHJcbiAgICBpZihERUZBVUxUKXtcclxuICAgICAgbWV0aG9kcyA9IHtcclxuICAgICAgICBlbnRyaWVzOiBlbnRyaWVzLFxyXG4gICAgICAgIGtleXM6ICAgIElTX1NFVCA/IHZhbHVlcyA6IGNyZWF0ZUl0ZXIoJ2tleScpLFxyXG4gICAgICAgIHZhbHVlczogIHZhbHVlc1xyXG4gICAgICB9O1xyXG4gICAgICAkZGVmKCRkZWYuUCArICRkZWYuRiAqIEJVR0dZLCBOQU1FLCBtZXRob2RzKTtcclxuICAgICAgaWYoRk9SQ0UpZm9yKGtleSBpbiBtZXRob2RzKXtcclxuICAgICAgICBpZighKGtleSBpbiBwcm90bykpJC5oaWRlKHByb3RvLCBrZXksIG1ldGhvZHNba2V5XSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGZvck9mOiBmdW5jdGlvbihpdGVyYWJsZSwgZW50cmllcywgZm4sIHRoYXQpe1xyXG4gICAgdmFyIGl0ZXJhdG9yID0gZ2V0SXRlcmF0b3IoaXRlcmFibGUpXHJcbiAgICAgICwgZiA9IGN0eChmbiwgdGhhdCwgZW50cmllcyA/IDIgOiAxKVxyXG4gICAgICAsIHN0ZXA7XHJcbiAgICB3aGlsZSghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpe1xyXG4gICAgICBpZihzdGVwQ2FsbChpdGVyYXRvciwgZiwgc3RlcC52YWx1ZSwgZW50cmllcykgPT09IGZhbHNlKXtcclxuICAgICAgICByZXR1cm4gY2xvc2VJdGVyYXRvcihpdGVyYXRvcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgZ2xvYmFsID0gdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKVxyXG4gICwgY29yZSAgID0ge31cclxuICAsIGRlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5XHJcbiAgLCBoYXNPd25Qcm9wZXJ0eSA9IHt9Lmhhc093blByb3BlcnR5XHJcbiAgLCBjZWlsICA9IE1hdGguY2VpbFxyXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yXHJcbiAgLCBtYXggICA9IE1hdGgubWF4XHJcbiAgLCBtaW4gICA9IE1hdGgubWluO1xyXG4vLyBUaGUgZW5naW5lIHdvcmtzIGZpbmUgd2l0aCBkZXNjcmlwdG9ycz8gVGhhbmsncyBJRTggZm9yIGhpcyBmdW5ueSBkZWZpbmVQcm9wZXJ0eS5cclxudmFyIERFU0MgPSAhIWZ1bmN0aW9uKCl7XHJcbiAgdHJ5IHtcclxuICAgIHJldHVybiBkZWZpbmVQcm9wZXJ0eSh7fSwgJ2EnLCB7Z2V0OiBmdW5jdGlvbigpeyByZXR1cm4gMjsgfX0pLmEgPT0gMjtcclxuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbn0oKTtcclxudmFyIGhpZGUgPSBjcmVhdGVEZWZpbmVyKDEpO1xyXG4vLyA3LjEuNCBUb0ludGVnZXJcclxuZnVuY3Rpb24gdG9JbnRlZ2VyKGl0KXtcclxuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcclxufVxyXG5mdW5jdGlvbiBkZXNjKGJpdG1hcCwgdmFsdWUpe1xyXG4gIHJldHVybiB7XHJcbiAgICBlbnVtZXJhYmxlICA6ICEoYml0bWFwICYgMSksXHJcbiAgICBjb25maWd1cmFibGU6ICEoYml0bWFwICYgMiksXHJcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXHJcbiAgICB2YWx1ZSAgICAgICA6IHZhbHVlXHJcbiAgfTtcclxufVxyXG5mdW5jdGlvbiBzaW1wbGVTZXQob2JqZWN0LCBrZXksIHZhbHVlKXtcclxuICBvYmplY3Rba2V5XSA9IHZhbHVlO1xyXG4gIHJldHVybiBvYmplY3Q7XHJcbn1cclxuZnVuY3Rpb24gY3JlYXRlRGVmaW5lcihiaXRtYXApe1xyXG4gIHJldHVybiBERVNDID8gZnVuY3Rpb24ob2JqZWN0LCBrZXksIHZhbHVlKXtcclxuICAgIHJldHVybiAkLnNldERlc2Mob2JqZWN0LCBrZXksIGRlc2MoYml0bWFwLCB2YWx1ZSkpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lXHJcbiAgfSA6IHNpbXBsZVNldDtcclxufVxyXG5cclxuZnVuY3Rpb24gaXNPYmplY3QoaXQpe1xyXG4gIHJldHVybiBpdCAhPT0gbnVsbCAmJiAodHlwZW9mIGl0ID09ICdvYmplY3QnIHx8IHR5cGVvZiBpdCA9PSAnZnVuY3Rpb24nKTtcclxufVxyXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGl0KXtcclxuICByZXR1cm4gdHlwZW9mIGl0ID09ICdmdW5jdGlvbic7XHJcbn1cclxuZnVuY3Rpb24gYXNzZXJ0RGVmaW5lZChpdCl7XHJcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcclxuICByZXR1cm4gaXQ7XHJcbn1cclxuXHJcbnZhciAkID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLyQuZncnKSh7XHJcbiAgZzogZ2xvYmFsLFxyXG4gIGNvcmU6IGNvcmUsXHJcbiAgaHRtbDogZ2xvYmFsLmRvY3VtZW50ICYmIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxcclxuICAvLyBodHRwOi8vanNwZXJmLmNvbS9jb3JlLWpzLWlzb2JqZWN0XHJcbiAgaXNPYmplY3Q6ICAgaXNPYmplY3QsXHJcbiAgaXNGdW5jdGlvbjogaXNGdW5jdGlvbixcclxuICBpdDogZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIGl0O1xyXG4gIH0sXHJcbiAgdGhhdDogZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgLy8gNy4xLjQgVG9JbnRlZ2VyXHJcbiAgdG9JbnRlZ2VyOiB0b0ludGVnZXIsXHJcbiAgLy8gNy4xLjE1IFRvTGVuZ3RoXHJcbiAgdG9MZW5ndGg6IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBpdCA+IDAgPyBtaW4odG9JbnRlZ2VyKGl0KSwgMHgxZmZmZmZmZmZmZmZmZikgOiAwOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxXHJcbiAgfSxcclxuICB0b0luZGV4OiBmdW5jdGlvbihpbmRleCwgbGVuZ3RoKXtcclxuICAgIGluZGV4ID0gdG9JbnRlZ2VyKGluZGV4KTtcclxuICAgIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xyXG4gIH0sXHJcbiAgaGFzOiBmdW5jdGlvbihpdCwga2V5KXtcclxuICAgIHJldHVybiBoYXNPd25Qcm9wZXJ0eS5jYWxsKGl0LCBrZXkpO1xyXG4gIH0sXHJcbiAgY3JlYXRlOiAgICAgT2JqZWN0LmNyZWF0ZSxcclxuICBnZXRQcm90bzogICBPYmplY3QuZ2V0UHJvdG90eXBlT2YsXHJcbiAgREVTQzogICAgICAgREVTQyxcclxuICBkZXNjOiAgICAgICBkZXNjLFxyXG4gIGdldERlc2M6ICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXHJcbiAgc2V0RGVzYzogICAgZGVmaW5lUHJvcGVydHksXHJcbiAgZ2V0S2V5czogICAgT2JqZWN0LmtleXMsXHJcbiAgZ2V0TmFtZXM6ICAgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMsXHJcbiAgZ2V0U3ltYm9sczogT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyxcclxuICAvLyBEdW1teSwgZml4IGZvciBub3QgYXJyYXktbGlrZSBFUzMgc3RyaW5nIGluIGVzNSBtb2R1bGVcclxuICBhc3NlcnREZWZpbmVkOiBhc3NlcnREZWZpbmVkLFxyXG4gIEVTNU9iamVjdDogT2JqZWN0LFxyXG4gIHRvT2JqZWN0OiBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gJC5FUzVPYmplY3QoYXNzZXJ0RGVmaW5lZChpdCkpO1xyXG4gIH0sXHJcbiAgaGlkZTogaGlkZSxcclxuICBkZWY6IGNyZWF0ZURlZmluZXIoMCksXHJcbiAgc2V0OiBnbG9iYWwuU3ltYm9sID8gc2ltcGxlU2V0IDogaGlkZSxcclxuICBtaXg6IGZ1bmN0aW9uKHRhcmdldCwgc3JjKXtcclxuICAgIGZvcih2YXIga2V5IGluIHNyYyloaWRlKHRhcmdldCwga2V5LCBzcmNba2V5XSk7XHJcbiAgICByZXR1cm4gdGFyZ2V0O1xyXG4gIH0sXHJcbiAgZWFjaDogW10uZm9yRWFjaFxyXG59KTtcclxuaWYodHlwZW9mIF9fZSAhPSAndW5kZWZpbmVkJylfX2UgPSBjb3JlO1xyXG5pZih0eXBlb2YgX19nICE9ICd1bmRlZmluZWQnKV9fZyA9IGdsb2JhbDsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xyXG4gIHZhciBPICAgICAgPSAkLnRvT2JqZWN0KG9iamVjdClcclxuICAgICwga2V5cyAgID0gJC5nZXRLZXlzKE8pXHJcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAsIGluZGV4ICA9IDBcclxuICAgICwga2V5O1xyXG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XHJcbn07IiwidmFyICQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBhc3NlcnRPYmplY3QgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jykub2JqO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcclxuICBhc3NlcnRPYmplY3QoaXQpO1xyXG4gIHJldHVybiAkLmdldFN5bWJvbHMgPyAkLmdldE5hbWVzKGl0KS5jb25jYXQoJC5nZXRTeW1ib2xzKGl0KSkgOiAkLmdldE5hbWVzKGl0KTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgaW52b2tlID0gcmVxdWlyZSgnLi8kLmludm9rZScpXHJcbiAgLCBhc3NlcnRGdW5jdGlvbiA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKS5mbjtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigvKiAuLi5wYXJncyAqLyl7XHJcbiAgdmFyIGZuICAgICA9IGFzc2VydEZ1bmN0aW9uKHRoaXMpXHJcbiAgICAsIGxlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICwgcGFyZ3MgID0gQXJyYXkobGVuZ3RoKVxyXG4gICAgLCBpICAgICAgPSAwXHJcbiAgICAsIF8gICAgICA9ICQucGF0aC5fXHJcbiAgICAsIGhvbGRlciA9IGZhbHNlO1xyXG4gIHdoaWxlKGxlbmd0aCA+IGkpaWYoKHBhcmdzW2ldID0gYXJndW1lbnRzW2krK10pID09PSBfKWhvbGRlciA9IHRydWU7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKC8qIC4uLmFyZ3MgKi8pe1xyXG4gICAgdmFyIHRoYXQgICAgPSB0aGlzXHJcbiAgICAgICwgX2xlbmd0aCA9IGFyZ3VtZW50cy5sZW5ndGhcclxuICAgICAgLCBqID0gMCwgayA9IDAsIGFyZ3M7XHJcbiAgICBpZighaG9sZGVyICYmICFfbGVuZ3RoKXJldHVybiBpbnZva2UoZm4sIHBhcmdzLCB0aGF0KTtcclxuICAgIGFyZ3MgPSBwYXJncy5zbGljZSgpO1xyXG4gICAgaWYoaG9sZGVyKWZvcig7bGVuZ3RoID4gajsgaisrKWlmKGFyZ3Nbal0gPT09IF8pYXJnc1tqXSA9IGFyZ3VtZW50c1trKytdO1xyXG4gICAgd2hpbGUoX2xlbmd0aCA+IGspYXJncy5wdXNoKGFyZ3VtZW50c1trKytdKTtcclxuICAgIHJldHVybiBpbnZva2UoZm4sIGFyZ3MsIHRoYXQpO1xyXG4gIH07XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJlZ0V4cCwgcmVwbGFjZSwgaXNTdGF0aWMpe1xyXG4gIHZhciByZXBsYWNlciA9IHJlcGxhY2UgPT09IE9iamVjdChyZXBsYWNlKSA/IGZ1bmN0aW9uKHBhcnQpe1xyXG4gICAgcmV0dXJuIHJlcGxhY2VbcGFydF07XHJcbiAgfSA6IHJlcGxhY2U7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBTdHJpbmcoaXNTdGF0aWMgPyBpdCA6IHRoaXMpLnJlcGxhY2UocmVnRXhwLCByZXBsYWNlcik7XHJcbiAgfTtcclxufTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29ya3Mgd2l0aCBudWxsIHByb3RvIG9iamVjdHMuXHJcbi8qZXNsaW50LWRpc2FibGUgbm8tcHJvdG8gKi9cclxudmFyICQgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBhc3NlcnQgPSByZXF1aXJlKCcuLyQuYXNzZXJ0Jyk7XHJcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8ICgnX19wcm90b19fJyBpbiB7fSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgPyBmdW5jdGlvbihidWdneSwgc2V0KXtcclxuICAgICAgdHJ5IHtcclxuICAgICAgICBzZXQgPSByZXF1aXJlKCcuLyQuY3R4JykoRnVuY3Rpb24uY2FsbCwgJC5nZXREZXNjKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xyXG4gICAgICAgIHNldCh7fSwgW10pO1xyXG4gICAgICB9IGNhdGNoKGUpeyBidWdneSA9IHRydWU7IH1cclxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKE8sIHByb3RvKXtcclxuICAgICAgICBhc3NlcnQub2JqKE8pO1xyXG4gICAgICAgIGFzc2VydChwcm90byA9PT0gbnVsbCB8fCAkLmlzT2JqZWN0KHByb3RvKSwgcHJvdG8sIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcclxuICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xyXG4gICAgICAgIGVsc2Ugc2V0KE8sIHByb3RvKTtcclxuICAgICAgICByZXR1cm4gTztcclxuICAgICAgfTtcclxuICAgIH0oKVxyXG4gIDogdW5kZWZpbmVkKTsiLCJ2YXIgJCA9IHJlcXVpcmUoJy4vJCcpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEMpe1xyXG4gIGlmKCQuREVTQyAmJiAkLkZXKSQuc2V0RGVzYyhDLCByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKSwge1xyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgZ2V0OiAkLnRoYXRcclxuICB9KTtcclxufTsiLCIndXNlIHN0cmljdCc7XHJcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxyXG4vLyBmYWxzZSAtPiBTdHJpbmcjY29kZVBvaW50QXRcclxudmFyICQgPSByZXF1aXJlKCcuLyQnKTtcclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihUT19TVFJJTkcpe1xyXG4gIHJldHVybiBmdW5jdGlvbihwb3Mpe1xyXG4gICAgdmFyIHMgPSBTdHJpbmcoJC5hc3NlcnREZWZpbmVkKHRoaXMpKVxyXG4gICAgICAsIGkgPSAkLnRvSW50ZWdlcihwb3MpXHJcbiAgICAgICwgbCA9IHMubGVuZ3RoXHJcbiAgICAgICwgYSwgYjtcclxuICAgIGlmKGkgPCAwIHx8IGkgPj0gbClyZXR1cm4gVE9fU1RSSU5HID8gJycgOiB1bmRlZmluZWQ7XHJcbiAgICBhID0gcy5jaGFyQ29kZUF0KGkpO1xyXG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbFxyXG4gICAgICB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcclxuICAgICAgICA/IFRPX1NUUklORyA/IHMuY2hhckF0KGkpIDogYVxyXG4gICAgICAgIDogVE9fU1RSSU5HID8gcy5zbGljZShpLCBpICsgMikgOiAoYSAtIDB4ZDgwMCA8PCAxMCkgKyAoYiAtIDB4ZGMwMCkgKyAweDEwMDAwO1xyXG4gIH07XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGN0eCAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxyXG4gICwgY29mICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXHJcbiAgLCBpbnZva2UgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcclxuICAsIGdsb2JhbCAgICAgICAgICAgICA9ICQuZ1xyXG4gICwgaXNGdW5jdGlvbiAgICAgICAgID0gJC5pc0Z1bmN0aW9uXHJcbiAgLCBzZXRUYXNrICAgICAgICAgICAgPSBnbG9iYWwuc2V0SW1tZWRpYXRlXHJcbiAgLCBjbGVhclRhc2sgICAgICAgICAgPSBnbG9iYWwuY2xlYXJJbW1lZGlhdGVcclxuICAsIHBvc3RNZXNzYWdlICAgICAgICA9IGdsb2JhbC5wb3N0TWVzc2FnZVxyXG4gICwgYWRkRXZlbnRMaXN0ZW5lciAgID0gZ2xvYmFsLmFkZEV2ZW50TGlzdGVuZXJcclxuICAsIE1lc3NhZ2VDaGFubmVsICAgICA9IGdsb2JhbC5NZXNzYWdlQ2hhbm5lbFxyXG4gICwgY291bnRlciAgICAgICAgICAgID0gMFxyXG4gICwgcXVldWUgICAgICAgICAgICAgID0ge31cclxuICAsIE9OUkVBRFlTVEFURUNIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnXHJcbiAgLCBkZWZlciwgY2hhbm5lbCwgcG9ydDtcclxuZnVuY3Rpb24gcnVuKCl7XHJcbiAgdmFyIGlkID0gK3RoaXM7XHJcbiAgaWYoJC5oYXMocXVldWUsIGlkKSl7XHJcbiAgICB2YXIgZm4gPSBxdWV1ZVtpZF07XHJcbiAgICBkZWxldGUgcXVldWVbaWRdO1xyXG4gICAgZm4oKTtcclxuICB9XHJcbn1cclxuZnVuY3Rpb24gbGlzdG5lcihldmVudCl7XHJcbiAgcnVuLmNhbGwoZXZlbnQuZGF0YSk7XHJcbn1cclxuLy8gTm9kZS5qcyAwLjkrICYgSUUxMCsgaGFzIHNldEltbWVkaWF0ZSwgb3RoZXJ3aXNlOlxyXG5pZighaXNGdW5jdGlvbihzZXRUYXNrKSB8fCAhaXNGdW5jdGlvbihjbGVhclRhc2spKXtcclxuICBzZXRUYXNrID0gZnVuY3Rpb24oZm4pe1xyXG4gICAgdmFyIGFyZ3MgPSBbXSwgaSA9IDE7XHJcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xyXG4gICAgcXVldWVbKytjb3VudGVyXSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgIGludm9rZShpc0Z1bmN0aW9uKGZuKSA/IGZuIDogRnVuY3Rpb24oZm4pLCBhcmdzKTtcclxuICAgIH07XHJcbiAgICBkZWZlcihjb3VudGVyKTtcclxuICAgIHJldHVybiBjb3VudGVyO1xyXG4gIH07XHJcbiAgY2xlYXJUYXNrID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgZGVsZXRlIHF1ZXVlW2lkXTtcclxuICB9O1xyXG4gIC8vIE5vZGUuanMgMC44LVxyXG4gIGlmKGNvZihnbG9iYWwucHJvY2VzcykgPT0gJ3Byb2Nlc3MnKXtcclxuICAgIGRlZmVyID0gZnVuY3Rpb24oaWQpe1xyXG4gICAgICBnbG9iYWwucHJvY2Vzcy5uZXh0VGljayhjdHgocnVuLCBpZCwgMSkpO1xyXG4gICAgfTtcclxuICAvLyBNb2Rlcm4gYnJvd3NlcnMsIHNraXAgaW1wbGVtZW50YXRpb24gZm9yIFdlYldvcmtlcnNcclxuICAvLyBJRTggaGFzIHBvc3RNZXNzYWdlLCBidXQgaXQncyBzeW5jICYgdHlwZW9mIGl0cyBwb3N0TWVzc2FnZSBpcyBvYmplY3RcclxuICB9IGVsc2UgaWYoYWRkRXZlbnRMaXN0ZW5lciAmJiBpc0Z1bmN0aW9uKHBvc3RNZXNzYWdlKSAmJiAhJC5nLmltcG9ydFNjcmlwdHMpe1xyXG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgIHBvc3RNZXNzYWdlKGlkLCAnKicpO1xyXG4gICAgfTtcclxuICAgIGFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBsaXN0bmVyLCBmYWxzZSk7XHJcbiAgLy8gV2ViV29ya2Vyc1xyXG4gIH0gZWxzZSBpZihpc0Z1bmN0aW9uKE1lc3NhZ2VDaGFubmVsKSl7XHJcbiAgICBjaGFubmVsID0gbmV3IE1lc3NhZ2VDaGFubmVsO1xyXG4gICAgcG9ydCAgICA9IGNoYW5uZWwucG9ydDI7XHJcbiAgICBjaGFubmVsLnBvcnQxLm9ubWVzc2FnZSA9IGxpc3RuZXI7XHJcbiAgICBkZWZlciA9IGN0eChwb3J0LnBvc3RNZXNzYWdlLCBwb3J0LCAxKTtcclxuICAvLyBJRTgtXHJcbiAgfSBlbHNlIGlmKCQuZy5kb2N1bWVudCAmJiBPTlJFQURZU1RBVEVDSEFOR0UgaW4gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jykpe1xyXG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgICQuaHRtbC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKSlbT05SRUFEWVNUQVRFQ0hBTkdFXSA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgJC5odG1sLnJlbW92ZUNoaWxkKHRoaXMpO1xyXG4gICAgICAgIHJ1bi5jYWxsKGlkKTtcclxuICAgICAgfTtcclxuICAgIH07XHJcbiAgLy8gUmVzdCBvbGQgYnJvd3NlcnNcclxuICB9IGVsc2Uge1xyXG4gICAgZGVmZXIgPSBmdW5jdGlvbihpZCl7XHJcbiAgICAgIHNldFRpbWVvdXQoY3R4KHJ1biwgaWQsIDEpLCAwKTtcclxuICAgIH07XHJcbiAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0ge1xyXG4gIHNldDogICBzZXRUYXNrLFxyXG4gIGNsZWFyOiBjbGVhclRhc2tcclxufTsiLCJ2YXIgc2lkID0gMDtcclxuZnVuY3Rpb24gdWlkKGtleSl7XHJcbiAgcmV0dXJuICdTeW1ib2woJyArIGtleSArICcpXycgKyAoKytzaWQgKyBNYXRoLnJhbmRvbSgpKS50b1N0cmluZygzNik7XHJcbn1cclxudWlkLnNhZmUgPSByZXF1aXJlKCcuLyQnKS5nLlN5bWJvbCB8fCB1aWQ7XHJcbm1vZHVsZS5leHBvcnRzID0gdWlkOyIsIi8vIDIyLjEuMy4zMSBBcnJheS5wcm90b3R5cGVbQEB1bnNjb3BhYmxlc11cclxudmFyICQgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIFVOU0NPUEFCTEVTID0gcmVxdWlyZSgnLi8kLndrcycpKCd1bnNjb3BhYmxlcycpO1xyXG5pZigkLkZXICYmICEoVU5TQ09QQUJMRVMgaW4gW10pKSQuaGlkZShBcnJheS5wcm90b3R5cGUsIFVOU0NPUEFCTEVTLCB7fSk7XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcclxuICBpZigkLkZXKVtdW1VOU0NPUEFCTEVTXVtrZXldID0gdHJ1ZTtcclxufTsiLCJ2YXIgZ2xvYmFsID0gcmVxdWlyZSgnLi8kJykuZ1xyXG4gICwgc3RvcmUgID0ge307XHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obmFtZSl7XHJcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XHJcbiAgICBnbG9iYWwuU3ltYm9sICYmIGdsb2JhbC5TeW1ib2xbbmFtZV0gfHwgcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ1N5bWJvbC4nICsgbmFtZSkpO1xyXG59OyIsInZhciAkICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGNvZiAgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRkZWYgICAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGludm9rZSAgICAgICAgICAgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcclxuICAsIGFycmF5TWV0aG9kICAgICAgPSByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpXHJcbiAgLCBJRV9QUk9UTyAgICAgICAgID0gcmVxdWlyZSgnLi8kLnVpZCcpLnNhZmUoJ19fcHJvdG9fXycpXHJcbiAgLCBhc3NlcnQgICAgICAgICAgID0gcmVxdWlyZSgnLi8kLmFzc2VydCcpXHJcbiAgLCBhc3NlcnRPYmplY3QgICAgID0gYXNzZXJ0Lm9ialxyXG4gICwgT2JqZWN0UHJvdG8gICAgICA9IE9iamVjdC5wcm90b3R5cGVcclxuICAsIEEgICAgICAgICAgICAgICAgPSBbXVxyXG4gICwgc2xpY2UgICAgICAgICAgICA9IEEuc2xpY2VcclxuICAsIGluZGV4T2YgICAgICAgICAgPSBBLmluZGV4T2ZcclxuICAsIGNsYXNzb2YgICAgICAgICAgPSBjb2YuY2xhc3NvZlxyXG4gICwgZGVmaW5lUHJvcGVydGllcyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzXHJcbiAgLCBoYXMgICAgICAgICAgICAgID0gJC5oYXNcclxuICAsIGRlZmluZVByb3BlcnR5ICAgPSAkLnNldERlc2NcclxuICAsIGdldE93bkRlc2NyaXB0b3IgPSAkLmdldERlc2NcclxuICAsIGlzRnVuY3Rpb24gICAgICAgPSAkLmlzRnVuY3Rpb25cclxuICAsIHRvT2JqZWN0ICAgICAgICAgPSAkLnRvT2JqZWN0XHJcbiAgLCB0b0xlbmd0aCAgICAgICAgID0gJC50b0xlbmd0aFxyXG4gICwgSUU4X0RPTV9ERUZJTkUgICA9IGZhbHNlO1xyXG5cclxuaWYoISQuREVTQyl7XHJcbiAgdHJ5IHtcclxuICAgIElFOF9ET01fREVGSU5FID0gZGVmaW5lUHJvcGVydHkoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksICd4JyxcclxuICAgICAge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDg7IH19XHJcbiAgICApLnggPT0gODtcclxuICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbiAgJC5zZXREZXNjID0gZnVuY3Rpb24oTywgUCwgQXR0cmlidXRlcyl7XHJcbiAgICBpZihJRThfRE9NX0RFRklORSl0cnkge1xyXG4gICAgICByZXR1cm4gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyk7XHJcbiAgICB9IGNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9XHJcbiAgICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcclxuICAgIGlmKCd2YWx1ZScgaW4gQXR0cmlidXRlcylhc3NlcnRPYmplY3QoTylbUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xyXG4gICAgcmV0dXJuIE87XHJcbiAgfTtcclxuICAkLmdldERlc2MgPSBmdW5jdGlvbihPLCBQKXtcclxuICAgIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XHJcbiAgICAgIHJldHVybiBnZXRPd25EZXNjcmlwdG9yKE8sIFApO1xyXG4gICAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxyXG4gICAgaWYoaGFzKE8sIFApKXJldHVybiAkLmRlc2MoIU9iamVjdFByb3RvLnByb3BlcnR5SXNFbnVtZXJhYmxlLmNhbGwoTywgUCksIE9bUF0pO1xyXG4gIH07XHJcbiAgZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uKE8sIFByb3BlcnRpZXMpe1xyXG4gICAgYXNzZXJ0T2JqZWN0KE8pO1xyXG4gICAgdmFyIGtleXMgICA9ICQuZ2V0S2V5cyhQcm9wZXJ0aWVzKVxyXG4gICAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXHJcbiAgICAgICwgaSA9IDBcclxuICAgICAgLCBQO1xyXG4gICAgd2hpbGUobGVuZ3RoID4gaSkkLnNldERlc2MoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XHJcbiAgICByZXR1cm4gTztcclxuICB9O1xyXG59XHJcbiRkZWYoJGRlZi5TICsgJGRlZi5GICogISQuREVTQywgJ09iamVjdCcsIHtcclxuICAvLyAxOS4xLjIuNiAvIDE1LjIuMy4zIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcclxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICQuZ2V0RGVzYyxcclxuICAvLyAxOS4xLjIuNCAvIDE1LjIuMy42IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxyXG4gIGRlZmluZVByb3BlcnR5OiAkLnNldERlc2MsXHJcbiAgLy8gMTkuMS4yLjMgLyAxNS4yLjMuNyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxyXG4gIGRlZmluZVByb3BlcnRpZXM6IGRlZmluZVByb3BlcnRpZXNcclxufSk7XHJcblxyXG4gIC8vIElFIDgtIGRvbid0IGVudW0gYnVnIGtleXNcclxudmFyIGtleXMxID0gKCdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLCcgK1xyXG4gICAgICAgICAgICAndG9Mb2NhbGVTdHJpbmcsdG9TdHJpbmcsdmFsdWVPZicpLnNwbGl0KCcsJylcclxuICAvLyBBZGRpdGlvbmFsIGtleXMgZm9yIGdldE93blByb3BlcnR5TmFtZXNcclxuICAsIGtleXMyID0ga2V5czEuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJylcclxuICAsIGtleXNMZW4xID0ga2V5czEubGVuZ3RoO1xyXG5cclxuLy8gQ3JlYXRlIG9iamVjdCB3aXRoIGBudWxsYCBwcm90b3R5cGU6IHVzZSBpZnJhbWUgT2JqZWN0IHdpdGggY2xlYXJlZCBwcm90b3R5cGVcclxudmFyIGNyZWF0ZURpY3QgPSBmdW5jdGlvbigpe1xyXG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXHJcbiAgdmFyIGlmcmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lmcmFtZScpXHJcbiAgICAsIGkgICAgICA9IGtleXNMZW4xXHJcbiAgICAsIGlmcmFtZURvY3VtZW50O1xyXG4gIGlmcmFtZS5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICQuaHRtbC5hcHBlbmRDaGlsZChpZnJhbWUpO1xyXG4gIGlmcmFtZS5zcmMgPSAnamF2YXNjcmlwdDonOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXNjcmlwdC11cmxcclxuICAvLyBjcmVhdGVEaWN0ID0gaWZyYW1lLmNvbnRlbnRXaW5kb3cuT2JqZWN0O1xyXG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcclxuICBpZnJhbWVEb2N1bWVudCA9IGlmcmFtZS5jb250ZW50V2luZG93LmRvY3VtZW50O1xyXG4gIGlmcmFtZURvY3VtZW50Lm9wZW4oKTtcclxuICBpZnJhbWVEb2N1bWVudC53cml0ZSgnPHNjcmlwdD5kb2N1bWVudC5GPU9iamVjdDwvc2NyaXB0PicpO1xyXG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XHJcbiAgY3JlYXRlRGljdCA9IGlmcmFtZURvY3VtZW50LkY7XHJcbiAgd2hpbGUoaS0tKWRlbGV0ZSBjcmVhdGVEaWN0LnByb3RvdHlwZVtrZXlzMVtpXV07XHJcbiAgcmV0dXJuIGNyZWF0ZURpY3QoKTtcclxufTtcclxuZnVuY3Rpb24gY3JlYXRlR2V0S2V5cyhuYW1lcywgbGVuZ3RoKXtcclxuICByZXR1cm4gZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgIHZhciBPICAgICAgPSB0b09iamVjdChvYmplY3QpXHJcbiAgICAgICwgaSAgICAgID0gMFxyXG4gICAgICAsIHJlc3VsdCA9IFtdXHJcbiAgICAgICwga2V5O1xyXG4gICAgZm9yKGtleSBpbiBPKWlmKGtleSAhPSBJRV9QUk9UTyloYXMoTywga2V5KSAmJiByZXN1bHQucHVzaChrZXkpO1xyXG4gICAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xyXG4gICAgd2hpbGUobGVuZ3RoID4gaSlpZihoYXMoTywga2V5ID0gbmFtZXNbaSsrXSkpe1xyXG4gICAgICB+aW5kZXhPZi5jYWxsKHJlc3VsdCwga2V5KSB8fCByZXN1bHQucHVzaChrZXkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9O1xyXG59XHJcbmZ1bmN0aW9uIGlzUHJpbWl0aXZlKGl0KXsgcmV0dXJuICEkLmlzT2JqZWN0KGl0KTsgfVxyXG5mdW5jdGlvbiBFbXB0eSgpe31cclxuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7XHJcbiAgLy8gMTkuMS4yLjkgLyAxNS4yLjMuMiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcclxuICBnZXRQcm90b3R5cGVPZjogJC5nZXRQcm90byA9ICQuZ2V0UHJvdG8gfHwgZnVuY3Rpb24oTyl7XHJcbiAgICBPID0gT2JqZWN0KGFzc2VydC5kZWYoTykpO1xyXG4gICAgaWYoaGFzKE8sIElFX1BST1RPKSlyZXR1cm4gT1tJRV9QUk9UT107XHJcbiAgICBpZihpc0Z1bmN0aW9uKE8uY29uc3RydWN0b3IpICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcclxuICAgICAgcmV0dXJuIE8uY29uc3RydWN0b3IucHJvdG90eXBlO1xyXG4gICAgfSByZXR1cm4gTyBpbnN0YW5jZW9mIE9iamVjdCA/IE9iamVjdFByb3RvIDogbnVsbDtcclxuICB9LFxyXG4gIC8vIDE5LjEuMi43IC8gMTUuMi4zLjQgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcclxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkLmdldE5hbWVzID0gJC5nZXROYW1lcyB8fCBjcmVhdGVHZXRLZXlzKGtleXMyLCBrZXlzMi5sZW5ndGgsIHRydWUpLFxyXG4gIC8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxyXG4gIGNyZWF0ZTogJC5jcmVhdGUgPSAkLmNyZWF0ZSB8fCBmdW5jdGlvbihPLCAvKj8qL1Byb3BlcnRpZXMpe1xyXG4gICAgdmFyIHJlc3VsdDtcclxuICAgIGlmKE8gIT09IG51bGwpe1xyXG4gICAgICBFbXB0eS5wcm90b3R5cGUgPSBhc3NlcnRPYmplY3QoTyk7XHJcbiAgICAgIHJlc3VsdCA9IG5ldyBFbXB0eSgpO1xyXG4gICAgICBFbXB0eS5wcm90b3R5cGUgPSBudWxsO1xyXG4gICAgICAvLyBhZGQgXCJfX3Byb3RvX19cIiBmb3IgT2JqZWN0LmdldFByb3RvdHlwZU9mIHNoaW1cclxuICAgICAgcmVzdWx0W0lFX1BST1RPXSA9IE87XHJcbiAgICB9IGVsc2UgcmVzdWx0ID0gY3JlYXRlRGljdCgpO1xyXG4gICAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRlZmluZVByb3BlcnRpZXMocmVzdWx0LCBQcm9wZXJ0aWVzKTtcclxuICB9LFxyXG4gIC8vIDE5LjEuMi4xNCAvIDE1LjIuMy4xNCBPYmplY3Qua2V5cyhPKVxyXG4gIGtleXM6ICQuZ2V0S2V5cyA9ICQuZ2V0S2V5cyB8fCBjcmVhdGVHZXRLZXlzKGtleXMxLCBrZXlzTGVuMSwgZmFsc2UpLFxyXG4gIC8vIDE5LjEuMi4xNyAvIDE1LjIuMy44IE9iamVjdC5zZWFsKE8pXHJcbiAgc2VhbDogJC5pdCwgLy8gPC0gY2FwXHJcbiAgLy8gMTkuMS4yLjUgLyAxNS4yLjMuOSBPYmplY3QuZnJlZXplKE8pXHJcbiAgZnJlZXplOiAkLml0LCAvLyA8LSBjYXBcclxuICAvLyAxOS4xLjIuMTUgLyAxNS4yLjMuMTAgT2JqZWN0LnByZXZlbnRFeHRlbnNpb25zKE8pXHJcbiAgcHJldmVudEV4dGVuc2lvbnM6ICQuaXQsIC8vIDwtIGNhcFxyXG4gIC8vIDE5LjEuMi4xMyAvIDE1LjIuMy4xMSBPYmplY3QuaXNTZWFsZWQoTylcclxuICBpc1NlYWxlZDogaXNQcmltaXRpdmUsIC8vIDwtIGNhcFxyXG4gIC8vIDE5LjEuMi4xMiAvIDE1LjIuMy4xMiBPYmplY3QuaXNGcm96ZW4oTylcclxuICBpc0Zyb3plbjogaXNQcmltaXRpdmUsIC8vIDwtIGNhcFxyXG4gIC8vIDE5LjEuMi4xMSAvIDE1LjIuMy4xMyBPYmplY3QuaXNFeHRlbnNpYmxlKE8pXHJcbiAgaXNFeHRlbnNpYmxlOiAkLmlzT2JqZWN0IC8vIDwtIGNhcFxyXG59KTtcclxuXHJcbi8vIDE5LjIuMy4yIC8gMTUuMy40LjUgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQodGhpc0FyZywgYXJncy4uLilcclxuJGRlZigkZGVmLlAsICdGdW5jdGlvbicsIHtcclxuICBiaW5kOiBmdW5jdGlvbih0aGF0IC8qLCBhcmdzLi4uICovKXtcclxuICAgIHZhciBmbiAgICAgICA9IGFzc2VydC5mbih0aGlzKVxyXG4gICAgICAsIHBhcnRBcmdzID0gc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xyXG4gICAgZnVuY3Rpb24gYm91bmQoLyogYXJncy4uLiAqLyl7XHJcbiAgICAgIHZhciBhcmdzID0gcGFydEFyZ3MuY29uY2F0KHNsaWNlLmNhbGwoYXJndW1lbnRzKSk7XHJcbiAgICAgIHJldHVybiBpbnZva2UoZm4sIGFyZ3MsIHRoaXMgaW5zdGFuY2VvZiBib3VuZCA/ICQuY3JlYXRlKGZuLnByb3RvdHlwZSkgOiB0aGF0KTtcclxuICAgIH1cclxuICAgIGlmKGZuLnByb3RvdHlwZSlib3VuZC5wcm90b3R5cGUgPSBmbi5wcm90b3R5cGU7XHJcbiAgICByZXR1cm4gYm91bmQ7XHJcbiAgfVxyXG59KTtcclxuXHJcbi8vIEZpeCBmb3Igbm90IGFycmF5LWxpa2UgRVMzIHN0cmluZ1xyXG5mdW5jdGlvbiBhcnJheU1ldGhvZEZpeChmbil7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gZm4uYXBwbHkoJC5FUzVPYmplY3QodGhpcyksIGFyZ3VtZW50cyk7XHJcbiAgfTtcclxufVxyXG5pZighKDAgaW4gT2JqZWN0KCd6JykgJiYgJ3onWzBdID09ICd6Jykpe1xyXG4gICQuRVM1T2JqZWN0ID0gZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIGNvZihpdCkgPT0gJ1N0cmluZycgPyBpdC5zcGxpdCgnJykgOiBPYmplY3QoaXQpO1xyXG4gIH07XHJcbn1cclxuJGRlZigkZGVmLlAgKyAkZGVmLkYgKiAoJC5FUzVPYmplY3QgIT0gT2JqZWN0KSwgJ0FycmF5Jywge1xyXG4gIHNsaWNlOiBhcnJheU1ldGhvZEZpeChzbGljZSksXHJcbiAgam9pbjogYXJyYXlNZXRob2RGaXgoQS5qb2luKVxyXG59KTtcclxuXHJcbi8vIDIyLjEuMi4yIC8gMTUuNC4zLjIgQXJyYXkuaXNBcnJheShhcmcpXHJcbiRkZWYoJGRlZi5TLCAnQXJyYXknLCB7XHJcbiAgaXNBcnJheTogZnVuY3Rpb24oYXJnKXtcclxuICAgIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xyXG4gIH1cclxufSk7XHJcbmZ1bmN0aW9uIGNyZWF0ZUFycmF5UmVkdWNlKGlzUmlnaHQpe1xyXG4gIHJldHVybiBmdW5jdGlvbihjYWxsYmFja2ZuLCBtZW1vKXtcclxuICAgIGFzc2VydC5mbihjYWxsYmFja2ZuKTtcclxuICAgIHZhciBPICAgICAgPSB0b09iamVjdCh0aGlzKVxyXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxyXG4gICAgICAsIGluZGV4ICA9IGlzUmlnaHQgPyBsZW5ndGggLSAxIDogMFxyXG4gICAgICAsIGkgICAgICA9IGlzUmlnaHQgPyAtMSA6IDE7XHJcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoIDwgMilmb3IoOzspe1xyXG4gICAgICBpZihpbmRleCBpbiBPKXtcclxuICAgICAgICBtZW1vID0gT1tpbmRleF07XHJcbiAgICAgICAgaW5kZXggKz0gaTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBpbmRleCArPSBpO1xyXG4gICAgICBhc3NlcnQoaXNSaWdodCA/IGluZGV4ID49IDAgOiBsZW5ndGggPiBpbmRleCwgJ1JlZHVjZSBvZiBlbXB0eSBhcnJheSB3aXRoIG5vIGluaXRpYWwgdmFsdWUnKTtcclxuICAgIH1cclxuICAgIGZvcig7aXNSaWdodCA/IGluZGV4ID49IDAgOiBsZW5ndGggPiBpbmRleDsgaW5kZXggKz0gaSlpZihpbmRleCBpbiBPKXtcclxuICAgICAgbWVtbyA9IGNhbGxiYWNrZm4obWVtbywgT1tpbmRleF0sIGluZGV4LCB0aGlzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBtZW1vO1xyXG4gIH07XHJcbn1cclxuJGRlZigkZGVmLlAsICdBcnJheScsIHtcclxuICAvLyAyMi4xLjMuMTAgLyAxNS40LjQuMTggQXJyYXkucHJvdG90eXBlLmZvckVhY2goY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcclxuICBmb3JFYWNoOiAkLmVhY2ggPSAkLmVhY2ggfHwgYXJyYXlNZXRob2QoMCksXHJcbiAgLy8gMjIuMS4zLjE1IC8gMTUuNC40LjE5IEFycmF5LnByb3RvdHlwZS5tYXAoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcclxuICBtYXA6IGFycmF5TWV0aG9kKDEpLFxyXG4gIC8vIDIyLjEuMy43IC8gMTUuNC40LjIwIEFycmF5LnByb3RvdHlwZS5maWx0ZXIoY2FsbGJhY2tmbiBbLCB0aGlzQXJnXSlcclxuICBmaWx0ZXI6IGFycmF5TWV0aG9kKDIpLFxyXG4gIC8vIDIyLjEuMy4yMyAvIDE1LjQuNC4xNyBBcnJheS5wcm90b3R5cGUuc29tZShjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxyXG4gIHNvbWU6IGFycmF5TWV0aG9kKDMpLFxyXG4gIC8vIDIyLjEuMy41IC8gMTUuNC40LjE2IEFycmF5LnByb3RvdHlwZS5ldmVyeShjYWxsYmFja2ZuIFssIHRoaXNBcmddKVxyXG4gIGV2ZXJ5OiBhcnJheU1ldGhvZCg0KSxcclxuICAvLyAyMi4xLjMuMTggLyAxNS40LjQuMjEgQXJyYXkucHJvdG90eXBlLnJlZHVjZShjYWxsYmFja2ZuIFssIGluaXRpYWxWYWx1ZV0pXHJcbiAgcmVkdWNlOiBjcmVhdGVBcnJheVJlZHVjZShmYWxzZSksXHJcbiAgLy8gMjIuMS4zLjE5IC8gMTUuNC40LjIyIEFycmF5LnByb3RvdHlwZS5yZWR1Y2VSaWdodChjYWxsYmFja2ZuIFssIGluaXRpYWxWYWx1ZV0pXHJcbiAgcmVkdWNlUmlnaHQ6IGNyZWF0ZUFycmF5UmVkdWNlKHRydWUpLFxyXG4gIC8vIDIyLjEuMy4xMSAvIDE1LjQuNC4xNCBBcnJheS5wcm90b3R5cGUuaW5kZXhPZihzZWFyY2hFbGVtZW50IFssIGZyb21JbmRleF0pXHJcbiAgaW5kZXhPZjogaW5kZXhPZiA9IGluZGV4T2YgfHwgcmVxdWlyZSgnLi8kLmFycmF5LWluY2x1ZGVzJykoZmFsc2UpLFxyXG4gIC8vIDIyLjEuMy4xNCAvIDE1LjQuNC4xNSBBcnJheS5wcm90b3R5cGUubGFzdEluZGV4T2Yoc2VhcmNoRWxlbWVudCBbLCBmcm9tSW5kZXhdKVxyXG4gIGxhc3RJbmRleE9mOiBmdW5jdGlvbihlbCwgZnJvbUluZGV4IC8qID0gQFsqLTFdICovKXtcclxuICAgIHZhciBPICAgICAgPSB0b09iamVjdCh0aGlzKVxyXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxyXG4gICAgICAsIGluZGV4ICA9IGxlbmd0aCAtIDE7XHJcbiAgICBpZihhcmd1bWVudHMubGVuZ3RoID4gMSlpbmRleCA9IE1hdGgubWluKGluZGV4LCAkLnRvSW50ZWdlcihmcm9tSW5kZXgpKTtcclxuICAgIGlmKGluZGV4IDwgMClpbmRleCA9IHRvTGVuZ3RoKGxlbmd0aCArIGluZGV4KTtcclxuICAgIGZvcig7aW5kZXggPj0gMDsgaW5kZXgtLSlpZihpbmRleCBpbiBPKWlmKE9baW5kZXhdID09PSBlbClyZXR1cm4gaW5kZXg7XHJcbiAgICByZXR1cm4gLTE7XHJcbiAgfVxyXG59KTtcclxuXHJcbi8vIDIxLjEuMy4yNSAvIDE1LjUuNC4yMCBTdHJpbmcucHJvdG90eXBlLnRyaW0oKVxyXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHt0cmltOiByZXF1aXJlKCcuLyQucmVwbGFjZXInKSgvXlxccyooW1xcc1xcU10qXFxTKT9cXHMqJC8sICckMScpfSk7XHJcblxyXG4vLyAyMC4zLjMuMSAvIDE1LjkuNC40IERhdGUubm93KClcclxuJGRlZigkZGVmLlMsICdEYXRlJywge25vdzogZnVuY3Rpb24oKXtcclxuICByZXR1cm4gK25ldyBEYXRlO1xyXG59fSk7XHJcblxyXG5mdW5jdGlvbiBseihudW0pe1xyXG4gIHJldHVybiBudW0gPiA5ID8gbnVtIDogJzAnICsgbnVtO1xyXG59XHJcbi8vIDIwLjMuNC4zNiAvIDE1LjkuNS40MyBEYXRlLnByb3RvdHlwZS50b0lTT1N0cmluZygpXHJcbiRkZWYoJGRlZi5QLCAnRGF0ZScsIHt0b0lTT1N0cmluZzogZnVuY3Rpb24oKXtcclxuICBpZighaXNGaW5pdGUodGhpcykpdGhyb3cgUmFuZ2VFcnJvcignSW52YWxpZCB0aW1lIHZhbHVlJyk7XHJcbiAgdmFyIGQgPSB0aGlzXHJcbiAgICAsIHkgPSBkLmdldFVUQ0Z1bGxZZWFyKClcclxuICAgICwgbSA9IGQuZ2V0VVRDTWlsbGlzZWNvbmRzKClcclxuICAgICwgcyA9IHkgPCAwID8gJy0nIDogeSA+IDk5OTkgPyAnKycgOiAnJztcclxuICByZXR1cm4gcyArICgnMDAwMDAnICsgTWF0aC5hYnMoeSkpLnNsaWNlKHMgPyAtNiA6IC00KSArXHJcbiAgICAnLScgKyBseihkLmdldFVUQ01vbnRoKCkgKyAxKSArICctJyArIGx6KGQuZ2V0VVRDRGF0ZSgpKSArXHJcbiAgICAnVCcgKyBseihkLmdldFVUQ0hvdXJzKCkpICsgJzonICsgbHooZC5nZXRVVENNaW51dGVzKCkpICtcclxuICAgICc6JyArIGx6KGQuZ2V0VVRDU2Vjb25kcygpKSArICcuJyArIChtID4gOTkgPyBtIDogJzAnICsgbHoobSkpICsgJ1onO1xyXG59fSk7XHJcblxyXG5pZihjbGFzc29mKGZ1bmN0aW9uKCl7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ09iamVjdCcpY29mLmNsYXNzb2YgPSBmdW5jdGlvbihpdCl7XHJcbiAgdmFyIHRhZyA9IGNsYXNzb2YoaXQpO1xyXG4gIHJldHVybiB0YWcgPT0gJ09iamVjdCcgJiYgaXNGdW5jdGlvbihpdC5jYWxsZWUpID8gJ0FyZ3VtZW50cycgOiB0YWc7XHJcbn07IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICAgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCB0b0luZGV4ID0gJC50b0luZGV4O1xyXG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xyXG4gIC8vIDIyLjEuMy4zIEFycmF5LnByb3RvdHlwZS5jb3B5V2l0aGluKHRhcmdldCwgc3RhcnQsIGVuZCA9IHRoaXMubGVuZ3RoKVxyXG4gIGNvcHlXaXRoaW46IGZ1bmN0aW9uKHRhcmdldC8qID0gMCAqLywgc3RhcnQgLyogPSAwLCBlbmQgPSBAbGVuZ3RoICovKXtcclxuICAgIHZhciBPICAgICA9IE9iamVjdCgkLmFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICwgbGVuICAgPSAkLnRvTGVuZ3RoKE8ubGVuZ3RoKVxyXG4gICAgICAsIHRvICAgID0gdG9JbmRleCh0YXJnZXQsIGxlbilcclxuICAgICAgLCBmcm9tICA9IHRvSW5kZXgoc3RhcnQsIGxlbilcclxuICAgICAgLCBlbmQgICA9IGFyZ3VtZW50c1syXVxyXG4gICAgICAsIGZpbiAgID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW4gOiB0b0luZGV4KGVuZCwgbGVuKVxyXG4gICAgICAsIGNvdW50ID0gTWF0aC5taW4oZmluIC0gZnJvbSwgbGVuIC0gdG8pXHJcbiAgICAgICwgaW5jICAgPSAxO1xyXG4gICAgaWYoZnJvbSA8IHRvICYmIHRvIDwgZnJvbSArIGNvdW50KXtcclxuICAgICAgaW5jICA9IC0xO1xyXG4gICAgICBmcm9tID0gZnJvbSArIGNvdW50IC0gMTtcclxuICAgICAgdG8gICA9IHRvICAgKyBjb3VudCAtIDE7XHJcbiAgICB9XHJcbiAgICB3aGlsZShjb3VudC0tID4gMCl7XHJcbiAgICAgIGlmKGZyb20gaW4gTylPW3RvXSA9IE9bZnJvbV07XHJcbiAgICAgIGVsc2UgZGVsZXRlIE9bdG9dO1xyXG4gICAgICB0byAgICs9IGluYztcclxuICAgICAgZnJvbSArPSBpbmM7XHJcbiAgICB9IHJldHVybiBPO1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2NvcHlXaXRoaW4nKTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIHRvSW5kZXggPSAkLnRvSW5kZXg7XHJcbiRkZWYoJGRlZi5QLCAnQXJyYXknLCB7XHJcbiAgLy8gMjIuMS4zLjYgQXJyYXkucHJvdG90eXBlLmZpbGwodmFsdWUsIHN0YXJ0ID0gMCwgZW5kID0gdGhpcy5sZW5ndGgpXHJcbiAgZmlsbDogZnVuY3Rpb24odmFsdWUgLyosIHN0YXJ0ID0gMCwgZW5kID0gQGxlbmd0aCAqLyl7XHJcbiAgICB2YXIgTyAgICAgID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgLCBsZW5ndGggPSAkLnRvTGVuZ3RoKE8ubGVuZ3RoKVxyXG4gICAgICAsIGluZGV4ICA9IHRvSW5kZXgoYXJndW1lbnRzWzFdLCBsZW5ndGgpXHJcbiAgICAgICwgZW5kICAgID0gYXJndW1lbnRzWzJdXHJcbiAgICAgICwgZW5kUG9zID0gZW5kID09PSB1bmRlZmluZWQgPyBsZW5ndGggOiB0b0luZGV4KGVuZCwgbGVuZ3RoKTtcclxuICAgIHdoaWxlKGVuZFBvcyA+IGluZGV4KU9baW5kZXgrK10gPSB2YWx1ZTtcclxuICAgIHJldHVybiBPO1xyXG4gIH1cclxufSk7XHJcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2ZpbGwnKTsiLCJ2YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuJGRlZigkZGVmLlAsICdBcnJheScsIHtcclxuICAvLyAyMi4xLjMuOSBBcnJheS5wcm90b3R5cGUuZmluZEluZGV4KHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICBmaW5kSW5kZXg6IHJlcXVpcmUoJy4vJC5hcnJheS1tZXRob2RzJykoNilcclxufSk7XHJcbnJlcXVpcmUoJy4vJC51bnNjb3BlJykoJ2ZpbmRJbmRleCcpOyIsInZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xyXG4gIC8vIDIyLjEuMy44IEFycmF5LnByb3RvdHlwZS5maW5kKHByZWRpY2F0ZSwgdGhpc0FyZyA9IHVuZGVmaW5lZClcclxuICBmaW5kOiByZXF1aXJlKCcuLyQuYXJyYXktbWV0aG9kcycpKDUpXHJcbn0pO1xyXG5yZXF1aXJlKCcuLyQudW5zY29wZScpKCdmaW5kJyk7IiwidmFyICQgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGN0eCAgID0gcmVxdWlyZSgnLi8kLmN0eCcpXHJcbiAgLCAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgJGl0ZXIgPSByZXF1aXJlKCcuLyQuaXRlcicpXHJcbiAgLCBzdGVwQ2FsbCA9ICRpdGVyLnN0ZXBDYWxsO1xyXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICRpdGVyLkRBTkdFUl9DTE9TSU5HLCAnQXJyYXknLCB7XHJcbiAgLy8gMjIuMS4yLjEgQXJyYXkuZnJvbShhcnJheUxpa2UsIG1hcGZuID0gdW5kZWZpbmVkLCB0aGlzQXJnID0gdW5kZWZpbmVkKVxyXG4gIGZyb206IGZ1bmN0aW9uKGFycmF5TGlrZS8qLCBtYXBmbiA9IHVuZGVmaW5lZCwgdGhpc0FyZyA9IHVuZGVmaW5lZCovKXtcclxuICAgIHZhciBPICAgICAgID0gT2JqZWN0KCQuYXNzZXJ0RGVmaW5lZChhcnJheUxpa2UpKVxyXG4gICAgICAsIG1hcGZuICAgPSBhcmd1bWVudHNbMV1cclxuICAgICAgLCBtYXBwaW5nID0gbWFwZm4gIT09IHVuZGVmaW5lZFxyXG4gICAgICAsIGYgICAgICAgPSBtYXBwaW5nID8gY3R4KG1hcGZuLCBhcmd1bWVudHNbMl0sIDIpIDogdW5kZWZpbmVkXHJcbiAgICAgICwgaW5kZXggICA9IDBcclxuICAgICAgLCBsZW5ndGgsIHJlc3VsdCwgc3RlcCwgaXRlcmF0b3I7XHJcbiAgICBpZigkaXRlci5pcyhPKSl7XHJcbiAgICAgIGl0ZXJhdG9yID0gJGl0ZXIuZ2V0KE8pO1xyXG4gICAgICAvLyBzdHJhbmdlIElFIHF1aXJrcyBtb2RlIGJ1ZyAtPiB1c2UgdHlwZW9mIGluc3RlYWQgb2YgaXNGdW5jdGlvblxyXG4gICAgICByZXN1bHQgICA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSk7XHJcbiAgICAgIGZvcig7ICEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZTsgaW5kZXgrKyl7XHJcbiAgICAgICAgcmVzdWx0W2luZGV4XSA9IG1hcHBpbmcgPyBzdGVwQ2FsbChpdGVyYXRvciwgZiwgW3N0ZXAudmFsdWUsIGluZGV4XSwgdHJ1ZSkgOiBzdGVwLnZhbHVlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBzdHJhbmdlIElFIHF1aXJrcyBtb2RlIGJ1ZyAtPiB1c2UgdHlwZW9mIGluc3RlYWQgb2YgaXNGdW5jdGlvblxyXG4gICAgICByZXN1bHQgPSBuZXcgKHR5cGVvZiB0aGlzID09ICdmdW5jdGlvbicgPyB0aGlzIDogQXJyYXkpKGxlbmd0aCA9ICQudG9MZW5ndGgoTy5sZW5ndGgpKTtcclxuICAgICAgZm9yKDsgbGVuZ3RoID4gaW5kZXg7IGluZGV4Kyspe1xyXG4gICAgICAgIHJlc3VsdFtpbmRleF0gPSBtYXBwaW5nID8gZihPW2luZGV4XSwgaW5kZXgpIDogT1tpbmRleF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJlc3VsdC5sZW5ndGggPSBpbmRleDtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59KTsiLCJ2YXIgJCAgICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBzZXRVbnNjb3BlID0gcmVxdWlyZSgnLi8kLnVuc2NvcGUnKVxyXG4gICwgSVRFUiAgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdpdGVyJylcclxuICAsICRpdGVyICAgICAgPSByZXF1aXJlKCcuLyQuaXRlcicpXHJcbiAgLCBzdGVwICAgICAgID0gJGl0ZXIuc3RlcFxyXG4gICwgSXRlcmF0b3JzICA9ICRpdGVyLkl0ZXJhdG9ycztcclxuXHJcbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcclxuLy8gMjIuMS4zLjEzIEFycmF5LnByb3RvdHlwZS5rZXlzKClcclxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxyXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcclxuJGl0ZXIuc3RkKEFycmF5LCAnQXJyYXknLCBmdW5jdGlvbihpdGVyYXRlZCwga2luZCl7XHJcbiAgJC5zZXQodGhpcywgSVRFUiwge286ICQudG9PYmplY3QoaXRlcmF0ZWQpLCBpOiAwLCBrOiBraW5kfSk7XHJcbi8vIDIyLjEuNS4yLjEgJUFycmF5SXRlcmF0b3JQcm90b3R5cGUlLm5leHQoKVxyXG59LCBmdW5jdGlvbigpe1xyXG4gIHZhciBpdGVyICA9IHRoaXNbSVRFUl1cclxuICAgICwgTyAgICAgPSBpdGVyLm9cclxuICAgICwga2luZCAgPSBpdGVyLmtcclxuICAgICwgaW5kZXggPSBpdGVyLmkrKztcclxuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XHJcbiAgICBpdGVyLm8gPSB1bmRlZmluZWQ7XHJcbiAgICByZXR1cm4gc3RlcCgxKTtcclxuICB9XHJcbiAgaWYoa2luZCA9PSAna2V5JyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcclxuICBpZihraW5kID09ICd2YWx1ZScpcmV0dXJuIHN0ZXAoMCwgT1tpbmRleF0pO1xyXG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcclxufSwgJ3ZhbHVlJyk7XHJcblxyXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXHJcbkl0ZXJhdG9ycy5Bcmd1bWVudHMgPSBJdGVyYXRvcnMuQXJyYXk7XHJcblxyXG5zZXRVbnNjb3BlKCdrZXlzJyk7XHJcbnNldFVuc2NvcGUoJ3ZhbHVlcycpO1xyXG5zZXRVbnNjb3BlKCdlbnRyaWVzJyk7IiwidmFyICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcbiRkZWYoJGRlZi5TLCAnQXJyYXknLCB7XHJcbiAgLy8gMjIuMS4yLjMgQXJyYXkub2YoIC4uLml0ZW1zKVxyXG4gIG9mOiBmdW5jdGlvbigvKiAuLi5hcmdzICovKXtcclxuICAgIHZhciBpbmRleCAgPSAwXHJcbiAgICAgICwgbGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAvLyBzdHJhbmdlIElFIHF1aXJrcyBtb2RlIGJ1ZyAtPiB1c2UgdHlwZW9mIGluc3RlYWQgb2YgaXNGdW5jdGlvblxyXG4gICAgICAsIHJlc3VsdCA9IG5ldyAodHlwZW9mIHRoaXMgPT0gJ2Z1bmN0aW9uJyA/IHRoaXMgOiBBcnJheSkobGVuZ3RoKTtcclxuICAgIHdoaWxlKGxlbmd0aCA+IGluZGV4KXJlc3VsdFtpbmRleF0gPSBhcmd1bWVudHNbaW5kZXgrK107XHJcbiAgICByZXN1bHQubGVuZ3RoID0gbGVuZ3RoO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbn0pOyIsInJlcXVpcmUoJy4vJC5zcGVjaWVzJykoQXJyYXkpOyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgTkFNRSA9ICduYW1lJ1xyXG4gICwgc2V0RGVzYyA9ICQuc2V0RGVzY1xyXG4gICwgRnVuY3Rpb25Qcm90byA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcclxuLy8gMTkuMi40LjIgbmFtZVxyXG5OQU1FIGluIEZ1bmN0aW9uUHJvdG8gfHwgJC5GVyAmJiAkLkRFU0MgJiYgc2V0RGVzYyhGdW5jdGlvblByb3RvLCBOQU1FLCB7XHJcbiAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gIGdldDogZnVuY3Rpb24oKXtcclxuICAgIHZhciBtYXRjaCA9IFN0cmluZyh0aGlzKS5tYXRjaCgvXlxccypmdW5jdGlvbiAoW14gKF0qKS8pXHJcbiAgICAgICwgbmFtZSAgPSBtYXRjaCA/IG1hdGNoWzFdIDogJyc7XHJcbiAgICAkLmhhcyh0aGlzLCBOQU1FKSB8fCBzZXREZXNjKHRoaXMsIE5BTUUsICQuZGVzYyg1LCBuYW1lKSk7XHJcbiAgICByZXR1cm4gbmFtZTtcclxuICB9LFxyXG4gIHNldDogZnVuY3Rpb24odmFsdWUpe1xyXG4gICAgJC5oYXModGhpcywgTkFNRSkgfHwgc2V0RGVzYyh0aGlzLCBOQU1FLCAkLmRlc2MoMCwgdmFsdWUpKTtcclxuICB9XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXN0cm9uZycpO1xyXG5cclxuLy8gMjMuMSBNYXAgT2JqZWN0c1xyXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdNYXAnLCB7XHJcbiAgLy8gMjMuMS4zLjYgTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxyXG4gIGdldDogZnVuY3Rpb24oa2V5KXtcclxuICAgIHZhciBlbnRyeSA9IHN0cm9uZy5nZXRFbnRyeSh0aGlzLCBrZXkpO1xyXG4gICAgcmV0dXJuIGVudHJ5ICYmIGVudHJ5LnY7XHJcbiAgfSxcclxuICAvLyAyMy4xLjMuOSBNYXAucHJvdG90eXBlLnNldChrZXksIHZhbHVlKVxyXG4gIHNldDogZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XHJcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCBrZXkgPT09IDAgPyAwIDoga2V5LCB2YWx1ZSk7XHJcbiAgfVxyXG59LCBzdHJvbmcsIHRydWUpOyIsInZhciBJbmZpbml0eSA9IDEgLyAwXHJcbiAgLCAkZGVmICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgRSAgICAgPSBNYXRoLkVcclxuICAsIHBvdyAgID0gTWF0aC5wb3dcclxuICAsIGFicyAgID0gTWF0aC5hYnNcclxuICAsIGV4cCAgID0gTWF0aC5leHBcclxuICAsIGxvZyAgID0gTWF0aC5sb2dcclxuICAsIHNxcnQgID0gTWF0aC5zcXJ0XHJcbiAgLCBjZWlsICA9IE1hdGguY2VpbFxyXG4gICwgZmxvb3IgPSBNYXRoLmZsb29yXHJcbiAgLCBzaWduICA9IE1hdGguc2lnbiB8fCBmdW5jdGlvbih4KXtcclxuICAgICAgcmV0dXJuICh4ID0gK3gpID09IDAgfHwgeCAhPSB4ID8geCA6IHggPCAwID8gLTEgOiAxO1xyXG4gICAgfTtcclxuXHJcbi8vIDIwLjIuMi41IE1hdGguYXNpbmgoeClcclxuZnVuY3Rpb24gYXNpbmgoeCl7XHJcbiAgcmV0dXJuICFpc0Zpbml0ZSh4ID0gK3gpIHx8IHggPT0gMCA/IHggOiB4IDwgMCA/IC1hc2luaCgteCkgOiBsb2coeCArIHNxcnQoeCAqIHggKyAxKSk7XHJcbn1cclxuLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcclxuZnVuY3Rpb24gZXhwbTEoeCl7XHJcbiAgcmV0dXJuICh4ID0gK3gpID09IDAgPyB4IDogeCA+IC0xZS02ICYmIHggPCAxZS02ID8geCArIHggKiB4IC8gMiA6IGV4cCh4KSAtIDE7XHJcbn1cclxuXHJcbiRkZWYoJGRlZi5TLCAnTWF0aCcsIHtcclxuICAvLyAyMC4yLjIuMyBNYXRoLmFjb3NoKHgpXHJcbiAgYWNvc2g6IGZ1bmN0aW9uKHgpe1xyXG4gICAgcmV0dXJuICh4ID0gK3gpIDwgMSA/IE5hTiA6IGlzRmluaXRlKHgpID8gbG9nKHggLyBFICsgc3FydCh4ICsgMSkgKiBzcXJ0KHggLSAxKSAvIEUpICsgMSA6IHg7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuNSBNYXRoLmFzaW5oKHgpXHJcbiAgYXNpbmg6IGFzaW5oLFxyXG4gIC8vIDIwLjIuMi43IE1hdGguYXRhbmgoeClcclxuICBhdGFuaDogZnVuY3Rpb24oeCl7XHJcbiAgICByZXR1cm4gKHggPSAreCkgPT0gMCA/IHggOiBsb2coKDEgKyB4KSAvICgxIC0geCkpIC8gMjtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi45IE1hdGguY2JydCh4KVxyXG4gIGNicnQ6IGZ1bmN0aW9uKHgpe1xyXG4gICAgcmV0dXJuIHNpZ24oeCA9ICt4KSAqIHBvdyhhYnMoeCksIDEgLyAzKTtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4xMSBNYXRoLmNsejMyKHgpXHJcbiAgY2x6MzI6IGZ1bmN0aW9uKHgpe1xyXG4gICAgcmV0dXJuICh4ID4+Pj0gMCkgPyAzMiAtIHgudG9TdHJpbmcoMikubGVuZ3RoIDogMzI7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMTIgTWF0aC5jb3NoKHgpXHJcbiAgY29zaDogZnVuY3Rpb24oeCl7XHJcbiAgICByZXR1cm4gKGV4cCh4ID0gK3gpICsgZXhwKC14KSkgLyAyO1xyXG4gIH0sXHJcbiAgLy8gMjAuMi4yLjE0IE1hdGguZXhwbTEoeClcclxuICBleHBtMTogZXhwbTEsXHJcbiAgLy8gMjAuMi4yLjE2IE1hdGguZnJvdW5kKHgpXHJcbiAgLy8gVE9ETzogZmFsbGJhY2sgZm9yIElFOS1cclxuICBmcm91bmQ6IGZ1bmN0aW9uKHgpe1xyXG4gICAgcmV0dXJuIG5ldyBGbG9hdDMyQXJyYXkoW3hdKVswXTtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4xNyBNYXRoLmh5cG90KFt2YWx1ZTFbLCB2YWx1ZTJbLCDigKYgXV1dKVxyXG4gIGh5cG90OiBmdW5jdGlvbih2YWx1ZTEsIHZhbHVlMil7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcclxuICAgIHZhciBzdW0gID0gMFxyXG4gICAgICAsIGxlbjEgPSBhcmd1bWVudHMubGVuZ3RoXHJcbiAgICAgICwgbGVuMiA9IGxlbjFcclxuICAgICAgLCBhcmdzID0gQXJyYXkobGVuMSlcclxuICAgICAgLCBsYXJnID0gLUluZmluaXR5XHJcbiAgICAgICwgYXJnO1xyXG4gICAgd2hpbGUobGVuMS0tKXtcclxuICAgICAgYXJnID0gYXJnc1tsZW4xXSA9ICthcmd1bWVudHNbbGVuMV07XHJcbiAgICAgIGlmKGFyZyA9PSBJbmZpbml0eSB8fCBhcmcgPT0gLUluZmluaXR5KXJldHVybiBJbmZpbml0eTtcclxuICAgICAgaWYoYXJnID4gbGFyZylsYXJnID0gYXJnO1xyXG4gICAgfVxyXG4gICAgbGFyZyA9IGFyZyB8fCAxO1xyXG4gICAgd2hpbGUobGVuMi0tKXN1bSArPSBwb3coYXJnc1tsZW4yXSAvIGxhcmcsIDIpO1xyXG4gICAgcmV0dXJuIGxhcmcgKiBzcXJ0KHN1bSk7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMTggTWF0aC5pbXVsKHgsIHkpXHJcbiAgaW11bDogZnVuY3Rpb24oeCwgeSl7XHJcbiAgICB2YXIgVUludDE2ID0gMHhmZmZmXHJcbiAgICAgICwgeG4gPSAreFxyXG4gICAgICAsIHluID0gK3lcclxuICAgICAgLCB4bCA9IFVJbnQxNiAmIHhuXHJcbiAgICAgICwgeWwgPSBVSW50MTYgJiB5bjtcclxuICAgIHJldHVybiAwIHwgeGwgKiB5bCArICgoVUludDE2ICYgeG4gPj4+IDE2KSAqIHlsICsgeGwgKiAoVUludDE2ICYgeW4gPj4+IDE2KSA8PCAxNiA+Pj4gMCk7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMjAgTWF0aC5sb2cxcCh4KVxyXG4gIGxvZzFwOiBmdW5jdGlvbih4KXtcclxuICAgIHJldHVybiAoeCA9ICt4KSA+IC0xZS04ICYmIHggPCAxZS04ID8geCAtIHggKiB4IC8gMiA6IGxvZygxICsgeCk7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMjEgTWF0aC5sb2cxMCh4KVxyXG4gIGxvZzEwOiBmdW5jdGlvbih4KXtcclxuICAgIHJldHVybiBsb2coeCkgLyBNYXRoLkxOMTA7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMjIgTWF0aC5sb2cyKHgpXHJcbiAgbG9nMjogZnVuY3Rpb24oeCl7XHJcbiAgICByZXR1cm4gbG9nKHgpIC8gTWF0aC5MTjI7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMjggTWF0aC5zaWduKHgpXHJcbiAgc2lnbjogc2lnbixcclxuICAvLyAyMC4yLjIuMzAgTWF0aC5zaW5oKHgpXHJcbiAgc2luaDogZnVuY3Rpb24oeCl7XHJcbiAgICByZXR1cm4gYWJzKHggPSAreCkgPCAxID8gKGV4cG0xKHgpIC0gZXhwbTEoLXgpKSAvIDIgOiAoZXhwKHggLSAxKSAtIGV4cCgteCAtIDEpKSAqIChFIC8gMik7XHJcbiAgfSxcclxuICAvLyAyMC4yLjIuMzMgTWF0aC50YW5oKHgpXHJcbiAgdGFuaDogZnVuY3Rpb24oeCl7XHJcbiAgICB2YXIgYSA9IGV4cG0xKHggPSAreClcclxuICAgICAgLCBiID0gZXhwbTEoLXgpO1xyXG4gICAgcmV0dXJuIGEgPT0gSW5maW5pdHkgPyAxIDogYiA9PSBJbmZpbml0eSA/IC0xIDogKGEgLSBiKSAvIChleHAoeCkgKyBleHAoLXgpKTtcclxuICB9LFxyXG4gIC8vIDIwLjIuMi4zNCBNYXRoLnRydW5jKHgpXHJcbiAgdHJ1bmM6IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiAoaXQgPiAwID8gZmxvb3IgOiBjZWlsKShpdCk7XHJcbiAgfVxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGlzT2JqZWN0ICAgPSAkLmlzT2JqZWN0XHJcbiAgLCBpc0Z1bmN0aW9uID0gJC5pc0Z1bmN0aW9uXHJcbiAgLCBOVU1CRVIgICAgID0gJ051bWJlcidcclxuICAsIE51bWJlciAgICAgPSAkLmdbTlVNQkVSXVxyXG4gICwgQmFzZSAgICAgICA9IE51bWJlclxyXG4gICwgcHJvdG8gICAgICA9IE51bWJlci5wcm90b3R5cGU7XHJcbmZ1bmN0aW9uIHRvUHJpbWl0aXZlKGl0KXtcclxuICB2YXIgZm4sIHZhbDtcclxuICBpZihpc0Z1bmN0aW9uKGZuID0gaXQudmFsdWVPZikgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xyXG4gIGlmKGlzRnVuY3Rpb24oZm4gPSBpdC50b1N0cmluZykgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xyXG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIG51bWJlclwiKTtcclxufVxyXG5mdW5jdGlvbiB0b051bWJlcihpdCl7XHJcbiAgaWYoaXNPYmplY3QoaXQpKWl0ID0gdG9QcmltaXRpdmUoaXQpO1xyXG4gIGlmKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyAmJiBpdC5sZW5ndGggPiAyICYmIGl0LmNoYXJDb2RlQXQoMCkgPT0gNDgpe1xyXG4gICAgdmFyIGJpbmFyeSA9IGZhbHNlO1xyXG4gICAgc3dpdGNoKGl0LmNoYXJDb2RlQXQoMSkpe1xyXG4gICAgICBjYXNlIDY2IDogY2FzZSA5OCAgOiBiaW5hcnkgPSB0cnVlO1xyXG4gICAgICBjYXNlIDc5IDogY2FzZSAxMTEgOiByZXR1cm4gcGFyc2VJbnQoaXQuc2xpY2UoMiksIGJpbmFyeSA/IDIgOiA4KTtcclxuICAgIH1cclxuICB9IHJldHVybiAraXQ7XHJcbn1cclxuaWYoJC5GVyAmJiAhKE51bWJlcignMG8xJykgJiYgTnVtYmVyKCcwYjEnKSkpe1xyXG4gIE51bWJlciA9IGZ1bmN0aW9uIE51bWJlcihpdCl7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIE51bWJlciA/IG5ldyBCYXNlKHRvTnVtYmVyKGl0KSkgOiB0b051bWJlcihpdCk7XHJcbiAgfTtcclxuICAkLmVhY2guY2FsbCgkLkRFU0MgPyAkLmdldE5hbWVzKEJhc2UpIDogKFxyXG4gICAgICAvLyBFUzM6XHJcbiAgICAgICdNQVhfVkFMVUUsTUlOX1ZBTFVFLE5hTixORUdBVElWRV9JTkZJTklUWSxQT1NJVElWRV9JTkZJTklUWSwnICtcclxuICAgICAgLy8gRVM2IChpbiBjYXNlLCBpZiBtb2R1bGVzIHdpdGggRVM2IE51bWJlciBzdGF0aWNzIHJlcXVpcmVkIGJlZm9yZSk6XHJcbiAgICAgICdFUFNJTE9OLGlzRmluaXRlLGlzSW50ZWdlcixpc05hTixpc1NhZmVJbnRlZ2VyLE1BWF9TQUZFX0lOVEVHRVIsJyArXHJcbiAgICAgICdNSU5fU0FGRV9JTlRFR0VSLHBhcnNlRmxvYXQscGFyc2VJbnQsaXNJbnRlZ2VyJ1xyXG4gICAgKS5zcGxpdCgnLCcpLCBmdW5jdGlvbihrZXkpe1xyXG4gICAgICBpZigkLmhhcyhCYXNlLCBrZXkpICYmICEkLmhhcyhOdW1iZXIsIGtleSkpe1xyXG4gICAgICAgICQuc2V0RGVzYyhOdW1iZXIsIGtleSwgJC5nZXREZXNjKEJhc2UsIGtleSkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgKTtcclxuICBOdW1iZXIucHJvdG90eXBlID0gcHJvdG87XHJcbiAgcHJvdG8uY29uc3RydWN0b3IgPSBOdW1iZXI7XHJcbiAgJC5oaWRlKCQuZywgTlVNQkVSLCBOdW1iZXIpO1xyXG59IiwidmFyICQgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgID0gcmVxdWlyZSgnLi8kLmRlZicpXHJcbiAgLCBhYnMgICA9IE1hdGguYWJzXHJcbiAgLCBmbG9vciA9IE1hdGguZmxvb3JcclxuICAsIE1BWF9TQUZFX0lOVEVHRVIgPSAweDFmZmZmZmZmZmZmZmZmOyAvLyBwb3coMiwgNTMpIC0gMSA9PSA5MDA3MTk5MjU0NzQwOTkxO1xyXG5mdW5jdGlvbiBpc0ludGVnZXIoaXQpe1xyXG4gIHJldHVybiAhJC5pc09iamVjdChpdCkgJiYgaXNGaW5pdGUoaXQpICYmIGZsb29yKGl0KSA9PT0gaXQ7XHJcbn1cclxuJGRlZigkZGVmLlMsICdOdW1iZXInLCB7XHJcbiAgLy8gMjAuMS4yLjEgTnVtYmVyLkVQU0lMT05cclxuICBFUFNJTE9OOiBNYXRoLnBvdygyLCAtNTIpLFxyXG4gIC8vIDIwLjEuMi4yIE51bWJlci5pc0Zpbml0ZShudW1iZXIpXHJcbiAgaXNGaW5pdGU6IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiB0eXBlb2YgaXQgPT0gJ251bWJlcicgJiYgaXNGaW5pdGUoaXQpO1xyXG4gIH0sXHJcbiAgLy8gMjAuMS4yLjMgTnVtYmVyLmlzSW50ZWdlcihudW1iZXIpXHJcbiAgaXNJbnRlZ2VyOiBpc0ludGVnZXIsXHJcbiAgLy8gMjAuMS4yLjQgTnVtYmVyLmlzTmFOKG51bWJlcilcclxuICBpc05hTjogZnVuY3Rpb24obnVtYmVyKXtcclxuICAgIHJldHVybiBudW1iZXIgIT0gbnVtYmVyO1xyXG4gIH0sXHJcbiAgLy8gMjAuMS4yLjUgTnVtYmVyLmlzU2FmZUludGVnZXIobnVtYmVyKVxyXG4gIGlzU2FmZUludGVnZXI6IGZ1bmN0aW9uKG51bWJlcil7XHJcbiAgICByZXR1cm4gaXNJbnRlZ2VyKG51bWJlcikgJiYgYWJzKG51bWJlcikgPD0gTUFYX1NBRkVfSU5URUdFUjtcclxuICB9LFxyXG4gIC8vIDIwLjEuMi42IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSXHJcbiAgTUFYX1NBRkVfSU5URUdFUjogTUFYX1NBRkVfSU5URUdFUixcclxuICAvLyAyMC4xLjIuMTAgTnVtYmVyLk1JTl9TQUZFX0lOVEVHRVJcclxuICBNSU5fU0FGRV9JTlRFR0VSOiAtTUFYX1NBRkVfSU5URUdFUixcclxuICAvLyAyMC4xLjIuMTIgTnVtYmVyLnBhcnNlRmxvYXQoc3RyaW5nKVxyXG4gIHBhcnNlRmxvYXQ6IHBhcnNlRmxvYXQsXHJcbiAgLy8gMjAuMS4yLjEzIE51bWJlci5wYXJzZUludChzdHJpbmcsIHJhZGl4KVxyXG4gIHBhcnNlSW50OiBwYXJzZUludFxyXG59KTsiLCIvLyAxOS4xLjMuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlKVxyXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7YXNzaWduOiByZXF1aXJlKCcuLyQuYXNzaWduJyl9KTsiLCIvLyAxOS4xLjMuMTAgT2JqZWN0LmlzKHZhbHVlMSwgdmFsdWUyKVxyXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7XHJcbiAgaXM6IGZ1bmN0aW9uKHgsIHkpe1xyXG4gICAgcmV0dXJuIHggPT09IHkgPyB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geSA6IHggIT0geCAmJiB5ICE9IHk7XHJcbiAgfVxyXG59KTsiLCIvLyAxOS4xLjMuMTkgT2JqZWN0LnNldFByb3RvdHlwZU9mKE8sIHByb3RvKVxyXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7c2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vJC5zZXQtcHJvdG8nKX0pOyIsInZhciAkICAgICAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgaXNPYmplY3QgPSAkLmlzT2JqZWN0XHJcbiAgLCB0b09iamVjdCA9ICQudG9PYmplY3Q7XHJcbmZ1bmN0aW9uIHdyYXBPYmplY3RNZXRob2QoTUVUSE9ELCBNT0RFKXtcclxuICB2YXIgZm4gID0gKCQuY29yZS5PYmplY3QgfHwge30pW01FVEhPRF0gfHwgT2JqZWN0W01FVEhPRF1cclxuICAgICwgZiAgID0gMFxyXG4gICAgLCBvICAgPSB7fTtcclxuICBvW01FVEhPRF0gPSBNT0RFID09IDEgPyBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogaXQ7XHJcbiAgfSA6IE1PREUgPT0gMiA/IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBpc09iamVjdChpdCkgPyBmbihpdCkgOiB0cnVlO1xyXG4gIH0gOiBNT0RFID09IDMgPyBmdW5jdGlvbihpdCl7XHJcbiAgICByZXR1cm4gaXNPYmplY3QoaXQpID8gZm4oaXQpIDogZmFsc2U7XHJcbiAgfSA6IE1PREUgPT0gNCA/IGZ1bmN0aW9uKGl0LCBrZXkpe1xyXG4gICAgcmV0dXJuIGZuKHRvT2JqZWN0KGl0KSwga2V5KTtcclxuICB9IDogTU9ERSA9PSA1ID8gZnVuY3Rpb24oaXQpe1xyXG4gICAgcmV0dXJuIGZuKE9iamVjdCgkLmFzc2VydERlZmluZWQoaXQpKSk7XHJcbiAgfSA6IGZ1bmN0aW9uKGl0KXtcclxuICAgIHJldHVybiBmbih0b09iamVjdChpdCkpO1xyXG4gIH07XHJcbiAgdHJ5IHtcclxuICAgIGZuKCd6Jyk7XHJcbiAgfSBjYXRjaChlKXtcclxuICAgIGYgPSAxO1xyXG4gIH1cclxuICAkZGVmKCRkZWYuUyArICRkZWYuRiAqIGYsICdPYmplY3QnLCBvKTtcclxufVxyXG53cmFwT2JqZWN0TWV0aG9kKCdmcmVlemUnLCAxKTtcclxud3JhcE9iamVjdE1ldGhvZCgnc2VhbCcsIDEpO1xyXG53cmFwT2JqZWN0TWV0aG9kKCdwcmV2ZW50RXh0ZW5zaW9ucycsIDEpO1xyXG53cmFwT2JqZWN0TWV0aG9kKCdpc0Zyb3plbicsIDIpO1xyXG53cmFwT2JqZWN0TWV0aG9kKCdpc1NlYWxlZCcsIDIpO1xyXG53cmFwT2JqZWN0TWV0aG9kKCdpc0V4dGVuc2libGUnLCAzKTtcclxud3JhcE9iamVjdE1ldGhvZCgnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywgNCk7XHJcbndyYXBPYmplY3RNZXRob2QoJ2dldFByb3RvdHlwZU9mJywgNSk7XHJcbndyYXBPYmplY3RNZXRob2QoJ2tleXMnKTtcclxud3JhcE9iamVjdE1ldGhvZCgnZ2V0T3duUHJvcGVydHlOYW1lcycpOyIsIid1c2Ugc3RyaWN0JztcclxuLy8gMTkuMS4zLjYgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZygpXHJcbnZhciAkICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY29mID0gcmVxdWlyZSgnLi8kLmNvZicpXHJcbiAgLCB0bXAgPSB7fTtcclxudG1wW3JlcXVpcmUoJy4vJC53a3MnKSgndG9TdHJpbmdUYWcnKV0gPSAneic7XHJcbmlmKCQuRlcgJiYgY29mKHRtcCkgIT0gJ3onKSQuaGlkZShPYmplY3QucHJvdG90eXBlLCAndG9TdHJpbmcnLCBmdW5jdGlvbigpe1xyXG4gIHJldHVybiAnW29iamVjdCAnICsgY29mLmNsYXNzb2YodGhpcykgKyAnXSc7XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY3R4ICAgICA9IHJlcXVpcmUoJy4vJC5jdHgnKVxyXG4gICwgY29mICAgICA9IHJlcXVpcmUoJy4vJC5jb2YnKVxyXG4gICwgJGRlZiAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgYXNzZXJ0ICA9IHJlcXVpcmUoJy4vJC5hc3NlcnQnKVxyXG4gICwgJGl0ZXIgICA9IHJlcXVpcmUoJy4vJC5pdGVyJylcclxuICAsIFNQRUNJRVMgPSByZXF1aXJlKCcuLyQud2tzJykoJ3NwZWNpZXMnKVxyXG4gICwgUkVDT1JEICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdyZWNvcmQnKVxyXG4gICwgZm9yT2YgICA9ICRpdGVyLmZvck9mXHJcbiAgLCBQUk9NSVNFID0gJ1Byb21pc2UnXHJcbiAgLCBnbG9iYWwgID0gJC5nXHJcbiAgLCBwcm9jZXNzID0gZ2xvYmFsLnByb2Nlc3NcclxuICAsIGFzYXAgICAgPSBwcm9jZXNzICYmIHByb2Nlc3MubmV4dFRpY2sgfHwgcmVxdWlyZSgnLi8kLnRhc2snKS5zZXRcclxuICAsIFByb21pc2UgPSBnbG9iYWxbUFJPTUlTRV1cclxuICAsIEJhc2UgICAgPSBQcm9taXNlXHJcbiAgLCBpc0Z1bmN0aW9uICAgICA9ICQuaXNGdW5jdGlvblxyXG4gICwgaXNPYmplY3QgICAgICAgPSAkLmlzT2JqZWN0XHJcbiAgLCBhc3NlcnRGdW5jdGlvbiA9IGFzc2VydC5mblxyXG4gICwgYXNzZXJ0T2JqZWN0ICAgPSBhc3NlcnQub2JqXHJcbiAgLCB0ZXN0O1xyXG5mdW5jdGlvbiBnZXRDb25zdHJ1Y3RvcihDKXtcclxuICB2YXIgUyA9IGFzc2VydE9iamVjdChDKVtTUEVDSUVTXTtcclxuICByZXR1cm4gUyAhPSB1bmRlZmluZWQgPyBTIDogQztcclxufVxyXG5pc0Z1bmN0aW9uKFByb21pc2UpICYmIGlzRnVuY3Rpb24oUHJvbWlzZS5yZXNvbHZlKVxyXG4mJiBQcm9taXNlLnJlc29sdmUodGVzdCA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKCl7fSkpID09IHRlc3RcclxufHwgZnVuY3Rpb24oKXtcclxuICBmdW5jdGlvbiBpc1RoZW5hYmxlKGl0KXtcclxuICAgIHZhciB0aGVuO1xyXG4gICAgaWYoaXNPYmplY3QoaXQpKXRoZW4gPSBpdC50aGVuO1xyXG4gICAgcmV0dXJuIGlzRnVuY3Rpb24odGhlbikgPyB0aGVuIDogZmFsc2U7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGhhbmRsZWRSZWplY3Rpb25Pckhhc09uUmVqZWN0ZWQocHJvbWlzZSl7XHJcbiAgICB2YXIgcmVjb3JkID0gcHJvbWlzZVtSRUNPUkRdXHJcbiAgICAgICwgY2hhaW4gID0gcmVjb3JkLmNcclxuICAgICAgLCBpICAgICAgPSAwXHJcbiAgICAgICwgcmVhY3Q7XHJcbiAgICBpZihyZWNvcmQuaClyZXR1cm4gdHJ1ZTtcclxuICAgIHdoaWxlKGNoYWluLmxlbmd0aCA+IGkpe1xyXG4gICAgICByZWFjdCA9IGNoYWluW2krK107XHJcbiAgICAgIGlmKHJlYWN0LmZhaWwgfHwgaGFuZGxlZFJlamVjdGlvbk9ySGFzT25SZWplY3RlZChyZWFjdC5QKSlyZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gbm90aWZ5KHJlY29yZCwgaXNSZWplY3Qpe1xyXG4gICAgdmFyIGNoYWluID0gcmVjb3JkLmM7XHJcbiAgICBpZihpc1JlamVjdCB8fCBjaGFpbi5sZW5ndGgpYXNhcChmdW5jdGlvbigpe1xyXG4gICAgICB2YXIgcHJvbWlzZSA9IHJlY29yZC5wXHJcbiAgICAgICAgLCB2YWx1ZSAgID0gcmVjb3JkLnZcclxuICAgICAgICAsIG9rICAgICAgPSByZWNvcmQucyA9PSAxXHJcbiAgICAgICAgLCBpICAgICAgID0gMDtcclxuICAgICAgaWYoaXNSZWplY3QgJiYgIWhhbmRsZWRSZWplY3Rpb25Pckhhc09uUmVqZWN0ZWQocHJvbWlzZSkpe1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgICAgIGlmKCFoYW5kbGVkUmVqZWN0aW9uT3JIYXNPblJlamVjdGVkKHByb21pc2UpKXtcclxuICAgICAgICAgICAgaWYoY29mKHByb2Nlc3MpID09ICdwcm9jZXNzJyl7XHJcbiAgICAgICAgICAgICAgcHJvY2Vzcy5lbWl0KCd1bmhhbmRsZWRSZWplY3Rpb24nLCB2YWx1ZSwgcHJvbWlzZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihnbG9iYWwuY29uc29sZSAmJiBpc0Z1bmN0aW9uKGNvbnNvbGUuZXJyb3IpKXtcclxuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKCdVbmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb24nLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCAxZTMpO1xyXG4gICAgICB9IGVsc2Ugd2hpbGUoY2hhaW4ubGVuZ3RoID4gaSkhZnVuY3Rpb24ocmVhY3Qpe1xyXG4gICAgICAgIHZhciBjYiA9IG9rID8gcmVhY3Qub2sgOiByZWFjdC5mYWlsXHJcbiAgICAgICAgICAsIHJldCwgdGhlbjtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaWYoY2Ipe1xyXG4gICAgICAgICAgICBpZighb2spcmVjb3JkLmggPSB0cnVlO1xyXG4gICAgICAgICAgICByZXQgPSBjYiA9PT0gdHJ1ZSA/IHZhbHVlIDogY2IodmFsdWUpO1xyXG4gICAgICAgICAgICBpZihyZXQgPT09IHJlYWN0LlApe1xyXG4gICAgICAgICAgICAgIHJlYWN0LnJlaihUeXBlRXJyb3IoUFJPTUlTRSArICctY2hhaW4gY3ljbGUnKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZih0aGVuID0gaXNUaGVuYWJsZShyZXQpKXtcclxuICAgICAgICAgICAgICB0aGVuLmNhbGwocmV0LCByZWFjdC5yZXMsIHJlYWN0LnJlaik7XHJcbiAgICAgICAgICAgIH0gZWxzZSByZWFjdC5yZXMocmV0KTtcclxuICAgICAgICAgIH0gZWxzZSByZWFjdC5yZWoodmFsdWUpO1xyXG4gICAgICAgIH0gY2F0Y2goZXJyKXtcclxuICAgICAgICAgIHJlYWN0LnJlaihlcnIpO1xyXG4gICAgICAgIH1cclxuICAgICAgfShjaGFpbltpKytdKTtcclxuICAgICAgY2hhaW4ubGVuZ3RoID0gMDtcclxuICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiByZWplY3QodmFsdWUpe1xyXG4gICAgdmFyIHJlY29yZCA9IHRoaXM7XHJcbiAgICBpZihyZWNvcmQuZClyZXR1cm47XHJcbiAgICByZWNvcmQuZCA9IHRydWU7XHJcbiAgICByZWNvcmQgPSByZWNvcmQuciB8fCByZWNvcmQ7IC8vIHVud3JhcFxyXG4gICAgcmVjb3JkLnYgPSB2YWx1ZTtcclxuICAgIHJlY29yZC5zID0gMjtcclxuICAgIG5vdGlmeShyZWNvcmQsIHRydWUpO1xyXG4gIH1cclxuICBmdW5jdGlvbiByZXNvbHZlKHZhbHVlKXtcclxuICAgIHZhciByZWNvcmQgPSB0aGlzXHJcbiAgICAgICwgdGhlbiwgd3JhcHBlcjtcclxuICAgIGlmKHJlY29yZC5kKXJldHVybjtcclxuICAgIHJlY29yZC5kID0gdHJ1ZTtcclxuICAgIHJlY29yZCA9IHJlY29yZC5yIHx8IHJlY29yZDsgLy8gdW53cmFwXHJcbiAgICB0cnkge1xyXG4gICAgICBpZih0aGVuID0gaXNUaGVuYWJsZSh2YWx1ZSkpe1xyXG4gICAgICAgIHdyYXBwZXIgPSB7cjogcmVjb3JkLCBkOiBmYWxzZX07IC8vIHdyYXBcclxuICAgICAgICB0aGVuLmNhbGwodmFsdWUsIGN0eChyZXNvbHZlLCB3cmFwcGVyLCAxKSwgY3R4KHJlamVjdCwgd3JhcHBlciwgMSkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJlY29yZC52ID0gdmFsdWU7XHJcbiAgICAgICAgcmVjb3JkLnMgPSAxO1xyXG4gICAgICAgIG5vdGlmeShyZWNvcmQpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoKGVycil7XHJcbiAgICAgIHJlamVjdC5jYWxsKHdyYXBwZXIgfHwge3I6IHJlY29yZCwgZDogZmFsc2V9LCBlcnIpOyAvLyB3cmFwXHJcbiAgICB9XHJcbiAgfVxyXG4gIC8vIDI1LjQuMy4xIFByb21pc2UoZXhlY3V0b3IpXHJcbiAgUHJvbWlzZSA9IGZ1bmN0aW9uKGV4ZWN1dG9yKXtcclxuICAgIGFzc2VydEZ1bmN0aW9uKGV4ZWN1dG9yKTtcclxuICAgIHZhciByZWNvcmQgPSB7XHJcbiAgICAgIHA6IGFzc2VydC5pbnN0KHRoaXMsIFByb21pc2UsIFBST01JU0UpLCAvLyA8LSBwcm9taXNlXHJcbiAgICAgIGM6IFtdLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBjaGFpblxyXG4gICAgICBzOiAwLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gPC0gc3RhdGVcclxuICAgICAgZDogZmFsc2UsICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIGRvbmVcclxuICAgICAgdjogdW5kZWZpbmVkLCAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIDwtIHZhbHVlXHJcbiAgICAgIGg6IGZhbHNlICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyA8LSBoYW5kbGVkIHJlamVjdGlvblxyXG4gICAgfTtcclxuICAgICQuaGlkZSh0aGlzLCBSRUNPUkQsIHJlY29yZCk7XHJcbiAgICB0cnkge1xyXG4gICAgICBleGVjdXRvcihjdHgocmVzb2x2ZSwgcmVjb3JkLCAxKSwgY3R4KHJlamVjdCwgcmVjb3JkLCAxKSk7XHJcbiAgICB9IGNhdGNoKGVycil7XHJcbiAgICAgIHJlamVjdC5jYWxsKHJlY29yZCwgZXJyKTtcclxuICAgIH1cclxuICB9O1xyXG4gICQubWl4KFByb21pc2UucHJvdG90eXBlLCB7XHJcbiAgICAvLyAyNS40LjUuMyBQcm9taXNlLnByb3RvdHlwZS50aGVuKG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKVxyXG4gICAgdGhlbjogZnVuY3Rpb24ob25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpe1xyXG4gICAgICB2YXIgUyA9IGFzc2VydE9iamVjdChhc3NlcnRPYmplY3QodGhpcykuY29uc3RydWN0b3IpW1NQRUNJRVNdO1xyXG4gICAgICB2YXIgcmVhY3QgPSB7XHJcbiAgICAgICAgb2s6ICAgaXNGdW5jdGlvbihvbkZ1bGZpbGxlZCkgPyBvbkZ1bGZpbGxlZCA6IHRydWUsXHJcbiAgICAgICAgZmFpbDogaXNGdW5jdGlvbihvblJlamVjdGVkKSAgPyBvblJlamVjdGVkICA6IGZhbHNlXHJcbiAgICAgIH07XHJcbiAgICAgIHZhciBQID0gcmVhY3QuUCA9IG5ldyAoUyAhPSB1bmRlZmluZWQgPyBTIDogUHJvbWlzZSkoZnVuY3Rpb24ocmVzLCByZWope1xyXG4gICAgICAgIHJlYWN0LnJlcyA9IGFzc2VydEZ1bmN0aW9uKHJlcyk7XHJcbiAgICAgICAgcmVhY3QucmVqID0gYXNzZXJ0RnVuY3Rpb24ocmVqKTtcclxuICAgICAgfSk7XHJcbiAgICAgIHZhciByZWNvcmQgPSB0aGlzW1JFQ09SRF07XHJcbiAgICAgIHJlY29yZC5jLnB1c2gocmVhY3QpO1xyXG4gICAgICByZWNvcmQucyAmJiBub3RpZnkocmVjb3JkKTtcclxuICAgICAgcmV0dXJuIFA7XHJcbiAgICB9LFxyXG4gICAgLy8gMjUuNC41LjEgUHJvbWlzZS5wcm90b3R5cGUuY2F0Y2gob25SZWplY3RlZClcclxuICAgICdjYXRjaCc6IGZ1bmN0aW9uKG9uUmVqZWN0ZWQpe1xyXG4gICAgICByZXR1cm4gdGhpcy50aGVuKHVuZGVmaW5lZCwgb25SZWplY3RlZCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn0oKTtcclxuJGRlZigkZGVmLkcgKyAkZGVmLlcgKyAkZGVmLkYgKiAoUHJvbWlzZSAhPSBCYXNlKSwge1Byb21pc2U6IFByb21pc2V9KTtcclxuJGRlZigkZGVmLlMsIFBST01JU0UsIHtcclxuICAvLyAyNS40LjQuNSBQcm9taXNlLnJlamVjdChyKVxyXG4gIHJlamVjdDogZnVuY3Rpb24ocil7XHJcbiAgICByZXR1cm4gbmV3IChnZXRDb25zdHJ1Y3Rvcih0aGlzKSkoZnVuY3Rpb24ocmVzLCByZWope1xyXG4gICAgICByZWoocik7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIC8vIDI1LjQuNC42IFByb21pc2UucmVzb2x2ZSh4KVxyXG4gIHJlc29sdmU6IGZ1bmN0aW9uKHgpe1xyXG4gICAgcmV0dXJuIGlzT2JqZWN0KHgpICYmIFJFQ09SRCBpbiB4ICYmICQuZ2V0UHJvdG8oeCkgPT09IHRoaXMucHJvdG90eXBlXHJcbiAgICAgID8geCA6IG5ldyAoZ2V0Q29uc3RydWN0b3IodGhpcykpKGZ1bmN0aW9uKHJlcyl7XHJcbiAgICAgICAgcmVzKHgpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn0pO1xyXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqICgkaXRlci5mYWlsKGZ1bmN0aW9uKGl0ZXIpe1xyXG4gIFByb21pc2UuYWxsKGl0ZXIpWydjYXRjaCddKGZ1bmN0aW9uKCl7fSk7XHJcbn0pIHx8ICRpdGVyLkRBTkdFUl9DTE9TSU5HKSwgUFJPTUlTRSwge1xyXG4gIC8vIDI1LjQuNC4xIFByb21pc2UuYWxsKGl0ZXJhYmxlKVxyXG4gIGFsbDogZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgdmFyIEMgICAgICA9IGdldENvbnN0cnVjdG9yKHRoaXMpXHJcbiAgICAgICwgdmFsdWVzID0gW107XHJcbiAgICByZXR1cm4gbmV3IEMoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KXtcclxuICAgICAgZm9yT2YoaXRlcmFibGUsIGZhbHNlLCB2YWx1ZXMucHVzaCwgdmFsdWVzKTtcclxuICAgICAgdmFyIHJlbWFpbmluZyA9IHZhbHVlcy5sZW5ndGhcclxuICAgICAgICAsIHJlc3VsdHMgICA9IEFycmF5KHJlbWFpbmluZyk7XHJcbiAgICAgIGlmKHJlbWFpbmluZykkLmVhY2guY2FsbCh2YWx1ZXMsIGZ1bmN0aW9uKHByb21pc2UsIGluZGV4KXtcclxuICAgICAgICBDLnJlc29sdmUocHJvbWlzZSkudGhlbihmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IHZhbHVlO1xyXG4gICAgICAgICAgLS1yZW1haW5pbmcgfHwgcmVzb2x2ZShyZXN1bHRzKTtcclxuICAgICAgICB9LCByZWplY3QpO1xyXG4gICAgICB9KTtcclxuICAgICAgZWxzZSByZXNvbHZlKHJlc3VsdHMpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvLyAyNS40LjQuNCBQcm9taXNlLnJhY2UoaXRlcmFibGUpXHJcbiAgcmFjZTogZnVuY3Rpb24oaXRlcmFibGUpe1xyXG4gICAgdmFyIEMgPSBnZXRDb25zdHJ1Y3Rvcih0aGlzKTtcclxuICAgIHJldHVybiBuZXcgQyhmdW5jdGlvbihyZXNvbHZlLCByZWplY3Qpe1xyXG4gICAgICBmb3JPZihpdGVyYWJsZSwgZmFsc2UsIGZ1bmN0aW9uKHByb21pc2Upe1xyXG4gICAgICAgIEMucmVzb2x2ZShwcm9taXNlKS50aGVuKHJlc29sdmUsIHJlamVjdCk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59KTtcclxuY29mLnNldChQcm9taXNlLCBQUk9NSVNFKTtcclxucmVxdWlyZSgnLi8kLnNwZWNpZXMnKShQcm9taXNlKTsiLCJ2YXIgJCAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgICAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgc2V0UHJvdG8gID0gcmVxdWlyZSgnLi8kLnNldC1wcm90bycpXHJcbiAgLCAkaXRlciAgICAgPSByZXF1aXJlKCcuLyQuaXRlcicpXHJcbiAgLCBJVEVSICAgICAgPSByZXF1aXJlKCcuLyQudWlkJykuc2FmZSgnaXRlcicpXHJcbiAgLCBzdGVwICAgICAgPSAkaXRlci5zdGVwXHJcbiAgLCBhc3NlcnQgICAgPSByZXF1aXJlKCcuLyQuYXNzZXJ0JylcclxuICAsIGlzT2JqZWN0ICA9ICQuaXNPYmplY3RcclxuICAsIGdldERlc2MgICA9ICQuZ2V0RGVzY1xyXG4gICwgc2V0RGVzYyAgID0gJC5zZXREZXNjXHJcbiAgLCBnZXRQcm90byAgPSAkLmdldFByb3RvXHJcbiAgLCBhcHBseSAgICAgPSBGdW5jdGlvbi5hcHBseVxyXG4gICwgYXNzZXJ0T2JqZWN0ID0gYXNzZXJ0Lm9ialxyXG4gICwgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCAkLml0O1xyXG5mdW5jdGlvbiBFbnVtZXJhdGUoaXRlcmF0ZWQpe1xyXG4gIHZhciBrZXlzID0gW10sIGtleTtcclxuICBmb3Ioa2V5IGluIGl0ZXJhdGVkKWtleXMucHVzaChrZXkpO1xyXG4gICQuc2V0KHRoaXMsIElURVIsIHtvOiBpdGVyYXRlZCwgYToga2V5cywgaTogMH0pO1xyXG59XHJcbiRpdGVyLmNyZWF0ZShFbnVtZXJhdGUsICdPYmplY3QnLCBmdW5jdGlvbigpe1xyXG4gIHZhciBpdGVyID0gdGhpc1tJVEVSXVxyXG4gICAgLCBrZXlzID0gaXRlci5hXHJcbiAgICAsIGtleTtcclxuICBkbyB7XHJcbiAgICBpZihpdGVyLmkgPj0ga2V5cy5sZW5ndGgpcmV0dXJuIHN0ZXAoMSk7XHJcbiAgfSB3aGlsZSghKChrZXkgPSBrZXlzW2l0ZXIuaSsrXSkgaW4gaXRlci5vKSk7XHJcbiAgcmV0dXJuIHN0ZXAoMCwga2V5KTtcclxufSk7XHJcblxyXG5mdW5jdGlvbiB3cmFwKGZuKXtcclxuICByZXR1cm4gZnVuY3Rpb24oaXQpe1xyXG4gICAgYXNzZXJ0T2JqZWN0KGl0KTtcclxuICAgIHRyeSB7XHJcbiAgICAgIGZuLmFwcGx5KHVuZGVmaW5lZCwgYXJndW1lbnRzKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9IGNhdGNoKGUpe1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVmbGVjdEdldCh0YXJnZXQsIHByb3BlcnR5S2V5LyosIHJlY2VpdmVyKi8pe1xyXG4gIHZhciByZWNlaXZlciA9IGFyZ3VtZW50cy5sZW5ndGggPCAzID8gdGFyZ2V0IDogYXJndW1lbnRzWzJdXHJcbiAgICAsIGRlc2MgPSBnZXREZXNjKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSksIHByb3RvO1xyXG4gIGlmKGRlc2MpcmV0dXJuICQuaGFzKGRlc2MsICd2YWx1ZScpXHJcbiAgICA/IGRlc2MudmFsdWVcclxuICAgIDogZGVzYy5nZXQgPT09IHVuZGVmaW5lZFxyXG4gICAgICA/IHVuZGVmaW5lZFxyXG4gICAgICA6IGRlc2MuZ2V0LmNhbGwocmVjZWl2ZXIpO1xyXG4gIHJldHVybiBpc09iamVjdChwcm90byA9IGdldFByb3RvKHRhcmdldCkpXHJcbiAgICA/IHJlZmxlY3RHZXQocHJvdG8sIHByb3BlcnR5S2V5LCByZWNlaXZlcilcclxuICAgIDogdW5kZWZpbmVkO1xyXG59XHJcbmZ1bmN0aW9uIHJlZmxlY3RTZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSwgVi8qLCByZWNlaXZlciovKXtcclxuICB2YXIgcmVjZWl2ZXIgPSBhcmd1bWVudHMubGVuZ3RoIDwgNCA/IHRhcmdldCA6IGFyZ3VtZW50c1szXVxyXG4gICAgLCBvd25EZXNjICA9IGdldERlc2MoYXNzZXJ0T2JqZWN0KHRhcmdldCksIHByb3BlcnR5S2V5KVxyXG4gICAgLCBleGlzdGluZ0Rlc2NyaXB0b3IsIHByb3RvO1xyXG4gIGlmKCFvd25EZXNjKXtcclxuICAgIGlmKGlzT2JqZWN0KHByb3RvID0gZ2V0UHJvdG8odGFyZ2V0KSkpe1xyXG4gICAgICByZXR1cm4gcmVmbGVjdFNldChwcm90bywgcHJvcGVydHlLZXksIFYsIHJlY2VpdmVyKTtcclxuICAgIH1cclxuICAgIG93bkRlc2MgPSAkLmRlc2MoMCk7XHJcbiAgfVxyXG4gIGlmKCQuaGFzKG93bkRlc2MsICd2YWx1ZScpKXtcclxuICAgIGlmKG93bkRlc2Mud3JpdGFibGUgPT09IGZhbHNlIHx8ICFpc09iamVjdChyZWNlaXZlcikpcmV0dXJuIGZhbHNlO1xyXG4gICAgZXhpc3RpbmdEZXNjcmlwdG9yID0gZ2V0RGVzYyhyZWNlaXZlciwgcHJvcGVydHlLZXkpIHx8ICQuZGVzYygwKTtcclxuICAgIGV4aXN0aW5nRGVzY3JpcHRvci52YWx1ZSA9IFY7XHJcbiAgICBzZXREZXNjKHJlY2VpdmVyLCBwcm9wZXJ0eUtleSwgZXhpc3RpbmdEZXNjcmlwdG9yKTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxuICByZXR1cm4gb3duRGVzYy5zZXQgPT09IHVuZGVmaW5lZCA/IGZhbHNlIDogKG93bkRlc2Muc2V0LmNhbGwocmVjZWl2ZXIsIFYpLCB0cnVlKTtcclxufVxyXG5cclxudmFyIHJlZmxlY3QgPSB7XHJcbiAgLy8gMjYuMS4xIFJlZmxlY3QuYXBwbHkodGFyZ2V0LCB0aGlzQXJndW1lbnQsIGFyZ3VtZW50c0xpc3QpXHJcbiAgYXBwbHk6IHJlcXVpcmUoJy4vJC5jdHgnKShGdW5jdGlvbi5jYWxsLCBhcHBseSwgMyksXHJcbiAgLy8gMjYuMS4yIFJlZmxlY3QuY29uc3RydWN0KHRhcmdldCwgYXJndW1lbnRzTGlzdCBbLCBuZXdUYXJnZXRdKVxyXG4gIGNvbnN0cnVjdDogZnVuY3Rpb24odGFyZ2V0LCBhcmd1bWVudHNMaXN0IC8qLCBuZXdUYXJnZXQqLyl7XHJcbiAgICB2YXIgcHJvdG8gICAgPSBhc3NlcnQuZm4oYXJndW1lbnRzLmxlbmd0aCA8IDMgPyB0YXJnZXQgOiBhcmd1bWVudHNbMl0pLnByb3RvdHlwZVxyXG4gICAgICAsIGluc3RhbmNlID0gJC5jcmVhdGUoaXNPYmplY3QocHJvdG8pID8gcHJvdG8gOiBPYmplY3QucHJvdG90eXBlKVxyXG4gICAgICAsIHJlc3VsdCAgID0gYXBwbHkuY2FsbCh0YXJnZXQsIGluc3RhbmNlLCBhcmd1bWVudHNMaXN0KTtcclxuICAgIHJldHVybiBpc09iamVjdChyZXN1bHQpID8gcmVzdWx0IDogaW5zdGFuY2U7XHJcbiAgfSxcclxuICAvLyAyNi4xLjMgUmVmbGVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIHByb3BlcnR5S2V5LCBhdHRyaWJ1dGVzKVxyXG4gIGRlZmluZVByb3BlcnR5OiB3cmFwKHNldERlc2MpLFxyXG4gIC8vIDI2LjEuNCBSZWZsZWN0LmRlbGV0ZVByb3BlcnR5KHRhcmdldCwgcHJvcGVydHlLZXkpXHJcbiAgZGVsZXRlUHJvcGVydHk6IGZ1bmN0aW9uKHRhcmdldCwgcHJvcGVydHlLZXkpe1xyXG4gICAgdmFyIGRlc2MgPSBnZXREZXNjKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm9wZXJ0eUtleSk7XHJcbiAgICByZXR1cm4gZGVzYyAmJiAhZGVzYy5jb25maWd1cmFibGUgPyBmYWxzZSA6IGRlbGV0ZSB0YXJnZXRbcHJvcGVydHlLZXldO1xyXG4gIH0sXHJcbiAgLy8gMjYuMS41IFJlZmxlY3QuZW51bWVyYXRlKHRhcmdldClcclxuICBlbnVtZXJhdGU6IGZ1bmN0aW9uKHRhcmdldCl7XHJcbiAgICByZXR1cm4gbmV3IEVudW1lcmF0ZShhc3NlcnRPYmplY3QodGFyZ2V0KSk7XHJcbiAgfSxcclxuICAvLyAyNi4xLjYgUmVmbGVjdC5nZXQodGFyZ2V0LCBwcm9wZXJ0eUtleSBbLCByZWNlaXZlcl0pXHJcbiAgZ2V0OiByZWZsZWN0R2V0LFxyXG4gIC8vIDI2LjEuNyBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIHByb3BlcnR5S2V5KVxyXG4gIGdldE93blByb3BlcnR5RGVzY3JpcHRvcjogZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eUtleSl7XHJcbiAgICByZXR1cm4gZ2V0RGVzYyhhc3NlcnRPYmplY3QodGFyZ2V0KSwgcHJvcGVydHlLZXkpO1xyXG4gIH0sXHJcbiAgLy8gMjYuMS44IFJlZmxlY3QuZ2V0UHJvdG90eXBlT2YodGFyZ2V0KVxyXG4gIGdldFByb3RvdHlwZU9mOiBmdW5jdGlvbih0YXJnZXQpe1xyXG4gICAgcmV0dXJuIGdldFByb3RvKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcclxuICB9LFxyXG4gIC8vIDI2LjEuOSBSZWZsZWN0Lmhhcyh0YXJnZXQsIHByb3BlcnR5S2V5KVxyXG4gIGhhczogZnVuY3Rpb24odGFyZ2V0LCBwcm9wZXJ0eUtleSl7XHJcbiAgICByZXR1cm4gcHJvcGVydHlLZXkgaW4gdGFyZ2V0O1xyXG4gIH0sXHJcbiAgLy8gMjYuMS4xMCBSZWZsZWN0LmlzRXh0ZW5zaWJsZSh0YXJnZXQpXHJcbiAgaXNFeHRlbnNpYmxlOiBmdW5jdGlvbih0YXJnZXQpe1xyXG4gICAgcmV0dXJuICEhaXNFeHRlbnNpYmxlKGFzc2VydE9iamVjdCh0YXJnZXQpKTtcclxuICB9LFxyXG4gIC8vIDI2LjEuMTEgUmVmbGVjdC5vd25LZXlzKHRhcmdldClcclxuICBvd25LZXlzOiByZXF1aXJlKCcuLyQub3duLWtleXMnKSxcclxuICAvLyAyNi4xLjEyIFJlZmxlY3QucHJldmVudEV4dGVuc2lvbnModGFyZ2V0KVxyXG4gIHByZXZlbnRFeHRlbnNpb25zOiB3cmFwKE9iamVjdC5wcmV2ZW50RXh0ZW5zaW9ucyB8fCAkLml0KSxcclxuICAvLyAyNi4xLjEzIFJlZmxlY3Quc2V0KHRhcmdldCwgcHJvcGVydHlLZXksIFYgWywgcmVjZWl2ZXJdKVxyXG4gIHNldDogcmVmbGVjdFNldFxyXG59O1xyXG4vLyAyNi4xLjE0IFJlZmxlY3Quc2V0UHJvdG90eXBlT2YodGFyZ2V0LCBwcm90bylcclxuaWYoc2V0UHJvdG8pcmVmbGVjdC5zZXRQcm90b3R5cGVPZiA9IGZ1bmN0aW9uKHRhcmdldCwgcHJvdG8pe1xyXG4gIHNldFByb3RvKGFzc2VydE9iamVjdCh0YXJnZXQpLCBwcm90byk7XHJcbiAgcmV0dXJuIHRydWU7XHJcbn07XHJcblxyXG4kZGVmKCRkZWYuRywge1JlZmxlY3Q6IHt9fSk7XHJcbiRkZWYoJGRlZi5TLCAnUmVmbGVjdCcsIHJlZmxlY3QpOyIsInZhciAkICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgY29mICAgID0gcmVxdWlyZSgnLi8kLmNvZicpXHJcbiAgLCBSZWdFeHAgPSAkLmcuUmVnRXhwXHJcbiAgLCBCYXNlICAgPSBSZWdFeHBcclxuICAsIHByb3RvICA9IFJlZ0V4cC5wcm90b3R5cGU7XHJcbmlmKCQuRlcgJiYgJC5ERVNDKXtcclxuICAvLyBSZWdFeHAgYWxsb3dzIGEgcmVnZXggd2l0aCBmbGFncyBhcyB0aGUgcGF0dGVyblxyXG4gIGlmKCFmdW5jdGlvbigpe3RyeXsgcmV0dXJuIFJlZ0V4cCgvYS9nLCAnaScpID09ICcvYS9pJzsgfWNhdGNoKGUpeyAvKiBlbXB0eSAqLyB9fSgpKXtcclxuICAgIFJlZ0V4cCA9IGZ1bmN0aW9uIFJlZ0V4cChwYXR0ZXJuLCBmbGFncyl7XHJcbiAgICAgIHJldHVybiBuZXcgQmFzZShjb2YocGF0dGVybikgPT0gJ1JlZ0V4cCcgJiYgZmxhZ3MgIT09IHVuZGVmaW5lZFxyXG4gICAgICAgID8gcGF0dGVybi5zb3VyY2UgOiBwYXR0ZXJuLCBmbGFncyk7XHJcbiAgICB9O1xyXG4gICAgJC5lYWNoLmNhbGwoJC5nZXROYW1lcyhCYXNlKSwgZnVuY3Rpb24oa2V5KXtcclxuICAgICAga2V5IGluIFJlZ0V4cCB8fCAkLnNldERlc2MoUmVnRXhwLCBrZXksIHtcclxuICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICAgICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gQmFzZVtrZXldOyB9LFxyXG4gICAgICAgIHNldDogZnVuY3Rpb24oaXQpeyBCYXNlW2tleV0gPSBpdDsgfVxyXG4gICAgICB9KTtcclxuICAgIH0pO1xyXG4gICAgcHJvdG8uY29uc3RydWN0b3IgPSBSZWdFeHA7XHJcbiAgICBSZWdFeHAucHJvdG90eXBlID0gcHJvdG87XHJcbiAgICAkLmhpZGUoJC5nLCAnUmVnRXhwJywgUmVnRXhwKTtcclxuICB9XHJcbiAgLy8gMjEuMi41LjMgZ2V0IFJlZ0V4cC5wcm90b3R5cGUuZmxhZ3MoKVxyXG4gIGlmKC8uL2cuZmxhZ3MgIT0gJ2cnKSQuc2V0RGVzYyhwcm90bywgJ2ZsYWdzJywge1xyXG4gICAgY29uZmlndXJhYmxlOiB0cnVlLFxyXG4gICAgZ2V0OiByZXF1aXJlKCcuLyQucmVwbGFjZXInKSgvXi4qXFwvKFxcdyopJC8sICckMScpXHJcbiAgfSk7XHJcbn1cclxucmVxdWlyZSgnLi8kLnNwZWNpZXMnKShSZWdFeHApOyIsIid1c2Ugc3RyaWN0JztcclxudmFyIHN0cm9uZyA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXN0cm9uZycpO1xyXG5cclxuLy8gMjMuMiBTZXQgT2JqZWN0c1xyXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdTZXQnLCB7XHJcbiAgLy8gMjMuMi4zLjEgU2V0LnByb3RvdHlwZS5hZGQodmFsdWUpXHJcbiAgYWRkOiBmdW5jdGlvbih2YWx1ZSl7XHJcbiAgICByZXR1cm4gc3Ryb25nLmRlZih0aGlzLCB2YWx1ZSA9IHZhbHVlID09PSAwID8gMCA6IHZhbHVlLCB2YWx1ZSk7XHJcbiAgfVxyXG59LCBzdHJvbmcpOyIsInZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjMuMyBTdHJpbmcucHJvdG90eXBlLmNvZGVQb2ludEF0KHBvcylcclxuICBjb2RlUG9pbnRBdDogcmVxdWlyZSgnLi8kLnN0cmluZy1hdCcpKGZhbHNlKVxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGNvZiAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIHRvTGVuZ3RoID0gJC50b0xlbmd0aDtcclxuXHJcbiRkZWYoJGRlZi5QLCAnU3RyaW5nJywge1xyXG4gIC8vIDIxLjEuMy42IFN0cmluZy5wcm90b3R5cGUuZW5kc1dpdGgoc2VhcmNoU3RyaW5nIFssIGVuZFBvc2l0aW9uXSlcclxuICBlbmRzV2l0aDogZnVuY3Rpb24oc2VhcmNoU3RyaW5nIC8qLCBlbmRQb3NpdGlvbiA9IEBsZW5ndGggKi8pe1xyXG4gICAgaWYoY29mKHNlYXJjaFN0cmluZykgPT0gJ1JlZ0V4cCcpdGhyb3cgVHlwZUVycm9yKCk7XHJcbiAgICB2YXIgdGhhdCA9IFN0cmluZygkLmFzc2VydERlZmluZWQodGhpcykpXHJcbiAgICAgICwgZW5kUG9zaXRpb24gPSBhcmd1bWVudHNbMV1cclxuICAgICAgLCBsZW4gPSB0b0xlbmd0aCh0aGF0Lmxlbmd0aClcclxuICAgICAgLCBlbmQgPSBlbmRQb3NpdGlvbiA9PT0gdW5kZWZpbmVkID8gbGVuIDogTWF0aC5taW4odG9MZW5ndGgoZW5kUG9zaXRpb24pLCBsZW4pO1xyXG4gICAgc2VhcmNoU3RyaW5nICs9ICcnO1xyXG4gICAgcmV0dXJuIHRoYXQuc2xpY2UoZW5kIC0gc2VhcmNoU3RyaW5nLmxlbmd0aCwgZW5kKSA9PT0gc2VhcmNoU3RyaW5nO1xyXG4gIH1cclxufSk7IiwidmFyICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIHRvSW5kZXggPSByZXF1aXJlKCcuLyQnKS50b0luZGV4XHJcbiAgLCBmcm9tQ2hhckNvZGUgPSBTdHJpbmcuZnJvbUNoYXJDb2RlO1xyXG5cclxuJGRlZigkZGVmLlMsICdTdHJpbmcnLCB7XHJcbiAgLy8gMjEuMS4yLjIgU3RyaW5nLmZyb21Db2RlUG9pbnQoLi4uY29kZVBvaW50cylcclxuICBmcm9tQ29kZVBvaW50OiBmdW5jdGlvbih4KXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xyXG4gICAgdmFyIHJlcyA9IFtdXHJcbiAgICAgICwgbGVuID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAsIGkgICA9IDBcclxuICAgICAgLCBjb2RlO1xyXG4gICAgd2hpbGUobGVuID4gaSl7XHJcbiAgICAgIGNvZGUgPSArYXJndW1lbnRzW2krK107XHJcbiAgICAgIGlmKHRvSW5kZXgoY29kZSwgMHgxMGZmZmYpICE9PSBjb2RlKXRocm93IFJhbmdlRXJyb3IoY29kZSArICcgaXMgbm90IGEgdmFsaWQgY29kZSBwb2ludCcpO1xyXG4gICAgICByZXMucHVzaChjb2RlIDwgMHgxMDAwMFxyXG4gICAgICAgID8gZnJvbUNoYXJDb2RlKGNvZGUpXHJcbiAgICAgICAgOiBmcm9tQ2hhckNvZGUoKChjb2RlIC09IDB4MTAwMDApID4+IDEwKSArIDB4ZDgwMCwgY29kZSAlIDB4NDAwICsgMHhkYzAwKVxyXG4gICAgICApO1xyXG4gICAgfSByZXR1cm4gcmVzLmpvaW4oJycpO1xyXG4gIH1cclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCBjb2YgID0gcmVxdWlyZSgnLi8kLmNvZicpXHJcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG5cclxuJGRlZigkZGVmLlAsICdTdHJpbmcnLCB7XHJcbiAgLy8gMjEuMS4zLjcgU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlcyhzZWFyY2hTdHJpbmcsIHBvc2l0aW9uID0gMClcclxuICBpbmNsdWRlczogZnVuY3Rpb24oc2VhcmNoU3RyaW5nIC8qLCBwb3NpdGlvbiA9IDAgKi8pe1xyXG4gICAgaWYoY29mKHNlYXJjaFN0cmluZykgPT0gJ1JlZ0V4cCcpdGhyb3cgVHlwZUVycm9yKCk7XHJcbiAgICByZXR1cm4gISF+U3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSkuaW5kZXhPZihzZWFyY2hTdHJpbmcsIGFyZ3VtZW50c1sxXSk7XHJcbiAgfVxyXG59KTsiLCJ2YXIgc2V0ICAgPSByZXF1aXJlKCcuLyQnKS5zZXRcclxuICAsIGF0ICAgID0gcmVxdWlyZSgnLi8kLnN0cmluZy1hdCcpKHRydWUpXHJcbiAgLCBJVEVSICA9IHJlcXVpcmUoJy4vJC51aWQnKS5zYWZlKCdpdGVyJylcclxuICAsICRpdGVyID0gcmVxdWlyZSgnLi8kLml0ZXInKVxyXG4gICwgc3RlcCAgPSAkaXRlci5zdGVwO1xyXG5cclxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxyXG4kaXRlci5zdGQoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xyXG4gIHNldCh0aGlzLCBJVEVSLCB7bzogU3RyaW5nKGl0ZXJhdGVkKSwgaTogMH0pO1xyXG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXHJcbn0sIGZ1bmN0aW9uKCl7XHJcbiAgdmFyIGl0ZXIgID0gdGhpc1tJVEVSXVxyXG4gICAgLCBPICAgICA9IGl0ZXIub1xyXG4gICAgLCBpbmRleCA9IGl0ZXIuaVxyXG4gICAgLCBwb2ludDtcclxuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4gc3RlcCgxKTtcclxuICBwb2ludCA9IGF0LmNhbGwoTywgaW5kZXgpO1xyXG4gIGl0ZXIuaSArPSBwb2ludC5sZW5ndGg7XHJcbiAgcmV0dXJuIHN0ZXAoMCwgcG9pbnQpO1xyXG59KTsiLCJ2YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG5cclxuJGRlZigkZGVmLlMsICdTdHJpbmcnLCB7XHJcbiAgLy8gMjEuMS4yLjQgU3RyaW5nLnJhdyhjYWxsU2l0ZSwgLi4uc3Vic3RpdHV0aW9ucylcclxuICByYXc6IGZ1bmN0aW9uKGNhbGxTaXRlKXtcclxuICAgIHZhciByYXcgPSAkLnRvT2JqZWN0KGNhbGxTaXRlLnJhdylcclxuICAgICAgLCBsZW4gPSAkLnRvTGVuZ3RoKHJhdy5sZW5ndGgpXHJcbiAgICAgICwgc2xuID0gYXJndW1lbnRzLmxlbmd0aFxyXG4gICAgICAsIHJlcyA9IFtdXHJcbiAgICAgICwgaSAgID0gMDtcclxuICAgIHdoaWxlKGxlbiA+IGkpe1xyXG4gICAgICByZXMucHVzaChTdHJpbmcocmF3W2krK10pKTtcclxuICAgICAgaWYoaSA8IHNsbilyZXMucHVzaChTdHJpbmcoYXJndW1lbnRzW2ldKSk7XHJcbiAgICB9IHJldHVybiByZXMuam9pbignJyk7XHJcbiAgfVxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcblxyXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjMuMTMgU3RyaW5nLnByb3RvdHlwZS5yZXBlYXQoY291bnQpXHJcbiAgcmVwZWF0OiBmdW5jdGlvbihjb3VudCl7XHJcbiAgICB2YXIgc3RyID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgLCByZXMgPSAnJ1xyXG4gICAgICAsIG4gICA9ICQudG9JbnRlZ2VyKGNvdW50KTtcclxuICAgIGlmKG4gPCAwIHx8IG4gPT0gSW5maW5pdHkpdGhyb3cgUmFuZ2VFcnJvcihcIkNvdW50IGNhbid0IGJlIG5lZ2F0aXZlXCIpO1xyXG4gICAgZm9yKDtuID4gMDsgKG4gPj4+PSAxKSAmJiAoc3RyICs9IHN0cikpaWYobiAmIDEpcmVzICs9IHN0cjtcclxuICAgIHJldHVybiByZXM7XHJcbiAgfVxyXG59KTsiLCIndXNlIHN0cmljdCc7XHJcbnZhciAkICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIGNvZiAgPSByZXF1aXJlKCcuLyQuY29mJylcclxuICAsICRkZWYgPSByZXF1aXJlKCcuLyQuZGVmJyk7XHJcblxyXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcclxuICAvLyAyMS4xLjMuMTggU3RyaW5nLnByb3RvdHlwZS5zdGFydHNXaXRoKHNlYXJjaFN0cmluZyBbLCBwb3NpdGlvbiBdKVxyXG4gIHN0YXJ0c1dpdGg6IGZ1bmN0aW9uKHNlYXJjaFN0cmluZyAvKiwgcG9zaXRpb24gPSAwICovKXtcclxuICAgIGlmKGNvZihzZWFyY2hTdHJpbmcpID09ICdSZWdFeHAnKXRocm93IFR5cGVFcnJvcigpO1xyXG4gICAgdmFyIHRoYXQgID0gU3RyaW5nKCQuYXNzZXJ0RGVmaW5lZCh0aGlzKSlcclxuICAgICAgLCBpbmRleCA9ICQudG9MZW5ndGgoTWF0aC5taW4oYXJndW1lbnRzWzFdLCB0aGF0Lmxlbmd0aCkpO1xyXG4gICAgc2VhcmNoU3RyaW5nICs9ICcnO1xyXG4gICAgcmV0dXJuIHRoYXQuc2xpY2UoaW5kZXgsIGluZGV4ICsgc2VhcmNoU3RyaW5nLmxlbmd0aCkgPT09IHNlYXJjaFN0cmluZztcclxuICB9XHJcbn0pOyIsIid1c2Ugc3RyaWN0JztcclxuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxyXG52YXIgJCAgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgc2V0VGFnICAgPSByZXF1aXJlKCcuLyQuY29mJykuc2V0XHJcbiAgLCB1aWQgICAgICA9IHJlcXVpcmUoJy4vJC51aWQnKVxyXG4gICwgJGRlZiAgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGtleU9mICAgID0gcmVxdWlyZSgnLi8kLmtleW9mJylcclxuICAsIGhhcyAgICAgID0gJC5oYXNcclxuICAsIGhpZGUgICAgID0gJC5oaWRlXHJcbiAgLCBnZXROYW1lcyA9ICQuZ2V0TmFtZXNcclxuICAsIHRvT2JqZWN0ID0gJC50b09iamVjdFxyXG4gICwgU3ltYm9sICAgPSAkLmcuU3ltYm9sXHJcbiAgLCBCYXNlICAgICA9IFN5bWJvbFxyXG4gICwgc2V0dGVyICAgPSBmYWxzZVxyXG4gICwgVEFHICAgICAgPSB1aWQuc2FmZSgndGFnJylcclxuICAsIFN5bWJvbFJlZ2lzdHJ5ID0ge31cclxuICAsIEFsbFN5bWJvbHMgICAgID0ge307XHJcblxyXG5mdW5jdGlvbiB3cmFwKHRhZyl7XHJcbiAgdmFyIHN5bSA9IEFsbFN5bWJvbHNbdGFnXSA9ICQuc2V0KCQuY3JlYXRlKFN5bWJvbC5wcm90b3R5cGUpLCBUQUcsIHRhZyk7XHJcbiAgJC5ERVNDICYmIHNldHRlciAmJiAkLnNldERlc2MoT2JqZWN0LnByb3RvdHlwZSwgdGFnLCB7XHJcbiAgICBjb25maWd1cmFibGU6IHRydWUsXHJcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgICAgaGlkZSh0aGlzLCB0YWcsIHZhbHVlKTtcclxuICAgIH1cclxuICB9KTtcclxuICByZXR1cm4gc3ltO1xyXG59XHJcblxyXG4vLyAxOS40LjEuMSBTeW1ib2woW2Rlc2NyaXB0aW9uXSlcclxuaWYoISQuaXNGdW5jdGlvbihTeW1ib2wpKXtcclxuICBTeW1ib2wgPSBmdW5jdGlvbihkZXNjcmlwdGlvbil7XHJcbiAgICBpZih0aGlzIGluc3RhbmNlb2YgU3ltYm9sKXRocm93IFR5cGVFcnJvcignU3ltYm9sIGlzIG5vdCBhIGNvbnN0cnVjdG9yJyk7XHJcbiAgICByZXR1cm4gd3JhcCh1aWQoZGVzY3JpcHRpb24pKTtcclxuICB9O1xyXG4gIGhpZGUoU3ltYm9sLnByb3RvdHlwZSwgJ3RvU3RyaW5nJywgZnVuY3Rpb24oKXtcclxuICAgIHJldHVybiB0aGlzW1RBR107XHJcbiAgfSk7XHJcbn1cclxuJGRlZigkZGVmLkcgKyAkZGVmLlcsIHtTeW1ib2w6IFN5bWJvbH0pO1xyXG5cclxudmFyIHN5bWJvbFN0YXRpY3MgPSB7XHJcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXHJcbiAgJ2Zvcic6IGZ1bmN0aW9uKGtleSl7XHJcbiAgICByZXR1cm4gaGFzKFN5bWJvbFJlZ2lzdHJ5LCBrZXkgKz0gJycpXHJcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxyXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSBTeW1ib2woa2V5KTtcclxuICB9LFxyXG4gIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxyXG4gIGtleUZvcjogZnVuY3Rpb24oa2V5KXtcclxuICAgIHJldHVybiBrZXlPZihTeW1ib2xSZWdpc3RyeSwga2V5KTtcclxuICB9LFxyXG4gIHB1cmU6IHVpZC5zYWZlLFxyXG4gIHNldDogJC5zZXQsXHJcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSB0cnVlOyB9LFxyXG4gIHVzZVNpbXBsZTogZnVuY3Rpb24oKXsgc2V0dGVyID0gZmFsc2U7IH1cclxufTtcclxuLy8gMTkuNC4yLjIgU3ltYm9sLmhhc0luc3RhbmNlXHJcbi8vIDE5LjQuMi4zIFN5bWJvbC5pc0NvbmNhdFNwcmVhZGFibGVcclxuLy8gMTkuNC4yLjQgU3ltYm9sLml0ZXJhdG9yXHJcbi8vIDE5LjQuMi42IFN5bWJvbC5tYXRjaFxyXG4vLyAxOS40LjIuOCBTeW1ib2wucmVwbGFjZVxyXG4vLyAxOS40LjIuOSBTeW1ib2wuc2VhcmNoXHJcbi8vIDE5LjQuMi4xMCBTeW1ib2wuc3BlY2llc1xyXG4vLyAxOS40LjIuMTEgU3ltYm9sLnNwbGl0XHJcbi8vIDE5LjQuMi4xMiBTeW1ib2wudG9QcmltaXRpdmVcclxuLy8gMTkuNC4yLjEzIFN5bWJvbC50b1N0cmluZ1RhZ1xyXG4vLyAxOS40LjIuMTQgU3ltYm9sLnVuc2NvcGFibGVzXHJcbiQuZWFjaC5jYWxsKChcclxuICAgICdoYXNJbnN0YW5jZSxpc0NvbmNhdFNwcmVhZGFibGUsaXRlcmF0b3IsbWF0Y2gscmVwbGFjZSxzZWFyY2gsJyArXHJcbiAgICAnc3BlY2llcyxzcGxpdCx0b1ByaW1pdGl2ZSx0b1N0cmluZ1RhZyx1bnNjb3BhYmxlcydcclxuICApLnNwbGl0KCcsJyksIGZ1bmN0aW9uKGl0KXtcclxuICAgIHZhciBzeW0gPSByZXF1aXJlKCcuLyQud2tzJykoaXQpO1xyXG4gICAgc3ltYm9sU3RhdGljc1tpdF0gPSBTeW1ib2wgPT09IEJhc2UgPyBzeW0gOiB3cmFwKHN5bSk7XHJcbiAgfVxyXG4pO1xyXG5cclxuc2V0dGVyID0gdHJ1ZTtcclxuXHJcbiRkZWYoJGRlZi5TLCAnU3ltYm9sJywgc3ltYm9sU3RhdGljcyk7XHJcblxyXG4kZGVmKCRkZWYuUyArICRkZWYuRiAqIChTeW1ib2wgIT0gQmFzZSksICdPYmplY3QnLCB7XHJcbiAgLy8gMTkuMS4yLjcgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcclxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiBmdW5jdGlvbihpdCl7XHJcbiAgICB2YXIgbmFtZXMgPSBnZXROYW1lcyh0b09iamVjdChpdCkpLCByZXN1bHQgPSBbXSwga2V5LCBpID0gMDtcclxuICAgIHdoaWxlKG5hbWVzLmxlbmd0aCA+IGkpaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pIHx8IHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH0sXHJcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxyXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogZnVuY3Rpb24oaXQpe1xyXG4gICAgdmFyIG5hbWVzID0gZ2V0TmFtZXModG9PYmplY3QoaXQpKSwgcmVzdWx0ID0gW10sIGtleSwgaSA9IDA7XHJcbiAgICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiByZXN1bHQucHVzaChBbGxTeW1ib2xzW2tleV0pO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcbn0pO1xyXG5cclxuc2V0VGFnKFN5bWJvbCwgJ1N5bWJvbCcpO1xyXG4vLyAyMC4yLjEuOSBNYXRoW0BAdG9TdHJpbmdUYWddXHJcbnNldFRhZyhNYXRoLCAnTWF0aCcsIHRydWUpO1xyXG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxyXG5zZXRUYWcoJC5nLkpTT04sICdKU09OJywgdHJ1ZSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG52YXIgJCAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIHdlYWsgICAgICA9IHJlcXVpcmUoJy4vJC5jb2xsZWN0aW9uLXdlYWsnKVxyXG4gICwgbGVha1N0b3JlID0gd2Vhay5sZWFrU3RvcmVcclxuICAsIElEICAgICAgICA9IHdlYWsuSURcclxuICAsIFdFQUsgICAgICA9IHdlYWsuV0VBS1xyXG4gICwgaGFzICAgICAgID0gJC5oYXNcclxuICAsIGlzT2JqZWN0ICA9ICQuaXNPYmplY3RcclxuICAsIGlzRnJvemVuICA9IE9iamVjdC5pc0Zyb3plbiB8fCAkLmNvcmUuT2JqZWN0LmlzRnJvemVuXHJcbiAgLCB0bXAgICAgICAgPSB7fTtcclxuXHJcbi8vIDIzLjMgV2Vha01hcCBPYmplY3RzXHJcbnZhciBXZWFrTWFwID0gcmVxdWlyZSgnLi8kLmNvbGxlY3Rpb24nKSgnV2Vha01hcCcsIHtcclxuICAvLyAyMy4zLjMuMyBXZWFrTWFwLnByb3RvdHlwZS5nZXQoa2V5KVxyXG4gIGdldDogZnVuY3Rpb24oa2V5KXtcclxuICAgIGlmKGlzT2JqZWN0KGtleSkpe1xyXG4gICAgICBpZihpc0Zyb3plbihrZXkpKXJldHVybiBsZWFrU3RvcmUodGhpcykuZ2V0KGtleSk7XHJcbiAgICAgIGlmKGhhcyhrZXksIFdFQUspKXJldHVybiBrZXlbV0VBS11bdGhpc1tJRF1dO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLy8gMjMuMy4zLjUgV2Vha01hcC5wcm90b3R5cGUuc2V0KGtleSwgdmFsdWUpXHJcbiAgc2V0OiBmdW5jdGlvbihrZXksIHZhbHVlKXtcclxuICAgIHJldHVybiB3ZWFrLmRlZih0aGlzLCBrZXksIHZhbHVlKTtcclxuICB9XHJcbn0sIHdlYWssIHRydWUsIHRydWUpO1xyXG5cclxuLy8gSUUxMSBXZWFrTWFwIGZyb3plbiBrZXlzIGZpeFxyXG5pZigkLkZXICYmIG5ldyBXZWFrTWFwKCkuc2V0KChPYmplY3QuZnJlZXplIHx8IE9iamVjdCkodG1wKSwgNykuZ2V0KHRtcCkgIT0gNyl7XHJcbiAgJC5lYWNoLmNhbGwoWydkZWxldGUnLCAnaGFzJywgJ2dldCcsICdzZXQnXSwgZnVuY3Rpb24oa2V5KXtcclxuICAgIHZhciBtZXRob2QgPSBXZWFrTWFwLnByb3RvdHlwZVtrZXldO1xyXG4gICAgV2Vha01hcC5wcm90b3R5cGVba2V5XSA9IGZ1bmN0aW9uKGEsIGIpe1xyXG4gICAgICAvLyBzdG9yZSBmcm96ZW4gb2JqZWN0cyBvbiBsZWFreSBtYXBcclxuICAgICAgaWYoaXNPYmplY3QoYSkgJiYgaXNGcm96ZW4oYSkpe1xyXG4gICAgICAgIHZhciByZXN1bHQgPSBsZWFrU3RvcmUodGhpcylba2V5XShhLCBiKTtcclxuICAgICAgICByZXR1cm4ga2V5ID09ICdzZXQnID8gdGhpcyA6IHJlc3VsdDtcclxuICAgICAgLy8gc3RvcmUgYWxsIHRoZSByZXN0IG9uIG5hdGl2ZSB3ZWFrbWFwXHJcbiAgICAgIH0gcmV0dXJuIG1ldGhvZC5jYWxsKHRoaXMsIGEsIGIpO1xyXG4gICAgfTtcclxuICB9KTtcclxufSIsIid1c2Ugc3RyaWN0JztcclxudmFyIHdlYWsgPSByZXF1aXJlKCcuLyQuY29sbGVjdGlvbi13ZWFrJyk7XHJcblxyXG4vLyAyMy40IFdlYWtTZXQgT2JqZWN0c1xyXG5yZXF1aXJlKCcuLyQuY29sbGVjdGlvbicpKCdXZWFrU2V0Jywge1xyXG4gIC8vIDIzLjQuMy4xIFdlYWtTZXQucHJvdG90eXBlLmFkZCh2YWx1ZSlcclxuICBhZGQ6IGZ1bmN0aW9uKHZhbHVlKXtcclxuICAgIHJldHVybiB3ZWFrLmRlZih0aGlzLCB2YWx1ZSwgdHJ1ZSk7XHJcbiAgfVxyXG59LCB3ZWFrLCBmYWxzZSwgdHJ1ZSk7IiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL2RvbWVuaWMvQXJyYXkucHJvdG90eXBlLmluY2x1ZGVzXHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUCwgJ0FycmF5Jywge1xyXG4gIGluY2x1ZGVzOiByZXF1aXJlKCcuLyQuYXJyYXktaW5jbHVkZXMnKSh0cnVlKVxyXG59KTtcclxucmVxdWlyZSgnLi8kLnVuc2NvcGUnKSgnaW5jbHVkZXMnKTsiLCIvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9XZWJSZWZsZWN0aW9uLzkzNTM3ODFcclxudmFyICQgICAgICAgPSByZXF1aXJlKCcuLyQnKVxyXG4gICwgJGRlZiAgICA9IHJlcXVpcmUoJy4vJC5kZWYnKVxyXG4gICwgb3duS2V5cyA9IHJlcXVpcmUoJy4vJC5vd24ta2V5cycpO1xyXG5cclxuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7XHJcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yczogZnVuY3Rpb24ob2JqZWN0KXtcclxuICAgIHZhciBPICAgICAgPSAkLnRvT2JqZWN0KG9iamVjdClcclxuICAgICAgLCByZXN1bHQgPSB7fTtcclxuICAgICQuZWFjaC5jYWxsKG93bktleXMoTyksIGZ1bmN0aW9uKGtleSl7XHJcbiAgICAgICQuc2V0RGVzYyhyZXN1bHQsIGtleSwgJC5kZXNjKDAsICQuZ2V0RGVzYyhPLCBrZXkpKSk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfVxyXG59KTsiLCIvLyBodHRwOi8vZ29vLmdsL1hrQnJqRFxyXG52YXIgJCAgICA9IHJlcXVpcmUoJy4vJCcpXHJcbiAgLCAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG5mdW5jdGlvbiBjcmVhdGVPYmplY3RUb0FycmF5KGlzRW50cmllcyl7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uKG9iamVjdCl7XHJcbiAgICB2YXIgTyAgICAgID0gJC50b09iamVjdChvYmplY3QpXHJcbiAgICAgICwga2V5cyAgID0gJC5nZXRLZXlzKG9iamVjdClcclxuICAgICAgLCBsZW5ndGggPSBrZXlzLmxlbmd0aFxyXG4gICAgICAsIGkgICAgICA9IDBcclxuICAgICAgLCByZXN1bHQgPSBBcnJheShsZW5ndGgpXHJcbiAgICAgICwga2V5O1xyXG4gICAgaWYoaXNFbnRyaWVzKXdoaWxlKGxlbmd0aCA+IGkpcmVzdWx0W2ldID0gW2tleSA9IGtleXNbaSsrXSwgT1trZXldXTtcclxuICAgIGVsc2Ugd2hpbGUobGVuZ3RoID4gaSlyZXN1bHRbaV0gPSBPW2tleXNbaSsrXV07XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH07XHJcbn1cclxuJGRlZigkZGVmLlMsICdPYmplY3QnLCB7XHJcbiAgdmFsdWVzOiAgY3JlYXRlT2JqZWN0VG9BcnJheShmYWxzZSksXHJcbiAgZW50cmllczogY3JlYXRlT2JqZWN0VG9BcnJheSh0cnVlKVxyXG59KTsiLCIvLyBodHRwczovL2dpc3QuZ2l0aHViLmNvbS9rYW5nYXgvOTY5ODEwMFxyXG52YXIgJGRlZiA9IHJlcXVpcmUoJy4vJC5kZWYnKTtcclxuJGRlZigkZGVmLlMsICdSZWdFeHAnLCB7XHJcbiAgZXNjYXBlOiByZXF1aXJlKCcuLyQucmVwbGFjZXInKSgvKFtcXFxcXFwtW1xcXXt9KCkqKz8uLF4kfF0pL2csICdcXFxcJDEnLCB0cnVlKVxyXG59KTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vbWF0aGlhc2J5bmVucy9TdHJpbmcucHJvdG90eXBlLmF0XHJcbnZhciAkZGVmID0gcmVxdWlyZSgnLi8kLmRlZicpO1xyXG4kZGVmKCRkZWYuUCwgJ1N0cmluZycsIHtcclxuICBhdDogcmVxdWlyZSgnLi8kLnN0cmluZy1hdCcpKHRydWUpXHJcbn0pOyIsIi8vIEphdmFTY3JpcHQgMS42IC8gU3RyYXdtYW4gYXJyYXkgc3RhdGljcyBzaGltXHJcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGNvcmUgICAgPSAkLmNvcmVcclxuICAsIHN0YXRpY3MgPSB7fTtcclxuZnVuY3Rpb24gc2V0U3RhdGljcyhrZXlzLCBsZW5ndGgpe1xyXG4gICQuZWFjaC5jYWxsKGtleXMuc3BsaXQoJywnKSwgZnVuY3Rpb24oa2V5KXtcclxuICAgIGlmKGxlbmd0aCA9PSB1bmRlZmluZWQgJiYga2V5IGluIGNvcmUuQXJyYXkpc3RhdGljc1trZXldID0gY29yZS5BcnJheVtrZXldO1xyXG4gICAgZWxzZSBpZihrZXkgaW4gW10pc3RhdGljc1trZXldID0gcmVxdWlyZSgnLi8kLmN0eCcpKEZ1bmN0aW9uLmNhbGwsIFtdW2tleV0sIGxlbmd0aCk7XHJcbiAgfSk7XHJcbn1cclxuc2V0U3RhdGljcygncG9wLHJldmVyc2Usc2hpZnQsa2V5cyx2YWx1ZXMsZW50cmllcycsIDEpO1xyXG5zZXRTdGF0aWNzKCdpbmRleE9mLGV2ZXJ5LHNvbWUsZm9yRWFjaCxtYXAsZmlsdGVyLGZpbmQsZmluZEluZGV4LGluY2x1ZGVzJywgMyk7XHJcbnNldFN0YXRpY3MoJ2pvaW4sc2xpY2UsY29uY2F0LHB1c2gsc3BsaWNlLHVuc2hpZnQsc29ydCxsYXN0SW5kZXhPZiwnICtcclxuICAgICAgICAgICAncmVkdWNlLHJlZHVjZVJpZ2h0LGNvcHlXaXRoaW4sZmlsbCx0dXJuJyk7XHJcbiRkZWYoJGRlZi5TLCAnQXJyYXknLCBzdGF0aWNzKTsiLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xyXG52YXIgJCAgICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsIEl0ZXJhdG9ycyA9IHJlcXVpcmUoJy4vJC5pdGVyJykuSXRlcmF0b3JzXHJcbiAgLCBJVEVSQVRPUiAgPSByZXF1aXJlKCcuLyQud2tzJykoJ2l0ZXJhdG9yJylcclxuICAsIE5vZGVMaXN0ICA9ICQuZy5Ob2RlTGlzdDtcclxuaWYoJC5GVyAmJiBOb2RlTGlzdCAmJiAhKElURVJBVE9SIGluIE5vZGVMaXN0LnByb3RvdHlwZSkpe1xyXG4gICQuaGlkZShOb2RlTGlzdC5wcm90b3R5cGUsIElURVJBVE9SLCBJdGVyYXRvcnMuQXJyYXkpO1xyXG59XHJcbkl0ZXJhdG9ycy5Ob2RlTGlzdCA9IEl0ZXJhdG9ycy5BcnJheTsiLCJ2YXIgJGRlZiAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsICR0YXNrID0gcmVxdWlyZSgnLi8kLnRhc2snKTtcclxuJGRlZigkZGVmLkcgKyAkZGVmLkIsIHtcclxuICBzZXRJbW1lZGlhdGU6ICAgJHRhc2suc2V0LFxyXG4gIGNsZWFySW1tZWRpYXRlOiAkdGFzay5jbGVhclxyXG59KTsiLCIvLyBpZTktIHNldFRpbWVvdXQgJiBzZXRJbnRlcnZhbCBhZGRpdGlvbmFsIHBhcmFtZXRlcnMgZml4XHJcbnZhciAkICAgICAgID0gcmVxdWlyZSgnLi8kJylcclxuICAsICRkZWYgICAgPSByZXF1aXJlKCcuLyQuZGVmJylcclxuICAsIGludm9rZSAgPSByZXF1aXJlKCcuLyQuaW52b2tlJylcclxuICAsIHBhcnRpYWwgPSByZXF1aXJlKCcuLyQucGFydGlhbCcpXHJcbiAgLCBNU0lFICAgID0gISEkLmcubmF2aWdhdG9yICYmIC9NU0lFIC5cXC4vLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7IC8vIDwtIGRpcnR5IGllOS0gY2hlY2tcclxuZnVuY3Rpb24gd3JhcChzZXQpe1xyXG4gIHJldHVybiBNU0lFID8gZnVuY3Rpb24oZm4sIHRpbWUgLyosIC4uLmFyZ3MgKi8pe1xyXG4gICAgcmV0dXJuIHNldChpbnZva2UoXHJcbiAgICAgIHBhcnRpYWwsXHJcbiAgICAgIFtdLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKSxcclxuICAgICAgJC5pc0Z1bmN0aW9uKGZuKSA/IGZuIDogRnVuY3Rpb24oZm4pXHJcbiAgICApLCB0aW1lKTtcclxuICB9IDogc2V0O1xyXG59XHJcbiRkZWYoJGRlZi5HICsgJGRlZi5CICsgJGRlZi5GICogTVNJRSwge1xyXG4gIHNldFRpbWVvdXQ6ICB3cmFwKCQuZy5zZXRUaW1lb3V0KSxcclxuICBzZXRJbnRlcnZhbDogd3JhcCgkLmcuc2V0SW50ZXJ2YWwpXHJcbn0pOyIsInJlcXVpcmUoJy4vbW9kdWxlcy9lczUnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zeW1ib2wnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LmlzJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYub2JqZWN0LnN0YXRpY3MtYWNjZXB0LXByaW1pdGl2ZXMnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5mdW5jdGlvbi5uYW1lJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubnVtYmVyLmNvbnN0cnVjdG9yJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubnVtYmVyLnN0YXRpY3MnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5tYXRoJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLmZyb20tY29kZS1wb2ludCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5yYXcnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3InKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuY29kZS1wb2ludC1hdCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnN0cmluZy5lbmRzLXdpdGgnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcuaW5jbHVkZXMnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5zdHJpbmcucmVwZWF0Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc3RyaW5nLnN0YXJ0cy13aXRoJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuZnJvbScpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5Lm9mJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3InKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5zcGVjaWVzJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuY29weS13aXRoaW4nKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5hcnJheS5maWxsJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuYXJyYXkuZmluZCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LmFycmF5LmZpbmQtaW5kZXgnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5yZWdleHAnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi5wcm9taXNlJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYubWFwJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYuc2V0Jyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9lczYud2Vhay1tYXAnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNi53ZWFrLXNldCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM2LnJlZmxlY3QnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5hcnJheS5pbmNsdWRlcycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LnN0cmluZy5hdCcpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3LnJlZ2V4cC5lc2NhcGUnKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2VzNy5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9ycycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvZXM3Lm9iamVjdC50by1hcnJheScpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvanMuYXJyYXkuc3RhdGljcycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvd2ViLnRpbWVycycpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvd2ViLmltbWVkaWF0ZScpO1xyXG5yZXF1aXJlKCcuL21vZHVsZXMvd2ViLmRvbS5pdGVyYWJsZScpO1xyXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbW9kdWxlcy8kJykuY29yZTsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxNCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBodHRwczovL3Jhdy5naXRodWIuY29tL2ZhY2Vib29rL3JlZ2VuZXJhdG9yL21hc3Rlci9MSUNFTlNFIGZpbGUuIEFuXG4gKiBhZGRpdGlvbmFsIGdyYW50IG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW5cbiAqIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqL1xuXG4hKGZ1bmN0aW9uKGdsb2JhbCkge1xuICBcInVzZSBzdHJpY3RcIjtcblxuICB2YXIgaGFzT3duID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcbiAgdmFyIHVuZGVmaW5lZDsgLy8gTW9yZSBjb21wcmVzc2libGUgdGhhbiB2b2lkIDAuXG4gIHZhciBpdGVyYXRvclN5bWJvbCA9XG4gICAgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciB8fCBcIkBAaXRlcmF0b3JcIjtcblxuICB2YXIgaW5Nb2R1bGUgPSB0eXBlb2YgbW9kdWxlID09PSBcIm9iamVjdFwiO1xuICB2YXIgcnVudGltZSA9IGdsb2JhbC5yZWdlbmVyYXRvclJ1bnRpbWU7XG4gIGlmIChydW50aW1lKSB7XG4gICAgaWYgKGluTW9kdWxlKSB7XG4gICAgICAvLyBJZiByZWdlbmVyYXRvclJ1bnRpbWUgaXMgZGVmaW5lZCBnbG9iYWxseSBhbmQgd2UncmUgaW4gYSBtb2R1bGUsXG4gICAgICAvLyBtYWtlIHRoZSBleHBvcnRzIG9iamVjdCBpZGVudGljYWwgdG8gcmVnZW5lcmF0b3JSdW50aW1lLlxuICAgICAgbW9kdWxlLmV4cG9ydHMgPSBydW50aW1lO1xuICAgIH1cbiAgICAvLyBEb24ndCBib3RoZXIgZXZhbHVhdGluZyB0aGUgcmVzdCBvZiB0aGlzIGZpbGUgaWYgdGhlIHJ1bnRpbWUgd2FzXG4gICAgLy8gYWxyZWFkeSBkZWZpbmVkIGdsb2JhbGx5LlxuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIERlZmluZSB0aGUgcnVudGltZSBnbG9iYWxseSAoYXMgZXhwZWN0ZWQgYnkgZ2VuZXJhdGVkIGNvZGUpIGFzIGVpdGhlclxuICAvLyBtb2R1bGUuZXhwb3J0cyAoaWYgd2UncmUgaW4gYSBtb2R1bGUpIG9yIGEgbmV3LCBlbXB0eSBvYmplY3QuXG4gIHJ1bnRpbWUgPSBnbG9iYWwucmVnZW5lcmF0b3JSdW50aW1lID0gaW5Nb2R1bGUgPyBtb2R1bGUuZXhwb3J0cyA6IHt9O1xuXG4gIGZ1bmN0aW9uIHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpIHtcbiAgICByZXR1cm4gbmV3IEdlbmVyYXRvcihpbm5lckZuLCBvdXRlckZuLCBzZWxmIHx8IG51bGwsIHRyeUxvY3NMaXN0IHx8IFtdKTtcbiAgfVxuICBydW50aW1lLndyYXAgPSB3cmFwO1xuXG4gIC8vIFRyeS9jYXRjaCBoZWxwZXIgdG8gbWluaW1pemUgZGVvcHRpbWl6YXRpb25zLiBSZXR1cm5zIGEgY29tcGxldGlvblxuICAvLyByZWNvcmQgbGlrZSBjb250ZXh0LnRyeUVudHJpZXNbaV0uY29tcGxldGlvbi4gVGhpcyBpbnRlcmZhY2UgY291bGRcbiAgLy8gaGF2ZSBiZWVuIChhbmQgd2FzIHByZXZpb3VzbHkpIGRlc2lnbmVkIHRvIHRha2UgYSBjbG9zdXJlIHRvIGJlXG4gIC8vIGludm9rZWQgd2l0aG91dCBhcmd1bWVudHMsIGJ1dCBpbiBhbGwgdGhlIGNhc2VzIHdlIGNhcmUgYWJvdXQgd2VcbiAgLy8gYWxyZWFkeSBoYXZlIGFuIGV4aXN0aW5nIG1ldGhvZCB3ZSB3YW50IHRvIGNhbGwsIHNvIHRoZXJlJ3Mgbm8gbmVlZFxuICAvLyB0byBjcmVhdGUgYSBuZXcgZnVuY3Rpb24gb2JqZWN0LiBXZSBjYW4gZXZlbiBnZXQgYXdheSB3aXRoIGFzc3VtaW5nXG4gIC8vIHRoZSBtZXRob2QgdGFrZXMgZXhhY3RseSBvbmUgYXJndW1lbnQsIHNpbmNlIHRoYXQgaGFwcGVucyB0byBiZSB0cnVlXG4gIC8vIGluIGV2ZXJ5IGNhc2UsIHNvIHdlIGRvbid0IGhhdmUgdG8gdG91Y2ggdGhlIGFyZ3VtZW50cyBvYmplY3QuIFRoZVxuICAvLyBvbmx5IGFkZGl0aW9uYWwgYWxsb2NhdGlvbiByZXF1aXJlZCBpcyB0aGUgY29tcGxldGlvbiByZWNvcmQsIHdoaWNoXG4gIC8vIGhhcyBhIHN0YWJsZSBzaGFwZSBhbmQgc28gaG9wZWZ1bGx5IHNob3VsZCBiZSBjaGVhcCB0byBhbGxvY2F0ZS5cbiAgZnVuY3Rpb24gdHJ5Q2F0Y2goZm4sIG9iaiwgYXJnKSB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwibm9ybWFsXCIsIGFyZzogZm4uY2FsbChvYmosIGFyZykgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB7IHR5cGU6IFwidGhyb3dcIiwgYXJnOiBlcnIgfTtcbiAgICB9XG4gIH1cblxuICB2YXIgR2VuU3RhdGVTdXNwZW5kZWRTdGFydCA9IFwic3VzcGVuZGVkU3RhcnRcIjtcbiAgdmFyIEdlblN0YXRlU3VzcGVuZGVkWWllbGQgPSBcInN1c3BlbmRlZFlpZWxkXCI7XG4gIHZhciBHZW5TdGF0ZUV4ZWN1dGluZyA9IFwiZXhlY3V0aW5nXCI7XG4gIHZhciBHZW5TdGF0ZUNvbXBsZXRlZCA9IFwiY29tcGxldGVkXCI7XG5cbiAgLy8gUmV0dXJuaW5nIHRoaXMgb2JqZWN0IGZyb20gdGhlIGlubmVyRm4gaGFzIHRoZSBzYW1lIGVmZmVjdCBhc1xuICAvLyBicmVha2luZyBvdXQgb2YgdGhlIGRpc3BhdGNoIHN3aXRjaCBzdGF0ZW1lbnQuXG4gIHZhciBDb250aW51ZVNlbnRpbmVsID0ge307XG5cbiAgLy8gRHVtbXkgY29uc3RydWN0b3IgZnVuY3Rpb25zIHRoYXQgd2UgdXNlIGFzIHRoZSAuY29uc3RydWN0b3IgYW5kXG4gIC8vIC5jb25zdHJ1Y3Rvci5wcm90b3R5cGUgcHJvcGVydGllcyBmb3IgZnVuY3Rpb25zIHRoYXQgcmV0dXJuIEdlbmVyYXRvclxuICAvLyBvYmplY3RzLiBGb3IgZnVsbCBzcGVjIGNvbXBsaWFuY2UsIHlvdSBtYXkgd2lzaCB0byBjb25maWd1cmUgeW91clxuICAvLyBtaW5pZmllciBub3QgdG8gbWFuZ2xlIHRoZSBuYW1lcyBvZiB0aGVzZSB0d28gZnVuY3Rpb25zLlxuICBmdW5jdGlvbiBHZW5lcmF0b3JGdW5jdGlvbigpIHt9XG4gIGZ1bmN0aW9uIEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlKCkge31cblxuICB2YXIgR3AgPSBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5wcm90b3R5cGUgPSBHZW5lcmF0b3IucHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5wcm90b3R5cGUgPSBHcC5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uUHJvdG90eXBlO1xuICBHZW5lcmF0b3JGdW5jdGlvblByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IEdlbmVyYXRvckZ1bmN0aW9uO1xuICBHZW5lcmF0b3JGdW5jdGlvbi5kaXNwbGF5TmFtZSA9IFwiR2VuZXJhdG9yRnVuY3Rpb25cIjtcblxuICBydW50aW1lLmlzR2VuZXJhdG9yRnVuY3Rpb24gPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICB2YXIgY3RvciA9IHR5cGVvZiBnZW5GdW4gPT09IFwiZnVuY3Rpb25cIiAmJiBnZW5GdW4uY29uc3RydWN0b3I7XG4gICAgcmV0dXJuIGN0b3JcbiAgICAgID8gY3RvciA9PT0gR2VuZXJhdG9yRnVuY3Rpb24gfHxcbiAgICAgICAgLy8gRm9yIHRoZSBuYXRpdmUgR2VuZXJhdG9yRnVuY3Rpb24gY29uc3RydWN0b3IsIHRoZSBiZXN0IHdlIGNhblxuICAgICAgICAvLyBkbyBpcyB0byBjaGVjayBpdHMgLm5hbWUgcHJvcGVydHkuXG4gICAgICAgIChjdG9yLmRpc3BsYXlOYW1lIHx8IGN0b3IubmFtZSkgPT09IFwiR2VuZXJhdG9yRnVuY3Rpb25cIlxuICAgICAgOiBmYWxzZTtcbiAgfTtcblxuICBydW50aW1lLm1hcmsgPSBmdW5jdGlvbihnZW5GdW4pIHtcbiAgICBnZW5GdW4uX19wcm90b19fID0gR2VuZXJhdG9yRnVuY3Rpb25Qcm90b3R5cGU7XG4gICAgZ2VuRnVuLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoR3ApO1xuICAgIHJldHVybiBnZW5GdW47XG4gIH07XG5cbiAgcnVudGltZS5hc3luYyA9IGZ1bmN0aW9uKGlubmVyRm4sIG91dGVyRm4sIHNlbGYsIHRyeUxvY3NMaXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgdmFyIGdlbmVyYXRvciA9IHdyYXAoaW5uZXJGbiwgb3V0ZXJGbiwgc2VsZiwgdHJ5TG9jc0xpc3QpO1xuICAgICAgdmFyIGNhbGxOZXh0ID0gc3RlcC5iaW5kKGdlbmVyYXRvci5uZXh0KTtcbiAgICAgIHZhciBjYWxsVGhyb3cgPSBzdGVwLmJpbmQoZ2VuZXJhdG9yW1widGhyb3dcIl0pO1xuXG4gICAgICBmdW5jdGlvbiBzdGVwKGFyZykge1xuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2godGhpcywgbnVsbCwgYXJnKTtcbiAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICByZWplY3QocmVjb3JkLmFyZyk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGluZm8gPSByZWNvcmQuYXJnO1xuICAgICAgICBpZiAoaW5mby5kb25lKSB7XG4gICAgICAgICAgcmVzb2x2ZShpbmZvLnZhbHVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBQcm9taXNlLnJlc29sdmUoaW5mby52YWx1ZSkudGhlbihjYWxsTmV4dCwgY2FsbFRocm93KTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBjYWxsTmV4dCgpO1xuICAgIH0pO1xuICB9O1xuXG4gIGZ1bmN0aW9uIEdlbmVyYXRvcihpbm5lckZuLCBvdXRlckZuLCBzZWxmLCB0cnlMb2NzTGlzdCkge1xuICAgIHZhciBnZW5lcmF0b3IgPSBvdXRlckZuID8gT2JqZWN0LmNyZWF0ZShvdXRlckZuLnByb3RvdHlwZSkgOiB0aGlzO1xuICAgIHZhciBjb250ZXh0ID0gbmV3IENvbnRleHQodHJ5TG9jc0xpc3QpO1xuICAgIHZhciBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQ7XG5cbiAgICBmdW5jdGlvbiBpbnZva2UobWV0aG9kLCBhcmcpIHtcbiAgICAgIGlmIChzdGF0ZSA9PT0gR2VuU3RhdGVFeGVjdXRpbmcpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiR2VuZXJhdG9yIGlzIGFscmVhZHkgcnVubmluZ1wiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZUNvbXBsZXRlZCkge1xuICAgICAgICAvLyBCZSBmb3JnaXZpbmcsIHBlciAyNS4zLjMuMy4zIG9mIHRoZSBzcGVjOlxuICAgICAgICAvLyBodHRwczovL3Blb3BsZS5tb3ppbGxhLm9yZy9+am9yZW5kb3JmZi9lczYtZHJhZnQuaHRtbCNzZWMtZ2VuZXJhdG9ycmVzdW1lXG4gICAgICAgIHJldHVybiBkb25lUmVzdWx0KCk7XG4gICAgICB9XG5cbiAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIHZhciBkZWxlZ2F0ZSA9IGNvbnRleHQuZGVsZWdhdGU7XG4gICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgIHZhciByZWNvcmQgPSB0cnlDYXRjaChcbiAgICAgICAgICAgIGRlbGVnYXRlLml0ZXJhdG9yW21ldGhvZF0sXG4gICAgICAgICAgICBkZWxlZ2F0ZS5pdGVyYXRvcixcbiAgICAgICAgICAgIGFyZ1xuICAgICAgICAgICk7XG5cbiAgICAgICAgICBpZiAocmVjb3JkLnR5cGUgPT09IFwidGhyb3dcIikge1xuICAgICAgICAgICAgY29udGV4dC5kZWxlZ2F0ZSA9IG51bGw7XG5cbiAgICAgICAgICAgIC8vIExpa2UgcmV0dXJuaW5nIGdlbmVyYXRvci50aHJvdyh1bmNhdWdodCksIGJ1dCB3aXRob3V0IHRoZVxuICAgICAgICAgICAgLy8gb3ZlcmhlYWQgb2YgYW4gZXh0cmEgZnVuY3Rpb24gY2FsbC5cbiAgICAgICAgICAgIG1ldGhvZCA9IFwidGhyb3dcIjtcbiAgICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG5cbiAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIERlbGVnYXRlIGdlbmVyYXRvciByYW4gYW5kIGhhbmRsZWQgaXRzIG93biBleGNlcHRpb25zIHNvXG4gICAgICAgICAgLy8gcmVnYXJkbGVzcyBvZiB3aGF0IHRoZSBtZXRob2Qgd2FzLCB3ZSBjb250aW51ZSBhcyBpZiBpdCBpc1xuICAgICAgICAgIC8vIFwibmV4dFwiIHdpdGggYW4gdW5kZWZpbmVkIGFyZy5cbiAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgICB2YXIgaW5mbyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgaWYgKGluZm8uZG9uZSkge1xuICAgICAgICAgICAgY29udGV4dFtkZWxlZ2F0ZS5yZXN1bHROYW1lXSA9IGluZm8udmFsdWU7XG4gICAgICAgICAgICBjb250ZXh0Lm5leHQgPSBkZWxlZ2F0ZS5uZXh0TG9jO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlU3VzcGVuZGVkWWllbGQ7XG4gICAgICAgICAgICByZXR1cm4gaW5mbztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBjb250ZXh0LmRlbGVnYXRlID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChtZXRob2QgPT09IFwibmV4dFwiKSB7XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFN0YXJ0ICYmXG4gICAgICAgICAgICAgIHR5cGVvZiBhcmcgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICAgIC8vIGh0dHBzOi8vcGVvcGxlLm1vemlsbGEub3JnL35qb3JlbmRvcmZmL2VzNi1kcmFmdC5odG1sI3NlYy1nZW5lcmF0b3JyZXN1bWVcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXG4gICAgICAgICAgICAgIFwiYXR0ZW1wdCB0byBzZW5kIFwiICsgSlNPTi5zdHJpbmdpZnkoYXJnKSArIFwiIHRvIG5ld2Jvcm4gZ2VuZXJhdG9yXCJcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKHN0YXRlID09PSBHZW5TdGF0ZVN1c3BlbmRlZFlpZWxkKSB7XG4gICAgICAgICAgICBjb250ZXh0LnNlbnQgPSBhcmc7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRlbGV0ZSBjb250ZXh0LnNlbnQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IEdlblN0YXRlU3VzcGVuZGVkU3RhcnQpIHtcbiAgICAgICAgICAgIHN0YXRlID0gR2VuU3RhdGVDb21wbGV0ZWQ7XG4gICAgICAgICAgICB0aHJvdyBhcmc7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24oYXJnKSkge1xuICAgICAgICAgICAgLy8gSWYgdGhlIGRpc3BhdGNoZWQgZXhjZXB0aW9uIHdhcyBjYXVnaHQgYnkgYSBjYXRjaCBibG9jayxcbiAgICAgICAgICAgIC8vIHRoZW4gbGV0IHRoYXQgY2F0Y2ggYmxvY2sgaGFuZGxlIHRoZSBleGNlcHRpb24gbm9ybWFsbHkuXG4gICAgICAgICAgICBtZXRob2QgPSBcIm5leHRcIjtcbiAgICAgICAgICAgIGFyZyA9IHVuZGVmaW5lZDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09IFwicmV0dXJuXCIpIHtcbiAgICAgICAgICBjb250ZXh0LmFicnVwdChcInJldHVyblwiLCBhcmcpO1xuICAgICAgICB9XG5cbiAgICAgICAgc3RhdGUgPSBHZW5TdGF0ZUV4ZWN1dGluZztcblxuICAgICAgICB2YXIgcmVjb3JkID0gdHJ5Q2F0Y2goaW5uZXJGbiwgc2VsZiwgY29udGV4dCk7XG4gICAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIikge1xuICAgICAgICAgIC8vIElmIGFuIGV4Y2VwdGlvbiBpcyB0aHJvd24gZnJvbSBpbm5lckZuLCB3ZSBsZWF2ZSBzdGF0ZSA9PT1cbiAgICAgICAgICAvLyBHZW5TdGF0ZUV4ZWN1dGluZyBhbmQgbG9vcCBiYWNrIGZvciBhbm90aGVyIGludm9jYXRpb24uXG4gICAgICAgICAgc3RhdGUgPSBjb250ZXh0LmRvbmVcbiAgICAgICAgICAgID8gR2VuU3RhdGVDb21wbGV0ZWRcbiAgICAgICAgICAgIDogR2VuU3RhdGVTdXNwZW5kZWRZaWVsZDtcblxuICAgICAgICAgIHZhciBpbmZvID0ge1xuICAgICAgICAgICAgdmFsdWU6IHJlY29yZC5hcmcsXG4gICAgICAgICAgICBkb25lOiBjb250ZXh0LmRvbmVcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgaWYgKHJlY29yZC5hcmcgPT09IENvbnRpbnVlU2VudGluZWwpIHtcbiAgICAgICAgICAgIGlmIChjb250ZXh0LmRlbGVnYXRlICYmIG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgICAgLy8gRGVsaWJlcmF0ZWx5IGZvcmdldCB0aGUgbGFzdCBzZW50IHZhbHVlIHNvIHRoYXQgd2UgZG9uJ3RcbiAgICAgICAgICAgICAgLy8gYWNjaWRlbnRhbGx5IHBhc3MgaXQgb24gdG8gdGhlIGRlbGVnYXRlLlxuICAgICAgICAgICAgICBhcmcgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBpbmZvO1xuICAgICAgICAgIH1cblxuICAgICAgICB9IGVsc2UgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICBzdGF0ZSA9IEdlblN0YXRlQ29tcGxldGVkO1xuXG4gICAgICAgICAgaWYgKG1ldGhvZCA9PT0gXCJuZXh0XCIpIHtcbiAgICAgICAgICAgIGNvbnRleHQuZGlzcGF0Y2hFeGNlcHRpb24ocmVjb3JkLmFyZyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFyZyA9IHJlY29yZC5hcmc7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgZ2VuZXJhdG9yLm5leHQgPSBpbnZva2UuYmluZChnZW5lcmF0b3IsIFwibmV4dFwiKTtcbiAgICBnZW5lcmF0b3JbXCJ0aHJvd1wiXSA9IGludm9rZS5iaW5kKGdlbmVyYXRvciwgXCJ0aHJvd1wiKTtcbiAgICBnZW5lcmF0b3JbXCJyZXR1cm5cIl0gPSBpbnZva2UuYmluZChnZW5lcmF0b3IsIFwicmV0dXJuXCIpO1xuXG4gICAgcmV0dXJuIGdlbmVyYXRvcjtcbiAgfVxuXG4gIEdwW2l0ZXJhdG9yU3ltYm9sXSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xuXG4gIEdwLnRvU3RyaW5nID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIFwiW29iamVjdCBHZW5lcmF0b3JdXCI7XG4gIH07XG5cbiAgZnVuY3Rpb24gcHVzaFRyeUVudHJ5KGxvY3MpIHtcbiAgICB2YXIgZW50cnkgPSB7IHRyeUxvYzogbG9jc1swXSB9O1xuXG4gICAgaWYgKDEgaW4gbG9jcykge1xuICAgICAgZW50cnkuY2F0Y2hMb2MgPSBsb2NzWzFdO1xuICAgIH1cblxuICAgIGlmICgyIGluIGxvY3MpIHtcbiAgICAgIGVudHJ5LmZpbmFsbHlMb2MgPSBsb2NzWzJdO1xuICAgICAgZW50cnkuYWZ0ZXJMb2MgPSBsb2NzWzNdO1xuICAgIH1cblxuICAgIHRoaXMudHJ5RW50cmllcy5wdXNoKGVudHJ5KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlc2V0VHJ5RW50cnkoZW50cnkpIHtcbiAgICB2YXIgcmVjb3JkID0gZW50cnkuY29tcGxldGlvbiB8fCB7fTtcbiAgICByZWNvcmQudHlwZSA9IFwibm9ybWFsXCI7XG4gICAgZGVsZXRlIHJlY29yZC5hcmc7XG4gICAgZW50cnkuY29tcGxldGlvbiA9IHJlY29yZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIENvbnRleHQodHJ5TG9jc0xpc3QpIHtcbiAgICAvLyBUaGUgcm9vdCBlbnRyeSBvYmplY3QgKGVmZmVjdGl2ZWx5IGEgdHJ5IHN0YXRlbWVudCB3aXRob3V0IGEgY2F0Y2hcbiAgICAvLyBvciBhIGZpbmFsbHkgYmxvY2spIGdpdmVzIHVzIGEgcGxhY2UgdG8gc3RvcmUgdmFsdWVzIHRocm93biBmcm9tXG4gICAgLy8gbG9jYXRpb25zIHdoZXJlIHRoZXJlIGlzIG5vIGVuY2xvc2luZyB0cnkgc3RhdGVtZW50LlxuICAgIHRoaXMudHJ5RW50cmllcyA9IFt7IHRyeUxvYzogXCJyb290XCIgfV07XG4gICAgdHJ5TG9jc0xpc3QuZm9yRWFjaChwdXNoVHJ5RW50cnksIHRoaXMpO1xuICAgIHRoaXMucmVzZXQoKTtcbiAgfVxuXG4gIHJ1bnRpbWUua2V5cyA9IGZ1bmN0aW9uKG9iamVjdCkge1xuICAgIHZhciBrZXlzID0gW107XG4gICAgZm9yICh2YXIga2V5IGluIG9iamVjdCkge1xuICAgICAga2V5cy5wdXNoKGtleSk7XG4gICAgfVxuICAgIGtleXMucmV2ZXJzZSgpO1xuXG4gICAgLy8gUmF0aGVyIHRoYW4gcmV0dXJuaW5nIGFuIG9iamVjdCB3aXRoIGEgbmV4dCBtZXRob2QsIHdlIGtlZXBcbiAgICAvLyB0aGluZ3Mgc2ltcGxlIGFuZCByZXR1cm4gdGhlIG5leHQgZnVuY3Rpb24gaXRzZWxmLlxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgd2hpbGUgKGtleXMubGVuZ3RoKSB7XG4gICAgICAgIHZhciBrZXkgPSBrZXlzLnBvcCgpO1xuICAgICAgICBpZiAoa2V5IGluIG9iamVjdCkge1xuICAgICAgICAgIG5leHQudmFsdWUgPSBrZXk7XG4gICAgICAgICAgbmV4dC5kb25lID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVG8gYXZvaWQgY3JlYXRpbmcgYW4gYWRkaXRpb25hbCBvYmplY3QsIHdlIGp1c3QgaGFuZyB0aGUgLnZhbHVlXG4gICAgICAvLyBhbmQgLmRvbmUgcHJvcGVydGllcyBvZmYgdGhlIG5leHQgZnVuY3Rpb24gb2JqZWN0IGl0c2VsZi4gVGhpc1xuICAgICAgLy8gYWxzbyBlbnN1cmVzIHRoYXQgdGhlIG1pbmlmaWVyIHdpbGwgbm90IGFub255bWl6ZSB0aGUgZnVuY3Rpb24uXG4gICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuICAgICAgcmV0dXJuIG5leHQ7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiB2YWx1ZXMoaXRlcmFibGUpIHtcbiAgICBpZiAoaXRlcmFibGUpIHtcbiAgICAgIHZhciBpdGVyYXRvck1ldGhvZCA9IGl0ZXJhYmxlW2l0ZXJhdG9yU3ltYm9sXTtcbiAgICAgIGlmIChpdGVyYXRvck1ldGhvZCkge1xuICAgICAgICByZXR1cm4gaXRlcmF0b3JNZXRob2QuY2FsbChpdGVyYWJsZSk7XG4gICAgICB9XG5cbiAgICAgIGlmICh0eXBlb2YgaXRlcmFibGUubmV4dCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBpdGVyYWJsZTtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc05hTihpdGVyYWJsZS5sZW5ndGgpKSB7XG4gICAgICAgIHZhciBpID0gLTEsIG5leHQgPSBmdW5jdGlvbiBuZXh0KCkge1xuICAgICAgICAgIHdoaWxlICgrK2kgPCBpdGVyYWJsZS5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChoYXNPd24uY2FsbChpdGVyYWJsZSwgaSkpIHtcbiAgICAgICAgICAgICAgbmV4dC52YWx1ZSA9IGl0ZXJhYmxlW2ldO1xuICAgICAgICAgICAgICBuZXh0LmRvbmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbmV4dC52YWx1ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBuZXh0LmRvbmUgPSB0cnVlO1xuXG4gICAgICAgICAgcmV0dXJuIG5leHQ7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIG5leHQubmV4dCA9IG5leHQ7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gUmV0dXJuIGFuIGl0ZXJhdG9yIHdpdGggbm8gdmFsdWVzLlxuICAgIHJldHVybiB7IG5leHQ6IGRvbmVSZXN1bHQgfTtcbiAgfVxuICBydW50aW1lLnZhbHVlcyA9IHZhbHVlcztcblxuICBmdW5jdGlvbiBkb25lUmVzdWx0KCkge1xuICAgIHJldHVybiB7IHZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIENvbnRleHQucHJvdG90eXBlID0ge1xuICAgIGNvbnN0cnVjdG9yOiBDb250ZXh0LFxuXG4gICAgcmVzZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgdGhpcy5wcmV2ID0gMDtcbiAgICAgIHRoaXMubmV4dCA9IDA7XG4gICAgICB0aGlzLnNlbnQgPSB1bmRlZmluZWQ7XG4gICAgICB0aGlzLmRvbmUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVsZWdhdGUgPSBudWxsO1xuXG4gICAgICB0aGlzLnRyeUVudHJpZXMuZm9yRWFjaChyZXNldFRyeUVudHJ5KTtcblxuICAgICAgLy8gUHJlLWluaXRpYWxpemUgYXQgbGVhc3QgMjAgdGVtcG9yYXJ5IHZhcmlhYmxlcyB0byBlbmFibGUgaGlkZGVuXG4gICAgICAvLyBjbGFzcyBvcHRpbWl6YXRpb25zIGZvciBzaW1wbGUgZ2VuZXJhdG9ycy5cbiAgICAgIGZvciAodmFyIHRlbXBJbmRleCA9IDAsIHRlbXBOYW1lO1xuICAgICAgICAgICBoYXNPd24uY2FsbCh0aGlzLCB0ZW1wTmFtZSA9IFwidFwiICsgdGVtcEluZGV4KSB8fCB0ZW1wSW5kZXggPCAyMDtcbiAgICAgICAgICAgKyt0ZW1wSW5kZXgpIHtcbiAgICAgICAgdGhpc1t0ZW1wTmFtZV0gPSBudWxsO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzdG9wOiBmdW5jdGlvbigpIHtcbiAgICAgIHRoaXMuZG9uZSA9IHRydWU7XG5cbiAgICAgIHZhciByb290RW50cnkgPSB0aGlzLnRyeUVudHJpZXNbMF07XG4gICAgICB2YXIgcm9vdFJlY29yZCA9IHJvb3RFbnRyeS5jb21wbGV0aW9uO1xuICAgICAgaWYgKHJvb3RSZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJvb3RSZWNvcmQuYXJnO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcy5ydmFsO1xuICAgIH0sXG5cbiAgICBkaXNwYXRjaEV4Y2VwdGlvbjogZnVuY3Rpb24oZXhjZXB0aW9uKSB7XG4gICAgICBpZiAodGhpcy5kb25lKSB7XG4gICAgICAgIHRocm93IGV4Y2VwdGlvbjtcbiAgICAgIH1cblxuICAgICAgdmFyIGNvbnRleHQgPSB0aGlzO1xuICAgICAgZnVuY3Rpb24gaGFuZGxlKGxvYywgY2F1Z2h0KSB7XG4gICAgICAgIHJlY29yZC50eXBlID0gXCJ0aHJvd1wiO1xuICAgICAgICByZWNvcmQuYXJnID0gZXhjZXB0aW9uO1xuICAgICAgICBjb250ZXh0Lm5leHQgPSBsb2M7XG4gICAgICAgIHJldHVybiAhIWNhdWdodDtcbiAgICAgIH1cblxuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIHZhciByZWNvcmQgPSBlbnRyeS5jb21wbGV0aW9uO1xuXG4gICAgICAgIGlmIChlbnRyeS50cnlMb2MgPT09IFwicm9vdFwiKSB7XG4gICAgICAgICAgLy8gRXhjZXB0aW9uIHRocm93biBvdXRzaWRlIG9mIGFueSB0cnkgYmxvY2sgdGhhdCBjb3VsZCBoYW5kbGVcbiAgICAgICAgICAvLyBpdCwgc28gc2V0IHRoZSBjb21wbGV0aW9uIHZhbHVlIG9mIHRoZSBlbnRpcmUgZnVuY3Rpb24gdG9cbiAgICAgICAgICAvLyB0aHJvdyB0aGUgZXhjZXB0aW9uLlxuICAgICAgICAgIHJldHVybiBoYW5kbGUoXCJlbmRcIik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldikge1xuICAgICAgICAgIHZhciBoYXNDYXRjaCA9IGhhc093bi5jYWxsKGVudHJ5LCBcImNhdGNoTG9jXCIpO1xuICAgICAgICAgIHZhciBoYXNGaW5hbGx5ID0gaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKTtcblxuICAgICAgICAgIGlmIChoYXNDYXRjaCAmJiBoYXNGaW5hbGx5KSB7XG4gICAgICAgICAgICBpZiAodGhpcy5wcmV2IDwgZW50cnkuY2F0Y2hMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5jYXRjaExvYywgdHJ1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzQ2F0Y2gpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLnByZXYgPCBlbnRyeS5jYXRjaExvYykge1xuICAgICAgICAgICAgICByZXR1cm4gaGFuZGxlKGVudHJ5LmNhdGNoTG9jLCB0cnVlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSBpZiAoaGFzRmluYWxseSkge1xuICAgICAgICAgICAgaWYgKHRoaXMucHJldiA8IGVudHJ5LmZpbmFsbHlMb2MpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIGhhbmRsZShlbnRyeS5maW5hbGx5TG9jKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJ0cnkgc3RhdGVtZW50IHdpdGhvdXQgY2F0Y2ggb3IgZmluYWxseVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuXG4gICAgYWJydXB0OiBmdW5jdGlvbih0eXBlLCBhcmcpIHtcbiAgICAgIGZvciAodmFyIGkgPSB0aGlzLnRyeUVudHJpZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgdmFyIGVudHJ5ID0gdGhpcy50cnlFbnRyaWVzW2ldO1xuICAgICAgICBpZiAoZW50cnkudHJ5TG9jIDw9IHRoaXMucHJldiAmJlxuICAgICAgICAgICAgaGFzT3duLmNhbGwoZW50cnksIFwiZmluYWxseUxvY1wiKSAmJlxuICAgICAgICAgICAgdGhpcy5wcmV2IDwgZW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAgIHZhciBmaW5hbGx5RW50cnkgPSBlbnRyeTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoZmluYWxseUVudHJ5ICYmXG4gICAgICAgICAgKHR5cGUgPT09IFwiYnJlYWtcIiB8fFxuICAgICAgICAgICB0eXBlID09PSBcImNvbnRpbnVlXCIpICYmXG4gICAgICAgICAgZmluYWxseUVudHJ5LnRyeUxvYyA8PSBhcmcgJiZcbiAgICAgICAgICBhcmcgPCBmaW5hbGx5RW50cnkuZmluYWxseUxvYykge1xuICAgICAgICAvLyBJZ25vcmUgdGhlIGZpbmFsbHkgZW50cnkgaWYgY29udHJvbCBpcyBub3QganVtcGluZyB0byBhXG4gICAgICAgIC8vIGxvY2F0aW9uIG91dHNpZGUgdGhlIHRyeS9jYXRjaCBibG9jay5cbiAgICAgICAgZmluYWxseUVudHJ5ID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdmFyIHJlY29yZCA9IGZpbmFsbHlFbnRyeSA/IGZpbmFsbHlFbnRyeS5jb21wbGV0aW9uIDoge307XG4gICAgICByZWNvcmQudHlwZSA9IHR5cGU7XG4gICAgICByZWNvcmQuYXJnID0gYXJnO1xuXG4gICAgICBpZiAoZmluYWxseUVudHJ5KSB7XG4gICAgICAgIHRoaXMubmV4dCA9IGZpbmFsbHlFbnRyeS5maW5hbGx5TG9jO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jb21wbGV0ZShyZWNvcmQpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gQ29udGludWVTZW50aW5lbDtcbiAgICB9LFxuXG4gICAgY29tcGxldGU6IGZ1bmN0aW9uKHJlY29yZCwgYWZ0ZXJMb2MpIHtcbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJ0aHJvd1wiKSB7XG4gICAgICAgIHRocm93IHJlY29yZC5hcmc7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZWNvcmQudHlwZSA9PT0gXCJicmVha1wiIHx8XG4gICAgICAgICAgcmVjb3JkLnR5cGUgPT09IFwiY29udGludWVcIikge1xuICAgICAgICB0aGlzLm5leHQgPSByZWNvcmQuYXJnO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJyZXR1cm5cIikge1xuICAgICAgICB0aGlzLnJ2YWwgPSByZWNvcmQuYXJnO1xuICAgICAgICB0aGlzLm5leHQgPSBcImVuZFwiO1xuICAgICAgfSBlbHNlIGlmIChyZWNvcmQudHlwZSA9PT0gXCJub3JtYWxcIiAmJiBhZnRlckxvYykge1xuICAgICAgICB0aGlzLm5leHQgPSBhZnRlckxvYztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfSxcblxuICAgIGZpbmlzaDogZnVuY3Rpb24oZmluYWxseUxvYykge1xuICAgICAgZm9yICh2YXIgaSA9IHRoaXMudHJ5RW50cmllcy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICB2YXIgZW50cnkgPSB0aGlzLnRyeUVudHJpZXNbaV07XG4gICAgICAgIGlmIChlbnRyeS5maW5hbGx5TG9jID09PSBmaW5hbGx5TG9jKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMuY29tcGxldGUoZW50cnkuY29tcGxldGlvbiwgZW50cnkuYWZ0ZXJMb2MpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcblxuICAgIFwiY2F0Y2hcIjogZnVuY3Rpb24odHJ5TG9jKSB7XG4gICAgICBmb3IgKHZhciBpID0gdGhpcy50cnlFbnRyaWVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIHZhciBlbnRyeSA9IHRoaXMudHJ5RW50cmllc1tpXTtcbiAgICAgICAgaWYgKGVudHJ5LnRyeUxvYyA9PT0gdHJ5TG9jKSB7XG4gICAgICAgICAgdmFyIHJlY29yZCA9IGVudHJ5LmNvbXBsZXRpb247XG4gICAgICAgICAgaWYgKHJlY29yZC50eXBlID09PSBcInRocm93XCIpIHtcbiAgICAgICAgICAgIHZhciB0aHJvd24gPSByZWNvcmQuYXJnO1xuICAgICAgICAgICAgcmVzZXRUcnlFbnRyeShlbnRyeSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0aHJvd247XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gVGhlIGNvbnRleHQuY2F0Y2ggbWV0aG9kIG11c3Qgb25seSBiZSBjYWxsZWQgd2l0aCBhIGxvY2F0aW9uXG4gICAgICAvLyBhcmd1bWVudCB0aGF0IGNvcnJlc3BvbmRzIHRvIGEga25vd24gY2F0Y2ggYmxvY2suXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbGxlZ2FsIGNhdGNoIGF0dGVtcHRcIik7XG4gICAgfSxcblxuICAgIGRlbGVnYXRlWWllbGQ6IGZ1bmN0aW9uKGl0ZXJhYmxlLCByZXN1bHROYW1lLCBuZXh0TG9jKSB7XG4gICAgICB0aGlzLmRlbGVnYXRlID0ge1xuICAgICAgICBpdGVyYXRvcjogdmFsdWVzKGl0ZXJhYmxlKSxcbiAgICAgICAgcmVzdWx0TmFtZTogcmVzdWx0TmFtZSxcbiAgICAgICAgbmV4dExvYzogbmV4dExvY1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIENvbnRpbnVlU2VudGluZWw7XG4gICAgfVxuICB9O1xufSkoXG4gIC8vIEFtb25nIHRoZSB2YXJpb3VzIHRyaWNrcyBmb3Igb2J0YWluaW5nIGEgcmVmZXJlbmNlIHRvIHRoZSBnbG9iYWxcbiAgLy8gb2JqZWN0LCB0aGlzIHNlZW1zIHRvIGJlIHRoZSBtb3N0IHJlbGlhYmxlIHRlY2huaXF1ZSB0aGF0IGRvZXMgbm90XG4gIC8vIHVzZSBpbmRpcmVjdCBldmFsICh3aGljaCB2aW9sYXRlcyBDb250ZW50IFNlY3VyaXR5IFBvbGljeSkuXG4gIHR5cGVvZiBnbG9iYWwgPT09IFwib2JqZWN0XCIgPyBnbG9iYWwgOlxuICB0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiID8gd2luZG93IDogdGhpc1xuKTtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4vbGliL2JhYmVsL3BvbHlmaWxsXCIpO1xuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYmFiZWwtY29yZS9wb2x5ZmlsbFwiKTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtpbk5vZGVKc30gZnJvbSAnLi91dGlsJztcblxuY29uc3QgamF6elBsdWdpbkluaXRUaW1lID0gMTAwOyAvLyBtaWxsaXNlY29uZHNcblxubGV0IGphenpJbnN0YW5jZU51bWJlciA9IDA7XG5sZXQgamF6ekluc3RhbmNlcyA9IG5ldyBNYXAoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUphenpJbnN0YW5jZShjYWxsYmFjayl7XG5cbiAgbGV0IGluc3RhbmNlID0ge1xuICAgIGlucHV0SW5Vc2U6IGZhbHNlLFxuICAgIG91dHB1dEluVXNlOiBmYWxzZSxcbiAgICBqYXp6OiB1bmRlZmluZWQsXG4gICAgaWQ6IGphenpJbnN0YW5jZU51bWJlcisrICsgJycgKyBEYXRlLm5vdygpXG4gIH07XG5cbiAgbGV0IG9ialJlZiwgYWN0aXZlWDtcblxuICBpZihpbk5vZGVKcyA9PT0gdHJ1ZSl7XG4gICAgb2JqUmVmID0gbmV3IHdpbmRvdy5qYXp6TWlkaS5NSURJKCk7XG4gIH1lbHNle1xuICAgIGxldCBvMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29iamVjdCcpO1xuICAgIG8xLmlkID0gJ19KYXp6JyArIGluc3RhbmNlLmlkICsgJ2llJztcbiAgICBvMS5jbGFzc2lkID0gJ0NMU0lEOjFBQ0UxNjE4LTFDN0QtNDU2MS1BRUUxLTM0ODQyQUE4NUU5MCc7XG4gICAgYWN0aXZlWCA9IG8xO1xuXG4gICAgbGV0IG8yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2JqZWN0Jyk7XG4gICAgbzIuaWQgPSAnX0phenonICsgaW5zdGFuY2UuaWQ7XG4gICAgbzIudHlwZT0nYXVkaW8veC1qYXp6JztcbiAgICBvMS5hcHBlbmRDaGlsZChvMik7XG4gICAgb2JqUmVmID0gbzI7XG5cbiAgICBsZXQgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdUaGlzIHBhZ2UgcmVxdWlyZXMgdGhlICcpKTtcblxuICAgIGxldCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0phenogcGx1Z2luJykpO1xuICAgIGEuaHJlZiA9ICdodHRwOi8vamF6ei1zb2Z0Lm5ldC8nO1xuXG4gICAgZS5hcHBlbmRDaGlsZChhKTtcbiAgICBlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcuJykpO1xuICAgIG8yLmFwcGVuZENoaWxkKGUpO1xuXG4gICAgbGV0IGluc2VydGlvblBvaW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ01JRElQbHVnaW4nKTtcbiAgICBpZighaW5zZXJ0aW9uUG9pbnQpIHtcbiAgICAgIC8vIENyZWF0ZSBoaWRkZW4gZWxlbWVudFxuICAgICAgaW5zZXJ0aW9uUG9pbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGluc2VydGlvblBvaW50LmlkID0gJ01JRElQbHVnaW4nO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUubGVmdCA9ICctOTk5OXB4JztcbiAgICAgIGluc2VydGlvblBvaW50LnN0eWxlLnRvcCA9ICctOTk5OXB4JztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zZXJ0aW9uUG9pbnQpO1xuICAgIH1cbiAgICBpbnNlcnRpb25Qb2ludC5hcHBlbmRDaGlsZChvMSk7XG4gIH1cblxuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICBpZihvYmpSZWYuaXNKYXp6ID09PSB0cnVlKXtcbiAgICAgIGluc3RhbmNlLmphenogPSBvYmpSZWY7XG4gICAgfWVsc2UgaWYoYWN0aXZlWC5pc0phenogPT09IHRydWUpe1xuICAgICAgaW5zdGFuY2UuamF6eiA9IGFjdGl2ZVg7XG4gICAgfVxuICAgIGlmKGluc3RhbmNlLmphenogIT09IHVuZGVmaW5lZCl7XG4gICAgICBqYXp6SW5zdGFuY2VzLnNldChpbnN0YW5jZS5pZCwgaW5zdGFuY2UpO1xuICAgICAgaW5zdGFuY2UuamF6ei5fcGVyZlRpbWVaZXJvID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICAgIH1cbiAgICBjYWxsYmFjayhpbnN0YW5jZSk7XG4gIH0sIGphenpQbHVnaW5Jbml0VGltZSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEphenpJbnN0YW5jZSh0eXBlLCBjYWxsYmFjayl7XG4gIGxldCBpbnN0YW5jZSA9IG51bGw7XG4gIGxldCBrZXkgPSB0eXBlID09PSAnaW5wdXQnID8gJ2lucHV0SW5Vc2UnIDogJ291dHB1dEluVXNlJztcblxuICBmb3IoaW5zdGFuY2Ugb2YgamF6ekluc3RhbmNlcy52YWx1ZXMoKSl7XG4gICAgaWYoaW5zdGFuY2Vba2V5XSA9PT0gZmFsc2Upe1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBpZihpbnN0YW5jZSA9PT0gbnVsbCl7XG4gICAgY3JlYXRlSmF6ekluc3RhbmNlKGNhbGxiYWNrKTtcbiAgfWVsc2V7XG4gICAgY2FsbGJhY2soaW5zdGFuY2UpO1xuICB9XG59XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Y3JlYXRlSmF6ekluc3RhbmNlLCBnZXRKYXp6SW5zdGFuY2V9IGZyb20gJy4vamF6eic7XG5pbXBvcnQge01JRElJbnB1dH0gZnJvbSAnLi9taWRpX2lucHV0JztcbmltcG9ydCB7TUlESU91dHB1dH0gZnJvbSAnLi9taWRpX291dHB1dCc7XG5cbmxldCBqYXp6SW5zdGFuY2U7XG5sZXQgaW5wdXRzTWFwID0gbmV3IE1hcCgpO1xubGV0IG91dHB1dHNNYXAgPSBuZXcgTWFwKCk7XG5sZXQgbWlkaUFjY2VzcyA9IHtcbiAgc3lzZXhFbmFibGVkOiB0cnVlXG59O1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTUlESUFjY2Vzcygpe1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBleGVjdXRvcihyZXNvbHZlLCByZWplY3Qpe1xuXG4gICAgY3JlYXRlSmF6ekluc3RhbmNlKGZ1bmN0aW9uKGluc3RhbmNlKXtcbiAgICAgIGlmKGluc3RhbmNlID09PSB1bmRlZmluZWQpe1xuICAgICAgICByZWplY3Qoe2NvZGU6IDF9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBqYXp6SW5zdGFuY2UgPSBpbnN0YW5jZS5qYXp6O1xuXG4gICAgICBjcmVhdGVNSURJUG9ydHMoZnVuY3Rpb24oKXtcbiAgICAgICAgc2V0dXBMaXN0ZW5lcnMoKTtcbiAgICAgICAgbWlkaUFjY2Vzcy5pbnB1dHMgPSBpbnB1dHNNYXA7XG4gICAgICAgIG1pZGlBY2Nlc3Mub3V0cHV0cyA9IG91dHB1dHNNYXA7XG4gICAgICAgIHJlc29sdmUobWlkaUFjY2Vzcyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTUlESVBvcnRzKGNhbGxiYWNrKXtcbiAgbGV0IGlucHV0cyA9IGphenpJbnN0YW5jZS5NaWRpSW5MaXN0KCk7XG4gIGxldCBvdXRwdXRzID0gamF6ekluc3RhbmNlLk1pZGlPdXRMaXN0KCk7XG4gIGxldCBudW1JbnB1dHMgPSBpbnB1dHMubGVuZ3RoO1xuICBsZXQgbnVtT3V0cHV0cyA9IG91dHB1dHMubGVuZ3RoO1xuXG4gIGxvb3BDcmVhdGVNSURJUG9ydCgwLCBudW1JbnB1dHMsICdpbnB1dCcsIGlucHV0cywgZnVuY3Rpb24oKXtcbiAgICBsb29wQ3JlYXRlTUlESVBvcnQoMCwgbnVtT3V0cHV0cywgJ291dHB1dCcsIG91dHB1dHMsIGNhbGxiYWNrKTtcbiAgfSk7XG59XG5cblxuZnVuY3Rpb24gbG9vcENyZWF0ZU1JRElQb3J0KGluZGV4LCBtYXgsIHR5cGUsIGxpc3QsIGNhbGxiYWNrKXtcbiAgaWYoaW5kZXggPCBtYXgpe1xuICAgIGxldCBuYW1lID0gbGlzdFtpbmRleCsrXTtcbiAgICBjcmVhdGVNSURJUG9ydCh0eXBlLCBuYW1lLCBmdW5jdGlvbigpe1xuICAgICAgbG9vcENyZWF0ZU1JRElQb3J0KGluZGV4LCBtYXgsIHR5cGUsIGxpc3QsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfWVsc2V7XG4gICAgY2FsbGJhY2soKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZU1JRElQb3J0KHR5cGUsIG5hbWUsIGNhbGxiYWNrKXtcbiAgZ2V0SmF6ekluc3RhbmNlKHR5cGUsIGZ1bmN0aW9uKGluc3RhbmNlKXtcbiAgICBsZXQgcG9ydDtcbiAgICBsZXQgaW5mbyA9IFtuYW1lLCAnJywgJyddO1xuICAgIGlmKHR5cGUgPT09ICdpbnB1dCcpe1xuICAgICAgaWYoamF6ekluc3RhbmNlLlN1cHBvcnQoJ01pZGlJbkluZm8nKSl7XG4gICAgICAgIGluZm8gPSBqYXp6SW5zdGFuY2UuTWlkaUluSW5mbyhuYW1lKTtcbiAgICAgIH1cbiAgICAgIHBvcnQgPSBuZXcgTUlESUlucHV0KGluZm8sIGluc3RhbmNlKTtcbiAgICAgIGlucHV0c01hcC5zZXQobmFtZSwgcG9ydCk7XG4gICAgfWVsc2UgaWYodHlwZSA9PT0gJ291dHB1dCcpe1xuICAgICAgaWYoamF6ekluc3RhbmNlLlN1cHBvcnQoJ01pZGlPdXRJbmZvJykpe1xuICAgICAgICBpbmZvID0gamF6ekluc3RhbmNlLk1pZGlPdXRJbmZvKG5hbWUpO1xuICAgICAgfVxuICAgICAgcG9ydCA9IG5ldyBNSURJT3V0cHV0KGluZm8sIGluc3RhbmNlKTtcbiAgICAgIG91dHB1dHNNYXAuc2V0KG5hbWUsIHBvcnQpO1xuICAgIH1cbiAgICBjYWxsYmFjaygpO1xuICB9KTtcbn1cblxuXG5mdW5jdGlvbiBnZXRQb3J0QnlOYW1lKHBvcnRzLCBuYW1lKXtcbiAgbGV0IHBvcnQ7XG4gIGZvcihwb3J0IG9mIHBvcnRzLnZhbHVlcygpKXtcbiAgICBpZihwb3J0Lm5hbWUgPT09IG5hbWUpe1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBwb3J0O1xufVxuXG5cbmZ1bmN0aW9uIHNldHVwTGlzdGVuZXJzKCl7XG4gIGphenpJbnN0YW5jZS5PbkRpc2Nvbm5lY3RNaWRpSW4oZnVuY3Rpb24obmFtZSl7XG4gICAgbGV0IHBvcnQgPSBnZXRQb3J0QnlOYW1lKGlucHV0c01hcCwgbmFtZSk7XG4gICAgaWYocG9ydCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHBvcnQuY2xvc2UoKTtcbiAgICAgIHBvcnQuX2phenpJbnN0YW5jZS5pbnB1dEluVXNlID0gZmFsc2U7XG4gICAgICBpbnB1dHNNYXAuZGVsZXRlKG5hbWUpO1xuICAgICAgaWYobWlkaUFjY2Vzcy5vbnN0YXRlY2hhbmdlKXtcbiAgICAgICAgbWlkaUFjY2Vzcy5vbnN0YXRlY2hhbmdlKCk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBqYXp6SW5zdGFuY2UuT25EaXNjb25uZWN0TWlkaU91dChmdW5jdGlvbihuYW1lKXtcbiAgICBsZXQgcG9ydCA9IGdldFBvcnRCeU5hbWUob3V0cHV0c01hcCwgbmFtZSk7XG4gICAgaWYocG9ydCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHBvcnQuY2xvc2UoKTtcbiAgICAgIHBvcnQuX2phenpJbnN0YW5jZS5vdXRwdXRJblVzZSA9IGZhbHNlO1xuICAgICAgb3V0cHV0c01hcC5kZWxldGUobmFtZSk7XG4gICAgICBpZihtaWRpQWNjZXNzLm9uc3RhdGVjaGFuZ2Upe1xuICAgICAgICBtaWRpQWNjZXNzLm9uc3RhdGVjaGFuZ2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIGphenpJbnN0YW5jZS5PbkNvbm5lY3RNaWRpSW4oZnVuY3Rpb24obmFtZSl7XG4gICAgY3JlYXRlTUlESVBvcnQoJ2lucHV0JywgbmFtZSwgZnVuY3Rpb24oKXtcbiAgICAgIGlmKG1pZGlBY2Nlc3Mub25zdGF0ZWNoYW5nZSl7XG4gICAgICAgIG1pZGlBY2Nlc3Mub25zdGF0ZWNoYW5nZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICBqYXp6SW5zdGFuY2UuT25Db25uZWN0TWlkaU91dChmdW5jdGlvbihuYW1lKXtcbiAgICBjcmVhdGVNSURJUG9ydCgnb3V0cHV0JywgbmFtZSwgZnVuY3Rpb24oKXtcbiAgICAgIGlmKG1pZGlBY2Nlc3Mub25zdGF0ZWNoYW5nZSl7XG4gICAgICAgIG1pZGlBY2Nlc3Mub25zdGF0ZWNoYW5nZSgpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VBbGxNSURJSW5wdXRzKCl7XG4gIGlucHV0c01hcC5mb3JFYWNoKGZ1bmN0aW9uKGlucHV0KXtcbiAgICAvL2lucHV0LmNsb3NlKCk7XG4gICAgaW5wdXQuX2phenpJbnN0YW5jZS5NaWRpSW5DbG9zZSgpO1xuICB9KTtcbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2luTm9kZUpzfSBmcm9tICcuL3V0aWwnO1xuXG5sZXQgbWlkaVByb2M7XG5cbmV4cG9ydCBjbGFzcyBNSURJSW5wdXR7XG4gIGNvbnN0cnVjdG9yKGluZm8sIGluc3RhbmNlKXtcbiAgICB0aGlzLmlkID0gaW5mb1swXTtcbiAgICB0aGlzLm5hbWUgPSBpbmZvWzBdO1xuICAgIHRoaXMubWFudWZhY3R1cmVyID0gaW5mb1sxXTtcbiAgICB0aGlzLnZlcnNpb24gPSBpbmZvWzJdO1xuICAgIHRoaXMudHlwZSA9ICdpbnB1dCc7XG4gICAgdGhpcy5zdGF0ZSA9ICdjbG9zZWQnO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdjb25uZWN0ZWQnO1xuXG4gICAgdGhpcy5fb25taWRpbWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5fb25zdGF0ZWNoYW5nZSA9IG51bGw7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ29ubWlkaW1lc3NhZ2UnLCB7XG4gICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fb25taWRpbWVzc2FnZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnb25zdGF0ZWNoYW5nZScsIHtzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIHRoaXMuX29uc3RhdGVjaGFuZ2UgPSB2YWx1ZTtcbiAgICB9fSk7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgTWFwKCkuc2V0KCdtaWRpbWVzc2FnZScsIG5ldyBTZXQoKSkuc2V0KCdzdGF0ZWNoYW5nZScsIG5ldyBTZXQoKSk7XG4gICAgdGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlID0gZmFsc2U7XG4gICAgdGhpcy5fc3lzZXhCdWZmZXIgPSBuZXcgVWludDhBcnJheSgpO1xuXG4gICAgdGhpcy5famF6ekluc3RhbmNlID0gaW5zdGFuY2UuamF6ejtcbiAgICB0aGlzLl9qYXp6SW5zdGFuY2VJZCA9IGluc3RhbmNlLmphenouaWQ7XG4gICAgdGhpcy5famF6ekluc3RhbmNlLmlucHV0SW5Vc2UgPSB0cnVlO1xuICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpSW5PcGVuKHRoaXMubmFtZSwgbWlkaVByb2MuYmluZCh0aGlzKSk7XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKXtcbiAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldCh0eXBlKTtcbiAgICBpZihsaXN0ZW5lcnMgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYobGlzdGVuZXJzLmhhcyhsaXN0ZW5lcikgPT09IGZhbHNlKXtcbiAgICAgIGxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpe1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KHR5cGUpO1xuICAgIGlmKGxpc3RlbmVycyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZihsaXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gZmFsc2Upe1xuICAgICAgbGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgcHJldmVudERlZmF1bHQoKXtcbiAgICB0aGlzLl9wdnREZWYgPSB0cnVlO1xuICB9XG5cbiAgZGlzcGF0Y2hFdmVudChldnQpe1xuICAgIHRoaXMuX3B2dERlZiA9IGZhbHNlO1xuXG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoZXZ0LnR5cGUpO1xuICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKXtcbiAgICAgIGxpc3RlbmVyKGV2dCk7XG4gICAgfSk7XG5cbiAgICBpZih0aGlzLl9vbm1pZGltZXNzYWdlICE9PSBudWxsKXtcbiAgICAgIHRoaXMuX29ubWlkaW1lc3NhZ2UoZXZ0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcHZ0RGVmO1xuICB9XG5cblxuICBhcHBlbmRUb1N5c2V4QnVmZmVyKGRhdGEpe1xuICAgIGxldCBvbGRMZW5ndGggPSB0aGlzLl9zeXNleEJ1ZmZlci5sZW5ndGg7XG4gICAgbGV0IHRtcEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KG9sZExlbmd0aCArIGRhdGEubGVuZ3RoKTtcbiAgICB0bXBCdWZmZXIuc2V0KHRoaXMuX3N5c2V4QnVmZmVyKTtcbiAgICB0bXBCdWZmZXIuc2V0KGRhdGEsIG9sZExlbmd0aCk7XG4gICAgdGhpcy5fc3lzZXhCdWZmZXIgPSB0bXBCdWZmZXI7XG4gIH1cblxuXG4gIGJ1ZmZlckxvbmdTeXNleChkYXRhLCBpbml0aWFsT2Zmc2V0KXtcbiAgICBsZXQgaiA9IGluaXRpYWxPZmZzZXQ7XG4gICAgd2hpbGUoajxkYXRhLmxlbmd0aCl7XG4gICAgICAgIGlmKGRhdGFbal0gPT0gMHhGNyl7XG4gICAgICAgICAgICAvLyBlbmQgb2Ygc3lzZXghXG4gICAgICAgICAgICBqKys7XG4gICAgICAgICAgICB0aGlzLmFwcGVuZFRvU3lzZXhCdWZmZXIoZGF0YS5zbGljZShpbml0aWFsT2Zmc2V0LCBqKSk7XG4gICAgICAgICAgICByZXR1cm4gajtcbiAgICAgICAgfVxuICAgICAgICBqKys7XG4gICAgfVxuICAgIC8vIGRpZG4ndCByZWFjaCB0aGUgZW5kOyBqdXN0IHRhY2sgaXQgb24uXG4gICAgdGhpcy5hcHBlbmRUb1N5c2V4QnVmZmVyKGRhdGEuc2xpY2UoaW5pdGlhbE9mZnNldCwgaikpO1xuICAgIHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSA9IHRydWU7XG4gICAgcmV0dXJuIGo7XG4gIH1cblxuICBvcGVuKCl7XG4gICAgLy90aGlzLl9qYXp6SW5zdGFuY2UuTWlkaUluT3Blbih0aGlzLm5hbWUsIG1pZGlQcm9jLmJpbmQodGhpcykpO1xuICB9XG5cbiAgY2xvc2UoKXtcbiAgICAvL3RoaXMuX2phenpJbnN0YW5jZS5NaWRpSW5DbG9zZSh0aGlzLm5hbWUpO1xuICAgIHRoaXMub25taWRpbWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5vbnN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICB0aGlzLl9saXN0ZW5lcnMuZ2V0KCdtaWRpbWVzc2FnZScpLmNsZWFyKCk7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmdldCgnc3RhdGVjaGFuZ2UnKS5jbGVhcigpO1xuICB9XG59XG5cblxuXG5taWRpUHJvYyA9IGZ1bmN0aW9uKHRpbWVzdGFtcCwgZGF0YSl7XG4gIC8vIEhhdmUgdG8gdXNlIGNyZWF0ZUV2ZW50L2luaXRFdmVudCBiZWNhdXNlIElFMTAgZmFpbHMgb24gbmV3IEN1c3RvbUV2ZW50XG4gIGxldCBsZW5ndGggPSAwO1xuICBsZXQgaTtcbiAgbGV0IGlzU3lzZXhNZXNzYWdlID0gZmFsc2U7XG5cbiAgLy8gSmF6eiBzb21ldGltZXMgcGFzc2VzIHVzIG11bHRpcGxlIG1lc3NhZ2VzIGF0IG9uY2UsIHNvIHdlIG5lZWQgdG8gcGFyc2UgdGhlbSBvdXRcbiAgLy8gYW5kIHBhc3MgdGhlbSBvbmUgYXQgYSB0aW1lLlxuXG4gIGZvcihpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpICs9IGxlbmd0aCl7XG4gICAgbGV0IGlzVmFsaWRNZXNzYWdlID0gdHJ1ZTtcbiAgICBpZih0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2Upe1xuICAgICAgaSA9IHRoaXMuYnVmZmVyTG9uZ1N5c2V4KGRhdGEsIGkpO1xuICAgICAgaWYoZGF0YVtpLTFdICE9IDB4Zjcpe1xuICAgICAgICAvLyByYW4gb2ZmIHRoZSBlbmQgd2l0aG91dCBoaXR0aW5nIHRoZSBlbmQgb2YgdGhlIHN5c2V4IG1lc3NhZ2VcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaXNTeXNleE1lc3NhZ2UgPSB0cnVlO1xuICAgIH1lbHNle1xuICAgICAgaXNTeXNleE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgIHN3aXRjaChkYXRhW2ldICYgMHhGMCl7XG4gICAgICAgIGNhc2UgMHgwMDogIC8vIENoZXcgdXAgc3B1cmlvdXMgMHgwMCBieXRlcy4gIEZpeGVzIGEgV2luZG93cyBwcm9ibGVtLlxuICAgICAgICAgIGxlbmd0aCA9IDE7XG4gICAgICAgICAgaXNWYWxpZE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDB4ODA6ICAvLyBub3RlIG9mZlxuICAgICAgICBjYXNlIDB4OTA6ICAvLyBub3RlIG9uXG4gICAgICAgIGNhc2UgMHhBMDogIC8vIHBvbHlwaG9uaWMgYWZ0ZXJ0b3VjaFxuICAgICAgICBjYXNlIDB4QjA6ICAvLyBjb250cm9sIGNoYW5nZVxuICAgICAgICBjYXNlIDB4RTA6ICAvLyBjaGFubmVsIG1vZGVcbiAgICAgICAgICBsZW5ndGggPSAzO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMHhDMDogIC8vIHByb2dyYW0gY2hhbmdlXG4gICAgICAgIGNhc2UgMHhEMDogIC8vIGNoYW5uZWwgYWZ0ZXJ0b3VjaFxuICAgICAgICAgIGxlbmd0aCA9IDI7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAweEYwOlxuICAgICAgICAgIHN3aXRjaChkYXRhW2ldKXtcbiAgICAgICAgICAgIGNhc2UgMHhmMDogIC8vIGxldGlhYmxlLWxlbmd0aCBzeXNleC5cbiAgICAgICAgICAgICAgaSA9IHRoaXMuYnVmZmVyTG9uZ1N5c2V4KGRhdGEsaSk7XG4gICAgICAgICAgICAgIGlmKGRhdGFbaS0xXSAhPSAweGY3KXtcbiAgICAgICAgICAgICAgICAvLyByYW4gb2ZmIHRoZSBlbmQgd2l0aG91dCBoaXR0aW5nIHRoZSBlbmQgb2YgdGhlIHN5c2V4IG1lc3NhZ2VcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaXNTeXNleE1lc3NhZ2UgPSB0cnVlO1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAweEYxOiAgLy8gTVRDIHF1YXJ0ZXIgZnJhbWVcbiAgICAgICAgICAgIGNhc2UgMHhGMzogIC8vIHNvbmcgc2VsZWN0XG4gICAgICAgICAgICAgIGxlbmd0aCA9IDI7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDB4RjI6ICAvLyBzb25nIHBvc2l0aW9uIHBvaW50ZXJcbiAgICAgICAgICAgICAgbGVuZ3RoID0gMztcbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIGxlbmd0aCA9IDE7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYoIWlzVmFsaWRNZXNzYWdlKXtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBsZXQgZXZ0ID17fTtcbiAgICBpZighaW5Ob2RlSnMpe1xuICAgICAgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0V2ZW50Jyk7XG4gICAgICBldnQuaW5pdEV2ZW50KCdtaWRpbWVzc2FnZScsIGZhbHNlLCBmYWxzZSk7XG4gICAgfVxuICAgIGV2dC5yZWNlaXZlZFRpbWUgPSBwYXJzZUZsb2F0KHRpbWVzdGFtcC50b1N0cmluZygpKSArIHRoaXMuX2phenpJbnN0YW5jZS5fcGVyZlRpbWVaZXJvO1xuICAgIGlmKGlzU3lzZXhNZXNzYWdlIHx8IHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSl7XG4gICAgICBldnQuZGF0YSA9IG5ldyBVaW50OEFycmF5KHRoaXMuX3N5c2V4QnVmZmVyKTtcbiAgICAgIHRoaXMuX3N5c2V4QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoMCk7XG4gICAgICB0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2UgPSBmYWxzZTtcbiAgICB9ZWxzZXtcbiAgICAgIGV2dC5kYXRhID0gbmV3IFVpbnQ4QXJyYXkoZGF0YS5zbGljZShpLCBsZW5ndGgraSkpO1xuICAgIH1cblxuICAgIGlmKGluTm9kZUpzKXtcbiAgICAgIGlmKHRoaXMub25taWRpbWVzc2FnZSl7XG4gICAgICAgIHRoaXMub25taWRpbWVzc2FnZShldnQpO1xuICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gICAgfVxuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuXG5leHBvcnQgY2xhc3MgTUlESU91dHB1dHtcbiAgY29uc3RydWN0b3IoaW5mbywgaW5zdGFuY2Upe1xuICAgIHRoaXMuaWQgPSBpbmZvWzBdO1xuICAgIHRoaXMubmFtZSA9IGluZm9bMF07XG4gICAgdGhpcy5tYW51ZmFjdHVyZXIgPSBpbmZvWzFdO1xuICAgIHRoaXMudmVyc2lvbiA9IGluZm9bMl07XG4gICAgdGhpcy50eXBlID0gJ2lucHV0JztcbiAgICB0aGlzLnN0YXRlID0gJ2Nsb3NlZCc7XG4gICAgdGhpcy5jb25uZWN0aW9uID0gJ2Nvbm5lY3RlZCc7XG4gICAgdGhpcy5vbm1pZGltZXNzYWdlID0gbnVsbDtcbiAgICB0aGlzLm9uc3RhdGVjaGFuZ2UgPSBudWxsO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSA9IGZhbHNlO1xuICAgIHRoaXMuX3N5c2V4QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoKTtcblxuICAgIHRoaXMuX2phenpJbnN0YW5jZSA9IGluc3RhbmNlLmpheno7XG4gICAgdGhpcy5famF6ekluc3RhbmNlSWQgPSBpbnN0YW5jZS5qYXp6LmlkO1xuICAgIHRoaXMuX2phenpJbnN0YW5jZS5vdXRwdXRJblVzZSA9IHRydWU7XG4gICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlPdXRPcGVuKHRoaXMubmFtZSk7XG4gIH1cblxuICBvcGVuKCl7XG4gICAgLy90aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dE9wZW4odGhpcy5uYW1lKTtcbiAgICB0aGlzLnN0YXRlID0gJ29wZW4nO1xuICB9XG5cbiAgY2xvc2UoKXtcbiAgICAvL3RoaXMuX2phenpJbnN0YW5jZS5NaWRpT3V0Q2xvc2UodGhpcy5uYW1lKTtcbiAgICB0aGlzLnN0YXRlID0gJ2Nsb3NlZCc7XG4gIH1cblxuICBzZW5kKGRhdGEsIHRpbWVzdGFtcCl7XG4gICAgbGV0IGRlbGF5QmVmb3JlU2VuZCA9IDA7XG5cbiAgICBpZihkYXRhLmxlbmd0aCA9PT0gMCl7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYodGltZXN0YW1wKXtcbiAgICAgIGRlbGF5QmVmb3JlU2VuZCA9IE1hdGguZmxvb3IodGltZXN0YW1wIC0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpKTtcbiAgICB9XG5cbiAgICBpZih0aW1lc3RhbXAgJiYgKGRlbGF5QmVmb3JlU2VuZCA+IDEpKXtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlPdXRMb25nKGRhdGEpO1xuICAgICAgfSwgZGVsYXlCZWZvcmVTZW5kKTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpT3V0TG9uZyhkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn0iLCIndXNlIHN0cmljdCc7XG5cbi8vIHJlcXVpcmVkIGJ5IGJhYmVsaWZ5IGZvciB0cmFuc3BpbGluZyBlczZcbnJlcXVpcmUoJ2JhYmVsaWZ5L3BvbHlmaWxsJyk7XG5cbmltcG9ydCB7Y3JlYXRlTUlESUFjY2VzcywgY2xvc2VBbGxNSURJSW5wdXRzfSBmcm9tICcuL21pZGlfYWNjZXNzJztcbmltcG9ydCB7cG9seWZpbGxQZXJmb3JtYW5jZSwgaW5Ob2RlSnN9IGZyb20gJy4vdXRpbCc7XG5cbmxldCBtaWRpQWNjZXNzO1xuXG4oZnVuY3Rpb24oKXtcbiAgaWYoIXdpbmRvdy5uYXZpZ2F0b3IucmVxdWVzdE1JRElBY2Nlc3Mpe1xuICAgIHBvbHlmaWxsUGVyZm9ybWFuY2UoKTtcbiAgICB3aW5kb3cubmF2aWdhdG9yLnJlcXVlc3RNSURJQWNjZXNzID0gZnVuY3Rpb24oKXtcbiAgICAgIGlmKG1pZGlBY2Nlc3MgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgbWlkaUFjY2VzcyA9IGNyZWF0ZU1JRElBY2Nlc3MoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtaWRpQWNjZXNzO1xuICAgIH07XG4gICAgaWYoaW5Ob2RlSnMpe1xuICAgICAgd2luZG93Lm5hdmlnYXRvci5jbG9zZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIE5lZWQgdG8gY2xvc2UgTUlESSBpbnB1dCBwb3J0cywgb3RoZXJ3aXNlIE5vZGUuanMgd2lsbCB3YWl0IGZvciBNSURJIGlucHV0IGZvcmV2ZXIuXG4gICAgICAgIGNsb3NlQWxsTUlESUlucHV0cygpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbn0oKSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBjaGVjayBpZiB0aGUgc2hpbSBpcyBydW5uaW5nIGluIG5vZGVqc1xuZXhwb3J0IGNvbnN0IGluTm9kZUpzID0gKHR5cGVvZiBfX2Rpcm5hbWUgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5qYXp6TWlkaSk7XG5cblxuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGxQZXJmb3JtYW5jZSgpe1xuICBpZigncGVyZm9ybWFuY2UnIGluIHdpbmRvdyA9PT0gZmFsc2UpIHtcbiAgICBsZXQgbm93T2Zmc2V0ID0gRGF0ZS5ub3coKTtcbiAgICB3aW5kb3cucGVyZm9ybWFuY2UgPSB7XG4gICAgICBub3c6IGZ1bmN0aW9uIG5vdygpe1xuICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIG5vd09mZnNldDtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cblxuLypcblxuLy8gUG9seWZpbGwgd2luZG93LnBlcmZvcm1hbmNlLm5vdygpIGlmIG5lY2Vzc2FyeS5cbmV4cG9ydCBmdW5jdGlvbiBwb2x5ZmlsbFBlcmZvcm1hbmNlKGV4cG9ydHMpIHtcblxuICB2YXIgcGVyZiA9IHt9LCBwcm9wcztcblxuICBmdW5jdGlvbiBmaW5kQWx0KCl7XG4gICAgbGV0IHByZWZpeCA9IFsnbW96JywgJ3dlYmtpdCcsICdvJywgJ21zJ10sXG4gICAgaSA9IHByZWZpeC5sZW5ndGgsXG4gICAgLy93b3JzdCBjYXNlLCB3ZSB1c2UgRGF0ZS5ub3coKVxuICAgIHByb3BzID0ge1xuICAgICAgdmFsdWU6IChmdW5jdGlvbiAoc3RhcnQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIHN0YXJ0O1xuICAgICAgICB9O1xuICAgICAgfShEYXRlLm5vdygpKSlcbiAgICB9O1xuXG4gICAgLy9zZWFjaCBmb3IgdmVuZG9yIHByZWZpeGVkIHZlcnNpb25cbiAgICBmb3IgKDsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGxldCBtZXRob2ROYW1lID0gcHJlZml4W2ldICsgJ05vdyc7XG4gICAgICBpZihleHBvcnRzLnBlcmZvcm1hbmNlW21ldGhvZE5hbWVdICE9PSB1bmRlZmluZWQpe1xuICAgICAgICBwcm9wcy52YWx1ZSA9IChmdW5jdGlvbihtZXRob2Qpe1xuICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgZXhwb3J0cy5wZXJmb3JtYW5jZVttZXRob2RdKCk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfShtZXRob2ROYW1lKSk7XG4gICAgICAgIHJldHVybiBwcm9wcztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvL290aGVyd2lzZSwgdHJ5IHRvIHVzZSBjb25uZWN0aW9uU3RhcnRcbiAgICBpZihleHBvcnRzLnBlcmZvcm1hbmNlLnRpbWluZyAhPT0gdW5kZWZpbmVkICYmIGV4cG9ydHMucGVyZm9ybWFuY2UudGltaW5nLmNvbm5lY3RTdGFydCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIC8vdGhpcyBwcmV0dHkgbXVjaCBhcHByb3hpbWF0ZXMgcGVyZm9ybWFuY2Uubm93KCkgdG8gdGhlIG1pbGxpc2Vjb25kXG4gICAgICBwcm9wcy52YWx1ZSA9IChmdW5jdGlvbiAoc3RhcnQpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIERhdGUubm93KCkgLSBzdGFydDtcbiAgICAgICAgfTtcbiAgICAgIH0oZXhwb3J0cy5wZXJmb3JtYW5jZS50aW1pbmcuY29ubmVjdFN0YXJ0KSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9wcztcbiAgfVxuXG4gIC8vaWYgYWxyZWFkeSBkZWZpbmVkLCBiYWlsXG4gIGlmKGV4cG9ydHMucGVyZm9ybWFuY2UgIT09IHVuZGVmaW5lZCAmJiBleHBvcnRzLnBlcmZvcm1hbmNlLm5vdyAhPT0gdW5kZWZpbmVkKXtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZihleHBvcnRzLnBlcmZvcm1hbmNlID09PSB1bmRlZmluZWQpe1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAncGVyZm9ybWFuY2UnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHBlcmY7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvL290aGVyd2lzZSwgcGVyZm9ybWFuY2UgaXMgdGhlcmUsIGJ1dCBub3QgJ25vdygpJ1xuICBwcm9wcyA9IGZpbmRBbHQoKTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMucGVyZm9ybWFuY2UsICdub3cnLCBwcm9wcyk7XG59XG4qLyJdfQ==
