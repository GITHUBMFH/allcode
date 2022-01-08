layui.config({
  base: '/static/yes/'
}).use(['form', 'jquery', 'element', 'sliderVerify'], function () {
  var element = layui.element;
  var $ = layui.jquery;
  var form = layui.form;
  var sliderVerify = layui.sliderVerify;


  function getCookie2(name){
        var strcookie = document.cookie;//获取cookie字符串
        var arrcookie = strcookie.split("; ");//分割
        //遍历匹配
        for ( var i = 0; i < arrcookie.length; i++) {
            var arr = arrcookie[i].split("=");
            if (arr[0] == name){
                return arr[1];
            }
        }
        return "";
    }
  var admin_username = getCookie2("admin_username");
  $('#admin_username').val(admin_username);

  form.on('submit(LAY-user-login-submit)', function (data) {
    var data = data.field;
    if (slider.isOk()) {
      $.ajax({
        type: 'POST', //请求类型
        url: '/yes/login/doLogin', //URL
        data: data, //传递的参数
        dataType: "json", //返回的数据类型
        success: function (data) {
          layer.msg(data.msg);
          if (data.code == 1) {
            setTimeout(function () {
              $(location).prop('href', data.url)
            }, 2000);
          }else{
            slider.reset();
          }
        },
        error: function (data) {
          layer.msg(data.msg);
        }
      });
    } else {
      layer.msg("请先通过滑块验证");
    }
    return false;
  });


  var slider = sliderVerify.render({
    elem: '#slider',
    onOk: function () {
      layer.msg("滑块验证通过");
    }
  })

});