### `盒模型`

#### `W3C`标准盒模型

width/height = content + border + padding

#### `IE`盒模型

width/height = content

#### `css3`支持改变盒模型

box-sizing

box-sizing用来改变计算盒子高度/宽度的默认盒子模型，可以使用此属性来模拟不正确支持CSS盒子模型规范的浏览器的行为

box-sizing: content-box (默认值) 标准盒模型

box-sizing: border-box 怪异模式

#### `行内元素和内联元素`

- **行内元素**：和有他元素都在一行上，高度、行高及外边距和内边距都不可改变，文字图片的宽度不可改变，只能容纳文本或者其他行内元素；
- **块级元素**：总是在新行上开始，高度、行高及外边距和内边距都可控制，可以容纳内联元素和其他元素；

### `选择器`

#### `选择器优先级`

- `!important`
- 内联样式（1000）
- ID选择器（0100）
- 类选择器/属性选择器/伪类选择器（0010）
- 元素选择器/伪元素选择器（0001）
- 关系选择器/通配符选择器（0000）

#### `属性继承`

- 可继承的样式属性： `font-size`, `font-family`, `color`, `ul`, `li`, `dl`, `dd`, `dt`;
- 不可继承的样式属性： `border`, `padding`, `margin`, `width`, `height`；

#### `伪类和伪元素`

- 冒号(`:`)用于`CSS3`伪类，双冒号(`::`)用于`CSS3`伪元素。
- 首先，伪类的效果可以通过添加实际的类来实现，而伪元素的效果可以通过添加实际的元素来实现。所以它们的**本质区别就是是否抽象创造了新元素**。

### `移动端适配`

> 一般情况下设计稿是按照`375px`尺寸设计，然而，在现在移动终端（就是手机）快速更新的时代，每个品牌的手机都有着不同的物理分辨率，这样就会导致，每台设备的逻辑分辨率也不尽相同。

#### 物理分辨率和逻辑分辨率

物理分辨率：硬件所支持的

逻辑分辨率：软件可以达到的

#### 设备像素比

设备像素比简称`dpr`,即物理分辨率和逻辑分辨率的比值。为什么要知道设备像素比呢？因为这个像素比会产生一个非常经典的问题，`1px`边框的问题。

#### `1px`边框问题

> 当我们`css`里写`1px`的时候，由于他的逻辑像素,导致我们逻辑像素根据这个`dpr`去映射到设备上就为`2px`,或者`3px`.由于每个设备的屏幕尺寸不一样，就导致每个物理像素渲染出来的大小也不同，这样如果在尺寸比较大的设备上，`1px`渲染出来的样子相当大，这就是经典的`1px`的问题。

如何解决：

核心思路，就是再web中，浏览器为我们提供了`window.devicePixelRatio`来帮助我们获取`dpr`.在`css`中，可以使用媒体查询`min-device-pixel-ratio`,区分`dpr`.但是这又兼容性问题。

最佳方案

**transform: scale(0.5) 方案**

设置`height: 1px`，根据媒体查询的`device-pixel-ratio`来区分`dpr`,结合transform缩放为相应尺寸.

```
/* 2倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 2.0) {
    .border-bottom::after {
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
    }
}
/* 3倍屏 */
@media only screen and (-webkit-min-device-pixel-ratio: 3.0) {
    .border-bottom::after {
        -webkit-transform: scaleY(0.33);
        transform: scaleY(0.33);
    }
}
```

#### `viewport`

> 视口(`viewport`)代表当前可见的计算机图形区域。在`Web`浏览器术语中，通常与浏览器窗口相同，但不包括浏览器的`UI`， 菜单栏等——即指你正在浏览的文档的那一部分。

那么在移动端如何配置视口呢？ 简单的一个meta标签即可！

```html
<meta name="viewport" content="width=device-width; initial-scale=1; maximum-scale=1; minimum-scale=1; user-scalable=no;">
// width 视口宽度
// height 视口高度
// initiat 初始缩放值
// minmun-scale 缩小最小比例
// minmun-scale 方法最大比例
// user-scalable 是否允许用户手动缩放页面
```

#### `rem适配`

