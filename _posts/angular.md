---
title: angular
date: 2019-06-09 11:53:42
tags: 密码记录
categories: 代码
---

# 更新
https://blog.csdn.net/long870294701/article/details/85061915

https://update.angular.io/?l=3&v=11.0-12.0
ng update @angular/cli @angular/core --allow-dirty

ng update @angular/cli @angular/core --allow-dirty

1.查看端口被哪个程序占用
  sudo lsof -i tcp:port
  如： sudo lsof -i tcp:端口号
2.看到进程的PID，可以将进程杀死。
  kill PID（此处是pid号）
  如：kill 30118

chmod -R 777 +文件名+/ 可以修改费文件权限

>必须安装的插件
Angular Language Service
Angular Language Service

> angular 命令
cnpm install -g @angular/cli //angular安装
npm uninstall -g @angular/cli
ng v  //查看版本 
ng new mfhapp //创建项目
ng new mfhapp --skip-install   //跳过npm install安装
ng serve --open //运行项目 打开浏览器
ng serve --port 4203

ng build --port --aot --build-optimizer --vendor-chunk --common-chunka

# 创建组件
ng generate component zc-order/order --module=zc-order //后面加m就是放在components这个模块里面,这样会在moudel.ts文件中自动引入

ng generate component page-not-found --module=app 创建在app目录下
ng generate component zc-order/order-list

# 创建服务
ng g service services/mfhfw  //创建新的组件 

# 创建守卫
ng g guard guard/auth

ng generate module customers --route customers --module app.module 创建一个带路由的特性模块

# 创建路由模块
ng g m login --routing
ng generate module my-module --routing

在 heroes 目录下创建一个带路由的 HeroesModule，并把它注册到根模块 AppModule 中
ng generate module heroes/heroes --module app --flat --routing


ng generate m zc-admin/zc-admin --module app --flat --routing
ng generate m zc-information/zc-information --module app --flat --routing
ng generate m zc-finance/zc-finance --module app --flat --routing
ng generate m zc-shoping/zc-shoping  --module app --flat --routing

启动以下命令用npm run start
"scripts": {
  "ng": "ng",
  "start": "ng serve --port 4203 --env=dev",
  "build": "ng build --env=prod",
  "test": "ng test",
  "lint": "ng lint",
  "e2e": "ng e2e"
},

> devDependencies
(1)内容：是一个对象，配置模块依赖的模块列表，key是模块名称，value是版本范围
(2)作用：该模块中所列举的插件属于开发环境的依赖（比如：测试或者文档框架等）
(3)部署来源：通过你npm install进行依赖安装时加上-save-dev，devDependencies对象中便会增加echarts安装配置，实例安装echarts依赖代码如下
npm install echarts -save-dev

> dependencies 
(1)内容：是一个对象，配置模块依赖的模块列表，key是模块名称，value是版本范围
(2)作用：该模块中所列举的插件属于生产环境的依赖（程序正常运行需要加载的依赖）
(3)部署来源：通过你npm install进行依赖安装时加上-save，dependencies对象中便会增加echarts安装配置，实例安装echarts依赖代码如下
npm install echarts -save


