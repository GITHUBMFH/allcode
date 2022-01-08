layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
  var table = layui.table;
  var layer = layui.layer;
  var element = layui.element;
  var $ = layui.jquery;
  var form = layui.form;
  var laydate = layui.laydate;

   //供应商分析
  laydate.render({
    elem: '#search_time1',
    type: 'month',
  });

  laydate.render({
    elem: '#year_time',
    type: 'year',
  });

  var date=new Date;
  var year=date.getFullYear(); 
  var month=date.getMonth()+1;
  month =(month<10 ? "0"+month:month); 
  var mydate = (year.toString()+'-'+month.toString());

  var myChart = echarts.init(document.getElementById('main'));
  getechats('/yes/data/getsupplierdata', {
    num: mydate
  });

  form.on('submit(getyear)', function (data) {
    if (data.field.num == '') {
      layer.msg('请选择年份');
    } else {
      getechats('/yes/data/getsupplierdata', data.field);
      getmeteailechats('/yes/data/getmeteaildata', data.field);
    }
    $('#search_time1').val('');
    return false;
  });

  form.on('submit(getechats)', function (data) {
    if (data.field.num == '') {
      layer.msg('请选择月份');
    } else {
      getechats('/yes/data/getsupplierdata', data.field);
      getmeteailechats('/yes/data/getmeteaildata', data.field);
    }
    $('#year_time').val('');
    return false;
  });

  function getechats(post, data) {
    $.ajax({
      type: 'POST',
      url: post,
      data: data,
      dataType: "json",
      success: function (data) {
        let amount = [];
        let s_name = [];
        for (let i in data.result) {
          amount.push(data.result[i].amount);
        }
        for (let i in data.result) {
          s_name.push(data.result[i].s_name);
        }
        $('#together').html('&nbsp;&nbsp;(总数:'+data.togeter+')');
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['金额'],
            left: '26%',
            top: '4%',
          },
          grid: {
            left: '3%',
            right: '4%',
            top: '10%',
            height: '87%',
            containLabel: true
          },
          toolbox: {
            right: '10%',
            right: '32%',
            top: '3%',
            show: true,
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          xAxis: {
            type: 'value',
          },
          yAxis: {
            type: 'category',
            boundaryGap: false,
            data: s_name,
          },
          series: [{
            name: '金额',
            type: 'bar',
            data: amount,
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            },
            barWidth: '3px'
          }, ]
        });
      },
      error: function (data) {
        layer.msg(data.msg);
      }
    });
  }

  var myChart2 = echarts.init(document.getElementById('material'));
  getmeteailechats('/yes/data/getmeteaildata', {
    num: mydate
  });

  function getmeteailechats(post, data) {
    $.ajax({
      type: 'POST',
      url: post,
      data: data,
      dataType: "json",
      success: function (data) {
        let amount = [];
        let s_name = [];
        for (let i in data) {
          amount.push(data[i].amount.toFixed(2));
        }
        for (let i in data) {
          s_name.push(data[i].name);
        }
        myChart2.setOption({
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['金额'],
            left: '26%',
            top: '4%',
          },
          grid: {
            left: '3%',
            right: '4%',
            top: '10%',
            height: '87%',
            containLabel: true
          },
          toolbox: {
            right: '10%',
            right: '32%',
            top: '3%',
            show: true,
            feature: {
              mark: {
                show: true
              },
              dataView: {
                show: true,
                readOnly: false
              },
              magicType: {
                show: true,
                type: ['line', 'bar']
              },
              restore: {
                show: true
              },
              saveAsImage: {
                show: true
              }
            }
          },
          xAxis: {
            type: 'value',
          },
          yAxis: {
            type: 'category',
            boundaryGap: false,
            data: s_name,
          },
          series: [{
            name: '金额',
            type: 'bar',
            data: amount,
            label: {
              normal: {
                show: true,
                position: 'right'
              }
            },
            barWidth: '16px'
          },, ]
        });
      },
      error: function (data) {
        layer.msg(data.msg);
      }
    });
  }

});