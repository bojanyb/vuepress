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

### 9 `jsx`自定义`elementUI`表头

```
https://www.jianshu.com/p/101a0cba8465
```



### 10 `vue`+`elementUI`的表格第一行合计自定义显示

```
https://blog.csdn.net/qq_34953053/article/details/91388535?utm_medium=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control&dist_request_id=cb20a85e-d183-456f-9e14-752457495dd4&depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromMachineLearnPai2-1.control
```

### 11 **别用**`for in`遍历数组就能正常遍历，否则值为empty

### 12 `formdata`

- `formdata`类型其实是在`XMLHttpRequest`2级定义的，它是序列化表以及创建与表单格式相同的数据（当然是用于`XHR`传输）提供便利。
- `formdata`是`ajax2.0`对象用以将数据编译成键值对，以便于`XMLHttpRequest Level 2` 提供一个接口对象，可以使用该对象来模拟和处理表单并方便的进行文件上传。
- `formdata`对象的使用：1.用键值对来模拟一系列表单控件：即把form中所有表单元素的name与value组成一个`queryString` 2.异步上传二进制文件  

```js
 // 1. 创建空对象实例
 let formData = new FormData(); // 此时可以调用append()方法来添加数据
 // 2.使用已有的表单来初始化一个对象实例
 // 假如现在页面已经有一个表单
<form id="myForm" action="" method="post">
    <input type="text" name="name">名字
    <input type="password" name="psw">密码
    <input type="submit" value="提交">
</form>
// 我们可以使用这个表单元素作为初始化参数，来实例化一个formData对象

// 获取页面已有的一个form表单
var form = document.getElementById("myForm");
// 用表单来初始化
var formData = new FormData(form);
// 我们可以根据name来访问表单中的字段
var name = formData.get("name"); // 获取名字
var psw = formData.get("psw"); // 获取密码
// 当然也可以在此基础上，添加其他数据
formData.append("token","kshdfiwi3rh");

// 发送数据
// 我们可以通过xhr来发送数据
let xhr = new XMLHttpRequest();
xhr.open("post","login");
xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
xhr.send(formData);

// 这种方式可以来实现文件的异步上传。

```



### 13 深浅拷贝

```js
        function flatten(array) {
            return [].concat(...array.map(item => {
                return item
            }))
        }

	   // 对象赋值深拷贝
       this.postForm = Object.assign({}, defaultForm)
	   为什么要用Object.assign？

	 //上传表单之前要用深拷贝 不要影响到原来的表单
	const book = Object.assign({}, this.postForm)
```



### 14 启用ESlint

### 15 --no-ff

### 16短路运算 && ||

> a && b :   如果a表达式，不是布尔类型，先隐式转换为布尔值，如果为true，无论b为true或者false,都返回b的值；如果为false,则返回a的值
>
> a || b ：  通过隐式转换得到a的boolean 值，如果为true，则无论b的值为false或者true,都返回a的值；如果a的boolean值为false,则返回b的值

### 17 上传组件怎么带参数

### 18 中后台少用el-row ，主要自己写样式

### 19 -S -D 

### 20 调试

### 21 表单验证抽象方法

多种校验写多个`validateRequire`

```js
 const validateRequire = (rule, value, callback) => {
      if(value.length === 0) {
        callback(new Error(fields[rule.field] + '必须填写'))
      } else {
        callback()
      }
    }
    
   rules: {
        title: [{ validator: validateRequire }],
        author: [{ validator: validateRequire }],
        publisher: [{ validator: validateRequire }],
        language: [{ validator: validateRequire }]
      }

    submitForm() {
      if (!loading) {
        this.loading = true
        this.$refs.postForm.validate((valid, fields) => {
          if (valid) {
          const message = fields[Object.keys[fields][0][0]].message
          this.$message({message, type: 'error'})
          } else {

          }
        })
     }
    },
```



### 22  `async await`

```js
function insertBook() {
    return new Promise( async (resolve, reject) => {
        try {
            if (book instanceof Book) {
                const result = await exists(book)
                if (result) {
                    await removeBook(book)
                    reject(new Error('资源已存在'))
                } else {
                    await db.insert(book, 'book')
                    await insertConents(book)
                    resolve()
                }
            }
        } catch {
            reject(new Error('添加的目标对象不合法'))
        }
    })
}

```

### 24 对象方法 

```js
model.hasOwnProperty(key) //是否是对象自身的key而非原型链上的key
Object.keys（model） // 返回给定对象所有的key,返回一个数组
book instanceof Book //
```

### 25 富文本编辑器 -- 深入学习`vue-admin`

### 26 replace 置空操作

```js
`${dir}/${src}`.replace(this.unzipPath, '')
onkeyup="value=value.replace(/[^\d]/g,'')"
```

### 27 `vue+element-ui`中的`el-table-column`配合v-if导致列样式与位置错乱的现象

```js
//根据需求，对el-table的某一列进行判断显隐时，经常会出现列的位置错乱和表头的样式变化的问题；
//注：此问题不属于技术问题，可以再多看看框架文档；
//ex:（会错乱的写法）
<el-table-column v-if="type === '0' ">姓名</el-table-column>
<el-table-column v-if="type === '1' ">年龄</el-table-column>

//修改：
<el-table-column v-if="type === '0' " key='1' >姓名</el-table-column>
<el-table-column v-if="type === '1' " key='2' >年龄</el-table-column>
//或
<el-table-column v-if="type === '0' " : key="Math.random()">姓名</el-table-column>
<el-table-column v-if="type === '1' " : key="Math.random()">年龄</el-table-column>

//说明：
//给使用了v-if的列，加一个固定的key值，或循环渲染key即可；
//虽然仍会有一瞬间的表头的样式的改变和列的错乱，但是已经不影响数据的展示了；
```

### 28   `@keyup.enter.native="handlerfileter"`

```JS
@keyup.enter.native="handlerfileter" //native
```

### 29 关键词高亮

```js
      wrapperKeywork(k, v) {
        function highlight(value) {
          return `<span style="color: #1890ff">${ value }</span>`
        }
       if (!this.listQuery[k]) {
         return v
       } else {
         return v.replace(new RegExp(this.listQuery[k], 'ig' ), v => highlight(v) )
       }
      },
      getList() {
          this.listLoading = true
          listBook(this.listQuery).then(response => {
             const { list } = response.data.list
             this.list = list
             this.listLoading = false
             this.list.forEach(book => {
               book.titleWrapper = this.wrapperKeywork('title', book.title)
               book.authorWrapper = this.wrapperKeywork('author', book.author)
             })
          })
      },
```