> app.moudle.ts  //angular 的根模块，告诉angular如何组装
```
//引入浏览器解析的模块
import { BrowserModule } from '@angular/platform-browser';
//angular的核心模块
import { NgModule } from '@angular/core';
//路由模块
import { AppRoutingModule } from './app-routing.module';
//根组件
import { AppComponent } from './app.component';

@NgModule({
  declarations: [//配置当前项目运行的组件
    AppComponent
  ],
  imports: [//配置当前模块运行依赖的其他模块
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],//配置项目所需要的服务
  bootstrap: [AppComponent]//配置应用主视图
})
export class AppModule { }//根模块不需要导出任何东西，因为其他模块不需要引入根模块
```
> 数据绑定到html
>数据绑定到html中标签的属性
```
public content:stringh ="<h4>我是属性绑定</H4>" 
<span [title]='content'></span>
<span [innerHTML]='content'></span>//这样会吧标签编译出来 
{{content}}//直接输出的话会把标签一起输出
{{1+2}}//可以做基本的计算
```
>数据循环
```
let arr:number[]=[2,3,4]
<ul>
    <li *ngFor='let item of arr;let key = index'>
   {{key}} {{item}}
        <li *ngFor='let lst of item.list'>
             {{lst}}
        </li>
    </li>
</ul>
```
> 引入图片
```
<img [src]='imgurl' alt=''>
<img src='assets/imsgas/01.jpg' alt=''>
```
> 判断语句
```
<dic *ngIf='!flag'></dic>
```
> 条件判断
```
<ul [ngSwitch]='score'>
    <li *ngSwitchCase='1'>已支付</li>
    <li *ngSwitchCase='2'>未支付</li>
    <li *ngSwitchDefault='2'>未支付</li>
</ul>
```
> [ngClass]和[ngStyle]
```
<dic [ngClass]="{'getred':flag,'getblue':!flag}"></dic>
 [class.selected]="hero.id === selectedId">

let color:string='red';
<dic [ngStyle]="{'color',color}"></dic>
```
>管道
```
1. 新建一个管道文件
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'exponentialStrength'})
export class ExponentialStrengthPipe implements PipeTransform {
  transform(value: number, exponent?: number): number {
    return Math.pow(value, isNaN(exponent) ? 1 : exponent);
  }
}

2. 在app.moudle.ts,中挂载
3.使用
<p>Super power boost: {{2 | exponentialStrength: 10}}</p>
```
> click
```
<input type="text" (keydown)='keyDown($event)'>
keyDown(e){
    if(e.keycod==13){
        cosole.log('你按了一下回车')
    }else{
        cosole.log(e.target.value)
    }
}
```
监听输入停止
keyword(newVal){
        if(this.lastTime == 0){ 
          this.lastTime = setTimeout(()=>{
            // AJAX(newVal)
          },2000)
        }else{
          clearTimeout(this.lastTime)
          this.lastTime = setTimeout(()=>{
            // AJAX(newVal)
          },2000)
        }
}
https://blog.csdn.net/Forforfor3/article/details/85993736

change(e){
  clearTimeout(this.timer);
  this.timer=setTimeout(()=>{
      <!-- 代码 -->
  },400)
},

> from

> 双向数据绑定
先要在app.moudle.ts 中引入formmoudl才能使用
import { FormsModule } from '@angular/forms'; 
```
  public peopelInfo:any={
    name:' ',
    sex:'1',
    citylist:['北京','上海','广州'],
    city:'北京',
    hobby:[
      {
        title:'吃饭',
        check:true
      },
      {
        title:'睡觉',
        check:false
      },
    ],
    text:'sdfe'
  }

  getInfo():void{
    let dom :any= document.getElementById('input');
    console.log(dom.value);
    console.log(this.peopelInfo)
  }

  <div>
    <input type="text" [(ngModel)]='peopelInfo.name' value="fedfs" id="input">
    <br>
    <input type="radio" value="1" id="nv" [(ngModel)]='peopelInfo.sex'><label for="nv">女</label>
    <input type="radio" value="2" id="na" [(ngModel)]='peopelInfo.sex'><label for="na">男</label>
    <select name="city" id="city" [(ngModel)]='peopelInfo.city'>
        <option [value]="item" *ngFor="let item of peopelInfo.citylist">{{item}}</option>
    </select>
    <!-- <select name="" id="">
        <option value=" "> </option>
        <option value="he">he</option>
        <option value="xi">xi</option>
    </select> -->

    <span *ngFor="let item of peopelInfo.hobby;let key = index;">
        <input type="checkbox" [id]="key+'-check'" [(ngModel)]="item.check">  <label [for]="key+'-check'">{{item.title}} </label>
    </span>
    <textarea name="" id="" cols="30" rows="10" [(ngModel)]="peopelInfo.text"></textarea>
    <pre>
        {{peopelInfo | json}}
    </pre>
    <button (click)='getInfo()'>获取数据</button>
</div>
```

