var Map = require('MapUtils.js');
var HttpUtils = require('HttpUtils.js');
var Utils = require('Utils.js');
var ApiConfig = require('ApiConfig.js');
var DbUtils = require('DbUtils.js');
var ConstantUrl = require('../utils/ConstantsUtils/ConstantUrls.js');

var utils = new Utils();
var httpUtils = new HttpUtils();
var DpHttp = function() {

}
DpHttp.prototype.checkSession = function(options) {
  var _this = this;
  options = options || {};
  wx.checkSession({
    success: function() {
      ApiConfig.staticIsDebug('session_key 未过期，并且在本生命周期一直有效');
      options.onSuccess && options.onSuccess();
    },
    fail: function() {
      ApiConfig.staticIsDebug('session_key 已经失效，需要重新执行登录流程');
      ApiConfig.staticShowLoading('加载数据中');
    },
    complete: function() {
      options.onCompleted && options.onCompleted();
    }
  });
}

DpHttp.prototype.checkAuthorization = function(options) {
  options = options || {};
  wx.login({
    success: function(res) {
      ApiConfig.staticIsDebug(res, 'login', 1);
      wx.getUserInfo({
        success: function(result) {
          options.onSuccess && options.onSuccess(result);
        },
        fail: function(error) {
          options.onFailed && options.onFailed(error);
        }
      });
    }
  })
}

/**
 * 登陆接口
 * @param options
 */
DpHttp.prototype.login = function(options) {
  options = options || {};
  httpUtils.login({
    loginInfo: options.loginInfo,
    onSuccess: function(responseJson) {
      options.onSuccess && options.onSuccess(responseJson);
    },
    onFailed: function(errorJson) {
      options.onFailed && options.onFailed(errorJson);
    }
  })
}

/**
 *订单列表
 * @param options
 */
DpHttp.prototype.requestOrderList = function(options) {
  options = options || {};
  var params = new Map();
  params.put('from', options.from + "");
  params.put('count', options.count + "");
  var httpUtils = new HttpUtils({
    api: ConstantUrl.WX_APP_ORDER_LIST,
    getParams: params,
    onSuccess: function(responseJson) {
      options.onSuccess && options.onSuccess(responseJson);
    },
    onFailed: function(errorJson) {
      options.onFailed && options.onFailed(errorJson);
    },
    onCompleted: function() {
      options.onCompleted && options.onCompleted();
    }
  });
  httpUtils.httpGet();
}

/**
 *订单详情
 * @param options
 */
DpHttp.prototype.requestOrderDetail = function(options) {
  options = options || {};
  var params = new Map();
  if (options.order_id && options.order_id !== "") {
    params.put('order_id', options.order_id);
  }
  if (options.consume_code && options.consume_code !== "") {
    params.put('consume_code', options.consume_code);
  }
  var httpUtils = new HttpUtils({
    api: ConstantUrl.WX_APP_ORDER_DETAIL,
    getParams: params,
    onSuccess: function(responseJson) {
      options.onSuccess && options.onSuccess(responseJson);
    },
    onFailed: function(errorJson) {
      options.onFailed && options.onFailed(errorJson);
    },
    onCompleted: function() {
      options.onCompleted && options.onCompleted();
    }
  });
  httpUtils.httpGet();
}
/**
 *订单核销
 * @param options
 */
DpHttp.prototype.useOrder = function(options) {
    options = options || {};
    var params = new Map();
    if (options.order_id && options.order_id !== "") {
        params.put('order_id', options.order_id);
    }
    var httpUtils = new HttpUtils({
        api: ConstantUrl.WX_APP_USE_ORDER,
        getParams: params,
        onSuccess: function(responseJson) {
            options.onSuccess && options.onSuccess(responseJson);
        },
        onFailed: function(errorJson) {
            options.onFailed && options.onFailed(errorJson);
        },
        onCompleted: function() {
            options.onCompleted && options.onCompleted();
        }
    });
    httpUtils.httpGet();
}
/**
 *报表
 * @param options
 */
DpHttp.prototype.dashboard = function(options) {
    options = options || {};
    var params = new Map();
    var httpUtils = new HttpUtils({
        api: ConstantUrl.WX_APP_DASHBOARD,
        getParams: params,
        onSuccess: function(responseJson) {
            options.onSuccess && options.onSuccess(responseJson);
        },
        onFailed: function(errorJson) {
            options.onFailed && options.onFailed(errorJson);
        },
        onCompleted: function() {
            options.onCompleted && options.onCompleted();
        }
    });
    httpUtils.httpGet();
}
module.exports = DpHttp;