### 30 `autocomplete="off"`

### 31 权限

后端根据用户的权限动态生成的，不采用这种方式的原因如下：

项目不断的迭代你会异常痛苦，前端新开发一个页面还要后端配一下路由和权限，让我们想了曾经前后端不分离，被后端支配的那段恐怖时间了。

其次，就那我司的业务来说，虽然后端的确也是有权限验证的，但他的验证其实是针对业务来划分的。比如超级编辑可以发布文章，而实习编辑只能编辑文章不能发布，但对于前段来说，不管是超级编辑还是实习编辑都是有权限进入文章编辑页面的，所以前端和后端的划分是不太一致的。



1. 前端输入账号密码，通过this.$store.dispatch('user/login',  `this.loginForm`)获取token。
2. 然后把token通过commit提交到mutation，然后赋值给state。然后通过cookie存储token。
3. 跳转到首页，在`permission.js`路由守卫中做拦截。
4. 通过 `store.dispatch('user/getInfo')`拿到roles的角色数组。
5. 然后通过`store.dispatch('permission/generateRoutes', roles)`
6. 发送请求拿到左侧菜单数据，并把数据添加到路由中。
7. 通过`generaMenu`把后台查询的菜单数据生成可用的路由格式。
8. 将生成的数据格式返回， 通过`router.addRoutes(accessRoutes)`添加到路由中。

`src/store/modules/permission.js`

```js
import { asyncRoutes, constantRoutes } from '@/router'
import { getAuthMenu } from '@/api/user'
import Layout from '@/layout'
 
/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
}
 
/**
 * 后台查询的菜单数据拼装成路由格式的数据
 * @param routes
 */
export function generaMenu(routes, data) {
  data.forEach(item => {
    // alert(JSON.stringify(item))
    const menu = {
      path: item.url === '#' ? item.menu_id + '_key' : item.url,
      component: item.url === '#' ? Layout : () => import(`@/views${item.url}/index`),
      // hidden: true,
      children: [],
      name: 'menu_' + item.menu_id,
      meta: { title: item.menu_name, id: item.menu_id, roles: ['admin'] }
    }
    if (item.children) {
      generaMenu(menu.children, item.children)
    }
    routes.push(menu)
  })
}
 
/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles)
      }
      res.push(tmp)
    }
  })
  return res
}
 
const state = {
  routes: [],
  addRoutes: []
}
 
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}
 
const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      const loadMenuData = []
      // 先查询后台并返回左侧菜单数据并把数据添加到路由
      getAuthMenu(state.token).then(response => {
        let data = response
        if (response.code !== 0) {
          this.$message({
            message: '菜单数据加载异常',
            type: 0
          })
        } else {
          data = response.data.menuList
          Object.assign(loadMenuData, data)
          generaMenu(asyncRoutes, loadMenuData)
          let accessedRoutes
          if (roles.includes('admin')) {
            // alert(JSON.stringify(asyncRoutes))
            accessedRoutes = asyncRoutes || []
          } else {
            accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
          }
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        }
        // generaMenu(asyncRoutes, data)
      }).catch(error => {
        console.log(error)
      })
    })
  }
}
 
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
```

src/api/user.js

```js
import request from '@/utils/request'
 
export function login(data) {
  return request({
    url: '/user/userLogin', // http://192.168.200.185:8090/user/login
    method: 'post',
    data
  })
}
 
export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}
 
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}
 
export function getAuthMenu(token) {
  return request({
    url: '/dashboard',
    method: 'get',
    params: { token }
  })
}
```

侧边栏组件

```js
<sidebar-item v-for="route in permission_routes" :key="route.path" :item="route" :base-path="route.path" />
    
...mapGetters([
  'permission_routes',
]),
```

权限管理页

```js
 getrolealllim //获取角色信息结构

getalllim(id) {
      let params = { id: id };
      getrolealllim(params).then((res) => {
        this.defaultRoleData = [];
        this.data2 = res.data.data;
        this.getDefaultRoleData(this.defaultRoleData, this.data2);
      });
    },
        
```

角色树形表数据格式

