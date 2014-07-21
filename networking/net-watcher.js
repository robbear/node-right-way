"use strict";

//
// Network server that takes TCP socket connections and
// informs them of changes to a file.
//
// Connect client via 'telnet localhost 5432'
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

server.listen(5432, function() {
    console.log("Listening for TCP subscribers...");
});
