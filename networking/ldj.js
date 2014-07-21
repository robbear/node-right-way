"use strict";

//
// Module to define LDJClient - a client for
// handling JSON protocol messages
//

var events = require('events'),
    util = require('util');

//
// LDJClient constructor. Note that
// the stream parameter is an object that
// emits 'data' events.
//
var LDJClient = function(stream) {
    // The following is equivalent to calling super()
    events.EventEmitter.call(this);

    var self = this;
    var buffer = '';

    stream.on('data', function(data) {
	buffer += data;
	// Parse messages with boundary of '\n'
	var boundary = buffer.indexOf('\n');
	while (boundary !== -1) {
	    var input = buffer.substr(0, boundary);
	    buffer = buffer.substr(boundary + 1);

	    // Fire the event
	    self.emit('message', JSON.parse(input));

	    boundary = buffer.indexOf('\n');
	}
    });
};

//
// Establish LDJClient as a subclass of EventEmitter.
// Makes LDJClient's prototypal parent object
// the EventEmitter prototype.
//
util.inherits(LDJClient, events.EventEmitter);

//
// Expose module methods
//

exports.LDJClient = LDJClient;
exports.connect = function(stream) {
    return new LDJClient(stream);
};
