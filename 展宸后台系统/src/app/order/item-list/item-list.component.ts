import { Validators } from '@angular/forms';
import { HttpService } from './../../services/http-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import {datatitle,datalst,datafrom} from '../../sharedata'

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.less'],
})
export class ItemListComponent implements OnInit {
  @ViewChild('ordertable') ordertable: any; //table子组件
  @ViewChild('ordersearch') ordersearch: any; //search子组件
  @ViewChild('drawereditfrom') drawereditfrom: any;
  @ViewChild('productlist') productlist: any;

  type:any = {
    num: true,
    date: true,
    orderstate: true,
    peopelname:false
  };
  total: number = 0; //数据总数
  tabledata?: datalst[]; // 表格数据
  addpost: string = 'order/save';
  delpost: string = 'order/delete';
  filter: any;
  page: any;
  contex: any = {
    order: false,
    add: false,
  };
  // 表格数据
  tabletitle: datatitle[] = [
    { value: 'id', type: 0 },
    { value: '父id', type: 0 },
    { value: '项目名称', type: 1 },
    {
      value: '工令号',
      type: 2,
      nzSortOrder: 'descend',
      title: 'numsort',
    },
    { value: '下单时间', type: 2, nzSortOrder: null, title: 'datesort' },
    { value: '备注', type: 1 },
    { value: '生产状态', type: 1 },
  ];
  // 编辑抽屉
  editfromtitle: string = '编辑订单';
  editfromdata: datafrom[] = [
    {
      value: 'id',
      title: 'id',
      data: '',
      placeholder: '请输入项目id',
      type: 2,
      Validators: [Validators.required, Validators.pattern('^[0-9]*$')],
    },
    {
      value: 'name',
      title: '项目名称',
      data: '',
      placeholder: '请输入项目名称',
      type: 0,
      Validators: [Validators.required, Validators.minLength(3)],
    },
    {
      value: 'num',
      title: '工令号',
      data: '',
      placeholder: '请输入工令号',
      type: 4,
      Validators: [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(4),
      ],
    },
    {
      value: 'remark',
      title: '备注',
      data: '',
      placeholder: '请输入内容',
      type: 1,
      Validators: [],
    },
  ];
  productid: any;

  // 页面变动
  pagechange(e: any) {
    this.page = e;
    this.gettabledata();
  }
  // 搜索变动
  serchchange(e: any) {
    this.filter = e;
    this.gettabledata(true);
  }
  // 表格请求数据
  gettabledata(e?: boolean) {
    let obj = { ...this.page };
    obj['filter'] = this.filter;
    e ? (obj['pageIndex'] = 1) : null;
    this.http.post('order/itemlst', obj).subscribe((data: any) => {
      this.ordertable.loading = false;
      const orderdata: any = [];
      data.data.forEach((element: any) => {
        const array = [];
        const arraydata = [];
        for (let a in element) {
          if (
            a === 'id' ||
            a === 'parent_id' ||
            a === 'remark' ||
            a === 'name' ||
            a === 'num' ||
            a === 'date' ||
            a === 'state'
          ) {
            const d: any = {};
            let v: string = '' + element[a];
            a === 'num'
              ? (d['value'] = v.slice(0, 4) + '-' + v.slice(4))
              : (d['value'] = element[a]);
            d['titel'] = a;
            a === 'id' || a === 'parent_id'
              ? (d['hidden'] = true)
              : (d['hidden'] = false);
            if (a === 'date') {
              d['type'] = '1';
            } else if (a === 'state') {
              d['type'] = '2';
            } else {
              d['type'] = '0';
            }
            array.push(d);
          }
        }
        arraydata.push(array[0]);
        arraydata.push(array[2]);
        arraydata.push(array[5]);
        arraydata.push(array[1]);
        arraydata.push(array[3]);
        arraydata.push(array[4]);
        arraydata.push(array[6]);
        orderdata.push(arraydata);
      });
      this.tabledata = orderdata;
      this.total != data.count ? (this.total = data.count) : null;
    });
  }


  dbclick(e: any) {
    this.productid = e;
    this.productlist.gettabledata(e);
  }


  //右键编辑
  edit(e: any) {
    console.log(e);
    this.drawereditfrom.from.formcontent.patchValue({
      id: e[0].value,
      name: e[2].value,
      num: e[3].value.replace('-', ''),
      remark: e[5].value,
    });
    this.drawereditfrom.from.newform();
    this.drawereditfrom.visible = true;
  }

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.gettabledata();
  }
}
