function add(a,b){
    return a+b
}

function addCp(a, b, callback){
    callback(a + b)
}

console.log("Before");
addCp(1,2, result => console.log(`Result is : ${result}`))
console.log("After");

//Asynchronosus Countinous passing style(cps)

function additionAsync(a,b,callback){
    setTimeout(() => callback(a+b), 0)
}

console.log("Before Async Call");
additionAsync(10,23, result => console.log(`Result : ${result}`))
console.log("After Async Call");