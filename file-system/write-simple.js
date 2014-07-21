"use strict"

//
// Write the memory to file without buffering
//

var fs = require('fs');

fs.writeFile('target.txt', 'Hello, you funky file!', function(err) {
    if (err) {
	throw err;
    }

    console.log('File saved!');
});
