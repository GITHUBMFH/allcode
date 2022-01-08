    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'upload', 'laydate'], function () {
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

      // 产品表格
      table.render({
        elem: '#progress_lst',
        method: 'post',
        url: '/yes/order_product/progress',
        loading: true,
        page: true,
        limit: 20,
        toolbar: '#progresstoolbar',
        id: 'progress',
        cols: [
          [{
            type: 'checkbox',
            title: '排序',
          }, {
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'pro_num',
            align: 'center',
            width: '30%',
            title: '序号',
            templet: function (d) {
              return 'YS' + d.order_year + d.order_num + '-' + d.pro_num;
            }
          }, {
            toolbar: '#clickimg',
            field: 'img',
            title: '图片',
            width: '12%',
            align: 'center',
            edit: 'text',
          }, {
            field: 'amount',
            width: '6%',
            align: 'center',
            title: '总数',
          }, {
            field: 'task',
            align: 'center',
            title: '任务情况',
            width: '52%',
            toolbar: '#task',
          }]
        ],
        done: function (d) {
          var html = "<p style='text-align: center;font-size: 18px;'>项目名称:" + d.project + "</p>" + "<p style='color: red;text-align: center;font-size: 16px;'>" + d.remark;
          $('tr').find('th[data-field="project"]').html(html);
          element.render();
        }
      });


      //监听工具条
      table.on('tool(progress_lst)', function (obj) {
        var data = obj.data;
        product_id = data.id;
        if (obj.event === 'clickimg') {
          if (data.img !== '' && data.img !== 'null') {
            layer.open({
              type: 1,
              skin: 'layui-layer-rim', //加上边框
              area: ['50%', '70%'], //宽高
              shadeClose: true, //开启遮罩关闭
              end: function (index, layero) {
                return false;
              },
              title: false,
              closeBtn: 0,
              shadeClose: true,
              content: '<div style="text-align:center"><img style="width:100%;height:auto;" src="http://resource.yasfurniture.cn/' + data.img + '" /></div>'
            });
          }
          return false;
        } else if (obj.event === 'task') {
          var work_id = $(this).attr('data-id');
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['30%', '50%'],
            content: $('#taskbox'),
            success: function () {
              table.reload('idtask', {
                url: '/yes/task/check',
                where: {
                  product_id: data.id,
                  work_id: work_id
                },
              });
            }
          });
        }
      });

      //任务分配弹框
      table.render({
        elem: '#task_lst',
        method: 'post',
        loading: true,
        id: 'idtask',
        cols: [
          [{
            field: 'work_id',
            title: 'ID',
            hide: true
          }, {
            field: 'name',
            title: '姓名',
            align: 'center'
          }, {
            field: 'task_num',
            title: '分配数量',
            align: 'center',
            templet: function (d) {
              if (d.task_num == null) {
                return '0';
              } else {
                return d.task_num;
              }
            }
          }, {
            field: 'pro_num',
            title: '完成数量',
            align: 'center',
            templet: function (d) {
              if (d.pro_num == null) {
                return '0';
              } else {
                return d.pro_num;
              }
            }
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 下发任务
      table.on('toolbar(progress_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event == 'print_singer_sworker') {
          var worker_id = $('#worker_name2').val();
          var checkdata = checkStatus.data;
          if (checkdata.length < 1) {
            layer.msg('请选择产品');
          } else if (worker_id == '') {
            layer.msg('请选择人员');
          } else {
            layer.open({
              type: 1,
              title: false,
              closeBtn: 0,
              shadeClose: true,
              area: ['80%', '90%'],
              content: $('#p_worker'),
              success: function () {
                table.reload('idworkerlst', {
                  data: checkdata,
                });
              },
            });
          }
        }
      });

      $('#print_singer_sworker2').on('click', function () {
        $('#print_singer_sworker').trigger('click');
      })

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

        table.reload('progress', {
          done: function () {
            element.render();
            delete this.where;
            table.reload('progress', {
              url: '/yes/order_product/progresssearchlst',
              where: data,
              done: function () {
                element.render();
              }
            });
          }
        });
        return false;
      });

      table.render({
        elem: '#p_worker_lst',
        loading: true,
        id: 'idworkerlst',
        limit: 20,
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'pro_num',
            align: 'center',
            title: '序号',
            templet: function (d) {
              return 'YS' + d.order_year + d.order_num + '-' + d.pro_num;
            }
          }, {
            toolbar: '#clickimg',
            field: 'img',
            title: '图片',
            align: 'center',
            edit: 'text',
          }, {
            field: 'amount',
            align: 'center',
            title: '总数',
            edit: true
          }, {
            field: 'task',
            align: 'center',
            title: '任务情况',
            width: '52%',
            toolbar: '#task',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      $('#end_p_worker_lst').on('click', function () {
        var dataid = [];
        var amount = [];
        $.each(table.cache.idworkerlst, function (index, elem) {
          dataid.push(elem.id);
          amount.push(elem.amount);
        })
        var worker_id = $('#worker_name2').val();
        var params = {
          "worker_id": worker_id,
          "dataid": dataid,
          "amount": amount
        };
        var url = "/yes/product/getsingerproduct";
        post(url, params);

        var data = []
        var myDate = new Date;
        var year = myDate.getFullYear(); //获取当前年
        var mon = myDate.getMonth() + 1; //获取当前月
        var date = myDate.getDate();
        var time = year + '-' + mon + '-' + date;
        $.each(table.cache.idworkerlst, function (index, value) {
          var result = {};
          result.product_id = value.id;
          result.worker_id = worker_id
          result.num = value.amount;
          result.date = time;
          data.push(result);
        });

        layer.msg('是否插入到生产任务', {
          time: 0,
          btn: ['确定', '取消'],
          yes: function (index) {
            layer.close(index);
            $.ajax({
              type: 'POST', //请求类型
              url: '/yes/task/alladdPost', //URL
              data: {
                data: data
              }, //传递的参数
              dataType: "json", //返回的数据类型
              success: function (d) {
                layer.msg(d.msg);
              }
            });
          }
        });
      })

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
    });