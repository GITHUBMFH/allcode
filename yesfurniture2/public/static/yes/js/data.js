    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var laydate = layui.laydate;

      var order_id;

      laydate.render({
        elem: '#search_time1',
        range: '至',
      });

      laydate.render({
        elem: '#finance_time',
      });

      //生产单列表
      table.render({
        elem: '#order_lst',
        method: 'post',
        url: '/yes/data/order',
        limit: 50,
        page: true,
        limits: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500],
        loading: true,
        toolbar: '#recordtoolbar',
        id: 'order',
        cols: [
          [{
              type: 'checkbox',
            }, {
              field: 'id',
              title: 'ID',
              hide: true
            },
            {
              field: 's_name',
              title: '客户',
              align: 'center',
            }, {
              field: 'project',
              title: '工程名字',
              align: 'center'
            }, {
              field: 'year',
              title: '生产单号',
              align: 'center',
              templet: function (d) {
                return d.year + '-' + d.num;
              }
            }, {
              field: 'productprice',
              title: '产品金额',
              align: 'center',
              width: '10%',
              totalRow: true,
            }, {
              field: 'price',
              title: '应收金额',
              align: 'center',
              edit: 'text',
              width: '10%',
              templet: function (d) {
                if (d.productprice > d.price) {
                  if (d.price == null) {
                    return '';
                  } else {
                    return '<span style="color:red;">' + d.price + '</span>';
                  }
                } else {
                  if (d.price == null) {
                    return '';
                  } else {
                    return d.price;
                  }
                }
              },
              totalRow: true,
            }, {
              field: 'receipt',
              title: '已收款',
              align: 'center',
              totalRow: true,
            }, {
              title: '剩余收款',
              align: 'center',
              templet: function (d) {
                return d.price - d.receipt;
              },
              totalRow: true,
            }, {
              field: 'pro_progress',
              title: '生产进度',
              templet: '#pro_progress',
            }, {
              field: 'ship_progress',
              title: '出货进度',
              templet: '#ship_progress',
            }, {
              field: 'remark',
              title: '备注',
              align: 'center',
              edit: 'text'
            }, {
              toolbar: '#orderbar',
              title: '操作',
              align: 'center',
              width: '18%'
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });


      table.on('toolbar(order_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);

        if (obj.event === 'get_amount') {
          var num = 0;
          var checkdata = checkStatus.data;
          $.each(checkdata, function (index, elem) {
            if (elem.receipt == 'null') {
              elem.receipt = '0';
            }
            if (elem.price == 'null') {
              elem.price = '0';
            }
          })
          console.log(checkdata);
          console.log(checkdata.length);
          if (checkdata.length > 0) {
            $.each(checkdata, function (index, elem) {
              formatNum(num += parseFloat(elem.price - elem.receipt), 1)
            })
            layer.alert(num, {
              title: '求和',
              // icon: 6,
              closeBtn: 0,
              shadeClose: true,
              btn: null
            })
          } else {
            layer.msg('请选择订单');
          }
        }
      })

      formatNum = function (f, digit) {
        var m = Math.pow(10, digit);
        return parseInt(f * m, 10) / m;
      }

      //产品列表
      table.render({
        elem: '#product_lst',
        method: 'post',
        limit: 15,
        page: true,
        loading: true,
        id: 'product',
        totalRow: true,
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'img',
            title: '图片',
            align: 'center',
            templet: function (d) {
              if (d.img == '') {
                var html = d.img;
              } else {
                var html = '<img class="layui-upload-img" src="http://resource.yasfurniture.cn/' + d.img + '?imageView2/1/w/50/h/50/q/75|imageslim">';
              }
              return html;
            }
          }, {
            field: 'pro_num',
            title: '序号',
            align: 'center'
          }, {
            field: 'pro_name',
            title: '名称',
            align: 'center',
          }, {
            field: 'amount',
            title: '数量',
            align: 'center'
          }, {
            field: 'product_num',
            align: 'center',
            title: '生产',
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
            width: '6%',
            templet: function (d) {
              if (d.shipment_num > d.amount) {
                return '<span style="color:red;">' + d.shipment_num + '</span>'
              } else {
                return d.shipment_num;
              }
            }
          }, {
            field: 'labor_cost',
            title: '人工费用',
            align: 'center'
          }, {
            field: 'material_cost',
            title: '材料费用',
            align: 'center'
          }, {
            field: 'a_price',
            title: '记录费用',
            align: 'center'
          }, {
            field: 'price',
            title: '价格',
            align: 'center',
            edit: 'text',
            totalRowText: '合计:'
          }, {
            field: 'money',
            title: '总金额',
            align: 'center',
            totalRow: true,
          }, {
            title: '预计利润',
            templet: function (d) {
              return (d.price - d.labor_cost - d.material_cost) * d.amount
            },
            totalRow: true,
          }]
        ],
        done: function () {
          element.render();
          var profit = 0;
          $('#product .layui-table-body tbody tr').each(function () {
            var amount = $(this).find('td').eq(11).find('.layui-table-cell').text();
            profit = profit + parseFloat(amount);

          })
          if (isNaN(profit)) {
            profit = 0;
          }
          $('#product .layui-table-total table tr td').eq(11).find('.layui-table-cell').text(profit);
          $('#product .add_material .layui-table-view .layui-table-box .layui-table-body .layui-table tbody tr td .layui-table-cell').css({
            height: "50px",
            'line-height': "50px",
          });
        }
      });

      //收款记录表
      table.render({
        elem: '#finance_lst',
        method: 'post',
        loading: true,
        id: 'finance',
        totalRow: true,
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'receipt',
            title: '金额',
            align: 'center',
            totalRow: true,
          }, {
            field: 'data',
            title: '收款日期',
            align: 'center',
            totalRowText: '合计'
          }, {
            field: 'method',
            title: '收款方式',
            align: 'center'
          }, {
            field: 'remark',
            title: '备注',
            align: 'center'
          }]
        ],
        done: function () {
          element.render();
        }
      });


      //监听生产单编辑
      table.on('edit(order_lst)', function (obj) {
        var data = obj.data
        $.ajax({
          type: 'POST',
          url: '/yes/data/changprice',
          data: data,
          dataType: "json",
          success: function (data) {
            layer.msg(data.msg);
            table.reload('order');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

      //监听产品编辑
      table.on('edit(product_lst)', function (obj) {
        var data = obj.data;
        $.ajax({
          type: 'POST',
          url: '/yes/data/productprice',
          data: data,
          dataType: "json",
          success: function (data) {
            table.reload('product');
            layer.msg(data.msg);
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

      //监听工具条
      table.on('tool(order_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'finance') { //删除生产单
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['80%', '60%'],
            content: $('#finance'),
            success: function () {
              table.reload('finance', {
                url: '/yes/data/finance',
                where: {
                  id: data.id
                }
              });
            }
          });
        } else
        if (obj.event === 'product') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['90%', '80%'],
            content: $('#product'),
            success: function () {
              table.reload('product', {
                url: '/yes/data/product',
                where: {
                  id: data.id
                }
              });
            }
          });
        } else if (obj.event === 'add_finance') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['60%', '70%'],
            content: $('#add_finance_form'),
            success: function () {
              $('.edit_finance_form').hide();
              $('.add_finance_form').show();
            }
          });
          $('.fromreset').trigger('click');
          order_id = data.id;
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
        table.reload('order', {
          url: '/yes/data/orderSearchlst',
          where: data,
          totalRow: true,
          page: {
            curr: 1
          },
          done: function () {
            element.render();
            var wage = $('.layui-table-total table tr td').eq(6).find('.layui-table-cell').text();
            var borrow = $('.layui-table-total table tr td').eq(7).find('.layui-table-cell').text();
            $('.layui-table-total table tr td').eq(8).find('.layui-table-cell').text(wage - borrow);
            // delete this.where;
          }
        });
        return false;
      });

    });