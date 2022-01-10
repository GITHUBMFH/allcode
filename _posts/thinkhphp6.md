---
title: thinkphp6
date: 2019-05-14 09:59:22
tags: thinkphp6
categories: 代码
---
视频教程
https://www.bilibili.com/video/BV12E411y7u8?p=55&spm_id_from=pageDriver
文档
https://www.kancloud.cn/manual/thinkphp6_0/1037635

1.查看端口被哪个程序占用
  sudo lsof -i tcp:port
  如： sudo lsof -i tcp:端口号
2.看到进程的PID，可以将进程杀死。
  kill PID（此处是pid号）
  如：kill 30118

chmod -R 777 +文件名+/ 可以修改费文件权限

>命令行
php think run  //项目启动
php think run -H tp.com -p 80   //更改端口
php think version  //查看版本

php think build demo //新建一个项目应用
php think make:controller index@Blog  执行下面的指令可以生成index应用的Blog控制器类库文件
# 生成控制器
php think make:controller orderlist

>php think make:controller index@Blog --plain 仅仅生成空的控制器
>php think make:controller index@test/Blog --plain  生成多级控制器

php think make:model index@Blog  执行下面的指令可以生成index应用的Blog模型类库文件
php think make:model Blog

生成带后缀的类库
php think make:controller index@BlogController
php think make:model BlogModel

php think make:middleware Auth  快速生成中间件

php think make:validate index@User  创建验证器类

php think clear 清除应用的缓存文件
php think clear --dir  不需要保留空目录
php think clear --log 清除日志目录
php think clear --log --dir 清除日志目录并删除空目录

php think clear --cache  清除数据缓存目录
php think clear --cache --dir 清除数据缓存目录并删除空目录
php think clear --path d:\www\tp\runtime\log\  清除某个指定目录下面的文件

php think optimize:schema
php think optimize:schema admin
php think optimize:schema --db demo
php think optimize:schema --connection mysql
php think optimize:schema --table think_user
php think optimize:schema --table demo.think_user

# 快速生成验证
php think make:validate User


>安装
composer create-project topthink/think thinkphp6
composer require topthink/think-view  安装视图路由

> 调试模式
根目录会自带一个.example.env文件（环境变量示例），你可以直接更名为.env
.example.env文件中设置的数据库信息只能在开发环境中有用，真实的配置还是要到config/database.php中

> 完整的url路径
多应用：域名/index.php/应用/控制器/方法/参数/参数值
单应用：域名/index.php/控制器/方法/参数/参数值

域名/index.php/文件名字.控制器/方法/参数/参数值 //如果控制器下新建了一个文件夹

如果要删除index.php，需要开启url重写
阿帕奇中httpd.conf配置文件中mod_rewrite.so模块前的#去掉，AllowOverride None 改成 AllowOverride All


> 控制器
thinkphp6/config/route.php，中可以修改控制器文件名称controller_layer，和后缀controller_suffix

> 输入
return
echo '<pre>'
echo '</pre>'
josn($data)
halt()
die
exit
print_r()

$this->request 请求的方法，可以获取控制器名称$this->request->action()
$this->app->getBasePath()  获取访问路径


> 连接数据库
use think\facade\Db;

HOSTNAME = 127.0.0.1  必须要这样写，开启mysql远程权限
Db::connect('mysql2')->table('user')->find();连接其他的数据库 
> 模型连接数据库
```
<?php
namespace app\model;
use think\Model;
class Order extends Model{
    protected $connection = 'mysql';  //加上这句可以切换数据库
}

use app\model\Order;
public function label(){
    $Order = Order::select();
    return $Order;
}
```


> 路由
1. 开启/关闭路由在app.php
// 关闭应用的路由功能
'with_route'    =>    false,

路由配置在route.php
配置路由在route/app.php

2. 路由规则
Route::rule('new/:id','News/read','GET|POST')->name('new_read');; //name是这个路由的名字
Route::rule('new-:id','News/read','GET|POST')->name('new_read');; //-可以代替/
Route::rule('new/<id>','News/read','GET|POST')->name('new_read');; //<>可以代替:
Route::get('blog/<year>/<month?>','Blog/archive');可选变量用[ ]包含起来后就表示该变量是路由匹配的可选变量。
http://serverName/index.php/blog/2015
http://serverName/index.php/blog/2015/12

Route::get('blog/:id','blog/read')->append(['status' => 1, 'app_id' =>5]);额外参数属于隐式传值。起到一定的安全防护作用
在方法中
function（$status）{}可以得的
function（$status）{}可以得的

Route::get('blog/:id','\app\index\service\Blog@read');///执行的是 \app\index\service\Blog类的read方法。

Route::get('blog/:id','group.Blog/read');//支持多级控制器

Route::redirect('blog/:id', 'http://blog.thinkphp.cn/read/:id', 302);重定向路由

Route::get('new/:name$', 'News/read')->cache(3600);请求缓存

开启强制路由之后用tp默认的路由则无效
'url_route_must'		=>  true,

