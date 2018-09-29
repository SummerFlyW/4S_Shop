var DpHttp = require('DpHttp.js');
var HttpUtils = require('HttpUtils.js');

var InitJS = {};

InitJS.InitFunction = function () {
  this.httpUtils;
  if (!this.dpHttp) {
    this.dpHttp = new DpHttp();
  }
};

module.exports = InitJS;