```js
[
  {
    "checked": true,
    "children": [
      {
        "checked": true,
        "children": [
          {
            "checked": true,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "107",
            "leaf": null,
            "name": "查看",
            "open": true
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "3",
        "leaf": null,
        "name": "首页",
        "open": true
      }
    ],
    "expanded": false,
    "iconCls": "",
    "id": "2",
    "leaf": null,
    "name": "服务总览",
    "open": true
  },
  {
    "checked": true,
    "children": [
      {
        "checked": true,
        "children": [
          {
            "checked": true,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "35",
            "leaf": null,
            "name": "查看",
            "open": true
          },
          {
            "checked": true,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "36",
            "leaf": null,
            "name": "新增",
            "open": true
          },
          {
            "checked": true,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "37",
            "leaf": null,
            "name": "修改",
            "open": true
          },
          {
            "checked": true,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "38",
            "leaf": null,
            "name": "删除",
            "open": true
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "11",
        "leaf": null,
        "name": "聚合渠道商管理",
        "open": true
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "100",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "12",
        "leaf": null,
        "name": "联运渠道商管理",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "39",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "40",
            "leaf": null,
            "name": "新增",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "41",
            "leaf": null,
            "name": "修改",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "42",
            "leaf": null,
            "name": "删除",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "13",
        "leaf": null,
        "name": "厂商管理",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "88",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "14",
        "leaf": null,
        "name": "支付配置",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "90",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "15",
        "leaf": null,
        "name": "切支付策略",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "101",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "16",
        "leaf": null,
        "name": "客服信息管理",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "102",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "17",
        "leaf": null,
        "name": "联运样式管理",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "43",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "44",
            "leaf": null,
            "name": "新增",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "45",
            "leaf": null,
            "name": "修改",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "46",
            "leaf": null,
            "name": "删除",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "18",
        "leaf": null,
        "name": "数据字典",
        "open": false
      }
    ],
    "expanded": false,
    "iconCls": "",
    "id": "4",
    "leaf": null,
    "name": "基础配置",
    "open": true
  },
  {
    "checked": false,
    "children": [
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "47",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "48",
            "leaf": null,
            "name": "新增",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "49",
            "leaf": null,
            "name": "修改",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "50",
            "leaf": null,
            "name": "删除",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "19",
        "leaf": null,
        "name": "游戏管理",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "51",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "52",
            "leaf": null,
            "name": "新增",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "53",
            "leaf": null,
            "name": "修改",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "54",
            "leaf": null,
            "name": "删除",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "55",
            "leaf": null,
            "name": "OSS上传权限",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "20",
        "leaf": null,
        "name": "母包管理",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "56",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "57",
            "leaf": null,
            "name": "新增",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "58",
            "leaf": null,
            "name": "修改",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "21",
        "leaf": null,
        "name": "聚合渠道配置",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "103",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "22",
        "leaf": null,
        "name": "联运渠道配置",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "104",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "87",
        "leaf": null,
        "name": "区服信息管理",
        "open": false
      }
    ],
    "expanded": false,
    "iconCls": "",
    "id": "5",
    "leaf": null,
    "name": "游戏管理",
    "open": false
  },
  {
    "checked": false,
    "children": [
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "59",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "23",
        "leaf": null,
        "name": "用户查询",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "61",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "62",
            "leaf": null,
            "name": "导出",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "24",
        "leaf": null,
        "name": "角色管理",
        "open": false
      }
    ],
    "expanded": false,
    "iconCls": "",
    "id": "6",
    "leaf": null,
    "name": "用户管理",
    "open": false
  },
  {
    "checked": false,
    "children": [
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "106",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "25",
        "leaf": null,
        "name": "公告管理",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "119",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "118",
        "leaf": null,
        "name": "运营广告",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "121",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "120",
        "leaf": null,
        "name": "月卡开通领取引导配置",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "123",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "122",
        "leaf": null,
        "name": "游戏群管理",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "125",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "124",
        "leaf": null,
        "name": "群消息举报",
        "open": false
      }
    ],
    "expanded": false,
    "iconCls": "",
    "id": "96",
    "leaf": null,
    "name": "运营工具",
    "open": false
  },
  {
    "checked": true,
    "children": [
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "63",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "64",
            "leaf": null,
            "name": "补单",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "65",
            "leaf": null,
            "name": "删除",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "97",
            "leaf": null,
            "name": "导出",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "26",
        "leaf": null,
        "name": "订单管理",
        "open": false
      },
      {
        "checked": true,
        "children": [
          {
            "checked": true,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "117",
            "leaf": null,
            "name": "查看",
            "open": true
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "115",
        "leaf": null,
        "name": "订单查询",
        "open": true
      }
    ],
    "expanded": false,
    "iconCls": "",
    "id": "7",
    "leaf": null,
    "name": "订单管理",
    "open": true
  },
  {
    "checked": true,
    "children": [
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "105",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "27",
        "leaf": null,
        "name": "游戏概况",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "66",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "67",
            "leaf": null,
            "name": "导出",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "68",
            "leaf": null,
            "name": "构造数据",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "108",
            "leaf": null,
            "name": "区服每日查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "109",
            "leaf": null,
            "name": "区服汇总查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "28",
        "leaf": null,
        "name": "日基础数据",
        "open": false
      },
      {
        "checked": true,
        "children": [
          {
            "checked": true,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "116",
            "leaf": null,
            "name": "查看",
            "open": true
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "114",
        "leaf": null,
        "name": "游戏基础数据",
        "open": true
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "69",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "70",
            "leaf": null,
            "name": "导出",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "71",
            "leaf": null,
            "name": "构造数据",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "110",
            "leaf": null,
            "name": "留存每日查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "111",
            "leaf": null,
            "name": "留存汇总查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "29",
        "leaf": null,
        "name": "留存数据",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "72",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "73",
            "leaf": null,
            "name": "导出",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "74",
            "leaf": null,
            "name": "构造数据",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "112",
            "leaf": null,
            "name": "LTV每日查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "113",
            "leaf": null,
            "name": "LTV汇总查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "30",
        "leaf": null,
        "name": "LTV",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "75",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "31",
        "leaf": null,
        "name": "在线数据统计",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "98",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "99",
            "leaf": null,
            "name": "导出",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "32",
        "leaf": null,
        "name": "渠道周期报表",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "127",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "126",
        "leaf": null,
        "name": "联运渠道数据",
        "open": false
      }
    ],
    "expanded": false,
    "iconCls": "",
    "id": "8",
    "leaf": null,
    "name": "统计分析",
    "open": true
  },
  {
    "checked": false,
    "children": [
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "76",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "77",
            "leaf": null,
            "name": "新增",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "78",
            "leaf": null,
            "name": "修改",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "80",
            "leaf": null,
            "name": "设置角色",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "81",
            "leaf": null,
            "name": "重置密码",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "33",
        "leaf": null,
        "name": "账号管理",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "82",
            "leaf": null,
            "name": "查看",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "83",
            "leaf": null,
            "name": "新增",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "84",
            "leaf": null,
            "name": "修改",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "85",
            "leaf": null,
            "name": "删除",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "86",
            "leaf": null,
            "name": "设置权限",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "34",
        "leaf": null,
        "name": "角色管理",
        "open": false
      },
      {
        "checked": false,
        "children": [
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "93",
            "leaf": null,
            "name": "新增",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "94",
            "leaf": null,
            "name": "修改",
            "open": false
          },
          {
            "checked": false,
            "children": [],
            "expanded": false,
            "iconCls": "",
            "id": "95",
            "leaf": null,
            "name": "查看",
            "open": false
          }
        ],
        "expanded": false,
        "iconCls": "",
        "id": "92",
        "leaf": null,
        "name": "业务线管理",
        "open": false
      }
    ],
    "expanded": false,
    "iconCls": "",
    "id": "10",
    "leaf": null,
    "name": "权限管理",
    "open": false
  }
]
```

后端返回数据1

