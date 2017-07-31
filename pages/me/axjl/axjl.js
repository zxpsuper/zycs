let app = getApp()
const host = require('../../../config').host
const jkjl = require('../../../config').jkjl
const host2 = require('../../../config').host2
var R_htmlToWxml = require('../../../utils/htmlToWxml.js')
Page({
  data: {
    id: '',
    data: {},
    count: '',
    adHidden: 'hidden',
    navbar: ['全部', '可开收据', '已开收据'],
    currentTab: 0,
    ongData: [],
    endData: []
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
      content: '网址已成功复制于剪贴板，请于浏览器中打开',
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
    this.setData({ id: options.id })
    console.log('id', options.id)
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    this.request()
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
  request() {
    let that = this
    let params = {
      pagesize: 999999,
      page: 1
    }
    wx.request({
      url: jkjl,
      data: { params },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // success
        console.log('res', res)
        let donation = res.data.result

        donation.list = donation.list.map(a => {
          a.ctime = app.formatDate(a.ctime)
          return a
        })
        that.setData({
          data: res.data.result.list
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
  }
})