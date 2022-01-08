import { NgModule } from '@angular/core';

// 模型表格和响应式表格
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

import { NzLayoutModule } from 'ng-zorro-antd/layout';//布局
import { NzIconModule } from 'ng-zorro-antd/icon';//图标
import { NzAffixModule } from 'ng-zorro-antd/affix';//固定点
import { NzGridModule } from 'ng-zorro-antd/grid';//栅格
import { NzButtonModule } from 'ng-zorro-antd/button';//按钮
import { NzSwitchModule } from 'ng-zorro-antd/switch';//Switch开关
import { NzDividerModule } from 'ng-zorro-antd/divider'; //分割线
import { NzResultModule } from 'ng-zorro-antd/result'; //404
import { NzFormModule } from 'ng-zorro-antd/form';//表格
import { NzInputModule } from 'ng-zorro-antd/input';//input表单
import { NzMessageModule } from 'ng-zorro-antd/message';//全局提醒
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';//气泡确认框
import { NzUploadModule } from 'ng-zorro-antd/upload';//上传
import { NzImageModule } from 'ng-zorro-antd/image';//图片
import { NzTagModule } from 'ng-zorro-antd/tag';//标签
import { NzTypographyModule } from 'ng-zorro-antd/typography';//排版
import { NzAnchorModule } from 'ng-zorro-antd/anchor';//锚点
import { DragDropModule } from 'ng-zorro-antd/node_modules/@angular/cdk/drag-drop';
import { ScrollingModule } from 'ng-zorro-antd/node_modules/@angular/cdk/scrolling';
import { NzListModule } from 'ng-zorro-antd/list';//列表
import { NzPopoverModule } from 'ng-zorro-antd/popover';//气泡卡片
import { NzRadioModule } from 'ng-zorro-antd/radio';//单选
import { NzPaginationModule } from 'ng-zorro-antd/pagination';//分页
import { NzSelectModule } from 'ng-zorro-antd/select';//selcet选择器
import { NzTimelineModule } from 'ng-zorro-antd/timeline';//时间轴
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';//下拉菜单
import { NzBackTopModule } from 'ng-zorro-antd/back-top';//返回top
import { NzDrawerModule } from 'ng-zorro-antd/drawer';//抽屉
import { NzSpinModule } from 'ng-zorro-antd/spin';//加载中
import { NzProgressModule } from 'ng-zorro-antd/progress';
@NgModule({
  exports: [
    HttpClientJsonpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzIconModule,
    NzAffixModule,
    NzGridModule,
    NzButtonModule,
    NzSwitchModule,
    NzDividerModule,
    NzResultModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    NzPopconfirmModule,
    NzUploadModule,
    NzImageModule,
    NzTagModule,
    NzTypographyModule,
    NzAnchorModule,
    DragDropModule,
    ScrollingModule,
    NzListModule,
    NzPopoverModule,
    NzRadioModule,
    NzPaginationModule,
    NzSelectModule,
    NzTimelineModule,
    NzDropDownModule,
    NzBackTopModule,
    NzDrawerModule,
    NzSpinModule,
    NzProgressModule
  ],
})
export class NgZorroModule {

}
