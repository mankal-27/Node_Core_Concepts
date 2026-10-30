import { ConsoleLogger } from './consoleLogger.ts'
import { createService } from './service.ts'

createService(new ConsoleLogger('info')).run()
