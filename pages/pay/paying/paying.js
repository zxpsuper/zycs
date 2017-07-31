const host = require('../../../config').host
const info = require('../../../config').info
const pay = require('../../../config').pay
const setDonationUrl = require('../../../config').setDonationUrl
const donationDetailsUrl = require('../../../config').donationDetailsUrl
const prepayAndSign = require('../../../config').prepayAndSign
const csPay = require('../../../config').cspay
let app = getApp()
var open
var skey
const xmUrl = require('../../../config').axxm
Page({
  data: {
    id: '',
    data: [],
    imageName: 'http://ui.zc.gongyicishan.net/wx-ui/images/order-handing.png',
    payResult: '',
    payMoney: '',
    donationId: ''
  },
  discover:function(){
    wx.switchTab({
      url: '/pages/discover/discover',
    })
  },
  onLoad: function (options) {
    // 生命周期函数--监听页面加载
    this.setData({ id: options.id })
    console.log('id = ', this.data.id)
    this.projectInfo()
    this.setData({ payMoney: wx.getStorageSync('money') })
    this.setData({ payResult: '正在进行安全支付，请耐心等待' })
    this.setDonation()
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

  },
  onShareAppMessage: function () {
    // 用户点击右上角分享
    return {
      title: '众益慈善', // 分享标题
      desc: '众益慈善', // 分享描述
      path: 'pages/index/index' // 分享路径
    }
  },
  back: function () {
    wx.navigateBack({
      delta: 2, // 回退前 delta(默认为1) 页面
      success: function (res) {
        // success
      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
  },
  projectInfo() {
    let _this = this
    console.log(`${xmUrl}${_this.data.id}`)
    console.log('ss = ', this.data.id)
    wx.request({
      url: `${xmUrl}${_this.data.id}`,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: res => {
        // success
        console.log('zz = ', res)
        _this.setData({
          data: res.data.result
        })

      }
    })
  },
  setDonation() {
    let _this = this
    wx.request({
      url: `${setDonationUrl}/${this.data.id}`,
      data: {
        money: wx.getStorageSync('money'),
        type: '0',
        payType: '0',
        comment: wx.getStorageSync('ly'),
        projectname: _this.data.data.name
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: ({data}) => {
        console.log('1111 = ', data)
        if (data.result_code == 1) {
          _this.setData({ donationId: data.result._id })
          _this.donationDetails(_this.data.donationId)
        }
      }
    })
  },
  donationDetails: function () {
    let _this = this
    wx.request({
      url: `${donationDetailsUrl}/${this.data.donationId}`,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: ({data}) => {
        console.log('2222 = ', data)
        if (data.result_code == 1) {
          if (data.result.payType === '0') {
            let pid = data.result.projectId
            let orderNo = data.result.orderNo
            let money = data.result.money

            if (host === 'http://192.168.0.187:3006/api/wx') {
              console.log('host = ', host)
              _this.cspay(pid, orderNo, money)
            } else {
              _this.pay(pid, orderNo, money)
              console.log('host = ', host)
            }

          } else {
            wx.showToast({
              title: '支持金额至少为￥1'
            })
          }
        }
      }
    })
  },
  pay: function (pid, orderNo, money) {
    console.log('#1')
    if (this.data.payFlag) return
    this.setData({ payFlag: true })
    console.log('#2')
    let _this = this

    wx.request({
      url: prepayAndSign,
      data: { pid, orderNo, money },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: ({data}) => {
        console.log('pay = ', data)
        if (data.result_code != 1) {
          return
        }
        let timestamp = data.result.timeStamp
        let nonceStr = data.result.nonceStr
        let package_ = data.result.package
        let paySign = data.result.paySign
        setTimeout(function () {
          /*调用微信接口开始支付*/
          wx.requestPayment({
            timeStamp: timestamp,
            nonceStr: nonceStr,
            package: package_,
            signType: 'MD5',
            paySign: paySign,
            success: function (res) {
              // success
              console.log('支付', res)
              if (res.errMsg === 'requestPayment:ok') {
                _this.setData({
                  payResult: '支付成功',
                  imageName: 'http://ui.zc.gongyicishan.net/wx-ui/images/order-success.png'
                })
                // setTimeout(() => {
                // },1000)
              } else {
                _this.setData({
                  payResult: '支付失败',
                  imageName: 'http://ui.zc.gongyicishan.net/wx-ui/images/order-failed.png'
                })
              }
            },
            fail: function (res) {
              // fail
              console.log('失败 = ', res)
              _this.setData({
                payResult: '支付失败',
                imageName: 'http://ui.zc.gongyicishan.net/wx-ui/images/order-failed.png'
              })
            }
          })
        }, 500);
      }
    })

  },
  //测试版支付
  cspay: function (pid, orderNo, money) {
    console.log('pay')
    if (this.data.payFlag) return
    this.setData({ payFlag: true })
    console.log('#2')
    let _this = this
    wx.request({
      url: csPay,
      data: { pid, orderNo, money },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // success
        console.log('res = ', res)
        if (res.data.result_code === 1) {
          _this.setData({
            payResult: '支付成功',
            imageName: 'http://ui.zc.gongyicishan.net/wx-ui/images/order-success.png'
          })
        } else {
          _this.setData({
            payResult: '支付失败',
            imageName: 'http://ui.zc.gongyicishan.net/wx-ui/images/order-failed.png'
          })
        }
      },
      fail: function (res) {
        // fail
        _this.setData({
          payResult: '支付失败',
          imageName: 'http://ui.zc.gongyicishan.net/wx-ui/images/order-failed.png'
        })
      },
      complete: function (res) {
        // complete
      }
    })

  }
})