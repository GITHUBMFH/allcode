---
title: rxjs
date: 2019-05-14 09:59:22
tags: thinkphp6
categories: 代码
---
基础讲解
https://www.cnblogs.com/yangxu-pro/p/8641738.html
https://www.cnblogs.com/yangxu-pro/p/8649477.html
教程
https://rxjs-cn.github.io/learn-rxjs-operators/operators/error_handling/catch.html
https://www.w3cschool.cn/rxjs/rxjs-967c3ck6.html

>创建Observable
1. Observable.from(), 把数组或iterable对象转换成Observable
```
subscribe里面有3个function, 这3个function就是Observer.
第一个function是指当前这个person到来的时候需要做什么;
第二个是错误发生的时候做什么;
第三个function就是流都走完的时候做什么.
Observable.from(persons)
    .subscribe(
        person => {
            console.log(index++, person);
        },
        err => console.log(err),
        () => console.log("Streaming is over.")
    );

```
2. Observable.create(), 返回一个可以在Observer上调用方法的Observable.
```
function getData() {

    let persons = [
        { name: 'Dave', age: 34, salary: 2000 },
        { name: 'Nick', age: 37, salary: 32000 },
        { name: 'Howie', age: 40, salary: 26000 },
        { name: 'Brian', age: 40, salary: 30000 },
        { name: 'Kevin', age: 47, salary: 24000 },
    ];

    return Observable.create(
        observer => { // 这部分就是subscribe function
            persons.forEach(p => observer.next(p));
            observer.complete();
        }
    );
}
getData()
    .subscribe(
        person => console.log(person.name),
        err => console.error(err),
        () => console.log("Streaming is over.")
    );
```
3. Observable.fromEvent(), 把event转换成Observable.
4. Observable.fromPromise(), 把Promise转换成Observable.
5. Observable.range(), 在指定范围内返回一串数.


6. Subject  就像一个管理者，先制定规则，然后下发规则给目标
7. BehaviorSubject 会接受上一个指令，可以设置一个默认指令
```
import { Subject } from "rxjs/Subject";

const subject = new Subject();

const subscriber1 = subject.subscribe({
    next: (v) => console.log(`observer1: ${v}`)
});
const subscriber2 = subject.subscribe({
    next: (v) => console.log(`observer2: ${v}`)
});

subject.next(1);
subscriber2.unsubscribe();
subject.next(2);

const subscriber3 = subject.subscribe({
    next: (v) => console.log(`observer3: ${v}`)
});

subject.next(3);
```



错误处理的Operators:
error() 被Observable在Observer上调用
catch() 在subscriber里并且在oserver得到它(错误)之前拦截错误,
retry(n) 立即重试最多n次
retryWhen(fn) 按照参数function的预定逻辑进行重试

>常用Operators

concat: 先执行排在前面的数据流，然后合并所有的数据流
merge:谁的数据先过来就先合并
zip：按索引进行合并

mergeMap vs switchMap 当一个数据流里面嵌套一个数据流的时候，在下一次父数据流发送的时候，swithMap就停止发送，但是mergeMap速度太快就挡不住了，还是会发送出去

switchMap更好的例子是: 网速比较慢的时候, 客户端发送了多次重复的请求, 如果前一次请求在2秒内没有返回的话, 那么就取消前一次请求, 不再需要前一次请求的结果了, 这里就应该使用debounceTime配合switchMap.

filter过滤
take(5)表示取5个数
mag 定义最终值
delay延迟
throttleTime(200)每200ms只能通过一个事件
debounceTime(200)数据流不变后200ms方能通过最新的那个事件
takeUntil(stopStream)stopStream这个数据流触发时才生效
scan(count => count + 1, 0)记录流产生新值得次数

# 以下这几个操作符转变成这个样子
do -> tap
catch -> catchError
switch -> switchAll
finally -> finalize

https://cn.rx.js.org/manual/overview.html#h16
# 操作符分类:
创建、转换、过滤、组合、错误处理、工具
创建操作符
ajax
bindCallback
bindNodeCallback
create
defer
empty
from
fromEvent
fromEventPattern
fromPromise
generate
interval
never
of
repeat
repeatWhen
range
throw
timer
转换操作符
buffer
bufferCount
bufferTime
bufferToggle
bufferWhen
concatMap
concatMapTo
exhaustMap
expand
groupBy
map
mapTo
mergeMap
mergeMapTo
mergeScan
pairwise
partition
pluck
scan
switchMap
switchMapTo
window
windowCount
windowTime
windowToggle
windowWhen
过滤操作符
debounce
debounceTime
distinct
distinctKey
distinctUntilChanged
distinctUntilKeyChanged
elementAt
filter
first
ignoreElements
audit
auditTime
last
sample
sampleTime
single
skip
skipLast
skipUntil
skipWhile
take
takeLast
takeUntil
takeWhile
throttle
throttleTime
组合操作符
combineAll
combineLatest
concat
concatAll
exhaust
forkJoin
merge
mergeAll
race
startWith
switch
withLatestFrom
zip
zipAll
多播操作符
cache
multicast
publish
publishBehavior
publishLast
publishReplay
share
错误处理操作符
catch
retry
retryWhen
工具操作符
do
delay
delayWhen
dematerialize
finally
let
materialize
observeOn
subscribeOn
timeInterval
timestamp
timeout
timeoutWith
toArray
toPromise
条件和布尔操作符
defaultIfEmpty
every
find
findIndex
isEmpty
数学和聚合操作符
count
max
min
reduce

4. rxjs
```
import {Observable} from 'rxjs';
  getzidata() {
    return new Observable((Observ)=>{
      setTimeout(() => {//setInterval可以多次执行
        let data = 'woshi';
        Observ.next(data);
        Observ.error('失败');
      }, 1000);
    });
  }


  getdata() {
    this.getzidata().pipe(
      filter((value)=>{
        if(value%2==0){
          return true;
        }
      }),
      map((value)=>{return value*2})
    ).subscribe((d:any)=>{console.log(d)})
    setTimeout(() => {
      a.unsubscribe();//取消订阅
    }, 500);
  }
```

> rxjs通过服务传值
```
export class MyDataService {
//父子组件通过服务通信
  private parMsg = new Subject<string>();
  private sonMsg = new Subject<string>();
  parMsg$ = this.parMsg.asObservable();
  sonMsg$ = this.sonMsg.asObservable();

  parMsgs(msg:string){
    this.parMsg.next(msg);
  }
  sonMsgs(msg:string){
    this.sonMsg.next(msg);
  }
}
<!-- 改变值 -->
  getvalue(e:any){
    setTimeout(() => {
      this.getpath.parMsgs(this.path);
    }, 500);
  }
<!-- 获取值 -->
  constructor(public path: GetpathService) {
    path.parMsg$.subscribe((val) => {
     this.putpath=val;
    })

  }
```