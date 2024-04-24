import fs from 'fs'
import express from 'express'
import path from 'path';
const __dirname = path.resolve();

const port = process.env.PORT || 3000

const app = express()

function respondText(req, res) {
    res.setHeader('Content-Type', 'text/plain')
    res.end('Hi')
}

function respondJson(req,res){
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({text: "Hii", numbers: [12,2,4,4]}))
}

function respondNotFound(req,res){
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.end('Not Found')
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
    const filename = `${__dirname}/FSNode/Ch1-Exp/public/${req.params[0]}`
    fs.createReadStream(filename)
        .on('error', () => respondNotFound(req,res))
        .pipe(res)
}

app.get('/', respondText)
app.get('/json', respondJson)
app.get('/echo', respondEcho)
app.get('/static/*', respondStatic)

app.listen(port, () => console.log(`Server Listening on Port ${port}`))