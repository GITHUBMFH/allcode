    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var laydate = layui.laydate;

      var getinformation = parent.layui.$('#getinformation').val();

      laydate.render({
        elem: '#search_time1',
        range: '至',
      });
      //数据表单实例
      table.render({
        elem: '#recordsearch_lst',
        method: 'post',
        url: '/yes/record/search',
        loading: true,
        id: 'idrecordsearch',
        page: true,
        limit: 20,
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 's_name',
            title: '类型',
            align: 'center',
          }, {
            field: 'number',
            title: '订单号',
            align: 'center',
            templet: function (d) {
              if (d.number != '') {
                return d.number;
              } else {
                return '暂无';
              }
            }
          }, {
            field: 'state',
            title: '状态',
            align: 'center',
            templet: function (d) {
              switch (d.state) {
                case '1':
                  return '<a class="layui-btn layui-btn-danger layui-btn-xs">未结现金</a>'
                  break;
                case '2':
                  return '<a class="layui-btn layui-btn-danger layui-btn-xs">未对账</a>'
                  break;
                case '3':
                  return '<a class="layui-btn layui-btn-xs">已对帐</a>'
                  break;
                case '4':
                  return '<a class="layui-btn layui-btn-normal layui-btn-xs">月结结清</a>'
                  break;
                case '5':
                  return '<a class="layui-btn layui-btn-normal layui-btn-xs">现金结清</a>'
                  break;
              }
            }
          }, {
            field: 'data',
            title: '时间',
            align: 'center',
            width: '10%'
          }, {
            field: 'type_name',
            title: '类型',
            align: 'center',
          }, {
            field: 'name',
            title: '名称',
            align: 'center',
            edit: 'text',
          }, 
          // {
          //   field: 'num',
          //   title: '数量',
          //   align: 'center',
          //   templet: function (d) {
          //     return d.num + d.unit
          //   }
          // },
        {
            field: 'oneprice',
            title: '单价',
            align: 'center',
            sort: true,
          }, 
          // {
          //   field: 'price',
          //   title: '总金额',
          //   align: 'center',
          //   sort: true,
          // }, 
          {
            field: 'size',
            title: '规格',
            align: 'center',
          }, {
            field: 'product_id',
            title: '用途',
            align: 'center',
            width: '12%',
            templet: function (d) {
              if (d.order_num > 0) {
                if (d.pro_num > 0) {
                  return 'YS' + d.year + '-' + d.order_num + '-' + d.pro_num;
                }else{
                  return 'YS' + d.year+ '-' + d.order_num;
                }
              } else {
                return '暂无';
              }
            }
          }]
        ],
        done: function (res) {
          element.render();
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
        table.reload('idrecordsearch', {
          url: '/yes/record/recordsearch',
          where: data,
        });
        return false;
      });

      table.on('edit(recordsearch_lst)', function (obj) {
        var data = obj.data;
        // console.log(data);
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/record_details/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.msg(data.msg);
          },
        });
      });

    });