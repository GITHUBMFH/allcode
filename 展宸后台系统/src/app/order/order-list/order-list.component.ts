import { NzMessageService } from '_ng-zorro-antd@11.4.0@ng-zorro-antd/message';
import { Component, OnInit, ViewChild } from '@angular/core';

import { HttpService } from './../../services/http-service.service';
import { Validators } from '@angular/forms';
import {datatitle,datalst,datafrom} from '../../sharedata'

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.less'],
})
export class OrderListComponent implements OnInit {
  @ViewChild('ordertable') ordertable: any; //table子组件
  @ViewChild('ordersearch') ordersearch: any; //search子组件
  @ViewChild('draweraddfrom') draweraddfrom: any;
  @ViewChild('drawereditfrom') drawereditfrom: any;
  @ViewChild('draweraddorderfrom') draweraddorderfrom: any;

  type: any = {
    num: true,
    date: true,
    orderstate: false,
    peopelname:false
  };
  total: number = 0; //数据总数
  tabledata?: datalst[]; // 表格数据
  tabletitle: datatitle[] = [
    // 表格标题
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
  ];
  filter: any;
  page: any;
  delpost: string = 'order/delete';
  addpost: string = 'order/save';
  contex: any = {
    add: true,
    order: true,
    putin: true,
  }
  // 添加项目抽屉
  addfromtitle:string= '添加新项目';
  addfromdata: datafrom[] = [
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
      placeholder: '如果没有值会自动更新工令号',
      type: 5,
      Validators: [Validators.pattern('^[0-9]*$'), Validators.minLength(4)],
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
  // 编辑抽屉
  editfromtitle:string= '编辑项目';
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
    },{
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
  // 添加新订单
  addorderfromtitle:string= '添加新订单';
  addorderfromdata: datafrom[] = [
    {
      value: 'parent_id',
      title: 'parent_id',
      data: '',
      placeholder: '请输入项目parent_id',
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
      value: 'remark',
      title: '备注',
      data: '',
      placeholder: '请输入内容',
      type: 1,
      Validators: [],
    },
  ];

  //右键编辑
  edit(e: any) {
    this.drawereditfrom.from.formcontent.patchValue({
      id: e[0].value,
      name: e[2].value,
      num: e[3].value,
      remark: e[5].value,
    });
    this.drawereditfrom.from.newform();
    this.drawereditfrom.visible = true;
  }

  // 右键添加新项目
  additem(e: any) {
    this.draweraddfrom.visible = true;
  }

  // 右键添加新订单
  addorder(e: any) {
    this.draweraddorderfrom.from.formcontent.patchValue({
      parent_id: e[0].value,
      name: e[2].value,
      remark:'',
    });
    this.draweraddorderfrom.from.newform();
    this.draweraddorderfrom.visible = true;
  }

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
    this.http.post('order/orderlst', obj).subscribe((data: any) => {
      if (data.code === 200) {
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
              a === 'date'
            ) {
              const d: any = {};
              d['value'] = element[a];
              d['titel'] = a;
              a === 'id' || a === 'parent_id'
                ? (d['hidden'] = true)
                : (d['hidden'] = false);
              a === 'date' ? (d['type'] = '1') : (d['type'] = '0');
              array.push(d);
            }
          }
          arraydata.push(array[0]);
          arraydata.push(array[4]);
          arraydata.push(array[2]);
          arraydata.push(array[3]);
          arraydata.push(array[1]);
          arraydata.push(array[5]);
          orderdata.push(arraydata);
        });
        this.tabledata = orderdata;
        this.total != data.count ? (this.total = data.count) : null;
      } else {
        this.message.create('error', data.msg);
      }
    })
  }

  constructor(private http: HttpService,private message: NzMessageService) {}

  ngOnInit(): void {
    this.gettabledata();
  }
}
