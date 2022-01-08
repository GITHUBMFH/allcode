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

      // 显示图片操作
      $('.img_box img').hover(function () {
        $('.eidt_btm').stop().fadeIn();
        return false;
      })

      // 显示图片操作
      $('.eidt_btm').hover(function () {
        return false;
      }, function () {
        $('.eidt_btm').stop().fadeOut();
        return false;
      })

      //主图替换点击
      $('.btm_box .change').on('click', function () {
        $('#uploadimg').trigger('click');
      })

      //上传主图片
      var uploadimg = upload.render({
        elem: '#uploadimg',
        url: '/yes/product/uploadimg',
        data: {
          id: lastDigits
        },
        choose: function (obj) {
          obj.preview(function (index, file, result) {
            firstimg = index;
            $('#preimg').show().attr('src', result); //图片链接（base64）
          });
        },
        before: function (obj) {
          layer.load(2);
        },
        done: function (res) {
          layer.closeAll('loading');
          //上传完毕回调
          if (res.code > 0) {
            return layer.msg('上传失败');
          } else {
            return layer.msg('上传成功');
          }
        },
      });

      //删除主图片
      $('.btm_box .del').on('click', function () {
        layer.load(2);
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/product/deloneimgPost', //URL
          data: {
            id: lastDigits
          },
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.msg(data.msg);
            layer.closeAll('loading');
            if (data.code = '0') {
              $('#preimg').hide();
            }
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
        return false;
      })


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

      $('.show_big').on('click',function(){
        var img = $(this).parents('.lst_box').find('img').attr('src');
        var imgulr = img.substring(0, img.indexOf('?')+1);
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
          content: '<div style="text-align:center"><img src='+imgulr+'/></div>'
        });
      })

      // 多图片删除
      $('.show_del').on('click', function () {
        var id = $(this).parents('.lst_box').find('img').attr('data-id');
        var key = $(this).parents('.lst_box').find('img').attr('data-key');
        layer.load(2);
        var _this = $(this);
        $.ajax({
          type: 'POST', //请求类型
          url: '/yes/product/delmulimgPost', //URL
          data: {
            id: id,
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

      //多图片上传
      upload.render({
        elem: '#otherimg',
        url: '/yes/product/uploadmulimg',
        data: {
          id: lastDigits
        },
        multiple: true,
        before: function (obj) {
          layer.load(2);
        },
        done: function (res) {
          //上传完毕
          layer.closeAll('loading');
          if (res.code == 0) {
            window.location.reload()
            // $.each(res.data, function (e, v) {
            //   $('#other_img').append('<div class="lst_box"><img src="http://resource.yasfurniture.cn/' + v.file_url + '?imageView2/1/w/100/h/100/format/webp/q/75" class="layui-upload-img" style="width:100px;margin-right:10px" data-id=' + v.id + ' data-key=' + v.file_url + '><div class="show_cz"><a class="layui-btn layui-btn-xs layui-btn-normal show_big">大图</a><a class="layui-btn layui-btn-xs layui-btn-danger show_del">删除</a></div></div>')
            // })
          }
        }
      });

      //数据表单实例
      table.render({
        elem: '#otherfile',
        method: 'post',
        url: '/yes/product/filelst',
        where: {
          id: lastDigits
        },
        loading: true,
        id: 'fileid',
        cols: [
          [{
            field: 'id',
            title: 'ID',
            hide: true
          }, {
            field: 'file_url',
            title: '名称',
            align: 'center'
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


      //多文件列表示例
      uploadListIns = upload.render({
        elem: '#other_file',
        url: '/yes/product/uploadfile',
        data: {
          id: lastDigits
        },
        accept: 'file',
        multiple: true,
        before: function (obj) {
          layer.load(2);
        },
        done: function (res, index, upload) {
          layer.closeAll('loading');
          layer.msg(res.msg)
          if (res.code == 1) { //上传成功
            table.reload('fileid');
            return false;
          }
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
              url: '/yes/product/delmulimgPost', //URL
              data: {
                id: data.id,
                key: data.file_url
              },
              dataType: "json", //返回的数据类型
              success: function (data) {
                layer.msg(data.msg);
                layer.closeAll('loading');
                table.reload('fileid');
              },
              error: function (data) {
                layer.msg(data.msg);
              }
            });
          });
        }
        if (obj.event === 'down') {
          layer.confirm('确定下载？', function (index) {
            layer.close(index);
            $.ajax({
              type: 'POST', //请求类型
              url: '/yes/product/getdown', //URL
              data: {
                key: data.file_url
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
          url: '/yes/product/changeremark', //URL
          data: data,
          dataType: "json", //返回的数据类型
          success: function (data) {
            layer.msg(data.msg);
          },
          error: function (data) {
            layer.msg(data.msg);
          }
        });
      });

    });