开启路由完全匹配
'route_complete_match'   => true,
Route::get('new/:cate', 'News/category')->completeMatch(false);

路由参数设置
Route::get('new/:id', 'News/read')
    ->ext('html')
    ->https();
Route::get('new/:id', 'News/read')
->option([
    'ext'   => 'html',
    'https' => true
]);
// 完整域名检测 只在news.thinkphp.cn访问时路由有效
Route::get('new/:id', 'News/read')
    ->domain('news.thinkphp.cn');
// 子域名检测
Route::get('new/:id', 'News/read')
    ->domain('news');
路由绑定模型
Route::get('hello/:id', 'index/hello')
    ->model('id', '\app\index\model\User');    

# 数据库操作 
Db::getLastSql()查看执行的原生sql语句
* 查询数据
```
Db::name('user')->where('id', 1)->find();查询单个数据
Db::name('user')->where('id', 1)->findOrEmpty();希望查询数据不存在的时候返回空数组
Db::name('user')->where('id', 1)->findOrFail();没有找到数据后抛出异常
Db::name('user')->where('status', 1)->select();查询多个数据
Db::name('user')->where('status', 1)->select()->toArray();转换为数组
Db::name('user')->where('status',1)->selectOrFail();没有查找到数据后抛出异常
Db::name('user')->where('id', 1)->value('name');查询某个字段的值,value 方法查询结果不存在，返回 null
Db::name('user')->where('status',1)->column('name','id');查询某一列的值，返回数组,方法查询结果不存在返回空数组,其中id是索引
处理大量数据的时候可以用这个分批处理，排序写在末尾，可以插入其他的条件过滤，100是一次处理的条数
Db::name('user')->chunk(100, function($users) {
    // 处理结果集...
    return false;
},'create_time', 'desc');
需要处理超大量的数据
$cursor = Db::table('user')->where('status', 1)->cursor();
foreach($cursor as $user){
	echo $user['name'];
}

```
* 添加数据
```
Db::name('user')->save($data);自动判断是新增还是更新数据
Db::name('user')->insert($data);添加数据成功返回添加成功的条数,会抛出异常,存在相同键值会报错
Db::name('user')->replace()->insert($data);存在相同键值不会报错，会直接修改
Db::name('user')->strict(false)->insert($data);如果不希望抛出异常
$userId = Db::name('user')->insertGetId($data);添加数据后如果需要返回新增数据的自增主键

Db::name('user')->insertAll($data);添加多条数据直
Db::name('user')->replace()->insertAll($data);
// 分批写入 每次最多100条数据
Db::name('user')
    ->limit(100)
    ->insertAll($data);
```

