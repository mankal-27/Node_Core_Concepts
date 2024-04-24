import fs from 'fs'
import path from 'path'
const __dirname = path.resolve()

const fileDire = `${__dirname}/Async`

fs.readdir(fileDire, (err, files) => {
    if(err) console.error(err)
    console.log("Each File : ", files)
    files.forEach(function(file){
        const filePath = path.join(fileDire, file);
        fs.readFile(filePath, (err,fileData) => {
            if(err) console.error(err)

            console.log(`${file}: ${fileData.length}`);
        })
    })
    console.log("Done");
})

function mapAsync(arr, fn, onFinish){
    let prevError
    let nRemaining = arr.length
    const results = []

    arr.forEach(function(item, i){
        fn(item, function(err, data){
            if(prevError) return
            if(err) {
                prevError = err
                return onFinish(err)
            }
            results[i] = data
            nRemaining--
            if(!nRemaining) onFinish(null, results)
        })
    })
}