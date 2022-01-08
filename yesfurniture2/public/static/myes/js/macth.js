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
        url: '/myes/login/macthsearchlst',
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
          }, {
            toolbar: '#clickimg',
            field: 'img',
            title: '图片',
            width: '35%',
            align: 'center',
            // fixed: 'left',
          }, {
            field: 'num',
            title: '数量',
            align: 'center',
            templet: function (d) {
              return "<span style='color: #2F9688;'>" + d.num + "</span>"
            },
          }, {
            field: 'order_year',
            title: '生产单',
            templet: function (d) {
              return d.order_year + '-' + d.order_num;
            },
            width: '28%',
            align: 'center',
          }, {
            field: 'pro_num',
            title: '序号',
            align: 'center',
            width: '65%',
          }, {
            field: 'year',
            width: '30%',
            title: '时间',
            align: 'center',
            templet: function (d) {
              return d.year + '年' + d.month + '月';
            },
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 计件搜索
      form.on('submit(search_lst_from2)', function (data) {
        var data = data.field;
        data.m_year = data.time.substring(0, 4)
        data.month = data.time.substring(4, 6).replace(/\b(0+)/gi, "")
        delete data.time;
        table.reload('order', {
          url: '/myes/login/macthsearchlst',
          where: data,
          done: function () {
            element.render();
            layer.close(layer.index);
          }
        });
        return false;
      });
      //计件弹框 
      $('#getserachbox2').on('click', function () {
        layer.open({
          type: 1,
          title: ['佛山市亚世家具有限公司', 'text-align: center;padding:0px'],
          closeBtn: 0,
          shadeClose: true,
          anim: 0,
          scrollbar: false,
          area: ['70%', '50%'],
          content: $('#getserach2'),
        });
      })

      // 计件任务切换
      $('#changge').on('click', function () {
        $('#alltask').toggle();
        $('#allmatch').toggle();
        $('#getserachbox2').toggle();
        $('#getserachbox').toggle();
        var html = $(this).text();
        if (html == '计件') {
          $(this).html('任务')
        } else {
          $(this).html('计件')
        }
      })

      // 任务列表
      table.render({
        elem: '#task_lst',
        url: '/myes/login/tasksearchlst',
        method: 'post',
        page: {
          hash: true,
          layout: ['prev', 'page', 'next', 'count'],
        },
        limit: 20,
        loading: true,
        id: 'task',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            }, {
              toolbar: '#clickimg',
              field: 'img',
              title: '图片',
              width: '35%',
              align: 'center',
              fixed: 'left',
            }, {
              field: 'num',
              title: '数量',
              align: 'center',
              templet: function (d) {
                return "<span lay-event='open' style='color: #dc1414;'>" + d.num + "</span>"
              },
            }, {
              field: 'order_year',
              title: '生产单',
              templet: function (d) {
                return "<span lay-event='open'>" + d.order_year + '-' + d.order_num + "</span>"
              },
              width: '28%',
              align: 'center',
            }, {
              field: 'pro_num',
              title: '序号',
              width: '65%',
              align: 'center',
              templet: function (d) {
                return "<span lay-event='open'>" + d.pro_num + "</span>"
              },
            },
            // {
            //   field: 'name',
            //   title: '姓名',
            //   align: 'center',
            //   width: '28%',
            // }, {
            //   field: 'work_name',
            //   title: '工种',
            //   align: 'center',
            //   width: '28%',
            // }, 
            {
              field: 'date',
              width: '35%',
              title: '时间',
              align: 'center',
              templet: function (d) {
                return "<span lay-event='open'>" + d.date + "</span>"
              },
            }, {
              field: 'state',
              title: '状态',
              align: 'center',
              width: '23%',
              templet: function (d) {
                if (d.state == '1') {
                  return '<button class="layui-btn layui-btn-xs">已完成</button>';
                } else {
                  return '<button class="layui-btn layui-btn-xs layui-btn-danger">未完成</button>';
                }
              }
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      // 任务搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        table.reload('task', {
          url: '/myes/login/tasksearchlst',
          where: data,
          done: function () {
            element.render();
            layer.close(layer.index);
          }
        });
        return false;
      });

      // 任务弹出搜索框
      $('#getserachbox').on('click', function () {
        layer.open({
          type: 1,
          title: ['佛山市亚世家具有限公司', 'text-align: center;padding:0px'],
          closeBtn: 0,
          shadeClose: true,
          anim: 0,
          scrollbar: false,
          area: ['70%', '45%'],
          content: $('#getserach'),
        });
      });

      table.on('tool(task_lst)', function (obj) {
        var data = obj.data;
        product_id = data.id;
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
          var url = '/myes/login/product/id/' + data.product_id;
          window.open(url, "_blank", "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");
        }
      })

      table.on('tool(order_lst)', function (obj) {
        var data = obj.data;
        product_id = data.id;
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
        }
      })
    });