> `rem`是`CSS3`新增的一个相对单位，这个单位引起了广泛关注。这个单位与`em`有什么区别呢？区别在于使用`rem`为元素设定字体大小时，仍然是相对大小，但相对的只是`HTML`根元素。这个单位可谓集相对大小和绝对大小的优点于一身，通过它既可以做到只修改根元素就成比例地调整所有字体大小，又可以避免字体大小逐层复合的连锁反应。目前，除了`IE8`及更早版本外，所有浏览器均已支持`rem`。对于不支持它的浏览器，应对方法也很简单，就是多写一个绝对单位的声明。这些浏览器会忽略用`rem`设定的字体大小。

#### flexible

rem的布局，不得不提flexible，flexible方案是阿里早期开源的一个移动端适配解决方案，引用flexible后，我们再页面上统一使用rem来布局。

他的原理非常简单

```js
// set 1rem = viewWidth / 10
function setRemUnit () {
    var rem = docEl.clientWidth / 10
    docEl.style.fontSize = rem + 'px'
}
setRemUnit();
```

rem是相对于`html`节点的`font-size`来做计算的，所以再页面初始化的时候给根元素设置一个font-size，接下来的元素就根据rem来布局，这样就可以保证页面大小变化时，布局可以自适应。

如此我们只需要给设计稿的`px`转换成对应的rem单位即可。

当然这个方案只是过渡方案，为什么说是过渡方案。

> 因为当年viewport在低版本安卓设备上还有兼容问题，而vw，vh还没能实现所有浏览器兼容，所以flexible方案用rem来模拟vmin来实现在不同设备等比缩放的“通用”方案，之所以说是通用方案,是因为他这个方案是根据设备大小去判断页面的展示空间大小即屏幕大小，然后根据屏幕大小去百分百还原设计稿，从而让人看到的效果(展示范围)是一样的，这样一来，苹果5 和苹果6p屏幕如果你按照设计稿还原的话，字体大小实际上不一样，而人们在一样的距离上希望看到的大小其实是一样的，本质上，**用户使用更大的屏幕，是想看到更多的内容，而不是更大的字**。
>
> so，这个用缩放来解决问题的方案是个过渡方案，注定时代所淘汰

#### `vw`，`vh`布局

> `vh`、`vw`方案即将视觉视口宽度 `window.innerWidth`和视觉视口高度` window.innerHeight` 等分为 100 份。
>
> `vh`和`vw`方案和`rem`类似也是相当麻烦需要做单位转化，而且`px`转换成`vw`不一定能完全整除，因此有一定的像素差。
>
> 不过在工程化的今天，`webpack`解析`css` 的时候用`postcss-loader` 有个`postcss-px-to-viewport`能自动实现`px`到`vw`的转化

#### 移动端适配流程

1. 在`head` 设置`width=device-width`的`viewport`
2. 在`css`中使用`px`或`rem`
3. 在适当的场景使用`flex`布局，或者配合`vw`进行自适应
4. 在跨设备类型的时候（`pc` <-> 手机 <-> 平板）使用媒体查询
5. 在跨设备类型如果交互差异太大的情况，考虑分开项目开发

### `浏览器兼容性方案`

> 虽然面试官的问题十分的笼统，浏览器的兼容性无非还是样式兼容性（css），交互兼容性（javascript），浏览器 hack 三个方面。

#### 样式兼容性（css）方面

1. 因为历史原因，不同浏览器样式存在差异，可以通过Normalise.css抹平差异，也可以定制自己的reset.css，例如通过通配符原则器，全局重置样式。

   - ```css
      * { margin: 0; padding: 0; }
     ```

2. 在CSS3还没有称为真正的标准时，浏览器厂商就开始支持这些属性的使用了。CSS3样式语法还存在波动时，浏览器厂商提供了针对浏览器的前缀，直到现在还是有部分的属性需要加上浏览器前缀。在开发过程中一般通过webpack帮我们处理。

   - 用插件autoprefixer，打包时就会自动加上浏览器前缀。

3. 在还原设计稿的时候我们常常会需要用到透明属性，所以解决 IE9 以下浏览器不能使用 opacity。

   - ```
     filter: alpha(opacity = 50); //IE6-IE8我们习惯使用filter滤镜属性来进行实现
     ```

#### 交互兼容性(js)方面

1. 事件兼容的问题，我们通常需要会封装一个适配器的方法，过滤事件句柄绑定、移除、冒泡阻止以及默认事件行为处理
2. 获取 scrollTop 通过 document.documentElement.scrollTop 兼容非chrome浏览器

#### 浏览器 hack 方面

根据浏览器版本不同来做不同的处理， 主张向前兼容，不考虑向后兼容。

