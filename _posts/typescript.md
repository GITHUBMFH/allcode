---
title: typescript
date: 2019-05-28 15:27:23
tags:
categories:
---
>> https://www.bilibili.com/video/BV1yA411L7qR?p=9


>> 数值类型：
布尔Boolean
数字 number
字符串 string
数组 array  
    let arr:number[]=[23,234,45];
    let arr:Array[number]=[23,234,45];

    let arr:string[]=['23','234','45'];
    let arr:Array[string]=[23,234,45];
null 和undefined 定义不符值就是和undefined
any
元组 tuple
    let arr:[string,nubmer,boolean]=['df',34,true]

枚举 enum
enum flag{
    success=1,error=2//不设置值得时候默认重0开始
}
var f:flag=flag.success;
console.log(1);

void 表示定义方法没有返回值 function run():void{}
never 是其他类型（包含null 和undefined）的子类型，表示从不会出现
    var a:never
    a=(()=>{
        threw.new Error('dfs');
    })()
对象数据声明
    let heeh:{
      name:string,
      wuwu:number,
    }={
      name:'df',
      wuwu:1
    }

>函数的定义
es5中定义的方法
function run (){return 'run'}
var run = function(){return 'run'}//匿名函数
ts中的函数
function run (fe:string='opk',age?:number)：string{return 'run'}//可选参数放后面
function run (...aregs:string)：string{return 'run'}//可选参数放后面
var run = function()：string{return 'run'}//匿名函数

函数的重载：2个同名函数，但是参数不同的情况
function run (age:string):string;
function run (age:number):number;
function run (age:any):any{
    if (typeof age==='string'){

    }else{
        
    }
};
function run (age:string):string;
function run (age:number,name:string):number;
function run (age:any,name:string):any{
    if (name){

    }else{
        
    }
};


>>类的定义
es5中
function person(){
    this.nmae='age':
    this.run=function(){//实例方法
        console.log('ee')
    }
}
person.prototype.sex='dfwe';//添加新属性和方法
person.getinfo=functiong(){console.log('我是静态方法')}
var p= new person();
console.log(person.name);
person.run();

function web(){
    person.call(this,name,age);//web类继承person类 对象冒充继承
}
或者
web.prototype=new person();//这样可以继承构造函数以外的 


ts中类的定义
class print{
    name:string;
    staic print:string;
    constructor(n:string){//类实例化时执行的函数
        this.name=n;
    }
    run():void{
        alter('ds');
    }
    staic print(){//不用实例类，可以直接person.print(),只能调用类里面的静态属性print.print
        alter('prinf')
    }
}

var p = new person('d')

class web extends person{
    constructor(n:string){
        super(n)//初始化父类的构造函数
    }
    <!-- public 都可以访问
    protected 子类可以访问，外部不可以
    provite 只有类自己 可以访问
    -->类的修饰符
    <!-- 如果子类和父类有同名函数，会执行子类的函数 -->
}

>>多态的继承，在父类定义一个函数，具体动作由子类实现，
class person{
    constructor(n:string){
        super(n)//初始化父类的构造函数
    }
    eat(){
        return'吃'
    }
}
class web extends person{
    constructor(n:string){
        super(n)//初始化父类的构造函数
    }
    eat(){
        return'的复合肥吃'
    }
}

>>用 abstract定义抽象类和方法，继承抽象类的子类必须实现父类中的抽象类
abstract class animal{
    public naem:string;
    constructor(name:string){
        this.name=name;
    }
    abstract eat():string;
}
class dog extends animal{
    constructor(name:string){
        super(name)
    }
    eat(){
        console.log('dsfi')
    }
}

>>接口，属性接口，函数接口，可索引接口，类接口，接口扩展
interface fullname{
    fristname:string;
    lastname?:string;//可选属性
}
publick name(name:fullname){
    console.log(name.fristname+'-'+name.lastname)
}

interface encrypt{
    （key:string,value:string）:string;
}
var md5:encrypt= function(key:string,value:string):string{
    retrun key+value;
}

interface userarr{//可索引接口
    [index:number]:string
}
var arr:userarr=['345','24']

