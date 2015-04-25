'use strict';

// required by babelify for transpiling es6
require('babelify/polyfill');

import {createMIDIAccess, closeAllMIDIInputs} from './midi_access';
import {polyfillPerformance, inNodeJs} from './util';

let midiAccess;

(function(){
  if(!window.navigator.requestMIDIAccess){
    polyfillPerformance();
    window.navigator.requestMIDIAccess = function(){
      if(midiAccess === undefined){
          midiAccess = createMIDIAccess();
      }
      return midiAccess;
    };
    if(inNodeJs){
      window.navigator.close = function(){
        // Need to close MIDI input ports, otherwise Node.js will wait for MIDI input forever.
        closeAllMIDIInputs();
      };
    }
  }
}());