## `Vue` 功能概述

### `Guide`

```js
npm install driver.js

//driver.js
//特色功能：

//突出显示页面上的任何任何项目
//锁定用户交互
//创建功能介绍
//为用户添加聚焦器
//高度可定制 – 可在任何地方使用，可覆盖
//界面友好 – 可通过按键控制
//轻量级 – gzip 压缩后只有约4kb
//在所有主流浏览器中保持一致的行为
//免费用于个人和商业用途

import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css

// vue.js
mounted() {
    this.driver = new Driver()
}
methods: {
    guide() {
         this.driver.definesteps(steps)
   		 this.driver.start   
    }
}
 // 需要引导的页面
 <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

 // 配置项 steps.js
  const steps = [
  {
    element: '#hamburger-container',
    popover: {
      title: 'Hamburger',
      description: 'Open && Close sidebar',
      position: 'bottom'
    }
  }
  ]
```

