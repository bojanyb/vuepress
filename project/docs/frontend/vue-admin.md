## vue开发框架搭建

### 目录结构

```js
build  			// 构建相关
config			// 配置相关
src				// 源代码
	api			// 所有请求
    assets		// 主题字体等静态资源
    components 	// 全局公用组件
    directive	// 全局指令
    filters		// 全局filter
    icons		// 项目所有svg icons
    lang		// 国际化language
    mock		// 项目mock 模拟数据
    router		// 路由
    store		// 全局store管理
    styles		// 全局样式
    utils		// 全局公用方法
    vendor		// 公用vendor
    views 		// view
    APP.vue		// 入口页面
	main.js		// 入口 加载组件 初始化
	permission.js 	// 权限管理
	.babelrc		// babel-loader配置
	.eslinttrc.js 	// eslint配置
    .gitignore 		// git忽略项
	favicon.ico		// favicon图标
	index.html		// html模板
	package.json	// package.json
```

#### `api`和`views`

中大型后台项目，大概有四五十个`api`模块，随着业务的迭代，模块还会越来越多，所以这里建议根据业务模块来划分`views`，并且将`views`和`api`两个模块一一对应，从而方便维护。

#### `components`

这里的`components`放置的都是全局公用的一些组件，如上传组件，富文本等等。一些页面级的组件建议还是放在各自views文件下，方便管理。

#### `store`

这里我个人建议不要为了用`vuex`而用`vuex`。就那我司的后台项目来说，它虽然比较庞大，几十个业务模块，几十种权限。但业务之间的耦合度是很低的。文章模块和评论模块几乎是两个独立的东西，所以根本没必要使用`vuex`来存储`data`,每个页面里存放自己的data就行了。当然有些数据还是需要用`vuex`来统一管理的，如登录token,用户信息，或者一些全局个人偏好设置等，还是用`vuex`管理更加的方便，具体当然还是要结合自己的业务场景，总之不要为了`vuex`而用`vuex`。

#### `webpack`

这里用`vue-cli`的`webpack-template`为基础模板构建的。可以自行百度，说一些需要注意的地方。

`alias`

当项目逐渐变大之后，文件与文件直接的引用关系会很复杂，这时候就需要使用`alias`了。有的人喜欢`alias`指向`src`目录下，再使用相对路径找文件。

```js
resolve: {
  alias: {
    '~': resolve(__dirname, 'src')
  }
}

//使用
import stickTop from '~/components/stickTop'
```

或者也可以

```js
alias: {
  'src': path.resolve(__dirname, '../src'),
  'components': path.resolve(__dirname, '../src/components'),
  'api': path.resolve(__dirname, '../src/api'),
  'utils': path.resolve(__dirname, '../src/utils'),
  'store': path.resolve(__dirname, '../src/store'),
  'router': path.resolve(__dirname, '../src/router')
}

//使用
import stickTop from 'components/stickTop'
import getArticle from 'api/article'
```

#### `ESLint`

不管是多人合作还是个人项目，代码规范是很重要的。这样做不仅可以很大程度地避免基本语法错误，也保证了代码的可读性。这所谓工欲善其事，必先利其器。个人推荐`eslint`插件+`vscode`来写`vue`,绝对有种飞一般的感觉。

每次保存，`vscode`就能标红不符合`eslint`规则的地方，同时还会做一些简单的自我修正。

1. 首先安装`ESLint`插件
2. 安装并配置`ESLint`后，我们继续回到`VSCode`进行扩展设置，一次点击文件 > 首选项 > 设置 打开`VSCode`配置文件。

```js
 "files.autoSave":"off",
    "eslint.validate": [
       "javascript",
       "javascriptreact",
       "html",
       { "language": "vue", "autoFix": true }
     ],
     "eslint.options": {
        "plugins": ["html"]
     }
```

这样每次保存的时候就可以根据根目录下`.eslintrc.js`你配置的`eslint`规则来检查做一些简单的fix。这里提供了一份我平时的`ESLint`规则地址，都简单写上了的注释。每个人和团队都有自己的代码规范，统一就好了，去打造一份属于自己的`eslint`规则上传`npm`吧。

#### 封装`axios`

我们经常遇到一些线上的bug，但测试环境很难模拟。其实可以通过简单的配置就可以在本地调试线上环境。这里结合业务封装了`axios`。

