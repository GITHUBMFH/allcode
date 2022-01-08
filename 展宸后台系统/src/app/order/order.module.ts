import { NgZorroModule } from './../ng-zorro';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderIndexComponent } from './order-index/order-index.component';

import { ShareModule } from '../share/share.module';
import { ItemListComponent } from './item-list/item-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { ProductComponent } from './product/product.component';
import { OrdersotrComponent } from './ordersotr/ordersotr.component';

@NgModule({
  declarations: [OrderIndexComponent, ItemListComponent, OrderListComponent, ProductComponent, OrdersotrComponent],
  imports: [
    CommonModule,
    ShareModule,
    NgZorroModule,
    OrderRoutingModule,
  ],
})
export class OrderModule {}
