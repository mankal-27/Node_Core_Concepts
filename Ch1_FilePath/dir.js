const fs = require('fs')
const path = require('path')

fs.mkdir(path.join(__dirname, 'newfolder'), (err) => {
    if(err) throw err
    console.log('New Directory Created');
})