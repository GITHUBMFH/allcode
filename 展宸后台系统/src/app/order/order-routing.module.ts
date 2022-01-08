import { OrdersotrComponent } from './ordersotr/ordersotr.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OrderIndexComponent } from './order-index/order-index.component';

const routes: Routes = [
  {path:'order',component:OrderIndexComponent},
  {path:'ordersort',component:OrdersotrComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
