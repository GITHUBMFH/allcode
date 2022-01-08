import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  post
} from '../../request/index.js';
import {
  supplierlst,
  suppliersave
} from '../../request/api';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasid: false,
    name: null,
    contact: null,
    address: null,
    id:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      this.setData({
        id: options.id,
        hasid:true
      })
      this.getdata();
    }
  },
  getdata() {
    post(supplierlst, { id: this.data.id }).then((res) => {
      const data= res.data[0]
      this.setData({
        name:data.name,
        contact:data.contact,
        address:data.address,
      })
    })
  },
  // 提交数据
  submit() {
    var data = {};
    data.name = this.data.name;
    data.contact = this.data.contact;
    data.address = this.data.address;
    this.data.hasid ? data.id = this.data.id : null;
    post(suppliersave, data).then((res) => {
      Toast.success('提交成功');
      wx.navigateBack({
        delta: 1
      })
    })
  },
})