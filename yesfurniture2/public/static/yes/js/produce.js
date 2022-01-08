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
        elem: '#produce_time',
        showBottom: false
      });
      //数据表单实例
      table.render({
        elem: '#produce_lst',
        method: 'post',
        url: '/yes/produce/index',
        loading: true,
        // 开启工具栏
        toolbar: '#producetoolbar',
        page:true,
        limit: 20,
        id: 'idproduce',
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'client_name',
            title: '客户',
            align: 'center'
          }, {
            field: 'year',
            title: '年份',
            align: 'center'
          }, {
            field: 'num',
            title: '生产单',
            align: 'center'
          }, {
            field: 'pro_num',
            title: '产品序号',
            align: 'center'
          }, {
            field: 'product_num',
            title: '生产数量',
            align: 'center'
          }, {
            field: 'product_data',
            title: '生产日期',
            align: 'center'
            // templet: '生产日期'
          }, {
            align: 'center',
            toolbar: '#producebar',
            title: '操作',
          }]
        ],
        done: function () {
          element.render();
        }
      });

      // 添加生产记录
      table.on('toolbar(produce_lst)', function (obj) {
        if (obj.event === 'add_produce') {
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            area: ['50%', '70%'],
            content: $('#add_produce_form'),
            success: function (layero, index) {
              $('.edit_produce_form').hide();
              $('.add_produce_form').show();
            }
          });
        }
        $('.fromreset').trigger("click");
        $('#produce_num_form').html($("<option>").val('').text('请选择生产单'));
        $('#produce_product_form').html($("<option>").val('').text('请选择产品序号'));
      });

      // 监听生产记录
      form.on('submit(add_produce_form)', function (data) {
        var data = data.field;
        delete data.id;
        delete data.year;
        delete data.client_id;
        delete data.client_name;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/produce/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success:function(){
            table.reload('idproduce');
            layer.closeAll();
            layer.msg('添加成功'); 
          }
        });
        return false;
      });

      // 监听生产记录修改
      form.on('submit(edit_produce_form)', function (data) {
        var data = data.field;
        delete data.year;
        delete data.client_id;
        delete data.client_name;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/produce/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success:function(){
            table.reload('idproduce');
            layer.closeAll();
            layer.msg('修改成功'); 
          }
        });
        return false;
      });

      //监听生产记录工具条
      table.on('tool(produce_lst)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除生产记录么？', function (index) {
            $.ajax({
              type: 'POST',
              url: '/yes/produce/delPost',
              data: {
                id: data.id
              },
              dataType: "json",
              success: function (data) {
                obj.del();
                layer.close(index);
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
            area: ['50%', '70%'],
            content: $('#add_produce_form'),
            success: function (layero, index) {
              $('.edit_produce_form').show();
              $('.add_produce_form').hide();
            }
          });
          $('#produce_num_form').html($("<option>").val(data.order_id).text(data.num));
          $('#produce_product_form').html($("<option>").val(data.product_id).text(data.pro_num));
          form.val("produce_form", {
            "id": data.id,
            "year": data.year,
            "num": data.order_id,
            "product_id": data.product_id,
            "product_num": data.product_num,
            "product_data": data.product_data,
            "client_id": data.client_id,
          });
        }
      });

      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        if(data.time!=''){
          var time = data.time.split('至');
          data.starttime = time[0].trim();
          data.endtime = time[1].trim();
        }else{
          data.starttime= '';
          data.endtime= '';
        }
        delete data.time;
        table.reload('idproduce', {
          url: '/yes/produce/searchlst',
          where:data,
        });
        return false;
      });

    });