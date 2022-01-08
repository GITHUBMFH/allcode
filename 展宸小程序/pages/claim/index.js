const app = getApp();
var settime = 0;
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  post
} from '../../request/index.js';
import {
  shoplst,
  getexpensecount,
  expenselst
} from '../../request/api';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tagnum: 0,
    selectshop: false, //是否显示多选框
    refresher: false, //是否是下拉状态
    allselect: false, //是否全选
    searchvalue: '', //搜索value
    expense_active: 0, //tab 
    active: 0, //tab 
    textall: '全选',
    tag: [{
      value: '未报账',
      count: ''
    }, {
      value: '已报账',
      count: ''
    }],

    expense_tag: [{
      value: '审核中',
      count: ''
    }, {
      value: '已报销',
      count: ''
    }],
    shopdata: [],
    shopdata1: [],
    pageIndex: 1,
    pageIndex1: 1,
    loading: true,
    loading1: true,
    tabgetdata: true,
    tabgetdata1: true,
    page: 2,
    page1: 2,

    expense_data: [],
    expense_data1: [],
    expense_pageIndex: 1,
    expense_pageIndex1: 1,
    lexpense_oading: true,
    expense_loading1: true,
    expense_tabgetdata: true,
    expense_tabgetdata1: true,
    expense_page: 2,
    expense_page1: 2,

    height: '',
    result: [],
    isshop: false,
    isexpense: true,
    issupplier:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    var username = wx.getStorageSync('username');
    if (username == '晏波坡') {
      this.setData({
        issupplier:true
      })
      this.pagerest();
      this.getcount();
      const index = {};
      index.detail = {};
      index.detail.index = this.data.active;
      this.onChange(index);
    }

    this.expense_pagerest();
    const index2 = {};
    index2.detail = {};
    index2.detail.index = this.data.expense_active;
    this.expense_onChange(index2);
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
    post(getexpensecount, {
      name: this.data.searchvalue,
      expense:1
    }).then((res) => {
      this.setData({
        ['tag[0].count']: res.count1,
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
      }
      data.filter = {};
      data.filter.orderstate = 4;
      data.filter.shopname = this.data.searchvalue;
      data.expense = this.data.active + 1;
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
    }
  },
  //页面重置
  pagerest() {
    this.setData({
      page: 2,
      page1: 2,
      pageIndex: 1,
      pageIndex1: 1,
      tabgetdata: true,
      tabgetdata1: true,
      shopdata: [],
      shopdata1: [],
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
  // 点击选择
  toggle(event) {
    const {
      index
    } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
  // 添加多选
  selectChange(event) {
    this.setData({
      result: event.detail
    });
  },
  //切换多选状态
  changeselect: function (e) {
    this.setData({
      ['selectshop']: !this.data['selectshop'],
    });
    if (this.data.selectshop) {
      Toast.success('开启多选');
      this.setData({
        allselect: true
      })
    } else {
      Toast.fail('关闭多选');
      this.setData({
        result: [],
        allselect: false
      })
    }
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
    }
    this.getdata();
  },
  // 全选或者弹出签名
  getall(e) {
    if (e.detail === 0) {
      if (this.data.textall === '全选') {
        const allresult = this.data.shopdata1.map(item => {
          return item.id;
        }).join(',').split(',');
        this.setData({
          result: allresult,
          textall: '取消全选'
        })
      } else {
        this.setData({
          result: [],
          textall: '全选'
        })
      }

    } else if (e.detail === 2) {
      var selectshopnum = this.data.result.length;
      if (selectshopnum < 1) {
        // Toast.fail('请选择报销单');
        this.addexpenseurl()
      } else {
        this.gotoexpenseurl()
      }
    }
  },
  // 跳转采购详情
  gotourl(e) {
    if (!this.data.selectshop) {
      wx.navigateTo({
        url: '/pages/goods/index?id=' + e.currentTarget.dataset.index
      })
    }
  },
  // tag切换
  tagchange(event) {
    this.setData({
      tagnum: event.detail,
    })
    if (event.detail == 0) {
      this.setData({
        isshop: false,
        isexpense: true
      })
    } else {
      this.setData({
        isshop: true,
        isexpense: false
      })
    }
  },
  // 获取表单数据
  expense_getdata: function () {
    switch (this.data.expense_active) {
      case 0:
        var istab = this.data.expense_page === 1 ? false : this.data.expense_pageIndex <= this.data.expense_page;
        break;
      case 1:
        var istab = this.data.expense_page1 === 1 ? false : this.data.expense_pageIndex1 <= this.data.expense_page1;
        break;
    }
    if (istab) {
      let data = {};
      switch (this.data.expense_active) {
        case 0:
          data.pageIndex = this.data.expense_pageIndex;
          this.setData({
            expense_loading: true,
          })
          break;
        case 1:
          data.pageIndex = this.data.expense_pageIndex1;
          this.setData({
            expense_loading1: true,
          })
          break;
      }
      data.state = this.data.expense_active + 1;
      data.people_id = wx.getStorageSync('peopleid');

      post(expenselst, data).then((res) => {
        switch (this.data.expense_active) {
          case 0:
            this.setData({
              expense_data: this.data.expense_data.concat(res.data),
              expense_page: Math.ceil(res.count / 10),
            })
            if (this.data.expense_pageIndex === this.data.expense_page || res.count === 0) {
              this.setData({
                expense_loading: false,
              })
            }
            break;
          case 1:
            this.setData({
              expense_data1: this.data.expense_data1.concat(res.data),
              expense_page1: Math.ceil(res.count / 10),
            })
            if (this.data.expense_pageIndex1 === this.data.expense_page1 || res.count === 0) {
              this.setData({
                expense_loading1: false,
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
      this.expense_getlodingfalse();
    }
  },
  // 关闭加载效果
  expense_getlodingfalse() {
    switch (this.data.expense_active) {
      case 0:
        this.setData({
          expense_loading: false,
        })
        break;
      case 1:
        this.setData({
          expense_loading1: false,
        })
        break;
    }
  },
  // 滚动刷新
  expense_getdown() {
    switch (this.data.expense_active) {
      case 0:
        this.setData({
          expense_pageIndex: this.data.expense_pageIndex + 1,
        })
        break;
      case 1:
        this.setData({
          expense_pageIndex1: this.data.expense_pageIndex1 + 1,
        })
        break;
    }
    this.expense_getdata();
  },
  // tabs改变时
  expense_onChange(event) {
    this.setData({
      expense_active: event.detail.index,
    })
    switch (this.data.expense_active) {
      case 0:
        this.data.expense_tabgetdata ? this.expense_getdata() : null;
        this.setData({
          expense_tabgetdata: false,
        })
        break;
      case 1:
        this.data.expense_tabgetdata1 ? this.expense_getdata() : null;
        this.setData({
          expense_tabgetdata1: false
        })
        break;
    }
  },
  //页面重置
  expense_pagerest() {
    this.setData({
      expense_page: 2,
      expense_page1: 2,
      expense_pageIndex: 1,
      expense_pageIndex1: 1,
      expense_tabgetdata: true,
      expense_tabgetdata1: true,
      expense_data: [],
      expense_data1: [],
    })
  },
  // 下拉刷新
  expense_gettop() {
    switch (this.data.active) {
      case 0:
        this.setData({
          expense_data: [],
          expense_pageIndex: 1,
          expense_page: 2,
        })
        break;
      case 1:
        this.setData({
          expense_data1: [],
          expense_pageIndex1: 1,
          expense_page1: 2,
        })
        break;
    }
    this.expense_getdata();
  },
  // 跳转报销详情
  gotoexpenseurl(e) {
      if (!this.data.selectshop) {
        wx.navigateTo({
          url: '/pages/expense/index?id=' + e.currentTarget.dataset.index
        })
      } else {
        const shopid = this.data.result;
        wx.navigateTo({
          url: '/pages/expense/index?shopid=' + shopid
        })
      }
  },
  //添加采购单
  addexpenseurl() {
    wx.navigateTo({
      url: '/pages/expense/index'
    })
  }
})