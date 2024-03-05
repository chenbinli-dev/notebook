const a = {
    name: 'foo',
    age: 10
}
const proxy = new Proxy(a, {
    get: (target, propsKey) => {
        console.log(propsKey)
        if (propsKey === 'age') {
            return Reflect.get(target, propsKey) + 1
        }
        return Reflect.get(target, propsKey)
    }
})
// console.log(proxy.age, proxy.name)

// Observer Mode
const observers = new Set([
    function log (propKey, value) {
        console.log(`[${new Date()}]log observer: ${propKey} has been changed to ${value}!`)
    },
    function checker (propKey, value) {
        console.log(`[${new Date()}]check observer: ${propKey}'s newValue ${value} is valid!`)
    }
])
const subscribe = new Proxy(a, {
    set: (target, propsKey, newValue, receiver) => {
        const result = Reflect.set(target, propsKey, newValue, receiver)
        observers.forEach(e => e(propsKey, newValue))
        console.log(subscribe)
        return result
    }
})
subscribe.name = 'olivana'