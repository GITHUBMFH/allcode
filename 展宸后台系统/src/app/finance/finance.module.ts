import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FinanceRoutingModule } from './finance-routing.module';
import { FinanceIndexComponent } from './finance-index/finance-index.component';
import { PayComponent } from './pay/pay.component';
import { IncomeComponent } from './income/income.component';
import {NgxEchartsModule} from 'ngx-echarts';

@NgModule({
  declarations: [FinanceIndexComponent, PayComponent, IncomeComponent],
  imports: [
    CommonModule,
    FinanceRoutingModule,
    NgxEchartsModule,
  ]
})
export class FinanceModule { }
