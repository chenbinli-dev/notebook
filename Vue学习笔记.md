



# Vue学习笔记

## DAY1

##### 理解什么是渐进式，了解Vue的生命周期，掌握Vue实例options的使用，掌握基本命令的使用

```javascript
new Vue({
    el:"xxx",//挂载的dom
    data:xxx,//数据
    computed:{
        xxx:function(){}//computed是计算属性，调用时不用括号，以函数的形式出现相当于getter()和setter()
    },
    methods:{
        xxx:function(){}//定义的方法
    },
    created:function(){},//Vue的生命周期的回调函数，在实例创建完调用
    mounted:function(){}//Vue的生命周期的回调函数，在实例修改时调用
    ...
})
```

##### Vue的生命周期（重要）

![Vue 实例生命周期](https://cn.vuejs.org/images/lifecycle.png)

## DAY2

##### 1.computed的本质和缓存

computed叫作计算属性，本质是属性，里面是一个个对象，每个对象有setter和getter方法

computed的函数执行次数取决于对应数据是否发生更新，是则再次执行，否则读取已经缓存的结果

##### 2.v-on的参数传递和修饰符

$event作为参数可以获取当前的事件对象

.stop修饰符表示阻止事件冒泡

.prevent修饰符表示阻止默认事件（比如<input>的commit，如果不需提交数据时就可以使用阻止它）

.enter修饰符监听enter按键的触发

.once修饰符表示仅仅触发一次

.native修饰符针对vue的组件监听

```javascript
<div @click="xxx">
<input type="commit" @click.stop="xxxx"/>
</div>
//由于js的事件冒泡机制，当点击input时，会相继触发input的点击事件和父元素div的点击事件
//使用.stop可以阻止父元素事件的触发，其他修饰符使用格式相同
```

##### 3.v-if/v-else-if/v-else和v-show

这些命令用于决定元素的显示，但他们有着区别：

v-if/v-else-if/v-else如果为true，则该元素被渲染到DOM树中，否则不渲染到DOM树中

v-show如果为true，该元素被渲染到DOM树中，否则该元素依旧渲染到DOM树中，但它的display属性的值设为none



注意！

在使用v-if/v-else实现登录输入框切换时，用户输入的数据在切换后依旧保存在输入框内，为什么？

这是因为vue的虚拟DOM机制会对已有的内容尽可能的复用，如果切换前后DOM节点没有发生改变，那么将直接使用之前的节点，并对节点属性等已修改的部分进行更新，因此内容依旧保留。



解决：可以使用key="xxx"作为标识，取消复用，原因是如果切换前后的DOM节点key不同，那么虚拟DOM将不会进行复用，直接将切换后的节点渲染到DOM树中



如何选择？

如果切换频率高，使用v-show，减少DOM的渲染，提高性能

如果切换频率低，使用v-if

##### 4.v-for遍历对象或数组

如果遍历对象，获取key,value，index,怎么写？

```html
<div v-for="(value,key,index) in obj"></div>
//value在第一位，它的权重高于key
```

遍历数组

```html
<div v-for="(index,value) in arr"></div>
```



如果要向以已经渲染好数组中间插值，怎么实现？

可以使用数组方法splice(开始位置，要替换的个数，新值)

实际上插值这操作和虚拟DOM的diff算法有关：

![img](https://upload-images.jianshu.io/upload_images/13277068-f6a7c0e606b80b2a.png?imageMogr2/auto-orient/strip|imageView2/2/w/572/format/webp)

我们希望可以在B和C之间加一个F,diff算法默认执行起来是这样的：即把C更新成F，D更新成C，E更新成D，最后再插入E，是不是很没有效率？

 所以我们需要使用key来给每个节点做一个唯一标识，Diff算法就可以正确的识别此节点，找到正确的位置区插入新的节点。

![img](https://upload-images.jianshu.io/upload_images/13277068-d7dc3906fd926b06.png?imageMogr2/auto-orient/strip|imageView2/2/format/webp)

所以一般使用key="xxx"来标识每一个数组元素，如下，

```html
<div v-for="item in arr" key="item">
</div>
//为什么不使用index？因为index会随着数组的元素个数改变，无法唯一标识
//使用key的主要作用就是更加高效地更新虚拟DOM
```

##### 5.数组的方法不都是响应式的

数组有些方法更新数据后无法在页面刷新出结果，这是因为vue没有对这些方法进行解析

响应式的方法：

push() pop() shift() unshift() splice() sort() reverse()

使用索引修改数组元素不是响应式的：

```js
arr[0] = 'xxx'
```

Vue提供了set方法，可以通过索引修改并响应式地更新页面

```javascript
Vue.set(arr,index,xxx)
```

## DAY3

##### 1.Vue中过滤器的使用

使用场景一般是对需要呈现的数据进行处理过滤，用法如下：

```html
<div id="app">
    {{message|messageFilter}}
</div>
```

```javascript
const app = new Vue({
    el:'#app',
    data:{
        message:xxx
    },
    filters:{
        messageFilter (){
            //对message进行处理
        }
    }
})
```

##### 2.Javascript中高阶函数的使用

```javascript
//过滤
filter(function(n){
    //@param n
    //this is a callback funtion
    //do something
    //return a boolean
    //如果返回值为真，则将n加入新的数组中；如果为假，过滤掉n
    //新数组作为filter()的返回值返回
})
example:
let newarr = arr.filter(function(n){
    return n<20;
})//过滤掉数组arr中大于20的数
```

```javascript
//映射
map(function(n){
    //@param n
    //this is a callback funtion
    //do something
    //return a new n
    //返回对n进行操作后的结果加入新数组
    //新数组作为map()的返回值返回
})
example:
let newarr = arr.map(function(n){
    return n*2;
})//对数组arr中每个元素乘以2
```

```javascript
//遍历
reduce(function(prev,cur,index,array){
    //@param prev :前一个值
    //@param cur :当前值
    //@param index :项的索引值
    //@param array :数组对象
    //this is a callback funtion
    //do something
    //return a value ,prev = return value
    //每次返回的值自动赋值给prev
    //结果作为map()的返回值返回
},init)
//init是prev的初始值
example:
let newarr = arr.map(function(prev,cur){
    return prev+cur;
},0)//求数组arr中元素的和
```

##### 3.v-model的认识和使用

v-model用于实现数据的双向绑定，默认绑定数据为string类型

原理：它是v-bind和v-on命令的结合的语法糖，使用这两个命令同样可以实现数据的双向绑定

v-model的修饰符有：lazy、number、trim

```html
//当输入框失去焦点或者按下回车后，输入的数据才会响应式地更新，一种lazylaod
<input type="text" v-model.lazy="message">
//保证输入的数据为number类型
<input type="number" v-model.number="message">
//自动去除输入数据首尾的空格
<input type="text" v-model.trim="message">
```

## DAY4

##### 1.理解什么是组件化

组件化是VUE中最重要的思想，它将页面看成是由一个个小的组件组成，每个组件独立完成自己的功能，提高了复用性和扩展性。

Vue的实例就是一个最大的组件，而每个组件又可以看成是Vue的实例

##### 2.如何使用组件？

```javascript
//组件的使用必须要定义一个组件构造器
let componentContructor = Vue.extend({
    template:"xxx",//组件的模版，可以是HTML也可以是<template>的id，建议使用id
    data(){
        return xxxx
    },//模版的数据
    methods:{
        //模版的自定义方法
    },
    components:{
        //子组件
    }
})；
//组件构造器定义完成后，注册组件,这种方法是注册全局组件，每个Vue实例都可以使用
Vue.conponent('mycomponent',componentContructor)；
//注册完成后就可以使用组件了
<mycomponent></mycomponent>
```

以上书写太过复杂，可以在注册组件时直接进行构造器的定义和注册：

```javascript
components:{
    mycomponent:{
        template:xx,
        data(){
            return xx
        },
    }
}
或者
const mycomponent = {
     template:xx,
        data(){
            return xx
        },
}
components:{
    mycomponent
}
```

##### 3.父组件和子组件的通信

父组件通过props向子组件传递数据

```html
    <div id='app'>
        <cmp :childlist="movies"></cmp>
    </div>
    <template id="moviesList">
        <ul>
            <li v-for="item in childlist">{{item}}</li>
        </ul>
    </template>
```



```javascript
const app = new Vue({
     el:'#app',
     data:{
         movies:['泰坦尼克号','海王','蜘蛛侠','变形金刚']
     },
     methods:{},
     components:{
         //注册子组件(也是局部组件)，使用语法糖，相当于调用Vue.extend()创建组件构造器
         cmp:{
             template:'#moviesList',
             data(){
                 return xxx
             },//子组件的data必须是函数
             /*
             使用props实现父组件向子组件传递数据,相当于组件的自定义属性
             注意！props的属性绑定是不能有大写的：<h2 :Apple="xxx"></h2>
             如果props里值是驼峰标识，那么可以使用child-name来代替childName
             提示如下
             Prop "childlist" is passed to component <Anonymous>, but the declared prop name is "childList".
             Note that HTML attributes are case-insensitive and camelCased props need to use their kebab-case equivalents when using in-DOM templates. 
             You should probably use "child-list" instead of "childList". */
             props:{
                 childlist:{
                     type:Array,//数据类型
                     //当type为Array or Object,default必须为函数，否则为字符串或数值
                     default(){
                         return [];
                     }
                 }
             }//也可以使用['childlist'],但是一般都是使用对象

         }
     }
    });
```

子组件通过$emit(自定义方法)向父组件传递数据:

```html
    <div id="app">
      <btncomponent
        @childevent="dealChildEvent"
      ></btncomponent>
    </div>
    <template id="btnList">
      <ul>
        <button v-for="item in btns" @click="childClick(item)">
          {{item.name}}
        </button>
      </ul>
    </template>
```

```javascript
const app = new Vue({
        el: "#app",
        data: {},
        methods: {
          dealChildEvent(item) {
            console.log(item);
          },
        },
        components: {
          //注册子组件
          btncomponent: {
            template: '#btnList',
            data() {
              return {
                btns: [
                  { id: 1, name: '第一个按钮' },
                  { id: 2, name: '第二个按钮' },
                  { id: 3, name: '第三个按钮' },
                  { id: 4, name: '第四个按钮' },
                ],
              };
            },
            methods: {
              //自定义事件，将子组件数据通过$emit(事件名，具体数据)发送给父组件
              childClick(item) {
                this.$emit('childevent',item);
              },
            },
          },
        },
      });
```

##### 4.注意事项

由于HTML对大小写不敏感，因此在绑定属性和监听事件的时候，props中属性名或者子组件methods中方法名是驼峰式，将无法正常实现通信。

在Vue-cli中还有待试验。

## DAY5

##### 1.v-model和组件的使用

如果要使用v-model实现子组件数据的双向绑定，不要直接绑定props中的数据(前提是子组件数据由父组件传递来)

如何解决？

a)可以交由父组件进行绑定

b)可以在data()中对props中属性重新赋值，再对其进行绑定

##### 2.watch属性的使用

watch属性是组件的属性，和el,data,methods等属性类似。

作用：它负责监听props或data中数据的变化，如果改变则触发

```javascript
props:{
    name:{
        type:String,
        default:'xxx'
        }
    }
},
watch:{
        name(){
            //do something
        }
    }
```

##### 3.父组件和子组件的访问

父组件访问子组件：$children或$refs

子组件访问父组件：$parent

访问根组件：$root

```html
    <!--
        组件访问
        父组件直接访问子组件:$children(不常用)和$refs(常用，给组件子组件加上Key,通过key访问)
        子组件直接访问父组件：$parent(不常用)
        访问根组件$root(不常用)
    -->
    <div id='app'>
        <button @click="getChild">我是父组件，点我访问子组件</button>
    <childc ref="child"></childc>
    </div>
    <template id="child">
        <div>
            <h2>我是子组件</h2>
        <button @click="getFather">点我访问父组件</button>
        </div> 
    </template>
```

```javascript
  const app = new Vue({
     el:'#app',
     data:{
         name:'this is father component',
     },
     methods:{
        getChild(){
            // console.log(this.$children[0].name);
            console.log(this.$refs.child.name);
        }
     },
     components:{
         childc:{
             template:'#child',
             data(){
                 return {
                     name:'this is child component'
                 }
             },
             methods:{
                getFather(){
                    console.log(this.$parent.name);
                }
             }
         }
     }
    });
```

##### 4.插槽的认识和使用(slot)

插槽是什么？

一个组件里面，可能会根据不同的需求而有不一样的实现。

![1596372481036](C:\Users\10157\AppData\Roaming\Typora\typora-user-images\1596372481036.png)

![1596372514147](C:\Users\10157\AppData\Roaming\Typora\typora-user-images\1596372514147.png)

如图，一个商城的顶部导航栏组件在首页和分类页呈现的内容都不一样，但是通过观察我们可以发现它们的结构是一样的，那我们可不可以理解成这个组件的结构其实就是左中右三个“容器”，根据不同需求放入不同的内容呢？

插槽就是这所谓的“容器”，它就像电脑的接口，平时没有使用是空的，使用时就插入连接器。

插槽的作用：让组件根据扩展性。

如何使用呢？

```html
<template>
    <slot>这是一个插槽，只能定义在模版中，我是默认值（也可以不设置）</slot>
</template>
a)先在模版中留下插槽
b)在调用组件时，组件标签之间的内容会自动替换<slot></slot>之间的内容
```

注意！

v-slot指令在2.6.0中替换了slot和slot-scope属性

##### 5.具名插槽

什么是具名插槽？就是含有能够标识自己的name属性的插槽。

当有多个<slot>，而又需要将内容替换到某个特定<slot>时，具名插槽就发挥了作用。

```html
//如果不设置name,每个slot都有默认的name="default"
<slot name="mine"></slot>
//插入方法
<h2 v-slot:mine>
    xxxxx
</h2>
```

##### 6.编译作用域

什么是编译作用域？

一条规则说明：父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的。

##### 7.作用域插槽

当父组件提供插槽标签，内容由子组件提供时就需要使用作用域模版。

简而言之，就是给<slot>绑定一个自定义名字的属性（如：name），属性值等于其所在组件的props或者data，在父组件作用域中的调用该组件的时候，通过在组件标签上设置v-slot:xxx="name",xxx也是自定义名，这样父组件就可以获取到子组件的props或者data，然后使用{{xxx.xxx}}显示数据。

使用作用域插槽的作用就是希望数据的呈现形式能够多样化，就像原本子组件模版中<slot>里面是列表，但在使用该组件时希望<slot>里面是表格，这样作用域插槽就 方便许多。

## DAY6

##### 1.模块化开发

当在一个html文件中引用多个JS文件时,每个JS中的全局变量因为独立而可能发生重名，造成变量污染，并且html文件对每个JS文件的依赖是强制性的。由此引出了模块化开发的概念。

将每个JS文件看成是一个模块，独立互补影响。

##### 2.模块化规范(四个规范)

CommonJS(NodeJS遵循)、AMD、CMD、ES6中的Modules

模块化规范的核心就是导出和导入。

```javascript
//commonjs中的导出和导入,假设some.js和other.js在同一文件夹下
some.js:
let a =xxx;
let b =xxx;
module.exports={
    a,b
}
other.js:
const {a,b} = require('some.js')；
//ES6的Muolues规范
some.js:
let a =xxx;
let b =xxx;
export {
	a,b
}
other.js:
import {a,b} from 'some.js'
//export default:导出未命名的变量、对象、类，命名交由import决定，只能使用一个
```

##### 3.webpack的认识和使用

什么是webpack?它和gulp、grunt有什么区别？

webpack是前端模块打包工具，依赖node.js环境，注重模块管理，打包和压缩只是其附带功能，而gulp,grunt的核心是Task,由开发者编写TasK流，实现自动化打包，其没有模块的概念，实际上是自动化任务管理工具。

如何使用webapck?

```
1.首先安装node.js作为环境，再安装npm（Node packages manager）;
2.再安装webpack --->npm install webpack -g
2.安装webpack脚手架--->npm install webpack-cli -g
//实际项目开发中需要局部安装webpack
1.在项目根目录下使用终端执行命令:--->npm install webpack@xx.xx.x --save-dev,这个命令是局部安装webpack并作为开发依赖
2.npm init，这个命令会初始化，生成一个package.json文件
3.创建webpack.config.js对webpack打包进行配置
```

package.json:

```json
{
  "name": "mywebpack",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webpack --mode development",//自定义命令名，开发模式
    "build": "webpack --mode production"//自定义命令名，生产模式
  },
  "author": "",
  "license": "ISC",
  "devDependencies": {
    "webpack": "^4.44.1",
    "webpack-cli": "^3.3.12"
  }
}

```

webpack.config.js：

```javascript
const path = require('path');//导入node的path包
//webpack打包配置
module.exports = {
    entry:path.join(__dirname,'src') + '/main.js',//入口
    output:{
        path:path.join(__dirname,'dist'),//出口路径，绝对地址,通过__dirname获取路径
        filename:'bundle.js',//打包后的文件名
    },//出口
    mode:'development'//webpack4.0后需要制定mode
}
```

执行命令npm run dev

为什么要自定义命令名？

当在终端使用npm的时候，依赖的是全局变量中node包,因为命令执行时，首先检查项目文件夹node_modules中有没有依赖的包，没有则到全局变量中查找。使用自定义命令名，直接会依赖本地的webpack。这就避免了项目webpack版本和全局版本的冲突

## DAY7

##### 1.webpack中常用的loader和plugin

```javascript
//loader:
style-loader 将模块的导出作为样式添加到 DOM 中
css-loader 解析 CSS 文件后，使用 import 加载，并且返回 CSS 代码
less-loader 加载和转译 LESS 文件
url-loader 像 file loader 一样工作，但如果文件小于限制，可以返回 data URL
file-loader 将文件发送到输出文件夹，并返回（相对）URL
babel-loader 加载 ES2015+ 代码，然后使用 Babel 转译为 ES5
vue-loader 加载和转译 Vue 组件
//plugin：
Vue-loader在15版本后需要伴生的VueLoaderPlugin插件
new VueLoaderPlugin(),
html文件打包插件，可以自动导入<script>到html中
new htmlwebpackplugin(),
压缩JS文件,丑化代码
new uglifyJs(),
版权声明插件，在打包后文件开头附加版权声明
new webpack.BannerPlugin(),
//本地服务器
webpack-dev-server 为指定的文件夹提供本地服务器服务
```

##### 2.Vue-CLI

`Vue-cli`是`Vue`的项目快速构建工具，cli意为`command line interface`,俗称脚手架，它实现了快速搭建vue开发环境和对应`webpack`配置，依赖`webpack/node/npm`。

```commonlisp
//安装
npm install @vue/cli -g
//创建项目
vue create project-name
```

## DAY8

##### 1.runtime-compiler和runtime-only的区别

```
Vue的运行过程（runtime-compiler）：

a)vm.options.template解析生成AST(Abstract Syntax Tree,抽象语法树)

b)AST在转换为渲染函数vm.options.render(function)

c)渲染函数再生成虚拟DOM

d)虚拟DOM再生成UI界面

runtime-only的过程：

a)vm.options.render(function)生成虚拟DOM

b)虚拟DOM再生成UI界面
```

相比较而言，后者的代码更少（相比前者少6KB左右），性能更高，一般开发也使用后者。runtime-only的解析语法树和语法树转换渲染函数的构成交给了vue-template-compiler插件来完成。

##### 2.vue UI

VUE UI是VUE-CLI的图形化管理界面 

##### 3.vue-router的认识

什么是router？

路由本质上是映射表，vue-router就是资源和url的映射表。

vue-cli构建的是SPA（单页面富应用），它只需要向静态资源服务器请求下载一次资源，不同的页面显示通过路由来实现，路由中保存了不同资源和URL的映射关系，当用于请求对应页面(组件)时，通过路由来获取对应的组件和第一次下载的总资源中相应的一部分资源用于渲染页面。



因此，通过路由就可以实现不刷新页面来请求资源和改变页面内容，VUE-ROUTER的底层实现这一功能也是依据以下方法：

```js
1.改变url的hash值

js的BOM对象提供了对应方法：location.hash()
example:
url:www.github.com
location.hash('xxx')---->www.github.com/xxx，页面不改变

2.HTML5中history对象的pushState()方法
history.pushState({},'','xxx');
example:
url:www.github.com
history.pushState({},'','xxx');---->www.github.com/xxx，页面不改变
history.pushState({},'','xxx2');
www.github.com/xxx2，页面不改变
//返回上个地址
history.back()
www.github.com/xxx
//返回n个地址
history.go(-n)
//前进
history.forword()

注意：pushState()相当于创建了个栈结构，每次调用方法都会把内容入栈,相当于浏览器的历史记录

history.relpace()和history.pushState()的不同在于他不能返回，仅仅是替换当前URL,相当于无痕浏览
```

##### 4.vue-router的基本使用

在项目目录下创建router目录并新建index.js文件

```javascript
//路由配置相关信息
import vueRouter from 'vue-router'
import Vue from 'vue'
//导入组件
import Home from '../components/Home'
import About from '../components/About'
//通过vue.use插件安装路由插件（注册路由组件）
Vue.use(vueRouter)

//2.创建vue-router对象
const router = new vueRouter({
    //配置路由与组件的映射关系
    routes:[
        {
            //默认路由,第一次打开的页面
            path:'',
            //重定向
            redirect:'/home'
        },
        {
            path:'/home',
            component:Home
        },
        {
            path:'/about',
            component:About
        }
    ],
    mode:'history',//路径改变默认是使用URL的Hash
    linkActiveClass:'active'//活跃状态是class为active,默认是vue-router-active
})

//导出router对象到vue实例
export default router
```

导出router对象后，在vue实例中挂载

```js
new Vue({
    router
})
```

通过<router-link>标签来导航，通过<router-view>标签来显示对应路由映射的内容。

<router-link>最终会被渲染成<a>标签，可以通过修改它的属性来指定渲染的结果：

tag属性，指定渲染的效果，可以是按钮等。

replace属性,没有值，取消返回的功能

<rouer-view>标签是占位符，以上两个标签都是vue-router自动注册的两个全局标签。

## DAY9

##### 1.动态路由

我们经常需要把某种模式匹配到的所有路由，全都映射到同个组件。例如，我们有一个 `User` 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 `vue-router` 的路由路径中使用“动态路径参数”(dynamic segment) 来达到这个效果：

```javascript
const User = {
  template: '<div>User</div>'
}

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { path: '/user/:id', component: User }
  ]
})
```

现在呢，像 `/user/foo` 和 `/user/bar` 都将映射到相同的路由。

一个“路径参数”使用冒号 `:` 标记。当匹配到一个路由时，参数值会被设置到 `this.$route.params`，可以在每个组件内使用。于是，我们可以更新 `User` 的模板，输出当前用户的 ID：

```javascript
const User = {
  template: '<div>User {{ $route.params.id }}</div>'
}
```

##### 2.$route和$router区别

`vue-router`提供了`$route`和`$router`两个对象:

`$route`指向处于活跃的路由，`$router`指向用户创建的路由对象

##### 3.路由的懒加载

当不断打包构建项目时，JS包会变得很大，影响页面的加载，

由此就需要路由的懒加载：`将路由和对应组件打包到一个JS文件中，当路由被访问时才加载对应组件。`

路由懒加载的方式：

1.结合`vue`异步组件和`webpack`的代码分析（不推荐）

2.AMD方式

3.const xxx = () => import(path)  推荐

##### 4.嵌套路由

有时候需要在某个页面显示其他组件的内容，这个时候就需要嵌套路由

```js
const router = new VueRouter({
  routes: [
    { path: '/user/:id', component: User,
      children: [
        {
          // 当 /user/:id/profile 匹配成功，
          // UserProfile 会被渲染在 User 的 <router-view> 中
          path: 'profile',
          component: UserProfile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'posts',
          component: UserPosts
        }
      ]
    }
  ]
})
```

你会发现，`children` 配置就是像 `routes` 配置一样的路由配置数组，所以呢，你可以嵌套多层路由。

`routes`的重定向在`children`中同样适用

##### 5.路由参数传递的方式

a)动态路由（`params`方式）--适合单个参数

