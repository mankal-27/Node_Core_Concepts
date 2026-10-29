import { readFileSync } from 'fs'

const cache = new Map()

function consistentReadSync(filename){
    if(cache.has(filename)){
        return cache.get(filename)
    }else{
        const data = readFileSync(filename, 'utf-8')
        cache.set(filename, data)
        return data
    }
}

//second method

function consistentReadSync1(filename, callback){
    if(cache.has(filename)){
        process.nextTick(() => callback(cache.get(filename)))
    }else{
        readFileSync(filename, 'utf-8', (err, data) => {
            cache.set(filename, data)
            callback(data)
        })
    }
}