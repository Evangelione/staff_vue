import staffOrderAPI from '@/api/staffOrder'

// initial state
const state = {}

// getters
const getters = {}

// actions
const actions = {
  // 读取零售商品列表
  getRetailList(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.getRetailList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 读取服务商品列表
  getServiceList(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.getServiceList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 读取套餐列表
  getPackageList(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.getPackageList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取挂单中列表
  getEntryOrderList(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.getEntryOrderList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取结算中的订单
  getBillingOrder(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.getBillingOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取空闲标识列表
  getFreeMarkList(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.getFreeMarkList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取空闲服务人员列表
  getFreeStaffList(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.getFreeStaffList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 挂单操作
  entryOrder(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.entryOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取订单数量
  getOrderCount(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.getOrderCount(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 拉取订单到结算中
  pullOrder(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.pullOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 取消订单
  cancelOrder(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.cancelOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 添加商品
  commitOrder(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.commitOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 修改订单标识
  changeOrderMark(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.changeOrderMark(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 指派服务人员
  appointStaff(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.appointStaff(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 撤下服务人员
  unDoStaff(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.unDoStaff(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 追加服务人员
  addStaff(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.addStaff(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 替服务人员接单
  insteadOrders(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.insteadOrders(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 替服务人员完成
  insteadFinish(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.insteadFinish(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 服务返工
  rework(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.rework(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 验收合格
  acceptance(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.acceptance(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 已结算订单列表
  getSettledOrderList(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.getSettledOrderList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 已取消订单列表
  getCancelOrderList(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.getCancelOrderList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 修改商品价格，数量，实付金额
  modifyGood(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.modifyGood(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 结算订单
  payOrder(context, payload) {
    return new Promise((resolve, reject) => {
      staffOrderAPI.payOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
}

// mutations
const mutations = {
  save(state, data) {
    const keys = Object.keys(data)
    keys.forEach(item => {
      state[item] = data[item]
    })
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}