```js
import axios form 'axios'
import { Message } form 'element-ui'
import store form '@/store'
import { getToken } form '@/utils/auth'

// 创建axios实例
const service = axios.create({
    baseURL: process.env.BASE_API, //api的base_url
    timeout: 5000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
    // Do something before request is sent
    if (store.getters.token) {
        config.headers['x-Token'] = getToken() // 让每个请求携带token--['X-Token']为自定义key 请根据实际
    }
    return config
}, error => {
    // Do something with request error
    console.log(error) // for debug
    promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
response => response
    //下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回登录页
    // 如通过xmlhtpprequest状态码标示，逻辑可卸载下面error中
    const res = response.data
    if (res.code !== 20000) {
    Message({
        message: res.message,
        type:'error',
        duration: 5 * 1000
    })
    // 50008: 非法token； 50012： 其他客户登录了； 50014：token过期了；
    if （res.code === 50008 || res.code50012 || res.code === 50014 ）{
        MessageBox.confirm('你已被登出，可以取消继续留在该页面，或重新登录'，'确定登出'，{
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
          }).then(() => {
            store.dispatch('FedLogOut').then(() => {
                location.reload(); //为了重新实例化vue-router对象，避免bug
            })
        })
    }
	return Promise.reject('error')
} else {
    return response.data
}
)

error => {
    console.log('err' + error) // for debug
    Message({
        message: error.message,
        type: 'error',
        duration: 5 * 1000
    })
    return Promise.reject(error)
})

export default service
```

```js
import request from '@/utils/request'

//使用
export function getInfo(params) {
  return request({
    url: '/user/info',
    method: 'get',
    params
  });
}
```

比如后台项目，每一个请求都是要带token来验证权限的，这样封装一下的话，我们就不用每个请求都手动来塞token，或者做一些统一的异常处理，一劳永逸。而且因为我们的api是根据env环境变量动态切换的，如果以后线上出现bug,我们只需配置一下`@config/dev.env.js`再重启一下服务，就能在本地模拟线上的环境了。

```js
module.exports = {
    NODE_ENV: '"development"',
    BASE_API: '"https://api-dev"', //修改为'"https://api-prod"'就行了
    APP_ORIGIN: '"https://wallstreetcn.com"' //为公司打个广告 pc站为vue+ssr
}
```

#### 多环境

`vue-cli`默认只提供了`dev`和`prod`两种环境。但其实真的开发流程还会多一个`sit`或者`stage`环境，就是所谓的测试环境和预发布环境。所以我们就要简单的修改一下代码。其实很简单，就是设置不同的环境变量。

```js
"build:prod": "NODE_ENV=production node build/build.js",
"build:sit": "NODE_ENV=sit node build/build.js",
```

之后再代码里自行判断，想干啥就干啥

```js
var env = process.env.NODE_ENV === 'production' ? config.build.prodEnv : config.build.sitEnv
```

新版的 `vue-cli` 也内置了`webpack-bundle-analyzer`一个模块分析的东西，相当的好用。使用方法也很简单，和之前一样封装一个`npm script` 就可以。



```js
/package.json
 "build:sit-preview": "cross-env NODE_ENV=production env_config=sit npm_config_preview=true  npm_config_report=true node build/build.js"

//之后通过process.env.npm_config_report来判断是否来启用webpack-bundle-analyzer

var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
webpackConfig.plugins.push(new BundleAnalyzerPlugin())
```

`webpack-bundle-analyzer`这个插件还是很有用的，对后期代码优化。

### 前后端交互

每个公司都有自己的一套开发流程，没有绝对的好和坏。这里我来讲讲我司的前后端交互流程。

#### 跨域问题

首先前后端交互不可避免的就会遇到跨域问题，我司现在全是用`cors`来解决的，如果你死后端嫌麻烦不肯配置的话，`dev`环境也可以通过`webpack-dev-serve`的`proxy`来解决，开发环境用`nginx`反代理一下就好了，具体配置这里就补展开了。

#### 前后端的交互问题

其实大家也知道，平时的开发中交流成本占据了我们很大部分时间，但前后端如果有一个好的协作方式的话能解决很多时间。我司开发流程都是前后端和产品一起开会讨论项目，之后后端根据需求，首先定义数据格式和api，然后mock api 生产好文档，我们前端才是对接接口的。这里推荐一个文档生成器swagger。

#### 前端自行mock

如果后端不肯帮你mock数据的话，前端自己来mock也是很简单的。你可以使用mock server或者 mockjs + rap也很方便的。不久前出的esay-mock也相当的不错，还能结合swagger。

#### `iconfont`

`element-ui`默认的icon不是很多，这里安利一波阿里的`iconfont`简直是神器。由于管理后台对兼容性要求不高，可以用`symbol`，晒一波我司后台的图标。

#### `router-view`

创建和编辑的页面使用的是同一个component，默认情况下当这两个页面切换时并不会触发vue的created或者mounted钩子，官方说你可以通过watch $route的变化来处理，但其实说真的还是蛮麻烦的。后来发现其实可以简单的在router-view上加一个唯一的key,来保证路由切换时都会重新渲染触发钩子了。

```js
<router-view :key="key"></router-view>

computed: {
    key() {
        return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
    }
 }
```

`优化`

有些人会觉得现在构建是不是有点慢，我司现在技术栈是容器服务，后台项目会把dist文件夹里的东西都会打包成一个docker镜像。

