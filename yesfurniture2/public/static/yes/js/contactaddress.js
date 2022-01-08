    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'upload'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var getinformation = parent.layui.$('#getinformation').val();
      // 渲染表单
      table.render({
        elem: '#contact_lst',
        method: 'post',
        url: '/yes/client/checkContact',
        where: {
          id: getinformation
        },
        loading: true,
        data: [{

        }],
        id: 'contact',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            }, {
              field:'name',
              title:'联系人',
              edit:'text',
            }, {
              field: 'station',
              title: '岗位',
              edit: 'text',
            }, {
              field: 'number',
              title: '联系电话',
              edit: 'text',
            }, {
              toolbar: '#contactbar',
              title: '操作',
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      // //监听工具条
      table.on('tool(contact_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除联系人么？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/client/delContact',
              data: {
                id: data.id
              },
              dataType: "json",
              success: function (data){
                  layer.msg(data.msg);
                }
              });
          });
        }
      });

      // 监听表格编辑
      table.on('edit(contact_lst)', function (obj) { 
        var data = obj.data;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/client/editContact', //URL
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
            }
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

    });