* 更新数据 如果数据中包含主键，可以直接使用
```
Db::name('user')->save(['id' => 1, 'name' => 'thinkphp']);
Db::name('user')->where('id', 1)->update(['name' => 'thinkphp']);
Db::name('user')->where('id', 1)->data(['name' => 'thinkphp'])->update();

Db::name('user')->where('id',1)->exp('name','UPPER(name)')->update();要使用SQL函数或者其它字段
Db::name('user')要使用SQL函数或者加减
    ->where('id', 1)
    ->update([
        'name'		=>	Db::raw('UPPER(name)'),
        'score'		=>	Db::raw('score-3'),
        'read_time'	=>	Db::raw('read_time+1')
    ]);
Db::table('think_user')->where('id', 1)->dec('score', 5)->update();inc/dec方法自增或自减一个字段的值（ 如不加第二个参数，默认步长为1

```
* 删除数据 方法返回影响数据的条数，没有删除返回 0
```
// 根据主键删除
Db::table('think_user')->delete(1);
Db::table('think_user')->delete([1,2,3]);

// 条件删除    
Db::table('think_user')->where('id',1)->delete();
Db::table('think_user')->where('id','<',10)->delete();

// 无条件删除所有数据
Db::name('user')->delete(true);

业务数据不建议真实删除数据，系统提供了软删除机制
Db::name('user')->where('id', 1)->useSoftDelete('delete_time',time())->delete();
```
* 查询表达式
```
=	等于	
<>	不等于	
>	大于	
>=	大于等于	
<	小于	
<=	小于等于	
[NOT] LIKE	模糊查询	whereLike/whereNotLike
[NOT] BETWEEN	（不在）区间查询	whereBetween/whereNotBetween
[NOT] IN	（不在）IN 查询	whereIn/whereNotIn
[NOT] NULL	查询字段是否（不）是NULL	whereNull/whereNotNull
[NOT] EXISTS	EXISTS查询	whereExists/whereNotExists
[NOT] REGEXP	正则（不）匹配查询（仅支持Mysql）	
[NOT] BETWEEN TIME	时间区间比较	whereBetweenTime
> TIME	大于某个时间	whereTime
< TIME	小于某个时间	whereTime
>= TIME	大于等于某个时间	whereTime
<= TIME	小于等于某个时间	whereTime
EXP	表达式查询，支持SQL语法	whereExp
find in set	FIND_IN_SET查询	whereFindInSet

Db::name('user')->where('id','in','1,3,8')->select();可以写成下面的形式
Db::name('user')->where('id','exp',' IN (1,3,8) ')->select();
Db::name('user')->whereExp('id', 'IN (1,3,8) ')->select();

```
* 时间查询
```
// 大于某个时间
Db::name('user')->whereTime('birthday', '>=', '1970-10-1')->select();
// 小于某个时间
Db::name('user')->whereTime('birthday', '<', '2000-10-1')->select();
// 时间区间查询
Db::name('user')->whereTime('birthday', 'between', ['1970-10-1', '2000-10-1'])->select();
// 不在某个时间区间
Db::name('user')->whereTime('birthday', 'not between', ['1970-10-1', '2000-10-1'])->select();
// 查询两个小时内的博客
Db::name('blog')->whereTime('create_time','-2 hours')->select();
// 查询2017年上半年注册的用户
Db::name('user')->whereBetweenTime('create_time', '2017-01-01', '2017-06-30')->select();
// 查询不是2017年上半年注册的用户
Db::name('user')->whereNotBetweenTime('create_time', '2017-01-01', '2017-06-30')->select();
// 查询2017年上半年注册的用户
Db::name('user')->whereBetweenTime('create_time', '2017-01-01', '2017-06-30')->select();
// 查询不是2017年上半年注册的用户
Db::name('user')->whereNotBetweenTime('create_time', '2017-01-01', '2017-06-30')->select();
查询今年注册的用户
Db::name('user')->whereYear('create_time')->select();   
查询去年注册的用户
Db::name('user')->whereYear('create_time', 'last year')->select();   
查询某一年的数据使用
Db::name('user')->whereYear('create_time', '2018')->select();    
查询本月注册的用户
Db::name('user')->whereMonth('create_time')->select();   
查询上月注册用户
Db::name('user')->whereMonth('create_time','last month')->select();   
查询2018年6月注册的用户
Db::name('user')->whereMonth('create_time', '2018-06')->select();  
查询本周数据 
Db::name('user')->whereWeek('create_time')->select();    
查询上周数据
Db::name('user')->whereWeek('create_time', 'last week')->select();    
查询指定某天开始的一周数据
Db::name('user')->whereWeek('create_time', '2019-1-1')->select();  
查询当天注册的用户
Db::name('user')->whereDay('create_time')->select();   
查询昨天注册的用户
Db::name('user')->whereDay('create_time', 'yesterday')->select();   
查询某天的数据使用
// 查询2018年6月1日注册的用户
Db::name('user')->whereDay('create_time', '2018-06-01')->select();  
时间字段区间比较
// 查询有效期内的活动
Db::name('event')->whereBetweenTimeField('start_time', 'end_time')->select();
上面的查询相当于
Db::name('event')->whereTime('start_time', '<=', time())->whereTime('end_time', '>=', time())->select();
```
* 聚合查询
```
数量
Db::table('think_user')->count();
Db::table('think_user')->count('id');
最大
Db::table('think_user')->max('score');
Db::table('think_user')->max('name',false);
最小
Db::table('think_user')->where('score', '>', 0)->min('score');
Db::table('think_user')->where('score', '>', 0)->min('name',false);
平均
Db::table('think_user')->avg('score');
求和
Db::table('think_user')->where('id',10)->sum('score');
分组
Db::table('score')->field('user_id,SUM(score) AS sum_score')->group('user_id')->select();
```

* 子查询 插入到其他查询里面可以配合table whereExp使用 或者使用闭包的方法
```
fetchSql方法表示不进行查询而只是返回构建的SQL语句
$subQuery = Db::table('think_user')->field('id,name')->where('id', '>', 10)->fetchSql(true)->select();
不会进行实际的查询操作，而只是生成该次查询的SQL语句
$subQuery = Db::table('think_user')->field('id,name')->where('id', '>', 10)->buildSql();

IN/NOT IN和EXISTS/NOT EXISTS之类的查询可以直接使用闭包作为子查询，
Db::table('think_user')
    ->where('id', 'IN', function ($query) {//$query这里代表的是Db::
        $query->table('think_profile')->where('status', 1)->field('id');
    })
    ->select();

Db::table('think_user')
    ->whereExists(function ($query) {
        $query->table('think_profile')->where('status', 1);
    })->find();
```

* 原生查询
```
query方法用于执行SQL 查询 操作，返回查询结果数据集（数组）
Db::query("select * from think_user where status=:id", ['id' => 1]);
execute用于 更新和写入 数据的sql操作，如果数据非法或者查询错误则返回false
Db::execute("update think_user set name='thinkphp' where status=1");
```

