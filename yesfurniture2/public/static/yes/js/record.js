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
      laydate.render({
        elem: '#record_time',
        showBottom: false
      });
      laydate.render({
        elem: '#finance_time',
        showBottom: false
      });
      //数据表单实例
      table.render({
        elem: '#record_lst',
        method: 'post',
        url: '/yes/record/index',
        loading: true,
        // 开启工具栏
        toolbar: '#recordtoolbar',
        limit: 50,
        page: true,
        limits: [50, 100, 150, 200, 250, 300, 350, 400, 450, 500],
        id: 'idrecord',
        cols: [
          [{
            type: 'checkbox',
          }, {
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'supplier',
            title: '供应商',
            align: 'center',
            templet: function (d) {
              return d.supplier.s_name;
            }
          }, {
            field: 'number',
            title: '订单号',
            align: 'center',
            templet: function (d) {
              if (d.number != '') {
                return d.number;
              } else {
                return '暂无';
              }
            }
          }, {
            field: 'data',
            title: '日期',
            align: 'center',
            sort: true,
            totalRowText: '总计',
          }, {
            field: 'price',
            title: '总价格',
            align: 'center',
            width: '8%',
            sort: true,
            totalRow: true,
          }, {
            field: 'state',
            title: '状态',
            align: 'center',
            templet: '#state',
            width: '8%',
          }, {
            field: 'remark',
            title: '备注',
            align: 'center',
            width: '10%',
          }, {
            align: 'center',
            toolbar: '#recordbar',
            title: '操作',
            width: '16%',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 点击添加进账
      table.on('toolbar(record_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event === 'add_record') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['50%', '70%'],
            content: $('#add_record_form'),
            success: function (layero, index) {
              $('.edit_record_form').hide();
              $('.add_record_form').show();
            }
          });
          $('.fromreset').trigger('click');
        } else if (obj.event === 'change_state') {
          var value = $('#change_state').val();
          if (value == '') {
            layer.msg('请选择状态');
            return false;
          }
          var text;
          if (value == 1) {
            text = '未结现金';
          } else if (value == 2) {
            text = '未对账';
          } else if (value == 3) {
            text = '已对账';
          } else if (value == 4) {
            text = '月结结清';
          } else {
            text = '现金结清';
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
                url: '/yes/record/changeState',
                data: {
                  id: dataid,
                  state: value
                },
                dataType: "json",
                success: function (data) {
                  layer.msg(data.msg);
                  table.reload('idrecord');
                },
                error: function (data) {
                  layer.msg(data.msg);
                }
              });
            });
          } else {
            layer.msg('请选择行');
          }
        } else if (obj.event === 'end_month') {
          var dataid = [];
          var supplier = [];
          var state = [];
          var checkdata = checkStatus.data;
          var time = $('#finance_time').val();
          $.each(checkdata, function (index, elem) {
            supplier.push(elem.supplier.id);
            state.push(elem.state);
            dataid.push(elem.id);

          })
          if (checkdata.length < 1) {
            layer.msg('请选择行');
          } else if (time == '') {
            layer.msg('请选择日期');
          } else if ($.unique(supplier).length > 1) {
            layer.msg('请选择相同的供应商');
          } else if ($.unique(state).length > 1 || $.unique(state)[0] != 3) {
            layer.msg('请选择状态为已对单的记录');
          } else {
            layer.confirm('确定修改状态为月结结清?', function (index) {
              layer.close(index);
              $.ajax({
                type: 'POST',
                url: '/yes/record/endmonth',
                data: {
                  id: dataid,
                  supplier: supplier[0],
                  time: time
                },
                dataType: "json",
                success: function (data) {
                  layer.msg(data.msg);
                  table.reload('idrecord');
                },
                error: function (data) {
                  layer.msg(data.msg);
                }
              });
            });
          }
        } else if (obj.event === 'account') {
          var dataid = [];
          var supplier = [];
          var state = [];
          var checkdata = checkStatus.data;
          $.each(checkdata, function (index, elem) {
            supplier.push(elem.supplier.id);
            state.push(elem.state);
            dataid.push(elem.id);

          })

          if (checkdata.length < 1) {
            layer.msg('请选择行');
          } else if ($.unique(supplier).length > 1) {
            layer.msg('请选择相同的供应商');
          } else if ($.unique(state).length > 1 || $.unique(state)[0] == 5 || $.unique(state)[0] == 4) {
            layer.msg('请选择状态为未结清的记录');
          } else {
            var params = {
              "dataid": dataid
            };
            var url = "/yes/record/account";
            post(url, params);
          }
        } else if (obj.event === 'get_amount') {
          var num = 0;
          var checkdata = checkStatus.data;
          if (checkdata.length > 0) {
            $.each(checkdata, function (index, elem) {
              formatNum(num += parseFloat(elem.price), 1)
            })
            layer.alert(num, {
              title: '求和',
              // icon: 6,
              closeBtn: 0,
              shadeClose: true,
              btn: null
            })
          } else {
            layer.msg('请选择订单');
          }
        }
      });

      //跳转打印页面
      function post(url, params) {
        // 创建form元素
        var temp_form = document.createElement("form");
        // 设置form属性
        temp_form.action = url;
        temp_form.target = "_blank";
        temp_form.method = "post";
        temp_form.style.display = "none";
        // 处理需要传递的参数
        for (var x in params) {
          var opt = document.createElement("textarea");
          opt.name = x;
          opt.value = params[x];
          temp_form.appendChild(opt);
        }
        document.body.appendChild(temp_form);
        // 提交表单
        temp_form.submit();
      }

      formatNum = function (f, digit) {
        var m = Math.pow(10, digit);
        return parseInt(f * m, 10) / m;
      }

      $('#end_month').on('click', function () {
        $('#click_end_month').trigger('click');
      })

      $('#account2').on('click', function () {
        $('#account').trigger('click');
      })

      // 监听进账添加
      form.on('submit(add_record_form)', function (data) {
        var data = data.field;
        delete data.id
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/record/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function () {
            table.reload('idrecord');
            layer.closeAll();
            layer.msg('添加成功');
          }
        });
        return false;
      });

      // 监听顶级菜单修改
      form.on('submit(edit_record_form)', function (data) {
        var data = data.field;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/record/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function () {
            table.reload('idrecord');
            layer.closeAll();
            layer.msg('修改成功');
          }
        });
        return false;
      });

      //监听工具条
      table.on('tool(record_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除么？', function (index) {
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/record/delPost',
              data: {
                id: data.id
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                if (data.code == 1) {
                  obj.del();
                }
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
            area: ['50%', '70%'],
            content: $('#add_record_form'),
            success: function (layero, index) {
              $('.edit_record_form').show();
              $('.add_record_form').hide();
              if (data.state == '4') {
                $('#monty_select').hide();
              } else {
                $('#monty_select').show();
              }
            }
          });
          form.val("record_form", {
            "id": data.id,
            "supplier": data.supplier.id,
            "number": data.number,
            "data": data.data,
            "price": data.price,
            "state": data.state,
            "remark": data.remark,
          });
        } else if (obj.event === 'details') {
          layer.open({
            type: 2,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['90%', '90%'],
            content: '/yes/record_details/index.html',
            success: function (layero, index) {
              $('#getinformation').val(data.id);
            }
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
        table.reload('idrecord', {
          url: '/yes/record/searchlst',
          where: data,
          totalRow: true,
        });
        return false;
      });

    });