## HTTP

### http常见的状态码

- http常见的状态码有哪些？
  - 状态码分类
    - 1xx 服务器收到请求，没有返回
    - 2xx请求成功
      - 200 请求成功
    - 3xx重定向
      - 301永久重定向 （配合location，浏览器自动处理）第二次返回新地址
      - 302临时重定向 （配合location，浏览器自动处理）第二次返回老地址
      - 304资源未被修改 （服务端资源在本地还有效）
    - 4xx客户端错误
      - 404资源未找到
      - 403没有权限
    - 5xx服务端错误
      - 500服务器错误
      - 504网关超时，服务器内部在访问其他服务的时候，可能造成了超时
- http创建的header有哪些？
- 描述下http缓存机制？
- 设计一个restful API



### http methods

- get 获取数据
- post 新建数据
- patch/put 更新数据
- delete 删除数据

Restful API

- 把每个url当作一个唯一的资源
- 尽量不用url参数
- 用method表示操作类型
- 传统的API设计：/api/list?pageindex=2

#### http headerts

- Request Headers

  - Accept 浏览器可接收的数据格式
  - Accept -Encoding 浏览器可接受的压缩算法，如gzip
  - Accept-Languange 浏览器可接收的语言，如zh-CN
  - Connection: keep-alive 一次TCP连接重复使用
  - cookie
  - Host: 请求域名
  - User-Agent（UA） 浏览器信息
  - content-type 发送数据的格式，如application/json post请求 get请求没有

  

- Response Headers

  - content-type 返回数据的格式，如application/json 
  - content-length 返回数据的大小，多少字节
  - content-Encoding 返回数据的压缩算法，如gzip
  - set-Cookie 修改cookie