```html
<router-link :to="'/path/'+param">xxx</router-link>
```

```js
{{$route.params.param}}
```

b)query方式 --适合多个参数

URL默认格式：scheme://host:port/path?query#fragment

```html
<router-link :to="{path:'/xxxx',query:{xxx:xx,xxx:xxx}}"></router-link>
```

```javascript
{{$router.query.xxx}}
```

##### 6.全局导航守卫（钩子函数/回调函数）

作用：用于监听路由跳转

```js
//前置钩子，在路由激活之前调用
router.beforeEach((to,from,next) => {
    //do something before router active
    next();//必不可少，如果缺少，路由渲染将无法继续进行
})
//后置钩子
router.afterEach((to, from) => {
  // ...
})
```

除了全局导航守卫，还有路由内守卫，组件内守卫。

##### 7.keep-alive

<keep-alive>是`Vue`内置的组件，它的作用是缓存路由,，阻止组件的频繁创建和销毁，提高性能。

组件在被创建后会调用生命周期函数`created()`，在使用完销毁之后会调用`destoryed()`函数销毁，如果是使用频繁的组件会很影响性能，使用<keep-alive>能让组件被创建之后不会销毁。

组件的另外两个生命周期函数`activated()`和`deactivated()`必须在使用<keep-alive>时才能生效，分别是组件激活时和非激活时调用。

