# React Learning Note

## jsx语法

javascript的语法扩展/JavaScript XML

```jsx
const id = 'domID'
const context = 'this is context'
const vdom = (
    <div>
        <h1 className="xxx" id={id}>{context}</h1>
        <span style={{color:'red',fontSize:'20px'}}></span>
    </div>
)
ReactDOM.render(vdom,getElementById('xxx'))
```

![image-20220110130625384](C:\Users\10157\AppData\Roaming\Typora\typora-user-images\image-20220110130625384.png)

### 1.JSX中的注释

```jsx
render() {
    {/*这里是注释*/}
}
```

### 2.JSX中嵌入变量

```jsx
this.state = {
    //{}中调用是可见的数据类型
     a : 'xxx',
     b = 19,
     c = ['1','2']
    //{}中调用是不可见的数据类型
     d:null
     e:undefined
     f:ture
}
```

### 3.JSX中嵌入表达式

```jsx
this.state = {
    firstName:'li',
    lastName:'chenbin',
    isLogin:ture
}

render() {
    const {firstName,lastName} = this.state
    return (
        {/*运算符表达式*/}
        <h2>{firstName +''+lastName}</h2>
        <h2>{20*50}</h2>
         {/*三元表达式*/}
        <h2>{this.state.isLogin ? 'welcome':'please to login'}</h2>
         {/*函数调用*/}
        <h2>{this.getFullName()}</h2>
    )
}
getFullName() {
    return this.state.firstName +''+this.state.lastName
}
```

# JSX本质

JSX的本质其实是`React.createElement(component,props,...children)`的语法糖

```js
createElement(type,config,children)
//type:创建元素的类型，标签元素使用对应标签名，组件元素使用组件名
//config:所有JSX中的属性都在config中以对象的属性和值的形式保存
//children:存放标签内容，以数组的形式
```

`React.createElement`最终创建出一个ReactElement对象，该对象组成一个Javascript对象树，这就是虚拟DOM。再通过`ReactDOM.render`映射到真实DOM。

# React组件化

## 1.类组件和函数式组件的区别：

类组件要考虑`this`,有内部状态

函数组件没有`this`,没有内部状态，没有生命周期

```jsx
//类组件
export default class App extend React.Component{
    render() {
        return (
        <h2>这是一个类组件</h2>
        )
    }
}
//函数式组件
export default function App() {
    return (
    <h2>这是一个函数式组件</h2>
    )
}
```

## 2.render()函数的返回值

`render()`被调用时，它会检查`this.props`和`this.state`的变化并返回以下类型：

- React元素（通过JSX创建）

- 数组或fragments（可以返回多个元素）

- Portals（可以渲染子节点到不同的DOM树）

- 字符串或数值类型

- 布尔类型或Null

  

## 3.生命周期与常用生命周期函数

一个抽象的概念，分为很多个阶段：装载阶段（Mount），更新阶段（Update），卸载阶段（Unmount）。 

![image-20220404093315451](C:\Users\10157\AppData\Roaming\Typora\typora-user-images\image-20220404093315451.png)

### Constructor()

如果不初始化state或不进行方法绑定，则不需要为React组件实现构造函数。`constructor`通常只做两件事：通过给`this.state`赋值对象来初始化内部的`state`;为事件绑定实例(`this`)。

### componentDidMount()

该方法会在组件挂载后立即调用，通常在该方法中做如下操作：

- 依赖于DOM的操作
- 发送网络请求最好的地方
- 可以在此处添加一些订阅（会在`componentWillUnmount`取消订阅）

### componentDidUpdate()

该方法在更新后立即调用，首次渲染不执行。当组件更新后，可以在此处对DOM进行操作；如果对更新前后的props进行了比较，可以选择再此处进行网络请求。

### componentWillUnmount()

在组件卸载及销毁之前调用。在此方法中执行必要的清理操作，例如清除timer，取消网络请求或清除在`componentDidMount()`中创建的订阅等。



# 组件间的通信

## 1.类组件中的父组件和子组件-父传子

```js
//子组件
class ChildCpn extends Component {
    //父组件通过props将数据传递给子组件
    /*    constructor(props) {
           //使用super将props保存至父类，子类就可以使用
           super(props)
           
           不使用super()保存依旧可以在render()中使用props,因为React默认将props保存至父类
       } */
    //默认为以上，因此constructor方法可以删除
    render () {
        const { name, age } = this.props
        return (
            <h2>类子组件展示数据：{name},{age}</h2>
        )
    }
}
//父组件
export default class FatherCpn extends Component {
    render () {
        return (
            <div>
                <ChildCpn name='li' age='18'></ChildCpn>
            </div>
        )
    }
}
```

## 2.函数式组件的父组件和子组件-父传子

```js
//子组件
function ChildCpn (props) {
    //父组件通过props将数据传递给子组件
    const { name, age } = props
    return (
        <h2>函数子组件展示数据：{name},{age}</h2>
    )

}
//父组件
export default class FatherCpn extends Component {
    render () {
        return (
            <div>
                <ChildCpn name='li' age='18'></ChildCpn>
            </div>
        )
    }
}
```

## 3.属性验证

父组件传递给子组件的数据可以是`string`类型，也可以是`number,array,boolean,object,function,symbol`等原生JS类型，因此在复杂的大型项目中我们需要使用Flow或Typesctipt来进行类型检查。React也提供了类型检查的方法，包含在`prop-types`库中。`PropTypes` 提供一系列验证器，可用于确保组件接收到的数据类型是有效的。在本例中, 我们使用了 `PropTypes.string`。当传入的 `prop` 值类型不正确时，JavaScript 控制台将会显示警告。出于性能方面的考虑，`propTypes` 仅在开发模式下进行检查。

```js
//使用该库来验证属性
import PropTypes from 'prop-types'

//子组件
function ChildCpn (props) {
    //父组件通过props将数据传递给子组件
    const { name, age, books } = props
    return (
        <h2>函数子组件展示数据：{name},{age},{books.map(item => { return <li>{item}</li> })}</h2>

    )

}
//验证属性，不是对应的数据类型的数据会在控制台输出警告
ChildCpn.propTypes = {
    name: PropTypes.string.isRequired,
    age: PropTypes.number,
    books: PropTypes.array
}
```

## 4.跨组件通信

