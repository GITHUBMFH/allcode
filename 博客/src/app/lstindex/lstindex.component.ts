import { Component, OnInit, ViewChild,Renderer2} from '@angular/core';
import { Validators } from '@angular/forms';
import {
  CdkDragDrop,
  moveItemInArray,
} from 'ng-zorro-antd/node_modules/@angular/cdk/drag-drop';
import { HttpService } from '../services/http-service.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { url } from '../api';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { mergeMap } from 'rxjs/operators';
import { HttpRequest, HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-lstindex',
  templateUrl: './lstindex.component.html',
  styleUrls: ['./lstindex.component.less'],
})
export class LstindexComponent implements OnInit {
  @ViewChild('pagefrom') pagefrom: any; //表单子组件
  @ViewChild('addtagfrom') addtagfrom: any; //表单子组件
  @ViewChild('getpage') getpage: any; //page组件

  PageIndex: number = 1;
  PageSize: number = 20;
  Total: number = 1; //总数
  seachervalue?: string; //搜索值
  data: any[] = []; //列表数据
  seachertag: boolean = true; //文章和资源搜索
  resource_title: string = '';
  edittable: boolean = true;

  showloading: boolean = false;//是佛显示加载效果

  pageshow: boolean = false;
  getpagedata?: any;

  pageboxshow: boolean = false;
  lstboxshow: boolean = false;
  tagboxshow: boolean = false;
  percent: number = 0; //加载进度条
  unhttp: any;
  action: string = 'http://upload.qiniup.com/';
  // 上传文件
  uploading = false;
  fileList: NzUploadFile[] = [];

  radioValue = ''; //单选的值
  tag: any = [];
  // 添加文章表格
  formdata: any = [
    {
      value: 'tag',
      title: 'tag',
      data: '',
      placeholder: 'tag',
      type: 6,
      Validators: [Validators.required],
      tag: this.tag,
    },
    {
      value: 'title',
      title: '标题',
      data: '',
      placeholder: '输入标题',
      type: 0,
      Validators: [Validators.required],
    },
  ];
  // 添加标签表格
  addtagdata: any = [
    {
      value: 'color',
      title: '颜色',
      data: '',
      placeholder: '请输入颜色',
      type: 0,
      Validators: [Validators.required],
      tag: this.tag,
    },
    {
      value: 'name',
      title: '标签',
      data: '',
      placeholder: '输入标签',
      type: 0,
      Validators: [Validators.required],
    },
  ];

  colors: string[] = [
    'magenta',
    'red',
    'volcano',
    'orange',
    'gold',
    'lime',
    'green',
    'cyan',
    'blue',
    'geekblue',
    'purple',
    '#f50',
    '#2db7f5',
    '#87d068',
    '#108ee9',
  ];

  // 隐藏弹出框
  hidebox() {
    this.pageboxshow = false;
    this.lstboxshow = false;
    this.tagboxshow = false;
    this.fileList = [];
  }

  // 添加标签
  addtag() {
    const tags = this.addtagfrom.formcontent.value;
    let tag = this.tag.find((data: any) => {
      return data.name == tags.name;
    });
    if (tag) {
      this.message.error('重复标签');
    } else {
      this.tag = [...this.tag, tags];
      this.savetag();
    }
  }

  tagClose(e: any) {
    this.tag = this.tag.filter((item: any) => item.name != e);
    this.savetag();
  }

  // 修改标签
  savetag() {
    this.http.post(url.savetag, { tag: this.tag }).subscribe((res: any) => {
      if (res.code == 200) {
        this.message.success(res.msg);
      } else {
        this.message.error(res.msg);
      }
      this.hidebox();
    });
  }

  // 获取标签
  gettag() {
    this.http.post(url.gettag).subscribe((res: any) => {
      if (res.code == 200) {
        this.tag = res.data;
      } else {
        this.message.error(res.msg);
      }
    });
  }

