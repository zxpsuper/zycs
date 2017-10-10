//discover.js
//获取应用实例
const host2 = require('../../config').host2
var app = getApp()
Page({
  data: {
    userInfo: {},
    color: "#00aac5",
    text1: '获取',
    disabled: false,
    tip: "",
    img: [],
    serve: 1,
    checked: ''
  },
  // 打开服务条款
  serve: function () {
    console.log('serve')
    this.setData({
      serve: 0
    })
    console.log('serve', this.data.serve)
  },
  // 关闭服务条款
  close: function () {
    this.setData({
      serve: 1
    })
    this.reflesh()
  },
  // 关闭并同意服务条款
  aclose: function () {
    this.setData({
      serve: 1,
      checked: 'true',
      radio: 1
    })
    this.reflesh()
  },
  // 选择同意服务条款
  radio: function () {
    this.setData({
      radio: 1
    })
  },
  // 获取输入的验证码
  code: function (e) {
    var that = this
    that.setData({
      code: e.detail.value
    })
    console.log(this.data.code)
  },
  // 校验手机号码
  phoneNum: function (e) {
    let phone = e.detail.value
    if (phone.length == 11 && phone[0] == 1) {
      this.setData({
        tip: ''
      })
    }
    else {
      this.setData({
        tip: "输入正确的手机号码格式"
      })
    }
  },
  // 重新获取验证码
  reflesh: function () {
    app.genCaptcha()
  },
  // 表单上传
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    this.displayRaiseEndDay(30)
    let closingTime = this.data.closingTime
    let tmoney = e.detail.value.tmoney
    let name = e.detail.value.name
    let explainText = e.detail.value.explainText
    let linkName = e.detail.value.linkName
    let phone = e.detail.value.phone
    let houseNum = e.detail.value.houseNum
    let houseValue = e.detail.value.houseValue
    let houseState = e.detail.value.houseState
    let carNum = e.detail.value.carNum
    let carValue = e.detail.value.carValue
    let carState = e.detail.value.carState
    let seriousInsurance = e.detail.value.seriousInsurance ? 1 : 0
    let medicalInsurance = e.detail.value.medicalInsurance ? 1 : 0
    let img = this.data.img
    let captchaTxt = app.globalData.captchaTxt
    let captchaId = app.globalData.captchaId
    let publicMode = 1

    console.log(this.data.code.toUpperCase())
    if (this.data.code.toUpperCase() === captchaTxt) {
      if (this.data.radio == 1) {
        if (closingTime && tmoney && name && explainText && linkName && phone && houseNum && houseValue && houseState && carNum && carValue && carState && captchaTxt && captchaId && publicMode && img) {
          wx.request({
            url: `${host2}/wx/help/add`,
            data: { closingTime, tmoney, name, explainText, linkName, phone, houseNum, houseValue, houseState, carNum, carValue, carState, seriousInsurance, medicalInsurance, captchaId, captchaTxt, publicMode, img},
            method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
            header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
            success: function (res) {
              // success
              if (res.data.result_code === 1) {
                console.log('测试成功')
                wx.showToast({
                  title: '提交成功',
                })
              } else {
                wx.showModal({
                  title: `${res.data.message}`,
                  content: '请重新输入',
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
        } else {
          wx.showModal({
            title: '提示',
            content: '请填写表单完整信息',
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content: '请阅读并同意平台的《服务条款》',
        })
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '请输入正确的验证码',
      })
    }
  },
  // 预览图片
  showImg: function (e) {
    console.log('hahaha', 'hahah')
    var current = e.currentTarget.dataset.src;
    console.log('current', e.currentTarget.dataset.index)
    console.log(this.data.img)
    wx.previewImage({
      current: this.data.img[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.img // 需要预览的图片http链接列表
    })
  },
  // 上传图片start
  chooseImg() {
    let _this = this
    wx.chooseImage({
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        for (let filePath of res.tempFilePaths) {
          _this.upload(filePath)
        }
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  upload(filePath) {
    let _this = this
    wx.uploadFile({
      url: `${host2}/smallapp/upload`,
      filePath,
      name: 'upload',
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        console.log(res)
        // let data =res.data
        let data = JSON.parse(res.data)
        if (data.result_code == 1) {

          let img = _this.data.img
          let retImgUrl = data.result
          console.log('la', retImgUrl)
          img.length >= 9 ? img.splice(-1, 1, retImgUrl) : (img = [...img, retImgUrl])
          _this.setData({ img })
        }
        console.log('s', _this.data.img)
        console.log('uploadOneImg.....finished', res)
        // success
      },
      fail: function (res) {
        console.log('uploadOneImg.....fail', res)
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  popImg(e) {
    console.log('pop', e.currentTarget.dataset.idx)
    let index = e.currentTarget.dataset.idx
    let img = this.data.img
    img.splice(index, 1)
    this.setData({ img })
  },
  // 上传图片end


  onLoad: function () {
    app.genCaptcha()
    var str = app.globalData.captchaTxt
    app.drawPic(str)
    //调用应用实例的方法获取全局数据

  },
  onShow: function () {
  },
  // 计算30天后的日期
  displayRaiseEndDay(days) {
    let b = new Date();
    b.setDate(b.getDate() + parseInt(days));
    let year = b.getFullYear(), month = b.getMonth() + 1 < 10 ? "0" + (b.getMonth() + 1) : b.getMonth() + 1;
    let date = b.getDate() < 10 ? "0" + b.getDate() : b.getDate();
    let hours = b.getHours() < 10 ? "0" + b.getHours() : b.getHours();
    let minu = b.getMinutes() < 10 ? "0" + b.getMinutes() : b.getMinutes()
    let closingTime = year + "-" + month + "-" + date + " " + hours + ":" + minu
    this.setData({
      closingTime: closingTime
    })
  }
})