React提供了一个API用于实现跨组件通信，而不需要层层依次传递。

```js
const myContext = React.createContext(defaultValue)
//创建一个共享的Context对象,一个组件如果订阅了context,那么该组件会从离自身最近的匹配的Provider中获取当前context值。defaultValue是组件在顶层查找中没有找到对应的Provider而使用的默认值。
Context.Provider
//每个Context对象返回一个Provider React组件，Provider接收一个value属性，传递给消费组件；一个Provider可以和多个消费组件有对应关系。
Class.contextType
//挂载在class上的contextType属性会被重赋值为一个由React.createContext()创建的Context对象，可以使用this.context来使用Context上的值且在任何生命周期中都能访问。
```

# setState详解

## 1.为什么使用`setState`

在React中不能直接修改`state`中的数据，直接修改因不能响应式地让界面发生更新，必须使用`setState()`方法对`state`中数据修改。

## 2.为什么类组件中能使用`setState`

`setState()`在类组件中为什么能被使用？因为每个类组件继承`Component`，而`setState()`在`Component`中被定义。

## 3.`setState`是异步更新

在`setState()`中更新数据后不能立即获得最新的更新后结果，因为该方法是异步的。为什么`setState()`要设计成异步操作？

- `setState`设计成异步，可以显著提升性能。——每次调用`setState()`进行一次更新操作，则意味着`render`函数会被频繁地调用，界面重新渲染，导致效率低。使用异步操作，先获取多个更新，再批量更新。
- 保持`state`和`props`的一致性。——如果同步更新了`state`,但还未执行`render`函数，那么`state`和`props`不能保持同步。

## 4.如何获取异步更新后的数据

```js
//方式1.使用回调函数,setState()第二个参数接受一个回调函数
this.setState({
    message:'after message'
},() => {
    console.log(this.state.message)
})
//方式2.在生命周期中获取
componentDidUpdate() {
     console.log(this.state.message)
}
//方式2优先于方式1
```

## 5.将`setState`变为同步操作

```js
//方式一：将setState放入到定时器中
setTimeOut(() => {
    this.setState({
    message:'after message'
})
    console.log(this.state.message)
},0)
//方式二，将setState放入到原生DOM事件中
componentDidUpdate() {
    document.getElementById('btn').addEventListener("click",e => {
          this.setState({
    message:'after message'
})
    console.log(this.state.message)
    })
}
```

## 6.`setState`一定是异步吗

`setState`不一定是异步的。

在React的组件生命周期中和合成事件中，`setState`是异步的。

在setTimeOut和原生DOM事件中，`setState`是同步的。

## 7.`setState`中的数据合并

```js
this.state = {
    num1:100,
    num2:200
}

this.setState({
    num1:200
})
//React将setState传入的对象和this.state使用Object.assign({},{ num1:200},this.state)进行了属性合并并返回一个新的对象，num2不会被覆盖和丢失。
```

## 8.`setState`的自身合并

```js
this.setState({
    num1:this.state + 1
})
this.setState({
    num1:this.state + 1
})
this.setState({
    num1:this.state + 1
})
//连续调用多次相同的setState并不会在结果上累加，React会将相同的更新合并，因此num1始终都只加上1
this.setState((prevState,props) => {
    return {
        num1:prevState.num1 +1
    }
})
this.setState((prevState,props) => {
    return {
        num1:prevState.num1 +1
    }
})
this.setState((prevState,props) => {
    return {
        num1:prevState.num1 +1
    }
})
//传入函数实现多次相同调用累加结果，结果加上3
```

# React更新机制

React渲染流程：JSX—>虚拟DOM—>真实DOM

React更新流程：

![image-20220408163352597](C:\Users\10157\AppData\Roaming\Typora\typora-user-images\image-20220408163352597.png)

新旧DOM树如果进行完全比较的算法复杂度是O(n^3)，这样的做法开销过于昂贵。React采用了优化的Diff算法——同层结点之间相互比较，不会跨结点比较；不同类型的结点产生不同的树结构；开发过程中可以通过key来指定哪些结点在不用的渲染下保存稳点。

## 1.keys的优化

子结点遍历比较，不一样则产生一个`mutation`。而在列表遍历中，正确使用`key`可以提升diff性能。

对一个<ul>列表进行更新：

方式一，在最后位置插入数据，这种情况`key`意义不大。

方式二，在前面插入数据，这种情况下所有的<li>都需要进行修改。

当子元素拥有`key`时，React使用`key`来匹配原有树上的子结点和最新树上的子结点，像在前面插入一个元素就可以通过`key`来匹配相同子结点，并进行位移，再新增元素。

- key应该是唯一的
- 不能使用随机数
- 使用index作为key性能没有优化

## 2.render函数调用优化

在嵌套组件中，父子组件在第一次渲染时调用一次各自的render函数。但是，但父组件的state/props发生改变调用render函数渲染更新时，子组件的render函数还会被再次调用，这是浪费性能且无意义的。

![image-20220408175702816](C:\Users\10157\AppData\Roaming\Typora\typora-user-images\image-20220408175702816.png)

点击按钮，父组件`App`数据更新，子组件`render`函数被再次调用。

![image-20220408175903839](C:\Users\10157\AppData\Roaming\Typora\typora-user-images\image-20220408175903839.png)

如何不让未更新的类子组件调用`render`函数来达到性能优化？

方式一:

```js
shouldComponentUpdate(nextProps,nextState) {
    //此处可以对props/state进行判断来决定是否需要更新该组件
    //不建议在此处进行深层比较，影响性能
    return false
}
//该方法返回一个布尔值，false表示阻断render函数,ture表示不阻断render函数
```

方式二：

```js
class App extends PureComponent {
    render() {
        return (...)
    }
}
//继承PureComponent的组件会自动判断是否需要更新
```

如何不让未更新的函数子组件调用`render`函数来达到性能优化？

```js
import {memo} from 'react'
const MemoFooter = memo(function Footer () {
    console.log('Footer render函数被调用')
    return (
        <h2>我是底部</h2>
    )
})
//使用memo来优化函数式组件
```

# 高阶组件（HOC,higher-order components）

高阶函数接受一个或多个函数作为输入，输出一个函数。

高阶组件本身是一个高阶函数，接受一个组件作为输入，输出一个组件。

