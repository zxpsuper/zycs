const host = require('../../../config').host
const url = require('../../../config').details
const host2 = require('../../../config').host2
var R_htmlToWxml = require('../../../utils/htmlToWxml.js')
const dateFunction = require('../../../utils/util.js')
let typea
Page({
  data: {
    id: '',
    co: '#f18080',
    data: {},
    ty: '',
    count: '',
    navbar: ['全部', '进行中', '已结束'],
    currentTab: 0,
    ongData: [],
    adHidden: 'hidden',
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
    typea = options.id
    console.log('type', typea)
    let that = this
    if (typea === 'support') {
      that.setData({ ty: '支持' })
    } else {
      if (typea === 'praise') {
        that.setData({ ty: '关注' })
      } else {
        if (typea === 'vipcheck') {
          that.setData({ ty: '见证' })
        } else {
          if (typea === 'progress') {
            that.setData({ ty: '跟进' })
          }
        }
      }
    }
    wx.setNavigationBarTitle({
      title: `我的${that.data.ty}`,
      success: function (res) {
        // success
      }
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    this.allRequest()
    this.ongoingRequest()
    this.endRequest()
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


  },
  navbarTap: function (e) {
    console.log('eee = ', e.currentTarget.dataset.idx)
    let index = e.currentTarget.dataset.idx
    if (index == 0) {
      console.log(1111111111)
      console.log('id = ', this.data.id)
      this.allRequest()
    } else {
      if (index == 1) {
        console.log(222222222)
        this.ongoingRequest()
      } else {
        console.log(333333333)
        this.endRequest()
      }
    }
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },
  allRequest() {
    let that = this
    if (typea === 'support') {
      that.setData({ ty: '支持' })
    } else {
      if (typea === 'praise') {
        that.setData({ ty: '关注' })
      } else {
        if (typea === 'vipcheck') {
          that.setData({ ty: '见证' })
        } else {
          if (typea === 'progress') {
            that.setData({ ty: '跟进' })
          }
        }
      }
    }

    let params = {
      state: 'all'
    }

    wx.request({
      url: `${url}${this.data.id}/`,
      data: params,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // success
        console.log('allres', res)
    
        for (let i = 0; i < res.data.result.list.length;i++){
          res.data.result.list[i].ctime = dateFunction.formatTime(new Date(res.data.result.list[i].ctime))
          let today = new Date()
          let timerToday = today.getTime()
          let cha = (timerToday - res.data.result.list[i].stime) / 1000 / 3600 / 24
          res.data.result.list[i].stime = Math.floor(cha)
        }
        
        that.setData({
          data: res.data.result.list,
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
  ongoingRequest() {
    let that = this
    if (typea === 'support') {
      that.setData({ ty: '支持' })
    } else {
      if (typea === 'praise') {
        that.setData({ ty: '关注' })
      } else {
        if (typea === 'vipcheck') {
          that.setData({ ty: '见证' })
        } else {
          if (typea === 'progress') {
            that.setData({ ty: '跟进' })
          }
        }
      }
    }
    let params = {
      state: 'ongoing'
      // page:1,
      // pageSize:that.data.data.length
    }
    wx.request({
      url: `${url}${this.data.id}/`,
      data: params,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // success
        console.log('res', res)
        for (let i = 0; i < res.data.result.list.length; i++) {
          res.data.result.list[i].ctime = dateFunction.formatTime(new Date(res.data.result.list[i].ctime))          
          let today = new Date()
          let timerToday = today.getTime()
          let cha = (timerToday - res.data.result.list[i].stime) / 1000 / 3600 / 24
          res.data.result.list[i].stime = Math.floor(cha)
        }
        that.setData({
          ongData: res.data.result.list
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
  endRequest() {
    let that = this
    if (typea === 'support') {
      that.setData({ ty: '支持' })
    } else {
      if (typea === 'praise') {
        that.setData({ ty: '关注' })
      } else {
        if (typea === 'vipcheck') {
          that.setData({ ty: '见证' })
        } else {
          if (typea === 'progress') {
            that.setData({ ty: '跟进' })
          }
        }
      }
    }
    let params = {
      state: 'end'
      // page:1,
      // pageSize:that.data.data.length
    }
    wx.request({
      url: `${url}${this.data.id}/`,
      data: params,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // success
        console.log('res', res)
        for (let i = 0; i < res.data.result.list.length; i++) {
          res.data.result.list[i].ctime = dateFunction.formatTime(new Date(res.data.result.list[i].ctime))          
          let today = new Date()
          let timerToday = today.getTime()
          let cha = (timerToday - res.data.result.list[i].stime) / 1000 / 3600 / 24
          res.data.result.list[i].stime = Math.floor(cha)
        }
        that.setData({
          endData: res.data.result.list
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
    this.allRequest()
    this.ongoingRequest()
    this.endRequest()
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      mask: true
    })
    wx.stopPullDownRefresh()
  }
})