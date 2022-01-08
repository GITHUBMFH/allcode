    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var laydate = layui.laydate;

      var getinformation = parent.layui.$('#getinformation').val();

      laydate.render({
        elem: '#search_time1',
        range: '至',
      });
      //数据表单实例
      table.render({
        elem: '#recorddetails_lst',
        method: 'post',
        url: '/yes/record_details/index',
        where: {
          id: getinformation
        },
        loading: true,
        toolbar: '#recorddetailstoolbar',
        data: [{}],
        id: 'idrecorddetails',
        totalRow: true,
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'type_name',
            title: '类型',
            align: 'center',
          }, {
            field: 'name',
            title: '名称',
            align: 'center',
            edit: 'text',
          }, {
            field: 'num',
            title: '数量',
            align: 'center',
            edit: 'text'
          }, {
            field: 'unit_name',
            title: '单位',
            align: 'center',
            edit: 'text'
          }, {
            field: 'oneprice',
            title: '单价',
            align: 'center',
            edit: 'text',
            totalRowText: "合计：",
          }, {
            field: 'price',
            title: '总金额',
            align: 'center',
            edit: 'text',
            totalRow: true,
          }, {
            field: 'size',
            title: '规格',
            align: 'center',
            edit: 'text'
          }, {
            field: 'product_id',
            title: '用途',
            align: 'center',
            width: '12%',
            templet: function (d) {
              if (d.order_num > 0) {
                if (d.pro_num > 0) {
                  return 'YS' + d.year + '-' + d.order_num + '-' + d.pro_num;
                } else {
                  return 'YS' + d.year + '-' + d.order_num;
                }
              } else {
                return '暂无';
              }
            }
          }, {
            align: 'center',
            toolbar: '#recorddetailsbar',
            title: '操作',
          }]
        ],
        done: function (res) {
          element.render();
        }
      });

      // 点击添加进账
      table.on('toolbar(recorddetails_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event === 'add_recorddetails') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['50%', '99%'],
            content: $('#add_recorddetails_form'),
            success: function (layero, index) {
              $('.edit_recorddetails_form').hide();
              $('.add_recorddetails_form').show();
            }
          });
          $('.fromreset').trigger('click');
          $('#produce_num_form').html($("<option>").val('').text('请选择生产单'));
          $('#produce_product_form').html($("<option>").val('').text('请选择产品序号'));
        }
      });

      // 监听顶级菜单修改
      form.on('submit(add_recorddetails_form)', function (data) {
        var data = data.field;
        data.record_id = getinformation,
          delete data.id;
        data.num = data.number;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/record_details/addPost',
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
        });
      });

      // 监听顶级菜单修改
      form.on('submit(edit_recorddetails_form)', function (data) {
        var data = data.field;
        data.num = data.number;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/record_details/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
        });
      });

      table.on('edit(recorddetails_lst)', function (obj) {
        var data = obj.data;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/record_details/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
        });
      });

      //监听工具条
      table.on('tool(recorddetails_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除么？', function (index) {
            obj.del();
            layer.close(index);
            $.ajax({
              type: 'POST',
              url: '/yes/record_details/delPost',
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
            area: ['50%', '99%'],
            content: $('#add_recorddetails_form'),
            success: function (layero, index) {
              $('.edit_recorddetails_form').show();
              $('.add_recorddetails_form').hide();
            }
          });
          if (data.order_id > 0) {
            $('#produce_num_form').html($("<option>").val(data.order_id).text(data.order_num));
            if(data.product_id > 0) {
              $('#produce_product_form').html($("<option>").val(data.product_id).text(data.pro_num));
            }
          }
          form.val("recorddetails_form", {
            "id": data.id,
            "name": data.name,
            "number": data.num,
            "unit": data.unit,
            "price": data.price,
            "oneprice": data.oneprice,
            "size": data.size,
            "product_id": data.product_id,
            "year": data.year,
            "type_id": data.type_id,
            "data_id": data.data_id,
          });
        }
      });

      //编辑生产单多级联动
      form.on('select(produce_year_form)', function (data) {
        getnum(data.value, '#produce_num_form', '#produce_product_form');
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
          data: {
            year: value
          },
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
        table.reload('idrecorddetails', {
          url: '/yes/record_details/searchlst',
          where: data,
        });
        return false;
      });

      $('#details_number').bind('input propertychange', function () {
        var num = $('#details_number').val();
        var oneprice = $('#details_oneprice').val();
        $('#details_price').val(num * oneprice);
      })

      $('#details_oneprice').bind('input propertychange', function () {
        var num = $('#details_number').val();
        var oneprice = $('#details_oneprice').val();
        $('#details_price').val(num * oneprice);
      })

    });