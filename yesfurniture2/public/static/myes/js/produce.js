    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;

      //数据表单实例
      table.render({
        elem: '#produce_lst',
        method: 'post',
        url: '/yes/produce/searchlst',
        loading: true,
        page: {
          hash: true,
          layout: ['prev', 'page', 'next', 'count'],
        },
        limit: 20,
        id: 'idproduce',
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'year',
            title: '生产单',
            align: 'center',
            width: '40%',
            fixed: 'left',
            templet: function (d) {
              return d.year + '-' + d.num + '-' + d.pro_num;
            }
          }, {
            field: 'client_name',
            title: '客户',
            align: 'center',
            width: '30%',
          }, {
            field: 'product_num',
            title: '数量',
            align: 'center'
          }, {
            field: 'product_data',
            title: '生产日期',
            align: 'center',
            width: '34%',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 点击跳转
      table.on('row(produce_lst)', function (obj) {
        var data = obj.data;
        var url = '/myes/index/addproduce' + '/id/' + data.id;
        $(window).attr('location', url);
      });

      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        table.reload('idproduce', {
          url: '/yes/produce/searchlst',
          where: data,
          done: function () {
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
          area: ['70%', '70%'],
          content: $('#getserach'),
        });
      })

    });