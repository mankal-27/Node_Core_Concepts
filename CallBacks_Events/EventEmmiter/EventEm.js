import { EventEmitter } from 'events'
import { readFile } from 'fs'

function findRegex(files,regex){
    const emmiter = new EventEmitter()

    for(const file of files){
        readFile(file, 'utf-8', (err, content) => {
            if(err){
                return emmiter.emit('error', err)
            }
            emmiter.emit('fileread', file)
            const match = content.match(regex)
            if(match){
                match.forEach(elem => emmiter.emit('found', file, elem))
            }
        })
    }
    return emmiter
}

findRegex(
    ['fileA.txt', 'fileB.json'], /hello \w+/g
)
    .on('fileread', file => console.log(`${file} was read`) )
    .on('found', (file, match) => console.log(`Matched "${match}" in ${file}`))
    .on('error', err => console.error(`Error emmited ${err.message}`))