# webpack 

### 一、网络综合问题

### 1 解决`vue` `axios`跨域request methods：OPTIONS问题（预检请求）

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

### 3 配置 `webpack-dev-server`

- `webpack-dev-server`是webpack官方提供的小型`Express`服务器，使用它可以为`webpack`打包生成的资源文件提供web服务。

1. `webpack-dev-server`主要提供两个功能

- 1 为静态文件提供`web`服务
- 2 自动刷新和热更新

1. 配置`webpack.config.js`文件

```
//使用一
module.exports = {
    //...
    devServer: {
        proxy: {
            '/api': 'http://localhost:3000'
        }
    }
};
//请求到/api/xxx现在会被代理到请求http://localhost:3000/api/xxx, 例如 /api/user 现在会被代理到请求 http://localhost:3000/api/user

module.exports = {
    dev: {
    // 静态资源文件夹
    assetsSubDirectory: 'static',
    // 发布路径
    assetsPublicPath: '/',

    // 代理配置表，在这里可以配置特定的请求代理到对应的API接口
    // 使用方法：https://vuejs-templates.github.io/webpack/proxy.html
    proxyTable: {
        // 例如将'localhost:8080/api/xxx'代理到'https://wangyaxing.cn/api/xxx'
        '/api': {
            target: 'https://wangyaxing.cn', // 接口的域名
            secure: false,  // 如果是https接口，需要配置这个参数
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
        },
        // 例如将'localhost:8080/img/xxx'代理到'https://cdn.wangyaxing.cn/xxx'
        '/img': {
            target: 'https://cdn.wangyaxing.cn', // 接口的域名
            secure: false,  // 如果是https接口，需要配置这个参数
            changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
            pathRewrite: {'^/img': ''}  // pathRewrite 来重写地址，将前缀 '/api' 转为 '/'。
        }
    },
    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 4200, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
}

target：要使用url模块解析的url字符串
forward：要使用url模块解析的url字符串
agent：要传递给http（s）.request的对象（请参阅Node的https代理和http代理对象）
ssl：要传递给https.createServer（）的对象
ws：true / false，是否代理websockets
xfwd：true / false，添加x-forward标头
secure：true / false，是否验证SSL Certs
toProxy：true / false，传递绝对URL作为路径（对代理代理很有用）
prependPath：true / false，默认值：true - 指定是否要将目标的路径添加到代理路径
ignorePath：true / false，默认值：false - 指定是否要忽略传入请求的代理路径（注意：如果需要，您必须附加/手动）。
localAddress：要为传出连接绑定的本地接口字符串
changeOrigin：true / false，默认值：false - 将主机标头的原点更改为目标URL
```

### 4 webpack基础配置

```
publicPath 
productionSourceMap
```



### 5 webpack知识点

前端代码为何要进行构建和打包？

module chunk bundle分别什么意思？有何区别？

loader和plugin的区别？

webpack如何实现懒加载？

webpack常见性能优化

babel-runtime和babel-polyfill的区别



### 6 webpack 基本配置

拆分配置和merge







