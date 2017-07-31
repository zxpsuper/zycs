let app = getApp()
const host = require('../../../config').host
const jkxq = require('../../../config').jkxq
let typea 
Page({
  data:{
    id:'',
    data:{}
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    this.setData({id:options.id})
    console.log('id',options.id)
    this.request()
  },
  onReady:function(){
    // 生命周期函数--监听页面初次渲染完成
    
  },
  onShow:function(){
    // 生命周期函数--监听页面显示
    
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
  request () { 
    let that = this
      wx.request({
        url: `${jkxq}${this.data.id}`,
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {'content-type':   'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
        success: function(res){
          // success
          console.log('res',res)
          res.data.result.ctime = app.formatDate(res.data.result.ctime)
          that.setData({
            data:res.data.result
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