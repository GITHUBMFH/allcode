const app = getApp();
import {
  post
} from 'request/index.js';

import {
  login
} from 'request/api';
App({
  onLaunch: function (options) {
    // 判断是否授权
    var that = this;
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) {
          that.getseesion(); //判断登录是否过期
        } else {
          that.getinfo();
        }
      }
    });
  },
  // 判断登录是否过期
  getseesion: function () {
    var that = this;
    wx.checkSession({
      success(res) {
        that.login();
      },
      fail() {
        // session_key 已经失效，需要重新执行登录流程
        // wx.login() //重新登录
      }
    });
  },
  login: function () {
    wx.login({
      success(res) {
        if (res.code) {
          //发起网络请求
          post(login, {
            code: res.code
          }).then((res) => {
            if (res.code == '200') {
              return false;
            } else if (res.code == '404') {
              wx.redirectTo({
                url: '/pages/login/index'
              })
            } else if (res.code == '202') {
              let name = res.data.name;
              let phone = res.data.iphone;
              let sclass = res.data.class;
              let state = res.data.state === '2' ? true : false;
              wx.redirectTo({
                url: '/pages/login/index?name=' + name + '&phone=' + phone + '&sclass=' + sclass + '&state=' + state
              });
            }
          })
        }
      }
    })
  },
  onShow: function (options) {

  },
  onHide: function () {

  },
  onError: function (msg) {

  },

  onPageNotFound: function (options) {

  },
  globalData: {

  },

});