>父组件传值和方法到子组件
```
1. 直接把父组件全部传值过去(暴力传值)
<app-frist [home]='this'></app-frist>

1.//父组件定义值
  public title:string = '我是首页标题';
  run(){
    alert('我是父组件的方法')
  }
2.//绑定到子组件上
<app-frist [title4]='title' [run]='run'></app-frist>
3.//子组件接受父组件的值
  @Input() title4:string='';
  @Input() run:any='';
4.//在子组件中实现
    <p>
        {{title4}}
    </p>
    <button (click)='getparentrun()'>执行父组件的方法</button>
```
>父组件调用子组件的方法和属性
```
// 定义子组件的指定名称
<app-frist #zzj></app-frist>
//获取整个子组件
  @ViewChild('zzj') zjj:any;
  getzidata():void{
    console.log(this.zjj.msg);
    this.zjj.msgrun();
  }

```
>子组件发射数据到父组件
```
//子组件定义发射方法
 <button (click)='outmsg()'>发射子组件数据</button>
//开始发射
 @Output() public omsg = new EventEmitter();
   outmsg(){
    this.omsg.emit(this.msg+'oij');
  }
//定义接收的方法
  <app-frist (omsg)='getzidata($event)'></app-frist>
//接收数据
  getzidata(e:any):void{
    console.log(e);
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


> 异步编辑的几种方法
1. 回调函数
```
  getzidata(cd:any){
    setTimeout(() => {
      let data= 'woshi';
      cd(data);
    }, 1000);
  }

  getdata(){
    this.getzidata((d:any)=>{console.log(d)})
  }

```
2. 事件监听和发布
3. promise
```
  getzidata() {
    return new Promise((resolve: any, reject: any)=>{
      setTimeout(() => {
        let data = 'woshi';
        resolve(data);
      }, 1000);
    });
  }


  getdata() {
    this.getzidata().then((d:any)=>{console.log(d)})
  }
```
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
> 数据请求
```
import { HttpClientModule } from '@angular/common/http'; app.moudle.ts

import { HttpClient,HttpHeaders } from '@angular/common/http'; 使用文件中
  constructor(public Http:HttpClient){}
  getdata(){
    let api ='https://www.baidu.com/s?ie=UTF-8&wd=baidu';
    this.Http .get(api).subscribe((response:any)=>{
      console.log(response)
    })
  }
  post(){
    const  httpoption= {header:new HttpHeaders({'Content-type':'application/json'})} 
    let api ='https://www.baidu.com/s?ie=UTF-8&wd=baidu';
    let data:any={
      name:'ew',
      age:'9'
    };
    this.Http.post(api,data,httpoption).subscribe((response:any)=>{
      console.log(response)
    })
  }

import { HttpClientModule,HttpClientJsonpModule } from '@angular/common/http';
    getjsonp(){
    let api ='https://www.baidu.com/s?ie=UTF-8&wd=baidu';
    this.Http .jsonp(api,'callback').subscribe((response:any)=>{
      console.log(response)
    })
  }
}
```
> 第三方插件请求
```
cnpm installl axios --save
import axios from axios;

```

路由封装
https://blog.csdn.net/weixin_40127083/article/details/104588122
> 路由  https://www.cnblogs.com/starof/p/9012193.html这里的路由配置可以学一学
```
设置默认页面
  { path: '',   redirectTo: '/heroes', pathMatch: 'full' },设置默认页面
  { path: '**', component: PageNotFoundComponent } 设置404页面

{path:'frist',component:FristComponent},
{path:'**',redirectTo:'second'},
<a href="" [routerLink]="['/frist']" routerLinkActive="router-link-active" >frist</a>

> 路由出口
<router-outlet></router-outlet>
<router-outlet name="popup"></router-outlet>
{
  path: 'compose',
  component: ComposeMessageComponent,
  outlet: 'popup'
},
<a [routerLink]="[{ outlets: { popup: ['compose'] } }]">Contact</a>
https://lkdkaevkrkq.angular.stackblitz.io/crisis-center(popup:compose) //路径变成了这样
closePopup() {

this.router.navigate([{ outlets: { popup: null }}]);
}//这个方法可以清除这路由里面的东西

get路由 传值
<a href="" [routerLink]="['/frist']" [queryParams]="{aid:2}" >frists</a>
//默认选择 默认激活路由
<a routerLink="./" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Dashboard</a>

