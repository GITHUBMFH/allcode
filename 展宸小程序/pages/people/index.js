import {
  post
} from '../../request/index.js';
import {
  getuser,
  peopelsave
} from '../../request/api';
import WxValidate from '../../utils/WxValidate.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    id: '',
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
    check: false,
    idcard: '',
    bank: '',
    bank_name: '',
    bank_name: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initValidate();
    this.getuser()
  },
  getuser() {
    post(getuser).then((res) => {
      var res = res.data;
      this.setData({
        id: res.id,
        name: res.name,
        sclass: res.class,
        class: res.class,
        phone: res.iphone,
        idcard: res.card_id,
        bank: res.bank,
        bank_name: res.bank_name,
        bank_num: res.bank_num
      })
    })
  },
  toggle(type) {
    this.setData({
      [type]: !this.data[type],
    });
  },
  toggleAction() {
    this.toggle('show');
  },
  onSelect(event) {
    this.setData({
      sclass: event.detail.name
    })
  },
  // 提交数据
  submit() {
    var data = {};
    data.phone = this.data.phone;
    data.name = this.data.name;
    data.sclass = this.data.sclass;
    if (this.WxValidate.checkForm(data)) {
      var data = {};
      data.iphone = this.data.phone;
      data.name = this.data.name;
      data.id = this.data.id;
      data.detail = {};
      data.detail.card_id = this.data.idcard;
      data.detail.bank = this.data.bank;
      data.detail.bank_name = this.data.bank_name;
      data.detail.bank_num = this.data.bank_num;
      data.detail.wage = " ";

      var bm = this.data.actions.find((value) => {
        return value.name == this.data.sclass;
      })
      data.class = bm.id;
      post(peopelsave, data).then((res) => {
        wx.setStorage({
          key: "username",
          data: data.name
        })
        wx.navigateBack({
          delta: 1,
        })
      })
    }
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
  },
})