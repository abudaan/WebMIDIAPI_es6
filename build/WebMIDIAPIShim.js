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

  // for(let inst of jazzInstances.values()){
  //   if(inst[key] !== true){
  //       instance = inst;
  //       break;
  //   }
  // }
  var values = jazzInstances.values();
  for (var i = 0, maxi = values.length; i < maxi; i++) {
    var inst = values[i];
    if (inst[key] !== true) {
      instance = inst;
      break;
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
exports.polyfillPromise = polyfillPromise;
exports.polyfillMap = polyfillMap;
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

function polyfillMap() {
  var map = new Map();
  if (typeof map.values !== 'function') {
    Map.prototype.values = function () {
      var values = [];
      this.forEach(function (value) {
        values.push(value);
      });
      return values;
    };
  }
}

function polyfill() {
  var device = getDevice();
  // if(device.browser === 'ie'){
  //   polyfillCustomEvent();
  // }
  polyfillPromise();
  polyfillMap();
  polyfillPerformance();
}

}).call(this,require('_process'),"/src")

},{"_process":1}]},{},[8])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwiL1VzZXJzL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvamF6el9pbnN0YW5jZS5qcyIsIi9Vc2Vycy9hYnVkYWFuL3dvcmtzcGFjZS9XZWJNSURJQVBJU2hpbV9lczYvc3JjL21pZGlfYWNjZXNzLmpzIiwiL1VzZXJzL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaV9pbnB1dC5qcyIsIi9Vc2Vycy9hYnVkYWFuL3dvcmtzcGFjZS9XZWJNSURJQVBJU2hpbV9lczYvc3JjL21pZGlfb3V0cHV0LmpzIiwiL1VzZXJzL2FidWRhYW4vd29ya3NwYWNlL1dlYk1JRElBUElTaGltX2VzNi9zcmMvbWlkaWNvbm5lY3Rpb25fZXZlbnQuanMiLCIvVXNlcnMvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy9taWRpbWVzc2FnZV9ldmVudC5qcyIsIi9Vc2Vycy9hYnVkYWFuL3dvcmtzcGFjZS9XZWJNSURJQVBJU2hpbV9lczYvc3JjL3NoaW0uanMiLCIvVXNlcnMvYWJ1ZGFhbi93b3Jrc3BhY2UvV2ViTUlESUFQSVNoaW1fZXM2L3NyYy91dGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztRQ2pEZ0Isa0JBQWtCLEdBQWxCLGtCQUFrQjtRQTZEbEIsZUFBZSxHQUFmLGVBQWU7O3lCQXBFUCxRQUFROztBQUZoQyxZQUFZLENBQUM7O0FBSWIsSUFBTSxrQkFBa0IsR0FBRyxHQUFHLENBQUM7O0FBRS9CLElBQUksa0JBQWtCLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLElBQUksYUFBYSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0FBRXZCLFNBQVMsa0JBQWtCLENBQUMsUUFBUSxFQUFDOztBQUUxQyxNQUFJLEVBQUUsR0FBRyxPQUFPLEdBQUcsa0JBQWtCLEVBQUUsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQzFELE1BQUksUUFBUSxZQUFBLENBQUM7QUFDYixNQUFJLE1BQU0sWUFBQTtNQUFFLE9BQU8sWUFBQSxDQUFDOztBQUVwQixNQUFHLFdBYkcsU0FBUyxFQWFELENBQUMsTUFBTSxLQUFLLElBQUksRUFBQztBQUM3QixVQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ3JDLE1BQUk7QUFDSCxRQUFJLEVBQUUsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzFDLE1BQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNsQixNQUFFLENBQUMsT0FBTyxHQUFHLDRDQUE0QyxDQUFDO0FBQzFELFdBQU8sR0FBRyxFQUFFLENBQUM7O0FBRWIsUUFBSSxFQUFFLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxQyxNQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztBQUNYLE1BQUUsQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDO0FBQ3pCLE1BQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7QUFDbkIsVUFBTSxHQUFHLEVBQUUsQ0FBQzs7QUFFWixRQUFJLENBQUMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3BDLEtBQUMsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDLENBQUM7O0FBRWxFLFFBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEMsS0FBQyxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFDdEQsS0FBQyxDQUFDLElBQUksR0FBRyx1QkFBdUIsQ0FBQzs7QUFFakMsS0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNqQixLQUFDLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM1QyxNQUFFLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDOztBQUVsQixRQUFJLGNBQWMsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzNELFFBQUcsQ0FBQyxjQUFjLEVBQUU7O0FBRWxCLG9CQUFjLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMvQyxvQkFBYyxDQUFDLEVBQUUsR0FBRyxZQUFZLENBQUM7QUFDakMsb0JBQWMsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztBQUMzQyxvQkFBYyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO0FBQzNDLG9CQUFjLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxTQUFTLENBQUM7QUFDdEMsb0JBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLFNBQVMsQ0FBQztBQUNyQyxjQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQztLQUMzQztBQUNELGtCQUFjLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0dBQ2hDOztBQUdELFlBQVUsQ0FBQyxZQUFVO0FBQ25CLFFBQUcsTUFBTSxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUM7QUFDeEIsY0FBUSxHQUFHLE1BQU0sQ0FBQztLQUNuQixNQUFLLElBQUcsT0FBTyxDQUFDLE1BQU0sS0FBSyxJQUFJLEVBQUM7QUFDL0IsY0FBUSxHQUFHLE9BQU8sQ0FBQztLQUNwQjtBQUNELFFBQUcsUUFBUSxLQUFLLFNBQVMsRUFBQztBQUN4QixjQUFRLENBQUMsYUFBYSxHQUFHLE1BQU0sQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbEQsbUJBQWEsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0tBQ2pDO0FBQ0QsWUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0dBQ3BCLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztDQUN4Qjs7QUFHTSxTQUFTLGVBQWUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFDO0FBQzdDLE1BQUksUUFBUSxHQUFHLElBQUksQ0FBQztBQUNwQixNQUFJLEdBQUcsR0FBRyxJQUFJLEtBQUssT0FBTyxHQUFHLFlBQVksR0FBRyxhQUFhLENBQUM7Ozs7Ozs7O0FBUTFELE1BQUksTUFBTSxHQUFHLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztBQUNwQyxPQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFDO0FBQ2pELFFBQUksSUFBSSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNyQixRQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxJQUFJLEVBQUM7QUFDbEIsY0FBUSxHQUFHLElBQUksQ0FBQztBQUNoQixZQUFNO0tBQ1Q7R0FDRjs7QUFFRCxNQUFHLFFBQVEsS0FBSyxJQUFJLEVBQUM7QUFDbkIsc0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUM7R0FDOUIsTUFBSTtBQUNILFlBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUNwQjtDQUNGOzs7Ozs7Ozs7Ozs7UUNsRGUsZ0JBQWdCLEdBQWhCLGdCQUFnQjtRQXlIaEIsYUFBYSxHQUFiLGFBQWE7UUFlYixrQkFBa0IsR0FBbEIsa0JBQWtCO1FBUWxCLGVBQWUsR0FBZixlQUFlOztrREExTG1CLGlCQUFpQjs7eUJBQzNDLGNBQWM7OzBCQUNiLGVBQWU7O21DQUNOLHdCQUF3Qjs7NEJBQy9CLFFBQVE7O0FBTm5DLFlBQVksQ0FBQzs7QUFTYixJQUFJLFVBQVUsWUFBQSxDQUFDO0FBQ2YsSUFBSSxZQUFZLFlBQUEsQ0FBQztBQUNqQixJQUFJLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzNCLElBQUksV0FBVyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDNUIsSUFBSSxZQUFZLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUM3QixJQUFJLGFBQWEsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzlCLElBQUksU0FBUyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0lBR3BCLFVBQVU7QUFDSCxXQURQLFVBQVUsQ0FDRixVQUFVLEVBQUUsV0FBVyxFQUFDOzBCQURoQyxVQUFVOztBQUVaLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO0FBQ3pCLFFBQUksQ0FBQyxPQUFPLEdBQUcsV0FBVyxDQUFDO0dBQzVCOztlQUxHLFVBQVU7O1dBT0UsMEJBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUM7QUFDMUMsVUFBRyxJQUFJLEtBQUssYUFBYSxFQUFDO0FBQ3hCLGVBQU87T0FDUjtBQUNELFVBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEVBQUM7QUFDbkMsaUJBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDekI7S0FDRjs7O1dBRWtCLDZCQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDO0FBQzdDLFVBQUcsSUFBSSxLQUFLLGFBQWEsRUFBQztBQUN4QixlQUFPO09BQ1I7QUFDRCxVQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxFQUFDO0FBQ2xDLGlCQUFTLFVBQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUM1QjtLQUNGOzs7U0F2QkcsVUFBVTs7O0FBMEJULFNBQVMsZ0JBQWdCLEdBQUU7O0FBRWhDLFNBQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxRQUFRLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBQzs7QUFFbkQsUUFBRyxVQUFVLEtBQUssU0FBUyxFQUFDO0FBQzFCLGFBQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUNwQixhQUFPO0tBQ1I7O0FBRUQsd0NBbkRJLGtCQUFrQixDQW1ESCxVQUFTLFFBQVEsRUFBQztBQUNuQyxVQUFHLFFBQVEsS0FBSyxTQUFTLEVBQUM7QUFDeEIsY0FBTSxDQUFDLEVBQUMsT0FBTyxFQUFFLDJHQUEyRyxFQUFDLENBQUMsQ0FBQztBQUMvSCxlQUFPO09BQ1I7O0FBRUQsa0JBQVksR0FBRyxRQUFRLENBQUM7O0FBRXhCLHFCQUFlLENBQUMsWUFBVTtBQUN4QixzQkFBYyxFQUFFLENBQUM7QUFDakIsa0JBQVUsR0FBRyxJQUFJLFVBQVUsQ0FBQyxVQUFVLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDckQsZUFBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO09BQ3JCLENBQUMsQ0FBQztLQUNKLENBQUMsQ0FBQztHQUVKLENBQUMsQ0FBQztDQUNKOztBQUVELFNBQVMsZUFBZSxDQUFDLFFBQVEsRUFBQztBQUNoQyxNQUFJLE1BQU0sR0FBRyxZQUFZLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDdkMsTUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3pDLE1BQUksU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDOUIsTUFBSSxVQUFVLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQzs7QUFFaEMsb0JBQWtCLENBQUMsQ0FBQyxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVU7QUFDMUQsc0JBQWtCLENBQUMsQ0FBQyxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO0dBQ2hFLENBQUMsQ0FBQztDQUNKOztBQUdELFNBQVMsa0JBQWtCLENBQUMsS0FBSyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBQztBQUMzRCxNQUFHLEtBQUssR0FBRyxHQUFHLEVBQUM7QUFDYixRQUFJLEtBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztBQUN6QixrQkFBYyxDQUFDLElBQUksRUFBRSxLQUFJLEVBQUUsWUFBVTtBQUNuQyx3QkFBa0IsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7S0FDdEQsQ0FBQyxDQUFDO0dBQ0osTUFBSTtBQUNILFlBQVEsRUFBRSxDQUFDO0dBQ1o7Q0FDRjs7QUFHRCxTQUFTLGNBQWMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBQztBQUMzQyxzQ0E5RjBCLGVBQWUsQ0E4RnpCLElBQUksRUFBRSxVQUFTLFFBQVEsRUFBQztBQUN0QyxRQUFJLElBQUksWUFBQSxDQUFDO0FBQ1QsUUFBSSxJQUFJLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQzFCLFFBQUcsSUFBSSxLQUFLLE9BQU8sRUFBQztBQUNsQixVQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLEVBQUM7QUFDaEMsWUFBSSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDbEM7QUFDRCxVQUFJLEdBQUcsZUFwR0wsU0FBUyxDQW9HVSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDckMsZ0JBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsQ0FBQztLQUMvQixNQUFLLElBQUcsSUFBSSxLQUFLLFFBQVEsRUFBQztBQUN6QixVQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQUM7QUFDakMsWUFBSSxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDbkM7QUFDRCxVQUFJLEdBQUcsZ0JBekdMLFVBQVUsQ0F5R1UsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ3RDLGlCQUFXLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDaEM7QUFDRCxZQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDaEIsQ0FBQyxDQUFDO0NBQ0o7O0FBR0QsU0FBUyxhQUFhLENBQUMsS0FBSyxFQUFFLElBQUksRUFBQztBQUNqQyxNQUFJLElBQUksWUFBQSxDQUFDOzs7Ozs7QUFDVCx5QkFBWSxLQUFLLENBQUMsTUFBTSxFQUFFLDhIQUFDO0FBQXZCLFVBQUk7O0FBQ04sVUFBRyxJQUFJLENBQUMsSUFBSSxLQUFLLElBQUksRUFBQztBQUNwQixjQUFNO09BQ1A7S0FDRjs7Ozs7Ozs7Ozs7Ozs7OztBQUNELFNBQU8sSUFBSSxDQUFDO0NBQ2I7O0FBR0QsU0FBUyxjQUFjLEdBQUU7QUFDdkIsY0FBWSxDQUFDLGtCQUFrQixDQUFDLFVBQVMsSUFBSSxFQUFDO0FBQzVDLFFBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDM0MsUUFBRyxJQUFJLEtBQUssU0FBUyxFQUFDO0FBQ3BCLFVBQUksQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDO0FBQzVCLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNiLFVBQUksQ0FBQyxhQUFhLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN0QyxnQkFBVSxVQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLG1CQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDckI7R0FDRixDQUFDLENBQUM7O0FBRUgsY0FBWSxDQUFDLG1CQUFtQixDQUFDLFVBQVMsSUFBSSxFQUFDO0FBQzdDLFFBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDNUMsUUFBRyxJQUFJLEtBQUssU0FBUyxFQUFDO0FBQ3BCLFVBQUksQ0FBQyxLQUFLLEdBQUcsY0FBYyxDQUFDO0FBQzVCLFVBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNiLFVBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztBQUN2QyxpQkFBVyxVQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0FBQzVCLG1CQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDckI7R0FDRixDQUFDLENBQUM7O0FBRUgsY0FBWSxDQUFDLGVBQWUsQ0FBQyxVQUFTLElBQUksRUFBQztBQUN6QyxrQkFBYyxDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsVUFBUyxJQUFJLEVBQUM7QUFDMUMsbUJBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNyQixDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsY0FBWSxDQUFDLGdCQUFnQixDQUFDLFVBQVMsSUFBSSxFQUFDO0FBQzFDLGtCQUFjLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxVQUFTLElBQUksRUFBQztBQUMzQyxtQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3JCLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKOztBQUdNLFNBQVMsYUFBYSxDQUFDLElBQUksRUFBQzs7QUFFakMsTUFBSSxDQUFDLGFBQWEsQ0FBQyx5QkFsS2IsbUJBQW1CLENBa0trQixJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFeEQsTUFBSSxHQUFHLEdBQUcseUJBcEtKLG1CQUFtQixDQW9LUyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7O0FBRXBELE1BQUcsT0FBTyxVQUFVLENBQUMsYUFBYSxLQUFLLFVBQVUsRUFBQztBQUNoRCxjQUFVLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0dBQy9COzs7Ozs7QUFDRCwwQkFBb0IsU0FBUyxtSUFBQztVQUF0QixRQUFROztBQUNkLGNBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNmOzs7Ozs7Ozs7Ozs7Ozs7Q0FDRjs7QUFHTSxTQUFTLGtCQUFrQixHQUFFO0FBQ2xDLFlBQVUsQ0FBQyxPQUFPLENBQUMsVUFBUyxLQUFLLEVBQUM7O0FBRWhDLFNBQUssQ0FBQyxhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDbkMsQ0FBQyxDQUFDO0NBQ0o7O0FBR00sU0FBUyxlQUFlLENBQUMsSUFBSSxFQUFFLElBQUksRUFBQztBQUN6QyxNQUFJLEVBQUUsWUFBQSxDQUFDO0FBQ1AsTUFBRyxJQUFJLEtBQUssT0FBTyxFQUFDO0FBQ2xCLE1BQUUsR0FBRyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzVCLFFBQUcsRUFBRSxLQUFLLFNBQVMsRUFBQztBQUNsQixRQUFFLEdBQUcsY0EzTEgsWUFBWSxFQTJMSyxDQUFDO0FBQ3BCLGtCQUFZLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM1QjtHQUNGLE1BQUssSUFBRyxJQUFJLEtBQUssUUFBUSxFQUFDO0FBQ3pCLE1BQUUsR0FBRyxhQUFhLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdCLFFBQUcsRUFBRSxLQUFLLFNBQVMsRUFBQztBQUNsQixRQUFFLEdBQUcsY0FqTUgsWUFBWSxFQWlNSyxDQUFDO0FBQ3BCLG1CQUFhLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztLQUM3QjtHQUNGO0FBQ0QsU0FBTyxFQUFFLENBQUM7Q0FDWDs7Ozs7Ozs7Ozs7Ozt5QkMxTXVCLFFBQVE7O2dDQUNELHFCQUFxQjs7bUNBQ2xCLHdCQUF3Qjs7NkNBQ2IsZUFBZTs7QUFMNUQsWUFBWSxDQUFDOztBQU9iLElBQUksUUFBUSxZQUFBLENBQUM7QUFDYixJQUFJLE1BQU0sR0FBRyxXQU5MLFNBQVMsRUFNTyxDQUFDLE1BQU0sQ0FBQzs7SUFFbkIsU0FBUztBQUNULFdBREEsU0FBUyxDQUNSLElBQUksRUFBRSxRQUFRLEVBQUM7MEJBRGhCLFNBQVM7O0FBRWxCLFFBQUksQ0FBQyxFQUFFLEdBQUcsK0JBUFMsZUFBZSxDQU9SLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUM1QyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUNwQixRQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztBQUN6QixRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQzs7QUFFNUIsUUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsUUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDM0IsVUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO0FBQzNDLFNBQUcsRUFBRSxhQUFTLEtBQUssRUFBQztBQUNsQixZQUFJLENBQUMsY0FBYyxHQUFHLEtBQUssQ0FBQztBQUM1QixZQUFHLE9BQU8sS0FBSyxLQUFLLFVBQVUsRUFBQztBQUM3QixjQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDYjtPQUNGO0tBQ0YsQ0FBQyxDQUFDOztBQUVILFFBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLElBQUksR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN4RixRQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO0FBQ2pDLFFBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQzs7QUFFckMsUUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUM7QUFDOUIsUUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3JDLFFBQUcsV0FuQ0MsU0FBUyxFQW1DQyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUM7QUFDbEMsVUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7S0FDL0Q7R0FDRjs7ZUE5QlUsU0FBUzs7V0FnQ0osMEJBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUM7QUFDMUMsVUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDMUMsVUFBRyxTQUFTLEtBQUssU0FBUyxFQUFDO0FBQ3pCLGVBQU87T0FDUjs7QUFFRCxVQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxFQUFDO0FBQ25DLGlCQUFTLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ3pCO0tBQ0Y7OztXQUVrQiw2QkFBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBQztBQUM3QyxVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMxQyxVQUFHLFNBQVMsS0FBSyxTQUFTLEVBQUM7QUFDekIsZUFBTztPQUNSOztBQUVELFVBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEVBQUM7QUFDbkMsaUJBQVMsVUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQzVCO0tBQ0Y7OztXQUVhLDBCQUFFO0FBQ2QsVUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7S0FDckI7OztXQUVZLHVCQUFDLEdBQUcsRUFBQztBQUNoQixVQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUNyQixVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDOUMsZUFBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBQztBQUNsQyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2YsQ0FBQyxDQUFDOztBQUVILFVBQUcsR0FBRyxDQUFDLElBQUksS0FBSyxhQUFhLEVBQUM7QUFDNUIsWUFBRyxJQUFJLENBQUMsY0FBYyxLQUFLLElBQUksRUFBQztBQUM5QixjQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzFCO09BQ0YsTUFBSyxJQUFHLEdBQUcsQ0FBQyxJQUFJLEtBQUssYUFBYSxFQUFDO0FBQ2xDLFlBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSyxJQUFJLEVBQUM7QUFDN0IsY0FBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN6QjtPQUNGOztBQUVELGFBQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQztLQUNyQjs7O1dBRUcsZ0JBQUU7QUFDSixVQUFHLElBQUksQ0FBQyxVQUFVLEtBQUssTUFBTSxFQUFDO0FBQzVCLGVBQU87T0FDUjtBQUNELFVBQUcsV0ExRkMsU0FBUyxFQTBGQyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUM7QUFDbEMsWUFBSSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7T0FDL0Q7QUFDRCxVQUFJLENBQUMsVUFBVSxHQUFHLE1BQU0sQ0FBQztBQUN6QixxQ0EzRkksYUFBYSxDQTJGSCxJQUFJLENBQUMsQ0FBQztLQUNyQjs7O1dBRUksaUJBQUU7QUFDTCxVQUFHLElBQUksQ0FBQyxVQUFVLEtBQUssUUFBUSxFQUFDO0FBQzlCLGVBQU87T0FDUjtBQUNELFVBQUcsV0FyR0MsU0FBUyxFQXFHQyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUM7QUFDbEMsWUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQzNDO0FBQ0QsVUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUM7QUFDM0IscUNBdEdJLGFBQWEsQ0FzR0gsSUFBSSxDQUFDLENBQUM7QUFDcEIsVUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDM0IsVUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7QUFDMUIsVUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDM0MsVUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7S0FDNUM7OztXQUVtQiw4QkFBQyxJQUFJLEVBQUM7QUFDeEIsVUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUM7QUFDekMsVUFBSSxTQUFTLEdBQUcsSUFBSSxVQUFVLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN4RCxlQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNqQyxlQUFTLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztBQUMvQixVQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztLQUMvQjs7O1dBRWUsMEJBQUMsSUFBSSxFQUFFLGFBQWEsRUFBQztBQUNuQyxVQUFJLENBQUMsR0FBRyxhQUFhLENBQUM7QUFDdEIsYUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBQztBQUNwQixZQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFJLEVBQUM7O0FBRWpCLFdBQUMsRUFBRSxDQUFDO0FBQ0osY0FBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsaUJBQU8sQ0FBQyxDQUFDO1NBQ1Y7QUFDRCxTQUFDLEVBQUUsQ0FBQztPQUNMOztBQUVELFVBQUksQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hELFVBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7QUFDaEMsYUFBTyxDQUFDLENBQUM7S0FDVjs7O1NBL0hVLFNBQVM7OztRQUFULFNBQVMsR0FBVCxTQUFTOztBQW1JdEIsUUFBUSxHQUFHLFVBQVMsU0FBUyxFQUFFLElBQUksRUFBQztBQUNsQyxNQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7QUFDZixNQUFJLENBQUMsWUFBQSxDQUFDO0FBQ04sTUFBSSxjQUFjLEdBQUcsS0FBSyxDQUFDOzs7OztBQUszQixPQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLE1BQU0sRUFBQztBQUN0QyxRQUFJLGNBQWMsR0FBRyxJQUFJLENBQUM7QUFDMUIsUUFBRyxJQUFJLENBQUMsbUJBQW1CLEVBQUM7QUFDMUIsT0FBQyxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDbkMsVUFBRyxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEdBQUksRUFBQzs7QUFFckIsZUFBTztPQUNSO0FBQ0Qsb0JBQWMsR0FBRyxJQUFJLENBQUM7S0FDdkIsTUFBSTtBQUNILG9CQUFjLEdBQUcsS0FBSyxDQUFDO0FBQ3ZCLGNBQU8sSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUk7QUFDbkIsYUFBSyxDQUFJOztBQUNQLGdCQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsd0JBQWMsR0FBRyxLQUFLLENBQUM7QUFDdkIsZ0JBQU07O0FBQUEsQUFFUixhQUFLLEdBQUksQ0FBQztBQUNWLGFBQUssR0FBSSxDQUFDO0FBQ1YsYUFBSyxHQUFJLENBQUM7QUFDVixhQUFLLEdBQUksQ0FBQztBQUNWLGFBQUssR0FBSTs7QUFDUCxnQkFBTSxHQUFHLENBQUMsQ0FBQztBQUNYLGdCQUFNOztBQUFBLEFBRVIsYUFBSyxHQUFJLENBQUM7QUFDVixhQUFLLEdBQUk7O0FBQ1AsZ0JBQU0sR0FBRyxDQUFDLENBQUM7QUFDWCxnQkFBTTs7QUFBQSxBQUVSLGFBQUssR0FBSTtBQUNQLGtCQUFPLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDWixpQkFBSyxHQUFJOztBQUNQLGVBQUMsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25DLGtCQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksR0FBSSxFQUFDOztBQUVyQix1QkFBTztlQUNSO0FBQ0QsNEJBQWMsR0FBRyxJQUFJLENBQUM7QUFDdEIsb0JBQU07O0FBQUEsQUFFUixpQkFBSyxHQUFJLENBQUM7QUFDVixpQkFBSyxHQUFJOztBQUNQLG9CQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsb0JBQU07O0FBQUEsQUFFUixpQkFBSyxHQUFJOztBQUNQLG9CQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsb0JBQU07O0FBQUEsQUFFUjtBQUNFLG9CQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQ1gsb0JBQU07QUFBQSxXQUNUO0FBQ0QsZ0JBQU07QUFBQSxPQUNUO0tBQ0Y7QUFDRCxRQUFHLENBQUMsY0FBYyxFQUFDO0FBQ2pCLGVBQVM7S0FDVjs7QUFFRCxRQUFJLEdBQUcsR0FBRyxFQUFFLENBQUM7QUFDYixPQUFHLENBQUMsWUFBWSxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQzs7QUFFdkYsUUFBRyxjQUFjLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFDO0FBQzVDLFNBQUcsQ0FBQyxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQzdDLFVBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDdEMsVUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztLQUNsQyxNQUFJO0FBQ0gsU0FBRyxDQUFDLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN0RDs7QUFFRCxRQUFHLE1BQU0sRUFBQztBQUNSLFVBQUcsSUFBSSxDQUFDLGNBQWMsRUFBQztBQUNyQixZQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQzFCO0tBQ0YsTUFBSTtBQUNILFVBQUksQ0FBQyxHQUFHLHNCQS9OTixnQkFBZ0IsQ0ErTlcsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQy9ELFVBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdkI7R0FDRjtDQUNGLENBQUM7Ozs7Ozs7Ozs7Ozs7eUJDcE9zQixRQUFROzs2Q0FDYSxlQUFlOztBQUg1RCxZQUFZLENBQUM7O0lBS0EsVUFBVTtBQUNWLFdBREEsVUFBVSxDQUNULElBQUksRUFBRSxRQUFRLEVBQUM7MEJBRGhCLFVBQVU7O0FBRW5CLFFBQUksQ0FBQyxFQUFFLEdBQUcsK0JBSlMsZUFBZSxDQUlSLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsQ0FBQztBQUM3QyxRQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwQixRQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM1QixRQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2QixRQUFJLENBQUMsSUFBSSxHQUFHLFFBQVEsQ0FBQztBQUNyQixRQUFJLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQztBQUN6QixRQUFJLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQztBQUM1QixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztBQUMxQixRQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQzs7QUFFMUIsUUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQzVCLFFBQUksQ0FBQyxtQkFBbUIsR0FBRyxLQUFLLENBQUM7QUFDakMsUUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDOztBQUVyQyxRQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQztBQUM5QixRQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDdEMsUUFBRyxXQXJCQyxTQUFTLEVBcUJDLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBQztBQUNsQyxVQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDM0M7R0FDRjs7ZUFyQlUsVUFBVTs7V0F1QmpCLGdCQUFFO0FBQ0osVUFBRyxJQUFJLENBQUMsVUFBVSxLQUFLLE1BQU0sRUFBQztBQUM1QixlQUFPO09BQ1I7QUFDRCxVQUFHLFdBOUJDLFNBQVMsRUE4QkMsQ0FBQyxRQUFRLEtBQUssT0FBTyxFQUFDO0FBQ2xDLFlBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUMzQztBQUNELFVBQUksQ0FBQyxVQUFVLEdBQUcsTUFBTSxDQUFDO0FBQ3pCLHFDQWpDSSxhQUFhLENBaUNILElBQUksQ0FBQyxDQUFDO0tBQ3JCOzs7V0FFSSxpQkFBRTtBQUNMLFVBQUcsSUFBSSxDQUFDLFVBQVUsS0FBSyxRQUFRLEVBQUM7QUFDOUIsZUFBTztPQUNSO0FBQ0QsVUFBRyxXQXpDQyxTQUFTLEVBeUNDLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBQztBQUNsQyxZQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7T0FDNUM7QUFDRCxVQUFJLENBQUMsVUFBVSxHQUFHLFFBQVEsQ0FBQztBQUMzQixxQ0E1Q0ksYUFBYSxDQTRDSCxJQUFJLENBQUMsQ0FBQztBQUNwQixVQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztBQUMxQixVQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxDQUFDO0tBQ3pCOzs7V0FFRyxjQUFDLElBQUksRUFBRSxTQUFTLEVBQUM7OztBQUNuQixVQUFJLGVBQWUsR0FBRyxDQUFDLENBQUM7O0FBRXhCLFVBQUcsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUM7QUFDbkIsZUFBTyxLQUFLLENBQUM7T0FDZDs7QUFFRCxVQUFHLFNBQVMsRUFBQztBQUNYLHVCQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO09BQ3BFOztBQUVELFVBQUcsU0FBUyxJQUFLLGVBQWUsR0FBRyxDQUFDLEFBQUMsRUFBQztBQUNwQyxjQUFNLENBQUMsVUFBVSxDQUFDLFlBQU07QUFDdEIsZ0JBQUssYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN0QyxFQUFFLGVBQWUsQ0FBQyxDQUFDO09BQ3JCLE1BQUk7QUFDSCxZQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUN0QztBQUNELGFBQU8sSUFBSSxDQUFDO0tBQ2I7OztXQUVlLDBCQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDO0FBQzFDLFVBQUcsSUFBSSxLQUFLLGFBQWEsRUFBQztBQUN4QixlQUFPO09BQ1I7O0FBRUQsVUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEVBQUM7QUFDekMsWUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7T0FDL0I7S0FDRjs7O1dBRWtCLDZCQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsVUFBVSxFQUFDO0FBQzdDLFVBQUcsSUFBSSxLQUFLLGFBQWEsRUFBQztBQUN4QixlQUFPO09BQ1I7O0FBRUQsVUFBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsS0FBSyxLQUFLLEVBQUM7QUFDekMsWUFBSSxDQUFDLFVBQVUsVUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO09BQ2xDO0tBQ0Y7OztXQUVZLHVCQUFDLEdBQUcsRUFBQztBQUNoQixVQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxVQUFTLFFBQVEsRUFBQztBQUN4QyxnQkFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDO09BQ2YsQ0FBQyxDQUFDOztBQUVILFVBQUcsSUFBSSxDQUFDLGFBQWEsS0FBSyxJQUFJLEVBQUM7QUFDN0IsWUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUN6QjtLQUNGOzs7U0FoR1UsVUFBVTs7O1FBQVYsVUFBVSxHQUFWLFVBQVU7Ozs7Ozs7Ozs7QUNMdkIsWUFBWSxDQUFDOztJQUVBLG1CQUFtQixHQUNuQixTQURBLG1CQUFtQixDQUNsQixVQUFVLEVBQUUsSUFBSSxFQUFDO3dCQURsQixtQkFBbUI7O0FBRTVCLE1BQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0FBQ3JCLE1BQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO0FBQzFCLE1BQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO0FBQ3hCLE1BQUksQ0FBQyxhQUFhLEdBQUcsVUFBVSxDQUFDO0FBQ2hDLE1BQUksQ0FBQyxnQkFBZ0IsR0FBRyxLQUFLLENBQUM7QUFDOUIsTUFBSSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUM7QUFDcEIsTUFBSSxDQUFDLElBQUksR0FBRyxFQUFFLENBQUM7QUFDZixNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixNQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztBQUN4QixNQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztBQUM3QixNQUFJLENBQUMsTUFBTSxHQUFHLFVBQVUsQ0FBQztBQUN6QixNQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUM1QixNQUFJLENBQUMsSUFBSSxHQUFHLGFBQWEsQ0FBQztDQUMzQjs7UUFmVSxtQkFBbUIsR0FBbkIsbUJBQW1COzs7Ozs7Ozs7O0FDRmhDLFlBQVksQ0FBQzs7SUFFQSxnQkFBZ0IsR0FDaEIsU0FEQSxnQkFBZ0IsQ0FDZixJQUFJLEVBQUUsSUFBSSxFQUFFLFlBQVksRUFBQzt3QkFEMUIsZ0JBQWdCOztBQUV6QixNQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztBQUNyQixNQUFJLENBQUMsWUFBWSxHQUFHLEtBQUssQ0FBQztBQUMxQixNQUFJLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQztBQUN4QixNQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztBQUMxQixNQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztBQUNqQixNQUFJLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0FBQzlCLE1BQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ3BCLE1BQUksQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ2YsTUFBSSxDQUFDLFlBQVksR0FBRyxZQUFZLENBQUM7QUFDakMsTUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7QUFDeEIsTUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7QUFDdkIsTUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbkIsTUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDNUIsTUFBSSxDQUFDLElBQUksR0FBRyxhQUFhLENBQUM7Q0FDM0I7O1FBaEJVLGdCQUFnQixHQUFoQixnQkFBZ0I7OztBQ0Y3QixZQUFZLENBQUM7Ozs7O21EQUtzQyxlQUFlOztrQ0FDaEMsUUFBUTs7QUFFMUMsSUFBSSxVQUFVLFlBQUEsQ0FBQzs7QUFFZixBQUFDLENBQUEsWUFBVTtBQUNULE1BQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGlCQUFpQixFQUFDO0FBQ3JDLHdCQU5JLFFBQVEsRUFNRixDQUFDO0FBQ1gsVUFBTSxDQUFDLFNBQVMsQ0FBQyxpQkFBaUIsR0FBRyxZQUFVO0FBQzdDLFVBQUcsVUFBVSxLQUFLLFNBQVMsRUFBQztBQUN4QixrQkFBVSxHQUFHLHFDQVZmLGdCQUFnQixFQVVpQixDQUFDO09BQ25DO0FBQ0QsYUFBTyxVQUFVLENBQUM7S0FDbkIsQ0FBQztBQUNGLFFBQUcsb0JBYlcsU0FBUyxFQWFULENBQUMsTUFBTSxLQUFLLElBQUksRUFBQztBQUM3QixZQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxZQUFVOztBQUVqQyw2Q0FqQmtCLGtCQUFrQixFQWlCaEIsQ0FBQztPQUN0QixDQUFDO0tBQ0g7R0FDRjtDQUNGLENBQUEsRUFBRSxDQUFFOzs7Ozs7Ozs7UUN0QlcsU0FBUyxHQUFULFNBQVM7UUE0RVQsbUJBQW1CLEdBQW5CLG1CQUFtQjtRQXdCbkIsbUJBQW1CLEdBQW5CLG1CQUFtQjtRQW1CbkIsWUFBWSxHQUFaLFlBQVk7UUFZWixlQUFlLEdBQWYsZUFBZTtRQW1CZixXQUFXLEdBQVgsV0FBVztRQWFYLFFBQVEsR0FBUixRQUFRO0FBdkt4QixZQUFZLENBQUM7O0FBRWIsSUFBSSxNQUFNLFlBQUEsQ0FBQzs7QUFFSixTQUFTLFNBQVMsR0FBRTs7QUFFekIsTUFBRyxNQUFNLEtBQUssU0FBUyxFQUFDO0FBQ3RCLFdBQU8sTUFBTSxDQUFDO0dBQ2Y7O0FBRUQsTUFDRSxRQUFRLEdBQUcsWUFBWTtNQUN2QixPQUFPLEdBQUcsWUFBWTtNQUN0QixNQUFNLEdBQUcsS0FBSyxDQUFDOztBQUVqQixNQUFHLFNBQVMsS0FBSyxTQUFTLEVBQUM7QUFDekIsVUFBTSxHQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsUUFBUSxBQUFDLENBQUM7QUFDL0QsUUFBRyxNQUFNLEtBQUssSUFBSSxFQUFDO0FBQ2pCLGNBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO0tBQzdCO0FBQ0QsVUFBTSxHQUFHO0FBQ1AsY0FBUSxFQUFFLFFBQVE7QUFDbEIsYUFBTyxFQUFFLEtBQUs7QUFDZCxZQUFNLEVBQUUsTUFBTTtBQUNkLFlBQU0sRUFBRSxRQUFRLEtBQUssS0FBSyxJQUFJLFFBQVEsS0FBSyxTQUFTO0tBQ3JELENBQUM7QUFDRixXQUFPLE1BQU0sQ0FBQztHQUNmOztBQUdELE1BQUksRUFBRSxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUM7O0FBRTdCLE1BQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsQ0FBQyxFQUFDO0FBQ2pDLFlBQVEsR0FBRyxLQUFLLENBQUM7R0FDbEIsTUFBSyxJQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUM7QUFDcEMsWUFBUSxHQUFHLFNBQVMsQ0FBQztHQUN0QixNQUFLLElBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQztBQUNsQyxZQUFRLEdBQUcsT0FBTyxDQUFDO0dBQ3BCLE1BQUssSUFBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDO0FBQ3RDLFlBQVEsR0FBRyxLQUFLLENBQUM7R0FDbEIsTUFBSyxJQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUM7QUFDcEMsWUFBUSxHQUFHLFNBQVMsQ0FBQztHQUN0Qjs7QUFFRCxNQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUM7O0FBRTdCLFdBQU8sR0FBRyxRQUFRLENBQUM7O0FBRW5CLFFBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQztBQUMxQixhQUFPLEdBQUcsT0FBTyxDQUFDO0tBQ25CLE1BQUssSUFBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDO0FBQ3JDLGFBQU8sR0FBRyxVQUFVLENBQUM7S0FDdEI7R0FDRixNQUFLLElBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQztBQUNuQyxXQUFPLEdBQUcsUUFBUSxDQUFDO0dBQ3BCLE1BQUssSUFBRyxFQUFFLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFDO0FBQ3BDLFdBQU8sR0FBRyxTQUFTLENBQUM7R0FDckIsTUFBSyxJQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUM7QUFDcEMsV0FBTyxHQUFHLElBQUksQ0FBQztBQUNmLFFBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsRUFBQztBQUN0QixhQUFPLEdBQUcsTUFBTSxDQUFDO0tBQ2xCO0dBQ0Y7O0FBRUQsTUFBRyxRQUFRLEtBQUssS0FBSyxFQUFDO0FBQ3BCLFFBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBQztBQUM1QixhQUFPLEdBQUcsUUFBUSxDQUFDO0tBQ3BCO0dBQ0Y7O0FBRUQsUUFBTSxHQUFHO0FBQ1AsWUFBUSxFQUFFLFFBQVE7QUFDbEIsV0FBTyxFQUFFLE9BQU87QUFDaEIsVUFBTSxFQUFFLFFBQVEsS0FBSyxLQUFLLElBQUksUUFBUSxLQUFLLFNBQVM7QUFDcEQsVUFBTSxFQUFFLEtBQUs7R0FDZCxDQUFDO0FBQ0YsU0FBTyxNQUFNLENBQUM7Q0FDZjs7QUFHTSxTQUFTLG1CQUFtQixHQUFFOztBQUVuQyxNQUFHLE1BQU0sQ0FBQyxXQUFXLEtBQUssU0FBUyxFQUFDO0FBQ2xDLFVBQU0sQ0FBQyxXQUFXLEdBQUcsRUFBRSxDQUFDO0dBQ3pCOztBQUVELE1BQUksQ0FBQyxHQUFHLEdBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxZQUFVO0FBQ2hDLFdBQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztHQUM3QixBQUFDLENBQUM7O0FBRUgsTUFBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEdBQUcsS0FBSyxTQUFTLEVBQUM7OztBQUV0QyxVQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7O0FBRTNCLFVBQUcsV0FBVyxDQUFDLE1BQU0sS0FBSyxTQUFTLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxlQUFlLEtBQUssU0FBUyxFQUFDO0FBQ3RGLGlCQUFTLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUM7T0FDaEQ7O0FBRUQsWUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHLEdBQUU7QUFDckMsZUFBTyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDO09BQy9CLENBQUE7O0dBQ0Y7Q0FDRjs7QUFFTSxTQUFTLG1CQUFtQixHQUFFOztBQUVuQyxNQUFHLE9BQU8sTUFBTSxDQUFDLEtBQUssS0FBSyxVQUFVLEVBQUM7QUFDcEMsV0FBTztHQUNSOztBQUVELFdBQVMsV0FBVyxDQUFDLEtBQUssRUFBRSxNQUFNLEVBQUM7QUFDakMsVUFBTSxHQUFHLE1BQU0sSUFBSSxFQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFDLENBQUM7QUFDMUUsUUFBSSxHQUFHLEdBQUcsUUFBUSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM5QyxPQUFHLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzdFLFdBQU8sR0FBRyxDQUFDO0dBQ1osQ0FBQzs7QUFFRixhQUFXLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDO0FBQy9DLFFBQU0sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0FBQ2pDLFFBQU0sQ0FBQyxXQUFXLEdBQUcsV0FBVyxDQUFDO0NBQ2xDOztBQUdNLFNBQVMsWUFBWSxHQUFFO0FBQzVCLE1BQUksQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDN0IsTUFBSSxJQUFJLEdBQUcsSUFBSSxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDcEMsTUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLFVBQVMsQ0FBQyxFQUFFO0FBQ3ZDLFFBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBQyxFQUFFLENBQUEsR0FBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLEtBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxFQUFFLENBQUMsQ0FBQztBQUNyQixXQUFPLENBQUMsQ0FBQyxJQUFFLEdBQUcsR0FBRyxDQUFDLEdBQUksQ0FBQyxHQUFDLENBQUcsR0FBQyxDQUFHLENBQUMsQ0FBRSxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUM7R0FDOUQsQ0FBQyxDQUFDO0FBQ0gsU0FBTyxJQUFJLENBQUM7Q0FDYjs7QUFHTSxTQUFTLGVBQWUsR0FBRTtBQUMvQixNQUFHLE9BQU8sTUFBTSxDQUFDLE9BQU8sS0FBSyxVQUFVLEVBQUM7O0FBRXRDLFVBQU0sQ0FBQyxPQUFPLEdBQUcsVUFBUyxRQUFRLEVBQUU7QUFDbEMsVUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7S0FDMUIsQ0FBQzs7QUFFRixXQUFPLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRyxVQUFTLE1BQU0sRUFBRSxNQUFNLEVBQUU7QUFDaEQsVUFBRyxPQUFPLE1BQU0sS0FBSyxVQUFVLEVBQUM7QUFDOUIsY0FBTSxHQUFHLFlBQVUsRUFBRSxDQUFDO09BQ3ZCO0FBQ0QsVUFBRyxPQUFPLE1BQU0sS0FBSyxVQUFVLEVBQUM7QUFDOUIsY0FBTSxHQUFHLFlBQVUsRUFBRSxDQUFDO09BQ3ZCO0FBQ0QsVUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7S0FDL0IsQ0FBQztHQUNIO0NBQ0Y7O0FBRU0sU0FBUyxXQUFXLEdBQUU7QUFDM0IsTUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNwQixNQUFHLE9BQU8sR0FBRyxDQUFDLE1BQU0sS0FBSyxVQUFVLEVBQUM7QUFDbEMsT0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBVTtBQUMvQixVQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDaEIsVUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFTLEtBQUssRUFBQztBQUMxQixjQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO09BQ3BCLENBQUMsQ0FBQztBQUNILGFBQU8sTUFBTSxDQUFDO0tBQ2YsQ0FBQTtHQUNGO0NBQ0Y7O0FBRU0sU0FBUyxRQUFRLEdBQUU7QUFDeEIsTUFBSSxNQUFNLEdBQUcsU0FBUyxFQUFFLENBQUM7Ozs7QUFJekIsaUJBQWUsRUFBRSxDQUFDO0FBQ2xCLGFBQVcsRUFBRSxDQUFDO0FBQ2QscUJBQW1CLEVBQUUsQ0FBQztDQUN2QiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IHRydWU7XG4gICAgdmFyIGN1cnJlbnRRdWV1ZTtcbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgdmFyIGkgPSAtMTtcbiAgICAgICAgd2hpbGUgKCsraSA8IGxlbikge1xuICAgICAgICAgICAgY3VycmVudFF1ZXVlW2ldKCk7XG4gICAgICAgIH1cbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBkcmFpbmluZyA9IGZhbHNlO1xufVxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICBxdWV1ZS5wdXNoKGZ1bik7XG4gICAgaWYgKCFkcmFpbmluZykge1xuICAgICAgICBzZXRUaW1lb3V0KGRyYWluUXVldWUsIDApO1xuICAgIH1cbn07XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5wcm9jZXNzLnVtYXNrID0gZnVuY3Rpb24oKSB7IHJldHVybiAwOyB9O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5pbXBvcnQge2dldERldmljZX0gZnJvbSAnLi91dGlsJztcblxuY29uc3QgamF6elBsdWdpbkluaXRUaW1lID0gMTAwOyAvLyBtaWxsaXNlY29uZHNcblxubGV0IGphenpJbnN0YW5jZU51bWJlciA9IDA7XG5sZXQgamF6ekluc3RhbmNlcyA9IG5ldyBNYXAoKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUphenpJbnN0YW5jZShjYWxsYmFjayl7XG5cbiAgbGV0IGlkID0gJ2phenpfJyArIGphenpJbnN0YW5jZU51bWJlcisrICsgJycgKyBEYXRlLm5vdygpO1xuICBsZXQgaW5zdGFuY2U7XG4gIGxldCBvYmpSZWYsIGFjdGl2ZVg7XG5cbiAgaWYoZ2V0RGV2aWNlKCkubm9kZWpzID09PSB0cnVlKXtcbiAgICBvYmpSZWYgPSBuZXcgd2luZG93LmphenpNaWRpLk1JREkoKTtcbiAgfWVsc2V7XG4gICAgbGV0IG8xID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb2JqZWN0Jyk7XG4gICAgbzEuaWQgPSBpZCArICdpZSc7XG4gICAgbzEuY2xhc3NpZCA9ICdDTFNJRDoxQUNFMTYxOC0xQzdELTQ1NjEtQUVFMS0zNDg0MkFBODVFOTAnO1xuICAgIGFjdGl2ZVggPSBvMTtcblxuICAgIGxldCBvMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29iamVjdCcpO1xuICAgIG8yLmlkID0gaWQ7XG4gICAgbzIudHlwZSA9ICdhdWRpby94LWphenonO1xuICAgIG8xLmFwcGVuZENoaWxkKG8yKTtcbiAgICBvYmpSZWYgPSBvMjtcblxuICAgIGxldCBlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJ1RoaXMgcGFnZSByZXF1aXJlcyB0aGUgJykpO1xuXG4gICAgbGV0IGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgYS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSgnSmF6eiBwbHVnaW4nKSk7XG4gICAgYS5ocmVmID0gJ2h0dHA6Ly9qYXp6LXNvZnQubmV0Lyc7XG5cbiAgICBlLmFwcGVuZENoaWxkKGEpO1xuICAgIGUuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoJy4nKSk7XG4gICAgbzIuYXBwZW5kQ2hpbGQoZSk7XG5cbiAgICBsZXQgaW5zZXJ0aW9uUG9pbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnTUlESVBsdWdpbicpO1xuICAgIGlmKCFpbnNlcnRpb25Qb2ludCkge1xuICAgICAgLy8gQ3JlYXRlIGhpZGRlbiBlbGVtZW50XG4gICAgICBpbnNlcnRpb25Qb2ludCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuaWQgPSAnTUlESVBsdWdpbic7XG4gICAgICBpbnNlcnRpb25Qb2ludC5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgICBpbnNlcnRpb25Qb2ludC5zdHlsZS52aXNpYmlsaXR5ID0gJ2hpZGRlbic7XG4gICAgICBpbnNlcnRpb25Qb2ludC5zdHlsZS5sZWZ0ID0gJy05OTk5cHgnO1xuICAgICAgaW5zZXJ0aW9uUG9pbnQuc3R5bGUudG9wID0gJy05OTk5cHgnO1xuICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpbnNlcnRpb25Qb2ludCk7XG4gICAgfVxuICAgIGluc2VydGlvblBvaW50LmFwcGVuZENoaWxkKG8xKTtcbiAgfVxuXG5cbiAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgIGlmKG9ialJlZi5pc0phenogPT09IHRydWUpe1xuICAgICAgaW5zdGFuY2UgPSBvYmpSZWY7XG4gICAgfWVsc2UgaWYoYWN0aXZlWC5pc0phenogPT09IHRydWUpe1xuICAgICAgaW5zdGFuY2UgPSBhY3RpdmVYO1xuICAgIH1cbiAgICBpZihpbnN0YW5jZSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIGluc3RhbmNlLl9wZXJmVGltZVplcm8gPSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCk7XG4gICAgICBqYXp6SW5zdGFuY2VzLnNldChpZCwgaW5zdGFuY2UpO1xuICAgIH1cbiAgICBjYWxsYmFjayhpbnN0YW5jZSk7XG4gIH0sIGphenpQbHVnaW5Jbml0VGltZSk7XG59XG5cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEphenpJbnN0YW5jZSh0eXBlLCBjYWxsYmFjayl7XG4gIGxldCBpbnN0YW5jZSA9IG51bGw7XG4gIGxldCBrZXkgPSB0eXBlID09PSAnaW5wdXQnID8gJ2lucHV0SW5Vc2UnIDogJ291dHB1dEluVXNlJztcblxuICAvLyBmb3IobGV0IGluc3Qgb2YgamF6ekluc3RhbmNlcy52YWx1ZXMoKSl7XG4gIC8vICAgaWYoaW5zdFtrZXldICE9PSB0cnVlKXtcbiAgLy8gICAgICAgaW5zdGFuY2UgPSBpbnN0O1xuICAvLyAgICAgICBicmVhaztcbiAgLy8gICB9XG4gIC8vIH1cbiAgbGV0IHZhbHVlcyA9IGphenpJbnN0YW5jZXMudmFsdWVzKCk7XG4gIGZvcihsZXQgaSA9IDAsIG1heGkgPSB2YWx1ZXMubGVuZ3RoOyBpIDwgbWF4aTsgaSsrKXtcbiAgICBsZXQgaW5zdCA9IHZhbHVlc1tpXTtcbiAgICBpZihpbnN0W2tleV0gIT09IHRydWUpe1xuICAgICAgICBpbnN0YW5jZSA9IGluc3Q7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIGlmKGluc3RhbmNlID09PSBudWxsKXtcbiAgICBjcmVhdGVKYXp6SW5zdGFuY2UoY2FsbGJhY2spO1xuICB9ZWxzZXtcbiAgICBjYWxsYmFjayhpbnN0YW5jZSk7XG4gIH1cbn1cbiIsIid1c2Ugc3RyaWN0JztcblxuaW1wb3J0IHtjcmVhdGVKYXp6SW5zdGFuY2UsIGdldEphenpJbnN0YW5jZX0gZnJvbSAnLi9qYXp6X2luc3RhbmNlJztcbmltcG9ydCB7TUlESUlucHV0fSBmcm9tICcuL21pZGlfaW5wdXQnO1xuaW1wb3J0IHtNSURJT3V0cHV0fSBmcm9tICcuL21pZGlfb3V0cHV0JztcbmltcG9ydCB7TUlESUNvbm5lY3Rpb25FdmVudH0gZnJvbSAnLi9taWRpY29ubmVjdGlvbl9ldmVudCc7XG5pbXBvcnQge2dlbmVyYXRlVVVJRH0gZnJvbSAnLi91dGlsJztcblxuXG5sZXQgbWlkaUFjY2VzcztcbmxldCBqYXp6SW5zdGFuY2U7XG5sZXQgbWlkaUlucHV0cyA9IG5ldyBNYXAoKTtcbmxldCBtaWRpT3V0cHV0cyA9IG5ldyBNYXAoKTtcbmxldCBtaWRpSW5wdXRJZHMgPSBuZXcgTWFwKCk7XG5sZXQgbWlkaU91dHB1dElkcyA9IG5ldyBNYXAoKTtcbmxldCBsaXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG5cblxuY2xhc3MgTUlESUFjY2Vzc3tcbiAgY29uc3RydWN0b3IobWlkaUlucHV0cywgbWlkaU91dHB1dHMpe1xuICAgIHRoaXMuc3lzZXhFbmFibGVkID0gdHJ1ZTtcbiAgICB0aGlzLmlucHV0cyA9IG1pZGlJbnB1dHM7XG4gICAgdGhpcy5vdXRwdXRzID0gbWlkaU91dHB1dHM7XG4gIH1cblxuICBhZGRFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKXtcbiAgICBpZih0eXBlICE9PSAnc3RhdGVjaGFuZ2UnKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYobGlzdGVuZXJzLmhhcyhsaXN0ZW5lcikgPT09IGZhbHNlKXtcbiAgICAgIGxpc3RlbmVycy5hZGQobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpe1xuICAgIGlmKHR5cGUgIT09ICdzdGF0ZWNoYW5nZScpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihsaXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gdHJ1ZSl7XG4gICAgICBsaXN0ZW5lcnMuZGVsZXRlKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZU1JRElBY2Nlc3MoKXtcblxuICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gZXhlY3V0b3IocmVzb2x2ZSwgcmVqZWN0KXtcblxuICAgIGlmKG1pZGlBY2Nlc3MgIT09IHVuZGVmaW5lZCl7XG4gICAgICByZXNvbHZlKG1pZGlBY2Nlc3MpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNyZWF0ZUphenpJbnN0YW5jZShmdW5jdGlvbihpbnN0YW5jZSl7XG4gICAgICBpZihpbnN0YW5jZSA9PT0gdW5kZWZpbmVkKXtcbiAgICAgICAgcmVqZWN0KHttZXNzYWdlOiAnTm8gYWNjZXNzIHRvIE1JREkgZGV2aWNlczogYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHRoZSBXZWJNSURJIEFQSSBhbmQgdGhlIEphenogcGx1Z2luIGlzIG5vdCBpbnN0YWxsZWQuJ30pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGphenpJbnN0YW5jZSA9IGluc3RhbmNlO1xuXG4gICAgICBjcmVhdGVNSURJUG9ydHMoZnVuY3Rpb24oKXtcbiAgICAgICAgc2V0dXBMaXN0ZW5lcnMoKTtcbiAgICAgICAgbWlkaUFjY2VzcyA9IG5ldyBNSURJQWNjZXNzKG1pZGlJbnB1dHMsIG1pZGlPdXRwdXRzKTtcbiAgICAgICAgcmVzb2x2ZShtaWRpQWNjZXNzKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVNSURJUG9ydHMoY2FsbGJhY2spe1xuICBsZXQgaW5wdXRzID0gamF6ekluc3RhbmNlLk1pZGlJbkxpc3QoKTtcbiAgbGV0IG91dHB1dHMgPSBqYXp6SW5zdGFuY2UuTWlkaU91dExpc3QoKTtcbiAgbGV0IG51bUlucHV0cyA9IGlucHV0cy5sZW5ndGg7XG4gIGxldCBudW1PdXRwdXRzID0gb3V0cHV0cy5sZW5ndGg7XG5cbiAgbG9vcENyZWF0ZU1JRElQb3J0KDAsIG51bUlucHV0cywgJ2lucHV0JywgaW5wdXRzLCBmdW5jdGlvbigpe1xuICAgIGxvb3BDcmVhdGVNSURJUG9ydCgwLCBudW1PdXRwdXRzLCAnb3V0cHV0Jywgb3V0cHV0cywgY2FsbGJhY2spO1xuICB9KTtcbn1cblxuXG5mdW5jdGlvbiBsb29wQ3JlYXRlTUlESVBvcnQoaW5kZXgsIG1heCwgdHlwZSwgbGlzdCwgY2FsbGJhY2spe1xuICBpZihpbmRleCA8IG1heCl7XG4gICAgbGV0IG5hbWUgPSBsaXN0W2luZGV4KytdO1xuICAgIGNyZWF0ZU1JRElQb3J0KHR5cGUsIG5hbWUsIGZ1bmN0aW9uKCl7XG4gICAgICBsb29wQ3JlYXRlTUlESVBvcnQoaW5kZXgsIG1heCwgdHlwZSwgbGlzdCwgY2FsbGJhY2spO1xuICAgIH0pO1xuICB9ZWxzZXtcbiAgICBjYWxsYmFjaygpO1xuICB9XG59XG5cblxuZnVuY3Rpb24gY3JlYXRlTUlESVBvcnQodHlwZSwgbmFtZSwgY2FsbGJhY2spe1xuICBnZXRKYXp6SW5zdGFuY2UodHlwZSwgZnVuY3Rpb24oaW5zdGFuY2Upe1xuICAgIGxldCBwb3J0O1xuICAgIGxldCBpbmZvID0gW25hbWUsICcnLCAnJ107XG4gICAgaWYodHlwZSA9PT0gJ2lucHV0Jyl7XG4gICAgICBpZihpbnN0YW5jZS5TdXBwb3J0KCdNaWRpSW5JbmZvJykpe1xuICAgICAgICBpbmZvID0gaW5zdGFuY2UuTWlkaUluSW5mbyhuYW1lKTtcbiAgICAgIH1cbiAgICAgIHBvcnQgPSBuZXcgTUlESUlucHV0KGluZm8sIGluc3RhbmNlKTtcbiAgICAgIG1pZGlJbnB1dHMuc2V0KHBvcnQuaWQsIHBvcnQpO1xuICAgIH1lbHNlIGlmKHR5cGUgPT09ICdvdXRwdXQnKXtcbiAgICAgIGlmKGluc3RhbmNlLlN1cHBvcnQoJ01pZGlPdXRJbmZvJykpe1xuICAgICAgICBpbmZvID0gaW5zdGFuY2UuTWlkaU91dEluZm8obmFtZSk7XG4gICAgICB9XG4gICAgICBwb3J0ID0gbmV3IE1JRElPdXRwdXQoaW5mbywgaW5zdGFuY2UpO1xuICAgICAgbWlkaU91dHB1dHMuc2V0KHBvcnQuaWQsIHBvcnQpO1xuICAgIH1cbiAgICBjYWxsYmFjayhwb3J0KTtcbiAgfSk7XG59XG5cblxuZnVuY3Rpb24gZ2V0UG9ydEJ5TmFtZShwb3J0cywgbmFtZSl7XG4gIGxldCBwb3J0O1xuICBmb3IocG9ydCBvZiBwb3J0cy52YWx1ZXMoKSl7XG4gICAgaWYocG9ydC5uYW1lID09PSBuYW1lKXtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcG9ydDtcbn1cblxuXG5mdW5jdGlvbiBzZXR1cExpc3RlbmVycygpe1xuICBqYXp6SW5zdGFuY2UuT25EaXNjb25uZWN0TWlkaUluKGZ1bmN0aW9uKG5hbWUpe1xuICAgIGxldCBwb3J0ID0gZ2V0UG9ydEJ5TmFtZShtaWRpSW5wdXRzLCBuYW1lKTtcbiAgICBpZihwb3J0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgcG9ydC5zdGF0ZSA9ICdkaXNjb25uZWN0ZWQnO1xuICAgICAgcG9ydC5jbG9zZSgpO1xuICAgICAgcG9ydC5famF6ekluc3RhbmNlLmlucHV0SW5Vc2UgPSBmYWxzZTtcbiAgICAgIG1pZGlJbnB1dHMuZGVsZXRlKHBvcnQuaWQpO1xuICAgICAgZGlzcGF0Y2hFdmVudChwb3J0KTtcbiAgICB9XG4gIH0pO1xuXG4gIGphenpJbnN0YW5jZS5PbkRpc2Nvbm5lY3RNaWRpT3V0KGZ1bmN0aW9uKG5hbWUpe1xuICAgIGxldCBwb3J0ID0gZ2V0UG9ydEJ5TmFtZShtaWRpT3V0cHV0cywgbmFtZSk7XG4gICAgaWYocG9ydCAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHBvcnQuc3RhdGUgPSAnZGlzY29ubmVjdGVkJztcbiAgICAgIHBvcnQuY2xvc2UoKTtcbiAgICAgIHBvcnQuX2phenpJbnN0YW5jZS5vdXRwdXRJblVzZSA9IGZhbHNlO1xuICAgICAgbWlkaU91dHB1dHMuZGVsZXRlKHBvcnQuaWQpO1xuICAgICAgZGlzcGF0Y2hFdmVudChwb3J0KTtcbiAgICB9XG4gIH0pO1xuXG4gIGphenpJbnN0YW5jZS5PbkNvbm5lY3RNaWRpSW4oZnVuY3Rpb24obmFtZSl7XG4gICAgY3JlYXRlTUlESVBvcnQoJ2lucHV0JywgbmFtZSwgZnVuY3Rpb24ocG9ydCl7XG4gICAgICBkaXNwYXRjaEV2ZW50KHBvcnQpO1xuICAgIH0pO1xuICB9KTtcblxuICBqYXp6SW5zdGFuY2UuT25Db25uZWN0TWlkaU91dChmdW5jdGlvbihuYW1lKXtcbiAgICBjcmVhdGVNSURJUG9ydCgnb3V0cHV0JywgbmFtZSwgZnVuY3Rpb24ocG9ydCl7XG4gICAgICBkaXNwYXRjaEV2ZW50KHBvcnQpO1xuICAgIH0pO1xuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2hFdmVudChwb3J0KXtcblxuICBwb3J0LmRpc3BhdGNoRXZlbnQobmV3IE1JRElDb25uZWN0aW9uRXZlbnQocG9ydCwgcG9ydCkpO1xuXG4gIGxldCBldnQgPSBuZXcgTUlESUNvbm5lY3Rpb25FdmVudChtaWRpQWNjZXNzLCBwb3J0KTtcblxuICBpZih0eXBlb2YgbWlkaUFjY2Vzcy5vbnN0YXRlY2hhbmdlID09PSAnZnVuY3Rpb24nKXtcbiAgICBtaWRpQWNjZXNzLm9uc3RhdGVjaGFuZ2UoZXZ0KTtcbiAgfVxuICBmb3IobGV0IGxpc3RlbmVyIG9mIGxpc3RlbmVycyl7XG4gICAgbGlzdGVuZXIoZXZ0KTtcbiAgfVxufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBjbG9zZUFsbE1JRElJbnB1dHMoKXtcbiAgbWlkaUlucHV0cy5mb3JFYWNoKGZ1bmN0aW9uKGlucHV0KXtcbiAgICAvL2lucHV0LmNsb3NlKCk7XG4gICAgaW5wdXQuX2phenpJbnN0YW5jZS5NaWRpSW5DbG9zZSgpO1xuICB9KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0TUlESURldmljZUlkKG5hbWUsIHR5cGUpe1xuICBsZXQgaWQ7XG4gIGlmKHR5cGUgPT09ICdpbnB1dCcpe1xuICAgIGlkID0gbWlkaUlucHV0SWRzLmdldChuYW1lKTtcbiAgICBpZihpZCA9PT0gdW5kZWZpbmVkKXtcbiAgICAgIGlkID0gZ2VuZXJhdGVVVUlEKCk7XG4gICAgICBtaWRpSW5wdXRJZHMuc2V0KG5hbWUsIGlkKTtcbiAgICB9XG4gIH1lbHNlIGlmKHR5cGUgPT09ICdvdXRwdXQnKXtcbiAgICBpZCA9IG1pZGlPdXRwdXRJZHMuZ2V0KG5hbWUpO1xuICAgIGlmKGlkID09PSB1bmRlZmluZWQpe1xuICAgICAgaWQgPSBnZW5lcmF0ZVVVSUQoKTtcbiAgICAgIG1pZGlPdXRwdXRJZHMuc2V0KG5hbWUsIGlkKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGlkO1xufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Z2V0RGV2aWNlfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtNSURJTWVzc2FnZUV2ZW50fSBmcm9tICcuL21pZGltZXNzYWdlX2V2ZW50JztcbmltcG9ydCB7TUlESUNvbm5lY3Rpb25FdmVudH0gZnJvbSAnLi9taWRpY29ubmVjdGlvbl9ldmVudCc7XG5pbXBvcnQge2Rpc3BhdGNoRXZlbnQsIGdldE1JRElEZXZpY2VJZH0gZnJvbSAnLi9taWRpX2FjY2Vzcyc7XG5cbmxldCBtaWRpUHJvYztcbmxldCBub2RlanMgPSBnZXREZXZpY2UoKS5ub2RlanM7XG5cbmV4cG9ydCBjbGFzcyBNSURJSW5wdXR7XG4gIGNvbnN0cnVjdG9yKGluZm8sIGluc3RhbmNlKXtcbiAgICB0aGlzLmlkID0gZ2V0TUlESURldmljZUlkKGluZm9bMF0sICdpbnB1dCcpO1xuICAgIHRoaXMubmFtZSA9IGluZm9bMF07XG4gICAgdGhpcy5tYW51ZmFjdHVyZXIgPSBpbmZvWzFdO1xuICAgIHRoaXMudmVyc2lvbiA9IGluZm9bMl07XG4gICAgdGhpcy50eXBlID0gJ2lucHV0JztcbiAgICB0aGlzLnN0YXRlID0gJ2Nvbm5lY3RlZCc7XG4gICAgdGhpcy5jb25uZWN0aW9uID0gJ3BlbmRpbmcnO1xuXG4gICAgdGhpcy5vbnN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICB0aGlzLl9vbm1pZGltZXNzYWdlID0gbnVsbDtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgJ29ubWlkaW1lc3NhZ2UnLCB7XG4gICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgICAgdGhpcy5fb25taWRpbWVzc2FnZSA9IHZhbHVlO1xuICAgICAgICBpZih0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpe1xuICAgICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgTWFwKCkuc2V0KCdtaWRpbWVzc2FnZScsIG5ldyBTZXQoKSkuc2V0KCdzdGF0ZWNoYW5nZScsIG5ldyBTZXQoKSk7XG4gICAgdGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlID0gZmFsc2U7XG4gICAgdGhpcy5fc3lzZXhCdWZmZXIgPSBuZXcgVWludDhBcnJheSgpO1xuXG4gICAgdGhpcy5famF6ekluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgdGhpcy5famF6ekluc3RhbmNlLmlucHV0SW5Vc2UgPSB0cnVlO1xuICAgIGlmKGdldERldmljZSgpLnBsYXRmb3JtID09PSAnbGludXgnKXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpSW5PcGVuKHRoaXMubmFtZSwgbWlkaVByb2MuYmluZCh0aGlzKSk7XG4gICAgfVxuICB9XG5cbiAgYWRkRXZlbnRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lciwgdXNlQ2FwdHVyZSl7XG4gICAgbGV0IGxpc3RlbmVycyA9IHRoaXMuX2xpc3RlbmVycy5nZXQodHlwZSk7XG4gICAgaWYobGlzdGVuZXJzID09PSB1bmRlZmluZWQpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKGxpc3RlbmVycy5oYXMobGlzdGVuZXIpID09PSBmYWxzZSl7XG4gICAgICBsaXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKXtcbiAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldCh0eXBlKTtcbiAgICBpZihsaXN0ZW5lcnMgPT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYobGlzdGVuZXJzLmhhcyhsaXN0ZW5lcikgPT09IGZhbHNlKXtcbiAgICAgIGxpc3RlbmVycy5kZWxldGUobGlzdGVuZXIpO1xuICAgIH1cbiAgfVxuXG4gIHByZXZlbnREZWZhdWx0KCl7XG4gICAgdGhpcy5fcHZ0RGVmID0gdHJ1ZTtcbiAgfVxuXG4gIGRpc3BhdGNoRXZlbnQoZXZ0KXtcbiAgICB0aGlzLl9wdnREZWYgPSBmYWxzZTtcbiAgICBsZXQgbGlzdGVuZXJzID0gdGhpcy5fbGlzdGVuZXJzLmdldChldnQudHlwZSk7XG4gICAgbGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24obGlzdGVuZXIpe1xuICAgICAgbGlzdGVuZXIoZXZ0KTtcbiAgICB9KTtcblxuICAgIGlmKGV2dC50eXBlID09PSAnbWlkaW1lc3NhZ2UnKXtcbiAgICAgIGlmKHRoaXMuX29ubWlkaW1lc3NhZ2UgIT09IG51bGwpe1xuICAgICAgICB0aGlzLl9vbm1pZGltZXNzYWdlKGV2dCk7XG4gICAgICB9XG4gICAgfWVsc2UgaWYoZXZ0LnR5cGUgPT09ICdzdGF0ZWNoYW5nZScpe1xuICAgICAgaWYodGhpcy5vbnN0YXRlY2hhbmdlICE9PSBudWxsKXtcbiAgICAgICAgdGhpcy5vbnN0YXRlY2hhbmdlKGV2dCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMuX3B2dERlZjtcbiAgfVxuXG4gIG9wZW4oKXtcbiAgICBpZih0aGlzLmNvbm5lY3Rpb24gPT09ICdvcGVuJyl7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmKGdldERldmljZSgpLnBsYXRmb3JtICE9PSAnbGludXgnKXtcbiAgICAgIHRoaXMuX2phenpJbnN0YW5jZS5NaWRpSW5PcGVuKHRoaXMubmFtZSwgbWlkaVByb2MuYmluZCh0aGlzKSk7XG4gICAgfVxuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdvcGVuJztcbiAgICBkaXNwYXRjaEV2ZW50KHRoaXMpOyAvLyBkaXNwYXRjaCBldmVudCB2aWEgTUlESUFjY2Vzc1xuICB9XG5cbiAgY2xvc2UoKXtcbiAgICBpZih0aGlzLmNvbm5lY3Rpb24gPT09ICdjbG9zZWQnKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYoZ2V0RGV2aWNlKCkucGxhdGZvcm0gIT09ICdsaW51eCcpe1xuICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlJbkNsb3NlKHRoaXMubmFtZSk7XG4gICAgfVxuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdjbG9zZWQnO1xuICAgIGRpc3BhdGNoRXZlbnQodGhpcyk7IC8vIGRpc3BhdGNoIGV2ZW50IHZpYSBNSURJQWNjZXNzXG4gICAgdGhpcy5fb25taWRpbWVzc2FnZSA9IG51bGw7XG4gICAgdGhpcy5vbnN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICB0aGlzLl9saXN0ZW5lcnMuZ2V0KCdtaWRpbWVzc2FnZScpLmNsZWFyKCk7XG4gICAgdGhpcy5fbGlzdGVuZXJzLmdldCgnc3RhdGVjaGFuZ2UnKS5jbGVhcigpO1xuICB9XG5cbiAgX2FwcGVuZFRvU3lzZXhCdWZmZXIoZGF0YSl7XG4gICAgbGV0IG9sZExlbmd0aCA9IHRoaXMuX3N5c2V4QnVmZmVyLmxlbmd0aDtcbiAgICBsZXQgdG1wQnVmZmVyID0gbmV3IFVpbnQ4QXJyYXkob2xkTGVuZ3RoICsgZGF0YS5sZW5ndGgpO1xuICAgIHRtcEJ1ZmZlci5zZXQodGhpcy5fc3lzZXhCdWZmZXIpO1xuICAgIHRtcEJ1ZmZlci5zZXQoZGF0YSwgb2xkTGVuZ3RoKTtcbiAgICB0aGlzLl9zeXNleEJ1ZmZlciA9IHRtcEJ1ZmZlcjtcbiAgfVxuXG4gIF9idWZmZXJMb25nU3lzZXgoZGF0YSwgaW5pdGlhbE9mZnNldCl7XG4gICAgbGV0IGogPSBpbml0aWFsT2Zmc2V0O1xuICAgIHdoaWxlKGogPCBkYXRhLmxlbmd0aCl7XG4gICAgICBpZihkYXRhW2pdID09IDB4Rjcpe1xuICAgICAgICAvLyBlbmQgb2Ygc3lzZXghXG4gICAgICAgIGorKztcbiAgICAgICAgdGhpcy5fYXBwZW5kVG9TeXNleEJ1ZmZlcihkYXRhLnNsaWNlKGluaXRpYWxPZmZzZXQsIGopKTtcbiAgICAgICAgcmV0dXJuIGo7XG4gICAgICB9XG4gICAgICBqKys7XG4gICAgfVxuICAgIC8vIGRpZG4ndCByZWFjaCB0aGUgZW5kOyBqdXN0IHRhY2sgaXQgb24uXG4gICAgdGhpcy5fYXBwZW5kVG9TeXNleEJ1ZmZlcihkYXRhLnNsaWNlKGluaXRpYWxPZmZzZXQsIGopKTtcbiAgICB0aGlzLl9pbkxvbmdTeXNleE1lc3NhZ2UgPSB0cnVlO1xuICAgIHJldHVybiBqO1xuICB9XG59XG5cblxubWlkaVByb2MgPSBmdW5jdGlvbih0aW1lc3RhbXAsIGRhdGEpe1xuICBsZXQgbGVuZ3RoID0gMDtcbiAgbGV0IGk7XG4gIGxldCBpc1N5c2V4TWVzc2FnZSA9IGZhbHNlO1xuXG4gIC8vIEphenogc29tZXRpbWVzIHBhc3NlcyB1cyBtdWx0aXBsZSBtZXNzYWdlcyBhdCBvbmNlLCBzbyB3ZSBuZWVkIHRvIHBhcnNlIHRoZW0gb3V0XG4gIC8vIGFuZCBwYXNzIHRoZW0gb25lIGF0IGEgdGltZS5cblxuICBmb3IoaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSArPSBsZW5ndGgpe1xuICAgIGxldCBpc1ZhbGlkTWVzc2FnZSA9IHRydWU7XG4gICAgaWYodGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlKXtcbiAgICAgIGkgPSB0aGlzLl9idWZmZXJMb25nU3lzZXgoZGF0YSwgaSk7XG4gICAgICBpZihkYXRhW2kgLSAxXSAhPSAweGY3KXtcbiAgICAgICAgLy8gcmFuIG9mZiB0aGUgZW5kIHdpdGhvdXQgaGl0dGluZyB0aGUgZW5kIG9mIHRoZSBzeXNleCBtZXNzYWdlXG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlzU3lzZXhNZXNzYWdlID0gdHJ1ZTtcbiAgICB9ZWxzZXtcbiAgICAgIGlzU3lzZXhNZXNzYWdlID0gZmFsc2U7XG4gICAgICBzd2l0Y2goZGF0YVtpXSAmIDB4RjApe1xuICAgICAgICBjYXNlIDB4MDA6ICAvLyBDaGV3IHVwIHNwdXJpb3VzIDB4MDAgYnl0ZXMuICBGaXhlcyBhIFdpbmRvd3MgcHJvYmxlbS5cbiAgICAgICAgICBsZW5ndGggPSAxO1xuICAgICAgICAgIGlzVmFsaWRNZXNzYWdlID0gZmFsc2U7XG4gICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgY2FzZSAweDgwOiAgLy8gbm90ZSBvZmZcbiAgICAgICAgY2FzZSAweDkwOiAgLy8gbm90ZSBvblxuICAgICAgICBjYXNlIDB4QTA6ICAvLyBwb2x5cGhvbmljIGFmdGVydG91Y2hcbiAgICAgICAgY2FzZSAweEIwOiAgLy8gY29udHJvbCBjaGFuZ2VcbiAgICAgICAgY2FzZSAweEUwOiAgLy8gY2hhbm5lbCBtb2RlXG4gICAgICAgICAgbGVuZ3RoID0gMztcbiAgICAgICAgICBicmVhaztcblxuICAgICAgICBjYXNlIDB4QzA6ICAvLyBwcm9ncmFtIGNoYW5nZVxuICAgICAgICBjYXNlIDB4RDA6ICAvLyBjaGFubmVsIGFmdGVydG91Y2hcbiAgICAgICAgICBsZW5ndGggPSAyO1xuICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgIGNhc2UgMHhGMDpcbiAgICAgICAgICBzd2l0Y2goZGF0YVtpXSl7XG4gICAgICAgICAgICBjYXNlIDB4ZjA6ICAvLyBsZXRpYWJsZS1sZW5ndGggc3lzZXguXG4gICAgICAgICAgICAgIGkgPSB0aGlzLl9idWZmZXJMb25nU3lzZXgoZGF0YSwgaSk7XG4gICAgICAgICAgICAgIGlmKGRhdGFbaSAtIDFdICE9IDB4Zjcpe1xuICAgICAgICAgICAgICAgIC8vIHJhbiBvZmYgdGhlIGVuZCB3aXRob3V0IGhpdHRpbmcgdGhlIGVuZCBvZiB0aGUgc3lzZXggbWVzc2FnZVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBpc1N5c2V4TWVzc2FnZSA9IHRydWU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICBjYXNlIDB4RjE6ICAvLyBNVEMgcXVhcnRlciBmcmFtZVxuICAgICAgICAgICAgY2FzZSAweEYzOiAgLy8gc29uZyBzZWxlY3RcbiAgICAgICAgICAgICAgbGVuZ3RoID0gMjtcbiAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIGNhc2UgMHhGMjogIC8vIHNvbmcgcG9zaXRpb24gcG9pbnRlclxuICAgICAgICAgICAgICBsZW5ndGggPSAzO1xuICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgbGVuZ3RoID0gMTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICBpZighaXNWYWxpZE1lc3NhZ2Upe1xuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgbGV0IGV2dCA9IHt9O1xuICAgIGV2dC5yZWNlaXZlZFRpbWUgPSBwYXJzZUZsb2F0KHRpbWVzdGFtcC50b1N0cmluZygpKSArIHRoaXMuX2phenpJbnN0YW5jZS5fcGVyZlRpbWVaZXJvO1xuXG4gICAgaWYoaXNTeXNleE1lc3NhZ2UgfHwgdGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlKXtcbiAgICAgIGV2dC5kYXRhID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5fc3lzZXhCdWZmZXIpO1xuICAgICAgdGhpcy5fc3lzZXhCdWZmZXIgPSBuZXcgVWludDhBcnJheSgwKTtcbiAgICAgIHRoaXMuX2luTG9uZ1N5c2V4TWVzc2FnZSA9IGZhbHNlO1xuICAgIH1lbHNle1xuICAgICAgZXZ0LmRhdGEgPSBuZXcgVWludDhBcnJheShkYXRhLnNsaWNlKGksIGxlbmd0aCArIGkpKTtcbiAgICB9XG5cbiAgICBpZihub2RlanMpe1xuICAgICAgaWYodGhpcy5fb25taWRpbWVzc2FnZSl7XG4gICAgICAgIHRoaXMuX29ubWlkaW1lc3NhZ2UoZXZ0KTtcbiAgICAgIH1cbiAgICB9ZWxzZXtcbiAgICAgIGxldCBlID0gbmV3IE1JRElNZXNzYWdlRXZlbnQodGhpcywgZXZ0LmRhdGEsIGV2dC5yZWNlaXZlZFRpbWUpO1xuICAgICAgdGhpcy5kaXNwYXRjaEV2ZW50KGUpO1xuICAgIH1cbiAgfVxufTsiLCIndXNlIHN0cmljdCc7XG5cbmltcG9ydCB7Z2V0RGV2aWNlfSBmcm9tICcuL3V0aWwnO1xuaW1wb3J0IHtkaXNwYXRjaEV2ZW50LCBnZXRNSURJRGV2aWNlSWR9IGZyb20gJy4vbWlkaV9hY2Nlc3MnO1xuXG5leHBvcnQgY2xhc3MgTUlESU91dHB1dHtcbiAgY29uc3RydWN0b3IoaW5mbywgaW5zdGFuY2Upe1xuICAgIHRoaXMuaWQgPSBnZXRNSURJRGV2aWNlSWQoaW5mb1swXSwgJ291dHB1dCcpO1xuICAgIHRoaXMubmFtZSA9IGluZm9bMF07XG4gICAgdGhpcy5tYW51ZmFjdHVyZXIgPSBpbmZvWzFdO1xuICAgIHRoaXMudmVyc2lvbiA9IGluZm9bMl07XG4gICAgdGhpcy50eXBlID0gJ291dHB1dCc7XG4gICAgdGhpcy5zdGF0ZSA9ICdjb25uZWN0ZWQnO1xuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdwZW5kaW5nJztcbiAgICB0aGlzLm9ubWlkaW1lc3NhZ2UgPSBudWxsO1xuICAgIHRoaXMub25zdGF0ZWNoYW5nZSA9IG51bGw7XG5cbiAgICB0aGlzLl9saXN0ZW5lcnMgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5faW5Mb25nU3lzZXhNZXNzYWdlID0gZmFsc2U7XG4gICAgdGhpcy5fc3lzZXhCdWZmZXIgPSBuZXcgVWludDhBcnJheSgpO1xuXG4gICAgdGhpcy5famF6ekluc3RhbmNlID0gaW5zdGFuY2U7XG4gICAgdGhpcy5famF6ekluc3RhbmNlLm91dHB1dEluVXNlID0gdHJ1ZTtcbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSA9PT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dE9wZW4odGhpcy5uYW1lKTtcbiAgICB9XG4gIH1cblxuICBvcGVuKCl7XG4gICAgaWYodGhpcy5jb25uZWN0aW9uID09PSAnb3Blbicpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSAhPT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dE9wZW4odGhpcy5uYW1lKTtcbiAgICB9XG4gICAgdGhpcy5jb25uZWN0aW9uID0gJ29wZW4nO1xuICAgIGRpc3BhdGNoRXZlbnQodGhpcyk7IC8vIGRpc3BhdGNoIGV2ZW50IHZpYSBNSURJQWNjZXNzXG4gIH1cblxuICBjbG9zZSgpe1xuICAgIGlmKHRoaXMuY29ubmVjdGlvbiA9PT0gJ2Nsb3NlZCcpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZihnZXREZXZpY2UoKS5wbGF0Zm9ybSAhPT0gJ2xpbnV4Jyl7XG4gICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dENsb3NlKHRoaXMubmFtZSk7XG4gICAgfVxuICAgIHRoaXMuY29ubmVjdGlvbiA9ICdjbG9zZWQnO1xuICAgIGRpc3BhdGNoRXZlbnQodGhpcyk7IC8vIGRpc3BhdGNoIGV2ZW50IHZpYSBNSURJQWNjZXNzXG4gICAgdGhpcy5vbnN0YXRlY2hhbmdlID0gbnVsbDtcbiAgICB0aGlzLl9saXN0ZW5lcnMuY2xlYXIoKTtcbiAgfVxuXG4gIHNlbmQoZGF0YSwgdGltZXN0YW1wKXtcbiAgICBsZXQgZGVsYXlCZWZvcmVTZW5kID0gMDtcblxuICAgIGlmKGRhdGEubGVuZ3RoID09PSAwKXtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBpZih0aW1lc3RhbXApe1xuICAgICAgZGVsYXlCZWZvcmVTZW5kID0gTWF0aC5mbG9vcih0aW1lc3RhbXAgLSB3aW5kb3cucGVyZm9ybWFuY2Uubm93KCkpO1xuICAgIH1cblxuICAgIGlmKHRpbWVzdGFtcCAmJiAoZGVsYXlCZWZvcmVTZW5kID4gMSkpe1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICB0aGlzLl9qYXp6SW5zdGFuY2UuTWlkaU91dExvbmcoZGF0YSk7XG4gICAgICB9LCBkZWxheUJlZm9yZVNlbmQpO1xuICAgIH1lbHNle1xuICAgICAgdGhpcy5famF6ekluc3RhbmNlLk1pZGlPdXRMb25nKGRhdGEpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGFkZEV2ZW50TGlzdGVuZXIodHlwZSwgbGlzdGVuZXIsIHVzZUNhcHR1cmUpe1xuICAgIGlmKHR5cGUgIT09ICdzdGF0ZWNoYW5nZScpe1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmKHRoaXMuX2xpc3RlbmVycy5oYXMobGlzdGVuZXIpID09PSBmYWxzZSl7XG4gICAgICB0aGlzLl9saXN0ZW5lcnMuYWRkKGxpc3RlbmVyKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVFdmVudExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyLCB1c2VDYXB0dXJlKXtcbiAgICBpZih0eXBlICE9PSAnc3RhdGVjaGFuZ2UnKXtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZih0aGlzLl9saXN0ZW5lcnMuaGFzKGxpc3RlbmVyKSA9PT0gZmFsc2Upe1xuICAgICAgdGhpcy5fbGlzdGVuZXJzLmRlbGV0ZShsaXN0ZW5lcik7XG4gICAgfVxuICB9XG5cbiAgZGlzcGF0Y2hFdmVudChldnQpe1xuICAgIHRoaXMuX2xpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uKGxpc3RlbmVyKXtcbiAgICAgIGxpc3RlbmVyKGV2dCk7XG4gICAgfSk7XG5cbiAgICBpZih0aGlzLm9uc3RhdGVjaGFuZ2UgIT09IG51bGwpe1xuICAgICAgdGhpcy5vbnN0YXRlY2hhbmdlKGV2dCk7XG4gICAgfVxuICB9XG59IiwiJ3VzZSBzdHJpY3QnO1xuXG5leHBvcnQgY2xhc3MgTUlESUNvbm5lY3Rpb25FdmVudHtcbiAgY29uc3RydWN0b3IobWlkaUFjY2VzcywgcG9ydCl7XG4gICAgdGhpcy5idWJibGVzID0gZmFsc2U7XG4gICAgdGhpcy5jYW5jZWxCdWJibGUgPSBmYWxzZTtcbiAgICB0aGlzLmNhbmNlbGFibGUgPSBmYWxzZTtcbiAgICB0aGlzLmN1cnJlbnRUYXJnZXQgPSBtaWRpQWNjZXNzO1xuICAgIHRoaXMuZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuZXZlbnRQaGFzZSA9IDA7XG4gICAgdGhpcy5wYXRoID0gW107XG4gICAgdGhpcy5wb3J0ID0gcG9ydDtcbiAgICB0aGlzLnJldHVyblZhbHVlID0gdHJ1ZTtcbiAgICB0aGlzLnNyY0VsZW1lbnQgPSBtaWRpQWNjZXNzO1xuICAgIHRoaXMudGFyZ2V0ID0gbWlkaUFjY2VzcztcbiAgICB0aGlzLnRpbWVTdGFtcCA9IERhdGUubm93KCk7XG4gICAgdGhpcy50eXBlID0gJ3N0YXRlY2hhbmdlJztcbiAgfVxufVxuXG4iLCIndXNlIHN0cmljdCc7XG5cbmV4cG9ydCBjbGFzcyBNSURJTWVzc2FnZUV2ZW50e1xuICBjb25zdHJ1Y3Rvcihwb3J0LCBkYXRhLCByZWNlaXZlZFRpbWUpe1xuICAgIHRoaXMuYnViYmxlcyA9IGZhbHNlO1xuICAgIHRoaXMuY2FuY2VsQnViYmxlID0gZmFsc2U7XG4gICAgdGhpcy5jYW5jZWxhYmxlID0gZmFsc2U7XG4gICAgdGhpcy5jdXJyZW50VGFyZ2V0ID0gcG9ydDtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMuZGVmYXVsdFByZXZlbnRlZCA9IGZhbHNlO1xuICAgIHRoaXMuZXZlbnRQaGFzZSA9IDA7XG4gICAgdGhpcy5wYXRoID0gW107XG4gICAgdGhpcy5yZWNlaXZlZFRpbWUgPSByZWNlaXZlZFRpbWU7XG4gICAgdGhpcy5yZXR1cm5WYWx1ZSA9IHRydWU7XG4gICAgdGhpcy5zcmNFbGVtZW50ID0gcG9ydDtcbiAgICB0aGlzLnRhcmdldCA9IHBvcnQ7XG4gICAgdGhpcy50aW1lU3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIHRoaXMudHlwZSA9ICdtaWRpbWVzc2FnZSc7XG4gIH1cbn1cblxuIiwiJ3VzZSBzdHJpY3QnO1xuXG4vLyByZXF1aXJlZCBieSBiYWJlbGlmeSBmb3IgdHJhbnNwaWxpbmcgZXM2XG4vL3JlcXVpcmUoJ2JhYmVsaWZ5L3BvbHlmaWxsJyk7XG5cbmltcG9ydCB7Y3JlYXRlTUlESUFjY2VzcywgY2xvc2VBbGxNSURJSW5wdXRzfSBmcm9tICcuL21pZGlfYWNjZXNzJztcbmltcG9ydCB7cG9seWZpbGwsIGdldERldmljZX0gZnJvbSAnLi91dGlsJztcblxubGV0IG1pZGlBY2Nlc3M7XG5cbihmdW5jdGlvbigpe1xuICBpZighd2luZG93Lm5hdmlnYXRvci5yZXF1ZXN0TUlESUFjY2Vzcyl7XG4gICAgcG9seWZpbGwoKTtcbiAgICB3aW5kb3cubmF2aWdhdG9yLnJlcXVlc3RNSURJQWNjZXNzID0gZnVuY3Rpb24oKXtcbiAgICAgIGlmKG1pZGlBY2Nlc3MgPT09IHVuZGVmaW5lZCl7XG4gICAgICAgICAgbWlkaUFjY2VzcyA9IGNyZWF0ZU1JRElBY2Nlc3MoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBtaWRpQWNjZXNzO1xuICAgIH07XG4gICAgaWYoZ2V0RGV2aWNlKCkubm9kZWpzID09PSB0cnVlKXtcbiAgICAgIHdpbmRvdy5uYXZpZ2F0b3IuY2xvc2UgPSBmdW5jdGlvbigpe1xuICAgICAgICAvLyBOZWVkIHRvIGNsb3NlIE1JREkgaW5wdXQgcG9ydHMsIG90aGVyd2lzZSBOb2RlLmpzIHdpbGwgd2FpdCBmb3IgTUlESSBpbnB1dCBmb3JldmVyLlxuICAgICAgICBjbG9zZUFsbE1JRElJbnB1dHMoKTtcbiAgICAgIH07XG4gICAgfVxuICB9XG59KCkpOyIsIid1c2Ugc3RyaWN0JztcblxubGV0IGRldmljZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERldmljZSgpe1xuXG4gIGlmKGRldmljZSAhPT0gdW5kZWZpbmVkKXtcbiAgICByZXR1cm4gZGV2aWNlO1xuICB9XG5cbiAgbGV0XG4gICAgcGxhdGZvcm0gPSAndW5kZXRlY3RlZCcsXG4gICAgYnJvd3NlciA9ICd1bmRldGVjdGVkJyxcbiAgICBub2RlanMgPSBmYWxzZTtcblxuICBpZihuYXZpZ2F0b3IgPT09IHVuZGVmaW5lZCl7XG4gICAgbm9kZWpzID0gKHR5cGVvZiBfX2Rpcm5hbWUgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5qYXp6TWlkaSk7XG4gICAgaWYobm9kZWpzID09PSB0cnVlKXtcbiAgICAgIHBsYXRmb3JtID0gcHJvY2Vzcy5wbGF0Zm9ybTtcbiAgICB9XG4gICAgZGV2aWNlID0ge1xuICAgICAgcGxhdGZvcm06IHBsYXRmb3JtLFxuICAgICAgYnJvd3NlcjogZmFsc2UsXG4gICAgICBub2RlanM6IG5vZGVqcyxcbiAgICAgIG1vYmlsZTogcGxhdGZvcm0gPT09ICdpb3MnIHx8IHBsYXRmb3JtID09PSAnYW5kcm9pZCdcbiAgICB9O1xuICAgIHJldHVybiBkZXZpY2U7XG4gIH1cblxuXG4gIGxldCB1YSA9IG5hdmlnYXRvci51c2VyQWdlbnQ7XG5cbiAgaWYodWEubWF0Y2goLyhpUGFkfGlQaG9uZXxpUG9kKS9nKSl7XG4gICAgcGxhdGZvcm0gPSAnaW9zJztcbiAgfWVsc2UgaWYodWEuaW5kZXhPZignQW5kcm9pZCcpICE9PSAtMSl7XG4gICAgcGxhdGZvcm0gPSAnYW5kcm9pZCc7XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ0xpbnV4JykgIT09IC0xKXtcbiAgICBwbGF0Zm9ybSA9ICdsaW51eCc7XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ01hY2ludG9zaCcpICE9PSAtMSl7XG4gICAgcGxhdGZvcm0gPSAnb3N4JztcbiAgfWVsc2UgaWYodWEuaW5kZXhPZignV2luZG93cycpICE9PSAtMSl7XG4gICAgcGxhdGZvcm0gPSAnd2luZG93cyc7XG4gIH1cblxuICBpZih1YS5pbmRleE9mKCdDaHJvbWUnKSAhPT0gLTEpe1xuICAgIC8vIGNocm9tZSwgY2hyb21pdW0gYW5kIGNhbmFyeVxuICAgIGJyb3dzZXIgPSAnY2hyb21lJztcblxuICAgIGlmKHVhLmluZGV4T2YoJ09QUicpICE9PSAtMSl7XG4gICAgICBicm93c2VyID0gJ29wZXJhJztcbiAgICB9ZWxzZSBpZih1YS5pbmRleE9mKCdDaHJvbWl1bScpICE9PSAtMSl7XG4gICAgICBicm93c2VyID0gJ2Nocm9taXVtJztcbiAgICB9XG4gIH1lbHNlIGlmKHVhLmluZGV4T2YoJ1NhZmFyaScpICE9PSAtMSl7XG4gICAgYnJvd3NlciA9ICdzYWZhcmknO1xuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdGaXJlZm94JykgIT09IC0xKXtcbiAgICBicm93c2VyID0gJ2ZpcmVmb3gnO1xuICB9ZWxzZSBpZih1YS5pbmRleE9mKCdUcmlkZW50JykgIT09IC0xKXtcbiAgICBicm93c2VyID0gJ2llJztcbiAgICBpZih1YS5pbmRleE9mKCdNU0lFIDknKSl7XG4gICAgICBicm93c2VyID0gJ2llIDknO1xuICAgIH1cbiAgfVxuXG4gIGlmKHBsYXRmb3JtID09PSAnaW9zJyl7XG4gICAgaWYodWEuaW5kZXhPZignQ3JpT1MnKSAhPT0gLTEpe1xuICAgICAgYnJvd3NlciA9ICdjaHJvbWUnO1xuICAgIH1cbiAgfVxuXG4gIGRldmljZSA9IHtcbiAgICBwbGF0Zm9ybTogcGxhdGZvcm0sXG4gICAgYnJvd3NlcjogYnJvd3NlcixcbiAgICBtb2JpbGU6IHBsYXRmb3JtID09PSAnaW9zJyB8fCBwbGF0Zm9ybSA9PT0gJ2FuZHJvaWQnLFxuICAgIG5vZGVqczogZmFsc2VcbiAgfTtcbiAgcmV0dXJuIGRldmljZTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGxQZXJmb3JtYW5jZSgpe1xuXG4gIGlmKHdpbmRvdy5wZXJmb3JtYW5jZSA9PT0gdW5kZWZpbmVkKXtcbiAgICB3aW5kb3cucGVyZm9ybWFuY2UgPSB7fTtcbiAgfVxuXG4gIERhdGUubm93ID0gKERhdGUubm93IHx8IGZ1bmN0aW9uKCl7XG4gICAgcmV0dXJuIG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9KTtcblxuICBpZih3aW5kb3cucGVyZm9ybWFuY2Uubm93ID09PSB1bmRlZmluZWQpe1xuXG4gICAgbGV0IG5vd09mZnNldCA9IERhdGUubm93KCk7XG5cbiAgICBpZihwZXJmb3JtYW5jZS50aW1pbmcgIT09IHVuZGVmaW5lZCAmJiBwZXJmb3JtYW5jZS50aW1pbmcubmF2aWdhdGlvblN0YXJ0ICE9PSB1bmRlZmluZWQpe1xuICAgICAgbm93T2Zmc2V0ID0gcGVyZm9ybWFuY2UudGltaW5nLm5hdmlnYXRpb25TdGFydDtcbiAgICB9XG5cbiAgICB3aW5kb3cucGVyZm9ybWFuY2Uubm93ID0gZnVuY3Rpb24gbm93KCl7XG4gICAgICByZXR1cm4gRGF0ZS5ub3coKSAtIG5vd09mZnNldDtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlmaWxsQ3VzdG9tRXZlbnQoKXtcblxuICBpZih0eXBlb2Ygd2luZG93LkV2ZW50ID09PSAnZnVuY3Rpb24nKXtcbiAgICByZXR1cm47XG4gIH1cblxuICBmdW5jdGlvbiBDdXN0b21FdmVudChldmVudCwgcGFyYW1zKXtcbiAgICBwYXJhbXMgPSBwYXJhbXMgfHwge2J1YmJsZXM6IGZhbHNlLCBjYW5jZWxhYmxlOiBmYWxzZSwgZGV0YWlsOiB1bmRlZmluZWR9O1xuICAgIHZhciBldnQgPSBkb2N1bWVudC5jcmVhdGVFdmVudCgnQ3VzdG9tRXZlbnQnKTtcbiAgICBldnQuaW5pdEN1c3RvbUV2ZW50KGV2ZW50LCBwYXJhbXMuYnViYmxlcywgcGFyYW1zLmNhbmNlbGFibGUsIHBhcmFtcy5kZXRhaWwpO1xuICAgIHJldHVybiBldnQ7XG4gIH07XG5cbiAgQ3VzdG9tRXZlbnQucHJvdG90eXBlID0gd2luZG93LkV2ZW50LnByb3RvdHlwZTtcbiAgd2luZG93LkN1c3RvbUV2ZW50ID0gQ3VzdG9tRXZlbnQ7XG4gIHdpbmRvdy5DdXN0b21FdmVudCA9IEN1c3RvbUV2ZW50O1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZVVVSUQoKXtcbiAgbGV0IGQgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgbGV0IHV1aWQgPSBuZXcgQXJyYXkoNjQpLmpvaW4oJ3gnKTs7Ly8neHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4JztcbiAgdXVpZCA9IHV1aWQucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4gICAgdmFyIHIgPSAoZCArIE1hdGgucmFuZG9tKCkqMTYpJTE2IHwgMDtcbiAgICBkID0gTWF0aC5mbG9vcihkLzE2KTtcbiAgICByZXR1cm4gKGM9PSd4JyA/IHIgOiAociYweDN8MHg4KSkudG9TdHJpbmcoMTYpLnRvVXBwZXJDYXNlKCk7XG4gIH0pO1xuICByZXR1cm4gdXVpZDtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGxQcm9taXNlKCl7XG4gIGlmKHR5cGVvZiB3aW5kb3cuUHJvbWlzZSAhPT0gJ2Z1bmN0aW9uJyl7XG5cbiAgICB3aW5kb3cuUHJvbWlzZSA9IGZ1bmN0aW9uKGV4ZWN1dG9yKSB7XG4gICAgICB0aGlzLmV4ZWN1dG9yID0gZXhlY3V0b3I7XG4gICAgfTtcblxuICAgIFByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbihhY2NlcHQsIHJlamVjdCkge1xuICAgICAgaWYodHlwZW9mIGFjY2VwdCAhPT0gJ2Z1bmN0aW9uJyl7XG4gICAgICAgIGFjY2VwdCA9IGZ1bmN0aW9uKCl7fTtcbiAgICAgIH1cbiAgICAgIGlmKHR5cGVvZiByZWplY3QgIT09ICdmdW5jdGlvbicpe1xuICAgICAgICByZWplY3QgPSBmdW5jdGlvbigpe307XG4gICAgICB9XG4gICAgICB0aGlzLmV4ZWN1dG9yKGFjY2VwdCwgcmVqZWN0KTtcbiAgICB9OyAgICBcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcG9seWZpbGxNYXAoKXtcbiAgbGV0IG1hcCA9IG5ldyBNYXAoKTtcbiAgaWYodHlwZW9mIG1hcC52YWx1ZXMgIT09ICdmdW5jdGlvbicpe1xuICAgIE1hcC5wcm90b3R5cGUudmFsdWVzID0gZnVuY3Rpb24oKXtcbiAgICAgIGxldCB2YWx1ZXMgPSBbXTtcbiAgICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHZhbHVlcztcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvbHlmaWxsKCl7XG4gIGxldCBkZXZpY2UgPSBnZXREZXZpY2UoKTtcbiAgLy8gaWYoZGV2aWNlLmJyb3dzZXIgPT09ICdpZScpe1xuICAvLyAgIHBvbHlmaWxsQ3VzdG9tRXZlbnQoKTtcbiAgLy8gfVxuICBwb2x5ZmlsbFByb21pc2UoKTtcbiAgcG9seWZpbGxNYXAoKTtcbiAgcG9seWZpbGxQZXJmb3JtYW5jZSgpO1xufSJdfQ==
