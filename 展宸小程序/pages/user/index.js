import {
  post
} from '../../request/index.js';
import {
  getuser
} from '../../request/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userimg: '',
    username: '',
    state: '',
    class: '',
    iphone:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
   onShow() {
     this.getTabBar().init();
     this.getuser();
	},
  onLoad: function (options) {
    const info = wx.getStorageSync('userInfo');
    this.setData({
      userimg: info.avatarUrl,
    })
  },
  getuser() {
    post(getuser).then((res) => {
      var res = res.data;
      this.setData({
        username:res.name,
        state:res.state,
        class:res.class,
        iphone:res.iphone
      })
    })
  }
})