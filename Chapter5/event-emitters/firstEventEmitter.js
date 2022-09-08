const { EventEmitter } = require("events");

const firstEmitter = new EventEmitter();

firstEmitter.emit("My First event");