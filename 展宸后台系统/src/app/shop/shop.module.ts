import { NgZorroModule } from './../ng-zorro';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShopRoutingModule } from './shop-routing.module';
import { ShareModule } from '../share/share.module';
import { ShopIndexComponent } from './shop-index/shop-index.component';
import { SupplierComponent } from './supplier/supplier.component';
import { StockComponent } from './stock/stock.component';
import { PriceComponent } from './price/price.component';


@NgModule({
  declarations: [ShopIndexComponent, SupplierComponent, StockComponent, PriceComponent],
  imports: [
    CommonModule,
    ShareModule,
    NgZorroModule,
    ShopRoutingModule
  ]
})
export class ShopModule { }
