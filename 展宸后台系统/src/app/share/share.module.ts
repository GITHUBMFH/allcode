import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { MenuComponent } from './menu/menu.component';

import { NgZorroModule } from './../ng-zorro';
import { ShareRoutingModule } from './share-routing.module';
import { SearchComponent } from './search/search.component';
import { FromComponent } from './from/from.component';
import { TableComponent } from './table/table.component';
import { DrawerFromComponent } from './drawer-from/drawer-from.component';
import { PrintComponent } from './print/print.component';

@NgModule({
  declarations: [
    PagenotfoundComponent,
    MenuComponent,
    SearchComponent,
    FromComponent,
    TableComponent,
    DrawerFromComponent,
    PrintComponent,
  ],
  imports: [CommonModule, NgZorroModule, ShareRoutingModule],
  exports: [
    PagenotfoundComponent,
    MenuComponent,
    SearchComponent,
    FromComponent,
    TableComponent,
    DrawerFromComponent,
    PrintComponent
  ],
})
export class ShareModule {}
