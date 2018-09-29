var Map = require('MapUtils.js');
var sha1 = require('sha1.js');
var errorCode = require('ErrorCodeUtils.js');
var ApiConfig = require('ApiConfig.js');
var DbUtils = require('DbUtils.js');
var ConstantUrl = require('../utils/ConstantsUtils/ConstantUrls.js');

var HttpUtils = function(options) {
  if (options) {
    this.api = options.api || undefined;
    this.getParams = options.getParams || undefined;
    this.postParams = options.postParams || '';
    this.onSuccess = options.onSuccess || undefined;
    this.onFailed = options.onFailed || undefined;
    this.onCompleted = options.onCompleted || undefined;
  }
}

HttpUtils.prototype.toUtf8 = function(str) {
  var out, i, len, c;
  out = "";
  len = str.length;
  for (i = 0; i < len; i++) {
    c = str.charCodeAt(i);
    if ((c >= 0x0001) && (c <= 0x007F)) {
      out += str.charAt(i);
    } else if (c > 0x07FF) {
      out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    } else {
      out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
      out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
    }
  }
  return out;
}

/**
 * 将map集合的value按字母排序
 * 并进行sha1的加密
 */
HttpUtils.prototype.getSignature = function(paramsMap) {
  var signature = "";
  if (!paramsMap) {
    paramsMap = new Map();
  }
  var keys = paramsMap.keys();
  keys = keys.sort();
  for (var i = 0, len = paramsMap.size(); i < len; i++) {
    var reg = /[\u4e00-\u9fa5]/g;
    if (reg.test(paramsMap.get(keys[i]))) {
      signature += this.toUtf8(paramsMap.get(keys[i]));
    } else {
      signature += (paramsMap.get(keys[i]));
    }
  }
  return "signature=" + sha1.hex_sha1(signature);
}

/**
 * 拼接url的Params
 */
HttpUtils.prototype.getUrl = function(paramsMap) {
  var url = "?";
  if (!paramsMap) {
    paramsMap = new Map();
  }
  var keys = paramsMap.keys();
  for (var i = 0, len = paramsMap.size(); i < len; i++) {
    url += keys[i] + "=" + paramsMap.get(keys[i]) + "&";
  }
  return url;
}

/**
 * 返回秒的时间戳 String
 */
HttpUtils.prototype.phpTime = function() {
  var date = new Date();
  var timeInt = date.getTime();
  timeInt = (timeInt - (timeInt % 1000)) / 1000;
  return timeInt + "";
}

/**
 * 返回秒的时间戳 number
 */
HttpUtils.prototype.phpTimeInt = function() {
  var date = new Date();
  var timeInt = date.getTime();
  timeInt = (timeInt - (timeInt % 1000)) / 1000;
  return timeInt;
}

HttpUtils.prototype.isValid = function(options) {
  var _this = this;
  options = options || {};
  var loginInfo = DbUtils.getStorageSync('loginInfo');
  if (loginInfo) {
    var access_token_old = loginInfo.access_token_old;
    var expires = ApiConfig.phpTimeInt();
    var expires_in = loginInfo.expires_in;
    if (expires_in) {
      if (Number(expires_in) - 24 * 60 * 60 > expires) {
        options.onSuccess && options.onSuccess(loginInfo);
      } else if (Number(expires_in) - 24 * 60 * 60 < expires && Number(expires_in) > expires) {
        _this.refreshAccessToken({
          params: null,
          access_token_old: access_token_old,
          api: ConstantUrl.WX_APP_REFRESH_TOKEN,
          onSuccess: function(responseJson) {
            //存储access_token
            loginInfo.access_token = responseJson.access_token;
            loginInfo.access_token_old = responseJson.access_token;
            loginInfo.expires_in = ApiConfig.phpTimeInt() + responseJson.expires_in;
            DbUtils.setStorage('loginInfo', loginInfo);
            ApiConfig.staticIsDebug(responseJson.access_token, 'access_token', 1);
            options.onSuccess && options.onSuccess(responseJson.access_token);
          },
          onFailed: function() {
            _this.login({
              onSuccess: function(loginInfo) {
                options.onSuccess && options.onSuccess(loginInfo);
              },
              onFailed: function(error) {
                options.onFailed && options.onFailed(error);
              }
            })
          },
          complete: function() {

          }
        })
      } else {
        _this.login({
          onSuccess: function(loginInfo) {
            options.onSuccess && options.onSuccess(loginInfo);
          },
          onFailed: function(error) {
            options.onFailed && options.onFailed(error);
          }
        })
      }
    } else {
      _this.login({
        onSuccess: function(loginInfo) {
          options.onSuccess && options.onSuccess(loginInfo);
        },
        onFailed: function(error) {
          options.onFailed && options.onFailed(error);
        }
      })
    }
  } else {
    _this.login({
      onSuccess: function(loginInfo) {
        options.onSuccess && options.onSuccess(loginInfo);
      },
      onFailed: function(error) {
        options.onFailed && options.onFailed(error);
      }
    })
  }
}


