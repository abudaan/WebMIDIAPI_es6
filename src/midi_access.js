'use strict';

import {createJazzInstance, getJazzInstance} from './jazz';
//import {MIDIInput} from './midi_input';
//import {MIDIOutput} from './midi_output';


const inNodeJs = (typeof __dirname !== 'undefined' && window.jazzMidi);

let jazzInstance;
let inputsMap = new Map();
let outputsMap = new Map();
let allMidiIns = []; // for nodejs;

export function createMIDIAccess(){

  return new Promise(function executor(resolve, reject){

    createJazzInstance(function(instance){
      if(instance === undefined){
        reject({code: 1});
        return;
      }

      jazzInstance = instance.jazz;

      createMIDIPorts(function(){
        setupListeners();
        resolve({
          inputs: inputsMap,
          outputs: outputsMap,
          sysexEnabled: true
        });
      });
    });

  });
}

function createMIDIPorts(callback){
  let inputs = jazzInstance.MidiInList();
  let outputs = jazzInstance.MidiOutList();
  let numInputs = inputs.length;
  let numOutputs = outputs.length;
  createMIDIPort(0, numInputs, 'input', inputs, function(){
    createMIDIPort(0, numOutputs, 'output', outputs, callback);
  });
}


function createMIDIPort(index, max, type, list, callback){
  if(index < max){
    getJazzInstance(type, function(instance){
      let name = list[index];
      let port;
      let info = [name, '', ''];
      if(type === 'input'){
        if(jazzInstance.Support('MidiInInfo')){
          info = jazzInstance.MidiInInfo(name);
        }
        //port = new MIDIInput(info, instance);
        //inputsMap.set(name, port);
        if(inNodeJs){
          allMidiIns.push(this._jazzInstance);
        }
      }else if(type === 'output'){
        if(jazzInstance.Support('MidiOutInfo')){
          info = jazzInstance.MidiOutInfo(name);
        }
        //port = new MIDIOutput(info, instance);
        //outputsMap.set(name, port);
      }
      index++;
      createMIDIPort(index, max, type, list, callback);
    });
  }else{
    callback();
  }
}


function setupListeners(){
  jazzInstance.OnDisconnectMidiIn(function(name){
    // let port = inputsMap.get(name);
    // port.close();
    // port._jazzInstance.inputInUse = false;
    // inputsMap.delete(name);
  });

  jazzInstance.OnDisconnectMidiOut(function(name){
    // var port = _inputsByName[name];
    // port._jazzInstance.outputInUse = false;
    // delete _outputsByName[name];
  });

  jazzInstance.OnConnectMidiIn(function(name){
  });

  jazzInstance.OnConnectMidiOut(function(name){
  });
}


