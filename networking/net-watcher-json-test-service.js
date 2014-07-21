"use strict";

//
// Test server to stress client's handling of JSON messages
//

var net = require('net');

var server = net.createServer(function(connection) {
    console.log('Subscriber connected');

    // Send the first chunk immediately
    connection.write('{"type":"changed","file":"targ');

    // After a delay of one second, send the other chunk
    var timer = setTimeout(function() {
	connection.write('et.txt","timestamp":1358175758495}' + "\n");

	// Force end the connection. This will cause the client to exit.
	connection.end();
    }, 1000);

    // Clear the timer when the connection ends
    connection.on('end', function() {
	clearTimeout(timer);
	console.log("Subscriber disconnected");
    });
});

server.listen(5432, function() {
    console.log("Test server listening for subscribers...");
});
