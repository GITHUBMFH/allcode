import {
  post
} from '../../request/index.js';
import {
  login
} from '../../request/api';

import Notify from '../../miniprogram_npm/@vant/weapp/notify/notify';

import WxValidate from '../../utils/WxValidate.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    namemsg: '',
    phone: '',
    phonemsg: '',
    sclass: '',
    sclassmsg: '',
    state: true,
    show: false,
    hide: false,
    actions: [{
        name: '板式部门',
        id: '1'
      },
      {
        name: '实木部门',
        id: '2'
      },
      {
        name: '油漆部门',
        id: '3'
      },
      {
        name: '软体部门',
        id: '4'
      },
      {
        name: '包装部门',
        id: '5'
      },
      {
        name: '办公室部门',
        id: '6'
      }
    ],
    check: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate();

    if (options.name) {
      var bm = this.data.actions.find((value) => {
        return value.id = options.sclass;
      })

      this.setData({
        name: options.name,
        phone: options.phone != 'null' ? options.phone : '',
        sclass: bm.name,
        state: JSON.parse(options.state)
      })
    }
  },
  // 获取客户用户
  getinfo: function () {

  },

  toggle(type) {
    this.setData({
      [type]: !this.data[type],
    });
  },
  toggleAction() {
    if (this.data.state) {
      this.toggle('show');
    }
  },

  onSelect(event) {
    this.setData({
      sclass: event.detail.name
    })
  },
  checkname() {
    var data = {};
    data.name = this.data.name;
    if (!this.WxValidate.checkForm(data)) {
      var result_two = this.WxValidate.errorList.find((v) => {
        return v.param === 'name';
      });
      if (result_two) {
        this.setData({
          namemsg: result_two.msg,
        })
      } else {
        this.setData({
          namemsg: '',
        })
      }
    }
  },
  checkphone() {
    var data = {};
    data.phone = this.data.phone;
    if (!this.WxValidate.checkForm(data)) {
      var result_two = this.WxValidate.errorList.find((v) => {
        return v.param === 'phone';
      });
      if (result_two) {
        this.setData({
          phonemsg: result_two.msg,
        })
      } else {
        this.setData({
          phonemsg: '',
        })
      }
    }
  },
  checkmsg() {
    var data = {};
    data.phone = this.data.phone;
    data.name = this.data.name;
    data.sclass = this.data.sclass;
    if (!this.WxValidate.checkForm(data)) {
      //表单元素验证不通过，此处给出相应提示
      this.WxValidate.errorList.forEach(item => {
        if (item.param === 'name') {
          this.setData({
            namemsg: item.msg,
          })
        }
        if (item.param === 'phone') {
          this.setData({
            phonemsg: item.msg,
          })
        }
        if (item.param === 'sclass') {
          this.setData({
            sclassmsg: item.msg,
          })
        }
      });
    } else {
      this.setData({
        namemsg: '',
        phonemsg: '',
        sclassmsg: '',
        check: true
      })
    }
    return false;
  },
  submit() {
    var data = {};
    data.phone = this.data.phone;
    data.name = this.data.name;
    data.sclass = this.data.sclass;
    if (this.WxValidate.checkForm(data)) {
      var that = this;
      wx.getUserProfile({
        desc: '用于完善会员资料',
        success: (item) => {
          wx.setStorage({
            key: "userInfo",
            data: item.userInfo
          })
          wx.login({
            success(res) {
              if (res.code) {
                var data = {};
                data.iphone = that.data.phone;
                data.name = that.data.name;
                var bm = that.data.actions.find((value) => {
                  return value.name == that.data.sclass;
                })
                data.class = bm.id;
                data.code = res.code;
                post(login, data).then((res) => {
                  if (res.code == '200') {
                    wx.setStorage({
                      key: "token",
                      data: res.token
                    })
                    wx.setStorage({
                      key: "peopleid",
                      data: res.peopleid
                    })
                    wx.setStorage({
                      key: "username",
                      data: res.username
                    })
                    Notify({
                      type: 'success',
                      message: '提交成功'
                    });
                    wx.reLaunch({
                      url: '../index/index'
                    })
                  } else {
                    Notify({
                      type: 'danger',
                      message: '验证失败'
                    });
                  }
                })
              }
            }
          })
        },
        fail: e => {
          Notify({
            type: 'warning',
            message: '授权失败'
          });
        }
      })
    } else {
      this.checkmsg();
    }
  },

  initValidate() {
    let rules = {
      name: {
        required: true,
        maxlength: 10,
        minlength: 2
      },
      phone: {
        required: true,
        tel: true
      },
      sclass: {
        required: true,
      }
    }

    let message = {
      name: {
        required: '请输入姓名',
        maxlength: '名字不能超过10个字',
        minlength: '名字不能少于2个字'
      },
      phone: {
        required: '请输入手机',
        tel: "手机号码格式错误"
      },
      sclass: {
        required: "请选择您的部门",
      }
    }
    //实例化当前的验证规则和提示消息
    this.WxValidate = new WxValidate(rules, message);
  }
})