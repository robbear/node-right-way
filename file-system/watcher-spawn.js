"use strict"

//
// Watch for change to specified file. Spawn child process
// and pipe output to stdout.
//

var fs = require('fs'),
    childProcess = require('child_process'),
    filename = process.argv[2];

if (!filename) {
    throw Error("A file to watch must be specified");
}

fs.watch(filename, function() {
    var ls = childProcess.spawn('ls', ['-lh', filename]);
    ls.stdout.pipe(process.stdout);
});

console.log("Now watching " + filename + " for changes...");
