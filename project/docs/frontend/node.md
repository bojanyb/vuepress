## Node服务端开发框架搭建

### Node简介

Node是一个基于V8引擎的的JavaScript运行环境，它使用JavaScript可以运行在服务端，直接与操作系统进行交互，与文件控制、网络交互、进程控制等

> Chrome浏览器同样是集成了V8引擎的JavaScript运行环境，与Node不同的是他们向JavaScript注入的内容不同，Chrome向JavaScript注入了window对象，Node注入的是global，这使得两者应用场景完全不同，Chrome的JavaScript所有指令都需要通过Chrome浏览器作为中介实现。

### Express简介

express是一个轻量级的Node Web服务端框架，同样是一个人气超高的项目，它可以帮助我们快速搭建基于Node的web应用。

### 项目初始化

```npm
npm init -y  // 项目初始化 -y yes的意思，在init的时候省去了敲回车的步骤，生成的默认的package.json
npm i -S express // npm i -S等同于npm i --save, 在运行命令的目录中下载指定的包到node_modules, 如果package.json存在的话, 同时写入到package.json的dependencies字段
```

### Express三大基础概念

中间件

```js

```

路由

```

```

异常处理

```

```

