import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  post
} from '../../request/index.js';
import {
  supplierlst
} from '../../request/api';
var settime = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchvalue: '', //搜索value
    shopdata: [],
    pageIndex: 1,
    loading: true,
    tabgetdata: true,
    page: 2,
    height: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.pagerest();
    this.getdata();
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
    this.getdata();
  },
  // 获取表单数据
  getdata: function () {
    var istab = this.data.page === 1 ? false : this.data.pageIndex <= this.data.page;
    if (istab) {
      let data = {};
      data.pageIndex = this.data.pageIndex;
      this.setData({
        loading: true,
      })
      data.name = this.data.searchvalue;
      post(supplierlst, data).then((res) => {
        this.setData({
          shopdata: this.data.shopdata.concat(res.data),
          page: Math.ceil(res.count / 10),
        })
        if (this.data.pageIndex === this.data.page || res.count === 0) {
          this.setData({
            loading: false,
          })
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
    this.setData({
      loading: false,
    })
  },
  // 滚动刷新
  getdown() {
    this.setData({
      pageIndex: this.data.pageIndex + 1,
    })
    this.getdata();
  },
  //页面重置
  pagerest() {
    this.setData({
      page: 2,
      pageIndex: 1,
      tabgetdata: true,
      shopdata: [],

    })
  },
  // 搜索
  searchchange() {
    clearTimeout(settime);
    settime = setTimeout(() => {
      this.pagerest();
      this.getdata();
    }, 500)
  },
  // 下拉刷新
  gettop() {
    this.setData({
      shopdata: [],
      pageIndex: 1,
      page: 2,
    })
    this.getdata();
  },
  // 点击跳转
  gotourl(e) {
    if (!this.data.selectshop) {
      wx.navigateTo({
        url: '/pages/add-supplier/index?id='+e.currentTarget.dataset.index
      })
    }
  },
  // 点击拨打
  callPhone(e) {
    wx.makePhoneCall({
      phoneNumber:e.currentTarget.dataset.num,
      success:function(){
        console.log('拨打成功')
      },
      fail:function(){
        console.log('拨打失败')
      }
    })
  },
})