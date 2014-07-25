"use strict";

var cluster = require('cluster'),
    fs = require('fs'),
    zmq = require('zmq');

if (cluster.isMaster) {
    // Master process - create ROUTER and DEALER socket endpoints
    var router = zmq.socket('router').bind('tcp://127.0.0.1:5433');
    var dealer = zmq.socket('dealer').bind('ipc://filer-dealer.ipc');

    // Forward messages between router and dealer
    router.on('message', function() {
	// Note: arguments is JavaScript array passed into any JavaScript
	// function, containing a variable-length list of arguments.
	var frames = Array.prototype.slice.call(arguments);

	dealer.send(frames);
    });

    dealer.on('message', function() {
	var frames = Array.prototype.slice.call(arguments);
	router.send(frames);
    });

    // Listen for workers to come alive
    cluster.on('online', function(worker) {
	console.log('Worker: ' + worker.process.pid + ' is online.');
    });

    // Fork three worker processes
    for (var i = 0; i < 3; i++) {
	cluster.fork();
    }
}
else {
    // This is a worker process. Create REP socket and connect to DEALER
    var responder = zmq.socket('rep').connect('ipc://filer-dealer.ipc');

    responder.on('message', function(data) {
	// Parse incoming message
	var request = JSON.parse(data);
	console.log(process.pid + ' received request for: ' + request.path);

	// Read file and reply with content
	fs.readFile(request.path, function(err, data) {
	    console.log(process.pid + ' sending response');
	    
	    responder.send(JSON.stringify({
		pid: process.pid,
		data: data.toString(),
		timestamp: Date.now()
	    }));
	});
    });
}

