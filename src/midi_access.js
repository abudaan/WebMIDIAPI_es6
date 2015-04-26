'use strict';

import {createJazzInstance, getJazzInstance} from './jazz';
import {MIDIInput} from './midi_input';
import {MIDIOutput} from './midi_output';
import {MIDIConnectionEvent} from './midiconnection_event';


let midiAccess;
let jazzInstance;
let inputsMap = new Map();
let outputsMap = new Map();
let listeners = new Set();


class MIDIAccess{
  constructor(inputsMap, outputsMap){
    this.sysexEnabled = true;
    this.inputs = inputsMap;
    this.outputs = outputsMap;
  }
}

export function createMIDIAccess(){

  return new Promise(function executor(resolve, reject){

    createJazzInstance(function(instance){
      if(instance === undefined){
        reject({code: 1});
        return;
      }

      jazzInstance = instance;

      createMIDIPorts(function(){
        setupListeners();
        midiAccess = new MIDIAccess(inputsMap, outputsMap);
        resolve(midiAccess);
      });
    });

  });
}

function createMIDIPorts(callback){
  let inputs = jazzInstance.MidiInList();
  let outputs = jazzInstance.MidiOutList();
  let numInputs = inputs.length;
  let numOutputs = outputs.length;

  loopCreateMIDIPort(0, numInputs, 'input', inputs, function(){
    loopCreateMIDIPort(0, numOutputs, 'output', outputs, callback);
  });
}


function loopCreateMIDIPort(index, max, type, list, callback){
  if(index < max){
    let name = list[index++];
    createMIDIPort(type, name, function(){
      loopCreateMIDIPort(index, max, type, list, callback);
    });
  }else{
    callback();
  }
}


function createMIDIPort(type, name, callback){
  getJazzInstance(type, function(instance){
    let port;
    let info = [name, '', ''];
    if(type === 'input'){
      if(instance.Support('MidiInInfo')){
        info = instance.MidiInInfo(name);
      }
      port = new MIDIInput(info, instance);
      inputsMap.set(port.id, port);
    }else if(type === 'output'){
      if(instance.Support('MidiOutInfo')){
        info = instance.MidiOutInfo(name);
      }
      port = new MIDIOutput(info, instance);
      outputsMap.set(port.id, port);
    }
    callback(port);
  });
}


function getPortByName(ports, name){
  let port;
  for(port of ports.values()){
    if(port.name === name){
      break;
    }
  }
  return port;
}


function setupListeners(){
  jazzInstance.OnDisconnectMidiIn(function(name){
    let port = getPortByName(inputsMap, name);
    if(port !== undefined){
      port.close();
      port._jazzInstance.inputInUse = false;
      inputsMap.delete(port.id);
      dispatchEvent(port);
    }
  });

  jazzInstance.OnDisconnectMidiOut(function(name){
    let port = getPortByName(outputsMap, name);
    if(port !== undefined){
      port.close();
      port._jazzInstance.outputInUse = false;
      outputsMap.delete(port.id);
      dispatchEvent(port);
    }
  });

  jazzInstance.OnConnectMidiIn(function(name){
    createMIDIPort('input', name, function(port){
      dispatchEvent(port);
    });
  });

  jazzInstance.OnConnectMidiOut(function(name){
    createMIDIPort('output', name, function(port){
      dispatchEvent(port);
    });
  });
}


function addEventListener(type, listener, useCapture){
  if(type !== 'statechange'){
    return;
  }
  if(listeners.has(listener) === false){
    listeners.set(listener);
  }
}


function removeEventListener(type, listener, useCapture){
  if(type !== 'statechange'){
    return;
  }
  if(listeners.has(listener) === true){
    listeners.delete(listener);
  }
}


export function dispatchEvent(port){

  port.dispatchEvent(new MIDIConnectionEvent(port, port));

  let evt = new MIDIConnectionEvent(midiAccess, port);

  if(typeof midiAccess.onstatechange === 'function'){
    midiAccess.onstatechange(evt);
  }
  for(let listener of listeners){
    listener(evt);
  }
}


export function closeAllMIDIInputs(){
  inputsMap.forEach(function(input){
    //input.close();
    input._jazzInstance.MidiInClose();
  });
}

