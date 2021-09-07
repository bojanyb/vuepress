### React17

#### React组件 - 函数式组件

React组件 - 类组件

#### JSX编程思维

#### CSS module

- 文件位置

  - CSS文件与component文件放在统一目录下

- 命名规范

  - .module.css

- 模组化

  - 每个jsx或者tsx文件被视为一个独立存在的原件
  - 原件包含的所有内容也同样都应该独立存在的

- TS的类型声明

  - .d.ts
  - 只包含类型声明，不包含逻辑

- CSS in JS (JSS)

  - ```js
    import styles from '../Robot.module.css';
     <div className={styles.cardContainer}>
     </div>
    ```

#### 加载图片和多媒体资源

#### State与Props

- props是组件对外的接口，而state是组件对内的接口
- props用于组件间数据传递，而state用于组件内部的数据传递

state的正确打开方式

- state是私有的，可以认为state是组件的私有属性
- 用setState()修改state
- 直接修改state，组件不会触发render函数，页面不会渲染
- 正确的修改方式是使用setState，用对象赋值的方式
- 构造函数construcotr是唯一可以初始化state的地方

state的更新是异步的

- 调用setState后，state不会立刻改变，而是异步操作
- 不要依赖当前的state，计算下个state

props

- 本质上，props就是传入函数的参数，是传入组件内部的数据。更准确地说，是从父组件传递向子组件的数据
- 所有的props都是只读的，对象一旦创建就不可改变，只能通过销毁、重建来改变数据。
- 通过判断内存地址是否一致，来确认对象是否经过修改
- 尽量用函数式编程

#### 网络资源请求

- 资源来源于网络请求，返回的数据类型不受控制
- 前端强行定义API数据类型，违反前后端分离的原则
- 不能为了使用Type而放弃JavaScript的灵活性



#### react hook 函数组件

