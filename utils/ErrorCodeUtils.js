var Map = require('MapUtils.js');
var ErrorCode = {}
ErrorCode.setError = function () {
  var errorCodes = new Map();
  this.errorCodes = errorCodes
  
  errorCodes.put("-1", "请检查网络");
  errorCodes.put("-2", "服务器繁忙请稍后再试");
  errorCodes.put("-3", "数据出错了");
  
  errorCodes.put("10001", "signature不正确");
  errorCodes.put("10002", "access_token不正确");
  errorCodes.put("10003", "access_token已过期");
  errorCodes.put("10004", "用户激活");
  errorCodes.put("10005", "用户已初始化");
  errorCodes.put("10006", "APPID不合法");
  errorCodes.put("10007", "有未填写信息");
  errorCodes.put("10008", "有参数非法");
  errorCodes.put("10009", "请求已过期或时间错误");
  errorCodes.put("10010", "用户名密码错误");
  errorCodes.put("10011", "APPSECRET不合法");
  errorCodes.put("10012", "access_token无法获得");
  errorCodes.put("10014", "编辑用户错误");
  errorCodes.put("10015", "用户密码不正确");
  errorCodes.put("10016", "修改密码错误");
  errorCodes.put("10017", "用户已绑定微信");
  errorCodes.put("10018", "目标客户已绑定微信");
  errorCodes.put("10019", "数据同步中");
  errorCodes.put("10020", "数据同步失败");
  errorCodes.put("10025", "操作失败");
  errorCodes.put("10026", "验证码过期");
  errorCodes.put("10027", "验证码不正确");
  errorCodes.put("10028", "用户账户异常");
  errorCodes.put("10029", "手机号码不正确");
  errorCodes.put("10030", "手机号码已注册");
  errorCodes.put("10031", "用户已绑定手机");
  errorCodes.put("10032", "用户绑定手机错误");
  errorCodes.put("10033", "微信已注册");
  errorCodes.put("10034", "用户绑定微信错误");
  errorCodes.put("10035", "请求被系统拒绝");
}

ErrorCode.errorMessage = function (errorCode) {
  if (!this.errorCodes) {
    this.setError();
  }
  var message = this.errorCodes.get(errorCode);
  if (!message) {
    return "请重新登录";
  } else {
    return message;
  }
}

module.exports = ErrorCode;