constructor(public routed:ActivatedRoute ) { }
let a =this.routed.queryParams.subscribe((d)=>{
    console.log(d);
})
动态路由传值2
  {path:'second/:aid',component:SecondComponent},
  <a href="" [routerLink]="['/second/', '2']" routerLinkActive="router-link-active">seconds</a>
  import { ActivatedRoute } from '@angular/router';
  constructor(public routed:ActivatedRoute) { }
  let a =this.routed.params.subscribe((d)=>{
    console.log(d);
})

js跳转路由
只能用在普通路由和动态路由 
import { ActivatedRoute } from '@angular/router';
import { Router,NavigationExtras} from '@angular/router';
constructor(public Routed:Router) { }
1. this.Router.navigate(['/second/','123']);

this.router.navigate(['/heroes', { id: heroId, foo: 'foo' }]);同级路由返回
this.router.navigate(['../', { id: crisisId, foo: 'foo' }], { relativeTo: this.route });子级路由返回

2. let queryparams:ActivatedRoute={
    queryParams:{'aid':'122'},//参数
    fragment: 'anchor' //锚点
    <!-- preserveFragment默认为false，设为true，保留之前路由中的锚点/home#top to /role#top -->
}
this.Router.navigate(['/second/'],queryparams); //使用这个时，必须引入NavigationExtras

3. this.router.navigate(['/common/a']);
// 或 this.router.navigateUrl('common/a');

子路由
  {
    path:'frist',
    component:FristComponent,
    children:[
      {path:'second/:aid',component:SecondComponent},
        {path:'**',redirectTo:'second'},
    ]
  },

无组件路由。
    path: '',
children: [
    { path: 'crises', component: ManageCrisesComponent },
    { path: 'heroes', component: ManageHeroesComponent },
    { path: '', component: AdminDashboardComponent }
]
```

>惰性加载
app.module.ts中
imports: [
  BrowserModule,
  FormsModule,
  HeroesModule,
  AppRoutingModule //根路由必须放置在最后
],

>添加路由动画
1. app.module.ts中引入
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { slideInAnimation } from './animations';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  animations: [ slideInAnimation ]
})

2. 路由中
  { path: 'heroes',  component: HeroListComponent, data: { animation: 'heroes' } },
  { path: 'hero/:id', component: HeroDetailComponent, data: { animation: 'hero' } }

3. 创建animations.ts
 ```
import {
  trigger, animateChild, group,
  transition, animate, style, query
} from '@angular/animations';

export const slideInAnimation =
  trigger('routeAnimation', [
    transition('heroes <=> hero', [
      style({ position: 'relative' }),
      query(':enter, :leave', [
        style({
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%'
        })
      ]),
      query(':enter', [
        style({ left: '-100%'})
      ]),
      query(':leave', animateChild()),
      group([
        query(':leave', [
          animate('300ms ease-out', style({ left: '100%'}))
        ]),
        query(':enter', [
          animate('300ms ease-out', style({ left: '0%'}))
        ])
      ]),
      query(':enter', animateChild()),
    ])
  ]);
 ```
4. app.component.ts中
export class AppComponent {
  getAnimationData(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
5. app.component.html中
```
<div [@routeAnimation]="getAnimationData(routerOutlet)">
  <router-outlet #routerOutlet="outlet"></router-outlet>
</div>
```

> 路由守卫
用CanActivate来处理导航到某路由的情况。
用CanActivateChild来处理导航到某子路由的情况。
用CanDeactivate来处理从当前路由离开的情况.
用Resolve在路由激活之前获取路由数据。
用CanLoad来处理异步导航到某特性模块的情况。
1. ng generate guard auth/auth //创建守卫
```
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    console.log('AuthGuard#canActivate called');
    return true;
  }
    canActivateChild( //保护子路由
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): true|UrlTree {
    return this.canActivate(route, state);
  }

  canLoad(route: Route): boolean {//添加一个 CanLoad 守卫，它只在用户已登录并且尝试访问管理特性区的时候，才加载 AdminModule 一次。不然的会未登录也是会加载这个组件的
    const url = `/${route.path}`;
    return this.checkLogin(url);
    }