### 什么是`BFC`

> `BFC`全称为块级格式化上下文. `BFC`是`W3C` `CSS 2.1`规范中的一个概念，他决定了元素如何对其内容进行定位以及其他元素的关系和相互作用，当设计到可视化布局时，`BFC`提供了一个环境，`HTML`元素在这个环境中按照一定规则进行布局。一个环境中的元素不会影响到其他环境中的布局。比如浮动元素会形成`BFC`，浮动元素内部子元素的主要受该浮动元素影响，两个浮动元素之间是互不影响的。这里有点类似一个`BFC`就是一个独立单位的意思。可以说`BFC`就是一个作用范围，把他理解成一个独立的容器，并且这个容器里`box`的布局与这个容器外的`box`毫不相干。

触发`BFC`的条件

- 根元素或其他包含它的元素
- `float`浮动元素（元素的`float`不是`none`）
- 绝对定位元素（`position`: `absolute`或`fixed`)
- 内联块（元素具有`display: inline-block`）
- `overflow`: `hidden`

#### `BFC`的约束规则

- 内部的盒会在垂直方向一个接一个排列（可以看作`BFC`中有一个常规流）
- 处于同一个`BFC`中的元素互相影响，可能会发现外边距重叠。
- `BFC`就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。

#### `BFC`可以解决的问题

- 垂直外边距重叠问题
- 去除浮动
- 自适应两列布局（`float` + `overflow`）

### `重绘和回流`

#### `浏览器的渲染过程`

1. 解析HTML，生成DOM树，解析CSS，生成CSSOM树
2. 将DOM树和CSSOM树结合，生成`Render Tree`(渲染树)
3. 回流（layout）：根据生成的渲染树，进行回流，得到节点的几何信息（位置、大小）
4. 重绘（painting）: 根据渲染树以及回流得到的几何信息，得到节点的绝对像素。
5. 显示（display）：将像素发送给GPU，展示到页面上。

#### `构建渲染树`

为了构建渲染树，浏览器主要完成以下工作

1. 从DOM树的根节点开始遍历每个可见节点
2. 对于每个可见的节点，找到CSSOM树种对应的规则，并应用他们。
3. 根据每个可见节点以及其对应的样式，组合生成渲染树。

渲染树只包含可见的节点，像display：none; opcaity: 0;以及mate，link标签不会渲染

#### `回流`

前面我们通过构建渲染树（结合DOM节点和样式），可是我们还需要计算他在设备视口内的确切的位置和大小，这个计算的阶段就是回流。

为了弄清每个对象在网站上的确切大小和位置，浏览器从渲染树的根节点开始遍历。

#### `重绘`

最终通过构建渲染树和回流阶段，我们知道了哪些节点是可见的，以及可见节点的样式和具体的几何信息（位置、大小），那么我们就可以将渲染树的每个节点都转换为屏幕上的实际像素。这个阶段就叫做重绘。

#### `何时会发生回流重绘`

回流这一阶段主要是计算节点的位置和几何信息，那么当页面布局和几何信息发生变化时，就需要回流。

- 创建和销毁DOM元素
- 元素位置发生变化
- 元素尺寸发生变化
- 内容发生变化
- 页面首次渲染
- 浏览器窗口尺寸发生变化（因为回流是根据视口的大小来计算元素的位置和大小的）

注意：回流一定会触发重绘，重绘不一定会回流

根据改变的范围和程度，渲染树中或大或小的部分需要重新计算，有些改变会触发整个页面的重绘，比如，滚动条出现的时候。

#### `浏览器的优化机制`

现代的浏览器都是很聪明的，由于每次重绘都会造成额外的计算消耗，因此大多数浏览器都会通过队列化修改并批量执行来优化重绘过程。浏览器会将修改操作放入到队列中，直到过了一段时间或者操作达到了一个阈值，才清空队列。但是！当你获取布局信息的操作时，会强制队列刷新，比如当你访问一下属性。

- offsetTop,scrollTop,cilentTop

以上属性和方法都需要返回最新的布局信息，因此浏览器不得不清空队列，重发回流重绘来返回正确的值。尽量避免用这些属性，如要使用他们，最好将值缓存起来。

#### `重点： 如何减少重绘和回流`

- 最小化重绘和回流
  - 我们可以合并多次对DOM和样式的修改，然后一次性处理。比如把修改样式属性，变成修改class
