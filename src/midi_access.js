'use strict';

import {createJazzInstance, getJazzInstance} from './jazz';
import {MIDIInput} from './midi_input';
import {MIDIOutput} from './midi_output';

let jazzInstance;
let inputsMap = new Map();
let outputsMap = new Map();
let midiAccess = {
  sysexEnabled: true
};

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
        midiAccess.inputs = inputsMap;
        midiAccess.outputs = outputsMap;
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
      inputsMap.set(name, port);
    }else if(type === 'output'){
      if(instance.Support('MidiOutInfo')){
        info = instance.MidiOutInfo(name);
      }
      port = new MIDIOutput(info, instance);
      outputsMap.set(name, port);
    }
    callback();
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
      inputsMap.delete(name);
      if(midiAccess.onstatechange){
        midiAccess.onstatechange();
      }
    }
  });

  jazzInstance.OnDisconnectMidiOut(function(name){
    let port = getPortByName(outputsMap, name);
    if(port !== undefined){
      port.close();
      port._jazzInstance.outputInUse = false;
      outputsMap.delete(name);
      if(midiAccess.onstatechange){
        midiAccess.onstatechange();
      }
    }
  });

  jazzInstance.OnConnectMidiIn(function(name){
    createMIDIPort('input', name, function(){
      if(midiAccess.onstatechange){
        midiAccess.onstatechange();
      }
    });
  });

  jazzInstance.OnConnectMidiOut(function(name){
    createMIDIPort('output', name, function(){
      if(midiAccess.onstatechange){
        midiAccess.onstatechange();
      }
    });
  });
}


export function closeAllMIDIInputs(){
  inputsMap.forEach(function(input){
    //input.close();
    input._jazzInstance.MidiInClose();
  });
}

