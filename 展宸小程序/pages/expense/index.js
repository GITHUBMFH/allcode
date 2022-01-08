const app = getApp();
var settime = 0;
var orderlst = {
  库存: [{
    'text': '库存',
    'id': 0
  }],
  生产中: [],
  待发货: [],
  已完成: [],
};

import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  post
} from '../../request/index.js';
import {
  shoplst,
  getallorder,
  supplierlst,
  expensesave,
  expenselst,
  imgulr,
  shopimg,
  deloneimg
} from '../../request/api';

Page({
  data: {
    height: 0,
    shopids: null, //采购单id
    expenseid: null, //报销单id
    shoplst: null, //采购单列表
    activeNames: [], //下拉采购单显示
    selectshow: false, //生产单显示

    columns: [{
        values: Object.keys(orderlst)
      },
      {
        values: orderlst['库存'],
        defaultIndex: 1,
      }
    ],
    peopleid: '', //报销人id
    supplier: '', //供应商名称
    proof_num: '', //凭证后四位
    proof_data: '', //采购时间
    num: '', //报销金额
    result: '', //原因

    steps: '',
    state: '',
    people_name: '',

    orderrelate: '', //关联订单
    orderid: '', //关联订单id
    dateshow: false, //显示日期

    priceshow: false, //显示价格输入框
    shopprice: '', //绑定单价
    shopprice_id: '', //绑定单价id
    allcount: 0, //合计

    suppliershow: false, //显示供应商
    searchvalue: '', //供应商搜索值
    supplierdata: [], //供应商列表
    supplier_id: 0,

    fileList: [], //附件图片
    act_fileList: [], //附件图片
    up_fileList: [], //附件图片
  },

  // 添加报销单 有shopids 则是有采购单, 没有shopids的时候，必须要有关联的订单
  // 查看/修改报销单时候 必须有 id ，然后再区分有没有shopids
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
    if (options.id) { //查看修改报销单
      this.setData({
        expenseid: options.id
      })
      this.getexpense_data();
    } else { //添加采购单
      if (options.shopid) { //添加有采购单的
        this.setData({
          shopids: options.shopid.split(",")
        })
        this.getshopdata();
      }
      var date = new Date();
      var datetime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      this.setData({
        people_name: wx.getStorageSync('username'),
        peopleid: wx.getStorageSync('peopleid'),
        steps: [{
          'text': '提交',
          'desc': datetime
        }, {
          'text': '付款',
          'desc': '暂无'
        }],
        state: 1,
      })
    }
    this.getorder();
  },
  getpic(item) {
    if (item.length > 0) {
      var array = [];
      item.forEach((v) => {
        array.push({
          url: imgulr + v
        })
      })
      return array;
    } else {
      return [];
    }
  },
  getuppic(item) {
    if (item.length > 0) {
      var array = [];
      item.forEach((v) => {
        array.push(v)
      })
      return array;
    } else {
      return [];
    }
  },
  // 获取报销单数据
  getexpense_data() {
    post(expenselst, {
      id: this.data.expenseid
    }).then((res) => {
      var data = res.data[0];
      this.setData({
        supplier: data.supplier_name,
        supplier_id: data.supplier, //供应商名称
        proof_num: data.proof_num, //凭证后四位
        proof_data: data.proof_data, //采购时间
        num: data.num, //报销金额
        result: data.result, //原因
        expenseid: data.id,
        orderrelate: data.order_name,
        orderid: data.relate_orderid,
        shopids: data.relate,
        steps: data.steps,
        state: data.state,
        fileList: this.getpic(res.data[0].proof),
        up_fileList: this.getuppic(res.data[0].proof),
        peopleid: data.people_id,
        people_name: data.name
      })
      if (data.relate) {
        this.getshopdata();
      }
    })
  },
  // 获取所有的订单
  getorder() {
    post(getallorder).then((res) => {
      const lst = res.data;
      lst.forEach(e => {
        var value = {
          'text': e.num + '-' + e.name,
          'id': e.id
        }
        if (e.state == 1) {
          orderlst.生产中.push(value)
        } else if (e.state == 2) {
          orderlst.待发货.push(value)
        } else if (e.state == 3) {
          orderlst.已完成.push(value)
        }
      });
    })
  },
  // 获取关联的采购单
  getshopdata() {
    post(shoplst, {
      shopids: this.data.shopids
    }).then((res) => {
      this.setData({
        shoplst: res.data,
        result: '采购单报销'
      })
      this.getshopcount();
    })
  },
  // 显示采购单列表
  pullchange(event) {
    this.setData({
      activeNames: event.detail,
    });
  },
  // 显示关闭 生产单 选项
  showselect(e) {
    this.setData({
      ['selectshow']: !this.data.selectshow
    })
  },
  // 选择关联订单
  selectorder(e) {
    const {
      picker,
      value,
      index
    } = e.detail;
    picker.setColumnValues(1, orderlst[value[0]]);
  },
  // 点击确定 选择关联订单
  getordername() {
    const picker = this.selectComponent('.labelPicker') // 获取组件实例
    var name = picker.getValues()
    this.setData({
      orderrelate: name[1].text,
      orderid: name[1].id,
    })
    this.showselect();
  },
  // 显示日历
  dateshow() {
    this.setData({
      ['dateshow']: !this.data.dateshow
    })
  },
  //格式化时间
  formatDate(date) {
    date = new Date(date);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  },
  // 点击确定时间
  datesure(event) {
    this.dateshow();
    this.setData({
      proof_data: this.formatDate(event.detail)
    })
  },

  // 点击弹出单价输入框
  closeprice() {
    this.setData({
      priceshow: false,
    })
  },
  // 获取价格
  getprice(e) {
    var shoplst = this.data.shoplst.find((res) => {
      return res.id == e.currentTarget.dataset.id
    });
    this.setData({
      shopprice_id: e.currentTarget.dataset.id,
      priceshow: true,
      shopprice: shoplst.price
    })
  },
  // 改变价格
  changeprice() {
    var price = this.data.shopprice.replace(/[^\d]/g, '');
    var lst = this.data.shoplst;
    lst.forEach((res, index) => {
      if (res.id == this.data.shopprice_id) {
        lst[index].price = price
      }
    })
    this.setData({
      shoplst: lst
    })
    this.getshopcount()
  },

  // 获取总价格
  getshopcount() {
    var lst = this.data.shoplst;
    var count = 0;
    lst.forEach((res) => {
      count = count + (res.price * res.act_num)
    })
    this.setData({
      allcount: count
    })
  },
  // 显示供应商
  showsupplier() {
    this.setData({
      ['suppliershow']: !this.data.suppliershow
    })
  },
  // 获取供应商列表
  getsupplierlst() {
    clearTimeout(settime);
    settime = setTimeout(() => {
      this.setData({
        supplierdata: []
      });
      var value = this.data.searchvalue;
      if (value) {
        var data = {};
        data.name = this.data.searchvalue;
        data.pageSize = 50;
        data.pageIndex = this.data.pageIndex;
        post(supplierlst, data).then((res) => {
          this.setData({
            supplierdata: res.data
          })
        })
      }
    }, 500)
  },
  // 点击获取供应商值
  suppliertopage(e) {
    this.showsupplier();
    this.setData({
      supplier_id: e.currentTarget.dataset.index,
      supplier: e.currentTarget.dataset.name
    })
  },

  // 添加图片
  afterRead(e) {
    const fileList = this.data.fileList;
    const act_fileList = this.data.act_fileList;
    e.detail.file.filter(v => {
      fileList.push(v); //显示的图片
      act_fileList.push(v); //添加的图片
    });
    this.setData({
      fileList: fileList,
      act_fileList: act_fileList
    })
  },
  // 删除图片
  delimg(e) {
    var imgurl = e.detail.file['url'].replace(imgulr, "");
    var fileList = this.data.fileList;
    var act_fileList = this.data.act_fileList;
    var up_fileList = this.data.up_fileList;
    fileList.splice(fileList.findIndex(item => item.url === e.detail.file['url']), 1)
    act_fileList.splice(act_fileList.findIndex(item => item.url === imgurl), 1)
    up_fileList.splice(up_fileList.findIndex(item => item.url === imgurl), 1)
    this.setData({
      fileList: fileList,
      act_fileList: act_fileList,
      up_fileList: up_fileList
    })
    var data = {};
    data.id = this.data.expenseid;
    data.proof = this.arraytosting(this.data.up_fileList);
    const toast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '上传中',
      loadingType: 'spinner',
    })
    post(deloneimg, {
      imgurl: imgurl
    }).then(
      post(expensesave, data).then((res) => {
        Toast.clear();
        Toast.success('删除成功');
      })
    )
  },
  // 数组转字符串
  arraytosting(item) {
    return item.join(',')
  },
  // 上传内容
  changedata(e) {
    let promiseArr = [];
    var that = this;
    const length = this.data.act_fileList.length;
    var data = {};
    data.people_id = this.data.peopleid;
    data.num = this.data.num;
    data.relate = (''+this.data.shopids).toString();
    data.result = this.data.result;
    data.supplier = this.data.supplier_id;
    data.proof_num = this.data.proof_num;
    data.proof_data = this.data.proof_data;
    data.relate_orderid = this.data.orderid;

    var check = this.checkrequest();
    if (check) {
      for (let i = 0; i < length; i++) {
        promiseArr.push(new Promise((reslove) => {
          wx.uploadFile({
            url: shopimg,
            filePath: this.data.act_fileList[i].url,
            name: 'file',
            success(res) {
              const up_fileList = that.data.up_fileList;
              var url = JSON.parse(res.data);
              up_fileList.push(url.url)
              that.setData({
                up_fileList: up_fileList,
              })
              reslove();
            },
          });
        }));
      }

      Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
        data.proof = that.arraytosting(this.data.up_fileList);
        that.data.expenseid ? data.id = this.data.expenseid : null;
        if (!that.data.shopids) { //有采购单的情况下
          if (!this.data.orderrelate) {
            Toast.fail('请选择关联订单');
            return false;
          } else {
            post(expensesave, data).then((res) => {
              Toast.success('修改成功');
              wx.navigateBack({
                delta: 1
              })
            })
          }
        } else {
          if (data.relate) {
            data.shoplst = [];
            this.data.shoplst.forEach((res) => {
              var lst = {}
              lst.id = res.id;
              lst.price = res.price;
              lst.expense=2
              data.shoplst.push(lst)
            })
          }
          var togo = data.shoplst.find((item) => {
            return item.price == null || item.price == '' || item.price == undefined;
          })
          if (!togo) {
            post(expensesave, data).then((res) => {
              Toast.success('修改成功');
              wx.navigateBack({
                delta: 1
              })
            })
          } else {
            Toast.fail('请补充单价');
          }
        }

      })
    }
  },
  // 检查必填 关联报销
  checkrequest() {
    if (!this.data.supplier) {
      Toast.fail('请选择供应商');
      return false;
    } else if (!this.data.proof_num) {
      Toast.fail('请输入凭证后4位');
      return false;
    } else if (!this.data.proof_data) {
      Toast.fail('请选择凭证日期');
      return false;
    } else if (!this.data.num) {
      Toast.fail('请输入报销金额');
      return false;
    } else if (!this.data.result) {
      Toast.fail('请输入报销理由');
      return false;
    }else if (this.data.fileList.length<1) {
      Toast.fail('请上传凭证');
      return false;
    } else {
      return true;
    }
  },
  //添加供应商
  addsupplier() {
    wx.navigateTo({
      url: '/pages/add-supplier/index'
    })
  }

})