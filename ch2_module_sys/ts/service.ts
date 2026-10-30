import type { Logger } from './types.ts'

// Dependency injection: depend on the interface, not a concrete module.
export function createService(logger: Logger) {
    return {
        run() {
            logger.log('service running')
        },
    }
}
