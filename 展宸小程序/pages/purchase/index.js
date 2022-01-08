const app = getApp();
var settime = 0;

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import {
  post
} from '../../request/index.js';
import {
  getshopcount,
  shoplst,
  shopdel
} from '../../request/api';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectshop: false, //是否显示多选框
    refresher: false, //是否是下拉状态
    allselect: false, //是否全选
    searchvalue: '', //搜索value
    active: 2, //tab 
    signnum: 0, //笔画数量
    textall: '全选',
    signshow: false,
    tag: [{
      value: '全部',
      count: ''
    }, {
      value: '审核中',
      count: ''
    }, {
      value: '待采购',
      count: ''
    }, {
      value: '已入库',
      count: ''
    }],
    shopdata: [],
    shopdata1: [],
    shopdata2: [],
    shopdata3: [],
    pageIndex: 1,
    pageIndex1: 1,
    pageIndex2: 1,
    pageIndex3: 1,
    height: '',
    loading: true,
    loading1: true,
    loading2: true,
    loading3: true,
    tabgetdata: true,
    tabgetdata1: true,
    tabgetdata2: true,
    tabgetdata3: true,
    page: 2,
    page1: 2,
    page2: 2,
    page3: 2,
    result: [],
    selecttbutton: "color:red;border:0px"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.pagerest();
    this.getcount();
    const index = {};
    index.detail = {};
    index.detail.index = this.data.active;
    this.onChange(index);
  },
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight - 100
        })
      }
    })
    Toast.setDefaultOptions({
      zIndex: 9999999
    })
  },
  // 获取待审核数量 待采购数量
  getcount() {
    post(getshopcount, {
      name: this.data.searchvalue,
      peopleid: wx.getStorageSync('peopleid')
    }).then((res) => {
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
      data.filter.shopname = this.data.searchvalue;
      data.peopleid = wx.getStorageSync('peopleid');
      post(shoplst, data).then((res) => {
        switch (this.data.active) {
          case 0:
            this.setData({
              shopdata: this.data.shopdata.concat(res.data),
              page: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex === this.data.page || res.count === 0) {
              this.setData({
                loading: false,
              })
            }
            break;
          case 1:
            this.setData({
              shopdata1: this.data.shopdata1.concat(res.data),
              page1: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex1 === this.data.page1 || res.count === 0) {
              this.setData({
                loading1: false,
              })
            }
            break;
          case 2:
            this.setData({
              shopdata2: this.data.shopdata2.concat(res.data),
              page2: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex2 === this.data.page2 || res.count === 0) {
              this.setData({
                loading2: false,
              })
            }
            break;
          case 3:
            this.setData({
              shopdata3: this.data.shopdata3.concat(res.data),
              page3: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex3 === this.data.page3 || res.count === 0) {
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
  // 滚动刷新
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
      active: event.detail.index,
      signshow: false,
      allselect: false,
      result: [],
      selectshop: false
    })
    switch (this.data.active) {
      case 0:
        this.data.tabgetdata ? this.getdata() : null;
        this.setData({
          tabgetdata: false,
        })
        break;
      case 1:
        this.data.tabgetdata1 ? this.getdata() : null;
        this.setData({
          tabgetdata1: false
        })
        break;
      case 2:
        this.data.tabgetdata2 ? this.getdata() : null;
        this.setData({
          tabgetdata2: false,
        })
        break;
      case 3:
        this.data.tabgetdata3 ? this.getdata() : null;
        this.setData({
          tabgetdata3: false,
        })
        break;
    }
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
      tabgetdata: true,
      tabgetdata1: true,
      tabgetdata2: true,
      tabgetdata3: true,
      shopdata: [],
      shopdata1: [],
      shopdata2: [],
      shopdata3: [],
    })
  },
  // 搜索
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
          shopdata: [],
          pageIndex: 1,
          page: 2,
        })
        break;
      case 1:
        this.setData({
          shopdata1: [],
          pageIndex1: 1,
          page1: 2,
        })
        break;
      case 2:
        this.setData({
          shopdata2: [],
          pageIndex2: 1,
          page2: 2,
        })
        break;
      case 3:
        this.setData({
          shopdata3: [],
          pageIndex3: 1,
          page3: 2,
        })
        break;
    }
    this.getdata();
  },
  addshop() {
    wx.navigateTo({
      url: '/pages/goods/index'
    })
  },
  delshop(event) {
    const shopid = event.currentTarget.dataset.id
    const shopstate = event.currentTarget.dataset.state
    const {
      position,
      instance
    } = event.detail;
    switch (position) {
      case 'right':
        Dialog.confirm({
            title: '标题',
            message: '弹窗内容',
          })
          .then(() => {
            console.log(shopstate);
            if (shopstate == 1) {
              var shopdata = this.data.shopdata.filter((item) => {
                return item.id != shopid
              })
              var shopdata1 = this.data.shopdata1.filter((item) => {
                return item.id != shopid
              })
              var shopdata2 = this.data.shopdata2.filter((item) => {
                return item.id != shopid
              })
              var shopdata3 = this.data.shopdata3.filter((item) => {
                return item.id != shopid
              })
              post(shopdel, {
                id: [shopid]
              }).then(() => {
                this.setData({
                  shopdata: shopdata,
                  shopdata1: shopdata1,
                  shopdata2: shopdata2,
                  shopdata3: shopdata3,
                })
                Toast.success('删除成功');
                this.getcount();
              })
            } else if (shopstate == 2) {
              Toast('不能在微信删除已经审核的采购单,请联系管理员');
              instance.close();
            } else if (shopstate == 3) {
              Toast('不能删除已经购买的采购单');
              instance.close();
            }
          })
          .catch(() => {
            instance.close();
          });
        break;
    }
  }
})