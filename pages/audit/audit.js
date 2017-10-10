// pages/audit/audit.js
const url = require('../../config').fqxq
const dateFunc = require('../../utils/util').formatTime
var R_htmlToWxml = require('../../utils/htmlToWxml')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height1: "400rpx",
    readhidden: '',
  },
  getDetail() {
    let that = this
    wx.request({
      url: `${url}${this.data.id}`,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // success
        if (res.data.result_code) {
          res.data.result.closingTime = dateFunc(new Date(res.data.result.closingTime))
          if (res.data.result.carState == 0) {
            res.data.result.carState = "未变卖"
          } else {
            res.data.result.carState = "已变卖"
          }
          if (res.data.result.houseState == 0) {
            res.data.result.houseState = "未变卖"
          } else {
            res.data.result.houseState = "已变卖"
          }
          if (res.data.result.seriousInsurance == 0) {
            res.data.result.seriousInsurance = "未购买商业重疾保险"
          } else {
            res.data.result.seriousInsurance = "已购买商业重疾保险"
          }
          if (res.data.result.medicalInsurance == 0) {
            res.data.result.medicalInsurance = "未缴纳医保"
          } else {
            res.data.result.medicalInsurance = "已缴纳医保"
          }
          that.setData({
            data: res.data.result
          })
          console.log(that.data.data)
        }

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  readmore: function () {
    this.setData({
      readhidden: 'hidden',
      height1: 'auto'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id
    console.log(id)
    this.setData({
      id
    })
    this.getDetail()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})