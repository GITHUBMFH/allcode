---
title: Thinkcmf制作网站遇到的坑
date: 2019-05-10 14:25:04
tags: Thinkcmf
categories: 代码知识
---

>为了研究Thinkcmf也真的是费了很多功夫，看了几遍文档，但是还是遇到了不少坑

* Tinkcmfh网站：https://www.thinkcmf.com/
* 阿里云服务器：https://www.aliyun.com/
* 服务器公ip :39.100.86.220

# 购买阿里云服务器及备案
> 服务器密码我设置为：Mfh19960724
> 宝塔用户名:yesmfh,宝塔密码：mfh19960724
> 阿里云重新配置系统镜像的时候需要关闭服务器才可以重新配置，

# Mac电脑的命令行的使用
* sudo-s,获取超级管理员权限 sudo su
* cd /   进入根目录
* ls  列出目录
* cd .. 返回上一级目录
* pwd 查看用户的当前目录
* ctrl-c     结束进程
* command +k 清空终端
* exit 退出连接
* ssh root@服务器ip，同意yes之后输入密码远程连接liunx服务器
* 用`Yummy ftp`远程连接服务器的时候，必须是`sftp`协议，服务器安全组必须打开同样的端口，建议直接连接宝塔的ftp，在`列表`的最低端可以开启同步浏览，2端的文件可以同步。

# 宝塔服务器
* 使用宝塔镜像的时候服务器必须打开安全组入口的`8888`端口，授权对象是`0.0.0.0/0`，打开`21`号端口（数据库需要）
* 宝塔取消重定向的时候一定要记得清缓存才会生效，另外宝塔重定向（测试版）中要删除重定向。
* 要在域名解析的时候@和www都要指向到服务器ip，同时在宝塔网站配置中除了顶级域名，www的域名也要配置。
* 安装宝塔环境，`Apache.2.4`,`Mysql.5.5`,`Pure-Ftpd.1.0.47`,`php 5.6`,`phpMadmin.4.4`。
* 宝塔获取默认登录密码是，需要远程连接服务器执行`bt default`命令
* 如果不小心用域名绑定了宝塔，可以用远程服务器执行`rm -f /www/server/panel/data/domain.conf`
* 重新设置密码`cd /www/server/panel && python tools.py panel testpasswd`
* 宝塔登录：http://39.100.86.220:8888/

# 常用的php函数
* preg_match  函数用于执行一个正则表达式匹配 preg_match("/^\/upload\//", $imgSrc)
* strtolower  把所有字符转换为小写
* array_merge 把两个数组合并为一个数组
* strpos      查找 "php" 在字符串中第一次出现的位置 strpos("I love php, I love php too!","php");
* explode     把字符串打散为数组 explode(';', $tag);
* in_array    函数搜索数组中是否存在指定的值
* preg_replace执行一个正则表达式的搜索和替换
* @(eval('$condition=(' . $command . ');'));
* str_replace
* preg_match  是否通过正则表达式验证
* array_filter 去除数组空值
* unset销毁单个变量
* array_unique($client) 一维数组去除重复
* isset();
array_map() 函数将用户自定义函数作用到数组中的每个值上，并返回用户自定义函数作用后的带有新值的数组。
回调函数接受的参数数目应该和传递给 array_map() 函数的数组数目一致。


# 上传Thinkcmf项目
1.在宝塔->网站->添加网站，建立ftp和mysql，设置网站目录
2.修改项目中的数据库配置文件`database.php`，服务器地址直接配置成`localhost`,其他的配置资料在宝塔中可以找到。
3.如果直接把项目部署到服务器上面去，会出现进后台跳首页的情况。这里纠结好久，因为在`/application/Admin/Controller/PublicController.class.php`设置了非法登录直接跳转首页，可以参考:http://www.nynds.com/article/322,但是我还是选择把一个刚下载的Thinkcmf给扔到服务器上面。
>我这里设置的后台密码是：yesmfh，用户名是：yesmfh

