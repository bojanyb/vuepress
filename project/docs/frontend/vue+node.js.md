# `Vue` + `Node`

## 项目准备

### 一、基础篇

#### `Vue`进阶

- 事件绑定 `$emit`和`$on`
- 指令 `directive`
- 插件 `Vue.use`
- 组件化`Vue.component` 
- 组件通信`provide`和`inject`
- 过滤器 `filter`
- 监听器 `watch`
- `class`和`style`绑定的高级用法
- 2.6新特性
  - `Vue.observable`
  - 插槽 `slot`

#### `Element-UI`

- `VUE-CLI 3 Element插件`
- `element`按需加载
- 表单开发
- 列表开发
- `el-form`源码解读

#### `vuex`和`vue-router`进阶

- `vuex`实现原理解析
- `vue-router`实现原理解析
- `vue-router`路由守卫
- `vue-router`路由元信息
- `vue-router`路由API

#### `vue-element-admin`框架解读

- 登录逻辑
- 网络请求
- 页面框架（Layout）
- 动态生成路由
- 图标使用
- 面包屑导航

#### Node进阶

- `Node`框架介绍
- `Node`的常用库介绍
- `Node`本地应用开发
- `Node`网络应用开发
- `Node`操作数据库

#### Express入门

- `Express`基础案例
- `Express`路由
- `EXpress`中间件
- `Express`异常处理

### 二、实战篇

#### 准备工作

- `Nginx`服务器
- `MySQL`数据库
- 安装`Node`和`Vue`

#### 项目实战

##### 实现功能

- 登录
- 文件上传
- `EPUB`电子书解析
- 新增/编辑电子书
- 电子书列表
- 删除电子书

##### 涉及技术点包括

- `JWT`认证 --登录token认证
- `EPUB`解析电子书
- `XML`解析
- `ZIP`解压
- `MULTER`文件上传
- `MySQL`数据库操作

##### 项目发布

- `CentOS`服务器
- 域名服务
- `https`服务
- `git`仓库

#### `Element-UI`

#### `Vuex`和`Vue-router`进阶

> `Vuex`的原理关键：使用`Vue`实例管理状态
>
> `VueRouter`实现原理: `vue-router`实例化时会初始化`this.history`,不同mode对应不同的history
>
> 

#### 项目结构

-  `api` 接口请求
- `assets` 静态资源
- `components` 通用组件
- `directive` 自定义指令
- `filters` 自定义过滤器
- `icons`图标组件
- `layout`布局组件
- `router`路由配置
-  `store` 状态管理
- `styles`自定义样式
- `utils`通用工具方法
  - `auth.js` token存取
  - `permission.js` 权限检查
  - `request.js` `axios` 请求封装 
  - `index.js` 工具方法
- `views` 页面
- `permission.js` 登录认证和路由跳转
- `settings.js` 全局配置
- `main.js` 全局入口文件
- `App.vue`全局入口组件

## Node后端框架搭建

### Node简介

`Node`是一个基于`V8`引擎的`JavaScript`运行环境，它使得`JavaScript`可以运行在服务端，直接与操作系统进行交互，与文件控制，网络交互，进行控制等

> `Chrome` 浏览器同样是集成了`V8`引擎的`JavaScript`运行环境，与`Node`不同的是他们向`JavaScript`注入的内容不同，`Chrome`向`JavaScript`注入了`window`对象，`Node`注入的是`global`，这使得两者应用场景完全不同，`Chrome`的`JavaScript`所有指令都需要通过`Chrome`浏览器作为中介实现

### Express简介

`Express`是一个轻量级的`Node Web`服务端框架，同样是一个人气超高的项目，它可以帮助我们快速搭建基于`Node`的`web`应用

#### Express三大基础概念

##### 中间件

中间件是一个函数，在请求和响应周期中被顺序调用

```js
const myLogger = function(req, res, next) {
    console.log('myLogger')
    next()
} 

app.use(myLogger)
```

> 中间件需要在响应结束前被调用，除了异常处理

##### 路由

应用如何响应请求的一种规则

响应/路径的get请求

```js
app.get('/', function(req, res) {
    res.send('hello node')
})
```

响应/路径的post请求

```js
app.post('/', function(req, res) {
    res.send('hello node')
})
```

规则主要分两部分

- 请求方法： get、post ......
- 请求的路径： / 、 /user 、 /*fly$/

##### 异常处理

通过自定义异常处理中间件处理请求中产生的异常

```js
app.get('/', function(req, res) {
   throw new Error('something has error...')
})
const errorHandler = function(err, req, res, next) {
    console.log('errorHandler...')
    res.status(500).json({
        error: -1,
        msg: err.toString()
    })
    res.send(down...)
}

app.use(errorHandler)

```

> 使用时需要注意两点
>
> - 第一，参数一个不能少，否则会视为普通的中间件
> - 第二，中间件需要在请求之后引用

## 项目需求分析

### 技术难点

#### 登录

- 用户名密码校验
- token生成、校验和路由过滤
- 前端token校验和重定向

#### 电子书上传

- ### 文件上传
- 静态资源服务器

#### 电子书解析

- `epub`原理
- `zip`解压
- `xml`解析

#### 电子书增删改

- `mysql`数据库应用
- 前后端异常处理

### `epub`电子书

`epub`是一种电子书格式，它的本质是一个zip压缩包

### `Nginx`配置

## 用户登录

debugger

三点运算符 为什么要浅拷贝

JWT

## 电子书上传

### `sticky`组件实现吸顶效果

### 通过ref里面的status属性实现显隐效果，配合sticky组件的class-name

###  通过路由控制创建和编辑组件Detail的切换

### 电子书解析