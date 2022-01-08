import { BrowserModule } from '@angular/platform-browser';
// 使用懒加载一定要引入这个
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ShareModule } from './share/share.module';
import { NgZorroModule } from './ng-zorro';

import { PeopleModule } from './people/people.module';
import { OrderModule } from './order/order.module';
import { FinanceModule } from './finance/finance.module';
import { ShopModule } from './shop/shop.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    ShareModule,
    NgZorroModule,
    PeopleModule,
    ShopModule,
    FinanceModule,
    OrderModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
