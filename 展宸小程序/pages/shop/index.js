const app = getApp();
var settime = 0;
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
  passshop,
  shopimg,
  getshopcount,
  shoplst,
  msg
} from '../../request/api';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectshop: false, //是否显示多选框
    refresher: false, //是否是下拉状态
    allselect: false, //是否全选
    searchvalue: '', //搜索value
    active: 2, //tab 
    signnum: 0, //笔画数量
    textall: '全选',
    signshow: false,
    tag: [{
      value: '全部',
      count: ''
    }, {
      value: '审核',
      count: ''
    }, {
      value: '待采购',
      count: ''
    }, {
      value: '已采购',
      count: ''
    }, {
      value: '已入库',
      count: ''
    }],
    shopdata: [],
    shopdata1: [],
    shopdata2: [],
    shopdata3: [],
    shopdata4: [],
    pageIndex: 1,
    pageIndex1: 1,
    pageIndex2: 1,
    pageIndex3: 1,
    pageIndex4: 1,
    height: '',
    loading: true,
    loading1: true,
    loading2: true,
    loading3: true,
    loading4: true,
    tabgetdata: true,
    tabgetdata1: true,
    tabgetdata2: true,
    tabgetdata3: true,
    tabgetdata4: true,
    page: 2,
    page1: 2,
    page2: 2,
    page3: 2,
    page4: 2,
    result: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow() {
    this.getTabBar().init();
    this.pagerest();
    this.getcount();
    const index = {};
    index.detail = {};
    index.detail.index = this.data.active;
    this.onChange(index);
  },
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          height: res.windowHeight - 100
        })
      }
    })
    this.startCanvas();
    Toast.setDefaultOptions({
      zIndex: 9999999
    })
  },
  // 获取待审核数量 待采购数量
  getcount() {
    post(getshopcount, {
      name: this.data.searchvalue
    }).then((res) => {
      this.setData({
        ['tag[1].count']: res.count1,
        ['tag[2].count']: res.count2
      })
    })
  },
  // 获取表单数据
  getdata: function () {
    switch (this.data.active) {
      case 0:
        var istab = this.data.page === 1 ? false : this.data.pageIndex <= this.data.page;
        break;
      case 1:
        var istab = this.data.page1 === 1 ? false : this.data.pageIndex1 <= this.data.page1;
        break;
      case 2:
        var istab = this.data.page2 === 1 ? false : this.data.pageIndex2 <= this.data.page2;
        break;
      case 3:
        var istab = this.data.page3 === 1 ? false : this.data.pageIndex3 <= this.data.page3;
        break;
      case 4:
        var istab = this.data.page4 === 1 ? false : this.data.pageIndex4 <= this.data.page4;
        break;
    }
    if (istab) {
      let data = {};
      switch (this.data.active) {
        case 0:
          data.pageIndex = this.data.pageIndex;
          this.setData({
            loading: true,
          })
          break;
        case 1:
          data.pageIndex = this.data.pageIndex1;
          this.setData({
            loading1: true,
          })
          break;
        case 2:
          data.pageIndex = this.data.pageIndex2;
          this.setData({
            loading2: true,
          })
          break;
        case 3:
          data.pageIndex = this.data.pageIndex3;
          this.setData({
            loading3: true,
          })
          break;
        case 4:
          data.pageIndex = this.data.pageIndex4;
          this.setData({
            loading4: true,
          })
          break;
      }
      data.filter = {};
      data.filter.orderstate = this.data.active;
      data.filter.shopname = this.data.searchvalue;
      post(shoplst, data).then((res) => {
        switch (this.data.active) {
          case 0:
            this.setData({
              shopdata: this.data.shopdata.concat(res.data),
              page: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex === this.data.page || res.count === 0) {
              this.setData({
                loading: false,
              })
            }
            break;
          case 1:
            this.setData({
              shopdata1: this.data.shopdata1.concat(res.data),
              page1: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex1 === this.data.page1 || res.count === 0) {
              this.setData({
                loading1: false,
              })
            }
            break;
          case 2:
            this.setData({
              shopdata2: this.data.shopdata2.concat(res.data),
              page2: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex2 === this.data.page2 || res.count === 0) {
              this.setData({
                loading2: false,
              })
            }
            break;
          case 3:
            this.setData({
              shopdata3: this.data.shopdata3.concat(res.data),
              page3: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex3 === this.data.page3 || res.count === 0) {
              this.setData({
                loading3: false,
              })
            }
            break;
          case 4:
            this.setData({
              shopdata4: this.data.shopdata4.concat(res.data),
              page4: Math.ceil(res.count / 10),
            })
            if (this.data.pageIndex4 === this.data.page4 || res.count === 0) {
              this.setData({
                loading4: false,
              })
            }
            break;
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
    switch (this.data.active) {
      case 0:
        this.setData({
          loading: false,
        })
        break;
      case 1:
        this.setData({
          loading1: false,
        })
        break;
      case 2:
        this.setData({
          loading2: false,
        })
        break;
      case 3:
        this.setData({
          loading3: false,
        })
        break;
      case 4:
        this.setData({
          loading4: false,
        })
        break;
    }
  },
  // 滚动刷新
  getdown() {
    switch (this.data.active) {
      case 0:
        this.setData({
          pageIndex: this.data.pageIndex + 1,
        })
        break;
      case 1:
        this.setData({
          pageIndex1: this.data.pageIndex1 + 1,
        })
        break;
      case 2:
        this.setData({
          pageIndex2: this.data.pageIndex2 + 1,
        })
        break;
      case 3:
        this.setData({
          pageIndex3: this.data.pageIndex3 + 1,
        })
        break;
      case 4:
        this.setData({
          pageIndex4: this.data.pageIndex4 + 1,
        })
        break;
    }
    this.getdata();
  },
  // tabs改变时
  onChange(event) {
    this.setData({
      active: event.detail.index,
      signshow: false,
      allselect: false,
      result: [],
      selectshop: false
    })
    switch (this.data.active) {
      case 0:
        this.data.tabgetdata ? this.getdata() : null;
        this.setData({
          tabgetdata: false,
        })
        break;
      case 1:
        this.data.tabgetdata1 ? this.getdata() : null;
        this.setData({
          tabgetdata1: false,
        })
        break;
      case 2:
        this.data.tabgetdata2 ? this.getdata() : null;
        this.setData({
          tabgetdata2: false,
        })
        break;
      case 3:
        this.data.tabgetdata3 ? this.getdata() : null;
        this.setData({
          tabgetdata3: false,
        })
        break;
      case 4:
        this.data.tabgetdata4 ? this.getdata() : null;
        this.setData({
          tabgetdata4: false,
          isshop:false
        })
        break;
    }
  },
  //页面重置
  pagerest() {
    this.setData({
      page: 2,
      page1: 2,
      page2: 2,
      page3: 2,
      page4: 2,
      pageIndex: 1,
      pageIndex1: 1,
      pageIndex2: 1,
      pageIndex3: 1,
      pageIndex4: 1,
      tabgetdata: true,
      tabgetdata1: true,
      tabgetdata2: true,
      tabgetdata3: true,
      tabgetdata4: true,
      shopdata: [],
      shopdata1: [],
      shopdata2: [],
      shopdata3: [],
      shopdata4: [],
    })
  },
  // 搜索
  searchchange() {
    clearTimeout(settime);
    settime = setTimeout(() => {
      this.pagerest();
      this.getdata();
      this.getcount();
    }, 500)
  },
  // 点击选择
  toggle(event) {
    const {
      index
    } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    checkbox.toggle();
  },
  // 添加多选
  selectChange(event) {
    this.setData({
      result: event.detail
    });
  },
  //切换多选状态
  changeselect: function (e) {
    this.setData({
      ['selectshop']: !this.data['selectshop'],
    });
    if (this.data.selectshop) {
      Toast.success('开启多选');
      this.setData({
        allselect: true
      })
    } else {
      Toast.fail('关闭多选');
      this.setData({
        result: [],
        allselect: false
      })
    }
  },
  // 下拉刷新
  gettop() {
    switch (this.data.active) {
      case 0:
        this.setData({
          shopdata: [],
          pageIndex: 1,
          page: 2,
        })
        break;
      case 1:
        this.setData({
          shopdata1: [],
          pageIndex1: 1,
          page1: 2,
        })
        break;
      case 2:
        this.setData({
          shopdata2: [],
          pageIndex2: 1,
          page2: 2,
        })
        break;
      case 3:
        this.setData({
          shopdata3: [],
          pageIndex3: 1,
          page3: 2,
        })
        break;
      case 4:
        this.setData({
          shopdata4: [],
          pageIndex4: 1,
          page4: 2,
        })
        break;
    }
    this.getdata();
  },
  // 全选或者弹出签名
  getall(e) {
    if (e.detail === 0) {
      if (this.data.textall === '全选') {
        const allresult = this.data.shopdata1.map(item => {
          return item.id;
        }).join(',').split(',');
        this.setData({
          result: allresult,
          textall: '取消全选'
        })
      } else {
        this.setData({
          result: [],
          textall: '全选'
        })
      }

    } else if (e.detail === 2) {
      var selectshopnum = this.data.result.length;
      if (selectshopnum < 1) {
        Toast.fail('请选择采购单');
      } else {
        if (this.data.active==2) {
          this.changestate(3);
        } else if (this.data.active==3) {
          this.changestate(2);
        } else {
          this.setData({
            signshow: true
          })
        }
      }
    }
  },

  changestate(state) {
    const that = this;
    const data = {};
    data.id = that.data.result;
    data.state = state;
    post(passshop, data).then((res) => {
      Toast.success('修改成功');
      that.setData({
        allselect: false,
        result: [],
        selectshop: false
      })
      that.pagerest();
      that.getdata();
      that.getcount();
    })
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
              data.id = that.data.result;
              var url = JSON.parse(savename.data);
              data.savename = url.url;
              post(passshop, data).then((res) => {
                Toast.clear();
                that.setData({
                  signshow: false,
                  allselect: false,
                  result: [],
                  selectshop: false
                })
                that.pagerest();
                that.getdata();
                that.cleardraw();
                that.getcount();
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
  gotourl(e) {
    if (!this.data.selectshop) {
      wx.navigateTo({
        url: '/pages/goods/index?id=' + e.currentTarget.dataset.index + '&isget=true'
      })
    }
  }
  // sendmsg(formid) {
  //   var that = this;
  //   wx.requestSubscribeMessage({
  //     tmplIds: ['2JBlk5J0LUk7xLqjQGTjbPeT7F26-_yEblNi_jZ1JoM'],
  //     success(res) {
  //       console.log(res);
  //       var data = {
  //         formid: formid
  //       };
  //       post(msg).then((res) => {
  //         console.log(res);
  //       })
  //     }
  //   })
  // }
})