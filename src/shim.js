/*
  Top entry point
*/

'use strict';

import {createMIDIAccess, closeAllMIDIInputs} from './midi_access';
import {polyfill, getDevice} from './util';

let midiAccess;

(function(){
  if(!window.navigator.requestMIDIAccess){
    polyfill();
    window.navigator.requestMIDIAccess = function(){
      // singleton-ish, no need to create multiple instances of MIDIAccess
      if(midiAccess === undefined){
          midiAccess = createMIDIAccess();
      }
      return midiAccess;
    };
    if(getDevice().nodejs === true){
      window.navigator.close = function(){
        // Need to close MIDI input ports, otherwise Node.js will wait for MIDI input forever.
        closeAllMIDIInputs();
      };
    }
  }
}());