- 批量修改DOM
  - 将元素脱离文档流
  - 对其进行多次修改
  - 将元素待会到文档流中
- 避免触发同步布局事件
- 对复杂动画效果，使用绝对定位让其脱离文档流
- CSS3硬件加速
  - transform opacity filters 这些CSS3的属性不会引起回流重绘，用的太多会占用内存。

### 浮动流

#### 浮动会造成什么影响

> 其实我个人理解，浮动造成的最核心的问题就是破坏了文档流，那么问题来了，`float`破坏了文档流
>
> 为什么还要设计这个`api`，我查了一些资料最后才知道，这是因为当初设计`float`的目的时为了能实现
>
> 文字能够环绕图片的排序功能，也就是我们有时会纳闷的一点，设置浮动后，还是会挤占容器中的文本内容

- 脱离标准流
- 高度塌陷

#### 清除浮动的影响

- 触发`BFC`

  - 在父级元素上添加一个值为auto的overflow属性，父元素的高度立即被撑起

- 利用clear样式 - 1

  - 给需要清除浮动的元素加一个clear: both;

- 利用clear样式 - 2

  - 父元素结束标签之前插入清除浮动的块级元素

- 利用伪元素（`clearfix`）

  - ```
    // 给父元素添加一个:after伪元素
    .clearfix:after {
        content: '.';
        height: 0;
        display: block;
        clear: both;
    }
    ```

### 定位流

#### position的属性

- static，默认值，不脱离文档流，位置设置为static的元素，它始终处于文档流给予的位置。
- fixed，固定定位，脱离文档流，可定位于相对浏览器窗口的指定坐标。
- absolute，绝对定位，脱离文档流，相对于该元素最近的已定位的祖先元素进行定位，祖先元素没定位，就是参照body。
- relative，相对定位，不脱离文档流，相对于该元素在文档中的初始位置进行定位。

### 文档流

> 简单说就是元素按照其在HTML的位置顺序决定排布的过程，HTML布局机制就是用文档流模型的，即块元素独占一行，内联元素不独占。
>
> 一般使用margin是用来隔开元素与元素的间距；padding是用来隔开元素与内容的间隔。margin用于布局分开元素使元素与元素互不相干；padding用于元素与内容之间的间隔，让内容（文字）与（包裹）元素之间有一段“距离”。
>
> 只要不是浮动流和定位流，都在文档化流里。

### 弹性流

> 布局的传统解决方案是基于盒状模型，依赖 `display` + `position` + `float` 方式来实现，灵活性较差。2009年，W3C提出了一种新的方案-Flex，Flex是Flexible Box的缩写，意为”弹性布局”。Flex可以简便、完整、响应式地实现多种页面布局。
>
> 
>
> `Flexbox` 用于不同尺寸屏幕中创建可自动扩展和收缩布局。



#### 基本概念

采用flex布局的元素，称为flex容器，他的所有子元素自定称为容器成员，称为项目。

容器默认存在两根轴，水平的主轴和垂直的交叉轴。默认沿主轴排列，flex属性分为两部分，一部分作用于容器称容器属性，一部分作用于项目称项目属性。

#### flex容器属性

```css
// 定义一个flex 容器，根据设值的不同可以是块状容器或内联容器，这使得子元素拥有了一个flex上下文
.box {
  display: flex; /* 或者 inline-flex */
}

// 属性决定主轴的方向（即项目的排列方向）
.box {
   flex-direction: row | row-reverse | column | column-reverse;
}
// row 表示从左向右排列
// row-reverse 表示从右向左排列
// column 表示从上向下排列
// column-reverse 表示从下向上排列

// 缺省情况下，Flex项目都排在一条线（又称"轴线"）上, 可以通过flex-wrap属性的设置，让Flex项目换行排列。 
.box {
    flex-wrap: nowrap | wrap | wrap-reverse;
}
// nowrap(缺省)：所有Flex项目单行排列
// wrap：所有Flex项目多行排列，按从上到下的顺序
// wrap-reverse：所有Flex项目多行排列，按从下到上的顺序

// 定义了项目在主轴上的对齐方式
.box  {
    justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}

// flex-start(缺省)：从启点线开始顺序排列
// flex-end：相对终点线顺序排列
// center：居中排列
// space-between：项目均匀分布，第一项在启点线，最后一项在终点线
// space-around：项目均匀分布，每一个项目两侧有相同的留白空间，相邻项目之间的距离是两个项目之间留白的和
// space-evenly：项目均匀分布，所有项目之间及项目与边框之间距离相等

// 定义项目在交叉轴上的对齐方式
.box {
  align-items: stretch | flex-start | flex-end | center | baseline;
}

// stretch(缺省)：交叉轴方向拉伸显示
// flex-start：项目按交叉轴起点线对齐
// flex-end：项目按交叉轴终点线对齐
// center：交叉轴方向项目中间对齐
// baseline：交叉轴方向按第一行文字基线对齐
```

