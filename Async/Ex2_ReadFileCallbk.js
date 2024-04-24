import fs from 'fs'
import path from 'path';
const __dirname = path.resolve();
const fileName = `${__dirname}/Async/setFile.js`

fs.readFile(fileName, (err, fileData) => {
    if(err) return console.error(err)

    console.log(`${fileName} : ${fileData.length}`);
})