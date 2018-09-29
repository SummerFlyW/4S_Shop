var DpHttp = require('../../utils/DpHttp.js');
var dpHttp = new DpHttp();
var wxCharts = require('../../utils/wxcharts.js');
var columnChartDay = null;
var columnChartMonth = null;
var app = getApp();
Page({
  data: {
    complete: 0,
    waitService: 0,
  },
  onLoad: function(options) {
    var _this = this;
    wx.setNavigationBarTitle({
      title: app.globalData.title
    })
  },
  onReady: function(e) {
    var _this = this;
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }
    dpHttp.dashboard({
      onSuccess: function(responseJson) {
        var year_categories = [],
          year_data = [],
          week_categories = [],
          week_data = [];
        responseJson.recent_half_year.map(function(val) {
          year_categories.push(val.month);
          year_data.push(val.cnt);
        });
        responseJson.recent_week.map(function(val) {
          week_categories.push(val.day.substring(5));
          week_data.push(val.cnt);
        });
        _this.setData({
          complete: responseJson.issued_cnt,
          waitService: responseJson.unissue_cnt
        })
        columnChartDay = new wxCharts({
          canvasId: 'columnCanvasDay',
          type: 'column',
          animation: false,
          legend: false,
          categories: week_categories,
          dataLabel: false,
          series: [{
            data: week_data,
            color: "#06C15A"
          }],
          yAxis: {
            format: function(val) {
              return val;
            },
            min: 0,
          },
          xAxis: {
            disableGrid: false,
            type: 'calibration',
          },
          extra: {
            column: {
              width: 20
            }
          },
          width: windowWidth - 40,
          height: 180,
        });
        columnChartMonth = new wxCharts({
          canvasId: 'columnCanvasMonth',
          type: 'column',
          animation: false,
          legend: false,
          categories: year_categories,
          dataLabel: false,
          series: [{
            data: year_data,
            color: "#06C15A"
          }],
          yAxis: {
            format: function(val) {
              return val;
            },
            min: 0
          },
          xAxis: {
            disableGrid: false,
            type: 'calibration'
          },
          extra: {
            column: {
              width: 20
            }
          },
          width: windowWidth - 40,
          height: 180,
        });
      },
      onFailed: function(errorJson) {

      }
    });
  }
})