//discover.js
//获取应用实例
let app = getApp()
const host2 = require('../../config').host2
const host = require('../../config').host
var R_htmlToWxml = require('../../utils/htmlToWxml.js')
Page({
  data: {
    tops: [],
    zxzcs: [],
    list: [],
    hhh: [],
    t: '',
    listLoadShow: false,
    adHidden: 'hidden',
    page: 1, pageSize: 10,
    count: 0, totalPage: 0,
    hasLoadedPage: {},
    btngroup: [
      {
        src: '../images/zc.png',
        text: '公益众筹',
        url: "../gongyi/gongyi"
      },
      {
        src: '../images/gy.png',
        text: '长期募捐',
        url: "../changqi/changqi"
      }
    ],
  },
  // 关闭广告
  closeAd: function () {
    this.setData({
      adHidden: 'hidden'
    })
  },
  //复制广告链接
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
  // 显示广告
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
  // 获取广告详情
  getAD(){
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
          console.log('adDetail', this.data.detail)
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
    this.getCount()
    this.getAD()
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
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
    this.load()
  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '众益慈善', // 分享标题
      desc: '众益慈善', // 分享描述
      path: 'pages/index/index' // 分享路径
    }
  },
  // 获取数量
  getCount() {
    wx.request({
      url: `${host}/donation/count`,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: res => {
        console.log('ad = ', res)
        if (res.data.result_code == 1) {
          this.setData({
            count: res.data.result.donationCount,
            totalPage: Math.ceil(res.data.result.donationCount / this.data.pageSize)
          })
          console.log('totalpage', this.data.totalPage)
          this.load()
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
  // 加载更多
  load() {
    if (this.data.page > this.data.totalPage) return
      wx.showLoading({
        title: '正在加载中',
        mask: true
      })
    let page = this.data.page
    let pageSize = this.data.pageSize
    let that = this
    wx.request({
      url: `${host}/donation/list`,
      data: { page, pageSize },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: res => {
        console.log('item = ', res)
        if (res.data.result_code == 1) {
          let prolist = res.data.result.donationList
          for (let i = 0; i < prolist.length; i++) {
            let today = new Date()
            let timerToday = today.getTime();
            let cha = (timerToday - prolist[i].project.stime) / 1000 / 3600 / 24
            res.data.result.donationList[i].project.stime = Math.floor(cha)
          }
          let super1 = res.data.result.donationList.map(a => {
            a.ctime = app.formatDate(a.ctime)
            a.super = (a.project.dmoney / a.project.tmoney) * 100
            return a
          })
          let q = that.data.page + 1
          console.log('q', q)
          // let super2 = that.data.list
          // console.log('super2', super2)
          // super2 = super2.concat(super1)
          let sp = [...that.data.list, ...res.data.result.donationList]
          that.setData({
            list: sp,
            page: q
          })
          wx.hideLoading()
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
  // 下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      mask: true
    })
    this.setData({
      list:[],
      page: 1, 
      pageSize: 10
    })
    this.getCount()
    wx.stopPullDownRefresh()
  }
})