```js
{
  "code": 0,
  "data": {
    "menuList": [
      {
        "create_time": "2018-03-16 11:33:00",
        "menu_type": "M",
        "children": [
          {
            "create_time": "2018-03-16 11:33:00",
            "menu_type": "C",
            "children": [],
            "parent_id": 1,
            "menu_name": "用户管理",
            "icon": "#",
            "perms": "system:user:index",
            "order_num": 1,
            "menu_id": 4,
            "url": "/system/user"
          },
          {
            "create_time": "2018-12-28 10:36:20",
            "menu_type": "M",
            "children": [
              {
                "create_time": "2018-12-28 10:50:28",
                "menu_type": "C",
                "parent_id": 73,
                "menu_name": "人员通讯录",
                "icon": null,
                "perms": "system:person:index",
                "order_num": 1,
                "menu_id": 74,
                "url": "/system/book/person"
              }
            ],
            "parent_id": 1,
            "menu_name": "通讯录管理",
            "icon": "fa fa-address-book-o",
            "perms": null,
            "order_num": 1,
            "menu_id": 73,
            "url": "#"
          }
        ],
        "parent_id": 0,
        "menu_name": "系统管理",
        "icon": "fa fa-adjust",
        "perms": null,
        "order_num": 2,
        "menu_id": 1,
        "url": "#"
      },
      {
        "create_time": "2018-03-16 11:33:00",
        "menu_type": "M",
        "children": [
          {
            "create_time": "2018-03-16 11:33:00",
            "menu_type": "C",
            "parent_id": 2,
            "menu_name": "数据监控",
            "icon": "#",
            "perms": "monitor:data:view",
            "order_num": 3,
            "menu_id": 15,
            "url": "/system/druid/monitor"
          }
        ],
        "parent_id": 0,
        "menu_name": "系统监控",
        "icon": "fa fa-video-camera",
        "perms": null,
        "order_num": 5,
        "menu_id": 2,
        "url": "#"
      }
    ],
    "user": {
      "login_name": "admin",
      "user_id": 1,
      "user_name": "管理员",
      "dept_id": 1
    }
  }
}
```

后端返回数据2