```
npm install
npm run build:prod
```

还是属于能够接受时间的范围。主站PC站基于`nodejs`、`vue`实现服务端渲染，所以不仅需要依赖`nodejs`，而且需要利用`pm2`进行`nodejs`生命周期的管理。为了加速线上镜像构建的速度，我们利用`taobao`源 `registry.npm.taobao.org`进行加速，并且将一些常见的`npm`依赖打入了基础镜像，避免每次都需要重新下载。这里注意下，注意不要使用`cnpm install` 或者 `update`它的包都是一个`link`,反正会有各种诡异的`bug`,这里建议这样使用

```
npm install --registry=https://registry.npm.taobao.org
```

如果你觉得慢还是有可优化的空间如使用`webpack dll `或者把那些第三方`vendor`单独打包`external`出去，或者我司现在用的是`http2`可以使用`AggressiveSplittingPlugin`

### 登录权限

做后台项目区别于做其他的项目，权限验证与安全性是非常重要的，可以说是一个后台项目一开始就必须考虑和搭建的基础核心功能。我们所要做到的是：不同的权限对一个不同的路由，同时侧边栏也需要根据不同的权限，异步生成。这里先简单的说一下，我实现路灯和权限验证的思路。

登录： 当用户填写完账号和密码后向服务端验证是否正确，验证通过之后，服务端会返回一个token，拿到token之后（我会将这个token存储到cookie中，保证刷新页面后能记住用户登录状态），前端会根据token再去拉取一个user_info的接口来获取用户的详细信息（如用户权限，用户名等信息）。

权限验证： 通过token获取用户对应的role,动态根据用户的role算出其对应有权限的路由，通过router.addRoutes动态挂载这些路由。

上述所有的数据和操作都是通过`vuex`全局管理控制的。（刷新页面后`vuex`的内容也会丢失，所以需要重复上述的那些操作）。

#### 登陆篇

首先我们不管什么权限，来实现最基础的登录功能

click事件触发登录操作:

```js
this.$store.dispatch('LoginByUsername', this.loginForm).then(() => {
  this.$router.push({ path: '/' }); //登录成功之后重定向到首页
}).catch(err => {
  this.$message.error(err); //登录失败提示错误
});
```

**action:**

```js
LoginByUsername({ commit }, userInfo) {
  const username = userInfo.username.trim()
  return new Promise((resolve, reject) => {
    loginByUsername(username, userInfo.password).then(response => {
      const data = response.data
      Cookies.set('Token', response.data.token) //登录成功后将token存储在cookie之中
      commit('SET_TOKEN', data.token)
      resolve()
    }).catch(error => {
      reject(error)
    });
  });
}
```

登录成功后，服务端会返回一个token（该token是一个唯一标示用户身份的key）,之后我们将token存储在本地cookie之中，下次打开页面或者刷新页面的时候能记住用户的登录状态，不用再去登录页面重新登录了。

`ps:` 为了保证安全性，我司现在后台所有token有效期都是`Session`就是当浏览器关闭了就丢失了。重新打开浏览器都需要重新登录验证，后端也会每周固定一个时间点重新刷新token，让后台用户全部重新登录页一次，确保用户不会在电脑遗失或者其他原因被人随意使用账号。

#### 获取用户信息

用户登录成功之后，我们会在全局钩子`router.beforeEach`中拦截路由，判断是否已获得token，在获得token之后我们就要去获取用户的基础信息了。

```js
//router.beforeEach
if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
  store.dispatch('GetInfo').then(res => { // 拉取user_info
    const roles = res.data.role;
    next();//resolve 钩子
  })
```

就如前面所说的，我只在本地存储一个用户的token，并没有存储别的用户信息（如，用户权限，用户名，用户头像等）。有些人会问为什么不把一些用户信息也存一下，主要处于如下的考虑：

假如我把用户权限和用户名也存在了本地，但我这时候用另一台电脑登录修改了自己的用户名，之后再用这台存有之前用户信息的电脑登录，它默认会去读本地cookie中的名字，并不会去拉取新的用户信息。

所以现在的策略是：页面会从cookie中刚查看是否存有token，没有就走一遍上一部分的流程重新登录，如果有token，就会把这个token返回给后端去拉取user_info，保证用户信息是最新的。

当然如果是做了单点登录的功能，用户信息存在本地也是可以的，当你一台电脑登录时，另一台会被踢下线，所以总会重新登录获取最新的内容。

而且从代码层面我还建议吧login和get_user_info两件事分开比较好，在这个后端全面微服务的年代，后端同学也想写优雅的代码。

#### 权限篇

先说一说我权限控制的主题思路，前端会有一份路由表，它表示了每一个路由可访问的权限。当用户登录之后，通过token获取用户的role，动态根据用户的role算出其对应有权限的路由，再通过`router.addRoutes`动态挂载路由。但这些控制都只是页面级的，说白了前端再怎么做权限控制都不是绝对安全的，后端的权限验证是逃不掉的。

