import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';


import { PageComponent } from './page/page.component';
import { NgZorroModule } from './ng-zorro';
import { LstindexComponent } from './lstindex/lstindex.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PagebgComponent } from './pagebg/pagebg.component';
import { FromComponent } from './from/from.component';

@NgModule({
  declarations: [
    AppComponent,
    PageComponent,
    LstindexComponent,
    PageNotFoundComponent,
    PagebgComponent,
    FromComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    NgZorroModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
