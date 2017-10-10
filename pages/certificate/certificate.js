// pages/certificate/certificate.js
const host = require('../../config').host
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hash: "0123456789qwertyuioplkjhgfdsazxcvbnmQWERTYUIOPLKJHGFDSAZXCVBNM,.'()! ",
    img: "",
    canvas: false,
    paths:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id
    })
    console.log(this.data.id)
    console.log('options', options)
    this.getDetail()

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getDetail() {
    let _this = this
    wx.request({
      url: `${host}/donation/${this.data.id}/cert`,
      // url: `${host}/donation/599a785bbda6140be9cd3b06/cert`,
      data: {},
      method: 'get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: res => {
        if (res.data.result_code == 1) {
          console.log('记录成功', res)
          this.setData({
            cert: res.data.result
          })
          console.log('rescert', res.data.result)
          console.log('rescert', this.data.cert)
          setTimeout(() => {
            wx.downloadFile({
              url: `${host}/donation/certBackgroundImg`, //仅为示例，并非真实的资源
              header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') },
              success: function (res) {
                console.log('-------->', res.tempFilePath)
                _this.drawPic(res.tempFilePath)
              }
            })
          }, 0)
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
  drawPic(src1) {
    var cert = this.data.cert.cert
    var hash = this.data.hash
    console.log('cert2222', cert)
    let that = this
    // 文字  
    var ctx = wx.createCanvasContext('my-canvas')
    // var src1 = '/pages/images/cert.jpg'
      // console.log('path2', that.data.paths)
      ctx.drawImage(src1, 0, 0, 300, 460)
      ctx.draw()
    
    setTimeout(() => {
      ctx.setFontSize(14)
      ctx.fillText(cert.no, 34, 56)
      ctx.fillText(cert.name, 34, 140)
      let str = '    ' + cert.content
      let count = 0
      let y = 170
      let s = ''
      let strAry = []// 每行文本组成的字符串数组['第一行文本', '第二行文本'.....]
      for (let x of str) {
        if (count > 16) {
          strAry.push(s)
          count = 0
          s = ''
        }
        s += x
        if (hash.indexOf(x) >= 0) {
          count += 0.5
        } else {
          count += 1
        }
      }
      strAry.push(s)
      console.log('strAry', strAry)
      strAry.forEach(s => {
        ctx.fillText(s, 34, y)
        y += 28
      })
      ctx.fillText('    ' + cert.thankTxt, 34, y), y += 34
      ctx.fillText(cert.org, 300 - this.shiftLeft(), y), y += 28
      let date = new Date()
      let time = date.getTime()
      console.log('nimei', time)
      let haha = app.formatDate1(time)
      ctx.fillText(haha, 300 - 140, y)
      ctx.draw(true)
    }, 1000)
    setTimeout(() => {
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 300,
        height: 462,
        destWidth: 300,
        destHeight: 462,
        canvasId: 'my-canvas',
        success: function (res) {
          console.log("xiaopeng", res.tempFilePath)
          that.setData({
            img: res.tempFilePath
          })
        },
        fail: function (res) {
          console.log("xiaopengfail", res)
        }
      })
    }, 1000)
  },
  shiftLeft() {
    return (this.data.cert.cert.org.length + 1) * 20
  },
  back() {
    wx.navigateBack()
  },
  download() {
    let img = this.data.img
    wx.showModal({
      title: '提示',
      content: '是否保存图片？',
      success: function (res) {
        if (res.confirm) {
          wx.saveImageToPhotosAlbum({
            filePath: img,
            success(res) {
              console.log('保存成功')
            }
          })
        }
      }
    })
  }
})