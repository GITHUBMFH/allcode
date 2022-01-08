import { NzMessageService } from '_ng-zorro-antd@11.4.0@ng-zorro-antd/message';
import { HttpService } from './../../services/http-service.service';
import { Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

import { datatitle, datalst, datafrom,iconlsit} from '../../sharedata'


@Component({
  selector: 'app-shop-index',
  templateUrl: './shop-index.component.html',
  styleUrls: ['./shop-index.component.less'],
})
export class ShopIndexComponent implements OnInit {
  @ViewChild('producttable') producttable: any; //table子组件
  @ViewChild('drawereditfrom') drawereditfrom: any;
  @ViewChild('draweraddfrom') draweraddfrom: any;

  isVisibleMiddle = false;
  visible: boolean = false;
  title: string = '订单';
  id?: number;
  productid?: number;
  action?: string;
  delimgurl: string = '';
  // 表格数据
  filter: any;
  page: any;
  total: number = 0; //数据总数
  tabledata: datalst[] = []; // 表格数据
  tabledatacopy: any; // 表格数据
  delpost: string = 'shop/delete';
  addpost: string = 'shop/save';
  imgurl: string = 'http://localhost:8000/storage/';
  contex: any = {
    add: true,
    order: false,
    putin: true,
    edit: true,
    del: true,
    alldel:true
  };
  tag = ['审核中', '待采购', '已采购','已入库'];
  type: any= {
    num: true,
    date: true,
    orderstate: true,
    peopelname: false,
  };
  fileList: any = [];
  tabletitle: datatitle[] = [
    // 表格标题
    { value: 'id', type: 0 },
    { value: 'p_id', type: 0 },
    { value: '名称', type: 1 , width: '80px'},
    { value: '规格', type: 1, width: '80px' },
    { value: '数量', type: 1, width: '50px' },
    { value: '备注', type: 1 , width: '80px'},
    { value: '申请人', type: 1 , width: '60px'},
    { value: '关联', type: 1, width: '80px' },
    { value: '下单时间', type: 1, width: '110px' },
    { value: '回厂时间', type: 1, width: '110px' },
    { value: '回厂数量', type: 1, width: '60px' },
    { value: '状态', type: 1 , width: '60px'},
    // { value: '图片', type: 1 },
    // { value: '调拨记录', type: 1},
  ];

  // 编辑抽屉
  editfromtitle: string = '编辑产品';
  editfromdata: datafrom[] = [
    {
      value: 'id',
      title: 'id',
      data: '',
      placeholder: '请输入id',
      type: 2,
      Validators: [Validators.required],
    },
    {
      value: 'p_id',
      title: 'p_id',
      data: '',
      placeholder: '请输入p_id',
      type: 2,
      Validators: [Validators.required],
    },
    {
      value: 'name',
      title: '名称',
      data: '',
      placeholder: '请输入名称',
      type: 0,
      Validators: [Validators.required],
    },
    {
      value: 'size',
      title: '规格',
      data: '',
      placeholder: '请输入规格',
      type: 0,
      Validators: [Validators.required],
    },
    {
      value: 'num',
      title: '数量',
      data: '',
      placeholder: '请输入数量',
      type: 0,
      Validators: [Validators.required, Validators.pattern('^[0-9]*$')],
    },
    {
      value: 'unit',
      title: '单位',
      data: '',
      placeholder: '请输入单位',
      type: 0,
      Validators: [Validators.required],
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
  // 添加项目抽屉
  addfromtitle: string = '添加新项目';
  addfromdata: datafrom[] = [
    {
      value: 'name',
      title: '名称',
      data: '',
      placeholder: '请输入名称',
      type: 0,
      Validators: [Validators.required],
    },
    {
      value: 'size',
      title: '规格',
      data: '',
      placeholder: '请输入规格',
      type: 0,
      Validators: [Validators.required],
    },
    {
      value: 'num',
      title: '数量',
      data: '',
      placeholder: '请输入数量',
      type: 0,
      Validators: [Validators.required, Validators.pattern('^[0-9]*$')],
    },
    {
      value: 'unit',
      title: '单位',
      data: '',
      placeholder: '请输入单位',
      type: 0,
      Validators: [Validators.required],
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

  geticon:iconlsit[]=[{
    icon: "pie-chart", 
    title: "生产单数量",
    number:100,
    color:"background-color:#007aff",
    bg:'background-color:#e4ecff',
  },{
    icon: "alert", 
    title: "未完成订单数量",
    number:100,
    color:"background-color:#ffab2b",
    bg:'background-color:#fff3e0',
  }
  ,{
    icon: "check-circle", 
    title: "完成订单数量",
    number:100,
    color:"background-color:#6dd230",
    bg:'background-color:#eaf9e1',
  }
  ,{
    icon: "shop", 
    title: "待采购数量",
    number:100,
    color:"background-color:#ff85c0",
    bg:'background-color:#ffeaf4',
  }]

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
  gettabledata(e?: any) {
    let obj = { ...this.page };
    obj['filter'] = this.filter;
    e ? (obj['pageIndex'] = 1) : null;
    this.http.post('shop/lst',obj).subscribe((data: any) => {
      this.producttable.loading = false;
      this.tabledatacopy = data.data;
      const orderdata: any = [];
      if (this.productid != null && this.productid != undefined) {
        let img = data.data.filter((item: any) => item.id === this.productid);
        let array: any = [];
        this.fileList = [];
        if (
          img[0]['pic'] != null &&
          img[0]['pic'] != undefined &&
          img[0]['pic'] != ''
        ) {
          img[0]['pic'].forEach((e: any, index: any) => {
            let d: any = {};
            d['url'] = this.imgurl + e;
            d['status'] = 'done';
            d['key'] = index;
            array.push(d);
          });
          this.fileList = array;
        }
      }
      data.data.forEach((element: any) => {
        const array = [];
        for (let a in element) {
          const d: any = {};
          if (a === 'pic') {
            if (
              element[a] !== null &&
              element[a] !== undefined &&
              element[a] !== ''
            ) {
              d['value'] = this.imgurl + element[a][0];
              d['count'] = element[a].length;
            } else {
              d['value'] = element[a];
            }
          } else {
            d['value'] = element[a];
          }
          d['titel'] = a;
          a === 'id' || a === 'p_id'
            ? (d['hidden'] = true)
            : (d['hidden'] = false);
          if (a === 'state') {
            d['type'] = 2;
          } else if (a === 'pic') {
            element[a].length < 1 ? (d['type'] = 0) : (d['type'] = 3);
          } else if (a === 'date'|| a === 'getdate') {
            d['type'] = 1;
          } else {
            d['type'] = 0;
          }
          array.push(d);
        }
        orderdata.push(array);
      });
      this.tabledata = orderdata;
      this.total != data.count ? (this.total = data.count) : null;
    });
  }

  //右键编辑
  edit(e: any) {
    let num = e[4].value.replace(/[^0-9]/gi, '');
    let unit = e[4].value.replace(num, '');
    this.drawereditfrom.from.formcontent.patchValue({
      id: e[0].value,
      p_id: e[1].value,
      name: e[2].value,
      size: e[3].value,
      num: num,
      unit:unit,
      remark: e[5].value,
    });
    this.drawereditfrom.from.newform();
    this.drawereditfrom.visible = true;
  }

  // 编辑数据
  eidtsublimt(e: any) {
    let data: any = {};
    data['id'] = e.id;
    data['people'] = e.p_id;
    delete e.id;
    delete e.p_id;
    data['detail'] = e;
    this.http.post('shop/save', data).subscribe((data: any) => {
      if (data.msg === '成功') {
        this.drawereditfrom.drawerstate();
        this.gettabledata();
        this.message.create('success', `提交成功`);
      } else {
        this.message.create('error', '提交失败');
      }
    });
  }
  // 添加数据
  addclick(e: any) {
    this.draweraddfrom.visible = true;
  }
  // 添加数据
  addsubmit(e: any) {
    let data: any = {};
    data['detail'] = e;
    this.http.post('shop/save', data).subscribe((data: any) => {
      if (data.msg === '成功') {
        this.draweraddfrom.drawerstate();
        this.gettabledata();
        this.message.create('success', `提交成功`);
      } else {
        this.message.create('error', '提交失败');
      }
    });
  }

  constructor(private http: HttpService, private message: NzMessageService) {}

  ngOnInit(): void {
    this.gettabledata(true);
  }
}
