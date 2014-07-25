"use strict";

//
// Reply portion of request/reply (REQ/REP) 0MQ app.
// Note that a given requester/responder will be aware
// of only one message at a time. For parallel message
// processing, look to ROUTER/DEALER sockets.
//

var fs = require('fs'),
    zmq = require('zmq');

// Socket to reply to client requests
var responder = zmq.socket('rep');

// Handle incoming requests
responder.on('message', function(data) {
    // Parse incoming message
    var request = JSON.parse(data);
    console.log('Received request to get: ' + request.path);

    // Read file and reply with content
    fs.readFile(request.path, function(err, content) {
	console.log('Sending response content');

	// Note: Until responder.send is called, we don't
	// take any other requests. This means Node spins
	// during the readFile call. Not scalable!
	responder.send(JSON.stringify({
	    content: content.toString(),
	    timestamp: Date.now(),
	    pid: process.pid
	}));
    });
});

// Listen on TCP port 5433
responder.bind('tcp://127.0.0.1:5433', function(err) {
    console.log('Listening for zmq requesters...');
});

// Close the responder when the Node process ends
process.on('SIGINT', function() {
    console.log('Shutting down...');
    responder.close();
});
