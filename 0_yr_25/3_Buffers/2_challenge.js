const { Buffer } = require('buffer')

const buffer = Buffer.alloc(3)
buffer[0] = 0x48
buffer[1] = 0x69
buffer[2] = 0x21

console.log(buffer)
console.log(buffer[0])
console.log(buffer[1])
console.log(buffer[2])

const tal = Buffer.from([0x48, 0x69, 0x21]);
console.log(tal.toString("utf-8"))