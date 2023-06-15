// 订阅-发布模式 （通常是异步通信）
// 应用场景： 解决异步回调嵌套的复杂性，比如Promise和 event emitter等
// 原理： 订阅者和发布者不直接通信，通过事件中心来协调。首先订阅者需要先订阅事件，等发布者向事件中心发布事件，事件中心通知订阅者（可能多个）
class Event {
    constructor() {
        this.listeners = new Map()
    }
    // 添加监听者
    addEventListener (type, listener) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, [])
        }
        const listeners = this.listeners.get(type)
        listeners.push(listener)
    }
    // 移除监听者
    removeEventListener (type, listener) {
        if (this.listeners.has(type)) {
            const listeners = this.listeners.get(type)
            const index = listeners.indexOf(listener)
            if (index !== -1) {
                listeners.splice(index, 1)
                console.log('remove event listener')
            }
        }
    }
    // 触发事件
    dispatch (event) {
        if (this.listeners.has(event.type)) {
            const listeners = this.listeners.get(event.type)
            listeners.forEach(listener => listener(event))
        }
    }
}
function test () {
    const event = new Event()
    const handleClick = (e) => {
        console.log(e)
    }
    const handleChange = (e) => {
        console.log(e)
    }
    event.addEventListener('click', handleClick)
    event.addEventListener('change', handleChange)

    event.dispatch({
        type: 'click',
        message: 'hahaha'
    })
    event.dispatch({
        type: 'change',
        message: 'oooooo'
    })
    event.removeEventListener('click', handleClick)
}
test()