#### flex项目属性

```css
// flex属性是flex-grow, flex-shrink 和flex-basis的简写，主要用来等分剩余空间
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
// 定义项目自身的对齐方式，如果不设置就继承父元素的对齐方式
.item {
  align-self: auto | flex-start | flex-end | center | baseline | stretch;
}
```

### `常见布局方法`

#### `一栏布局`

常见的单列布局分两种：

- header， content和footer等宽的单列布局
  - header，content，footer同一设置width： 1000px；
  - 然后设置margin： auto;
- header与footer等宽，content略窄的单列布局
  - header,footer内容宽度不设置，块级元素充满整个屏幕
  - 但header、content和footer的内容区设置同一个width，并通过margin: auto;

#### `两列自适应布局`

> 两列自适应布局是指一列由内容撑开，另一列撑满剩余宽度的布局方式

- float+ overflow: hidden;

  - 如果是普通的两列布局，浮动+普通元素的margin便可以实现，但如果是自适应的两列布局，利用float+overflow：hidden了便可实现。

  - ```css
    .parent {
      overflow: hidden;
    }
    .left {
      float: left;
      margin-right: 20px;
    }
    .right {
      overflow: hidden;
    }
    ```

    

- flex布局

  - ```css
    .parent {
      display:flex;
    }  
    .right {
      margin-left:20px; 
      flex:1;
    }
    ```

#### `左边固定右边自适应`

- float方法
  - 左边 width：200px; float：left; 右边width：100%； padding-left: 200px；
- position方法
  - 父级相对定位，左边相对定位，width：200px; 右边绝对定位right:0；top:0; width:100%;padding-left: 200px;
- flex方法
  - 父级flex，左边 flex-shrink: 0; 表示我不参与压缩，一直是200px  右边width: 100%;
- 利用BFC
  - 左侧一个float: left;  右侧一个overflow：hidden；
  - 利用BFC特性：BFC的元素不能与浮动元素重叠。由于给右侧添加了overflow：hidden；使之变成一个BFC，所以不会和左侧的浮动发生重叠。盒子默认就是撑满屏幕，所以不用手动设置宽度。

#### `圣杯布局`

> 圣杯布局和双飞翼布局作为经典的三栏式布局是面试中的常客，两种布局达到效果基本相同，都是两边两栏宽度固定，中间栏宽度自适应。

- 首先，既然是三栏布局需要三个`div`
- 给`main`设置`width: 100%;`,让他始终占满窗口，这样才有自适应的效果。
- 为了形成一行三蓝布局，给三个`div`都加上浮动`float: left;`(注意清除浮动，因为浮动会导致父元素高度塌陷)
- 接着我们要把三个方块拉到一行，这里要利用负margin的技巧
  - left要放到main的左边，设置`margin-left: 100%;`，因为`margin`的百分比是相对与父元素的，所以需要整整一行的宽度才能补偿这个margin的值，所以left就能到margin的左边。
  - 接着right到margin的右边，只需要设置`margin-left`的值为负的right的宽，比如`margin-left: -200px;` , 正好使`main`重叠right的宽度，因为设置了浮动所有`right`就会到`main`的右边了。
- 为三个元素的父元素加上`padding`属性，腾开位置。
- 由于腾开位置后会产生空白，所以使用`position: relative;`属性来移动左右两栏，这样就会遮挡了。

#### `双飞翼布局`

- 在`main`里面加一个内容层，如果知道盒子模型，就知道我们是不能直接给`main`添加`margin`属性的，因为我们已经设置了`width: 100%;`，再设置`margin`的话就会超过窗口的宽度，所以我们再创造一个内容层，将所有要显示的内容放到`main-content`中，给`main-content`设置`margin`就可以了。
- 因为不改变父元素所以只需要给`main-content`设置`margin: 0 200px 0 200px;`属性就可以了达到效果
- 然后再给`left`加上margin-left：-100%；`right`加上margin-left: -200px;