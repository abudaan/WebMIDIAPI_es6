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
      port.close();
      port._jazzInstance.inputInUse = false;
      inputsMap['delete'](port.id);
      dispatchEvent(port);
    }
  });

  jazzInstance.OnDisconnectMidiOut(function (name) {
    var port = getPortByName(outputsMap, name);
    if (port !== undefined) {
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
    this.state = 'closed';
    this.connection = 'connected';

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
      if (this.state === 'open') {
        return;
      }
      if (_getDevice$generateUUID.getDevice().platform !== 'linux') {
        this._jazzInstance.MidiInOpen(this.name, midiProc.bind(this));
      }
      this.state = 'open';
      _dispatchEvent.dispatchEvent(this); // dispatch event via MIDIAccess
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.state === 'closed') {
        return;
      }
      if (_getDevice$generateUUID.getDevice().platform !== 'linux') {
        this._jazzInstance.MidiInClose(this.name);
      }
      this.state = 'closed';
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
    this.state = 'closed';
    this.connection = 'connected';
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
      if (_getDevice$generateUUID.getDevice().platform !== 'linux') {
        this._jazzInstance.MidiOutOpen(this.name);
      }
      this.state = 'open';
    }
  }, {
    key: 'close',
    value: function close() {
      if (_getDevice$generateUUID.getDevice().platform !== 'linux') {
        this._jazzInstance.MidiOutClose(this.name);
      }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9qYXp6LmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9taWRpX2FjY2Vzcy5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaV9pbnB1dC5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaV9vdXRwdXQuanMiLCIvaG9tZS9hYnVkYWFuL3dvcmtzcGFjZS9XZWJNSURJQVBJU2hpbV9lczYvc3JjL21pZGljb25uZWN0aW9uX2V2ZW50LmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9taWRpbWVzc2FnZV9ldmVudC5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvc2hpbS5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUM7QUFDN0UsV0FBTyxHQUFHLENBQUM7R0FDWixDQUFDOztBQUVGLGFBQVcsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUM7QUFDL0MsUUFBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7QUFDakMsUUFBTSxDQUFDLFdBQVcsR0FBRyxXQUFXLENBQUM7Q0FDbEM7O0FBR00sU0FBUyxZQUFZLEdBQUU7QUFDNUIsTUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM3QixNQUFJLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQyxNQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDckMsUUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLEVBQUUsQ0FBQSxHQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEMsS0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JCLFdBQU8sQ0FBQyxDQUFDLElBQUUsR0FBRyxHQUFHLENBQUMsR0FBSSxDQUFDLEdBQUMsQ0FBRyxHQUFDLENBQUcsQ0FBQyxDQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUNoRSxDQUFDLENBQUM7QUFDSCxTQUFPLElBQUksQ0FBQztDQUNiOztBQUdNLFNBQVMsUUFBUSxHQUFFO0FBQ3hCLE1BQUksTUFBTSxHQUFHLFNBQVMsRUFBRSxDQUFDOzs7O0FBSXpCLHFCQUFtQixFQUFFLENBQUM7Q0FDdkIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtnZXREZXZpY2V9IGZyb20gJy4vdXRpbCc7XG5cbmNvbnN0IGphenpQbHVnaW5Jbml0VGltZSA9IDEwMDsgLy8gbWlsbGlzZWNvbmRzXG5cbmxldCBqYXp6SW5zdGFuY2VOdW1iZXIgPSAwO1xubGV0IGphenpJbnN0YW5jZXMgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVKYXp6SW5zdGFuY2UoY2FsbGJhY2spe1xuXG4gIGxldCBpZCA9ICdqYXp6XycgKyBqYXp6SW5zdGFuY2VOdW1iZXIrKyArICcnICsgRGF0ZS5ub3coKTtcbiAgbGV0IGluc3RhbmNlO1xuICBsZXQgb2JqUmVmLCBhY3RpdmVYO1xuXG4gIGlmKGdldERldmljZSgpLm5vZGVqcyA9PT0gdHJ1ZSl7XG4gICAgb2JqUmVmID0gbmV3IHdpbmRvdy5qYXp6TWlkaS5NSURJKCk7XG4gIH1lbHNle1xuICAgIGxldCBvMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29iamVjdCcpO1xuICAgIG8xLmlkID0gaWQgKyAnaWUnO1xuICAgIG8xLmNsYXNzaWQgPSAnQ0xTSUQ6MUFDRTE2MTgtMUM3RC00NTYxLUFFRTEtMzQ4NDJBQTg1RTkwJztcbiAgICBhY3RpdmVYID0gbzE7XG5cbiAgICBsZXQgbzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKTtcbiAgICBvMi5pZCA9IGlkO1xuICAgIG8yLnR5cGUgPSAnYXVkaW8veC1qYXp6JztcbiAgICBvMS5hcHBlbmRDaGlsZChvMik7XG4gICAgb2JqUmVmID0gbzI7XG5cbiAgICBsZXQgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdUaGlzIHBhZ2UgcmVxdWlyZXMgdGhlICcpKTtcblxuICAgIGxldCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0phenogcGx1Z2luJykpO1xuICAgIGEuaHJlZiA9ICdodHRwOi8vamF6ei1zb2Z0Lm5ldC8nO1xuXG4gICAgZS5hcHBlbmRDaGlsZChhKTtcbiAgICBlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcuJykpO1xuICAgIG8yLmFwcGVuZENoaWxkKGUpO1xuXG4gICAgbGV0IGluc2VydGlvblBvaW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ01JRElQbHVnaW4nKTtcbiAgICBpZighaW5zZXJ0aW9uUG9pbnQpIHtcbiAgICAgIC8vIENyZWF0ZSBoaWRkZW4gZWxlbWVudFxuICAgICAgaW5zZXJ0aW9uUG9pbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGluc2VydGlvblBvaW50LmlkID0gJ01JRElQbHVnaW4nO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUubGVmdCA9ICctOTk5OXB4JztcbiAgICAgIGluc2VydGlvblBvaW50LnN0eWxlLnRvcCA9ICctOTk5OXB4JztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zZXJ0aW9uUG9pbnQpO1xuICAgIH1cbiAgICBpbnNlcnRpb25Qb2ludC5hcHBlbmRDaGlsZChvMSk7XG4gIH1cblxuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICBpZihvYmpSZWYuaXNKYXp6ID09PSB0cnVlKXtcbiAgICAgIGluc3RhbmNlID0gb2JqUmVmO1xuICAgIH1lbHNlIGlmKGFjdGl2ZVguaXNKYXp6ID09PSB0cnVlKXtcbiAgICAgIGluc3RhbmNlID0gYWN0aXZlWDtcbiAgICB9XG4gICAgaWYoaW5zdGFuY2UgIT09IHVuZGVmaW5lZCl7XG4gICAgICBpbnN0YW5jZS5fcGVyZlRpbWVaZXJvID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgamF6ekluc3RhbmNlcy5zZXQoaWQsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgY2FsbGJhY2soaW5zdGFuY2UpO1xuICB9LCBqYXp6UGx1Z2luSW5pdFRpbWUpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRKYXp6SW5zdGFuY2UodHlwZSwgY2FsbGJhY2spe1xuICBsZXQgaW5zdGFuY2UgPSBudWxsO1xuICBsZXQga2V5ID0gdHlwZSA9PT0gJ2lucHV0JyA/ICdpbnB1dEluVXNlJyA6ICdvdXRwdXRJblVzZSc7XG5cbiAgZm9yKGxldCBpbnN0IG9mIGphenpJbnN0YW5jZXMudmFsdWVzKCkpe1xuICAgIGlmKGluc3Rba2V5XSAhPT0gdHJ1ZSl7XG4gICAgICAgIGluc3RhbmNlID0gaW5zdDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYoaW5zdGFuY2UgPT09IG51bGwpe1xuICAgIGNyZWF0ZUphenpJbnN0YW5jZShjYWxsYmFjayk7XG4gIH1lbHNle1xuICAgIGNhbGxiYWNrKGluc3RhbmNlKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2NyZWF0ZUphenpJbnN0YW5jZSwgZ2V0SmF6ekluc3RhbmNlfSBmcm9tICcuL2phenonO1xuaW1wb3J0IHtNSURJSW5wdXR9IGZyb20gJy4vbWlkaV9pbnB1dCc7XG5pbXBvcnQge01JRElPdXRwdXR9IGZyb20gJy4vbWlkaV9vdXRwdXQnO1xuaW1wb3J0IHtNSURJQ29ubmVjdGlvbkV2ZW50fSBmcm9tICcuL21pZGljb25uZWN0aW9uX2V2ZW50JztcblxuXG5sZXQgbWlkaUFjY2VzcztcbmxldCBqYXp6SW5zdGFuY2U7XG5sZXQgaW5wdXRzTWFwID0gbmV3IE1hcCgpO1xubGV0IG91dHB1dHNNYXAgPSBuZXcgTWFwKCk7XG5sZXQgbGlzdGVuZXJzID0gbmV3IFNldCgpO1xuXG5cbmNsYXNzIE1JRElBY2Nlc3N7XG4gIGNvbnN0cnVjdG9yKGlucHV0c01hcCwgb3V0cHV0c01hcCl7XG4gICAgdGhpcy5zeXNleEVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuaW5wdXRzID0gaW5wdXRzTWFwO1xuICAgIHRoaXMub3V0cHV0cyA9IG91dHB1dHNNYXA7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1JRElBY2Nlc3MoKXtcblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZXhlY3V0b3IocmVzb2x2ZSwgcmVqZWN0KXtcblxuICAgIGNyZWF0ZUphenpJbnN0YW5jZShmdW5jdGlvbihpbnN0YW5jZSl7XG4gICAgICBpZihpbnN0YW5jZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgcmVqZWN0KHtjb2RlOiAxfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgamF6ekluc3RhbmNlID0gaW5zdGFuY2U7XG5cbiAgICAgIGNyZWF0ZU1JRElQb3J0cyhmdW5jdGlvbigpe1xuICAgICAgICBzZXR1cExpc3RlbmVycygpO1xuICAgICAgICBtaWRpQWNjZXNzID0gbmV3IE1JRElBY2Nlc3MoaW5wdXRzTWFwLCBvdXRwdXRzTWFwKTtcbiAgICAgICAgcmVzb2x2ZShtaWRpQWNjZXNzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNSURJUG9ydHMoY2FsbGJhY2spe1xuICBsZXQgaW5wdXRzID0gamF6ekluc3RhbmNlLk1pZGlJbkxpc3QoKTtcbiAgbGV0IG91dHB1dHMgPSBqYXp6SW5zdGFuY2UuTWlkaU91dExpc3QoKTtcbiAgbGV0IG51bUlucHV0cyA9IGlucHV0cy5sZW5ndGg7XG4gIGxldCBudW1PdXRwdXRzID0gb3V0cHV0cy5sZW5ndGg7XG5cbiAgbG9vcENyZWF0ZU1JRElQb3J0KDAsIG51bUlucHV0cywgJ2lucHV0JywgaW5wdXRzLCBmdW5jdGlvbigpe1xuICAgIGxvb3BDcmVhdGVNSURJUG9ydCgwLCBudW1PdXRwdXRzLCAnb3V0cHV0Jywgb3V0cHV0cywgY2FsbGJhY2spO1xuICB9KTtcbn1cblxuXG5mdW5jdGlvbiBsb29wQ3JlYXRlTUlESVBvcnQoaW5kZXgsIG1heCwgdHlwZSwgbGlzdCwgY2FsbGJhY2spe1xuICBpZihpbmRleCA8IG1heCl7XG4gICAgbGV0IG5hbWUgPSBsaXN0W2luZGV4KytdO1xuICAgIGNyZWF0ZU1JRElQb3J0KHR5cGUsIG5hbWUsIGZ1bmN0aW9uKCl7XG4gICAgICBsb29wQ3JlYXRlTUlESVBvcnQoaW5kZXgsIG1heCwgdHlwZSwgbGlzdCwgY2FsbGJhY2spO1xuICAgIH0pO1xuICB9ZWxzZXtcbiAgICBjYWxsYmFjaygpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlTUlESVBvcnQodHlwZSwgbmFtZSwgY2FsbGJhY2spe1xuICBnZXRKYXp6SW5zdGFuY2UodHlwZSwgZnVuY3Rpb24oaW5zdGFuY2Upe1xuICAgIGxldCBwb3J0O1xuICAgIGxldCBpbmZvID0gW25hbWUsICcnLCAnJ107XG4gICAgaWYodHlwZSA9PT0gJ2lucHV0Jyl7XG4gICAgICBpZihpbnN0YW5jZS5TdXBwb3J0KCdNaWRpSW5JbmZvJykpe1xuICAgICAgICBpbmZvID0gaW5zdGFuY2UuTWlkaUluSW5mbyhuYW1lKTtcbiAgICAgIH1cbiAgICAgIHBvcnQgPSBuZXcgTUlESUlucHV0KGluZm8sIGluc3RhbmNlKTtcbiAgICAgIGlucHV0c01hcC5zZXQocG9ydC5pZCwgcG9ydCk7XG4gICAgfWVsc2UgaWYodHlwZSA9PT0gJ291dHB1dCcpe1xuICAgICAgaWYoaW5zdGFuY2UuU3VwcG9ydCgnTWlkaU91dEluZm8nKSl7XG4gICAgICAgIGluZm8gPSBpbnN0YW5jZS5NaWRpT3V0SW5mbyhuYW1lKTtcbiAgICAgIH1cbiAgICAgIHBvcnQgPSBuZXcgTUlESU91dHB1dChpbmZvLCBpbnN0YW5jZSk7XG4gICAgICBvdXRwdXRzTWFwLnNldChwb3J0LmlkLCBwb3J0KTtcbiAgICB9XG4gICAgY2FsbGJhY2socG9ydCk7XG4gIH0pO1xufVxuXG5cbmZ1bmN0aW9uIGdldFBvcnRCeU5hbWUocG9ydHMsIG5hbWUpe1xuICBsZXQgcG9ydDtcbiAgZm9yKHBvcnQgb2YgcG9ydHMudmFsdWVzKCkpe1xuICAgIGlmKHBvcnQubmFtZSA9PT0gbmFtZSl7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBvcnQ7XG59XG5cblxuZnVuY3Rpb24gc2V0dXBMaXN0ZW5lcnMoKXtcbiAgamF6ekluc3RhbmNlLk9uRGlzY29ubmVjdE1pZGlJbihmdW5jdGlvbihuYW1lKXtcbiAgICBsZXQgcG9ydCA9IGdldFBvcnRCeU5hbWUoaW5wdXRzTWFwLCBuYW1lKTtcbiAgICBpZihwb3J0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgcG9ydC5jbG9zZSgpO1xuICAgICAgcG9ydC5famF6ekluc3RhbmNlLmlucHV0SW5Vc2UgPSBmYWxzZTtcbiAgICAgIGlucHV0c01hcC5kZWxldGUocG9ydC5pZCk7XG4gICAgICBkaXNwYXRjaEV2ZW50KHBvcnQpO1xuICAgIH1cbiAgfSk7XG5cbiAgamF6ekluc3RhbmNlLk9uRGlzY29ubmVjdE1pZGlPdXQoZnVuY3Rpb24obmFtZSl7XG4gICAgbGV0IHBvcnQgPSBnZXRQb3J0QnlOYW1lKG91dHB1dHNNYXAsIG5hbWUpO1xuICAgIGlmKHBvcnQgIT09IHVuZGVmaW5lZCl7XG4gICAgICBwb3J0LmNsb3NlKCk7XG4gICAgICBwb3J0Ll9qYXp6SW5zdGFuY2Uub3V0cHV0SW5Vc2UgPSBmYWxzZTtcbiAgICAgIG91dHB1dHNNYXAuZGVsZXRlKHBvcnQuaWQpO1xuICAgICAgZGlzcGF0Y2hFdmVudChwb3J0KTtcbiAgICB9XG4gIH0pO1xuXG4gIGphenpJbnN0YW5jZS5PbkNvbm5lY3RNaWRpSW4oZnVuY3Rpb24obmFtZSl7XG4gICAgY3JlYXRlTUlESVBvcnQoJ2lucHV0JywgbmFtZSwgZnVuY3Rpb24ocG9ydCl7XG4gICAgICBkaXNwYXRjaEV2ZW50KHBvcnQpO1xuICAgIH0pO1xuICB9KTtcblxuICBqYXp6SW5zdGFuY2UuT25Db25uZWN0TWlkaU91dChmdW5jdGlvbihuYW1lKXtcbiAgICBjcmVhdGVNSURJUG9ydCgnb3V0cHV0JywgbmFtZSwgZnVuY3Rpb24ocG9ydCl7XG4gICAgICBkaXNwYXRjaEV2ZW50KHBvcnQpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuXG5mdW5jdGlvbiBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKXtcbiAgaWYodHlwZSAhPT0gJ3N0YXRlY2hhbmdlJyl7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmKGxpc3RlbmVycy5oYXMobGlzdGVuZXIpID09PSBmYWxzZSl7XG4gICAgbGlzdGVuZXJzLnNldChsaXN0ZW5lcik7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiByZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKXtcbiAgaWYodHlwZSAhPT0gJ3N0YXRlY2hhbmdlJyl7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmKGxpc3RlbmVycy5oYXMobGlzdGVuZXIpID09PSB0cnVlKXtcbiAgICBsaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaEV2ZW50KHBvcnQpe1xuXG4gIHBvcnQuZGlzcGF0Y2hFdmVudChuZXcgTUlESUNvbm5lY3Rpb25FdmVudChwb3J0LCBwb3J0KSk7XG5cbiAgbGV0IGV2dCA9IG5ldyBNSURJQ29ubmVjdGlvbkV2ZW50KG1pZGlBY2Nlc3MsIHBvcnQpO1xuXG4gIGlmKHR5cGVvZiBtaWRpQWNjZXNzLm9uc3RhdGVjaGFuZ2UgPT09ICdmdW5jdGlvbicpe1xuICAgIG1pZGlBY2Nlc3Mub25zdGF0ZWNoYW5nZShldnQpO1xuICB9XG4gIGZvcihsZXQgbGlzdGVuZXIgb2YgbGlzdGVuZXJzKXtcbiAgICBsaXN0ZW5lcihldnQpO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlQWxsTUlESUlucHV0cygpe1xuICBpbnB1dHNNYXAuZm9yRWFjaChmdW5jdGlvbihpbnB1dCl7XG4gICAgLy9pbnB1dC5jbG9zZSgpO1xuICAgIGlucHV0Ll9qYXp6SW5zdGFuY2UuTWlkaUluQ2xvc2UoKTtcbiAgfSk7XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtnZXREZXZpY2UsIGdlbmVyYXRlVVVJRH0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7TUlESU1lc3NhZ2VFdmVudH0gZnJvbSAnLi9taWRpbWVzc2FnZV9ldmVudCc7XG5pbXBvcnQge01JRElDb25uZWN0aW9uRXZlbnR9IGZyb20gJy4vbWlkaWNvbm5lY3Rpb25fZXZlbnQnO1xuaW1wb3J0IHtkaXNwYXRjaEV2ZW50fSBmcm9tICcuL21pZGlfYWNjZXNzJztcblxubGV0IG1pZGlQcm9jO1xubGV0IG5vZGVqcyA9IGdldERldmljZSgpLm5vZGVqcztcblxuZXhwb3J0IGNsYXNzIE1JRElJbnB1dHtcbiAgY29uc3RydWN0b3IoaW5mbywgaW5zdGFuY2Upe1xuICAgIHRoaXMuaWQgPSBnZW5lcmF0ZVVVSUQoKTtcbiAgICB0aGlzLm5hbWUgPSBpbmZvWzBdO1xuICAgIHRoaXMubWFudWZhY3R1cmVyID0gaW5mb1sxXTtcbiAgICB0aGlzLnZlcnNpb24gPSBpbmZvWzJdO1xuICAgIHRoaXMudHlwZSA9ICdpbnB1dCc7XG4gICAgdGhpcy5zdGF0ZSA9ICdjbG9zZWQnO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdjb25uZWN0ZWQnO1xuXG4gICAgdGhpcy5fb25taWRpbWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5fb25zdGF0ZWNoYW5nZSA9IG51bGw7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ29ubWlkaW1lc3NhZ2UnLCB7XG4gICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fb25taWRpbWVzc2FnZSA9IHZhbHVlO1xuICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpe1xuICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ29uc3RhdGVjaGFuZ2UnLCB7c2V0OiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICB0aGlzLl9vbnN0YXRlY2hhbmdlID0gdmFsdWU7XG4gICAgfX0pO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gbmV3IE1hcCgpLnNldCgnbWlkaW1lc3NhZ2UnLCBuZXcgU2V0KCkpLnNldCgnc3RhdGVjaGFuZ2UnLCBuZXcgU2V0KCkpO1xuICAgIHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSA9IGZhbHNlO1xuICAgIHRoaXMuX3N5c2V4QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoKTtcblxuICAgIHRoaXMuX2phenpJbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgIHRoaXMuX2phenpJbnN0YW5jZS5pbnB1dEluVXNlID0gdHJ1ZTtcbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaUluT3Blbih0aGlzLm5hbWUsIG1pZGlQcm9jLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIGFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpe1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KHR5cGUpO1xuICAgIGlmKGxpc3RlbmVycyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZihsaXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gZmFsc2Upe1xuICAgICAgbGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSl7XG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQodHlwZSk7XG4gICAgaWYobGlzdGVuZXJzID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKGxpc3RlbmVycy5oYXMobGlzdGVuZXIpID09PSBmYWxzZSl7XG4gICAgICBsaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICBwcmV2ZW50RGVmYXVsdCgpe1xuICAgIHRoaXMuX3B2dERlZiA9IHRydWU7XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KGV2dCl7XG4gICAgdGhpcy5fcHZ0RGVmID0gZmFsc2U7XG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoZXZ0LnR5cGUpO1xuICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKXtcbiAgICAgIGxpc3RlbmVyKGV2dCk7XG4gICAgfSk7XG5cbiAgICBpZihldnQudHlwZSA9PT0gJ21pZGltZXNzYWdlJyl7XG4gICAgICBpZih0aGlzLl9vbm1pZGltZXNzYWdlICE9PSBudWxsKXtcbiAgICAgICAgdGhpcy5fb25taWRpbWVzc2FnZShldnQpO1xuICAgICAgfVxuICAgIH1lbHNlIGlmKGV2dC50eXBlID09PSAnc3RhdGVjaGFuZ2UnKXtcbiAgICAgIGlmKHRoaXMuX29uc3RhdGVjaGFuZ2UgIT09IG51bGwpe1xuICAgICAgICB0aGlzLl9vbnN0YXRlY2hhbmdlKGV2dCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3B2dERlZjtcbiAgfVxuXG4gIG9wZW4oKXtcbiAgICBpZih0aGlzLnN0YXRlID09PSAnb3Blbicpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSAhPT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaUluT3Blbih0aGlzLm5hbWUsIG1pZGlQcm9jLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlID0gJ29wZW4nO1xuICAgIGRpc3BhdGNoRXZlbnQodGhpcyk7IC8vIGRpc3BhdGNoIGV2ZW50IHZpYSBNSURJQWNjZXNzXG4gIH1cblxuICBjbG9zZSgpe1xuICAgIGlmKHRoaXMuc3RhdGUgPT09ICdjbG9zZWQnKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoZ2V0RGV2aWNlKCkucGxhdGZvcm0gIT09ICdsaW51eCcpe1xuICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlJbkNsb3NlKHRoaXMubmFtZSk7XG4gICAgfVxuICAgIHRoaXMuc3RhdGUgPSAnY2xvc2VkJztcbiAgICBkaXNwYXRjaEV2ZW50KHRoaXMpOyAvLyBkaXNwYXRjaCBldmVudCB2aWEgTUlESUFjY2Vzc1xuICAgIHRoaXMub25taWRpbWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5vbnN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICB0aGlzLl9saXN0ZW5lcnMuZ2V0KCdtaWRpbWVzc2FnZScpLmNsZWFyKCk7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmdldCgnc3RhdGVjaGFuZ2UnKS5jbGVhcigpO1xuICB9XG5cbiAgX2FwcGVuZFRvU3lzZXhCdWZmZXIoZGF0YSl7XG4gICAgbGV0IG9sZExlbmd0aCA9IHRoaXMuX3N5c2V4QnVmZmVyLmxlbmd0aDtcbiAgICBsZXQgdG1wQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkob2xkTGVuZ3RoICsgZGF0YS5sZW5ndGgpO1xuICAgIHRtcEJ1ZmZlci5zZXQodGhpcy5fc3lzZXhCdWZmZXIpO1xuICAgIHRtcEJ1ZmZlci5zZXQoZGF0YSwgb2xkTGVuZ3RoKTtcbiAgICB0aGlzLl9zeXNleEJ1ZmZlciA9IHRtcEJ1ZmZlcjtcbiAgfVxuXG5cbiAgX2J1ZmZlckxvbmdTeXNleChkYXRhLCBpbml0aWFsT2Zmc2V0KXtcbiAgICBsZXQgaiA9IGluaXRpYWxPZmZzZXQ7XG4gICAgd2hpbGUoaiA8ZGF0YS5sZW5ndGgpe1xuICAgICAgaWYoZGF0YVtqXSA9PSAweEY3KXtcbiAgICAgICAgLy8gZW5kIG9mIHN5c2V4IVxuICAgICAgICBqKys7XG4gICAgICAgIHRoaXMuX2FwcGVuZFRvU3lzZXhCdWZmZXIoZGF0YS5zbGljZShpbml0aWFsT2Zmc2V0LCBqKSk7XG4gICAgICAgIHJldHVybiBqO1xuICAgICAgfVxuICAgICAgaisrO1xuICAgIH1cbiAgICAvLyBkaWRuJ3QgcmVhY2ggdGhlIGVuZDsganVzdCB0YWNrIGl0IG9uLlxuICAgIHRoaXMuX2FwcGVuZFRvU3lzZXhCdWZmZXIoZGF0YS5zbGljZShpbml0aWFsT2Zmc2V0LCBqKSk7XG4gICAgdGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlID0gdHJ1ZTtcbiAgICByZXR1cm4gajtcbiAgfVxufVxuXG5cbm1pZGlQcm9jID0gZnVuY3Rpb24odGltZXN0YW1wLCBkYXRhKXtcbiAgbGV0IGxlbmd0aCA9IDA7XG4gIGxldCBpO1xuICBsZXQgaXNTeXNleE1lc3NhZ2UgPSBmYWxzZTtcblxuICAvLyBKYXp6IHNvbWV0aW1lcyBwYXNzZXMgdXMgbXVsdGlwbGUgbWVzc2FnZXMgYXQgb25jZSwgc28gd2UgbmVlZCB0byBwYXJzZSB0aGVtIG91dFxuICAvLyBhbmQgcGFzcyB0aGVtIG9uZSBhdCBhIHRpbWUuXG5cbiAgZm9yKGkgPSAwOyBpIDwgZGF0YS5sZW5ndGg7IGkgKz0gbGVuZ3RoKXtcbiAgICBsZXQgaXNWYWxpZE1lc3NhZ2UgPSB0cnVlO1xuICAgIGlmKHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSl7XG4gICAgICBpID0gdGhpcy5fYnVmZmVyTG9uZ1N5c2V4KGRhdGEsIGkpO1xuICAgICAgaWYoZGF0YVtpLTFdICE9IDB4Zjcpe1xuICAgICAgICAvLyByYW4gb2ZmIHRoZSBlbmQgd2l0aG91dCBoaXR0aW5nIHRoZSBlbmQgb2YgdGhlIHN5c2V4IG1lc3NhZ2VcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaXNTeXNleE1lc3NhZ2UgPSB0cnVlO1xuICAgIH1lbHNle1xuICAgICAgaXNTeXNleE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgIHN3aXRjaChkYXRhW2ldICYgMHhGMCl7XG4gICAgICAgIGNhc2UgMHgwMDogIC8vIENoZXcgdXAgc3B1cmlvdXMgMHgwMCBieXRlcy4gIEZpeGVzIGEgV2luZG93cyBwcm9ibGVtLlxuICAgICAgICAgIGxlbmd0aCA9IDE7XG4gICAgICAgICAgaXNWYWxpZE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDB4ODA6ICAvLyBub3RlIG9mZlxuICAgICAgICBjYXNlIDB4OTA6ICAvLyBub3RlIG9uXG4gICAgICAgIGNhc2UgMHhBMDogIC8vIHBvbHlwaG9uaWMgYWZ0ZXJ0b3VjaFxuICAgICAgICBjYXNlIDB4QjA6ICAvLyBjb250cm9sIGNoYW5nZVxuICAgICAgICBjYXNlIDB4RTA6ICAvLyBjaGFubmVsIG1vZGVcbiAgICAgICAgICBsZW5ndGggPSAzO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMHhDMDogIC8vIHByb2dyYW0gY2hhbmdlXG4gICAgICAgIGNhc2UgMHhEMDogIC8vIGNoYW5uZWwgYWZ0ZXJ0b3VjaFxuICAgICAgICAgIGxlbmd0aCA9IDI7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAweEYwOlxuICAgICAgICAgIHN3aXRjaChkYXRhW2ldKXtcbiAgICAgICAgICAgIGNhc2UgMHhmMDogIC8vIGxldGlhYmxlLWxlbmd0aCBzeXNleC5cbiAgICAgICAgICAgICAgaSA9IHRoaXMuX2J1ZmZlckxvbmdTeXNleChkYXRhLGkpO1xuICAgICAgICAgICAgICBpZihkYXRhW2ktMV0gIT0gMHhmNyl7XG4gICAgICAgICAgICAgICAgLy8gcmFuIG9mZiB0aGUgZW5kIHdpdGhvdXQgaGl0dGluZyB0aGUgZW5kIG9mIHRoZSBzeXNleCBtZXNzYWdlXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlzU3lzZXhNZXNzYWdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMHhGMTogIC8vIE1UQyBxdWFydGVyIGZyYW1lXG4gICAgICAgICAgICBjYXNlIDB4RjM6ICAvLyBzb25nIHNlbGVjdFxuICAgICAgICAgICAgICBsZW5ndGggPSAyO1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAweEYyOiAgLy8gc29uZyBwb3NpdGlvbiBwb2ludGVyXG4gICAgICAgICAgICAgIGxlbmd0aCA9IDM7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBsZW5ndGggPSAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmKCFpc1ZhbGlkTWVzc2FnZSl7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBsZXQgZXZ0ID0ge307XG4gICAgZXZ0LnJlY2VpdmVkVGltZSA9IHBhcnNlRmxvYXQodGltZXN0YW1wLnRvU3RyaW5nKCkpICsgdGhpcy5famF6ekluc3RhbmNlLl9wZXJmVGltZVplcm87XG5cbiAgICBpZihpc1N5c2V4TWVzc2FnZSB8fCB0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2Upe1xuICAgICAgZXZ0LmRhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLl9zeXNleEJ1ZmZlcik7XG4gICAgICB0aGlzLl9zeXNleEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KDApO1xuICAgICAgdGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlID0gZmFsc2U7XG4gICAgfWVsc2V7XG4gICAgICBldnQuZGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGEuc2xpY2UoaSwgbGVuZ3RoICsgaSkpO1xuICAgIH1cblxuICAgIGlmKG5vZGVqcyl7XG4gICAgICBpZih0aGlzLm9ubWlkaW1lc3NhZ2Upe1xuICAgICAgICB0aGlzLm9ubWlkaW1lc3NhZ2UoZXZ0KTtcbiAgICAgIH1cbiAgICB9ZWxzZXtcbiAgICAgIGxldCBlID0gbmV3IE1JRElNZXNzYWdlRXZlbnQodGhpcywgZXZ0LmRhdGEsIGV2dC5yZWNlaXZlZFRpbWUpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH1cbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Z2V0RGV2aWNlLCBnZW5lcmF0ZVVVSUR9IGZyb20gJy4vdXRpbCc7XG5cbmV4cG9ydCBjbGFzcyBNSURJT3V0cHV0e1xuICBjb25zdHJ1Y3RvcihpbmZvLCBpbnN0YW5jZSl7XG4gICAgdGhpcy5pZCA9IGdlbmVyYXRlVVVJRCgpO1xuICAgIHRoaXMubmFtZSA9IGluZm9bMF07XG4gICAgdGhpcy5tYW51ZmFjdHVyZXIgPSBpbmZvWzFdO1xuICAgIHRoaXMudmVyc2lvbiA9IGluZm9bMl07XG4gICAgdGhpcy50eXBlID0gJ291dHB1dCc7XG4gICAgdGhpcy5zdGF0ZSA9ICdjbG9zZWQnO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdjb25uZWN0ZWQnO1xuICAgIHRoaXMub25taWRpbWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5vbnN0YXRlY2hhbmdlID0gbnVsbDtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2UgPSBmYWxzZTtcbiAgICB0aGlzLl9zeXNleEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KCk7XG5cbiAgICB0aGlzLl9qYXp6SW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICB0aGlzLl9qYXp6SW5zdGFuY2Uub3V0cHV0SW5Vc2UgPSB0cnVlO1xuICAgIGlmKGdldERldmljZSgpLnBsYXRmb3JtID09PSAnbGludXgnKXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpT3V0T3Blbih0aGlzLm5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIG9wZW4oKXtcbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSAhPT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dE9wZW4odGhpcy5uYW1lKTtcbiAgICB9XG4gICAgdGhpcy5zdGF0ZSA9ICdvcGVuJztcbiAgfVxuXG4gIGNsb3NlKCl7XG4gICAgaWYoZ2V0RGV2aWNlKCkucGxhdGZvcm0gIT09ICdsaW51eCcpe1xuICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlPdXRDbG9zZSh0aGlzLm5hbWUpO1xuICAgIH1cbiAgICB0aGlzLnN0YXRlID0gJ2Nsb3NlZCc7XG4gIH1cblxuICBzZW5kKGRhdGEsIHRpbWVzdGFtcCl7XG4gICAgbGV0IGRlbGF5QmVmb3JlU2VuZCA9IDA7XG5cbiAgICBpZihkYXRhLmxlbmd0aCA9PT0gMCl7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgaWYodGltZXN0YW1wKXtcbiAgICAgIGRlbGF5QmVmb3JlU2VuZCA9IE1hdGguZmxvb3IodGltZXN0YW1wIC0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpKTtcbiAgICB9XG5cbiAgICBpZih0aW1lc3RhbXAgJiYgKGRlbGF5QmVmb3JlU2VuZCA+IDEpKXtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlPdXRMb25nKGRhdGEpO1xuICAgICAgfSwgZGVsYXlCZWZvcmVTZW5kKTtcbiAgICB9ZWxzZXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpT3V0TG9uZyhkYXRhKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KGV2dCl7XG5cbiAgfVxufSIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNsYXNzIE1JRElDb25uZWN0aW9uRXZlbnR7XG4gIGNvbnN0cnVjdG9yKG1pZGlBY2Nlc3MsIHBvcnQpe1xuICAgIHRoaXMuYnViYmxlcyA9IGZhbHNlO1xuICAgIHRoaXMuY2FuY2VsQnViYmxlID0gZmFsc2U7XG4gICAgdGhpcy5jYW5jZWxhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gbWlkaUFjY2VzcztcbiAgICB0aGlzLmRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmV2ZW50UGhhc2UgPSAwO1xuICAgIHRoaXMucGF0aCA9IFtdO1xuICAgIHRoaXMucG9ydCA9IHBvcnQ7XG4gICAgdGhpcy5yZXR1cm5WYWx1ZSA9IHRydWU7XG4gICAgdGhpcy5zcmNFbGVtZW50ID0gbWlkaUFjY2VzcztcbiAgICB0aGlzLnRhcmdldCA9IG1pZGlBY2Nlc3M7XG4gICAgdGhpcy50aW1lU3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMudHlwZSA9ICdzdGF0ZWNoYW5nZSc7XG4gIH1cbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgY2xhc3MgTUlESU1lc3NhZ2VFdmVudHtcbiAgY29uc3RydWN0b3IocG9ydCwgZGF0YSwgcmVjZWl2ZWRUaW1lKXtcbiAgICB0aGlzLmJ1YmJsZXMgPSBmYWxzZTtcbiAgICB0aGlzLmNhbmNlbEJ1YmJsZSA9IGZhbHNlO1xuICAgIHRoaXMuY2FuY2VsYWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IHBvcnQ7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmRlZmF1bHRQcmV2ZW50ZWQgPSBmYWxzZTtcbiAgICB0aGlzLmV2ZW50UGhhc2UgPSAwO1xuICAgIHRoaXMucGF0aCA9IFtdO1xuICAgIHRoaXMucmVjZWl2ZWRUaW1lID0gcmVjZWl2ZWRUaW1lO1xuICAgIHRoaXMucmV0dXJuVmFsdWUgPSB0cnVlO1xuICAgIHRoaXMuc3JjRWxlbWVudCA9IHBvcnQ7XG4gICAgdGhpcy50YXJnZXQgPSBwb3J0O1xuICAgIHRoaXMudGltZVN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLnR5cGUgPSAnbWlkaW1lc3NhZ2UnO1xuICB9XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuLy8gcmVxdWlyZWQgYnkgYmFiZWxpZnkgZm9yIHRyYW5zcGlsaW5nIGVzNlxuLy9yZXF1aXJlKCdiYWJlbGlmeS9wb2x5ZmlsbCcpO1xuXG5pbXBvcnQge2NyZWF0ZU1JRElBY2Nlc3MsIGNsb3NlQWxsTUlESUlucHV0c30gZnJvbSAnLi9taWRpX2FjY2Vzcyc7XG5pbXBvcnQge3BvbHlmaWxsLCBnZXREZXZpY2V9IGZyb20gJy4vdXRpbCc7XG5cbmxldCBtaWRpQWNjZXNzO1xuXG4oZnVuY3Rpb24oKXtcbiAgaWYoIXdpbmRvdy5uYXZpZ2F0b3IucmVxdWVzdE1JRElBY2Nlc3Mpe1xuICAgIHBvbHlmaWxsKCk7XG4gICAgd2luZG93Lm5hdmlnYXRvci5yZXF1ZXN0TUlESUFjY2VzcyA9IGZ1bmN0aW9uKCl7XG4gICAgICBpZihtaWRpQWNjZXNzID09PSB1bmRlZmluZWQpe1xuICAgICAgICAgIG1pZGlBY2Nlc3MgPSBjcmVhdGVNSURJQWNjZXNzKCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbWlkaUFjY2VzcztcbiAgICB9O1xuICAgIGlmKGdldERldmljZSgpLm5vZGVqcyA9PT0gdHJ1ZSl7XG4gICAgICB3aW5kb3cubmF2aWdhdG9yLmNsb3NlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgLy8gTmVlZCB0byBjbG9zZSBNSURJIGlucHV0IHBvcnRzLCBvdGhlcndpc2UgTm9kZS5qcyB3aWxsIHdhaXQgZm9yIE1JREkgaW5wdXQgZm9yZXZlci5cbiAgICAgICAgY2xvc2VBbGxNSURJSW5wdXRzKCk7XG4gICAgICB9O1xuICAgIH1cbiAgfVxufSgpKTsiLCIndXNlIHN0cmljdCc7XG5cbi8vIGNoZWNrIGlmIHRoZSBzaGltIGlzIHJ1bm5pbmcgaW4gbm9kZWpzXG5leHBvcnQgY29uc3QgaW5Ob2RlSnMgPSAodHlwZW9mIF9fZGlybmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmphenpNaWRpKTtcblxuXG5sZXQgZGV2aWNlO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RGV2aWNlKCl7XG5cbiAgaWYoZGV2aWNlICE9PSB1bmRlZmluZWQpe1xuICAgIHJldHVybiBkZXZpY2U7XG4gIH1cblxuICBsZXRcbiAgICBwbGF0Zm9ybSA9ICd1bmRldGVjdGVkJyxcbiAgICBicm93c2VyID0gJ3VuZGV0ZWN0ZWQnLFxuICAgIG5vZGVqcyA9IGZhbHNlO1xuXG4gIGlmKG5hdmlnYXRvciA9PT0gdW5kZWZpbmVkKXtcbiAgICBub2RlanMgPSAodHlwZW9mIF9fZGlybmFtZSAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LmphenpNaWRpKTtcbiAgICBpZihub2RlanMgPT09IHRydWUpe1xuICAgICAgcGxhdGZvcm0gPSBwcm9jZXNzLnBsYXRmb3JtO1xuICAgIH1cbiAgICBkZXZpY2UgPSB7XG4gICAgICBwbGF0Zm9ybTogcGxhdGZvcm0sXG4gICAgICBicm93c2VyOiBmYWxzZSxcbiAgICAgIG5vZGVqczogbm9kZWpzLFxuICAgICAgbW9iaWxlOiBwbGF0Zm9ybSA9PT0gJ2lvcycgfHwgcGxhdGZvcm0gPT09ICdhbmRyb2lkJ1xuICAgIH07XG4gICAgcmV0dXJuIGRldmljZTtcbiAgfVxuXG5cbiAgbGV0IHVhID0gbmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuICBpZih1YS5tYXRjaCgvKGlQYWR8aVBob25lfGlQb2QpL2cpKXtcbiAgICBwbGF0Zm9ybSA9ICdpb3MnO1xuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdBbmRyb2lkJykgIT09IC0xKXtcbiAgICBwbGF0Zm9ybSA9ICdhbmRyb2lkJztcbiAgfWVsc2UgaWYodWEuaW5kZXhPZignTGludXgnKSAhPT0gLTEpe1xuICAgIHBsYXRmb3JtID0gJ2xpbnV4JztcbiAgfWVsc2UgaWYodWEuaW5kZXhPZignTWFjaW50b3NoJykgIT09IC0xKXtcbiAgICBwbGF0Zm9ybSA9ICdvc3gnO1xuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdXaW5kb3dzJykgIT09IC0xKXtcbiAgICBwbGF0Zm9ybSA9ICd3aW5kb3dzJztcbiAgfVxuXG4gIGlmKHVhLmluZGV4T2YoJ0Nocm9tZScpICE9PSAtMSl7XG4gICAgLy8gY2hyb21lLCBjaHJvbWl1bSBhbmQgY2FuYXJ5XG4gICAgYnJvd3NlciA9ICdjaHJvbWUnO1xuXG4gICAgaWYodWEuaW5kZXhPZignT1BSJykgIT09IC0xKXtcbiAgICAgIGJyb3dzZXIgPSAnb3BlcmEnO1xuICAgIH1lbHNlIGlmKHVhLmluZGV4T2YoJ0Nocm9taXVtJykgIT09IC0xKXtcbiAgICAgIGJyb3dzZXIgPSAnY2hyb21pdW0nO1xuICAgIH1cbiAgfWVsc2UgaWYodWEuaW5kZXhPZignU2FmYXJpJykgIT09IC0xKXtcbiAgICBicm93c2VyID0gJ3NhZmFyaSc7XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ0ZpcmVmb3gnKSAhPT0gLTEpe1xuICAgIGJyb3dzZXIgPSAnZmlyZWZveCc7XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ1RyaWRlbnQnKSAhPT0gLTEpe1xuICAgIGJyb3dzZXIgPSAnaWUnO1xuICAgIGlmKHVhLmluZGV4T2YoJ01TSUUgOScpKXtcbiAgICAgIGJyb3dzZXIgPSAnaWUgOSc7XG4gICAgfVxuICB9XG5cbiAgaWYocGxhdGZvcm0gPT09ICdpb3MnKXtcbiAgICBpZih1YS5pbmRleE9mKCdDcmlPUycpICE9PSAtMSl7XG4gICAgICBicm93c2VyID0gJ2Nocm9tZSc7XG4gICAgfVxuICB9XG5cbiAgZGV2aWNlID0ge1xuICAgIHBsYXRmb3JtOiBwbGF0Zm9ybSxcbiAgICBicm93c2VyOiBicm93c2VyLFxuICAgIG1vYmlsZTogcGxhdGZvcm0gPT09ICdpb3MnIHx8IHBsYXRmb3JtID09PSAnYW5kcm9pZCcsXG4gICAgbm9kZWpzOiBmYWxzZVxuICB9O1xuICByZXR1cm4gZGV2aWNlO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBwb2x5ZmlsbFBlcmZvcm1hbmNlKCl7XG5cbiAgaWYod2luZG93LnBlcmZvcm1hbmNlID09PSB1bmRlZmluZWQpe1xuICAgIHdpbmRvdy5wZXJmb3JtYW5jZSA9IHt9O1xuICB9XG5cbiAgRGF0ZS5ub3cgPSAoRGF0ZS5ub3cgfHwgZnVuY3Rpb24oKXtcbiAgICByZXR1cm4gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIH0pO1xuXG4gIGlmKHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgPT09IHVuZGVmaW5lZCl7XG5cbiAgICBsZXQgbm93T2Zmc2V0ID0gRGF0ZS5ub3coKTtcblxuICAgIGlmKHBlcmZvcm1hbmNlLnRpbWluZyAhPT0gdW5kZWZpbmVkICYmIHBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQgIT09IHVuZGVmaW5lZCl7XG4gICAgICBub3dPZmZzZXQgPSBwZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0O1xuICAgIH1cblxuICAgIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3cgPSBmdW5jdGlvbiBub3coKXtcbiAgICAgIHJldHVybiBEYXRlLm5vdygpIC0gbm93T2Zmc2V0O1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGxDdXN0b21FdmVudCgpe1xuXG4gIGlmKHR5cGVvZiB3aW5kb3cuRXZlbnQgPT09ICdmdW5jdGlvbicpe1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGZ1bmN0aW9uIEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMpe1xuICAgIHBhcmFtcyA9IHBhcmFtcyB8fCB7YnViYmxlczogZmFsc2UsIGNhbmNlbGFibGU6IGZhbHNlLCBkZXRhaWw6IHVuZGVmaW5lZH07XG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KCdDdXN0b21FdmVudCcpO1xuICAgIGV2dC5pbml0Q3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcy5idWJibGVzLCBwYXJhbXMuY2FuY2VsYWJsZSwgcGFyYW1zLmRldGFpbCk7XG4gICAgcmV0dXJuIGV2dDtcbiAgfTtcblxuICBDdXN0b21FdmVudC5wcm90b3R5cGUgPSB3aW5kb3cuRXZlbnQucHJvdG90eXBlO1xuICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlVVVJRCgpe1xuICBsZXQgZCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICBsZXQgdXVpZCA9IG5ldyBBcnJheSg2NCkuam9pbigneCcpOzsvLyd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnO1xuICB1dWlkID0gdXVpZC5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uKGMpIHtcbiAgICAgIHZhciByID0gKGQgKyBNYXRoLnJhbmRvbSgpKjE2KSUxNiB8IDA7XG4gICAgICBkID0gTWF0aC5mbG9vcihkLzE2KTtcbiAgICAgIHJldHVybiAoYz09J3gnID8gciA6IChyJjB4M3wweDgpKS50b1N0cmluZygxNikudG9VcHBlckNhc2UoKTtcbiAgfSk7XG4gIHJldHVybiB1dWlkO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBwb2x5ZmlsbCgpe1xuICBsZXQgZGV2aWNlID0gZ2V0RGV2aWNlKCk7XG4gIC8vIGlmKGRldmljZS5icm93c2VyID09PSAnaWUnKXtcbiAgLy8gICBwb2x5ZmlsbEN1c3RvbUV2ZW50KCk7XG4gIC8vIH1cbiAgcG9seWZpbGxQZXJmb3JtYW5jZSgpO1xufSJdfQ==
