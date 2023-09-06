// convert the es6 class to es5 function


/* 
class Person {
    constructor(name, age) {
        this.name = name
        this.age = age
    }
    say () {
        console.log(`name: ${this.name} , age: ${this.age}`)
    }
}
const a = new Person('coin', 20)
a.say() 
*/

function Person (name, age) {
    if (!(this instanceof Person)) {
        throw new TypeError("Class constructor Person cannot be invoked without 'new'")
    }
    this.name = name
    this.age = age
}
Object.defineProperty(Person.prototype, "say", {
    value: function () {
        if (!(this instanceof Person)) {
            throw new TypeError("a.say is not a constructor")
        }
        console.log(`name: ${this.name} , age: ${this.age}`)
    },
    enumerable: false
})
const a = new Person('coin', '20')
new a.say()
