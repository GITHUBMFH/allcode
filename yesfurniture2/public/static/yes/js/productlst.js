    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'upload'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var upload = layui.upload;

      var lastDigits; //产品id


      // 产品表格
      table.render({
        elem: '#productlst_lst',
        method: 'post',
        url: '/yes/productlst/index',
        loading: true,
        toolbar: '#productlsttoolbar',
        id: 'productlst',
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            templet: '#clickimg',
            field: 'img',
            title: '图片',
            width: '10%',
            align: 'center',
          }, {
            field: 'size',
            align: 'center',
            title: '类型',
            templet: '#typetem'
          }, {
            field: 'size',
            align: 'center',
            title: '尺寸',
          }, {
            field: 'title',
            align: 'center',
            title: '产品名称',
          }, {
            align: 'center',
            title: '生产单',
            templet: function (d) {
              if (d.product_id == '') {
                return '无记录';
              } else {
                return d.year + '-' + d.num + '-' + d.pro_num;
              }
            }
          }, {
            field: 'price',
            align: 'center',
            title: '报价',
          }, {
            field: 'pro_dec',
            align: 'center',
            title: '产品描述',
          }, {
            field: 'remark',
            align: 'center',
            title: '备注',
          }, {
            toolbar: '#productlstbar',
            align: 'center',
            title: '操作',
            width: '10%',
          }]
        ],
        done: function () {
          element.render();
        }
      });


      //点击添加产品
      $('#add_productlst').on('click', function () {
        layer.open({
          type: 1,
          title: false,
          closeBtn: 0,
          shadeClose: true,
          area: ['80%', '90%'],
          content: $('#productlst_form'),
          success: function () {
            $('.add_productlst_form').show();
            $('.edit_productlst_form').hide();
            $('.uploadbox').hide();
          }
        });
        $('.fromreset').trigger('click');
        $('#produce_num_form').html($("<option>").val('').text('请选择生产单'));
        $('#produce_product_form').html($("<option>").val('').text('请选择产品序号'));
      });

      // 监听表格 产品添加
      form.on('submit(add_productlst_form)', function (data) {
        var data = data.field;
        delete data.id;
        delete data.file;
        delete data.year;
        delete data.client_id;
        delete data.num;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/productlst/addPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function () {
            layer.msg(data.msg);
          },
          error: function () {
            layer.msg(data.msg);
          }
        });
      });

      // 监听表格 产品添加
      form.on('submit(edit_productlst_form)', function (data) {
        var data = data.field;
        var lenght = $('.lst_box').lengh;
        delete data.file;
        delete data.year;
        delete data.client_id;
        delete data.num;
        data.img_url = '';
        $('.lst_box').each(function (i, e) {
          if (i < lenght - 1) {
            data.img_url += $(this).find('img').attr('data-key') + ',';
          } else {
            data.img_url += $(this).find('img').attr('data-key');
          }
        })
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/productlst/editPost', //URL
          data: data, //传递的参数
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.msg(data.msg);
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

      //监听工具条
      table.on('tool(productlst_lst)', function (obj) {
        var data = obj.data;
        product_id = data.id;
        if (obj.event === 'del') { //删除生产单
          layer.confirm('确定删除么？', function (index) {
            layer.close(index);
            layer.load(2);
            $.ajax({
              type: 'POST',
              url: '/yes/productlst/delPost',
              data: {
                id: data.id
              },
              dataType: "json",
              success: function (data) {
                layer.msg(data.msg);
                obj.del();
                layer.closeAll('loading');
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        } else if (obj.event === 'edit') { //编辑生产单
          lastDigits = data.id;
          layer.open({
            type: 1,
            title: false,
            closeBtn: 0,
            shadeClose: true,
            skin: 'yourclass',
            area: ['80%', '90%'],
            content: $('#productlst_form'),
            success: function () {
              // 情况图片
              $('#other_img').html('');
              //图片
              if (data.img_url[0] != '') {
                $.each(data.img_url, function (i, e) {
                  var imghtml = '<div class="lst_box"><img src="http://resource.yasfurniture.cn/' + e + '?imageView2/1/w/100/h/100/format/webp/q/75" class="layui-upload-img" style="width:100px;margin-right:10px" data-key=' + e + '><div class="show_cz"><a class="layui-btn layui-btn-xs layui-btn-normal show_big">大图</a><a class="layui-btn layui-btn-xs layui-btn-danger show_del">删除</a></div></div>';
                  $('#other_img').append(imghtml);

                })
              }
              //文件
              $('.uploadbox').show();
              if (data.file_url != null) {
                table.reload('fileid', {
                  data: data.file_url
                });
              }
              //图片操作
              imghover();
              //按钮显示
              $('.add_productlst_form').hide();
              $('.edit_productlst_form').show();

              //多图片上传
              upload.render({
                elem: '#otherimg',
                url: '/yes/productlst/uploadmulimg',
                data: {
                  id: data.id,
                },
                accept:'images',
                acceptMime: 'image/*',
                multiple: true,
                before: function (obj) {
                  layer.load(2);
                },
                done: function (res) {
                  //上传完毕
                  layer.closeAll('loading');
                  if (res.code == 0) {
                    $.each(res.data, function (e, v) {
                      $('#other_img').append('<div class="lst_box"><img src="http://resource.yasfurniture.cn/' + v + '?imageView2/1/w/100/h/100/format/webp/q/75" class="layui-upload-img" style="width:100px;margin-right:10px" data-key=' + v + '><div class="show_cz"><a class="layui-btn layui-btn-xs layui-btn-normal show_big">大图</a><a class="layui-btn layui-btn-xs layui-btn-danger show_del">删除</a></div></div>')
                    })
                  }
                  //图片操作
                  imghover();
                }
              });

              //多文件列表示例
              uploadListIns = upload.render({
                elem: '#other_file',
                url: '/yes/productlst/uploadfile',
                data: {
                  id: data.id,
                },
                accept: 'file',
                multiple: true,
                before: function (obj) {
                  layer.load(2);
                },
                done: function (res, index, upload) {
                  layer.closeAll('loading');
                  layer.msg(res.msg)
                  if (res.code == 0) { //上传成功
                    table.reload('fileid', {
                      data: res.data
                    });
                    return false;
                  }
                }
              });
            }
          });
          $('#produce_num_form').html($("<option>").val(data.order_id).text(data.num));
          $('#produce_product_form').html($("<option>").val(data.product_id).text(data.pro_num));
          //表单重载
          form.val("productlst_form", {
            'id': data.id,
            "type_id": data.type_id,
            "title": data.title,
            "size": data.size,
            "price": data.price,
            "pro_dec": data.pro_dec,
            "remark": data.remark,
            "client_id": data.client_id,
            "year": data.year,
          })
        } else if (obj.event === 'clickimg') {
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
              content: '<div style="text-align:center"><img style="width:100%" src="http://resource.yasfurniture.cn/' + data.img_url[0] + '" /></div>'
            });
          }
          return false;
        }
      });

      // 图片操作
      function imghover() {
        //多图片hover效果
        $('.lst_box img').hover(function () {
          $(this).siblings('.show_cz').stop().fadeIn();
          return false;
        })

        //多图片hover效果 
        $('.show_cz').hover(function () {
          return false;
        }, function () {
          $('.show_cz').stop().fadeOut();
          return false;
        })

        $('.show_big').on('click', function () {
          var img = $(this).parents('.lst_box').find('img').attr('src');
          var imgulr = img.substring(0, img.indexOf('?') + 1);
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
            content: '<div style="text-align:center"><img style="width:100%" src=' + imgulr + '/></div>'
          });
        })

        // 多图片删除
        $('#other_img .lst_box .show_cz .show_del').unbind("click").on('click', function () {
          var key = $(this).parents('.lst_box').find('img').attr('data-key');
          layer.load(2);
          var _this = $(this);
          $.ajax({
            type: 'POST', //请求类型
            url: '/yes/productlst/delmulimgPost', //URL
            data: {
              id: lastDigits,
              key: key
            },
            dataType: "json", //返回的数据类型
            success: function (data) {
              layer.msg(data.msg);
              layer.closeAll('loading');
              if (data.code = '0') {
                _this.parents('.lst_box').remove();
              }
            },
            error: function (data) {
              layer.msg(data.msg);
            }
          });
          return false;
        })
      }

      //文件列表
      table.render({
        elem: '#otherfile',
        loading: true,
        id: 'fileid',
        data: [],
        cols: [
          [{
            field: 'url',
            title: '名称',
            align: 'center',
            width: '40%',
          }, {
            field: 'remark',
            title: '备注',
            align: 'center',
            edit: 'text'
          }, {
            align: 'center',
            toolbar: '#filebar',
            title: '操作',
          }]
        ],
        done: function () {
          element.render();
        }
      });


      // 监听表格工具
      table.on('tool(otherfile)', function (obj) {
        var data = obj.data;
        if (obj.event === 'del') {
          layer.confirm('确定删除么？', function (index) {
            layer.load(2);
            $.ajax({
              type: 'POST', //请求类型
              url: '/yes/productlst/delmulfilePost', //URL
              data: {
                id: lastDigits,
                key: data.url
              },
              dataType: "json", //返回的数据类型
              success: function (data) {
                layer.msg(data.msg);
                layer.closeAll('loading');
                table.reload('fileid', {
                  data: data.data
                });
              },
              error: function (data) {
                layer.msg(data.msg);
                layer.closeAll('loading');
              }
            });
          });
        }
        if (obj.event === 'down') {
          layer.confirm('确定下载？', function (index) {
            layer.close(index);
            $.ajax({
              type: 'POST', //请求类型
              url: '/yes/productlst/getdown', //URL
              data: {
                key: data.url
              },
              dataType: "json", //返回的数据类型
              success: function (data) {
                $('#downfile').attr('href', data);
                $('#downfile')[0].click();
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        }
      });

      //监听编辑
      table.on('edit(otherfile)', function (obj) {
        var data = obj.data;
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/productlst/changeremark', //URL
          data: {
            id: lastDigits,
            file_url: JSON.stringify(table.cache.fileid),
          },
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.msg(data.msg);
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

      // 搜索
      form.on('submit(search_lst_from)', function (data) {
        var data = data.field;
        table.reload('productlst', {
          url: '/yes/productlst/searchlst',
          where: data,
        });
        return false;
      });

    });