/*
  Simple test that just prints all connected MIDI devices
*/

window.onload = function(){

  'use strict';

  var div = document.getElementById('container');

  if(navigator.requestMIDIAccess !== undefined){
    navigator.requestMIDIAccess().then(
      function onFulfilled(midiAccess){
        showMIDIPorts(midiAccess);
      },
      function onRejected(e){
        // something went wrong while requesting the MIDI devices
        div.innerHTML = e.message;
      }
    );
  }else{
    // browsers without WebMIDI API and Jazz plugin
    div.innerHTML = 'No access to MIDI devices: browser does not support WebMIDI API, please use the WebMIDIAPIShim together with the Jazz plugin';
  }


  function showMIDIPorts(midiAccess){
    var
      inputs = midiAccess.inputs,
      outputs = midiAccess.outputs,
      html;

    html = '<h4>midi inputs:</h4>';
    inputs.forEach(function(port){
      html += port.name + '<br>';
      html += '<span class="small">manufacturer: ' + port.manufacturer + '</span><br>';
      html += '<span class="small">version: ' + port.version + '</span><br><br>';
    });

    html += '<h4>midi outputs:</h4>';
    outputs.forEach(function(port){
      html += port.name + '<br>';
      html += '<span class="small">manufacturer: ' + port.manufacturer + '</span><br>';
      html += '<span class="small">version: ' + port.version + '</span><br><br>';
    });

    div.innerHTML = html;
  }
};