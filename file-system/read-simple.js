"use strict"

//
// Read the full contents of a file into memory
//

var fs = require('fs');

fs.readFile('target.txt', function(err, data) {
    if (err) {
	throw err;
    }

    console.log(data.toString());
});

