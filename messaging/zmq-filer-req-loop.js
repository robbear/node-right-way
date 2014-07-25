"use strict";

//
// Request portion of request/reply (REQ/REP) 0MQ app.
// Note that a given requester/responder will be aware
// of only one message at a time. For parallel message
// processing, look to ROUTER/DEALER sockets.
// This version uses a loop to demonstrate the issue.
//

var zmq = require('zmq');

var filename = process.argv[2];

// Create request endpoint
var requester = zmq.socket('req');

// Handle replies from responder
requester.on('message', function(data) {
    var response = JSON.parse(data);
    console.log('Received response: ', response);
});

requester.connect('tcp://localhost:5433');

// Send request for content
for (var i = 0; i < 3; i++) {
    console.log('Sending request ' + i + ' for: ' + filename);
    requester.send(JSON.stringify({
	path: filename
    }));
}
