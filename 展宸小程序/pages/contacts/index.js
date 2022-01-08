import {
  post
} from '../../request/index.js';
import {
  peoplelst
} from '../../request/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    peoplelst:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdata();
  },
  getdata() {
    post(peoplelst).then((res) => {
      this.setData({
        peoplelst: res.data
      })
    })
  },
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