import express from 'express';
import compression from 'compression';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Config
const __dirname = dirname(fileURLToPath(import.meta.url)) ,
    cfg = {
    port: process.env.PORT || 3000,
        dir:{
            root: __dirname,
            static: __dirname + '/static',
            views: __dirname + '/views'
        }
};
console.log(cfg, { depth: null, colors: true });
//Express Initialization
const app = express();

//do not identify express
app.disable('x-powered-by');

//Use EJS templates
app.set('view engine', 'ejs');
app.set('views', cfg.dir.views);

//log every request to the terminal
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

//Http Compression
app.use(compression());


//Home Page Route
app.get('/', (req, res) => {
    res.render('message', { title: 'Home Page' });
});

app.get('/form', (req, res) => {
    res.render(('form'), {
        title: 'Parse HTTP GET data',
        data: req.query
    })
})

// //anoter route
// app.get('/about', (req, res) => {
//     res.render('message', { title: 'About Page' });
// })

//hello route
import { helloRouter } from './routes/hello.js';
app.use('/hello', helloRouter);
//serve static files
app.use(express.static(cfg.dir.static));

//404 Error Handler
app.use((req, res) => {
    res.status(404);
    res.render('message', { title: '404 Not Found' });
});

//Start Server
app.listen(cfg.port, () => {
    console.log(`App Listening at http://localhost:${cfg.port}`);
});

//export defaults
export { app, cfg };