  // 添加文章
  addpage() {
    const data = this.pagefrom.formcontent.value;
    this.http.post(url.savediv, data).subscribe((res: any) => {
      if (res.code == 200) {
        this.getdata();
        this.message.success(res.msg);
      } else {
        this.message.error(res.msg);
      }
    });
  }

  //改变顺序
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.tag, event.previousIndex, event.currentIndex);
    this.savetag();
  }


  // 隐藏加载
  hideloading() {
    setTimeout(() => {
      this.showloading = false;
    }, 300);
  }
  // 获取列表数据
  getdata(e?: any) {
    this.PageIndex = e ? e : 1;
    let data: any = {};
    data.pageSize = this.PageSize;
    data.pageIndex = this.PageIndex;
    data.value = this.seachervalue;
    data.tags = this.radioValue;
    this.showloading = true;
    this.http.post(url.getdiv, data).subscribe((res: any) => {
      if (res.code == 200) {
        this.data = res.data;
        this.Total = res.count;
      } else {
        this.message.error('数据查询失败');
      }
      this.hideloading();
      this.hidebox();
    });
  }

  // 获取资源列表数据
  getlst(e?: any) {
    let data: any = {};
    this.PageIndex = e ? e : 1;
    data.pageSize = this.PageSize;
    data.pageIndex = e ? e : this.PageIndex;
    data.value = this.seachervalue;
    data.tags = this.radioValue;
    this.showloading = true;
    this.http.post(url.getlst, data).subscribe((res: any) => {
      if (res.code == 200) {
        this.data = res.data;
        this.Total = res.count;
      } else {
        this.message.error('数据查询失败');
      }
      this.hideloading();
      this.hidebox();
    });
  }

  // 显示页面
  gopage(data: any) {
    this.pageshow = true;
    this.getpagedata = data;
  }

  // 关闭页面
  pageclose() {
    this.pageshow = false;
  }
  // 获取颜色
  getcolor(tags: any) {
    let color: any = this.tag.find((data: any) => {
      return data.name == tags;
    });
    return color.color;
  }
  // 删除page
  delpage(id: number) {
    this.http.post(url.delpage, { id: id }).subscribe((res: any) => {
      if (res.code == 200) {
        this.message.success(res.msg);
        this.data.splice(
          this.data.findIndex((item) => item.id === id),
          1
        );
      } else {
        this.message.error(res.msg);
      }
    });
  }

  // 删除资源
  delresource(id: number, fileurl: string) {
    this.http
      .post(url.dellst, { id: id, url: fileurl })
      .subscribe((res: any) => {
        if (res.code == 200) {
          this.message.success(res.msg);
          this.data.splice(
            this.data.findIndex((item) => item.id === id),
            1
          );
        } else {
          this.message.error(res.msg);
        }
      });
  }

  // 改变资源标题
  changetitle(e: any, id: number) {
    this.http
      .post(url.changetitle, { id: id, title: e })
      .subscribe((res: any) => {
        if (res.code == 200) {
          this.message.success(res.msg);
        } else {
          this.message.error(res.msg);
        }
      });
  }

  // 下载资源
  downfile(downurl: string) {
    this.http.post(url.downfile, { url: downurl }).subscribe((res: any) => {
      this.downloadFile(res, downurl);
    });
  }
  
