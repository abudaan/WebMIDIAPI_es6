'use strict';

const inNodeJs = (typeof __dirname !== 'undefined' && window.jazzMidi);
let midiProc;

export class MIDIInput{
  constructor(info, instance){
    this.name = info[0];
    this.manufacturer = info[1];
    this.version = info[2];
    this.type = 'input';
    this.state = 'open';
    this.connection = 'connected';
    this.onmidimessage = null;
    this.onstatechange = null;

    this._listeners = new Map();
    this._inLongSysexMessage = false;
    this._sysexBuffer = new Uint8Array();

    this._jazzInstance = instance.jazz;
    this._jazzInstanceId = instance.jazz.id;
    this._jazzInstance.inputInUse = true;
    this._input = this._jazzInstance.MidiInOpen(this.name, midiProc.bind(this));
  }

  addEventListener(type, listener, useCapture ){
      if(type !== 'midimessage'){
          return;
      }

      for(var i = 0, maxi = this._listeners.length; i < maxi; i++){
          if(this._listeners[i] == listener){
              return;
          }
      }
      this._listeners.push( listener );
  }

  removeEventListener(type, listener, useCapture ){
    if(type !== 'midimessage'){
      return;
    }
    for (var i=0; i<this._listeners.length; i++)
        if (this._listeners[i] == listener) {
            this._listeners.splice( i, 1 );  //remove it
            return;
        }
    }

  preventDefault(){
      this._pvtDef = true;
  }

  dispatchEvent(evt){
    this._pvtDef = false;

    // dispatch to listeners
    for (var i=0; i<this._listeners.length; i++)
        if (this._listeners[i].handleEvent)
            this._listeners[i].handleEvent.bind(this)( evt );
        else
            this._listeners[i].bind(this)( evt );

    if (this.onmidimessage)
        this.onmidimessage( evt );

    return this._pvtDef;
  }


  appendToSysexBuffer(data) {
    var oldLength = this._sysexBuffer.length;
    var tmpBuffer = new Uint8Array( oldLength + data.length );
    tmpBuffer.set( this._sysexBuffer );
    tmpBuffer.set( data, oldLength );
    this._sysexBuffer = tmpBuffer;
  }


  bufferLongSysex( data, initialOffset ) {
    var j = initialOffset;
    while (j<data.length) {
        if (data[j] == 0xF7) {
            // end of sysex!
            j++;
            this.appendToSysexBuffer( data.slice(initialOffset, j) );
            return j;
        }
        j++;
    }
    // didn't reach the end; just tack it on.
    this.appendToSysexBuffer( data.slice(initialOffset, j) );
    this._inLongSysexMessage = true;
    return j;
  }

  open(){
    // nothing to do here, the port has already been opened
  }

  close(){
    this.onmidimessage = null;
    this._listeners = [];
  }
}



midiProc = function(timestamp, data){
  // Have to use createEvent/initEvent because IE10 fails on new CustomEvent.  Thanks, IE!
  var length = 0;
  var i;
  var isSysexMessage = false;

  // Jazz sometimes passes us multiple messages at once, so we need to parse them out
  // and pass them one at a time.

  for (i=0; i<data.length; i+=length) {
    var isValidMessage = true;
    if (this._inLongSysexMessage) {
      i = this.bufferLongSysex(data,i);
      if ( data[i-1] != 0xf7 ) {
        // ran off the end without hitting the end of the sysex message
        return;
      }
      isSysexMessage = true;
    } else {
      isSysexMessage = false;
      switch (data[i] & 0xF0) {
        case 0x00:  // Chew up spurious 0x00 bytes.  Fixes a Windows problem.
          length=1;
          isValidMessage = false;
          break;

        case 0x80:  // note off
        case 0x90:  // note on
        case 0xA0:  // polyphonic aftertouch
        case 0xB0:  // control change
        case 0xE0:  // channel mode
          length = 3;
          break;

        case 0xC0:  // program change
        case 0xD0:  // channel aftertouch
          length = 2;
          break;

        case 0xF0:
          switch (data[i]) {
            case 0xf0:  // variable-length sysex.
              i = this.bufferLongSysex(data,i);
              if ( data[i-1] != 0xf7 ) {
                // ran off the end without hitting the end of the sysex message
                return;
              }
              isSysexMessage = true;
              break;

            case 0xF1:  // MTC quarter frame
            case 0xF3:  // song select
              length = 2;
              break;

            case 0xF2:  // song position pointer
              length = 3;
              break;

            default:
              length = 1;
              break;
          }
          break;
      }
    }
    if (!isValidMessage)
      continue;
    var evt = {};
    if (!inNodeJs) {
      evt = document.createEvent( 'Event' );
      evt.initEvent( 'midimessage', false, false );
    }
    evt.receivedTime = parseFloat( timestamp.toString()) + this._jazzInstance._perfTimeZero;
    if (isSysexMessage || this._inLongSysexMessage) {
      evt.data = new Uint8Array( this._sysexBuffer );
      this._sysexBuffer = new Uint8Array(0);
      this._inLongSysexMessage = false;
    } else
      evt.data = new Uint8Array(data.slice(i, length+i));

    if (inNodeJs) {
      if (this.onmidimessage) this.onmidimessage( evt );
    }
    else this.dispatchEvent( evt );
  }
};