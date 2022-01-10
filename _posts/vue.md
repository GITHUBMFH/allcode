---
title: vue
date: 2019-05-28 15:27:23
tags:
categories:
---
sudo su
sudo －s

# 1.安装
> npm init -y 初始化 npm
-y是为了不让他提很多问题让我们回复。
初始化后在当前目录生成一个package.json

2.删除
> npm uninstall 包名称，删除对应名称依赖
npm uninstall vue 删除vue
对应插件会在node_modules内移除
package.json的dependencies内对应的依赖也会移除。

3.更新软件
>当前版本：npm -v
升级：npm install npm@latest -g
npm install -g npm
 npm -g i cnpm
npm update 包名称更新
npm update jquery表示更新jquery
如果要更新成旧的版本
可以指定版本号：
npm update jquery@3.0.0

4.安装软件
>npm i 包名称 **安装对应包名称的插件
npm i jquery 表示安装jQuery
i就是install的缩写
--save-dev 会把安装的包和版本号记录到 package.json 中的 devDependencies 对象中，
--save， 会记录到 dependencies 对象中，
它们的区别，我们可以先简单的理解为打包工具和测试工具用到的包使用 --save-dev 存到 devDependencies， 比如 eslint、webpack。
浏览器中执行的 js 用到的包存到 dependencies， 比如 jQuery 等.

npm i webpack -D  ===   npm install webpack --save-dev 线上不需要的东西

npm i webpack -S  === npm install webapck --save 线上需要的东西


# vue 命令
    com+con+p，格式化
    npm run dev 如果端口被占用，在config/index.js中修改
    查看vue版本，vue -V 
    # 安装vue
    $ npm install vue@2.1.6
    # 全局安装 vue-cli
    $ npm install --global vue-cli
    # 创建一个基于 webpack 模板的新项目my-project
    $ vue init webpack my-project
    # 进入项目目录
    $ cd my-project
    # 安装依赖，走你
    $ npm install
    # 运行项目
    $ npm run dev

    vue init webpack-simple custom-global-component


> 打包之后路径不对  https://www.cnblogs.com/diantao/p/7776523.html
1、js，css路径不对
解决办法：打开config/index.js，将其中的assetsPublicPath值改为’./’
2.css中的图片不对
打开“build/utils.js”，增加一行代码即可
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
        publicPath:'../../'
      })

# vue 中使用less
https://www.cnblogs.com/xiaoyaoxingchen/p/10404823.html

# vue 使用jQuery
https://www.jianshu.com/p/8118f7f5298e


# vue中设置全局性的url路径
export default {  
  install(Vue,options)  
  {  
    Vue.prototype.baseUrl = "比如ip地址" ;
    Vue.prototype.loginUrl=Vue.prototype.baseUrl+"接口";
  }
}  
比如我要用axios请求这个地址
只需要在那个页面写上this.loginUrl即可访问

> 在main.js中添加一个变量到Vue.prototype
Vue.prototype.$appName = 'My App';
this.$appName = "test1"

dve.js,和pro.js中的变量
process.env.NODE_ENV

>vue 配置后台接口方式
https://www.jianshu.com/p/a26666c9058b
或者使用这个
https://blog.csdn.net/weixin_46096120/article/details/104767633

>>ajxa 封装  https://www.cnblogs.com/wangwBlogs/p/10471826.html

>跨域问题 https://www.cnblogs.com/qq735675958/p/8566305.html
线下跨域解决方案
process.env.NODE_ENV === 'production'  生产环境

1.打开config/index.js,在proxyTable中添写如下代码：
如果出现无法使用的问题，参考https://blog.csdn.net/qq_27295403/article/details/88531783
最好改下端口
proxyTable: {
    '/api': {
    target: 'http://thinkphp5-1:8888', // 接口的域名
    // secure: false,  // 如果是https接口，需要配置这个参数
    changeOrigin: true, // 如果接口跨域，需要进行这个参数配置
    pathRewrite: {
        '^/api': '/api'
    }
    }
},

2、使用axios请求数据时直接使用“/api”：
 
