    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var laydate = layui.laydate;

      laydate.render({
        elem: '#match_month',
        type: 'month',
      });

      laydate.render({
        elem: '#search_time1',
        type: 'month',
      });
      //列表
      table.render({
        elem: '#match_lst',
        method: 'post',
        url: '/yes/match/index',
        page: true,
        limit: 20,
        loading: true,
        toolbar: '#matchtoolbar',
        id: 'match',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            },
            {
              field: 'name',
              title: '姓名',
              align: 'center'
            }, {
              field: 'month',
              title: '月份',
              align: 'center'
            }, {
              field: 's_name',
              title: '客户',
              align: 'center'
            }, {
              field: 'order',
              title: '生产产品',
              align: 'center',
              width:'28%',
              templet: function (d) {
                return 'YS' + d.order_year + d.order_num + '-' + d.pro_num;
              }
            }, {
              field: 'num',
              title: '数量',
              align: 'center'
            }, {
              field: 'price',
              title: '单价',
              align: 'center'
            }, {
              field: 'amount',
              title: '总金额',
              align: 'center',
            }, {
              toolbar: '#matchbar',
              title: '操作',
              align: 'center'
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      // 监听头部工具栏
      // table.on('toolbar(match_lst)', function (obj) {
      //   if (obj.event === 'add_match') {
      //     layer.open({
      //       type: 1,
      //       title: false,
      //       closeBtn: 0,
      //       shadeClose: true,
      //       area: ['50%', '90%'],
      //       content: $('#add_match'),
      //       success: function (layero, index) {
      //         $('.edit_match_form').hide();
      //         $('.add_match_form').show();
      //       }
      //     });
      //     $('.fromreset').trigger("click");
      //     $('#produce_num_form').html($("<option>").val('').text('请选择生产单'));
      //     $('#produce_product_form').html($("<option>").val('').text('请选择产品序号'));
      //     // $('#add_worker_name').html($("<option>").val('').text('请选择姓名'));
      //   }
      // });

      // 获取参考价格
      form.on('select(price_form)', function () {
        var data = {};
        data.worker_id = $('#add_worker_id').val();
        data.product_id = $('#produce_product_form').val();
        if (data.worker_id !== "" && data.product_id !== "") {
          $.ajax({
            type: 'POST',
            url: '/yes/match/getprice',
            data: data,
            dataType: "json",
            success: function (data) {
              $('#product_price').val(data);
            },
            error: function (data) {
              layer.msg(data.msg);
            }
          });
        }
      });

      //监听输入框数据变化
      $('#product_num').on('change', function () {
        var product_num = $('#product_num').val();
        var product_price = $('#product_price').val();
        $('#product_amount').val(product_num * product_price);
      })
      //监听输入框数据变化
      $('#product_price').on('change', function () {
        var product_num = $('#product_num').val();
        var product_price = $('#product_price').val();
        $('#product_amount').val(product_num * product_price);
      })

      //监听工具条
      table.on('tool(match_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除么？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/match/delPost',
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
            area: ['50%', '90%'],
            content: $('#add_match'),
            success: function () {
              $('.edit_match_form').show();
              $('.add_match_form').hide();
            }
          });
          $('#produce_num_form').html($("<option>").val(data.order_id).text(data.order_num));
          $('#produce_product_form').html($("<option>").val(data.product_id).text(data.pro_num));
          $('#add_worker_name').html($("<option>").val(data.worker_id).text(data.worker_name));
          form.val("match_form", {
            'id': data.id,
            "amount": data.amount,
            "name": data.name,
            "num": data.num,
            "c_price": data.price,
            "client_id": data.client_id,
            "month": data.year + '-' + data.month,
            "year": data.order_year,
            "worker_id": data.worker_id,
            "order_id": data.order_id,
            "product_id": data.product_id,
            "work_id": data.work_id,
          })
        }
      });

      // 添加对单
      // form.on('submit(add_match_form)', function (data) {
      //   var data = data.field;
      //   delete data.id;
      //   delete data.c_price;
      //   delete data.client_id;
      //   delete data.work_id;
      //   delete data.order_id;
      //   var time = data.month.split('-');
      //   data.year = time[0];
      //   data.month = time[1].replace(/\b(0+)/gi, "");
      //   $.ajax({
      //     type: 'POST', //请求类型
      //     url: '/yes/match/addPost', //URL
      //     data: data, //传递的参数
      //     dataType: "json", //返回的数据类型
      //     success: function (data) {
      //       layer.closeAll('page');
      //       layer.msg(data.msg);
      //     },
      //     error: function (data) {
      //       layer.msg(data.msg);
      //     }
      //   });
      // });

      // 编辑对单
      form.on('submit(edit_match_form)', function (data) {
        var data = data.field;
        delete data.c_price;
        delete data.client_id;
        delete data.work_id;
        delete data.order_id;
        var time = data.month.split('-');
        data.year = time[0];
        data.month = time[1].replace(/\b(0+)/gi, "");
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/match/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
            table.reload('match');
          },
          error: function (data) {
            layer.closeAll('page');
            table.reload('match');
            layer.msg(data.msg);
          }
        });
        return false;
      });

      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        var time = data.time.split('-');
        if (time != '') {
          data.year = time[0];
          data.month = time[1].replace(/\b(0+)/gi, "");
        } else {
          data.m_year = '';
          data.month = '';
        }
        delete data.time;
        delete data.c_price;
        delete data.num;
        delete data.amount;
        table.reload('match', {
          url: '/yes/match/searchlst',
          where: data,
        });
        return false;
      });


      //添加时监听价格变化
      form.on('select(ad_price_form)', function () {
        var data = {};
        data.worker_id = $('#ad_worker_id').val();
        data.product_id = $('#spare_product_form').val();
        if (data.worker_id !== "" && data.product_id !== "") {
          $.ajax({
            type: 'POST',
            url: '/yes/match/getprice',
            data: data,
            dataType: "json",
            success: function (data) {
              $('#ad_product_price').val(data);
            },
            error: function (data) {
              layer.msg(data.msg);
            }
          });
        }
      });

      //监听输入框数据变化
      $('#ad_product_num').on('change', function () {
        var product_num = $('#ad_product_num').val();
        var product_price = $('#ad_product_price').val();
        $('#ad_product_amount').val(product_num * product_price);
      })
      //监听输入框数据变化
      $('#ad_product_price').on('change', function () {
        var product_num = $('#ad_product_num').val();
        var product_price = $('#ad_product_price').val();
        $('#ad_product_amount').val(product_num * product_price);
      })

      // 添加对单
      form.on('submit(add_lst_from)', function (data) {
        var data = data.field;
        delete data.id;
        delete data.c_price;
        delete data.client_id;
        delete data.work_id;
        delete data.order_id;
        if(data.time == ''){
          layer.msg('请选择时间');
          return false;
        }else if(data.num==''){
          layer.msg('请输入数量');
          return false;
        }else if(data.product_id ==''){
          layer.msg('请选择产品');
          return false;
        }else if(data.worker_id==''){
          layer.msg('请选择员工');
          return false;
        }
        var time = data.time.split('-');
        delete data.time;
        data.year = time[0];
        data.month = time[1].replace(/\b(0+)/gi, "");
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/match/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
            table.reload('match');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
        return false;
      });

    });