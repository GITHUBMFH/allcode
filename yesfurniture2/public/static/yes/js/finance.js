    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate', 'upload'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var laydate = layui.laydate;
      var upload = layui.upload;
      var finance_id;
      var lastDigits;
      //年选择器
      laydate.render({
        elem: '#finance_time',
      });
      laydate.render({
        elem: '#search_time',
        range: '至',
      });

      //进账列表
      table.render({
        elem: '#finance_lst',
        method: 'post',
        url: '/yes/finance/index',
        page: true,
        limit: 20,
        loading: true,
        toolbar: '#financetoolbar',
        id: 'finance',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            },
            {
              field: 'type',
              title: '类型',
              align: 'center',
              templet: function (d) {
                var name;
                if (d.type == 'client') {
                  name = '收款';
                } else {
                  name = '支付';
                }
                return name;
              }
            }, {
              field: 's_name',
              title: '简称',
              align: 'center',
            }, {
              field: 'price',
              title: '价格',
              align: 'center',
            }, {
              field: 'data',
              title: '日期',
              align: 'center',
            }, {
              field: 'method',
              title: '交易账户',
              align: 'center',
            }, {
              field: 'remark',
              title: '备注',
              align: 'center',
            }, {
              toolbar: '#financebar',
              title: '操作',
              align: 'center',
              width: '22%'
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      //收款记录表
      table.render({
        elem: '#finance_details_lst',
        method: 'post',
        loading: true,
        id: 'finance_details',
        toolbar: '#add_finance_details',
        totalRow: true,
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 's_name',
            title: '客户',
            align: 'center'
          }, {
            title: '生产单',
            align: 'center',
            templet: function (d) {
              return d.year + '-' + d.order_num;
            },
            totalRowText: "合计：",
          }, {
            field: 'receipt',
            title: '金额',
            align: 'center',
            totalRow: true,
          }, {
            field: 'remark',
            title: '备注',
            align: 'center'
          }, {
            toolbar: '#financedetailsbar',
            title: '操作',
            align: 'center',
            width: '14%'
          }]
        ],
        done: function () {
          element.render();
        }
      });

      //支付列表
      table.render({
        elem: '#payment_lst',
        method: 'post',
        loading: true,
        id: 'payment_id',
        totalRow: true,
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 's_name',
            title: '客户',
            align: 'center'
          }, {
            field: 'number',
            title: '订单号',
            align: 'center',
            totalRowText: "合计：",
          }, {
            field: 'price',
            title: '金额',
            align: 'center',
            totalRow: true,
          }, {
            field: 'data',
            title: '送货日期',
            align: 'center'
          }, {
            field: 'remark',
            title: '备注',
            align: 'center'
          }, {
            toolbar: '#payment_lstbar',
            title: '操作',
            align: 'center',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 联动
      form.on('select(select_type)', function (data) {
        gettpye(data.value, '#select_type');
      });

      // 联动
      form.on('select(select_type_tool)', function (data) {
        gettpye(data.value, '#select_type_tool');
      });

      // 获取商家
      function gettpye(value, option) {
        $.ajax({
          type: 'POST',
          url: '/yes/finance/gettype',
          data: {
            type: value
          },
          dataType: "json",
          success: function (data) {
            $(option).html($("<option>").val('').text('请选择商家'));
            $.each(data, function (key, val) {
              var option1 = $("<option>").val(val.id).text(val.s_name);
              $(option).append(option1);
            });
            form.render('select');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      }

      //监听工具条
      table.on('tool(finance_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除么？', function (index) {
            $.ajax({
              type: 'POST',
              url: '/yes/finance/delPost',
              data: {
                id: data.id
              },
              dataType: "json",
              success: function (data) {
                if (data.code > 0) {
                  obj.del();
                }
                layer.close(index);
                layer.msg(data.msg);
              },
              error: function (data) {
                layer.close(index);
                layer.msg(data.msg);
              }
            });
          });
        } else if (obj.event === 'edit') { //编辑生产单
          if (data.type == 'client') {
            layer.open({
              type: 1,
              title: false,
              closeBtn: 0,
              shadeClose: true,
              skin: 'yourclass',
              area: ['50%', '70%'],
              content: $('#finance_form'),
              success: function () {
                $('.edit_finance_form').show();
                $('.add_finance_form').hide();
              }
            });
            $('#select_type').html($("<option>").val(data.name_id).text(data.s_name));
            form.val("finance_form", {
              'id': data.id,
              "type": data.type,
              "name_id": data.name_id,
              "data": data.data,
              "remark": data.remark,
              "method": data.method,
              "price": data.price,
            })
          } else {
            layer.msg('支付不支持编辑');
          }
        } else if (obj.event === 'finance') {
          finance_id = data.id;
          if (data.type == 'client') {
            layer.open({
              type: 1,
              title: false,
              closeBtn: 0,
              shadeClose: true,
              area: ['80%', '80%'],
              content: $('#finance'),
              success: function () {
                table.reload('finance_details', {
                  url: '/yes/finance/financeLst',
                  where: {
                    id: data.id
                  }
                });
                $('.edit_finance_details_form').show();
                $('.add_finance_details_form').hide();
              }
            });
          } else if (data.type == 'supplier') {
            layer.open({
              type: 1,
              title: false,
              closeBtn: 0,
              shadeClose: true,
              area: ['80%', '80%'],
              content: $('#payment'),
              success: function () {
                table.reload('payment_id', {
                  url: '/yes/finance/payLst',
                  where: {
                    id: data.id
                  }
                });
              }
            });
          }
        } else if (obj.event === 'certificate') { //查看凭证
          lastDigits = data.id;
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            skin: 'yourclass',
            area: ['50%', '70%'],
            content: $('#certificate'),
            success: function () {
              // 情况图片
              $('#other_img').html('');
              //图片
              if (data.img_url[0] != '') {
                $.each(data.img_url, function (i, e) {
                  var imghtml = '<div class="lst_box"><img src="http://resource.yasfurniture.cn/' + e + '?imageView2/1/w/100/h/100/format/webp/q/75" class="layui-upload-img" style="width:100px;margin-right:10px" data-key=' + e + '><div class="show_cz"><a class="layui-btn layui-btn-xs layui-btn-normal show_big">大图</a><a class="layui-btn layui-btn-xs layui-btn-danger show_del">删除</a></div></div>';
                  $('#other_img').append(imghtml);

                })
              }
              imghover();

              //多图片上传
              upload.render({
                elem: '#otherimg',
                url: '/yes/finance/uploadmulimg',
                data: {
                  id: data.id,
                },
                accept: 'images',
                acceptMime: 'image/*',
                multiple: true,
                before: function (obj) {
                  layer.load(2);
                },
                done: function (res) {
                  //上传完毕
                  layer.closeAll('loading');
                  if (res.code == 0) {
                    $.each(res.data, function (e, v) {
                      $('#other_img').append('<div class="lst_box"><img src="http://resource.yasfurniture.cn/' + v + '?imageView2/1/w/100/h/100/format/webp/q/75" class="layui-upload-img" style="width:100px;margin-right:10px" data-key=' + v + '><div class="show_cz"><a class="layui-btn layui-btn-xs layui-btn-normal show_big">大图</a><a class="layui-btn layui-btn-xs layui-btn-danger show_del">删除</a></div></div>')
                    })
                  }
                  //图片操作
                  imghover();
                }
              });
            }
          });
        }
      });

      function imghover() {
        //多图片hover效果
        $('.lst_box img').hover(function () {
          $(this).siblings('.show_cz').stop().fadeIn();
          return false;
        })
        //多图片hover效果 
        $('.show_cz').hover(function () {
          return false;
        }, function () {
          $('.show_cz').stop().fadeOut();
          return false;
        })

        $('.show_big').on('click', function () {
          var img = $(this).parents('.lst_box').find('img').attr('src');
          var imgulr = img.substring(0, img.indexOf('?') + 1);
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
            content: '<div style="text-align:center"><img style="width:100%" src=' + imgulr + '/></div>'
          });
        })

        // 多图片删除
        $('#other_img .lst_box .show_cz .show_del').unbind("click").on('click', function () {
          var key = $(this).parents('.lst_box').find('img').attr('data-key');
          layer.load(2);
          var _this = $(this);
          $.ajax({
            type: 'POST', //请求类型
            url: '/yes/finance/delmulimgPost', //URL
            data: {
              id: lastDigits,
              key: key
            },
            dataType: "json", //返回的数据类型
            success: function (data) {
              layer.msg(data.msg);
              layer.closeAll('loading');
              if (data.code = '0') {
                _this.parents('.lst_box').remove();
              }
            },
            error: function (data) {
              layer.msg(data.msg);
            }
          });
          return false;
        })
      }
      //监听支付删除
      table.on('tool(payment_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除么？', function (index) {
            $.ajax({
              type: 'POST',
              url: '/yes/finance/delpayLst',
              data: {
                id: data.id
              },
              dataType: "json",
              success: function (data) {
                if (data.code > 0) {
                  obj.del();
                }
                layer.close(index);
                layer.msg(data.msg);
              },
              error: function (data) {
                layer.close(index);
                layer.msg(data.msg);
              }
            });
          });
        }
      });

      // 监听头部工具栏
      table.on('toolbar(finance_lst)', function (obj) {
        if (obj.event === 'add_finance') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['50%', '70%'],
            content: $('#finance_form'),
            success: function (layero, index) {
              $('.edit_finance_form').hide();
              $('.add_finance_form').show();
            }
          });
          $('.fromreset').trigger('click');
          $('#select_type').val('').text('请选择商家');
        }
      });

      // 监听进账添加
      form.on('submit(add_finance_form)', function (data) {
        var data = data.field;
        delete data.id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/finance/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
            table.reload('finance');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
        return false;
      });

      // 进账编辑
      form.on('submit(edit_finance_form)', function (data) {
        var data = data.field;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/finance/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
            table.reload('finance');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
        return false;
      });


      // 监听收款头部工具栏
      table.on('toolbar(finance_details_lst)', function (obj) {
        if (obj.event === 'add_finance_details') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['50%', '80%'],
            content: $('#finance_details_form'),
            success: function (layero, index) {
              $('.edit_finance_details_form').hide();
              $('.add_finance_details_form').show();
            }
          });
          $('.fromreset').trigger('click');
          $('#produce_num_form').html($("<option>").val('').text('请选择生产单'));
          $('#produce_product_form').html($("<option>").val('').text('请选择产品序号'));
        }
      });

      // 监听收款添加
      form.on('submit(add_finance_details_form)', function (data) {
        var data = data.field;
        delete data.id;
        delete data.year;
        delete data.client_id;
        data.finance_id = finance_id;
        data.order_id = data.num;
        delete data.num;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/finance/addFinanceLst', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.close(layer.index);
            layer.msg(data.msg);
            table.reload('finance_details');
          },
          error: function (data) {
            layer.close(layer.index);
            layer.msg(data.msg);
          }
        });
        return false;
      });

      // 收款编辑
      form.on('submit(edit_finance_details_form)', function (data) {
        var data = data.field;
        delete data.year;
        delete data.client_id;
        data.order_id = data.num;
        delete data.num;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/finance/editFinanceLst', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.close(layer.index);
            layer.msg(data.msg);
            table.reload('finance_details');
          },
          error: function (data) {
            layer.close(layer.index);
            layer.msg(data.msg);
          }
        });
        return false;
      });

      //监听收款工具条
      table.on('tool(finance_details_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除么？', function (index) {
            $.ajax({
              type: 'POST',
              url: '/yes/finance/delFinanceLst',
              data: {
                id: data.id
              },
              dataType: "json",
              success: function (data) {
                if (data.code > 0) {
                  obj.del();
                }
                layer.close(index);
                layer.msg(data.msg);
              },
              error: function (data) {
                layer.close(index);
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
            area: ['50%', '80%'],
            content: $('#finance_details_form'),
            success: function (layero, index) {
              $('.edit_finance_details_form').show();
              $('.add_finance_details_form').hide();
            }
          });
          $('#produce_num_form').html($("<option>").val(data.order_id).text(data.order_num));
          form.val("finance_details_form", {
            'id': data.id,
            "year": data.year,
            "client_id": data.client_id,
            "receipt": data.receipt,
            "remark": data.remark,
            "order_id": data.order_id,
          })
        }
      });

      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        if (data.time != '') {
          var time = data.time.split('至');
          data.starttime = time[0].trim();
          data.endtime = time[1].trim();
        } else {
          data.starttime = '';
          data.endtime = '';
        }
        delete data.time;
        table.reload('finance', {
          url: '/yes/finance/searchlst',
          where: data,
        });
        return false;
      });
    });