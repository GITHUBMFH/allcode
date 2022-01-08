const app = getApp();
var context = null; // 使用 wx.createContext 获取绘图上下文 context
var isButtonDown = false; //是否在绘制中
var arrx = []; //动作横坐标
var arry = []; //动作纵坐标
var arrz = []; //总做状态，标识按下到抬起的一个组合
var canvasw = 0; //画布宽度
var canvash = 0; //画布高度
import Toast from '../../miniprogram_npm/@vant/weapp/toast/toast';
import {
  post
} from '../../request/index.js';
import {
  shopimg,
  imgulr,
  shoplst,
  getallorder,
  shopsave,
  getshop,
  deloneimg
} from '../../request/api';
var orderlst = {
  库存: [{
    'text': '库存',
    'id': 0
  }],
  生产中: [],
  待发货: [],
  已完成: [],
};
Page({
  /**
   * 页面的初始数据
   */
  data: {
    name: null,
    shopid: 0, //采购id
    peopleid: 0, //采购人id
    steps: null,
    state: null,
    people: null,
    passpeople: null,
    getpeople: null,
    size: null,
    a_num: null,
    unit: null,
    remark: null,
    type: null,
    relate: null,
    act_num: null,
    act_unit: null,
    hasid: false,
    isget: false,
    nohasid: false,
    selecttypeshow: false,
    selectordershow: false,
    signshow: false,
    orderid: null,
    actions: [{
        name: '库存'
      },
      {
        name: '板材'
      },
      {
        name: '大理石'
      },
      {
        name: '玻璃&亚克力&银镜'
      },
      {
        name: '五金'
      },
      {
        name: '配件'
      },
      {
        name: '油漆'
      },
      {
        name: '面料'
      },
      {
        name: '纸箱'
      },
      {
        name: '维修'
      },
      {
        name: '其他'
      },
    ],
    columns: [{
        values: Object.keys(orderlst)
      },
      {
        values: orderlst['库存'],
        defaultIndex: 1,
      }
    ],
    fileList: [], //附件图片
    act_fileList: [], //附件图片
    up_fileList: [], //附件图片
    shopimg: [],
    act_shopimg: [],
    up_shopimg: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.id) {
      if (options.isget) {
        this.setData({
          shopid: options.id,
          isget: true,
        })
      } else {
        this.setData({
          shopid: options.id,
          hasid: true
        })
      }
      this.getdata();
      this.startCanvas();
      Toast.setDefaultOptions({
        zIndex: 9999999
      })
    } else {
      var date = new Date();
      var datetime = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
      this.setData({
        steps: [{
          'text': '下单',
          'desc': datetime
        }, {
          'text': '审核',
          'desc': '暂无'
        }, {
          'text': '签收',
          'desc': '暂无'
        }],
        state: 1,
        people: wx.getStorageSync('username'),
        passpeople: '',
        getpeople: '',
        peopleid: wx.getStorageSync('peopleid'),
        nohasid: true
      })
    }
    this.getorder()
  },
  // 获取采购详情
  getdata() {
    post(shoplst, {
      shopid: this.data.shopid
    }).then((res) => {
      this.setData({
        name: res.data[0].name,
        steps: res.data[0].steps,
        state: res.data[0].state,
        people: res.data[0].people,
        passpeople: res.data[0].passpeople,
        getpeople: res.data[0].getpeople,
        size: res.data[0].size,
        a_num: res.data[0].a_num,
        unit: res.data[0].unit,
        remark: res.data[0].remark,
        type: res.data[0].type,
        relate: res.data[0].relate,
        act_num: res.data[0].act_num,
        act_unit: res.data[0].act_unit,
        orderid: res.data[0].relateid,
        peopleid: res.data[0].peopleid,
        fileList: this.getpic(res.data[0].pic),
        up_fileList: this.getuppic(res.data[0].pic),
        shopimg: this.getpic(res.data[0].shop_pic),
        up_shopimg: this.getuppic(res.data[0].shop_pic),
      })
    })
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
  // 显示选项
  showselect(e) {
    var id = e.currentTarget.id
    if (id === 'showtype') {
      this.setData({
        selecttypeshow: true
      });
    } else {
      this.setData({
        selectordershow: true
      });
    }
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
  // 选择关联订单
  getordername() {
    const picker = this.selectComponent('.labelPicker') // 获取组件实例
    var name = picker.getValues()
    this.setData({
      relate: name[1].text,
      orderid: name[1].id,
    })
    this.onClose();
  },
  // 关闭选项
  onClose(e) {
    this.setData({
      selecttypeshow: false,
      selectordershow: false
    });
  },
  // 选择类型
  onSelect(event) {
    this.setData({
      ['type']: event.detail.name,
      selecttypeshow: false
    })
  },

  // 检查必填
  checkrequest() {
    if (!this.data.name) {
      Toast.fail('名称不能为空');
      return false;
    } else if (!this.data.size) {
      Toast.fail('规格不能为空');
      return false;
    } else if (!this.data.a_num) {
      Toast.fail('数量不能为空');
      return false;
    } else if (!this.data.unit) {
      Toast.fail('单位不能为空');
      return false;
    } else if (!this.data.type) {
      Toast.fail('类型不能为空');
      return false;
    } else if (!this.data.relate) {
      Toast.fail('订单不能为空');
      return false;
    } else {
      return true;
    }
  },
  // 检查收货
  checkget() {
    if (!this.data.act_num) {
      Toast.fail('收货数量不能为空');
      return false;
    } else if (!this.data.act_unit) {
      Toast.fail('收货单位不能为空');
      return false;
    } else {
      return true;
    }
  },
  /**
   * 以下 - 手写签名 / 上传签名
   */
  startCanvas: function () { //画布初始化执行
    var that = this;
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        canvasw = res.windowWidth;
        canvash = res.windowHeight;
        that.setData({
          canvasw: canvasw
        });
        that.setData({
          canvash: canvash
        });
      }
    });
    this.initCanvas();
    this.cleardraw();
  },
  //初始化函数
  initCanvas: function () {
    context = wx.createCanvasContext('canvas');
    context.beginPath()
    context.fillStyle = 'rgba(255, 255, 255, 0)';
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
  },
  canvasStart: function (event) {
    isButtonDown = true;
    arrz.push(0);
    arrx.push(event.changedTouches[0].x);
    arry.push(event.changedTouches[0].y);
  },
  canvasMove: function (event) {
    if (isButtonDown) {
      arrz.push(1);
      arrx.push(event.changedTouches[0].x);
      arry.push(event.changedTouches[0].y);
    }
    for (var i = 0; i < arrx.length; i++) {
      if (arrz[i] == 0) {
        context.moveTo(arrx[i], arry[i])
      } else {
        context.lineTo(arrx[i], arry[i])
      }
    }
    context.clearRect(0, 0, canvasw, canvash);
    context.setStrokeStyle('#000000');
    context.setLineWidth(4);
    context.setLineCap('round');
    context.setLineJoin('round');
    context.stroke();
    context.draw(false);
  },
  canvasEnd: function (event) {
    isButtonDown = false;
    this.setData({
      ['signnum']: this.data.signnum + 1
    })
  },
  //清除画布
  cleardraw: function () {
    arrx = [];
    arry = [];
    arrz = [];
    context.clearRect(0, 0, canvasw, canvash);
    context.draw(true);
    this.setData({
      signnum: 0
    })
  },
  uploadImg() {
    var that = this
    //生成图片
    const toast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '上传中',
      loadingType: 'spinner',
    })
    wx.canvasToTempFilePath({
      canvasId: 'canvas',
      //设置输出图片的宽高
      // destWidth:150, 
      // destHeight:150,
      // fileType:'jpg',
      quality: 1.0,
      success: function (res) {
        if (that.data.signnum <= 1) {
          Toast.fail('笔画太少');
        } else {
          wx.uploadFile({
            url: shopimg, // 仅为示例，非真实的接口地址
            filePath: res.tempFilePath,
            name: 'file',
            formData: {
              hehhe: 'dsfd'
            },
            success(savename) {
              const data = {};
              data.id = that.data.shopid;
              data.savename = savename.data;
              post(getshop, data).then((res) => {
                Toast.clear();
                wx.navigateBack({
                  delta: 1
                })
                Toast.fail('提交成功');
              })
            },
          });
        }

      },
      fail: function () {
        wx.showModal({
          title: '提示',
          content: 'canvas生成图片失败。微信当前版本不支持，请更新到最新版本！',
          showCancel: false
        });
      },
      complete: function () {}
    })
  },
  //签名操作
  singname(e) {
    if (e.detail === 0) {
      this.setData({
        signshow: false
      })
    } else if (e.detail === 1) {
      this.cleardraw();
    } else if (e.detail === 2) {
      this.uploadImg();
    }
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
  // 添加采购图片
  afterReadshop(e) {
    console.log(e);
    const shopimg = this.data.shopimg;
    const act_shopimg = this.data.act_shopimg;
    e.detail.file.filter(v => {
      shopimg.push(v); //显示的图片
      act_shopimg.push(v); //添加的图片
    });
    this.setData({
      shopimg: shopimg,
      act_shopimg: act_shopimg
    })
  },
  // 数组转字符串
  arraytosting(item) {
    return item.join(',')
  },
  // 字符串转数组
  stingtoarray(item) {
    return item.toString().split(',')
  },
  // 修改内容
  changedata(e) {
    const hasid = this.data.hasid; //有id 修改
    const nohasid = this.data.nohasid; //有id 修改
    const isget = this.data.isget; //收货
    var data = {};
    data.detail = {};
    data.detail['name'] = this.data.name;
    data.detail['size'] = this.data.size;
    data.detail['unit'] = this.data.unit;
    data.detail['num'] = this.data.a_num;
    data.detail['remark'] = this.data.remark;
    data.relate = this.data.orderid //
    data.type = this.data.type //
    data.people = this.data.peopleid //
    data.pic = null //
    data.shop_pic = null //
    data.act_num = null //
    data.act_unit = null //
    data.pic = this.up_fileList
    const length = this.data.act_fileList.length;
    const shoplength = this.data.act_shopimg.length;
    let promiseArr = [];
    var that = this;
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
      for (let i = 0; i < shoplength; i++) {
        promiseArr.push(new Promise((reslove) => {
          wx.uploadFile({
            url: shopimg,
            filePath: this.data.act_shopimg[i].url,
            name: 'file',
            success(res) {
              const up_shopimg = that.data.up_shopimg;
              var url = JSON.parse(res.data);
              up_shopimg.push(url.url)
              that.setData({
                up_shopimg: up_shopimg,
              })
              reslove();
            },
          });
        }));
      }
      Promise.all(promiseArr).then(res => { //等数组都做完后做then方法
        data.pic = that.arraytosting(that.data.up_fileList);
        data.shop_pic = that.arraytosting(that.data.up_shopimg);
        if (hasid) { //修改
          data.id = this.data.shopid;
          post(shopsave, data).then((res) => {
            Toast.success('修改成功');
            wx.navigateBack({
              delta: 1
            })
          })
        } else if (nohasid) { //提交
          post(shopsave, data).then((res) => {
            Toast.success('添加成功');
            wx.navigateBack({
              delta: 1
            })
          })
        } else if (isget) { //收货
          var checkget = this.checkget();
          if (this.data.state == '1') {
            Toast.fail('请先通过审核');
          } else {
            data.id = this.data.shopid;
            data.act_num = that.data.act_num;
            data.act_unit = that.data.act_unit;
            if (checkget) {
              this.setData({
                signshow: true
              })
              post(shopsave, data).then((res) => {
                Toast.success('添加成功');
              })
            }
          }
        }
      })
    }
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
    data.id = this.data.shopid;
    data.pic = this.arraytosting(this.data.up_fileList);
    const toast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '上传中',
      loadingType: 'spinner',
    })
    post(deloneimg, {
      imgurl: imgurl
    }).then(
      post(shopsave, data).then((res) => {
        Toast.clear();
        Toast.success('删除成功');
      })
    )
  },
  // 删除图片
  delimgshop(e) {
    var imgurl = e.detail.file['url'].replace(imgulr, "");
    var shopimg = this.data.shopimg;
    var act_shopimg = this.data.act_shopimg;
    var up_shopimg = this.data.up_shopimg;
    shopimg.splice(shopimg.findIndex(item => item.url === e.detail.file['url']), 1)
    act_shopimg.splice(act_shopimg.findIndex(item => item.url === imgurl), 1)
    up_shopimg.splice(up_shopimg.findIndex(item => item.url === imgurl), 1)
    this.setData({
      shopimg: shopimg,
      act_shopimg: act_shopimg,
      up_shopimg: up_shopimg
    })
    var data = {};
    data.id = this.data.shopid;
    data.shop_pic = this.arraytosting(this.data.up_shopimg);

    const toast = Toast.loading({
      duration: 0, // 持续展示 toast
      forbidClick: true,
      message: '上传中',
      loadingType: 'spinner',
    })
    post(deloneimg, {
      imgurl: imgurl
    }).then(
      post(shopsave, data).then((res) => {
        Toast.clear();
        Toast.success('删除成功');
      })
    )
  },
  // 设置收货和采购单一致
  setsame() {
    this.setData({
      act_num: this.data.a_num,
      act_unit:this.data.unit
    })
  }
})