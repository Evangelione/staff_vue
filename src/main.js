import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/common/vant'
import '@/common/element-ui'
import '@/common/axios'
import '@/common/global'
import moment from 'moment'
import axios from 'axios'

Vue.config.productionTip = false

Vue.prototype.$moment = moment
Vue.prototype.$axios = axios
Vue.prototype.$goBack = () => {
  router.go(-1)
}

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