HttpUtils.prototype.login = function(options) {
  var _this = this;
  options = options || {};
  wx.login({
    success: function(res) {
      ApiConfig.staticIsDebug(res, 'login', 1);
      wx.getUserInfo({
        success: function(rest) {
          var loginInfo = DbUtils.getStorageSync('loginInfo');
          var url = ApiConfig.HOST + ConstantUrl.WX_APP_LOGIN;
          var params = new Map();
          params.put('code', res.code);
          params.put('timestamp', _this.phpTime());
          url += _this.getUrl(params);
          params.put('ACTIVE_TOKEN', 'mimixiche');
          url += _this.getSignature(params);
          ApiConfig.staticIsHttpDebug(url);
          var postParams = {
            username: options.loginInfo ? options.loginInfo.phone : "",
            password: options.loginInfo ? options.loginInfo.password : "",
            rawData: rest.rawData,
            signature: rest.signature,
            encryptedData: rest.encryptedData,
            iv: rest.iv
          };
          if(loginInfo.password && loginInfo.username){
              postParams["username"] = loginInfo.username;
              postParams["password"] = loginInfo.password;
          }
          wx.request({
            url: url, //仅为示例，并非真实的接口地址
            data: postParams,
            dataType: 'json',
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function(result) {
              var responseJson = result.data;
              if (responseJson.rt) {
                DbUtils.setStorage('loginInfo', {
                  "expires_in": _this.phpTimeInt() + responseJson.expires_in,
                  "access_token": responseJson.access_token,
                  "access_token_old": responseJson.access_token,
                  "appsecret": responseJson.appsecret,
                  "appid": responseJson.appid,
                  "username": postParams.username,
                  "password": postParams.password
                });
                ApiConfig.staticIsDebug(responseJson, 'responseJson', 1);
                options.onSuccess && options.onSuccess(responseJson);
              } else {
                setTimeout(function() {
                  ApiConfig.staticShowToast(errorCode.errorMessage(responseJson.error_code), 0);
                }, 1000);
                ApiConfig.staticIsDebug(responseJson, 'errorJson', 1);
                options.onFailed && options.onFailed();
              }
            },
            fail: function(error) {
              options.onFailed && options.onFailed(error);
            },
            complete: function() {}
          })

        },
        fail: function(error) {
          options.onFailed && options.onFailed(error);
        }
      });
    }
  })
}

HttpUtils.prototype.refreshAccessToken = function(options) {
  options = options || {};
  var api = options.api;
  var params = options.params;
  var access_token_old = options.access_token_old;
  if (!params) {
    params = new Map();
  }
  var url = ApiConfig.HOST + api;
  var loginInfo = DbUtils.getStorageSync('loginInfo');
  var appid = loginInfo.appid;
  var appsecret = loginInfo.appsecret;
  var urlParams = "";
  params.put('appid', appid);
  params.put('ver', ApiConfig.VER);
  params.put('timestamp', this.phpTimeInt());
  params.put('access_token', access_token_old);
  urlParams = this.getUrl(params);
  params.remove("ver");
  params.put("appsecret", appsecret);
  urlParams += this.getSignature(params);
  url += urlParams;
  ApiConfig.staticIsHttpDebug(url);
  wx.request({
    url: url,
    success: function(result) {
      var responseJson = result.data;
      if (responseJson.rt) {
        ApiConfig.staticIsDebug(responseJson, 'responseJson', 1);
        options.onSuccess && options.onSuccess(responseJson);
        return;
      }
      errorCode.errorMessage(responseJson.error_code);
      options.onFailed && options.onFailed(responseJson);
    },
    fail: function(errorJson) {
      options.onFailed && options.onFailed(errorJson);
    },
    onCompleted: function() {
      options.onCompleted && options.onCompleted();
    }
  });
}

HttpUtils.prototype.httpGet = function() {
  var _this = this;
  this.isValid({
    onSuccess: function(object) {
      var params;
      if (!_this.getParams) {
        params = new Map();
      } else {
        params = _this.getParams;
      }
      var url = ApiConfig.HOST + _this.api;
      var appid;
      var appsecret;
      var access_token;
      if (object instanceof Object) {
        appid = object.appid;
        appsecret = object.appsecret;
        access_token = object.access_token;
      } else {
        var loginInfo = DbUtils.getStorageSync('loginInfo');
        appid = loginInfo.appid;
        appsecret = loginInfo.appsecret;
        access_token = object;
      }
      var urlParams = "";
      params.put('appid', appid);
      params.put('ver', ApiConfig.VER);
      params.put('timestamp', _this.phpTime());
      params.put('access_token', access_token);
      urlParams = _this.getUrl(params);
      params.remove("ver");
      params.put("appsecret", appsecret);
      urlParams += _this.getSignature(params);
      url += urlParams;
      ApiConfig.staticIsHttpDebug(url);
      wx.request({
        url: url, //仅为示例，并非真实的接口地址
        success: function(result) {
          var responseJson = result.data;
          if (responseJson.rt) {
            ApiConfig.staticIsDebug(responseJson, 'responseJson', 1);
            _this.onSuccess && _this.onSuccess(responseJson);
          } else {
            if (responseJson.error_code == 10013 || responseJson.error_code == 40014 ||
              responseJson.error_code == 40027 || responseJson.error_code == 10002) {

            } else {
              setTimeout(function() {
                ApiConfig.staticShowToast(errorCode.errorMessage(responseJson.error_code), 0);
              }, 1000);
              ApiConfig.staticIsDebug(responseJson, 'responseJson', 1);
            }
            _this.onFailed && _this.onFailed(responseJson);
          }
        },
        fail: function() {
          _this.onFailed && _this.onFailed();
        },
        complete: function() {
          _this.onCompleted && _this.onCompleted();
        }
      });
    }
  })
}

