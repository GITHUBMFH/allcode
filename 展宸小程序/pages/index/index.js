import {
  post
} from '../../request/index.js';
import {
  IndexOrder
} from '../../request/api';
import {
  getordercount
} from '../../request/api';

const app = getApp();
var settime = 0;
Page({
  data: {
    refresher: false,
    searchvalue: '',
    active: 1,
    orderdata: [],
    orderdata1: [],
    orderdata2: [],
    orderdata3: [],
    // tag: ['全部', '生产中', '待发货', '已完成'],
    tag: [{
      value: '全部',
      count: ''
    }, {
      value: '生产中',
      count: ''
    }, {
      value: '待发货',
      count: ''
    }, {
      value: '已完成',
      count: ''
    }],
    pageIndex: 1,
    pageIndex1: 1,
    pageIndex2: 1,
    pageIndex3: 1,
    height: '',
    loading: true,
    loading1: true,
    loading2: true,
    loading3: true,
    tabgetdata:true,
    tabgetdata1:true,
    tabgetdata2:true,
    tabgetdata3:true,
    page: 2,
    page1: 2,
    page2: 2,
    page3: 2,
  },
  onShow() {
		this.getTabBar().init();
	},
  onLoad: function (options) {
    // this.getdata();
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight - 100
        })
      }
    })
    this.getcount();
  },
  getcount() {
    post(getordercount, { name:this.data.searchvalue}).then((res) => {
      this.setData({
        ['tag[1].count']: res.count1,
        ['tag[2].count']: res.count2
      })
    })
  },
  // 获取表单数据
  getdata: function () {
    switch (this.data.active) {
      case 0:
        var istab = this.data.page === 1 ? false : this.data.pageIndex <= this.data.page;
        break;
      case 1:
        var istab = this.data.page1 === 1 ? false : this.data.pageIndex1 <= this.data.page1;
        break;
      case 2:
        var istab = this.data.page2 === 1 ? false : this.data.pageIndex2 <= this.data.page2;
        break;
      case 3:
        var istab = this.data.page3 === 1 ? false : this.data.pageIndex3 <= this.data.page3;
        break;
    }
    if (istab) {
      let data = {};
      switch (this.data.active) {
        case 0:
          data.pageIndex = this.data.pageIndex;
          this.setData({
            loading: true,
          })
          break;
        case 1:
          data.pageIndex = this.data.pageIndex1;
          this.setData({
            loading1: true,
          })
          break;
        case 2:
          data.pageIndex = this.data.pageIndex2;
          this.setData({
            loading2: true,
          })
          break;
        case 3:
          data.pageIndex = this.data.pageIndex3;
          this.setData({
            loading3: true,
          })
          break;
      }
      data.filter = {};
      data.filter.orderstate = this.data.active;
      data.filter.ordername = this.data.searchvalue;
      post(IndexOrder, data).then((res) => {
        switch (this.data.active) {
          case 0:
            this.setData({
              orderdata: this.data.orderdata.concat(res.data),
              page: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex === this.data.page||res.count===0) {
              this.setData({
                loading: false,
              })
            }
            break;
          case 1:
            this.setData({
              orderdata1: this.data.orderdata1.concat(res.data),
              page1: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex1 === this.data.page1||res.count===0) {
              this.setData({
                loading1: false,
              })
            }
            break;
          case 2:
            this.setData({
              orderdata2: this.data.orderdata2.concat(res.data),
              page2: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex2 === this.data.page2||res.count===0) {
              this.setData({
                loading2: false,
              })
            }
            break;
          case 3:
            this.setData({
              orderdata3: this.data.orderdata3.concat(res.data),
              page3: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex3 === this.data.page3||res.count===0) {
              this.setData({
                loading3: false,
              })
            }
            break;
        }
        this.setData({
          refresher: false
        })
      }).catch((errMsg) => {
        wx.showToast({
          title: errMsg,
          icon: "none"
        })
      });
    } else {
      this.getlodingfalse();
    }
  },
  // 关闭加载效果
  getlodingfalse() {
    switch (this.data.active) {
      case 0:
        this.setData({
          loading: false,
        })
        break;
      case 1:
        this.setData({
          loading1: false,
        })
        break;
      case 2:
        this.setData({
          loading2: false,
        })
        break;
      case 3:
        this.setData({
          loading3: false,
        })
        break;
    }
  },
  // 下拉刷新
  getdown() {
    switch (this.data.active) {
      case 0:
        this.setData({
          pageIndex: this.data.pageIndex + 1,
        })
        break;
      case 1:
        this.setData({
          pageIndex1: this.data.pageIndex1 + 1,
        })
        break;
      case 2:
        this.setData({
          pageIndex2: this.data.pageIndex2 + 1,
        })
        break;
      case 3:
        this.setData({
          pageIndex3: this.data.pageIndex3 + 1,
        })
        break;
    }

    this.getdata();
  },
  // tabs改变时
  onChange(event) {
    this.setData({
      active: event.detail.index
    })
    switch (this.data.active) {
      case 0:
        this.data.tabgetdata ? this.getdata() : null;
        this.setData({
          tabgetdata:false,
        })
        break;
      case 1:
        this.data.tabgetdata1 ? this.getdata() : null;
        this.setData({
          tabgetdata1:false
        })
        break;
      case 2:
        this.data.tabgetdata2 ? this.getdata() : null;
        this.setData({
          tabgetdata2:false,
        })
        break;
      case 3:
        this.data.tabgetdata3 ? this.getdata() : null;
        this.setData({
          tabgetdata3:false,
        })
        break;
    }
  },
  // 切换false/true
  toggle(type) {
    this.setData({
      [type]: !this.data[type],
    });
  },
  //页面重置
  pagerest() {
    this.setData({
      page: 2,
      page1: 2,
      page2: 2,
      page3: 2,
      pageIndex: 1,
      pageIndex1: 1,
      pageIndex2: 1,
      pageIndex3: 1,
      tabgetdata:true,
      tabgetdata1:true,
      tabgetdata2:true,
      tabgetdata3:true,
      orderdata: [],
      orderdata1: [],
      orderdata2: [],
      orderdata3: [],
    })
  },
  searchchange() {
    clearTimeout(settime);
    settime = setTimeout(() => {
      this.pagerest();
      this.getdata();
      this.getcount();
    }, 500)
  },
    // 下拉刷新
    gettop() {
      switch (this.data.active) {
        case 0:
          this.setData({
            orderdata: [],
            pageIndex: 1,
            page: 2,
          })
          break;
        case 1:
          this.setData({
            orderdata1: [],
            pageIndex1:1,
            page1: 2,
          })
          break;
        case 2:
          this.setData({
            orderdata2: [],
            pageIndex2:1,
            page2: 2,
          })
          break;
        case 3:
          this.setData({
            orderdata3: [],
            pageIndex3:1,
            page3: 2,
          })
          break;
      }
      this.getdata();
    }
});