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

#### 面试中如何考察？ 以何种方式？

考察重点，而不是考察细节。掌握好2/8原则

和使用相关联的原理，例如`vdom`、模板渲染

整体流程是否全面？ 热门技术是否有深度？

#### `Vue`原理包括哪些？

组件化

响应式

`vdom` 和`diff`

模板编译

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









