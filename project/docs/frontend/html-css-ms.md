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

### 选择器优先级

- `!important`
- 内联样式（1000）
- ID选择器（0100）
- 类选择器/属性选择器/伪类选择器（0010）
- 元素选择器/伪元素选择器（0001）
- 关系选择器/通配符选择器（0000）

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

https://juejin.cn/post/6844903516897542158