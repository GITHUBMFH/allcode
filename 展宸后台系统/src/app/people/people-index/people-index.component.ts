import { NzMessageService } from '_ng-zorro-antd@11.4.0@ng-zorro-antd/message';
import { HttpService } from './../../services/http-service.service';
import { Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';

import { datatitle, datalst, datafrom } from '../../sharedata'

@Component({
  selector: 'app-people-index',
  templateUrl: './people-index.component.html',
  styleUrls: ['./people-index.component.less'],
})
export class PeopleIndexComponent implements OnInit {
  @ViewChild('ordertable') ordertable: any; //table子组件
  @ViewChild('ordersearch') ordersearch: any; //search子组件
  @ViewChild('draweraddfrom') draweraddfrom: any;
  @ViewChild('drawereditfrom') drawereditfrom: any;

  type:any = {
    num: false,
    date: false,
    orderstate: false,
    peopelname: true,
    peopleclass: true,
    peoplestate:true
  };
  total: number = 0; //数据总数
  tabledata?: datalst[]; // 表格数据
  tabletitle: datatitle[] = [
    // 表格标题
    { value: 'id', type: 0 },
    { value: '姓名', type: 1 },
    { value: '部门', type: 1 },
    { value: '身份证号码', type: 1 },
    { value: '工资卡信息', type: 1 },
    { value: '基本工资', type: 1 },
    { value: '权限', type: 1 },
    { value: '状态', type: 1 },
  ];
  filter: any;
  page: any;
  delpost: string = 'index/delete/name/people';
  addpost: string = 'peopel/save';
  contex: any = {
    add: true,
    order: false,
    putin: true,
  };
  tag = ['板式', '实木', '油漆', '沙发', '包装', '办公室'];
  tag2 = ['最高权限', '主管', '跟单', '采购', '员工'];
  tag3 = ['在职','离职'];
  // 添加项目抽屉
  addfromtitle: string = '添加新项目';
  addfromdata: datafrom[] = [
    {
      value: 'name',
      title: '姓名',
      data: '',
      placeholder: '请输入项目姓名',
      type: 0,
      Validators: [Validators.required],
    },
    {
      value: 'class',
      title: '部门',
      data: '',
      placeholder: '部门',
      type: 6,
      Validators: [Validators.required],
      tag:this.tag
    },
    {
      value: 'card_id',
      title: '身份证',
      data: '',
      placeholder: '请输入内容身份证',
      type: 3,
      Validators: [],
    },
    {
      value: 'bank',
      title: '银行卡名称',
      data: '',
      placeholder: '请输入开卡银行',
      type: 3,
      Validators: [],
    },
    {
      value: 'bank_num',
      title: '银行卡号码',
      data: '',
      placeholder: '请输入银行卡号码',
      type: 3,
      Validators: [],
    },
    {
      value: 'bank_name',
      title: '开卡人姓名',
      data: '',
      placeholder: '请输入开卡人姓名',
      type: 3,
      Validators: [],
    },
    {
      value: 'wage',
      title: '基本工资',
      data: '',
      placeholder: '请输入基本工资',
      type: 3,
      Validators: [],
    },
    {
      value: 'auth',
      title: '权限',
      data: '',
      placeholder: '权限',
      type: 6,
      Validators: [Validators.required],
      tag:this.tag
    },
    {
      value: 'state',
      title: '状态',
      data: '1',
      placeholder: '状态',
      type: 6,
      Validators: [Validators.required],
      tag:this.tag3
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
      title: '姓名',
      data: '',
      placeholder: '请输入项目姓名',
      type: 0,
      Validators: [Validators.required],
    },
    {
      value: 'class',
      title: '部门',
      data: '',
      placeholder: '部门',
      type: 6,
      Validators: [Validators.required],
      tag:this.tag
    },
    {
      value: 'card_id',
      title: '身份证',
      data: '',
      placeholder: '请输入内容身份证',
      type: 3,
      Validators: [],
    },
    {
      value: 'bank',
      title: '银行卡名称',
      data: '',
      placeholder: '请输入开卡银行',
      type: 3,
      Validators: [],
    },
    {
      value: 'bank_num',
      title: '银行卡号码',
      data: '',
      placeholder: '请输入银行卡号码',
      type: 3,
      Validators: [],
    },
    {
      value: 'bank_name',
      title: '开卡人姓名',
      data: '',
      placeholder: '请输入开卡人姓名',
      type: 3,
      Validators: [],
    },
    {
      value: 'wage',
      title: '基本工资',
      data: '',
      placeholder: '请输入基本工资',
      type: 3,
      Validators: [],
    },
    {
      value: 'auth',
      title: '权限',
      data: '',
      placeholder: '权限',
      type: 6,
      Validators: [Validators.required],
      tag:this.tag2
    },
    {
      value: 'state',
      title: '状态',
      data: '',
      placeholder: '状态',
      type: 6,
      Validators: [Validators.required],
      tag:this.tag3
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
    this.http.post('people/lst', obj).subscribe((data: any) => {
      if (data.code === 200) {
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
            if (a === 'class') {
              d['type'] = 2;
            } else if (a === 'auth') {
              d['type'] = 3;
            } else if (a === 'state') {
              d['type'] = 4;
            } else {
              d['type'] = 0;
            }
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
  // 添加数据
  addsubmit(e: any) {
    let data: any = {};
    data['name'] = e.name;
    data['auth'] = e.auth;
    data['state'] = e.state;
    delete e.name;
    delete e.auth;
    delete e.state;
    data['detail'] = e;
    this.http.post('people/save', data).subscribe((data: any) => {
      if (data.msg === '成功') {
        this.draweraddfrom.drawerstate();
        this.gettabledata();
        this.message.create('success', `提交成功`);
      } else {
        this.message.create('error', '提交失败');
      }
    });
  }

  //右键编辑
  edit(e: any) {
    console.log(e);
    let getbank = e[4].value;
    let bank_num = getbank!='- -'?getbank.replace(/[^0-9]/gi, ''):'';
    let bank = getbank!='- -'?getbank.match(/\(([^)]*)\)/)[1]:'';
    let bank_name = getbank!='- -'?getbank.match(/\[([^)]*)\]/)[1]:'';
    let card_id = e[3].value!='- -'?e[3].value:'';
    let wage = e[5].value != '- -' ? e[5].value : '';
    this.drawereditfrom.from.formcontent.patchValue({
      id: e[0].value,
      name: e[1].value,
      class: e[2].value,
      card_id: card_id,
      bank:bank,
      bank_num: bank_num,
      bank_name: bank_name,
      wage: wage,
      auth: e[6].value,
      state: e[7].value,
    });
    this.drawereditfrom.from.newform();
    this.drawereditfrom.visible = true;
  }

  // 编辑数据
  eidtsublimt(e: any) {
    let data: any = {};
    data['id'] = e.id;
    data['name'] = e.name;
    data['auth'] = e.auth;
    data['state'] = e.state;
    delete e.id;
    delete e.name;
    delete e.auth;
    delete e.state;
    data['detail'] = e;
    this.http.post('people/save', data).subscribe((data: any) => {
      if (data.msg === '成功') {
        this.drawereditfrom.drawerstate();
        this.gettabledata();
        this.message.create('success', `提交成功`);
      } else {
        this.message.create('error', '提交失败');
      }
    });
  }
  constructor(private http: HttpService,private message: NzMessageService) {}

  ngOnInit(): void {
    this.gettabledata();
  }
}
