import drawBillActions from './drawBill'
import messageActions from './message'

// initial state
const state = {}

// getters
const getters = {}

// actions
const actions = {
  ...drawBillActions,
  ...messageActions,
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
