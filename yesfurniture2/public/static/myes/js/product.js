    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'upload'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var upload = layui.upload;

      var url = window.location.href;
      var lastDigits = url.substring(url.lastIndexOf("/") + 1).match(/[0-9]*$/)[0];
      var dataid = []; //选中要删除的id
      var cost_material = [];

      $('.layui-upload-img').on('click', function () {
        var img = $(this).attr('src');
        var imgulr = img.substring(0, img.indexOf('?')+1);
        layer.open({
          type: 1,
          skin: 'layui-layer-rim', //加上边框
          area: ['350px', '350px'], //宽高
          shadeClose: true, //开启遮罩关闭
          end: function (index, layero) {
            return false;
          },
          title: false,
          closeBtn: 0,
          shadeClose: true,
          content: '<div style="text-align:center;height:100%;"><img style="width:100%;" src=' + img + '></div>'
        });
      })


      // 人工费用
      table.render({
        elem: '#cost_labor_lst',
        method: 'post',
        url: '/yes/order_product/costlabor',
        where: {
          id: lastDigits
        },
        loading: true,
        id: 'cost_labor',
        totalRow: true,
        toolbar: '#toolbarcost_labor',
        defaultToolbar: ['', '', ''],
        cols: [
          [{
            type: 'checkbox'
          }, {
            field: 'id',
            title: 'id',
            hide: true,
          }, {
            field: 'name',
            title: '名称',
            align: 'center',
            templet: function (d) {
              return d.worktype.name;
            },
          }, {
            field: 'standard',
            title: '规格',
            templet: function (d) {
              return d.dailyprice.standard;
            },
          },{
            field: 'c_price',
            title: '参考价',
            align: 'center',
            templet: function (d) {
              return d.dailyprice.price;
            },
            totalRowText: '总计'
          }, {
            field: 'price',
            title: '价格',
            edit: 'text',
            totalRow: true
          }]
        ],
        done: function () {
          element.render();
        }
      });

      //人工费用头工具栏事件
      table.on('toolbar(cost_labor_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event === 'del') {
          layer.confirm('确定删除么？', function (index) {
            layer.close(index);
            var checkdata = checkStatus.data;
            $.each(checkdata, function (index, elem) {
              dataid.push(elem.id);
            })
            $.ajax({
              type: 'POST',
              url: '/yes/order_product/delcostlabor',
              data: {
                id: dataid
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                dataid = [];
                //重载表格
                table.reload('cost_labor', {
                  url: '/yes/order_product/costlabor',
                  where: {
                    id: lastDigits
                  },
                });
              },
              error: function (data) {
                layer.msg(data.msg);
                dataid = [];
              }
            });
          });
        } else if (obj.event === 'add') {
          var worker_id = $('.cost_labortype').val();
          var standard_id = $('#type_standard').val();
          var addcost_labor = {
            product_id: lastDigits,
            worker_id: worker_id,
            standard_id: standard_id,
            price: '0',
          };
          if (worker_id == '') {
            layer.msg('请选择工种');
          } else if (standard_id == '') {
            layer.msg('请选择规格');
          } else {
            $.ajax({
              type: 'POST',
              url: '/yes/order_product/addcostlabor',
              data: addcost_labor,
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                table.reload('cost_labor', {
                  url: '/yes/order_product/costlabor',
                  where: {
                    id: lastDigits
                  },
                });
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          }
        }
      });

      //人工编辑
      table.on('edit(cost_labor_lst)', function (obj) {
        var data = {};
        data.id = obj.data.id;
        data.price = obj.data.price;
        data.product_id = obj.data.product_id;
        $.ajax({
          type: 'POST',
          url: '/yes/order_product/editcostlabor',
          data: data,
          dataType: "json",
          success: function (data) {
            layer.msg(data.msg);
            table.reload('cost_labor', {
              url: '/yes/order_product/costlabor',
              where: {
                id: lastDigits
              },
            });
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

      // 用料表格
      table.render({
        elem: '#cost_material_lst',
        method: 'post',
        url: '/yes/order_product/costmaterial',
        toolbar: '#toolbarcost_material',
        defaultToolbar: ['', '', ''],
        where: {
          id: lastDigits
        },
        loading: true,
        totalRow: true,
        id: 'cost_material',
        cols: [
          [{
            type: 'checkbox'
          }, {
            field: 'id',
            title: 'id',
            hide: true,
          }, {
            field: 'name',
            title: '名称',
            align: 'center',
            edit: 'text',
          }, {
            field: 'standard',
            title: '规格',
            edit: 'text',
          }, {
            field: 'c_prcie',
            title: '单价',
            align: 'center',
            edit: 'text',
          }, {
            field: 'used',
            title: '用量',
            align: 'center',
            edit: 'text',
            totalRowText: '总计'
          }, {
            field: 'price',
            title: '金额',
            templet: function (d) {
              return parseFloat(d.c_prcie * d.used);
            },
            width:'22%',
            totalRow: true
          }]
        ],
        done: function (res) {
          element.render();
          var profit = 0;
          $('#costmaterial .layui-table-body tbody tr').each(function () {
            var amount = $(this).find('td').eq(6).find('.layui-table-cell').text();
            profit = profit + parseFloat(amount);

          })
          $('#costmaterial .layui-table-total table tr td').eq(6).find('.layui-table-cell').text(profit);
          cost_material = res.data;
        }
      });

      //用料多级联动
      form.on('select(cost_materialtype)', function (data) {
        $.ajax({
          type: 'POST',
          url: '/yes/order_product/getcostselect',
          data: {
            name: data.value
          },
          dataType: "json",
          success: function (data) {
            $('#standard').html($("<option>").val('').text('请选择规格'));
            $.each(data, function (key, val) {
              var option1 = $("<option>").val(val.price).text(val.standard);
              $("#standard").append(option1);
            });
            form.render('select');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

      //人工多级联动
      form.on('select(cost_labortype_form)', function (data) {
        $.ajax({
          type: 'POST',
          url: '/yes/order_product/getcostlaborselect',
          data: {
            type_id: data.value
          },
          dataType: "json",
          success: function (data) {
            $('#type_standard').html($("<option>").val('').text('请选择规格'));
            $.each(data, function (key, val) {
              var option1 = $("<option>").val(val.id).text(val.standard);
              $("#type_standard").append(option1);
            });
            form.render('select');
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

      //用料头工具栏事件
      table.on('toolbar(cost_material_lst)', function (obj) {
        var checkStatus = table.checkStatus(obj.config.id);
        if (obj.event === 'del') {
          layer.confirm('确定删除么？', function (index) {
            layer.close(index);
            var checkdata = checkStatus.data;
            $.each(checkdata, function (index, elem) {
              cost_material.splice($.inArray(elem, cost_material), 1)
            })
            var material_cost = 0;
            $.each(cost_material, function (key, val) {
              material_cost += parseFloat(val.c_prcie * val.used);
            });
            $('#material_cost').val(material_cost);
            $.ajax({
              type: 'POST',
              url: '/yes/order_product/updatacost',
              data: {
                id: lastDigits,
                material_config: cost_material,
                material_cost: material_cost,
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                //重载表格
                table.reload('cost_material', {
                  data: cost_material
                });
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        } else if (obj.event === 'add') {
          var name = $('#cost_materialtype').val();
          var standard = $('#standard').siblings('.layui-form-select').find('.layui-this').text();
          var c_price = $('#standard').val();
          if (name == '') {
            layer.msg('请选择类型');
          } else if (c_price == '') {
            layer.msg('请选择规格');
          } else {
            var addcost_material = {
              name: name,
              standard: standard,
              c_prcie: c_price,
              used: '0',
            };
            cost_material.push(addcost_material);
            var material_cost = 0;
            $.each(cost_material, function (key, val) {
              material_cost += parseFloat(val.c_prcie * val.used);
            });
            $('#material_cost').val(material_cost);
            $.ajax({
              type: 'POST',
              url: '/yes/order_product/updatacost',
              data: {
                id: lastDigits,
                material_config: cost_material,
                material_cost: material_cost,
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                //重载表格
                table.reload('cost_material', {
                  data: cost_material
                });
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          }
        }
      });

      //用料
      table.on('edit(cost_material_lst)', function (obj) {
        cost_material = table.cache.cost_material;
        var material_cost = 0;
        $.each(cost_material, function (key, val) {
          material_cost += parseFloat(val.c_prcie * val.used);
        });
        $('#material_cost').val(material_cost);
        $.ajax({
          type: 'POST',
          url: '/yes/order_product/updatacost',
          data: {
            id: lastDigits,
            material_config: cost_material,
            material_cost: material_cost,
          },
          dataType: "json",
          success: function (data) {
            layer.msg(data.msg);
            table.reload('cost_material', {
              data: cost_material
            });
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

    });