## 1.高阶组件的定义

定义方式：

```js
//const NewCnp = enhanceCnp(OldCnp)

function enhanceComponent (WarppedComponent) {
    class NewComponent extends PureComponent {
        render () {
            return <WarppedComponent/>
        }
    }
    return NewComponent
}
```

组件名是可以省略的——在ES6中，类表达式的类名是可以省略的。

```js
const a = class Person {}

const a = class {}
//类似于函数的定义
```

组件名在组件内部是可以修改的，方便在开发者工具中查看：

```js
AComponent.displayName = 'BComponent'
```

## 2.高阶组件的应用

劫持`props`:

```js
function enhanceProps (WarppedComponent) {
    return props => {
        return <WarppedComponent {...props} gender="男" />
    }
}
```

劫持JSX:

```js
function withAuth (WrappedCompnent) {
    return props => {
        const { isLogin } = props
        if (isLogin) {
            return <WrappedCompnent {...props} />
        }
        return <LoginPage />
    }
}
```

劫持生命周期：

```js
function withRenderTime (WarppedComponent) {
    return class extends PureComponent {
        UNSAFE_componentWillMount () {
            this.beginTime = Date.now()
        }
        componentDidMount () {
            this.endTime = Date.now()
            console.log(`${WarppedComponent.name}的渲染时间为：`,this.endTime - this.beginTime)
        }
        render () {
            return <WarppedComponent {...this.props} />
        }
    }
}
```

## 3.高阶组件的意义

可以利用高阶组件对某些React代码进行更加优雅的处理。

相比于早期React提供的组件复用方法——Mixin，现在已经不推荐使用。

Mixin可能会相互依赖，相互耦合，不利于代码维护；不用的Mixin中方法可能会冲突；Mixin非常多时，组件是可以感知到的，做相关的处理会造成滚雪球式的复杂性。

## 4.高阶组件的缺陷

大量使用HOC会产生非常多的嵌套，不利于调试。

HOC劫持`props`在不遵守约定的情况下可能造成冲突。

## 5.Hooks是更好的方案

Hooks解决了this的指向问题，HOC的嵌套复杂度的问题。

# Portals的使用

Portal 提供了一种将子节点渲染到存在于父组件以外的 DOM 节点的优秀的方案。

```js
ReactDOM.createPortal(child, container)
```

第一个参数（`child`）是任何可渲染的 React 子元素]，例如一个元素，字符串或 fragment。第二个参数（`container`）是一个 DOM 元素。

# Fragments的使用

React 中的一个常见模式是一个组件返回多个元素。Fragments 允许你将子列表分组，而无需向 DOM 添加额外节点。

```js
render() {
  return (
    <React.Fragment>
      <ChildA />
      <ChildB />
      <ChildC />
    </React.Fragment>
  );
}
```

# 严格模式StrictMode

`StrictMode` 是一个用来突出显示应用程序中潜在问题的工具。与 `Fragment` 一样，`StrictMode` 不会渲染任何可见的 UI。它为其后代元素触发额外的检查和警告。严格模式检查仅在开发模式下运行；*它们不会影响生产构建*。

```js
import React from 'react';

function ExampleApplication() {
  return (
    <div>
      <Header />
      <React.StrictMode>
        <div>
          <ComponentOne />
          <ComponentTwo />
        </div>
      </React.StrictMode>
      <Footer />
    </div>
  );
}
```

在上述的示例中，*不*会对 `Header` 和 `Footer` 组件运行严格模式检查。但是，`ComponentOne` 和 `ComponentTwo` 以及它们的所有后代元素都将进行检查。

`StrictMode` 目前有助于：

- 识别不安全的生命周期
- 关于使用过时字符串 ref API 的警告
- 关于使用废弃的 findDOMNode 方法的警告
- 检测意外的副作用
- 检测过时的 context API
- 检测不安全的副作用

# React中的样式

组件化的css解决方案应该符合以下条件：

- 可以编写局部css：css具备自己的作用域，不会随意污染其他组件。
- 可以编写动态的css：可以获取组件的一些状态生成不同的css。
- 支持所有的css特性：伪类，动画，媒体查询。
- 编写起来简洁方便。

## 1.内联样式

style接受一个采用小驼峰命名的对javascript对象，而不是CSS字符串，并且可以接受state中的状态来设置相关状态。

优点：样式之间不会冲突；可以动态获取当前state中的状态。

缺点：写法上需要驼峰标识；某些样式没有提示；大量的样式代码混乱；无法编写某些样式（伪类/伪元素）

## 2.普通样式

对应的组件引用独立的一个css文件。

优点：组件之间样式不会冲突，大量代码不会混乱

缺点：父组件的样式会层叠掉子组件的样式

## 3.css module

将每个css文件看作是一个模块，命名为xxx.module.css，在使用的时候导入。如下，style.module.css中有.title类选择器。

```js
import style from './style.module.css'
```

```jsx
<h2 style={style.title}>hello world</h2>
```

React内置了css module的配置，解决了局部作用域的问题，但是无法实现某些类名，必须使用{module.className}方式使用，并且无法动态修改样式。

## 4.CSS-In-Js

css-in-js是指一种模式，其中css由javascript生成而不是外部文件中定义，由第三方库提供。

目前比较流行的css-in-js的库：

- styled-components

- emotion

- glamorous

  

# React-transition-group

React提供的过渡动画库。

## 1.CSSTransition

`CSSTransition appear`在, `enter` 和`exit`过渡状态期间应用一对类名。应用第一个类，然后应用第二个`*-active`类以激活 CSS 过渡。转换后，应用匹配的`*-done`类名来保持转换状态。

`in`接受接受一个布尔值来控制显示和隐藏。

`className`自定义类名，被自动应用到CSSTransition的类名中。

在组件出现、进入、退出或完成过渡时应用于组件的动画类名。可以提供一个名称，每个阶段都会加上后缀，例如`classNames="fade"`应用如下：

- `fade-appear`, `fade-appear-active`,`fade-appear-done`
- `fade-enter`, `fade-enter-active`,`fade-enter-done`
- `fade-exit`, `fade-exit-active`,`fade-exit-done`

`timeout`来控制class添加的时间而不是动画的持续时间。

`unmountOnExit`接受一个布尔值，控制动画退出后是否卸载组件。

