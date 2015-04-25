'use strict';

const jazzPluginInitTime = 100; // milliseconds
const inNodeJs = (typeof __dirname !== 'undefined' && window.jazzMidi);

let jazzInstanceNumber = 0;
let jazzInstances = new Map();

export function createJazzInstance(callback){

  let instance = {
    inputInUse: false,
    outputInUse: false,
    jazz: undefined,
    id: jazzInstanceNumber++ + '' + Date.now()
  };

  let objRef, activeX;

  if(inNodeJs === true){
    objRef = new window.jazzMidi.MIDI();
  }else{
    let o1 = document.createElement('object');
    o1.id = '_Jazz' + instance.id + 'ie';
    o1.classid = 'CLSID:1ACE1618-1C7D-4561-AEE1-34842AA85E90';
    activeX = o1;

    let o2 = document.createElement('object');
    o2.id = '_Jazz' + instance.id;
    o2.type='audio/x-jazz';
    o1.appendChild(o2);
    objRef = o2;

    let e = document.createElement('p');
    e.appendChild(document.createTextNode('This page requires the '));

    let a = document.createElement('a');
    a.appendChild(document.createTextNode('Jazz plugin'));
    a.href = 'http://jazz-soft.net/';

    e.appendChild(a);
    e.appendChild(document.createTextNode('.'));
    o2.appendChild(e);

    let insertionPoint = document.getElementById('MIDIPlugin');
    if(!insertionPoint) {
      // Create hidden element
      insertionPoint = document.createElement('div');
      insertionPoint.id = 'MIDIPlugin';
      insertionPoint.style.position = 'absolute';
      insertionPoint.style.visibility = 'hidden';
      insertionPoint.style.left = '-9999px';
      insertionPoint.style.top = '-9999px';
      document.body.appendChild(insertionPoint);
    }
    insertionPoint.appendChild(o1);
  }


  setTimeout(function(){
    if(objRef.isJazz === true){
      instance.jazz = objRef;
    }else if(activeX.isJazz === true){
      instance.jazz = activeX;
    }
    if(instance.jazz !== undefined){
      jazzInstances.set(instance.id, instance);
      instance.jazz._perfTimeZero = window.performance.now();
    }
    callback(instance);
  }, jazzPluginInitTime);
}


export function getJazzInstance(type, callback){
  let instance = null;
  let key = type === 'input' ? 'inputInUse' : 'outputInUse';

  for(instance of jazzInstances.values()){
    if(instance[key] === false){
        break;
    }
  }

  if(instance === null){
    createJazzInstance(callback);
  }else{
    callback(instance);
  }
}
