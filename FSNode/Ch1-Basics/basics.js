import http from 'http'
import querystring from 'querystring'
import fs from 'fs'

const port = process.env.PORT || 3000

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

function respondEcho(req,res){
    const { input = ''} = querystring.parse(
        req.url
            .split('?')
            .splice(1)
            .join('')
    )
    res.setHeader('Content-Type', 'application/json')
    res.end(
        JSON.stringify({
            normal: input,
            shouty: input.toUpperCase(),
            characterCount: input.length,
            backwards: input
                .split('')
                .reverse()
                .join('')
        })
    )
}

function respondStatic(req,res){
    // Checking if __dirname is defined (for Node.js environment)
    const directory = typeof __dirname !== 'undefined' ? __dirname : ''; 
    const filename = `${directory}/public${req.url.split('/static')[1]}`;
    console.log("sdsds",filename)
    // const filename = `${__dirname}/public${req.url.split('/static')[1]}`
    fs.createReadStream(filename)
        .on('error', () => respondNotFound(req, res))
        .pipe(res)

}
const server = http.createServer(function(req, res){
    if(req.url === '/') return respondText(req,res)
    if(req.url === '/json') return respondJson(req, res)
    if(req.url.match(/^\/echo/)) return respondEcho(req, res)
    if(req.url.match(/^\/static/)) return respondStatic(req,res)
    respondNotFound(req,res)
})

server.listen(port)
console.log(`Server listening on port ${port}`)