我司现在就是前端控制页面级的权限，不同权限的用户显示不同的侧边栏和限制其所能进入的页面（也做了少许按钮级别的权限控制），后端则会验证每个涉及请求的操作，验证其是否有该操作的权限，每一个后台的请求不管是get还是post都会让前端在请求header里面携带用户的token,后端会根据该token来验证用户是否有权限执行该操作。若没有权限则抛出一个对应的状态码，前端检测到该状态码，做出相对应的操作。

#### 权限 前端or后端 来控制？

有很多人表示他们公司的路由表是于后端根据用户的权限动态生成的，我司不采取这种方式的原因如下：

项目不断的迭代你会异常痛苦，前端新开发一个页面还要后端配一下路由和权限，让我们想了场景前后端不分离，被后端支配的那段恐怖事件了。

其次，就拿我司的业务来说，虽然后端的确也是有权限验证的，但他的验证其实是针对业务来划分的，比如超级编辑可以发布文章，而实习编辑只能编辑文章不能发布，但对于前端来说不管是超级编辑还是实习编辑都是有权限进入文章编辑页面的。所以前端和后端权限的划分是不太一致。

还有一点就是`vue2.2.0`之前异步挂载路由是很麻烦的一件事！不过好在官方也出了新的`api`,虽然本意是来解决`ssr`的痛点的。。

#### addRoutes

在之前通过后端动态返回前端路由一直很难做的，因为`vue-router`必须是要`vue`在实例化之前就挂载上去的，不太方便动态改变。不过好在`vue2.2.0`以后新增了`router.addRoutes`

有了这个我们可相对方便的做权限控制了。（楼主之前在权限控制也走了不少歪路，可以在项目的commit记录中看到，重构了很多此，最早没用`addRoute`整个权限控制都是各种if/else的逻辑判断，代码相当的耦合和复杂）

#### 具体实现

1. 创建`vue`实例的时候将`vue-router`挂载，但这个时候`vue-router`挂载一些登录或者不用权限的公用的页面。
2. 当用户登录后，获取用`role`和路由表每个页面的需要的权限做比较，生成最终用户可访问的路由表。
3. 调用`router.addRoutes(store.getters.addRoutes)`添加用户可访问的路由。
4. 使用`vuex`管理路由表，根据`vuex`中可访问的路由渲染侧边栏组件。

#### `router.js`

首先我们实现`router.js`路由表，这里就拿前端控制路由来距离（后端存储的也差不多，稍微改造一下就好了）。

```js
// router.js
import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/login'
const dashboard = resolve => require(['../views/dashboard/index']),resolve)

// 所有权限通用路由表
// 如首页和登录页和一些不用权限的公用页面

exprot const constrantRouterMap = [
    {path: '/login', component: Login},
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: '首页'，
        children: [{path: 'dashboard', component: dashboard }]
    },
]

// 实例化vue的时候只挂载constantRouter
exprot default new Router({
	routes: constrantRouterMap
})

// 异步挂载的路由
// 动态需要根据权限加载的路由表

export const asyncRouteMap = [
    {
        path: 'permission',
        component: Layout,
        name: '权限测试'，
        meta: {role: ['admin', 'super_edirot' ] }, //页面需要的权限
            children： [
                {
                    path: 'index',
                    component: Permission,
                    name: '权限测试页'，
                    meta: {role: ['admin', 'super_edirot' ] } // 页面需要的权限
                }
            ]
    }，
    {path: '*', redirect: '/404', hidden: true}
]

```

这里我们根据`vue-router`官方推荐的方法通过meta标签来标示该页面能访问的权限有哪些。如meta: {role: ['`admin`', '`super_editor`']}标示该页面只有`admin`和超级编辑才有资格进入。

注意事项： 这里有一个需要非常注意的地方就是404页面一定要最后加载，如果放在`constantRouterMap`一同声明了404，后面的所有页面都会被拦截到404。

`main.js`

关键的`main.js` 或者被单独抽象出来`permission.js`

```js
// main.js
router.beforeEach((to, from, next) => {
    if (store.getters.token) { //判断是否有token
        if (to.path === '/login') {
            next({ path: '/' })
        } else {
            if (store.getters.roles.length === 0) { //判断当前用户是否已拉取万user_info信息
                store.dispath('GetInfo').then( res => { //拉取info
                    const roles = res.data.role;
                    store.dispath('GenerateRoutes'), {roles}).then(() => { //生产可访问的路由表					router.addRoutes(store.gettters.addRoutes) //动态添加可访问路由表
                    	next({...to, replace: true}) // hack方法 确保addRoutes已完成
                    })
                }).catch(err => {
                    console.log(err)
                })
            } else {
                next() //当有用户权限的时候，说明所有可访问路由已生成 如访问没权限的全面会自动进入404页面
            }
        }
    } else {
        if(whiteList.indexOf(to.path) !== -1) { //在免登陆白名单，直接进入
            next()
        } else {
            next('/login') //否则全部重定向到登录页
        }
    }
})
```

