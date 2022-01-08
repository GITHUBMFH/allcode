    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;

      //数据表单实例
      table.render({
        elem: '#dailyprice_lst',
        method: 'post',
        url: '/yes/daily_price/index',
        loading: true,
        // 开启工具栏
        toolbar: '#dailypricetoolbar',
        page: true,
        limit:20,
        // 后台数据
        data: [{

        }],
        id: 'iddailyprice',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            },
            {
              field: 'type_id',
              title: '类型',
              templet: function (d) {
                if (d.type_id > 998) {
                  return '材料';
                } else {
                  return d.worktype.name;
                }
              }
            }, {
              field: 'name',
              title: '名称',
              edit: 'text',
              templet: function (d) {
                if (d.type_id < 999) {
                  return '人工';
                } else {
                  return d.name;
                }
              }
            }, {
              field: 'standard',
              title: '规格',
              edit: 'text',
            }, {
              field: 'price',
              title: '价格',
              edit: 'text',
            }, {
              align: 'center',
              toolbar: '#dailypricebar',
              title: '操作',
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      form.on('select(choose_type)', function (data) {
        if (data.value < 999) {
          $('#price_name').val('人工');
        }
      });
      // 点击添加顶级菜单
      $('#add_dailyprice').on('click', function () {
        layer.open({
          type: 1,
          title: false,
          closeBtn: 0,
          shadeClose: true,
          area: ['70%', '70%'],
          content: $('#add_dailyprice_form'),
        });
        $('.fromreset').trigger('click');
      })

      // 监听顶级菜单添加
      form.on('submit(add_dailyprice_form)', function (data) {
        var data = data.field;
        delete data.id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/daily_price/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            if (data.code == '0') {
              layer.msg(data.msg);
            } else {
              // 关闭页面弹框
              layer.closeAll('page');
              // 显示提示框
              // 表单数据重载
              // table.reload('iddailyprice');
              return layer.msg(data.msg);
            }
          },
          error: function (data) {
            return layer.msg(data.msg);
          }
        });
        // return false;
      });

      //监听工具条
      table.on('tool(dailyprice_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除参考数据？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/daily_price/delPost',
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
        }
      });

      table.on('edit(dailyprice_lst)', function (obj) {
        var data = obj.data;
        $.ajax({
          type: 'POST',
          url: '/yes/daily_price/editPost',
          data: data,
          dataType: "json",
          success: function (data) {
            layer.msg(data.msg);
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        table.reload('iddailyprice', {
          url: '/yes/daily_price/searchlst',
          where: data,
        });
        return false;
      });

    });