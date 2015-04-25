'use strict';

// required by babelify for transpiling es6
require('babelify/polyfill');

import {createMIDIAccess} from './midi_access';

let midiAccess;

(function(){
  if(!window.navigator.requestMIDIAccess){
    window.navigator.requestMIDIAccess = function(){
      if(midiAccess === undefined){
          midiAccess = createMIDIAccess();
      }
      return midiAccess;
    };
    if(typeof __dirname !== 'undefined' && window.jazzMidi) {
      window.navigator.close = function() {
        // Need to close MIDI input ports, otherwise Node.js will wait for MIDI input forever.
        // for(var i in allMidiIns){
        //   allMidiIns[i].MidiInClose();
        // }
      };
    }
  }
}());

export default {};