`appear`来控制出现时的动画，例如刷新页面后依旧显示动画

生命周期函数如下：

```jsx
 render () {
        const { isShow } = this.state
        return (
            <div>
                <CSSTransition
                    in={isShow}
                    classNames='title'
                    timeout={300}
                    unmountOnExit={true}
                    appear
                    onEnter={e => console.log('开始进入')}
                    onEntering={e => console.log('正在进入')}
                    onEntered={e => console.log('进入结束')}
                    onExit={e => console.log('开始退出')}
                    onExiting={e => console.log('正在退出')}
                    onExited={e => console.log('退出结束')}
                >
                    <h2>CSStransitionDemo</h2>
                </CSSTransition>
                <button onClick={e => this.change()}>切换</button>
            </div>
        )
    }
```

```css
.title-enter ,.title-appear{
  opacity: 0;
  transform: scale(0.6);
}

.title-enter-active,.title-appear-active {
  opacity: 1;
  transform: scale(1);
  transition: all 300ms;
}
.title-enter-done,.title-appear-done {
  opacity: 1;
}

.title-exit {
  opacity: 1;
  transform: scale(1);
}

.title-exit-active {
  opacity: 0;
  transform: scale(0.6);
  transition: opacity 300ms, transfirm 300ms;
}

.title-exit-done {
  opacity: 0;
}


```

## 2.SwitchTransition

用于切换两个组件。

```jsx
 render () {
        const { isOn } = this.state
        return (
            <div>
                <SwitchTransition mode='out-in'>
                    <CSSTransition key={isOn ? 'on' : 'off'} classNames='btn' timeout={1000}>
                        <button onClick={e => this.setState({ isOn: !isOn })}>{isOn ? 'on' : 'off'}</button>
                    </CSSTransition>
                </SwitchTransition>

            </div>
        )
    }
```

## 3.TransitionGroup

一般用于列表的动画。

```jsx
 render () {
        return (
            <TransitionGroup>
                {
                    this.state.names.map((item, index) => {
                        return (
                            <CSSTransition
                                key={index}
                                classNames='listItem'
                                timeout={5000}>
                                <div>{item}</div>
                            </CSSTransition>
                        )
                    })
                }
                <button onClick={e => this.addNames()}>添加name</button>
            </TransitionGroup>
        )
    }
```

# Redux

Redux 是 JavaScript 应用的**状态容器**，提供可预测的状态管理。可以让你开发出行为稳定可预测的应用，运行于不同的环境（客户端、服务器、原生应用），并且易于测试。

Redux 除了和 React 一起用外，还支持其它界面库。它体小精悍（只有2kB，包括依赖），却有很强大的插件扩展生态。

## 1.基本概念

`state`描述应用的状态，例如：

```js
{
  todos: [{
    text: 'Eat food',
    completed: true
  }, {
    text: 'Exercise',
    completed: false
  }],
  visibilityFilter: 'SHOW_COMPLETED'
}
```

`action`是一个普通的JavaScript对象，用来描述更新`state`.。例如：

```js
{ type: 'ADD_TODO', text: 'Go to swimming pool' }
{ type: 'TOGGLE_TODO', index: 1 }
{ type: 'SET_VISIBILITY_FILTER', filter: 'SHOW_ALL' }
```

`reducer`是为了将`state`和`action`联系起来，它是一个纯函数（确定输入，确定输出，不会因为环境和条件改变而改变输出结果，并且在调用时没有副作用——修改其他变量）,接收`state`和`action`作为参数并返回新的`state`，这就是`reducer`。

## 2.Redux的三大原则

- 单一数据源——这个应用程序的`state`被存储在棵object tree中，并且这个obejct tree只存储在一个sore中
- `state`是只读的——唯一修改`state`的方法一定是触发`action`，这样保证所有的修改都被集中化处理，并按严格顺序执行，因此不需要担心race condition(竞态)
- 使用纯函数来执行修改——`reducer`可以被拆分成多个小的`reducers`来分别处理object tree中的各个部分，但每个`reducers`必须是纯函数。

## 3.理解Redux的运行机制

