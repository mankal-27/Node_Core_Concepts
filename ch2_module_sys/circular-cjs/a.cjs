exports.loaded = false
const b = require('./b.cjs')
module.exports = {
    b,
    loaded: true, // overrides the previous exports.loaded = false
}
