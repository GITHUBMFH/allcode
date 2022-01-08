    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;

      //数据表单实例
      table.render({
        elem: '#user_lst',
        method: 'post',
        url: '/yes/user/index',
        loading: true,
        // 开启工具栏
        toolbar: '#usertoolbar',
        // 后台数据
        data: [{

        }],
        id: 'iduser',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            },
            {
              field: 'user_login',
              title: '用户名称',
            }, {
              field: 'name',
              title: '用户角色',
            }, {
              field: 'role_id',
              title: '角色id',
              hide: true
            }, {
              field: 'user_email',
              title: '邮箱',
            }, {
              field: 'last_login_time',
              title: '最后登录时间',
            }, {
              align: 'center',
              toolbar: '#userbar',
              title: '操作',
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      // 点击添加顶级菜单
      $('#add_user').on('click', function () {
        layer.open({
          type: 1,
          title: false,
          closeBtn: 0,
          shadeClose: true,
          area: ['70%', '70%'],
          content: $('#add_user_form'),
          success: function (layero, index) {
            $('.edit_user_form').hide();
            $('.add_user_form').show();
          }
        });
        $('.fromreset').trigger('click');
      })

      // 监听顶级菜单添加
      form.on('submit(add_user_form)', function (data) {
        var data = data.field;
        // data.role_id =[data.role_id];
        delete data.id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/user/addPost', //URL
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
              table.reload('iduser', {
                url: '/yes/user/index',
              });
            }
            // return false;
          },
          error: function (data) {
            layer.msg(data.msg);
            // return false;
          }
        });
        // return false;
      });

      // 监听顶级菜单修改
      form.on('submit(edit_user_form)', function (data) {
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/user/editPost', //URL
          data: data.field, //传递的参数
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
              table.reload('iduser', {
                url: '/yes/user/index',
              });
            }
            // return false;
          },
          error: function (data) {
            layer.msg(data.msg);
            // return false;
          }
        });
        // return false;
      });

      //监听工具条
      table.on('tool(user_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除管理员？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/user/delete',
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
        } else if (obj.event === 'edit') { //编辑生产单
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['70%', '70%'],
            content: $('#add_user_form'),
            success: function (layero, index) {
              $('.edit_user_form').show();
              $('.add_user_form').hide();
            }
          });
          form.val("user_form", {
            "id": data.id,
            "user_login": data.user_login,
            "role_id": data.role_id,
            "user_email": data.user_email,
          });
        } else if (obj.event === 'status') { //编辑生产单
          var msg;
          data.user_status==1?data.user_status=0:data.user_status=1;
          data.user_status==1?msg='确定启用管理员？':msg='确定禁用管理员？';
          layer.confirm(msg, function (index) {
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/user/ban',
              data: {
                id: data.id,
                user_status: data.user_status
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                table.reload('iduser', {
                  url: '/yes/user/index',
                });
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        }
      });

    });