![Redux data flow diagram](https://redux.js.org/assets/images/ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif)

## 4.React-redux

**React-Redux 是 React 的官方 Redux UI 绑定库**。

虽然可以手动编写 Redux 存储订阅逻辑，但这样做会变得非常重复。此外，优化 UI 性能需要复杂的逻辑。

订阅`store`、检查更新数据和触发重新渲染的过程可以变得更加通用和可重用。**像 React-Redux 这样的 UI 绑定库处理store交互逻辑，因此不必自己编写该代码。**

### 1.Provider

要想在应用程序中获取`store`中的数据，需要使用react-redux提供的`<Provider/>`API来包裹。

```js
//store由redux创建
import React from 'react'
import ReactDOM from 'react-dom/client'
import store from './store'
import { Provider } from 'react-redux'
import App from './App'


const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

### 2.connect()

`connect`函数是react-redux提供从redux的`store`中读取数据的方法，并在`store`更新时重新读值。

`connect`函数有两个参数，都是可选的：

- `mapStateToProps`：每次`store`状态改变时调用。它接收整个存储状态，并应返回该组件所需的数据对象。
- `mapDispatchToProps`: 这个参数可以是一个函数，也可以是一个对象。
  - 如果它是一个函数，它将在组件创建时调用一次。它将`dispatch`作为参数接收，并应返回一个对象，其中包含用于`dispatch`调度操作的函数。
  - 如果它是一个充满动作创建者的对象，每个动作创建者都会变成一个 prop 函数，在调用时会自动调度其动作。**注意**：我们建议使用这种“对象速记”形式。

`connect`函数返回一个高级函数（高级组件），该函数接受一个React组件，并返回一个的包裹着输入组件的新的React组件。所有的动作发起和数据通过组件的`props`传递给输入组件。

```js
//示例：
const mapStateToProps = state => {
    return {
        counter: state.counter,
        banners: state.banners,
        recommends: state.recommends
    }
}
const mapDispatchToProps = dispatch => {
    return {
        increment () {
            dispatch(addAction(10))
        },
        decrement () {
            dispatch(subAction(5))
        }
    }
}
connect(mapStateToProps, mapDispatchToProps)(Home)
```

```js
//connect函数本质
function connect (mapStateToProps, mapDispatchToProps) {
    return function enhanceHOC (WrappedComponent) {
        class EnhanceComponent extends PureComponent {
            render () {
                return <WrappedComponent {...this.props}
                    {...mapStateToProps(this.context.getState())}
                    {...mapDispatchToProps(this.context.dispatch)}
                />
            }
        }
        EnhanceComponent.contextType = storeContext
        return EnhanceComponent
    }
}
```

`connect()`方法编写起来不够方便，代码过多，Redux也提供了类似作用的Hooks方便在函数式组件中使用，且更加方便。

- useDispatch()，返回store中的dispatch()方法

- useSelector（），接受两个参数，第一个是selector函数，该函数会被store的state回调；第二个参数是可选的比较函数EqualityFn，用于判断组件是否需要重新渲染，该函数主要用于性能优化。

  **注意**：默认的EqualityFn函数将useSelector的回调函数返回的对象进行全等比较，返回布尔值，为false则组件会重新渲染。这是不合理的，函数每次返回的对象都是不全等的，我们需要进行浅层比较，来减少不必要的重新渲染。浅层比较的使用可以用redux提供的shallowEqual函数。

  ![image-20220424203628431](C:\Users\10157\AppData\Roaming\Typora\typora-user-images\image-20220424203628431.png)

  ![image-20220424203558558](C:\Users\10157\AppData\Roaming\Typora\typora-user-images\image-20220424203558558.png)

```js
//例子
const { topBanner } = useSelector(state => ({
        topBanner: state.recommend.topBanner
    }), shallowEqual)
    const dispatch = useDispatch()
    //发送网络请求
    useEffect(() => {
        dispatch(getRecommendBannerAction())
    }, [dispatch])
    return (
        <div>{topBanner.length}</div>
    )
})
```

## 5.Redux-thunk

“thunk”这个词是一个编程术语，意思是“一段执行一些延迟工作的代码”。与其现在执行一些逻辑，不如编写一个函数体或代码，以便以后执行工作。

特别是对于 Redux，**“thunk”是一种编写函数的模式，其中包含可以与 Redux 存储`dispatch`和`getState`方法**交互的逻辑。

使用 thunk 需要将redux-thunk**中间件**作为配置的一部分添加到 Redux 存储中。

Thunk 是在 Redux 应用程序中编写异步逻辑的标准方法，通常用于数据获取。但是，它们可以用于各种任务，并且可以包含同步和异步逻辑。

redux-thunk的一般解决方案：

![image-20220417204406058](C:\Users\10157\AppData\Roaming\Typora\typora-user-images\image-20220417204406058.png)

一个在redux中使用axios请求数据（异步操作）的例子：

```js
//redux-thunk中定义的Action函数
export const getMultidataAction = dispatch => {
    axios({
        url: 'http://123.207.32.32:8000/home/multidata'
    }).then(res => {
        console.log(res.data.data.recommend)
        dispatch(changeBannersAction(res.data.data.banner.list))
        dispatch(changeRecommendsAction(res.data.data.recommend.list))
    }).catch(err => {
        console.log(err)
    })
}
```

```js
//mapDispatchToProps中定义getMultidata函数，该函数调用dispatch函数并传入定义好的action函数
const mapDispatchToProps = dispatch => {
    return {
        getMultidata () {
            dispatch(getMultidataAction)
        }
    }
}
```

```js
//组件生命周期中调用   
    componentDidMount () {
        this.props.getMultidata()
    }
```

## 6.Redux-saga

和Redux-thunk一样作为中间件使用，它使用看起来同步的生成器函数来处理异步逻辑。

Redux-saga的引入和启用：

```js
import createSagaMidware from 'redux-saga'

//创建redux-saga中间件
const sagaMidware = createSagaMidware()
//redux中应用saga中间件
const storeEnhancer = applyMiddleware(sagaMidware)
const store = createStore(reducer, storeEnhancer)
//redux-saga启用
sagaMidware.run(saga)
```

使用sagas进行异步逻辑操作：

```js
import axios from 'axios'
import { takeEvery, put, all } from 'redux-saga/effects'
import { FETCH_ABOUT_MULTIDATA } from './home/constants'
import { changeBannersAction, changeRecommendsAction } from './home/actionCreators'

function* fetchAboutMultidata (action) {
    const res = yield axios.get('http://123.207.32.32:8000/home/multidata')
    const banners = res.data.data.banner.list
    const recommends = res.data.data.recommend.list
    // yield put(changeBannersAction(banners))
    // yield put(changeRecommendsAction(recommends))
    yield all([
        yield put(changeBannersAction(banners)),
        yield put(changeRecommendsAction(recommends))])
}

//定义一个生成器函数来监听对应类型的action
function* Mysaga () {
    //yield takeLatest 依次只能监听一个action
    //yield takeEvery 每个action都会被执行
    yield takeEvery(FETCH_ABOUT_MULTIDATA, fetchAboutMultidata)
}

