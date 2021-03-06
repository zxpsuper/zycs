//details.js
let app = getApp()
const eid = require('../../../config').eid
const host = require('../../../config').host
const host2 = require('../../../config').host2
var R_htmlToWxml = require('../../../utils/htmlToWxml.js')
const xmxqUrl = require('../../../config').xmxq
const header = require('../../../config').headerJson
const headerxw = require('../../../config').headerXw
const gzhUrl = require('../../../config').gzhUrl
const myPraiseUrl = require('../../../config').myPraise
const focusUrl = require('../../../config').focus
Page({
  data: {
    id: '',
    project: {},
    imgs: [],
    content: '',
    zx: { content: '' },
    gzh: '',
    progress: '',
    dataa: [{}],
    ly: [],
    jz: [],
    djs: [],
    jztext: '',
    myPraise: '',
    hidden:true,
    adHidden:'hidden',
    selected:true,
    selected1:false,
    heigth:"",
    currentTab: 0,
    height1:"400rpx",
    readhidden:'',
    at:'小程序'
  },
  // 关闭广告
  closeAd:function(){
    this.setData({
      adHidden: 'hidden'
    })
  },
  // 复制网址
  copyAd:function(){
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
    // 设置剪贴板内部并复制
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
  showad:function(){
    this.setData({
      adHidden:''
    })
    let at=this.data.at
    let adId=this.data.adId
    wx.request({
      url: `${host2}/smallapp/advertising/${this.data.adId}/hit`,
      data:{at,adId},
      method: 'PUT', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: res => {
        if (res.data.result_code == 1) {
          console.log('记录成功')
          console.log('记录成功',res.data)
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
  // 查看详情
  readmore:function(){
    this.setData({
      readhidden: 'hidden',
      height1:'auto'
    })
  },
  // 关闭分享
  clearShare:function(){
    this.setData({
      hidden: true,
      height: ''
    })
  },
  share:function(){
    this.setData({
      hidden:false,
      height:'1200rpx'
    })
  },
  // 见证人切换
  navbarTap: function (e) {
    console.log('eee = ', e.currentTarget.dataset.haha)
    let index = e.currentTarget.dataset.haha
    this.setData({
      currentTab: e.currentTarget.dataset.haha
    })
  },
  // 后退按钮
  back:function(){
    wx.navigateBack()
  },
  // 支持他
  helpHim:function(){
    let _this = this
    wx.navigateTo({
      url: `/pages/project/helphim/helphim?id=${_this.data.id}`,
      success: function (res) {
        // success
      },
  })},
  // 查看爱心留言
  message:function(){
    var ha = this.data.project.imgPath
    var la = this.data.project.name
    wx.setStorageSync("titleImg", ha)
    wx.setStorageSync("titleName", la)
    wx.navigateTo({
      url: '/pages/axly/axly',
    })
  },
  selected: function (e) {
    this.setData({
      selected1: false,
      selected: true
    })
  },
  selected1: function (e) {
    this.setData({
      selected: false,
      selected1: true
    })
  },
  // 点击收藏
  active: function () {
    let params = {
      projectId: this.data.id,
      active: this.data.myPraise
    }
    let that = this
    wx.request({
      url: focusUrl,
      data: params,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // success
        console.log('active = ', res)
        that.myPraises()
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  // stockClick: function (e) {
  //   var secCode = e.currentTarget.dataset.seccode;
  //   var secName = e.currentTarget.dataset.secname;
  //   console.log("stockClick:" + secCode + ";secName:" + secName);
  // },
  // imageLoad: function (e) {
  //   var width = e.detail.width;
  //   var height = e.detail.height;
  //   var windowWidth = wx.getSystemInfoSync().windowWidth - 30;
  //   var picHeight = (height / width) * windowWidth;
  //   var index = e.currentTarget.dataset.index;
  //   this.data.content[index].attr.height = picHeight;
  //   this.setData({
  //     content: this.data.content
  //   });
  // },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({
      id: options.id
    })
    console.log('id = ', options.id)
    this.projectDetails()
    this.myPraises()
    this.advertising()
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
    wx.stopPullDownRefresh()
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
  // 广告详情
  advertising(){
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
          console.log('adres', this.adDetail)
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
  // 项目详情
  projectDetails() {
    let _this = this
    wx.request({
      url: `${xmxqUrl}${this.data.id}`,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: res => {
        console.log('res = ', res)
        app.authCheck(res, '/pages/project/happysixone/happy')
        if (res.data.result_code == 1) {
          res.data.result.ctime = app.formatDate(res.data.result.ctime)
          let today=new Date()
          let timerToday = today.getTime();
          let cha = (timerToday - res.data.result.stime) / 1000 / 3600 / 24
          res.data.result.stime=Math.floor(cha)
          let progress = res.data.result.progress
          let that = this
          console.log('111 = ', _this.data.project.progress)
          if (progress.proCount > 0) {
            progress.list = progress.list.map(a => {
              a.ctime = app.formatDate(a.ctime)
              return a
            })
          }
          _this.setData({
            project: res.data.result,
            content: R_htmlToWxml.html2json(res.data.result.content.replace(/&nbsp;/g, ' ').replace(/^<noscript>.*<noscript>$/, ' ').replace(/<br>/g, '\n')),
            progress: (((res.data.result.dmoney * 100 / res.data.result.tmoney).toFixed(0))),
            jz: res.data.result.progress.list[0],
            djs: res.data.result.bill.list[0]
          })
          console.log('content', this.data.content)          
          wx.setNavigationBarTitle({
            title: `${that.data.project.name}`,
            success: function (res) {
              // success
            }
          })
          if (res.data.result.vipcheck.list.length > 0) {
            console.log('成功', res.data.result.vipcheck.list[0].vipcheckText)
            _this.setData({
              jztext: res.data.result.vipcheck.list[0].vipcheckText
            })
          }
          _this.zcjl()
          // _this.loadGZH()
          console.log('aa=', res.data.result)
          let prog = res.data.result.progress
          console.log('单据  = ', _this.data.djs)
        } else {
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
  zcjl() {
    let _this = this
    let donation = _this.data.project.donation
    if (donation.doCount > 0) {
      donation.list = donation.list.map(a => {
        a.ctime = app.formatDate(a.ctime)
        return a
      })
    }
    let comment = _this.data.project.comment
    if (comment.coCount > 0) {
      comment.list = comment.list.map(a => {
        a.ctime = app.formatDate(a.ctime)
        return a
      })
    }
    _this.setData({
      dataa: donation,
      ly: comment
    })
  },
  onPullDownRefresh: function () {
    this.projectDetails()
    wx.showToast({
      title: 'loading...',
      icon: 'loading',
      mask: true
    })
    wx.stopPullDownRefresh()
  },
  // 致电
  telz: function () {
    wx.makePhoneCall({
      phoneNumber: '020-31123061',
      success: function (res) {
        // success
        console.log('resTel = ', res)
      }
    })
  },
  // 获取是否收藏
  myPraises() {
    let params = {
      projectId: this.data.id
    }
    let that = this
    wx.request({
      url: myPraiseUrl,
      data: params,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // success
        console.log('myPraise = ', res)
        if (res.data.result.result === null) {
          that.setData({
            myPraise: 'true'
          })
        } else {
          that.setData({
            myPraise: 'false'
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
  },
})