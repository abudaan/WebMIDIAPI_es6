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

var _generateUUID = require('./util');

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
        listeners.set(listener);
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
      id = _generateUUID.generateUUID();
      midiInputIds.set(name, id);
    }
  } else if (type === 'output') {
    id = midiOutputIds.get(name);
    if (id === undefined) {
      id = _generateUUID.generateUUID();
      midiOutputIds.set(name, id);
    }
  }
  return id;
}

},{"./jazz_instance":2,"./midi_input":4,"./midi_output":5,"./midiconnection_event":6,"./util":9}],4:[function(require,module,exports){
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
        this._jazzInstance.MidiInClose(this.name);
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

},{"./midi_access":3,"./midiconnection_event":6,"./midimessage_event":7,"./util":9}],5:[function(require,module,exports){
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
        this._jazzInstance.MidiOutClose(this.name);
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

},{"./midi_access":3,"./util":9}],6:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9qYXp6X2luc3RhbmNlLmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9taWRpX2FjY2Vzcy5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaV9pbnB1dC5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaV9vdXRwdXQuanMiLCIvaG9tZS9hYnVkYWFuL3dvcmtzcGFjZS9XZWJNSURJQVBJU2hpbV9lczYvc3JjL21pZGljb25uZWN0aW9uX2V2ZW50LmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9taWRpbWVzc2FnZV9ldmVudC5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvc2hpbS5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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RyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQyxNQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDdkMsUUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLEVBQUUsQ0FBQSxHQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEMsS0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JCLFdBQU8sQ0FBQyxDQUFDLElBQUUsR0FBRyxHQUFHLENBQUMsR0FBSSxDQUFDLEdBQUMsQ0FBRyxHQUFDLENBQUcsQ0FBQyxDQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUM5RCxDQUFDLENBQUM7QUFDSCxTQUFPLElBQUksQ0FBQztDQUNiOztBQUdNLFNBQVMsUUFBUSxHQUFFO0FBQ3hCLE1BQUksTUFBTSxHQUFHLFNBQVMsRUFBRSxDQUFDOzs7O0FBSXpCLHFCQUFtQixFQUFFLENBQUM7Q0FDdkIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtnZXREZXZpY2V9IGZyb20gJy4vdXRpbCc7XG5cbmNvbnN0IGphenpQbHVnaW5Jbml0VGltZSA9IDEwMDsgLy8gbWlsbGlzZWNvbmRzXG5cbmxldCBqYXp6SW5zdGFuY2VOdW1iZXIgPSAwO1xubGV0IGphenpJbnN0YW5jZXMgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVKYXp6SW5zdGFuY2UoY2FsbGJhY2spe1xuXG4gIGxldCBpZCA9ICdqYXp6XycgKyBqYXp6SW5zdGFuY2VOdW1iZXIrKyArICcnICsgRGF0ZS5ub3coKTtcbiAgbGV0IGluc3RhbmNlO1xuICBsZXQgb2JqUmVmLCBhY3RpdmVYO1xuXG4gIGlmKGdldERldmljZSgpLm5vZGVqcyA9PT0gdHJ1ZSl7XG4gICAgb2JqUmVmID0gbmV3IHdpbmRvdy5qYXp6TWlkaS5NSURJKCk7XG4gIH1lbHNle1xuICAgIGxldCBvMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29iamVjdCcpO1xuICAgIG8xLmlkID0gaWQgKyAnaWUnO1xuICAgIG8xLmNsYXNzaWQgPSAnQ0xTSUQ6MUFDRTE2MTgtMUM3RC00NTYxLUFFRTEtMzQ4NDJBQTg1RTkwJztcbiAgICBhY3RpdmVYID0gbzE7XG5cbiAgICBsZXQgbzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKTtcbiAgICBvMi5pZCA9IGlkO1xuICAgIG8yLnR5cGUgPSAnYXVkaW8veC1qYXp6JztcbiAgICBvMS5hcHBlbmRDaGlsZChvMik7XG4gICAgb2JqUmVmID0gbzI7XG5cbiAgICBsZXQgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdUaGlzIHBhZ2UgcmVxdWlyZXMgdGhlICcpKTtcblxuICAgIGxldCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0phenogcGx1Z2luJykpO1xuICAgIGEuaHJlZiA9ICdodHRwOi8vamF6ei1zb2Z0Lm5ldC8nO1xuXG4gICAgZS5hcHBlbmRDaGlsZChhKTtcbiAgICBlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcuJykpO1xuICAgIG8yLmFwcGVuZENoaWxkKGUpO1xuXG4gICAgbGV0IGluc2VydGlvblBvaW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ01JRElQbHVnaW4nKTtcbiAgICBpZighaW5zZXJ0aW9uUG9pbnQpIHtcbiAgICAgIC8vIENyZWF0ZSBoaWRkZW4gZWxlbWVudFxuICAgICAgaW5zZXJ0aW9uUG9pbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGluc2VydGlvblBvaW50LmlkID0gJ01JRElQbHVnaW4nO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUubGVmdCA9ICctOTk5OXB4JztcbiAgICAgIGluc2VydGlvblBvaW50LnN0eWxlLnRvcCA9ICctOTk5OXB4JztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zZXJ0aW9uUG9pbnQpO1xuICAgIH1cbiAgICBpbnNlcnRpb25Qb2ludC5hcHBlbmRDaGlsZChvMSk7XG4gIH1cblxuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICBpZihvYmpSZWYuaXNKYXp6ID09PSB0cnVlKXtcbiAgICAgIGluc3RhbmNlID0gb2JqUmVmO1xuICAgIH1lbHNlIGlmKGFjdGl2ZVguaXNKYXp6ID09PSB0cnVlKXtcbiAgICAgIGluc3RhbmNlID0gYWN0aXZlWDtcbiAgICB9XG4gICAgaWYoaW5zdGFuY2UgIT09IHVuZGVmaW5lZCl7XG4gICAgICBpbnN0YW5jZS5fcGVyZlRpbWVaZXJvID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgamF6ekluc3RhbmNlcy5zZXQoaWQsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgY2FsbGJhY2soaW5zdGFuY2UpO1xuICB9LCBqYXp6UGx1Z2luSW5pdFRpbWUpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRKYXp6SW5zdGFuY2UodHlwZSwgY2FsbGJhY2spe1xuICBsZXQgaW5zdGFuY2UgPSBudWxsO1xuICBsZXQga2V5ID0gdHlwZSA9PT0gJ2lucHV0JyA/ICdpbnB1dEluVXNlJyA6ICdvdXRwdXRJblVzZSc7XG5cbiAgZm9yKGxldCBpbnN0IG9mIGphenpJbnN0YW5jZXMudmFsdWVzKCkpe1xuICAgIGlmKGluc3Rba2V5XSAhPT0gdHJ1ZSl7XG4gICAgICAgIGluc3RhbmNlID0gaW5zdDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYoaW5zdGFuY2UgPT09IG51bGwpe1xuICAgIGNyZWF0ZUphenpJbnN0YW5jZShjYWxsYmFjayk7XG4gIH1lbHNle1xuICAgIGNhbGxiYWNrKGluc3RhbmNlKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2NyZWF0ZUphenpJbnN0YW5jZSwgZ2V0SmF6ekluc3RhbmNlfSBmcm9tICcuL2phenpfaW5zdGFuY2UnO1xuaW1wb3J0IHtNSURJSW5wdXR9IGZyb20gJy4vbWlkaV9pbnB1dCc7XG5pbXBvcnQge01JRElPdXRwdXR9IGZyb20gJy4vbWlkaV9vdXRwdXQnO1xuaW1wb3J0IHtNSURJQ29ubmVjdGlvbkV2ZW50fSBmcm9tICcuL21pZGljb25uZWN0aW9uX2V2ZW50JztcbmltcG9ydCB7Z2VuZXJhdGVVVUlEfSBmcm9tICcuL3V0aWwnO1xuXG5cbmxldCBtaWRpQWNjZXNzO1xubGV0IGphenpJbnN0YW5jZTtcbmxldCBtaWRpSW5wdXRzID0gbmV3IE1hcCgpO1xubGV0IG1pZGlPdXRwdXRzID0gbmV3IE1hcCgpO1xubGV0IG1pZGlJbnB1dElkcyA9IG5ldyBNYXAoKTtcbmxldCBtaWRpT3V0cHV0SWRzID0gbmV3IE1hcCgpO1xubGV0IGxpc3RlbmVycyA9IG5ldyBTZXQoKTtcblxuXG5jbGFzcyBNSURJQWNjZXNze1xuICBjb25zdHJ1Y3RvcihtaWRpSW5wdXRzLCBtaWRpT3V0cHV0cyl7XG4gICAgdGhpcy5zeXNleEVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuaW5wdXRzID0gbWlkaUlucHV0cztcbiAgICB0aGlzLm91dHB1dHMgPSBtaWRpT3V0cHV0cztcbiAgfVxuXG4gIGFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpe1xuICAgIGlmKHR5cGUgIT09ICdzdGF0ZWNoYW5nZScpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihsaXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gZmFsc2Upe1xuICAgICAgbGlzdGVuZXJzLnNldChsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSl7XG4gICAgaWYodHlwZSAhPT0gJ3N0YXRlY2hhbmdlJyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGxpc3RlbmVycy5oYXMobGlzdGVuZXIpID09PSB0cnVlKXtcbiAgICAgIGxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTUlESUFjY2Vzcygpe1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBleGVjdXRvcihyZXNvbHZlLCByZWplY3Qpe1xuXG4gICAgaWYobWlkaUFjY2VzcyAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHJlc29sdmUobWlkaUFjY2Vzcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY3JlYXRlSmF6ekluc3RhbmNlKGZ1bmN0aW9uKGluc3RhbmNlKXtcbiAgICAgIGlmKGluc3RhbmNlID09PSB1bmRlZmluZWQpe1xuICAgICAgICByZWplY3Qoe21lc3NhZ2U6ICdObyBhY2Nlc3MgdG8gTUlESSBkZXZpY2VzOiBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgdGhlIFdlYk1JREkgQVBJIGFuZCB0aGUgSmF6eiBwbHVnaW4gaXMgbm90IGluc3RhbGxlZC4nfSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgamF6ekluc3RhbmNlID0gaW5zdGFuY2U7XG5cbiAgICAgIGNyZWF0ZU1JRElQb3J0cyhmdW5jdGlvbigpe1xuICAgICAgICBzZXR1cExpc3RlbmVycygpO1xuICAgICAgICBtaWRpQWNjZXNzID0gbmV3IE1JRElBY2Nlc3MobWlkaUlucHV0cywgbWlkaU91dHB1dHMpO1xuICAgICAgICByZXNvbHZlKG1pZGlBY2Nlc3MpO1xuICAgICAgfSk7XG4gICAgfSk7XG5cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZU1JRElQb3J0cyhjYWxsYmFjayl7XG4gIGxldCBpbnB1dHMgPSBqYXp6SW5zdGFuY2UuTWlkaUluTGlzdCgpO1xuICBsZXQgb3V0cHV0cyA9IGphenpJbnN0YW5jZS5NaWRpT3V0TGlzdCgpO1xuICBsZXQgbnVtSW5wdXRzID0gaW5wdXRzLmxlbmd0aDtcbiAgbGV0IG51bU91dHB1dHMgPSBvdXRwdXRzLmxlbmd0aDtcblxuICBsb29wQ3JlYXRlTUlESVBvcnQoMCwgbnVtSW5wdXRzLCAnaW5wdXQnLCBpbnB1dHMsIGZ1bmN0aW9uKCl7XG4gICAgbG9vcENyZWF0ZU1JRElQb3J0KDAsIG51bU91dHB1dHMsICdvdXRwdXQnLCBvdXRwdXRzLCBjYWxsYmFjayk7XG4gIH0pO1xufVxuXG5cbmZ1bmN0aW9uIGxvb3BDcmVhdGVNSURJUG9ydChpbmRleCwgbWF4LCB0eXBlLCBsaXN0LCBjYWxsYmFjayl7XG4gIGlmKGluZGV4IDwgbWF4KXtcbiAgICBsZXQgbmFtZSA9IGxpc3RbaW5kZXgrK107XG4gICAgY3JlYXRlTUlESVBvcnQodHlwZSwgbmFtZSwgZnVuY3Rpb24oKXtcbiAgICAgIGxvb3BDcmVhdGVNSURJUG9ydChpbmRleCwgbWF4LCB0eXBlLCBsaXN0LCBjYWxsYmFjayk7XG4gICAgfSk7XG4gIH1lbHNle1xuICAgIGNhbGxiYWNrKCk7XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBjcmVhdGVNSURJUG9ydCh0eXBlLCBuYW1lLCBjYWxsYmFjayl7XG4gIGdldEphenpJbnN0YW5jZSh0eXBlLCBmdW5jdGlvbihpbnN0YW5jZSl7XG4gICAgbGV0IHBvcnQ7XG4gICAgbGV0IGluZm8gPSBbbmFtZSwgJycsICcnXTtcbiAgICBpZih0eXBlID09PSAnaW5wdXQnKXtcbiAgICAgIGlmKGluc3RhbmNlLlN1cHBvcnQoJ01pZGlJbkluZm8nKSl7XG4gICAgICAgIGluZm8gPSBpbnN0YW5jZS5NaWRpSW5JbmZvKG5hbWUpO1xuICAgICAgfVxuICAgICAgcG9ydCA9IG5ldyBNSURJSW5wdXQoaW5mbywgaW5zdGFuY2UpO1xuICAgICAgbWlkaUlucHV0cy5zZXQocG9ydC5pZCwgcG9ydCk7XG4gICAgfWVsc2UgaWYodHlwZSA9PT0gJ291dHB1dCcpe1xuICAgICAgaWYoaW5zdGFuY2UuU3VwcG9ydCgnTWlkaU91dEluZm8nKSl7XG4gICAgICAgIGluZm8gPSBpbnN0YW5jZS5NaWRpT3V0SW5mbyhuYW1lKTtcbiAgICAgIH1cbiAgICAgIHBvcnQgPSBuZXcgTUlESU91dHB1dChpbmZvLCBpbnN0YW5jZSk7XG4gICAgICBtaWRpT3V0cHV0cy5zZXQocG9ydC5pZCwgcG9ydCk7XG4gICAgfVxuICAgIGNhbGxiYWNrKHBvcnQpO1xuICB9KTtcbn1cblxuXG5mdW5jdGlvbiBnZXRQb3J0QnlOYW1lKHBvcnRzLCBuYW1lKXtcbiAgbGV0IHBvcnQ7XG4gIGZvcihwb3J0IG9mIHBvcnRzLnZhbHVlcygpKXtcbiAgICBpZihwb3J0Lm5hbWUgPT09IG5hbWUpe1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiBwb3J0O1xufVxuXG5cbmZ1bmN0aW9uIHNldHVwTGlzdGVuZXJzKCl7XG4gIGphenpJbnN0YW5jZS5PbkRpc2Nvbm5lY3RNaWRpSW4oZnVuY3Rpb24obmFtZSl7XG4gICAgbGV0IHBvcnQgPSBnZXRQb3J0QnlOYW1lKG1pZGlJbnB1dHMsIG5hbWUpO1xuICAgIGlmKHBvcnQgIT09IHVuZGVmaW5lZCl7XG4gICAgICBwb3J0LnN0YXRlID0gJ2Rpc2Nvbm5lY3RlZCc7XG4gICAgICBwb3J0LmNsb3NlKCk7XG4gICAgICBwb3J0Ll9qYXp6SW5zdGFuY2UuaW5wdXRJblVzZSA9IGZhbHNlO1xuICAgICAgbWlkaUlucHV0cy5kZWxldGUocG9ydC5pZCk7XG4gICAgICBkaXNwYXRjaEV2ZW50KHBvcnQpO1xuICAgIH1cbiAgfSk7XG5cbiAgamF6ekluc3RhbmNlLk9uRGlzY29ubmVjdE1pZGlPdXQoZnVuY3Rpb24obmFtZSl7XG4gICAgbGV0IHBvcnQgPSBnZXRQb3J0QnlOYW1lKG1pZGlPdXRwdXRzLCBuYW1lKTtcbiAgICBpZihwb3J0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgcG9ydC5zdGF0ZSA9ICdkaXNjb25uZWN0ZWQnO1xuICAgICAgcG9ydC5jbG9zZSgpO1xuICAgICAgcG9ydC5famF6ekluc3RhbmNlLm91dHB1dEluVXNlID0gZmFsc2U7XG4gICAgICBtaWRpT3V0cHV0cy5kZWxldGUocG9ydC5pZCk7XG4gICAgICBkaXNwYXRjaEV2ZW50KHBvcnQpO1xuICAgIH1cbiAgfSk7XG5cbiAgamF6ekluc3RhbmNlLk9uQ29ubmVjdE1pZGlJbihmdW5jdGlvbihuYW1lKXtcbiAgICBjcmVhdGVNSURJUG9ydCgnaW5wdXQnLCBuYW1lLCBmdW5jdGlvbihwb3J0KXtcbiAgICAgIGRpc3BhdGNoRXZlbnQocG9ydCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGphenpJbnN0YW5jZS5PbkNvbm5lY3RNaWRpT3V0KGZ1bmN0aW9uKG5hbWUpe1xuICAgIGNyZWF0ZU1JRElQb3J0KCdvdXRwdXQnLCBuYW1lLCBmdW5jdGlvbihwb3J0KXtcbiAgICAgIGRpc3BhdGNoRXZlbnQocG9ydCk7XG4gICAgfSk7XG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBkaXNwYXRjaEV2ZW50KHBvcnQpe1xuXG4gIHBvcnQuZGlzcGF0Y2hFdmVudChuZXcgTUlESUNvbm5lY3Rpb25FdmVudChwb3J0LCBwb3J0KSk7XG5cbiAgbGV0IGV2dCA9IG5ldyBNSURJQ29ubmVjdGlvbkV2ZW50KG1pZGlBY2Nlc3MsIHBvcnQpO1xuXG4gIGlmKHR5cGVvZiBtaWRpQWNjZXNzLm9uc3RhdGVjaGFuZ2UgPT09ICdmdW5jdGlvbicpe1xuICAgIG1pZGlBY2Nlc3Mub25zdGF0ZWNoYW5nZShldnQpO1xuICB9XG4gIGZvcihsZXQgbGlzdGVuZXIgb2YgbGlzdGVuZXJzKXtcbiAgICBsaXN0ZW5lcihldnQpO1xuICB9XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGNsb3NlQWxsTUlESUlucHV0cygpe1xuICBtaWRpSW5wdXRzLmZvckVhY2goZnVuY3Rpb24oaW5wdXQpe1xuICAgIC8vaW5wdXQuY2xvc2UoKTtcbiAgICBpbnB1dC5famF6ekluc3RhbmNlLk1pZGlJbkNsb3NlKCk7XG4gIH0pO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRNSURJRGV2aWNlSWQobmFtZSwgdHlwZSl7XG4gIGxldCBpZDtcbiAgaWYodHlwZSA9PT0gJ2lucHV0Jyl7XG4gICAgaWQgPSBtaWRpSW5wdXRJZHMuZ2V0KG5hbWUpO1xuICAgIGlmKGlkID09PSB1bmRlZmluZWQpe1xuICAgICAgaWQgPSBnZW5lcmF0ZVVVSUQoKTtcbiAgICAgIG1pZGlJbnB1dElkcy5zZXQobmFtZSwgaWQpO1xuICAgIH1cbiAgfWVsc2UgaWYodHlwZSA9PT0gJ291dHB1dCcpe1xuICAgIGlkID0gbWlkaU91dHB1dElkcy5nZXQobmFtZSk7XG4gICAgaWYoaWQgPT09IHVuZGVmaW5lZCl7XG4gICAgICBpZCA9IGdlbmVyYXRlVVVJRCgpO1xuICAgICAgbWlkaU91dHB1dElkcy5zZXQobmFtZSwgaWQpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gaWQ7XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtnZXREZXZpY2V9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge01JRElNZXNzYWdlRXZlbnR9IGZyb20gJy4vbWlkaW1lc3NhZ2VfZXZlbnQnO1xuaW1wb3J0IHtNSURJQ29ubmVjdGlvbkV2ZW50fSBmcm9tICcuL21pZGljb25uZWN0aW9uX2V2ZW50JztcbmltcG9ydCB7ZGlzcGF0Y2hFdmVudCwgZ2V0TUlESURldmljZUlkfSBmcm9tICcuL21pZGlfYWNjZXNzJztcblxubGV0IG1pZGlQcm9jO1xubGV0IG5vZGVqcyA9IGdldERldmljZSgpLm5vZGVqcztcblxuZXhwb3J0IGNsYXNzIE1JRElJbnB1dHtcbiAgY29uc3RydWN0b3IoaW5mbywgaW5zdGFuY2Upe1xuICAgIHRoaXMuaWQgPSBnZXRNSURJRGV2aWNlSWQoaW5mb1swXSwgJ2lucHV0Jyk7XG4gICAgdGhpcy5uYW1lID0gaW5mb1swXTtcbiAgICB0aGlzLm1hbnVmYWN0dXJlciA9IGluZm9bMV07XG4gICAgdGhpcy52ZXJzaW9uID0gaW5mb1syXTtcbiAgICB0aGlzLnR5cGUgPSAnaW5wdXQnO1xuICAgIHRoaXMuc3RhdGUgPSAnY29ubmVjdGVkJztcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSAncGVuZGluZyc7XG5cbiAgICB0aGlzLm9uc3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgIHRoaXMuX29ubWlkaW1lc3NhZ2UgPSBudWxsO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAnb25taWRpbWVzc2FnZScsIHtcbiAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpe1xuICAgICAgICB0aGlzLl9vbm1pZGltZXNzYWdlID0gdmFsdWU7XG4gICAgICAgIGlmKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgICAgdGhpcy5vcGVuKCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBNYXAoKS5zZXQoJ21pZGltZXNzYWdlJywgbmV3IFNldCgpKS5zZXQoJ3N0YXRlY2hhbmdlJywgbmV3IFNldCgpKTtcbiAgICB0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2UgPSBmYWxzZTtcbiAgICB0aGlzLl9zeXNleEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KCk7XG5cbiAgICB0aGlzLl9qYXp6SW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICB0aGlzLl9qYXp6SW5zdGFuY2UuaW5wdXRJblVzZSA9IHRydWU7XG4gICAgaWYoZ2V0RGV2aWNlKCkucGxhdGZvcm0gPT09ICdsaW51eCcpe1xuICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlJbk9wZW4odGhpcy5uYW1lLCBtaWRpUHJvYy5iaW5kKHRoaXMpKTtcbiAgICB9XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKXtcbiAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldCh0eXBlKTtcbiAgICBpZihsaXN0ZW5lcnMgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYobGlzdGVuZXJzLmhhcyhsaXN0ZW5lcikgPT09IGZhbHNlKXtcbiAgICAgIGxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpe1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KHR5cGUpO1xuICAgIGlmKGxpc3RlbmVycyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZihsaXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gZmFsc2Upe1xuICAgICAgbGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgcHJldmVudERlZmF1bHQoKXtcbiAgICB0aGlzLl9wdnREZWYgPSB0cnVlO1xuICB9XG5cbiAgZGlzcGF0Y2hFdmVudChldnQpe1xuICAgIHRoaXMuX3B2dERlZiA9IGZhbHNlO1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KGV2dC50eXBlKTtcbiAgICBsaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbihsaXN0ZW5lcil7XG4gICAgICBsaXN0ZW5lcihldnQpO1xuICAgIH0pO1xuXG4gICAgaWYoZXZ0LnR5cGUgPT09ICdtaWRpbWVzc2FnZScpe1xuICAgICAgaWYodGhpcy5fb25taWRpbWVzc2FnZSAhPT0gbnVsbCl7XG4gICAgICAgIHRoaXMuX29ubWlkaW1lc3NhZ2UoZXZ0KTtcbiAgICAgIH1cbiAgICB9ZWxzZSBpZihldnQudHlwZSA9PT0gJ3N0YXRlY2hhbmdlJyl7XG4gICAgICBpZih0aGlzLm9uc3RhdGVjaGFuZ2UgIT09IG51bGwpe1xuICAgICAgICB0aGlzLm9uc3RhdGVjaGFuZ2UoZXZ0KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGhpcy5fcHZ0RGVmO1xuICB9XG5cbiAgb3Blbigpe1xuICAgIGlmKHRoaXMuY29ubmVjdGlvbiA9PT0gJ29wZW4nKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoZ2V0RGV2aWNlKCkucGxhdGZvcm0gIT09ICdsaW51eCcpe1xuICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlJbk9wZW4odGhpcy5uYW1lLCBtaWRpUHJvYy5iaW5kKHRoaXMpKTtcbiAgICB9XG4gICAgdGhpcy5jb25uZWN0aW9uID0gJ29wZW4nO1xuICAgIGRpc3BhdGNoRXZlbnQodGhpcyk7IC8vIGRpc3BhdGNoIGV2ZW50IHZpYSBNSURJQWNjZXNzXG4gIH1cblxuICBjbG9zZSgpe1xuICAgIGlmKHRoaXMuY29ubmVjdGlvbiA9PT0gJ2Nsb3NlZCcpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSAhPT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaUluQ2xvc2UodGhpcy5uYW1lKTtcbiAgICB9XG4gICAgdGhpcy5jb25uZWN0aW9uID0gJ2Nsb3NlZCc7XG4gICAgZGlzcGF0Y2hFdmVudCh0aGlzKTsgLy8gZGlzcGF0Y2ggZXZlbnQgdmlhIE1JRElBY2Nlc3NcbiAgICB0aGlzLl9vbm1pZGltZXNzYWdlID0gbnVsbDtcbiAgICB0aGlzLm9uc3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgIHRoaXMuX2xpc3RlbmVycy5nZXQoJ21pZGltZXNzYWdlJykuY2xlYXIoKTtcbiAgICB0aGlzLl9saXN0ZW5lcnMuZ2V0KCdzdGF0ZWNoYW5nZScpLmNsZWFyKCk7XG4gIH1cblxuICBfYXBwZW5kVG9TeXNleEJ1ZmZlcihkYXRhKXtcbiAgICBsZXQgb2xkTGVuZ3RoID0gdGhpcy5fc3lzZXhCdWZmZXIubGVuZ3RoO1xuICAgIGxldCB0bXBCdWZmZXIgPSBuZXcgVWludDhBcnJheShvbGRMZW5ndGggKyBkYXRhLmxlbmd0aCk7XG4gICAgdG1wQnVmZmVyLnNldCh0aGlzLl9zeXNleEJ1ZmZlcik7XG4gICAgdG1wQnVmZmVyLnNldChkYXRhLCBvbGRMZW5ndGgpO1xuICAgIHRoaXMuX3N5c2V4QnVmZmVyID0gdG1wQnVmZmVyO1xuICB9XG5cbiAgX2J1ZmZlckxvbmdTeXNleChkYXRhLCBpbml0aWFsT2Zmc2V0KXtcbiAgICBsZXQgaiA9IGluaXRpYWxPZmZzZXQ7XG4gICAgd2hpbGUoaiA8IGRhdGEubGVuZ3RoKXtcbiAgICAgIGlmKGRhdGFbal0gPT0gMHhGNyl7XG4gICAgICAgIC8vIGVuZCBvZiBzeXNleCFcbiAgICAgICAgaisrO1xuICAgICAgICB0aGlzLl9hcHBlbmRUb1N5c2V4QnVmZmVyKGRhdGEuc2xpY2UoaW5pdGlhbE9mZnNldCwgaikpO1xuICAgICAgICByZXR1cm4gajtcbiAgICAgIH1cbiAgICAgIGorKztcbiAgICB9XG4gICAgLy8gZGlkbid0IHJlYWNoIHRoZSBlbmQ7IGp1c3QgdGFjayBpdCBvbi5cbiAgICB0aGlzLl9hcHBlbmRUb1N5c2V4QnVmZmVyKGRhdGEuc2xpY2UoaW5pdGlhbE9mZnNldCwgaikpO1xuICAgIHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSA9IHRydWU7XG4gICAgcmV0dXJuIGo7XG4gIH1cbn1cblxuXG5taWRpUHJvYyA9IGZ1bmN0aW9uKHRpbWVzdGFtcCwgZGF0YSl7XG4gIGxldCBsZW5ndGggPSAwO1xuICBsZXQgaTtcbiAgbGV0IGlzU3lzZXhNZXNzYWdlID0gZmFsc2U7XG5cbiAgLy8gSmF6eiBzb21ldGltZXMgcGFzc2VzIHVzIG11bHRpcGxlIG1lc3NhZ2VzIGF0IG9uY2UsIHNvIHdlIG5lZWQgdG8gcGFyc2UgdGhlbSBvdXRcbiAgLy8gYW5kIHBhc3MgdGhlbSBvbmUgYXQgYSB0aW1lLlxuXG4gIGZvcihpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpICs9IGxlbmd0aCl7XG4gICAgbGV0IGlzVmFsaWRNZXNzYWdlID0gdHJ1ZTtcbiAgICBpZih0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2Upe1xuICAgICAgaSA9IHRoaXMuX2J1ZmZlckxvbmdTeXNleChkYXRhLCBpKTtcbiAgICAgIGlmKGRhdGFbaSAtIDFdICE9IDB4Zjcpe1xuICAgICAgICAvLyByYW4gb2ZmIHRoZSBlbmQgd2l0aG91dCBoaXR0aW5nIHRoZSBlbmQgb2YgdGhlIHN5c2V4IG1lc3NhZ2VcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgaXNTeXNleE1lc3NhZ2UgPSB0cnVlO1xuICAgIH1lbHNle1xuICAgICAgaXNTeXNleE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgIHN3aXRjaChkYXRhW2ldICYgMHhGMCl7XG4gICAgICAgIGNhc2UgMHgwMDogIC8vIENoZXcgdXAgc3B1cmlvdXMgMHgwMCBieXRlcy4gIEZpeGVzIGEgV2luZG93cyBwcm9ibGVtLlxuICAgICAgICAgIGxlbmd0aCA9IDE7XG4gICAgICAgICAgaXNWYWxpZE1lc3NhZ2UgPSBmYWxzZTtcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDB4ODA6ICAvLyBub3RlIG9mZlxuICAgICAgICBjYXNlIDB4OTA6ICAvLyBub3RlIG9uXG4gICAgICAgIGNhc2UgMHhBMDogIC8vIHBvbHlwaG9uaWMgYWZ0ZXJ0b3VjaFxuICAgICAgICBjYXNlIDB4QjA6ICAvLyBjb250cm9sIGNoYW5nZVxuICAgICAgICBjYXNlIDB4RTA6ICAvLyBjaGFubmVsIG1vZGVcbiAgICAgICAgICBsZW5ndGggPSAzO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMHhDMDogIC8vIHByb2dyYW0gY2hhbmdlXG4gICAgICAgIGNhc2UgMHhEMDogIC8vIGNoYW5uZWwgYWZ0ZXJ0b3VjaFxuICAgICAgICAgIGxlbmd0aCA9IDI7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAweEYwOlxuICAgICAgICAgIHN3aXRjaChkYXRhW2ldKXtcbiAgICAgICAgICAgIGNhc2UgMHhmMDogIC8vIGxldGlhYmxlLWxlbmd0aCBzeXNleC5cbiAgICAgICAgICAgICAgaSA9IHRoaXMuX2J1ZmZlckxvbmdTeXNleChkYXRhLCBpKTtcbiAgICAgICAgICAgICAgaWYoZGF0YVtpIC0gMV0gIT0gMHhmNyl7XG4gICAgICAgICAgICAgICAgLy8gcmFuIG9mZiB0aGUgZW5kIHdpdGhvdXQgaGl0dGluZyB0aGUgZW5kIG9mIHRoZSBzeXNleCBtZXNzYWdlXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGlzU3lzZXhNZXNzYWdlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMHhGMTogIC8vIE1UQyBxdWFydGVyIGZyYW1lXG4gICAgICAgICAgICBjYXNlIDB4RjM6ICAvLyBzb25nIHNlbGVjdFxuICAgICAgICAgICAgICBsZW5ndGggPSAyO1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgY2FzZSAweEYyOiAgLy8gc29uZyBwb3NpdGlvbiBwb2ludGVyXG4gICAgICAgICAgICAgIGxlbmd0aCA9IDM7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICBsZW5ndGggPSAxO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIGlmKCFpc1ZhbGlkTWVzc2FnZSl7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBsZXQgZXZ0ID0ge307XG4gICAgZXZ0LnJlY2VpdmVkVGltZSA9IHBhcnNlRmxvYXQodGltZXN0YW1wLnRvU3RyaW5nKCkpICsgdGhpcy5famF6ekluc3RhbmNlLl9wZXJmVGltZVplcm87XG5cbiAgICBpZihpc1N5c2V4TWVzc2FnZSB8fCB0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2Upe1xuICAgICAgZXZ0LmRhdGEgPSBuZXcgVWludDhBcnJheSh0aGlzLl9zeXNleEJ1ZmZlcik7XG4gICAgICB0aGlzLl9zeXNleEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KDApO1xuICAgICAgdGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlID0gZmFsc2U7XG4gICAgfWVsc2V7XG4gICAgICBldnQuZGF0YSA9IG5ldyBVaW50OEFycmF5KGRhdGEuc2xpY2UoaSwgbGVuZ3RoICsgaSkpO1xuICAgIH1cblxuICAgIGlmKG5vZGVqcyl7XG4gICAgICBpZih0aGlzLl9vbm1pZGltZXNzYWdlKXtcbiAgICAgICAgdGhpcy5fb25taWRpbWVzc2FnZShldnQpO1xuICAgICAgfVxuICAgIH1lbHNle1xuICAgICAgbGV0IGUgPSBuZXcgTUlESU1lc3NhZ2VFdmVudCh0aGlzLCBldnQuZGF0YSwgZXZ0LnJlY2VpdmVkVGltZSk7XG4gICAgICB0aGlzLmRpc3BhdGNoRXZlbnQoZSk7XG4gICAgfVxuICB9XG59OyIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtnZXREZXZpY2V9IGZyb20gJy4vdXRpbCc7XG5pbXBvcnQge2Rpc3BhdGNoRXZlbnQsIGdldE1JRElEZXZpY2VJZH0gZnJvbSAnLi9taWRpX2FjY2Vzcyc7XG5cbmV4cG9ydCBjbGFzcyBNSURJT3V0cHV0e1xuICBjb25zdHJ1Y3RvcihpbmZvLCBpbnN0YW5jZSl7XG4gICAgdGhpcy5pZCA9IGdldE1JRElEZXZpY2VJZChpbmZvWzBdLCAnb3V0cHV0Jyk7XG4gICAgdGhpcy5uYW1lID0gaW5mb1swXTtcbiAgICB0aGlzLm1hbnVmYWN0dXJlciA9IGluZm9bMV07XG4gICAgdGhpcy52ZXJzaW9uID0gaW5mb1syXTtcbiAgICB0aGlzLnR5cGUgPSAnb3V0cHV0JztcbiAgICB0aGlzLnN0YXRlID0gJ2Nvbm5lY3RlZCc7XG4gICAgdGhpcy5jb25uZWN0aW9uID0gJ3BlbmRpbmcnO1xuICAgIHRoaXMub25taWRpbWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5vbnN0YXRlY2hhbmdlID0gbnVsbDtcblxuICAgIHRoaXMuX2xpc3RlbmVycyA9IG5ldyBTZXQoKTtcbiAgICB0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2UgPSBmYWxzZTtcbiAgICB0aGlzLl9zeXNleEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KCk7XG5cbiAgICB0aGlzLl9qYXp6SW5zdGFuY2UgPSBpbnN0YW5jZTtcbiAgICB0aGlzLl9qYXp6SW5zdGFuY2Uub3V0cHV0SW5Vc2UgPSB0cnVlO1xuICAgIGlmKGdldERldmljZSgpLnBsYXRmb3JtID09PSAnbGludXgnKXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpT3V0T3Blbih0aGlzLm5hbWUpO1xuICAgIH1cbiAgfVxuXG4gIG9wZW4oKXtcbiAgICBpZih0aGlzLmNvbm5lY3Rpb24gPT09ICdvcGVuJyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGdldERldmljZSgpLnBsYXRmb3JtICE9PSAnbGludXgnKXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpT3V0T3Blbih0aGlzLm5hbWUpO1xuICAgIH1cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSAnb3Blbic7XG4gICAgZGlzcGF0Y2hFdmVudCh0aGlzKTsgLy8gZGlzcGF0Y2ggZXZlbnQgdmlhIE1JRElBY2Nlc3NcbiAgfVxuXG4gIGNsb3NlKCl7XG4gICAgaWYodGhpcy5jb25uZWN0aW9uID09PSAnY2xvc2VkJyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGdldERldmljZSgpLnBsYXRmb3JtICE9PSAnbGludXgnKXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpT3V0Q2xvc2UodGhpcy5uYW1lKTtcbiAgICB9XG4gICAgdGhpcy5jb25uZWN0aW9uID0gJ2Nsb3NlZCc7XG4gICAgZGlzcGF0Y2hFdmVudCh0aGlzKTsgLy8gZGlzcGF0Y2ggZXZlbnQgdmlhIE1JRElBY2Nlc3NcbiAgICB0aGlzLm9uc3RhdGVjaGFuZ2UgPSBudWxsO1xuICAgIHRoaXMuX2xpc3RlbmVycy5jbGVhcigpO1xuICB9XG5cbiAgc2VuZChkYXRhLCB0aW1lc3RhbXApe1xuICAgIGxldCBkZWxheUJlZm9yZVNlbmQgPSAwO1xuXG4gICAgaWYoZGF0YS5sZW5ndGggPT09IDApe1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGlmKHRpbWVzdGFtcCl7XG4gICAgICBkZWxheUJlZm9yZVNlbmQgPSBNYXRoLmZsb29yKHRpbWVzdGFtcCAtIHdpbmRvdy5wZXJmb3JtYW5jZS5ub3coKSk7XG4gICAgfVxuXG4gICAgaWYodGltZXN0YW1wICYmIChkZWxheUJlZm9yZVNlbmQgPiAxKSl7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpT3V0TG9uZyhkYXRhKTtcbiAgICAgIH0sIGRlbGF5QmVmb3JlU2VuZCk7XG4gICAgfWVsc2V7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dExvbmcoZGF0YSk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSl7XG4gICAgaWYodHlwZSAhPT0gJ3N0YXRlY2hhbmdlJyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYodGhpcy5fbGlzdGVuZXJzLmhhcyhsaXN0ZW5lcikgPT09IGZhbHNlKXtcbiAgICAgIHRoaXMuX2xpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpe1xuICAgIGlmKHR5cGUgIT09ICdzdGF0ZWNoYW5nZScpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKHRoaXMuX2xpc3RlbmVycy5oYXMobGlzdGVuZXIpID09PSBmYWxzZSl7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KGV2dCl7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpe1xuICAgICAgbGlzdGVuZXIoZXZ0KTtcbiAgICB9KTtcblxuICAgIGlmKHRoaXMub25zdGF0ZWNoYW5nZSAhPT0gbnVsbCl7XG4gICAgICB0aGlzLm9uc3RhdGVjaGFuZ2UoZXZ0KTtcbiAgICB9XG4gIH1cbn0iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjbGFzcyBNSURJQ29ubmVjdGlvbkV2ZW50e1xuICBjb25zdHJ1Y3RvcihtaWRpQWNjZXNzLCBwb3J0KXtcbiAgICB0aGlzLmJ1YmJsZXMgPSBmYWxzZTtcbiAgICB0aGlzLmNhbmNlbEJ1YmJsZSA9IGZhbHNlO1xuICAgIHRoaXMuY2FuY2VsYWJsZSA9IGZhbHNlO1xuICAgIHRoaXMuY3VycmVudFRhcmdldCA9IG1pZGlBY2Nlc3M7XG4gICAgdGhpcy5kZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XG4gICAgdGhpcy5ldmVudFBoYXNlID0gMDtcbiAgICB0aGlzLnBhdGggPSBbXTtcbiAgICB0aGlzLnBvcnQgPSBwb3J0O1xuICAgIHRoaXMucmV0dXJuVmFsdWUgPSB0cnVlO1xuICAgIHRoaXMuc3JjRWxlbWVudCA9IG1pZGlBY2Nlc3M7XG4gICAgdGhpcy50YXJnZXQgPSBtaWRpQWNjZXNzO1xuICAgIHRoaXMudGltZVN0YW1wID0gRGF0ZS5ub3coKTtcbiAgICB0aGlzLnR5cGUgPSAnc3RhdGVjaGFuZ2UnO1xuICB9XG59XG5cbiIsIid1c2Ugc3RyaWN0JztcblxuZXhwb3J0IGNsYXNzIE1JRElNZXNzYWdlRXZlbnR7XG4gIGNvbnN0cnVjdG9yKHBvcnQsIGRhdGEsIHJlY2VpdmVkVGltZSl7XG4gICAgdGhpcy5idWJibGVzID0gZmFsc2U7XG4gICAgdGhpcy5jYW5jZWxCdWJibGUgPSBmYWxzZTtcbiAgICB0aGlzLmNhbmNlbGFibGUgPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBwb3J0O1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5kZWZhdWx0UHJldmVudGVkID0gZmFsc2U7XG4gICAgdGhpcy5ldmVudFBoYXNlID0gMDtcbiAgICB0aGlzLnBhdGggPSBbXTtcbiAgICB0aGlzLnJlY2VpdmVkVGltZSA9IHJlY2VpdmVkVGltZTtcbiAgICB0aGlzLnJldHVyblZhbHVlID0gdHJ1ZTtcbiAgICB0aGlzLnNyY0VsZW1lbnQgPSBwb3J0O1xuICAgIHRoaXMudGFyZ2V0ID0gcG9ydDtcbiAgICB0aGlzLnRpbWVTdGFtcCA9IERhdGUubm93KCk7XG4gICAgdGhpcy50eXBlID0gJ21pZGltZXNzYWdlJztcbiAgfVxufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Y3JlYXRlTUlESUFjY2VzcywgY2xvc2VBbGxNSURJSW5wdXRzfSBmcm9tICcuL21pZGlfYWNjZXNzJztcbmltcG9ydCB7cG9seWZpbGwsIGdldERldmljZX0gZnJvbSAnLi91dGlsJztcblxubGV0IG1pZGlBY2Nlc3M7XG5cbihmdW5jdGlvbigpe1xuICBpZighd2luZG93Lm5hdmlnYXRvci5yZXF1ZXN0TUlESUFjY2Vzcyl7XG4gICAgcG9seWZpbGwoKTtcbiAgICB3aW5kb3cubmF2aWdhdG9yLnJlcXVlc3RNSURJQWNjZXNzID0gZnVuY3Rpb24oKXtcbiAgICAgIGlmKG1pZGlBY2Nlc3MgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgbWlkaUFjY2VzcyA9IGNyZWF0ZU1JRElBY2Nlc3MoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtaWRpQWNjZXNzO1xuICAgIH07XG4gICAgaWYoZ2V0RGV2aWNlKCkubm9kZWpzID09PSB0cnVlKXtcbiAgICAgIHdpbmRvdy5uYXZpZ2F0b3IuY2xvc2UgPSBmdW5jdGlvbigpe1xuICAgICAgICAvLyBOZWVkIHRvIGNsb3NlIE1JREkgaW5wdXQgcG9ydHMsIG90aGVyd2lzZSBOb2RlLmpzIHdpbGwgd2FpdCBmb3IgTUlESSBpbnB1dCBmb3JldmVyLlxuICAgICAgICBjbG9zZUFsbE1JRElJbnB1dHMoKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG59KCkpOyIsIid1c2Ugc3RyaWN0JztcblxubGV0IGRldmljZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERldmljZSgpe1xuXG4gIGlmKGRldmljZSAhPT0gdW5kZWZpbmVkKXtcbiAgICByZXR1cm4gZGV2aWNlO1xuICB9XG5cbiAgbGV0XG4gICAgcGxhdGZvcm0gPSAndW5kZXRlY3RlZCcsXG4gICAgYnJvd3NlciA9ICd1bmRldGVjdGVkJyxcbiAgICBub2RlanMgPSBmYWxzZTtcblxuICBpZihuYXZpZ2F0b3IgPT09IHVuZGVmaW5lZCl7XG4gICAgbm9kZWpzID0gKHR5cGVvZiBfX2Rpcm5hbWUgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5qYXp6TWlkaSk7XG4gICAgaWYobm9kZWpzID09PSB0cnVlKXtcbiAgICAgIHBsYXRmb3JtID0gcHJvY2Vzcy5wbGF0Zm9ybTtcbiAgICB9XG4gICAgZGV2aWNlID0ge1xuICAgICAgcGxhdGZvcm06IHBsYXRmb3JtLFxuICAgICAgYnJvd3NlcjogZmFsc2UsXG4gICAgICBub2RlanM6IG5vZGVqcyxcbiAgICAgIG1vYmlsZTogcGxhdGZvcm0gPT09ICdpb3MnIHx8IHBsYXRmb3JtID09PSAnYW5kcm9pZCdcbiAgICB9O1xuICAgIHJldHVybiBkZXZpY2U7XG4gIH1cblxuXG4gIGxldCB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgaWYodWEubWF0Y2goLyhpUGFkfGlQaG9uZXxpUG9kKS9nKSl7XG4gICAgcGxhdGZvcm0gPSAnaW9zJztcbiAgfWVsc2UgaWYodWEuaW5kZXhPZignQW5kcm9pZCcpICE9PSAtMSl7XG4gICAgcGxhdGZvcm0gPSAnYW5kcm9pZCc7XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ0xpbnV4JykgIT09IC0xKXtcbiAgICBwbGF0Zm9ybSA9ICdsaW51eCc7XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ01hY2ludG9zaCcpICE9PSAtMSl7XG4gICAgcGxhdGZvcm0gPSAnb3N4JztcbiAgfWVsc2UgaWYodWEuaW5kZXhPZignV2luZG93cycpICE9PSAtMSl7XG4gICAgcGxhdGZvcm0gPSAnd2luZG93cyc7XG4gIH1cblxuICBpZih1YS5pbmRleE9mKCdDaHJvbWUnKSAhPT0gLTEpe1xuICAgIC8vIGNocm9tZSwgY2hyb21pdW0gYW5kIGNhbmFyeVxuICAgIGJyb3dzZXIgPSAnY2hyb21lJztcblxuICAgIGlmKHVhLmluZGV4T2YoJ09QUicpICE9PSAtMSl7XG4gICAgICBicm93c2VyID0gJ29wZXJhJztcbiAgICB9ZWxzZSBpZih1YS5pbmRleE9mKCdDaHJvbWl1bScpICE9PSAtMSl7XG4gICAgICBicm93c2VyID0gJ2Nocm9taXVtJztcbiAgICB9XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ1NhZmFyaScpICE9PSAtMSl7XG4gICAgYnJvd3NlciA9ICdzYWZhcmknO1xuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdGaXJlZm94JykgIT09IC0xKXtcbiAgICBicm93c2VyID0gJ2ZpcmVmb3gnO1xuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdUcmlkZW50JykgIT09IC0xKXtcbiAgICBicm93c2VyID0gJ2llJztcbiAgICBpZih1YS5pbmRleE9mKCdNU0lFIDknKSl7XG4gICAgICBicm93c2VyID0gJ2llIDknO1xuICAgIH1cbiAgfVxuXG4gIGlmKHBsYXRmb3JtID09PSAnaW9zJyl7XG4gICAgaWYodWEuaW5kZXhPZignQ3JpT1MnKSAhPT0gLTEpe1xuICAgICAgYnJvd3NlciA9ICdjaHJvbWUnO1xuICAgIH1cbiAgfVxuXG4gIGRldmljZSA9IHtcbiAgICBwbGF0Zm9ybTogcGxhdGZvcm0sXG4gICAgYnJvd3NlcjogYnJvd3NlcixcbiAgICBtb2JpbGU6IHBsYXRmb3JtID09PSAnaW9zJyB8fCBwbGF0Zm9ybSA9PT0gJ2FuZHJvaWQnLFxuICAgIG5vZGVqczogZmFsc2VcbiAgfTtcbiAgcmV0dXJuIGRldmljZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGxQZXJmb3JtYW5jZSgpe1xuXG4gIGlmKHdpbmRvdy5wZXJmb3JtYW5jZSA9PT0gdW5kZWZpbmVkKXtcbiAgICB3aW5kb3cucGVyZm9ybWFuY2UgPSB7fTtcbiAgfVxuXG4gIERhdGUubm93ID0gKERhdGUubm93IHx8IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9KTtcblxuICBpZih3aW5kb3cucGVyZm9ybWFuY2Uubm93ID09PSB1bmRlZmluZWQpe1xuXG4gICAgbGV0IG5vd09mZnNldCA9IERhdGUubm93KCk7XG5cbiAgICBpZihwZXJmb3JtYW5jZS50aW1pbmcgIT09IHVuZGVmaW5lZCAmJiBwZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgbm93T2Zmc2V0ID0gcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydDtcbiAgICB9XG5cbiAgICB3aW5kb3cucGVyZm9ybWFuY2Uubm93ID0gZnVuY3Rpb24gbm93KCl7XG4gICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIG5vd09mZnNldDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlmaWxsQ3VzdG9tRXZlbnQoKXtcblxuICBpZih0eXBlb2Ygd2luZG93LkV2ZW50ID09PSAnZnVuY3Rpb24nKXtcbiAgICByZXR1cm47XG4gIH1cblxuICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgcGFyYW1zKXtcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwge2J1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiB1bmRlZmluZWR9O1xuICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICAgIHJldHVybiBldnQ7XG4gIH07XG5cbiAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVVVSUQoKXtcbiAgbGV0IGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgbGV0IHV1aWQgPSBuZXcgQXJyYXkoNjQpLmpvaW4oJ3gnKTs7Ly8neHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4JztcbiAgdXVpZCA9IHV1aWQucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkqMTYpJTE2IHwgMDtcbiAgICBkID0gTWF0aC5mbG9vcihkLzE2KTtcbiAgICByZXR1cm4gKGM9PSd4JyA/IHIgOiAociYweDN8MHg4KSkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xuICByZXR1cm4gdXVpZDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGwoKXtcbiAgbGV0IGRldmljZSA9IGdldERldmljZSgpO1xuICAvLyBpZihkZXZpY2UuYnJvd3NlciA9PT0gJ2llJyl7XG4gIC8vICAgcG9seWZpbGxDdXN0b21FdmVudCgpO1xuICAvLyB9XG4gIHBvbHlmaWxsUGVyZm9ybWFuY2UoKTtcbn0iXX0=
