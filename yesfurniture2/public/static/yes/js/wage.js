    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var laydate = layui.laydate;
      var wage_id;
      //年选择器
      laydate.render({
        elem: '#wage_time',
        type: 'month'
      });

      laydate.render({
        elem: '#search_time1',
        type: 'month',
      });

      laydate.render({
        elem: '#borrow_time',
        showBottom: false
      });
      //第一个实例
      table.render({
        elem: '#wage_lst',
        method: 'post',
        url: '/yes/data/wage',
        page: true,
        limit: 20,
        loading: true,
        toolbar: '#wagetoolbar',
        id: 'wage',
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'name',
            title: '姓名',
            align: 'center',
            width: '8%',
          }, {
            field: 'work_name',
            title: '职位',
            align: 'center',
            totalRowText:'合计',
          }, {
            field: 'year',
            title: '年份',
            align: 'center',
            width: '6%',
          }, {
            field: 'month',
            title: '月份',
            align: 'center',
          }, {
            field: 'borrow',
            title: '借款',
            align: 'center',
            event: 'showborrow',
            width: '10%',
            templet: function (d) {
              if (d.borrow == null) {
                return '暂无';
              } else {
                return d.borrow;
              }
            },
            totalRow:true,
          }, {
            field: 'amount',
            title: '计件统计',
            align: 'center',
            width: '8%',
            templet: function (d) {
              if (d.amount == null) {
                return '暂无';
              } else {
                return d.amount;
              }
            }
          }, {
            field: 'bonus',
            title: '奖金',
            align: 'center',
          }, {
            field: 'deduct',
            title: '罚款',
            align: 'center',
          }, {
            field: 'duration',
            title: '请假',
            align: 'center',
            templet:function(d){
              if(d.duration){
                return d.duration+'时';
              }else{
                return '';
              }
            }
          }, {
            field: 'wage',
            title: '实际工资',
            align: 'center',
            width: '10%',
            totalRow:true,
          }, {
            title: '除借款工资',
            align: 'center',
            width: '10%',
            templet: function (d) {
              return d.wage - d.borrow;
            },
            totalRow:true,
          }, {
            field: 'remark',
            title: '备注',
            align: 'center',
          }, {
            title: '是否发放',
            align: 'center',
            width: '8%',
            templet: function (d) {
              var html;
              if (d.state == 1) {
                var html = '<input type="checkbox" name="state" lay-skin="switch" lay-text="已发|未发" lay-filter="changestate">'
              } else if (d.state == 2) {
                var html = '<input type="checkbox" name="state" lay-skin="switch" lay-text="已发|未发" lay-filter="changestate" checked>'
              }
              return html;
            }
          }, {
            toolbar: '#wagebar',
            title: '操作',
            width: '16%',
            align: 'center',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      form.on('switch(changestate)', function (data) {
        var state_id = data.elem.checked ==false?1:2;
        var id = data.othis.parents('tr').find('.laytable-cell-1-0-0').text();
        layer.confirm('确定改变状态？', {
          icon: 3, 
          title:'提示',
          cancel:function(){
            data.elem.checked ==false?data.elem.checked=true:data.elem.checked=false;
            form.render("checkbox");
          }
        }, function (index) {
          layer.close(index);
          $.ajax({
            type: 'POST',
            url: '/yes/data/changestate',
            data: {
              id: id,
              state:state_id
            },
            dataType: "json",
            success: function (data) {
              if(data.code == 0){
                data.elem.checked ==false?data.elem.checked=true:data.elem.checked=false;
                form.render("checkbox");
              }
              layer.msg(data.msg);
            },
            error: function (data) {
              layer.msg(data.msg);
            }
          },);
        },function(index){
          data.elem.checked ==false?data.elem.checked=true:data.elem.checked=false;
          form.render("checkbox");
        });
      });

      //借款表格
      table.render({
        elem: '#borrow_lst',
        method: 'post',
        loading: true,
        id: 'borrow',
        cols: [
          [{
            field: 'price',
            title: '金额',
            align: 'center',
            edit: 'text'
          }, {
            field: 'data',
            title: '时间',
            align: 'center',
            edit: 'text'
          }, {
            toolbar: '#borrowbar',
            title: '操作',
            width: '16%',
            align: 'center',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 监听头部工具栏
      table.on('toolbar(wage_lst)', function (obj) {
        if (obj.event === 'add_wage') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['50%', '90%'],
            content: $('#wage_form'),
            success: function (layero, index) {
              $('.edit_wage_form').hide();
              $('.add_wage_form').show();
              $('.allowance').hide();
              $('.salary').hide();
            }
          });
          $('.fromreset').trigger('click');
          $('#add_worker_name').html($("<option>").val('').text('请选择姓名'));
        }
      });

      //监听工具条
      table.on('tool(wage_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除么？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/data/wageDel',
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
            skin: 'yourclass',
            area: ['50%', '80%'],
            content: $('#wage_form'),
            success: function () {
              $('.edit_wage_form').show();
              $('.add_wage_form').hide();
              $('.allowance').hide();
              $('.salary').hide();
            }
          });
          $('#add_worker_name').html($("<option>").val(data.worker_id).text(data.name));
          form.val("wage_form", {
            'id': data.id,
            "bonus": data.bonus,
            "deduct": data.deduct,
            "worker_id": data.worker_id,
            "work_id": data.work_id,
            "remark": data.remark,
            "wage": data.wage,
            "month": data.year + '-' + data.month,
          })
        } else if (obj.event == 'showborrow') {
          if (data.borrow != null) {
            layer.open({
              type: 1,
              title: false,
              closeBtn: 0,
              shadeClose: true,
              skin: 'yourclass',
              area: ['50%', '40%'],
              content: $('#borrowlst'),
              success: function () {
                table.reload('borrow', {
                  url: '/yes/data/borrowlst',
                  where: {
                    id: data.id
                  }
                });
              }
            });
          }
        } else if (obj.event == 'borrow') {
          wage_id = data.id;
          layer.open({
            type: 1,
            title: '添加借款',
            move: false,
            closeBtn: 0,
            shadeClose: true,
            skin: 'yourclass',
            area: ['40%', '40%'],
            offset: '20%',
            content: $('#borrow_form'),
          });
        }
      });

      table.on('tool(borrow_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
          layer.confirm('确定删除么？', function (index) {
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/data/delborrow',
              data: {
                id: data.id
              },
              dataType: "json",
              success: function (data) {
                if (data.code == 1) {
                  obj.del();
                }
                layer.msg(data.msg);
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        }
      });

      table.on('edit(borrow_lst)', function (obj) {
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/data/editborrow', //URL
          data: obj.data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.msg(data.msg);
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });


      // 添加借款
      form.on('submit(add_borrow_form)', function (data) {
        var data = data.field;
        data.wage_id = wage_id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/data/addborrow', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            if (data.code == 1) {
              layer.closeAll('page');
              table.reload('wage');
            }
            layer.msg(data.msg);
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
        return false;
      });



      // 添加生产单
      form.on('submit(add_wage_form)', function (data) {
        var data = data.field;
        delete data.id;
        delete data.work_id;
        var time = data.month.split('-');
        data.year = time[0];
        data.month = time[1].replace(/\b(0+)/gi, "");
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/data/wageAdd', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
            table.reload('wage');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
        return false;
      });

      // 编辑生产单
      form.on('submit(edit_wage_form)', function (data) {
        var data = data.field;
        var time = data.month.split('-');
        data.year = time[0];
        data.month = time[1].replace(/\b(0+)/gi, "");
        delete data.work_id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/data/wageEdit', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
            table.reload('wage');
          },
          error: function (data) {
            layer.msg(data.msg);
            return false;
          }
        });
      });

      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        var time = data.time.split('-');
        if (time != '') {
          data.year = time[0];
          data.month = time[1].replace(/\b(0+)/gi, "");
        } else {
          data.year = '';
          data.month = '';
        }
        delete data.time;
        delete data.work_id;
        table.reload('wage', {
          url: '/yes/data/wageSearchlst',
          where: data,
          totalRow:true,
          done: function () {
            element.render();
            var wage = $('.layui-table-total table tr td').eq(10).find('.layui-table-cell').text();
            var borrow = $('.layui-table-total table tr td').eq(5).find('.layui-table-cell').text();
            $('.layui-table-total table tr td').eq(11).find('.layui-table-cell').text(wage-borrow);
          }
        });
        return false;
      });

      // 查看底薪和补贴
      //多级联动
      form.on('select(check_salary)', function (data) {
        var value = data.value;
        $.ajax({
          type: 'POST',
          url: '/yes/worker/check_salary',
          data: {
            id: value
          },
          dataType: "json",
          success: function (data) {
            $('.allowance').show();
            $('.salary').show();
            $('#allowance').val(data.allowance);
            $('#salary').val(data.salary);
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

    });