路由配置
<!-- {
  path: 'admin',
  loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  canLoad: [AuthGuard]
}, -->

  checkLogin(url: string): boolean {
    if (this.authService.isLoggedIn) { return true; }
    this.authService.redirectUrl = url;
    const sessionId = 123456789;
    const navigationExtras: NavigationExtras = {
      queryParams: { session_id: sessionId },
      fragment: 'anchor'
    };
    this.router.navigate(['/login'], navigationExtras);
    return false;
  }
}
```
2. 写入路由中
```
const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        canActivateChild: [AuthGuard],
        children: [
          { path: 'crises', component: ManageCrisesComponent },
        ]
      }
    ]
  }
];
```
> canDeactivate
1. 固定写法
```
import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
 canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CanDeactivateGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
```
2. 组件中调用这个方法
```  
canDeactivate(): Observable<boolean> | boolean {
    // Allow synchronous navigation (`true`) if no crisis or the crisis is unchanged
    if (!this.crisis || this.crisis.name === this.editName) {
      return true;
    }
    // Otherwise ask the user with the dialog service and return its
    // observable which resolves to true or false when the user decides
    return this.dialogService.confirm('Discard changes?');
  }
```  
3. 路由配置         
 path: ':id',
component: CrisisDetailComponent,
canDeactivate: [CanDeactivateGuard]

> Resolve: 预先获取组件数据
1. ng generate service crisis-center/crisis-detail-resolver
```
import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { CrisisService } from './crisis.service';
import { Crisis } from './crisis';

@Injectable({
  providedIn: 'root',
})
export class CrisisDetailResolverService implements Resolve<Crisis> {
  constructor(private cs: CrisisService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Crisis> | Observable<never> {
    const id = route.paramMap.get('id');

    return this.cs.getCrisis(id).pipe(
      take(1),
      mergeMap(crisis => {
        if (crisis) {
          return of(crisis);
        } else { // id not found
          this.router.navigate(['/crisis-center']);
          return EMPTY;
        }
      })
    );
  }
}
```
2. 路由配置
```
path: ':id',
component: CrisisDetailComponent,
canDeactivate: [CanDeactivateGuard],
resolve: {
    crisis: CrisisDetailResolverService
}
```
3. 获取数据
```
ngOnInit() {
  this.route.data
    .subscribe((data: { crisis: Crisis }) => {
      this.editName = data.crisis.name;
      this.crisis = data.crisis;
    });
}
```

> 预加载功能。
```
app-routing.module.ts中，这项配置会让 Router 预加载器立即加载所有惰性加载路由（带 loadChildren 属性的路由）
RouterModule.forRoot(
  appRoutes,
  {
    enableTracing: true, // <-- debugging purposes only
    preloadingStrategy: PreloadAllModules
  }
)

自定义预加载策略
1.
{
  path: 'crisis-center',
  loadChildren: () => import('./crisis-center/crisis-center.module').then(m => m.CrisisCenterModule),
  data: { preload: true }
},

2. 创建 ng generate service selective-preloading-strategy

import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SelectivePreloadingStrategyService implements PreloadingStrategy {
  preloadedModules: string[] = [];

  preload(route: Route, load: () => Observable<any>): Observable<any> {
    if (route.data && route.data.preload) {
      // add the route path to the preloaded module array
      this.preloadedModules.push(route.path);

      // log the route path to the console
      console.log('Preloaded: ' + route.path);

      return load();
    } else {
      return of(null);
    }
  }
}
```


> 动画的使用
1. 导入import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
2. ts中或者动画文件中
import { Component, HostBinding } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  animations: [
    trigger('childAnimation', [
      // ...
      state('open', style({
        width: '250px',
        opacity: 1,
        backgroundColor: 'yellow'
      })),
      state('closed', style({
        width: '100px',
        opacity: 0.5,
        backgroundColor: 'green'
      })),
      transition('* => *', [
        animate('1s')
      ]),
    ]),
  ],
})
4. 模板中
```
  <div [@childAnimation]="isOpen ? 'open' : 'closed'"
    class="open-close-container">
    <p>The box is now {{ isOpen ? 'Open' : 'Closed' }}!</p>
  </div>
```
使用带样式的通配符状态
使用带样式的 * 通配符来告诉动画使用当前的状态值
星号 * 或者叫通配符可以匹配任何一个动画状态
:enter 和 :leave 分别是 void => * 和 * => void 的别名。 这些别名供多个动画函数使用。
transition() 函数还能接受额外的选择器值：:increment 和 :decrement。当数值增加或减小时

onAnimationEvent 动画回调

你可以在组件类中导入这个可复用的 transAnimation 变量，并通过 useAnimation() 方法来复用它
export const transAnimation = animation([
  style({
    height: '{{ height }}',
    opacity: '{{ opacity }}',
    backgroundColor: '{{ backgroundColor }}'
  }),
  animate('{{ time }}')
]);

多个状态变化
transition('* => active', [
  animate('2s', keyframes([
    style({ backgroundColor: 'blue' }),
    style({ backgroundColor: 'red' }),
    style({ backgroundColor: 'orange' })
  ]))

# 表单
```
1.引入
import { FormBuilder,Validators} from '@angular/forms';
2.生成
ngOnInit(): void {
this.adddata = this.fb.group({
    name:['',Validators.required],
    num:['',Validators.required],
    remark:[''],
  })
}
3.模块中使用
<form [formGroup]="adddata" (ngSubmit)="onSubmit()">
  <div class="form-group">
    
