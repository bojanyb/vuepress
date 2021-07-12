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

```

#### 3.`Array`方法

```js
// 数组中的其他方法
         
// 有返回值，返回在数组中该项的下标，不存在则返回-1 跟字符串方法相同
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

// Array 去重
Array.from(new Set(array));

// Array.from 把伪数组变成数组 只要有length的就可以转成数组
let str = '12345'
console.log(Array.from(str))    // ["1", "2", "3", "4", "5"] 
let obj = {0:'a',1:'b',length:2}
console.log(Array.from(obj))   // ["a", "b"]

// include 判断数组中是否包含特定的值
let arr = [1,2,3,4,5]
let arr2 = arr.includes(2)  
console.log(arr2)    // ture

// sort 排序 返回值是排序后的数组
let arr = [40, 8, 10, 5, 79, 3]
let arr2 = arr.sort((a,b) => a - b) // 正序
let arr2 = arr.sort((a,b) => b - a) // 倒序

// reverse 翻转 返回值是翻转后的数组
let arr = [1,2,3,4,5]
arr.reverse() // [5,4,3,2,1]

//

let arr = [1, 2, 3, 4, 5, 6]
// push 最后添加元素 返回值添加完后的数组长度
let result =  arr.push(7) // 7
console.log（arr） // [1,2,3,4,5,6,7]

// pop 最后删除元素，只能删除一个，返回值是被删除的元素
let result =  arr.pop() // 6
console.log（arr） // [1,2,3,4,5]

// shift() 删除数组第一项 返回值是删除的那项
let result =  arr.shift() // 1
console.log（arr） // [2, 3, 4, 5, 6]

// arr.unshift()从前面添加元素，添加一个或多个，返回值是添加完后的数组长度
let result =  arr.unshift(7) // 7
console.log（arr） // [7, 1, 2, 3, 4, 5, 6]

// arr.splice(index, num) 删除从起始索引 - 删除数量
let result =  arr.splice(2, 3) // [3, 4, 5]
console.log（arr） // [1, 2, 6]

// str.split()将字符串转化成数组  跟字符串方法相同
let str = '12345'
console.log(str.split(''))  // ['1','2','3','4','5']

// arr.slice() 获取部分数组 - 起始索引 结束索引  跟字符串方法相同
let arr = [1,2,3,4,5]
let result = arr.slice(1,3) // [2,3]
console.log(arr) // [1,2,3,4,5] 不改变原来的数组

```

#### 4. `Obejct`方法

> 增加了`Object.getPrototypeOf` 、`Object.create`、`Object.getOwnPropertyNames`、`Object.defineProperty`、`Object.getOwnPropertyDescriptor`、`Object.defineProperties`、`Object.keys`、`Object.preventExtensions / Object.isExtensible`、`Object.seal / Object.isSealed`、`Object.freeze / Object.isFrozen` 

#### 5.`String`方法

```js
// concat 将两个或多个字符文本连接，返回一个新字符串。
let a = 'hello'
let b = ',world'
let c = a.concat(b) // 'hello,world'

// indexOf 获取索引值 
//返回字符串中一个子串第一次出现的索引（从左到右），如果没有匹配性，返回-1
//表示从索引位置fromIndex开始查找，如果fromIndex省略，则表示默认从起始索引0开始查找

// indexOf（str，fromIndex）
let a = 'hello|world'
let index1 = a.indexOf('|') // index1 = 5
let index2 = a.indexOf('|', 6) //  index2 = -1

// includes 字符串中是否有该字符，返回布尔值 
let a = 'hello world'
let index = a.includes('w') // true

// charAt 返回指定索引位置的字符
let a = 'hello world'
let index =  a.charAt(1) // e 

// substr 获取部分字符串 起始索引 截取长度
// substr(fromIndex,length) 从起始索引fromIndex开始截取长度length的字符串
let a = 'hello world'
let index = a.substr(0, 2) // he
// 如果不指定length,默认截取到最后一位
let index = a.substr(1) // ello world

// 如果formIndex是负数，则从倒数第一个开始截取
let index = a.subStr(-3, 2) // rl

// substring 获取部分字符串 - 起始索引 结束索引
// substring(startIndex,endIndex)
let a = 'hello world'
let index = a.substring(0, 2) // hel

// slice 获取部分字符串 - 起始索引 结束索引
// slice(startIndex,endIndex)
let a = 'hello world'
let index = a.slice(0, 2) // hel
// 基本用法和subString一样，不同点 slice可以操作数组，subString不行

// split 分割
// 字符串分割，返回分割后的多个字符串组成的字符串数组
let a = 'hello，world，hi'
let strArr = a.split(',') // ['hello', 'world', 'hi']

