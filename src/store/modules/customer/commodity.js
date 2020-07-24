import commonAPI from '@/api/common'
import commodityAPI from '@/api/customer/commodity'

// initial state
const state = {}

// getters
const getters = {}

// actions
const actions = {
  // 读取用户订单信息列表
  getUserOrder(context, payload) {
    return new Promise((resolve, reject) => {
      commodityAPI.getUserOrder(payload).then(async data => {
        for (let i = 0; i < data.length; i++) {
          let item = data[i]
          if (item.type == '1' && item.need_service_personnel == '1' && item.remark_service_personnel != '0') {
            let res = await commonAPI.getStaff({ store_id: item.store_id, id: item.goods_appoint_id })
            let staff = res.find(staff => {
              if (staff.id == item.remark_service_personnel) {
                return staff
              }
            })
            if (staff) {
              data[i].remark_service_personnel_price = staff.service_fee
              data[i].remark_service_personnel_name = staff.name
              data[i].remark_service_personnel_level = staff.technician_grade_name
            }
          } else if (item.type == '4') {
            for (let j = 0; j < item.detail.length; j++) {
              let item2 = item.detail[j]
              if (item2.type == '1' && item2.need_service_personnel == '1' && item2.remark_service_personnel != '0') {
                let res = await commonAPI.getStaff({ store_id: item2.store_id, id: item2.goods_appoint_id })
                let staff = res.find(staff => {
                  if (staff.id == item2.remark_service_personnel) {
                    return staff
                  }
                })
                if (staff) {
                  data[i].detail[j].remark_service_personnel_price = staff.service_fee
                  data[i].detail[j].remark_service_personnel_name = staff.name
                  data[i].detail[j].remark_service_personnel_level = staff.technician_grade_name
                }
              }
            }
          }
        }
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
  // 结算订单
  settlementOrder(context, payload) {
    return new Promise((resolve, reject) => {
      commodityAPI.settlementOrder(payload).then(data => {
        data ? resolve(data) : reject()
      })
    })
  },
  // 获取标识信息
  getStationInfo(context, payload) {
    return new Promise((resolve, reject) => {
      commodityAPI.getStationInfo(payload).then(data => {
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