# 解析Thinkcmf
* 在`simplewind/cmf/controller/BaseController.php`中判断网站是否安装，没有安装的话会直接跳到安装的控制器`app/install/controller/IndexController.php`，在这里安装好之后会直接跳转到网站首页，用的是`simplewind/cmf/common.php`中的`cmf_is_installed()`方法，在`app/admin/controller/PublicController.php`中也有判断是否非法登录的seesion（‘__LOGIN_BY_CMF_ADMIN_PW__’）值，要想直接跳过系统的判断必须都注释掉。

* Thinkcmf登录流程，`simplewind/cmf/controller/AdminBaseController.php`,监听是否登录或者提交登录信息,`app/admin/controller/PublicController.php`,是登录控制器，`doLogin（）`接受表单提交过来的登录数据，用`Db::name('user')`连接数据表进行查询，

* `strpos($passwordInDb, "###") === 0`，如果数据库里面的密码###出现的位置是0，则返回true。

* Thinkcmf登录流程加密，系统用`simplewind/cmf/common.php` 中的` cmf_password（）`，给密码加密。加密方式为`$result = "###" . md5(md5($authCode . $pw))`;`$authCode = Config::get('database.authcode')`;`$authCode`是数据库配置中的一个参数。`Config::get`读取的是`app/config.php`中的配置.数据写入`Role_User`表中。如果忘记密码，可以在前台打印`echo cmf_password('jjjjjj')`，这是对6个j的加密，把输出的结果直接替换`CMF_User`中的`user_pass`字段。

* Thinkcmf前后端交流方式及js插件，接受表单的响应用的是`validate.js`插件，`app/install/view/step3.html`可以做为提交信息的参考，`ajax`提交用的是`ajaxForm.js`插件，也可以参考。wind.JS，用来异步加载js，css，在执行一段js的时候加载其他的js或者css。使用的是layer.js弹框。

* Thinkcmf模板中的常量，比如：`__ROOT__`，都是是通过`app/config.php`中的`view_replace_str`的变量设置，然后在`simplewind/cmf/controller/AdminBaseController.php`中设定了配置机制，如果有设置cdn就可以直接读cdn配置的值，利用`config('template.view_base', "$themePath/")替换app/config.php`中的`view_replace_str`的值。

* Thinkcmf配置文件，`public/index.php`中设置的是基本路径的常量，`app/config.php`中设置的是系统中定义的变量和配置。

* 打印session的存放路径，print_r(session_save_path())。

* 打印php中的json格式数据
```
echo json_encode($dbConfig);
halt();
dump($menus, 1, '<pre>', 0);
halt(json_encode($result,JSON_UNESCAPED_UNICODE|JSON_PRETTY_PRINT));
```
* 获取某个文件的数据，对书记进行解码转化成php变量
```
$manifest= file_get_contents($manifest);
$themeData= json_decode($manifest, true);
```
* thinkcmf中的数据库操作
```
$user->allowField(true)->save($_POST,['id' => 1]);
$groups = Db::name('RoleUser')

Db::name('auth_rule')->where(['name' => $name])->count();
        $groups = Db::name('RoleUser')
            ->alias("a")
            ->join('__ROLE__ r', 'a.role_id = r.id')
            ->where(["a.user_id" => $uid, "r.status" => 1])
            ->column("role_id");

$rules = Db::name('AuthAccess')
    ->alias("a")
    ->join('__AUTH_RULE__ b ', ' a.rule_name = b.name')
    ->where('a.role_id', 'in', $groups)
    ->where('b.name', 'in', $name)
    ->select();

LEFT表示只是获取前一个表的数据,默认是全部数据都出来。
$result  = Db::name('user')->alias('a')
        ->join('__ROLE_USER__ b ','b.user_id= a.id','LEFT')
        ->join('__ROLE__ c','b.role_id=c.id')->field(['a.id','user_login','user_email','last_login_time','c.name'])
        ->select();    

$order = Db::name('wage')
->alias("a")
->join('__WORKER__ c', 'c.id = a.worker_id', 'LEFT')
->join('__WORK_ATTEND__ f', 'f.work_id = c.id and date_format(f.data,"%Y") = a.year and date_format(f.data,"%m") = a.month and f.type = 1', 'LEFT')
->join('__WORK_TYPE__ e', 'e.id = c.work_id', 'LEFT')
->join('__WAGE_BORROW__ g', 'g.wage_id = a.id', 'LEFT')
->join('__MATCH__ d', 'd.worker_id = a.worker_id and d.month = a.month and d.year = a.year', 'LEFT')
->field('a.*,c.name,sum(d.amount) as amount,e.name as work_name,e.id as work_id,sum(g.price) as borrow,sum(f.duration) as duration')
->page($page, $limit)
->group('a.id')
->order('a.id desc')
->select();
```
* thinkcmf前台连接跳转，javascript:parent调用父窗口的openIframeLayer方法进阶调用layer.js的open方法。
```
<a href="javascript:parent.openIframeLayer('{:url('Hook/plugins',['hook'=>$vo['hook']])}','钩子{$vo.name}插件管理',{});">管理插件</a>
```
* thinkcmf权限检查`cmf_get_current_admin_id()`获取用户登录时候存储的id,simplewind/cmf/common.php中的cmf_auth_check(),simplewind/cmf/lib/Auth.php中的check()检查。

