'use strict';


export class MIDIOutput{
  constructor(info, instance){
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

    this._jazzInstance = instance;
    this._jazzInstance.outputInUse = true;
    this._jazzInstance.MidiOutOpen(this.name);
  }

  open(){
    //this._jazzInstance.MidiOutOpen(this.name);
    this.state = 'open';
  }

  close(){
    //this._jazzInstance.MidiOutClose(this.name);
    this.state = 'closed';
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
}