    // 加载表格元素
    layui.use(['layer', 'jquery'], function () {
      var layer = layui.layer;
      var $ = layui.jquery;

      $('#fixed_nav').on('click', function () {
        layer.open({
          type: 1,
          title: ['佛山市亚世家具有限公司', 'text-align: center;padding:0px'],
          closeBtn: 0,
          shadeClose: true,
          anim: 0,
          scrollbar: false,
          area: ['70%'],
          content: $('#nav_lst')
        });
      })

      $('#nav_lst button').on('click', function () {
        var url = $(this).attr('data-url');
        layer.close(layer.index);
        alert(url);
        $(window).attr('location',url);
      })


    });