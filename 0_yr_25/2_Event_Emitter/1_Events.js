const EventEmitter = require("./2_Event_Emitter");

class Emitter extends EventEmitter { }

const myE = new Emitter();

myE.on("foo", () => {
    console.log("An Event Occurred 1")
})

myE.on("foo", () => {
    console.log("An Event Occurred 2")
})

myE.on("foo", (x) => {
    console.log("An Event with a parameter occurred:");
    console.log(x);
});

myE.on("bar", () => {
    console.log("An Event Occurred For Bar")
})

myE.once("jar", () => {
    console.log("An Event Occurred For Jar")
})

myE.emit("foo");
myE.emit("foo", "Hello");
myE.emit("bar");
myE.emit("bar");
myE.emit("bar");
myE.emit("bar");
myE.emit("jar");
myE.emit("jar");