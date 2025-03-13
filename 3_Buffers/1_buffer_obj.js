const { Buffer } = require('buffer')

const memoryContainer = Buffer.alloc(4); //4 Bytes (32bit)

console.log(memoryContainer)

memoryContainer[0] = 0xf4; //f4 = 244
memoryContainer[1] = 0x5b; //5b = 91
memoryContainer[2] = 0x6f; //6f = 111
memoryContainer[3] = 0x7b; //7b = 123
console.log(memoryContainer[0]);
console.log(memoryContainer[1]);
console.log(memoryContainer[2]);
console.log(memoryContainer[3]);
console.log(memoryContainer);

console.log(memoryContainer.toString("hex"))
console.log(memoryContainer.toString("utf-8"))