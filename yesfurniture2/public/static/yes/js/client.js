    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var bank_id;
      //数据表单实例
      table.render({
        elem: '#client_lst',
        method: 'post',
        url: '/yes/client/index',
        loading: true,
        // 开启工具栏
        toolbar: '#clienttoolbar',
        page:true,
        limit:'20',
        // 后台数据
        data: [{

        }],
        id: 'idclient',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            },
            {
              field: 's_name',
              withd: '10%',
              title: '简称',
            }, {
              field: 'name',
              title: '公司名称',
            }, {
              title: '公司地址',
              templet: '#address'
            }, {
              align: 'center',
              toolbar: '#clientbar',
              title: '操作',
              width: '30%'
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      //银行
      table.render({
        elem: '#bank_lst',
        method: 'post',
        loading: true,
        // 开启工具栏
        toolbar: '#banktoolbar',
        // 后台数据
        data: [{

        }],
        id: 'idbank',
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'name',
            title: '用户名',
          }, {
            field: 'bank_num',
            withd: '10%',
            title: '简称',
          }, {
            field: 'bank_name',
            title: '银行名称',
          }, {
            field: 'bank_des',
            title: '开户行',
          }, {
            align: 'center',
            toolbar: '#bankbar',
            title: '操作',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 点击添加客户
      table.on('toolbar(client_lst)', function (obj) {
        if (obj.event === 'add_client') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['70%', '70%'],
            content: $('#add_client_form'),
            success: function (layero, index) {
              $('.edit_client_form').hide();
              $('.add_client_form').show();
            }
          });
          $('.fromreset').trigger('click');
        }
      });

      // 监听客户添加
      form.on('submit(add_client_form)', function (data) {
        var data = data.field;
        delete data.id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/client/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success:function(){
            table.reload('idclient');
            layer.closeAll();
            layer.msg('添加成功'); 
          }
        });
        return false;
      });

      //添加联系方式
      form.on('submit(contact_form_form)', function (data) {
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/client/addContact', //URL
          data: data.field, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
            $('.fromreset').trigger('click');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
        return false;
      });

      // 监听顶级菜单修改
      form.on('submit(edit_client_form)', function (data) {
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/client/editPost', //URL
          data: data.field, //传递的参数
          dataType: "json", //返回的数据类型
          success:function(){
            table.reload('idclient');
            layer.closeAll();
            layer.msg('添加成功'); 
          }
        });
        return false;
      });

      //监听工具条
      table.on('tool(client_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除菜单及其子菜单么？', function (index) {
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/client/delPost',
              data: {
                id: data.id
              },
              dataType: "json",
              success: function (data) {
                if(data.code>0){
                  obj.del();
                }
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
            content: $('#add_client_form'),
            success: function (layero, index) {
              $('.edit_client_form').show();
              $('.add_client_form').hide();
            }
          });
          form.val("client_form", {
            "id": data.id,
            "s_name": data.s_name,
            "name": data.name,
            "address": data.address.address,
          });
        } else if (obj.event === 'check_contact') {
          layer.open({
            type: 2,
            title: false,
            closeBtn: 1,
            area: ['70%', '70%'],
            shadeClose: true,
            content: 'contact.html',
            success: function (layero, index) {
              $('#getinformation').val(data.id);
            }
          });
        } else if (obj.event === 'add_contact') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['70%', '70%'],
            content: $('#contact_form'),
          });
          form.val("contact_form", {
            "id": data.id,
          });
        }else if (obj.event === 'check_bank') {
          bank_id = data.id;
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['80%', '70%'],
            content: $('#bank'),
            success: function () {
              table.reload('idbank', {
                url: '/yes/client/bank',
                where: {
                  id: data.id
                }
              });
            }
          });
        }
        
      });


      //添加银行
      table.on('tool(bank_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
          layer.confirm('确定删除么？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/client/bankDel',
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
        } else if (obj.event === 'edit') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['60%', '70%'],
            content: $('#bank_form'),
            success: function (layero, index) {
              $('.edit_bank_form').show();
              $('.add_bank_form').hide();
            }
          });
          form.val("bank_form", {
            "id": data.id,
            "bank_num": data.bank_num,
            "bank_name": data.bank_name,
            "bank_des": data.bank_des,
            "name": data.name,
          });
        }
      })

      table.on('toolbar(bank_lst)', function (obj) {
        if (obj.event === 'add_bank') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['60%', '70%'],
            content: $('#bank_form'),
            success: function (layero, index) {
              $('.edit_bank_form').hide();
              $('.add_bank_form').show();
            }
          });
        }
      })

      // 监听银行信息添加
      form.on('submit(add_bank_form)', function (data) {
        var data = data.field;
        delete data.id;
        data.bank_id = bank_id;
        data.bank_type = 'client';
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/client/bankAdd', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
        });
      });

      // 监听银行信息修改
      form.on('submit(edit_bank_form)', function (data) {
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/client/bankEdit', //URL
          data: data.field, //传递的参数
          dataType: "json", //返回的数据类型
        });
      });

      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        table.reload('idclient', {
          url: '/yes/client/searchlst',
          where: data,
        });
        return false;
      });
    });