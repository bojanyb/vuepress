## `Vue` + `TypeScript`概述

### `Vue.js`介绍

> `Vue.js`是一套构建用户界面的渐进式框架。在17、18年发展迅速，用户数和粉丝量呈现指数级增长，目前已经成为前端界的三大主流框架之一。
>
> 目前官方最新版本为2.6.11，`Vue2.x`版本最终会更新 到`Vue2.7`后将不在更新`2.x`版本。

### `Vue3.0`发展历程

> 2019年6月8日，第三届`Vue.js`开发者大会上，尤雨溪分享了`Vue3.0`目前的发展现状。
>
> 2019年10月5日，尤雨溪公布了·`Vue3`源代码，版本状态为`pre-Alpha`。
>
> 2020年4月17日，尤雨溪公布了`Vue3 Beta版本`，还有`Vue`全家桶相关的一些`Alpha`版本。

### `Vue3.0`对比`Vue2.x`优势

- 框架内部做了大量性能优化，包括：`虚拟DOM`，编译模板，`Proxy的新数据监听`，更小的打包文件等。
- 新的`组合式API`（即 `composition-api`），更适合大型项目的编写方式。
- 对`TypeSctipt`支持更好，去除了繁琐的`this`操作，更强大的类型推导。

### `TypeScript`介绍

> - `TypeScript`是`JavaScript`的超集，它可以编译成纯`JavaScript`。
>
>   [^超集]: 所谓超级是集合论的术语，A ⊇ B，则 A 集是 B 的超集，也就是说 B 的所有元素 A 里都有，但 A 里的元素 B 就未必有。
>
> - `TypeScript`可以在任何浏览器、任何计算机和任何操作系统上运行，并且是开源的。

### 为什么使用`TypeSctipt`？

> - `TypeScript`可以提供静态类型检查，规范团队的编码及使用方式，适合大型项目的开发。
>
>   [^动态类型]: 动态类型语言中，变量没有类型，只有数据有类型，变量可以持有任意类型的数据。例如，C是静态类型语言，一个int型变量只能作为int来处理。Python是动态语言，变量可以持有整数、字符串、列表、闭包等任何数据。动态类型=>运行时检查。
>   [^静态类型]: 静态类型语言中，变量具有类型，而且在编译期确定，具有某一类型的变量只能持有相同类型的数据。静态类型=>编译期检查。
>
> - `IDE`的友好提示，也是适合大型项目的开发。

## `Vue3.0`新语法使用

### `Vue3.0`环境搭建与插件安装

脚手架安装与配置

- `vue-cli4`
- 配置`Vue3.0`环境

### 组合式API核心语法

- setup函数

```vue
<template>
	<div id="app">
        <div>
            // {{ count }} 
            // {{ state.count }} 
            // {{ count }} 
   		 </div>    
    </div>

</template>
<script>
    export default {
        name: "APP",
        // 不具备数据响应式
        setup() { //Vue3.0的入口函数，类似Vue2.0的生命周期，在beforeCreate之前进行触发
            cosnt state = reactive({
                count： 0
            })
            return state；
        }
      	// 具备数据的变化  
         setup() { //Vue3.0的入口函数，类似Vue2.0的生命周期，在beforeCreate之前进行触发
            cosnt state = reactive({
                count： 0
            })
            return {
                state
            }
      	// 不具备数据的变化
         setup() { //Vue3.0的入口函数，类似Vue2.0的生命周期，在beforeCreate之前进行触发
            cosnt state = reactive({
                count： 0
            })
            return {
                count: state.count
            }
        }
		// ref
          const count = ref(0)
          return {
              count
          }
    }
</script>
<style>
    
</style>
```



- reactive()

  `reactive` 用于为对象添加响应式状态。接收一个`js`对象作为参数，返回一个具有响应式状态的副本。

  获取数据值的时候直接获取，不需要加`.value`

  参数只能传入对象类型

```js
// 响应式状态
const state = reactive({
  count: 0
})

// 打印count的值
console.log(state.count)
```



- ref()

`ref`用于为数据添加响应式状态。由于reactive只能传入对象类型的参数，而对于基本数据类型要添加响应式状态就只能用`ref`了，同样返回一个具有响应式状态的副本。

获取数据值的时候需要加`.value`。可以理解为`ref`是通过`reactive`包装了一层具有`value`属性的对象实现的

**参数可以传递任意数据类型**，传递对象类型时也能保持深度响应式，所以适用性更广。

`vue 3.0` `setup`里定义数据时推荐优先使用`ref`，方便逻辑拆分和业务解耦。

```js
// 为基本数据类型添加响应式状态
const name = ref('Neo')

// 为复杂数据类型添加响应式状态
const state = ref({
  count: 0
})

// 打印name的值
console.log(name.value)
// 打印count的值
console.log(state.value.count)
```

- `toRefs`()、`toRef`()

  `toRefs`就是把普通的数据转成ref()方法所对应的响应式数据

```js
const count = ref(0) 
const state = reactive()
setTimeout( () => {
    state.count++
}, 1000)
return {
    count
}

const state = reactive({
    count: 0
})
const { count } = toRefs(state)

setTimeout( () => {
    state.count++
}, 1000)

return {
    count
}

```

...

### TS环境与Vue2.x