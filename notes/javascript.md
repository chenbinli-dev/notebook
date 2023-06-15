# 1.事件循环（Event Loop）

:question: : 什么是事件循环？

:writing_hand: : 为了解决单线程运行阻塞问题而引入的一种计算机系统的运行机制。

:question: : 为什么`javascript`引入事件循环？

:writing_hand: : `JavaScript` 初期作为一门浏览器脚本语言，通常用于操作 `DOM` ，如果是多线程，一个线程进行了删除 `DOM` ，另一个添加 `DOM`，此时浏览器该如何处理？引入时间循环就是为了解决这个问题。

在`javascript`中所有的任务可以被分为同步任务和异步任务：

- 同步任务： 立即执行，一般直接进入主线程中执行。
- 异步任务： 延迟执行，例如网络请求、`setTimeout`。

当所有主线程中的所有同步任务执行完毕后会去任务队列读取对应的异步任务推入到主线程中执行，这种过程的往复就是事件循环。

![img](https://static.vue-js.com/61efbc20-7cb8-11eb-85f6-6fac77c0c9b3.png)

:warning:异步任务还可以分为微任务和宏任务：

- 微任务：一个异步执行的函数，执行的时机在主函数执行结束后，当前宏任务执行前。常见的微任务：`Promise.then`,`MutationObserver`,`Object.Proxy`,`process.nextTick(node.js)`。
- 宏任务：宏任务时间粒度较大，执行时间的间隔无法精准控制，常见的宏任务： `外部script同步代码`，`setTimeout/setInterval`,`UI rendering/UI事件`，`postMessage/MessageChannel`,`setInmmediate`,`I/O(node.js)`。

因此任务执行流程应该为如下图所示：

![img](https://static.vue-js.com/6e80e5e0-7cb8-11eb-85f6-6fac77c0c9b3.png)

:new:对于`async/await`，使用`async`来声明一个异步方法，`await`来等待异步方法执行，它会阻塞后面代码的执行，即将后面代码执行加入到微任务队列中，等宏任务执行结束后，再调用微任务执行。

:writing_hand:例子：

```javascript
async function fn1 () {
    console.log('1')
    await fn2()
    console.log('3')
}
async function fn2 () {
    console.log('2')
}
fn1()
console.log('4')
//结果： 1 2 4 3
//Description: 先执行fn1,打印1，遇见await,先执行fn2,打印2，阻塞后面代码执行，回到外部继续执行同步代码，打印4，同步代码执行结束，查看微任务队列，发现存在微任务，调用，打印3
```

:writing_hand:例子：

```javascript
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2')
}
console.log('script start')
setTimeout(function () {
    console.log('settimeout')
})
async1()
new Promise(function (resolve) {
    console.log('promise1')
    resolve()
}).then(function () {
    console.log('promise2')
})
console.log('script end')
//打印顺序：script start -> async1 start -> async2 -> promise1 -> script end -> async1 end -> promise2 -> settimeout
//Description: 首先执行同步代码，打印script start，接着遇见setTimeout,加入宏任务队列，再执行async1,打印async1 start，遇见await,后面的回调函数加入微任务队列等待执行，执行async2，打印async2，async2执行结束回到外部继续同步代码执行，遇见new Promise，打印promise1，遇见then,将then的回调函数加入微任务队列，继续执行同步代码，打印script end；同步代码执行结束，查看微任务队列（先进先出），第一个微任务console.log('async1 end')执行，第二个微任务console.log('promise2')执行；微任务执行结束，查看宏任务队列，发现回调函数console.log('settimeout')，执行。
```

👀以上是浏览器中事件循环的机制，其根据`HTML5`规范实现，而在`node.js`中，事件循环的实现是基于`libuv`（一个多平台的专注于异步IO的库）。

![img](https://static.vue-js.com/f2e34d80-c90e-11eb-ab90-d9ae814b240d.png)

- timers阶段：这个阶段执行timer（`setTimeout`、`setInterval`）的回调。
- 定时器检测阶段(timers)：本阶段执行 timer 的回调，即 `setTimeout`、`setInterval `里面的回调函数。
- I/O事件回调阶段(I/O callbacks)：执行延迟到下一个循环迭代的 I/O 回调，即上一轮循环中未被执行的一些I/O回调。
- 闲置阶段(idle, prepare)：仅系统内部使用。
- 轮询阶段(poll)：检索新的 I/O 事件;执行与 I/O 相关的回调（几乎所有情况下，除了关闭的回调函数，那些由计时器和 `setImmediate` 调度的之外），其余情况 node 将在适当的时候在此阻塞。
- 检查阶段(check)：`setImmediate` 回调函数在这里执行。
- 关闭事件回调阶段(close callback)：一些关闭的回调函数，如：`socket.on('close', ...)`。

每个阶段对应一个队列，当事件循环进入某个阶段时, 将会在该阶段内执行回调，直到队列耗尽或者回调的最大数量已执行, 那么将进入下一个处理阶段。

除了上述6个阶段，还存在`process.nextTick`，其不属于事件循环的任何一个阶段，它属于该阶段与下阶段之间的过渡, 即本阶段执行结束, 进入下一个阶段前, 所要执行的回调，类似插队，详细流程图如下：

![img](https://static.vue-js.com/fbe731d0-c90e-11eb-ab90-d9ae814b240d.png)

`node.js`同样有宏任务和微任务，常见的微任务：`process.nextTick`,`Promise.then`,`queueMicrotask`,宏任务有：`setTimeout/setInterval`,`IO事件`，`setImmediate`,`close事件`

执行顺序： `next tick microtask queue` -> `other microtask queue` -> `timer queue` -> `check queue` -> `close queue`. 

:writing_hand:例子：

```javascript
async function async1() {
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}

async function async2() {
    console.log('async2')
}

console.log('script start')

setTimeout(function () {
    console.log('setTimeout0')
}, 0)

setTimeout(function () {
    console.log('setTimeout2')
}, 300)

setImmediate(() => console.log('setImmediate'));

process.nextTick(() => console.log('nextTick1'));

async1();

process.nextTick(() => console.log('nextTick2'));

new Promise(function (resolve) {
    console.log('promise1')
    resolve();
    console.log('promise2')
}).then(function () {
    console.log('promise3')
})

console.log('script end')
//打印顺序： script start -> async1 start -> async2 -> promise1 -> promise2 -> script end -> nextTick1 -> nextTick2 -> async1 end ->promise3 -> setTimeout0 -> setImmediate -> setTimeout2
// Description: 执行同步代码，打印script start，遇见第一个setTimeout,回调函数加入timer queue,遇见第二个setTimeout,300ms后回调函数加入timer queue,遇见setImmediate,加入 check queue, 遇见第一个process.nextTick,加入 next tick queue, 接着是只async1,打印async1 start，遇见await,console.log('async1 end')加入other microtask queue ,执行async2,打印async2；async1执行完毕，遇见第二个process.nextTick,加入next tick queue，遇见new Promise,打印console.log('promise1')和 console.log('promise2')，注意resolve不会阻塞后面函数的执行；resolve后遇见then，加入other microtask queue,继续同步代码执行，打印script end。同步代码执行结束，查看微任务，按照微任务队列的执行顺序，首先看next tick queue,执行其中的回调函数打印nextTick1和nextTick2，再执行other microtask queue中的回调，打印async1 end和promise3；微任务执行完毕，查看宏任务。首先是timer queue中回调函数执行，打印setTimeout0，再看check queue中函数，执行setImmediate。宏任务执行完毕，继续事件循环，300ms后console.log('setTimeout2')加入timer queue ,被执行，打印setTimeout2。
```

🤔思考一个关于`setTimeout`和`setImmediate`执行顺序的问题：

```javascript
setTimeout(() => {
  console.log("setTimeout");
}, 0);

setImmediate(() => {
  console.log("setImmediate");
});
```

以上代码的执行结果可能会有两种：一个是`setTimeout`先执行，一个是`setImmediate`先执行。原因是：当给`setTimeout`设置`0ms`触发时，实际上会被强制修改为`1ms`,那么执行代码时，遇见`setTimeout`会在时间到后加入到 timer queue,遇见`setImmediate`会被加入到check queue。同步代码执行完，进入事件循环，在此时检查当前时间是否已经过了`1ms`，是则`setImmediate`的回调函数已经加入到timer queue,执行，接着再执行`setImmediate`,否则此时timer queue 为空，进入check queue执行，进入下一个循环后，`setImmediate`才加入被执行。

❗影响结果的关键在于同步代码的执行时间是否超过了`1ms`。

# 2.事件模型

事件流：浏览器中的事件在DOM树中传递的方式就是事件流，由于整个DOM是个树结构，所以事件先从祖先节点传递到目标节点，再返回，也就是三个阶段：事件捕获、目标阶段，事件冒泡。

![img](https://static.vue-js.com/3e9a6450-74cf-11eb-85f6-6fac77c0c9b3.png)

🙌事件捕获就是事件先被不具体的节点接受，后逐级往下传递到触发节点。

💦事件冒泡就是事件先被触发节点接收，后逐级往上传递到根节点。