export default Mysaga
```

JavaScript补充：generator函数

```js
//生成器函数
function* foo() {
    yield 'first';
    yield 'second';
    yield 'third';
}
//foo返回一个迭代器
const result = foo()
//result迭代器每执行一次next()方法，就会执行一个yield后的代码并返回一个对象
cosnt string1 = result.next()//string1:  {value:'first',done:false}
cosnt string2 = result.next()//string2:  {value:'second',done:false}
cosnt string3 = result.next()//string3:  {value:'third',done:false}
cosnt string4 = result.next()//string4:  {value:undefined,done:true}
```

## 7.React中的状态管理

React中的状态管理是否全部需要Redux来处理？

- 组件内部可以维护的状态应该交给组件自己来维护。
- 大部分需要共享的状态应该交给Redux来维护。
- 大部分的网络请求应该交给Redux来维护。

# React-router(v6.)

## 1.基本使用

<Link/>会被渲染成<a/>标签。

v6版本将Switch换成了Routes,更好地处理路径匹配。

React Router v6 introduces a `Routes` component that is kind of like `Switch`, but a lot more powerful. The main advantages of `Routes` over `Switch` are:

- All `<Route>`s and `<Link>`s inside a `<Routes>` are relative. This leads to leaner and more predictable code in `<Route path>` and `<Link to>`
- Routes are chosen based on the best match instead of being traversed in order. This avoids bugs due to unreachable routes because they were defined later in your `<Switch>`
- Routes may be nested in one place instead of being spread out in different components. In small to medium-sized apps, this lets you easily see all your routes at once. In large apps, you can still nest routes in bundles that you load dynamically via `React.lazy`

```jsx
import { BrowserRouter, Link, Routes, Route } from 'react-router-dom'

 render () {
    return (
      <div>
        <BrowserRouter>
          <Link to='/'>首页</Link>
          <Link to='/about'>关于</Link>
          <Link to='/profile'>我的</Link>

          {/** v5版本的写法
            <Route end path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/profile" component={Profile} />
           */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>

        </BrowserRouter>
      </div>
    )
  }
```

`end`属性的作用是在其后代路径匹配时取消当前<Link>或<NavLink/>的`active`

### v6版本中常用的组件和Hooks:

| 组件名      | 作用           | 说明                                                         |
| :---------- | :------------- | :----------------------------------------------------------- |
| `<Routers>` | 一组路由       | 代替原有`<Switch>`，所有子路由都用基础的Router children来表示 |
| `<Router>`  | 基础路由       | Router是可以嵌套的，解决原有V5中严格模式，后面与V5区别会详细介绍 |
| `<Link>`    | 导航组件       | 在实际页面中跳转使用                                         |
| `<Outlet/>` | 自适应渲染组件 | 根据实际路由url自动选择组件                                  |

| hooks名           | 作用                                  | 说明                      |
| :---------------- | :------------------------------------ | :------------------------ |
| `useParams`       | 返回当前参数                          | 根据路径读取参数          |
| `useNavigate`     | 返回当前路由                          | 代替原有V5中的 useHistory |
| `useOutlet`       | 返回根据路由生成的element             |                           |
| `useLocation`     | 返回当前的location 对象               |                           |
| `useRoutes`       | 同Routers组件一样，只不过是在js中使用 |                           |
| `useSearchParams` | 用来匹配URL中?后面的搜索参数          |                           |

## 2.重定向

v6版本将v5的<Redirect/>替换成<Navigate/>并在类组件中使用，在函数式组件中推荐使用<useNavigate/>

```jsx
import React, { PureComponent } from 'react'
import { Navigate } from 'react-router-dom'
export default class Category extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: false
        }
    }

    render () {
        return this.state.isLogin ? ((
            <div>
                <ul>
                    <li>1</li>
                    <li>2</li>
                    <li>3</li>
                    <li>4</li>
                    <li>5</li>
                </ul>
            </div>
        )) : <Navigate to='/' replace={true} />
    }
}

```

## 3.路由嵌套

在父组件的路由路径上进行深度匹配要使用`*`，`*`只能放在末尾;对于NotFound类路由使用`*`代替。

组件内部发生改变，使用<Outlet/>来渲染子路由对应的组件。

```jsx
//App.js
<Routes>
    <Route path="/profile" element={<Profile />}>
       <Route path='userInfo' element={<UserInfo />} />
       <Route path='address' element={<Address />} />
       <Route path='walet' element={<Walet />} />
    </Route>
        <Route path='*' element={<NoMatch />} />