interface anlime{//类接口
    naem:string;
    eat(str:string):void;
}
class Dog implements anlime{
    name:string;
    constructor(name:string){
        this.name=name;
    }
    eat(){
        console.log('dfe')
    }
}
var d = New Dog('ds);
Dog.eat();


interface anlime{//类继承
    naem:string;
    eat(str:string):void;
}

interface anlime2 extends anlime{//类继承
    age:string;
}
class Dog implements anlime{
    constructor(name:string,age:string){}
    eat(){
        console.log('dfe')
    }
}

>>泛型
function getdata<T>(value:T):T{
    return value;
}
getdata<number> (123)

class person<T>{}

interface anlime{//方法接口
    <T>(str:T):T;
}
var a:anlime=function<T>(str:T):T{}
a<number>(3);

把类作为约束数据传入的类型
class user{
    name:string | undefined;
    password:string;
}

class mysql<T>{
    add(use:T):boolean{
        console.log(use);
        return true;
    }
}

var u = New user();
u.name='dfs';
u.password='nf';
var DB = New mysql<user>();
DB.add(u);


>> 装饰器，是一种特殊的申明，能够附加到类的声明、方法、属性和参数，可以修改类的行为
可以注入到类、方法、属性参数上、来扩展类、属性、方法、参数的功能
类型：类装饰器、属性装饰器、方法装饰器、方法参数装饰器
写法：普通装饰器（无法传参）、装饰器工厂（可以传参）
顺序：如果有同样的装饰器会先执行后面的
属性装饰器>方法装饰器>方法参数装饰器>类装饰器


类装饰器：用于类构造函数、可以用来监视、修改、替换类定义、，传入参数
本质是对类的扩展和修改
```
  function logclass(params:type) {
      params指的是单前类
    console.log(params);
    params.prototype.apiurl='xxx';
    params.prototype.run=function(){
      console.log('zzz');
    };
  }

  function logclass2(params:string) {//可以传参，增加和修改类的属性的方法
    return function(target:any){//target代表传过来的类
      target.prototype.apiurl='xxx';
      target.prototype.run=function(){
        console.log('zzz');
      };
    }
  }

function logclass2(target:any) {//可以修改构造函数
    return class extends target{
      apiurl='ddf';
      getDate(){//需要重载不然会报错
        }
    }
  }


  @logclass2('hde)
  @logclass
  class HttpClient{
    constructor(){
        this.apiurl='erfg';
    }
    getDate(){

    }
  }
  var http:any=new HttpClient;
  console.log(http.apiurl);
  http.runs();
```



属性装饰器：可以赋值给属性，会传入3个参数
本质是对属性的扩展和修改
    1.对于静态是类的构造函数、对于实例成员是类的原型对象
    2.属性  的名字
```
    function logclass2(params:string)
    return function(target:any,attr:any){//这里的attr代表下面的url属性名称
      console.log(target);
      console.log(attr);
      target[attr]='www';//修改下面的url为www
    }
  }

  class HttpClient{
    @logclass public url : any|undezned;
    constructor(){

    }
    getDate(){

    }
  }
```

方法装饰器：监视、修改、替换方法的定义，会传入3个参数
    1.对于静态是类的构造函数、对于实例成员是类的原型对象
    2.成员的名字
    3.成员的属性描述
```
    function logclass2(params:string)
    return function(target:any,attr:any,dec:any){//分别是类，方法名称，方法描述
      console.log(target);//
      console.log(attr);
      console.log(dec.value);
      var ometheo = dec.value;
      dec.value=function(...args:any[]){//重写
        args=args.map((value)=>{
          return String(value);
        })

        ometheo.apply(this,args)
      }


      target.aipurl='er';//添加属性和方法
      target.run=function(){
       console.log('ds');
      }

    }
  }

    class HttpClient{
    public url : any|undezned;
    constructor(){}
    @logclass
    getDate(){}

    let a =new HttpClient();
    a.getData(['1','2'])

```

方法参数装饰器：会在运作的时候当做函数调用，可以为类的原型增加一些元素，会传入3个参数
    1.对于静态是类的构造函数、对于实例成员是类的原型对象
    2.方法的名字
    3.参数在函数参数列表的索引

