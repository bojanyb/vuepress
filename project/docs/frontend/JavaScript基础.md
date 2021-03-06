## JavaScript基本概念

### 语法

> 任何的核心都必然会描述这门语言最基本的工作原理。而描述的内容通常都要涉及这门语言的语法、操作符、数据类型、内置功能等用于构建复杂解决方案的基本概念。

#### 语法

> `ECMAScript`的语法大量借鉴了C及其他类C语言（如Java和Perl）的语法。因此，熟悉这些语言的开发人员在接受`ECMAScript`更加宽松的语法时，一定会有一种轻松自在的感觉。

#### 区分大小写

> 要理解的第一个概念就是`ECMAScript`的一切（变量、函数和操作符）都区分大小写。这也就是`test`和`Test`分别表示两个不同的变量，而函数名不能使用`typeof`，因为他是一个关键字。但`typeOf`则完全可以是一个有效的函数名。

#### 标识符

> 所谓标识符，就是指变量、函数、属性的名字，或者函数的参数。表示服可以是按照下列各式规则组合起来的一或多个字符：
>
> - 第一个字符必须是一个字母、下划线或者一个美元符号。
> - 其他字符可以是字母、下划线、美元符号或数字。
>
> 按照惯例，`ECMAScript`标识符采用驼峰大小写格式，也就是第一个字母小写，剩下的每个有意义的单词的首字母大写。
>
> 不能把关键字、保留字、`true`和`false`和`null`用作标识符。

#### 注释

```js
//  单行注释

/*
 *  多行注释
 */
```

#### 严格模式

> `ES5`引入严格模式的概念，严格模式是为了JavaScript定义了一种不同的解析与执行模式。在严格模式下，`ES3`中一些不确定改的行为得到处理，而且对某些不安全的操作也会抛出错误。要在整个脚本中启用严格模式，可以在顶部添加如下代码:
>
> "user strict"

#### 语句

> ES中的语句以一个分号结尾，如果省略分号，则由解析器确定语句的结尾

#### 关键字和保留字

> `ECMA-262`描述了一组具有特定用途的关键字和不能用作标识符的保留字，不能用作标识符或属性名，否则会抛出错误。

#### 变量

> ES的变量是松散类型的，所谓松散类型就是可以用来保存任何类型的数据。换句话说，每个变量仅仅是一个用于保存值的占位符而已。定义变量时要使用`var`操作符

```js
// 未经过初始化的变量，会保存一个特殊的值 - undefined
var message

// 在此，变量message中保存了一个字符串值"hi"，先这样初始化变量并不会把它标记为字符串类型；初始化的过程就
// 是给变量赋一个值那么简单。因此可以在修改变量值的同时修改值的类型

var message = "hi"
message = 100 // 有效，但不推荐

// 有一点必须注意，即使用var操作符定义的变量将成为定义改变了作用域的局部变量，也就是说，如果函数中使用了var定义一个变量，那么这个变量在函数推出后就会被销毁。

function test（） {
    var message = "hi" //局部变量 
}
test()
alert(message)  //错误


```



### 数据类型

### 流控制语句

### 理解函数

## 变量、作用域和内存问题

## 引用类型

## 面向对象的程序设计

## 函数表达式

## BOM

## 客户端检测

## DOM