// join 合并
// 分隔符将一个数组合并成一个字符串
let List = ['a', 'b', 'c', 'd', 'e']
let str = list.join('|') // 'a|b|c|d|e'

// replace 替换
// 用来查找匹配一个正则表达式的字符串，然后用鑫字符串替代匹配的字符串
let str = 'hello e'
let result = str.replace('e','h') // hhllo e  只替换第一个

// 如果要替换全部匹配项，需要传入一个RegExp对象并指定其global属性
let result = str.replace(/e/g,'h') // hhllo h 

// replace 第二个参数可以是函数 - 最常用 必考点

// 用法举例  首字母大写 -- 一个参数 表示匹配的整个字符串
// 在本例中，我们将把字符串中所有单词的首字母都转换为大写：
myString = 'aaa bbb ccc';
myString = myString.replace(/\b\w+\b/g, function(word){
            return word.substring(0,1).toUpperCase()+word.substring(1);}
);



```

#### 6.构造函数

在 JavaScript 中，用 new 关键字来调用的函数，称为构造函数。构造函数首字母一般大写

实例是类的具象化

```js
// Person就叫构造函数
function Person(name, gender, hobby) {
    this.name = name;
    this.gender = gender;
    this.hobby = hobby;
    this.age = 6;
}

// p1-p4就叫做实例
let p1 = new Person('zs', '男', 'basketball');
let p2 = new Person('ls', '女', 'dancing');
let p3 = new Person('ww', '女', 'singing');
let p4 = new Person('zl', '男', 'football');

未完，5月11日看class
```

#### 7.`arguments`

arguments对象实际上是所在函数的一个内置类数组对象

每个函数都有一个arguments属性，表示实参集合，这里的实参是重点，就是执行函数实际传入的参数的集合，arguments不是数组而是一个对象，但它和数组很相似，所以通常称为类数组对象，以后看到类数组就表示arguments。arguments对象不能显式的创建，它只有在函数开始时才可用。

arguments还有属性callee，length和迭代器symbol

arguments同样具有length属性，arguments.length为函数实参个数，可以用arguments[length]显式调用参数

arguments对象可以检测参数个数，模拟函数重载

```js
https://blog.csdn.net/weixin_45277161/article/details/111448310
https://blog.csdn.net/haotian1997/article/details/114731981
```

#### 8.原型和原型链

```js
function Person () {}

// 每个函数都有prototype,函数的原型 
// 每个函数创建时，就会关联另一个对象，这个对象就是原型，每个对象都会从原型继承属性
Person.prototype.name = 'jack'
// 实例化对象
let p1 = new Person()
// proto
// 实例化对象的proto指向，该对象的原型 也就是 Person.prototype
console.log(p1.__proto__ === Person.prototype) // true
// constructor 每个原型都有一个constructor，指向关联的构造函数
console.log(Person.prototype.constructor === Person) // true
```

#### 9 `instanceof`和`typeof`

```js
// typeof 用于判断数据类型，返回值为6个字符串，分别是string、Boolean、number、function、object、undefined
//但是你可能会发现，typeof在判断null、array、object以及函数实例（new + 函数），得到的都是object。

// instanceof 中文翻译为实例，因此instanceof的含义就不言而喻了，判断该对象是谁的实例，同时我们也就知道instanceof是对象运算符
//这里的实例就牵扯了对象的继承，它的判断就是根据原型链进行搜寻，在对象obj1的原型链上如果存在另一个对象obj2的原型属性，那么表达式返回值为true,否则返回false
//运算符用来测试一个对象在其原型链中是否存在一个构造函数的prototype属性。用于判断一个变量是否某个对象的实例。

let a = new Array()
console.log(a instanceof Array) // true
console.log(a instanceof Object) //也会返回 true
// 这是因为 Array 是 object 的子类
```



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

#### 5.`new Set`

`ES6`提供了新的数据结构Set,它类似于数组，但是成员的值是唯一的，没有重复的值。

```js
let set = new Set([1,2,3,4,4])
[...set] /// [1,2,3,4]

// Array 去重  // 把伪数组转成真数组
Array.from(new Set(array));
```

set实例的属性和方法

```js
// (1) size属性
// size属性返回Set实例的成员总数
let set = new Set([1,2,3,4])
set.size // 4
// (2) constructor属性
// 构造函数，默认就是Set函数
// (3) add(value) has(value) delete(value)
// 添加某个值，返回Set结构本身
let set = new Set([1,2,3,4,4])
set.add(5).add(6) // [1,2,3,4,5,6]
set.has(1)  // true  返回布尔值，表示该值是否为Set成员
set.has(2)  // false
set.delete(1) // 删除某个值，返回一个布尔值，表示删除是否成功
set.clear() //清除所有成员，没有返回值