    <label for="name">Name</label>
    <input id="name" class="form-control"
          formControlName="name" required >

    <div *ngIf="name.invalid && (name.dirty || name.touched)"
        class="alert alert-danger">

      <div *ngIf="name.errors.required">
        Name is required.
      </div>
      <div *ngIf="name.errors.minlength">
        Name must be at least 4 characters long.
      </div>
      <div *ngIf="name.errors.forbiddenName"> 这种传值方式//return forbidden ? {forbiddenName: {value: control.value}} : null;
        Name cannot be Bob.
      </div>
      <div *ngIf="alterEgo.errors?.uniqueAlterEgo">//因为传值的方式不同 isTaken ? { uniqueAlterEgo: true } : null)
          {{alterEgo.errors|json}}
          Alter ego is already taken.
      </div>
    </div>
  </div>

  <button type="submit" [disabled]="!adddata.valid">Submit</button>
</form>

<!-- 获取值 -->
his.adddata.value

3.自定义提示字段
要设置
  get name():any{ return this.adddata.get('name'); }

name.invalid/dirty/touched  name输入框非法时，修改时，触摸时
name.errors.forbiddenName 这里的forbiddenName是自定义传过来的对象

export function forbiddenNameValidator(nameRe: RegExp): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const forbidden = nameRe.test(control.value);
    return forbidden ? {forbiddenName: {value: control.value}} : null;
  };
}

异步
<input [(ngModel)]="name" [ngModelOptions]="{updateOn: 'blur'}">

      alterEgo: new FormControl(this.hero.alterEgo, {
        asyncValidators: [this.alterEgoValidator.validate.bind(this.alterEgoValidator)],
        updateOn: 'blur'
      }),

  validate(
    ctrl: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return this.heroesService.isAlterEgoTaken(ctrl.value).pipe(
      map(isTaken => (isTaken ? { uniqueAlterEgo: true } : null)),
      catchError(() => of(null))
    );
  }
```


>本地存储https://blog.csdn.net/mafan121/article/details/60133107
```
    localStorage.setItem(key,JSON.stringify(value))
    let a:any=JSON.parse(localStorage.getItem(key))
    localStorage.removeItem(key)
