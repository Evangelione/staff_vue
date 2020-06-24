import staffAPI from '@/api/staff/index'

export default {
  // 读取零售商品列表
  getRetailList(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.getRetailList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 读取服务商品列表
  getServiceList(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.getServiceList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 读取套餐列表
  getPackageList(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.getPackageList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取挂单中列表
  getEntryOrderList(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.getEntryOrderList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取结算中的订单
  getBillingOrder(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.getBillingOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取空闲标识列表
  getFreeMarkList(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.getFreeMarkList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取空闲服务人员列表
  getFreeStaffList(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.getFreeStaffList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 挂单操作
  entryOrder(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.entryOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取订单数量
  getOrderCount(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.getOrderCount(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 拉取订单到结算中
  pullOrder(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.pullOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 取消订单
  cancelOrder(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.cancelOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 添加商品
  commitOrder(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.commitOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 修改订单标识
  changeOrderMark(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.changeOrderMark(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 指派服务人员
  appointStaff(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.appointStaff(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 撤下服务人员
  unDoStaff(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.unDoStaff(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 追加服务人员
  addStaff(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.addStaff(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 替服务人员接单
  insteadOrders(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.insteadOrders(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 替服务人员完成
  insteadFinish(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.insteadFinish(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 服务返工
  rework(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.rework(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 验收合格
  acceptance(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.acceptance(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 已结算订单列表
  getSettledOrderList(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.getSettledOrderList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 已取消订单列表
  getCancelOrderList(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.getCancelOrderList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 修改商品价格，数量，实付金额
  modifyGood(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.modifyGood(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 结算订单
  payOrder(context, payload) {
    return new Promise((resolve, reject) => {
      staffAPI.payOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
}
