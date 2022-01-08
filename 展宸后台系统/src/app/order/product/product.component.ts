import {
  NzDropdownMenuComponent,
  NzContextMenuService,
} from '_ng-zorro-antd@11.4.0@ng-zorro-antd/dropdown';
import { NzMessageService } from '_ng-zorro-antd@11.4.0@ng-zorro-antd/message';
import { Validators } from '@angular/forms';
import { HttpService } from './../../services/http-service.service';
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { datatitle, datalst, datafrom } from '../../sharedata';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.less'],
})
export class ProductComponent implements OnInit {
  @ViewChild('producttable') producttable: any; //table子组件
  @ViewChild('drawereditfrom') drawereditfrom: any;
  @ViewChild('draweraddfrom') draweraddfrom: any;

  @Output() public db = new EventEmitter();

  isVisibleMiddle = false;
  visible: boolean = false;
  title: string = '订单';
  id?: number;
  productid?: number;
  action?: string;
  delimgurl: string = '';
  // 表格数据
  total: number = 0; //数据总数
  tabledata: datalst[] = []; // 表格数据
  tabledatacopy: any; // 表格数据
  delpost: string = 'product/delete';
  addpost: string = 'order/save';
  imgurl: string = 'http://localhost:8000/storage/';
  contex: any = {
    add: true,
    order: false,
    putin: true,
  };

