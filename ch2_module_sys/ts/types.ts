export interface Logger {
    log(message: string): void
}

export type Level = 'error' | 'warn' | 'info'
