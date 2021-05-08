### `js`

### 闭包

因为函数作用域的影响，函数内部的变量，函数外部是不能访问的。

所以我们可以在父级函数的内部声明一个子函数，并访问父级函数的局部变量，然后返回子函数，那么外部就可以做到访问内部函数作用域的变量了，那么这个过程就叫做闭包。

函数的生命周期

局部变量的声明周期一进入函数，就创建局部变量，一退出就销毁。

内存泄漏：程序有一块空间一直占用着没被回收，因为闭包延长了局部变量的生命周期。所以这块空间一直没被销毁，所以少用闭包，并且记得如果这个闭包不用了，就记得把闭包赋值为null

```js
function closure（） {
    const variable = 'variable'
    function fn （） {
        console.log(variable)
    }
    return fn
}

const fn1 = closure()
fn1()
```

### 防抖

什么是函数防抖

函数防抖（`debounce`）就是指触发事件后，在n秒内函数只能执行一次，如果触发事件后在n秒内又触发了事件，则会重新计算函数延执行时间。

> 举个例子，坐电梯的时候，如果电梯检测到有人进来（触发事件），就会多等待10秒，此时如果又有人进来（10秒之内重复触发事件）那么电梯就会再多等待10秒。再上述的例子中，电梯再检测到有人进入10秒钟之后，才会关闭电梯门开始运行，因此，“函数防抖”的关键在于，一个事件发生一定时间之后，才执行特定动作。

为什么需要函数防抖

前端开发过程中，有一些事件，常见的例如`scroll`,`mousemove`,`mouseover`等,会被频繁触发，不做限制的话，有可能一秒钟之内执行几十次。如果这些函数内部执行了其他函数，尤其是执行了操作DOM的函数，那不仅会浪费计算机资源，还会降低程序运行速度，甚至造成浏览器卡死，崩溃。

> 除此之外，短时间内重复的`ajax`调用不仅会造成数据关系的混乱，还会造成网络阻塞，增加服务器压力，显然这个问题也是需要解决的。

函数防抖如何解决上述问题

根据上面对问题的分析，细细思索，可以想到如下解决方案

> 函数防抖的要点，是需要一个`setTimeout`来辅助实现，延迟需要执行的代码。如果方法多次触发，则把上次记录的延迟执行代码用`clearTimeout`清掉，重新开始计时，若计时期间没有被重新触发，等延迟时间计时完毕，则执行目标代码。

函数防抖的代码实现

```js
  	// 防抖函数
    function debounce(fn, wait) {
      let timer = null
      return function () {
       if (timer !== null) {
         clearTimeout(timer)
       }
       timer = setTimeout(fn, wait)
     }
    }

  function handler() {
      console.log(Math.random())
  }

  window.addEventListener('resize', debounce(handler, 1000))
```

- timer就是闭包函数调用的外部变量
- 函数`debounce` 返回的匿名函数调用了`timer`,导致`timer`脱离`debounce`函数的作用域存活于内存中，直到匿名函数也执行完毕，才会被回收。故当点击间隔小于delay毫秒时，timer就会不断更新值，导致`setTimeout`内的匿名函数无法执行(因为`setTimeout`内的函数会延迟`delay`毫秒执行)，直到没有新的调用事件时，`fn`才会正常延迟到`delay`毫秒后执行。

函数防抖的使用场景

函数防抖一般用在什么情况之下呢？一般用在连续的事件只处罚一次回调的场合。

1. 搜索框输入，只需用户最后一次输入完，再发送请求
2. 用户名，手机号，邮箱输入验证
3. 浏览器窗口大小改变后，只需窗口调整完，再执行resize事件中的代码，防止重复渲染。

### 节流

什么是函数节流

函数节流（`throttle`）就是指限制一个函数在一定时间内只能执行一次。

相对于函数防抖来说，函数节流的应用场景和频次更大一些。

> 举个例子，坐火车或地铁，过安检的时候，在一定时间（例如10秒）内，只允许一个乘客通过安检入口，以配合安检人员完成安检工作。上例中，每10秒内，仅允许一位乘客通过，分析可知，函数节流的要点在于，在一定时间之内，限制一个动作，只执行一次。

为什么需要函数节流

某些情况下，浏览器一些高频事件对于用户来说其实并没有太大必要，比如懒加载中的scroll事件，如果是函数防抖的话，只有用户停止滚动后，才会判断是否到了页面底部；如果使用函数节流，只要页面滚动就会间隔时间判断一次，即保留了用户体验，又提升了执行速度，节省资源。

如何实现函数节流

方法1：利用延时器实现原理： 提前定义容器变量用来保存`setTimeout`的返回值，在每次处罚事件，准备开启新的`setTimeout`之前，先检查容器变量中是否保存有`setTimeout`的返回值，如果有，那么不再开启`setTimeout`，保证同一时间只有一个`setTimeout`存在。`setTimeout`执行完毕之后，手动清空变量的返回值。

