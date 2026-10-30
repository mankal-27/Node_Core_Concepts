import { a } from './a.js'

export const b = 'value from b'

// Safe: only read `a` later, when a.js has finished evaluating.
export function readB() {
    return `b sees a = ${a}`
}

// Unsafe: reading `a` at module-evaluation time hits the TDZ.
// Uncomment to see: ReferenceError: Cannot access 'a' before initialization
// console.log(a)
