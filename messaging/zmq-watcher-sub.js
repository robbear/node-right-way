"use strict";

//
// Simple watcher subscriber using 0MQ
//

var zmq = require('zmq');

// Create subscriber endpoint
var subscriber = zmq.socket('sub');

// Subscribe to all messages
subscriber.subscribe("");

// Handle messages from publisher
subscriber.on('message', function(data) {
    var message = JSON.parse(data);
    var date = new Date(message.timestamp);
    console.log("File '" + message.file + "' changed at " + date);
});

// Connect to publisher
subscriber.connect("tcp://localhost:5432");
