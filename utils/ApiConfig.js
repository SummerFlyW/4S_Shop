var ApiConfig = {
  i: 0,
  VER: 20,
  DEBUG: 1,
  PAGE_COUNT: 20,
  CHECK_TRADE_LOG: 3,
  HOST: 'https://api2.mimixiche.com',
}

if (ApiConfig.DEBUG) {
  ApiConfig.HOST = "https://devwxapp.mimixiche.cn";
  wx.setEnableDebug({
    enableDebug: true
  })
}

/**
 * 打印信息 debug模式打印 正式不打印
 * @param {Object} info    打印信息
 * @param {Object} flag    标示
 * @param {Object} isJson    是否是json类型
 */
ApiConfig.staticIsDebug = function (info, flag, isJson) {
  if (ApiConfig.DEBUG) {
    if (flag) {
      console.log('--' + flag + '--' + (isJson ? JSON.stringify(info) : info));
    } else {
      console.log('--flag--' + (isJson ? JSON.stringify(info) : info));
    }
  }
}

ApiConfig.staticIsHttpDebug = function (info) {
  if (ApiConfig.DEBUG) {
    console.log(info);
  }
}

ApiConfig.getRandomString = function (length) {
  var base = "abcdefghijklmnopqrstuvwxyz0123456789";
  var sb = '';
  for (var i = 0; i < length; i++) {
    var number = Math.floor(Math.random() * base.length + 1);
    sb += base.charAt(number)
  }
  return sb;
}

/**
 * 短弹窗提示
 * @param {Object} info        信息
 * @param {Object} isJson    是否是json类型
 */
ApiConfig.staticShowToast = function (info, isJson) {
  wx.showToast({
    title: (isJson ? JSON.stringify(info) : info),
    image: '../../images/ico_toast.png',
    duration: 2000
  })
}

/**
 * 长弹窗提示
 * @param {Object} info        信息
 * @param {Object} isJson    是否是json类型
 */
ApiConfig.staticShowLongToast = function (info, isJson) {
  wx.showToast({
    title: (isJson ? JSON.stringify(info) : info),
    image: '../../images/ico_toast.png',
    duration: 3000
  });
}

/**
 * 等待提示
 * @param info
 */
ApiConfig.staticShowLoading = function (info) {
  wx.showLoading({
    mask: true,
    title: info
  })
}

/**
 *关闭提示
 */
ApiConfig.staticHideLoading = function () {
  wx.hideLoading();
}


/**
 * 短弹窗提示  debug模式打印 正式不打印
 * @param {Object} info        信息
 */
ApiConfig.staticToast = function (info) {
  if (ApiConfig.DEBUG) {
    wx.showToast({
      title: info
    });
  }
}

/**
 * 返回秒的时间戳 String
 */
ApiConfig.phpTime = function () {
  var date = new Date();
  var timeInt = date.getTime();
  timeInt = (timeInt - (timeInt % 1000)) / 1000
  return timeInt + "";
}

/**
 * 返回秒的时间戳 number
 */
ApiConfig.phpTimeInt = function () {
  var date = new Date();
  var timeInt = date.getTime();
  timeInt = (timeInt - (timeInt % 1000)) / 1000
  return timeInt;
}

module.exports = ApiConfig;