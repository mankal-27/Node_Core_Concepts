import fs from 'fs'
import express from 'express'
import path from 'path'
import EventEmitter from 'events';
const __dirname = path.resolve();
const chatEmmiter = new EventEmitter()

const port = process.env.PORT || 3000;

const app = express()


app.get('/', respondText)
app.get('/json', respondJson)
app.get('/echo', respondEcho)
app.get('/static/*', respondStatic)
app.get('/chat', respondChat)
app.get('/sse', respondSSE)
app.listen(port, () => console.log(`Server is listening on PORT ${port}`))


function respondText(req, res) {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hi')
}

function respondJson(req,res){
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({text: "Hii", numbers: [12,2,4,4]}))
}

function respondEcho(req, res){
    const { input = '' } = req.query

    res.json({
        normal: input,
        shouty: input.toUpperCase(),
        charcterCount: input.length,
        backwards: input
            .split('')
            .reverse()
            .join('')
    })
}

function respondStatic(req, res){
    const filename = `${__dirname}/ChatApp/public/${req.params[0]}`
    console.log('ssds', filename)
    fs.createReadStream(filename)
        .on('error', () => respondNotFound(req,res))
        .pipe(res)
}


function respondChat(req,res){
    const { message } = req.query
    chatEmmiter.emit('message', message)
    res.end()
}

function respondSSE(req,res){
    res.writeHead(200,{
        'Content-Type' : 'text/event-stream',
        'Connection': 'keep-alive'
    })

    const onMessage = msg => res.write(`data: ${msg}\n\n`)
    chatEmmiter.on('message', onMessage)

    res.on('close', function(){
        chatEmmiter.off('message', onMessage)
    })
}

function respondNotFound(req,res){
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.end('Not Found')
}