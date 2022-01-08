    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;

      //第一个实例
      table.render({
        elem: '#order_lst',
        method: 'post',
        url: '/yes/order/index',
        page: {
          hash: true,
          layout: ['prev', 'page', 'next', 'count'],
        },
        limit: 20,
        loading: true,
        id: 'order',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            },{
              field: 's_name',
              title: '客户',
              templet: function (d) {
                return d.client.s_name;
              },
              align: 'center',
              width: '30%',
              fixed:'left',
            }, {
              field: 'year',
              title: '生产年份',
              templet: function (d) {
                return d.year + '-' + d.num;
              },
              align: 'center',
              width: '30%',
            },{
              field: 'project',
              title: '工程名称',
              align: 'center',
              width: '50%',
            }, {
              field: 'pro_progress',
              title: '生产进度',
              templet: '#pro_progress',
              align: 'center',
              width: '30%',
            }, {
              field: 'ship_progress',
              title: '出货进度',
              templet: '#ship_progress',
              align: 'center',
              width: '30%',
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      // 行点击跳转
      table.on('row(order_lst)', function (obj) {
        var data = obj.data;
        var time = data.order_time;
        var ordernum = 'YS' + time.replace('-', '').replace('-', '') + '-' + data.num;
        var url = '/myes/index/orderproduct'+ '/' + data.id + '/' + ordernum;
        // $(window).attr('location',url);
        window.open(url, "_blank", "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");
      });

      // 添加生产单提交弹框
      $('#add_order').on('click', function () {
        layer.open({
          type: 1,
          title: false,
          closeBtn: 0,
          shadeClose: true,
          area: ['70%', '70%'],
          content: $('#order_form')
        });
        $('.fromreset').trigger('click');
        $('.edit_order_form').hide();
        $('.add_order_form').show();
      })

      // 添加生产单
      form.on('submit(add_order_form)', function (data) {
        var data = data.field;
        data.client_id = data.s_name;
        delete data.id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/order/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
        // return false;
      });


      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        delete data.time;
        table.reload('order', {
          url: '/yes/order/searchlst',
          where: data,
          done:function(){
            element.render();
            layer.close(layer.index);
          }
        });
        return false;
      });

      $('#getserachbox').on('click', function () {
        layer.open({
          type: 1,
          title: ['佛山市亚世家具有限公司', 'text-align: center;padding:0px'],
          closeBtn: 0,
          shadeClose: true,
          anim: 0,
          scrollbar: false,
          area: ['70%','70%'],
          content: $('#getserach'),
        });
      })

    });