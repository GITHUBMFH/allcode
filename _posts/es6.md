---
title: ES6
date: 2019-05-28 15:27:23
tags:
categories:
---
>> https://www.bilibili.com/video/BV1yA411L7qR?p=9

> let和const变量
let 不能重复声明，只能在代码块中有效，不存在变量提升 
const 一定要赋值，一般用大写，不能修改块级作用域，但是对数组和对象元素修改不算修改 

> 解构赋值->相当于快速赋值 
```
const F = ['1','2','3']
let [hhh,hh,h] = F
console.log(hhh);

const H = {naem:'zhao',age:'34',hehe:function(){console.log('mfh')}}
let {name,age,HH} = H;
console.log(name);
```

对象的解构赋值和数组有一个不同，数组的元素是按次序排列的，变量的取值由它的位置决定；而对象的属性没有次序，变量必须与属性同名，才能取到正确的值

> 模板字符串`，
```
let = `<ul>
         <li>meh</li>
       </ul>`
//可以直接换行
let a = `dife`;
let b = `${a}dife`; 可以直接拼接
```

> 对象的写法简化
```
let naem ='mfh';
let age  = '45';
const mfh={
    name,
    age,
    work(){
    }
}

相当于
const mfh={
    name:name,
    age:age,
    work:function(){

    }
}

```

> 箭头函数,函数中的this是不变的指向当前作用域，不能作为构造函数的实例对象 ，不能使用argument变量
不适合回调函数，不适合对象里面的函数 ，不适合于this有关的函数
```
let fn1 = (a,b)=>{return a+b;};
let fn1 = a => {return a+a;};
let fn1 = a => a+a;
3中写法
let result =fn1();
console.log(result); 
```

> 函数设置默认值
默认值一般放到后面
```
function add(a,b,c=10){
    return a+b+c;
}
与解构赋值结合
function add(naem,age){
    return name;
}
const add = ({name:'meh',age='23'})
```

> rest 参数 获取传参
```
function add(a,b,...args){
    return args;
}
add(1,2,3 )
```
> 扩展运算的运用，用...+名称 代替数组中的值
```
合并数组 和克隆，伪数组变成真正的数组
const a=['11','3','9'];
const b=['11','3','9'];
const c=[...a,...b];
```
>2.剩余参数 可以将剩余不定数的参数保存到一个数组中
const order = [20.17, 18.67, 1.50, "cheese", "eggs", "milk", "bread"];
const [total, subtotal, tax, ...items] = order;
console.log(total, subtotal, tax, items);

> symbol 表示唯一的，不能运算，不能for循环 
```
let s =symbol();
let s =symbol.for();

let get = {...}
let mo = {
    up:symbol(),
    down:symbol(),
}
get[mo.up]=function(){console.log('1')}


let mo = {
    [symbol('w')]:function(){console.log('1')},
    [symbol('e')]:function(){console.log('1')} ,
}
```

> 生成器函数
```
function one(){
    setTimeout(()=>{
        let data='我是用户数据'
        iterator.next(data);
    },1000)
}

function two(){
    setTimeout(()=>{
        let data='我是订单数据'
        iterator.next(data);
    },2000)
}

function two(){
    setTimeout(()=>{
        let data='我是商品数据'
        iterator.next(data);
    },3000)
}

function * gen(arg){
    let user = yield one(arg);
    let order = yield two(user);
    let product = yield three(order);
}

let iterator = gen();
iterator.next();

```

>>get 和set 是指调用类属性时的设置的方法

> Number.EPSILON 属性表示 1 与大于 1 的最小浮点数之间的差。
Number.isFinite()用于检查一个数值是否为有限的（ finite ）
Number.isNaN()用于检查一个值是否为 NaN 
Number.isInteger()用于判断给定的参数是否为整数。
Number.parseInt()用于将给定字符串转化为指定进制的整数

> object is判断两个值是否相等 object is(1,1)
object assign 对象合并

> 模块化
```
export let a = '1'；
export {a,b}
exprot default{
    let a ='3';
}
<script type='module'>
import * as a from './src/js/mi.js'
import {a,b} from './src/js/mi.js'
import {a as c,b} from './src/js/mi.js'
import {default as ms} from './src/js/mi.js'//默认暴露时使用
import M4 from './src/js/mi.js'

</script>
```
入口文件


https://www.cnblogs.com/lovekiku123/p/11822288.html
1. map 对现有的数组进行编辑
可以发现，是不是必须要创建一个空数组？而使用map()就不需要。那么 .map() 是怎么运行的呢？实际上对数组的每个元素都遍历一次(就不用写forEach自己去遍历了)，同时返回一个新的值。记住一点是返回的这个数据的长度和原始数组长度是一致的。值得注意的是：必须要加return，否则返回的是undefined。

2. filter()
假如你有一个数组，你只想要这个数组中的一些元素怎么办呢？这时候 .filter() 就非常好用了。来看几个例子吧
 3. find()
find()这个方法看表面意思就知道是用来查找的。先看看在ES5的语法中怎么去实现查找一个对象里的元素的。

https://www.cnblogs.com/meng-ma-blogs/p/8352787.html
JS数组添加元素的三种方式
1、push() 结尾添加
2、unshift() 头部添加
3、splice() 方法向/从数组指定位置添加/删除项目，然后返回被删除的项目。

ES6从数组中删除指定元素

findIndex()方法返回数组中满足提供的测试函数的第一个元素的索引。否则返回-1。

arr.splice(arr.findIndex(item => item.id === data.id), 1)
