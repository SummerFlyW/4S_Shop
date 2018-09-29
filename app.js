var gio = require('vds-mina.js');
var DpHttp = require('utils/DpHttp.js');
var ApiConfig = require('utils/ApiConfig.js');
var dpHttp = new DpHttp();

if (!ApiConfig.DEBUG) {
  gio.appId = "wx32fb042bb9a2901d";
  gio.projectId = "9a43dd728aa697f4";
}

App({
  onLaunch: function () {
    this.checkLogin();
  },
  checkLogin: function () {
    dpHttp.checkAuthorization({
      onSuccess: function () {

      },
      onFailed: function (error) {
        if ((error.errMsg && (error.errMsg.indexOf('scope unauthorized') > -1)
          || error.errMsg.indexOf('fail auth deny') > -1)) {
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      }
    });
  },
  getUserInfo: function (options) {
    var that = this;
    options = options || {};
    if (this.globalData.userInfo) {
      if (this.globalData.userInfo)
        options.onSuccess && options.onSuccess(this.globalData.userInfo);
    } else {
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              options.onSuccess && options.onSuccess(res.userInfo);
            },
            fail: function (error) {
              options.onFailed && options.onFailed(error);
            }
          })
        },
        fail: function (error) {
          options.onFailed && options.onFailed(error);
        }
      })
    }
  },
  globalData: {
    userInfo: null,
    title:""
  }
})