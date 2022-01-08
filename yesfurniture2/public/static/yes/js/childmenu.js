    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate', 'upload'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var laydate = layui.laydate;
      var getchildmenuid = parent.layui.$('#getchildmenuid').val();
      // 渲染表单
      table.render({
        elem: '#child_menu_lst',
        method: 'post',
        url: '/yes/menu/childmenu',
        where: {
          id: getchildmenuid
        },
        loading: true,
        // toolbar: '#toolbarDemo',
        // 后台数据
        data: [{

        }],
        id: 'idchildmenu',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            },
            {
              field:'parent_id',
              title:'上级ID',
              edit:'text',
            },
            {
              field: 'name',
              title: '菜单名称',
              edit: 'text',
            }, {
              field: 'url',
              title: '菜单链接',
              edit:'text',
            }, {
              align: 'center',
              toolbar: '#childmeanbar',
              width: '15%',
              title: '操作',
            }
          ]
        ],
        done: function () {
          // element.render();
        }
      });
      $('#nihao').on('click', function () {
        alert(1)
      })

      // //监听工具条
      table.on('tool(child__lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除菜单菜单么？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/menu/delete',
              data: {
                id: data.id
              },
              dataType: "json",
            });
          });
        }
      });

      // 监听表格编辑
      table.on('edit(child__lst)', function (obj) { 
        var data = obj.data;
        var url = data.url.split('/');
        data.app=url[1];
        data.controller=url[2];
        data.action=url[3];
        delete data.url; 
        // console.log(data);
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/menu/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            if (data.code == '0') {
              layer.msg(data.msg);
            } else {
              // 关闭页面弹框
              layer.closeAll('page');
              // 显示提示框
              layer.msg(data.msg);
              // 表单数据重载
              table.reload('idchildmenu', {
                url: '/yes/menu/childmenu',
              });
            }
            // return false;
          },
          error: function (data) {
            layer.msg(data.msg);
            // return false;
          }
        });
      });

    });