```js
[
    {
        "id": 2,
        "insertDatetime": "2019-12-19 07:38:14",
        "updateDatetime": "2019-12-19 07:38:17",
        "insertUserName": "1",
        "updateUserName": "1",
        "createTime": null,
        "deleteFlag": 0,
        "user": null,
        "groupBy": null,
        "orderBy": null,
        "systemId": 1,
        "pid": 1,
        "name": "服务总览",
        "type": 1,
        "permissionValue": null,
        "uri": "/",
        "redirect": "",
        "icon": "",
        "status": 1,
        "orders": 1,
        "treeCode": null,
        "component": "",
        "guidePath": "",
        "jumpPath": "true",
        "userId": null,
        "roleId": null,
        "hidden": null,
        "children": [
            {
                "id": 3,
                "insertDatetime": "2019-12-19 07:40:39",
                "updateDatetime": "2019-12-19 07:40:43",
                "insertUserName": "1",
                "updateUserName": "",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 2,
                "name": "首页",
                "type": 2,
                "permissionValue": "",
                "uri": "home",
                "redirect": null,
                "icon": null,
                "status": 1,
                "orders": 1,
                "treeCode": null,
                "component": "/homes/index",
                "guidePath": null,
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 107,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 3,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "ph:data:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            }
        ]
    },
    {
        "id": 4,
        "insertDatetime": "2019-12-19 07:44:05",
        "updateDatetime": "2019-12-19 07:44:13",
        "insertUserName": "1",
        "updateUserName": "1",
        "createTime": null,
        "deleteFlag": 0,
        "user": null,
        "groupBy": null,
        "orderBy": null,
        "systemId": 1,
        "pid": 1,
        "name": "基础配置",
        "type": 1,
        "permissionValue": null,
        "uri": "/channel",
        "redirect": "/example/channel",
        "icon": "",
        "status": 1,
        "orders": 2,
        "treeCode": null,
        "component": "",
        "guidePath": "channel",
        "jumpPath": null,
        "userId": null,
        "roleId": null,
        "hidden": null,
        "children": [
            {
                "id": 11,
                "insertDatetime": "2020-07-27 08:23:16",
                "updateDatetime": "2020-07-27 08:23:19",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 4,
                "name": "聚合渠道商管理",
                "type": 2,
                "permissionValue": null,
                "uri": "dibutors",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 1,
                "treeCode": null,
                "component": "/channel/dibutors/index",
                "guidePath": "dibutors",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 35,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 11,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:sdkchannel:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 36,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 11,
                        "name": "新增",
                        "type": 3,
                        "permissionValue": "mint:sdkchannel:add",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 37,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 11,
                        "name": "修改",
                        "type": 3,
                        "permissionValue": "mint:sdkchannel:edit",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 38,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 11,
                        "name": "删除",
                        "type": 3,
                        "permissionValue": "mint:sdkchannel:del",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 12,
                "insertDatetime": "2020-07-27 08:23:16",
                "updateDatetime": "2020-07-27 08:23:19",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 4,
                "name": "联运渠道商管理",
                "type": 2,
                "permissionValue": null,
                "uri": "trchannel",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 2,
                "treeCode": null,
                "component": "/channel/trchannel/index",
                "guidePath": "trchannel",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 100,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 12,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": null,
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 13,
                "insertDatetime": "2020-07-27 08:23:16",
                "updateDatetime": "2020-07-27 08:23:19",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 4,
                "name": "厂商管理",
                "type": 2,
                "permissionValue": null,
                "uri": "cp",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 3,
                "treeCode": null,
                "component": "/channel/cp/index",
                "guidePath": "cp",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 39,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 13,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:cpdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 40,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 13,
                        "name": "新增",
                        "type": 3,
                        "permissionValue": "mint:cpdata:add",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 41,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 13,
                        "name": "修改",
                        "type": 3,
                        "permissionValue": "mint:cpdata:edit",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 42,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 13,
                        "name": "删除",
                        "type": 3,
                        "permissionValue": "mint:cpdata:del",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 14,
                "insertDatetime": "2020-07-27 08:23:16",
                "updateDatetime": "2020-07-27 08:23:19",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 4,
                "name": "支付配置",
                "type": 2,
                "permissionValue": null,
                "uri": "payment",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 4,
                "treeCode": null,
                "component": "/channel/payment/index",
                "guidePath": "payment",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 88,
                        "insertDatetime": "2020-08-17 03:29:26",
                        "updateDatetime": "2020-08-17 03:29:31",
                        "insertUserName": "1",
                        "updateUserName": "0",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 14,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": null,
                        "uri": "payment/aisle",
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": "/channel/payment/aisle/index",
                        "guidePath": "payment/aisle",
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 15,
                "insertDatetime": "2020-07-27 08:23:16",
                "updateDatetime": "2020-07-27 08:23:19",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 4,
                "name": "切支付策略",
                "type": 2,
                "permissionValue": null,
                "uri": "Paymentpolicy",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 5,
                "treeCode": null,
                "component": "/channel/Paymentpolicy/index",
                "guidePath": "Paymentpolicy",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 90,
                        "insertDatetime": "2020-08-17 03:29:26",
                        "updateDatetime": "2020-08-17 03:29:31",
                        "insertUserName": "1",
                        "updateUserName": "0",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 15,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": null,
                        "uri": "addpaymn",
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": "/channel/Paymentpolicy/addpaymn",
                        "guidePath": "addpaymn",
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 16,
                "insertDatetime": "2020-07-27 08:23:16",
                "updateDatetime": "2020-07-27 08:23:19",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 4,
                "name": "客服信息管理",
                "type": 2,
                "permissionValue": null,
                "uri": "service",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 6,
                "treeCode": null,
                "component": "/channel/service/index",
                "guidePath": "service",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 101,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 16,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": null,
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 17,
                "insertDatetime": "2020-07-27 08:23:16",
                "updateDatetime": "2020-07-27 08:23:19",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 4,
                "name": "联运样式管理",
                "type": 2,
                "permissionValue": null,
                "uri": "sdkstyle",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 7,
                "treeCode": null,
                "component": "/channel/sdkstyle/index",
                "guidePath": "sdkstyle",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 102,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 17,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": null,
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 18,
                "insertDatetime": "2020-07-27 08:23:16",
                "updateDatetime": "2020-07-27 08:23:19",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 4,
                "name": "数据字典",
                "type": 2,
                "permissionValue": null,
                "uri": "dictionaries",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 8,
                "treeCode": null,
                "component": "/channel/dictionaries/index",
                "guidePath": "dictionaries",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 43,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 18,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:code:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 44,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 18,
                        "name": "新增",
                        "type": 3,
                        "permissionValue": "mint:code:add",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 45,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 18,
                        "name": "修改",
                        "type": 3,
                        "permissionValue": "mint:code:edit",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 46,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 18,
                        "name": "删除",
                        "type": 3,
                        "permissionValue": "mint:code:del",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            }
        ]
    },
    {
        "id": 5,
        "insertDatetime": "2019-12-19 07:45:26",
        "updateDatetime": "2019-12-19 07:45:29",
        "insertUserName": "1",
        "updateUserName": "1",
        "createTime": null,
        "deleteFlag": 0,
        "user": null,
        "groupBy": null,
        "orderBy": null,
        "systemId": 1,
        "pid": 1,
        "name": "游戏管理",
        "type": 1,
        "permissionValue": "",
        "uri": "/games",
        "redirect": "/example/games",
        "icon": null,
        "status": 1,
        "orders": 3,
        "treeCode": null,
        "component": "",
        "guidePath": "games",
        "jumpPath": "",
        "userId": null,
        "roleId": null,
        "hidden": null,
        "children": [
            {
                "id": 19,
                "insertDatetime": "2020-07-27 08:27:54",
                "updateDatetime": "2020-07-27 08:27:59",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 5,
                "name": "游戏管理",
                "type": 2,
                "permissionValue": null,
                "uri": "gamens",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 1,
                "treeCode": null,
                "component": "/games/gamens/index",
                "guidePath": "gamens",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 47,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 19,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:game:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 48,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 19,
                        "name": "新增",
                        "type": 3,
                        "permissionValue": "mint:game:add",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 49,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 19,
                        "name": "修改",
                        "type": 3,
                        "permissionValue": "mint:game:edit",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 50,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 19,
                        "name": "删除",
                        "type": 3,
                        "permissionValue": "mint:game:del",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 20,
                "insertDatetime": "2020-07-27 08:27:54",
                "updateDatetime": "2020-07-27 08:27:59",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 5,
                "name": "母包管理",
                "type": 2,
                "permissionValue": null,
                "uri": "package",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 2,
                "treeCode": null,
                "component": "/games/package/index",
                "guidePath": "package",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 51,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 20,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:packagedata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 52,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 20,
                        "name": "新增",
                        "type": 3,
                        "permissionValue": "mint:packagedata:add",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 53,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 20,
                        "name": "修改",
                        "type": 3,
                        "permissionValue": "mint:packagedata:edit",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 54,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 20,
                        "name": "删除",
                        "type": 3,
                        "permissionValue": "mint:packagedata:del",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 55,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 20,
                        "name": "OSS上传权限",
                        "type": 3,
                        "permissionValue": "mint:oss:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 21,
                "insertDatetime": "2020-07-27 08:27:54",
                "updateDatetime": "2020-07-27 08:27:59",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 5,
                "name": "聚合渠道配置",
                "type": 2,
                "permissionValue": null,
                "uri": "channels",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 3,
                "treeCode": null,
                "component": "/games/channels/index",
                "guidePath": "channels",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 56,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 21,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:channel:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 57,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 21,
                        "name": "新增",
                        "type": 3,
                        "permissionValue": "mint:channel:add",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 58,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 21,
                        "name": "修改",
                        "type": 3,
                        "permissionValue": "mint:channel:edit",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 22,
                "insertDatetime": "2020-07-27 08:27:54",
                "updateDatetime": "2020-07-27 08:27:59",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 5,
                "name": "联运渠道配置",
                "type": 2,
                "permissionValue": null,
                "uri": "trchannels",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 4,
                "treeCode": null,
                "component": "/games/trchannels/index",
                "guidePath": "trchannels",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 103,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 22,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": null,
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 87,
                "insertDatetime": "2020-07-27 08:27:54",
                "updateDatetime": "2020-07-27 08:27:59",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 5,
                "name": "区服信息管理",
                "type": 2,
                "permissionValue": null,
                "uri": "areaclothing",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 5,
                "treeCode": null,
                "component": "/games/areaclothing/index",
                "guidePath": "areaclothing",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 104,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 87,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": null,
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            }
        ]
    },
    {
        "id": 6,
        "insertDatetime": "2019-12-19 07:46:34",
        "updateDatetime": "2019-12-19 07:46:37",
        "insertUserName": "1",
        "updateUserName": "1",
        "createTime": null,
        "deleteFlag": 0,
        "user": null,
        "groupBy": null,
        "orderBy": null,
        "systemId": 1,
        "pid": 1,
        "name": "用户管理",
        "type": 1,
        "permissionValue": "",
        "uri": "/user",
        "redirect": "/example/user",
        "icon": null,
        "status": 1,
        "orders": 4,
        "treeCode": null,
        "component": "",
        "guidePath": "user",
        "jumpPath": "",
        "userId": null,
        "roleId": null,
        "hidden": null,
        "children": [
            {
                "id": 23,
                "insertDatetime": "2020-07-27 08:29:56",
                "updateDatetime": "2020-07-27 08:29:59",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 6,
                "name": "用户查询",
                "type": 2,
                "permissionValue": null,
                "uri": "users",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 1,
                "treeCode": null,
                "component": "/user/users/index",
                "guidePath": "users",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 59,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 23,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:user:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 24,
                "insertDatetime": "2020-07-27 08:30:25",
                "updateDatetime": "2020-07-27 08:30:28",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 6,
                "name": "角色管理",
                "type": 2,
                "permissionValue": null,
                "uri": "role",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 2,
                "treeCode": null,
                "component": "/user/role/index",
                "guidePath": "role",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 61,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 24,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:userdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 62,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 24,
                        "name": "导出",
                        "type": 3,
                        "permissionValue": "mint:userdata:export",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            }
        ]
    },
    {
        "id": 96,
        "insertDatetime": "2020-09-22 08:37:05",
        "updateDatetime": "2020-09-22 08:37:09",
        "insertUserName": "1",
        "updateUserName": "1",
        "createTime": null,
        "deleteFlag": 0,
        "user": null,
        "groupBy": null,
        "orderBy": null,
        "systemId": 1,
        "pid": 1,
        "name": "运营工具",
        "type": 1,
        "permissionValue": null,
        "uri": "/operation",
        "redirect": "/example/operation",
        "icon": null,
        "status": 1,
        "orders": 5,
        "treeCode": null,
        "component": null,
        "guidePath": "operation",
        "jumpPath": null,
        "userId": null,
        "roleId": null,
        "hidden": null,
        "children": [
            {
                "id": 25,
                "insertDatetime": "2020-07-27 08:30:56",
                "updateDatetime": "2020-07-27 08:30:59",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 96,
                "name": "公告管理",
                "type": 2,
                "permissionValue": null,
                "uri": "run",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 1,
                "treeCode": null,
                "component": "/operation/run/index",
                "guidePath": "run",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": []
            },
            {
                "id": 118,
                "insertDatetime": "2020-10-28 02:48:04",
                "updateDatetime": "2020-10-28 02:48:04",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 96,
                "name": "运营广告",
                "type": 2,
                "permissionValue": null,
                "uri": "runad",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 2,
                "treeCode": null,
                "component": "/operation/runad/index",
                "guidePath": "runad",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 119,
                        "insertDatetime": "2020-10-28 03:01:23",
                        "updateDatetime": "2020-10-28 03:01:23",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 118,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": null,
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 120,
                "insertDatetime": "2020-11-19 03:49:22",
                "updateDatetime": "2020-11-19 03:49:22",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 96,
                "name": "月卡开通领取引导配置",
                "type": 2,
                "permissionValue": null,
                "uri": "monthcard",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 3,
                "treeCode": null,
                "component": "/operation/monthcard/index",
                "guidePath": "monthcard",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 121,
                        "insertDatetime": "2020-11-24 01:45:44",
                        "updateDatetime": "2020-11-24 01:45:44",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 120,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": null,
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 122,
                "insertDatetime": "2020-12-21 08:31:44",
                "updateDatetime": "2020-12-21 08:31:44",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 96,
                "name": "游戏群管理",
                "type": 2,
                "permissionValue": null,
                "uri": "group",
                "redirect": null,
                "icon": null,
                "status": 1,
                "orders": 4,
                "treeCode": null,
                "component": "/operation/group/index",
                "guidePath": "group",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 123,
                        "insertDatetime": "2020-12-21 08:31:45",
                        "updateDatetime": "2020-12-21 08:31:45",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 122,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": null,
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 124,
                "insertDatetime": "2020-12-24 02:21:32",
                "updateDatetime": "2020-12-24 02:21:39",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 96,
                "name": "群消息举报",
                "type": 2,
                "permissionValue": null,
                "uri": "report",
                "redirect": null,
                "icon": null,
                "status": 1,
                "orders": 5,
                "treeCode": null,
                "component": "/operation/report/index",
                "guidePath": "report",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 125,
                        "insertDatetime": "2020-12-24 02:22:26",
                        "updateDatetime": "2020-12-24 02:22:30",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 124,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": null,
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            }
        ]
    },
    {
        "id": 7,
        "insertDatetime": "2020-07-27 08:19:50",
        "updateDatetime": "2020-07-27 08:19:54",
        "insertUserName": "1",
        "updateUserName": "1",
        "createTime": null,
        "deleteFlag": 0,
        "user": null,
        "groupBy": null,
        "orderBy": null,
        "systemId": 1,
        "pid": 1,
        "name": "订单管理",
        "type": 1,
        "permissionValue": null,
        "uri": "/order",
        "redirect": "/example/order",
        "icon": null,
        "status": 1,
        "orders": 6,
        "treeCode": null,
        "component": "",
        "guidePath": "order",
        "jumpPath": null,
        "userId": null,
        "roleId": null,
        "hidden": null,
        "children": [
            {
                "id": 26,
                "insertDatetime": "2020-07-27 08:31:37",
                "updateDatetime": "2020-07-27 08:31:40",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 7,
                "name": "订单管理",
                "type": 2,
                "permissionValue": null,
                "uri": "orders",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": null,
                "treeCode": null,
                "component": "/order/orders/index",
                "guidePath": "orders",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 63,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 26,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:order:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 64,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 26,
                        "name": "补单",
                        "type": 3,
                        "permissionValue": "mint:order:repeat",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 65,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 26,
                        "name": "删除",
                        "type": 3,
                        "permissionValue": "mint:order:del",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 97,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 26,
                        "name": "导出",
                        "type": 3,
                        "permissionValue": "mint:order:export",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 115,
                "insertDatetime": "2020-07-27 08:31:37",
                "updateDatetime": "2020-07-27 08:31:40",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 7,
                "name": "订单查询",
                "type": 2,
                "permissionValue": null,
                "uri": "ordersee",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": null,
                "treeCode": null,
                "component": "/order/ordersee/index",
                "guidePath": "ordersee",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 117,
                        "insertDatetime": "2020-10-21 08:01:05",
                        "updateDatetime": "2020-10-21 08:01:11",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 115,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:basicdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            }
        ]
    },
    {
        "id": 8,
        "insertDatetime": "2020-07-27 08:21:35",
        "updateDatetime": "2020-07-27 08:21:38",
        "insertUserName": "1",
        "updateUserName": "1",
        "createTime": null,
        "deleteFlag": 0,
        "user": null,
        "groupBy": null,
        "orderBy": null,
        "systemId": 1,
        "pid": 1,
        "name": "统计分析",
        "type": 1,
        "permissionValue": null,
        "uri": "/stical",
        "redirect": "/example/stical",
        "icon": null,
        "status": 1,
        "orders": 7,
        "treeCode": null,
        "component": "",
        "guidePath": "stical",
        "jumpPath": null,
        "userId": null,
        "roleId": null,
        "hidden": null,
        "children": [
            {
                "id": 27,
                "insertDatetime": "2020-07-27 08:32:23",
                "updateDatetime": "2020-07-27 08:32:27",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 8,
                "name": "游戏概况",
                "type": 2,
                "permissionValue": null,
                "uri": "gmtion",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 1,
                "treeCode": null,
                "component": "/stical/gmtion/index",
                "guidePath": "gmtion",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 105,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 27,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:statistics:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 28,
                "insertDatetime": "2020-07-27 08:32:23",
                "updateDatetime": "2020-07-27 08:32:27",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 8,
                "name": "日基础数据",
                "type": 2,
                "permissionValue": null,
                "uri": "daydata",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 2,
                "treeCode": null,
                "component": "/stical/daydata/index",
                "guidePath": "daydata",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 66,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 28,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:basicdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 67,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 28,
                        "name": "导出",
                        "type": 3,
                        "permissionValue": "mint:basicdata:export",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 68,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 28,
                        "name": "构造数据",
                        "type": 3,
                        "permissionValue": "mint:basicdata:build",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 108,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 28,
                        "name": "区服每日查看",
                        "type": 3,
                        "permissionValue": "mint:basicdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 109,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 28,
                        "name": "区服汇总查看",
                        "type": 3,
                        "permissionValue": "mint:basicdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 114,
                "insertDatetime": "2020-07-27 08:32:23",
                "updateDatetime": "2020-07-27 08:32:27",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 8,
                "name": "游戏基础数据",
                "type": 2,
                "permissionValue": null,
                "uri": "gamedayta",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 2,
                "treeCode": null,
                "component": "/stical/gamedayta/index",
                "guidePath": "gamedayta",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 116,
                        "insertDatetime": "2020-10-21 08:01:05",
                        "updateDatetime": "2020-10-21 08:01:11",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 114,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:order:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 29,
                "insertDatetime": "2020-07-27 08:32:23",
                "updateDatetime": "2020-07-27 08:32:27",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 8,
                "name": "留存数据",
                "type": 2,
                "permissionValue": null,
                "uri": "keep",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 3,
                "treeCode": null,
                "component": "/stical/keep/index",
                "guidePath": "keep",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 69,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 29,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:retentdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 70,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 29,
                        "name": "导出",
                        "type": 3,
                        "permissionValue": "mint:retentdata:export",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 71,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 29,
                        "name": "构造数据",
                        "type": 3,
                        "permissionValue": "mint:retentdata:build",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 110,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 29,
                        "name": "留存每日查看",
                        "type": 3,
                        "permissionValue": "mint:basicdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 111,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 29,
                        "name": "留存汇总查看",
                        "type": 3,
                        "permissionValue": "mint:basicdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 30,
                "insertDatetime": "2020-07-27 08:32:23",
                "updateDatetime": "2020-07-27 08:32:27",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 8,
                "name": "LTV",
                "type": 2,
                "permissionValue": null,
                "uri": "ltv",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 4,
                "treeCode": null,
                "component": "/stical/ltv/index",
                "guidePath": "ltv",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 72,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 30,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:ltvdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 73,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 30,
                        "name": "导出",
                        "type": 3,
                        "permissionValue": "mint:ltvdata:export",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 74,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 30,
                        "name": "构造数据",
                        "type": 3,
                        "permissionValue": "mint:ltvdata:build",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 112,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 30,
                        "name": "LTV每日查看",
                        "type": 3,
                        "permissionValue": "mint:basicdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 113,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 30,
                        "name": "LTV汇总查看",
                        "type": 3,
                        "permissionValue": "mint:basicdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 31,
                "insertDatetime": "2020-07-27 08:32:23",
                "updateDatetime": "2020-07-27 08:32:27",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 8,
                "name": "在线数据统计",
                "type": 2,
                "permissionValue": null,
                "uri": "online",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 5,
                "treeCode": null,
                "component": "/stical/online/index",
                "guidePath": "online",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 75,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 31,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:censusdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 32,
                "insertDatetime": "2020-07-27 08:32:23",
                "updateDatetime": "2020-07-27 08:32:27",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 8,
                "name": "渠道周期报表",
                "type": 2,
                "permissionValue": null,
                "uri": "channelweek",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": 6,
                "treeCode": null,
                "component": "/stical/channelweek/index",
                "guidePath": "channelweek",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 98,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 32,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:basicdata:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 99,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 32,
                        "name": "导出",
                        "type": 3,
                        "permissionValue": "mint:basicdata:export",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 126,
                "insertDatetime": "2021-01-06 07:55:32",
                "updateDatetime": "2021-01-06 07:55:32",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 8,
                "name": "联运渠道数据",
                "type": 2,
                "permissionValue": null,
                "uri": "unite",
                "redirect": null,
                "icon": null,
                "status": 1,
                "orders": 7,
                "treeCode": null,
                "component": "/stical/unite/index",
                "guidePath": "unite",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 127,
                        "insertDatetime": "2021-01-06 07:55:32",
                        "updateDatetime": "2021-01-06 07:55:32",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 126,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": null,
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            }
        ]
    },
    {
        "id": 10,
        "insertDatetime": "2020-07-27 08:22:33",
        "updateDatetime": "2020-07-27 08:22:35",
        "insertUserName": "1",
        "updateUserName": "1",
        "createTime": null,
        "deleteFlag": 0,
        "user": null,
        "groupBy": null,
        "orderBy": null,
        "systemId": 1,
        "pid": 1,
        "name": "权限管理",
        "type": 1,
        "permissionValue": null,
        "uri": "/pmisons",
        "redirect": "/amstrator/index",
        "icon": null,
        "status": 1,
        "orders": 8,
        "treeCode": null,
        "component": "",
        "guidePath": "pmisons",
        "jumpPath": null,
        "userId": null,
        "roleId": null,
        "hidden": null,
        "children": [
            {
                "id": 33,
                "insertDatetime": "2020-07-27 08:35:42",
                "updateDatetime": "2020-07-27 08:35:45",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 10,
                "name": "账号管理",
                "type": 2,
                "permissionValue": null,
                "uri": "/amstrator",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": null,
                "treeCode": null,
                "component": "/pmisons/amstrator/index",
                "guidePath": "amstrator",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 76,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 33,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:pmsUser:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 77,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 33,
                        "name": "新增",
                        "type": 3,
                        "permissionValue": "mint:pmsUser:add",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 78,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 33,
                        "name": "修改",
                        "type": 3,
                        "permissionValue": "mint:pmsUser:edit",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 80,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 33,
                        "name": "设置角色",
                        "type": 3,
                        "permissionValue": "mint:pmsUser:set",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 81,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 33,
                        "name": "重置密码",
                        "type": 3,
                        "permissionValue": "mint:pmsUser:reset",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 34,
                "insertDatetime": "2020-07-27 08:36:04",
                "updateDatetime": "2020-07-27 08:36:08",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 10,
                "name": "角色管理",
                "type": 2,
                "permissionValue": null,
                "uri": "/dbution",
                "redirect": "",
                "icon": null,
                "status": 1,
                "orders": null,
                "treeCode": null,
                "component": "/pmisons/dbution/index",
                "guidePath": "dbution",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 82,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 34,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:pmsRole:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 83,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 34,
                        "name": "新增",
                        "type": 3,
                        "permissionValue": "mint:pmsRole:add",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 84,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 34,
                        "name": "修改",
                        "type": 3,
                        "permissionValue": "mint:pmsRole:edit",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 85,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 34,
                        "name": "删除",
                        "type": 3,
                        "permissionValue": "mint:pmsRole:del",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 86,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 34,
                        "name": "设置权限",
                        "type": 3,
                        "permissionValue": "mint:pmsRole:authorize",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            },
            {
                "id": 92,
                "insertDatetime": "2020-09-21 02:47:41",
                "updateDatetime": "2020-09-21 02:47:44",
                "insertUserName": "1",
                "updateUserName": "1",
                "createTime": null,
                "deleteFlag": 0,
                "user": null,
                "groupBy": null,
                "orderBy": null,
                "systemId": 1,
                "pid": 10,
                "name": "业务线管理",
                "type": 2,
                "permissionValue": null,
                "uri": "service",
                "redirect": null,
                "icon": null,
                "status": 1,
                "orders": null,
                "treeCode": null,
                "component": "/pmisons/service/index",
                "guidePath": "service",
                "jumpPath": null,
                "userId": null,
                "roleId": null,
                "hidden": null,
                "children": [
                    {
                        "id": 93,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 92,
                        "name": "新增",
                        "type": 3,
                        "permissionValue": "mint:pmsdepartment:add",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 94,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 92,
                        "name": "修改",
                        "type": 3,
                        "permissionValue": "mint:pmsdepartment:edit",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    },
                    {
                        "id": 95,
                        "insertDatetime": "2020-07-28 09:56:40",
                        "updateDatetime": "2020-07-28 09:56:43",
                        "insertUserName": "1",
                        "updateUserName": "1",
                        "createTime": null,
                        "deleteFlag": 0,
                        "user": null,
                        "groupBy": null,
                        "orderBy": null,
                        "systemId": 1,
                        "pid": 92,
                        "name": "查看",
                        "type": 3,
                        "permissionValue": "mint:pmsdepartment:view",
                        "uri": null,
                        "redirect": null,
                        "icon": null,
                        "status": 1,
                        "orders": null,
                        "treeCode": null,
                        "component": null,
                        "guidePath": null,
                        "jumpPath": null,
                        "userId": null,
                        "roleId": null,
                        "hidden": null,
                        "children": []
                    }
                ]
            }
        ]
    }
]
```