* JSON数据查询
```
JSON数据查询
$user = Db::name('user')
	->json(['info'])
    ->where('info->user_id', 10)
	->setFieldType(['info->user_id' => 'int'])
	->find();

$user = Db::name('user')
	->json(['info'])
    ->where('info->user_id', 10)
	->setFieldType(['info->user_id' => 'int'])
	->find();
dump($user);

JSON数据更新
Db::name('user')
	->json(['info'])
    ->where('id',1)
	->update($data);
```
$data['info->nickname'] = 'ThinkPHP';
Db::name('user')
	->json(['info'])
    ->where('id',1)
	->update($data);

* 视图查询
```
Db::view('User', 'id,name')
    ->view('Profile', 'truename,phone,email', 'Profile.user_id=User.id', 'LEFT')
    ->view('Score', 'score', 'Score.user_id=Profile.id', 'RIGHT')
    ->where('score', '>', 80)
    ->select();
使用别名
Db::view(['think_user' => 'member'], ['id' => 'uid', 'name' => 'account'])
    ->view('Profile', 'truename,phone,email', 'Profile.user_id=member.id')
    ->view('Score', 'score', 'Score.user_id=Profile.id')
    ->where('score', '>', 80)
    ->select();
```

* 分页查询
```
// 查询状态为1的用户数据 并且每页显示10条数据
$list = Db::name('user')->where('status',1)->order('id', 'desc')->paginate(10);
// 获取分页显示
$page = $list->render();
// 获取总记录数
$count = $list->total();
return view('index', ['list' => $list, 'page' => $page]);
定义默认的总数
$list = Db::name('user')->where('status',1)->paginate(10,1000);

分页后数据处理
$list = Db::name('user')->where('status',1)->order('id', 'desc')->paginate()->each(function($item, $key){
    $item['nickname'] = 'think';
    return $item;
});

list_rows	每页数量
page	当前页
path	url路径
query	url额外参数
fragment	url锚点
var_page	分页变量

$list = Db::name('user')->where('status',1)->paginate([
    'list_rows'=> 20,
    'var_page' => 'page',
]);
```

* 获取器 可以对查询的数据进行其他操作比如说求和-拼接
```
第一个参数是当前字段的值，第二个参数是所有的数据。
$user = Db::name('user')
	->json(['info'])
    ->withAttr('info.name', function($value, $data) {
        return strtolower($value);
    })->find(1);
dump($user); 
```


