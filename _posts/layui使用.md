---
title: layui使用
date: 2019-05-28 14:48:56
tags: layui
categories: 代码
---

# 类的使用

# 方法的使用
```
html中识别的标签

属性名	可选值	说明
lay-filter	任意字符	事件过滤器（公用属性），主要用于事件的精确匹配，跟选择器是比较类似的。
lay-allowClose	true	针对于Tab容器，是否允许选项卡关闭。默认不允许，即不用设置该属性
lay-separator	任意分隔符	针对于面包屑容器
<div class="layui-tab" lay-filter="demo">
element.tabAdd('demo', {
  title: '选项卡的标题'
  ,content: '选项卡的内容' //支持传入html
  ,id: '选项卡标题的lay-id属性值'
});

使用方法时要先加载
layui.use('element', function(){
  var element = layui.element;
});
基础方法
element.tabAdd(filter, options);
element.tabDelete(filter, layid);
element.tabChange(filter, layid);
element.tab(options);
element.progress(filter, percent);

更新渲染
element.render(type, filter);
type：tab,nav,breadcrumb,progress,collapse
filter，为元素的 lay-filter="" 的值,你可以借助该参数，完成指定元素的局部更新。

监听
element.on('event(过滤器值)', callback);
event:
tab  监听Tab选项卡切换事件
tabDelete  Tab选项卡被删除时触发
nav  当点击导航父级菜单和二级菜单时触发
collapse  当折叠面板点击展开或收缩时触发

element.on('tab(filter)', function(data){
  console.log(this); //当前Tab标题所在的原始DOM元素
  console.log(data.index); //得到当前Tab的所在下标
  console.log(data.elem); //得到当前的Tab大容器
});
```

# 组件使用
> 导航：layui-nav layui-nav-tree layui-nav-side  要逐渐添加
        layui-nav-tree:设置垂直导航
        layui-nav-item:设置单个导航项
        layui-nav-child：设置一级导航的二，级导航菜单
        layui-this来指向当前页面分类。
属性： lay-shrink="all"（控制展开）     lay-unselect=”“（点击指定导航菜单时，不会出现选中效果）
元素：layui-nav-more(下拉三角)

> 选项卡：layui-tab  layui-tab-title（下级类名）layui-tab-content（内容页面） layui-tab-item（内容下级）
风格：ayui-tab-brief
默认选中：layui-this  layui-show（内容选中）
带删除的Tab  lay-allowClose="true"
属性 lay-id="xxx" 来作为唯一的匹配索引

> 数据表格
表格中冲后台返回的数据必须是有一点的规范的
```
{
  "code": 0,    //前端识别成功的标记
  "msg": "",
  "count": 1000,   //用于分页时候的统计，必须要有这个数据前台才会处理分页
  "data": [{}, {}]  //返回后台的数据
} 
```
表格插入进度条时必须加入
done: function () {
  element.render();
}

```
可以直接赋值到页面
<table class="layui-table" lay-data={$product} lay-filter="test3">

请求获取数据
table.render({
    elem: '#demo',//绑定元素
    height: 312,
    url: 'order/getorder',//接口
    where:{limit:4}, //上传数据
    page: true,//是否分页
    method: 'post',//请求类型
});
```

< 监听工具栏
obj.del(); //删除对应行（tr）的DOM结构，并更新缓存


< 给 layui upload 带每个文件的进度条、增删以及 Java 后台源码
https://fly.layui.com/jie/20582/
```
// 需要填写你的 Access Key 和 Secret Key
  $accessKey = 'C2qYOg1kIGqgxv8hbiZJii73Fv0JeCx-HhWKddY_';
  $secretKey = 'tFbW1T4bNzSxDn-RC5VkKc3YS-I1QAUgl8kXhM24';
  $bucket = "yesfurniture";
  $auth = new Auth($accessKey, $secretKey);
  $filePath = $_FILES['file']['tmp_name'];

  $expires = 3600;
  $returnBody = '{"code":"0","msg":"success","data":{"src": "http://image.4vsy.com/$(key)","title": "$(x:name)"}}';//此处为设置json返回格式
  $policy = array(
      'returnBody' => $returnBody
  );
  $upToken = $auth->uploadToken($bucket, null, $expires, $policy, true);
  
  //指定 config
  // $uploadMgr = new UploadManager($config);
  $uploadMgr = new UploadManager();
  
  $key = 'hehe1';
  list($ret, $err) = $uploadMgr->putFile($upToken, $key, $filePath);
  // echo "\n====> putFile result: \n";
  if ($err !== null) {
      var_dump($err);
  } else {
      return $ret;
  }
```


```
 layui.data('cate', {
        key: 'data',
        value: [
            {date: 'id', id: 1, content:'00000'}
            ,{date: 'id', id: 2, content:'11111'}
            ,{date: 'id', id: 3, content:'22222'}
            ,{date: 'id', id: 4, content:'33333'}
            ]
    });
    
    //追加数据
    var cates = layui.data('cate').data;
    cates.push({date: 'id', id: 5, content:'4444444'});
    
    //移除数据
    cates.splice(2,1);
    
    //更新操作
    layui.data('cate', {
        key: 'data',
        value: cates
    });
    
    console.info(layui.data('cate'));
    ```
    
> 监听事件

监听checkbox复选
form.on('checkbox(filter)', function(data){});
监听select选择
form.on('select(filter)', function(data){}); 
监听switch开关
form.on('switch(filter)', function(data){});  
监听radio单选
form.on('radio(filter)', function(data){});  
监听submit提交
form.on('submit(*)', function(data){
  return false; //阻止表单跳转。如果需要表单跳转，去掉这段即可。不然表单会自动刷新
});
表单初始赋值
form.val("formTest", {
  "username": "贤心",
})
监听选项卡切换
element.on('tab(filter)', function(data){});
监听选项卡删除
element.on('tabDelete(filter)', function(data){});
监听导航菜单的点击
element.on('nav(filter)', function(elem){});
监听折叠面板
element.on('collapse(filter)', function(data){});
动态操作进度条
element.progress('demo', '50%');

> layui树形表格treeTable

> 表格的使用
1.使用表格元素点击是没有效果的，必须在表格done之后写入代码才会生效。样式也是
2.tool和toolbar监听点击可以获取点击的表格数据或者所有数据
3.JSON.stringify(table.cache)获取所有表单数据

可用插件
orgCharts 组织结构展示
ckplayer 视频播放组件
sliderVerify 滑块验证 

阻止冒泡
layui.stope(event);

阻止多次点击
.unbind("click").on('click', function () {


https://www.cnblogs.com/bigod/p/10871148.html
所以解决表单reload有缓存的问题:
在reload的配置内,将参数重新赋值. 比方说 
url : ' '
where:{ status : 0 }
或者 将条件参数删除
 done:function () {
　　 console.info(this);
　　 delete this.where;
　　 //在done回调里面,此表格对应的数据及配置结构
 }
但是必须要重载2次
        table.reload('progress', {
          done: function () {
            element.render();
            delete this.where;
            table.reload('progress', {
              url: '/yes/order_product/progresssearchlst',
              where: data,
              done: function () {
                element.render();
              }
            });
          }
        });


 输入框内输入回车 /r;
 https://www.cnblogs.com/minigrasshopper/p/8086059.html


  //监听单元格编辑
	 table.on('edit(articleList)', function(obj){
		var old=$(this).prev().text();//旧值
		$(this).val(old);//重新掰回来
	})

  obj.update({num: old});