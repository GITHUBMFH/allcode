import { IncomeComponent } from './income/income.component';
import { PayComponent } from './pay/pay.component';
import { FinanceIndexComponent } from './finance-index/finance-index.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path:'finance',component:FinanceIndexComponent},
  {path:'pay',component:PayComponent},
  {path:'income',component:IncomeComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FinanceRoutingModule { }
