import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit} from '@angular/core';

import { datatitle, datalst } from '../../sharedata';
import { PagechangeService } from './../../services/pagechange.service';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html',
  styleUrls: ['./print.component.less'],
})
export class PrintComponent implements OnInit {

  total: number = 10; //数据总数
  tabledata?: datalst[]; // 表格数据
  contex: any = {
    order: false,
    add: false,
  };
  // 表格数据
  tabletitle: datatitle[] = [];

  constructor(
    public Router: Router,
    public route: ActivatedRoute,
    private pagedata: PagechangeService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((d) => {
      let tabledata = JSON.parse(localStorage['tabledata']);
      let tabletitle = JSON.parse(localStorage['tabletitle']);
      tabledata.forEach((e: any) => {
        e.splice(
          e.findIndex((item: any) => item.title === 'state'),
          1
        );
      });
      tabletitle.splice(
        tabletitle.findIndex((item: any) => item.value === '状态'),
        1
      );
      
      this.tabletitle = tabletitle;
      this.tabledata = tabledata;

      window.localStorage.removeItem('tabledata');
      window.localStorage.removeItem('tabletitle');
    });
    this.pagedata.changedata(true);
    setTimeout(() => {
      // history.go(-1);
      window.print();
      this.Router.navigate([{ outlets: { popup: null } }]);
      this.pagedata.changedata(false);
      // window.location.reload()
    }, 20);
  }

  ngAfterViewInit() {

  }
}
