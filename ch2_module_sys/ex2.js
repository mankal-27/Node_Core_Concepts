import * as loggerModule from './Logger.js'
import { log, Logger } from './Logger.js'

console.log(loggerModule)
log('Hello World')
const logger = new Logger('Default')
logger.log('Hello world dar')