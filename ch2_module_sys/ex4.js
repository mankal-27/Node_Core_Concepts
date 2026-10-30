import { count, increment } from './counter.js'

console.log(count) // 0
increment()
console.log(count) // 1 -> live binding, not a copy

try {
    count = 10
} catch (err) {
    console.log(err.message) // Assignment to constant variable.
}
