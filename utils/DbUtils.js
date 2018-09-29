var Map = require('MapUtils.js');
var ApiConfig = require('ApiConfig.js');

var DaoConfig = {
  time: 60 * 60 * 24 * 7
};
var DbUtils = {
  getDaoConfig: DaoConfig
};

DbUtils.getStorageSync = function (key) {
  return wx.getStorageSync(key);
}

DbUtils.getStorage = function (key, onSuccess) {
  wx.getStorage({
    key: key,
    success: function (res) {
      onSuccess(res.data);
    }
  })
}

DbUtils.setStorage = function (key, value) {
  wx.setStorage({
    key: key,
    data: value
  });
}

DbUtils.getCache = function (key) {
  var phpTimeInt = ApiConfig.phpTimeInt();
  try {
    var object = wx.getStorageSync(key);
    if (object.time > phpTimeInt) {
      return object.value;
    } else {
      return '';
    }
  } catch (e) {
    console.log(e);
    return '';
  }
}

DbUtils.setCache = function (key, value, time) {
  var phpTimeInt = ApiConfig.phpTimeInt();
  var object = {};
  time = time || 0;
  if (!time) {
    time = DbUtils.getDaoConfig.time;
  }
  time = time + phpTimeInt;
  object.value = value;
  object.time = time;
  wx.setStorage({
    key: key,
    data: object
  });
}

/**
 * 删除指定数据
 */
DbUtils.removeItem = function (key) {
  wx.removeStorageSync(key);
}

/**
 * 清空所有存储数据
 */
DbUtils.deleteInfo = function () {
  wx.clearStorageSync();
}

module.exports = DbUtils;