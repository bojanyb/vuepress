# 实战篇 - 网络

### 一、网络综合问题

1 解决`vue` `axios`跨域request methods：OPTIONS问题（预检请求）

- 我们在`vue`开发中用`axios`进行跨域请求时有时会遇到，同一个接口请求了两次，并且第一次都是`options`请求，然后才是`post/get`请求

- 为什么会出现这种原因呢？这是因为`CORS`跨域分为简单跨域请求和复杂跨域请求，简单跨域请求不会发送`options`请求，复杂跨域请求会发送一个预检请求`options`

- > 1 简单跨域满足的条件
  >
  > 1 请求方式是以下三种之一：
  >
  > HEAD
  >
  > GET
  >
  > POST
  >
  > 2.HTTP头的信息不超出以下几种字段
  >
  > Accept
  >
  > Accept-Language
  >
  > Content-Language
  >
  > Last-Event-ID
  >
  > Content-Type ： `application/x-www-from-urlencoded` 、`multipart/form-data`、`text/plain`
  >
  > 2 复杂跨域满足的条件
  >
  > 1 请求方法不是GET/HEAD/POST
  >
  > 2 post的请求的Content-Type并非`application/x-www-from-urlencoded` 、`multipart/form-data`、`text/plain`
  >
  > 3 请求设置了自定义的header字段
  >
  > 在header中自定义了字段就会触发options预检请求

- 解决方案
- 可以通过跟后端协商，将所有`options`放行，此时变更通过`post/get`请求访问到数据
- 引入`qs`模块处理数据 
- `qs.parse()`将URL解析成对象的形式
- `qs.stringify()`将对象序列化成URL的形式，以&进行拼接
- `vue`实例组件里都有可以直接用`this.$qs.sttringify(data)`，进行数据转换
- 个人倾向第一种方法，如果用第二种方法对前后端来说比较繁琐

### 2 开发环境下`vue` `proxyTable`配置代理解决跨域

- `vue` + `webpack`构建的项目解决浏览器跨域问题

> 浏览器同源策略是浏览器的一种保护机制
>
> 浏览器发送跨域的Ajax请求时，并不是请求发不出去，请求可以发出去，并且后台接收请求后可以返回响应数据，但是浏览器不接收这些不同源的响应数据。

- 代理的原理

> 代理的位置： web服务器
>
> 代理拦截浏览器发出的`ajax`请求，将其转发给目标后台服务器，然后获取到响应后再将响应发回给浏览器。
>
> 由于代理的位置时再web服务器，也就是浏览器的同源策略所限制的域内，所以浏览器接收到此响应后不会将其视为危险资源，会正常解析执行。

- 在`config/index.js`中配置`proxyTable`代理

```js
proxyTable: { //配置代理
    '/api': { //配置所有以'/api'开头的请求路径
        target： '192.168.123.50: 400', 代理目标的基础路径
        changeOrigin: true, //支持跨域
            pathRewrite: { //重写路径： 去掉路径中开头的'/api'
                '^/api': ''
            }
    }
}
```

- 此方法可以解决开发环境下的跨域问题，生产环境还需配合后端解决

### 3 git分支管理

项目中长期存在的两个分支

- master： 主分支，负责记录上线版本的迭代，该分支代码与线上代码完全一致
- develop： 开发分支，改分支记录相对稳定的版本，所有的feature分支和bugfix分支都从该分支创建

其他分支为短期分支，其完成功能开发之后需要删除