* 链式操作
```
连贯操作	作用	支持的参数类型
where*	用于AND查询	字符串、数组和对象
whereOr*	用于OR查询	字符串、数组和对象
whereTime*	用于时间日期的快捷查询	字符串
table	用于定义要操作的数据表名称	字符串和数组
alias	用于给当前数据表定义别名	字符串
field*	用于定义要查询的字段（支持字段排除）	字符串和数组
order*	用于对结果排序	字符串和数组
limit	用于限制查询结果数量	字符串和数字
page	用于查询分页（内部会转换成limit）	字符串和数字
group	用于对查询的group支持	字符串
having	用于对查询的having支持	字符串
join*	用于对查询的join支持	字符串和数组
union*	用于对查询的union支持	字符串、数组和对象
view*	用于视图查询	字符串、数组
distinct	用于查询的distinct支持	布尔值
lock	用于数据库的锁机制	布尔值
cache	用于查询缓存	支持多个参数
with*	用于关联预载入	字符串、数组
bind*	用于数据绑定操作	数组或多个参数
comment	用于SQL注释	字符串
force	用于数据集的强制索引	字符串
master	用于设置主服务器读取数据	布尔值
strict	用于设置是否严格检测字段名是否存在	布尔值
sequence	用于设置Pgsql的自增序列名	字符串
failException	用于设置没有查询到数据是否抛出异常	布尔值
partition	用于设置分区信息	数组 字符串
replace	用于设置使用REPLACE方式写入	布尔值
extra	用于设置额外查询规则	字符串
duplicate	用于设置DUPLCATE信息	数组 字符串

https://blog.csdn.net/weixin_42085115/article/details/95728137
1. where
数组条件
// 传入数组作为查询条件
Db::table('think_user')->where([
	'name'	=>	'thinkphp',
    'status'=>	1
])->select(); 
字符串条件 注意使用字符串查询条件和表达式查询的一个区别在于，不会对查询字段进行避免关键词冲突处理。
Db::table('think_user')->whereRaw("id=:id and username=:name", ['id' => 1 , 'name' => 'thinkphp'])->select();

2.table对多表进行操作
Db::field('user.name,role.title')
->table([
    'think_user'=>'user',
    'think_role'=>'role'
])
->limit(10)->select();

3. alias组批量设置数据表以及别名
Db::table('think_user')
->alias(['think_user'=>'user','think_dept'=>'dept'])
->join('think_dept','dept.user_id= user.id')
->select();

4.field
某个字段设置别名
Db::table('user')->field('id,nickname as name')->select();
使用SQL函数
Db::table('user')->fieldRaw('id,SUM(score)')->select();
使用数组参数
Db::table('user')->field(['id','nickname'=>'name'])->select();
获取所有字段
Db::table('user')->field('*')->select();
字段排除
Db::table('user')->withoutField('content')->select();
field方法还有一个非常重要的安全功能--字段合法性检测
Db::table('user')->field('title,email,content')->insert($data);

5.limt
insertAll方法的话，则可以分批多次写入，每次最多写入limit方法指定的数量。
Db::table('user')->limit(100)->insertAll($userList);
用于文章分页查询
Db::table('article')->limit(10,25)->select();


6.page  分页

Db::table('article')->page(3,25)->select(); 第一参数代表页码，第二个参数代表每页数量

7.order
如果没有指定desc或者asc排序规则的话，默认为asc。
支持使用数组对多个字段的排序
Db::table('user')
->where('status', 1)
->order('id', 'desc')
->limit(5)
->delete();

如果你需要在order方法中使用mysql函数的话
Db::table('user')
->where('status', 1)
->orderRaw("field(name,'thinkphp','onethink','kancloud')")
->limit(5)
->select();

8.group
对多个字段进行分组
Db::table('user')
    ->field('user_id,test_time,username,max(score)')
    ->group('user_id,test_time')
    ->select();

9.having
HAVING方法用于配合group方法完成从分组的结果中筛选（通常是聚合条件）数据。
having方法只有一个参数，并且只能使用字符串
Db::table('score')
    ->field('username,max(score)')
    ->group('user_id')
    ->having('count(test_time)>3')
    ->select(); 

10.join
INNER JOIN: 等同于 JOIN（默认的JOIN类型）,如果表中有至少一个匹配，则返回行
LEFT JOIN: 即使右表中没有匹配，也从左表返回所有的行
RIGHT JOIN: 即使左表中没有匹配，也从右表返回所有的行
FULL JOIN: 只要其中一个表中存在匹配，就返回行

表名也可以是一个子查询
$subsql = Db::table('think_work')
->where('status',1)
->field('artist_id,count(id) count')
->group('artist_id')
->buildSql();

Db::table('think_user')
->alias('a')
->join([$subsql=> 'w'], 'a.artist_id = w.artist_id')
->select();

11.UNION操作用于合并两个或多个 SELECT 语句的结果集。
Db::field('name')
    ->table('think_user_0')
    ->union(function ($query) {
        $query->field('name')->table('think_user_1');
    })
    ->union(function ($query) {
        $query->field('name')->table('think_user_2');
    })
    ->select();
写法2
Db::field('name')
    ->table('think_user_0')
    ->union(['SELECT name FROM think_user_1', 'SELECT name FROM think_user_2'], true)
    ->select();
写法3
Db::field('name')
    ->table('think_user_0')
    ->union([
        'SELECT name FROM think_user_1',
        'SELECT name FROM think_user_2',
    ])
    ->select();

12.distinct
以下代码会返回user_login字段不同的数据
Db::table('think_user')->distinct(true)->field('user_login')->select();

13.查空报错
// 查询多条
Db::name('blog')
	->where('status', 1)
    ->selectOrFail();

// 查询单条
Db::name('blog')
	->where('status', 1)
    ->findOrFail();

14.cache
Db::table('user')->cache('key',60,'tagName')->find();
Db::table('user')->cache('key',60)->find();
$data = \think\facade\Cache::get('key');//获取缓存数据
Db::table('user')->cache(true,60)->find();
// 或者使用下面的方式 是等效的
Db::table('user')->cache(60)->find();
缓存自动更新是指一旦数据更新或者删除后会自动清理缓存
Db::table('user')->cache('user_data')->select([1,3,5]);
Db::table('user')->cache('user_data')->update(['id'=>1,'name'=>'thinkphp']);
Db::table('user')->cache('user_data')->select([1,3,5]);


```



* 事务操作 数据操作必须同时执行成功  要确保你的数据表引擎为InnoDB，并且开启XA事务支持。
```
自动模式
Db::transaction(function () {
    Db::table('think_user')->find(1);
    Db::table('think_user')->delete(1);
});

手动模式
// 启动事务
Db::startTrans();
try {
    Db::table('think_user')->find(1);
    Db::table('think_user')->delete(1);
    // 提交事务
    Db::commit();
} catch (\Exception $e) {
    // 回滚事务
    Db::rollback();
}
```

# 缓存
```
// 缓存在3600秒之后过期
Cache::set('name', $value, 3600);
Cache::set('name', 1);
// name自增（步进值为1）
Cache::inc('name');
// name自增（步进值为3）
Cache::inc('name',3);
// name自减（步进值为1）
Cache::dec('name');
// name自减（步进值为3）
Cache::dec('name',3);
获取缓存数据可以使用：
Cache::get('name'); 
数组
Cache::set('name', [1,2,3]);
Cache::push('name', 4);
Cache::get('name'); // [1,2,3,4]

删除缓存
Cache::delete('name'); 
获取并删除缓存
Cache::pull('name'); 
清空缓存
Cache::clear(); 

支持给缓存数据打标签，例如：
Cache::tag('tag')->set('name1','value1');
Cache::tag('tag')->set('name2','value2');
// 清除tag标签的缓存数据
Cache::tag('tag')->clear();
获取标签的缓存标识列表
Cache::getTagItems('tag');

助手函数
// 设置缓存数据
cache('name', $value, 3600);
// 获取缓存数据
var_dump(cache('name'));
// 删除缓存数据
cache('name', NULL);
// 返回缓存对象实例
$cache = cache();
```

