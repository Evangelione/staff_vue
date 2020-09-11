import axios from 'axios'

export default {
  // 读取零售商品列表
  getRetailList: payload =>
    axios.post('/appapi.php?c=Storestaff&a=getGoodslistNew', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 读取服务商品列表
  getServiceList: payload =>
    axios.post('/appapi.php?c=Storestaff&a=getProjectListNew', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 读取套餐列表
  getPackageList: payload =>
    axios.post('/appapi.php?c=Storestaff&a=getPackageListNew', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 获取挂单中列表
  getEntryOrderList: payload =>
    axios.post('/appapi.php?c=Storestaff&a=placeOrderList', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 获取结算中的订单
  getBillingOrder: payload =>
    axios.post('/appapi.php?c=Storestaff&a=getOrderDetail', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 获取空闲标识列表
  getFreeMarkList: payload =>
    axios.post('/appapi.php?c=Storestaff&a=getFreeStation', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 获取空闲服务人员列表
  getFreeStaffList: payload =>
    axios.post('/appapi.php?c=Storestaff&a=getFreeServiceWorker', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 挂单操作
  entryOrder: payload =>
    axios.post('/appapi.php?c=Storestaff&a=hangingUp', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 获取订单数量
  getOrderCount: payload =>
    axios.post('/appapi.php?c=Storestaff&a=getCount', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 拉取订单到结算中
  pullOrder: payload =>
    axios.post('/appapi.php?c=Storestaff&a=hangingDown', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 取消订单
  cancelOrder: payload =>
    axios.post('/appapi.php?c=Storestaff&a=delGuaOrder', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 添加商品
  commitOrder: payload =>
    axios.post('/appapi.php?c=Storestaff&a=submit', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 修改订单标识
  changeOrderMark: payload =>
    axios.post('/appapi.php?c=Storestaff&a=changeStation', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 指派服务人员
  appointStaff: payload =>
    axios.post('/appapi.php?c=Storestaff&a=assign', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 撤下服务人员
  unDoStaff: payload =>
    axios.post('/appapi.php?c=Storestaff&a=cancel_assign', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 追加服务人员
  addStaff: payload =>
    axios.post('/appapi.php?c=Storestaff&a=append_assign', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 替服务人员接单
  insteadOrders: payload =>
    axios.post('/appapi.php?c=Storestaff&a=staff_help_receive', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 替服务人员完成
  insteadFinish: payload =>
    axios.post('/appapi.php?c=Storestaff&a=staff_help_finish', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 服务返工
  rework: payload =>
    axios.post('/appapi.php?c=Storestaff&a=rework', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 验收合格
  acceptance: payload =>
    axios.post('/appapi.php?c=Storestaff&a=acceptance', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 已结算订单列表
  getSettledOrderList: payload =>
    axios.post('/appapi.php?c=Storestaff&a=settleOrderList', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 已取消订单列表
  getCancelOrderList: payload =>
    axios.post('/appapi.php?c=Storestaff&a=cancelOrderList', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 修改商品价格，数量，实付金额
  modifyGood: payload =>
    axios.post('/appapi.php?c=Storestaff&a=changeOrder', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
  // 结算订单
  payOrder: payload =>
    axios.post('/appapi.php?c=Storestaff&a=payOrder', {
      ...payload,
      'Device-Id': 'packapp',
      app_version: 85,
      ticket: localStorage.getItem('local_storestaff_ticket')
        ? localStorage.getItem('local_storestaff_ticket').replace('str||', '')
        : '',
    }),
}
