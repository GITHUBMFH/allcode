import { NzMessageService } from '_ng-zorro-antd@11.4.0@ng-zorro-antd/message';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Data } from '@angular/router';

import { HttpService } from './../../services/http-service.service';
import {
  NzContextMenuService,
  NzDropdownMenuComponent,
} from '_ng-zorro-antd@11.4.0@ng-zorro-antd/dropdown';
import { NzModalService } from '_ng-zorro-antd@11.4.0@ng-zorro-antd/modal';

import { Router} from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import * as XLSX from 'xlsx';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less'],
})
export class TableComponent implements OnInit {
  pagelst: number[] = [10, 20, 30, 40, 50];
  SortDirections: any[] = ['descend', 'ascend'];
  clickdata: any;
  fileList: any[] = [];
  importUserList: any; //导入表格的数据

  @Input() nzShowSort:boolean=true
  @Input() cdkDro:boolean = false//是否拖拽
  @Input() ischeck:boolean  = true//是否隐藏多选框
  @Input() loading:boolean  = true;//是否是加载状态
  @Input() tabledata: any;
  @Input() total: number = 11;
  @Input() tabletitle: any;
  @Input() post: any;
  @Input() contex: any = {
    order: false,
    add: false,
    edit: true,
    del: true,
    alldel:true
  };
  @Input() pageIndex: number = 1;
  @Input() pageSize: number = 10;
  @Input() nzShowPagination: boolean = true;
  @Input() nzBordered: boolean = false;
  @Input() tag = ['生产中', '待发货', '已完成'];
  @Input() tag2 = ['最高权限', '主管', '跟单', '采购', '员工'];
  @Input() tag3 = ['在职', '离职'];

  // 发射数据
  @Output() public getdata = new EventEmitter();
  @Output() public editclick = new EventEmitter();
  @Output() public additemclick = new EventEmitter();
  @Output() public addorderclick = new EventEmitter();
  @Output() public db = new EventEmitter();
  @Output() public img = new EventEmitter();
  @Output() public importdata = new EventEmitter();
  @Output() public excel = new EventEmitter();

  h="<h2>这是一个 h2 用[innerHTML]来解析</h2>"
  // this.omsg.emit(data);

  fallback =
    'data:image/png;base64,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';

  // 页面变动
  indexchange(e: number) {
    this.updata();
  }

  // 每页数量变动
  sizechange(e: number) {
    this.pageSize = e;
    this.updata();
  }

  // 刷新页面
  updata() {
    this.loading = true;
    this.getdata.emit(this.getpagedata());
  }
  //排序变动
  sortchange(e: string) {
    this.tabletitle.forEach((i: any) => {
      if (i.type === 2 && i.value !== e) {
        i.nzSortOrder = null;
      }
    });
    this.updata();
  }

  // 单击
  oneclick(data: any) {
    this.db.emit(data);
  }

