let app = getApp()
const xqUrl = require('../../config').axxq
const axxmUrl = require('../../config').axxm

Page({
  data: {
    id: '',
    project: [],
    dataa: [],
    textValue: '',
    _id: '',
    tip:''
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
  //下拉刷新
  onPullDownRefresh: function () {
    this.projectInfo()
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      mask: true
    })
    wx.stopPullDownRefresh()
  },

  // 获取留言信息
  info() {
    let that = this
    console.log('co = ', that.data.project.comment.coCount)
    let params = {
      page: 1,
      pageSize: that.data.project.comment.coCount
    }
    wx.request({
      url: `${xqUrl}${that.data.id}/comments`,
      data: params,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // succes
        console.log('aa = ', res.data.result)
        // 转换时间
        let comment = res.data.result
        comment.commentList = comment.commentList.map(a => {
          a.ctime = app.formatDate(a.ctime)
          return a
        })

        console.log('aa = ', res.data.result)
        that.setData({
          dataa: res.data.result.commentList
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
          project: res.data.result,
          _id: res.data.result._id
        })
        this.info()
      }
    })
  },
  // 留言事件
  text: function (e) {
    let that = this
    that.setData({ textValue: e.detail.value })
  },
  // 提交事件
  zfBtn: function () {
    if (this.data.textValue){
      this.setData({
        tip: ''
      })
      console.log('1111 = ', this.data.textValue)
      wx.request({
        url: `${xqUrl}${this.data._id}/comments`,
        data: {
          comment: this.data.textValue,
          projectId: this.data._id
        },
        method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
        success: function (res) {
          // success
          console.log('res = ', res)

          if (res.errMsg === "request:ok") {
            console.log('123')
            wx.showToast({
              title: '留言成功',
              icon: 'success',
              mask: true
            })
          }
        },
        fail: function (res) {
          // fail
        },
        complete: function (res) {
          // complete
        }
      })
      this.projectInfo()
    }
    else{
      this.setData({
        tip:'请填写评论！'
      })
    }
  },
})