```js
// 函数节流
function throttle (fn, wait) {
 	let timer = null
 	return function() {
          if (timer) { return }
          timer = setTimeout(() => {
          fn.call(this)
          timer = null
        }, wait)
      }
    }

 function handler() {
      console.log(Math.random())
 }

window.addEventListener('resize', throttle(handler, 1000))
```

方法二： 利用时间戳 实现原理：提前设定变量，准备存储事件结束后的时间戳，在事件开启之后，立即保存时间戳，并判断当前时间戳和事件结束后的时间戳的差值，决定是否需要执行本次事件。事件执行完毕之后，保存事件结束时的时间戳，以供下次开启事件时计算差值。

```js
function throttle (fn, wait) {
    let last = 0
    return function () {
        let now = new Date().getTime()
        if (now - last > wait) {
            fn.call(this)
            last = new Date().getTime()
        }
    }
}

 function handler() {
      console.log(Math.random())
 }

window.addEventListener('resize', throttle(handler, 1000))

```

结合应用场景

`debounce`

`search`搜索联想，用户在不断输入值时，用防抖来节约请求资源。

`window`触发`resize`的时候，不断的调整浏览器窗口大小会不断的触发这个事件，用防抖来让其只触发一次。

`torottle`

鼠标不断点击触发，`mousedown`(单位时间内只触发一次)

监听滚动事件，比如是否滑到底部自动加载更多，用`throttle`来判断



### 递归

函数的递归就是在函数中调用自身

```js
function sum(num){
    if (num === 0) {
        return 0;
    } else {
        return num + sum(--num)
    }
}
 
sum(4);     //10
```

优点：

1. 代码异常简洁

缺点：

1. 由于递归时调用函数自身，而函数调用同需要消耗时间和空间；每次调用都要在内存栈中分配空间以存储参数、临时变量、返回地址等，往栈中压入和弹出数据都需要消耗时间，这势必导致执行效率大打折扣。
2. 递归中的计算大都是重复的，其本质是把一个问题拆解成多个小问题，小问题之间存在互相重叠的部门，这样的重复计算也会导致效率的低下。
3. 调用栈可能会溢出，栈时又容量限制的，当调用层次过多，就会超出栈的容量限制，从而导致栈溢出。

可见递归的缺点还是很明显的，在实际开发中，在可控的情况下，合理使用。



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



### this

在`ES5`中，其实`this`的指向，始终坚持一个原理：`this`永远指向最后调用他的那个对象。

> 普通函数调用： `widnow`
>
> 对象函数调用： 当前对象
>
> 构造函数调用： 创建出来的实例
>
> `apply`，`call`，`bind`的调用，方法后的第一个参数对象
>
> 箭头函数，它的this指向的是上一层的作用域中的`this`

apply 、call、bind的用法和区别

apply、call、bind 都是可以改变 this 的指向的，但是这三个函数稍有不同。

语法

```js
fun.call(thisArg, param1, param2, ...)
         
fun.apply(thisArg, [param1, param2, ...])

fun.bind(thisArg, param1, param2, ...)
```

返回值

call/apply: fun执行的结果

bind: 返回fun的拷贝，并拥有指定的this值和初始参数

参数

> `thisArg`（可选）
>
> 1. 第一个参数是你调用这个函数的对象, fun的`this`指向`thisArg`对象，fun的this指向谁写谁
> 2. 非严格模式下，`thisArg`指定为null,undefined，fun中的this指向window对象
> 3. 严格模式下，fun的this为undefined
> 4. 值为原始值（数字，字符串，布尔值）的this会指向改原始值的自动包装对象，如String、Number、Boolean
>
> `param1, param2`(可选)： 传给fun的参数
>
> 1.如果`param`不传或为null/undefined，则表示不需要传入任何参数
>
> 2.apply第二个参数为数组，数组内的值为传给fun的参数

调用call，apply，bind的必须是个函数

call、apply和bind是挂在function对象上的三个方法，只有函数才有这些方法

只要是函数就可以，比如`Object.prototype.toString`就是个函数，我们经常看到这样的用法:

`Object.prototype.toString(data)`

作用：

改变函数执行时的this指向，目前所有关于它们的运用，都是基于这一点来进行的。   

如何不弄混call和apply

> 弄混这两个`API`的不在少数，不要小看这个问题,记住下面这个方法就好了
>
> `apply`是以a开头，它传给fun的参数是`Array`，也是以a开头

区别

call和apply的唯一区别

传给`fun`的参数写法不同

- `apply`是第2个参数，这个参数是一个数组，传给`fun`参数都写在数组中
- `call`从第2-n的参数都是传给`fun`的

call/apply与bind的区别

执行

- call/apply改变了函数的this上下文后马上执行函数
- bind则是改变了上下文的函数，不执行改函数，需要再次调用。

