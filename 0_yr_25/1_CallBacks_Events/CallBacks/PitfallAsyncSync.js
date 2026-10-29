import { readFile } from 'fs';

const cache = new Map();

function inconsistentRead(filename, cb) {
    if (cache.has(filename)) {
        // Invoked synchronously
        cb(cache.get(filename));
    } else {
        readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                cb(err); // Pass error to callback
                return;
            }
            cache.set(filename, data);
            cb(null, data); // Pass data to callback
        });
    }
}

function createFileReader(filename) {
    const listeners = [];
    inconsistentRead(filename, (err, value) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            return;
        }
        listeners.forEach(listener => listener(value));
    });
    return {
        onDataReady: listener => listeners.push(listener)
    };
}

const reader1 = createFileReader('data.txt');
reader1.onDataReady(data => {
    console.log(`First call data: ${data}`);

    const reader2 = createFileReader('data.txt');
    reader2.onDataReady(data => {
        console.log(`Second call data: ${data}`);
    });
});
