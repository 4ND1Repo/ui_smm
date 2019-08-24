"use strict";

var KTChart = function(){
  var activityStockOut = function(){
    if ($('#kt_stock_out_chart').length == 0) {
        return;
    }

    $.ajax({
      url: api_url + '/api/chart/stock/out',
      type: 'GET',
      data: {page_code: window.Auth.page_code},
      success: function(r){
        if(r.status){
          var ctx = document.getElementById("kt_stock_out_chart").getContext("2d");

          var gradient = ctx.createLinearGradient(0, 0, 0, 240);
          gradient.addColorStop(0, Chart.helpers.color('#e14c86').alpha(1).rgbString());
          gradient.addColorStop(1, Chart.helpers.color('#e14c86').alpha(0.3).rgbString());

          var config = {
              type: 'line',
              data: {
                  labels: r.data.label,
                  datasets: [{
                      label: "Banyaknya",
                      backgroundColor: Chart.helpers.color('#e14c86').alpha(1).rgbString(),  //gradient
                      borderColor: '#e13a58',

                      pointBackgroundColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
                      pointBorderColor: Chart.helpers.color('#000000').alpha(0).rgbString(),
                      pointHoverBackgroundColor: KTApp.getStateColor('light'),
                      pointHoverBorderColor: Chart.helpers.color('#ffffff').alpha(0.1).rgbString(),

                      //fill: 'start',
                      data: r.data.data
                  }]
              },
              options: {
                  title: {
                      display: false,
                  },
                  tooltips: {
                      mode: 'nearest',
                      intersect: false,
                      position: 'nearest',
                      xPadding: 10,
                      yPadding: 10,
                      caretPadding: 10
                  },
                  legend: {
                      display: false
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                  scales: {
                      xAxes: [{
                          display: false,
                          gridLines: false,
                          scaleLabel: {
                              display: true,
                              labelString: 'Month'
                          }
                      }],
                      yAxes: [{
                          display: false,
                          gridLines: false,
                          scaleLabel: {
                              display: true,
                              labelString: 'Value'
                          },
                          ticks: {
                              beginAtZero: true
                          }
                      }]
                  },
                  elements: {
                      line: {
                          tension: 0.0000001
                      },
                      point: {
                          radius: 4,
                          borderWidth: 12
                      }
                  },
                  layout: {
                      padding: {
                          left: 0,
                          right: 0,
                          top: 10,
                          bottom: 0
                      }
                  }
              }
          };

          var chart = new Chart(ctx, config);

          $.ajax({
            url: api_url + '/api/chart/stock/out/data',
            type: 'GET',
            data: {page_code: window.Auth.page_code, nik: window.Auth.nik},
            success: function(r){
              if(r.status){
                $('.req_tools').html(r.data.request_tools + ' Barang');
                $('.complaint_to_me').html(r.data.complaint + ' Komplain');
                $('.po_goods').html(r.data.po + ' Barang');
                $('.do_goods').html(r.data.do + ' Surat Jalan');
              }
            }
          });
        }
      }
    });
  }

  return {
    init: function(){
      KTChart.stockOut();
    },
    stockOut: function(){
      activityStockOut();
    }
  };
}();

$(document).ready(function(){
  // initiate
  KTChart.init();
});
