    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var laydate = layui.laydate;

      laydate.render({
        elem: '#search_time1',
        range: '至',
      });
      //数据表单实例
      table.render({
        elem: '#spare_lst',
        method: 'post',
        url: '/yes/spare/index',
        loading: true,
        // 开启工具栏
        toolbar: '#sparetoolbar',
        page: true,
        limit:50,
        limits:[50,100,150,200,250,300],
        // 后台数据
        data: [{

        }],
        id: 'idspare',
        cols: [
          [{
            type: 'checkbox',
          }, {
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'order',
            title: '用途',
            align: 'center',
            width: '14%',
            templet: function (d) {
              if (d.product_id == '1') {
                return '日常采购';
              } else {
                return 'YS' + d.year + '-' + d.num + '-' + d.pro_num;
              }
            }
          }, {
            field: 'client_name',
            title: '客户',
            align: 'center',
          }, {
            field: 'type',
            title: '类型',
            align: 'center',
          }, {
            field: 'name',
            title: '名称',
            align: 'center',
          }, {
            field: 'size',
            title: '规格',
            align: 'center',
          }, {
            field: 'used',
            title: '用量',
            align: 'center',
          }, {
            field: 'details',
            title: '描述',
            align: 'center',
          }, {
            field: 'create_time',
            title: '创建时间',
            align: 'center',
            width: '10%',
          }, {
            field: 'who',
            title: '提交人',
            align: 'center',
          }, {
            field: 'person',
            title: '受理人',
            align: 'center',
            templet: function (d) {
              if (d.person == '') {
                return '暂无';
              } else {
                return d.person;
              }
            }
          }, {
            field: 'state',
            title: '状态',
            align: 'center',
            templet: '#state'
          }, {
            title: '操作',
            align: 'center',
            templet: '#sparebar',
            width: '10%',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 点击添加
      table.on('toolbar(spare_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event === 'add_spare') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['80%', '90%'],
            content: $('#add_spare_form'),
            success: function (layero, index) {
              $('.edit_spare_form').hide();
              $('.add_spare_form').show();
            }
          });
          $('.fromreset').trigger('click');
          $('#produce_num_form').html($("<option>").val('').text('请选择生产单'));
          $('#produce_product_form').html($("<option>").val('').text('请选择产品序号'));
        } else if (obj.event === 'add_daily_spare') {
          $('.fromreset').trigger('click');
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['80%', '90%'],
            content: $('#add_daily_spare_form'),
            success: function (layero, index) {
              $('.edit_daily_spare_form').hide();
              $('.add_daily_spare_form').show();
            }
          });
        } else if (obj.event === 'change_state') {
          var value = $('#change_state').val();
          if (value == '') {
            layer.msg('请选择状态');
            return false;
          }
          var text;
          if (value == 1) {
            text = '审核中';
          } else if (value == 2) {
            text = '采购中';
          } else if (value == 3) {
            text = '已完成';
          } else {
            text = '已拒绝';
          }
          var dataid = [];
          var checkdata = checkStatus.data;
          if (checkdata.length > 0) {
            $.each(checkdata, function (index, elem) {
              dataid.push(elem.id);
            })
            layer.confirm('确定修改状态为' + text + '?', function (index) {
              layer.close(index);
              $.ajax({
                type: 'POST',
                url: '/yes/spare/changeState',
                data: {
                  id: dataid,
                  state: value
                },
                dataType: "json",
                success: function (data) {
                  layer.msg(data.msg);
                  table.reload('idspare');
                },
                error: function (data) {
                  layer.msg(data.msg);
                }
              });
            });
          } else {
            layer.msg('请选择行');
          }
        }

      });


      // 监听采购添加
      form.on('submit(add_spare_form)', function (data) {
        var data = data.field;
        delete data.id;
        delete data.year;
        delete data.num;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/spare/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            table.reload('idspare');
            layer.closeAll();
            layer.msg(data.msg);
          },
          error: function (data) {
            table.reload('idspare');
            layer.closeAll();
            layer.msg(data.msg);
          }
        });
        return false;
      });

      // 监听日常采购添加
      form.on('submit(add_daily_spare_form)', function (data) {
        var data = data.field;
        delete data.id;
        data.product_id = '1';
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/spare/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            table.reload('idspare');
            layer.closeAll();
            layer.msg(data.msg);
          },
          error: function (data) {
            table.reload('idspare');
            layer.closeAll();
            layer.msg(data.msg);
          }
        });
        return false;
      });

      // 监听采购修改
      form.on('submit(edit_spare_form)', function (data) {
        var data = data.field;
        delete data.year;
        delete data.num;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/spare/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            table.reload('idspare');
            layer.closeAll();
            layer.msg(data.msg);
          },
          error: function (data) {
            table.reload('idspare');
            layer.closeAll();
            layer.msg(data.msg);
          }
        });
        return false;
      });

      // 监听日常采购修改
      form.on('submit(edit_daily_spare_form)', function (data) {
        var data = data.field;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/spare/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            table.reload('idspare');
            layer.closeAll();
            layer.msg(data.msg);
          },
          error: function (data) {
            table.reload('idspare');
            layer.closeAll();
            layer.msg(data.msg);
          }
        });
        return false;
      });

      //监听工具条
      table.on('tool(spare_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/spare/delPOst',
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
          if (data.product_id != 1) {
            layer.open({
              type: 1,
              title: false,
              closeBtn: 0,
              shadeClose: true,
              area: ['80%', '90%'],
              content: $('#add_spare_form'),
              success: function (layero, index) {
                $('.edit_spare_form').show();
                $('.add_spare_form').hide();
              }
            });
            $('#produce_num_form').html($("<option>").val(data.order_id).text(data.num));
            $('#produce_product_form').html($("<option>").val(data.product_id).text(data.pro_num));
            form.val("spare_form", {
              "id": data.id,
              "year": data.year,
              "num": data.order_id,
              "product_id": data.product_id,
              "type": data.type,
              "name": data.name,
              "size": data.size,
              "used": data.used,
              "details": data.details,
              "state": data.state,
              "client_id": data.client_id,
            });
          } else {
            layer.open({
              type: 1,
              title: false,
              closeBtn: 0,
              shadeClose: true,
              area: ['80%', '90%'],
              content: $('#add_daily_spare_form'),
              success: function (layero, index) {
                $('.edit_daily_spare_form').show();
                $('.add_daily_spare_form').hide();
              }
            });
            form.val("daily_spare_form", {
              "id": data.id,
              "product_id": '1',
              "type": data.type,
              "name": data.name,
              "size": data.size,
              "used": data.used,
              "details": data.details,
              "state": data.state,
            });
          }

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
        if (data.year == '1') {
          data.product_id = 1;
        }
        delete data.year;
        table.reload('idspare', {
          url: '/yes/spare/searchlst',
          where: data,
        });
        return false;
      });

    });