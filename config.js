//配置页面配置路径
const host = 'https://i.zc.gongyicishan.net/api/wx'
const javahost = 'https://i.zc.gongyicishan.net/japi'
const loginUrl = `https://i.zc.gongyicishan.net/api/smallapp/auth/getToken`
const host2 = 'https://i.zc.gongyicishan.net/api'
// const host = 'http://192.168.0.187:3006/api/wx'
// const javahost = 'http://192.168.0.187:3006/japi'
// const loginUrl = `http://192.168.0.187:3006/api/smallapp/auth/getToken`
// const host2 = 'http://192.168.0.187:3006/api'
//测试支付
const cspay = `http://192.168.0.187:8080/japi/wxdonation/paytest`
const eid = 'zy'
//header
const headerXw = { 'content-type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }
const headerJson = { 'content-type': 'application/json', 'Authorization': 'Bearer ' + wx.getStorageSync('jwt') }
//爱心详情
const axxq = `${host}/project/`
//爱心项目
const axxm = `${host}/project/details/`
//最新长期
const zxcq = `${host}/project/lt-list`
//项目详情
const xmxq = `${host}/project/details/`
const image = `${host}/project/fileList`
//众筹记录
const zxjl = `${host}/donation/simple`
//众筹推荐
const zctj = `${host}/project/r-list`
//众筹总记录
const zjl = `${host}/project/count`
//列表
const list = `${host}/project/list`
//最新众筹
const zxzc = `${host}/project/list`
//长期筹款TOP3
const top3 = `${host}/project/top-list`
//长期众筹
const cqzc = `${host}/project/lt-list`
//最新推荐众筹
const zxjszc = `${host}/project/r-list`
//轮播图
const img = `${host}/banner/list`
//爱心记录（捐款记录）
const jkjl = `${host}/my/donations/`
//捐款详情
const jkxq = `${host}/donations/`
//支持、关注、见证、跟进
const details = `${host}/usercenter/projects/`
//发起的项目
const faqi = `${host}/my/helps/`
//发起详情
const fqxqImg = `${host}/help/fileList`
const fqxq = `${host}/help/`
//我的
const my = `${host}/usercenter/info`
//投诉建议
const advice = `${host}/advise`
//项目单据
const bill = `${host}/project/`
//上传图片
// const upImage = `http://192.168.0.112:3006/api/smallapp/oss`
//查询关注
const myPraise = `${host}/praise/myPraise`
//取消or关注
const focus = `${host}/praise/createOrCancle`
//支付1(用户)
const info = `${host}/project/details/`

//支付->预下单并签名
const prepayAndSign = `${javahost}/wxdonation/pay`

const setDonationUrl = `${host}/payrecord/add`

const donationDetailsUrl = `${host}/payrecord`

// 公众号信息
const gzhUrl = `${host}/gzh`
const config = {
  host,
  eid,
  loginUrl,
  headerJson,
  headerXw,
  axxq,
  axxm,
  zxcq,
  xmxq,
  image,
  zxjl,
  zctj,
  zxzc,
  cqzc,
  zxjszc,
  img,
  jkjl,
  jkxq,
  details,
  faqi,
  fqxq,
  fqxqImg,
  my,
  info,
  setDonationUrl,
  donationDetailsUrl,
  prepayAndSign,
  gzhUrl,
  top3,
  zjl,
  list,
  bill,
  // upImage,
  myPraise,
  focus,
  cspay,
  advice,
  host2
}
//输出config
module.exports = config
