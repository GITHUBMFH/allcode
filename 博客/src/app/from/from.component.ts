import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-from',
  templateUrl: './from.component.html',
  styleUrls: ['./from.component.less'],
})
export class FromComponent implements OnInit {
  @Input() formdata: any;
  @Input() tag?: any;
  formcontent = this.fb.group({});

  //重置表单
  resetForm(): void {
    this.formcontent.reset();
    for (const key in this.formcontent.controls) {
      this.formcontent.controls[key].markAsPristine();
      this.formcontent.controls[key].updateValueAndValidity();
    }
  }

  newform() {
    for (const key in this.formcontent.controls) {
      this.formcontent.controls[key].markAsDirty();
      this.formcontent.controls[key].updateValueAndValidity();
    }
  }
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formdata.forEach((e: any) => {
      this.formcontent.addControl(
        e.value,
        this.fb.control(e.data, e.Validators)
      );
    });
  }
}
