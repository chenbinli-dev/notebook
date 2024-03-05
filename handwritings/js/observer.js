//
//观察者模式(Proxy实现,通常是同步通信)
//应用场景： 响应式数据，状态管理，DOM事件
//原理： 定义一种一对多的依赖关系，让多个观察者对象同时监听某个目标对象，在这个目标对象的状态发生改变时通知观察者，使其自动更新。
//
const target = {}
const observers = new Set()
const handler = {
    set (target, key, value) {
        target[key] = value
        observers.forEach(observer => observer(key, value))
        return true
    }
}
const proxy = new Proxy(target, handler)
/**
 * 添加观察者
 * @param {*} observer 
 */
function addObserver (observer) {
    observers.add(observer)
}
/**
 * 删除观察者
 * @param {*} observer 
 */
function deleteObserver (observer) {
    observers.delete(observer)
    console.log('observer has been deleted')
}
function logObserver (key, value) {
    console.log(`Log observer,the target's ${key} has been changed to ${value} `)
}
function test () {
    console.log("target: ", target)
    console.log("proxy: ", proxy)
    addObserver(logObserver)
    proxy.name = 'li'
    proxy.age = 22
    deleteObserver(logObserver)
    proxy.gender = 'female'
    console.log("target: ", target)
}
test()