* 后台添加菜单在回收站旁边的标签，通过`app/admin/controller/MenuController.php`中的`addPost()`添加到数据库，

* Thinkphp图片提交，`admin_simpleboot3/portal/admin_article/add.html中的javascript:uploadMultiImage`触发`public/static/js/admin.js`中`uploadOneImage()`单图上传，`uploadMultiImage()`多图上传，间接触发`openUploadDialog（）`，通过`artDialog.js`传入参数给`app/user/controller/AssetController.php`的`webuploader`方法引用`public/themes/admin_simpleboot3/user/webuploader.html`fetch模板文件，点击选择文件通过通过`webuploader.min.js`上传文件，点击确认通过`artDialog.js`的回调方法调用`public/themes/admin_simpleboot3/user/webuploader.html`模板中的`get_selected_files`，`get_selected_files`对图片进行处理，再通过`callback.apply(this, [this, files, extra_params])`传递参数，利用openUploadDialog回调函数插入模板中，所有的上传操作其实都是在webuploader.html中。

* Thinkcmf 设置模板view_base逻辑，simplewind/cmf/controller/AdminBaseController.php 中config('template.view_base', WEB_ROOT . "$themePath/");设置视图模板路径，cmf_get_current_admin_theme()获取当前模板，利用cookie存储

* 退出登录后，需要直接访问admin后台，设置session("__LOGIN_BY_CMF_ADMIN_PW__", 1);//设置后台登录加密码

* 在public/index.php中define('APP_PATH', CMF_ROOT . 'app/')定义默认应用目录，在app/config.php中default_module'=> 'portal'定义默认模块，在这里可以修改第一次默认打开页面

* 使用redirect（）是但是报错您重定向的次数过多，是因为出现了死循环redirect(cmf_get_root() . "/")导致的。控制登录的控制器，由于没有initialize()初始化，所以会在AdminBaseController的方法initialize()中不断循环也会报错您重定向的次数过多。

* cmf_auth_check(cmf_get_current_admin_id(), $ruleName)检查使用的权限

* Thinkcmf基本使用
```
{:cmf_get_admin_style()} /模板文件中使用php定义的公共方法/
__ROOT__: 网站根目录，不带/;
__WEB_ROOT__:网站资源根目录,不带/,如果以前版本用__ROOT__来定位网站资源,方便以后cdn切换
__TMPL__:当前模板根目录，不带/;
__STATIC__:public/static目录,不带/;
{:url('public/doLogin')} /模板中连接书写方法/
{:lang('USERNAME_OR_EMAIL')}  /调用多语言/
{:cookie('admin_username')}  /模板中调用cookie/
<php>$submenus=$menus;</php> /直接书写php/
javascript:openapp('{:url('user/AdminAsset/index')}','userAdminAssetindex','资源管理',true);/打开新的iframe/
return redirect(url("admin/Index/index"));
return $view->fetch('admin@user/add'); //public/themes/admin_simpleboot3/admin/user/login.html
return $view->fetch('user/add');  ///public/themes/admin_simpleboot3/yes/user/login.html
return $view->fetch('add');   //public/themes/admin_simpleboot3/yes/login/login.html
return $view->fetch(':add');   ///public/themes/admin_simpleboot3/yes/login.html
return $view->fetch(); //模板渲染的3种  //public/themes/admin_simpleboot3/yes/login/index.html

```
* 数据库操作
属性UNSIGNED，一般表示为不为负数
数值一般不设置排序规则，如果设置一般设置为utf8_general_ci（多语言，不区分大小写），utf8mb4_unicode_ci（多语言，不区分大小写，utf8mb4_general_ci
主键一般设置AUTO_INCREMENT（A_I）
存储引擎：一般为InonDB
数值：bigint(20)，int(10)，	tinyint(3)，bigint(20)
Numeric(10,2) 指字段是数字型,长度为10 小数为两位的
float[m,d] d是小数点后面的位数 m是数字的总位数 
double[m,d]
文本一般设置为：varchar(100)，text，longtext


