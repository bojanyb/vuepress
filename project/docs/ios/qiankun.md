### 微前端

#### 微前端落地

2018年，`single-spa`诞生了，`single-spa`是一个用于前端微服务化的`JavaScript`前端解决方案（本身没有处理样式隔离，js执行隔离）实现了路由劫持和应用加载。

2019年，`qiankun`基于`single-spa`提供了更加开箱即用的API（`single-spa` + `sandbox` + `import-html-entry`）做到了，技术栈无关、并且介入简单（像`iframe`一样简单).

> 总结：子应用可以独立构建，运行时动态加载，主子应用完全解耦，技术栈无关，靠的是协议接入（子引用必须到处bootstrap，mount，unmount方法）

这里先回答大家肯定会问得问题：

#### 这不是`iframe`吗？

如果使用`iframe`，`iframe`中的子应用切换路由时用户刷新页面就尴尬了

#### 应用通信

- 基于URL进行数据传递，但是传递消息能力弱
- 基于`CustomEvent`实现通信
- 基于props主子引用间通信
- 使用全局变量，Redux进行通信

#### 公共依赖

- CDN - `externals` 
- `webpack` 联邦模块
- 比如一些公共模块`Vue`，`vue-router`等

#### 引言

> 采用`Vue`作为主应用基座，接入不同技术栈的微应用。
>
> `qiankun`属于无侵入性的微前端框架，对主应用基座的微应用 的技术栈都没有要求

#### 构建主应用基座

我们以实战案例 - 



