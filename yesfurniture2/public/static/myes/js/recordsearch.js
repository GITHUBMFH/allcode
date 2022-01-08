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
        url: '/myes/index/record',
        loading: true,
        id: 'idrecordsearch',
        page: {
          hash: true,
          layout: ['prev', 'page', 'next', 'count'],
        },
        limit:20,
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 's_name',
            title: '供应商',
            align: 'center',
            fixed:'left',
            width: '28%',
          }
          // , {
          //   field: 'type_name',
          //   title: '类型',
          //   align: 'center',
          //   width: '30%',
          // }
          , {
            field: 'name',
            title: '名称',
            align: 'center',
            width: '60%',
          }, {
            field: 'oneprice',
            title: '单价',
            align: 'center',
          }, {
            field: 'unit',
            title: '单位',
            align: 'center',
            width: '30%',
          }, {
            field: 'size',
            title: '规格',
            align: 'center',
            width: '30%',
          }]
        ],
        done: function (res) {
          element.render();
        }
      });

      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        table.reload('idrecordsearch', {
          url: '/myes/index/recordsearch',
          where: data,
          done:function(){
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