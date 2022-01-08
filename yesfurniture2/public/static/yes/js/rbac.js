    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'tree', 'util'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var tree = layui.tree;
      var util = layui.util
      var role_id;
      //数据表单实例
      table.render({
        elem: '#rbac_lst',
        method: 'post',
        url: '/yes/rbac/index',
        loading: true,
        // 开启工具栏
        toolbar: '#rbactoolbar',
        // 后台数据
        data: [{

        }],
        id: 'idmenu',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            }, {
              field: 'name',
              title: '角色名称',
            }, {
              field: 'remark',
              title: '描述',
            },
            {
              toolbar: '#rbacbar',
              title: '操作',
            }
          ]
        ],
        done: function () {
          element.render();
          getmenu();
        }
      });

      // 点击添加角色
      $('#add_rbac').on('click', function () {
        layer.open({
          type: 1,
          title: false,
          closeBtn: 0,
          shadeClose: true,
          area: ['70%', '70%'],
          content: $('#add_rbac_form'),
          success: function () {
            $('.add_rbac_from').show();
            $('.edit_rbac_from').hide();
          }
        });
      });

      //监听角色编辑
      form.on('submit(edit_rbac_from)', function (data) {
        var data = data.field;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/rbac/roleEditPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
        });
      });

      // 添加角色
      form.on('submit(add_rbac_from)', function (data) {
        var data = data.field;
        delete data.id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/rbac/roleAddPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
        });
      });

      //监听工具条
      table.on('tool(rbac_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除菜单及其子菜单么？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/rbac/roleDelete',
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
            content: $('#add_rbac_form'),
            success: function (layero, index) {
              $('.add_rbac_from').hide();
              $('.edit_rbac_from').show();
            }
          });
          form.val("rbac_form", {
            "id": data.id,
            "name": data.name,
            "remark": data.remark,
          });
        } else if (obj.event === 'authorize') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 1,
            area: ['70%', '70%'],
            shadeClose: true,
            content: $('#edit_authorize'),
            success: function () {
              role_id = data.id; 
              $.ajax({
                type: 'POST',
                url: '/yes/rbac/authorize',
                data: {
                  id: data.id
                },
                dataType: "json",
                success: function (data) {
                  tree.setChecked('rule_tree', data);
                },
                error: function (data) {
                  layer.msg(data.msg);
                }
              });
            },
            end: function () {
              getmenu();
            }
          });
        }
      });

      // 树形菜单实例
      tree.render({
        elem: '#rule_tree',
        data: [],
        showCheckbox: true,
        id: 'rule_tree',
      });

      // 树形菜单重载
      function getmenu() {
        $.ajax({
          type: 'POST',
          url: '/yes/rbac/gettreemenu',
          dataType: "json",
          success: function (data) {
            tree.reload('rule_tree', {
              data
            });
          }
        });
      }

      var result_id = [];

      // 获取选择的id
      function getmenuid(data) {
        $.each(data, function (index, element) {
          if (element.hasOwnProperty("children")) {
            getmenuid(element.children);
          }
          result_id.push(element.id);
        })
        return result_id;
      }

      //按钮事件
      util.event('lay-demo', {
        getChecked: function (othis) {
          var checkedData = tree.getChecked('rule_tree'); //获取选中节点的数据
          var getid = getmenuid(checkedData);
          result_id = [];
          $.ajax({
            type: 'POST',
            url: '/yes/rbac/authorizePost',
            data: {
              roleId: role_id,
              menuId:getid,
            },
            dataType: "json",
            success: function (data) {
              layer.closeAll('page');
              layer.msg(data.msg);
            },
            error: function (data) {
              layer.closeAll('page');
              layer.msg(data.msg);
            }
          });
        },
        setChecked: function () {
          getmenu();
        },
      });
    });