<keep-alive>往往被用于保存显示特定的页面或内容，在用户跳转其他页面后返回时保持原先页面不变。

## DAY10

##### 1.vuex的认识

什么是`vuex`?

官方解释：

`Vuex` 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。`Vuex` 也集成到` Vue `的官方调试工具 [devtools extension](https://github.com/vuejs/vue-devtools)，提供了诸如零配置的 time-travel 调试、状态快照导入导出等高级调试功能。

什么是**状态管理模式**？

让我们从一个简单的`Vue` 计数应用开始：

```js
new Vue({
  // state
  data () {
    return {
      count: 0
    }
  },
  // view
  template: `
    <div>{{ count }}</div>
  `,
  // actions
  methods: {
    increment () {
      this.count++
    }
  }
})
```

这个状态自管理应用包含以下几个部分：

- **state**，驱动应用的数据源；
- **view**，以声明方式将 **state** 映射到视图；
- **actions**，响应在 **view** 上的用户输入导致的状态变化。

以下是一个表示“单向数据流”理念的简单示意：

![img](https://vuex.vuejs.org/flow.png)

但是，当我们的应用遇到**多个组件共享状态**时，单向数据流的简洁性很容易被破坏：

- 多个视图依赖于同一状态。
- 来自不同视图的行为需要变更同一状态。

因此，我们为什么不把组件的共享状态抽取出来，以一个全局单例模式管理呢？在这种模式下，我们的组件树构成了一个巨大的“视图”，不管在树的哪个位置，任何组件都能获取状态或者触发行为！

通过定义和隔离状态管理中的各种概念并通过强制规则维持视图和状态间的独立性，我们的代码将会变得更结构化且易维护。

这就是` Vuex` 背后的基本思想。

**简而言之：`vuex`就是提供了一个全局的公共共享仓库，里面存放着不同组件的共同需要的状态（变量）并且是独一无二的（全局单例模式）**

##### 2.vuex的简单使用

安装完`Vuex`插件后如何使用它？

```js
import Vue from 'vue'
import Vuex from 'vuex'
//安装vuex插件
Vue.use(Vuex)
//创建Store对象
const store = new Vuex.Store({
  state: {
      //状态集
    count: 0
  },
  mutations: {
      //变更集
    increment (state) {
      state.count++
    }
  }
})
//导出Store对象
export default store
```

和router一样，为了让`Vue`组件调用`vuex`的方法必须将Store对象注入到`Vue`实例中的store属性中，也可以直接使用ES6语法直接写入：

```js
new Vue({
  el: '#app',
  store
})
```

这样，在组件中就可以通过以下方法进行操作：

```js
methods: {
  increment() {
      //提交变更来改变状态
    this.$store.commit('increment')
      //访问状态
    console.log(this.$store.state.count)
  }
}
```

**再次强调**，我们通过提交 mutation 的方式，而非直接改变 `store.state.count`，为什么？

![vuex](https://vuex.vuejs.org/vuex.png)

如图，`vue`提供了`Devtools`这个浏览器插件来帮助我们实现对状态变更的追踪，而这个插件应用的阶段就在Mutations，如果我们通过State直接修改状态则无法追踪，不利于我们对项目的调试。

在Mutations中我们定义的方法可以看做是注册事件，而通过`$store.commit()`提交mutation则可以看做是触发事件。

##### 3.Vuex之State

`Vuex`使用的是单一状态树(single source of truth),这意味着每个应用将仅仅包含一个store对象——最为‘唯一数据源’（SSOT）,state类似于组件中的data，遵循相同的规则。

##### 4.Vuex之Mutation

1.更改store中状态的唯一方式就是提交mutation

2.mutation类似于事件，需通过commit()函数来提交

3.commit()函数可以传入额外的参数作为载荷(payload)

```js
//大部分情况下payload是一个对象,这样可以传递多个值
store.commit('mutataionName',param)-->store.commit('mutataionName',{param})
//对象风格提交
store.commit({
    type:'mutationName',
    param:xxx
})
这时mutation接受的payload对象应该为：
{
    type:'mutationName',
    param:xxx
}
```

**mutation遵守`Vue`的响应规则：**

1.store中数据是响应式的，必须在state初始化状态

2.通过mutation新增状态需要使用`vue.set(obj,key,value)`方法才是响应式更新

**mutation中的类型常量**

这时很常见的做法，将常量来代替mutation事件类型：

将mutation类型名放在单独的文件中并赋值给一个常量并导出，在需要使用的时候使用常量。

```javascript
type.js:
export const NAME = 'name'
store/index.js:
import {NAME} from 'type.js'
mutataions:{
    [NAME](state) {
        //do something
    }
}
```

**mutation必须是同步函数**

```javascript
mutations: {
  someMutation (state) {
    api.callAsyncMethod(() => {
      state.count++
    })
  }
}
```

现在想象，我们正在 debug 一个 app 并且观察` devtool` 中的 mutation 日志。每一条 mutation 被记录，`devtools` 都需要捕捉到前一状态和后一状态的快照。然而，在上面的例子中 mutation 中的异步函数中的回调让这不可能完成：因为当 mutation 触发的时候，回调函数还没有被调用，`devtools `不知道什么时候回调函数实际上被调用——**实质上任何在回调函数中进行的状态的改变都是不可追踪的**。

##### 5.Vuex之Getter

类似于`Vuex`的计算属性，对state中状态进行派生操作。

getter的第一个参数默认是state,可以接受其他的getter作为第二个参数。

访问getter有两种方式：

1.通过属性访问

getter会暴露为store.getters对象，可以通过属性形式访问

```javascript
store.getters.xxxxx
```

2.通过方法访问

getter默认是不能传递参数的，但可以通过返回函数的形式来给getter传参

```javascript
getters:{
    add(state){
        return function(param){
            return param+1
        }
    }
}
---------------------------------------------------
    store.getters.add(2)//3
```

**以上两种方式的区别在于**：

使用属性访问时作为`vue`响应式系统的一部分而进行缓存，所以该方法的结果是响应式更新的；

使用方法访问时不作为`vue`响应式系统的一部分而进行缓存，每次都会重新调用该方法。

##### 6.Vuex之Action

1.类似于mutation,当action提交的是mutation,而不是直接变更状态；

2.action可以包含任意异步操作

3.action通过dispatch()进行触发

4.action支持和mutation一样的荷载方式和对象方式进行分发

```javascript
mutations:{
   addBooks(state,price) {
            state.books.push({
                name:'我是新的',
                price:price
            })
        }
},
actions:{
        //Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象  (上下文)
        add(context,payload) {
            // setTimeout(() => {
            //     console.log(payload);
            //     context.commit('addBooks',payload.price)
            // },2000)

            return new Promise((resolve,reject) => {
                setTimeout(() => {
                    context.commit('addBooks',payload.price)
                    resolve()
                })
            })
        }
    }
---------------------
    methods:{
        addBook() {
            this.$store.dispatch({
                type:'add',
                price:100
            }).then(() => {
                //成功后
                console.log('success')
            })
        }
    }
```

从上面可以知道，dispatch()可以处理被触发的action的处理函数返回的Promise并且dispatch()仍旧返回Promise

##### 7.Vuex之Module

由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。`Vuex`允许我们将store分割模块，每个模块都有独立的state,mutation,getter和action

```javascript
const firstModule = {
    state:{},
    getters:{},
    mutations:{},
    actions:{}
}
--------------------------------
modules:{
    firstModule
}

```

1.模块内部的mutation和getter接受的第一个参数是模块局部状态对象state

2.模块每部的action，通过`context.state`获取局部状态，通过`context.rootState`获取根节点状态。

3.模块内部的getter，`rootState`会作为第三个参数暴露出来:

```javascript
const firstModule = {
    state:{},
    getters:{
        doSomeThing(state,getters,rootState){
            //do
        }
    },
    mutations:{},
    actions:{}
}
```

## DAY11

##### 1.axios

什么是`axios`?

它是一个基于Promise的HTTP库。

##### 2.axios的特性

- 从浏览器中创建 [XMLHttpRequests](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)
- 从 node.js 创建 [http](http://nodejs.org/api/http.html) 请求
- 支持 [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)

##### 3.axios的使用

```js
axios提供了axios(config)API来创建请求
----------------------------
post请求：
----------------------------
axios({
  url:'/getSwiper.php',
  method:'POST',
  params:{
    //针对post请求需要携带的参数
  }
}).then(res => {
    //返回的结果
  console.log(res);
})
//axios默认返回Promise对象
----------------------------
axios默认为get请求，可以简写：axios('/xxxxx/xxx')
```

为方便起见，为所有支持的请求方法提供了别名

```js
axios.request(config)
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.options(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])
```

##### 4.并发请求

当有多个请求需要同时进行，可以使用`axios.all()`和`axios.spread()`

```js
axios.all([
  axios({
    url:'/getSwiper.php'
  }),
  axios({
    url:'/getNewsDetail.php',
    params:{
      newsid:1
    }
  })
]).then(
  // result => {
  // console.log(result);}
  //将返回的结果通过方法拆分开
  axios.spread((res1,res2) => {
    console.log(res1);
    console.log(res2);
  })
)
```

##### 5.axios的实例

当需要不同请求配置的`axios`时可以创建符合需求的`axios`实例，直接调用`axios(config)`是一个全局的方法。创建实例可以通过`axios.create()`方法返回一个指定配置的实例对象：

```js
const axiosChild = axios.create({
  baseURL:'https://www.lichenbin.top',
  timeout:5000
})
//使用方法和axios()相同
axiosChild({
    url:'xxxx',
    method:'POST'
}).then(res => {
    //do it
})
```

`axios(config)`的config对象那些属性？

常用的`baseURL`,`timeout`,`url`,`method`,`headers`,`params`,其他见[官方文档](<http://www.axios-js.com/zh-cn/docs/>)

##### 6.axios的封装

往往在项目中是不会直接使用第三方工具，因为第三方工具的稳定性不确定，为了以后不给项目造成影响，我们都需要对第三方工具进行封装，这样就算第三发工具不再维护或者项目维护需要更新工具时就能减少不必要的工作量。

`axios`的封装往往使用单独的文件：

```js
request.js
-----------------------------------
import axios from 'axios'
//封装axios
export function request(config) {
    //1.创建axios实例
    const instance = axios.create({
        baseURL:'https://www.lichenbin.top',
        timeout:5000
    })
   
    //2.发送真正的网络请求
    //实例默认返回一个Promise对象
    return instance(config)


}
-----------------------------------
 其他地方使用：
request({
    url:'xxxxxxx'
}).then(res => {
    //success
}).cath(err => {
    //failure
})
```

##### 7.axios拦截器

有时候我们需要对请求或响应的前后进行一些处理，这个时候就需要对请求或响应进行拦截，`axios`提供了拦截器。

```js
全局拦截器
---------------------------------
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  });
--------------------------------
自定义拦截器：
--------------------------------
instance.interceptors.request.use(...)
instance.interceptors.responce.use(...)
--------------------------------
```

如果需要注销拦截器：

```js
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

