import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import commodity from './modules/customer/commodity'
import staff from './modules/staff/index'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    ...actions,
  },
  modules: {
    commodity,
    staff,
  },
})
