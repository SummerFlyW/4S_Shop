Page({
  data: {
    orderId: "",
    orderPrice:"",
    orderProduct:""
  },
  onLoad: function(options) {
    if (options.id){
      this.setData({
        orderId: options.id
      })
    }
    if (options.price){
      this.setData({
        orderPrice: options.price
      })
    }
    if (options.product) {
      this.setData({
        orderProduct: options.product
      })
    }
  },
  showOrder: function() {
    wx.navigateTo({
      url: '../orderDetail/orderDetail?id=' + this.data.orderId
    })
  },
  backIndex: function() {
    wx.switchTab({
      url: '../order/order'
    })
  }
})