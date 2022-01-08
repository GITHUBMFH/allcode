    // 加载表格元素
    layui.use(['form', 'jquery'], function () {
      var $ = layui.jquery;
      var form = layui.form;

      //生产单多级联动
      form.on('select(spare_year_form)', function (data) {
        var res = {};
        res.year = $('#spare_year_form').val();
        res.client_id = $('#spare_client_form').val();
        getnum(res, '#spare_num_form', '#spare_product_form');
      });

      //产品多级联动
      form.on('select(spare_num_form)', function (data) {
        getproduct(data.value, '#spare_product_form');
      });

      //编辑生产单多级联动
      form.on('select(produce_year_form)', function (data) {
        var res = {};
        res.year = $('#produce_year_form').val();
        res.client_id = $('#produce_client_form').val();
        getnum(res, '#produce_num_form', '#produce_product_form');
      });

      //编辑产品多级联动
      form.on('select(produce_num_form)', function (data) {
        getproduct(data.value, '#produce_product_form');
      });

      // 获取生产单
      function getnum(value, option, option1) {
        $.ajax({
          type: 'POST',
          url: '/yes/spare/getordernum',
          data: value,
          dataType: "json",
          success: function (data) {
            $(option).html($("<option>").val('').text('请选择生产单'));
            $(option1).html($("<option>").val('').text('请选择产品序号'));
            $.each(data, function (key, val) {
              var option1 = $("<option>").val(val.order_id).text(val.num);
              $(option).append(option1);
            });
            form.render('select');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      }

      // 获取产品序号
      function getproduct(value, option) {
        $.ajax({
          type: 'POST',
          url: '/yes/spare/getproductnum',
          data: {
            id: value
          },
          dataType: "json",
          success: function (data) {
            $(option).html($("<option>").val('').text('请选择产品序号'));
            $.each(data, function (key, val) {
              var option1 = $("<option>").val(val.product_id).text(val.pro_num);
              $(option).append(option1);
            });
            form.render('select');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      }

      //多级联动
      form.on('select(worker_name)', function (data) {
        getworker(data.value, '#worker_name');
      });

      form.on('select(worker_name2)', function (data) {
        getworker(data.value, '#worker_name2');
      });
      //多级联动
      form.on('select(add_worker_name)', function (data) {
        getworker(data.value, '#add_worker_name');
      });

      //通过职位获取员工
      function getworker(value, option) {
        $.ajax({
          type: 'POST',
          url: '/yes/data/getworker',
          data: {
            id: value
          },
          dataType: "json",
          success: function (data) {
            $(option).html($("<option>").val('').text('请选择姓名'));
            $.each(data, function (key, val) {
              var option1 = $("<option>").val(val.id).text(val.name);
              $(option).append(option1);
            });
            form.render('select');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      }
    });