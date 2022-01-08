const app = getApp()
import {
  post
} from '../../request/index.js';
import {
  imgulr,
  shoplst,
  producttitle,
  product
} from '../../request/api';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: '',
    active: 0,
    shopactive:0,
    orderid: '',
    productdata: [],
    imgulr: imgulr,
    imglst: [],
    imgshow:false,
    isproduct:true,
    isshop: false,
    iscut: false,
    shoplst: [],
    shoplst1: [],
    shoplst2: [],
    shoplst3: [],
    shoplst4: [],
    shoplst5: [],
    shoplst6: [],
    shoplst7: [],
    shoplst8: [],
    notshop:0,
    tag: [{
      value: '全部',
      count: ''
    },{
      value: '板材',
      count: ''
    }, {
      value: '石',
      count: ''
    }, {
      value: '玻璃',
      count: ''
    }, {
      value: '五金',
      count: ''
    }, {
      value: '配件',
      count: ''
    }, {
      value: '油漆',
      count: ''
    }, {
      value: '面料',
      count: ''
    }, {
      value: '纸箱',
      count: ''
    }, {
      value: '其他',
      count: ''
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight - 100
        })
      }
    })
    this.setData({
      orderid:options.id,
    })
    this.getdata();
    this.gettitle();
    this.getshopdata();
  },
  getshopdata() {
    post(shoplst,{orderid:this.data.orderid}).then((res) => {
      var data = this.checkshop(res.data);
      var length1 = res.data.filter((i) => {
        return i.state == '1'
      });
      var length2 = res.data.filter((i) => {
        return i.state == '2'
      });
      this.setData({
        shoplst:res.data,
        shoplst1:data.data1,
        shoplst2:data.data2,
        shoplst3:data.data3,
        shoplst4:data.data4,
        shoplst5:data.data5,
        shoplst6:data.data6,
        shoplst7:data.data7,
        shoplst8: data.data8,
        shoplst9: data.data9,
        ['tag[0].count']:res.data.length,
        ['tag[1].count']:data.data1.length,
        ['tag[2].count']:data.data2.length,
        ['tag[3].count']:data.data3.length,
        ['tag[4].count']:data.data4.length,
        ['tag[5].count']:data.data5.length,
        ['tag[6].count']:data.data6.length,
        ['tag[7].count']:data.data7.length,
        ['tag[8].count']:data.data8.length,
        ['tag[9].count']: data.data9.length,
        notshop:length1.length+length2.length
      })
    })
  },
  checkshop(e) {
    var data = {};
    data.data1 = e.filter((i) => {
      return i.type=='板材'
    })
    data.data2 = e.filter((i) => {
      return i.type=='大理石'
    })
    data.data3 = e.filter((i) => {
      return i.type=='玻璃&亚克力&银镜'
    })
    data.data4 = e.filter((i) => {
      return i.type=='五金'
    })
    data.data5 = e.filter((i) => {
      return i.type=='配件'
    })
    data.data6 = e.filter((i) => {
      return i.type=='油漆'
    })
    data.data7 = e.filter((i) => {
      return i.type=='面料'
    })
    data.data8 = e.filter((i) => {
      return i.type=='纸箱'
    })
    data.data9 = e.filter((i) => {
      return i.type=='其他'
    })
    return data;
  },
  // 获取产品数据
  getdata() {
    post(product,{id:this.data.orderid}).then((res) => {
      this.setData({
        productdata:res.data
      })
    })
  },
  // 设置页面标题
  gettitle() {
    post(producttitle,{id:this.data.orderid}).then((res) => {
      wx.setNavigationBarTitle({
        title:res
      })
    })
  },
  // 主tab切换
  onChange(event) {
    this.setData({
      active: event.detail
    });
    if (event.detail == '0'){
      this.setData({
        isproduct: true,
        isshop: false,
        iscut:false,
      })
    } else if (event.detail == '1') {
      this.setData({
        isproduct: false,
        isshop: true,
        iscut:false,
      })
    } else {
      this.setData({
        isproduct: false,
        isshop: false,
        iscut:true,
      })
    }
  },
  // 显示轮播图
  showimg(e)
  {
    this.setData({
      imglst: e.currentTarget.dataset.imglst,
      imgshow:true
    })
  },
  // 隐藏轮播图
  hideimg() {
    this.setData({
      imgshow:false
    })
  },

})