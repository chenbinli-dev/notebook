// Implement of Array.reduce()
Array.prototype._reduce_ = function (callback, initialValue) {
    if (this === 'undefined') {
        throw new TypeError('this is null or undefined')
    }
    if (typeof callback !== 'function') {
        throw new TypeError('callback must be a function')
    }
    const O = Object(this)
    const len = this.length >>> 0
    let accumulator = initialValue
    let k = 0
    // if no initial value, the first item of array will be setted for initial value
    if (accumulator === undefined) {
        while (k < len && !(k in O)) {
            k++
        }
        // not found initial value
        if (k >= len) {
            throw new TypeError('Reduce of empty array with no initial value')
        }
        accumulator = O[k++]
    }
    while (k < len) {
        if (k in O) {
            accumulator = callback.call(undefined, accumulator, O[k], k, O)
        }
        k++
    }
    return accumulator
}

// test
const arr = [1, 2, 3, 4, 5,]
const newArr = arr._reduce_((acc, cur) => {
    acc.push({
        key: cur
    })
    return acc
}, [])

console.log(newArr)