//遍历操作
Set结构的实例有四个遍历方法，可以用于遍历成员。

keys()：返回键名的遍历器
values()：返回键值的遍历器
entries()：返回键值对的遍历器
forEach()：使用回调函数遍历每个成员
```

#### 6. class

```js
https://zhuanlan.zhihu.com/p/42409367
rest参数又名拓展运算符

// class
class MathHandle {
    constructor(x,y) { // constructor是一个构造方法，用来接收参数
        this.x = x;
        this.y = y;
    }

    add() {
        return this.x + this.y;
    }
}
const m = new MathHandle(1,2);
console.log(m.add());

// class继承

class Animal {
    constructor(name) {
        this.name = name;
    }
    eat() {
        console.log(this.name + 'eat');
    }
}
class Dog extends Animal {
    constructor(name) {
        super(name);
    }
    say() {
        console.log(this.name + 'say');
    }
}
const dog = new Dog('哈士奇');
dog.say();
dog.eat();
```

#### 7. `ES6`数据类型

```js
// ES6 提供了新的数据结构 Set。它类似于数组，但是成员的值都是唯一的，没有重复的值。

// ES6 Map结构也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。
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

在学习深拷贝之前，我们要先搞明白什么是深拷贝

在`js`中，数据类型分为基本数据类型和引用数据类型两种，对于基本数据类型来说，它的值直接存储在栈内存中，而对于引用类型磊说，它在栈内存中仅仅存储一个引用，而真正的数据存储在堆内存中

浅拷贝而言，就是只拷贝对象的引用，而不是深层次的拷贝对象的值，多个对象指向堆内存中的同一对象，任何一个修改都会使得所有对象的值修改，因为他们公用一条数据。

我们在实际的项目中，肯定不能让每个对象的值都指向同一个堆内存，这样的话不便于我们做操作，所以自然而然的诞生了深拷贝。

深拷贝不会拷贝引用类型的引用，而是引用类型的值，全部拷贝一份，形成一个新的引用类型，这样就不会发生引用错乱的问题。

```js
// 乞丐版的深拷贝 JSON.stringify()以及JSON.parse()
let obj1 = {
    a：1，
    b: 2,
    c: 3
}
let objString = JSON.parse(JSON.stringifg(obj))
// 缺点： 它是不可以拷贝undefined，function，RegExp等类型的

// Object.assign(target, source)
let obj2 = Object.assign({}, obj1)
// 缺点：一层对象没问题，如果对象的属性对应的是其他的引用类型的话，还是只拷贝了引用，修改的话还是有问题。

// 第三种方式 递归拷贝
// 定义一个深拷贝函数 接收目标target参数
function deepClone(target) {
    // 定义一个变量
    let result 
    // 如果当前需要深拷贝的是一个数组的话
    if (Array.isArray(target)) {
        result = [] //将result赋值为一个数组，并执行遍历
        for (let i in target) {
            // 递归克隆数组中的每一项
            result.push(deepClone(target[i]))
        }
        // 判断如果当前的值是null，直接复制为null
    } else if （target === null） {
        result = null
        // 判断如果当前的值是一个RegExp对象的话，直接赋值
    } else if (target.constructor === RegExp) {
        result = target
    } else {
        // 否则是普通对象，直接for in循环，递归赋值对象的所有值
        result = {}
        for(let i in target) {
            result[i] = deepClone(target[i])
        }
    }
    //如果不是对象的话，就是基本数据类型，那么直接赋值
    result = target
}
// 返回最终结果
return result
}

// 数组深拷贝方法
// 返回一个新数组
let newArray = oldArray.slice(); //slice会clone返回一个新数组
// 连接多个数组
let  newArray = oldArray.concat(Array1, Array2);//concat会连接两个或多个数组
```

```js
function deepClone(target) {
    const _toString = Object.prototype.toString
    let result
    if (typeof target === 'Object') {
        if (_toString.call(target) === '[Object Array]') {
            result = []
            for (let i in target) {
                result.push(deepClone(target[i]))
            }
        }
        else if (_toString.call(target) === '[Object RegExp]') {
            result = target
        }
        else if (_toString.call(target) === '[Object Object]') {
            result = {}
            for (let i in target) {
                result[i] = deepClone(target[i])
            }
        }
        else if (target === null) {
            result = null
        }
    } else {
        result = target
    }
    return result
}

```

