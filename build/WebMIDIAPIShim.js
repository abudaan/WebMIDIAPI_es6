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
    this.connection = 'closed';

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
      this.onmidimessage = null;
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
    this.connection = 'closed';
    this.onmidimessage = null;
    this.onstatechange = null;

    this._listeners = new Map();
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
    value: function dispatchEvent(evt) {}
  }]);

  return MIDIOutput;
})();

exports.MIDIOutput = MIDIOutput;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9qYXp6LmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9taWRpX2FjY2Vzcy5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaV9pbnB1dC5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaV9vdXRwdXQuanMiLCIvaG9tZS9hYnVkYWFuL3dvcmtzcGFjZS9XZWJNSURJQVBJU2hpbV9lczYvc3JjL21pZGljb25uZWN0aW9uX2V2ZW50LmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9taWRpbWVzc2FnZV9ldmVudC5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvc2hpbS5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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LFFBQVEsR0FBRTtBQUN4QixNQUFJLE1BQU0sR0FBRyxTQUFTLEVBQUUsQ0FBQzs7OztBQUl6QixxQkFBbUIsRUFBRSxDQUFDO0NBQ3ZCIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG52YXIgcXVldWUgPSBbXTtcbnZhciBkcmFpbmluZyA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gdHJ1ZTtcbiAgICB2YXIgY3VycmVudFF1ZXVlO1xuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB2YXIgaSA9IC0xO1xuICAgICAgICB3aGlsZSAoKytpIDwgbGVuKSB7XG4gICAgICAgICAgICBjdXJyZW50UXVldWVbaV0oKTtcbiAgICAgICAgfVxuICAgICAgICBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG59XG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHF1ZXVlLnB1c2goZnVuKTtcbiAgICBpZiAoIWRyYWluaW5nKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Z2V0RGV2aWNlfSBmcm9tICcuL3V0aWwnO1xuXG5jb25zdCBqYXp6UGx1Z2luSW5pdFRpbWUgPSAxMDA7IC8vIG1pbGxpc2Vjb25kc1xuXG5sZXQgamF6ekluc3RhbmNlTnVtYmVyID0gMDtcbmxldCBqYXp6SW5zdGFuY2VzID0gbmV3IE1hcCgpO1xuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSmF6ekluc3RhbmNlKGNhbGxiYWNrKXtcblxuICBsZXQgaWQgPSAnamF6el8nICsgamF6ekluc3RhbmNlTnVtYmVyKysgKyAnJyArIERhdGUubm93KCk7XG4gIGxldCBpbnN0YW5jZTtcbiAgbGV0IG9ialJlZiwgYWN0aXZlWDtcblxuICBpZihnZXREZXZpY2UoKS5ub2RlanMgPT09IHRydWUpe1xuICAgIG9ialJlZiA9IG5ldyB3aW5kb3cuamF6ek1pZGkuTUlESSgpO1xuICB9ZWxzZXtcbiAgICBsZXQgbzEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKTtcbiAgICBvMS5pZCA9IGlkICsgJ2llJztcbiAgICBvMS5jbGFzc2lkID0gJ0NMU0lEOjFBQ0UxNjE4LTFDN0QtNDU2MS1BRUUxLTM0ODQyQUE4NUU5MCc7XG4gICAgYWN0aXZlWCA9IG8xO1xuXG4gICAgbGV0IG8yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2JqZWN0Jyk7XG4gICAgbzIuaWQgPSBpZDtcbiAgICBvMi50eXBlID0gJ2F1ZGlvL3gtamF6eic7XG4gICAgbzEuYXBwZW5kQ2hpbGQobzIpO1xuICAgIG9ialJlZiA9IG8yO1xuXG4gICAgbGV0IGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnVGhpcyBwYWdlIHJlcXVpcmVzIHRoZSAnKSk7XG5cbiAgICBsZXQgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcbiAgICBhLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdKYXp6IHBsdWdpbicpKTtcbiAgICBhLmhyZWYgPSAnaHR0cDovL2phenotc29mdC5uZXQvJztcblxuICAgIGUuYXBwZW5kQ2hpbGQoYSk7XG4gICAgZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnLicpKTtcbiAgICBvMi5hcHBlbmRDaGlsZChlKTtcblxuICAgIGxldCBpbnNlcnRpb25Qb2ludCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdNSURJUGx1Z2luJyk7XG4gICAgaWYoIWluc2VydGlvblBvaW50KSB7XG4gICAgICAvLyBDcmVhdGUgaGlkZGVuIGVsZW1lbnRcbiAgICAgIGluc2VydGlvblBvaW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICBpbnNlcnRpb25Qb2ludC5pZCA9ICdNSURJUGx1Z2luJztcbiAgICAgIGluc2VydGlvblBvaW50LnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgIGluc2VydGlvblBvaW50LnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICAgIGluc2VydGlvblBvaW50LnN0eWxlLmxlZnQgPSAnLTk5OTlweCc7XG4gICAgICBpbnNlcnRpb25Qb2ludC5zdHlsZS50b3AgPSAnLTk5OTlweCc7XG4gICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGluc2VydGlvblBvaW50KTtcbiAgICB9XG4gICAgaW5zZXJ0aW9uUG9pbnQuYXBwZW5kQ2hpbGQobzEpO1xuICB9XG5cblxuICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgaWYob2JqUmVmLmlzSmF6eiA9PT0gdHJ1ZSl7XG4gICAgICBpbnN0YW5jZSA9IG9ialJlZjtcbiAgICB9ZWxzZSBpZihhY3RpdmVYLmlzSmF6eiA9PT0gdHJ1ZSl7XG4gICAgICBpbnN0YW5jZSA9IGFjdGl2ZVg7XG4gICAgfVxuICAgIGlmKGluc3RhbmNlICE9PSB1bmRlZmluZWQpe1xuICAgICAgaW5zdGFuY2UuX3BlcmZUaW1lWmVybyA9IHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKTtcbiAgICAgIGphenpJbnN0YW5jZXMuc2V0KGlkLCBpbnN0YW5jZSk7XG4gICAgfVxuICAgIGNhbGxiYWNrKGluc3RhbmNlKTtcbiAgfSwgamF6elBsdWdpbkluaXRUaW1lKTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0SmF6ekluc3RhbmNlKHR5cGUsIGNhbGxiYWNrKXtcbiAgbGV0IGluc3RhbmNlID0gbnVsbDtcbiAgbGV0IGtleSA9IHR5cGUgPT09ICdpbnB1dCcgPyAnaW5wdXRJblVzZScgOiAnb3V0cHV0SW5Vc2UnO1xuXG4gIGZvcihsZXQgaW5zdCBvZiBqYXp6SW5zdGFuY2VzLnZhbHVlcygpKXtcbiAgICBpZihpbnN0W2tleV0gIT09IHRydWUpe1xuICAgICAgICBpbnN0YW5jZSA9IGluc3Q7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmKGluc3RhbmNlID09PSBudWxsKXtcbiAgICBjcmVhdGVKYXp6SW5zdGFuY2UoY2FsbGJhY2spO1xuICB9ZWxzZXtcbiAgICBjYWxsYmFjayhpbnN0YW5jZSk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtjcmVhdGVKYXp6SW5zdGFuY2UsIGdldEphenpJbnN0YW5jZX0gZnJvbSAnLi9qYXp6JztcbmltcG9ydCB7TUlESUlucHV0fSBmcm9tICcuL21pZGlfaW5wdXQnO1xuaW1wb3J0IHtNSURJT3V0cHV0fSBmcm9tICcuL21pZGlfb3V0cHV0JztcbmltcG9ydCB7TUlESUNvbm5lY3Rpb25FdmVudH0gZnJvbSAnLi9taWRpY29ubmVjdGlvbl9ldmVudCc7XG5cblxubGV0IG1pZGlBY2Nlc3M7XG5sZXQgamF6ekluc3RhbmNlO1xubGV0IGlucHV0c01hcCA9IG5ldyBNYXAoKTtcbmxldCBvdXRwdXRzTWFwID0gbmV3IE1hcCgpO1xubGV0IGxpc3RlbmVycyA9IG5ldyBTZXQoKTtcblxuXG5jbGFzcyBNSURJQWNjZXNze1xuICBjb25zdHJ1Y3RvcihpbnB1dHNNYXAsIG91dHB1dHNNYXApe1xuICAgIHRoaXMuc3lzZXhFbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLmlucHV0cyA9IGlucHV0c01hcDtcbiAgICB0aGlzLm91dHB1dHMgPSBvdXRwdXRzTWFwO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVNSURJQWNjZXNzKCl7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIGV4ZWN1dG9yKHJlc29sdmUsIHJlamVjdCl7XG5cbiAgICBjcmVhdGVKYXp6SW5zdGFuY2UoZnVuY3Rpb24oaW5zdGFuY2Upe1xuICAgICAgaWYoaW5zdGFuY2UgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgIHJlamVjdCh7Y29kZTogMX0pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGphenpJbnN0YW5jZSA9IGluc3RhbmNlO1xuXG4gICAgICBjcmVhdGVNSURJUG9ydHMoZnVuY3Rpb24oKXtcbiAgICAgICAgc2V0dXBMaXN0ZW5lcnMoKTtcbiAgICAgICAgbWlkaUFjY2VzcyA9IG5ldyBNSURJQWNjZXNzKGlucHV0c01hcCwgb3V0cHV0c01hcCk7XG4gICAgICAgIHJlc29sdmUobWlkaUFjY2Vzcyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTUlESVBvcnRzKGNhbGxiYWNrKXtcbiAgbGV0IGlucHV0cyA9IGphenpJbnN0YW5jZS5NaWRpSW5MaXN0KCk7XG4gIGxldCBvdXRwdXRzID0gamF6ekluc3RhbmNlLk1pZGlPdXRMaXN0KCk7XG4gIGxldCBudW1JbnB1dHMgPSBpbnB1dHMubGVuZ3RoO1xuICBsZXQgbnVtT3V0cHV0cyA9IG91dHB1dHMubGVuZ3RoO1xuXG4gIGxvb3BDcmVhdGVNSURJUG9ydCgwLCBudW1JbnB1dHMsICdpbnB1dCcsIGlucHV0cywgZnVuY3Rpb24oKXtcbiAgICBsb29wQ3JlYXRlTUlESVBvcnQoMCwgbnVtT3V0cHV0cywgJ291dHB1dCcsIG91dHB1dHMsIGNhbGxiYWNrKTtcbiAgfSk7XG59XG5cblxuZnVuY3Rpb24gbG9vcENyZWF0ZU1JRElQb3J0KGluZGV4LCBtYXgsIHR5cGUsIGxpc3QsIGNhbGxiYWNrKXtcbiAgaWYoaW5kZXggPCBtYXgpe1xuICAgIGxldCBuYW1lID0gbGlzdFtpbmRleCsrXTtcbiAgICBjcmVhdGVNSURJUG9ydCh0eXBlLCBuYW1lLCBmdW5jdGlvbigpe1xuICAgICAgbG9vcENyZWF0ZU1JRElQb3J0KGluZGV4LCBtYXgsIHR5cGUsIGxpc3QsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfWVsc2V7XG4gICAgY2FsbGJhY2soKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZU1JRElQb3J0KHR5cGUsIG5hbWUsIGNhbGxiYWNrKXtcbiAgZ2V0SmF6ekluc3RhbmNlKHR5cGUsIGZ1bmN0aW9uKGluc3RhbmNlKXtcbiAgICBsZXQgcG9ydDtcbiAgICBsZXQgaW5mbyA9IFtuYW1lLCAnJywgJyddO1xuICAgIGlmKHR5cGUgPT09ICdpbnB1dCcpe1xuICAgICAgaWYoaW5zdGFuY2UuU3VwcG9ydCgnTWlkaUluSW5mbycpKXtcbiAgICAgICAgaW5mbyA9IGluc3RhbmNlLk1pZGlJbkluZm8obmFtZSk7XG4gICAgICB9XG4gICAgICBwb3J0ID0gbmV3IE1JRElJbnB1dChpbmZvLCBpbnN0YW5jZSk7XG4gICAgICBpbnB1dHNNYXAuc2V0KHBvcnQuaWQsIHBvcnQpO1xuICAgIH1lbHNlIGlmKHR5cGUgPT09ICdvdXRwdXQnKXtcbiAgICAgIGlmKGluc3RhbmNlLlN1cHBvcnQoJ01pZGlPdXRJbmZvJykpe1xuICAgICAgICBpbmZvID0gaW5zdGFuY2UuTWlkaU91dEluZm8obmFtZSk7XG4gICAgICB9XG4gICAgICBwb3J0ID0gbmV3IE1JRElPdXRwdXQoaW5mbywgaW5zdGFuY2UpO1xuICAgICAgb3V0cHV0c01hcC5zZXQocG9ydC5pZCwgcG9ydCk7XG4gICAgfVxuICAgIGNhbGxiYWNrKHBvcnQpO1xuICB9KTtcbn1cblxuXG5mdW5jdGlvbiBnZXRQb3J0QnlOYW1lKHBvcnRzLCBuYW1lKXtcbiAgbGV0IHBvcnQ7XG4gIGZvcihwb3J0IG9mIHBvcnRzLnZhbHVlcygpKXtcbiAgICBpZihwb3J0Lm5hbWUgPT09IG5hbWUpe1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBwb3J0O1xufVxuXG5cbmZ1bmN0aW9uIHNldHVwTGlzdGVuZXJzKCl7XG4gIGphenpJbnN0YW5jZS5PbkRpc2Nvbm5lY3RNaWRpSW4oZnVuY3Rpb24obmFtZSl7XG4gICAgbGV0IHBvcnQgPSBnZXRQb3J0QnlOYW1lKGlucHV0c01hcCwgbmFtZSk7XG4gICAgaWYocG9ydCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHBvcnQuc3RhdGUgPSAnZGlzY29ubmVjdGVkJztcbiAgICAgIHBvcnQuY2xvc2UoKTtcbiAgICAgIHBvcnQuX2phenpJbnN0YW5jZS5pbnB1dEluVXNlID0gZmFsc2U7XG4gICAgICBpbnB1dHNNYXAuZGVsZXRlKHBvcnQuaWQpO1xuICAgICAgZGlzcGF0Y2hFdmVudChwb3J0KTtcbiAgICB9XG4gIH0pO1xuXG4gIGphenpJbnN0YW5jZS5PbkRpc2Nvbm5lY3RNaWRpT3V0KGZ1bmN0aW9uKG5hbWUpe1xuICAgIGxldCBwb3J0ID0gZ2V0UG9ydEJ5TmFtZShvdXRwdXRzTWFwLCBuYW1lKTtcbiAgICBpZihwb3J0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgcG9ydC5zdGF0ZSA9ICdkaXNjb25uZWN0ZWQnO1xuICAgICAgcG9ydC5jbG9zZSgpO1xuICAgICAgcG9ydC5famF6ekluc3RhbmNlLm91dHB1dEluVXNlID0gZmFsc2U7XG4gICAgICBvdXRwdXRzTWFwLmRlbGV0ZShwb3J0LmlkKTtcbiAgICAgIGRpc3BhdGNoRXZlbnQocG9ydCk7XG4gICAgfVxuICB9KTtcblxuICBqYXp6SW5zdGFuY2UuT25Db25uZWN0TWlkaUluKGZ1bmN0aW9uKG5hbWUpe1xuICAgIGNyZWF0ZU1JRElQb3J0KCdpbnB1dCcsIG5hbWUsIGZ1bmN0aW9uKHBvcnQpe1xuICAgICAgZGlzcGF0Y2hFdmVudChwb3J0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgamF6ekluc3RhbmNlLk9uQ29ubmVjdE1pZGlPdXQoZnVuY3Rpb24obmFtZSl7XG4gICAgY3JlYXRlTUlESVBvcnQoJ291dHB1dCcsIG5hbWUsIGZ1bmN0aW9uKHBvcnQpe1xuICAgICAgZGlzcGF0Y2hFdmVudChwb3J0KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cblxuZnVuY3Rpb24gYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSl7XG4gIGlmKHR5cGUgIT09ICdzdGF0ZWNoYW5nZScpe1xuICAgIHJldHVybjtcbiAgfVxuICBpZihsaXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gZmFsc2Upe1xuICAgIGxpc3RlbmVycy5zZXQobGlzdGVuZXIpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSl7XG4gIGlmKHR5cGUgIT09ICdzdGF0ZWNoYW5nZScpe1xuICAgIHJldHVybjtcbiAgfVxuICBpZihsaXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gdHJ1ZSl7XG4gICAgbGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChwb3J0KXtcblxuICBwb3J0LmRpc3BhdGNoRXZlbnQobmV3IE1JRElDb25uZWN0aW9uRXZlbnQocG9ydCwgcG9ydCkpO1xuXG4gIGxldCBldnQgPSBuZXcgTUlESUNvbm5lY3Rpb25FdmVudChtaWRpQWNjZXNzLCBwb3J0KTtcblxuICBpZih0eXBlb2YgbWlkaUFjY2Vzcy5vbnN0YXRlY2hhbmdlID09PSAnZnVuY3Rpb24nKXtcbiAgICBtaWRpQWNjZXNzLm9uc3RhdGVjaGFuZ2UoZXZ0KTtcbiAgfVxuICBmb3IobGV0IGxpc3RlbmVyIG9mIGxpc3RlbmVycyl7XG4gICAgbGlzdGVuZXIoZXZ0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZUFsbE1JRElJbnB1dHMoKXtcbiAgaW5wdXRzTWFwLmZvckVhY2goZnVuY3Rpb24oaW5wdXQpe1xuICAgIC8vaW5wdXQuY2xvc2UoKTtcbiAgICBpbnB1dC5famF6ekluc3RhbmNlLk1pZGlJbkNsb3NlKCk7XG4gIH0pO1xufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Z2V0RGV2aWNlLCBnZW5lcmF0ZVVVSUR9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge01JRElNZXNzYWdlRXZlbnR9IGZyb20gJy4vbWlkaW1lc3NhZ2VfZXZlbnQnO1xuaW1wb3J0IHtNSURJQ29ubmVjdGlvbkV2ZW50fSBmcm9tICcuL21pZGljb25uZWN0aW9uX2V2ZW50JztcbmltcG9ydCB7ZGlzcGF0Y2hFdmVudH0gZnJvbSAnLi9taWRpX2FjY2Vzcyc7XG5cbmxldCBtaWRpUHJvYztcbmxldCBub2RlanMgPSBnZXREZXZpY2UoKS5ub2RlanM7XG5cbmV4cG9ydCBjbGFzcyBNSURJSW5wdXR7XG4gIGNvbnN0cnVjdG9yKGluZm8sIGluc3RhbmNlKXtcbiAgICB0aGlzLmlkID0gZ2VuZXJhdGVVVUlEKCk7XG4gICAgdGhpcy5uYW1lID0gaW5mb1swXTtcbiAgICB0aGlzLm1hbnVmYWN0dXJlciA9IGluZm9bMV07XG4gICAgdGhpcy52ZXJzaW9uID0gaW5mb1syXTtcbiAgICB0aGlzLnR5cGUgPSAnaW5wdXQnO1xuICAgIHRoaXMuc3RhdGUgPSAnY29ubmVjdGVkJztcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSAnY2xvc2VkJztcblxuICAgIHRoaXMuX29ubWlkaW1lc3NhZ2UgPSBudWxsO1xuICAgIHRoaXMuX29uc3RhdGVjaGFuZ2UgPSBudWxsO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdvbm1pZGltZXNzYWdlJywge1xuICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgIHRoaXMuX29ubWlkaW1lc3NhZ2UgPSB2YWx1ZTtcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdvbnN0YXRlY2hhbmdlJywge3NldDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgdGhpcy5fb25zdGF0ZWNoYW5nZSA9IHZhbHVlO1xuICAgIH19KTtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBNYXAoKS5zZXQoJ21pZGltZXNzYWdlJywgbmV3IFNldCgpKS5zZXQoJ3N0YXRlY2hhbmdlJywgbmV3IFNldCgpKTtcbiAgICB0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2UgPSBmYWxzZTtcbiAgICB0aGlzLl9zeXNleEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KCk7XG5cbiAgICB0aGlzLl9qYXp6SW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICB0aGlzLl9qYXp6SW5zdGFuY2UuaW5wdXRJblVzZSA9IHRydWU7XG4gICAgaWYoZ2V0RGV2aWNlKCkucGxhdGZvcm0gPT09ICdsaW51eCcpe1xuICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlJbk9wZW4odGhpcy5uYW1lLCBtaWRpUHJvYy5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKXtcbiAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldCh0eXBlKTtcbiAgICBpZihsaXN0ZW5lcnMgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYobGlzdGVuZXJzLmhhcyhsaXN0ZW5lcikgPT09IGZhbHNlKXtcbiAgICAgIGxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpe1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KHR5cGUpO1xuICAgIGlmKGxpc3RlbmVycyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZihsaXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gZmFsc2Upe1xuICAgICAgbGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgcHJldmVudERlZmF1bHQoKXtcbiAgICB0aGlzLl9wdnREZWYgPSB0cnVlO1xuICB9XG5cbiAgZGlzcGF0Y2hFdmVudChldnQpe1xuICAgIHRoaXMuX3B2dERlZiA9IGZhbHNlO1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGV2dC50eXBlKTtcbiAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcil7XG4gICAgICBsaXN0ZW5lcihldnQpO1xuICAgIH0pO1xuXG4gICAgaWYoZXZ0LnR5cGUgPT09ICdtaWRpbWVzc2FnZScpe1xuICAgICAgaWYodGhpcy5fb25taWRpbWVzc2FnZSAhPT0gbnVsbCl7XG4gICAgICAgIHRoaXMuX29ubWlkaW1lc3NhZ2UoZXZ0KTtcbiAgICAgIH1cbiAgICB9ZWxzZSBpZihldnQudHlwZSA9PT0gJ3N0YXRlY2hhbmdlJyl7XG4gICAgICBpZih0aGlzLl9vbnN0YXRlY2hhbmdlICE9PSBudWxsKXtcbiAgICAgICAgdGhpcy5fb25zdGF0ZWNoYW5nZShldnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wdnREZWY7XG4gIH1cblxuICBvcGVuKCl7XG4gICAgaWYodGhpcy5jb25uZWN0aW9uID09PSAnb3Blbicpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSAhPT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaUluT3Blbih0aGlzLm5hbWUsIG1pZGlQcm9jLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSAnb3Blbic7XG4gICAgZGlzcGF0Y2hFdmVudCh0aGlzKTsgLy8gZGlzcGF0Y2ggZXZlbnQgdmlhIE1JRElBY2Nlc3NcbiAgfVxuXG4gIGNsb3NlKCl7XG4gICAgaWYodGhpcy5jb25uZWN0aW9uID09PSAnY2xvc2VkJyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGdldERldmljZSgpLnBsYXRmb3JtICE9PSAnbGludXgnKXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpSW5DbG9zZSh0aGlzLm5hbWUpO1xuICAgIH1cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSAnY2xvc2VkJztcbiAgICBkaXNwYXRjaEV2ZW50KHRoaXMpOyAvLyBkaXNwYXRjaCBldmVudCB2aWEgTUlESUFjY2Vzc1xuICAgIHRoaXMub25taWRpbWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5vbnN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICB0aGlzLl9saXN0ZW5lcnMuZ2V0KCdtaWRpbWVzc2FnZScpLmNsZWFyKCk7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmdldCgnc3RhdGVjaGFuZ2UnKS5jbGVhcigpO1xuICB9XG5cbiAgX2FwcGVuZFRvU3lzZXhCdWZmZXIoZGF0YSl7XG4gICAgbGV0IG9sZExlbmd0aCA9IHRoaXMuX3N5c2V4QnVmZmVyLmxlbmd0aDtcbiAgICBsZXQgdG1wQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkob2xkTGVuZ3RoICsgZGF0YS5sZW5ndGgpO1xuICAgIHRtcEJ1ZmZlci5zZXQodGhpcy5fc3lzZXhCdWZmZXIpO1xuICAgIHRtcEJ1ZmZlci5zZXQoZGF0YSwgb2xkTGVuZ3RoKTtcbiAgICB0aGlzLl9zeXNleEJ1ZmZlciA9IHRtcEJ1ZmZlcjtcbiAgfVxuXG5cbiAgX2J1ZmZlckxvbmdTeXNleChkYXRhLCBpbml0aWFsT2Zmc2V0KXtcbiAgICBsZXQgaiA9IGluaXRpYWxPZmZzZXQ7XG4gICAgd2hpbGUoaiA8ZGF0YS5sZW5ndGgpe1xuICAgICAgaWYoZGF0YVtqXSA9PSAweEY3KXtcbiAgICAgICAgLy8gZW5kIG9mIHN5c2V4IVxuICAgICAgICBqKys7XG4gICAgICAgIHRoaXMuX2FwcGVuZFRvU3lzZXhCdWZmZXIoZGF0YS5zbGljZShpbml0aWFsT2Zmc2V0LCBqKSk7XG4gICAgICAgIHJldHVybiBqO1xuICAgICAgfVxuICAgICAgaisrO1xuICAgIH1cbiAgICAvLyBkaWRuJ3QgcmVhY2ggdGhlIGVuZDsganVzdCB0YWNrIGl0IG9uLlxuICAgIHRoaXMuX2FwcGVuZFRvU3lzZXhCdWZmZXIoZGF0YS5zbGljZShpbml0aWFsT2Zmc2V0LCBqKSk7XG4gICAgdGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlID0gdHJ1ZTtcbiAgICByZXR1cm4gajtcbiAgfVxufVxuXG5cbm1pZGlQcm9jID0gZnVuY3Rpb24odGltZXN0YW1wLCBkYXRhKXtcbiAgbGV0IGxlbmd0aCA9IDA7XG4gIGxldCBpO1xuICBsZXQgaXNTeXNleE1lc3NhZ2UgPSBmYWxzZTtcblxuICAvLyBKYXp6IHNvbWV0aW1lcyBwYXNzZXMgdXMgbXVsdGlwbGUgbWVzc2FnZXMgYXQgb25jZSwgc28gd2UgbmVlZCB0byBwYXJzZSB0aGVtIG91dFxuICAvLyBhbmQgcGFzcyB0aGVtIG9uZSBhdCBhIHRpbWUuXG5cbiAgZm9yKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkgKz0gbGVuZ3RoKXtcbiAgICBsZXQgaXNWYWxpZE1lc3NhZ2UgPSB0cnVlO1xuICAgIGlmKHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSl7XG4gICAgICBpID0gdGhpcy5fYnVmZmVyTG9uZ1N5c2V4KGRhdGEsIGkpO1xuICAgICAgaWYoZGF0YVtpLTFdICE9IDB4Zjcpe1xuICAgICAgICAvLyByYW4gb2ZmIHRoZSBlbmQgd2l0aG91dCBoaXR0aW5nIHRoZSBlbmQgb2YgdGhlIHN5c2V4IG1lc3NhZ2VcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaXNTeXNleE1lc3NhZ2UgPSB0cnVlO1xuICAgIH1lbHNle1xuICAgICAgaXNTeXNleE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgIHN3aXRjaChkYXRhW2ldICYgMHhGMCl7XG4gICAgICAgIGNhc2UgMHgwMDogIC8vIENoZXcgdXAgc3B1cmlvdXMgMHgwMCBieXRlcy4gIEZpeGVzIGEgV2luZG93cyBwcm9ibGVtLlxuICAgICAgICAgIGxlbmd0aCA9IDE7XG4gICAgICAgICAgaXNWYWxpZE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDB4ODA6ICAvLyBub3RlIG9mZlxuICAgICAgICBjYXNlIDB4OTA6ICAvLyBub3RlIG9uXG4gICAgICAgIGNhc2UgMHhBMDogIC8vIHBvbHlwaG9uaWMgYWZ0ZXJ0b3VjaFxuICAgICAgICBjYXNlIDB4QjA6ICAvLyBjb250cm9sIGNoYW5nZVxuICAgICAgICBjYXNlIDB4RTA6ICAvLyBjaGFubmVsIG1vZGVcbiAgICAgICAgICBsZW5ndGggPSAzO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMHhDMDogIC8vIHByb2dyYW0gY2hhbmdlXG4gICAgICAgIGNhc2UgMHhEMDogIC8vIGNoYW5uZWwgYWZ0ZXJ0b3VjaFxuICAgICAgICAgIGxlbmd0aCA9IDI7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAweEYwOlxuICAgICAgICAgIHN3aXRjaChkYXRhW2ldKXtcbiAgICAgICAgICAgIGNhc2UgMHhmMDogIC8vIGxldGlhYmxlLWxlbmd0aCBzeXNleC5cbiAgICAgICAgICAgICAgaSA9IHRoaXMuX2J1ZmZlckxvbmdTeXNleChkYXRhLGkpO1xuICAgICAgICAgICAgICBpZihkYXRhW2ktMV0gIT0gMHhmNyl7XG4gICAgICAgICAgICAgICAgLy8gcmFuIG9mZiB0aGUgZW5kIHdpdGhvdXQgaGl0dGluZyB0aGUgZW5kIG9mIHRoZSBzeXNleCBtZXNzYWdlXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlzU3lzZXhNZXNzYWdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMHhGMTogIC8vIE1UQyBxdWFydGVyIGZyYW1lXG4gICAgICAgICAgICBjYXNlIDB4RjM6ICAvLyBzb25nIHNlbGVjdFxuICAgICAgICAgICAgICBsZW5ndGggPSAyO1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAweEYyOiAgLy8gc29uZyBwb3NpdGlvbiBwb2ludGVyXG4gICAgICAgICAgICAgIGxlbmd0aCA9IDM7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBsZW5ndGggPSAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmKCFpc1ZhbGlkTWVzc2FnZSl7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBsZXQgZXZ0ID0ge307XG4gICAgZXZ0LnJlY2VpdmVkVGltZSA9IHBhcnNlRmxvYXQodGltZXN0YW1wLnRvU3RyaW5nKCkpICsgdGhpcy5famF6ekluc3RhbmNlLl9wZXJmVGltZVplcm87XG5cbiAgICBpZihpc1N5c2V4TWVzc2FnZSB8fCB0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2Upe1xuICAgICAgZXZ0LmRhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLl9zeXNleEJ1ZmZlcik7XG4gICAgICB0aGlzLl9zeXNleEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KDApO1xuICAgICAgdGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlID0gZmFsc2U7XG4gICAgfWVsc2V7XG4gICAgICBldnQuZGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGEuc2xpY2UoaSwgbGVuZ3RoICsgaSkpO1xuICAgIH1cblxuICAgIGlmKG5vZGVqcyl7XG4gICAgICBpZih0aGlzLm9ubWlkaW1lc3NhZ2Upe1xuICAgICAgICB0aGlzLm9ubWlkaW1lc3NhZ2UoZXZ0KTtcbiAgICAgIH1cbiAgICB9ZWxzZXtcbiAgICAgIGxldCBlID0gbmV3IE1JRElNZXNzYWdlRXZlbnQodGhpcywgZXZ0LmRhdGEsIGV2dC5yZWNlaXZlZFRpbWUpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH1cbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Z2V0RGV2aWNlLCBnZW5lcmF0ZVVVSUR9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBNSURJT3V0cHV0e1xuICBjb25zdHJ1Y3RvcihpbmZvLCBpbnN0YW5jZSl7XG4gICAgdGhpcy5pZCA9IGdlbmVyYXRlVVVJRCgpO1xuICAgIHRoaXMubmFtZSA9IGluZm9bMF07XG4gICAgdGhpcy5tYW51ZmFjdHVyZXIgPSBpbmZvWzFdO1xuICAgIHRoaXMudmVyc2lvbiA9IGluZm9bMl07XG4gICAgdGhpcy50eXBlID0gJ291dHB1dCc7XG4gICAgdGhpcy5zdGF0ZSA9ICdjb25uZWN0ZWQnO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdjbG9zZWQnO1xuICAgIHRoaXMub25taWRpbWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5vbnN0YXRlY2hhbmdlID0gbnVsbDtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2UgPSBmYWxzZTtcbiAgICB0aGlzLl9zeXNleEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KCk7XG5cbiAgICB0aGlzLl9qYXp6SW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICB0aGlzLl9qYXp6SW5zdGFuY2Uub3V0cHV0SW5Vc2UgPSB0cnVlO1xuICAgIGlmKGdldERldmljZSgpLnBsYXRmb3JtID09PSAnbGludXgnKXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpT3V0T3Blbih0aGlzLm5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIG9wZW4oKXtcbiAgICBpZih0aGlzLmNvbm5lY3Rpb24gPT09ICdvcGVuJyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGdldERldmljZSgpLnBsYXRmb3JtICE9PSAnbGludXgnKXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpT3V0T3Blbih0aGlzLm5hbWUpO1xuICAgIH1cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSAnb3Blbic7XG4gIH1cblxuICBjbG9zZSgpe1xuICAgIGlmKHRoaXMuY29ubmVjdGlvbiA9PT0gJ2Nsb3NlZCcpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSAhPT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dENsb3NlKHRoaXMubmFtZSk7XG4gICAgfVxuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdjbG9zZWQnO1xuICB9XG5cbiAgc2VuZChkYXRhLCB0aW1lc3RhbXApe1xuICAgIGxldCBkZWxheUJlZm9yZVNlbmQgPSAwO1xuXG4gICAgaWYoZGF0YS5sZW5ndGggPT09IDApe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmKHRpbWVzdGFtcCl7XG4gICAgICBkZWxheUJlZm9yZVNlbmQgPSBNYXRoLmZsb29yKHRpbWVzdGFtcCAtIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSk7XG4gICAgfVxuXG4gICAgaWYodGltZXN0YW1wICYmIChkZWxheUJlZm9yZVNlbmQgPiAxKSl7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpT3V0TG9uZyhkYXRhKTtcbiAgICAgIH0sIGRlbGF5QmVmb3JlU2VuZCk7XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dExvbmcoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZGlzcGF0Y2hFdmVudChldnQpe1xuXG4gIH1cbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjbGFzcyBNSURJQ29ubmVjdGlvbkV2ZW50e1xuICBjb25zdHJ1Y3RvcihtaWRpQWNjZXNzLCBwb3J0KXtcbiAgICB0aGlzLmJ1YmJsZXMgPSBmYWxzZTtcbiAgICB0aGlzLmNhbmNlbEJ1YmJsZSA9IGZhbHNlO1xuICAgIHRoaXMuY2FuY2VsYWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG1pZGlBY2Nlc3M7XG4gICAgdGhpcy5kZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XG4gICAgdGhpcy5ldmVudFBoYXNlID0gMDtcbiAgICB0aGlzLnBhdGggPSBbXTtcbiAgICB0aGlzLnBvcnQgPSBwb3J0O1xuICAgIHRoaXMucmV0dXJuVmFsdWUgPSB0cnVlO1xuICAgIHRoaXMuc3JjRWxlbWVudCA9IG1pZGlBY2Nlc3M7XG4gICAgdGhpcy50YXJnZXQgPSBtaWRpQWNjZXNzO1xuICAgIHRoaXMudGltZVN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLnR5cGUgPSAnc3RhdGVjaGFuZ2UnO1xuICB9XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNsYXNzIE1JRElNZXNzYWdlRXZlbnR7XG4gIGNvbnN0cnVjdG9yKHBvcnQsIGRhdGEsIHJlY2VpdmVkVGltZSl7XG4gICAgdGhpcy5idWJibGVzID0gZmFsc2U7XG4gICAgdGhpcy5jYW5jZWxCdWJibGUgPSBmYWxzZTtcbiAgICB0aGlzLmNhbmNlbGFibGUgPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBwb3J0O1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5kZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XG4gICAgdGhpcy5ldmVudFBoYXNlID0gMDtcbiAgICB0aGlzLnBhdGggPSBbXTtcbiAgICB0aGlzLnJlY2VpdmVkVGltZSA9IHJlY2VpdmVkVGltZTtcbiAgICB0aGlzLnJldHVyblZhbHVlID0gdHJ1ZTtcbiAgICB0aGlzLnNyY0VsZW1lbnQgPSBwb3J0O1xuICAgIHRoaXMudGFyZ2V0ID0gcG9ydDtcbiAgICB0aGlzLnRpbWVTdGFtcCA9IERhdGUubm93KCk7XG4gICAgdGhpcy50eXBlID0gJ21pZGltZXNzYWdlJztcbiAgfVxufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbi8vIHJlcXVpcmVkIGJ5IGJhYmVsaWZ5IGZvciB0cmFuc3BpbGluZyBlczZcbi8vcmVxdWlyZSgnYmFiZWxpZnkvcG9seWZpbGwnKTtcblxuaW1wb3J0IHtjcmVhdGVNSURJQWNjZXNzLCBjbG9zZUFsbE1JRElJbnB1dHN9IGZyb20gJy4vbWlkaV9hY2Nlc3MnO1xuaW1wb3J0IHtwb2x5ZmlsbCwgZ2V0RGV2aWNlfSBmcm9tICcuL3V0aWwnO1xuXG5sZXQgbWlkaUFjY2VzcztcblxuKGZ1bmN0aW9uKCl7XG4gIGlmKCF3aW5kb3cubmF2aWdhdG9yLnJlcXVlc3RNSURJQWNjZXNzKXtcbiAgICBwb2x5ZmlsbCgpO1xuICAgIHdpbmRvdy5uYXZpZ2F0b3IucmVxdWVzdE1JRElBY2Nlc3MgPSBmdW5jdGlvbigpe1xuICAgICAgaWYobWlkaUFjY2VzcyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgICBtaWRpQWNjZXNzID0gY3JlYXRlTUlESUFjY2VzcygpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG1pZGlBY2Nlc3M7XG4gICAgfTtcbiAgICBpZihnZXREZXZpY2UoKS5ub2RlanMgPT09IHRydWUpe1xuICAgICAgd2luZG93Lm5hdmlnYXRvci5jbG9zZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vIE5lZWQgdG8gY2xvc2UgTUlESSBpbnB1dCBwb3J0cywgb3RoZXJ3aXNlIE5vZGUuanMgd2lsbCB3YWl0IGZvciBNSURJIGlucHV0IGZvcmV2ZXIuXG4gICAgICAgIGNsb3NlQWxsTUlESUlucHV0cygpO1xuICAgICAgfTtcbiAgICB9XG4gIH1cbn0oKSk7IiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyBjaGVjayBpZiB0aGUgc2hpbSBpcyBydW5uaW5nIGluIG5vZGVqc1xuZXhwb3J0IGNvbnN0IGluTm9kZUpzID0gKHR5cGVvZiBfX2Rpcm5hbWUgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5qYXp6TWlkaSk7XG5cblxubGV0IGRldmljZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERldmljZSgpe1xuXG4gIGlmKGRldmljZSAhPT0gdW5kZWZpbmVkKXtcbiAgICByZXR1cm4gZGV2aWNlO1xuICB9XG5cbiAgbGV0XG4gICAgcGxhdGZvcm0gPSAndW5kZXRlY3RlZCcsXG4gICAgYnJvd3NlciA9ICd1bmRldGVjdGVkJyxcbiAgICBub2RlanMgPSBmYWxzZTtcblxuICBpZihuYXZpZ2F0b3IgPT09IHVuZGVmaW5lZCl7XG4gICAgbm9kZWpzID0gKHR5cGVvZiBfX2Rpcm5hbWUgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5qYXp6TWlkaSk7XG4gICAgaWYobm9kZWpzID09PSB0cnVlKXtcbiAgICAgIHBsYXRmb3JtID0gcHJvY2Vzcy5wbGF0Zm9ybTtcbiAgICB9XG4gICAgZGV2aWNlID0ge1xuICAgICAgcGxhdGZvcm06IHBsYXRmb3JtLFxuICAgICAgYnJvd3NlcjogZmFsc2UsXG4gICAgICBub2RlanM6IG5vZGVqcyxcbiAgICAgIG1vYmlsZTogcGxhdGZvcm0gPT09ICdpb3MnIHx8IHBsYXRmb3JtID09PSAnYW5kcm9pZCdcbiAgICB9O1xuICAgIHJldHVybiBkZXZpY2U7XG4gIH1cblxuXG4gIGxldCB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgaWYodWEubWF0Y2goLyhpUGFkfGlQaG9uZXxpUG9kKS9nKSl7XG4gICAgcGxhdGZvcm0gPSAnaW9zJztcbiAgfWVsc2UgaWYodWEuaW5kZXhPZignQW5kcm9pZCcpICE9PSAtMSl7XG4gICAgcGxhdGZvcm0gPSAnYW5kcm9pZCc7XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ0xpbnV4JykgIT09IC0xKXtcbiAgICBwbGF0Zm9ybSA9ICdsaW51eCc7XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ01hY2ludG9zaCcpICE9PSAtMSl7XG4gICAgcGxhdGZvcm0gPSAnb3N4JztcbiAgfWVsc2UgaWYodWEuaW5kZXhPZignV2luZG93cycpICE9PSAtMSl7XG4gICAgcGxhdGZvcm0gPSAnd2luZG93cyc7XG4gIH1cblxuICBpZih1YS5pbmRleE9mKCdDaHJvbWUnKSAhPT0gLTEpe1xuICAgIC8vIGNocm9tZSwgY2hyb21pdW0gYW5kIGNhbmFyeVxuICAgIGJyb3dzZXIgPSAnY2hyb21lJztcblxuICAgIGlmKHVhLmluZGV4T2YoJ09QUicpICE9PSAtMSl7XG4gICAgICBicm93c2VyID0gJ29wZXJhJztcbiAgICB9ZWxzZSBpZih1YS5pbmRleE9mKCdDaHJvbWl1bScpICE9PSAtMSl7XG4gICAgICBicm93c2VyID0gJ2Nocm9taXVtJztcbiAgICB9XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ1NhZmFyaScpICE9PSAtMSl7XG4gICAgYnJvd3NlciA9ICdzYWZhcmknO1xuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdGaXJlZm94JykgIT09IC0xKXtcbiAgICBicm93c2VyID0gJ2ZpcmVmb3gnO1xuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdUcmlkZW50JykgIT09IC0xKXtcbiAgICBicm93c2VyID0gJ2llJztcbiAgICBpZih1YS5pbmRleE9mKCdNU0lFIDknKSl7XG4gICAgICBicm93c2VyID0gJ2llIDknO1xuICAgIH1cbiAgfVxuXG4gIGlmKHBsYXRmb3JtID09PSAnaW9zJyl7XG4gICAgaWYodWEuaW5kZXhPZignQ3JpT1MnKSAhPT0gLTEpe1xuICAgICAgYnJvd3NlciA9ICdjaHJvbWUnO1xuICAgIH1cbiAgfVxuXG4gIGRldmljZSA9IHtcbiAgICBwbGF0Zm9ybTogcGxhdGZvcm0sXG4gICAgYnJvd3NlcjogYnJvd3NlcixcbiAgICBtb2JpbGU6IHBsYXRmb3JtID09PSAnaW9zJyB8fCBwbGF0Zm9ybSA9PT0gJ2FuZHJvaWQnLFxuICAgIG5vZGVqczogZmFsc2VcbiAgfTtcbiAgcmV0dXJuIGRldmljZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGxQZXJmb3JtYW5jZSgpe1xuXG4gIGlmKHdpbmRvdy5wZXJmb3JtYW5jZSA9PT0gdW5kZWZpbmVkKXtcbiAgICB3aW5kb3cucGVyZm9ybWFuY2UgPSB7fTtcbiAgfVxuXG4gIERhdGUubm93ID0gKERhdGUubm93IHx8IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9KTtcblxuICBpZih3aW5kb3cucGVyZm9ybWFuY2Uubm93ID09PSB1bmRlZmluZWQpe1xuXG4gICAgbGV0IG5vd09mZnNldCA9IERhdGUubm93KCk7XG5cbiAgICBpZihwZXJmb3JtYW5jZS50aW1pbmcgIT09IHVuZGVmaW5lZCAmJiBwZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgbm93T2Zmc2V0ID0gcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydDtcbiAgICB9XG5cbiAgICB3aW5kb3cucGVyZm9ybWFuY2Uubm93ID0gZnVuY3Rpb24gbm93KCl7XG4gICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIG5vd09mZnNldDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlmaWxsQ3VzdG9tRXZlbnQoKXtcblxuICBpZih0eXBlb2Ygd2luZG93LkV2ZW50ID09PSAnZnVuY3Rpb24nKXtcbiAgICByZXR1cm47XG4gIH1cblxuICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgcGFyYW1zKXtcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwge2J1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiB1bmRlZmluZWR9O1xuICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICAgIHJldHVybiBldnQ7XG4gIH07XG5cbiAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVVVSUQoKXtcbiAgbGV0IGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgbGV0IHV1aWQgPSBuZXcgQXJyYXkoNjQpLmpvaW4oJ3gnKTs7Ly8neHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4JztcbiAgdXVpZCA9IHV1aWQucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgICB2YXIgciA9IChkICsgTWF0aC5yYW5kb20oKSoxNiklMTYgfCAwO1xuICAgICAgZCA9IE1hdGguZmxvb3IoZC8xNik7XG4gICAgICByZXR1cm4gKGM9PSd4JyA/IHIgOiAociYweDN8MHg4KSkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xuICByZXR1cm4gdXVpZDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGwoKXtcbiAgbGV0IGRldmljZSA9IGdldERldmljZSgpO1xuICAvLyBpZihkZXZpY2UuYnJvd3NlciA9PT0gJ2llJyl7XG4gIC8vICAgcG9seWZpbGxDdXN0b21FdmVudCgpO1xuICAvLyB9XG4gIHBvbHlmaWxsUGVyZm9ybWFuY2UoKTtcbn0iXX0=