# session
赋值
Session::set('name', 'thinkphp');
判断是否存在
Session::has('name');
// 如果值不存在，返回null
Session::get('name');
// 如果值不存在，返回空字符串
Session::get('name', '');
// 获取全部数据
Session::all();
删除
Session::delete('name');
取值并删除
// 取值并删除
Session::pull('name');
清空
Session::clear();
闪存数据，下次请求之前有效
// 设置session 并且在下一次请求之前有效
Session::flash('name','value');
提前清除当前请求有效的数据
// 清除当前请求有效的session
Session::flush();

多级数组
支持session的多级数组操作，例如：
// 赋值
Session::set('name.item','thinkphp');
// 判断是否赋值
Session::has('name.item');
// 取值
Session::get('name.item');
// 删除
Session::delete('name.item');

// 赋值
session('name', 'thinkphp');
// 判断是否赋值
session('?name');
// 取值
session('name');
// 删除
session('name', null);
// 清除session
session(null);

# cookie
// 设置
cookie('name', 'value', 3600);
// 获取
echo cookie('name');
// 删除
cookie('name', null);

# 验证器
php think make:validate User
具体使用参考文档
https://www.kancloud.cn/manual/thinkphp6_0/1037624

定义方法1：
class User extends Validate
{
    protected $rule =   [
        'name用户名|y'  => 'require|max:25|checkname:mfh',
        'age'   => 'number|between:1,120',
        'email' => 'email',    
    ];
    
    protected $message  =   [
        'name.require' => '名称必须',
        'name.max'     => '名称最多不能超过25个字符',
        'age.number'   => '年龄必须是数字',
        'age.between'  => '年龄只能在1-120之间',
        'email'        => '邮箱格式错误',    
    ];

        protected function checkname($value,$rule){

    }
    
    protected $scene = [
        'edit'  =>  ['name','age'],
    ];    
}

定义方法2：
$validate=validate::rule({
        'name用户名|y'  => 'require|max:25|checkname:mfh',
        'age'   => 'number|between:1,120',
        'email' => 'email',   
})
$validate->message([
            'name.require' => '名称必须',
        'name.max'     => '名称最多不能超过25个字符',
        'age.number'   => '年龄必须是数字',
        'age.between'  => '年龄只能在1-120之间',
        'email'        => '邮箱格式错误',   
])
使用方法1：
try {
    validate(Vorder::class)->batch(true)->check([
        'name'  => '',
        'email' => 'thinkphpqq.com',
    ]);
} catch (ValidateException $e) {
    // 验证失败 输出错误信息
    dump($e->getError());
}

使用方法1：   
$validate = new \app\validate\Vorder;
$result = $validate->scene('edit')->batch(true)->check($data);

if(!$result){
    echo $validate->getError();
}

单个验证
// if(Validate::is_integer('sd')){
//     echo '1';
// }else{
//     echo '2';
// };

多个验证
Validate::checkRule('10','number|max:20')

# 中间件 可以做到截获http请求，在请求前，后，结束的时候试行某些操作，可以作用到全局，应用，控制器，方法中
php think make:middleware Check 创建中间件

# 服务 执行框架的某些组件或者功能的时候需要依赖的一些基础服务 比如说验证服务功能，
在app/common/shut 中定义方法
php think make:service  FileSystemService 生成一个服务

在服务中register方法中绑定，引入之前写的类
$this->app->bind('file_system', FileSystem::class);
在服务中boot方法中定义之前写的类中的静态方法

在控制器中用app()->file_system->之前定义的方法()

# 容器和依赖注入 说白了就是把对象实例化简单化了
use think\Request;
class Index
{
    protected $request;
    public function __construct(Request $request)//第一是掉用的类对象，第二是别名
    {
        $this->request = $request;//实例赋值
    }
}

手动调用
// 绑定类库标识
bind('cache', 'think\Cache')
;或者在容器Provider.php 中绑定

在provider.php中绑定
'basesql' => app\model\Basesql::class,

调用
$cache = app('cache');

自动绑定
我们只需要在app目录下面定义provider.php文件

# 门面  可以静态调用其他的类  依赖注入和使用Facade代理的效果大多数情况下是一样的，都是从容器中获取对象实例 依赖注入的优势是支持接口的注入
定义app/common/test类
定义app/facade/test门面
<?php
namespace app\facade;
use think\Facade;
class Test extends Facade
{
    protected static function getFacadeClass()
    {
    	return 'app\common\Test';//绑定类的路径
    }
}
调用\app\facade\Test::hello('thinkphp');

