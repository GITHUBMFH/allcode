import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less'],
})
export class MenuComponent implements OnInit {
  tiele: string = '佛山市展宸酒店家具';
  cssstyle = { width: '90%' };
  constructor() {}

  ngOnInit(): void {}
}
