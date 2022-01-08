import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Data } from '@angular/router';
import { HttpService } from './../../services/http-service.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.less'],
})
export class SearchComponent implements OnInit {
  @Input() type: any = {
    num: true,
    date: true,
    orderstate: false,
    peopelname: false,
    peopleclass: false,
    peoplestate: false,
    supplier:false
  }; //判断哪些隐藏
  @Input() item: any; //判断是项目还是子项目
  @Output() public getdata: any = new EventEmitter();
  @Input() tag = ['生产中', '待发货', '已完成']; //默认单选框
  // 搜索列表
  searchlist: {
    ordername: string[];
    ordernum: string[];
    orderdtae: Data | null;
    orderstate: string;
    item?: boolean;
    peopelname?: string[];
    peopleclass?: string | null;
    peoplestate?: string | null;
    supplier?: string[];
  } = {
    ordername: [],
    ordernum: [],
    orderdtae: null,
    orderstate: '0',
    peopelname: [],
    peopleclass: '0',
    peoplestate: '0',
    supplier: [],
  };

  numList: string[] = [];
  numList2: string[] = [];
  numList3: string[] = [];
  optionList: any; //项目列表数据
  peoplelst: any; //人员数据
  supplierlst: any; //供应商数据
  isLoading: boolean = false;

  // 搜索项目名称
  onSearch(value: string) {
    this.isLoading = true;
    this.getordername(value);
  }

  // 获取工令号
  getordernum() {
    this.http
      .post('order/getordernum', { name: this.searchlist.ordername })
      .subscribe((data: any) => {
        this.numList = data.data;
        this.numList2 = data.data;
        this.searchlist.ordernum = [];
      });
  }
  // 搜索项目名称发生变化
  searchchange() {
    this.fromchange();
    this.getordernum();
    this.searchlist.ordernum = [];
  }
  // 表单数据发生变化
  fromchange() {
    this.getdata.emit(this.searchlist);
  }
  // 工令号筛选
  getfilternum(value: string) {
    if (value != '') {
      this.numList = this.numList2.filter((item: string) => {
        return item.toString().indexOf(value) > -1;
      });
    } else {
      this.numList = this.numList2;
    }
  }

  // 重置搜索
  resetSearch() {
    this.searchlist = {
      ordername: [],
      ordernum: [],
      orderdtae: [],
      orderstate: '0',
    };
    this.numList = this.numList3;
    this.fromchange();
  }

  // 获取项目名称
  getordername(e: string) {
    this.http
      .post('order/getordername', { name: e, item: this.item })
      .subscribe((data: any) => {
        this.isLoading = false;
        this.optionList = data.data;
      });
  }

  // 获取员工名称
  getpeoplename(e: string) {
    this.http
      .post('people/getname', { name: e})
      .subscribe((data: any) => {
        this.isLoading = false;
        this.peoplelst = data.data;
      });
  }
  // 搜索获取员工名称
  peopleonSearch(value: string) {
    this.isLoading = true;
    this.getpeoplename(value);
  }


  // 获取员工名称
  getsuppliername(e: string) {
    this.http
      .post('supplier/getname', { name: e })
      .subscribe((data: any) => {
        this.isLoading = false;
        this.supplierlst = data.data;
      });
  }
  // 搜索获取员工名称
  supplieronSearch(value: string) {
    this.isLoading = true;
    this.getsuppliername(value);
  }


  constructor(private http: HttpService) {}

  ngOnInit(): void {
    this.searchlist['item'] = this.item;
    if (this.type.num) {
      this.http
        .post('order/getordernum', this.searchlist)
        .subscribe((data: any) => {
          this.numList = data.data;
          this.numList2 = data.data;
          this.numList3 = data.data;
        });
      this.getordername('');
    }

    if (this.type.peopelname) {
      this.getpeoplename('');
    }
    if (this.type.supplier) {
      this.getsuppliername('');
    }
  }
}