  fileList: any = [];
  tabletitle: datatitle[] = [
    // 表格标题
    { value: 'id', type: 0 },
    { value: '序号', type: 1, width: '20px' },
    { value: '图片', type: 1, width: '100px' },
    { value: '楼层区域', type: 1,width: '50px' },
    { value: '编号', type: 1 ,width: '100px'},
    { value: '名称', type: 1 ,width: '100px'},
    { value: '尺寸', type: 1 ,width: '100px'},
    { value: '数量', type: 1 ,width: '40px'},
    { value: '单位', type: 1, width: '30px' },
    { value: '备注', type: 1, width: '150px' },
    { value: '生产状态', type: 1 , width: '100px'},
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
      value: 'area',
      title: '楼层区域',
      data: '',
      placeholder: '请输入楼层区域',
      type: 3,
      Validators: [],
    },
    {
      value: 'm_num',
      title: '产品编号',
      data: '',
      placeholder: '请输入产品编号',
      type: 3,
      Validators: [],
    },
    {
      value: 'name',
      title: '产品名称',
      data: '',
      placeholder: '请输入产品名称',
      type: 0,
      Validators: [Validators.required],
    },
    {
      value: 'size',
      title: '尺寸',
      data: '',
      placeholder: '请输入尺寸',
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
      value: 'area',
      title: '楼层区域',
      data: '',
      placeholder: '请输入楼层区域',
      type: 3,
      Validators: [],
    },
    {
      value: 'm_num',
      title: '产品编号',
      data: '',
      placeholder: '请输入产品编号',
      type: 3,
      Validators: [],
    },
    {
      value: 'name',
      title: '产品名称',
      data: '',
      placeholder: '请输入产品名称',
      type: 0,
      Validators: [Validators.required],
    },
    {
      value: 'size',
      title: '尺寸',
      data: '',
      placeholder: '请输入尺寸',
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

  // 显示抽屉
  drawerstate() {
    this.visible = !this.visible;
  }

  //右键编辑
  edit(e: any) {
    this.drawereditfrom.from.formcontent.patchValue({
      id: e[0].value,
      area: e[3].value,
      m_num: e[4].value,
      name: e[5].value,
      size: e[6].value,
      num: e[7].value,
      unit: e[8].value,
      remark: e[9].value,
    });
    this.drawereditfrom.from.newform();
    this.drawereditfrom.visible = true;
  }

  // 表格请求数据
  gettabledata(e?: any) {
    this.visible = true;
    e != this.id && e != null && e != undefined ? (this.id = e) : null;
    this.http.post('product/lst', { id: this.id }).subscribe((data: any) => {
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
          a === 'id' ? (d['hidden'] = true) : (d['hidden'] = false);
          if (a === 'state') {
            d['type'] = 2;
          } else if (a === 'pic') {
            d['type'] = 5;
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

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
    this.fileList = [];
    this.productid = undefined;
  }

  // 添加数据
  addsubmit(e: any) {
    let data: any = {};
    data['detail'] = e;
    data['order_id'] = this.id;
    this.http.post('product/save', data).subscribe((data: any) => {
      if (data.code === 200) {
        this.draweraddfrom.drawerstate();
        this.gettabledata();
        this.message.create('success', data.msg);
      } else {
        this.message.create('error', data.msg);
      }
    });
  }
  // 编辑数据
  eidtsublimt(e: any) {
    let data: any = {};
    data['id'] = e.id;
    delete e.id;
    data['detail'] = e;
    data['order_id'] = this.id;
    this.http.post('product/save', data).subscribe((data: any) => {
      if (data.code === 200) {
        this.drawereditfrom.drawerstate();
        this.gettabledata();
        this.message.create('success', data.msg);
      } else {
        this.message.create('error', data.msg);
      }
    });
  }
  // 上传图片
  upimg(e: any) {
    this.action = 'product/upload/id/' + e;
    this.productid = e;
    // this.getimglst();
    let img = this.tabledatacopy.filter(
      (item: any) => item.id === this.productid
    );
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
        this.fileList.push(d);
      });
    }
    this.isVisibleMiddle = true;
  }

  updone(info: any) {
    if (info.file.status !== 'uploading') {
      console.log(info.fileList);
    }
    if (info.file.status === 'done') {
      this.gettabledata();
    }
  }
  // 双击
  dbclick(e: any) {
    this.db.emit(e);
  }

  // 添加数据
  addclick(e: any) {
    this.draweraddfrom.visible = true;
  }

  // 右键
  contextMenu($event: any, menu: NzDropdownMenuComponent, data: any) {
    this.delimgurl = data;
    this.nzContextMenuService.create($event, menu);
  }

  //改变图片顺序
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.fileList, event.previousIndex, event.currentIndex);
    let array: any = [];
    this.fileList.forEach((e: any) => {
      array.push(e['url'].replace(this.imgurl, ''));
    });
    let data: any = {};
    data['id'] = this.productid;
    data['pic'] = array.toString();
    this.http.post('product/save', data).subscribe((data: any) => {
      if (data.msg === '成功') {
        this.message.create('success', `修改成功`);
        this.gettabledata();
      } else {
        this.message.create('error', '修改失败');
      }
    });
  }

  // 删除图片
  delimg() {
    let array: any = [];
    this.fileList.forEach((e: any) => {
      array.push(e['url'].replace(this.imgurl, ''));
    });
    array = array.filter((e: any) => {
      return e != this.delimgurl.replace(this.imgurl, '');
    });
    let data: any = {};
    data['id'] = this.productid;
    data['pic'] = array.toString();
    data['delurl'] = this.delimgurl.replace(this.imgurl, '');

    this.http.post('product/delimg', data).subscribe((data: any) => {
      if (data.msg === '成功') {
        this.message.create('success', `成功`);
        this.gettabledata();
      } else {
        this.message.create('error', '失败');
      }
    });
  }

  importdata(e: any) {
    const orderdata: any = [];
    let listdata = e.filter((e: any) => {
      return !isNaN(e[0]);
    });
    listdata.forEach((e: any, index: any) => {
      let array: any = {};
      array.detail = {};
      console.log(e);
      array.order_id = this.id;
      array.detail.area = e[1];
      array.detail.m_num = e[2];
      array.detail.name = e[3];
      array.detail.size = e[4];
      array.detail.num = e[5];
      array.detail.unit = e[6];
      array.detail.remark = e[7];

      orderdata.push(array);
    });
    this.http.post('product/saveall', orderdata).subscribe((data: any) => {
      if (data.code === 200) {
        this.gettabledata();
        this.message.create('success', data.msg);
      } else {
        this.message.create('error', data.msg);
      }
    });
  }

  emptyexcel() {
    this.http.post('product/emptyexcel').subscribe((data: any) => {
      if (data.code === 200) {
        window.open('http://localhost:4200/product/downeexcel/filename/'+data.msg);
        // this.gettabledata();
        // this.message.create('success', data.msg);
      } else {
        this.message.create('error', data.msg);
      }
    });
    // window.open('http://localhost:4200/product/productexcel')
  }

  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private nzContextMenuService: NzContextMenuService
  ) {}

  ngOnInit(): void {}
}
