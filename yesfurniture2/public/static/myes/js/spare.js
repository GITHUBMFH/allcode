    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;

      //数据表单实例
      table.render({
        elem: '#spare_lst',
        method: 'post',
        url: '/yes/spare/searchlst',
        page: {
          hash: true,
          layout: ['prev', 'page', 'next', 'count'],
        },
        limit:50,
        loading: true,
        id: 'idspare',
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'order',
            title: '用途',
            align: 'center',
            width: '36%',
            templet: function (d) {
              if (d.product_id == '1') {
                return '日常采购';
              } else {
                return d.year + '-' + d.num + '-' + d.pro_num;
              }
            },
            fixed:'left'
          }, {
            field: 'type',
            title: '类型',
            align: 'center',
          }, {
            field: 'name',
            title: '名称',
            align: 'center',
            width: '40%',
          }, {
            field: 'size',
            title: '规格',
            align: 'center',
            width: '30%',
          }, {
            field: 'used',
            title: '用量',
            align: 'center',
            width: '30%',
          }, {
            field: 'details',
            title: '描述',
            align: 'center',
            width: '30%',
          }, {
            field: 'create_time',
            title: '创建时间',
            align: 'center',
            width: '34%',
          }, {
            field: 'who',
            title: '提交人',
            align: 'center',
            width: '34%',
          }, {
            field: 'person',
            title: '处理人',
            align: 'center',
            width: '34%',
          },{
            field: 'state',
            title: '状态',
            align: 'center',
            templet: '#state',
            width: '24%',
            fixed:'right'
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 点击跳转
      table.on('row(spare_lst)', function (obj) {
        var data = obj.data;
        var url = '/myes/index/spareid'+ '/id/' + data.id;
        // $(window).attr('location',url);
        window.open(url, "_blank", "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");
      });

      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        delete data.time;
        if (data.year == '1') {
          data.product_id = 1;
        }
        delete data.year;
        table.reload('idspare', {
          url: '/yes/spare/searchlst',
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