有了`addRoutes`之后就非常的方便，值挂载了用户有权限进入的页面，没有权限，路由自动跳转404，省去了不少的判断。

这里还有一个小hack的地方，就是`router.addRoutes`之后的next()会失效，因为可能next()的时候路由并没有完全add完成。

这样我们可以通过next(to)巧妙的避开之前的那个问题了，这行代码重新进入`router.beforeEach`这个钩子，这时候再通过next()来释放钩子，就能确保所有的路由都已经挂载完成了。

`store/permission.js`

就来讲一讲 `GenerateRoutes Action`

```js
// store/permission.js
import { asyncRouteMap, constantRouterMap } from 'src/router'

function hasPermission(roles, route) {
    if (route.meta && route.meta.role) {
        return roles.some(role => route.meta.role.indexOf(role) >= 0)
    } else {
        return true
    }
}

const permission = {
    state: {
        routers : constantRouterMap,
        addRouters: []
    },
    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers
            state.routers = constantRouterMap.concat(routers)
        }
    },
    actions: {
        GenerateRoutes({ commit }, data) {
            return new Promise(resolve => {
                const { roles } = data
                const accessedRouters = asyncRouteMap.filter(v => {
                    if （roles.indexOf('admin') >= 0） return true
                    if (hasPermission(roles, v)) {
                        if (v.children && v.children.length > 0) {
                            v.children = v.children.filter(child => {
                                if (hasPermission(roles, child)) {
                                    return child
                                }
                                return false
                            })
                            return v
                        } else {
                            return v
                        }
                    }
                    return false
                })
                commit('SET_ROUTERS', accessedRouters)
                resolve()
            })
        }
    }
}

export default permission
```

这里的代码说白了就是干了一件事，通过用户的权限和之前在`router.js`里面`asyncRouteMap`的每一个页面所需要的的权限做匹配,最后返回一个该用户能够访问路由有哪些。



#### 侧边栏

最后一个设计到权限的地方就是侧边栏，不过在前面的基础上已经很方便就能实现动态显示侧边栏了。这里侧边栏基于`element-ui`的`NavMenu`来实现的。

说白了就是遍历之前算出来的`permssion_routers`,通过`vuex`拿到之后动态`v-for`渲染而已。

本项目为了支持无限嵌套路由，所以侧边栏这块使用了递归组件。如需要请大家自行改造，来打造满足自己业务需求的侧边栏。

侧边栏高亮问题：其实很简单，`element-ui`官方已经给了`default-active`所以我们只要

```js
:default-active="$route.path"
将default-active一直指向当前路由就可以了，就是这么简单。
```

#### 按钮级别权限控制

有很多人一直问关于按钮级别粒度的权限控制怎么做。我司现在是这样的，真正需要按钮级别控制的地方不是很多，现在是通过获取到用户的role之后，在前端用v-if手动判断来区分不同权限对应的按钮的，理由前面也说了，我司颗粒度的权限判断是交给后端来做的，每个操作后端会进行权限判断。而且我觉得其实前端真正需要按钮级别的判断的地方不是很多，如果一个页面有多重不同权限的按钮，我们觉得更多的应该考虑产品层面是否设计合理。当然你强行说我想做按钮级别的权限控制，你也可以参考路由层面的做法。搞一个操作权限表。单个人觉得多此一举，或者将它封装成一个指令都是可以的。

#### axios拦截器

这里再说一说`axios`吧，虽然在上一篇简单介绍过，不过这里还是要唠叨一下，我司服务端对每一个请求都会验证权限，所以这里我们针对业务封装了一下请求，首先我们通过`request`拦截器，在每个请求头里面塞入`token`,好让后端对请求进行权限验证。并创建一个response拦截器，当服务端返回特殊的状态码，我们统一做处理，如没权限或者token失效等操作。

#### 两步验证

文章一开始也说了，后台的安全性是很重要的，简简单单的一个账号+密码的方式是很难保证安全性的，所以我司的后台项目都是用了两步验证的方式，之前我们也尝试过使用基于Google-authenticator或者youbikey这样的方式但难度和操作成本都很大。后来还是准备借助腾讯爸爸，这年代谁不用微信。

等下。。

### 实战篇

#### 基于Element的动态换肤

1. 先把默认主题文件中设计到颜色的CSS值替换成关键词
2. 根据用户选择的主题色生产一系列对应的颜色值
3. 把关键词再换回刚刚生成的响应的颜色值
4. 直接在页面上加style标签，把生成的样式填进去

#### 侧边栏

