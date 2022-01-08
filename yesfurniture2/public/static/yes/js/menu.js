    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;

      //数据表单实例
      table.render({
        elem: '#menu_lst',
        method: 'post',
        url: '/yes/menu/index',
        loading: true,
        // 开启工具栏
        toolbar: '#meantoolbar',
        // 后台数据
        data: [{

        }],
        id: 'idmenu',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            },
            {
              field: 'name',
              title: '菜单名称',
              align:'center',
            }, 
            // {
            //   field: 'url',
            //   title: '菜单链接',
            // }, 
            {
              align: 'center',
              toolbar: '#meanbar',
              width: '40%',
              title: '操作',
              align:'center',
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      // 点击添加顶级菜单
      $('#add_menu').on('click', function () {
        layer.open({
          type: 1,
          title: false,
          closeBtn: 0,
          shadeClose: true,
          area: ['70%', '70%'],
          content: $('#add_menu_form'),
          success: function (layero, index) {
            $('.edit_menu_form').hide();
            $('.add_menu_form').show();
            $('.add_child_menu').hide();
          }
        });
      })

      // 监听顶级菜单添加
      form.on('submit(add_menu_form)', function (data) {
        var data = data.field;
        delete data.id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/menu/addPost', //URL
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
              table.reload('idmenu', {
                url: '/yes/menu/index',
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
      form.on('submit(edit_menu_form)', function (data) {
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/menu/editPost', //URL
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
              table.reload('idmenu', {
                url: '/yes/menu/index',
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

      // 监听添加子菜单
      form.on('submit(add_child_menu)', function (data) {
        var data = data.field;
        data.parent_id = data.id;
        delete data.id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/menu/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
        });
      });

      //监听工具条
      table.on('tool(menu_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除菜单及其子菜单么？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/menu/delete',
              data: {
                id: data.id
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                console.log(data.msg);
              },
              error: function (data) {
                console.log(data);
              }
            });
          });
        } else if (obj.event === 'edit') { //编辑生产单
          var url = data.url.split('/');
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['70%', '70%'],
            content: $('#add_menu_form'),
            success: function (layero, index) {
              $('.edit_menu_form').show();
              $('.add_menu_form').hide();
              $('.add_child_menu').hide();
            }
          });
          form.val("menu_form", {
            "id": data.id,
            "name": data.name,
            "app": url[1],
            "controller": url[2],
            "action": url[3],
          });
        } else if (obj.event === 'child_menu') {
          layer.open({
            type: 2,
            title: false,
            closeBtn: 1,
            area: ['70%', '70%'],
            shadeClose: true,
            content: 'childmenu.html',
            success: function (layero, index) {
              // var body = layer.getChildFrame('body', index); //得到产品查询层的BODY
              // body.find('#getchildmenuid').val(data.id); //将本层的窗口索引传给产品查询层的hidValue中
              $('#getchildmenuid').val(data.id);
            }
          });
        } else if (obj.event === 'add_child_menu') {
          var url = data.url.split('/');
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['70%', '70%'],
            content: $('#add_menu_form'),
            success: function (layero, index) {
              $('.edit_menu_form').hide();
              $('.add_menu_form').hide();
              $('.add_child_menu').show();
            }
          });
          form.val("menu_form", {
            "id": data.id,
            "name":'',
            "app": '',
            "controller":'',
            "action":'',
          });
        }
      });

    });