getData () {
 axios.get('/api/bj11x5.json', function (res) {
   console.log(res)
 })
通过这中方法去解决跨域，打包部署时还按这种方法会出问题。解决方法如下：
 
let serverUrl = '/api/'  //本地调试时
// let serverUrl = 'http://f.apiplus.cn/'  //打包部署上线时
export default {
  dataUrl: serverUrl + 'bj11x5.json'
}
调试时定义一个serverUrl来替换我们的“/api”，最后打包时，只需要将“http://www.xxx.com”替换这个“/api”就可以了。

> 线上跨域解决方案
不推荐
配置服务区apache https://blog.csdn.net/weixin_34393428/article/details/91422917
一、后台更改header
header('Access-Control-Allow-Origin:*');//允许所有来源访问
header('Access-Control-Allow-Method:POST,GET');//允许访问的方式 　　

# VUE注释问题
https://www.jianshu.com/p/c1ee73598a72

# vue登录  
https://www.cnblogs.com/web-record/p/9876916.html
https://blog.csdn.net/qq_41564928/article/details/92842221

后端代码
php 获取token
 $this->token = $this->request->header('token');
https://blog.csdn.net/qq_41445224/article/details/89297393?depth_1-utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1&utm_source=distribute.pc_relevant.none-task-blog-BlogCommendFromBaidu-1


# vue，组件间值得传递 
https://www.cnblogs.com/LoveAndPeace/p/7273648.html

# vue，路由间值得传递 
https://www.jianshu.com/p/d8080d1d9ce9
父传子：在子中设置props的值作为接受，在父中利用:bind父值=子中设置props的值,就可以在子中获得this.子中设置props;利用的是值得绑定
子传父：在子中设置利用this.$emit('子方法名称',要传的值)，在父中利用 @:子方法名称 = 父方法名称;利用的是值得绑定

# vue路由发生变化
https://www.cnblogs.com/crazycode2/p/8727410.html

# vue 路由配合后端
https://www.cnblogs.com/cap-rq/p/10148957.html
https://blog.csdn.net/lwpoor123/article/details/85248571
# vue 路由
https://blog.csdn.net/wulala_hei/article/details/80488727

```
<router-link to="/">[text]</router-link>
被选中的router-link将自动添加一个class属性值.router-link-active。
<transition>
  <keep-alive>
    <router-view></router-view>
  </keep-alive>
</transition>
keep-alive可以缓存数据

const router = new VueRouter({
  routes: [
    {
      path: '/user/:id', component: User,
      children: [
        // 当 /user/:id 匹配成功，
        // UserHome 会被渲染在 User 的 <router-view> 中
        { path: '', component: UserHome },

        // ...其他子路由
      ]
    }
  ]
})
```

> 404配置
const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '*', component: NotFoundComponent }
  ]
})

> 命名视图
```
<router-view class="view one"></router-view>
<router-view class="view two" name="a"></router-view>
<router-view class="view three" name="b"></router-view>
const router = new VueRouter({
  routes: [
    {
      path: '/',
      components: {
        default: Foo,
        a: Bar,
        b: Baz
      }
    }
  ]
})
```


> 获取路由中的值
{{ $route.params.newsId}}
获取路由的名称
{{ $route.name}}

> 监听路由
watch: {
'$route' (to, from) {
    // 对路由变化作出响应...
}
beforeRouteUpdate (to, from, next) {
// react to route changes...
// don't forget to call next()
}

> 重定向
const routes = [
  { path: '/', redirect: '/goods'}
]
重定向的目标也可以是一个命名的路由。
const routes = [
  { path: '/', redirect: { name: 'goods' }}
]
{
  path:'/',
  redirect:'/goods/:newsId(\\d+)/:userName'
}

{
    path: '/hi',
    component: Hi,
    alias:'/dxl'
 }
 <router-link to="/dxl">jspang</router-link>
redirect：仔细观察URL，redirect是直接改变了url的值，把url变成了真实的path路径。
alias：URL路径没有别改变，这种情况更友好，让用户知道自己访问的路径，只是改变了<router-view>中的内容。
alias在path为'/'中，是不起作用的。

> vue js中路由跳转
router.push({ name: 'user', params: { userId }}) // -> /user/123
router.push({ path: `/user/${userId}` }) // -> /user/123
// 这里的 params 不生效
router.push({ path: '/user', params: { userId }}) // -> /user
router.replace( )
.router.go(n)
这个方法的参数是一个整数，意思是在 history 记录中向前或者后退多少步，类似 window.history.go(n)。



> History 模式
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})

# 路由滚动行为
const router = new VueRouter({
  routes: [...],
  scrollBehavior (to, from, savedPosition) {
    // return 期望滚动到哪个的位置
  }
})

# vue 路由的懒加载
https://www.cnblogs.com/xiaoxiaoxun/p/11001884.html
```
路由
const HelloWorld = ()=>import("@/components/HelloWorld")
export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component:HelloWorld
    }
  ]
}

组件
  <div class="hello">
  <One-com></One-com>
  1111
  </div>
</template>

<script>
const One = ()=>import("./one");
export default {
  components:{
    "One-com":One
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>
```


# 引入方式
import {loginApi,editAdminListApi} from "../../service/api";
import 'element-ui/lib/theme-chalk/index.css';
import HelloWorld from '@/components/HelloWorld'
```
<style lang='less' scoped>
@import "./"
</style>
```