这里又谈一下导航栏的问题，本项目的侧边栏是根据`router.js`配置的路由并且根据权限动态生成的，这样就省去了写一遍路由还要手动再写一次侧边栏这种麻烦事，但也遇到一个问题，路由可能会多层嵌套，很多人反馈自己的侧边栏会有三级，甚至五级的。所以重构了一下啊车边蓝，使用递归组件。

**侧边栏高亮问题:** 很多人在群里问为什么自己的侧边栏不能跟着自己的路由高亮，其实很简单，`element-ui`官方已经给了default-active所以我们只要

```js
:default-active="$route.path"
```

将`default-active`一直指向当前路由就可以了，就是这么简单。

#### 点击侧边栏 刷新当前路由

再用spa(单页面开发)这种开发模式之前，大部分都是多页面后台，用户每次点击侧边栏都会重新请求这个页面，用户渐渐养成了点击侧边栏当前路由来刷新页面的习惯。但现在SPA就不一样了，用户点击当前高亮的路由并不会刷新view,因为`vue-router`会拦截你的路由,它判断你的`url`并没有任何变化，所以他不会、触发任何钩子或者是view的变化。

尤大本来也说要增加一个方法来强刷view,但后台他又改变了心意。但需要就摆在这里，我们该怎么办呢?他说了不改变`current URL` 就不会触发任何东西，那我可不可以强行触发东西？

上有政策，下有对策我们变着花来hack。方法也很简单，通过不断改变`url`的`query`来触发view的变化。我们监听侧边栏每个link的click事件，每次点击都给router push一个不一样的query来确保重新刷新view.

```js
clickLink(path) {
  this.$router.push({
    path,
    query: {
      t: +new Date() //保证每次点击路由的query项都是不一样的，确保会重新刷新view
    }
  })
}
```

但这也有一个弊端就是url后面有一个很难看的query后缀

#### Table 拖拽排序

```js
import Sortable from 'sortablejs'
let el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
let sortable = Sortable.create(el)
```

在table mounted 之后申明 Sortable.create(el)，table的每行tr就可以随意拖拽了，麻烦的目前我们的排序都是基于`dom`的，我们的数据层list并没有随之改变，所以我们就要手动的来管理我们的列表。

```js
this.sortable = Sortable.create(el, {
  onEnd: evt => { //监听end事件 手动维护列表
    const tempIndex = this.newList.splice(evt.oldIndex, 1)[0];
    this.newList.splice(evt.newIndex, 0, tempIndex);
  }
});
```

这样我们就简单的完成了table拖拽排序。这里如果不是基于`dom`的排序推荐使用`vue.draggable`。

#### Table内联编辑

table内联编辑也是一个常见的需求

其实很简单，当我们拿到list数据之后先洗一下数据，每一条数据插入一个edit[true or false]判断福，来表示当前行是否处于编辑状态。之后就通过v-show动态切换不同的相应view就可以了。

```js
<el-table-column min-width="300px" label="标题">
  <template scope="scope">
    <el-input v-show="scope.row.edit" size="small" v-model="scope.row.title"></el-input>
    <span v-show="!scope.row.edit">{{ scope.row.title }}</span>
  </template>
</el-table-column>
<el-table-column align="center" label="编辑" width="120">
  <template scope="scope">
    <el-button v-show='!scope.row.edit' type="primary" @click='scope.row.edit=true' size="small" icon="edit">编辑</el-button>
    <el-button v-show='scope.row.edit' type="success" @click='scope.row.edit=false' size="small" icon="check">完成</el-button>
  </template>
</el-table-column>
```

#### Table常见坑

通过`dialog`来编辑，新建，删除`table`的元素这种业务场景相对于前面说的两种更加的常见。而且也有不少的小坑。 首先我们要明确一个点 `vue `是一个`MVVM`框架，我们传统写代码是命令式编程，拿到`table`这个`dom`之后就是命令式对`dom`增删改。而我们现在用声明式编程，只用关注`data`的变化就好了，所以我们这里的增删改都是基于`list`这个数组来的。

> 由于JavaScript的限制，`Vue`不能检测一下变动的数组： 当利用索引直接设置一个项时
>
> `this.list[0] = newValue` 这样是不会生效的

```
//添加数据
this.list.unshift(this.temp);

//删除数据 
const index = this.list.indexOf(row); //找到要删除数据在list中的位置
this.list.splice(index, 1); //通过splice 删除数据

//修改数据
const index = this.list.indexOf(row); //找到修改的数据在list中的位置
this.list.splice(index, 1,this.updatedData); //通过splice 替换数据 触发视图更新
```

这样我们就完成了对table的增删改操作，列表view也自动响应发生了变化。这里在修改数据的时候还有一个小坑**需要主要**。 当我们拿到需要修改行的数据时候不能直接将它直接赋值给dialog，不然会发生下面的问题。

赋值的数据是一个`object`引用类型共享一个内存区域的。所以我们就不能直接连等复制，需要重新指向一个新的引用，方案如下：

