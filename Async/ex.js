// const tenYears = 10 * 365 * 24 * 60 * 60 * 1000
// setTimeout(() => console.log('Hello From the past', tenYears))
// console.log("Hello from The present");

let count = 0

setInterval(() => console.log(`${++count} mississippi`), 1000)

// setTimeout(() => {
//     console.log('Hello From the past!');
//     process.exit()
// }, 5000)

setTimeoutSync(5000)
console.log('Hello From the past!');
process.exit()

function setTimeoutSync(ms){
    const t0 = Date.now()
    while(Date.now() - t0 < ms) {}
}