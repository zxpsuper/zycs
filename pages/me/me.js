const host = require('../../config').host
const url = require('../../config').my
const header = require('../../config').headerJson
const host2 = require('../../config').host2
var R_htmlToWxml = require('../../utils/htmlToWxml.js')
Page({
  data: {
    data: [],
    userInfo: '',
    adHidden: 'hidden',
    userinfo2: [
      //   {
      //   src: "../images/help.png",
      //   text: "我求助的",
      //   url: "/pages/me/faqi/faqi?id={{data.id}}"
      // },
      {
        src: "http://ui.zc.gongyicishan.net/wx-ui/images/support.png",
        text: "我支持的",
        url: "/pages/me/details/details?id=support"
      },
      {
        src: "http://ui.zc.gongyicishan.net/wx-ui/images/follow.png",
        text: "我关注的",
        url: "/pages/me/details/details?id=praise"
      },
      {
        src: "http://ui.zc.gongyicishan.net/wx-ui/images/witness.png",
        text: "我见证的",
        url: "/pages/me/details/details?id=vipcheck"
      },
      {
        src: "http://ui.zc.gongyicishan.net/wx-ui/images/getin.png",
        text: "我跟进的",
        url: "/pages/me/details/details?id=progress"
      }]
  },
  closeAd: function () {
    this.setData({
      adHidden: 'hidden'
    })
  },
  copyAd: function () {
    this.setData({
      adHidden: 'hidden'
    })
    let at = this.data.at
    let adId = this.data.adId
    wx.request({
      url: `${host2}/smallapp/advertising/${this.data.adId}/hitDetailBtn`,
      data: { at, adId },
      method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: res => {
        if (res.data.result_code == 1) {
          console.log('记录成功')
        }
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
    wx.setClipboardData({
      data: `${this.data.adUrl}`,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        })
      }
    })
    wx.showModal({
      title: '提示',
      content: '亲，网址已成功复制于剪贴板，请于浏览器中打开',
    })
  },
  showad: function () {
    this.setData({
      adHidden: ''
    })
    let at = this.data.at
    let adId = this.data.adId
    wx.request({
      url: `${host2}/smallapp/advertising/${this.data.adId}/hit`,
      data: { at, adId },
      method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: res => {
        if (res.data.result_code == 1) {
          console.log('记录成功')
          console.log('记录成功', res.data)
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
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    this.request()
    this.login()
    wx.request({
      url: `${host2}/smallapp/advertising`,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: res => {
        console.log('ad = ', res)
        if (res.data.result_code == 1) {
          this.setData({
            adImgPath: res.data.result.imgPath,
            adDetail: R_htmlToWxml.html2json(res.data.result.detail.replace(/&nbsp;/g, ' ').replace(/^<noscript>.*<noscript>$/, ' ').replace(/<br>/g, '\n')),
            adId: res.data.result._id,
            adUrl: res.data.result.url
          })
          console.log('adres', res.data)
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
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '众益慈善', // 分享标题
      desc: '众益慈善', // 分享描述
      path: 'pages/index/index' // 分享路径
    }
  },
  // 发出请求
  request() {
    let that = this
    wx.request({
      url: url,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // success
        console.log('我', res)
        that.setData({
          data: res.data.result
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  onPullDownRefresh: function () {
    this.request()
  
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      mask: true
    })
    wx.stopPullDownRefresh()
  },
  login() {
    let that = this
    wx.getUserInfo({
      success: function (res) {
        console.log('个人信息 = ', res.userInfo)
        that.setData({
          userInfo: res.userInfo
        })
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  //投诉建议
  advice: function () {
    wx.navigateTo({
      url: '/pages/my/advice/advice',
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  }
})