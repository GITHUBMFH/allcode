---
title: php面向对象
date: 2019-05-26 16:53:06
tags: 代码
categories: php面向对象
---
> 类的成员：属性、方法、常量
> 类的访问修饰限定符 
1. public  公用的
2. protecte  受保护的 只能在内部访问
3. private 私有的  只能在内部访问且只能在自己的类中访问

> 构造函数,会自动调用，一般用来初始化值
https://www.cnblogs.com/phpper/p/8976304.html
```
class Base{
    public $count;
    protecte $num;
    private $name;
    public function __construct($c,$A,$b)
    {
        <!-- echo '我是基础控制器'; -->
        //可以用来初始化属性
        //$this->$count=10;
        //$this->$num=10;
        //$this->$count='dsfs';
    }
}

$s=new Base(1,2,'33');
```

> 析构函数 在对象被销毁的时候自动调用，用来释放对象中的资源，不是删除对象，脚本结束会自动销毁，所以很少用
```
class Base{
    function __destruct()
    {
        echo __FUNCTION__
    }
}
$s=new Base();
unset($s)//销毁对象
```

> 常量访问 
static 静态 用来区分是对象访问和类访问  static修饰符 属于类访问 不能使用$this，要用self
```
class saler{
    const pi='dsf';
    public static name='df';
    public function get(){
        //可以用 new self();
        return self::name
    }
}
echo saler::pi;
```
> 类的加载
```
$config=include("./config/config.php");
require_once './config/config.php';

if(class_exists('./application/contrller/Base.php')){
    require_once './application/contrller/Base.php';
}
自动加载
1:
function __autoload($name){
    require $name.'php';
    exit;
}
2:
function getclass($name){
    require $name.'php';
    exit;
}
sql_autoload_register('getclass');
```

> 单例模式
最多只能得到一个对象
私有化构造方法，克隆，静态属性
公有化静态方法
目的是保护资源的唯一性
```
class oneclass{
    private static $object=null;//保存生成出来的对象
    private function __construct()
    {
        echo __METHOD__,'<br/>';
    }
    public static function getcalss(){
        // 判断是否有这个对象 没有的话就新加一个对象，有的话就用就的对象
        if(!(self::$object instanceof self)){
            self::$object=new self();//实例化本身，保存生成出来的对象
        }
        return self::$object;//返回保存的实例出去
    }
    // 私有化克隆 禁止克隆
    private function __clone()
    {
        
    }
}

$s =oneclass::getcalss();
```
> 工厂模式
```
class man{
    public function display(){
        echo 'man';
    }
}
class woman{
    public function display(){
        echo 'woman';
    }
}
class factoryhumen{
    public static function getclass($name){
        return new $name();
    }
}
$a = new factoryhumen();
$b=$a->getclass('man');
$b->display()
```

面向对象的特性 ：封装 继承（extends protected关键词就是为此作用的） 多态（重写）

parent 不能访问父类的属性，可以访问静态方法和静态属性，类常量和普通方法
final 关键词表示不被继承被重写
abstract 类不能被实例化，抽象方法必须在抽象类中，且不能有具体的行为，不能是private，抽象类被继承的时候，里面的抽象方法必须实现

interface 接口 implements 只能有常量和方法，接口可以继承接口 可以多继承

trait  相当于class 但是里面不能用常量，不能实例化 利用use可以加载,
不通过继承，就可以直接调用trait里面的东西
```
trait eat
{
    public $name='mfh';
}

trait go
{
    public $name='mfh';
}
class name{
    use eat,go{
        eat::name insteadof go //有重复的时候声明用哪一个
        go::name as go2  //使用别名
    };
    public function geteat(){
    }
}
$s = new name();
$s->name;
```
php 方法重载
public function __call(){//不存在方法时调用

}

public function __callstatic(){//不存在静态方法时调用

}

php 属性重载

__set
__get
__unset()
__tostring

静态延迟绑定
clas Humen{
    public static $name = 'mfh'
    public static getname(){
        echo self::$name
        echo self::$name
    }
}
class men extends Humen{
    public static $name= 'mfh2'//重写name变量
}
men::getname();
输出的是 mfh mfh2