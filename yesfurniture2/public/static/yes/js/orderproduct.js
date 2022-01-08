    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'upload', 'laydate'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var upload = layui.upload;
      var laydate = layui.laydate;

      //定义变量
      var url = window.location.href;
      var urlname = url.substring(geturlname(url, '/', 5) + 1); //获取连接中的参数
      var lastDigits = urlname.substr(0, urlname.lastIndexOf("/")); //获取生产单的id
      var product_number = urlname.substring(urlname.lastIndexOf("/") + 1); //生产单号
      var operate; //区分是添加还是修改
      var isupimg = '0'; //是否有图片上传 0代表没有 1代表有图片上传
      var firstimg; //储蓄第一张图片的filed
      var product_id;
      var dataid = []; //选中要删除的id
      var sparedata; //重载的数据
      var cost_material = [];
      var uploaddata;
      var add_people = []; //添加人员信息
      var allnumber; //下发产品数量
      var productid; //下发任务产品id
      //获取url/第几次出现的位置
      function geturlname(str, cha, num) {
        var x = str.indexOf(cha);
        for (var i = 0; i < num; i++) {
          x = str.indexOf(cha, x + 1);
        }
        return x;
      }

      laydate.render({
        elem: '#produce_time',
        showBottom: false
      });

      laydate.render({
        elem: '#shipment_time',
        showBottom: false
      });

      laydate.render({
        elem: '#all_time',
        showBottom: false
      });

      // 产品表格
      table.render({
        elem: '#orderProduct_lst',
        method: 'post',
        url: '/yes/order_product/index',
        where: {
          id: lastDigits
        },
        loading: true,
        // even: true,
        toolbar: '#orderProducttoolbar',
        data: [{}],
        id: 'orderProduct',
        cols: [
          [{
            field: 'title',
            title: '<span style="font-weight: bold;font-size: 30px;">' + product_number + '</span>',
            align: 'center',
            colspan: 17,
          }],
          [{
            field: 'project',
            // title: orderproject,
            align: 'center',
            colspan: 16,
            hide: true
          }],
          [{
              type: 'checkbox',
              title: '排序',
            },
            {
              field: 'id',
              title: 'ID',
              hide: true
            }, {
              field: 'pro_num',
              align: 'center',
              width: '10%',
              title: '序号',
            }, {
              toolbar: '#clickimg',
              field: 'img',
              title: '图片',
              width: '10%',
              align: 'center',
              edit: 'text',
            }, {
              field: 'size',
              align: 'center',
              title: '产品规格',
            },
            {
              field: 'pro_name',
              align: 'center',
              title: '产品名称',
            },
            {
              field: 'amount',
              align: 'center',
              title: '总数',
              width: '6%',
            }, {
              field: 'product_num',
              align: 'center',
              title: '生产',
              hide: true,
              width: '6%',
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
              hide: true,
              width: '6%',
              templet: function (d) {
                if (d.shipment_num > d.amount) {
                  return '<span style="color:red;">' + d.shipment_num + '</span>'
                } else {
                  return d.shipment_num;
                }
              }
            }, {
              field: 'product_dec',
              align: 'center',
              title: '产品描述',
            }, {
              field: 'remark',
              align: 'center',
              title: '备注',
            }, {
              field: 'remark',
              align: 'center',
              title: '布料用量',
              templet:function(d){
                return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
              },
              hide:true
            }, {
              field: 'remark',
              align: 'center',
              title: '出货情况',
              width:'30%',
              templet:function(d){
                return '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
              },
              hide:true
            }, {
              field: 'task',
              align: 'center',
              title: '任务情况',
              width: '50%',
              toolbar: '#task',
              hide:true
            }, {
              toolbar: '#orderProductbar',
              align: 'center',
              width: '26%',
              title: '操作',
            }
          ]
        ],
        done: function (d) {
          var html = "<p style='text-align: center;font-size: 18px;'>项目名称:" + d.project + "</p>" + "<p style='color: red;text-align: center;font-size: 16px;'>" + d.remark;
          $('tr').find('th[data-field="project"]').html(html);
          element.render();
        }
      });

      // 行点击跳转
      table.on('rowDouble(orderProduct_lst)', function (obj) {
        var data = obj.data;
        var time = data.order_time;
        var url = '/yes/product/index/id/' + data.id;
        var id = md5(url);
        parent.element.tabAdd('xbs_tab', {
          title: product_number + '-' + data.pro_num,
          content: '<iframe tab-id="' + id + '" frameborder="0" src="' + url + '" scrolling="yes" class="layadmin-iframe"></iframe>',
          id: id
        })
        parent.element.tabChange('xbs_tab', id);
      });

      //监听工具条
      table.on('tool(orderProduct_lst)', function (obj) {
        var data = obj.data;
        product_id = data.id;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除么？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/order_product/delPost',
              data: {
                id: data.id
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        } else if (obj.event === 'edit') { //编辑生产单
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            skin: 'yourclass',
            area: ['80%', '90%'],
            content: $('#orderProduct_form'),
            success: function () {
              if (data.img !== "" && data.img !== 'null') {
                $('#preimg').show().attr('src', 'http://resource.yasfurniture.cn/' + data.img + '?imageView2/1/w/100/h/100/format/webp/q/75');
              } else {
                $('#preimg').hide();
              }
              $('.add_orderProduct_form').hide();
              $('.edit_orderProduct_form').hide();
              operate = 'edit';
            }
          });
          uploaddata = data;
          form.val("orderProduct_form", {
            'id': data.id,
            "pro_num": data.pro_num,
            "img": data.img,
            "size": data.size,
            "product_dec": data.product_dec,
            "amount": data.amount,
            "remark": data.remark,
            "pro_name": data.pro_name
          })
        } else if (obj.event === 'clickimg') {
          if (data.img !== '' && data.img !== 'null') {
            layer.open({
              type: 1,
              skin: 'layui-layer-rim', //加上边框
              area: ['50%', '70%'], //宽高
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
        } else if (obj.event === 'material') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['80%', '90%'],
            content: $('#material'),
            success: function () {
              $.ajax({
                type: 'POST',
                url: '/yes/order_product/getspare',
                data: {
                  id: data.id
                },
                dataType: "json",
                success: function (data) {
                  sparedata = data.data;
                  table.reload('material', {
                    data: sparedata
                  });
                },
                error: function (data) {
                  layer.msg(data.msg);
                }
              });
            }
          });
        } else if (obj.event === 'cost_labor') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['80%', '90%'],
            content: $('#cost_labor'),
            success: function () {
              table.reload('cost_labor', {
                url: '/yes/order_product/costlabor',
                where: {
                  id: data.id
                }
              });
            }
          });
        } else if (obj.event === 'cost') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['80%', '90%'],
            content: $('#cost_material'),
            success: function () {
              cost_material = data;
              $.ajax({
                type: 'POST',
                url: '/yes/order_product/costmaterial',
                data: {
                  id: data.id
                },
                dataType: "json",
                success: function (data) {
                  cost_material = data.data;
                  table.reload('cost_material', {
                    data: cost_material
                  });
                  var material_cost = 0;
                  $.each(cost_material, function (key, val) {
                    material_cost += parseInt(val.c_prcie * val.used);
                  });
                  $('#material_cost').val(material_cost);
                },
                error: function (data) {
                  layer.msg(data.msg);
                }
              });
            }
          });
        } else if (obj.event === 'produce') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['80%', '80%'],
            content: $('#produce'),
            success: function () {
              table.reload('idproduce', {
                url: '/yes/produce/searchlst',
                where: {
                  product_id: data.id
                },
              });
            }
          });
        } else if (obj.event === 'shipment') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['80%', '80%'],
            content: $('#shipment'),
            success: function () {
              table.reload('idshipment', {
                url: '/yes/shipment/searchlst',
                where: {
                  product_id: data.id
                },
              });
            }
          });
        } else if (obj.event === 'task') {
          var work_id = $(this).attr('data-id');
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['30%', '50%'],
            content: $('#taskbox'),
            success: function () {
              table.reload('idtask', {
                url: '/yes/task/check',
                where: {
                  product_id: data.id,
                  work_id:work_id
                },
              });
            }
          });
        }
      });

      //任务分配
      table.render({
        elem: '#task_lst',
        method: 'post',
        loading: true,
        id: 'idtask',
        cols: [
          [{
            field: 'work_id',
            title: 'ID',
            hide: true
          }, {
            field: 'name',
            title: '姓名',
            align: 'center'
          }, {
            field: 'task_num',
            title: '分配数量',
            align: 'center',
            templet:function(d){
              if(d.task_num == null){
                return '0';
              }else{
                return d.task_num;
              }
            }
          }, {
            field: 'pro_num',
            title: '完成数量',
            align: 'center',
            templet:function(d){
              if(d.pro_num == null){
                return '0';
              }else{
                return d.pro_num;
              }
            }
          }]
        ],
        done: function () {
          element.render();
        }
      });

      //出货记录
      table.render({
        elem: '#shipment_lst',
        method: 'post',
        loading: true,
        toolbar: '#shipmenttoolbar',
        // page:true,
        // limit: 20,
        id: 'idshipment',
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'shipment_num',
            title: '出货数量',
            align: 'center'
          }, {
            field: 'shipment_data',
            title: '出货日期',
            align: 'center'
          }, {
            align: 'center',
            toolbar: '#shipmentbar',
            title: '操作',
          }]
        ],
        done: function () {
          element.render();
        }
      });
      // 出货记录
      table.on('toolbar(shipment_lst)', function (obj) {
        if (obj.event === 'add_shipment') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['50%', '50%'],
            content: $('#add_shipment_form'),
            success: function (layero, index) {
              $('.edit_shipment_form').hide();
              $('.add_shipment_form').show();
            }
          });
        }
        $('.fromreset').trigger("click");
      });

      // 出货记录
      form.on('submit(add_shipment_form)', function (data) {
        var data = data.field;
        delete data.id;
        data.product_id = product_id;
        data.num = lastDigits;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/shipment/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
        });
      });

      // 出货记录
      form.on('submit(edit_shipment_form)', function (data) {
        var data = data.field;
        data.product_id = product_id;
        data.num = lastDigits;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/shipment/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
        });
      });

      //出货记录
      table.on('tool(shipment_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除出货记录么？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/shipment/delPost',
              data: {
                id: data.id,
                product_id: product_id
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        } else if (obj.event === 'edit') { //编辑生产单
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['50%', '50%'],
            content: $('#add_shipment_form'),
            success: function (layero, index) {
              $('.edit_shipment_form').show();
              $('.add_shipment_form').hide();
            }
          });
          form.val("shipment_form", {
            "id": data.id,
            "shipment_num": data.shipment_num,
            "shipment_data": data.shipment_data,
          });
        }
      });


      //生产记录表
      table.render({
        elem: '#produce_lst',
        method: 'post',
        loading: true,
        // 开启工具栏
        toolbar: '#producetoolbar',
        // page:true,
        // limit: 20,
        id: 'idproduce',
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'product_num',
            title: '生产数量',
            align: 'center'
          }, {
            field: 'product_data',
            title: '生产日期',
            align: 'center'
          }, {
            align: 'center',
            toolbar: '#producebar',
            title: '操作',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 添加生产记录
      table.on('toolbar(produce_lst)', function (obj) {
        if (obj.event === 'add_produce') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['50%', '50%'],
            content: $('#add_produce_form'),
            success: function (layero, index) {
              $('.edit_produce_form').hide();
              $('.add_produce_form').show();
            }
          });
        }
        $('.fromreset').trigger("click");
        $('#produce_num_form').html($("<option>").val('').text('请选择生产单'));
        $('#produce_product_form').html($("<option>").val('').text('请选择产品序号'));
      });

      // 监听生产记录添加
      form.on('submit(add_produce_form)', function (data) {
        var data = data.field;
        delete data.id;
        data.product_id = product_id;
        data.num = lastDigits;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/produce/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
        });
      });

      // 监听生产记录修改
      form.on('submit(edit_produce_form)', function (data) {
        var data = data.field;
        data.product_id = product_id;
        data.num = lastDigits;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/produce/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
        });
      });

      //监听生产记录工具条
      table.on('tool(produce_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除生产记录么？', function (index) {
            $.ajax({
              type: 'POST',
              url: '/yes/produce/delPost',
              data: {
                id: data.id,
                product_id: product_id
              },
              dataType: "json",
              success: function (data) {
                obj.del();
                layer.close(index);
                layer.msg(data.msg);
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        } else if (obj.event === 'edit') { //编辑生产单
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['50%', '50%'],
            content: $('#add_produce_form'),
            success: function (layero, index) {
              $('.edit_produce_form').show();
              $('.add_produce_form').hide();
            }
          });
          form.val("produce_form", {
            "id": data.id,
            "product_num": data.product_num,
            "product_data": data.product_data,
          });
        }
      });

      // 添加生产单提交弹框
      table.on('toolbar(orderProduct_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event == 'add_orderProduct') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['80%', '90%'],
            content: $('#orderProduct_form')
          });
          operate = 'add';
          $('.fromreset').trigger('click');
          $('.add_orderProduct_form').hide();
          $('.edit_orderProduct_form').hide();
          $('#preimg').hide();
        } else if (obj.event == 'print_product') {
          var checkdata = checkStatus.data;
          if (checkdata.length > 0) {
            var dataid = [];
            $.each(checkdata, function (index, elem) {
              dataid.push(elem.id);
            })

            var params = {
              "dataid": dataid
            };
            var url = "/yes/product/sampleproduct";
            post(url, params);
          } else {
            layer.msg('请选择产品');
          }
          return false;
        } else if (obj.event == 'print_worker') {
          var checkdata = checkStatus.data;
          if (checkdata.length != 1) {
            layer.msg('请选择单个产品下发任务');
            return false;
          } else {
            allnumber = checkdata[0].amount;
            productid = checkdata[0].id;
            $.each(add_people, function (index, elem) {
              elem.number = allnumber;
            })
            layer.open({
              type: 1,
              title: false,
              closeBtn: 0,
              shadeClose: true,
              area: ['80%', '90%'],
              content: $('#p_worker'),
              success: function () {
                table.reload('idworkerlst', {
                  data: add_people,
                });
              },
            });

          }
        } else if (obj.event == 'all_shipment') {
          var checkdata = checkStatus.data;
          if (checkdata.length < 1) {
            layer.msg('请选择产品');
            return false;
          } else if ($('#all_time').val() == '') {
            layer.msg('请选择日期');
            return false;
          } else {
            var data2 = [];
            $.each(checkdata, function (index, elem) {
              var data = {};
              data.product_id = elem.id;
              data.shipment_data = $('#all_time').val();
              if (!isNaN(elem.amount - elem.shipment_num) && elem.amount - elem.shipment_num > 0) {
                data.shipment_num = elem.amount - elem.shipment_num;
                data2.push(data);
              }
            })
            if (data2.length > 0) {
              $.ajax({
                type: 'POST', //请求类型
                url: '/yes/shipment/alladdPost', //URL
                data: {
                  data: data2,
                  orderid: lastDigits
                }, //传递的参数
                dataType: "json", //返回的数据类型
                success: function () {
                  layer.msg('添加成功');
                  table.reload('orderProduct');
                }
              });
            } else {
              layer.msg('已经全部出货,请核实');
            }
          }
        } else if (obj.event == 'all_product') {
          var checkdata = checkStatus.data;
          if (checkdata.length < 1) {
            layer.msg('请选择产品');
            return false;
          } else if ($('#all_time').val() == '') {
            layer.msg('请选择日期');
            return false;
          } else {
            var data2 = [];
            $.each(checkdata, function (index, elem) {
              var data = {};
              data.product_id = elem.id;
              data.product_data = $('#all_time').val();
              if (!isNaN(elem.amount - elem.product_num) && elem.amount - elem.product_num > 0) {
                data.product_num = elem.amount - elem.product_num;
                data2.push(data);
              }
            })
            if (data2.length > 0) {
              $.ajax({
                type: 'POST', //请求类型
                url: '/yes/produce/alladdPost', //URL
                data: {
                  data: data2,
                  orderid: lastDigits
                }, //传递的参数
                dataType: "json", //返回的数据类型
                success: function () {
                  layer.msg('添加成功');
                  table.reload('orderProduct');
                }
              });
            } else {
              layer.msg('已经全部生产,请核实');
            }
          }
        }else if(obj.event == 'print_singer_sworker'){
          var worker_id = $('#worker_name2').val();
          var checkdata = checkStatus.data;
          if (checkdata.length < 1) {
            layer.msg('请选择产品');
          }else if(worker_id ==''){
            layer.msg('请选择人员');
          } else {
            var dataid = [];
            var amount = [];
            $.each(checkdata, function (index, elem) {
              dataid.push(elem.id);
              amount.push(elem.amount);
            })
            var params = {
              "worker_id":worker_id,
              "dataid": dataid,
              "amount": amount
            };
            var url = "/yes/product/getsingerproduct";
            post(url, params);

            var data = []
            var myDate = new Date;
            var year = myDate.getFullYear(); //获取当前年
            var mon = myDate.getMonth() + 1; //获取当前月
            var date = myDate.getDate();
            var time= year+'-'+mon+'-'+date;
            $.each(checkdata, function (index, value) {
              var result = {};
              result.product_id = value.id;
              result.worker_id = worker_id
              result.num = value.amount;
              result.date = time;
              data.push(result);
          });
          // console.log(data);
            layer.msg('是否插入到生产任务', {
              time: 0
              ,btn: ['确定', '取消']
              ,yes: function(index){
                layer.close(index);
                $.ajax({
                  type: 'POST', //请求类型
                  url: '/yes/task/alladdPost', //URL
                  data: {
                    data:data
                  }, //传递的参数
                  dataType: "json", //返回的数据类型
                  success: function () {
                    layer.msg('添加成功');
                  }
                });
              }
            });
          }
        }
      });

      $('#print_singer_sworker2').on('click', function () {
        $('#print_singer_sworker').trigger('click');
      })

      $('#all_shipment1').on('click', function () {
        $('#all_shipment').trigger('click');
      })

      $('#all_product1').on('click', function () {
        $('#all_product').trigger('click');
      })
      //打印任务
      $('#people_next').on('click', function () {
        var params = {
          "productid": productid,
          'data': JSON.stringify(table.cache.idworkerlst)
        };
        var url = "/yes/product/getproduct";
        post(url, params);
        var data = [];
        var myDate = new Date;
        var year = myDate.getFullYear(); //获取当前年
        var mon = myDate.getMonth() + 1; //获取当前月
        var date = myDate.getDate();
        var time= year+'-'+mon+'-'+date;
        $.each(table.cache.idworkerlst, function (index, value) {
            var result = {};
            result.product_id = productid;
            result.worker_id = value.worker_id;
            result.num = value.number;
            result.date = time;
            data.push(result);
        });
        layer.msg('是否插入到生产任务', {
          time: 0
          ,btn: ['确定', '取消']
          ,yes: function(index){
            layer.close(index);
            $.ajax({
              type: 'POST', //请求类型
              url: '/yes/task/alladdPost', //URL
              data: {
                data:data
              }, //传递的参数
              dataType: "json", //返回的数据类型
              success: function () {
                layer.msg('添加成功');
              }
            });
          }
        });
      })

      //跳转打印页面
      function post(url, params) {
        // 创建form元素
        var temp_form = document.createElement("form");
        // 设置form属性
        temp_form.action = url;
        temp_form.target = "_blank";
        temp_form.method = "post";
        temp_form.style.display = "none";
        // 处理需要传递的参数
        for (var x in params) {
          var opt = document.createElement("textarea");
          opt.name = x;
          opt.value = params[x];
          temp_form.appendChild(opt);
        }
        document.body.appendChild(temp_form);
        // 提交表单
        temp_form.submit();
      }

      //任务人员列表
      table.render({
        elem: '#p_worker_lst',
        loading: true,
        id: 'idworkerlst',
        limit: 20,
        cols: [
          [{
            field: 'work_type',
            title: '工种',
            align: 'center'
          }, {
            field: 'worker_name',
            title: '姓名',
            align: 'center'
          }, {
            field: 'number',
            title: '数量',
            align: 'center',
            edit: 'text'
          }, {
            align: 'center',
            toolbar: '#pworker',
            title: '操作',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 删除任务人员
      table.on('tool(p_worker_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
          obj.del();
          $.each(add_people, function (index, value) {
            if (value.work_type == data.work_type && value.worker_name == data.worker_name && value.number == data.number && value.worker_id == data.worker_id) {
              add_people.splice(index, 1);
            }
          });
        }
      });

      // 添加任务人员
      $('#add_people').on('click', function () {
        var work_type = $('#ad_worker_id option:selected').text();
        var worker_name = $('#worker_name option:selected').text();
        var worker_id = $('#worker_name').val();
        var data = {
          work_type: work_type,
          worker_name: worker_name,
          number: allnumber,
          worker_id: worker_id
        }
        add_people.push(data);
        table.reload('idworkerlst', {
          data: add_people
        });
      })

      // 添加产品
      form.on('submit(add_orderProduct_form)', function (data) {
        var data = data.field;
        delete data.id;
        data.size = data.size.replace(/(^")|("$)/g, '');
        data.product_dec = data.product_dec.replace(/\"/g, "");
        data.remark = data.remark.replace(/\"/g, "");
        data.pro_name = data.pro_name.replace(/\"/g, "");
        data.order_id = lastDigits;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/order_product/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
            if (data.code = '0') {
              location.reload()
              // table.reload('orderProduct');
            }
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

      // 编辑产品
      form.on('submit(edit_orderProduct_form)', function (data) {
        var data = data.field;
        data.size = data.size.replace(/(^")|("$)/g, '');
        data.product_dec = data.product_dec.replace(/\"/g, "");
        data.remark = data.remark.replace(/\"/g, "");
        data.pro_name = data.pro_name.replace(/\"/g, "");
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/order_product/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
            if (data.code = '0') {
              location.reload()
              // table.reload('orderProduct');
            }
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

      //上传图片
      var uploadimg = upload.render({
        elem: '#uploadimg',
        url: '/yes/order_product/uploadimg',
        auto: false,
        bindAction: '#addimg',
        upload: true,
        choose: function (obj) {
          if (firstimg != undefined) {
            delete obj.pushFile()[firstimg];
          }
          var files = obj.pushFile();
          obj.preview(function (index, file, result) {
            firstimg = index;
            $('#preimg').show().attr('src', result); //图片链接（base64）
          });
          isupimg = '1';
        },
        before: function (obj) {
          layer.load(2);
        },
        done: function (res) {
          layer.closeAll('loading');
          //上传完毕回调
          if (res.code > 0) {
            return layer.msg('上传失败');
          } else {
            $('#getimg').val(res.key);
            if (operate == 'add' && isupimg == '1') {
              $('.add_orderProduct_form').trigger('click');
            } else if (operate == 'edit' && isupimg == '1') {
              $('.edit_orderProduct_form').trigger('click');
            }
          }
        },
      });

      $('#addimg').on('click', function () {
        if (operate == 'edit' && isupimg == '0') {
          $('.edit_orderProduct_form').trigger('click');
          return false;
        } else if (operate == 'add' && isupimg == '0') {
          $('.add_orderProduct_form').trigger('click');
        }
      })

      // 显示图片操作
      $('.img_box img').hover(function () {
        $('.eidt_btm').stop().fadeIn();
        return false;
      })
      // 显示图片操作
      $('.eidt_btm').hover(function () {
        return false;
      }, function () {
        $('.eidt_btm').stop().fadeOut();
        return false;
      })

      //替换图片
      $('.btm_box .change').on('click', function () {
        $('#uploadimg').trigger('click');
      })

      //删除图片
      $('.btm_box .del').on('click', function () {
        var data = uploaddata;
        form.val("orderProduct_form", {
          'id': data.id,
          "pro_num": data.pro_num,
          "img": '',
          "size": data.size,
          "product_dec": data.product_dec,
          "amount": data.amount,
          "remark": data.remark,
          "pro_name": data.pro_name
        })
        $('#preimg').hide();
        return false;
      })

      // 备料数据表
      table.render({
        elem: '#material_lst',
        method: 'post',
        loading: true,
        id: 'material',
        toolbar: '#toolbarmaterial',
        size: 'lg',
        cols: [
          [{
            type: 'checkbox'
          }, {
            field: 'id',
            title: 'id',
            hide: true,
          }, {
            field: 'name',
            title: '名称',
            align: 'center',
            edit: 'text'
          }, {
            field: 'type',
            title: '类型',
          }, {
            field: 'size',
            title: '规格',
            align: 'center',
            edit: 'text'
          }, {
            field: 'used',
            title: '用量',
            align: 'center',
            edit: 'text'
          }, {
            field: 'details',
            title: '描述',
            align: 'center',
            edit: 'text'
          }, {
            field: 'state',
            title: '状态',
            align: 'center',
            templet: '#state'
          }, {
            field: 'who',
            title: '下单人',
            align: 'center',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      //备料头工具栏事件
      table.on('toolbar(material_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event === 'del') {
          layer.confirm('确定删除么？', function (index) {
            // obj.del();
            layer.close(index);
            var checkdata = checkStatus.data;
            $.each(checkdata, function (index, elem) {
              dataid.push(elem.id);
            })
            $.ajax({
              type: 'POST',
              url: '/yes/order_product/delsparePost',
              data: {
                id: dataid
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                dataid = [];
                $.each(checkdata, function (index, elem) {
                  sparedata.splice($.inArray(elem, sparedata), 1)
                })
                //重载表格
                table.reload('material', {
                  data: sparedata
                });
              },
              error: function (data) {
                layer.msg(data.msg);
                dataid = [];
              }
            });
          });
        } else if (obj.event === 'add') {
          var type = $('.sparetype').val();
          if (type == '') {
            layer.msg('请选择类型');
          } else {
            var addspare = {
              product_id: product_id,
              type: type,
            };
            $.ajax({
              type: 'POST',
              url: '/yes/order_product/addsparePost',
              data: addspare,
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                sparedata.push(addspare);
                //重载表格
                table.reload('material', {
                  url: '/yes/order_product/getspare',
                  where: {
                    id: product_id
                  },
                });
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          }
        }
      });

      //备料编辑
      table.on('edit(material_lst)', function (obj) {
        var data = obj.data;
        $.ajax({
          type: 'POST',
          url: '/yes/order_product/eidtsparePost',
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

      // 人工费用
      table.render({
        elem: '#cost_labor_lst',
        method: 'post',
        loading: true,
        id: 'cost_labor',
        toolbar: '#toolbarcost_labor',
        size: 'lg',
        totalRow: true,
        cols: [
          [{
            type: 'checkbox'
          }, {
            field: 'id',
            title: 'id',
            hide: true,
          }, {
            field: 'name',
            title: '名称',
            align: 'center',
            width: '10%',
            templet: function (d) {
              return d.worktype.name;
            },
          }, {
            field: 'standard',
            title: '规格',
            templet: function (d) {
              return d.dailyprice.standard;
            }
          }, {
            field: 'c_price',
            title: '参考价格',
            align: 'center',
            width: '18%',
            templet: function (d) {
              return d.dailyprice.price;
            },
            totalRowText: '总费用'
          }, {
            field: 'price',
            title: '实际价格',
            edit: 'text',
            align: 'center',
            width: '18%',
            totalRow: true
          }]
        ],
        done: function () {
          element.render();
        }
      });

      //人工费用头工具栏事件
      table.on('toolbar(cost_labor_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event === 'del') {
          layer.confirm('确定删除么？', function (index) {
            layer.close(index);
            var checkdata = checkStatus.data;
            $.each(checkdata, function (index, elem) {
              dataid.push(elem.id);
            })
            $.ajax({
              type: 'POST',
              url: '/yes/order_product/delcostlabor',
              data: {
                id: dataid
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                dataid = [];
                //重载表格
                table.reload('cost_labor', {
                  url: '/yes/order_product/costlabor',
                  where: {
                    id: product_id
                  },
                });
              },
              error: function (data) {
                layer.msg(data.msg);
                dataid = [];
              }
            });
          });
        } else if (obj.event === 'add') {
          var worker_id = $('.cost_labortype').val();
          var standard_id = $('#type_standard').val();
          var addcost_labor = {
            product_id: product_id,
            worker_id: worker_id,
            standard_id: standard_id,
          };
          if (worker_id == '') {
            layer.msg('请选择工种');
          } else if (standard_id == '') {
            layer.msg('请选择规格');
          } else {
            $.ajax({
              type: 'POST',
              url: '/yes/order_product/addcostlabor',
              data: addcost_labor,
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                table.reload('cost_labor', {
                  url: '/yes/order_product/costlabor',
                  where: {
                    id: product_id
                  },
                });
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          }
        } else if (obj.event === 'add_normal') {
          var normal_id = $('#add_normal').val();
          if (normal_id == '') {
            layer.msg('请选择规格');
          } else {
            layer.confirm('是否清空人工费用,添加常规人工费用?', {
                icon: 3,
                title: '提示'
              },
              function (index) {
                $.ajax({
                  type: 'POST',
                  url: '/yes/order_product/addcostlabors',
                  data: {
                    product_id: product_id,
                    id: normal_id
                  },
                  dataType: "json",
                  success: function (data) {
                    layer.msg(data.msg);
                    table.reload('cost_labor', {
                      url: '/yes/order_product/costlabor',
                      where: {
                        id: product_id
                      },
                    });
                  },
                  error: function (data) {
                    layer.msg(data.msg);
                  }
                });
                layer.close(index);
              });
          }
        }
      });

      //人工编辑
      table.on('edit(cost_labor_lst)', function (obj) {
        var data = {};
        data.id = obj.data.id;
        data.price = obj.data.price;
        data.product_id = obj.data.product_id;
        $.ajax({
          type: 'POST',
          url: '/yes/order_product/editcostlabor',
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

      // 用料表格
      table.render({
        elem: '#cost_material_lst',
        method: 'post',
        loading: true,
        id: 'cost_material',
        toolbar: '#toolbarcost_material',
        size: 'lg',
        cols: [
          [{
            type: 'checkbox'
          }, {
            field: 'id',
            title: 'id',
            hide: true,
          }, {
            field: 'name',
            title: '名称',
            align: 'center',
            edit: 'text',
          }, {
            field: 'standard',
            title: '规格',
            edit: 'text',
          }, {
            field: 'c_prcie',
            title: '参考单价',
            align: 'center',
            edit: 'text',
          }, {
            field: 'used',
            title: '用量',
            align: 'center',
            edit: 'text',
          }, {
            field: 'price',
            title: '总金额',
            templet: function (d) {
              return parseInt(d.c_prcie * d.used);
            },
          }]
        ],
        done: function () {
          element.render();
        }
      });

      //用料多级联动
      form.on('select(cost_materialtype)', function (data) {
        $.ajax({
          type: 'POST',
          url: '/yes/order_product/getcostselect',
          data: {
            name: data.value
          },
          dataType: "json",
          success: function (data) {
            $('#standard').html($("<option>").val('').text('请选择规格'));
            $.each(data, function (key, val) {
              var option1 = $("<option>").val(val.price).text(val.standard);
              $("#standard").append(option1);
            });
            form.render('select');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

      //人工多级联动
      form.on('select(cost_labortype_form)', function (data) {
        $.ajax({
          type: 'POST',
          url: '/yes/order_product/getcostlaborselect',
          data: {
            type_id: data.value
          },
          dataType: "json",
          success: function (data) {
            $('#type_standard').html($("<option>").val('').text('请选择规格'));
            $.each(data, function (key, val) {
              var option1 = $("<option>").val(val.id).text(val.standard);
              $("#type_standard").append(option1);
            });
            form.render('select');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

      //用料头工具栏事件
      table.on('toolbar(cost_material_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event === 'del') {
          layer.confirm('确定删除么？', function (index) {
            layer.close(index);
            var checkdata = checkStatus.data;
            $.each(checkdata, function (index, elem) {
              cost_material.splice($.inArray(elem, cost_material), 1)
            })
            var material_cost = 0;
            $.each(cost_material, function (key, val) {
              material_cost += parseInt(val.c_prcie * val.used);
            });
            $('#material_cost').val(material_cost);
            $.ajax({
              type: 'POST',
              url: '/yes/order_product/updatacost',
              data: {
                id: product_id,
                material_config: cost_material,
                material_cost: material_cost,
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                //重载表格
                table.reload('cost_material', {
                  data: cost_material
                });
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        } else if (obj.event === 'add') {
          var name = $('#cost_materialtype').val();
          var standard = $('#standard').siblings('.layui-form-select').find('.layui-this').text();
          var c_price = $('#standard').val();
          if (name == '') {
            layer.msg('请选择类型');
          } else if (c_price == '') {
            layer.msg('请选择规格');
          } else {
            var addcost_material = {
              name: name,
              standard: standard,
              c_prcie: c_price,
              used: '0',
            };
            cost_material.push(addcost_material);
            var material_cost = 0;
            $.each(cost_material, function (key, val) {
              material_cost += parseInt(val.c_prcie * val.used);
            });
            $('#material_cost').val(material_cost);
            $.ajax({
              type: 'POST',
              url: '/yes/order_product/updatacost',
              data: {
                id: product_id,
                material_config: cost_material,
                material_cost: material_cost,
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                //重载表格
                table.reload('cost_material', {
                  data: cost_material
                });
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          }
        }
      });

      //用料
      table.on('edit(cost_material_lst)', function (obj) {
        cost_material = table.cache.cost_material;
        var material_cost = 0;
        $.each(cost_material, function (key, val) {
          material_cost += parseInt(val.c_prcie * val.used);
        });
        $('#material_cost').val(material_cost);
        $.ajax({
          type: 'POST',
          url: '/yes/order_product/updatacost',
          data: {
            id: product_id,
            material_config: cost_material,
            material_cost: material_cost,
          },
          dataType: "json",
          success: function (data) {
            layer.msg(data.msg);
            table.reload('cost_material', {
              data: cost_material
            });
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

    });