HttpUtils.prototype.httpPost = function() {
  var _this = this;
  this.isValid({
    onSuccess: function(object) {
      var params;
      if (!_this.getParams) {
        params = new Map();
      } else {
        params = _this.getParams;
      }
      var url = ApiConfig.HOST + _this.api;
      var appid;
      var appsecret;
      var access_token;
      if (object instanceof Object) {
        appid = object.appid;
        appsecret = object.appsecret;
        access_token = object.access_token;
      } else {
        var loginInfo = DbUtils.getStorageSync('loginInfo');
        appid = loginInfo.appid;
        appsecret = loginInfo.appsecret;
        access_token = object;
      }
      var urlParams = "";
      params.put('appid', appid);
      params.put('ver', ApiConfig.VER);
      params.put('timestamp', _this.phpTime());
      params.put('access_token', access_token);
      urlParams = _this.getUrl(params);
      params.remove("ver");
      params.put("appsecret", appsecret);
      urlParams += _this.getSignature(params);
      url += urlParams;
      ApiConfig.staticIsHttpDebug(url);
      wx.request({
        url: url, //仅为示例，并非真实的接口地址
        data: _this.postParams,
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function(result) {
          var responseJson = result.data;
          if (responseJson.rt) {
            ApiConfig.staticIsDebug(responseJson, 'responseJson', 1);
            _this.onSuccess && _this.onSuccess(responseJson);
          } else {
            if (responseJson.error_code == 10002 || responseJson.error_code == 10013 ||
              responseJson.error_code == 40014 || responseJson.error_code == 40027) {

            } else {
              setTimeout(function() {
                ApiConfig.staticShowToast(errorCode.errorMessage(responseJson.error_code), 0);
              }, 1000);
              ApiConfig.staticIsDebug(responseJson, 'responseJson', 1);
            }
            _this.onFailed && _this.onFailed(responseJson);
          }
        },
        fail: function() {
          _this.onFailed && _this.onFailed();
        },
        complete: function() {
          _this.onCompleted && _this.onCompleted();
        }
      });
      ApiConfig.staticIsDebug(_this.postParams, 'postParams', 1);
    }
  })
}

HttpUtils.prototype.uploadFile = function(tempFilePaths) {
  var _this = this;
  this.isValid({
    onSuccess: function(object) {
      var params;
      if (!_this.getParams) {
        params = new Map();
      } else {
        params = _this.getParams;
      }
      var url = ApiConfig.HOST + _this.api;
      var appid;
      var appsecret;
      var access_token;
      if (object instanceof Object) {
        appid = object.appid;
        appsecret = object.appsecret;
        access_token = object.access_token;
      } else {
        var loginInfo = DbUtils.getStorageSync('loginInfo');
        appid = loginInfo.appid;
        appsecret = loginInfo.appsecret;
        access_token = object;
      }
      var urlParams = "";
      params.put('appid', appid);
      params.put('ver', ApiConfig.VER);
      params.put('timestamp', _this.phpTime());
      params.put('access_token', access_token);
      urlParams = _this.getUrl(params);
      params.remove("ver");
      params.put("appsecret", appsecret);
      urlParams += _this.getSignature(params);
      url += urlParams;
      ApiConfig.staticIsHttpDebug(url);
      wx.uploadFile({
        url: url,
        filePath: tempFilePaths,
        name: 'name',
        success: function(result) {
          var responseJson = result.data;
          responseJson = JSON.parse(responseJson);
          if (responseJson.rt) {
            ApiConfig.staticIsDebug(responseJson, 'responseJson', 1);
            _this.onSuccess && _this.onSuccess(responseJson);
          } else {
            if (responseJson.error_code == 10002 || responseJson.error_code == 10013 || responseJson.error_code == 40014 || responseJson.error_code == 40027) {

            } else {
              setTimeout(function() {
                ApiConfig.staticShowToast(errorCode.errorMessage(responseJson.error_code), 0);
              }, 1000);
              ApiConfig.staticIsDebug(responseJson, 'responseJson', 1);
            }
            _this.onFailed && _this.onFailed(responseJson);
          }
        },
        fail: function() {
          _this.onFailed && _this.onFailed();
        },
        complete: function() {
          _this.onCompleted && _this.onCompleted();
        }
      })
    }
  })
}

module.exports = HttpUtils;