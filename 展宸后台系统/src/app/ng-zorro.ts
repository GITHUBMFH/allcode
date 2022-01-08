import { NgModule } from '@angular/core';

// 模型表格和响应式表格
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';

import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);

import { NzLayoutModule } from 'ng-zorro-antd/layout';//布局
import { NzIconModule } from 'ng-zorro-antd/icon';//图标
import { NzMenuModule } from 'ng-zorro-antd/menu';//菜单
import { NzAffixModule } from 'ng-zorro-antd/affix';//固定点
import { NzGridModule } from 'ng-zorro-antd/grid';//栅格
import { NzButtonModule } from 'ng-zorro-antd/button';//按钮
import { NzSwitchModule } from 'ng-zorro-antd/switch';//Switch开关
import { NzRadioModule } from 'ng-zorro-antd/radio';//单选
import { NzTableModule } from 'ng-zorro-antd/table';//Table表格
import { NzDrawerModule } from 'ng-zorro-antd/drawer';//抽屉
import { NzDividerModule } from 'ng-zorro-antd/divider'; //分割线
import { NzResultModule } from 'ng-zorro-antd/result'; //404
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';//文字提醒
import { NzProgressModule } from 'ng-zorro-antd/progress';//进度条
import { NzFormModule } from 'ng-zorro-antd/form';//表格
import { NzInputModule } from 'ng-zorro-antd/input';//input表单
import { NzMessageModule } from 'ng-zorro-antd/message';//全局提醒
import { NzTabsModule } from 'ng-zorro-antd/tabs';//tab
import { NzCardModule } from 'ng-zorro-antd/card';//卡片
import { NzStatisticModule } from 'ng-zorro-antd/statistic';//统计
import { NzSelectModule } from 'ng-zorro-antd/select';//下拉选项
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';//时间选择框
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';//气泡确认框
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  exports: [
    HttpClientJsonpModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NzLayoutModule,
    NzIconModule,
    NzMenuModule,
    NzAffixModule,
    NzGridModule,
    NzButtonModule,
    NzSwitchModule,
    NzRadioModule,
    NzTableModule,
    NzDrawerModule,
    NzDividerModule,
    NzResultModule,
    NzToolTipModule,
    NzProgressModule,
    NzFormModule,
    NzInputModule,
    NzMessageModule,
    NzTabsModule,
    NzCardModule,
    NzStatisticModule,
    NzSelectModule,
    NzDatePickerModule,
    NzPopconfirmModule,
    NzUploadModule,
    NzPaginationModule,
    NzImageModule,
    NzTagModule,
    NzDropDownModule,
    NzModalModule,
    NzBadgeModule,
    DragDropModule,
    ScrollingModule
  ],
})
export class NgZorroModule {

}
