var Constant = require('ConstantsUtils/Constant.js');
var ApiConfig = require('ApiConfig.js');
var Map = require('MapUtils.js');

var Utils = function () {
  this.DEF_PI = 3.14159265359; // PI
  this.DEF_2PI = 6.28318530712; // 2*PI
  this.DEF_PI180 = 0.01745329252; // PI/180.0
  this.DEF_R = 6370693.5; // radius of earth
  this.ee = 0.00669342162296594323;
  this.x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  this.base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  this.base64DecodeChars = new Array(
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
    -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63,
    52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1,
    -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14,
    15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1,
    -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);
}


Utils.prototype.wgs2bd = function (lat, lon) {
  var wgs2gcjR = this.wgs2gcj(lat, lon);
  return this.gcj2bd(wgs2gcjR.latitude, wgs2gcjR.longitude);
}

Utils.prototype.gcj2bd = function (lat, lon) {
  var x = lon, y = lat;
  var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.x_pi);
  var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.x_pi);
  var bd_lon = z * Math.cos(theta) + 0.0065;
  var bd_lat = z * Math.sin(theta) + 0.006;
  return {
    latitude: bd_lat,
    longitude: bd_lon
  };
}

Utils.prototype.bd2gcj = function (lat, lon) {
  var x = lon - 0.0065, y = lat - 0.006;
  var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.x_pi);
  var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.x_pi);
  var gg_lon = z * Math.cos(theta);
  var gg_lat = z * Math.sin(theta);
  return {
    latitude: gg_lat,
    longitude: gg_lon
  };
}

Utils.prototype.wgs2gcj = function (lat, lon) {
  var dLat = this.transformLat(lon - 105.0, lat - 35.0);
  var dLon = this.transformLon(lon - 105.0, lat - 35.0);
  var radLat = lat / 180.0 * this.DEF_PI;
  var magic = Math.sin(radLat);
  magic = 1 - this.ee * magic * magic;
  var sqrtMagic = Math.sqrt(magic);
  dLat = (dLat * 180.0) / ((this.DEF_R * (1 - this.ee)) / (magic * sqrtMagic) * this.DEF_PI);
  dLon = (dLon * 180.0) / (this.DEF_R / sqrtMagic * Math.cos(radLat) * this.DEF_PI);
  var mgLat = lat + dLat;
  var mgLon = lon + dLon;
  return {
    latitude: mgLat,
    longitude: mgLon
  };
}

Utils.prototype.transformLat = function (lat, lon) {
  var ret = -100.0 + 2.0 * lat + 3.0 * lon + 0.2 * lon * lon + 0.1 * lat * lon + 0.2 * Math.sqrt(Math.abs(lat));
  ret += (20.0 * Math.sin(6.0 * lat * this.DEF_PI) + 20.0 * Math.sin(2.0 * lat * this.DEF_PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lon * this.DEF_PI) + 40.0 * Math.sin(lon / 3.0 * this.DEF_PI)) * 2.0 / 3.0;
  ret += (160.0 * Math.sin(lon / 12.0 * this.DEF_PI) + 320 * Math.sin(lon * this.DEF_PI / 30.0)) * 2.0 / 3.0;
  return ret;
}

Utils.prototype.transformLon = function (lat, lon) {
  var ret = 300.0 + lat + 2.0 * lon + 0.1 * lat * lat + 0.1 * lat * lon + 0.1 * Math.sqrt(Math.abs(lat));
  ret += (20.0 * Math.sin(6.0 * lat * this.DEF_PI) + 20.0 * Math.sin(2.0 * lat * this.DEF_PI)) * 2.0 / 3.0;
  ret += (20.0 * Math.sin(lat * this.DEF_PI) + 40.0 * Math.sin(lat / 3.0 * this.DEF_PI)) * 2.0 / 3.0;
  ret += (150.0 * Math.sin(lat / 12.0 * this.DEF_PI) + 300.0 * Math.sin(lat / 30.0 * this.DEF_PI)) * 2.0 / 3.0;
  return ret;
}
Utils.prototype.phoneCall = function () {
  wx.makePhoneCall({
    phoneNumber: '400-656-9911'
  })
}

