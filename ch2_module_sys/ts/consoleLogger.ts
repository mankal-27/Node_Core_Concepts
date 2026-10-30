// `import type` is erased at compile time: no runtime import is emitted,
// so it can never create a runtime circular dependency.
import type { Logger, Level } from './types.ts'

export class ConsoleLogger implements Logger {
    private level: Level

    constructor(level: Level = 'info') {
        this.level = level
    }

    log(message: string): void {
        console.log(`[${this.level}] ${message}`)
    }
}
