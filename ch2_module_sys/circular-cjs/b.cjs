exports.loaded = false
const a = require('./a.cjs') // a is only PARTIALLY loaded here
module.exports = {
    a,
    loaded: true,
}
