import axios from 'axios'

export default {
  // 读取用户订单信息列表
  getUserOrder: payload =>
    axios.post('/wap.php?g=Wap&c=ScanOrder&a=placeOrderList', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    }),
  // 读取零售商品列表
  getRetailList: payload =>
    axios.post('/wap.php?g=Wap&c=ScanOrder&a=getGoodsListNew', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    }),
  // 读取服务商品列表
  getServiceList: payload =>
    axios.post('/wap.php?g=Wap&c=ScanOrder&a=getProjectListNew', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    }),
  // 读取套餐列表
  getPackageList: payload =>
    axios.post('/wap.php?g=Wap&c=ScanOrder&a=getPackageListNew', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    }),
  // 加入购物车
  addOrder: payload => {
    return axios.post('/wap.php?g=Wap&c=ScanOrder&a=placeOrder', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    })
  },
  // 结算订单
  settlementOrder: payload => {
    return axios.post('/wap.php?g=Wap&c=ScanOrder&a=payOrder', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    })
  },
  // 指定店员
  remStaff: payload => {
    return axios.post('/wap.php?g=Wap&c=ScanOrder&a=remStaff', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    })
  },
  // 修改商品数量
  modifyGood: payload => {
    return axios.post('/wap.php?g=Wap&c=ScanOrder&a=changeOrder', {
      ...payload,
      ticket: localStorage.getItem('ticket'),
    })
  },
}
