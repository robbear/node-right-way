"use strict"

//
// Watch for change to specified file. Parse output for
// display, using EventEmitter callbacks.
//

var fs = require('fs'),
    childProcess = require('child_process'),
    filename = process.argv[2];

if (!filename) {
    throw Error("A file to watch must be specified");
}

var output = '';

fs.watch(filename, function() {
    var ls = childProcess.spawn('ls', ['-lh', filename]);

    ls.stdout.on('data', function(chunk) {
	output += chunk.toString();
    });

    ls.on('close', function() {
	// Split on one or more whitespaces (/\s+/)
	// Permissions, size, filename
	var parts = output.split(/\s+/);
	console.dir([parts[0], parts[4], parts[8]]);
    });
});

console.log("Now watching " + filename + " for changes...");
