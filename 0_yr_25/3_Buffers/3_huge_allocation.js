const { Buffer,  constants } = require('buffer')

const buff = Buffer.alloc(1e9); // 1GB

console.log(constants.MAX_LENGTH);
setInterval(() => {
    // for(let i = 0 ; i < buff.length; i++) { // b.length is the size of the buffer in bytes
    //     buff[i] = 0x22;
    // }
    buff.fill(0x22)
}, 5000);

