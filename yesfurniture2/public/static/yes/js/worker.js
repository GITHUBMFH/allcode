    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var laydate = layui.laydate;

      laydate.render({
        elem: '#get_time',
      });

      laydate.render({
        elem: '#out_time',
      });
      //数据表单实例
      table.render({
        elem: '#worker_lst',
        method: 'post',
        url: '/yes/worker/index',
        loading: true,
        // 开启工具栏
        toolbar: '#workertoolbar',
        page:true,
        limit:'20',
        // 后台数据
        data: [{}],
        id: 'idworker',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            },
            {
              field: 'name',
              title: '姓名',
              align: 'center'
            }, {
              field: 'work_name',
              title: '工种',
              align: 'center'
            }, {
              field: 'tyep_id',
              title: '类型',
              align: 'center',
              templet: function (d) {
                if (d.tyep_id == 1) {
                  return '计件';
                } else {
                  return '计时';
                }
              }
            }, {
              field: 'state',
              title: '状态',
              align: 'center',
              templet: function (d) {
                if (d.state == 1) {
                  return '在职';
                } else {
                  return '离职';
                }
              }
            }, {
              field: 'phone',
              title: '电话',
              align: 'center',
              width: '14%'
            }, {
              field: 'address',
              title: '地址',
              align: 'center'
            }, {
              field: 'get_time',
              title: '入职时间',
              align: 'center',
              templet: function (d) {
                var time;
                if (d.get_time == null) {
                  time = '暂无';
                } else if (d.get_time == '0000-00-00') {
                  time = '暂无';
                } else {
                  time = d.get_time;
                }
                return time;
              }
            }, {
              field: 'out_time',
              title: '离职时间',
              align: 'center',
              templet: function (d) {
                var time;
                if (d.out_time == null) {
                  time = '暂无';
                } else if (d.out_time == '0000-00-00') {
                  time = '暂无';
                } else {
                  time = d.out_time;
                }
                return time;
              }
            }, {
              align: 'center',
              toolbar: '#workerbar',
              title: '操作',
              width: '20%'
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      //数据表单实例
      table.render({
        elem: '#bank_lst',
        method: 'post',
        id: 'idbank',
        data: [{}],
        cols: [
          [{
            field: 'idcard',
            title: '身份证',
            align: 'center'
          }, {
            field: 'bank_card',
            title: '银行卡',
            align: 'center'
          }, {
            field: 'bank_type',
            title: '银行类型',
            align: 'center'
          }, {
            field: 'band_address',
            title: '开户行',
            align: 'center'
          }, {
            field: 'salary',
            title: '底薪',
            align: 'center',
            edit: 'text',
          }, {
            field: 'allowance',
            title: '补贴',
            align: 'center',
            edit: 'text',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      //监听头部工作栏
      table.on('toolbar(worker_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event === 'add_worker') {
          $('.fromreset').trigger("click");
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['70%', '90%'],
            content: $('#add_worker_form'),
            success: function (layero, index) {
              $('.edit_worker_form').hide();
              $('.add_worker_form').show();
            }
          });
        }
      });

      // 监听客户添加
      form.on('submit(add_worker_form)', function (data) {
        var data = data.field;
        delete data.id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/worker/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success:function(){
            table.reload('idworker');
            layer.closeAll();
            layer.msg('添加成功'); 
          }
        });
        return false;
      });

      // 监听顶级菜单修改
      form.on('submit(edit_worker_form)', function (data) {
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/worker/editPost', //URL
          data: data.field, //传递的参数
          dataType: "json", //返回的数据类型
          success:function(){
            table.reload('idworker');
            layer.closeAll();
            layer.msg('修改成功'); 
          }
        });
        return false;
      });

      //监听工具条
      table.on('tool(worker_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除菜单及其子菜单么？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/worker/delPost',
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
            area: ['70%', '90%'],
            content: $('#add_worker_form'),
            success: function (layero, index) {
              $('.edit_worker_form').show();
              $('.add_worker_form').hide();
            }
          });
          form.val("worker_form", {
            "id": data.id,
            "name": data.name,
            "address": data.address,
            "band_address": data.band_address,
            "bank_card": data.bank_card,
            "bank_type": data.bank_type,
            "get_time": data.get_time,
            "idcard": data.idcard,
            "out_time": data.out_time,
            "remark": data.remark,
            "state": data.state,
            "tyep_id": data.tyep_id,
            "work_id": data.work_id,
            "phone": data.phone,
          });

        } else if (obj.event === 'check_bank') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['80%', '18%'],
            content: $('#bank'),
            success: function () {
              table.reload('idbank', {
                url: '/yes/worker/bank',
                where: {
                  id: data.id
                }
              });
            }
          });
        }
      });

      table.on('edit(bank_lst)', function (obj) {
        var data = obj.data
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/worker/salary', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
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
        table.reload('idworker', {
          url: '/yes/worker/searchlst',
          where: data,
        });
        return false;
      });
    });