"use strict";

//
// Network server that takes Unix socket connections and
// informs them of changes to a file.
//
// Connect via 'nc -U /tmp/watcher.sock'
//

var fs = require('fs'),
    net = require('net');

var filename = process.argv[2];

var server = net.createServer(function(connection) {
    // Reporting
    console.log("Subscriber connected.");

    connection.write("Now watching '" + filename + "' for changes... \n");

    var watcher = fs.watch(filename, function() {
	console.log("File changed, so notifying the subscribing connection.");
	connection.write("File '" + filename + "' changed: " + Date.now() + "\n");
    });

    // Cleanup
    connection.on('close', function() {
	console.log("Subscriber disconnected");
	watcher.close();
    });
});

if (!filename) {
    throw Error('No target filename was specified');
}

// Start the Unix socket server
server.listen('/tmp/watcher.sock', function() {
    console.log("Listening for local machine subscribers. Connect with 'nc -U /tmp/watcher.sock'");
});
