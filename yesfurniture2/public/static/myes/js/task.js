    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;

      // 未完成任务列表
      // table.render({
      //   elem: '#task_lst',
      //   // url: '/yes/task/tasksearchlst',
      //   method: 'post',
      //   page: {
      //     hash: true,
      //     layout: ['prev', 'page', 'next', 'count'],
      //   },
      //   limit: 20,
      //   loading: true,
      //   id: 'task',
      //   toolbar: '#deltaskall',
      //   cols: [
      //     [{
      //       field: 'id',
      //       title: 'ID',
      //       hide: true
      //     }, {
      //       type: 'checkbox',
      //       title: '排序',
      //       fixed: 'left',
      //     }, {
      //       field: 'order_year',
      //       title: '生产单',
      //       templet: function (d) {
      //         return "<span lay-event='open'>" + d.order_year + '-' + d.order_num + '-' + d.pro_num + "</span>"
      //       },
      //       width: '50%',
      //       align: 'center',
      //     }, {
      //       toolbar: '#clickimg',
      //       field: 'img',
      //       title: '图片',
      //       width: '35%',
      //       align: 'center',
      //       edit: 'text',
      //     }, {
      //       field: 'num',
      //       title: '下发',
      //       align: 'center',
      //       edit: 'text'
      //     }, {
      //       field: 'match',
      //       title: '完成',
      //       align: 'center',
      //       templet: function (d) {
      //         if (d.amount - d.match < 0) {
      //           return "<span style='color:red' lay-event='match'>" + d.match + "</span>"
      //         } else {
      //           return "<span lay-event='match'>" + d.match + "</span>"
      //         }
      //       }
      //     }, {
      //       field: 'amount',
      //       title: '总数',
      //       align: 'center',
      //     }, {
      //       field: 'name',
      //       title: '姓名',
      //       align: 'center',
      //       width: '28%',
      //     }, {
      //       field: 'date',
      //       width: '35%',
      //       title: '时间',
      //       align: 'center'
      //     }, {
      //       field: 'state',
      //       title: '状态',
      //       align: 'center',
      //       width: '23%',
      //       templet: function (d) {
      //         if (d.state == '1') {
      //           return '<button class="layui-btn layui-btn-xs">已完成</button>';
      //         } else {
      //           return '<button class="layui-btn layui-btn-xs layui-btn-danger">未完成</button>';
      //         }
      //       }
      //     }]
      //   ],
      //   done: function () {
      //     element.render();
      //   }
      // });

      table.render({
        elem: '#match_lst',
        method: 'post',
        loading: true,
        id: 'match',
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'num',
            title: '数量',
            align: 'center',
            edit: 'text'
          }, {
            field: 'date',
            title: '时间',
            align: 'center'
          }, {
            toolbar: '#taskbar',
            title: '操作',
            width: '20%',
            align: 'center'
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 编辑下发数量
      table.on('edit(task_lst)', function (obj) {
        var old = $(this).prev().text(); //旧值
        layer.msg('确定修改？', {
          time: 0,
          btn: ['确定', '取消'],
          btn1: function (index) {
            var data = {};
            data.id = obj.data.id;
            data.num = obj.data.num;
            $.ajax({
              type: 'POST',
              url: '/yes/task/taskupdata',
              data: data,
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          },
          btn2: function (index, layero) {
            obj.update({
              num: old
            });
          }
        });
      });

      // 编辑完成数量
      table.on('edit(match_lst)', function (obj) {
        var old = $(this).prev().text(); //旧值
        layer.msg('确定修改？', {
          time: 0,
          btn: ['确定', '取消'],
          btn1: function (index) {
            var data = {};
            data.id = obj.data.id;
            data.num = obj.data.num;
            $.ajax({
              type: 'POST',
              url: '/yes/match/matchupdata',
              data: data,
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                table.reload('task');
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          },
          btn2: function (index, layero) {
            obj.update({
              num: old
            });
          }
        });
      });

      // 删除完成数量
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
                table.reload('task');
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        }
      })

      // 任务删除
      table.on('toolbar(task_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        var checkdata = checkStatus.data;
        if (obj.event == 'deltask_all') {
          var dataid = [];
          $.each(checkdata, function (index, elem) {
            dataid.push(elem.id);
          })
          layer.confirm('确定删除么？', function (index) {
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/task/alldelPost',
              data: {
                'id': dataid
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                table.reload('task');
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        } else if (obj.event == 'state_all') {
          var dataid = [];
          $.each(checkdata, function (index, elem) {
            dataid.push(elem.id);
          })
          if (checkdata[0]['state'] == '1') {
            state = "0";
          } else {
            state = "1";
          }

          layer.confirm('确定修改么？', function (index) {
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/task/changestate',
              data: {
                'id': dataid,
                'state': state
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                table.reload('task');
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        }
      });

      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        table.reload('task', {
          url: '/yes/task/tasksearchlst',
          where: data,
          done: function () {
            element.render();
            layer.close(layer.index);
          }
        });
        return false;
      });

      // 弹出搜索框
      $('#getserachbox').on('click', function () {
        layer.open({
          type: 1,
          title: ['佛山市亚世家具有限公司', 'text-align: center;padding:0px'],
          closeBtn: 0,
          shadeClose: true,
          anim: 0,
          scrollbar: false,
          area: ['70%', '65%'],
          content: $('#getserach'),
        });
      })

      //图片弹出 
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
        } else if (obj.event === 'match') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['100%', '50%'],
            content: $('#taskbox'),
            success: function () {
              table.reload('match', {
                url: '/yes/match/matchlst',
                where: {
                  product_id: data.product_id,
                  worker_id: data.worker_id
                },
              });
            }
          });
        } else if (obj.event === 'open') {
          var data = obj.data;
          var url = '/myes/index/match/worker_id/' + data.worker_id + '/product_id/' + data.product_id + '/number/' + data.num;
          window.open(url, "_blank", "scrollbars=yes,resizable=1,modal=false,alwaysRaised=yes");
        }
      })
    });