后端返回数据3

```js
[{
  id: 1,
  name: 'Example',
  code: null,
  description: null,
  url: '/example',
  component: 'layout',
  generatemenu: 1,
  sort: 0,
  parentId: null,
  permName: null,
  redirect: '/example/table',
  title: '普通用户',
  icon: 'example',
  children: [
    {
      id: 2,
      name: 'Table',
      code: null,
      description: null,
      url: 'table',
      component: 'table',
      generatemenu: 1,
      sort: 0,
      parentId: 1,
      permName: null,
      redirect: '',
      title: 'Table',
      icon: 'table',
      children: null
    },
    {
      id: 3,
      name: 'Tree',
      code: null,
      description: null,
      url: 'tree',
      component: 'tree',
      generatemenu: 1,
      sort: 0,
      parentId: 1,
      permName: null,
      redirect: '',
      title: 'Tree',
      icon: 'tree',
      children: null
    }
  ]
}]
```



### 32 静态的权限控制（适合没有角色权限控制的项目）

1. 前端输入账号密码，获取token。
2. 在路由跳转之前，请求user_info拿到roles一个数组。
3. 如果是`admin`显示所有路由，如果是其他角色，匹配role和router.meta.roles的角色，返回一个新路由。
4. 然后渲染在侧边栏。

