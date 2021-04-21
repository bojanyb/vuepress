## `JavaScript`、`ES5`、`ES6`

### 什么是`JavaScript` ?

> JavaScript是一种动态类型、弱类型、基于原型的客户端脚本语言，用来给HTML网页增加动态功能。
>
> [^动态类型]: 这个变量*是动态*的,*类型是*随时可以被更改的。**运行时才知道一个变量类型的叫做动态类型**。
> [^动态类型]: 在运行时确定数据类型。变量使用之前不需要类型声明，通常变量的类型是被赋值的那个值的类型。
> [^静态类型]: 这个变量是静态的，类型是不可被更改的。编译时就知道变量类型的是静态类型。
> [^强类型]: 不允许隐式转换的是强类型。
> [^弱类型]: 允许隐式转换的是弱类型。
> [^弱类型]: 计算时可以不同类型之间对使用者透明地隐式转换，即使类型不正确，也能通过隐式转换来得到正确的类型。
> [^原型]: 新对象继承对象（作为模版），将自身的属性共享给新对象，模版对象称为原型。这样新对象实例化后不但可以享有自己创建时和运行时定义的属性，而且可以享有原型对象的属性。

### `JavaScript`由三部分组成

1. `ES`

   作为核心，它规定了语言的组成部分： 语法、类型、语句、关键字、保留字、操作符、对象

2. `DOM`

   `DOM`把整个页面映射为一个多层节点结果，开发人员可借助DOM提供的`API`，轻松地删除、添加、替换或修改任何节点。

   PS: `DOM`也有级别，类似`ES5` `ES6`，分为`DOM1-3`，拓展不少规范和新接口。

3. `BOM`

   支持可以访问和操作浏览器窗口的浏览器对象模型，开发人员可以控制浏览器显示的页面以外的部分。

   PS: `BOM`未形成规范

### 什么是`ES5` ?

> 作为`ES`第五个版本(第四版因为过于复杂废弃了)

#### 1. strict模式

严格模式，限制一些用法，“use strict”

#### 2. Array增加方法

> 增加了`forEach`、`map` 、`filter `、`every`、`some` 、`indexOf`、`lastIndexOf`、`isArray`、reduce、`reduceRight`方法

```js
let arr = [1,2,3,4,5,6]

// 数组中的循环方法

// 循环
// 没有返回值，针对每个元素调用function，循环数组，跟for一样
// 无法使用break，return终止循环
arr.forEach(function(item) {
    console.log(item) 
})

// 循环+返回新数组
// 有返回值，默认返回一个数组，每个元素为调用func的结果。
let list = arr.map(function(item) {
          return item * 2
        })
	console.log(list) // [2,4,6,8 ...]

---

// 数组中的判断方法
        
// 判断符合条件的值，返回一个新数组
// 有返回值，默认返回一个数组。返回false的数组会被过滤掉，而返回true的每一项会组成一个数组被整体返回。
let list = arr.filter(function(item) {
          return item % 2 === 0
        })
	console.log(list) // [6,4,2]

// 判断符合条件的值，每一项都要满足，否则返回false
// 有返回值，默认返回一个布尔值。如果每一项的运行结果都返回 true，则返回 true。
let result = arr.every(function(item) {
          return item % 2 === 0
        })
	console.log(list) // false 不是每一项都能被2整除

// 判断符合条件的值，其中一项能满足，就返回true
// 有返回值，默认返回一个布尔值。如果任何一项返回true,则返回true
let result = arr.some(function(item) {
          return item % 2 === 0
        })
	console.log(list) // true 其中有3项能被2整除

---

// 数组中的其他方法
        
        
// 有返回值，返回在数组中该项的下标，不存在则返回-1
let result =  arr.indexOf（1） // 0
let result =  arr.indexOf（100） // -1

// 有返回值，返回在数组中该项的下标，不存在则返回-1
let result =  arr.indexOf（1） // 0
let result =  arr.indexOf（100） // -1

// 有返回值，返回一个布尔值，判断传入值是否是数组
let result =  arr.isArray（arr） // true

 // 1、previousValue （上一次调用回调返回的值，或者是提供的初始值（initialValue））
 // 2、currentValue （数组中当前被处理的元素）
 // 3、index （当前元素在数组中的索引）
 // 4、array （调用 reduce 的数组）
 // 将二维数组转化为一维
 let arr = [[0, 1], [2, 3], [4, 5]]
 let newArr = arr.reduce((pre,cur)=>{
     return pre.concat(cur)
 },[])
 console.log(newArr); // [0, 1, 2, 3, 4, 5]

// 连接两个或多个数组
let a = [1,2,3];
console.log(a.concat(4,5)) // [1,2,3,4,5]



```

#### 3. `Obejct`方法

> 增加了`Object.getPrototypeOf` 、`Object.create`、`Object.getOwnPropertyNames`、`Object.defineProperty`、`Object.getOwnPropertyDescriptor`、`Object.defineProperties`、`Object.keys`、`Object.preventExtensions / Object.isExtensible`、`Object.seal / Object.isSealed`、`Object.freeze / Object.isFrozen` 

### 什么是`ES6` ？

#### 1.箭头函数

```js
// ES5
function greetings (name) {
    return 'hello' + name
}

// ES6
const greetings = (name) => {
    return `hello ${name}`
}

// 该例子同时包含了：模版字符串的用法
// 模板字符串（template string）是增强版的字符串，用反引号（`）标识。
// 它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

```

#### 2. 操作对象（objects）

``` js
// ES5 
var obj1 = { a: 1, b: 2}
var obj2 = { a: 3, b: 4, c:5}
var obj3 = Object.assign({}, obj1, obj2) // { a: 1, b: 2, a: 3, b: 4, c:5 }

// Object.assign 用于对象的合并，将源对象（obj1， obj2）的所有可枚举属性，复制到目标对象（obj3）

// ES6
const obj1 = { a: 1, b: 2 }
const obj2 = { a: 2, c: 3, d: 4 }
const obj3 = { ...obj1, ...obj2 } // { a: 1, b: 2, a: 3, b: 4, c:5 }

```

#### 3.对象解构 

```js
// ES5
var obj1 = { a: 1, b: 2, c: 3, d: 4 }
var a = obj1.a
var b = obj1.b
var c = obj1.c
var d = obj1.d

// ES6
const obj1 = { a: 1, b: 2, c: 3, d: 4 }
const {
    a,
    b,
    c,
    d,
      } = obj1

```

#### 4.对象定义

```js
// ES5
var a = 1
var b = 2
var c = 3
var d = 4
var obj = { a: a, b: b, c: c, d: d }

// ES6
// 前提是：属性名 与 变量名 一致
const a = 1
const b = 2
const c = 3
const d = 4
const obj = { a, b, c, d }

```

### 异步（promise / callback）

```js
// ES5
function isGreater(a, b, cb) {
    var greater = false
    if (a > b) {
        greater = true
    }
    cb(greater)
}

is Greater(1, 2, function(result) {
    if（result） {
        console.log('greater')
    } else {
        console.log('smaller')
    }
})

// ES6
const isGreater = (a, b) => {
    return new Promise((resolve, reject) => {
        if(a > b) {
            resolve(true)
        } else {
            reject(false)
        }
    })
}

isGreater(1, 2).then( result => {
    console.log('greater')
}).catch( result => {
    console.log('smaller')
})

```

### 深浅拷贝

```js
newArray = oldArray.slice(); //slice会clone返回一个新数组
```

