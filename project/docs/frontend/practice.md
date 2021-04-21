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

### 32 合理的权限控制

1. 前端输入账号密码，获取token。
2. 在路由跳转之前，请求user_info拿到roles一个数组。
3. 如果是`admin`显示所有路由，如果是其他角色，匹配role和router.meta.roles的角色，返回一个新路由。
4. 然后渲染在侧边栏。

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

