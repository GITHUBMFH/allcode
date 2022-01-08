import { SupplierComponent } from './supplier/supplier.component';
import { PriceComponent } from './price/price.component';
import { StockComponent } from './stock/stock.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShopIndexComponent } from './shop-index/shop-index.component';

const routes: Routes = [
  {path:'shop',component:ShopIndexComponent},
  {path:'stock',component:StockComponent},
  {path:'supplier',component:SupplierComponent},
  {path:'price',component:PriceComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShopRoutingModule { }
