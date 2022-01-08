import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PagechangeService {
  constructor() {}
  data = new Subject<any>();
  data$ = this.data.asObservable();

  // searchdata = new Subject<any>();
  // searchdata$ = this.searchdata.asObservable();

  changedata(msg: any) {
    this.data.next(msg);
  }
  // changesearchdata(msg: any) {
  //   this.searchdata.next(msg);
  // }
}
