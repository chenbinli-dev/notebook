# **node学习笔记**

## DAY1

#### 1.console.trace()可以打印函数的调用栈

#### 2.特殊的全局对象，只是每个模块都有，看似像全局对象：`__dirname`,`__filename`,`require`,`exports`,`module`

#### 3.常见的全局对象：

- `process`——提供node进程信息，例如运行环境和参数信息
- `console`——提供调试控制台
- 定时器函数——`setTimeout`,`setInterval`,`setImmediate`
- `global`——相当于浏览器的window对象

#### 4.CommonJS的核心变量：`exports`,`module.exports`,`require`

#### 5.Node中实现CommonJS的本质就是引用赋值

#### 6.NodeJS中每一个文件都是module类的一个实例

#### 7.NodeJS中默认将`module.exports`=  `exports`,`exports`是CommonJS规范要求，`module.exports`是NodeJS自己的实现，使用`exports`导出本质上是`module.exports`导出

------

## DAY2

#### 1.require查找规则：`require(x)`:

x是一个核心模块（http,path等）——直接返回核心模块并停止查找

x是以./或../或/(根目录)开头——将x当做一个文件在对应目录下查找，如果有后缀名，按照后缀名的格式查找对应的文件；如果没有后缀名，会按照一下顺序进行查找：

1. 直接查找文件x
2. 查找x.js文件
3. 查找x.json文件
4. 查找x.node文件

####   2.模块加载过程

- 模块在第一次被引用时，模块中代码被执行一次
- 模块被多次引用时，不会多次执行，被第一次执行后会被加入缓存，仅仅执行一次
- node模块加载顺序采用的是深度优先
- CommonJS加载模块是同步的，Node是服务端语言，所以性能影响非常小；AMD,CMD,ES Module都是应用于浏览器，是异步加载。

## DAY3

#### 1.通常情况下，commonJS不能加载ES Module，ES Module可以加载commonJS

#### 2.Node常见的内置模块：

`path`——处理路径（`path.resolve(arg1,arg2)`方法用于拼接路径）

`fs(File Syetem)`——文件系统,有三种操作方式(同步操作、异步回调函数操作，Promise方式)

`events`——Node中的异步事件驱动，事件包括发射器emitter和监听者listener

## DAY4

#### 1.版本管理，npm需要遵从semver版本规范：X.Y.Z。

^x.y.z：表示x保持不变，y和z永远安装最新的

~x.y.z：表示x和y保持不变，z永远安装最新的

#### 2.`npm install -g`全局安装一般都用于工具包——yarn/webpack等

`npm install`或者`npm i`局部安装用于安装具体项目的依赖包（包括开发环境和生产环境）

`npm install xxx --save-dev`或者`npm install xxx -D`用于安装具体项目的开发环境时依赖包

## DAY5

1.Buffer是node提供的用于处理二进制的一个类库。

2.Buffer可以看成是存储二进制的数组。这个数组中的每一项都可以保存8位二进制：`00000000`。

```javascript
//字符串存储到buffer ,编码,设置编码格式
const message = 'hello'
const buffer = Buffer.from(message,'uft16le')
//解码,默认utf8
buffer.toString()
  

//Buffer的alloc创建
const buffer = Buffer.alloc(8)
console.log(buffer)
--结果:<Buffer 00 00 00 00 00 00 00 00>
//单独处理buffer的一位
buffer[0] = 01
```

#### 3.浏览器的事件循环

优先执行微任务队列，在执行宏任务，并且执行完一个宏任务后，会判断微任务队列是否有加入新的微任务，有则执行新的微任务，否则执行下一个宏任务。

#### 4.node中的事件循环由libuv实现，libuv是一个专注于异步io的库。libuv中主要维护一个EventLoop和worker threads（线程池）。

#### 5.`Stream`流——使用流能更加细节地操作

```javascript
//相比传统的读取文件方式，流方式能够准确地控制读取操作
const read = fs.createReadStream("./xxx.txt",{
    start:3,//文件读取开始位置
    end:6,//文件结束的位置
    highWaterMark:2//一次性读取字节的长度，默认是64kb
})
//监听读取结果
read.on("data",(data)=>{})
//监听文件打开和关闭
read.on("open",(data)=>{})
read.on("close",(data)=>{})
//暂停和恢复
read.pause()
read.resume()

//创建写入流
const writer = fs.createWriteStream("./xxx.txt",{
    flags:a//默认为w,a或a+为追加写入
    start:5//位置
})
//写入文件
writer.write("xxx",(err)=>{})
//监听文件打开和关闭
writer.on("open",()=>{})
writer.on("close",()=>{})
//实际上监听到关闭事件，写入流打开后不会自动关闭，需要手动改关闭，可以使用end方法来实现:write内容后并调用close关闭文件
writer.end('xxxx')
```

## DAY6

--视频10

#### 1.**http模块**

```javascript
//创建node服务器
const http = require('http')
http.createServer((req,res)=>{
    
}).listen(8888,'0.0.0.0'()=>{
    console.log('success')
})
//原生方法创建
 const http = new http.Server()
```

#### 2.`listen()`函数有三个常用参数：

`port`——端口号，可以不传，系统会默认分配

`host`——通常可以传入localhost/ip地址`127.0.0.1`/ip地址`0.0.0.0`,默认是`0.0.0.0`。`127.0.0.1`是回环地址，表示主机自己发出请求，自己响应。`0.0.0.0`监听ipv4上所有的地址，表示在同一个网段下的主机中通过ip地址是可以访问的。

## DAY7

#### 1.Express框架-核心是中间件

```javascript
npm i express-generator -g
```

#### 2.什么是中间件

中间件本质上是给express传递的一个回调函数，包括三个参数：`request对象`，`response对象`,`next函数（用于执行下一个中间件）`

#### 3.应用中间件

express提供了两种方法：app/router.use和app/router.methods

中间件永远匹配第一个中间件，调用`next()`函数后才会执行匹配下一个中间件

#### 4.express函数的本质其实是`createApplication()`

#### 5.通过use来注册一个中间件，无论是`app.use()`还是`app.methods`都会注册一个主路由，app本质上就是将所有的函数交给这个主路由去处理。

#### 6.源码解析-视频12

#### 7.koa是一个更加小巧的web框架,和express相比，它更多地需要依赖第三方库。

```javascript
npm i koa
npm i koa-router
npm i koa-parser
npm i koa-multer
npm i koa-static
```

## DAY8

  