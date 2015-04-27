# Web MIDI API Polyfill

This JS library is a prototype polyfill and shim for the [Web MIDI API](http://webaudio.github.io/web-midi-api/) (of which Chris is a co-author), using [Jazz-Soft.net's Jazz-Plugin](http://jazz-soft.net/) to enable MIDI support on Windows, OSX and Linux.
You need to have [version 1.2 or higher](http://jazz-soft.net/download/Jazz-Plugin) of the Jazz-Plugin in order for this polyfill to work properly. This polyfill and the plugin should work on Chrome, Firefox, Safari, Opera and Internet Explorer 10 and 11.

This polyfill was originally designed to test usability of the API itself, but it's also useful to enable MIDI scenarios in browsers that don't yet support Web MIDI.

This polyfill now supports multiple simultaneous inputs and outputs, and sending and receiving long messages (sysem exclusive). It also properly dispatches events. Timestamps on send and receive should be properly implemented now, although of course timing will not be very precise on either.

##Usage

1. Copy the files WebMIDIAPIShim.js and WebMIDIAPIShim.js.map from /build/ into your project.
2. Add "&lt;script src='/your/path/WebMIDIAPIShim.js'>&lt;/script>" to your code.

You can use the Web MIDI API as captured in the specification - the polyfill will automatically check to see if the Web MIDI API is already implemented, and if not it will insert itself.

So, some sample usage:

    var m = null; // m = MIDIAccess object for you to make calls on
    navigator.requestMIDIAccess().then( onsuccesscallback, onerrorcallback );

    function onsuccesscallback( access ) {
      m = access;

      // Things you can do with the MIDIAccess object:
      var inputs = m.inputs; // inputs = MIDIInputMaps, you can retrieve the inputs with iterators
      var outputs = m.outputs; // outputs = MIDIOutputMaps, you can retrieve the outputs with iterators

      var iteratorInputs = inputs.values() // returns an iterator that loops over all inputs
      var input = iteratorInputs.next().value // get the first input

      input.onmidimessage = myMIDIMessagehandler; // onmidimessage( event ), event.data & event.receivedTime are populated

      var iteratorOutputs = outputs.values() // returns an iterator that loops over all outputs
      var output = iteratorOutputs.next().value; // grab first output device

      output.send( [ 0x90, 0x45, 0x7f ] ); // full velocity note on A4 on channel zero
      output.send( [ 0x80, 0x45, 0x7f ], window.performance.now() + 1000 ); // full velocity A4 note off in one second.
    };

    function onerrorcallback( err ) {
      console.log( "uh-oh! Something went wrong! Error code: " + err.code );
    }


##Examples

- [test1](http://abudaan.github.io/WebMIDIAPIShim_es6/tests/test1)
- [test2a](http://abudaan.github.io/WebMIDIAPIShim_es6/tests/test2a)
- [test2b](http://abudaan.github.io/WebMIDIAPIShim_es6/tests/test2b)


## Dependencies
The project has 2 dependencies:

* [Node.js](http://nodejs.org/)
* [npm](https://www.npmjs.org/)


## Installing
Install the project dependencies using:

    npm install

This will install a.o. browserify and babelify.


## Commands
All code is written in es6 so you need to transpile the javascript code before it can run in a browser.

Start watchify and transpile code as soon as a file has changed:

    npm run watch

Transpile and build the code with a separate sourcemap:

    npm run build
