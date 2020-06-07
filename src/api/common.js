import axios from 'axios'

export default {
  // 获取logo
  getLogo: () => axios.get('/xcxapi.php?c=Config&a=get_bgimage&type=login_bgimg_wx_staff'),
  // 是否登录
  isLogin: () => axios.post('/wap.php?g=Wap&c=Login&a=check_login'),
  // 登录
  login: payload =>
    axios.post('/wap.php?g=Wap&c=Login&a=login_scan', {
      ...payload,
    }),
  // 获取短信验证码
  getSms: payload =>
    axios.post('/wap.php?g=Wap&c=Login&a=SmsCodeverify', {
      ...payload,
      source: 'scan',
    }),
  // 注册
  registerAcc: payload =>
    axios.post('/wap.php?g=Wap&c=Login&a=verifyReg ', {
      ...payload,
    }),
  // 获取闲置标识
  getFlag: payload =>
    axios.post('/wap.php?g=wap&c=ScanOrder&a=getFreeStation', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    }),
  // 获取闲置店员
  getStaff: payload =>
    axios.post('/wap.php?g=wap&c=ScanOrder&a=getFreeServiceWorker', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    }),
  // 提交订单
  commitOrder: payload =>
    axios.post('/wap.php?g=wap&c=ScanOrder&a=order', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    }),
  // 读取推荐商品
  getRecommendList: payload =>
    axios.post('/wap.php?g=Wap&c=ScanOrder&a=orderRecommend', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    }),
  // 加入推荐商品
  addToCart: payload =>
    axios.post('/wap.php?g=Wap&c=ScanOrder&a=placeOrderAdd', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    }),
  // 根据订单id获取标识
  bindFlag: payload =>
    axios.post('/wap.php?g=Wap&c=ScanOrder&a=scanImaxOrder', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    }),
}