```js
Only admin can see thisv-permission="['admin']" //仅仅是admin能看
Both admin and editor can see thisv-permission="['admin','editor']" // admin和editor都能看
```



### 33 最终的两套权限方案

1. 类似`vue-admin`的用role数组匹配对应路由的`roleId`, 过滤出对应的菜单。
2. ![img](C:\Users\EDZ\AppData\Local\Temp\WeChat Files\ec20f6e3c3c7546e0ea47cdf701d0e3.png)
3. 用第一种方法，但是自己在界面上加菜单。



### 33 上传

```js

 <el-upload
     v-if="row.applyType === 1"
     action
     :show-file-list="false"
     :http-request="uploadFile"
 >
<el-button size="mini" style="margin-left: 10px" @click="beforeUploadClick(row)" >
  导入
</el-button>
 </el-upload>


uploadFile(option) {
       let form = new FormData()
       form.append('file', option.file)
       let actSn = this.activeSn
       postExcelCode(form, actSn).then(res => {
         if(res.data.code === 200) {
          this.$message({
                type: 'success',
                message: '导入成功!'
              });
          } else {
              this.$message({
                message:'导入失败!',
                type: 'warning'
              })
          }
       }) 
    },
```

###  34 `vue`中阻止事件的默认行为和阻止事件冒泡

```js
@click.stop //阻止事件冒泡

@click.prevent //阻止事件的默认行为，
```

### 35 项目构建

1. 项目精简

### 36 $attrs和$listeners

```js
bojan楊:
爷孙组件通信

bojan楊:
如果想爷组件传值给孙组件，直接在子组件里面加一个v-bind就可以作为数据中转。
在孙组件里面
直接 this.$attrs.变量名
```

