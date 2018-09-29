var DpHttp = require('../../utils/DpHttp.js');
var DbUtils = require('../../utils/DbUtils.js');
var Map = require('../../utils/MapUtils.js');
var Utils = require('../../utils/Utils.js');
var ApiConfig = require('../../utils/ApiConfig.js');
//获取应用实例
var app = getApp();
var dpHttp = new DpHttp();
var utils = new Utils();

var url;
Page({
  data: {
    userInfo: {},
    loading: 1,
    isLocation: 1,
    imageSrc: '../../images/',
    pageTitle: "",
    orderStutas: 20,
    orderStatusName: "待服务",
    enterCode: false,
    ordersData: [],
    orderCode: "",
    orderLength: true
  },
  onLoad: function(options) {
    var _this = this;
    app.getUserInfo({
      onSuccess: function(wxUserInfo) {
        _this.setData({
          wxUserInfo: wxUserInfo,
        })
      }
    });
    _this.getStatistics();
  },
  getStatistics: function() {
    var _this = this;
    dpHttp.requestOrderList({
      from: 0,
      count: 1,
      onSuccess: function(responseJson) {
        if (responseJson.orders.length > 0) {
          app.globalData.title = responseJson.orders[0].authorized_dealer.name;
          var ordersListData = responseJson.orders;
          var productsStr = '';
          ordersListData.map(function(val, index) {
            val.product_items.map(function(val, i) {
              if (i == 0) {
                productsStr = "";
                productsStr += val.metadata[0].value;
              } else {
                productsStr += "+";
                productsStr += val.metadata[0].value;
              }
            });
            val["creatTime"] = _this.formatTime(val.created);
            val["productsStr"] = productsStr;
          });
          _this.setData({
            ordersData: ordersListData,
            pageTitle: responseJson.orders[0].authorized_dealer.name,
          })
          wx.setNavigationBarTitle({
            title: _this.data.pageTitle
          });
        } else {
          _this.setData({
            orderLength: false
          })
        }
      },
      onFailed: function(errorJson) {

      },
      onCompleted: function() {

      }
    })
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
  onReady: function() {
    this.setData({
      isLoad: 0
    })
    this.checkLogin();
  },
  checkLogin: function() {
    url = '';
    dpHttp.checkAuthorization({
      onSuccess: function() {
      },
      onFailed: function(error) {
        if ((error.errMsg && (error.errMsg.indexOf('scope unauthorized') > -1) || error.errMsg.indexOf('fail auth deny') > -1)) {
          wx.reLaunch({
            url: '../login/login'
          })
        }
      }
    });
  },
  actioncnt: function() {
    let _this = this;
    wx.showActionSheet({
      itemList: ['待服务', '待结算', '已完成'],
      success: function(res) {
        if (res.tapIndex === 0) {
          _this.setData({
            orderStutas: 20,
            orderStatusName: "待服务",
          })
        } else if (res.tapIndex === 1) {
          _this.setData({
            orderStutas: 7,
            orderStatusName: "待结算",
          })
        } else if (res.tapIndex === 2) {
          _this.setData({
            orderStutas: 200,
            orderStatusName: "已完成",
          })
        }
      },
      fail: function(res) {

      }
    })
  },
  showEnterCode: function() {
    this.setData({
      enterCode: true,
    })
  },
  hiddenEnterCode: function() {
    this.setData({
      enterCode: false,
    })
  },
  voteTitle: function(e) {
    this.setData({
      orderCode: e.detail.value,
    });
  },
  showOrderDeatil: function() {
    wx.navigateTo({
      url: '../orderDetail/orderDetail?code=' + this.data.orderCode
    })
  },
  scanCode: function() {
    var show;
    var _this = this;
    wx.scanCode({
      success: (res) => {
        _this.controlCordResult(res.result);
      },
      fail: (res) => {},
      complete: (res) => {}
    })
  },
  controlCordResult: function(url) {
    var _this = this;
    var params = new Map();
    var order_id = '';
    if (url.indexOf('partnerqrcode/maintain_4s') != -1) {
      params = utils.urlParseToMap(url);
      order_id = params.get('order_id');
      wx.navigateTo({
        url: '../orderDetail/orderDetail?id=' + order_id
      })
      return;
    }
  },
  orderDetail: function(e) {
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id=' + e.currentTarget.dataset.id +"&&tap=true"
    })
  },
  onShow: function () {
    this.getStatistics();
  },
})