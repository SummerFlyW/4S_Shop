function start() {
  Observer.refreshNetworkType(), VdsInstrumentAgent.initInstrument(Observer)
}
for (var LZString = function () {
  var e = String.fromCharCode, t = {
    compressToUTF16: function (n) {
      return null == n ? "" : t._compress(n, 15, function (t) {
        return e(t + 32)
      }) + " "
    }, compressToUint8Array: function (e) {
      for (var n = t.compress(e), i = new Uint8Array(2 * n.length), s = 0, r = n.length; s < r; s++) {
        var o = n.charCodeAt(s);
        i[2 * s] = o >>> 8, i[2 * s + 1] = o % 256
      }
      return i
    }, compress: function (n) {
      return t._compress(n, 16, function (t) {
        return e(t)
      })
    }, _compress: function (e, t, n) {
      if (null == e)return "";
      var i, s, r, o = {}, a = {}, u = "", g = "", l = "", p = 2, c = 3, d = 2, h = [], f = 0, m = 0;
      for (r = 0; r < e.length; r += 1)if (u = e.charAt(r), Object.prototype.hasOwnProperty.call(o, u) || (o[u] = c++, a[u] = !0), g = l + u, Object.prototype.hasOwnProperty.call(o, g)) l = g; else {
        if (Object.prototype.hasOwnProperty.call(a, l)) {
          if (l.charCodeAt(0) < 256) {
            for (i = 0; i < d; i++)f <<= 1, m == t - 1 ? (m = 0, h.push(n(f)), f = 0) : m++;
            for (s = l.charCodeAt(0), i = 0; i < 8; i++)f = f << 1 | 1 & s, m == t - 1 ? (m = 0, h.push(n(f)), f = 0) : m++, s >>= 1
          } else {
            for (s = 1, i = 0; i < d; i++)f = f << 1 | s, m == t - 1 ? (m = 0, h.push(n(f)), f = 0) : m++, s = 0;
            for (s = l.charCodeAt(0), i = 0; i < 16; i++)f = f << 1 | 1 & s, m == t - 1 ? (m = 0, h.push(n(f)), f = 0) : m++, s >>= 1
          }
          p--, 0 == p && (p = Math.pow(2, d), d++), delete a[l]
        } else for (s = o[l], i = 0; i < d; i++)f = f << 1 | 1 & s, m == t - 1 ? (m = 0, h.push(n(f)), f = 0) : m++, s >>= 1;
        p--, 0 == p && (p = Math.pow(2, d), d++), o[g] = c++, l = String(u)
      }
      if ("" !== l) {
        if (Object.prototype.hasOwnProperty.call(a, l)) {
          if (l.charCodeAt(0) < 256) {
            for (i = 0; i < d; i++)f <<= 1, m == t - 1 ? (m = 0, h.push(n(f)), f = 0) : m++;
            for (s = l.charCodeAt(0), i = 0; i < 8; i++)f = f << 1 | 1 & s, m == t - 1 ? (m = 0, h.push(n(f)), f = 0) : m++, s >>= 1
          } else {
            for (s = 1, i = 0; i < d; i++)f = f << 1 | s, m == t - 1 ? (m = 0, h.push(n(f)), f = 0) : m++, s = 0;
            for (s = l.charCodeAt(0), i = 0; i < 16; i++)f = f << 1 | 1 & s, m == t - 1 ? (m = 0, h.push(n(f)), f = 0) : m++, s >>= 1
          }
          p--, 0 == p && (p = Math.pow(2, d), d++), delete a[l]
        } else for (s = o[l], i = 0; i < d; i++)f = f << 1 | 1 & s, m == t - 1 ? (m = 0, h.push(n(f)), f = 0) : m++, s >>= 1;
        p--, 0 == p && (p = Math.pow(2, d), d++)
      }
      for (s = 2, i = 0; i < d; i++)f = f << 1 | 1 & s, m == t - 1 ? (m = 0, h.push(n(f)), f = 0) : m++, s >>= 1;
      for (; ;) {
        if (f <<= 1, m == t - 1) {
          h.push(n(f));
          break
        }
        m++
      }
      return h.join("")
    }
  };
  return t
}(), Utils = {
  encryptXor: function (e, t) {
    for (var n = e.length - 1; n >= 0; n--)e[n] ^= t;
    return e
  },
  bind: function (e, t) {
    return function () {
      t.apply(e, arguments)
    }
  },
  guid: function () {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (e) {
      var t = 16 * Math.random() | 0, n = "x" == e ? t : 3 & t | 8;
      return n.toString(16)
    })
  },
  Base64: {
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
    encodeUintArray: function (e) {
      for (var t = "", n = 0, i = e.length - 3; n <= i;) {
        var s = e[n] << 16 | e[n + 1] << 8 | e[n + 2];
        t += Utils.Base64._keyStr[s >> 18 & 63], t += Utils.Base64._keyStr[s >> 12 & 63], t += Utils.Base64._keyStr[s >> 6 & 63], t += Utils.Base64._keyStr[s >> 0 & 63], n += 3
      }
      var r = e.length - n;
      if (r > 0) {
        var s = 0;
        s |= e[n] << 16, 2 == r && (s |= e[n + 1] << 8), t += Utils.Base64._keyStr[s >> 18 & 63], t += Utils.Base64._keyStr[s >> 12 & 63], t += 2 == r ? Utils.Base64._keyStr[s >> 6 & 63] : "=", t += "="
      }
      return t
    }
  },
  getOS: function (e) {
    if (e) {
      var t = e.toLowerCase();
      return t.indexOf("android") != -1 ? "Android" : t.indexOf("ios") != -1 ? "iOS" : e
    }
  },
  getValidValue: function (e, t) {
    if (e && t)for (var n = 0, i = t.length; n < i; n++)if (void 0 != e[t[n]])return e[t[n]]
  }
}, Observer = {
  currentPage: {},
  eventQueue: [],
  currentTimer: null,
  sessionId: null,
  SESSION_INTERVAL: 3e4,
  resendPageTimer: null,
  uid: null,
  csParams: [],
  leaveAppTime: 0,
  refreshNetworkType: function () {
    wx.getNetworkType({
      success: Utils.bind(this, function (e) {
        this.networkType = e.networkType.toUpperCase()
      })
    })
  },
  setCS: function (e, t, n) {
    var i = this.csParams[e];
    !n || i && i.value || !this.lastPageEvent || (this.resendPageTimer && clearTimeout(this.resendPageTimer), this.resendPageTimer = setTimeout(Utils.bind(this, this.resendPage), 100)), this.csParams[e] = {
      key: t,
      value: n
    }
  },
  resendPage: function () {
    this.lastPageEvent && (this.patchCS(this.lastPageEvent), this.saveEvent(this.lastPageEvent))
  },
  patchCS: function (e) {
    this.csParams.forEach(function (t, n) {
      t.value && (e["cs" + (n + 1)] = t.key + ":" + t.value)
    })
  },
  appListener: function (e, t, n) {
    if (console.log("App.", t, Date.now()), "onLaunch" == t) {
      var i = wx.getStorageSync("_growing_data_");
      i && i.pv && i.other && (Uploader.messageQueue = i, wx.removeStorage({key: "_growing_data_"}))
    } else"onHide" == t ? (this.leaveAppTime = Date.now(), wx.setStorage({
      key: "_growing_data_",
      data: Uploader.messageQueue
    })) : "onShow" == t && Date.now() - this.leaveAppTime > this.SESSION_INTERVAL && (this.sessionId = null)
  },
  pageListener: function (e, t, n) {
    if (console.log("Page.", e.__route__, "#", t, Date.now()), "onShow" == t) {
      this.sessionId || this.sendVisitEvent(), this.refreshNetworkType(), this.currentPage.path = e.__route__, this.currentPage.time = Date.now();
      var i = {
        t: "page",
        tm: this.currentPage.time,
        p: e.__route__,
        tl: e.data.growingTitle,
        r: this.networkType
      };
      this.patchCS(i), this.lastPageEvent = i, this.saveEvent(i)
    } else if ("onLoad" == t) {
      var s = n[0];
      s && s.giochannel && (this.giochannel = s.giochannel)
    }
  },
  clickListener: function (e, t) {
    console.log("Click on ", e.currentTarget.id, Date.now()), this.saveEvent(this.makeClickEvent(e, t))
  },
  saveEvent: function (e) {
    e.u = this.uid, e.s = this.sessionId, e.tm = e.tm || Date.now(), e.d = growingio.appId, this.eventQueue.push(e), growingio.debug && console.info("genrate new event", JSON.stringify(e, 0, 2)), this.currentTimer || (this.currentTimer = setTimeout(Utils.bind(this, function () {
      this.currentTimer = void 0;
      var e = [], t = [];
      this.eventQueue.map(function (n) {
        "clck" == n.t ? t.push(n) : e.push(n)
      }), this.eventQueue = [], e.length && Uploader.uploadEvent("pv", e), t.length && Uploader.uploadEvent("other", t)
    }), 2e3))
  },
  sendVisitEvent: function () {
    this.uid || (this.uid = wx.getStorageSync("_growing_uid_"), this.uid || (this.uid = Utils.guid(), wx.setStorageSync("_growing_uid_", this.uid))), this.sessionId || (this.sessionId = Utils.guid());
    var e = wx.getSystemInfoSync(), t = {
      t: "vst",
      b: "MINA",
      l: e.language,
      sh: Math.round(e.windowHeight * e.pixelRatio),
      sw: Math.round(e.windowWidth * e.pixelRatio),
      ch: this.giochannel,
      cv: e.version,
      av: "0.01",
      os: Utils.getOS(e.platform),
      osv: e.system,
      dm: e.model.replace(/<.*>/, ""),
      r: this.networkType
    };
    this.patchCS(t), this.saveEvent(t)
  },
  makeClickEvent: function (e, t) {
    var n = Date.now(), i = {
      t: "clck",
      tm: n,
      p: this.currentPage.path,
      ptm: this.currentPage.time,
      e: [{
        x: e.currentTarget.id + "#" + t,
        v: e.currentTarget.dataset.growingTitle,
        idx: e.currentTarget.dataset.growingIdx,
        tm: n
      }]
    };
    return "cancel" !== e.type && "confirm" !== e.type || void 0 === i.e[0].v && (i.e[0].v = e.type), i
  }
}, VdsInstrumentAgent = {
  defaultPageCallbacks: {},
  defaultAppCallbacks: {},
  appHandlers: ["onLaunch", "onShow", "onHide"],
  pageHandlers: ["onLoad", "onReady", "onShow", "onHide", "onUnload", "onPullDownRefresh", "onReachBottom"],
  clickEventTypes: ["tap", "submit", "cancel", "confirm"],
  originalPage: Page,
  originalApp: App,
  instrument: function (e) {
    if (!growingio.isEnabled())return e;
    for (var t in e)"function" == typeof e[t] && (e[t] = function (e, t) {
      return function () {
        var n = t.apply(this, arguments);
        try {
          var i = arguments ? arguments[0] : void 0;
          i && i.currentTarget && VdsInstrumentAgent.clickEventTypes.indexOf(i.type) != -1 && VdsInstrumentAgent.observer.clickListener(i, e), this._growing_app_ && VdsInstrumentAgent.appHandlers.indexOf(e) != -1 && VdsInstrumentAgent.defaultAppCallbacks[e].apply(this, arguments), this._growing_page_ && VdsInstrumentAgent.pageHandlers.indexOf(e) != -1 && VdsInstrumentAgent.defaultPageCallbacks[e].apply(this, arguments)
        } catch (e) {
          growingio.debug && console.log(e)
        }
        return n
      }
    }(t, e[t]));
    return e._growing_app_ && VdsInstrumentAgent.appHandlers.map(function (t) {
      e[t] || (e[t] = VdsInstrumentAgent.defaultAppCallbacks[t])
    }), e._growing_page_ && VdsInstrumentAgent.pageHandlers.map(function (t) {
      e[t] || (e[t] = VdsInstrumentAgent.defaultPageCallbacks[t])
    }), e
  },
  GrowingPage: function (e) {
    e._growing_page_ = !0, VdsInstrumentAgent.originalPage(VdsInstrumentAgent.instrument(e))
  },
  GrowingApp: function (e) {
    e._growing_app_ = !0, VdsInstrumentAgent.originalApp(VdsInstrumentAgent.instrument(e))
  },
  initInstrument: function (e) {
    VdsInstrumentAgent.observer = e, VdsInstrumentAgent.pageHandlers.forEach(function (e) {
      VdsInstrumentAgent.defaultPageCallbacks[e] = function () {
        this.__route__ && VdsInstrumentAgent.observer.pageListener(this, e, arguments)
      }
    }), VdsInstrumentAgent.appHandlers.forEach(function (e) {
      VdsInstrumentAgent.defaultAppCallbacks[e] = function () {
        VdsInstrumentAgent.observer.appListener(this, e, arguments)
      }
    }), Page = function () {
      return VdsInstrumentAgent.GrowingPage(arguments[0])
    }, App = function () {
      return VdsInstrumentAgent.GrowingApp(arguments[0])
    }
  }
}, Uploader = {
  trackerOrigin: "https://api.growingio.com",
  messageQueue: {pv: [], other: []},
  uploadingQueue: {pv: [], other: []},
  uploadingType: "",
  requestId: 0,
  isUploading: function () {
    return this.uploadingQueue.pv.length + this.uploadingQueue.other.length > 0
  },
  flushMessages: function (e) {
    this.uploadingQueue[e] = this.messageQueue[e].slice(), this.messageQueue[e] = [];
    var t = this.uploadingQueue[e];
    this.uploadingType = e;
    var n = Date.now(), i = JSON.stringify(t), s = LZString.compressToUint8Array(i), r = Utils.encryptXor(s, 255 & n), o = Utils.Base64.encodeUintArray(r), a = o;
    growingio.debugUpload && console.log("uploading", JSON.stringify(t, 0, 2)), this.requestId++, wx.request({
      url: this.trackerOrigin + "/v3/" + growingio.projectId + "/mina/" + e + "?stm=" + n,
      header: {"X-Compress-Codec": "1", "X-Crypt-Codec": "1", "X-Encode-Codec": "1"},
      method: "POST",
      data: a,
      success: Utils.bind(this, function () {
        growingio.debugUpload && console.log("upload succeed", this.requestId), this.uploadingQueue[this.uploadingType] = [], this.messageQueue.pv.length > 0 ? this.flushMessages("pv") : this.messageQueue.other.length > 0 && this.flushMessages("other")
      }),
      fail: Utils.bind(this, function () {
        this.messageQueue[this.uploadingType] = this.uploadingQueue[this.uploadingType].concat(this.messageQueue[this.uploadingType]), this.uploadingQueue[this.uploadingType] = []
      })
    })
  },
  uploadEvent: function (e, t) {
    !growingio.local && growingio.projectId && (this.messageQueue[e] = this.messageQueue[e].concat(t), this.isUploading() || this.flushMessages(e))
  }
}, projectId, growingio = {
  set trackerHost(e) {
    0 != e.indexOf("http") && (e = "https://" + e), trackerOrigin = e
  }, set projectId(e) {
    e && !projectId && (projectId = e, start())
  }, get projectId() {
    return projectId
  }, disabled: !1, debug: !1, local: !1, appId: void 0, isEnabled: function () {
    return !growingio.disabled && growingio.projectId && growingio.appId
  }
}, i = 0; i < 10; i++)growingio["setCS" + (i + 1)] = function (e) {
  return function (t, n) {
    n = void 0 === n || null === n ? "" : String(n), Observer.setCS(e, t, n)
  }
}(i);
console.log("init growingio"), module.exports = growingio;