call/apply/bind的核心理念： 借用方法

程序中：

A对象有个房啊，B对象因为某种原因也需要用到同样的方法，那么这时候我们是单独为B对象扩展一个方法呢，哈斯hi借用一下A对象的方法呢？

当然是借用A对象的方法啦，既达到了目的，又节省了内存。

这就是call/apply/bind的核心理念：借用方法

借用已实现的方法，改变方法中数据的this指向，减少重复代码节省内存。

call和apply应用场景

1. 判断数据类型

`Object.prototype.toString`用来判断类型再合适不过，借用它我们几乎可以判断所有类型的数据：

```js
function isType(data, type) {
    const typeObj = {
        '[object String]': 'string',
        '[object Number]': 'number',
        '[object Boolean]': 'boolean',
        '[object Null]': 'null',
        '[object Undefined]': 'undefined',
        '[object Object]': 'object',
        '[object Array]': 'array',
        '[object Function]': 'function',
        '[object Date]': 'date', // Object.prototype.toString.call(new Date())
        '[object RegExp]': 'regExp',
        '[object Map]': 'map',
        '[object Set]': 'set',
        '[object HTMLDivElement]': 'dom', // document.querySelector('#app')
        '[object WeakMap]': 'weakMap',
        '[object Window]': 'window',  // Object.prototype.toString.call(window)
        '[object Error]': 'error', // new Error('1')
        '[object Arguments]': 'arguments',
    }
    let name = Object.prototype.toString.call(data) // 借用Object.prototype.toString()获取数据类型
    let typeName = typeObj[name] || '未知类型' // 匹配数据类型
    return typeName === type // 判断该数据类型是否为传入的类型
}
console.log(
    isType({}, 'object'), // true
    isType([], 'array'), // true
    isType(new Date(), 'object'), // false
    isType(new Date(), 'date'), // true
)
```

2.类数组借用数组的方法

类数组因为不是真正的数组所以没有数组类型上自带的种种方法，所以我们需要去借用数组的方法

```js
var arrayLike = {
  0: 'OB',
  1: 'Koro1',
  length: 2
}
Array.prototype.push.call(arrayLike, '添加元素1', '添加元素2');
console.log(arrayLike) // {"0":"OB","1":"Koro1","2":"添加元素1","3":"添加元素2","length":4}
```

3. apply获取数组最大值最小值

   apply直接传递数组要做调用方法的参数，也省一步展开数组，比如使用Math.max、Math.min来获取数组的最大值/最小值

```js
const arr = [15, 6, 12, 13, 16];
const max = Math.max.apply(Math, arr); // 16
const min = Math.min.apply(Math, arr); // 6
```

call、apply，该用哪个？

call，apply的效果完全一样，它们的区别也在于

- 参数数量/顺序确定就用call，参数数量/顺序不确定的话就用apply。
- 考虑可读性：参数数量不多就用call，参数数量比较多的话，把参数整合成数组，使用apply。
- 参数即合已经是一个数组的情况，用apply，比如上文的获取数组最大值/最小值

bind的应用场景

1.保存函数参数

首先来看下一道经典的面试题

```js
for (var i = 1; i <= 5; i++) {
   setTimeout(function test() {
        console.log(i) // 依次输出：6 6 6 6 6
    }, i * 1000);
}
```

造成这个现象的原因是等到`setTimeout`异步执行时，`i`已经变成6了。

那么如何使他输出1,2,3,4,5呢？

方法有很多

闭包，保存变

```js
for (var i = 1; i <= 5; i++) {
    (function(i) {
        setTimeout( function () {
            console.log('闭包'， i) //依次输出 1 2 3 4 5
        }， i* 1000)
    }(i))
}
```

在这里创建了一个闭包，每次循环都会把`i`的最新值传进去，然后被闭包保存起来。

bind

```js
for (var i = 1; i <= 5; i++) {
    // 缓存参数
    setTimeout(function (i) {
        console.log('bind', i) // 依次输出：1 2 3 4 5
    }.bind(null, i), i * 1000);
}
```

**实际上这里也用了闭包，我们知道bind会返回一个函数，这个函数也是闭包**。

它保存了函数的this指向、初始参数，每次`i`的变更都会被bind的闭包存起来，所以输出1-5。

具体细节，下面有个手写bind方法，研究一下，就能搞懂了。

### 算法

`Q1` 判断一个单词是否是回文？

>  回文是指把相同的词汇或句子，在下文中调换位置或颠倒过来，产生首尾回环，叫做回文。
>
> 其实重要的考擦就是对于reverse的实现，其实我们可以利用现成的函数，将字符串转成数组。
>
> 这个思路很重要，我们可以拥有更多的自由度去进行字符串的一些操作。

```js
https://blog.csdn.net/weixin_38984353/article/details/80393412
```

