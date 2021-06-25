### `虚拟DOM`

- 用`JS`对象模拟`DOM`（`虚拟DOM`）
- 用此`虚拟DOM`转成真实DOM并插入页面中（`render`）
- 如果有事件发生修改了`虚拟DOM`,比较两棵`虚拟DOM`树的差异，得到差异对象`diff`
- 把差异对象应用到真正的`DOM`树上(`patch`）

#### `真实DOM和其解析流程`

> 本节我们主要介绍真实`DOM`的解析过程，通过介绍其解析过程以及存在的问题，从而引出为什么需要`虚拟DOM`
>
> 所有的浏览器渲染引擎工作流程大致分为5步： 创建`DOM`树，创建`CSS对象`，创建`Render Tree`, `布局（回流）`， `绘制（重绘`

- 第一步，构建`DOM`树，解析`HTML`，构建一颗`DOM`树
- 第二步，生成`CSS`对象，解析`CSS`，生成`CSS`对象
- 第三步，构建渲染树，将`DOM`树和`CSSOM`结合起来，构建一颗`render tree`，每个DOM节点都有attach方法，接受几何信息，返回一个render对象，这些render对象最终会构建成一颗render树
- 第四步，回流，确定节点坐标，根据render树结构，为每个render树上的节点确定一个显示屏上出现的精确坐标。
- 第五步，重绘，根据render树和节点显示坐标，然后调用每个节点的paint方法，将他们绘制出来

#### `JS操作真实DOM的代价`

> 用我们传统的开发模式，原生`JS`或`JQ`操作`DOM`时，浏览器会从构建DOM树开始从头到尾执行一遍流程。在一次操作中，我们需要更新10个`DOM`节点，浏览器收到一个`DOM`请求后并不知道还有9次更新操作，因此会马上执行流程，最终执行10次。
>
> 例如，一次计算完，紧接着下一个`DOM`更新请求，这个节点的坐标值就变了，前一次计算为无用功。计算`DOM`节点坐标等都是白白浪费的性能。即使计算机硬件一直在迭代更新，操作`DOM`的代码仍然是昂贵的，频繁操作还是会出现页面卡顿。

#### `虚拟DOM的好处`

> 虚拟`DOM`就是为了解决浏览器性能问题而被设计出来的，如前，若一次操作中又10次更新`DOM`的动作，`虚拟DOM`不会立即操作`DOM`，而是将10次更新的`diff`内容保存到本地一个`js`对象中，最终这个`js`对象一次性`attch`到`DOM`树上，再进行后续操作，避免大量无谓的计算量，所以，用`js`对象模拟`DOM`节点的好处是，页面的更新可以全部反应在`JS`对象上（虚拟DOM）上，操作内存的`JS`对象的速度显然要更快，等更新完成后，再将最终的`JS`对象映射成真实的`DOM`,交由浏览器去绘制。

#### `用JS对象模拟DOM树`

```js
/**
 * Element virdual-dom 对象定义
 * @param {String} tagName - dom 元素名称
 * @param {Object} props - dom 属性
 * @param {Array<Element|String>} - 子节点
 */
function Element(tagName, props, children) {
    this.tagName = tagName
    this.props = props
    this.children = children
    // dom 元素的 key 值，用作唯一标识符
    if(props.key){
       this.key = props.key
    }
    var count = 0
    children.forEach(function (child, i) {
        if (child instanceof Element) {
            count += child.count
        } else {
            children[i] = '' + child
        }
        count++
    })
    // 子元素个数
    this.count = count
}

function createElement(tagName, props, children){
 return new Element(tagName, props, children);
}

module.exports = createElement;
```

根据 `element` 对象的设定，则上面的 `DOM` 结构就可以简单表示为：

```js
var el = require("./element.js");
var ul = el('div',{id:'virtual-dom'},[
  el('p',{},['Virtual DOM']),
  el('ul', { id: 'list' }, [
	el('li', { class: 'item' }, ['Item 1']),
	el('li', { class: 'item' }, ['Item 2']),
	el('li', { class: 'item' }, ['Item 3'])
  ]),
  el('div',{},['Hello World'])
]) 
```

现在 `ul` 就是我们用 `JavaScript` 对象表示的 `DOM` 结构

#### 渲染用`JS`表示的`DOM`对象

但是页面上并没有这个结构，下一步我们介绍如何将`ul`渲染成页面上的真实`DOM`结构，相关渲染函数如下

```js
/**
 * render 将virdual-dom 对象渲染为实际 DOM 元素
 */
Element.prototype.render = function () {
    var el = document.createElement(this.tagName)
    var props = this.props
    // 设置节点的DOM属性
    for (var propName in props) {
        var propValue = props[propName]
        el.setAttribute(propName, propValue)
    }

    var children = this.children || []
    children.forEach(function (child) {
        var childEl = (child instanceof Element)
            ? child.render() // 如果子节点也是虚拟DOM，递归构建DOM节点
            : document.createTextNode(child) // 如果字符串，只构建文本节点
        el.appendChild(childEl)
    })
    return el
} 
```

我们通过查看以上`render`方法，会根据`tagName`构建一个真正的`DOM`节点，然后设置这个节点的属性，最后递归地把自己的子节点也构建起来。

我们将构建好的`DOM`结构添加到页面上面

#### `diff算法` 

> `diff`算法用来比较两棵虚拟`DOM`树的差异，如果需要两棵树的完全比较，那么`diff`算法的时间复杂度为`O(n^3)`。但是在前端当中，你很少会跨域层级的移动`DOM`元素，所以虚拟`DOM`只会对同一个层级的元素进行对比。`div`只会和同一个层级的`div`对比，第二层级的只会跟第二层级对比，这样算法复杂度就达到`O（n）`

##### **深度优先遍历，记录差异**

在实际的代码中，会对新旧两棵树进行一个深度优先的遍历，这样每个节点都会有一个唯一的标记。

在深度优先遍历的时候，每遍历一个节点就把该节点和新的树进行对比，如果有差异的话就记录到一个对象里面。

```js
// diff 函数，对比两棵树
function diff(oldTree, newTree) {
    var index = 0 // 当前节点的标志
    var patches = {} // 用来记录每个节点差异的对象
    dfsWalk(oldTree, newTree, index, patches)
    return patches
  }
  
  // 对两棵树进行深度优先遍历
  function dfsWalk(oldNode, newNode, index, patches) {
    var currentPatch = []
    if (typeof (oldNode) === "string" && typeof (newNode) === "string") {
      // 文本内容改变
      if (newNode !== oldNode) {
        currentPatch.push({ type: patch.TEXT, content: newNode })
      }
    } else if (newNode!=null && oldNode.tagName === newNode.tagName && oldNode.key === newNode.key) {
      // 节点相同，比较属性
      var propsPatches = diffProps(oldNode, newNode)
      if (propsPatches) {
        currentPatch.push({ type: patch.PROPS, props: propsPatches })
      }
      // 比较子节点，如果子节点有'ignore'属性，则不需要比较
      if (!isIgnoreChildren(newNode)) {
        diffChildren(
          oldNode.children,
          newNode.children,
          index,
          patches,
          currentPatch
        )
      }
    } else if(newNode !== null){
      // 新节点和旧节点不同，用 replace 替换
      currentPatch.push({ type: patch.REPLACE, node: newNode })
    }
  
    if (currentPatch.length) {
      patches[index] = currentPatch
    }
  } 
```

从以上可以得出，`patches[1]` 表示 `p` ，`patches[3]` 表示 `ul` ，以此类推。

##### 差异类型

`DOM` 操作导致的差异类型包括以下几种：

-    



### `虚拟DOM`

当业务有一定复杂度之后，减少计算次数很难，而DOM操作开销是很昂贵的，所以可以把计算转移到`JS`中去

`vdom`用`JS`模拟`DOM`结构，计算出最小的变更，操作DOM

#### `DOM的JS数据结构`

```html
    <div class="div1">
        <p>vdom</p>
        <ul style="font-size: 10px;">
            <li>123</li>
        </ul>
    </div>
```

```js
        const vdom = {
            tag: 'div',
            props: {
                className: 'div1'
            },
            children: [
                {
                    tag: 'p',
                    children: 'vdom'
                },
                {
                    tag: 'ul',
                    props: {
                        style: 'font-size: 10px;'
                    },
                    children: [
                       {
                        tag: 'li',
                        children: '123'
                       }

                    ]
                }
            ]
        }
```

#### `diff算法`

> 1. `diff`算法是`vdom`中最核心最关键的部分
> 2. `diff`算法能在日常使用中体现出来（如`key`）

`diff`概述

`diff`即对比，是一个广泛的概念，如`Linux diff`命令，`git diff`命令

两颗树做`dif`f,即`vdom diff`

树的`diff`算法时间复杂度是o(n^3),是不可用的，数据量1000，需要计算一亿次。

优化时间复杂度到o(n),数据量1000，需要计算1000次。

- 只比较一层，不跨级比较 比如div,就只对比div，第一级比较第一级，第二级比较第二级。
- tag不同，直接删掉，不再深度比较。
- tag和key,两者都相同，则认为相同节点，不再进行比较。

#### `通过snabbdom学习dom`

**不使用key和使用key的对比**

不使用key，会把老的节点全部销毁，然后重新插入新的节点，然后渲染。

使用key, 重用上一次对应的`DOM`对象, 直接通过`diff`算法的逻辑移动到新的节点中

如果key是index，如果节点的排序出现变化，那么也会出现问题，所以需要一个唯一值

#### `diff算法总结`

- `patchVnode`
- `addVnodes` `removeVnodes`
- `updateChildren`（key的重要性）
- 核心概念很重要： `h` 、`vnode`、 `patch` 、`diff` 、`key`
- `vnode`存在的价值

`MS`

-  使用`h()` 函数是创建`VNode`的`JavaScript`对象, 描述`真实DOM`
- `init()`设置模块，创建`patch()`
- `patch()`根据`diff`算法比较新旧两个`VNode`
- 把变化的内容更新到真实`DOM`树上

> `虚拟DOM`的`diff`算法是比较同级元素，不同层级的节点，只有创建和销毁操作。把树的每个元素添加一个唯一的`key`属性，方便比较。完全对比一棵树的数据结构，时间复杂度是`o(n^3)`，n是树的层级，开销很大
>
> `虚拟DOM`的`diff算法`是对比新旧`DOM树`，前端操作一般不会出现节点跨级操作，所以只需要对比同级节点即可，根据节点对象的属性`key`和`sel`是否相同判断两个节点是否相同，如果是相同节点，直接更新该节点，如果有子节点，将每个子节点作为树结构继续对比差异,如果不是相同节点，直接替换或删除，所以`diff`算法的复杂度为`0(n)`
>
> `h()` 
>
> 函数的作用就是调用 `vnode()` 函数创建并返回一个虚拟节点。
>
> `init()`里面创建`patch()`
>
> `patch()`把新节点中的差异的内容渲染到真实`DOM`，最后返回新节点作为下一次处理的旧节点
>
> - 首先对比新旧`VNode`是否有相同值（判断节点的key（节点唯一值）和`sel`（节点选择器）相同）
> - 不相同，不对比，直接销毁之前的内容，然后重新创建一个新节点，重新渲染
> - 相同，再判断新的`VNode`是否有`text`属性
>   - 如果`newVnode`有`text`属性，并且与`oldVnode`的`text`不同，直接更新文本内容
>   - 如果`newVnode`有`children`属性，判断子节点是否变化
>     - 判断子节点的过程使用`diff`算法
> - `diff`过程只会进行同层级比较
>   - 因为`DOM`操作中，很少是跨层级的移动`DOM`元素，所以`虚拟DOM`只会对同一层级得到元素进行对比。
>   - 由于不需要跨层级比较，效率更高，时间复杂度（n是`oldVnode`节点数量）
>     - 跨层级完全比较`O(n^3)`
>     - 同层级比较时`O(n)`
>
> `init()`
>
> 入口函数`init()`生成`patch`函数，在`init`函数内部缓存了两个参数，即返回`patch`函数中可以通过闭包访问到`init`中初始化的模块和`DOM`操作的`api`
>
> `patch()`中的`createElm()`
>
> 返回创建好的`DOM`元素
>
> `patch()`中的`patchVnode()`
>
> 函数的作用是对比新旧两个节点，更新它们的差异。
>
> `patchVnode()`中的`updateChildren()`（过程不用记，知道干嘛的就行）
>
> 是整个 `虚拟DOM` 的核心，内部使用 `diff `算法，对比新旧节点的 `children`，更新`DOM `
>
> 在进行同级别比较的时候，首先对新旧节点的开始和结束节点设置标记索引（`startIndex`,`endIndex`）,遍历过程中移动索引
>
> 首先判断节点是否为空
>
> 如果节点为空，直接更新索引
>
> 开始和结束节点总共5种比较场景
>
> - 旧节点开始 - 新节点开始
> - 旧节点结束 - 新节点结束
> - 旧节点开始 - 新节点结束
> - 旧节点结束 - 新节点开始
> - 以上都不能匹配（`key`和`sel`不能全部匹配，则匹配`key`, 然后依次遍历所有节点）
>
> 对比顺序
>
> 5种场景按顺序依次比较节点是否相同（`key` 和 `sel` 相同）
>
> - 如果相同则进行 移动/更新，并更新索引
> - 如果不相同，则比较下一场场景
>
> `patch()`中的`removeVnodes()`
>
> 批量删除节点
>
> `patch()`中的`addVnodes()`
>
> 批量增加节点

`key`

从源码可知，给`VNode`设置`key`之后，当在对元素列表排序，或者给元素列表插入新项时会重用上一次对应的`DOM`对象，减少渲染次数，因此会提高性能。

### `响应式原理`

> `Vue`的核心原理就是其数据的响应式，讲到`Vue`的响应式原理,我们可以从他的兼容性说起，`Vue`不支持`IE8`以下版本的浏览器，因为`Vue`是基于`Object.defineProperty`来实现数据响应的，低版本浏览器并不兼容。`Vue`通过`Object.defineProperty`的`getter/setter`对收集的依赖项进行监听，在属性被访问和修改通知变化，进而更新视图数据。

第一版

- `vue`将`data`初始化一个`observer`并对对象中的每个值，重写了其中的`get`,`set`,`data`中的每个`key`，都有一个`dep`用于进行依赖收集。
- 在`get`,向`dep`添加了监听
- 在mount时，实例化了一个`watcher`将收集的目标指向当前的`Watcher`
- 在`data`值发生变更时，触发`set`，触发了`dep`中所有监听的更新，来触发`Watcher.update`

第二版

- `Vue`首先会进行`init`初始化操作
- 执行`observe`,即对data定义的每个属性通过`Object.defineProperty`进行`getter/setter`操作
- 在getter中，先为每个data声明一个` Dep` 实例对象，被用于`getter`时执行进行收集相关的依赖，即收集依赖的watcher（依赖收集简单点理解就是收集只在实际页面中用到的data数据，然后打上标记，没有被模板用到的数据，没有必要进行响应式）
- 在setter中，通过`dep`对象通知所有观察者去更新数据，此时watcher就执行变化，从而达到响应式效果。
- watcher,是一个观察者对象，依赖收集以后watcher对象会被保存在Dep的subs中，数据变动的时候Dep会通知Watcher实例，然后由Watcher实例回调cb进行视图的更新。
- Dep, 被observer的data在触发getter时，dep就会收集依赖的watcher，当data变动，就会通过dep给watcher发通知进行更新

第三版

- `vue`在初始化时，通过执行observer将所有data变成可观察的，对data定义的每个属性进行getter，setter操作，这是实现响应式的基础。通过`Object.defineProperty`实现了data的getter，setter操作，通过watcher观察数据的变化，进而更新视图。
- observer，是将每个目标对象（data）的键值进行监听，用于进行依赖收集。
- getter方法，先为每个data声明一个`dep`实例，用于getter时执行`dep.depend()`进行收集相关依赖，即收集依赖的watcher。
- setter方法，获取新值，通过`dep`对象通知所有watcher,此时watcher就执行变化，去更新数据，更新视图。
- watcher，是一个观察者对象，依赖收集以后(即，getter操作)watcher对象被保存在`dep`的`subs`,数据变动的时候（即setter操作）`Dep`会通知`Watcher`实例，然后由Watcher实例回调`cb`进行视图的更新。
- `Dep`，是一个收集依赖数据的代码工具， 被observer的data，在触发`getter`时，`dep`就会收集依赖的`watcher`，data出现变动触发`setter`时，就会通过Dep给watcher发通知进行更新。









### `Vue`使用

- 基本使用，组件使用 - 常用，必须会
- 高级特性 - 不常用，体现深度
- `Vuex`和`Vue-router`使用

#### computed和watch

- computed有缓存，data不变则不会重新计算
- watch如何深度监听？ 
- watch监听引用类型，拿不到oldVal

#### v-for v-if

- 如何遍历对象
- key的重要性。key不能乱写
- v-for与v-if不能一起使用

#### 组件通信

- props和$emit

  - 父组件通过props的方式像子组件传递
  - 子组件通过$emit,父组件用v-ons时间接收值
- 组件间通讯 - 自定义事件
  - 通过一个`vue`实例作为事件中心，用它来触发事件和监听事件
  - A组件用event.$emit('事件名'， '数据')
  - B组件用$on，来接收传递过来的值
- `$attrs`和`$listeners`
  - 多级嵌套需要传递数据时，可以用这两个方法。
  - `$attrs`包含了父作用域中不被props所识别的特性，当一个组件没有声明props时，这里会包含所有父作用域的绑定属性，传入内部组件。
  - `$listeners`包含了父作用域中的v-on事件监听器，可以通过v-on传入内部组件
- `$parent`和`$children`与`ref`
- 组件生命周期

```
// event.js
import vue from 'Vue'
export default new vue()

// input.vue
this.$emit("deteItem", id);

// list.vue
event.$on('ontitle',this.onEvent)

beforeDestroy(){
     //及时销毁自定义事件 防止内存泄露
     this.$off('ontitle',this.onEvent)
  }

```

#### 组件生命周期

- 挂载阶段
- 更新阶段
- 销毁阶段

`beforeCreated` 

`created` 

把`vue`的实例初始化了，只是存在js的内存模型中的一个变量而已，并没有开始渲染。

`beforeMounted`

`mounted`

组件真正的在网页上绘制完成了

`beforeUpdated`

`updated`

由于数据更改导致的虚拟 DOM 重新渲染和打补丁，在这之后会调用该钩子。

想到自己之前做的即时聊天项目，打开当前会话加载完消息后需要自动滚动到窗口最底部，一开始用的是`settimeout`解决，时间不好控制，太短的话页面还没渲染滚动的高度不准确，太长影响用户体验。后面才灵光一闪，`updated`好像是个完美解决方案。

`beforeDestroy`

事件绑定 `window`, `document`之类的事件

销毁子组件

事件监听器

`settimeout`

`destroy`

#### Vue高级特性

- 不是每个都很常用，但用到的时候必须要知道
- 考察候选人对`Vue`的掌握是否全面，且有深度。
- 考察做过的项目是否有深度和复杂度（至少能用到高级特性）



- 自定义`v-model`
- `$nextTick`
- `slot`
- 动态、异步组件
- `keep-alive`
- `mixin`

##### `$nextTick`

`Vue`是一个异步渲染的框架。

data改变之后，DOM不会立刻渲染。

`$nextTick`会在DOM渲染之后被触发，以获取最新DOM节点。

下次DOM更新循环之后执行的场景

```js
// 1.异步渲染，$nextTick 待DOM渲染完再回调
// 2.页面修改时，会将data的修改做整合，多次data修改只会渲染一次
this.$nextTick(() => {
    //操作DOM
})
```



##### `slot`

基本使用

父组件往子组件插入一部分内容

```js
// 父组件
<template>
  <div>
    我是父组件
    <slotOne1>
      <p style="color:red">我是父组件插槽内容</p>
    </slotOne1>
  </div>
</template>

// 子组件
<template>
  <div class="slotOne1">
    <div>我是slotOne1组件</div>
    <slot></slot>
  </div>
</template>
```

作用域插槽

父组件获取子组件data的数据

在子组件的solo上绑定一个动态属性data,然后父组件用`v-slot="slotProps"`就可以拿到数据了。

`v-solt`只能写在template上或者组件上。

1.用$emit的方法传值给父组件吗？ 可以！但是没必要，太复杂了 2.作用域插槽！

```js
// 子组件
<template>
  <div>
    我是作用域插槽的子组件
    <slot :slotData="slotProps"></slot>
  </div>
</template>

<script>
export default {
  name: 'slotthree',
  data () {
    return {
      user: [
        {name: 'Jack', sex: 'boy'},
        {name: 'Jone', sex: 'girl'},
        {name: 'Tom', sex: 'boy'}
      ]
    }
  }
}
</script>

// 父组件
<template>
  <div>
    我是作用域插槽
    <slot-three>
      <template v-slot="slotProps">
        <div v-for="(item, index) in slotProps.data" :key="slotProps.data.name">
        {{item}}
        </div>
      </template>
    </slot-three>
  </div>
</template>
```

具名插槽

name来定义具名插槽

在父组件中使用template并写入对应的slot值来指定该内容在子组件中现实的位置（当然也不用必须写到template），没有对应值的其他内容会被放到子组件中没有添加name属性的slot中

```js
// 父组件
<template>
  <div>
    我是父组件
    <slot-two>
      <p>啦啦啦，啦啦啦，我是卖报的小行家</p>
      <template v-slot:header>
          <p>我是name为header的slot</p>
      </template>
      <p v-slot:footer>我是name为footer的slot</p>
    </slot-two>
  </div>
</template>

// 简写
<template>
  <div>
    我是父组件
    <slot-two>
      <p>啦啦啦，啦啦啦，我是卖报的小行家</p>
      <template #header>
          <p>我是name为header的slot</p>
      </template>
      <p #footer>我是name为footer的slot</p>
    </slot-two>
  </div>
</template>

// 子组件
<template>
  <div class="slottwo">
    <div>slottwo</div>
    <slot name="header"></slot>
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>
```

##### 动态组件

is就是组件的名字

只要绑定到动态组件上的属性，在每一个组件中都可以获取到，并且也可以在动态组件中绑定事件

比如流程图，每个组件都不同，而且需要根据大量的数据来渲染

```js
<div v-for="(val, index) in data" :key="key">
<component :is="val.type" />
</div>
```

##### 异步组件

一些体积比较大的组件，如果同步打包进来体积非常大，性能非常慢。

所以要用异步组件，进行异步加载。

```js
import（）函数
按需加载，异步加载大组件

//同步加载
import FormDemo from '../FormDemo'

//异步加载
conponents : {
    FormDemo: () => import（'../FormDemo'）
}
```

##### keep-live

缓存组件

频繁切换，不需要重复渲染

`Vue`常见性能优化

比如tab页等功能

```js
<keep-alive>
    <KeepAliveStateA v-if="state === 'A'"></KeepAliveStateA>
    <KeepAliveStateB v-if="state === 'B'"></KeepAliveStateB>
    <KeepAliveStateC v-if="state === 'C'"></KeepAliveStateC>
 </keep-alive>
```

##### mixin

多个组件有相同逻辑，抽离出来。

`mixin`并不是完美的解决方案，会有一些问题。

`Vue3`提出的`CompositionApi` 旨在解决这些问题。

缺点： 变量来源不明确 不利于阅读

​	    多`mixin`，可能会造成变量冲突

​	    `mixin`和组件会出现多对多的关系，复杂度较高。

#### `Vuex`

基础属性

- `state ` this.$store.state
- `getters` this.$store.getters
- `mutation`
- `action`   异步操作 整合一个或多个mutation 
- `mudoles`

用于`Vue`组件

- dispatch    this.$store.dispatch
- commit     this.$store.commit 
- `mapState`
- `mapGetters`
- `mapActions`
- `mapMutations`



面试考点不多，因为熟悉`Vue`之后，`vuex`没有难度

但基本概念，基本使用和API必须要掌握

可能会考察state的数据结构设计

#### `Vue-router`

路由模式 hash history

路由配置 动态路由 懒加载

```js
// 动态参数
{path: '/user/:id', component: User}
// 获取动态参数
this.$route.params.id
```

```js
懒加载 在component用import导入
```

路由传参的三种方式

```js
// 方案一
//   直接调用$router.push 实现携带参数的跳转
this.$router.push({
    path: `/describe/${id}`,
})
// 动态路由配置
{
     path: '/describe/:id',
     name: 'Describe',
     component: Describe
}
// 获取路由上参数
this.$route.params.id


// 方案二
// 父组件中：通过路由属性中的name来确定匹配的路由，通过params来传递参数。
this.$router.push({
     name: 'Describe',
     params: {
        id: id
     }
})

// 对应路由配置: 这里可以添加:/id 也可以不添加，添加数据会在url后面显示，不添加数据就不会显示
 {
     path: '/describe',
     name: 'Describe',
     component: Describe
 }
// 子组件中: 这样来获取参数
this.$route.params.id

// 方案三
// 父组件：使用path来匹配路由，然后通过query来传递参数
// 这种情况下 query传递的参数会显示在url后面?id=？

this.$router.push({
      path: '/describe',
      query: {
        id: id
      }
})

// 对应路由配置
{
     path: '/describe',
     name: 'Describe',
     component: Describe
}

// 对应子组件: 这样来获取参数
this.$route.query.id

```

#### `Vue` - 总结

`v-if` 和 `v-show`的区别

v-show是通过`css` `display:block; none;`来控制显示隐藏 使用场景 频繁切换

v-if 是通过创建和销毁`dom`节点来实现显示隐藏 使用场景不频繁

keep-alive

1. include 字符串或正则表达式，只有名称匹配的组件会被缓存
2. exclude 字符串或正则表达式，任何名称匹配的组件都不会被缓存
3. max 数字，最多可以缓存多少组件实例

1. activated： 页面第一次进入的时候，钩子触发的顺序是created->mounted->activated
2. deactivated:  页面退出的时候会触发deactivated，当再次前进或者后退的时候只触发activated

为何v-for要用key

描述`Vue`组件生命周期（有父子组件的情况）

Vue组件如何通讯

1. 父子组件通讯 props  this.$emit
2. 无关联的组件通讯 自定义事件 this.$on this.$emit
3. vuex通讯

描述组件渲染和更新的过程

双向数据绑定v-model的实现原理



### Vue原理

#### 面试为何会考察原理？

知其然知其所以然 - 各行业通用的道理

了解原理才能应用的更好（竞争激烈，择优录取）

大厂造轮子（有钱有资源，业务定制，技术KPI）

**面试中如何考察？ 以何种方式？**

考察重点，而不是考察细节。掌握好2/8原则

和使用相关联的原理，例如`vdom`、模板渲染

整体流程是否全面？ 热门技术是否有深度？

#### `Vue`原理包括哪些？

组件化

响应式

`vdom` 和`diff`

模板编译

#### `vue`响应式原理

> 

#### 渲染过程

前端路由

#### 组件化基础

很早就有组件化

`web1.0`  `asp` `jsp` `php` 已经有组件化

`nodejs`也有类似的组件化

数据驱动视图（`MVVM`， `setState`）

- 传统组件，只是静态渲染，更新还要依赖于操作DOM
- 数据驱动视图 - `Vue MVVM`
- 数据驱动视图 - `React setState`

`Vue Mvvm`

View (DOM) 



### 5 webpack知识点

前端代码为何要进行构建和打包？

module chunk bundle分别什么意思？有何区别？

loader和plugin的区别？

webpack如何实现懒加载？









