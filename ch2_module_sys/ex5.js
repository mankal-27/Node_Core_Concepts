import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import db1 from './db.js'
import db2 from './db.js'

// ESM has no __dirname / __filename
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
console.log(__filename)
console.log(join(__dirname, 'data.json'))

// Modules are cached: both imports are the SAME instance (singleton)
console.log('same instance:', db1 === db2)
