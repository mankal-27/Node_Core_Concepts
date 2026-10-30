const a = require('./a.cjs')
const b = require('./b.cjs')

console.log('a.loaded:', a.loaded, '| a.b.loaded:', a.b.loaded)
console.log('b.loaded:', b.loaded, '| b.a.loaded:', b.a.loaded)
// b.a.loaded is false: b received a's *old* exports object, because
// a replaced module.exports after b had already grabbed the reference.
