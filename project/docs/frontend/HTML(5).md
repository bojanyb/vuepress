# 基础篇 - HTML(5)

## 一、HTML、HTTP、web综合问题

### 1 前端需要注意哪些`SEO`

- 合理的`title`、`description`、`keywords`：搜索对这三项的权重逐个减小，`title`值强调重点即可，重要关键词不要超过2次，而且要靠前，不同页面`title`要有所不同；`description`把页面内容高度概括，长度合适，不可过分堆砌关键词，不同页面`description`有所不同；`keywords`列举出重要关键词即可
- 语义化的`HTML`代码，符合`W3C`规范：语义化代码让搜索引擎容易理解网页
- 重要内容不要用`js`输出：爬虫不会执行js获取内容
- 少用`iframe`：搜索引擎不会抓取`iframe`中的内容
- 飞装饰性图片必须加`alt`
- 提供网站速度：网站速度是搜索引起排序的一个重要指标

### 2 `<img>`的`title`和`alt`有什么区别

- 通常鼠标滑动到元素上的时候显示
- `alt`是`<img>`的特有属性，是图片内容的等价描述，用于图片无法加载时显示、读屏器阅读图片。可提高图片可访问性，出了纯装饰图片外都必须设置有意义的值，搜索引擎会重点分析

### 3 语义化的理解

- 用正确的标签做正确的事情！
- `HTML`语义化就是让页面的内容结构化，便于对浏览器，搜索引擎解析
- 在没有样式`CSS`情况下也以一种文档格式显示，并且是容易阅读的。
- 搜索引擎的爬虫依赖于标记来确定上下文和各个关键词的权重，利于SEO
- 使阅读源代码的人对网站更容易网站分块，便于阅读维护理解

### 4 `DOCTYPE`

- 前端经常在`HTML`都不看到`DOCTYPE`的声明，一般常位于文档的第一行。那么他的作用是什么，可能对新的浏览器或者心得网站暂无什么影响，但是对相对古老的浏览器或者网站，可能会出现不同，因为浏览器有标准模式与兼容模式，差异相对比较大
- 标准模式的渲染方式和`JS`引擎的解析方式都是以该浏览器支持的最高标准运行。兼容模式中，页面以宽松的向后兼容显示，模拟老式浏览器的行为以防止站点无法工作
- 而`DOCTYPE`的存在，就是为了声明，该页面使用标准模式。不声明，可能一些旧的网站会出现兼容模式

### 5 link与@import

- `link`与`import`，本质使用上，我们都是用他来引入`CSS`，但是他们有一定的区别。
- `link`是一种引入资源的标签，`import`是引入`CSS`的方式。所以，`import`引入的只能是`CSS`，而`link`可以引入所有的资源，包括图片，`RSS`等
- 加载顺序上也有一些差异。`link`引用的`CSS`会同时被加载。`import`引用的`CSS`会等到页面全部被下载完再加载
- 兼容性的差别，`link`无任何兼容问题，`import`兼容`IE5`以上。（当然，`IE5`估计也找不到了）
- 动态引入样式`link`可以后期引入样式，而`import`是不可以后期引入的，只能初始化页面之前引入
- 复用率的问题`import`可以复用之前的`css`文件，而`link`只能一次引入一个文件。当然，`import`复用文件时，在浏览器实际上是加载了多个文件，会有多个请求。而每一个`link`只是一个`http`请求

### 6 `<script>`标签的`async`与`defer`属性

- 首先这两个东西为什么而存在的问题。在日渐复杂的前端，异常已经是程序的一部分。如果出现一些小问题，或者服务器加载上出现延迟。而我们默认的引入的`script`脚本,会阻塞后续的DOM渲染。一旦没有部分异常无法及时加载完成，那么我们的页面因为阻塞问题，将整个白屏
- 也许我们可以保证自己的服务器的正常，但是你决定保证不了第三方服务器的正常，于是引入了`async`和`defer`来优化这个问题
- 再来谈谈`<script>`的默认，`async`，`defer`的之前的差异
- 默认情况下：浏览器会立即加载并执行指定的脚本，指定的脚本，指在`<script>`标签之上的脚本。所以，如果`<script>`放在`<header>`中，而对应的文件还未加载完成，会形成阻塞。所以这就是很多页面，都会使用默认且把script放在页面结尾的原因
- `async`情况下：`acync`，加载和渲染后续文档元素的过程将和`script.js`的加载与执行并行进行（异步）。async是乱序的
- `defer`情况下：`defer`，加载后续文档元素的过程将和`script.js`的加载并行进行（异步），但是`script.js`的执行要在所有元素解析完成之后，`DOMContentLoaded `时间处罚之前完成，`defer`是顺序执行。
- 此外，`async`跟`defer`，不支持或者不兼容`IE9`以下浏览器，总体来说，笔者还是觉得`script`放最下方靠谱一些