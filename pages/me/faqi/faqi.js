let app = getApp()
const host = require('../../../config').host
const url = require('../../../config').faqi
Page({
  data: {
    id: '',
    data: [
      // {
      //   state:'1',
      //   ctime:'2015-12-15 12:30',
      //   name:'123465798',
      //   imgPath:"/pages/image/tx.png",
      //   id:"c9882541bcb34e049e84feb7374a9cde"
      // },{
      //   state:'2',
      //   ctime:'2015-12-15 12:30',
      //   name:'123465798',
      //   imgPath:"/pages/image/tx.png",
      //   id:"c9882541bcb34e049e84feb7374a9cde"
      // },{
      //   state:'3',
      //   ctime:'2015-12-15 12:30',
      //   name:'123465798',
      //   imgPath:"/pages/image/tx.png",
      //   id:"c9882541bcb34e049e84feb7374a9cde"
      // },{
      //   state:'4',
      //   ctime:'2015-12-15 12:30',
      //   name:'123465798',
      //   imgPath:"/pages/image/tx.png",
      //   id:"c9882541bcb34e049e84feb7374a9cde"
      // }
    ],
    count: '',
    navbar: ['全部', '未审核', '已审核'],  
    currentTab: 0 ,
    notData:[],
    hasData:[]
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      id: options.id
    })
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示
    this.request()
    this.notaudit()
    this.hasaudit()
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
      pagesize: 10000,
      page: 1,
      state:'all'
    }
    wx.request({
      url: url,
      data: params ,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {'content-type':   'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
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
//   request2(){
//     wx.request({
//       url: `${host}/help/add`,
//       data: {
//         tmoney:500,
// closingTime:'1492221600000',
// name:'项目名',
// explainText:'啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊',
// linkName:'阿斯蒂芬',
// phone:'13123456789'
//       },
//       method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
//       header: header, // 设置请求的 header
//       success: function(res){
//         // success
//         console.log('fq = ',res)
//       },
//       fail: function(res) {
//         // fail
//       },
//       complete: function(res) {
//         // complete
//       }
//     })
//   },
  onPullDownRefresh: function () {
    this.request()
    this.notaudit()
    this.hasaudit()
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      mask: true
    })
    wx.stopPullDownRefresh()
  },  
  navbarTap: function(e){  
    console.log('eee = ',e.currentTarget.dataset.idx)
    let index = e.currentTarget.dataset.idx
    if(index == 0){
      console.log(1111111111)
      this.request()
    }else{
      if(index == 1){
        console.log(222222222)
        this.notaudit()
      }else{
        console.log(333333333)
        this.hasaudit()
      }
    }
    this.setData({  
      currentTab: e.currentTarget.dataset.idx  
    })  
  },
  notaudit(){
    let that = this
    let params = {
      pagesize: 10000,
      page: 1,
      state:'not_audit'
    }
    wx.request({
      url: url,
      data: params ,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {'content-type':   'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // success
        console.log('res', res)
        let donation = res.data.result

        donation.list = donation.list.map(a => {
        a.ctime = app.formatDate(a.ctime)
        return a
      })
        that.setData({
          notData: res.data.result.list
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
  hasaudit(){
    let that = this
    let params = {
      pagesize: 10000,
      page: 1,
      state:'has_audit'
    }
    wx.request({
      url: url,
      data: params,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {'content-type':   'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // success
        console.log('res', res)
        let donation = res.data.result

        donation.list = donation.list.map(a => {
        a.ctime = app.formatDate(a.ctime)
        return a
      })
        that.setData({
          hasData: res.data.result.list
        })
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