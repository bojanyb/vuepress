# webpack 

### 一、webpack基础

### 1 webpack 基本配置

- 基本配置

  - 拆分配置和merge

    - 拆分配置，分为三个文件夹

      - webpack.common.js //公共配置

        - entry 构建文件输出路径

        - module 里面可以定义每个loader，js的loader，css的loader，sass的loader

          - ```js
            module: {
                rules: [
                    {
                        test: /\.js$/, //验证规则
                        loader: ['babel-loader'],
                        include: srcPath, //处理文件夹
                        exclude: /node_modules/ //排除文件夹
                    }
                ]
            }
            ```

            

        - pulugins  htmlWebpackPlugin  可以生成创建html入口文件，比如单页面可以生成一个html文件入口

      - webpack.dev.js //生成环境

        - 开发环境定义一个dev-server本地服务

      - webapck.prod.js // 开发环境

        - 线上环境不定义dev-server

    - 安装`webpack-merge`把公共配置引入到每个环境中

    - > 一般情况下，webpack的配置是先定义一个common公共配置，再定义一个dev的配置，再定义一个prod的配置，通过webpack-merge把common引入到dev和prod

- dev-server

  - 一个插件，可以启动本地服务
  - 怎么跨域请求，通过dev-server里面proxy代理实现跨域

- 解析ES6

  - babel-loader  解析ES6
  - 在module里面配置loader
  - 在.babelrc的文件里面配置一下persets里的preset-env,可以解析ES6, ES7, ES8的常用语法

- 解析样式

  - css-loader 
    - style-loader和css-loader,postcss-loader来解析CSS
    - 先用css-loader解析文件内容，再用style-loader插入到页面中, postcss-loader可以解决浏览器兼容器
    - 在postcss.config.js文件里面配置一下，autoprefixer是用来添加浏览器前缀的。
  - less-loader
    - style-loader, css-loader, less-loader

- 解析图片文件

  - dev环境
    - 直接用file-loader进行解析
  - prod环境
    - 用url-loader进行解析,产出base64格式，写在HTML文件里
    - options里面配置如果小于5kb的图片用base64格式, 如果大于5kb依然使用file-loader进行解析，需要单独放置一个文件夹
    - 产出base64格式，那么就可以减少一次请求。

- 常见loader和plugin

  - loader  style-loader, css-loader, less-loader
  - dev-server htmlWebpackPlugin   CleanWebpackPlugin

- output 输出 filename： bundle.[contentHash].js 

  - //在所有的打包输出的文件当中，都带有一个hash值
  - 如果内容变了，hash值就变，内容不变，hash值就不变。 
  - 打包之后，在前台刷新会请求bundle.js，如果hash不变，再请求的时候就会命中缓存。会让网页请求更快一些



### 2 webpack 高级配置

- 多入口

  - entry写两个入口
  - output里面bundle写成一个变量，变量依赖entry的属性名来生成
  - htmlWebpackPlugin  生成多个html文件，针对每一个入口都要新建一个htmlWebpackPlugin  的插件
  - chunks 指定引入的js文件
  - 配置CleanWebpackPlugin，每次打包都会清空output/path

- 抽离和压缩CSS

  - 在dev环境，直接用style-loader插入页面
  - 抽离CSS
    - 在prod环境
      - 在module，rules里面用MiniCSSExtractPlugin.loader将css抽离出来
      - 在plugins, 用 new MiniCSSExtractPlugin 配置filename
  - 压缩CSS
    - optimization
      - 用两个插件来压缩 optimizeCSSAssetsPlugin TerserJSPlugin

- 抽离公共代码

  - 抽离公共代码，抽离第三方代码
    - optimization
      - splitchunks
        - vendor //第三方模块
        - common // 公共模块
  - 配置htmlwebpackplugin里的chunks 模块
  - chunk是什么

- 懒加载

  - ```javascript
    const Login = () => import('./login')
    // 直接import（'/文件路径')， import会返回一个Promise， 不写大括号 表示直接return
    ```

- 处理vue

  - 直接安装vue-loader



### 3 优化构建速度

- 优化babel-loader
  - 开启缓存和限定范围
  - 加一个参数cacheDirectory， 会开启缓存
  - 没有修改代码，就不会重新编译
  - 用include限定打包范围比如src
- lgnorePlugin
  - 避免哪些插件
- noParse
  - 不去管哪些
- happyPack
  - 多进程打包工具
    - JS单线程，开启多进程打包
    - 引入happyPack, 直接module里面use
    - 然后在plugins里面实例化happyPack，并添加配置
  - 如果是小型项目，不要用多进程打包，多进程是有一定开销的，会减慢速度
- ParallelUglifyPlugin
  - 多进程代码压缩
    - JS单线程，开启多进程打包
    - 引入ParallelUglifyPlugin, 直接module里面use
    - 然后在plugins里面实例化ParallelUglifyPlugin，并添加配置
- 自动刷新
  - 保存代码自动刷新
- 热更新
  - 浏览器不用刷新就生效
  - 引入HotModuleReplacementPlugin
  - 在plugin里面new一下
  - 在dev-server里面写一下hot： true
- DllPlugin
  - 针对大的库第三方插件，没有必要每次都打包，做成DLL每次打包都引用他
  - 动态连接库Dll



### 4 优化产出代码

- 体积更小
- 合理分包，不重复加载
- 执行速度更快，内存使用更小



- 使用生产环境
- 小图片base64编码
  - 小于5kb用url-loader解析产出base64图片
  - 大于5kb用file-loader解析产出普通图片
- bundle加hash
  - output里面输出的bundle文件加上contentHash值
  - 内容变化，hash值会变，内容不变，hash值不变，会命中缓存
- 使用CDN
  - 可以在publicpath配置CDN地址
- 提取公共代码
  - 第三方代码，vue react，单独打出来
  - 公共代码，单独打出来
  - 会让打包出来的代码体积更小
- 可以忽略掉不需要打包的代码
- 懒加载
  - 通过improt加载
- scope hosting
  - 合并相同的作用域函数



### 5 babel

- polyfill
- runtime



### 6 webpack问题

前端代码为何要进行构建和打包？

module chunk bundle分别什么意思？有何区别？

- module  各个源码文件，webpack中一切皆模块， 比如index.js ,img.png都是模块，能够引用的都是模块
- chunk 多模块合并成的， entry，splitChunk 都可以定义chunk
- bundle 最终输出的文件

loader和plugin的区别？

webpack如何实现懒加载？

webpack常见性能优化

babel-runtime和babel-polyfill的区别

ES module 和 Common.js 的区别

- ES6是静态引入，编译时引入
- Common.js动态引入，执行时引入



### 7 webpack基础配置

```
publicPath 
productionSourceMap
```





### 二、网络综合问题

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

### 4 npm -S -D

- devDependencies 里面的插件只用于开发环境，不用于生产环境

  - webpack或者gulp是用来打包压缩代码的工具，在项目实际运行的时候用不到，所以把webpack或者gulp放到devDependencies 中就行了。
  - 写入dependencies

- dependencies 是需要发布到生产环境的

  - 我们在项目中用到了element-ui或者mint-ui，在生产环境中运行项目，当然也需要element-ui或者mint-ui，所以我们把element-ui或者mint-ui安装到dependencies中。
  - 写入devDependencies

  





