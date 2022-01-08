interface datatitle {//表头
  value: string;
  type: number; //0:隐藏 1:默认 2:排序
  nzSortOrder?: string | null; //默认的排序方式:null、ascend、descend
  title?: string;//排序项目标识
  width?: string;//宽度
}
// tabletitle: datatitle[] = [
//   // 表格标题
//   { value: 'id', type: 0 },
//   { value: '父id', type: 0 },
//   { value: '项目名称', type: 1 },
//   {
//     value: '工令号',
//     type: 2,
//     nzSortOrder: 'descend',
//     title: 'numsort',
//   },
//   { value: '下单时间', type: 2, nzSortOrder: null, title: 'datesort' },
//   { value: '备注', type: 1 },
// ];

interface datalst {
  value: string;
  type: number; //0 代表默认 1代表时间格式 2部门岗位状态（6个） 3权限状态（5 占位） 4任职状态（2 占位）     5图片
  hidden?: string;
}

// 表单数据
interface datafrom {
  value: string; //值名称
  title: string; //标题
  data: string; //值
  placeholder: string;
  type: number; //0:输入框 1:文本框 2:隐藏 3非必填 4常规提示2 5非必填提示2  6单选
  Validators: any[]; //验证
  tag?:string[]
}
// addfromdata: datafrom[] = [
//   {
//     value: 'name',
//     title: '项目名称',
//     data: '',
//     placeholder: '请输入项目名称',
//     type: 0,
//     Validators: [Validators.required, Validators.minLength(3)],
//   },
//   {
//     value: 'num',
//     title: '工令号',
//     data: '',
//     placeholder: '如果没有值会自动更新工令号',
//     type: 5,
//     Validators: [Validators.pattern('^[0-9]*$'), Validators.minLength(4)],
//   },
//   {
//     value: 'remark',
//     title: '备注',
//     data: '',
//     placeholder: '请输入内容',
//     type: 1,
//     Validators: [],
//   },
// ];

// 展示数据
interface iconlsit {
  icon: string;
  title: string;
  number: number;
  color: string;
  bg: string;
}

export { datafrom, datalst, datatitle, iconlsit };

// 表格
// @Input() nzShowSort:boolean=true
// @Input() cdkDro:boolean = false//是否拖拽
// @Input() ischeck:boolean  = true//是否隐藏多选框
// @Input() loading:boolean  = true;//是否是加载状态
// @Input() tabledata: any;//表格数据
// @Input() total: number = 11;//数据的总数
// @Input() tabletitle: any;//表头
// @Input() post: any;//删除数据的接口
// @Input() contex: any;//右键的操作   添加 添加新订单 导入
// contex: any = {
//     add: true,
//     order: true,
//     putin: true,
//   }
// @Input() pageIndex: number = 1;// 当前页面
// @Input() pageSize: number = 10;//每页数量
// @Input() nzShowPagination: boolean = true;// 是否显示页码
// @Input() nzBordered: boolean = false;//是否显示边框
// @Input() tag=['生产中','待发货','已完成'];//操作标签 需要调整代码
// @Input() tag2=['最高权限','主管','跟单','采购','员工']//
// @Input() tag3=['在职','离职']//

// @Output() public getdata = new EventEmitter();//调用父类的获取数据方法
// @Output() public editclick = new EventEmitter();//点击编辑时触发父类的编辑方法
// @Output() public additemclick = new EventEmitter();//点击添加时触发父类添加方法
// @Output() public addorderclick = new EventEmitter();//点击添加时触发父类添加方法
// @Output() public db = new EventEmitter();//双击时候触发的父类方法
// @Output() public img = new EventEmitter();//上传图片时候触发的父类方法
  
// <app-table
//   [tabledata]="tabledata"
//   [total]="total"
//   [tabletitle]="tabletitle"
//   (editclick)="edit($event)"
//   [post]="delpost"
//   [contex]="contex"
//   (db)="dbclick($event)"
//   (getdata)="pagechange($event)"
//   #ordertable
// ></app-table>

  
  
// 弹出框
// @Input() formdata: any;//表单的数据
// @Input() post: any;//提交数据的接口
// @Input() title: any;//弹出框的标题
// @Input() self: boolean=false;//提交的时候是否是调用父类的提交方法
// @Input() Width: string='460px';//弹出框的宽度

// @Output() parent = new EventEmitter(); //提交之后触发的父类方法
// @Output() selfsubmit = new EventEmitter();//判断self为true的时候调用的父类方法
  
// <app-drawer-from
//   (parent)="gettabledata()"
//   [formdata]="editfromdata"
//   [post]="addpost"
//   [title]="editfromtitle"
//   #drawereditfrom
// ></app-drawer-from>


  
// @Input() type: any = {
//   num: true,生产单
//   date: true,日期
//   orderstate: false,生产状态
//   peopelname: false,员工名称
//   peopleclass: false,员工岗位
//   peoplestate: false,员工状态
//   supplier:false,供应商名称
// }; //判断哪些隐藏
// @Input() item: any; //判断是项目还是子项目
// @Input() tag = ['生产中', '待发货', '已完成']; //默认单选框
  
// @Output() public getdata: any = new EventEmitter();筛选项改变的时候调用父类的获取数据的方法
  
// <!-- 添加搜索 -->
// <app-search #ordersearch (getdata)="serchchange($event)" [item]="false" [type]="type"></app-search>