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

var _createJazzInstance$getJazzInstance = require('./jazz');

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
        reject({ code: 1 });
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

},{"./jazz":2,"./midi_input":4,"./midi_output":5,"./midiconnection_event":6,"./util":9}],4:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9qYXp6LmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9taWRpX2FjY2Vzcy5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaV9pbnB1dC5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaV9vdXRwdXQuanMiLCIvaG9tZS9hYnVkYWFuL3dvcmtzcGFjZS9XZWJNSURJQVBJU2hpbV9lczYvc3JjL21pZGljb25uZWN0aW9uX2V2ZW50LmpzIiwiL2hvbWUvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9taWRpbWVzc2FnZV9ldmVudC5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvc2hpbS5qcyIsIi9ob21lL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvdXRpbC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUFZLEdBQUU7QUFDNUIsTUFBSSxDQUFDLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUM3QixNQUFJLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNwQyxNQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsVUFBUyxDQUFDLEVBQUU7QUFDckMsUUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFDLEVBQUUsQ0FBQSxHQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDdEMsS0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQ3JCLFdBQU8sQ0FBQyxDQUFDLElBQUUsR0FBRyxHQUFHLENBQUMsR0FBSSxDQUFDLEdBQUMsQ0FBRyxHQUFDLENBQUcsQ0FBQyxDQUFFLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztHQUNoRSxDQUFDLENBQUM7QUFDSCxTQUFPLElBQUksQ0FBQztDQUNiOztBQUdNLFNBQVMsUUFBUSxHQUFFO0FBQ3hCLE1BQUksTUFBTSxHQUFHLFNBQVMsRUFBRSxDQUFDOzs7O0FBSXpCLHFCQUFtQixFQUFFLENBQUM7Q0FDdkIiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG5cbmZ1bmN0aW9uIGRyYWluUXVldWUoKSB7XG4gICAgaWYgKGRyYWluaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSB0cnVlO1xuICAgIHZhciBjdXJyZW50UXVldWU7XG4gICAgdmFyIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB3aGlsZShsZW4pIHtcbiAgICAgICAgY3VycmVudFF1ZXVlID0gcXVldWU7XG4gICAgICAgIHF1ZXVlID0gW107XG4gICAgICAgIHZhciBpID0gLTE7XG4gICAgICAgIHdoaWxlICgrK2kgPCBsZW4pIHtcbiAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtpXSgpO1xuICAgICAgICB9XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbn1cbnByb2Nlc3MubmV4dFRpY2sgPSBmdW5jdGlvbiAoZnVuKSB7XG4gICAgcXVldWUucHVzaChmdW4pO1xuICAgIGlmICghZHJhaW5pbmcpIHtcbiAgICAgICAgc2V0VGltZW91dChkcmFpblF1ZXVlLCAwKTtcbiAgICB9XG59O1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcbnByb2Nlc3MudmVyc2lvbiA9ICcnOyAvLyBlbXB0eSBzdHJpbmcgdG8gYXZvaWQgcmVnZXhwIGlzc3Vlc1xucHJvY2Vzcy52ZXJzaW9ucyA9IHt9O1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtnZXREZXZpY2V9IGZyb20gJy4vdXRpbCc7XG5cbmNvbnN0IGphenpQbHVnaW5Jbml0VGltZSA9IDEwMDsgLy8gbWlsbGlzZWNvbmRzXG5cbmxldCBqYXp6SW5zdGFuY2VOdW1iZXIgPSAwO1xubGV0IGphenpJbnN0YW5jZXMgPSBuZXcgTWFwKCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVKYXp6SW5zdGFuY2UoY2FsbGJhY2spe1xuXG4gIGxldCBpZCA9ICdqYXp6XycgKyBqYXp6SW5zdGFuY2VOdW1iZXIrKyArICcnICsgRGF0ZS5ub3coKTtcbiAgbGV0IGluc3RhbmNlO1xuICBsZXQgb2JqUmVmLCBhY3RpdmVYO1xuXG4gIGlmKGdldERldmljZSgpLm5vZGVqcyA9PT0gdHJ1ZSl7XG4gICAgb2JqUmVmID0gbmV3IHdpbmRvdy5qYXp6TWlkaS5NSURJKCk7XG4gIH1lbHNle1xuICAgIGxldCBvMSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29iamVjdCcpO1xuICAgIG8xLmlkID0gaWQgKyAnaWUnO1xuICAgIG8xLmNsYXNzaWQgPSAnQ0xTSUQ6MUFDRTE2MTgtMUM3RC00NTYxLUFFRTEtMzQ4NDJBQTg1RTkwJztcbiAgICBhY3RpdmVYID0gbzE7XG5cbiAgICBsZXQgbzIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvYmplY3QnKTtcbiAgICBvMi5pZCA9IGlkO1xuICAgIG8yLnR5cGUgPSAnYXVkaW8veC1qYXp6JztcbiAgICBvMS5hcHBlbmRDaGlsZChvMik7XG4gICAgb2JqUmVmID0gbzI7XG5cbiAgICBsZXQgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCdUaGlzIHBhZ2UgcmVxdWlyZXMgdGhlICcpKTtcblxuICAgIGxldCBhID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgIGEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ0phenogcGx1Z2luJykpO1xuICAgIGEuaHJlZiA9ICdodHRwOi8vamF6ei1zb2Z0Lm5ldC8nO1xuXG4gICAgZS5hcHBlbmRDaGlsZChhKTtcbiAgICBlLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKCcuJykpO1xuICAgIG8yLmFwcGVuZENoaWxkKGUpO1xuXG4gICAgbGV0IGluc2VydGlvblBvaW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ01JRElQbHVnaW4nKTtcbiAgICBpZighaW5zZXJ0aW9uUG9pbnQpIHtcbiAgICAgIC8vIENyZWF0ZSBoaWRkZW4gZWxlbWVudFxuICAgICAgaW5zZXJ0aW9uUG9pbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgIGluc2VydGlvblBvaW50LmlkID0gJ01JRElQbHVnaW4nO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUubGVmdCA9ICctOTk5OXB4JztcbiAgICAgIGluc2VydGlvblBvaW50LnN0eWxlLnRvcCA9ICctOTk5OXB4JztcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoaW5zZXJ0aW9uUG9pbnQpO1xuICAgIH1cbiAgICBpbnNlcnRpb25Qb2ludC5hcHBlbmRDaGlsZChvMSk7XG4gIH1cblxuXG4gIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICBpZihvYmpSZWYuaXNKYXp6ID09PSB0cnVlKXtcbiAgICAgIGluc3RhbmNlID0gb2JqUmVmO1xuICAgIH1lbHNlIGlmKGFjdGl2ZVguaXNKYXp6ID09PSB0cnVlKXtcbiAgICAgIGluc3RhbmNlID0gYWN0aXZlWDtcbiAgICB9XG4gICAgaWYoaW5zdGFuY2UgIT09IHVuZGVmaW5lZCl7XG4gICAgICBpbnN0YW5jZS5fcGVyZlRpbWVaZXJvID0gd2luZG93LnBlcmZvcm1hbmNlLm5vdygpO1xuICAgICAgamF6ekluc3RhbmNlcy5zZXQoaWQsIGluc3RhbmNlKTtcbiAgICB9XG4gICAgY2FsbGJhY2soaW5zdGFuY2UpO1xuICB9LCBqYXp6UGx1Z2luSW5pdFRpbWUpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRKYXp6SW5zdGFuY2UodHlwZSwgY2FsbGJhY2spe1xuICBsZXQgaW5zdGFuY2UgPSBudWxsO1xuICBsZXQga2V5ID0gdHlwZSA9PT0gJ2lucHV0JyA/ICdpbnB1dEluVXNlJyA6ICdvdXRwdXRJblVzZSc7XG5cbiAgZm9yKGxldCBpbnN0IG9mIGphenpJbnN0YW5jZXMudmFsdWVzKCkpe1xuICAgIGlmKGluc3Rba2V5XSAhPT0gdHJ1ZSl7XG4gICAgICAgIGluc3RhbmNlID0gaW5zdDtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgaWYoaW5zdGFuY2UgPT09IG51bGwpe1xuICAgIGNyZWF0ZUphenpJbnN0YW5jZShjYWxsYmFjayk7XG4gIH1lbHNle1xuICAgIGNhbGxiYWNrKGluc3RhbmNlKTtcbiAgfVxufVxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2NyZWF0ZUphenpJbnN0YW5jZSwgZ2V0SmF6ekluc3RhbmNlfSBmcm9tICcuL2phenonO1xuaW1wb3J0IHtNSURJSW5wdXR9IGZyb20gJy4vbWlkaV9pbnB1dCc7XG5pbXBvcnQge01JRElPdXRwdXR9IGZyb20gJy4vbWlkaV9vdXRwdXQnO1xuaW1wb3J0IHtNSURJQ29ubmVjdGlvbkV2ZW50fSBmcm9tICcuL21pZGljb25uZWN0aW9uX2V2ZW50JztcbmltcG9ydCB7Z2VuZXJhdGVVVUlEfSBmcm9tICcuL3V0aWwnO1xuXG5cbmxldCBtaWRpQWNjZXNzO1xubGV0IGphenpJbnN0YW5jZTtcbmxldCBtaWRpSW5wdXRzID0gbmV3IE1hcCgpO1xubGV0IG1pZGlPdXRwdXRzID0gbmV3IE1hcCgpO1xubGV0IG1pZGlJbnB1dElkcyA9IG5ldyBNYXAoKTtcbmxldCBtaWRpT3V0cHV0SWRzID0gbmV3IE1hcCgpO1xubGV0IGxpc3RlbmVycyA9IG5ldyBTZXQoKTtcblxuXG5jbGFzcyBNSURJQWNjZXNze1xuICBjb25zdHJ1Y3RvcihtaWRpSW5wdXRzLCBtaWRpT3V0cHV0cyl7XG4gICAgdGhpcy5zeXNleEVuYWJsZWQgPSB0cnVlO1xuICAgIHRoaXMuaW5wdXRzID0gbWlkaUlucHV0cztcbiAgICB0aGlzLm91dHB1dHMgPSBtaWRpT3V0cHV0cztcbiAgfVxuXG4gIGFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpe1xuICAgIGlmKHR5cGUgIT09ICdzdGF0ZWNoYW5nZScpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihsaXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gZmFsc2Upe1xuICAgICAgbGlzdGVuZXJzLnNldChsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSl7XG4gICAgaWYodHlwZSAhPT0gJ3N0YXRlY2hhbmdlJyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGxpc3RlbmVycy5oYXMobGlzdGVuZXIpID09PSB0cnVlKXtcbiAgICAgIGxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlTUlESUFjY2Vzcygpe1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiBleGVjdXRvcihyZXNvbHZlLCByZWplY3Qpe1xuXG4gICAgaWYobWlkaUFjY2VzcyAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHJlc29sdmUobWlkaUFjY2Vzcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY3JlYXRlSmF6ekluc3RhbmNlKGZ1bmN0aW9uKGluc3RhbmNlKXtcbiAgICAgIGlmKGluc3RhbmNlID09PSB1bmRlZmluZWQpe1xuICAgICAgICByZWplY3Qoe2NvZGU6IDF9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBqYXp6SW5zdGFuY2UgPSBpbnN0YW5jZTtcblxuICAgICAgY3JlYXRlTUlESVBvcnRzKGZ1bmN0aW9uKCl7XG4gICAgICAgIHNldHVwTGlzdGVuZXJzKCk7XG4gICAgICAgIG1pZGlBY2Nlc3MgPSBuZXcgTUlESUFjY2VzcyhtaWRpSW5wdXRzLCBtaWRpT3V0cHV0cyk7XG4gICAgICAgIHJlc29sdmUobWlkaUFjY2Vzcyk7XG4gICAgICB9KTtcbiAgICB9KTtcblxuICB9KTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTUlESVBvcnRzKGNhbGxiYWNrKXtcbiAgbGV0IGlucHV0cyA9IGphenpJbnN0YW5jZS5NaWRpSW5MaXN0KCk7XG4gIGxldCBvdXRwdXRzID0gamF6ekluc3RhbmNlLk1pZGlPdXRMaXN0KCk7XG4gIGxldCBudW1JbnB1dHMgPSBpbnB1dHMubGVuZ3RoO1xuICBsZXQgbnVtT3V0cHV0cyA9IG91dHB1dHMubGVuZ3RoO1xuXG4gIGxvb3BDcmVhdGVNSURJUG9ydCgwLCBudW1JbnB1dHMsICdpbnB1dCcsIGlucHV0cywgZnVuY3Rpb24oKXtcbiAgICBsb29wQ3JlYXRlTUlESVBvcnQoMCwgbnVtT3V0cHV0cywgJ291dHB1dCcsIG91dHB1dHMsIGNhbGxiYWNrKTtcbiAgfSk7XG59XG5cblxuZnVuY3Rpb24gbG9vcENyZWF0ZU1JRElQb3J0KGluZGV4LCBtYXgsIHR5cGUsIGxpc3QsIGNhbGxiYWNrKXtcbiAgaWYoaW5kZXggPCBtYXgpe1xuICAgIGxldCBuYW1lID0gbGlzdFtpbmRleCsrXTtcbiAgICBjcmVhdGVNSURJUG9ydCh0eXBlLCBuYW1lLCBmdW5jdGlvbigpe1xuICAgICAgbG9vcENyZWF0ZU1JRElQb3J0KGluZGV4LCBtYXgsIHR5cGUsIGxpc3QsIGNhbGxiYWNrKTtcbiAgICB9KTtcbiAgfWVsc2V7XG4gICAgY2FsbGJhY2soKTtcbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGNyZWF0ZU1JRElQb3J0KHR5cGUsIG5hbWUsIGNhbGxiYWNrKXtcbiAgZ2V0SmF6ekluc3RhbmNlKHR5cGUsIGZ1bmN0aW9uKGluc3RhbmNlKXtcbiAgICBsZXQgcG9ydDtcbiAgICBsZXQgaW5mbyA9IFtuYW1lLCAnJywgJyddO1xuICAgIGlmKHR5cGUgPT09ICdpbnB1dCcpe1xuICAgICAgaWYoaW5zdGFuY2UuU3VwcG9ydCgnTWlkaUluSW5mbycpKXtcbiAgICAgICAgaW5mbyA9IGluc3RhbmNlLk1pZGlJbkluZm8obmFtZSk7XG4gICAgICB9XG4gICAgICBwb3J0ID0gbmV3IE1JRElJbnB1dChpbmZvLCBpbnN0YW5jZSk7XG4gICAgICBtaWRpSW5wdXRzLnNldChwb3J0LmlkLCBwb3J0KTtcbiAgICB9ZWxzZSBpZih0eXBlID09PSAnb3V0cHV0Jyl7XG4gICAgICBpZihpbnN0YW5jZS5TdXBwb3J0KCdNaWRpT3V0SW5mbycpKXtcbiAgICAgICAgaW5mbyA9IGluc3RhbmNlLk1pZGlPdXRJbmZvKG5hbWUpO1xuICAgICAgfVxuICAgICAgcG9ydCA9IG5ldyBNSURJT3V0cHV0KGluZm8sIGluc3RhbmNlKTtcbiAgICAgIG1pZGlPdXRwdXRzLnNldChwb3J0LmlkLCBwb3J0KTtcbiAgICB9XG4gICAgY2FsbGJhY2socG9ydCk7XG4gIH0pO1xufVxuXG5cbmZ1bmN0aW9uIGdldFBvcnRCeU5hbWUocG9ydHMsIG5hbWUpe1xuICBsZXQgcG9ydDtcbiAgZm9yKHBvcnQgb2YgcG9ydHMudmFsdWVzKCkpe1xuICAgIGlmKHBvcnQubmFtZSA9PT0gbmFtZSl7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHBvcnQ7XG59XG5cblxuZnVuY3Rpb24gc2V0dXBMaXN0ZW5lcnMoKXtcbiAgamF6ekluc3RhbmNlLk9uRGlzY29ubmVjdE1pZGlJbihmdW5jdGlvbihuYW1lKXtcbiAgICBsZXQgcG9ydCA9IGdldFBvcnRCeU5hbWUobWlkaUlucHV0cywgbmFtZSk7XG4gICAgaWYocG9ydCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHBvcnQuc3RhdGUgPSAnZGlzY29ubmVjdGVkJztcbiAgICAgIHBvcnQuY2xvc2UoKTtcbiAgICAgIHBvcnQuX2phenpJbnN0YW5jZS5pbnB1dEluVXNlID0gZmFsc2U7XG4gICAgICBtaWRpSW5wdXRzLmRlbGV0ZShwb3J0LmlkKTtcbiAgICAgIGRpc3BhdGNoRXZlbnQocG9ydCk7XG4gICAgfVxuICB9KTtcblxuICBqYXp6SW5zdGFuY2UuT25EaXNjb25uZWN0TWlkaU91dChmdW5jdGlvbihuYW1lKXtcbiAgICBsZXQgcG9ydCA9IGdldFBvcnRCeU5hbWUobWlkaU91dHB1dHMsIG5hbWUpO1xuICAgIGlmKHBvcnQgIT09IHVuZGVmaW5lZCl7XG4gICAgICBwb3J0LnN0YXRlID0gJ2Rpc2Nvbm5lY3RlZCc7XG4gICAgICBwb3J0LmNsb3NlKCk7XG4gICAgICBwb3J0Ll9qYXp6SW5zdGFuY2Uub3V0cHV0SW5Vc2UgPSBmYWxzZTtcbiAgICAgIG1pZGlPdXRwdXRzLmRlbGV0ZShwb3J0LmlkKTtcbiAgICAgIGRpc3BhdGNoRXZlbnQocG9ydCk7XG4gICAgfVxuICB9KTtcblxuICBqYXp6SW5zdGFuY2UuT25Db25uZWN0TWlkaUluKGZ1bmN0aW9uKG5hbWUpe1xuICAgIGNyZWF0ZU1JRElQb3J0KCdpbnB1dCcsIG5hbWUsIGZ1bmN0aW9uKHBvcnQpe1xuICAgICAgZGlzcGF0Y2hFdmVudChwb3J0KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgamF6ekluc3RhbmNlLk9uQ29ubmVjdE1pZGlPdXQoZnVuY3Rpb24obmFtZSl7XG4gICAgY3JlYXRlTUlESVBvcnQoJ291dHB1dCcsIG5hbWUsIGZ1bmN0aW9uKHBvcnQpe1xuICAgICAgZGlzcGF0Y2hFdmVudChwb3J0KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoRXZlbnQocG9ydCl7XG5cbiAgcG9ydC5kaXNwYXRjaEV2ZW50KG5ldyBNSURJQ29ubmVjdGlvbkV2ZW50KHBvcnQsIHBvcnQpKTtcblxuICBsZXQgZXZ0ID0gbmV3IE1JRElDb25uZWN0aW9uRXZlbnQobWlkaUFjY2VzcywgcG9ydCk7XG5cbiAgaWYodHlwZW9mIG1pZGlBY2Nlc3Mub25zdGF0ZWNoYW5nZSA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgbWlkaUFjY2Vzcy5vbnN0YXRlY2hhbmdlKGV2dCk7XG4gIH1cbiAgZm9yKGxldCBsaXN0ZW5lciBvZiBsaXN0ZW5lcnMpe1xuICAgIGxpc3RlbmVyKGV2dCk7XG4gIH1cbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gY2xvc2VBbGxNSURJSW5wdXRzKCl7XG4gIG1pZGlJbnB1dHMuZm9yRWFjaChmdW5jdGlvbihpbnB1dCl7XG4gICAgLy9pbnB1dC5jbG9zZSgpO1xuICAgIGlucHV0Ll9qYXp6SW5zdGFuY2UuTWlkaUluQ2xvc2UoKTtcbiAgfSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldE1JRElEZXZpY2VJZChuYW1lLCB0eXBlKXtcbiAgbGV0IGlkO1xuICBpZih0eXBlID09PSAnaW5wdXQnKXtcbiAgICBpZCA9IG1pZGlJbnB1dElkcy5nZXQobmFtZSk7XG4gICAgaWYoaWQgPT09IHVuZGVmaW5lZCl7XG4gICAgICBpZCA9IGdlbmVyYXRlVVVJRCgpO1xuICAgICAgbWlkaUlucHV0SWRzLnNldChuYW1lLCBpZCk7XG4gICAgfVxuICB9ZWxzZSBpZih0eXBlID09PSAnb3V0cHV0Jyl7XG4gICAgaWQgPSBtaWRpT3V0cHV0SWRzLmdldChuYW1lKTtcbiAgICBpZihpZCA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIGlkID0gZ2VuZXJhdGVVVUlEKCk7XG4gICAgICBtaWRpT3V0cHV0SWRzLnNldChuYW1lLCBpZCk7XG4gICAgfVxuICB9XG4gIHJldHVybiBpZDtcbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldERldmljZX0gZnJvbSAnLi91dGlsJztcbmltcG9ydCB7TUlESU1lc3NhZ2VFdmVudH0gZnJvbSAnLi9taWRpbWVzc2FnZV9ldmVudCc7XG5pbXBvcnQge01JRElDb25uZWN0aW9uRXZlbnR9IGZyb20gJy4vbWlkaWNvbm5lY3Rpb25fZXZlbnQnO1xuaW1wb3J0IHtkaXNwYXRjaEV2ZW50LCBnZXRNSURJRGV2aWNlSWR9IGZyb20gJy4vbWlkaV9hY2Nlc3MnO1xuXG5sZXQgbWlkaVByb2M7XG5sZXQgbm9kZWpzID0gZ2V0RGV2aWNlKCkubm9kZWpzO1xuXG5leHBvcnQgY2xhc3MgTUlESUlucHV0e1xuICBjb25zdHJ1Y3RvcihpbmZvLCBpbnN0YW5jZSl7XG4gICAgdGhpcy5pZCA9IGdldE1JRElEZXZpY2VJZChpbmZvWzBdLCAnaW5wdXQnKTtcbiAgICB0aGlzLm5hbWUgPSBpbmZvWzBdO1xuICAgIHRoaXMubWFudWZhY3R1cmVyID0gaW5mb1sxXTtcbiAgICB0aGlzLnZlcnNpb24gPSBpbmZvWzJdO1xuICAgIHRoaXMudHlwZSA9ICdpbnB1dCc7XG4gICAgdGhpcy5zdGF0ZSA9ICdjb25uZWN0ZWQnO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdwZW5kaW5nJztcblxuICAgIHRoaXMub25zdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgdGhpcy5fb25taWRpbWVzc2FnZSA9IG51bGw7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsICdvbm1pZGltZXNzYWdlJywge1xuICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgIHRoaXMuX29ubWlkaW1lc3NhZ2UgPSB2YWx1ZTtcbiAgICAgICAgaWYodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuXG4gICAgdGhpcy5fbGlzdGVuZXJzID0gbmV3IE1hcCgpLnNldCgnbWlkaW1lc3NhZ2UnLCBuZXcgU2V0KCkpLnNldCgnc3RhdGVjaGFuZ2UnLCBuZXcgU2V0KCkpO1xuICAgIHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSA9IGZhbHNlO1xuICAgIHRoaXMuX3N5c2V4QnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkoKTtcblxuICAgIHRoaXMuX2phenpJbnN0YW5jZSA9IGluc3RhbmNlO1xuICAgIHRoaXMuX2phenpJbnN0YW5jZS5pbnB1dEluVXNlID0gdHJ1ZTtcbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaUluT3Blbih0aGlzLm5hbWUsIG1pZGlQcm9jLmJpbmQodGhpcykpO1xuICAgIH1cbiAgfVxuXG4gIGFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpe1xuICAgIGxldCBsaXN0ZW5lcnMgPSB0aGlzLl9saXN0ZW5lcnMuZ2V0KHR5cGUpO1xuICAgIGlmKGxpc3RlbmVycyA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZihsaXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gZmFsc2Upe1xuICAgICAgbGlzdGVuZXJzLmFkZChsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSl7XG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQodHlwZSk7XG4gICAgaWYobGlzdGVuZXJzID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKGxpc3RlbmVycy5oYXMobGlzdGVuZXIpID09PSBmYWxzZSl7XG4gICAgICBsaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICBwcmV2ZW50RGVmYXVsdCgpe1xuICAgIHRoaXMuX3B2dERlZiA9IHRydWU7XG4gIH1cblxuICBkaXNwYXRjaEV2ZW50KGV2dCl7XG4gICAgdGhpcy5fcHZ0RGVmID0gZmFsc2U7XG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQoZXZ0LnR5cGUpO1xuICAgIGxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKXtcbiAgICAgIGxpc3RlbmVyKGV2dCk7XG4gICAgfSk7XG5cbiAgICBpZihldnQudHlwZSA9PT0gJ21pZGltZXNzYWdlJyl7XG4gICAgICBpZih0aGlzLl9vbm1pZGltZXNzYWdlICE9PSBudWxsKXtcbiAgICAgICAgdGhpcy5fb25taWRpbWVzc2FnZShldnQpO1xuICAgICAgfVxuICAgIH1lbHNlIGlmKGV2dC50eXBlID09PSAnc3RhdGVjaGFuZ2UnKXtcbiAgICAgIGlmKHRoaXMub25zdGF0ZWNoYW5nZSAhPT0gbnVsbCl7XG4gICAgICAgIHRoaXMub25zdGF0ZWNoYW5nZShldnQpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9wdnREZWY7XG4gIH1cblxuICBvcGVuKCl7XG4gICAgaWYodGhpcy5jb25uZWN0aW9uID09PSAnb3Blbicpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSAhPT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaUluT3Blbih0aGlzLm5hbWUsIG1pZGlQcm9jLmJpbmQodGhpcykpO1xuICAgIH1cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSAnb3Blbic7XG4gICAgZGlzcGF0Y2hFdmVudCh0aGlzKTsgLy8gZGlzcGF0Y2ggZXZlbnQgdmlhIE1JRElBY2Nlc3NcbiAgfVxuXG4gIGNsb3NlKCl7XG4gICAgaWYodGhpcy5jb25uZWN0aW9uID09PSAnY2xvc2VkJyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGdldERldmljZSgpLnBsYXRmb3JtICE9PSAnbGludXgnKXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpSW5DbG9zZSh0aGlzLm5hbWUpO1xuICAgIH1cbiAgICB0aGlzLmNvbm5lY3Rpb24gPSAnY2xvc2VkJztcbiAgICBkaXNwYXRjaEV2ZW50KHRoaXMpOyAvLyBkaXNwYXRjaCBldmVudCB2aWEgTUlESUFjY2Vzc1xuICAgIHRoaXMuX29ubWlkaW1lc3NhZ2UgPSBudWxsO1xuICAgIHRoaXMub25zdGF0ZWNoYW5nZSA9IG51bGw7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmdldCgnbWlkaW1lc3NhZ2UnKS5jbGVhcigpO1xuICAgIHRoaXMuX2xpc3RlbmVycy5nZXQoJ3N0YXRlY2hhbmdlJykuY2xlYXIoKTtcbiAgfVxuXG4gIF9hcHBlbmRUb1N5c2V4QnVmZmVyKGRhdGEpe1xuICAgIGxldCBvbGRMZW5ndGggPSB0aGlzLl9zeXNleEJ1ZmZlci5sZW5ndGg7XG4gICAgbGV0IHRtcEJ1ZmZlciA9IG5ldyBVaW50OEFycmF5KG9sZExlbmd0aCArIGRhdGEubGVuZ3RoKTtcbiAgICB0bXBCdWZmZXIuc2V0KHRoaXMuX3N5c2V4QnVmZmVyKTtcbiAgICB0bXBCdWZmZXIuc2V0KGRhdGEsIG9sZExlbmd0aCk7XG4gICAgdGhpcy5fc3lzZXhCdWZmZXIgPSB0bXBCdWZmZXI7XG4gIH1cblxuXG4gIF9idWZmZXJMb25nU3lzZXgoZGF0YSwgaW5pdGlhbE9mZnNldCl7XG4gICAgbGV0IGogPSBpbml0aWFsT2Zmc2V0O1xuICAgIHdoaWxlKGogPGRhdGEubGVuZ3RoKXtcbiAgICAgIGlmKGRhdGFbal0gPT0gMHhGNyl7XG4gICAgICAgIC8vIGVuZCBvZiBzeXNleCFcbiAgICAgICAgaisrO1xuICAgICAgICB0aGlzLl9hcHBlbmRUb1N5c2V4QnVmZmVyKGRhdGEuc2xpY2UoaW5pdGlhbE9mZnNldCwgaikpO1xuICAgICAgICByZXR1cm4gajtcbiAgICAgIH1cbiAgICAgIGorKztcbiAgICB9XG4gICAgLy8gZGlkbid0IHJlYWNoIHRoZSBlbmQ7IGp1c3QgdGFjayBpdCBvbi5cbiAgICB0aGlzLl9hcHBlbmRUb1N5c2V4QnVmZmVyKGRhdGEuc2xpY2UoaW5pdGlhbE9mZnNldCwgaikpO1xuICAgIHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSA9IHRydWU7XG4gICAgcmV0dXJuIGo7XG4gIH1cbn1cblxuXG5taWRpUHJvYyA9IGZ1bmN0aW9uKHRpbWVzdGFtcCwgZGF0YSl7XG4gIGxldCBsZW5ndGggPSAwO1xuICBsZXQgaTtcbiAgbGV0IGlzU3lzZXhNZXNzYWdlID0gZmFsc2U7XG5cbiAgLy8gSmF6eiBzb21ldGltZXMgcGFzc2VzIHVzIG11bHRpcGxlIG1lc3NhZ2VzIGF0IG9uY2UsIHNvIHdlIG5lZWQgdG8gcGFyc2UgdGhlbSBvdXRcbiAgLy8gYW5kIHBhc3MgdGhlbSBvbmUgYXQgYSB0aW1lLlxuXG4gIGZvcihpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpICs9IGxlbmd0aCl7XG4gICAgbGV0IGlzVmFsaWRNZXNzYWdlID0gdHJ1ZTtcbiAgICBpZih0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2Upe1xuICAgICAgaSA9IHRoaXMuX2J1ZmZlckxvbmdTeXNleChkYXRhLCBpKTtcbiAgICAgIGlmKGRhdGFbaS0xXSAhPSAweGY3KXtcbiAgICAgICAgLy8gcmFuIG9mZiB0aGUgZW5kIHdpdGhvdXQgaGl0dGluZyB0aGUgZW5kIG9mIHRoZSBzeXNleCBtZXNzYWdlXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlzU3lzZXhNZXNzYWdlID0gdHJ1ZTtcbiAgICB9ZWxzZXtcbiAgICAgIGlzU3lzZXhNZXNzYWdlID0gZmFsc2U7XG4gICAgICBzd2l0Y2goZGF0YVtpXSAmIDB4RjApe1xuICAgICAgICBjYXNlIDB4MDA6ICAvLyBDaGV3IHVwIHNwdXJpb3VzIDB4MDAgYnl0ZXMuICBGaXhlcyBhIFdpbmRvd3MgcHJvYmxlbS5cbiAgICAgICAgICBsZW5ndGggPSAxO1xuICAgICAgICAgIGlzVmFsaWRNZXNzYWdlID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAweDgwOiAgLy8gbm90ZSBvZmZcbiAgICAgICAgY2FzZSAweDkwOiAgLy8gbm90ZSBvblxuICAgICAgICBjYXNlIDB4QTA6ICAvLyBwb2x5cGhvbmljIGFmdGVydG91Y2hcbiAgICAgICAgY2FzZSAweEIwOiAgLy8gY29udHJvbCBjaGFuZ2VcbiAgICAgICAgY2FzZSAweEUwOiAgLy8gY2hhbm5lbCBtb2RlXG4gICAgICAgICAgbGVuZ3RoID0gMztcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDB4QzA6ICAvLyBwcm9ncmFtIGNoYW5nZVxuICAgICAgICBjYXNlIDB4RDA6ICAvLyBjaGFubmVsIGFmdGVydG91Y2hcbiAgICAgICAgICBsZW5ndGggPSAyO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMHhGMDpcbiAgICAgICAgICBzd2l0Y2goZGF0YVtpXSl7XG4gICAgICAgICAgICBjYXNlIDB4ZjA6ICAvLyBsZXRpYWJsZS1sZW5ndGggc3lzZXguXG4gICAgICAgICAgICAgIGkgPSB0aGlzLl9idWZmZXJMb25nU3lzZXgoZGF0YSxpKTtcbiAgICAgICAgICAgICAgaWYoZGF0YVtpLTFdICE9IDB4Zjcpe1xuICAgICAgICAgICAgICAgIC8vIHJhbiBvZmYgdGhlIGVuZCB3aXRob3V0IGhpdHRpbmcgdGhlIGVuZCBvZiB0aGUgc3lzZXggbWVzc2FnZVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpc1N5c2V4TWVzc2FnZSA9IHRydWU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDB4RjE6ICAvLyBNVEMgcXVhcnRlciBmcmFtZVxuICAgICAgICAgICAgY2FzZSAweEYzOiAgLy8gc29uZyBzZWxlY3RcbiAgICAgICAgICAgICAgbGVuZ3RoID0gMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMHhGMjogIC8vIHNvbmcgcG9zaXRpb24gcG9pbnRlclxuICAgICAgICAgICAgICBsZW5ndGggPSAzO1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgbGVuZ3RoID0gMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZighaXNWYWxpZE1lc3NhZ2Upe1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgbGV0IGV2dCA9IHt9O1xuICAgIGV2dC5yZWNlaXZlZFRpbWUgPSBwYXJzZUZsb2F0KHRpbWVzdGFtcC50b1N0cmluZygpKSArIHRoaXMuX2phenpJbnN0YW5jZS5fcGVyZlRpbWVaZXJvO1xuXG4gICAgaWYoaXNTeXNleE1lc3NhZ2UgfHwgdGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlKXtcbiAgICAgIGV2dC5kYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fc3lzZXhCdWZmZXIpO1xuICAgICAgdGhpcy5fc3lzZXhCdWZmZXIgPSBuZXcgVWludDhBcnJheSgwKTtcbiAgICAgIHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSA9IGZhbHNlO1xuICAgIH1lbHNle1xuICAgICAgZXZ0LmRhdGEgPSBuZXcgVWludDhBcnJheShkYXRhLnNsaWNlKGksIGxlbmd0aCArIGkpKTtcbiAgICB9XG5cbiAgICBpZihub2RlanMpe1xuICAgICAgaWYodGhpcy5fb25taWRpbWVzc2FnZSl7XG4gICAgICAgIHRoaXMuX29ubWlkaW1lc3NhZ2UoZXZ0KTtcbiAgICAgIH1cbiAgICB9ZWxzZXtcbiAgICAgIGxldCBlID0gbmV3IE1JRElNZXNzYWdlRXZlbnQodGhpcywgZXZ0LmRhdGEsIGV2dC5yZWNlaXZlZFRpbWUpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH1cbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Z2V0RGV2aWNlfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtkaXNwYXRjaEV2ZW50LCBnZXRNSURJRGV2aWNlSWR9IGZyb20gJy4vbWlkaV9hY2Nlc3MnO1xuXG5leHBvcnQgY2xhc3MgTUlESU91dHB1dHtcbiAgY29uc3RydWN0b3IoaW5mbywgaW5zdGFuY2Upe1xuICAgIHRoaXMuaWQgPSBnZXRNSURJRGV2aWNlSWQoaW5mb1swXSwgJ291dHB1dCcpO1xuICAgIHRoaXMubmFtZSA9IGluZm9bMF07XG4gICAgdGhpcy5tYW51ZmFjdHVyZXIgPSBpbmZvWzFdO1xuICAgIHRoaXMudmVyc2lvbiA9IGluZm9bMl07XG4gICAgdGhpcy50eXBlID0gJ291dHB1dCc7XG4gICAgdGhpcy5zdGF0ZSA9ICdjb25uZWN0ZWQnO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdwZW5kaW5nJztcbiAgICB0aGlzLm9ubWlkaW1lc3NhZ2UgPSBudWxsO1xuICAgIHRoaXMub25zdGF0ZWNoYW5nZSA9IG51bGw7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlID0gZmFsc2U7XG4gICAgdGhpcy5fc3lzZXhCdWZmZXIgPSBuZXcgVWludDhBcnJheSgpO1xuXG4gICAgdGhpcy5famF6ekluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgdGhpcy5famF6ekluc3RhbmNlLm91dHB1dEluVXNlID0gdHJ1ZTtcbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dE9wZW4odGhpcy5uYW1lKTtcbiAgICB9XG4gIH1cblxuICBvcGVuKCl7XG4gICAgaWYodGhpcy5jb25uZWN0aW9uID09PSAnb3Blbicpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSAhPT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dE9wZW4odGhpcy5uYW1lKTtcbiAgICB9XG4gICAgdGhpcy5jb25uZWN0aW9uID0gJ29wZW4nO1xuICAgIGRpc3BhdGNoRXZlbnQodGhpcyk7IC8vIGRpc3BhdGNoIGV2ZW50IHZpYSBNSURJQWNjZXNzXG4gIH1cblxuICBjbG9zZSgpe1xuICAgIGlmKHRoaXMuY29ubmVjdGlvbiA9PT0gJ2Nsb3NlZCcpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSAhPT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dENsb3NlKHRoaXMubmFtZSk7XG4gICAgfVxuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdjbG9zZWQnO1xuICAgIGRpc3BhdGNoRXZlbnQodGhpcyk7IC8vIGRpc3BhdGNoIGV2ZW50IHZpYSBNSURJQWNjZXNzXG4gICAgdGhpcy5vbnN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICB0aGlzLl9saXN0ZW5lcnMuY2xlYXIoKTtcbiAgfVxuXG4gIHNlbmQoZGF0YSwgdGltZXN0YW1wKXtcbiAgICBsZXQgZGVsYXlCZWZvcmVTZW5kID0gMDtcblxuICAgIGlmKGRhdGEubGVuZ3RoID09PSAwKXtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZih0aW1lc3RhbXApe1xuICAgICAgZGVsYXlCZWZvcmVTZW5kID0gTWF0aC5mbG9vcih0aW1lc3RhbXAgLSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkpO1xuICAgIH1cblxuICAgIGlmKHRpbWVzdGFtcCAmJiAoZGVsYXlCZWZvcmVTZW5kID4gMSkpe1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dExvbmcoZGF0YSk7XG4gICAgICB9LCBkZWxheUJlZm9yZVNlbmQpO1xuICAgIH1lbHNle1xuICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlPdXRMb25nKGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpe1xuICAgIGlmKHR5cGUgIT09ICdzdGF0ZWNoYW5nZScpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKHRoaXMuX2xpc3RlbmVycy5oYXMobGlzdGVuZXIpID09PSBmYWxzZSl7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKXtcbiAgICBpZih0eXBlICE9PSAnc3RhdGVjaGFuZ2UnKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZih0aGlzLl9saXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gZmFsc2Upe1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgZGlzcGF0Y2hFdmVudChldnQpe1xuICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKXtcbiAgICAgIGxpc3RlbmVyKGV2dCk7XG4gICAgfSk7XG5cbiAgICBpZih0aGlzLm9uc3RhdGVjaGFuZ2UgIT09IG51bGwpe1xuICAgICAgdGhpcy5vbnN0YXRlY2hhbmdlKGV2dCk7XG4gICAgfVxuICB9XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgY2xhc3MgTUlESUNvbm5lY3Rpb25FdmVudHtcbiAgY29uc3RydWN0b3IobWlkaUFjY2VzcywgcG9ydCl7XG4gICAgdGhpcy5idWJibGVzID0gZmFsc2U7XG4gICAgdGhpcy5jYW5jZWxCdWJibGUgPSBmYWxzZTtcbiAgICB0aGlzLmNhbmNlbGFibGUgPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBtaWRpQWNjZXNzO1xuICAgIHRoaXMuZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuZXZlbnRQaGFzZSA9IDA7XG4gICAgdGhpcy5wYXRoID0gW107XG4gICAgdGhpcy5wb3J0ID0gcG9ydDtcbiAgICB0aGlzLnJldHVyblZhbHVlID0gdHJ1ZTtcbiAgICB0aGlzLnNyY0VsZW1lbnQgPSBtaWRpQWNjZXNzO1xuICAgIHRoaXMudGFyZ2V0ID0gbWlkaUFjY2VzcztcbiAgICB0aGlzLnRpbWVTdGFtcCA9IERhdGUubm93KCk7XG4gICAgdGhpcy50eXBlID0gJ3N0YXRlY2hhbmdlJztcbiAgfVxufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjbGFzcyBNSURJTWVzc2FnZUV2ZW50e1xuICBjb25zdHJ1Y3Rvcihwb3J0LCBkYXRhLCByZWNlaXZlZFRpbWUpe1xuICAgIHRoaXMuYnViYmxlcyA9IGZhbHNlO1xuICAgIHRoaXMuY2FuY2VsQnViYmxlID0gZmFsc2U7XG4gICAgdGhpcy5jYW5jZWxhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gcG9ydDtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuZXZlbnRQaGFzZSA9IDA7XG4gICAgdGhpcy5wYXRoID0gW107XG4gICAgdGhpcy5yZWNlaXZlZFRpbWUgPSByZWNlaXZlZFRpbWU7XG4gICAgdGhpcy5yZXR1cm5WYWx1ZSA9IHRydWU7XG4gICAgdGhpcy5zcmNFbGVtZW50ID0gcG9ydDtcbiAgICB0aGlzLnRhcmdldCA9IHBvcnQ7XG4gICAgdGhpcy50aW1lU3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMudHlwZSA9ICdtaWRpbWVzc2FnZSc7XG4gIH1cbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyByZXF1aXJlZCBieSBiYWJlbGlmeSBmb3IgdHJhbnNwaWxpbmcgZXM2XG4vL3JlcXVpcmUoJ2JhYmVsaWZ5L3BvbHlmaWxsJyk7XG5cbmltcG9ydCB7Y3JlYXRlTUlESUFjY2VzcywgY2xvc2VBbGxNSURJSW5wdXRzfSBmcm9tICcuL21pZGlfYWNjZXNzJztcbmltcG9ydCB7cG9seWZpbGwsIGdldERldmljZX0gZnJvbSAnLi91dGlsJztcblxubGV0IG1pZGlBY2Nlc3M7XG5cbihmdW5jdGlvbigpe1xuICBpZighd2luZG93Lm5hdmlnYXRvci5yZXF1ZXN0TUlESUFjY2Vzcyl7XG4gICAgcG9seWZpbGwoKTtcbiAgICB3aW5kb3cubmF2aWdhdG9yLnJlcXVlc3RNSURJQWNjZXNzID0gZnVuY3Rpb24oKXtcbiAgICAgIGlmKG1pZGlBY2Nlc3MgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgbWlkaUFjY2VzcyA9IGNyZWF0ZU1JRElBY2Nlc3MoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtaWRpQWNjZXNzO1xuICAgIH07XG4gICAgaWYoZ2V0RGV2aWNlKCkubm9kZWpzID09PSB0cnVlKXtcbiAgICAgIHdpbmRvdy5uYXZpZ2F0b3IuY2xvc2UgPSBmdW5jdGlvbigpe1xuICAgICAgICAvLyBOZWVkIHRvIGNsb3NlIE1JREkgaW5wdXQgcG9ydHMsIG90aGVyd2lzZSBOb2RlLmpzIHdpbGwgd2FpdCBmb3IgTUlESSBpbnB1dCBmb3JldmVyLlxuICAgICAgICBjbG9zZUFsbE1JRElJbnB1dHMoKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG59KCkpOyIsIid1c2Ugc3RyaWN0JztcblxuLy8gY2hlY2sgaWYgdGhlIHNoaW0gaXMgcnVubmluZyBpbiBub2RlanNcbmV4cG9ydCBjb25zdCBpbk5vZGVKcyA9ICh0eXBlb2YgX19kaXJuYW1lICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuamF6ek1pZGkpO1xuXG5cbmxldCBkZXZpY2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZXZpY2UoKXtcblxuICBpZihkZXZpY2UgIT09IHVuZGVmaW5lZCl7XG4gICAgcmV0dXJuIGRldmljZTtcbiAgfVxuXG4gIGxldFxuICAgIHBsYXRmb3JtID0gJ3VuZGV0ZWN0ZWQnLFxuICAgIGJyb3dzZXIgPSAndW5kZXRlY3RlZCcsXG4gICAgbm9kZWpzID0gZmFsc2U7XG5cbiAgaWYobmF2aWdhdG9yID09PSB1bmRlZmluZWQpe1xuICAgIG5vZGVqcyA9ICh0eXBlb2YgX19kaXJuYW1lICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuamF6ek1pZGkpO1xuICAgIGlmKG5vZGVqcyA9PT0gdHJ1ZSl7XG4gICAgICBwbGF0Zm9ybSA9IHByb2Nlc3MucGxhdGZvcm07XG4gICAgfVxuICAgIGRldmljZSA9IHtcbiAgICAgIHBsYXRmb3JtOiBwbGF0Zm9ybSxcbiAgICAgIGJyb3dzZXI6IGZhbHNlLFxuICAgICAgbm9kZWpzOiBub2RlanMsXG4gICAgICBtb2JpbGU6IHBsYXRmb3JtID09PSAnaW9zJyB8fCBwbGF0Zm9ybSA9PT0gJ2FuZHJvaWQnXG4gICAgfTtcbiAgICByZXR1cm4gZGV2aWNlO1xuICB9XG5cblxuICBsZXQgdWEgPSBuYXZpZ2F0b3IudXNlckFnZW50O1xuXG4gIGlmKHVhLm1hdGNoKC8oaVBhZHxpUGhvbmV8aVBvZCkvZykpe1xuICAgIHBsYXRmb3JtID0gJ2lvcyc7XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ0FuZHJvaWQnKSAhPT0gLTEpe1xuICAgIHBsYXRmb3JtID0gJ2FuZHJvaWQnO1xuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdMaW51eCcpICE9PSAtMSl7XG4gICAgcGxhdGZvcm0gPSAnbGludXgnO1xuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdNYWNpbnRvc2gnKSAhPT0gLTEpe1xuICAgIHBsYXRmb3JtID0gJ29zeCc7XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ1dpbmRvd3MnKSAhPT0gLTEpe1xuICAgIHBsYXRmb3JtID0gJ3dpbmRvd3MnO1xuICB9XG5cbiAgaWYodWEuaW5kZXhPZignQ2hyb21lJykgIT09IC0xKXtcbiAgICAvLyBjaHJvbWUsIGNocm9taXVtIGFuZCBjYW5hcnlcbiAgICBicm93c2VyID0gJ2Nocm9tZSc7XG5cbiAgICBpZih1YS5pbmRleE9mKCdPUFInKSAhPT0gLTEpe1xuICAgICAgYnJvd3NlciA9ICdvcGVyYSc7XG4gICAgfWVsc2UgaWYodWEuaW5kZXhPZignQ2hyb21pdW0nKSAhPT0gLTEpe1xuICAgICAgYnJvd3NlciA9ICdjaHJvbWl1bSc7XG4gICAgfVxuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdTYWZhcmknKSAhPT0gLTEpe1xuICAgIGJyb3dzZXIgPSAnc2FmYXJpJztcbiAgfWVsc2UgaWYodWEuaW5kZXhPZignRmlyZWZveCcpICE9PSAtMSl7XG4gICAgYnJvd3NlciA9ICdmaXJlZm94JztcbiAgfWVsc2UgaWYodWEuaW5kZXhPZignVHJpZGVudCcpICE9PSAtMSl7XG4gICAgYnJvd3NlciA9ICdpZSc7XG4gICAgaWYodWEuaW5kZXhPZignTVNJRSA5Jykpe1xuICAgICAgYnJvd3NlciA9ICdpZSA5JztcbiAgICB9XG4gIH1cblxuICBpZihwbGF0Zm9ybSA9PT0gJ2lvcycpe1xuICAgIGlmKHVhLmluZGV4T2YoJ0NyaU9TJykgIT09IC0xKXtcbiAgICAgIGJyb3dzZXIgPSAnY2hyb21lJztcbiAgICB9XG4gIH1cblxuICBkZXZpY2UgPSB7XG4gICAgcGxhdGZvcm06IHBsYXRmb3JtLFxuICAgIGJyb3dzZXI6IGJyb3dzZXIsXG4gICAgbW9iaWxlOiBwbGF0Zm9ybSA9PT0gJ2lvcycgfHwgcGxhdGZvcm0gPT09ICdhbmRyb2lkJyxcbiAgICBub2RlanM6IGZhbHNlXG4gIH07XG4gIHJldHVybiBkZXZpY2U7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlmaWxsUGVyZm9ybWFuY2UoKXtcblxuICBpZih3aW5kb3cucGVyZm9ybWFuY2UgPT09IHVuZGVmaW5lZCl7XG4gICAgd2luZG93LnBlcmZvcm1hbmNlID0ge307XG4gIH1cblxuICBEYXRlLm5vdyA9IChEYXRlLm5vdyB8fCBmdW5jdGlvbigpe1xuICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgfSk7XG5cbiAgaWYod2luZG93LnBlcmZvcm1hbmNlLm5vdyA9PT0gdW5kZWZpbmVkKXtcblxuICAgIGxldCBub3dPZmZzZXQgPSBEYXRlLm5vdygpO1xuXG4gICAgaWYocGVyZm9ybWFuY2UudGltaW5nICE9PSB1bmRlZmluZWQgJiYgcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIG5vd09mZnNldCA9IHBlcmZvcm1hbmNlLnRpbWluZy5uYXZpZ2F0aW9uU3RhcnQ7XG4gICAgfVxuXG4gICAgd2luZG93LnBlcmZvcm1hbmNlLm5vdyA9IGZ1bmN0aW9uIG5vdygpe1xuICAgICAgcmV0dXJuIERhdGUubm93KCkgLSBub3dPZmZzZXQ7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwb2x5ZmlsbEN1c3RvbUV2ZW50KCl7XG5cbiAgaWYodHlwZW9mIHdpbmRvdy5FdmVudCA9PT0gJ2Z1bmN0aW9uJyl7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgZnVuY3Rpb24gQ3VzdG9tRXZlbnQoZXZlbnQsIHBhcmFtcyl7XG4gICAgcGFyYW1zID0gcGFyYW1zIHx8IHtidWJibGVzOiBmYWxzZSwgY2FuY2VsYWJsZTogZmFsc2UsIGRldGFpbDogdW5kZWZpbmVkfTtcbiAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoJ0N1c3RvbUV2ZW50Jyk7XG4gICAgZXZ0LmluaXRDdXN0b21FdmVudChldmVudCwgcGFyYW1zLmJ1YmJsZXMsIHBhcmFtcy5jYW5jZWxhYmxlLCBwYXJhbXMuZGV0YWlsKTtcbiAgICByZXR1cm4gZXZ0O1xuICB9O1xuXG4gIEN1c3RvbUV2ZW50LnByb3RvdHlwZSA9IHdpbmRvdy5FdmVudC5wcm90b3R5cGU7XG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xuICB3aW5kb3cuQ3VzdG9tRXZlbnQgPSBDdXN0b21FdmVudDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVVVUlEKCl7XG4gIGxldCBkID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gIGxldCB1dWlkID0gbmV3IEFycmF5KDY0KS5qb2luKCd4Jyk7Oy8vJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCc7XG4gIHV1aWQgPSB1dWlkLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xuICAgICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkqMTYpJTE2IHwgMDtcbiAgICAgIGQgPSBNYXRoLmZsb29yKGQvMTYpO1xuICAgICAgcmV0dXJuIChjPT0neCcgPyByIDogKHImMHgzfDB4OCkpLnRvU3RyaW5nKDE2KS50b1VwcGVyQ2FzZSgpO1xuICB9KTtcbiAgcmV0dXJuIHV1aWQ7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlmaWxsKCl7XG4gIGxldCBkZXZpY2UgPSBnZXREZXZpY2UoKTtcbiAgLy8gaWYoZGV2aWNlLmJyb3dzZXIgPT09ICdpZScpe1xuICAvLyAgIHBvbHlmaWxsQ3VzdG9tRXZlbnQoKTtcbiAgLy8gfVxuICBwb2x5ZmlsbFBlcmZvcm1hbmNlKCk7XG59Il19