* html书写
```
    $(function(){
        $(".button").click(function(){
            $.ajax({
                type: "POST",                      //请求类型
                url: path + "/delete.do",           //URL
                data: {uid: obj.attr("userid")},   //传递的参数
                dataType: "json",                 //返回的数据类型
                success: function (data) {          //data就是返回的json类型的数据

                },
                error: function (data) {

                }
            });
        })
    })

$("input").eq(0).val()
$(this).parent("ul").attr("data-id")
颜色透明：background-color: #00000075;    /* opacity: .5; */
垂直居中： margin: auto;line-height: 100px;vertical-align: middle;

left:50%;top:50%;transform:
translate(-50%,-50%);
-ms-transform:translate(50%，50%); 	/* IE 9 */
-moz-transform:translate(50%，50%); 	/* Firefox */
-webkit-transform:translate(50%，50%); /* Safari 和 Chrome */
-o-transform:translate(50%，50%); 

display: flex;设置 display 属性的值为 flex 将其定义为弹性容器
align-items: center;定义项目在交叉轴（纵轴）上如何对齐，垂直对齐居中
justify-content: center; 定义了项目在主轴上的对齐方式，水平对齐居中
```


* 验证
```
在app/admin/validate/RoleValidate.php下书写认证规则
    protected $rule = [//验证规则  https://www.kancloud.cn/manual/thinkphp5_1/354107
        'name' => 'require',
        'name'  =>  'checkName:thinkphp',
    ];
    protected $message = [//错误提示信息
        'name.require' => '角色名称不能为空',
    ];
    protected $scene = [//验证场景
        'add' => ['name'],
    ];
     // 自定义验证规则
    protected function checkName($value,$rule,$data=[])
    {
        return $rule == $value ? true : '名称错误';
    }

    添加上 // 是否批量验证
    protected $batchValidate = true;可以对所有数据验证，不会中断,在控制器中设置

    选择认证规则验证
    $result = $this->validate($data, 'role.add');role代表验证器，add代表场景
    if ($result !== true) {
        // 验证失败 输出错误信息
        $this->error($result);
    } 
```

* 返回值
return json($data);
$this->error($result);
return $this->error('删除成功');相当于msg：删除成功；
echo;
$this->request->param('id', 0, 'intval');
$this->request->param('name', '', 'trim');

* 事务操作
Db::startTrans();
Db::rollback();

* less
文件前面加：
// out: app.css, compress: true, sourceMap: false
```
移动端开发可以参考
https://github.com/imochen/hotcss	
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
var rootResize=function(){
                var baseFontSize = 100;
                var baseWidth = 640;
                var minWidth=320;
                var clientWidth = document.documentElement.clientWidth || window.innerWidth;
                var innerWidth = Math.max(Math.min(clientWidth, baseWidth), minWidth);
 
                var rem = clientWidth/(baseWidth/baseFontSize);
                if(innerWidth==640||innerWidth==320){
                    rem=innerWidth/(baseWidth/baseFontSize)
                }
 
                document.querySelector('html').style.fontSize = rem + 'px';
            };
rootResize();
window.onresize=function(){rootResize()};
```
transition: all .3s;
-webkit-transition: all .3s;

