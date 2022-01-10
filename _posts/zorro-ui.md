---
title: zorro-ui.md
date: 2019-05-14 09:59:22
tags: zorro-ui.md
categories: 代码
---
https://ng.ant.design/components/icon/zh#api

# 安装
cnpm install ng-zorro-antd --save

# 配置
1. 在app目录下创建ng-zorro-antd.module.ts
```
import { NgModule } from '@angular/core';
@NgModule({
  exports: [
  
  ]
})
export class DemoNgZorroAntdModule {

}
```
# 如果是报加载错误，需要重新启动服务
2. // 在app.moudle.ts 中引入zorro组件
import { DemoNgZorroAntdModule } from './ng-zorro-antd.module';

如果需要动画还需要在app.moudle.ts 中引入BrowserAnimationsModule
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

# 如果需要覆盖样式
::ng-deep

# 解决页面闪现的问题
先隐藏最外面的div 在ngOnInit中显示

# 图标加载

1. 动态加载
  "assets": [
    {
      "glob": "**/*",
      "input": "./node_modules/@ant-design/icons-angular/src/inline-svg/",
      "output": "/assets/"
    }
2. 静态加载请查考文档

# 按钮
import { NzButtonModule } from 'ng-zorro-antd/button';
nzType 按钮类型'primary'|'dashed'|'link'|'text'
nzShape 按钮形状'circle'|'round'
nzSize 按钮大小'large'|'small'|'default'
disabled 禁止状态 true|false
nzLoading 加载状态 true|false
nzGhost 背景透明 true|false
nzDanger 设置危险按钮 true|false
nzBlock 将按钮宽度调整为其父宽度的选项 true|false
```
<button nz-button nzType="primary" nzSize="large" nzShape="circle"><i nz-icon nzType="search"></i></button>
```
```
组合按钮 支持 [nzSize]
<nz-button-group>
    <button nz-button>Cancel</button>
    <button nz-button nzType="primary">OK</button>
</nz-button-group>
```
# 图标
import { NzIconModule } from 'ng-zorro-antd/icon';
[nzType]	 类型
[nzTheme]    主题'fill'丨'outline'丨'twotone'
[nzSpin] 	是否有旋转动画 true|false
[nzTwotoneColor] 双色图标 只实用于主题towtone的
<i nz-icon nzType="down-circle" nzTheme="twotone" [nzTwotoneColor]="'#eb2f96'" nzSpin></i>

# 排版
import { NzTypographyModule } from 'ng-zorro-antd/typography';
使用的时候加上 nz-typography
```
<p nz-typography nzCopyable [nzCopyTooltips]="null" nzContent="Hide copy tooltips."></p>
```
1. 其他设置
[nzContent] 绑定模型中的数据，显示的数据
[nzType] 设置类型 'secondary' | 'warning' | 'danger' | 'success'
[nzSuffix]  设置同一后缀
[nzDisabled]	禁用文本
2. 省略
[nzEllipsis] 设置超出省略
[nzEllipsisRows]	自动溢出省略时省略行数
(nzOnEllipsis)	当省略状态变化时触发
3. 展开
[nzExpandable] 展开  
[nzEllipsisRows]="3" 设置显示的行数
(nzExpandChange)	展开省略文本时触发
4. 编辑
[nzEditIcon]  编辑   
[nzEditIcon]	自定义编辑图标
[nzEditTooltip]	自定义提示文案，为 null 时隐藏文案
(nzContentChange)	当用户提交编辑内容时触发
5. 复制
[nzCopyable] 复制  
[nzCopyText]	自定义被拷贝的文本
[nzCopyIcons]	自定义拷贝图标
[nzCopyTooltips] 自定义拷贝的提示气泡 null | [string | TemplateRef<void>, string | TemplateRef<void>]

# 分割线
import { NzDividerModule } from 'ng-zorro-antd/divider';
<nz-divider nzPlain nzText="Text"></nz-divider>
[nzDashed]	是否虚线	boolean	false
[nzType]	水平还是垂直类型	'horizontal' | 'vertical'	'horizontal'
[nzPlain]	文字是否显示为普通正文样式	boolean	false
[nzText]	中间文字	string | TemplateRef<void>	-
[nzOrientation]	中间文字方向	'center' | 'left' | 'right'	'center'


# 栅格
import { NzGridModule } from 'ng-zorro-antd/grid';
nz-row共24格,nzSpan="8"代表3格,c超过的部分会作为一个整体另起一行排列
```
<div nz-row [nzGutter]="16">
      <div nz-col class="gutter-row" [nzSpan]="6"><div class="inner-box">col-6</div></div>
</div>
```
1. [nz-row]中的参数
[nzAlign]	垂直对齐方式	'top' | 'middle' | 'bottom'	-
[nzGutter]	栅格间隔，可以写成像素值或支持响应式的对象写法来设置水平间隔 { xs: 8, sm: 16, md: 24}。或者使用数组形式同时设置 [水平间距, 垂直间距]。	number|object|[number, number]|[object, object]	-
[nzJustify]	水平排列方式	'start' | 'end' | 'center' | 'space-around' | 'space-between'
2. [nz-col]中的参数
[nzFlex]	flex 布局属性	string | number	-
[nzOffset]	栅格左侧的间隔格数，间隔内不可以有栅格	number	-
[nzOrder]	栅格顺序	number	-
[nzPull]	栅格向左移动格数	number	-
[nzPush]	栅格向右移动格数	number	-
[nzSpan]	栅格占位格数，为 0 时相当于 display: none	number	-

# 布局
import { NzLayoutModule } from 'ng-zorro-antd/layout';
1. layout相当于一个容器，其他的都是inline-block行标签
```
<nz-layout>
    <nz-sider>Sider</nz-sider>
    <nz-layout>
    <nz-header>Header</nz-header>
    <nz-content>Content</nz-content>
    <nz-footer>Footer</nz-footer>
    </nz-layout>
</nz-layout>
```
2. nz-sider中
<!-- 这个属性代表在某个宽度的时候会把sider的宽度变成0 -->
[nzBreakpoint]	触发响应式布局的断点	'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl'	-

[nzCollapsedWidth]	收缩宽度，设置为 0 会出现特殊 trigger	number	64
[nzWidth]	宽度	number | string	200
[nzTheme]	主题颜色	'light' | 'dark'	dark

<!-- 右侧收起来的：先把默认的trigger隐藏，然后改变nzCollapsed的状态 -->
[nzCollapsible]	是否可收起	boolean	false
[nzTrigger]	自定义 trigger，设置为 null 时隐藏 trigger	TemplateRef<void>	-
[nzCollapsed]	当前收起状态，可双向绑定	boolean	false
<!-- 这个方向是是设置默认的trigger -->
[nzReverseArrow]	翻转折叠提示箭头的方向，当 Sider 在右边时可以使用	boolean	false
[nzZeroTrigger]	自定义 nzCollapsedWidth 为 0 时的 特殊trigger	TemplateRef<void>	-
(nzCollapsedChange)	展开-收起时的回调函数	EventEmitter<boolean>	-

# 间距
import { NzSpaceModule } from 'ng-zorro-antd/space';
```
<nz-space>
    <nz-space-item>
    <button nz-button nzType="primary">Button</button>
    </nz-space-item>
</nz-space>
```
[nzSize]	间距大小	small	middle	large
[nzDirection]	间距方向	vertical	horizontal	horizontal
[nzAlign]	对齐方式	start	end	baseline

# 固定窗口
import { NzAffixModule } from 'ng-zorro-antd/affix';
```
<div class="scrollable-container" #target>
    <div class="background">
    <nz-affix [nzTarget]="target" id="affix-container-target">
        <button nz-button [nzType]="'primary'">
        <span>Fixed at the top of container</span>
        </button>
    </nz-affix>
    </div>
</div>
```
[nzOffsetBottom]	距离窗口底部达到指定偏移量后触发	number	-	
[nzOffsetTop]	距离窗口顶部达到指定偏移量后触发	number	0	
<!-- 绑定一个 #name 就可以改变绑定窗口，默认的是窗口 -->
[nzTarget]	设置 nz-affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数	string | HTMLElement	window	
(nzChange)	固定状态改变时触发的回调函数	EventEmitter<boolean>	-

# 表格
1. table
[nzData]	数据数组	any[]	-	
<!-- 分页 -->
[nzFrontPagination]	是否在前端对数据进行分页，如果在服务器分页数据或者需要在前端显示全部数据时传入 false	boolean	true	
[nzTotal]	当前总数据，在服务器渲染时需要传入	number	-	
[nzPageIndex]	当前页码，可双向绑定	number	-	
[nzPageSize]	每页展示多少数据，可双向绑定	number	-	
[nzShowPagination]	是否显示分页器	boolean	true	
[nzPaginationPosition]	指定分页显示的位置	'top' | 'bottom' | 'both'	bottom	
[nzPaginationType]	指定分页显示的尺寸	'default' | 'small'	default	
[nzItemRender]	用于自定义页码的结构，用法参照 Pagination 组件	TemplateRef<{ $implicit: 'page' | 'prev' | 'next', page: number }>	-	
[nzShowTotal]	用于显示数据总量和当前数据范围，用法参照 Pagination 组件	TemplateRef<{ $implicit: number, range: [ number, number ] }>	-	
[nzPageSizeOptions]	页数选择器可选值	number[]	[ 10, 20, 30, 40, 50 ]	
[nzShowQuickJumper]	是否可以快速跳转至某页	boolean	false	✅
[nzShowSizeChanger]	是否可以改变 nzPageSize	boolean	false	✅
[nzHideOnSinglePage]	只有一页时是否隐藏分页器	boolean	false	✅
[nzSimple]	当添加该属性时，显示为简单分页	boolean	-	✅
(nzPageIndexChange)	当前页码改变时的回调函数	EventEmitter<number>	-	
(nzPageSizeChange)	页数改变时的回调函数	EventEmitter<number>	-	
(nzQueryParams)	当服务端分页、筛选、排序时，用于获得参数，具体见示例	EventEmitter<NzTableQueryParams>	-
<!-- 边框 -->
[nzBordered]	是否展示外边框和列边框	boolean	false	✅
[nzOuterBordered]	是否显示外边框	boolean	false	-

[nzWidthConfig]	表头分组时指定每列宽度，与 th 的 [nzWidth] 不可混用	string[]	[]	
[nzSize]	正常或迷你类型	'middle' | 'small' | 'default'	'default'	✅
<!-- 加载效果 -->
[nzLoading]	页面是否加载中	boolean	false	
[nzLoadingIndicator]	加载指示符	TemplateRef<void>	-	✅
[nzLoadingDelay]	延迟显示加载效果的时间（防止闪烁）	number	0	
<!-- 滚动 -->
[nzScroll]	横向或纵向支持滚动，也可用于指定滚动区域的宽高度：{ x: "300px", y: "300px" }	object	-	
[nzVirtualForTrackBy]	虚拟滚动数据 TrackByFunction 函数	TrackByFunction<T>	-	
<!-- 其他显示 -->
[nzTitle]	表格标题	string | TemplateRef<void>	-	
[nzFooter]	表格尾部	string | TemplateRef<void>	-	
[nzNoResult]	无数据时显示内容	string | TemplateRef<void>	-	

[nzTemplateMode]	模板模式，无需将数据传递给 nzData	boolean	false	
[nzVirtualItemSize]	虚拟滚动时每一列的高度，与 cdk itemSize 相同	number	0	
[nzVirtualMaxBufferPx]	缓冲区最大像素高度，与 cdk maxBufferPx 相同	number	200	
[nzVirtualMinBufferPx]	缓冲区最小像素高度，低于该值时将加载新结构，与 cdk minBufferPx 相同	number	100	
<!-- 数据改变时候回调 -->
(nzCurrentPageDataChange)	当前页面展示数据改变的回调函数	EventEmitter<any[]>	-	

2. th
<!-- 勾选属性 -->
[nzShowCheckbox]	是否添加checkbox	boolean	-
[nzDisabled]	checkbox 是否禁用	boolean	-
[nzIndeterminate]	checkbox indeterminate 状态	boolean	-
[nzChecked]	checkbox 是否被选中，可双向绑定	boolean	-
(nzCheckedChange)	选中的回调	EventEmitter<boolean>	-
<!-- 下拉选择属性 -->
[nzShowRowSelection]	是否显示下拉选择	boolean	-
[nzSelections]	下拉选择的内容 text 及回调函数 onSelect	Array<{ text: string, onSelect: any }>	-
<!-- 排序属性 -->
[nzShowSort]	是否显示排序	boolean	-
[nzSortFn]	排序函数，前端排序使用一个函数(参考 Array.sort 的 compareFunction)，服务端排序时传入 true	`((a: any, b: any, sortOrder?: string) => number)	boolean`
[nzSortDirections]	支持的排序方式，取值为 'ascend', 'descend', null	Array<'ascend' | 'descend' | null>	['ascend', 'descend', null]
[nzSortOrder]	当前排序状态，可双向绑定	'descend'	'ascend'
(nzSortOrderChange)	排序状态改变回调	EventEmitter<'descend' | 'ascend' | null>	-
<!-- 过滤属性 -->
[nzShowFilter]	是否显示过滤	boolean	-
[nzFilterFn]	前端排序时，确定筛选的运行函数，服务端排序时，传入 true	`((value: any, data: any) => boolean;)	boolean`
[nzFilters]	过滤器内容, 显示数据 text，回调函数传出 value，设置 byDefault 以默认应用过滤规则	Array<{ text: string; value: any; byDefault?: boolean }>	-
[nzFilterMultiple]	是否为多选过滤器	boolean	true
(nzFilterChange)	过滤器内容选择的 value 数据回调	EventEmitter<any[] | any>	-
<!-- 样式属性 -->
[nzWidth]	指定该列宽度，表头未分组时可用	string	-
<!-- 固定 -->
[nzLeft]	左侧距离，用于固定左侧列，当为 true 时自动计算，为 false 时停止固定	string | boolean	false
[nzRight]	右侧距离，用于固定右侧列，当为 true 时自动计算，为 false 时停止固定	string | boolean	false

[nzAlign]	设置列内容的对齐方式	'left' | 'right' | 'center'	-
[nzBreakWord]	是否折行显示	boolean	false
[nzEllipsis]	超过宽度将自动省略，暂不支持和排序筛选一起使用。仅当表格布局将为 nzTableLayout="fixed"时可用	boolean	false
[colSpan]	每单元格中扩展列的数量	number	null
[rowSpan]	每单元格中扩展行的数量	number	null
<!-- 其他 -->
[nzColumnKey]	当前列的key，用于服务端筛选和排序使用	string	-

3. td
<!-- 勾选属性 -->
[nzShowCheckbox]	是否添加checkbox	boolean	-
[nzDisabled]	checkbox 是否禁用	boolean	-
[nzIndeterminate]	checkbox indeterminate 状态	boolean	-
[nzChecked]	checkbox 是否被选中，可双向绑定	boolean	-
(nzCheckedChange)	选中的回调	EventEmitter<boolean>	-
<!-- 展开属性 -->
[nzShowExpand]	是否显示展开按钮	boolean	-
[nzExpand]	当前展开按钮状态，可双向绑定	boolean	-
(nzExpandChange)	当前展开按钮状态改变回调函数	EventEmitter<boolean>	-

<!-- 样式属性 -->
[nzLeft]	左侧距离，用于固定左侧列，当为 true 时自动计算，为 false 时停止固定	string | boolean	false
[nzRight]	右侧距离，用于固定右侧列，当为 true 时自动计算，为 false 时停止固定	string | boolean	false
[nzAlign]	设置列内容的对齐方式	'left' | 'right' | 'center'	-
[nzBreakWord]	是否折行显示	boolean	false
[nzEllipsis]	超过宽度将自动省略，暂不支持和排序筛选一起使用。仅当表格布局将为 nzTableLayout="fixed"时可用	boolean	false
<!-- 其他 -->
[nzIndentSize]	展示树形数据时，每层缩进的宽度，以 px 为单位	number	-

4. tr
[nzExpand]	当前列是否展开，与 td 上的 nzExpand 属性配合使用	boolean

<!-- nz-filter-trigger 用于自定义筛选功能 -->
[nzDropdownMenu]	Dropdown 下拉菜单组件	NzDropdownMenuComponent	-
[nzVisible]	菜单是否显示，可双向绑定	boolean	-
[nzActive]	是否激活选中图标效果	boolean	false
[nzHasBackdrop]	是否附带背景板	boolean	false
(nzVisibleChange)	菜单显示状态改变时调用，参数为 nzVisible	EventEmitter<boolean>	-

```
<ng-container *ngIf="!editCache[data.id].edit; else editTemplate">
<td>{{ data.name }}</td>
<td>{{ data.age }}</td>
<td>{{ data.address }}</td>
<td><a (click)="startEdit(data.id)">Edit</a></td>
</ng-container>
<ng-template #editTemplate>
<td><input type="text" nz-input [(ngModel)]="editCache[data.id].data.name" /></td>
<td><input type="text" nz-input [(ngModel)]="editCache[data.id].data.age" /></td>
<td><input type="text" nz-input [(ngModel)]="editCache[data.id].data.address" /></td>
<td>
    <a (click)="saveEdit(data.id)" class="save">Save</a>
    <a nz-popconfirm nzTitle="Sure to cancel?" (nzOnConfirm)="cancelEdit(data.id)">Cancel</a>
</td>
</ng-template>
```


#  表单
```
<nz-form-control [nzSm]="14" [nzXs]="24" [nzErrorTip]="errorTpl">
    <input nz-input type="password" formControlName="checkPassword" id="checkPassword" />
    <ng-template #errorTpl let-control>
        <ng-container *ngIf="control.hasError('required')">
            Please confirm your password!
        </ng-container>
        <ng-container *ngIf="control.hasError('confirm')">
            Two passwords that you enter is inconsistent!
        </ng-container>
    </ng-template>
    </nz-form-control>
</nz-form-item>

异步，返回值可以修改一下
  userNameAsyncValidator = (control: FormControl) =>
    new Observable((observer: Observer<MyValidationErrors | null>) => {
      setTimeout(() => {
        if (control.value === 'JasonWood') {
          observer.next({
            duplicated: { 'zh-cn': `用户名已存在`, en: `The username is redundant!` }
          });
        } else {
          observer.next(null);
        }
        observer.complete();
      }, 1000);
    });

自定义验证
  confirmValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { error: true, required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  };
```
# 拖拽
https://www.cnblogs.com/SPHmomo/p/10370707.html
https://blog.csdn.net/wuyuxing24/article/details/85063083?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522162926165016780265421602%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=162926165016780265421602&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~sobaiduend~default-1-85063083.first_rank_v2_pc_rank_v29&utm_term=cdkDrag&spm=1018.2226.3001.4187

# 编辑器
https://www.jianshu.com/p/b237372f15cc
https://www.jianshu.com/p/96c6bc3a0aff
