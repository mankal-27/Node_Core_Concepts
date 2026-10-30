// Importing CommonJS from ESM: module.exports becomes the default export
import a from './circular-cjs/a.cjs'
console.log('cjs default import:', a.loaded)

// Loading CJS-only features from ESM
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const b = require('./circular-cjs/b.cjs')
console.log('require() from ESM:', b.loaded)

// Modules are shared mutable objects: "monkey patching" the cache
import * as fs from 'node:fs'
import fsDefault from 'node:fs'
const original = fsDefault.readFileSync
fsDefault.readFileSync = (...args) => {
    console.log('readFileSync called with', args[0])
    return original(...args)
}
fsDefault.readFileSync(import.meta.filename)
fsDefault.readFileSync = original // restore
void fs