  // 右键
  contextMenu($event: any, menu: NzDropdownMenuComponent, data: any) {
    this.clickdata = data;
    this.nzContextMenuService.create($event, menu);
  }
  // 编辑
  edit() {
    this.editclick.emit(this.clickdata);
  }
  // 添加新项目
  additem() {
    this.additemclick.emit(this.clickdata);
  }
  // 添加新订单
  addorder() {
    this.addorderclick.emit(this.clickdata);
  }
  emptyexcel() {
    this.excel.emit();
  }
  // 批量删除
  alldel() {
    if (this.setOfCheckedId.size < 1) {
      this.modal.info({
        nzTitle: '请先选择批量删除的数据',
        nzContent: '请在表格最左侧选择',
        nzMaskClosable: true,
      });
    } else {
      let dataid: any[] = [];
      for (let value of this.setOfCheckedId.values()) {
        dataid.push(value);
      }
      this.modal.error({
        nzTitle: '确定删除?',
        nzContent: '会删除其下所有资料,并不可恢复',
        nzOkText: '确定',
        nzOkType: 'primary',
        nzOkDanger: true,
        nzOnOk: () => {
          this.http.post(this.post, { id: dataid }).subscribe((data: any) => {
            if (data.code === 200) {
              this.message.create('success', `删除成功`);
              this.updata();
            } else {
              this.message.create('error', '删除失败');
            }
          });
        },
        nzCancelText: '取消',
      });
    }
  }
  // 单个删除
  del() {
    this.modal.error({
      nzTitle: '确定删除?',
      nzContent: '会删除其下所有资料,并不可恢复',
      nzOkText: '确定',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        this.http
          .post(this.post, { id: [this.clickdata[0].value] })
          .subscribe((data: any) => {
            if (data.code === 200) {
              this.message.create('success', `删除成功`);
              this.updata();
            } else {
              this.message.create('error', '删除失败');
            }
          });
      },
      nzCancelText: '取消',
    });
  }
  // 双击
  dbclick(e: any) {
    this.db.emit(e);
  }
  // 上传图片
  upimg(e: any) {
    this.img.emit(e);
  }
  // 打印
  printpage() {
    // const content:any=document.getElementById("report")
    // const windowport=window.open('','','left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0')
    // windowport?.document.write(content.innerHTML)
    // windowport?.document.close();
    // windowport?.focus();
    // window.print();
    // windowport?.close()
    
    // let queryparams:any = {
    //   queryParams: { key: 'tabledata'}, //参数
    // };
    window.localStorage["tabledata"] = JSON.stringify(this.tabledata);
    window.localStorage["tabletitle"] = JSON.stringify(this.tabletitle);

    this.Routed.navigate([{ outlets: { popup: ['print'] } }],)
  }
  // 获取页面页码排序
  getpagedata() {
    let data: any = {};
    data['pageIndex'] = this.pageIndex;
    data['pageSize'] = this.pageSize;
    this.tabletitle.forEach((i: any) => {
      if (i.type === 2) {
        data[i.title] = i.nzSortOrder;
      }
    });
    return data;
  }

  setOfCheckedId = new Set<number | undefined>();
  checked = false; //全选的时候变成true
  indeterminate = false; //全选的时候变成true
  listOfCurrentPageData: ReadonlyArray<Data> = [];
  // 当前页面的数据是否有选中的
  onCurrentPageDataChange(listOfCurrentPageData: ReadonlyArray<Data>): void {
    this.listOfCurrentPageData = listOfCurrentPageData;
    this.refreshCheckedStatus();
  }
  // 判断是否有选中的
  refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfCurrentPageData;
    // const listOfEnabledData = this.listOfCurrentPageData;
    this.checked = listOfEnabledData.every((e: any) =>
      this.setOfCheckedId.has(e[0].value)
    ); //判断是否全选，如果有一个没有选中返回false
    this.indeterminate =
      listOfEnabledData.some((e: any) => this.setOfCheckedId.has(e[0].value)) &&
      !this.checked; //判断是否全选，如果有一个选中变成true
  }
  // 选中时的回调，在set中插入数据，判断是否还有选中的
  onItemChecked(id: number | undefined, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
  // 全选
  onAllChecked(checked: boolean): void {
    this.listOfCurrentPageData.forEach((data) =>
      this.updateCheckedSet(data[0].value, checked)
    );
    this.refreshCheckedStatus();
  }

  // 更新多选
  updateCheckedSet(id: number | undefined, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  // 上传表格
  beforeUpload = (file: any): boolean => {
    if (file) {
      const fileName = file.name; //获取文件名
      const reader: FileReader = new FileReader(); //FileReader 对象允许Web应用程序异步读取存储在用户计算机上的文件
      //当读取操作成功完成时调用FileReader.onload
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        this.importUserList = XLSX.utils.sheet_to_json(ws, { header: 1 }); //解析出文件数据，可以进行后面操作
        // this.importUserHeader =  this.importUserList[0];//获得表头字段
        // this.fileList = this.fileList.concat(file);
        this.importdata.emit(this.importUserList);
      };
      reader.readAsBinaryString(file);
    }

    return false;
  };

  drop(event: CdkDragDrop<string[]>): void {
    // console.log(this.tabledata);
    let id:any = [];
    moveItemInArray(this.tabledata, event.previousIndex, event.currentIndex);

    this.tabledata.forEach((e:any) => {
      id.push(e[0].value)
    });
    this.http.post('order/savesotr', { id: id }).subscribe((data: any) => {
      if (data.code === 200) {
        this.message.create('success',data.msg);
        this.updata();
      } else {
        this.message.create('error',data.msg);
      }
    });
  }

  constructor(
    private http: HttpService,
    private nzContextMenuService: NzContextMenuService,
    private message: NzMessageService,
    private modal: NzModalService,
    public Routed: Router,
  ) {}

  ngOnInit(): void {}
}
