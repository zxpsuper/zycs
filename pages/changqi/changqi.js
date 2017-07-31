const host = require('../../config').host
const url = require('../../config').list
const countUrl = require('../../config').zjl
Page({
  data:{
    zxcqs:[]
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
   this.zxcq()
  },
  onHide:function(){
    // 生命周期函数--监听页面隐藏

  },
  onUnload:function(){
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数

  },
  onShareAppMessage: function() {
    // 用户点击右上角分享
    return {
      title: '众益慈善', // 分享标题
      desc: '众益慈善', // 分享描述
      path: 'pages/index/index' // 分享路径
    }
  },
  discover: function () {
    wx.switchTab({
      url: '../discover/discover',
    })
  },
  zxcq(){
    let paramsa = {
      state:'1',
      type:'2'
    }
    let that = this
    wx.request({
      url: countUrl,
      data: paramsa,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
       header: {'content-type':   'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function(res){
        // success
        console.log('res = ',res)
        let params = {
          state:'1',
          type:'2',
          page:1,
          pageSize:res.data.result.projectCount
          }
        wx.request({
          url: url,
          data:params,
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {'content-type':   'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
          success: function(res){
            // success
            console.log('最新长期111 = ',res.data.result.projectList)
            that.setData({
              zxcqs:res.data.result.projectList
            })
          },
          fail: function(res) {
            // fail
          },
          complete: function(res) {
            // complete
          }
        })
      },
      fail: function(res) {
        // fail
      },
      complete: function(res) {
        // complete
      }
    })
    console.log('Url',url)
    
  },
  onPullDownRefresh: function(){
    this.zxcq()
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      mask:true
    })
    wx.stopPullDownRefresh()
  }
})