```js
//赋值对象是一个obj
this.objData=Object.assign({}, row) //这样就不会共用同一个对象

//数组我们也有一个巧妙的防范
newArray = oldArray.slice(); //slice会clone返回一个新数组
```

#### Tabs

tab在后台项目中也是比较常用的，假设我们有四个tab选项，每个tab都会向后端请求数据，但我们希望一开始就会请求当前书tab数据，而且tab来回切换的时候不会重复请求，只会实例化一次。首先我们想到的就是用v-if这样的确能做到一开始不会挂载tab,但有一个问题，每次点击这个tab组件都会重新挂载一次，这是我们不想看到了，这时候我们就可以用<keeop-alive>了。

> keep-alive 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。 它是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在父组件链中。

所以我们就可以这样写tabs了

```js
<el-tabs v-model="activeTab">
  <el-tab-pane label="简介及公告" name="announcement">
    <announcement />
  </el-tab-pane>
  <el-tab-pane label="资讯" name="information">
    <keep-alive>
      <information v-if="activeTab=='information'" />
    </keep-alive>
  </el-tab-pane>
  <el-tab-pane label="直播流配置" name="stream">
    <keep-alive>
      <stream v-if="activeTab=='stream'" />
    </keep-alive>
  </el-tab-pane>
</el-tabs>
```

#### Select选择器

