// realative import
console.log(import.meta.resolve('./utils/example.js'))

// Node.js core module import
console.log(import.meta.resolve('assert'))
    // -> node:assert
console.log(import.meta.resolve('node:assert'))
    // -> node:assert

// Third-party library import (with fastify)
console.log(import.meta.resolve('fastify/lib/logger.js'))
// -> file://<project_path>/node_modules/fastify/lib/logger.js