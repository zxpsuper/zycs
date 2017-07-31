//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    imgUrls: [
      {
        link: '/pages/index/index',
        url: 'http://zcsaas-pub.img-cn-hangzhou.aliyuncs.com/test/zy/1494389598158y1zq.jpg@640w_1l_1e_80q'
      }, {
        link: '/pages/logs/logs',
        url: 'http://zcsaas-pub.img-cn-hangzhou.aliyuncs.com/test/zy/1494389580370lvrm.jpg@640w_1l_1e_80q'
      }
    ],
    recommend: [
      {
        src: "http://zcsaas-pub.img-cn-hangzhou.aliyuncs.com/test/zy/1494389450902312x.jpg@300w_1l_1e_80q",
        text: "快乐六一   与爱同行",
        percent: "1.49%",
        money: 84,
        times: 5
      },
    ],
    collection: [
      {
        src: "http://zcsaas-pub.img-cn-hangzhou.aliyuncs.com/test/zy/1494389174827kpbu.jpg@300w_1l_1e_80q",
        text: "关爱山区，关爱留守儿童",
        money: 3,
        times: 3
      },
      {
        src: "http://zcsaas-pub.img-cn-hangzhou.aliyuncs.com/test/zy/1494388456436swft.jpg@300w_1l_1e_80q",
        text: "爱心书包",
        money: 20,
        times: 1
      }
    ],
    btngroup: [
      {
        src: '../images/众筹.png',
        text: '公益众筹'
      },
      {
        src: '../images/公益.png',
        text: '长期募捐'
      },
      {
        src: '../images/星星.png',
        text: '我关注的'
      },
      {
        src: '../images/支持.png',
        text: '我支持的'
      }
    ],
    indicatorColor: "#f0ffff",
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
  }
})