# 数据请求
host	当前访问域名或者IP
scheme	当前访问协议
port	当前访问的端口
remotePort	当前请求的REMOTE_PORT
protocol	当前请求的SERVER_PROTOCOL
contentType	当前请求的CONTENT_TYPE
domain	当前包含协议的域名
subDomain	当前访问的子域名
panDomain	当前访问的泛域名
rootDomain	当前访问的根域名
url	当前完整URL
baseUrl	当前URL（不含QUERY_STRING）
query	当前请求的QUERY_STRING参数
baseFile	当前执行的文件
root	URL访问根地址
rootUrl	URL访问根目录
pathinfo	当前请求URL的pathinfo信息（含URL后缀）
ext	当前URL的访问后缀
time	获取当前请求的时间
type	当前请求的资源类型
method	当前请求类型
rule	当前请求的路由对象实例

param	获取当前请求的变量
get	获取 $_GET 变量
post	获取 $_POST 变量
put	获取 PUT 变量
delete	获取 DELETE 变量
session	获取 SESSION 变量
cookie	获取 $_COOKIE 变量
request	获取 $_REQUEST 变量
server	获取 $_SERVER 变量
env	获取 $_ENV 变量
route	获取 路由（包括PATHINFO） 变量
middleware	获取 中间件赋值/传递的变量
file	获取 $_FILES 变量

* 调用
request()->param('name');
* 可以使用has方法来检测一个变量参数是否设置，如下：
Request::has('id','get');
Request::has('name','post');
* 获取PARAM变量
Request::param('name');// 获取当前请求的name变量
Request::param();// 获取当前请求的所有变量（经过过滤）
Request::param(false);// 获取当前请求未经过滤的所有变量
Request::param(['name', 'email']);// 获取部分变量

* 设置默认值
Request::get('name'); // 返回值为null
Request::get('name',''); // 返回值为空字符串
Request::get('name','default'); // 返回值为default
* 过滤
Request::get('name','','htmlspecialchars'); // 获取get变量 并用htmlspecialchars函数过滤
Request::param('username','','strip_tags'); // 获取param变量 并用strip_tags函数过滤
Request::post('name','','org\Filter::safeHtml'); // 获取post变量 并用org\Filter类的safeHtml方法过滤
Request::get('name', '', null);// 获取get变量 并且不进行任何过滤 即使设置了全局过滤
* 获取部分变量
// 只获取当前请求的id和name变量
Request::only(['id','name']);
Request::param(['name', 'email']);// 获取部分变量
Request::only(['id','name'], 'get');// 只获取GET请求的id和name变量  // 等效于Request::get(['id', 'name']);
Request::only(['id','name'], 'post');// 只获取POST请求的id和name变量 // 等效于Request::post(['id', 'name']);
// 排除id和name变量
Request::except(['id','name']);

* 如果要获取原始的请求类型，可以使用
Request::method(true);

* 可以使用Request对象的header方法获取当前请求的HTTP请求头信息
$info = Request::header();
$agent = Request::header('user-agent');

# 响应
* 输出一个html格式的内容
 return json($data);
* 输出一个JSON数据
 return response($data);
* 可以使用Response类的header设置响应的头信息
 json($data)->code(201)->header([
    'Cache-control' => 'no-cache,must-revalidate'
]);
lastModified	设置Last-Modified头信息
expires	设置Expires头信息
eTag	设置ETag头信息
cacheControl	设置Cache-control头信息
contentType	设置Content-Type头信息
* 设置状态码
json($data,201);
json($data)->code(201);
* 写入Cookie
response()->cookie('name', 'value', 600);
* 关闭当前页面的请求缓存
json($data)->code(201)->allowCache(false);
* 进行json输出的时候需要设置json_encode方法的额外参数
jsonp($data)->options([
    'var_jsonp_handler'     => 'callback',
    'default_jsonp_handler' => 'jsonpReturn',
    'json_encode_param'     => JSON_PRETTY_PRINT,
]);
* 重定向
return redirect('http://www.thinkphp.cn');
// 记住当前地址并重定向
return redirect('hello')
    ->with('name', 'thinkphp')
    ->remember();
// 跳回之前的来源地址
return redirect()->restore();
* 文件下载
return download('image.jpg', 'my')->expire(300);
name	命名下载文件
expire	下载有效期
isContent	是否为内容下载
mimeType	设置文件的mimeType类型
force	是否强制下载（V6.0.3+）
* 打开图像文件而不是浏览器下载的话
return download('image.jpg', 'my.jpg')->force(false);

# 其他操作
json_encode() 对变量进行JSON编码，
json_decode() 对JSON数据进行解码，转换为PHP变量

concat 连接数据库字段
->field(['sum(b.price*a.product_num) as amount','concat(e.s_name,"-",d.year,"-",d.num)'=>'order'])
利用名称排序
->orderRaw('CONVERT( e.s_name USING gbk ) ASC')
数据加法
->field('a.*,b.s_name,c.price,sum(d.receipt) as receipt,(c.price-sum(d.receipt)) as complete')
数据乘法 时间格式化
->field('sum(b.price*a.product_num) as amount,date_format(a.product_data,"%Y-%m") as month')
别名
->alias("a")
联合查询
->join('__ROLE_USER__ b ','b.user_id= a.id','LEFT')

