import commodityAPI from '@/api/commodity'

// initial state
const state = {}

// getters
const getters = {}

// actions
const actions = {
  // 读取用户订单信息列表
  getUserOrder(context, payload) {
    return new Promise((resolve, reject) => {
      commodityAPI.getUserOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 读取零售商品列表
  getRetailList(context, payload) {
    return new Promise((resolve, reject) => {
      commodityAPI.getRetailList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 读取服务商品列表
  getServiceList(context, payload) {
    return new Promise((resolve, reject) => {
      commodityAPI.getServiceList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 读取套餐列表
  getPackageList(context, payload) {
    return new Promise((resolve, reject) => {
      commodityAPI.getPackageList(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 加入购物车
  addOrder(context, payload) {
    return new Promise((resolve, reject) => {
      commodityAPI.addOrder(payload).then(data => {
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
