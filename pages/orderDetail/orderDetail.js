var DpHttp = require('../../utils/DpHttp.js');
var ApiConfig = require('../../utils/ApiConfig.js');
var dpHttp = new DpHttp();
Page({
  data: {
    orderId: "",
    orderInfo: {},
    orderTime: "",
    orderPrice: "",
    orderProduct: "",
    orderNoUse: 20,
    tap: false
  },
  onLoad: function(options) {
    ApiConfig.staticShowLoading('加载数据中');
    var _this = this;
    if (options.id) {
      _this.setData({
        orderId: options.id
      })
    }
    if(options.tap){
      _this.setData({
        tap: true
      })
    }
    dpHttp.requestOrderDetail({
      order_id: options.id,
      consume_code: options.code,
      onSuccess: function(responseJson) {
        ApiConfig.staticHideLoading();
        var productsStr = '';
        responseJson.order.product_items.map(function(val, i) {
          if (i == 0) {
            productsStr = "";
            productsStr += val.metadata[0].value;
          } else {
            productsStr += "+";
            productsStr += val.metadata[0].value;
          }
        });
        _this.setData({
          orderPrice: responseJson.order.pay_sum,
          orderId: responseJson.order._id,
          orderInfo: responseJson.order,
          orderTime: _this.formatTime(responseJson.order.created),
          orderProduct: productsStr
        })
      },
      onFailed: function(errorJson) {
        ApiConfig.staticHideLoading();
        setTimeout(function() {
          ApiConfig.staticShowToast("请求失败！", 0);
        }, 1000);
        wx.navigateBack();
      }
    });
  },
  formatTime: function(timestamp) {
    var date = new Date(timestamp * 1000);
    var Y = date.getFullYear();
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var h = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m;
  },
  cancelUseCode: function() {
    wx.navigateBack();
  },
  useCode: function() {
    var _this = this;
    dpHttp.useOrder({
      order_id: _this.data.orderId,
      onSuccess: function(responseJson) {
        wx.navigateTo({
          url: '../useCode/useCode?id=' + _this.data.orderId + "&&price=" + _this.data.orderPrice + "&&product=" + _this.data.orderProduct
        })
      },
      onFailed: function(errorJson) {

      }
    });
  },
  goHome: function() {
    wx.switchTab({
      url: '../order/order'
    })
  }
})