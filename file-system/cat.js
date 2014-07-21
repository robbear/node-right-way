"use strict"

//
// Read a streamed file and output to stdout
//

var fs = require('fs');

var stream = fs.createReadStream(process.argv[2]);

stream.on('data', function(chunk) {
    process.stdout.write(chunk);
});

//
// Stick an extra line feed at process exit
// in case input file doesn't have one. Keeps
// the shell prompt free from the output text.
//
process.on('exit', function() {
    process.stdout.write("\n");
});

stream.on('error', function(err) {
    process.stderr.write("ERROR: " + err.message + "\n");
});