Select 选择器直接使用没有什么太多问题，但很多时候我们需要通过Select来回显一些数据，当我们`<el-select v-model="objValue">` select 绑定一个`obj value`回显就会很蛋疼了，它要求必须保持同一个引用[issue](https://github.com/ElemeFE/element/issues/1780)。这就意味着，我们回显数据的时候想先要找到该数据在arr中的位置，再回塞：[demo](https://github.com/ElemeFE/element/issues/2479/)。这还不是在远程搜索的情况下，如果是远程搜索的情况还要当疼。 这里推荐一下[vue-multiselect](https://github.com/monterail/vue-multiselect) 它能完美的解决前面`Element select`的问题。目前也是`vue component `中比较好用的一个，`ui`也非常的好看，建议大家可以尝试性用一下，真的非常的不错。

#### upload上传

`upload`本身没什么好说的，文档写的蛮清楚了。这里主要说一下怎么将`upload`组件和七牛直传结合在一起。

这里我们选择`api`直传的方式，就是我们首先要通过后端生成七牛上传必要的token和key。所以我们只要想办法将token和key塞进post请求里面就可以了。

before-upload这个钩子还支持promise之间合我们的心意，但我们写着写着怎么样才能动态改变之前的dataObj呢？通过看源码发现我们可以_self._data这样子拿到我们想要的数据。

```js
<template>
  <el-upload
      action="https://upload.qbox.me"
      :data="dataObj"
      drag
      :multiple="true"
      :before-upload="beforeUpload">
    <i class="el-icon-upload"></i>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
  </el-upload>
</template>
<script>
    import { getToken } from 'api/qiniu'; // 获取七牛token 后端通过Access Key,Secret Key,bucket等生成token
    // 七牛官方sdk https://developer.qiniu.com/sdk#official-sdk
    export default{
      data() {
        return {
          dataObj: { token: '', key: '' },
          image_uri: [],
          fileList: []
        }
      },
      methods: {
        beforeUpload() {
          const _self = this;
          return new Promise((resolve, reject) => {
            getToken().then(response => {
              const key = response.data.qiniu_key;
              const token = response.data.qiniu_token;
              _self._data.dataObj.token = token;
              _self._data.dataObj.key = key;
              resolve(true);
            }).catch(err => {
              console.log(err)
              reject(false)
            });
          });
        }
      }
    }
</script>
```

#### **修改element样式问题**

 用ui组件总免不了需要对它做一些个性化定制的需求，所以我们就要覆盖element的一些样式。 首先我们要了解一下vue scoped是什么，很多人非常喜欢用scoped，妈妈再也不用担心样式冲突问题了，其实scoped也没有很神秘的，它就是基于PostCss的，加了一个作用局的概念。

它和我们传统的命名空间的方法避免css冲突没有什么本质性的区别。 现在我们来说说怎么覆盖element-ui样式。由于element-ui的样式我们是在全局引入的，所以你想在某个view里面覆盖它的样式就不能加scoped，但你又想只覆盖这个页面的element样式，你就可在它的父级加一个class，以用命名空间来解决问题。

建议向楼主一样专门建一个scss文件里专门自定义element-ui的各种样式。

给一个诀窍其实大部分诡异的问题都可以通过加一个key或者 Vue.nextTick来解决。。

#### 富文本

管理后台富文本也是一个非常重要的功能，楼主在这里也踩了不少坑，楼主在项目最终选择了tinymce

#### Tinymce

这里简述一下自己项目中使用`Tinymce`的方法

目前采用全局引用的方式。代码地址：`static/tinymce` static目录下的文件不会被打包, 在 `index.html` 中引入。

**使用** 由于富文本不适合双向数据流，所以只会 watch 传入富文本的内容一次变化，只会就不会再监听了，如果之后还有改变富文本内容的需求。 可以通过 `this.refs.xxx.setContent()` 来设置

源码也很简单，有任何别的需求都可以在 `@/components/Tinymce/index.vue` 中自行修改。

#### 导出excel

这里先明确一点，如果你的业务需求对导出文件的格式没什么要求，不建议导出`xlsx`格式的，直接导出成`csv`的就好了，真的会简单很多。创建一个a标签，写上`data:text/csv;charset=utf-8`头，再把数据塞进去，`encodeURI(csvContent)`一下就好了，详情就不展开了.

们重点说一下转xlsx，我们这里用到了[js-xlsx](https://github.com/SheetJS/js-xlsx)，一个功能很强大excel处理库，只是下载各种格式excel，还支持读取excel，但上手难度也非常大，相当的复杂，其中涉及不少二进制相关的东西。不过好在官方给了我们一个[demo例子](http://sheetjs.com/demos/writexlsx.html),我们写不来还抄不来么，于是我们就借鉴官方的例子来改造了一下，具体原理就不详细说了，真的很复杂。。。 重点是我们怎么使用！首先我们封装一个[Export2Excel.js](https://github.com/PanJiaChen/vue-element-admin/blob/master/src/vendor/Export2Excel.js)， 它又依赖三个库

```js
require('script-loader!file-saver'); //保存文件用
require('script-loader!vendor/Blob'); //转二进制用
require('script-loader!xlsx/dist/xlsx.core.min'); //xlsx核心

由于这几个文件不支持import引入，所以我们需要`script-loader`来将他们挂载到全局环境下。
```

它暴露了两个接口`export_table_to_excel`和`export_json_to_excel`,我们常用`export_json_to_excel`因为更加的可控一点，我们可以自由的洗数据。

```js
handleDownload() {
  require.ensure([], () => { // 用 webpack Code Splitting xlsl还是很大的
    const { export_json_to_excel } = require('vendor/Export2Excel');
    const tHeader = ['序号', '文章标题', '作者', '阅读数', '发布时间']; // excel 表格头
    const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time'];
    const list = this.list;
    const data = this.formatJson(filterVal, list); // 自行洗数据 按序排序的一个array数组
    export_json_to_excel(tHeader, data, '列表excel');
  })
}，
formatJson(filterVal, jsonData) {
  return jsonData.map(v => filterVal.map(j => v[j]))
}
```

#### ECharts

我还是那个观点，大部分插件建议大家还是自己用`vue`来包装就好了，真的很简单。`ECharts`支持`webpack`引入，图省事可以将`ECharts`整个引入`var echarts = require('echarts');`不过`ECharts`还是不小的，我们大部分情况只是用到很少一部分功能，我平时习惯于按需引入的。

```js
// 引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
// 引入柱状图
require('echarts/lib/chart/bar');
// 引入提示框和标题组件
require('echarts/lib/component/tooltip');
require('echarts/lib/component/title');
```

因为`ECharts`初始化必须绑定`dom`，所以我们只能在`vue`的`mounted`生命周期里初始化。

这时候你想说我的`data`是远程获取的，或者说我动态改变`ECharts`的配置该怎么办呢？我们可以通过`watch`来触发`setOptions`方法

```js
//第一种 watch options变化 利用vue的深度 watcher，options一有变化就重新setOption
watch: {
  options: {
    handler(options) {
      this.chart.setOption(this.options)
    },
    deep: true
  },
}
//第二种 只watch 数据的变化 只有数据变化时触发ECharts
watch: {
  seriesData(val) {
    this.setOptions({series:val})
  }
}
```

#### 相同component 不同参数

创建与编辑 其实后台创建与编辑的功能时最常见的，它区别去前端项目多了改的需求，但大部分创建页面与编辑页面字段和`UI`几乎是一样的，所以我们准备公用一个component来对应不同的页面。有两种常见的方法，来区别创建与编辑。

1. 通过路由path的方式，这种方式最简单暴力，我自己的项目中使用这种方式，通过约定路径中出现`edit`就判断为编辑模式，比较省力和方便，不过这是要在大家写路径的时候都按照规范的来写的前提下。
2. 通过meta来去不饿，比较推荐这种方式来区分。

```js
computed: {
  isEdit() {
    return this.$route.meta.isEdit // 根据meta判断
    // return this.$route.path.indexOf('edit') !== -1 // 根据路由判断
  }
}，
created() {
  if (this.isEdit) { 
    this.fetchData();
  }
},
```

就这样简单的实现了多路由复用了一个component，其实不只是创建和编辑可以这样用，如两个列表的一模一样，只是一个是内部文章另一个是调取外部文章都能复用组件，通过meta的方式来判断调取不同的接口。