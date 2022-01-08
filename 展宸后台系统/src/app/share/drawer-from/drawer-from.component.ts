import { Component, Input, OnInit, Output, ViewChild, EventEmitter } from '@angular/core';

import { NzMessageService } from '_ng-zorro-antd@11.4.0@ng-zorro-antd/message';
import { HttpService } from './../../services/http-service.service';

@Component({
  selector: 'app-drawer-from',
  templateUrl: './drawer-from.component.html',
  styleUrls: ['./drawer-from.component.less'],
})
export class DrawerFromComponent implements OnInit {
  visible: boolean = false;
  @Input() formdata: any;
  @Input() post: any;
  @Input() title: any;
  @Input() self: boolean=false;
  @Input() Width: string='460px';

  @Output() parent = new EventEmitter();
  @Output() selfsubmit = new EventEmitter();
  
  @ViewChild('from') from: any; //search子组件

  drawerstate() {
    this.visible = !this.visible;
    this.from.resetForm();
  }

  Submit(e: any) {
    e.preventDefault();
    const data = this.from.formcontent.value;
    if (this.self) {
      this.selfsubmit.emit(data);
    } else {
      this.http.post(this.post, data).subscribe((data: any) => {
        if ((data.code === 200)) {
          this.drawerstate();
          this.parent.emit();
          this.message.create('success', `提交成功`);
        } else {
          this.message.create('error', '提交失败');
        }
      });
    }
  }
  constructor(private http: HttpService,private message: NzMessageService) {}

  ngOnInit(): void {}
}
