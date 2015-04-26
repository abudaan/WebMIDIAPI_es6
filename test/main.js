window.onload = function(){

  'use strict';

  var
    divLog = document.getElementById('log'),
    divInputs = document.getElementById('inputs'),
    divOutputs = document.getElementById('outputs'),
    MIDIAccess,
    activeInputs = {},
    activeOutputs = {};


  if(navigator.requestMIDIAccess !== undefined){
    navigator.requestMIDIAccess().then(

      function onFulfilled(access, options){
        MIDIAccess = access;

        MIDIAccess.onstatechange = function(e){
          var port = e.port;
          var div = port.type === 'input' ? divInputs : divOutputs;
          var checkbox = document.getElementById(port.id);
          var label;

          if(port.state === 'disconnected'){
            label = checkbox.parentNode;
            div.removeChild(label.nextSibling);
            div.removeChild(label);
            delete activeInputs[port.id];
            delete activeOutputs[port.id];
          }else if(checkbox === null){
            label = document.createElement('label');
            label.innerHTML = '<input type="checkbox" id="' + port.id + '">' + port.name + ' (' + port.state + ', ' +  port.connection + ')';
            div.appendChild(label);
            div.appendChild(document.createElement('br'));
          }else{
            label = checkbox.parentNode;
            checkbox.nextSibling.nodeValue = port.name + ' (' + port.state + ', ' +  port.connection + ')';
          }
        };

        showMIDIPorts();
       },

      function onRejected(e){
        divInputs.innerHTML = 'No access to MIDI devices:' + e;
        divOutputs.innerHTML = '';
      }
    );
  }

  // browsers without WebMIDI API or Jazz plugin
  else{
    divInputs.innerHTML = 'No access to MIDI devices';
    divOutputs.innerHTML = '';
  }


  function checkboxMIDIInListener(){

  }

  function checkboxMIDIOutListener(){

  }



  function showMIDIPorts(){
    var
      html,
      checkbox,
      checkboxes,
      inputs, outputs,
      i, maxi, id, port;

    inputs = MIDIAccess.inputs;
    html = '<h4>midi inputs:</h4>';
    inputs.forEach(function(port){
      html += '<label><input type="checkbox" id="' + port.id + '">' + port.name + ' (' + port.state + ', ' +  port.connection + ')</label><br>';
    });
    divInputs.innerHTML = html;


    outputs = MIDIAccess.outputs;
    html = '<h4>midi outputs:</h4>';
    outputs.forEach(function(port){
      html += '<label><input type="checkbox" id="' + port.id + '">' + port.name + ' (' + port.state + ', ' +  port.connection + ')</label><br>';
    });
    divOutputs.innerHTML = html;


    checkboxes = document.querySelectorAll('#inputs input[type="checkbox"]');

    for(i = 0, maxi = checkboxes.length; i < maxi; i++){
      checkbox = checkboxes[i];
      checkbox.addEventListener('change', function(){
        // get port by id
        id = this.id;
        port = inputs.get(id);
        if(this.checked === true){
          activeInputs[id] = port;
          // implicitly open port by adding a listener
          //port.onmidimessage = inputListener;
          port.addEventListener('midimessage', function(e){
            inputListener(e);
            //console.log('addEventListener', e);
          });
          port.addEventListener('statechange', function(e){
            console.log('MIDIPort', e.port);
          });
          port.open();
        }else{
          delete activeInputs[id];
          port.close();
        }
        //console.log(activeInputs);
      }, false);
    }


    checkboxes = document.querySelectorAll('#outputs input[type="checkbox"]');

    for(i = 0, maxi = checkboxes.length; i < maxi; i++){
      checkbox = checkboxes[i];
      checkbox.addEventListener('change', function(){
        // get port by id
        id = this.id;
        port = outputs.get(id);
        if(this.checked === true){
          activeOutputs[id] = port;
          port.open();
        }else{
          delete activeOutputs[id];
          port.close();
        }
      }, false);
    }
  }


  function inputListener(midimessageEvent){
    var port, portId,
      data = midimessageEvent.data,
      type = data[0],
      data1 = data[1],
      data2 = data[2];

    // do something graphical with the incoming midi data
    divLog.innerHTML = type + ' ' + data1 + ' ' + data2 + '<br>' + divLog.innerHTML;

    for(portId in activeOutputs){
      if(activeOutputs.hasOwnProperty(portId)){
        port = activeOutputs[portId];
        port.send(data);
      }
    }
  }

};