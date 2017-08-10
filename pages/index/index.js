const host = require('../../config').host
const zctjUrl = require('../../config').zctj
const zxcqUrl = require('../../config').zxcq
const imgUrl = require('../../config').img
//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    image: '',
    bt: '',
    money: '',
    people: '',
    jz: '',
    yc: '',
    datas: [],
    state: '1',
    deadlineType: '1',
    stateEnd: '',
    domainType: '',
    fuzzy: '',
    statea: {},
    progress: '',
    total: 0, pageSize: 10, pageNo: 1,
    zctjs: [],
    jjzcs: [],
    zxzcs: [],
    cqzcs: [],
    zxcqs: [],
    zxjszcs: [],
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
      },
      {
        src: '../images/xx.png',
        text: '我关注的',
        url: "/pages/me/details/details?id=praise"
      },
      {
        src: '../images/zhichi.png',
        text: '我支持的',
        url: "/pages/me/details/details?id=support"
      }
    ]
  },
  onLoad: function () {
    let data = this.data
    app.login()
  },
  // 轮播图跳转
  goto: function (e) {
    console.log('e.currentTarget.id = ', e.currentTarget.id)
    let projectId = e.currentTarget.id
    wx.navigateTo({
      url: `../project/happysixone/happy?id=${projectId}`,
      success: function (res) {
        // success
        console.log('projectId', projectId)
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  //众筹推荐
  zctj() {
    let that = this
    wx.request({
      url: zctjUrl,
      data: {
        page: 1,
        pageSize: 4,
        state: '1',
        recommenderType: '1'
      },
      method: 'GET', // OPTIONS, GET, HEAD, GET, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        if (!app.authCheck(res, '/pages/index/index')) return
        // success
        console.log('众筹推荐 = ', res)
        let caldatas = res.data.result.projectList.filter(d => d.state == '1')
        that.setData({
          zctjs: caldatas
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
  //最新长期
  zxcq() {
    let that = this
    wx.request({
      url: zxcqUrl,
      data: {
        page: 1,
        pageSize: 4,
        state: '1'
      },
      method: 'GET', // OPTIONS, GET, HEAD, GET, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        if (!app.authCheck(res, '/pages/index/index')) return
        // success
        console.log('最新长期 = ', res.data.result.projectList)
        that.setData({
          zxcqs: res.data.result.projectList
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
  //分享
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '众益慈善', // 分享标题
      desc: '众益慈善', // 分享描述
      path: 'pages/index/index' // 分享路径
    }
  },
  // 获取轮播图图片
  img() {
    let that = this
    wx.request({
      url: imgUrl,
      data: {
        state: '1'
      },
      method: 'GET', // OPTIONS, GET, HEAD, GET, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        if (!app.authCheck(res, '/pages/index/index')) return
        // success
        console.log('img = ', res)
        that.setData({
          imgUrls: res.data.result.bannerList,
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
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      mask: true
    })
    this.zctj()
    this.zxcq()
    this.img()
    console.log('jwt = ', wx.getStorageSync('jwt'))
    wx.stopPullDownRefresh()
  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    this.zctj()
    this.zxcq()
    this.img()
  }
})
