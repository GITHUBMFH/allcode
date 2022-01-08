// pages/ticket/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: [{
        name: '公司名称:',
        value: '佛山市展宸酒店家具有限公司'
      },
      {
        name: '税号:',
        value: "91440608MA4WKQEX2R"+"\n"
      },
      {
        name: '对公帐户（对公对税）:',
        value: ''
      },
      {
        name: '开户行:',
        value: '佛山农商银行股份有限公司高明支行'
      },
      {
        name: '帐号:',
        value: '80020000010759692'+"\n",
      },
      {
        name: '私户:',
        value: ''
      },
      {
        name: '开户行:',
        value: '中国农业银行股份有限公司广州解放北路支行'
      },
      {
        name: '帐号:',
        value: '6228- 4800-8832-1389-178'
      },
      {
        name: '户名:',
        value: '佘绍奎'
      },
      {
        name: '地址:',
        value: '佛山市高明区荷城街道（富湾）唐美村工业区3号之一厂房'
      },
      {
        name: '电话:',
        value: '0757-88811858 '+"\n"
      }
    ]
  },
  onLoad: function (options) {

  },
  // 点击复制
  copy: function (e) {
    let that = this;
    wx.setClipboardData({
      data:this.data.text.map(item =>`${item.name} ${item.value}`).join("\n"),
      success(res) {
        wx.getClipboardData({
          success(res) {
            wx.showToast({
              title: '复制成功',
            })
          }
        })
      }
    })
  },
})