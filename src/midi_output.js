'use strict';

let midiOutputIndex = 0;

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

    this._jazzInstance = instance.jazz;
    this._jazzInstanceId = instance.jazz.id;
    this._jazzInstance.outputInUse = true;
  }

  open(){
    this._jazzInstance.MidiOutOpen(this.name);
    this.state = 'open';
  }

  close(){
    this._jazzInstance.MidiOutClose(this.name);
    this.state = 'closed';
  }
}