    // 加载表格元素
    layui.use(['form', 'layer', 'table', 'jquery', 'element', 'upload', 'laydate'], function () {
      var table = layui.table;
      var layer = layui.layer;
      var element = layui.element;
      var $ = layui.jquery;
      var form = layui.form;
      var upload = layui.upload;
      var laydate = layui.laydate;

      //定义变量
      var url = window.location.href;
      var urlname = url.substring(geturlname(url, '/', 5) + 1); //获取连接中的参数
      var lastDigits = urlname.substr(0, urlname.lastIndexOf("/")); //获取生产单的id
      var product_number = urlname.substring(urlname.lastIndexOf("/") + 1); //生产单号
      //获取url/第几次出现的位置
      function geturlname(str, cha, num) {
        var x = str.indexOf(cha);
        for (var i = 0; i < num; i++) {
          x = str.indexOf(cha, x + 1);
        }
        return x;
      }

      // 产品表格
      table.render({
        elem: '#orderProduct_lst',
        method: 'post',
        // url: '/yes/order_product/index',
        // where: {
        //   id: lastDigits
        // },
        loading: true,
        toolbar: '#orderProducttoolbar',
        id: 'orderProduct',
        data: [{}],
        cols: [
          [{
            field: 'title',
            title: '5',
            align: 'center',
            colspan: 11,
          }],
          [{
            field: 'project',
            title: '6',
            align: 'center',
            colspan: 11,
          }],
          [{
              field: 'pro_num',
              align: 'center',
              width: '6%',
              // title: '序号',
            }, {
              field: 'img',
              title: '图片',
              width: '10%',
              align: 'center',
              edit: 'text',
            }
          ]
        ],
        done: function (d) {
          // var html ="<p style='text-align: center;font-size: 18px;'>项目名称:" + d.project+"</p>"+"<p style='color: red;text-align: center;font-size: 16px;'>"+d.remark;
          // $('tr').find('th[data-field="project"]').html(html);
          element.render();
        }
      });

    });