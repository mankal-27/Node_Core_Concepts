function add(a,b){
    return a + b
}

function addCps(a,b, callback){
    callback(a + b)
}

console.log('Before')
addCps(1,2, result => console.log(`Result: ${result}`))
console.log('After')

function addAsync(a, b, callback){
    setTimeout(() => {
       callback(a+b) 
    }, 100);
}

console.log('Before Async operation')
addAsync(1,2, result => console.log(`Result: ${result}`))
console.log('After Async operation')