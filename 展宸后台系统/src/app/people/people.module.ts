import { NgZorroModule } from './../ng-zorro';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleIndexComponent } from './people-index/people-index.component';

import { ShareModule } from './../share/share.module';

@NgModule({
  declarations: [PeopleIndexComponent],
  imports: [
    CommonModule,
    ShareModule,
    NgZorroModule,
    PeopleRoutingModule
  ]
})
export class PeopleModule { }
