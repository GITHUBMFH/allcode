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
        elem: '#complete_time',
        showBottom: false, //指定元素
      });
      //年选择器
      laydate.render({
        elem: '#year',
        type: 'year'
      });
      laydate.render({
        elem: '#order_time',
      });

      $('#togettime').on('click', function (e) { //假设 test1 是一个按钮
        laydate.render({
          elem: '#gettime',
          format: 'yyyy年MM月dd日',
          showBottom: false, //指定元素
          show: true, //直接显示
          closeStop: '#togettime',
          done: function (value, date, endDate) {
            var getcontent = $('#getcontent').val();
            if (getcontent == '') {
              var html = value;
            } else {
              var html = getcontent + '\r' + value;
            }
            $('#getcontent').val(html);
          }
        });
      });

      $('#getdone').on('click', function () {
        var getcontent = $('#getcontent').val();
        if (getcontent == '') {
          var html = '完成';
        } else {
          var html = getcontent + '\r' + '完成';
        }
        $('#getcontent').val(html);
      })

      $('#getdown').on('click', function () {
        var getcontent = $('#getcontent').val();
        var html = getcontent.replace(/完成/ig, "");
        $('#getcontent').val(html);
      })

      //第一个实例
      table.render({
        elem: '#order_lst',
        method: 'post',
        url: '/yes/order/index',
        page: true,
        limit: 50,
        loading: true,
        toolbar: '#ordertoolbar',
        id: 'order',
        cols: [
          [{
              field: 'id',
              title: 'ID',
              hide: true,
              fixed: 'left',
            },
            {
              field: 's_name',
              title: '客户',
              align: 'center',
              templet: function (d) {
                if (d.client == null) {
                  return '';
                } else {
                  return d.client.s_name;
                }
              },
              fixed: 'left',
              width: '10%',
            }, {
              field: 'project',
              title: '工程名字',
              align: 'center',
              fixed: 'left',
              width: '18%',
            }, {
              field: 'year',
              title: '生产年份',
              align: 'center',
              templet: function (d) {
                return d.year + '-' + d.num;
              },
              fixed: 'left',
              width: '10%',
            }, {
              field: 'pro_progress',
              title: '生产进度',
              align: 'center',
              templet: '#pro_progress',
              width: '10%',
            }, {
              field: 'ship_progress',
              title: '出货进度',
              align: 'center',
              templet: '#ship_progress',
              width: '10%',
            }, {
              field: 'cloth',
              align: 'center',
              title: '布料',
              width: '8%',
              event: 'cloth',
              templet: function (d) {
                var html;
                var str = String(d.cloth);
                if (str == '2') {
                  html = '<a style="color:#5FB878;cursor: pointer;">完成</a>';
                } else if (str.indexOf("完成") < 0) {
                  html = '<a style="color:#01AAED;cursor: pointer;">详情</a>';
                } else {
                  html = '<a style="color:#5FB878;cursor: pointer;">完成</a>';
                }
                return html;
              }
            }, {
              field: 'package',
              align: 'center',
              title: '包装',
              width: '8%',
              event: 'package',
              templet: function (d) {
                var html;
                var str = String(d.package);
                if (str == '2') {
                  html = '<a style="color:#5FB878;cursor: pointer;">完成</a>';
                } else if (str.indexOf("完成") < 0) {
                  html = '<a style="color:#01AAED;cursor: pointer;">详情</a>';
                } else {
                  html = '<a style="color:#5FB878;cursor: pointer;">完成</a>';
                }
                return html;
              }
            }, {
              field: 'paint',
              align: 'center',
              title: '油漆',
              width: '8%',
              event: 'paint',
              templet: function (d) {
                var html;
                var str = String(d.paint);
                if (str == '2') {
                  html = '<a style="color:#5FB878;cursor: pointer;">完成</a>';
                } else if (str.indexOf("完成") < 0) {
                  html = '<a style="color:#01AAED;cursor: pointer;">详情</a>';
                } else {
                  html = '<a style="color:#5FB878;cursor: pointer;">完成</a>';
                }
                return html;
              }
            }, {
              field: 'hardware',
              align: 'center',
              title: '五金',
              width: '8%',
              event: 'hardware',
              templet: function (d) {
                var html;
                var str = String(d.hardware);
                if (str == '2') {
                  html = '<a style="color:#5FB878;cursor: pointer;">完成</a>';
                } else if (str.indexOf("完成") < 0) {
                  html = '<a style="color:#01AAED;cursor: pointer;">详情</a>';
                } else {
                  html = '<a style="color:#5FB878;cursor: pointer;">完成</a>';
                }
                return html;
              },
            }, {
              field: 'order_time',
              title: '下单时间',
              align: 'center',
              width: '10%',
            }, {
              field: 'complete_time',
              title: '完成时间',
              align: 'center',
              width: '10%',
              templet: function (d) {
                var time;
                if (d.complete_time == null) {
                  time = '到目前为止';
                } else if (d.complete_time == '0000-00-00') {
                  time = '到目前为止';
                } else {
                  time = d.complete_time;
                }
                return time;
              }
            }, {
              field: 'cost_time',
              title: '耗时',
              align: 'center',
              sort: true,
              width: '10%',
              templet: function (d) {
                var date1 = new Date(d.order_time); //开始时间
                if (d.complete_time == null) {
                  var date2 = new Date();
                } else if (d.complete_time == '0000-00-00') {
                  var date2 = new Date();
                } else {
                  var date2 = new Date(d.complete_time); //结束时间
                }
                var date3 = date2.getTime() - date1.getTime();
                var days = Math.floor(date3 / (24 * 3600 * 1000));
                return days + '天';
              }
            }, {
              toolbar: '#orderbar',
              title: '操作',
              align: 'center',
              fixed: 'right',
              width: '10%',
            }
          ]
        ],
        done: function () {
          element.render();
        }
      });


      // 行点击跳转
      table.on('rowDouble(order_lst)', function (obj) {
        var data = obj.data;
        var time = data.order_time;
        var ordernum = 'YS' + time.replace('-', '').replace('-', '') + '-' + data.num;
        var url = '/yes/order_product/index/' + data.id + '/' + ordernum;
        var id = md5(url);
        parent.element.tabAdd('xbs_tab', {
          title: ordernum,
          content: '<iframe tab-id="' + id + '" frameborder="0" src="' + url + '" scrolling="yes" class="layadmin-iframe"></iframe>',
          id: id
        })
        parent.element.tabChange('xbs_tab', id);
      });

      //监听工具条
      table.on('tool(order_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除么？', function (index) {
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/order/delPost',
              data: {
                id: data.id
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                if (data.code > 0) {
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
            skin: 'yourclass',
            area: ['70%', '70%'],
            content: $('#order_form'),
            success: function () {
              $('.edit_order_form').show();
              $('.add_order_form').hide();
            }
          });
          form.val("order_form", {
            'id': data.id,
            "s_name": data.client.id,
            "project": data.project,
            "year": data.year,
            "num": data.num,
            "remark": data.remark,
            "order_time": data.order_time,
            "complete_time": data.complete_time
          })
        } else if (obj.event == 'cloth') {
          layer.open({
            type: 1,
            title: false,
            shadeClose: true,
            closeBtn: 0,
            title: '面料跟进记录',
            area: ['50%', '50%'],
            content: $('#material_form'),
          });
          form.val("material_form", {
            'id': data.id,
            "name": 'cloth',
            "content": data.cloth,
          })
        } else if (obj.event == 'package') {
          layer.open({
            type: 1,
            title: false,
            shadeClose: true,
            closeBtn: 0,
            title: '面料跟进记录',
            area: ['50%', '50%'],
            content: $('#material_form'),
          });
          form.val("material_form", {
            'id': data.id,
            "name": 'package',
            "content": data.package,
          })
        } else if (obj.event == 'paint') {
          layer.open({
            type: 1,
            title: false,
            shadeClose: true,
            closeBtn: 0,
            title: '面料跟进记录',
            area: ['50%', '50%'],
            content: $('#material_form'),
          });
          form.val("material_form", {
            'id': data.id,
            "name": 'paint',
            "content": data.paint,
          })
        } else if (obj.event == 'hardware') {
          layer.open({
            type: 1,
            title: false,
            shadeClose: true,
            closeBtn: 0,
            title: '面料跟进记录',
            area: ['50%', '50%'],
            content: $('#material_form'),
          });
          form.val("material_form", {
            'id': data.id,
            "name": 'hardware',
            "content": data.hardware,
          })
        }
      });

      // 用料跟进日志
      form.on('submit(add_material_form)', function (data) {
        var data = data.field;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/order/order_des', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
            table.reload('order');
          },
          error: function (data) {
            layer.msg(data.msg);
            table.reload('order');
          }
        });
        return false;
      });

      //监听头部工作栏
      table.on('toolbar(order_lst)', function (obj) {
        if (obj.event === 'add_attend') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['70%', '70%'],
            content: $('#order_form')
          });
          $('.fromreset').trigger('click');
          $('.edit_order_form').hide();
          $('.add_order_form').show();
        }
      });

      // 添加生产单
      form.on('submit(add_order_form)', function (data) {
        var data = data.field;
        data.client_id = data.s_name;
        delete data.id;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/order/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
            table.reload('order');
          },
          error: function (data) {
            layer.msg(data.msg);
            table.reload('order');
          }
        });
        return false;
      });

      // 编辑生产单
      form.on('submit(edit_order_form)', function (data) {
        var data = data.field;
        data.client_id = data.s_name;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/order/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.closeAll('page');
            layer.msg(data.msg);
            table.reload('order');
          },
          error: function (data) {
            layer.msg(data.msg);
            table.reload('order');
          }
        });
        return false;
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
        table.reload('order', {
          url: '/yes/order/searchlst',
          where: data,
          // done: function () {
          //   element.render();
          //   // delete this.where;
          // }
        });
        return false;
      });

    });