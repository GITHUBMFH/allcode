import { Component, OnInit, Input } from '@angular/core';
import { HttpService } from './../services/http-service.service';

import { ElementRef } from '@angular/core';

import {
  CdkDragDrop,
  moveItemInArray,
} from 'ng-zorro-antd/node_modules/@angular/cdk/drag-drop';

import { NzMessageService } from 'ng-zorro-antd/message';
import { url } from './../api';

declare var hljs: any;

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.less'],
})
export class PageComponent implements OnInit {
  @Input() pagedata: any = [];
  cdkDro: boolean = false; //开启编辑
  move: boolean = false; //开启排序
  pageid?: number;
  pagetitle?: string;

  imgurl: string = 'http://resource.yasfurniture.cn/';
  fileid?: number;
  imgstyle:string='@mfhimg'

  // 渲染编辑的代码
  onBlur(e: any) {
    let id = e;
    let text = this.pagedata.content.find((e: any, i: any) => {
      return i == id;
    });

    let a: any = document.querySelector('#pre' + id + ' code');
    a.innerText = text.value;

    hljs.highlightBlock(a);

    this.pagedata.content[id].edit = false;
    this.savedata();
  }

  // 编辑代码
  editcode(e: any) {
    let id = e;
    this.pagedata.content[id].edit = true;
    setTimeout(() => {
      this.eleRef.nativeElement.querySelector('#input' + id).focus();
    }, 300);
  }

  // 保存数据
  savedata() {
    this.http
      .post(url.savediv, {
        pagedata: this.pagedata.content,
        id: this.pagedata.id,
        title: this.pagedata.title,
        tag: this.pagedata.tag,
      })
      .subscribe((res: any) => {
        if (res.code == 200) {
          this.message.success(res.msg);
          window.localStorage['pagedata'] = JSON.stringify(this.pagedata);
        } else {
          // this.message.error(res.msg);
        }
      });
  }

  //改变顺序
  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(
      this.pagedata.content,
      event.previousIndex,
      event.currentIndex
    );
    this.savedata();
  }

  droplst(event: CdkDragDrop<string[]>,data:any) {
    moveItemInArray(
      data,
      event.previousIndex,
      event.currentIndex
    );
    this.savedata();
  }

  // 删除段落
  dellst(key: any) {
    this.pagedata.content.splice(
      this.pagedata.content.findIndex((e: any, i: any) => i === key),
      1
    );
    this.savedata();
  }

  // 获取代码的行数
  getcount(strSource: any) {
    let array = strSource.split('\n');
    return array;
  }

  // 添加段落
  addpart(e: number, key: number) {
    let part: any = {
      edit: false,
      type: e,
      value: '暂无数据',
    };
    e == 4
      ? (part = {
          edit: false,
          type: e,
          value: ['暂无数据'],
        })
      : null;
    // this.pagedata.content = [...this.pagedata.content, part];
    this.pagedata.content.splice(key + 1, 0, part);
    this.savedata();
  }

  // 添加
  addtitle() {
    let part: any = {
      edit: false,
      type: 1,
      value: '暂无数据',
    };
    // this.pagedata.content = [...this.pagedata.content, part];
    this.pagedata.content = [part];
    this.savedata();
  }

  // 添加列表
  addlist(e: any) {
    this.pagedata.content[e].value = [
      ...this.pagedata.content[e].value,
      '暂无数据',
    ];
    this.savedata();
  }

  // 删除列表
  dellist(e: any, key: any,skey:any) {
    key == 0 ? this.pagedata.content.splice(e, 1) : this.pagedata.content[e].value.splice(skey, 1);;
    this.savedata();
  }

  //上传文件
  beforeUpload = (file: any): boolean => {
    const formData = new FormData();
    formData.append('file[]', file);
    this.http.post(url.upfile, formData).subscribe((res: any) => {
      if (res.code == 200) {
        let key: any = this.fileid;
        let part: any = {
          edit: false,
          type: 5,
          value: res.key,
        };
        this.pagedata.content.splice(key + 1, 0, part);
        this.savedata();
      } else {
        this.message.error('上传失败');
      }
    });
    return false;
  };

  delfile(name:string) {
    this.http.post(url.delfile,{name:name}).subscribe((res:any) => {
      if (res.code == 200) {
        this.message.success(res.msg);
      } else {
        this.message.error(res.msg);
      }
    })
  }
  constructor(
    private http: HttpService,
    private eleRef: ElementRef,
    private message: NzMessageService
  ) {}
  ngOnInit(): void {}
  ngAfterViewInit() {
    // 渲染代码
    let preEle: any = document.querySelectorAll('pre code');
    preEle.forEach((el: any) => {
      hljs.highlightBlock(el);
    });
  }
}

// window.localStorage["pagedata"] = JSON.stringify(data);