# ThinkPHP实例化Model（模型）的四种方法
https://blog.csdn.net/Yeoman92/article/details/53192211?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control&dist_request_id=1328769.66715.16176603561557203&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control

# 不使用建立模型类
https://www.taotaoit.com/article/details/1084.html


# 提取数组中的某个值
https://www.jb51.net/article/77005.htm
$arr2 = array_column($arr, 'name')

# 使用phpexcel

https://www.cnblogs.com/yuanwanli/p/12617066.html

保存在本地
http://phpff.com/2880.html

composer.json加入一下代码，然后composer update安装
"phpoffice/phpexcel": "^1.8"
安装
https://blog.csdn.net/qq_42081458/article/details/109994734?ops_request_misc=&request_id=&biz_id=102&utm_term=tp6%20PHPExcel&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduweb~default-3-109994734.first_rank_v2_pc_rank_v29
使用
https://blog.csdn.net/handsomezls/article/details/82735173
文档
https://www.cnblogs.com/heijinli/p/11044211.html

同一设置样式
```
$styleArray = array(
    'font'  => array(
        'bold'  => true,
        'color' => array('rgb' => '000000'),
        'size'  => 11,
        'name'  => 'Verdana'
    ),
    'alignment' => array(
        'horizontal' => PHPExcel_Style_Alignment::HORIZONTAL_CENTER,
    )
);
 
$objPHPExcel->getActiveSheet()->getStyle('A1:D1')->applyFromArray($styleArray['font']);

```

# localStorage
localStorage和sessionStorage具有相同的方法，具体如下(以localStorage为例)：
1.设置缓存数据:localStorage.setItem(key,value);
2.获取缓存数据：localStorage.getItem(key)；
3.获取全部缓存数据：localStorage.valueOf();
4.获取指定下标的key键值：localStorage.key(N)；
5.删除缓存数据：localStorage.removeItem(key) ；
6.清空缓存数据：localStorage.clear();


# 助手函数
https://www.cnblogs.com/xhnewbie/p/13440773.html


# class 代表完全限定路径 @代表忽略错误
Vorder::class;

# input助手函数
https://blog.csdn.net/xinyflove/article/details/89486213
```
1.判断变量是否定义

input('?get.id');
input('?post.name');

input('param.name'); // 获取单个参数
input('param.'); // 获取全部参数
// 下面是等效的
input('name'); 
input('');

```

# php 自带过滤和转义函数
https://blog.csdn.net/weixin_34194702/article/details/85673841?utm_medium=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EOPENSEARCH%7Edefault-1.control&depth_1-utm_source=distribute.pc_relevant_t0.none-task-blog-2%7Edefault%7EOPENSEARCH%7Edefault-1.control

# paginate分页
```
->paginate()
        $data = [
            'total'     =>$r->total(),        // 总记录数
            'cur'       =>$r->currentPage(),  // 当前页码
            'size'      =>$r->listRows(),     // 每页记录数
            'list'      =>$r->items()         // 分页数据
```

# 文件类型
// "image/pjpeg", "application/pdf", "application/msword", "image/jpeg",
//         "image/x-png", "image/tiff", "application/vnd.ms-excel", "application/zip",
//         "image/bmp", "image/x-bitmap", "image/x-pixmap", "image/jpg",
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" /*xlsx*/
//         , "application/x-rar-compressed", "application/rtf", "application/x-tika-ooxml",/*xls*/
//         "application/vnd.openxmlformats-officedocument.spreadsheetml.template",/*xltx*/
//         "application/vnd.ms-spreadsheetml",/*excel*/"application/vnd.ms-xpsdocument",/*xps*/
//         "application/x-bplist"/*pdf*/, "application/x-mswrite",/*Ms Write*/
//         "application/vnd.ms-word.document.macroenabled.12"/*docm*/, "application/x-tika-msoffice"/*pdf*/,
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.document", /*docx*/
//         "application/vnd.openxmlformats-officedocument.wordprocessingml.template", /*dotx*/
//         "application/vnd.ms-powerpoint",/*ppt*/"vnd.ms-project",/*Microsoft Project*/
//         "application/vnd.visio"/*Visio*/, "image/svg+xml",/*svg*/"application/vnd.ms-works",/*wps*/
//         "application/vnd.openxmlformats-officedocument.presentationml.slideshow",/*ppsx*/
//         "application/vnd.openxmlformats-officedocument.presentationml.presentation"/*pptx*/,
//         "application/vnd.openxmlformats-officedocument.presentationml.template"
//         , "application/x-7z-compressed", "application/vnd.ms-xpsdocument"/*xps*/);


# c
安装命令
composer require qiniu/php-sdk