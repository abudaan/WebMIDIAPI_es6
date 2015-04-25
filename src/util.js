'use strict';

// check if the shim is running in nodejs
export const inNodeJs = (typeof __dirname !== 'undefined' && window.jazzMidi);



export function polyfillPerformance(){
  if('performance' in window === false) {
    let nowOffset = Date.now();
    window.performance = {
      now: function now(){
        return Date.now() - nowOffset;
      }
    };
  }
}


/*

// Polyfill window.performance.now() if necessary.
export function polyfillPerformance(exports) {

  var perf = {}, props;

  function findAlt(){
    let prefix = ['moz', 'webkit', 'o', 'ms'],
    i = prefix.length,
    //worst case, we use Date.now()
    props = {
      value: (function (start) {
        return function () {
          return Date.now() - start;
        };
      }(Date.now()))
    };

    //seach for vendor prefixed version
    for (; i >= 0; i--) {
      let methodName = prefix[i] + 'Now';
      if(exports.performance[methodName] !== undefined){
        props.value = (function(method){
          return function(){
            exports.performance[method]();
          };
        }(methodName));
        return props;
      }
    }

    //otherwise, try to use connectionStart
    if(exports.performance.timing !== undefined && exports.performance.timing.connectStart !== undefined){
      //this pretty much approximates performance.now() to the millisecond
      props.value = (function (start) {
        return function() {
          Date.now() - start;
        };
      }(exports.performance.timing.connectStart));
    }
    return props;
  }

  //if already defined, bail
  if(exports.performance !== undefined && exports.performance.now !== undefined){
    return;
  }

  if(exports.performance === undefined){
    Object.defineProperty(exports, 'performance', {
      get: function () {
        return perf;
      }
    });
  }

  //otherwise, performance is there, but not 'now()'
  props = findAlt();
  Object.defineProperty(exports.performance, 'now', props);
}
*/