var DpHttp = require('../../utils/DpHttp.js');
var ApiConfig = require('../../utils/ApiConfig.js');
var DbUtils = require('../../utils/DbUtils.js');
var dpHttp = new DpHttp();
Page({
  data: {
    loginInfo: {},
    phone: "",
    password: ""
  },
  formSubmit: function(e) {
    this.setData({
      loginInfo: e.detail.value,
    })
  },
  getUserInfo: function(e) {
    if (e.detail.userInfo) {
      this.checkLogin();
    }
  },
  checkLogin: function(type) {
    if (!type) {
      ApiConfig.staticShowLoading('加载数据中');
    }
    var _this = this;
    dpHttp.login({
      loginInfo: _this.data.loginInfo,
      onSuccess: function() {
        ApiConfig.staticHideLoading();
        wx.reLaunch({
          url: '../order/order'
        })
      },
      onFailed: function(error) {

      },
      onCompleted: function() {

      }
    })
  },
  onLoad: function(option) {
    var type = option.type || 1;
    this.checkLogin(type);
    var loginInfo = DbUtils.getStorageSync('loginInfo');
    if (loginInfo) {
      this.setData({
        phone: loginInfo.username,
        password: loginInfo.password
      })
    }
  }
})