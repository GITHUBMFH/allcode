layui.use(['form', 'layer', 'table', 'jquery', 'element', 'laydate'], function () {
  var table = layui.table;
  var layer = layui.layer;
  var element = layui.element;
  var $ = layui.jquery;
  var form = layui.form;
  var laydate = layui.laydate;

  laydate.render({
    elem: '#search_time1',
    type: 'month',
  });
  laydate.render({
    elem: '#year_time',
    type: 'year',
  });


  var myChart = echarts.init(document.getElementById('main'));
  getechats('/yes/index/getproductdata', {
    num: 30
  });

  $('#seven').on('click', function () {
    getechats('/yes/index/getproductdata', {
      num: 7
    });
    $('#search_time1').val('');
    $('#year_time').val('');
  })
  $('#thirty').on('click', function () {
    getechats('/yes/index/getproductdata', {
      num: 30
    });
    $('#search_time1').val('');
    $('#year_time').val('');
  })

  form.on('submit(getyear)', function (data) {
    if (data.field.num == '') {
      layer.msg('请选择年份');
    } else {
      getechats('/yes/index/getmontydata', data.field);
      getechatsorder('/yes/index/getorderdata', data.field);
      getechatsclient('/yes/index/getclientdata', data.field);
    }
    $('#search_time1').val('');
    return false;
  });

  form.on('submit(getechats)', function (data) {
    if (data.field.num == '') {
      layer.msg('请选择月份');
    } else {
      getechats('/yes/index/getproductdata', data.field);
      getechatsorder('/yes/index/getorderdata', data.field);
      getechatsclient('/yes/index/getclientdata', data.field);
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
        let produce = [];
        let shipment = [];
        let cost = [];
        let time = [];
        let wage = [];
        let profit = [];
        let finance = [];
        for (let i in data.produce) {
          produce.push(data.produce[i]);
        }
        for (let i in data.time) {
          time.push(data.time[i]);
        }
        for (let i in data.shipment) {
          shipment.push(data.shipment[i]);
        }
        for (let i in data.cost) {
          cost.push(data.cost[i]);
        }
        for (let i in data.wage) {
          wage.push(data.wage[i]);
        }
        for (let i in data.finance) {
          finance.push(data.finance[i]);
        }
        for (let i in data.wage) {
          profit.push((data.finance[i]-data.cost[i]-data.wage[i]).toFixed(2));
        }
        myChart.setOption({
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['产值', '出货值','消耗','工资','收款'],
            left: '26%',
            top: '4%',
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            height: '80%',
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
            type: 'category',
            boundaryGap: false,
            data: time,
          },
          yAxis: {
            type: 'value'
          },
          series: [{
              name: '产值',
              type: 'line',
              data: produce,
              label: {
                normal: {
                  show: true,
                  position: 'top'
                }
              },
            },
            {
              name: '出货值',
              type: 'line',
              data: shipment,
            },{
              name: '消耗',
              type: 'bar',
              stack: '1',
              data: cost,
            }
            ,{
              name: '工资',
              type: 'bar',
              stack: '1',
              data: wage,
              barWidth:'30px'
            }
            ,{
              name: '利润',
              type: 'bar',
              stack: '1',
              data: profit,
              barWidth:'30px'
            },
            {
              name: '收款',
              type: 'line',
              data: finance,
              // label: {
              //   normal: {
              //     show: true,
              //     position: 'top'
              //   }
              // },
            }
          ]
        });
      },
      error: function (data) {
        layer.msg(data.msg);
      }
    });
  }


  var date=new Date;
  var year=date.getFullYear(); 
  var month=date.getMonth()+1;
  month =(month<10 ? "0"+month:month); 
  var mydate = (year.toString()+'-'+month.toString());

  // 客户明细分析
  var myChartclient = echarts.init(document.getElementById('client'));
  getechatsclient('/yes/index/getclientdata', {
    num: mydate
  });

  function getechatsclient(post, data) {
    $.ajax({
      type: 'POST',
      url: post,
      data: data,
      dataType: "json",
      success: function (data) {
        let client = [];
        let amount = [];

        for (let i in data.result) {
          client.push(data.result[i].client);
        }
        for (let i in data.result) {
          amount.push(data.result[i].amount);
        }

        $('#together').html('&nbsp;&nbsp;(总数:'+data.togeter+')');
        myChartclient.setOption({
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['产值'],
            left: '26%',
            top: '4%',
          },
          grid: {
            left: '3%',
            right: '4%',
            top: '10%',
            height: '86%',
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
          yAxis: {
            type: 'category',
            boundaryGap: false,
            data: client,
          },
          xAxis: {
            type: 'value'
          },
          series: [{
              name: '产值',
              type: 'bar',
              data: amount,
              label: {
                normal: {
                  show: true,
                  position: 'right'
                }
              },
              barWidth: '10px'
            }
          ]
        });
      },
      error: function (data) {
        layer.msg(data.msg);
      }
    });
  }

  //生产单分析
  var myChartorder = echarts.init(document.getElementById('order'));
  getechatsorder('/yes/index/getorderdata', {
    num: mydate
  });

  function getechatsorder(post, data) {
    $.ajax({
      type: 'POST',
      url: post,
      data: data,
      dataType: "json",
      success: function (data) {
        let order = [];
        let amount = [];

        for (let i in data) {
          order.push(data[i].order);
        }
        for (let i in data) {
          amount.push(data[i].amount);
        }

        myChartorder.setOption({
          tooltip: {
            trigger: 'axis',
          },
          legend: {
            data: ['产值'],
            left: '26%',
            top: '4%',
          },
          grid: {
            left: '3%',
            right: '4%',
            top: '10%',
            height: '86%',
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
          yAxis: {
            type: 'category',
            boundaryGap: false,
            data: order,
          },
          xAxis: {
            type: 'value'
          },
          series: [{
              name: '产值',
              type: 'bar',
              data: amount,
              label: {
                normal: {
                  show: true,
                  position: 'right'
                }
              },
              barWidth: '10px'
            }
          ]
        });
      },
      error: function (data) {
        layer.msg(data.msg);
      }
    });
  }

});