Utils.prototype.isNotInt = function (theInt) {
  theInt = theInt + '';
  if ((theInt.length > 1 && parseInt(theInt.split('.')[1])) <= 0) {
    return parseInt(theInt);
  }
  return theInt;
}

/**
 * 返回秒的时间戳 String
 */
Utils.prototype.phpTime = function () {
  var date = new Date();
  var timeInt = date.getTime();
  timeInt = (timeInt - (timeInt % 1000)) / 1000
  return timeInt + "";
}

/**
 * 返回秒的时间戳 number
 */
Utils.prototype.phpTimeInt = function () {
  var date = new Date();
  var timeInt = date.getTime();
  timeInt = (timeInt - (timeInt % 1000)) / 1000
  return timeInt;
}

Utils.prototype.formatWeek = function (time) {
  var date = new Date(time * 1000);
  var week = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
  return week[date.getDay()];
}

Utils.prototype.format = function (format) {
  var o = {
    "M+": this.getMonth() + 1, //month
    "d+": this.getDate(), //day
    "h+": this.getHours(), //hour
    "m+": this.getMinutes(), //minute
    "s+": this.getSeconds(), //second
    "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
    "S": this.getMilliseconds() //millisecond
  }
  
  if (/(y+)/.test(format)) {
    format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return format;
}

/**
 * 格式化时间年月
 */
Utils.prototype.formatYearMoney = function () {
  var date = new Date();
  var timeInt = date.getTime();
  var newTime = new Date(timeInt);
  var year = newTime.getFullYear() + '';
  var month = newTime.getMonth() + 1;
  month = month < 10 ? "0" + month : month + '';
  return year + month;
}

/**
 * 格式化时间年月日
 */
Utils.prototype.formatYearMoneyDay = function () {
  var date = new Date();
  var timeInt = date.getTime();
  var newTime = new Date(timeInt);
  var year = newTime.getFullYear() + '';
  var month = newTime.getMonth() + 1;
  month = month < 10 ? "0" + month : month + '';
  var day = newTime.getDate();
  day = day < 10 ? "0" + day : day;
  return year + month + day;
}

/**
 * 格式化时间年月日时分秒
 * @param {Object} time
 */
Utils.prototype.formatDate = function (time) {
  var newTime = new Date(time * 1000);
  var year = newTime.getFullYear();
  var month = newTime.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var day = newTime.getDate();
  day = day < 10 ? "0" + day : day;
  var hours = newTime.getHours();
  hours = hours < 10 ? "0" + hours : hours;
  var minutes = newTime.getMinutes();
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var seconds = newTime.getSeconds();
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
}

/**
 * Fri Oct 31 18:00:00 UTC+0800 2008
 * @param {Object} time
 * @param {Object} format
 */

Utils.prototype.formatForTime = function (time, format) {
  var t;
  if (!time) {
    t = new Date();
  } else {
    t = new Date(time * 1000);
  }
  
  var tf = function (i) {
    return (i < 10 ? '0' : '') + i
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (a) {
    switch (a) {
      case 'yyyy':
        return tf(t.getFullYear());
        break;
      case 'MM':
        return tf(t.getMonth() + 1);
        break;
      case 'mm':
        return tf(t.getMinutes());
        break;
      case 'dd':
        return tf(t.getDate());
        break;
      case 'HH':
        return tf(t.getHours());
        break;
      case 'ss':
        return tf(t.getSeconds());
        break;
    }
  })
}

/**
 * 根据时间字符获取年份
 * @param {Object} str
 */
Utils.prototype.getYearForString = function (str) {
  var oldTime = (new Date(str)).getTime();
  var newTime = new Date(oldTime);
  var year = newTime.getFullYear();
  return year;
}

/**
 * 根据时间字符获取月份和日期
 * @param {Object} str
 */
Utils.prototype.getMonthForString = function (str) {
  var oldTime = (new Date(str)).getTime();
  var newTime = new Date(oldTime);
  var month = newTime.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var day = newTime.getDate();
  day = day < 10 ? "0" + day : day;
  return month + "/" + day
}

/**
 * 格式化时间年月日
 * @param {Object} time
 */
Utils.prototype.formatDay = function (time) {
  var newTime = new Date(time * 1000);
  var year = newTime.getFullYear();
  var month = newTime.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var day = newTime.getDate();
  day = day < 10 ? "0" + day : day;
  return year + "-" + month + "-" + day;
}

/**
 * 格式化时间年月日
 * @param {Object} time
 */
Utils.prototype.formatDayOther = function (time) {
  var newTime = new Date(time * 1000);
  var year = newTime.getFullYear();
  var month = newTime.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var day = newTime.getDate();
  day = day < 10 ? "0" + day : day;
  return year + "/" + month + "/" + day;
}

/**
 * 格式化时间年月日
 * @param {Object} time
 */
Utils.prototype.formatDays = function (time) {
  var newTime = new Date(time * 1000);
  var year = newTime.getFullYear();
  var month = newTime.getMonth() + 1;
  month = month < 10 ? "0" + month : month;
  var day = newTime.getDate();
  day = day < 10 ? "0" + day : day;
  return year + "-" + month + "-" + day;
}

Utils.prototype.authorize = function (authority) {
  wx.getSetting({
    success: function (res) {
      var authSetting = res.authSetting;
      var scope;
      switch (authority) {
        case Constant.authority.USERLOCATION :
          scope = authSetting['scope.userLocation'];
          break;
        case Constant.authority.ADDRESS :
          scope = authSetting['scope.address'];
          break;
        case Constant.authority.RECORD :
          scope = authSetting['scope.record'];
          break;
        case Constant.authority.USERINFO :
          scope = authSetting['scope.userInfo'];
          break;
        case Constant.authority.WRITEPHOTOSALBUM :
          scope = authSetting['scope.writePhotosAlbum'];
          break;
      }
      ApiConfig.staticIsDebug(scope);
      if (!scope) {
        wx.authorize({
          scope: authority,
          success: function () {
            wx.startRecord();
          }, fail: function (error) {
            console.log(error);
          }
        })
      }
    }
  })
}


Utils.prototype.getDistance = function (location, options) {
  options = options || {};
  if (!location) {
    options.onFailed && options.onFailed();
  }
  var _this = this;
  this.getLocation({
    onSuccess: function (res) {
      ApiConfig.staticIsDebug(location, 'location', 1);
      //var coordinate = _this.wgs2bd(res.latitude, res.longitude);
      ApiConfig.staticIsDebug(res, 'coordinate', 1);
      var distance = _this.coordinatesDistance(location.longitude, location.latitude, res.longitude, res.latitude);
      ApiConfig.staticIsDebug(distance, 'distance');
      options.onSuccess && options.onSuccess(distance);
    }, onFailed: function (error) {
      options.onFailed && options.onFailed(error);
    }
  });
}

Utils.prototype.getLocation = function (options) {
  var _this = this;
  options = options || {};
  wx.getLocation({
    type: options.type || 'wgs84',
    success: function (res) {
      var coordinate = _this.wgs2bd(res.latitude, res.longitude);
      options.onSuccess && options.onSuccess(coordinate);
    }, fail: function (error) {
      options.onFailed && options.onFailed(error);
    }
  })
}


/**算的两点坐标之间的距离
 * approx distance between two points on earth ellipsoid
 * @param {Object} lat1
 * @param {Object} lng1
 * @param {Object} lat2
 * @param {Object} lng2
 */
Utils.prototype.coordinatesDistance = function (lon1, lat1, lon2, lat2) {
  var _this = this;
  var ew1, ns1, ew2, ns2;
  var dx, dy, dew;
  var distance;
  // 角度转换为弧度
  ew1 = lon1 * _this.DEF_PI180;
  ns1 = lat1 * _this.DEF_PI180;
  ew2 = lon2 * _this.DEF_PI180;
  ns2 = lat2 * _this.DEF_PI180;
  // 经度差
  dew = ew1 - ew2;
  // 若跨东经和西经180 度，进行调整
  if (dew > _this.DEF_PI)
    dew = _this.DEF_2PI - dew;
  else if (dew < -_this.DEF_PI)
    dew = _this.DEF_2PI + dew;
  dx = _this.DEF_R * Math.cos(ns1) * dew; // 东西方向长度(在纬度圈上的投影长度)
  dy = _this.DEF_R * (ns1 - ns2); // 南北方向长度(在经度圈上的投影长度)
  // 勾股定理求斜边长
  distance = Math.sqrt(dx * dx + dy * dy).toFixed(0);
  ApiConfig.staticIsDebug(distance, 'distance');
  return distance;
}

Utils.prototype.getFloorOrCeil = function (value, min, unit, ceil) {
  var resultValue = 0;
  if (value / unit == 0) {
    resultValue = min;
  } else {
    resultValue = parseInt((value / unit)) * unit;
    if (ceil) {
      if (value % unit > 0) {
        resultValue = resultValue + min;
      }
    }
  }
  if (resultValue < 100) {
    resultValue = min;
  }
  return resultValue;
}

Utils.prototype.urlParams = function (url) {
  return (url.split('?'))[1];
}

/**
 * 将url中的参数解析成键值对
 *
 * @param url 链接
 * @return HashMap<String, String>
 */
Utils.prototype.urlParseToMap = function (url) {
  var params = new Map();
  var paramsString = (url.split('?'))[1];
  var paras = paramsString.split("&");
  paras.forEach(function (para) {
    var p = para.split('=');
    params.put(p[0], p[1]);
  })
  return params;
}

Utils.prototype.base64encode = function (str) {
  var out, i, len;
  var c1, c2, c3;
  len = str.length;
  i = 0;
  out = "";
  while (i < len) {
    c1 = str.charCodeAt(i++) & 0xff;
    if (i == len) {
      out += this.base64EncodeChars.charAt(c1 >> 2);
      out += this.base64EncodeChars.charAt((c1 & 0x3) << 4);
      out += "==";
      break;
    }
    c2 = str.charCodeAt(i++);
    if (i == len) {
      out += this.base64EncodeChars.charAt(c1 >> 2);
      out += this.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
      out += this.base64EncodeChars.charAt((c2 & 0xF) << 2);
      out += "=";
      break;
    }
    c3 = str.charCodeAt(i++);
    out += this.base64EncodeChars.charAt(c1 >> 2);
    out += this.base64EncodeChars.charAt(((c1 & 0x3) << 4) | ((c2 & 0xF0) >> 4));
    out += this.base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >> 6));
    out += this.base64EncodeChars.charAt(c3 & 0x3F);
  }
  return out;
}
/*
 投保价格展示
 */
Utils.prototype.insurancePrice = function (price) {
  var finalPrice = 0;
  if (parseInt(price) >= 10000) {
    if (parseInt(price) % 10000 == 0) {
      finalPrice = parseInt(price) / 10000 + "万";
    }
    else {
      finalPrice = parseInt(price);
    }
  }
  else if (parseInt(price) >= 1000) {
    finalPrice = parseInt(price);
  }
  else {
    finalPrice = '';
  }
  console.log(finalPrice + "finalPrice");
  return finalPrice;
}
Utils.prototype.getQueryString = function (url) {
  var map = new Map();
  var strs = url.split("&");
  for (var i = 0; i < strs.length; i++) {
    map.put(strs[i].split("=")[0], unescape(strs[i].split("=")[1]));
  }
  return map;
}

/**
 * 姓名，电话，身份证号隐私保护
 *
 * @param str  需要隐藏的字符串
 * @param frontLen  前面保留位数
 * @param endLen  后面保留位数
 */
Utils.prototype.maskString = function (str, frontLen, endLen) {
  var len = str.length - frontLen - endLen;
  var xing = '';
  for (var i = 0; i < len; i++) {
    xing += '*';
  }
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
}

module.exports = Utils;
