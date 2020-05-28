import commonAPI from '@/api/common'

export default {
  // 获取logo
  getLogo() {
    return new Promise((resolve, reject) => {
      commonAPI.getLogo().then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 是否登录
  isLogin() {
    return new Promise((resolve, reject) => {
      commonAPI.isLogin().then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 登录
  login(context, payload) {
    return new Promise((resolve, reject) => {
      commonAPI.login(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取闲置标识
  getFlag(context, payload) {
    return new Promise((resolve, reject) => {
      commonAPI.getFlag(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取闲置店员
  getStaff(context, payload) {
    return new Promise((resolve, reject) => {
      commonAPI.getStaff(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 提交订单
  commitOrder(context, payload) {
    return new Promise((resolve, reject) => {
      commonAPI.commitOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 读取推荐商品
  getRecommendList(context, payload) {
    return new Promise((resolve, reject) => {
      commonAPI.getRecommendList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 加入推荐商品
  addToCart(context, payload) {
    return new Promise((resolve, reject) => {
      commonAPI.addToCart(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 根据订单id获取标识
  bindFlag(context, payload) {
    return new Promise((resolve, reject) => {
      commonAPI.bindFlag(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
}
