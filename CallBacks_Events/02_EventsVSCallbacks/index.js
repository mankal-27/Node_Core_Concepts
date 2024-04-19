import { EventEmitter } from 'events'

function helloEvents(){
    const eventEmmiter = new EventEmitter();
    setTimeout(() => eventEmmiter.emit('complete', 'hello World'), 100)
    return eventEmmiter
}

function helloCallback(cb){
    setTimeout(() => cb(null, 'Hello world'), 100)
}

helloEvents().on('complete', message => console.log(message))
helloCallback((err, message) => console.log(message))