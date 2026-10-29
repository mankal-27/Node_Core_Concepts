function add(a, b) {
    return a + b;
}

function addCps (a, b, callback){
    callback(a + b);
}

console.log('Before addCps');
addCps(1,2, result => console.log('Result:', result));
console.log('After addCps');

function additionAsync(a, b, callback) {
    setTimeout(() => callback(a + b), 1000);
}

console.log('Before additionAsync');
additionAsync(1, 2, result => console.log('Result:', result));
console.log('After additionAsync');

const result = [1,2,5,7].map(element => element - 1);
console.log('Result of map:', result);