// 复制链接
  copyfile(downurl: string) {
    this.http.post(url.downfile, { url: downurl }).subscribe((res: any) => {
      const copyText = this.render2.createText(res);
      const copyElement = this.render2.createElement('label');
      this.render2.appendChild(copyElement, copyText)
      this.render2.appendChild(document.body, copyElement)
      this.render2.setStyle(copyElement, 'opacity', '0');
      const range = document.createRange();
      range.selectNode(copyElement);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');

      this.message.success('复制成功')
      window.getSelection()?.removeAllRanges();
      this.render2.removeChild(document.body, copyElement);
    });
  }

  // 文件上传前
  beforeUpload = (file: NzUploadFile): boolean => {
    this.fileList = this.fileList.concat(file);
    return false;
  };

  // 上传文件
  handleUpload(): void {
    this.unhttp = this.http
      .post(url.gettoken)
      .pipe(
        mergeMap((token: any) => {
          this.uploading = true;
          const formData = new FormData();
          let keyname: string = '';
          let time = new Date().getTime();
          this.fileList.forEach((file: any) => {
            formData.append('file', file);
            const index = file.name.lastIndexOf('.');
            let laststring = file.name.substring(index+1,file.name.length);
            keyname = 'cs' + laststring + time + '.' + laststring;
          });
          formData.append('token', token);
          formData.append('key', keyname);
          const req = new HttpRequest('POST', this.action, formData, {
            reportProgress: true,
          });
          return this.https.request(req);
        })
      )
      .subscribe((event: any) => {
        if (event.type == 1) {
          this.percent = Math.round((100 * event.loaded) / event.total);
        } else if (event.type == 4) {
          const data = this.pagefrom.formcontent.value;
          data.key = event.body.key;
          this.http.post(url.resourcefile, data).subscribe((res: any) => {
            res.code == 200
              ? this.message.success(res.msg)
              : this.message.error(res.msg);
            this.getlst();
            this.uploading = false;
            this.percent = 0;
          });
        }
      });
  }

  // 取消上传
  unhttps() {
    this.unhttp.unsubscribe();
    this.uploading = false;
  }

  // 颜色选择
  setcolor(color: string) {
    this.addtagfrom.formcontent.patchValue({
      color: color,
    });
  }

  // 改变标签
  resourcechangetag(id: number, tag: any) {
    this.http
      .post(url.resourcechangetag, { id: id, tag: tag })
      .subscribe((res: any) => {
        res.code == 200
          ? this.message.success(res.msg)
          : this.message.error(res.msg);
        res.code == 200
          ? this.data.map((item: any) => {
              return item.id == id ? (item.tag = tag) : null;
            })
          : null;
      });
  }
  // 改变标签
  pagechangetag(id: number, tag: string) {
    this.http
      .post(url.pagechangetag, { id: id, tag: tag })
      .subscribe((res: any) => {
        res.code == 200
          ? this.message.success(res.msg)
          : this.message.error(res.msg);
        res.code == 200
          ? this.data.map((item: any) => {
              return item.id == id ? (item.tag = tag) : null;
            })
          : null;
      });
  }

  // 下载文件
  downloadFile(fileUrl: any, fileName: any) {
    // 获取文件扩展名
    const index = fileUrl.lastIndexOf('.');
    const fileExtension = fileUrl.substring(index + 1, fileUrl.length);

    // 图片下载
    if (/^[jpeg|jpg|png|gif|txt]/.test(fileExtension)) {
      const image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute('crossOrigin', 'anonymous');
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context: any = canvas.getContext('2d');
        context.drawImage(image, 0, 0, image.width, image.height);
        const url = canvas.toDataURL(fileUrl); // 得到图片的base64编码数据
        const a = document.createElement('a'); // 生成一个a元素
        const event = new MouseEvent('click'); // 创建一个单击事件
        a.download = fileName || 'photo'; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = fileUrl;
    } else {
      const elemIF = document.createElement('iframe');
      elemIF.src = fileUrl;
      elemIF.style.display = 'none';
      document.body.appendChild(elemIF);
      setTimeout(() => {
        document.body.removeChild(elemIF);
      }, 1000);
    }
  }

  keyDown(e: any) {
    if (e.keyCode == 13) {
      this.seachertag ? this.getdata() : this.getlst();
    }
  }
  constructor(
    private http: HttpService,
    private message: NzMessageService,
    private https: HttpClient,
    private router: Router,
    private location: PlatformLocation,
    private render2: Renderer2
  ) {
    // 添加100个后退页面
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        for (var i = 0; i < 100; i++) {
          history.pushState(null, '', '/');
          i = i++;
        }
      }
    });
    // 监听后退操作
    this.location.onPopState(() => {
      this.pageshow = false;
    });
  }

  ngOnInit(): void {
    this.gettag();
  }
}
