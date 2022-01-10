---
title: 小程序
date: 2019-05-28 15:27:23
tags:
categories:
---
### 小程序id
        $appid="wx332b26121cc4817b"; //自己的appid
        $secret="48dfa8205e79655c22af2c9fa5a5d90b";  //自己的secret

> app.json 全局配置，每个页面下都有一个可以覆盖全局
在app.json中page填写页面路径可以自动生成文件，也可以在侧边栏右键生成文件
> app.js  输入app 选择contruct可以列出默认的初始化代码

# 使用v-code开发需要安装插件
1. javascrip(E6) code snippts 代码片段
2. minapp 代码补全
3. wechat-snippet 更丰富的补全
4. wechat-helper 小程序助手 模拟web开发器

# 去掉log中的提示 在project.config.json中 "scopeDataCheck": false,

# 获取全局的方法 var appInstance = getApp()

# 渲染
```
wx:if="{{}}"
wx:elif="{{}}"
wx:else

hidden
wx:for={{}}  默认{{index}}代表索引 {{item}} {{item.id}}代表值
wx:for={{}} wx:for-index='key' wx:for-item='value'  wx:key='id'自定义
```
# 模板的调用
```
<template name='test1'></template>
<template is='test1' data="{{...obj}}">调用和数据传递 is支持运算

引入其他组件模块
<impotrt src="../tem.wxml">
<template is='test1' data="{{...obj}}">调用和数据传递 is支持运算
```

# 双向绑定
```
设置值
this.setData({
  myValue: 'leaf'
})
<input model:value="{{value}}" />

<image bindtap="bindViewTap" bindinput="dsfsd"></image>
```

# 样式
iPhone6 375px以这个为基准
759rpx全部的宽度
@import '/..'引入其他的样式

# 组件传值
父组件调用子组件
利用this.selectComponent('.class')可以获取整个子组件
利用父组件中bind:方法='ds',绑定一个方法
子组件中利用this.triggerEvent('父组件中的方法','数据')

# 定义样式变量
在app.wxss 中
page{
  --color:red;
}

在index.wxss中调用
view{
  color:var(--color);
}
> *样式中不能使用,只能如下使用
page,view,text,swiper,swiper-item,imges,navigator{
  margin:0,
  padding:0,
  box-sizing:border-box
}

# 微信小程序中this是有一定的局限性的所以最好在开始的时候后就用
调用其他页面的方法需要在导出页面进行方法导出，可以参考request封装
利用getApp()可以调用app.json中的数据和方法
  ```
  var that=this;

  ```
# 使用vant消息提示引入报错
https://www.yzlfxy.com/jiaocheng/JavaScript/375127.html
import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

```
 <template is="day-tab" data="{{item,index:index,currentTarget:currentTarget}}" wx:key="index"></template>

toggle(type) {
 this.setData({
 [type]: !this.data[type],
 });
},
```