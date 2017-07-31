// pages/jubao/jubao.js
const host = require('../../config').host
const host2 = require('../../config').host2
let app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    bg: "#333",
    color: "#fff",
    name: "",
    phone: "",
    idcard: "",
    reason: "",
    tip:'',
    img:[]
  },
  // 预览图片
  showImg : function(e){
    var current = e.currentTarget.dataset.src;
    console.log('current', e.currentTarget.dataset.index)
    wx.previewImage({
      current: this.data.img[e.currentTarget.dataset.index], // 当前显示图片的http链接
      urls: this.data.img // 需要预览的图片http链接列表
    })
  },
  // 上传图片start
  chooseImg() {
    let _this = this
    wx.showLoading({
      title: 'loading...'
    })
    wx.chooseImage({ 
      count: 9, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        for(let filePath of res.tempFilePaths) {
          _this.upload(filePath)
        }
        wx.hideLoading()
      },
      fail: function () {
        // fail
        wx.hideLoading()
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
        console.log('s',_this.data.img)
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

  // 重新获取验证码
  reflesh: function () {
    app.genCaptcha()
  },
  // 获取姓名
  realName: function (e) {
    let that = this
    that.setData({
      name: e.detail.value,
      tipname: ''
    })
    console.log(that.data.name)
  },
  // 获取联系方式
  contactInfo: function (e) {
    let that = this
    that.setData({
      phone: e.detail.value,
      tipinfo: ''
    })
    console.log(that.data.phone)
  },
  // 获取身份证号码
  idCardNo: function (e) {
    let that = this
    that.setData({
      idcard: e.detail.value,
      tipid: ''
    })
  },
  // 获取举报信息
  reportText: function (e) {
    let that = this
    that.setData({
      reason: e.detail.value,
      tiptext: ''
    })
    console.log(that.data.reason)
  },
  // 获取填入验证码信息
  captchaTxt: function (e) {
    let that = this
    that.setData({
      captchaTxt2: e.detail.value
    })
    console.log(that.data.captchaTxt2)
  },
  // 提交举报
  report: function () {
    let that = this
    let realName = that.data.name
    let contactInfo = that.data.phone
    let idCardNo = that.data.idcard
    let reportText = that.data.reason
    let projectId = that.data.id
    let projectName = that.data.projectName
    let captchaTxt = app.globalData.captchaTxt
    let captchaId = app.globalData.captchaId
    let img= this.data.img
    let params = {
      realName, contactInfo, idCardNo, reportText, projectId, projectName, captchaTxt, captchaId,img
    }
    console.log('sdf', params)
    if (this.data.captchaTxt2.toUpperCase() === captchaTxt) {
      if (realName && contactInfo && idCardNo && reportText) {
        wx.request({
          url: `${host}/project/${this.data.id}/report`,
          data: params,
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
          success: res => {
            if (res.data.result_code == 1){
            wx.showModal({
              title: '提示',
              content: '亲，您的举报消息已经提交，非常感谢！',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 1
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            }else{
              wx.showModal({
                title: '提示',
                content: '服务器错误！',
                success: function (res) {
                  if (res.confirm) {
                    wx.navigateBack({
                      delta: 1
                    })
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
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
        if (!realName){
          this.setData({
            tipname: '必填字段',
          })
        }
        if (!contactInfo) {
          this.setData({
            tipinfo: '必填字段',
          })
        }
        if (!idCardNo) {
          this.setData({
            tipid: '必填字段',
          })
        }
        if (!reportText) {
          this.setData({
            tiptext: '必填字段',
          })
        }
        
        wx.showModal({
          title: '提示',
          content: '请填写必填字段',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
    else {
      if (!realName) {
        this.setData({
          tipname: '必填字段',
        })
      }
      if (!contactInfo) {
        this.setData({
          tipinfo: '必填字段',
        })
      }
      if (!idCardNo) {
        this.setData({
          tipid: '必填字段',
        })
      }
      if (!reportText) {
        this.setData({
          tiptext: '必填字段',
        })
      }
      app.genCaptcha()
      wx.showModal({
        title: '提示',
        content: '验证码错误，请重新输入',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.genCaptcha()
    var str = app.globalData.captchaTxt
    app.drawPic(str)
    this.setData({
      id: options.id,
      projectName: options.name
    })
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

  }
})