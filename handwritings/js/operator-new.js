// simulate Implement of operator new
function OperatorNew (constructor, ...args) {
    // 1. create a new null object
    const obj = {}
    // 2. set prototype for the new object
    Object.setPrototypeOf(obj, constructor.prototype)
    // obj.__proto__ = constructor.prototype
    // 3. points the this of the constructor to the new object
    const result = constructor.apply(obj, args)
    // 4. return by result
    return result instanceof Object ? result : obj
}
function Person (name, age) {
    this.name = name
    this.age = age
}
Person.prototype.say = function () {
    console.log(this.name, this.age)
}
function test () {
    const instance = OperatorNew(Person, 'leon', 20)
    console.log(instance)
    instance.say()
}
test()