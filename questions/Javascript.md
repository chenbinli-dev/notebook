# 奇怪的知识又增加了

下面是一些不常见的题目，由此可见 javascript 的历史问题还是太严重了，它的一些设计就很不合理。

## 给出下面代码的执行结果

```javascript
function deal(args) {
  args[0] = args[2]
}
function add(a, b, c = 3) {
  c = 10
  deal(arguments)
  return a + b + c
}
const res = add(1, 1, 1)
console.log(res)
```

> 答案： 12。
> 解析： 当函数使用默认值时会转为严格模式执行，此时函数的 arguments 对象和入参不绑定，对 arguments 的修改不会影响到入参。如果 c 没有设置默认值，则按非严格模式执行，此时对 arguments 对象的修改会反应到入参，导致结果变为 21。

```javascript
let min = Math.min(),
  max = Math.max()
console.log(min < max)
```

> 答案: false 。
> 解析: Math.min()当参数个数为 0 时返回 Infinity,Math.max()当参数个数为 0 时返回-Infinity。

```javascript
var a = 1(function a() {
  a = 2
  console.log(a)
})()
```

> 答案： a 函数本身。
> 解析：首先声明了一个全局变量 a 并赋值 1，然后定义了一个立即执行函数（IIFE）a，立即执行函数 a 内部给变量，a 赋值为 2，然后打印 a。由于立即执行函数形成了独立的作用域，该作用域中同时存在函数 a 和变量 a，函数定义的优先级高于变量定义，所以打印的结果就是函数本身。