```


> 配合thinkphp
composer create-project topthink/think tp

打包的时候报错
https://blog.csdn.net/m0_37682004/article/details/115001613
手动运行 node node_modules/esbuild/install.js 来解决esbuild安装问题。

    "build": "ng build --deployUrl /static/",  //设置js的路径
    <base href="/static/">  设置静态资源的路径

    <base href="./">  这样设置可以保障打包之后可以找到路径，不需要设置build

    1. Angular中，html中的路径要写成开头不带/的绝对路径。比如
    <img src="assets/hello.png">
    2.Angular中，CSS中的路径要写成相对路径，比如
    background-image: url('../../assets/hhh.png');
    3.Angular项目ng build编译后的index.html中的base ref要设置为空，即
    <base href="">

> 本地测试跨域问题
https://blog.csdn.net/zhouyingge1104/article/details/80785527
https://blog.csdn.net/hbiao68/article/details/84748159

重点
https://blog.csdn.net/m0_46266407/article/details/106424060?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522163075552916780357292862%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=163075552916780357292862&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-1-106424060.first_rank_v2_pc_rank_v29&utm_term=php%E8%B7%A8%E5%9F%9F%E8%A7%A3%E5%86%B3%E6%96%B9%E6%A1%88&spm=1018.2226.3001.4449

https://blog.csdn.net/jeason13920089655/article/details/103883566?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.control&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7ECTRLIST%7Edefault-1.control
1. 在项目根目录下新建文件 proxy.config.json，内容如下：
{
  "/mail": {
    "target":"http://localhost:3000",
    "secure":false,
    "logLevel":"debug",
    "changeOrigin":true
  }
}
访问 http://localhost:4200/mail/upload 就会转为 http://localhost:3000/mail/upload
2. package.json中，scripts -> start , 改为：ng serve --proxy-config proxy.config.json

# ngif模板写法
```
    <button nz-button (click)='selfnum()' nzType="link" *ngIf="!getnum;else self">自定义工令号</button>
    <ng-template #self>
      <button nz-button (click)='selfnum()' nzType="link">自动更新工令号</button>
    </ng-template>
```

this.listOfCurrentPageData.forEach(({ id }) => this.updateCheckedSet(id, checked));


# x在项目中修改ng-zorro组件默认样式的一些方法：
https://blog.csdn.net/menghuannvxia/article/details/89572021?utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control&dist_request_id=1329188.22641.16179557379966127&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromMachineLearnPai2%7Edefault-1.control
类名等 前加::ng-deep；
类名等 前加：root；
类名等 前加:host /deep/；

# 导入数据https://www.jianshu.com/p/a67c0461181b
# 导出数据https://blog.csdn.net/qq_39785489/article/details/80063129
https://www.cnblogs.com/lucky-heng/p/11013335.html
```
  beforeUpload = (file:any): boolean => {
    if (file) {
      const fileName = file.name;//获取文件名
      const reader: FileReader = new FileReader();//FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件
      //当读取操作成功完成时调用FileReader.onload 
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });      
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname]; 
        console.log(XLSX.utils.sheet_to_json(ws, { header: 1 }));  
        // this.importUserList = XLSX.utils.sheet_to_json(ws, { header: 1 });//解析出文件数据，可以进行后面操作
        // this.importUserHeader =  this.importUserList[0];//获得表头字段
        // this.fileList = this.fileList.concat(file);
      };
      reader.readAsBinaryString( file );
    }
    return false;
  }
```
#
还有在验证部分涉及到的方法也没有详细的说明，但是项目中有所涉及。如markAsDirty()是将表单控件值标记为已改变、markAsPristine()是将表单控件值标记为未改变，这个方法主要用在表单重置时、updateValueAndValidity()是重新计算表单控件的值和验证状态等。

# 阻止冒泡
https://www.cnblogs.com/yaohe/p/11132286.html
```
<div ng-click="ratioTab(2,$event);$event.stopPropagation();">tab2</div>
// Js 方法内阻止
$scope.ratioTab(num,$event){
       $event.stopPropagation();//阻止冒泡
      $event.preventDefault();// 阻止默认行为 
//your coding
}

```

# angular7中使用echarts
<!-- 文档 -->
https://echarts.apache.org/zh/option.html#xAxis.type

https://blog.csdn.net/yw00yw/article/details/99313475?ops_request_misc=%7B%22request%5Fid%22%3A%22162927167816780255288561%22%2C%22scm%22%3A%2220140713.130102334..%22%7D

https://blog.csdn.net/m0_46270930/article/details/119187404?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522162927271316780271592161%2522%252C%2522scm%2522%253A%252220140713.130102334.pc%255Fall.%2522%257D&request_id=162927271316780271592161&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~first_rank_v2~rank_v29-1-119187404.first_rank_v2_pc_rank_v29&utm_term=The+target+entry-point+%22ngx-echarts%22+has+missing+dependencies%3A++-+%40juggle%2Fresize-observer&spm=1018.2226.3001.4187


highlightJS插件
https://blog.csdn.net/qq_33745102/article/details/87125217

https://highlightjs.org/download/

主题
https://github.com/highlightjs/highlight.js/tree/main/src/styles