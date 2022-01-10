---
title: Hexo使用indigo主题遇到到坑
date: 2019-05-08 19:25:31
tags: Hexo
categories : 代码知识
---
>怎么说呢，这是我的第一个坚持做到底的博客网站，在Hexo的主题里面也是翻了遍才找到这个UI效果比较好的主题,希望可以一直陪伴我走下去。

+ **Github ：**https://github.com/yscoder/hexo-theme-indigo
+ **网站：**https://www.imys.net/
+ **文档：**https://github.com/yscoder/hexo-theme-indigo/wiki
+ **指导资料：**https://www.jianshu.com/p/a1778c515a33
+ **hexo**：https://hexo.io/zh-cn/

# 接下来就让我一个个坑踩一下吧
**1.先从Hexo开始**
    ```
        sudo -s //获得超级管理员权限
        npm install -g hexo-cli //在电脑上面安装hexo
        hexo init ”MFHDIARY“ //创建项目
        cd MFHDIARY  /进入项目
        npm install  //下载依赖
        hexo g  //生成静态文件。
        hexo s  //本地浏览 hexo server -p 5000
        npm install hexo-deployer-git --save  //下载部署依赖，在配置文件里面补充配置
        hexo d  //部署文件 上传到指定的空间
        hexo n "postName" //新建文章，会保持到source/_posts文件中   相当于hexo new post "pageName"
        hexo new page "pageName"  //新建自定义页面
        hexo clean //清除缓存
    ```
>创建hexo项目之前一定要先获取超级管理员权限。

>启动项目的时候如果发现启动不了，很大几率是端口被占用了，换其他的端口试试。修改主题文件，浏览器会自动更新，但是修改了hexo配置文件就需要重新启动服务器，如果还没有改变，请清除缓存，重新生成静态文件。

>在hexo配置文件中查找`deploy`,填写部署`type`，部署`repository`,参考连接：[hexo文档](https://hexo.io/zh-cn/docs/deployment)，上传到github中时要在hexo配置`url: /` `root: /MFHDIARY`(MFHDIARY是仓库的名字)，如果在github中直接配置域名，那么要在hexo配置`url: https://yessofa.cn/` `root: /`，这样页面渲染出来是的路径才不会出错，还要在域名解析记录值`CNAME`，记录值	
`githubmfh.github.io`，主机记录值`@`。部署到服务器，安装依赖`npm install hexo-deployer-sftp --save`,在配置文件里面配置远程服务器
deploy:
  type: sftp
  host: 服务器ip
  user: root
  pass: Mfh19960724
  remotePath: /www/wwwroot/MFHDIARY
  port: 22

>hexo有标签和目录2中分类，所以需要在文章页面添加`tags`和`categories`来识别文章的类别，可以先在`post.md`中预先添加这2个分类。

>主题里面的布局都是用`ejs`写的,所以语法按照`ejs`的来，里面的变量和方法函数都可以在这里参考：[Hexo变量](https://hexo.io/zh-cn/docs/variables)、[Hexo函数](https://hexo.io/zh-cn/docs/helpers)

>书写Hexo文章使用MarkDown语法，在本微博中也有记载，也可以用简书直接编写MD，但是在设置中要先切换到MarkDown编辑器，然后关闭重启就可以书写了，也可以在hexo的插件中找到[hexo-admin](https://github.com/jaredly/hexo-admin)安装，也可以直接在页面上书写MD但是呀在本地进行。图片空间：[一键图床](http://mpic.lzhaofu.cn/)

>Hexo目前还有很多人使用[NEXT主题](http://theme-next.iissnan.com/)，这个是一个文档很全的主题，只是个人不喜欢UI界面，能够发挥的空间很大，推荐使用。

**2.开始使用indigo主题**
```
cd cd MFHDIARY //进入项目
git clone https://github.com/yscoder/hexo-theme-indigo.git //下载主题，文档上主题连接是错误的
npm install hexo-renderer-less --save //主题默认使用 less 作为 css 预处理工具。
npm install hexo-generator-json-content --save //用于生成静态站点数据，用作站内搜索的数据源。
npm install hexo-helper-qrcode --save  //用于生成微信分享二维码。
hexo new page tags //开启标签页  
    修改 hexo/source/tags/index.md 的元数据
    layout: tags
    comments: false
    ---
hexo new page categories //开启分类页
    修改 hexo/source/categories/index.md 的元数据
    layout: categories
    comments: false
    ---
修改Hexo配置主题:
theme: indigo
language: zh-CN //文档中没有提到
修改主题配置：

# 文章摘要渲染方式: 为 true 时将渲染为 html，否则为文本
excerpt_render: false
# 截断长度
excerpt_length: 200
# 文字正文页链接文字
excerpt_link: 阅读全文...
share: true
search: true //是否开启搜索
hideMenu: true //文章页面左侧菜单是否隐藏
toc:     //文章页面左侧面包屑导航
  list_number: false  //决定导航使用的标签， true 为 ol， false 为 ul
cdn: false  //这个一定要关掉，不然一直使用他远程的css
```
>其他的设置可以参考[indigo配置](https://github.com/yscoder/hexo-theme-indigo/wiki/%E9%85%8D%E7%BD%AE)

>修改文章底部内容和样式
themes/indigo/layout/_partial/post/copyright.ejs ,修改作者头像连接为<%- config.root %>
删除主题配置postMessage里面的配置，

>修改公共底内容和样式
    themes/indigo/layout/_partial/footer.ejs 中注释掉class="top"，之后底部会上来80px，调整themes/indigo/source/css/_partial/layout.less ，.footer .bottom {margin-top: 80px;}