- feature/* ： 特性（功能）分支，用于开发新的功能，不同的功能创建不同的功能分支，功能分支开发完成且自测通过之后，需要合并到develop，之后删除该分支
- bugfix/* : bug修复分支，用于修复不紧急的bug,普通的bug均需要创建bugfix分支开发，开发完成自测没问题后合并到develop分支后，删除该分支
- release/*： 发布分支，用于代码上线准备，该分支从develop分支创建，创建之后由测试同学发布到测试环境进行测试，测试过程中发现bug需要开发人员在release分支上进行bug修复，所有bug修复完后，在上线之前，需要合并该release分支到master分支和develop分支
- houtfix/*: 紧急bug修复分支，该分支值在紧急情况下使用，从master分支创建，用于紧急修复线上bug,修复完成后，需要合并该分支到master分支以便上线，同时需要合并到develop分支。

总结

- 如果上面内容太多记不住，也没有关系，作为开发人员，刚开始的时候只要知道以下几点就足够了，其他的可以在碰到的时候再深入学习
- 所有的新功能开发，bug修复都要从develop分支拉取新的分支开发，开发完成自测没有问题再合并到develop分支
- release分支发布到测试环境，由开发人员创建release分支，并发布到测试环境，如果测试过程中发现bug,需要开发人员track到改release分支修复bug,上线前需要测试人员提交merge request到master分支，准备上线，同时需要合并到develop分支
- 只有紧急情况下才允许master上拉取hotfix分支，hotfix分支需要最终同时合并到develop和master分支（共两次合并操作）
- 出了master和develop分支，其他分支开发完成后都要删除



### 4 获取移动浏览器实际可用高度

- 获取移动浏览器实际可用高度：去掉顶部地址栏、底部操作栏

```js
function getBrowserInterfaceSize() {
    var pageWidth = window.innerWidth;
    var pageHeight = window.innerHeight;

    if (typeof pageWidth != "number") {
        //在标准模式下面
        if (document.compatMode == "CSS1Compat" ) {
            pageWidth = document.documentElement.clientWidth;
            pageHeight = document.documentElement.clientHeight;
        } else {
            pageWidth = document.body.clientWidth;
            pageHeight = window.body.clientHeight;
        }
    }

    return {
        pageWidth: pageWidth,
        pageHeight: pageHeight
    }
}
```

- 也可以利用 meta 标签让浏览器直接全屏，代码如下：

```html
<!-- 启用 WebApp 全屏模式 -->
<meta name="apple-mobile-web-app-capable" content="yes" /> 

<!-- uc强制竖屏 -->
<meta name="screen-orientation" content="portrait">

<!-- UC强制全屏 --> 
<meta name="full-screen" content="yes">

<!-- UC应用模式 --> 
<meta name="browsermode" content="application">

<!-- QQ强制竖屏 -->
<meta name="x5-orientation" content="portrait">

<!-- QQ强制全屏 -->
<meta name="x5-fullscreen" content="true">

<!-- QQ应用模式 -->
<meta name="x5-page-mode" content="app">
```

### 5 解决事件穿透的方法

```js
//弹出框禁止滑动
Vue.prototype.noScroll = function () {
    var mo = function (e) { e.preventDefault() }
    document.body.style.overflow = 'hidden'
    document.addEventListener('touchmove', mo, false)// 禁止页面滑动
  }
   
  //弹出框可以滑动
  Vue.prototype.canScroll = function () {
    var mo = function (e) {
      e.preventDefault()
    }
    document.body.style.overflow = ''// 出现滚动条
    document.removeEventListener('touchmove', mo, false)
  }
```

### 6 `webpack`重构

```
publicPath ： '' 根域上下文目录
1 设置为/时，部署后请求路径
xxx/css/app.css
2 设置为./时，部署后请求路径
xxx/test/css/app.css
outputDir: 'dist' 构建输出目录
assetsDir： 'static' 静态资源目录 (js, css, img, fonts)
lintOnSave： true  是否开启eslint保存检测，有效值：ture | false | 'error'
productionSourceMap: false, 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度

devServer:{ // 服务器插件
	port: 8000, 端口号 
	open: true, 自动打开
	overlay： {}, 代码检测
	proxy: { 代理
        target： 目标接口
        secure: 是否是https
        cangeOrigin: 是否跨域
        pathRewrite： 路径重定向
	}
}
configureWebpack 基础配置 基于环境有条件地配置行为，或者想要直接修改配置
chainWebpack 高级配置 定义具名的 loader 规则和具名插件


```

### 7 `vue-cli3` 自己设置--mode区分环境打包，dist不压缩

```
只能配置 NODE_ENV=production webpack的读取NODE_ENV配置才启用压缩逻辑，默认是dev的NODE_ENV所以打包出来特别大

NODE_ENV = 'production'

配置.env环境的业务变量

只有以 VUE_APP_ 开头的变量会被 webpack.DefinePlugin 静态嵌入到客户端侧的包中。你可以在应用的代码中这样访问它们：
```

### 8 `toFixed`

```js
NumberObject.toFixed(num)
// toFixed() 方法可把 Number 四舍五入为指定小数位数的数字。

var num =Number(13.37);
console.log(num.toFixed(1)); //13.4
console.log(num);//13.37
```

