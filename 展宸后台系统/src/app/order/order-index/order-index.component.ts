import { Component, OnInit } from '@angular/core';

import {iconlsit} from '../../sharedata'

@Component({
  selector: 'app-order-index',
  templateUrl: './order-index.component.html',
  styleUrls: ['./order-index.component.less']
})
export class OrderIndexComponent {
  geticon:iconlsit[]=[{
    icon: "pie-chart", 
    title: "生产单数量",
    number:100,
    color:"background-color:#007aff",
    bg:'background-color:#e4ecff',
  },{
    icon: "alert", 
    title: "未完成订单数量",
    number:100,
    color:"background-color:#ffab2b",
    bg:'background-color:#fff3e0',
  }
  ,{
    icon: "check-circle", 
    title: "完成订单数量",
    number:100,
    color:"background-color:#6dd230",
    bg:'background-color:#eaf9e1',
  }
  ,{
    icon: "shop", 
    title: "待采购数量",
    number:100,
    color:"background-color:#ff85c0",
    bg:'background-color:#ffeaf4',
  }]

}