</Routes>
```

```jsx
//profile组件
<NavLink to='userInfo'>个人资料</NavLink>
<NavLink to='address'>收货地址</NavLink>
<NavLink to='walet'>钱包</NavLink>
<Outlet />
```

## 4.动态路由

```jsx
<Route path='/detail/:id' element={<Detail />} />
```

动态路由的参数只能在函数式组件中使用React-router提供的Hooks来获取。

```jsx
import { useParams } from 'react-router-dom'
export default function Detail () {
    const { id } = useParams()
    return (
        <div>
           {id}
        </div>
    )
}
```

## 5.参数传递

一、动态路由的方式，如上。

二，使用search。

```jsx
//App.js
//字符串形式
<NavLink to={`/detail?${id}`}>详情</NavLink>
//对象形式
<NavLink to={{
        pathname:'detail',
        search:`id=${id}`
    }>详情</NavLink>

<Route path='/detail' element={<Detail />} />
```

```js
//detail.js
//使用字符串形式时
import { useSearchParams } from 'react-router-dom'
//useSearchParams钩子返回searchParams和setSearchParams函数
//通过searchParams.get(key)来获取search的参数，setSearchParams({key:value})来改变路由
let [searchParams] = useSearchParams()
const id = searchParams.get('id')

//使用对象形式时,id=5
import { useLocation } from 'react-router-dom'
console.log(useLocation())//{pathname: '/detail2', search: '?id=5', hash: '', state: null, key: 't6ls32bo'}
```

三，使用state。

```jsx
const info = {name:'coder',age:20}
<NavLink to='/detail3' state={info}>详情3</NavLink>
```

```js
import { useLocation } from 'react-router-dom'
export default function Detail3 () {
    const { name, age } = useLocation().state
    return (
        <div>
            name:{name},age:{age}
        </div>
    )

}
```

## 6.useRoutes

The `useRoutes` hook is the functional equivalent of <Routes>, but it uses JavaScript objects instead of <Route>elements to define your routes. These objects have the same properties as normal <Route>elements, but they don't require JSX.

The return value of `useRoutes` is either a valid React element you can use to render the route tree, or `null` if nothing matched.

`userRoutes`是React-router v6版本用来替代v5版本的`react-router-config`库的一个钩子函数，它接受一个数组，返回一个React元素并渲染到路由树中。

```js
import { useRoutes } from 'react-router-dom'
import Home from '../pages/home'
import NoMatch from '../pages/noMatch'
import {  Profile, UserInfo } from '../pages/profile'

const MyRoutes = () => {
    const routes = useRoutes([
        {
            path: '/',
            element: <Home />
        },
        {
            path: '/profile',
            element: <Profile />,
            children: [
                {
                    path: 'userInfo',
                    element: <UserInfo />
                }
            ]
        },
      //NotFound
        {
            path: '*',
            element: <NoMatch />
        }
    ])
    return routes
}


export default MyRoutes
```

```jsx
import MyRoutes from './router'
function APP() {
    return (
        <Router>
        {
        MyRoutes()
    	}  
        </Router>
    )
}
```

# React Hooks

## 1.函数式组件的缺点

- 类组件有自己的state用来保存内部的状态，而函数式组件则不能维持内部定义的变量。
- 类组件有自己的生命周期并可以在相应的生命周期里完成相应的逻辑且只执行一次，函数式组件内执行的逻辑在每次重新渲染时都会执行一次。
- 类组件在状态改变时只会重新执行render函数并可以自定义执行生命周期函数，而函数式组件在重新渲染时会整个执行，无法控制局部。

## 2.Hooks的出现

类组件相比函数式组件也存在不足，在应用程序逐步复杂时，一个类组件可能会变得非常复杂，各种逻辑堆在一个类组件内部且不好拆分，并且类组件需要注意this的使用，Hooks的出现让函数式组件在拥有类组件的特性同时也避免了类组件的不足。

Hooks的使用场景几乎可以覆盖所有能使用类组件的地方，它只能在函数式组件中使用（不包括自定义Hooks）

## 3.Hooks——useState()

**`useState`钩子函数解决了在函数式组件中使用state的问题**。

`useState`钩子函数接受一个参数作为state的初始化值，返回一个数组。

数组包含两个元素，第一个元素是类似类组件的state，第二个元素是更新state的函数。

`initialState`可以是一个直接的数据，也可以是一个函数，该函数返回state

`setstate`函数可以直接传入state，也可以传入一个函数来获取前一次的state，类似于类组件中的`this.setState`，可以避免合并操作。

```js
 const [state, setstate] = useState(initialState);
 const [state, setstate] = useState(() => initialState);

const [state, setstate] = useState(0);
console.log(state)//0
setstate(state + 1)
setstate(state + 1)
setstate(state + 1)
console.log(state)//1
setstate((prevState) => prevState+1)
setstate((prevState) => prevState+1)
setstate((prevState) => prevState+1)
console.log(state)//3

const [state, setstate] = useState(['a','b','c']);
console.log(state)//['a','b','c']
setstate([...state,'d'])
console.log(state)//['a','b','c','d']

```

## 4.Hooks——useEffect()

**`useEffect`钩子函数解决了在函数式组件中使用生命周期的问题。**

`useEffect`钩子函数接受两个参数：

参数一：回调函数，在组件渲染时调用，类似于`componentDidMount`生命周期函数。该回调函数返回一个函数，该函数在组件卸载时调用，类似于`componentWillUnmount`生命周期函数。

参数二，数组，该数组保存着`useEffect`钩子函数的依赖state，只有在该数组中的state发生了更新对应的`useEffect`才会执行。

```js
useEffect(() => {
        console.log('修改DOM', counter)
    }, [counter])
//第二个参数传入的是空数组的话，则该useEffect只会在第一次渲染时执行一次
//第二个参数实际上只做性能优化
useEffect(() => {
        console.log('订阅事件')
    }, [])

useEffect(() => {
        console.log('网络请求')
    }, [])
```

## 5.Hooks——useContext()

**`useContext`钩子函数解决了在函数式组件中使用React Context的问题。**

`useContext`钩子函数接受一个React Context作为参数，返回该Context传递的value.

```jsx
//App.js
export const userContext = createContext()
<userContext.Provider value={{ name: 'codercoin', age: 23 }}>
     <UseContextDemo />
</userContext.Provider>
```

```js
import React, { useContext } from 'react'
import { userContext } from '../App'
export default function UseContextDemo () {
    const { name, age } = useContext(userContext)
    return (
        <div>
            <h2>useContext的使用</h2>
            name:{name},age:{age}
        </div>
    )
}
```

## 6.Hooks——useReducer()

`useReducer`钩子函数实际上是`useState`的更好替代品，用于处理更加复杂的state。

`useReducer`接受两个参数，第一个参数是reducer函数，第二个是初始化值。

返回值为一个数组，第一个元素是state，第二个元素是`dispatch`函数

```js
import React, { useReducer } from 'react'

function reducer (state, action) {
    switch (action.type) {
        case 'increment':
            return { ...state, counter: state.counter + 1 }
        case 'decrement':
            return { ...state, counter: state.counter - 1 }
        default:
            return state
    }
}
export default function UseReducerDemo () {
    const [counter, dispatch] = useReducer(reducer, { counter: 0 })
    return (
        <div>
            <h2>当前计数：{counter.counter}</h2>
            <button onClick={e => dispatch({ type: 'increment' })}>+1</button>
            <button onClick={e => dispatch({ type: 'decrement' })}>-1</button>
        </div>
    )
}

```

## 7.Hooks——useCallback()

`useCallback`钩子函数是用来进行性能优化的，它接受两个参数，第一个参数是回调函数，第二个参数是依赖数组。

`useCallback`会将传入回调函数的带有记忆的版本返回，该回调函数仅在某个依赖项改变时才会更新。

**`useCallback`维护的是函数**

```js
//依赖counter，counter变化时执行新的回调函数,正常执行
const increment2 = useCallback(() => {
        console.log('increment2 执行')
        setCounter(counter + 1)
}, [counter])
```

什么时候使用`useCallback`才能做到性能优化？

`useCallback`和`useMemo`实际上就是提供类组件中shouldComponentMount的功能，在一个单独组件中使用`useCallback`来对某些操作进行判断执行实际上不能实现性能优化。应该在父组件将函数传给子组件进行回调时，使用useCallback对函数进行处理，避免子组件不必要的重新渲染已到达性能优化的目的。

## 8.Hooks——useMemo()

`useMemo`钩子函数也是用来进行性能优化的，它接受两个参数，第一个参数是回调函数，该回调函数必须返回带有记忆的值，第二个参数是依赖数组。

`useMemo`会将传入回调函数的返回值的带有记忆的版本返回，该返回值仅在某个依赖项改变时才会更新。

**``useMemo``维护的是返回值**

```jsx
import React, { useMemo, useState } from 'react'
function ComputeSum (num) {
    console.log('重新计算')
    let total = 0
    for (let i = 1; i <= num; i++) {
        total += i
    }
    return total
}
/**
 show发生改变，UseMemoComplexDemo重新渲染，counter未改变，因此返回ComputeSum还是同一个，不用重新执行
*/
export default function UseMemoComplexDemo () {
    console.log('UseMemoComplexDemo渲染')
    const [counter, setCounter] = useState(10)
    const [show, setShow] = useState(true)
    // const total = ComputeSum(counter)

    //counter发生改变时才返回新的ComputeSum
    const total = useMemo(() => {
        return ComputeSum(counter)
    }, [counter])
    return (
        <div>
            <h2>Total:{total}</h2>
            <button onClick={e => setCounter(counter + 1)}>+1</button>
            <button onClick={e => setShow(!show)}>切换</button>
        </div>
    )
}

```

除了优化进行复杂计算时性能，同样也能在父子组件通信时进行优化，保证props不被父组件的重新渲染而改变来避免不必要的子组件重新渲染。

## 9.Hooks——useRef()

`useRef`返回一个ref对象，这个对象在组件的整个生命周期里是保持不变的。

`useRef`的两个常用用法：

- 引用DOM元素或者**类组件**
- 保存一个数据，这个数据在生命周期里保持不变  `const refContainer = useRef(initialValue)`

```jsx
//引用DOM
 const titleRef = useRef()
<h2 ref={titleRef}>useRef引用DOM</h2>

titleRef.current === <h2/>
```

```js
//10保存在整个组件的生命周期中
const refData = useRef(10)
```

## 10.Hooks——useLayoutEffect()

`useLayoutEffect`和`useEffect`相似，他们的区别：

- `useEffect`在组件渲染完成后执行回调函数，不会阻塞组件的渲染
-  `useLayoutEffect`在组件渲染前执行回调函数，会阻塞组件的渲染

一般不使用`useLayoutEffect`,除非特别地业务场景。

## 11.Hooks——useImperativeHandle()

`useImperativeHandle`一般配合`forwardRef`使用。

为了避免将整个DOM暴露给父组件随意使用，`useImperativeHandle`可以控制父组件对子组件DOM元素的行为。

`useImperativeHandle(ref,createHanddle,dependencyList)`

**补充：**

`useRef`不能引用函数式组件，`forwardRef`的作用就是在`useRef`不能引用函数式组件的前提下，将`useRef`返回的对象传入到子组件中，实现父组件对子组件DOM的引用。

```jsx
//forwardRef的使用
import React, { forwardRef, useRef } from 'react'
const ChildCpn = forwardRef((props, ref) => {
    return <input ref={ref} type='text' />
})
export default function ForwardRefDemo () {
    const cpnRef = useRef()
    return (
        <div>
            <ChildCpn ref={cpnRef} />
            <button onClick={e => cpnRef.current.focus()}>聚焦</button>
        </div>
    )
}
```

```jsx
//useImperativeHandle的使用
import React, { forwardRef, useImperativeHandle, useRef } from 'react'
const ChildCpn = forwardRef((props, ref) => {
    const inputRef = useRef()
    useImperativeHandle(ref, () => ({
        focus: () => {
            inputRef.current.focus()
        }
    }), [inputRef])

    return <input ref={inputRef} type='text' />
})
export default function UseImperativeHandleDemo () {
    const inputRef = useRef()
    return (
        <div>
            <ChildCpn ref={inputRef} />
            <button onClick={e => inputRef.current.focus()}>聚焦</button>
        </div>
    )
}

```

## 12.自定义Hooks

所谓的自定义Hook，其实是代码逻辑的抽取，本质是用户自定义的函数。这些特殊的函数内部可以使用React提供的Hooks函数而已。

自定义Hook方便开发者自己抽取代码，提高代码的复用性，减少组件内部不必要的代码逻辑，并帮助开发者完成很多复杂的逻辑处理。

**自定义的Hook命名需要以use开头**

```jsx
//例如在自定义的Hook中使用useContext
import { useContext } from 'react'
import { tokenContext, userContext } from '../App'
function useUserContext () {
    const user = useContext(userContext)
    const token = useContext(tokenContext)

    return [user, token]
}
export default useUserContext
```

# 数据的不可变性

```js
const obj1 = {
    name:'obj1',
    age:20
}
const obj2 = obj1

obj2.name = 'obj2'

console.log(obj1.name)//obj2
```

在JavaScript中，对象是引用类型，对象名只是一个指向该对象内存的一个地址指针，所以 在对对象进行赋值的时候仅仅是将该地址指针赋值给其他变量，当其中一个引用发生变化的时候，实际上修改的是所有引用的同一个对象。

这就是为什么在Reac和Redux中强调state中的数据要有不可变性。因此，我们在进行state数据更新的时候使用浅拷贝。但是在state过于庞大时，每一次浅拷贝都会造成性能的消耗和内存的浪费。

为了解决数据量大且复杂的state的浅层拷贝，我们需要使用ImmutableJs库，它J将一个普通的对象转换成新的ImmutableJs对象并返回，对ImmutableJs对象的修改不会对原来对象进行修改。ImmutableJs让纯函数变得更加强大。

# ImmutableJs

immutable 是 Facebook 开源的一个项目，用于实现 javascript 的数据不可变，解决引用带来的副作用。

ImmutableJs采用了新的算法（持久化数据结构）来保证尽量地减少内存浪费。

以下为一些常用api的使用

## 1.Map()

```js
const { Map } = require('immutable')
const obj1 = {
    name:'obj1',
    age:20
}
const IMobj = Map(obj1)
IMobj.set('name','obj2')
cosole.log(obj1.name)//'obj1'
cosole.log(IMobj.name)//'obj2'
```

## 2.List()

```js
const { List } = require('immutable')
const list1 = ['a','b','c']
const IMlist = List(obj1)
IMlist.set(0,'d')
cosole.log(list1[0])//'a'
cosole.log(IMlist[0])//'d'
```

## 3.fromJS()

Map和List只会做浅层映射，对于嵌套的对象和数组无法转换成响应的Immutable对象或数组，而fromJS对象和数组深度转换为不可变映射和列表。

```js
const { fromJS } = require('immutable')
const obj1 = {
    name:'obj1',
    age:20,
    friend:{
        name:'obj3',
        age:30
    }
}
const IMobj = fromJS(obj1)
IMobj.set('friend',{})
cosole.log(obj1.friend)//{name:'obj3',age:30}
cosole.log(IMobj.friend)//{}
```

# React SSR/CSR

解决ASP的首页加载慢以及SEO问题：服务器渲染(SSR)和客户端渲染(CSR)

React SSR 框架：**Next.js**

Vue SSR框架：**Nuxt.js**