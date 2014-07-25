"use strict";

//
// Simple watcher publisher using 0MQ
//

var fs = require('fs'),
    zmq = require('zmq');

var publisher = zmq.socket('pub');
var filename = process.argv[2];

fs.watch(filename, function() {
    // Send message to any subscribers
    publisher.send(JSON.stringify({
	type: 'changed',
	file: filename,
	timestamp: Date.now()
    }));
});

// Listen on TCP port 5432
publisher.bind('tcp://*:5432', function(err) {
    console.log('Listening for zmq subscribers...');
});
