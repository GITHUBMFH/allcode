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
        elem: '#search_time1',
        range: '至',
      });

      //数据表单实例
      table.render({
        elem: '#attend_lst',
        method: 'post',
        url: '/yes/worker/attend',
        page: true,
        loading: true,
        limit: 50,
        limits: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500],
        // 开启工具栏
        toolbar: '#attendtoolbar',
        // 后台数据
        data: [{}],
        id: 'idattend',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true
            },
            {
              field: 'work_name',
              title: '姓名',
            }, {
              field: 'type',
              title: '类型',
            }, {
              field: 'data',
              title: '时间',
            }, {
              field: 'duration',
              title: '时长',
            }, {
              field: 'unit',
              title: '单位',
            }, {
              align: 'center',
              toolbar: '#attendbar',
              title: '操作',
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });

      //监听头部工作栏
      table.on('toolbar(attend_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event === 'add_attend') {
          $('.fromreset').trigger("click");
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['70%', '70%'],
            content: $('#add_attend_form'),
            success: function (layero, index) {
              $('.edit_attend_form').hide();
              $('.add_attend_form').show();
            }
          });
          $('.fromreset').trigger('click');
          $('#add_worker_name').html($("<option>").val('').text('请选择姓名'));
        }
      });

      // 监听客户添加
      form.on('submit(add_attend_form)', function (data) {
        var data = data.field;
        delete data.id;
        data.work_id = data.worker_id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/worker/attendAdd', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success:function(){
            table.reload('idattend');
            layer.closeAll();
            layer.msg('添加成功'); 
          }
        });
        return false;
      });


      // 监听顶级菜单修改
      form.on('submit(edit_attend_form)', function (data) {
        var data = data.field;
        data.work_id = data.worker_id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/worker/attendEdit', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success:function(){
            table.reload('idattend');
            layer.closeAll();
            layer.msg('修改成功'); 
          }
        });
        return false;
      });

      //监听工具条
      table.on('tool(attend_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除么？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/worker/attendDel',
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
            content: $('#add_attend_form'),
            success: function (layero, index) {
              $('.edit_attend_form').show();
              $('.add_attend_form').hide();
            }
          });
          $('#add_worker_name').html($("<option>").val(data.work_id).text(data.work_name));
          form.val("attend_form", {
            "id": data.id,
            "type": data.type,
            "data": data.data,
            "duration": data.duration,
            "unit": data.unit,
            'work_id':data.type_id,
          });
        }
      });

      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        if (data.time != '') {
          var time = data.time.split('至');
          data.starttime = time[0].trim();
          data.endtime = time[1].trim();
        } else {
          data.starttime = '';
          data.endtime = '';
        }
        delete data.time;
        data.work_id = data.worker_id;
        delete data.worker_id;
        table.reload('idattend', {
          url: '/yes/worker/attendSearchlst',
          where: data,
        });
        return false;
      });

    });