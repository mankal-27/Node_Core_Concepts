const fsPromise = require('fs').promises;
const path = require('path');


// fs.readFile(path.join(__dirname, 'sevenWndsrs.txt'), 'utf-8', (err, data) => {
//     if(err) throw err;
//     console.log(data.toString());
// })


process.on('uncaughtException', err => {
    console.error(`There was an uncaught error : ${err}`);
    process.exit()
})

// fs.writeFile(path.join(__dirname, 'sevenWonder.txt'), 'Nice to meet you', (err) => {
//     if(err) throw err;
//     console.log('Operation Completed - Write')

//     fs.appendFile(path.join(__dirname, 'sevenWonder.txt'), '\n\Testing right now', (err) => {
//         if(err) throw err;
//         console.log('Append Completed')

//         fs.rename(path.join(__dirname, 'sevenWonder.txt'), '\n\Testing new Relply right now', (err) => {
//             if(err) throw err;
//             console.log('Rename Completed')
//         })
//     })
// })


const fileOps = async() => {
    try {
        const data = await fsPromise.readFile(path.join(__dirname, 'sevenWonder.txt'),'utf-8');
        console.log(data);
        await fsPromise.unlink(path.join(__dirname, 'sevenWonder.txt'))
        await fsPromise.writeFile(path.join(__dirname, 'promisesWrote.txt'), data)
        await fsPromise.appendFile(path.join(__dirname, 'promisesWrote.txt'), '\n nice to meet you finally')
        await fsPromise.rename(path.join(__dirname, 'promisesWrote.txt'), path.join(__dirname, 'NewPromiseWrote.txt'))
        const newData = await fsPromise.readFile(path.join(__dirname, 'NewPromiseWrote.txt'), 'utf-8' );
        console.log("-33333333------");
        console.log(newData);
    } catch (error) {
        console.error(error)
    }
}

fileOps()