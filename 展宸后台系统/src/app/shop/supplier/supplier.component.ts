import { Validators } from '@angular/forms';
import { HttpService } from './../../services/http-service.service';
import { Component, OnInit, ViewChild } from '@angular/core';

import { datatitle, datalst, datafrom } from '../../sharedata'

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.less'],
})
export class SupplierComponent implements OnInit {
  @ViewChild('ordertable') ordertable: any; //table子组件
  @ViewChild('ordersearch') ordersearch: any; //search子组件
  @ViewChild('draweraddfrom') draweraddfrom: any;
  @ViewChild('drawereditfrom') drawereditfrom: any;

  type: any = {
    num: false,
    date: false,
    orderstate: false,
    peopelname: false,
    peopleclass: false,
    peoplestate: false,
    supplier:true
  };
  total: number = 0; //数据总数
  tabledata?: datalst[]; // 表格数据
  tabletitle: datatitle[] = [
    // 表格标题
    { value: 'id', type: 0 },
    { value: '名称', type: 1 },
    { value: '地址', type: 1 },
    { value: '联系方式', type: 1 },
  ];
  filter: any;
  page: any;
  delpost: string = 'index/delete/name/supplier';
  addpost: string = 'supplier/save';
  contex: any = {
    add: true,
    order: false,
    putin: true,
  };
  // 添加项目抽屉
  addfromtitle: string = '添加新项目';
  addfromdata: datafrom[] = [
    {
      value: 'name',
      title: '供应商名称',
      data: '',
      placeholder: '请输入供应商名称',
      type: 0,
      Validators: [Validators.required],
    },
    {
      value: 'address',
      title: '地址',
      data: '',
      placeholder: '请输入地址',
      type: 3,
      Validators: [],
    },
    {
      value: 'contact',
      title: '联系方式',
      data: '',
      placeholder: '请输入联系方式',
      type: 3,
      Validators: [],
    },
  ];
  // 编辑抽屉
  editfromtitle: string = '编辑项目';
  editfromdata: datafrom[] = [
    {
      value: 'id',
      title: 'id',
      data: '',
      placeholder: 'id',
      type: 2,
      Validators: [Validators.required],
    },
    {
      value: 'name',
      title: '供应商名称',
      data: '',
      placeholder: '请输入供应商名称',
      type: 0,
      Validators: [Validators.required],
    },
    {
      value: 'address',
      title: '地址',
      data: '',
      placeholder: '请输入地址',
      type: 3,
      Validators: [],
    },
    {
      value: 'contact',
      title: '联系方式',
      data: '',
      placeholder: '请输入联系方式',
      type: 3,
      Validators: [],
    },
  ];

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
    this.http.post('supplier/lst', obj).subscribe((data: any) => {
      if (data.msg === '成功') {
        this.ordertable.loading = false;
        const orderdata: any = [];
        data.data.forEach((element: any) => {
          const array = [];
          for (let a in element) {
            const d: any = {};
            d['value'] = element[a];
            d['titel'] = a;
            d['type'] = 0;
            a === 'id' ? (d['hidden'] = true) : (d['hidden'] = false);
            array.push(d);
          }
          orderdata.push(array);
        });
        this.tabledata = orderdata;
        this.total != data.count ? (this.total = data.count) : null;
      }
    });
  }

  // 右键添加新项目
  additem(e: any) {
    this.draweraddfrom.visible = true;
  }

  //右键编辑
  edit(e: any) {
    console.log(e);
    this.drawereditfrom.from.formcontent.patchValue({
      id: e[0].value,
      name: e[1].value,
      address: e[2].value,
      contact: e[3].value,
    });
    this.drawereditfrom.from.newform();
    this.drawereditfrom.visible = true;
  }

  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.gettabledata();
  }
}
