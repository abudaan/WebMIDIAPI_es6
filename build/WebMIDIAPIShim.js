(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createJazzInstance = createJazzInstance;
exports.getJazzInstance = getJazzInstance;

var _getDevice = require('./util');

'use strict';

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

},{"./util":9}],3:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.createMIDIAccess = createMIDIAccess;
exports.dispatchEvent = dispatchEvent;
exports.closeAllMIDIInputs = closeAllMIDIInputs;

var _createJazzInstance$getJazzInstance = require('./jazz');

var _MIDIInput = require('./midi_input');

var _MIDIOutput = require('./midi_output');

var _MIDIConnectionEvent = require('./midiconnection_event');

'use strict';

var midiAccess = undefined;
var jazzInstance = undefined;
var inputsMap = new Map();
var outputsMap = new Map();
var listeners = new Set();

var MIDIAccess = function MIDIAccess(inputsMap, outputsMap) {
  _classCallCheck(this, MIDIAccess);

  this.sysexEnabled = true;
  this.inputs = inputsMap;
  this.outputs = outputsMap;
};

function createMIDIAccess() {

  return new Promise(function executor(resolve, reject) {

    _createJazzInstance$getJazzInstance.createJazzInstance(function (instance) {
      if (instance === undefined) {
        reject({ code: 1 });
        return;
      }

      jazzInstance = instance;

      createMIDIPorts(function () {
        setupListeners();
        midiAccess = new MIDIAccess(inputsMap, outputsMap);
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
      inputsMap.set(port.id, port);
    } else if (type === 'output') {
      if (instance.Support('MidiOutInfo')) {
        info = instance.MidiOutInfo(name);
      }
      port = new _MIDIOutput.MIDIOutput(info, instance);
      outputsMap.set(port.id, port);
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
    var port = getPortByName(inputsMap, name);
    if (port !== undefined) {
      port.state = 'disconnected';
      port.close();
      port._jazzInstance.inputInUse = false;
      inputsMap['delete'](port.id);
      dispatchEvent(port);
    }
  });

  jazzInstance.OnDisconnectMidiOut(function (name) {
    var port = getPortByName(outputsMap, name);
    if (port !== undefined) {
      port.state = 'disconnected';
      port.close();
      port._jazzInstance.outputInUse = false;
      outputsMap['delete'](port.id);
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

function addEventListener(type, listener, useCapture) {
  if (type !== 'statechange') {
    return;
  }
  if (listeners.has(listener) === false) {
    listeners.set(listener);
  }
}

function removeEventListener(type, listener, useCapture) {
  if (type !== 'statechange') {
    return;
  }
  if (listeners.has(listener) === true) {
    listeners['delete'](listener);
  }
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
  inputsMap.forEach(function (input) {
    //input.close();
    input._jazzInstance.MidiInClose();
  });
}

},{"./jazz":2,"./midi_input":4,"./midi_output":5,"./midiconnection_event":6}],4:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getDevice$generateUUID = require('./util');

var _MIDIMessageEvent = require('./midimessage_event');

var _MIDIConnectionEvent = require('./midiconnection_event');

var _dispatchEvent = require('./midi_access');

'use strict';

var midiProc = undefined;
var nodejs = _getDevice$generateUUID.getDevice().nodejs;

var MIDIInput = (function () {
  function MIDIInput(info, instance) {
    _classCallCheck(this, MIDIInput);

    this.id = _getDevice$generateUUID.generateUUID();
    this.name = info[0];
    this.manufacturer = info[1];
    this.version = info[2];
    this.type = 'input';
    this.state = 'connected';
    this.connection = 'pending';

    this._onmidimessage = null;
    this._onstatechange = null;

    Object.defineProperty(this, 'onmidimessage', {
      set: function set(value) {
        this._onmidimessage = value;
        if (typeof value === 'function') {
          this.open();
        }
      }
    });

    Object.defineProperty(this, 'onstatechange', { set: function set(value) {
        this._onstatechange = value;
      } });

    this._listeners = new Map().set('midimessage', new Set()).set('statechange', new Set());
    this._inLongSysexMessage = false;
    this._sysexBuffer = new Uint8Array();

    this._jazzInstance = instance;
    this._jazzInstance.inputInUse = true;
    if (_getDevice$generateUUID.getDevice().platform === 'linux') {
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
        if (this._onstatechange !== null) {
          this._onstatechange(evt);
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
      if (_getDevice$generateUUID.getDevice().platform !== 'linux') {
        this._jazzInstance.MidiInOpen(this.name, midiProc.bind(this));
      }
      this.connection = 'open';
      _dispatchEvent.dispatchEvent(this); // dispatch event via MIDIAccess
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.connection === 'closed') {
        return;
      }
      if (_getDevice$generateUUID.getDevice().platform !== 'linux') {
        this._jazzInstance.MidiInClose(this.name);
      }
      this.connection = 'closed';
      _dispatchEvent.dispatchEvent(this); // dispatch event via MIDIAccess
      this._onmidimessage = null;
      this._onstatechange = null;
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
      if (this.onmidimessage) {
        this.onmidimessage(evt);
      }
    } else {
      var e = new _MIDIMessageEvent.MIDIMessageEvent(this, evt.data, evt.receivedTime);
      this.dispatchEvent(e);
    }
  }
};

},{"./midi_access":3,"./midiconnection_event":6,"./midimessage_event":7,"./util":9}],5:[function(require,module,exports){
'use strict';

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _getDevice$generateUUID = require('./util');

'use strict';

var MIDIOutput = (function () {
  function MIDIOutput(info, instance) {
    _classCallCheck(this, MIDIOutput);

    this.id = _getDevice$generateUUID.generateUUID();
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
    if (_getDevice$generateUUID.getDevice().platform === 'linux') {
      this._jazzInstance.MidiOutOpen(this.name);
    }
  }

  _createClass(MIDIOutput, [{
    key: 'open',
    value: function open() {
      if (this.connection === 'open') {
        return;
      }
      if (_getDevice$generateUUID.getDevice().platform !== 'linux') {
        this._jazzInstance.MidiOutOpen(this.name);
      }
      this.connection = 'open';
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.connection === 'closed') {
        return;
      }
      if (_getDevice$generateUUID.getDevice().platform !== 'linux') {
        this._jazzInstance.MidiOutClose(this.name);
      }
      this.connection = 'closed';
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
    key: 'dispatchEvent',

    // addEventListener(type, listener, useCapture){
    //   if(type !== 'statechange'){
    //     return;
    //   }

    //   if(this._listeners.has(listener) === false){
    //     this._listeners.add(listener);
    //   }
    // }

    // removeEventListener(type, listener, useCapture){
    //   if(type !== 'statechange'){
    //     return;
    //   }

    //   if(this._listeners.has(listener) === false){
    //     this._listeners.delete(listener);
    //   }
    // }

    value: function dispatchEvent(evt) {}
  }]);

  return MIDIOutput;
})();

exports.MIDIOutput = MIDIOutput;

// this._listeners.forEach(function(listener){
//   listener(evt);
// });

// if(this._onstatechange !== null){
//   this._onstatechange(evt);
// }

},{"./util":9}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

// required by babelify for transpiling es6
//require('babelify/polyfill');

var _createMIDIAccess$closeAllMIDIInputs = require('./midi_access');

var _polyfill$getDevice = require('./util');

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

},{"./midi_access":3,"./util":9}],9:[function(require,module,exports){
(function (process,__dirname){
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getDevice = getDevice;
exports.polyfillPerformance = polyfillPerformance;
exports.polyfillCustomEvent = polyfillCustomEvent;
exports.generateUUID = generateUUID;
exports.polyfill = polyfill;
'use strict';

// check if the shim is running in nodejs
var inNodeJs = typeof __dirname !== 'undefined' && window.jazzMidi;

exports.inNodeJs = inNodeJs;
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
    if (ua.indexOf('MSIE 9')) {
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

function polyfillCustomEvent() {

  if (typeof window.Event === 'function') {
    return;
  }

  function CustomEvent(event, params) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent('CustomEvent');
    evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
    return evt;
  };

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
  window.CustomEvent = CustomEvent;
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

function polyfill() {
  var device = getDevice();
  // if(device.browser === 'ie'){
  //   polyfillCustomEvent();
  // }
  polyfillPerformance();
}

}).call(this,require('_process'),"/src")

},{"_process":1}]},{},[8])


//# sourceMappingURL=WebMIDIAPIShim.js.map