transform: translate3d(-220px,0,0);
-webkit-transform: translate3d(-220px,0,0);

left:50%;top:50%;
transform:translate(-50%,-50%);
-ms-transform:translate(50%,50%); 	/* IE 9 */
-moz-transform:translate(50%,50%); 	/* Firefox */
-webkit-transform:translate(50%,50%); /* Safari 和 Chrome */
-o-transform:translate(50%,50%); 


* 格式化快捷键 shift+option+F

* 犯错
数组不能直接赋值页面，要转换
$this->assign('product',json_encode($data));
request前不需要加$
$limit = $this->request->post('limit');

使用model
use app\admin\model\NavMenuModel;
$navMenuModel = new NavMenuModel();

* 插件调用不了
项目目录下面没有暴露钩子，需要添加hook.php
hook.php中配置了只是执行一次
simplewind/cmf/behavior/InitHookBehavior.php中控制钩子的加载，钩子加载依赖于数据库Hook::add
app/admin/controller/HookController.php，sync()更新类容，把钩子加载到数据库
一定要清除缓存，修改数据库yes_hook_plugin，yes_hook
如果实在不行就调用tp的方法
use think\facade\Hook;
// Hook::add('fetch_upload_view', "plugins\\qiniu\\qiniuPlugin");
$content = hook_one('fetch_upload_view');

模型代表连接了数据库，可以直接查询
$hookModel = new HookModel();
$hooks     = $hookModel->select();

