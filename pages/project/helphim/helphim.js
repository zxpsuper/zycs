//pay.js
const info = require('../../../config').info
let app = getApp()
var open
var skey
// var jine
Page({
  data: {
    id: '',
    donationId: '',
    jine: '',
    project: {},
    donationMaxMoney: 9999,
    isreadOnly: false,
    payFlag: false,
    textValue: ''
  },
  money: function (e) {
    this.setData({ jine: Number(e.detail.value) })
  },
  setDonation: function () {
    this.projectInfo()
    console.log('money = ', this.data.jine)
    let _this = this
    let ccMoney = _this.data.project.dmoney + _this.data.jine
    if (_this.data.project.type === '1') {
      if (_this.data.jine < 1) {
        wx.showToast({
          title: '每次捐款最低1元'
        })
      } else if (_this.data.project.tmoney <= _this.data.project.dmoney) {
        wx.showToast({
          title: '筹款金额已满，请关注其他项目'
        })
      } else if (_this.data.project.tmoney < ccMoney) {
        wx.showToast({
          title: `距离目标金额还剩${_this.data.project.tmoney - _this.data.project.dmoney}元`
        })
      } else {
        wx.setStorageSync('money', this.data.jine)
        wx.setStorageSync('ly', this.data.textValue)
        wx.navigateTo({
          url: `/pages/pay/paying/paying?id=${_this.data.id}`,
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
      }
    }
    else {
      if (_this.data.jine < 1) {
        wx.showToast({
          title: '每次捐款最低1元'
        })
      } else {
        wx.setStorageSync('money', this.data.jine)
        wx.setStorageSync('ly', this.data.textValue)
        wx.navigateTo({
          url: `/pages/pay/paying/paying?id=${_this.data.id}`,
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
      }

    }

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
  projectInfo() {
    let _this = this
    wx.request({
      url: `${info}${this.data.id}`,
      data: {},
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: res => {
        // success
        console.log('zz= ', res.data.result)
        if (res.data.result_code == 1) {
          _this.setData({ project: res.data.result })
          console.log()
          switch (_this.data.project.type) {
            case '1':
              if (_this.data.project.donationMaxMoney < _this.data.donationMaxMoney) {
                _this.setData({ donationMaxMoney: _this.data.project.donationMaxMoney })
              }
              break
            case '2':
              if (_this.data.project.tmoney) {
                _this.setData({ jine: parseInt(_this.data.project.tmoney), isreadOnly: true })
              }
              break
          }
        }
      }
    })
  },
  text: function (e) {
    let that = this
    that.setData({ textValue: e.detail.value })
  },
  back: function () {
    wx.navigateBack({
      delta: 1, // 回退前 delta(默认为1) 页面
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
  }
})