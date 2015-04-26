'use strict';

import {getDevice, generateUUID} from './util';

export class MIDIOutput{
  constructor(info, instance){
    this.id = generateUUID();
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
    if(getDevice().platform === 'linux'){
      this._jazzInstance.MidiOutOpen(this.name);
    }
  }

  open(){
    if(this.connection === 'open'){
      return;
    }
    if(getDevice().platform !== 'linux'){
      this._jazzInstance.MidiOutOpen(this.name);
    }
    this.connection = 'open';
  }

  close(){
    if(this.connection === 'closed'){
      return;
    }
    if(getDevice().platform !== 'linux'){
      this._jazzInstance.MidiOutClose(this.name);
    }
    this.connection = 'closed';
  }

  send(data, timestamp){
    let delayBeforeSend = 0;

    if(data.length === 0){
      return false;
    }

    if(timestamp){
      delayBeforeSend = Math.floor(timestamp - window.performance.now());
    }

    if(timestamp && (delayBeforeSend > 1)){
      window.setTimeout(() => {
        this._jazzInstance.MidiOutLong(data);
      }, delayBeforeSend);
    }else{
      this._jazzInstance.MidiOutLong(data);
    }
    return true;
  }

  dispatchEvent(evt){

  }
}