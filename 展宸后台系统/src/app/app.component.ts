import { PagechangeService } from './services/pagechange.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  isCollapsed:any = false;
  percenthide:any= false;
  viewhideen:any= true;
  percent:any = 0;
  putpath: any = '';
  pagecontent: boolean = false;

  ngOnInit() {
    setTimeout(() => {
      this.percent = 25;
    }, 250);
    setTimeout(() => {
      this.percent = 50;
    }, 500);
    setTimeout(() => {
      this.percent = 75;
    }, 1000);
    setTimeout(() => {
      this.percent = 100;
    }, 1500);
    setTimeout(() => {
      this.percenthide = true;
    }, 1800);
    setTimeout(() => {
      this.viewhideen = false;
    }, 1000);
  }

  constructor(private pagechange: PagechangeService) {
    pagechange.data$.subscribe((val) => {
      this.pagecontent = val;
    })
  }
}
