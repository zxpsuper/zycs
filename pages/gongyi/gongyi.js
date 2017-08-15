
const zjlUrl = require('../../config').zjl
const countUrl = require('../../config').list
Page({
  data:{
    zctjs:[],
    jss:[],
    navbar: ['进行中', '已结束'],  
    currentTab: 0 ,
  },
  // 查看更多项目
  discover: function () {
    wx.switchTab({
      url: '../discover/discover',
    })
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    this.getproject ()
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
  // 获取项目信息
  getproject () {
    let param = {
      state:'1',
      type:'1'
      }
    let that = this
    wx.request({
      url: zjlUrl,
      data:param,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {'content-type':   'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function(res){
        // success
        console.log('count = ',res)
        let params = {
          state:'1',
          type:'1',
          page:1,
          pageSize:res.data.result.projectCount
          }
        wx.request({
          url: countUrl,
          data:params,
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {'content-type':   'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
          success: function(res){
            // success
            console.log('最新长期111 = ',res.data.result.projectList)
            that.setData({
              zctjs:res.data.result.projectList
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
  },
  // 下拉刷新
  onPullDownRefresh: function(){
    this.getproject ()
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      mask:true
    })
    wx.stopPullDownRefresh()
  },
  // 导航切换
  navbarTap: function(e){  
    console.log('eee = ',e.currentTarget.dataset.idx)
    let index = e.currentTarget.dataset.idx
    if(index == 0){
      this.getproject ()
    }else{
      this.endproject()
    }
    this.setData({  
      currentTab: e.currentTarget.dataset.idx  
    })  
  },
  // 已经结束项目
  endproject () {
    let param = {
      state:'1',
      type:'1',
      stateEnd:'1'
      }
    let that = this
    wx.request({
      url: zjlUrl,
      data:param,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {'content-type':   'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function(res){
        // success
        console.log('count = ',res)
        let params = {
          state:'1',
          type:'1',
          page:1,
          pageSize:res.data.result.projectCount,
          stateEnd:'1'
          }
        wx.request({
          url: countUrl,
          data:params,
          method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {'content-type':   'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
          success: function(res){
            // success
            console.log('最新长期111 = ',res.data.result.projectList)
            that.setData({
              jss:res.data.result.projectList
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
  }
})