window.onload = function(){

  'use strict';

  window.navigator.requestMIDIAccess().then(
    function(i){
      console.log(i);
    },
    function(e){
      console.error(e);
    }
  );
};
