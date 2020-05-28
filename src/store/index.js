import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import commodity from './commodity'
import staffOrder from './staffOrder'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {
    ...actions,
  },
  modules: {
    commodity,
    staffOrder,
  },
})