扫描app下所有文件
$apps = cmf_scan_dir(APP_PATH . '*', GLOB_ONLYDIR
include $hookConfigFile;引入某个文件
file_exists($hookConfigFile)判断文件是否存在
basename() 函数返回路径中的文件名部分。

if函数不想结束可以用continue


* 清除缓存
  Cache::clear('admin_menus');// 删除后台菜单缓存

* json数据的添加和移除
data.parent_id = data.id;
delete data.id; 

* 改变数组中的值
https://blog.csdn.net/xiaoxiaohui520134/article/details/79903054
```
foreach($result as &$vo){
    $vo['create_time'] = date("Y-m-d H:i",strtotime($vo['create_time']));
}
```
* 时间戳
date("Y年m月d日", $vo['create_time']);
(1)打印明天此时的时间戳
strtotime(”+1 day“)


* 多维数组循环
```
    public function eachmenu($data,$privilegeData)
    {
        static $result_id=[];
        foreach($data as $key =>$vlue){
            // $result_id[]=$vlue;
            if(isset($vlue['children'])){
                $this->eachmenu($vlue['children'],$privilegeData);
                if (in_array(strtolower($vlue['rule_name']), $privilegeData)) {
                    $result_id[]=$vlue['id'];
                }
            }
        }
        return $result_id;
    }

    var result_id = [];
      function getmenuid(data) {
        $.each(data, function (index, element) {
          if (element.hasOwnProperty("children")) {
            getmenuid(element.children);
          }
          result_id.push(element.id);
        })
        return result_id;
      }
```
> 开启自动插入数据库 https://blog.csdn.net/qq_16371909/article/details/84894386
protected $autoWriteTimestamp = true;
protected $createTime = 'ctime';
protected $updateTime = 'mtime';


> 合并多维数组 https://blog.csdn.net/yeyushaqiu/article/details/81557019
```
$a = array(array("1","2"),array("3","4"));
$b = array(array("a","b"),array("c","d"));  
    
foreach($a as $key=>$vo){
    $list[] = array_merge($vo,$b[$key]);
}
```
* 使用tp关联的时候
```
    public function address() //必须要驼峰式
    {
        return $this->morphOne('AddressModel',['address_type','type_id'],'client');//第二个参数分别对应数据库的字段_type和_id，第三个是type的种类，第一个必须要把Model。
    }

    $client = ClientModel::with(['address'])->field('id')->select();
    使用：：with的时候才会出现2个表的数据

定义写入和读取的时候的字段类型
    protected $type = [
        'status'    =>  'integer',
        'score'     =>  'float',
        'birthday'  =>  'datetime',
        'info'      =>  'array',
    ];

数据完成，对数据写入、新增和更新的时候进行字段的自动完成机制，auto属性自动完成包含新增和更新操作
    protected $auto = [];
    protected $insert = ['ip','status' => 1];  
    protected $update = ['login_ip'];  
自动写入时间更新字段
protected $autoWriteTimestamp = 'datetime';    
// 定义时间戳字段名
protected $createTime = 'create_at';
protected $updateTime = 'update_at';
// 关闭自动写入update_time字段
protected $updateTime = false;
```

> jq时间计算 https://blog.csdn.net/qq_39759115/article/details/78893853
```
var date1 = new Date('2019/1/1'); //开始时间
var date2 = new Date('2019/1/10'); //结束时间
var date3 = date2.getTime() - date1.getTime();//时间戳相减
var days = Math.floor(date3 / (24 * 3600 * 1000));
var leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
var hours = Math.floor(leave1 / (3600 * 1000));
var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
var minutes = Math.floor(leave2 / (60 * 1000));
var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
var seconds = Math.round(leave3 / 1000)
alert(" 相差 " + days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")

获取最近几天的日期
    function GetDateStr(AddDayCount) {

        var now = new Date();
        var nowTime = now.getTime();
        var oneDayTime = 24 * 60 * 60 * 1000;
        var deta = [];
        for (var i = 0; i < AddDayCount; i++) {
            //显示周一
            var ShowTime = nowTime - i * oneDayTime;
            //初始化日期时间
            var myDate = new Date(ShowTime);
            var year = myDate.getFullYear();
            var month = myDate.getMonth() + 1;
            var date = myDate.getDate();
            var getdeta = year + "-" + month + "-" + date;
            // console.log(year + "-" + month + "-" + date)
            // var str = "星期" + "日一二三四五六".charAt(myDate.getDay());
            deta.push(getdeta);
        }
        return deta;
    }

```

> 获取ulr结尾的参数  https://blog.csdn.net/anthony_1223/article/details/79039233
```
var lastBit = url.substring(url.lastIndexOf("/") + 1).match(/[^\/]*$/)[0];
 
var lastDigits = url.substring(url.lastIndexOf("/") + 1).match(/[0-9]*$/)[0];
```
>
$id = $this->request->param('id', 0, 'intval');
$pluginModel->save(['config' => json_encode($config)], ['id' => $id]);
$this->request->param('config/a');只是接受数组；
json_decode($costmaterial['material_config'], true);json字符串变成数组
htmlspecialchars_decode($siteInfo['site_analytics'])

>  jq 删除数组；
$.each(checkdata, function (index, elem) {
    dataid.push(elem.id);
})
$.each(checkdata, function (index, elem) {
    sparedata.splice($.inArray(elem, sparedata), 1)
})

var time = data.time.split('至');
var time = data.month.split('-');
data.year = time[0];
data.month = time[1].replace(/\b(0+)/gi,"");

使用like的时候https://blog.csdn.net/haibo0668/article/details/78115966
$where= [['number', 'like', '%24%']];
 array_push($where,['a.pro_progress', '>=', 100]);
    /**
 * 获取最近七天所有日期
 */
    public function getweeks($num)
    {
        $time =time();
        $date = [];
        for ($i=1; $i<=$num; $i++) {
            $date[$i] = date('Y-m-d', strtotime('+' . $i-$num .' days', $time));
        }
        return $date;
    }

替换
$oldimgurl = str_replace(',,', ',', $oldimgurl);
preg_replace("/^\,/", "", $oldimgurl)]

解决数字相加出现无限循环小数
formatNum = function(f, digit) { 
    var m = Math.pow(10, digit); 
    return parseInt(f * m, 10) / m; 
} 
　var num1 = 0.1; 
　var num2 = 0.2;

　alert(formatNum(num1 + num2, 1) === 0.3);

concat 连接数据库字段
->field(['sum(b.price*a.product_num) as amount','concat(e.s_name,"-",d.year,"-",d.num)'=>'order'])
利用名称排序
->orderRaw('CONVERT( e.s_name USING gbk ) ASC')
这样加法的时候不会出现误差
->value('sum(binary(b.price))'); 