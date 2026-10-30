// Evaluation order: main -> a -> b (b runs FIRST, a's body runs last)
import './a.js'
import { readB } from './b.js'

console.log('main.js:', readB())
