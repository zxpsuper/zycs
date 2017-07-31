//app.js
var code
const host = require('./config').host
const host2 = require('./config').host2
const eid = require('./config').eid
const loginUrl = require('./config').loginUrl
App({
  onLaunch: function () {
    this.getJwt()
    this.login()
    this.getOrgParam()
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  // ad:function(){
  // },
  globalData: {
    userInfo: null,
    orgParam: '',
    captchaId:'',
    captchaTxt:''
  },
  login(redirectUrl) {
    let _this = this
    wx.login({
      success: function (res) {
        // success
        if (res.code) {
          let code = res.code
          wx.getUserInfo({
            success: function (res) {
              // success
              wx.request({
                url: loginUrl,
                data: {
                  code,
                  eid,
                  rawData: res.rawData,
                  signature: res.signature
                },
                method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
                header: { 'content-type': 'application/x-www-form-urlencoded' }, // 设置请求的 header
                success: function (res) {
                  // success
                  console.log('token = ', res)
                  if (res.data.result_code == 1 && res.data.result.jwt) {
                    wx.setStorageSync('jwt', res.data.result.jwt)
                    if (redirectUrl) wx.switchTab({
                      url: '/pages/index/index'
                    })
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
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })
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
  alert(title = '') {
    wx.showToast({
      title
    })
  },
  // 每次请求后端之后检查是否没权限，如果没有权限则重新登录
  authCheck(res, redirectUrl) {
    console.log('authCheck = ', redirectUrl)
    if (res.data.errcode === 401) {
      console.log('重新授权')
      this.login(redirectUrl)
      return false
    }
    return true
  },

  // 获取全局机构参数
  getOrgParam() {
    let _this = this
    wx.request({
      url: `${host}/org/param`,
      data: {
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: function (res) {
        // success
        console.log('机构参数', res.data)
        if (res.data.result_code == 1) {
          _this.globalData.orgParam = res.data.result
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
  _formatDate(date, fmt) {
    var o = {
      'M+': date.getMonth() + 1, // 月份
      'd+': date.getDate(), // 日
      'h+': date.getHours(), // 小时
      'm+': date.getMinutes(), // 分
      's+': date.getSeconds(), // 秒
      'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
    for (var k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
    return fmt
  },
  formatDate(date, format) {
    return date && new Date(date).getTime() === new Date(date).getTime() && this._formatDate(new Date(date), format || 'yyyy-MM-dd hh:mm')
  },
  /*验证码*/
  guid() {
    function S4() {
      // return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);   
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },
  // 获取验证码
  genCaptcha() {
    let captchaId = wx.getStorageSync('captchaId')
    if (!captchaId) {captchaId = this.guid()}
    wx.setStorageSync('captchaId', captchaId)
    console.log('cid',captchaId)
    wx.request({
      url: `${host2}/m/captcha`,
      data: {captchaId},
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }, // 设置请求的 header
      success: res => {
        // success
        console.log('set验证码 ', res)
        if (res.data.result_code == 1) {
          this.globalData.captchaId = captchaId
          this.globalData.captchaTxt = res.data.result
          var str = this.globalData.captchaTxt
          this.drawPic(str)
          console.log('最新str', str)
        }
      }
    })
  },
  // 生成一个随机数
  randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  },
  // 随机颜色
  randomColor(min, max) {
    var r = this.randomNum(min, max);
    var g = this.randomNum(min, max);
    var b = this.randomNum(min, max);
    return "rgb(" + r + "," + g + "," + b + ")";
  },
  /**绘制验证码图片**/
  drawPic(str) {
    var width = 130
    var height = 50
    var ctx = wx.createCanvasContext('my-canvas')
    // 绘制背景色
    let color = this.randomColor(180, 240)
    ctx.setFillStyle(color)
    ctx.rect(0, 0, width, height)
    ctx.fill()
    console.log('str', str)
    // 绘制英文
    for (var i = 0; i < 4; i++) {
      var txt = str[i];
      var fillStyle = this.randomColor(50, 160) //随机生成字体颜色
      var font = this.randomNum(30, 40) //随机生成字体大小
      var x = 10 + i * 26;
      var y = this.randomNum(35, 40)
      var deg = this.randomNum(-25, 25)
      ctx.setFillStyle(fillStyle)
      ctx.setFontSize(font)
      //修改坐标原点和旋转角度
      ctx.translate(x, y);
      ctx.rotate(deg * Math.PI / 180);
      ctx.fillText(txt, 0, 0);
      //恢复坐标原点和旋转角度
      ctx.rotate(-deg * Math.PI / 180);
      ctx.translate(-x, -y);
    }
    // 绘制干扰线
    for (var i = 0; i < 3; i++) {
      var strokeStyle = this.randomColor(40, 180)
      ctx.setFillStyle(strokeStyle)
      ctx.beginPath();
      let x = this.randomNum(0, width)
      let y = this.randomNum(0, height)
      ctx.moveTo(x, y);
      ctx.lineTo(this.randomNum(x - 30, x + 30), this.randomNum(y - 30, y + 30));
      ctx.stroke();
    }
    // 绘制干扰点
    for (var i = 0; i < 20; i++) {
      var Style = this.randomColor(0, 255);
      ctx.setFillStyle(Style)
      ctx.beginPath();
      ctx.arc(this.randomNum(0, width), this.randomNum(0, height), 1, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.draw()
  },
  // 预防万一
  getJwt() {
    let jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNTk1YTE5YzAzMjViZmEwZWVhYzU4ZTdjIiwib3BlbmlkIjoibzFobUh4QlRIdHlGWUkwX0FRell0QVYzRHRBWSIsImVpZCI6Inp5IiwibmFtZSI6IlNJbU1vbl9GbzRyIiwiaGVhZGltZ3VybCI6Imh0dHA6Ly93eC5xbG9nby5jbi9tbW9wZW4vZWdwZURxRDZtR2hDNGhIRlc5MkI0SkdqaWFPYVZ4eUQ5b3NzcEd6ZklHSzF5emdtdVc2UXQ4N1hxQ0tpYWZVRjF5UWN2ZnZ1aWNFc01Kc1RpYkJKdVFoRFhlWnNCMlJUZERVUS8wIiwiYWRkcmVzcyI6IuS4reWbveW5v-S4nOecgeW5v-W3nuW4giIsImxvZ2luVHlwZSI6IjAiLCJpYXQiOjE1MDA2MTQyNjAsImV4cCI6MTUwMTkxMDI2MH0.aqDoVAJEMIowEyv60AuXf6zvqPRVH6ew4q7uQSufMXM'
    wx.setStorageSync('jwt', jwt)
    wx.redirectTo({
      url: '/pages/index/index'
    })
  }
})