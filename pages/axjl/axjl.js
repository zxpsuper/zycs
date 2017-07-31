let app = getApp()
const xqUrl = require('../../config').axxq
const axxmUrl = require('../../config').axxm
Page({
  data: {
    id: '',
    project: {},
    dataa: []
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    let that = this
    that.setData({
      id: options.id
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    this.projectInfo()
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
  onPullDownRefresh: function () {
    //下拉刷新
    this.xq()
    this.projectInfo()
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      mask: true
    })
  },
  // 获取支持记录信息
  info() {
    let that = this
    let params = {
      page: 1,
      pageSize: that.data.project.donation.doCount
    }
    wx.request({
      url: `${xqUrl}${that.data.id}/donations`,
      data: params,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // succes
        console.log('aa = ', res.data.result)
        let donation = res.data.result
        // 修改时间样式并返回
        donation.donationList = donation.donationList.map(a => {
          a.ctime = app.formatDate(a.ctime)
          return a
        })

        that.setData({
          dataa: res.data.result.donationList
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
  // 获取项目信息
  projectInfo() {
    let _this = this
    console.log(`${axxmUrl}${_this.data.id}`)
    console.log('ss = ', this.data.id)
    wx.request({
      url: `${axxmUrl}${_this.data.id}`,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: res => {
        // success
        console.log('zz = ', res)
        _this.setData({
          project: res.data.result
        })
        this.info()
      }
    })
  }

})