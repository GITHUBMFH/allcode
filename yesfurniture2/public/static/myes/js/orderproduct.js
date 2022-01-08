    // 加载表格元素
    layui.use(['table', 'jquery', 'form'], function () {
      var table = layui.table;
      var $ = layui.jquery;
      var form = layui.form;

      //定义变量
      var url = window.location.href;
      var urlname = url.substring(geturlname(url, '/', 5) + 1); //获取连接中的参数
      var lastDigits = urlname.substr(0, urlname.lastIndexOf("/")); //获取生产单的id
      var product_number = urlname.substring(urlname.lastIndexOf("/") + 1); //生产单号
      //获取url/第几次出现的位置
      function geturlname(str, cha, num) {
        var x = str.indexOf(cha);
        for (var i = 0; i < num; i++) {
          x = str.indexOf(cha, x + 1);
        }
        return x;
      }

      // layui.stope(window.event);
      //b:都有效
      // var evt = window.event || arguments.callee.caller.arguments[0]; // 获取event对象
      // layui.stope(evt);

      // 产品表格
      table.render({
        elem: '#orderProduct_lst',
        method: 'post',
        url: '/myes/index/orderproductlist',
        where: {
          id: lastDigits
        },
        loading: true,
        id: 'orderProduct',
        toolbar: '#progresstoolbar',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            }, {
              type: 'checkbox',
              title: '排序',
              fixed: 'left',
            }, {
              field: 'pro_num',
              align: 'center',
              width: '34%',
              title: '序号',
              fixed: 'left',
              templet: function (d) {
                return "<span lay-event='open'>" + d.pro_num +"</span>"
              },
            }, {
              toolbar: '#clickimg',
              field: 'img',
              title: '图片',
              width: '35%',
              align: 'center',
              edit: 'text',
            },
            {
              field: 'pro_name',
              align: 'center',
              title: '名称',
              width: '30%',
            }, {
              field: 'amount',
              align: 'center',
              title: '总数',
            }, {
              field: 'product_num',
              align: 'center',
              title: '生产',
              templet: function (d) {
                if (d.product_num > d.amount) {
                  return '<span style="color:red;">' + d.product_num + '</span>'
                } else {
                  return d.product_num;
                }
              }
            }, {
              field: 'shipment_num',
              align: 'center',
              title: '出货',
              templet: function (d) {
                if (d.shipment_num > d.amount) {
                  return '<span style="color:red;">' + d.shipment_num + '</span>'
                } else {
                  return d.shipment_num;
                }
              }
            }, {
              field: 'sofa',
              align: 'center',
              title: '软体放样',
              width: '28%',
              templet: function (d) {
                var html;
                if (d.sofa == 2) {
                  var html = '<input type="checkbox" name="sofa" lay-skin="switch" lay-text="已放|未放" lay-filter="changesofa" checked>'
                } else {
                  var html = '<input type="checkbox" name="sofa" lay-skin="switch" lay-text="已放|未放" lay-filter="changesofa">'
                }
                return html;
              }
            }, {
              field: 'solid',
              align: 'center',
              title: '实木放样',
              width: '28%',
              templet: function (d) {
                var html;
                if (d.solid == 2) {
                  var html = '<input type="checkbox" name="solid" lay-skin="switch" lay-text="已放|未放" lay-filter="changesolid" checked>'
                } else {
                  var html = '<input type="checkbox" name="solid" lay-skin="switch" lay-text="已放|未放" lay-filter="changesolid">'
                }
                return html;
              }
            }, {
              field: 'solid_num',
              align: 'center',
              title: '实木',
              edit: 'text',
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      // 行点击跳转
      table.on('rowDouble(orderProduct_lst)', function (obj, event) {
        var data = obj.data;
        var url = '/myes/index/product/id/' + data.id;
        // $(window).attr('location', url);
        window.open(url, "_blank", "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");
      });

      table.on('tool(orderProduct_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'clickimg') {
          if (data.img !== '' && data.img !== 'null') {
            layer.open({
              type: 1,
              skin: 'layui-layer-rim', //加上边框
              area: ['100%', '50%'], //宽高
              shadeClose: true, //开启遮罩关闭
              end: function (index, layero) {
                return false;
              },
              title: false,
              closeBtn: 0,
              shadeClose: true,
              content: '<div style="text-align:center"><img style="width:100%;height:auto;" src="http://resource.yasfurniture.cn/' + data.img + '" /></div>'
            });
          }
          return false;
        } else if (obj.event === 'open') {
          var data = obj.data;
          var url = '/myes/index/product/id/' + data.id;
          window.open(url, "_blank", "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");
        }
      })
      // 行点击跳转

      //软体放样
      form.on('switch(changesofa)', function (data) {
        layui.stope(event);
        var state_id = data.elem.checked == false ? 1 : 2;
        var id = data.othis.parents('tr').find('.laytable-cell-1-1-0').text();
        layer.confirm('确定已经放样？', {
          icon: 3,
          title: '提示',
          cancel: function () {
            data.elem.checked == false ? data.elem.checked = true : data.elem.checked = false;
            form.render("checkbox");
          }
        }, function (index) {
          layer.close(index);
          $.ajax({
            type: 'POST',
            url: '/myes/index/sofa_sample',
            data: {
              product_id: id,
              sofa: state_id
            },
            dataType: "json",
            success: function (res) {
              if (res.code == 0) {
                data.elem.checked == false ? data.elem.checked = true : data.elem.checked = false;
                form.render("checkbox");
              }
              layer.msg(res.msg);
            },
            error: function (res) {
              layer.msg(res.msg);
            }
          }, );
        }, function (index) {
          data.elem.checked == false ? data.elem.checked = true : data.elem.checked = false;
          form.render("checkbox");
        });
      });

      // 实木放样
      form.on('switch(changesolid)', function (data) {
        layui.stope(event);
        var state_id = data.elem.checked == false ? 1 : 2;
        var id = data.othis.parents('tr').find('.laytable-cell-1-1-0').text();
        layer.confirm('确定已经放样？', {
          icon: 3,
          title: '提示',
          cancel: function () {
            data.elem.checked == false ? data.elem.checked = true : data.elem.checked = false;
            form.render("checkbox");
          }
        }, function (index) {
          layer.close(index);
          $.ajax({
            type: 'POST',
            url: '/myes/index/sofa_sample',
            data: {
              product_id: id,
              solid: state_id
            },
            dataType: "json",
            success: function (res) {
              if (res.code == 0) {
                data.elem.checked == false ? data.elem.checked = true : data.elem.checked = false;
                form.render("checkbox");
              }
              layer.msg(res.msg);
            },
            error: function (res) {
              layer.msg(res.msg);
            }
          }, );
        }, function (index) {
          data.elem.checked == false ? data.elem.checked = true : data.elem.checked = false;
          form.render("checkbox");
        });
      });

      table.on('edit(orderProduct_lst)', function (obj) {
        var data = {};
        data.product_id = obj.data.id;
        data.solid_num = obj.data.solid_num;
        $.ajax({
          type: 'POST',
          url: '/myes/index/sofa_sample',
          data: data,
          dataType: "json",
          success: function (data) {
            layer.msg(data.msg);
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });



      // 产品表格
      table.render({
        elem: '#end_orderProduct_lst',
        loading: true,
        id: 'end_orderProduct_lst',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            }, {
              field: 'pro_num',
              align: 'center',
              width: '34%',
              title: '序号',
              fixed: 'left'
            }, {
              field: 'amount',
              align: 'center',
              edit: 'text',
              title: '总数',
            }, {
              toolbar: '#clickimg',
              field: 'img',
              title: '图片',
              width: '35%',
              align: 'center',
              edit: 'text',
            },
            {
              field: 'pro_name',
              align: 'center',
              title: '名称',
              width: '30%',
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      // 下单模拟点击
      $('#print_singer_sworker2').on('click', function () {
        $('#print_singer_sworker').trigger('click');
      })

      // 点击下单
      table.on('toolbar(orderProduct_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event == 'print_singer_sworker') {
          var worker_id = $('#worker_name2').val();
          var checkdata = checkStatus.data;
          if (checkdata.length < 1) {
            layer.msg('请选择产品');
          } else if (worker_id == '') {
            layer.msg('请选择人员');
          } else {
            $("#confirm_num").fadeIn();
            table.reload('end_orderProduct_lst', {
              data: checkdata,
            });
          }
        }
      });

      $("#cancel").on('click', function () {
        $("#confirm_num").fadeOut();
      })

      // 确认数量
      $('#end_p_worker_lst').on('click', function () {
        var worker_id = $('#worker_name2').val();
        var data = []
        var myDate = new Date;
        var year = myDate.getFullYear(); //获取当前年
        var mon = myDate.getMonth() + 1; //获取当前月
        var date = myDate.getDate();
        var time = year + '-' + mon + '-' + date;
        $.each(table.cache.end_orderProduct_lst, function (index, value) {
          var result = {};
          result.product_id = value.id;
          result.worker_id = worker_id
          result.num = value.amount;
          result.date = time;
          data.push(result);
        });

        layer.msg('是否确认添加', {
          time: 0,
          btn: ['确定', '取消'],
          yes: function (index) {
            // layer.close(index);
            $.ajax({
              type: 'POST', //请求类型
              url: '/yes/task/alladdPost', //URL
              data: {
                data: data
              }, //传递的参数
              dataType: "json", //返回的数据类型
              success: function (data) {
                layer.msg(data.msg);
                $("#confirm_num").fadeOut();
              }
            });
          },
          cancel: function () {
            alert('1');
            $("#confirm_num").fadeIn();
          }
        });
      })


    });